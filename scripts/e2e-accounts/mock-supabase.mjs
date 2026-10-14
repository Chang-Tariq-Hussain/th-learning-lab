// Minimal fake of the Supabase Auth + PostgREST endpoints the admin app calls. Test-only.
import http from "node:http";
const users = {
  "super@x.com":   { id: "00000000-0000-0000-0000-0000000000a1", pw: "pw1", role: "super_admin" },
  "analyst@x.com": { id: "00000000-0000-0000-0000-0000000000a2", pw: "pw2", role: "analyst" },
  "learner@x.com": { id: "00000000-0000-0000-0000-0000000000a3", pw: "pw3", role: null },
};
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const mint = (u, email) => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: u.id, email, role: "authenticated", aud: "authenticated", exp: Math.floor(Date.now()/1000)+3600 })}.sig`;
const byToken = (t) => { try { const p = JSON.parse(Buffer.from(t.split(".")[1], "base64url").toString()); return Object.entries(users).find(([, u]) => u.id === p.sub); } catch { return undefined; } };
const log = [];
const audit = [{ id: 2, at: new Date().toISOString(), actor_email: "super@x.com", actor_role: "super_admin", action: "admin.login", entity: "session", entity_id: "x", before: null, after: null, meta: null }];
http.createServer((req, res) => {
  let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
    const url = new URL(req.url, "http://x"); const auth = (req.headers.authorization || "").replace("Bearer ", "");
    log.push(`${req.method} ${url.pathname}${url.search}`);
    const send = (code, obj, headers = {}) => { res.writeHead(code, { "content-type": "application/json", ...headers }); res.end(obj === undefined ? "" : JSON.stringify(obj)); };
    if (url.pathname === "/_log") return send(200, log);
    if (url.pathname === "/auth/v1/token") {
      const { email, password } = JSON.parse(body || "{}"); const u = users[email];
      if (!u || u.pw !== password) return send(400, { code: 400, error_code: "invalid_credentials", msg: "Invalid login credentials" });
      const user = { id: u.id, aud: "authenticated", role: "authenticated", email, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
      return send(200, { access_token: mint(u, email), token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now()/1000)+3600, refresh_token: "r-" + u.id, user });
    }
    if (url.pathname === "/auth/v1/user") {
      const hit = byToken(auth); if (!hit) return send(401, { code: 401, msg: "invalid JWT" });
      return send(200, { id: hit[1].id, aud: "authenticated", role: "authenticated", email: hit[0], app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() });
    }
    if (url.pathname === "/auth/v1/logout") return send(204);
    const hit = byToken(auth);
    if (url.pathname === "/rest/v1/admin_roles" && req.method === "GET") {
      if (!hit) return send(401, { message: "JWT" });
      const sel = url.searchParams.get("select") || "";
      if (url.searchParams.get("user_id")) { // own-role lookup (maybeSingle)
        return hit[1].role ? send(200, { role: hit[1].role, email: hit[0] }) : send(406, { code: "PGRST116", details: "The result contains 0 rows", message: "JSON object requested, multiple (or no) rows returned" });
      }
      if (hit[1].role !== "super_admin") return send(200, []);
      return send(200, Object.entries(users).filter(([, u]) => u.role).map(([e, u]) => ({ user_id: u.id, email: e, role: u.role, granted_at: new Date().toISOString() })));
    }
    if (url.pathname === "/rest/v1/audit_log") { if (!hit || hit[1].role !== "super_admin") return send(200, [], { "content-range": "*/0" }); return send(200, audit, { "content-range": "0-0/1" }); }
    if (url.pathname.startsWith("/rest/v1/rpc/")) { const fn = url.pathname.split("/").pop(); log.push(`RPC ${fn} ${body}`);
      if (fn === "admin_set_role_by_email" && JSON.parse(body).p_email === "nobody@x.com") return send(400, { code: "P0002", message: "no account with that email" });
      return send(fn === "write_audit" ? 200 : 204, fn === "write_audit" ? 1 : undefined); }
    send(404, { message: "not mocked: " + url.pathname });
  });
}).listen(54321, () => console.log("mock supabase on 54321"));
