// Test-only stand-in for Supabase: a FAKE Auth server (password sign-in, user lookup, sign-out) that mints real
// HS256 JWTs, plus a transparent proxy of /rest/v1/* to a REAL PostgREST running against a real Postgres.
// So row-level security, RPCs and query syntax are exercised for real; only sign-in itself is simulated.
import http from "node:http";
import crypto from "node:crypto";

const SECRET = process.env.JWT_SECRET ?? "super-secret-jwt-token-with-at-least-32-characters-long";
const POSTGREST = new URL(process.env.POSTGREST_URL ?? "http://127.0.0.1:3000");
const users = {
  "super@x.com": { id: "00000000-0000-0000-0000-0000000000a1", pw: "pw1" },
  "analyst@x.com": { id: "00000000-0000-0000-0000-0000000000a2", pw: "pw2" },
  "learner@x.com": { id: "00000000-0000-0000-0000-0000000000a3", pw: "pw3" },
  "qm@x.com": { id: "00000000-0000-0000-0000-0000000000a4", pw: "pw4" },
  "cm@x.com": { id: "00000000-0000-0000-0000-0000000000a5", pw: "pw5" },
};
const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
const sign = (data) => crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
const mint = (id, email) => { const h = b64({ alg: "HS256", typ: "JWT" }); const p = b64({ sub: id, email, role: "authenticated", aud: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 }); return `${h}.${p}.${sign(`${h}.${p}`)}`; };
const verify = (t) => { const [h, p, s] = (t || "").split("."); if (!s || sign(`${h}.${p}`) !== s) return null; const c = JSON.parse(Buffer.from(p, "base64url").toString()); return c.exp * 1000 > Date.now() ? c : null; };
const log = [];

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const chunks = []; req.on("data", (c) => chunks.push(c)); req.on("end", () => {
    const body = Buffer.concat(chunks);
    const send = (code, obj, headers = {}) => { res.writeHead(code, { "content-type": "application/json", ...headers }); res.end(obj === undefined ? "" : JSON.stringify(obj)); };
    if (url.pathname === "/_log") return send(200, log);
    if (url.pathname === "/auth/v1/token") {
      const { email, password } = JSON.parse(body.toString() || "{}"); const u = users[email];
      if (!u || u.pw !== password) return send(400, { code: 400, error_code: "invalid_credentials", msg: "Invalid login credentials" });
      const user = { id: u.id, aud: "authenticated", role: "authenticated", email, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
      return send(200, { access_token: mint(u.id, email), token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r-" + u.id, user });
    }
    if (url.pathname === "/auth/v1/user") {
      const c = verify((req.headers.authorization || "").replace("Bearer ", "")); if (!c) return send(401, { code: 401, msg: "invalid JWT" });
      return send(200, { id: c.sub, aud: "authenticated", role: "authenticated", email: c.email, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() });
    }
    if (url.pathname === "/auth/v1/logout") { log.push("POST /auth/v1/logout"); return send(204); }
    if (url.pathname.startsWith("/rest/v1/")) {
      const path = url.pathname.slice("/rest/v1".length) + url.search;
      if (url.pathname.startsWith("/rest/v1/rpc/")) log.push(`RPC ${url.pathname.split("/").pop()} ${body.toString().slice(0, 200)}`);
      const headers = { ...req.headers, host: POSTGREST.host }; delete headers["content-length"]; delete headers["apikey"];
      const up = http.request({ host: POSTGREST.hostname, port: POSTGREST.port, method: req.method, path, headers: { ...headers, ...(body.length ? { "content-length": body.length } : {}) } }, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
      up.on("error", (e) => send(502, { message: "postgrest unreachable: " + e.message }));
      return void up.end(body);
    }
    send(404, { message: "not mocked: " + url.pathname });
  });
}).listen(54321, () => console.log("fake supabase auth + PostgREST proxy on :54321"));
