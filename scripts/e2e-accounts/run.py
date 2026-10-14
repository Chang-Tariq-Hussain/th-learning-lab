import re, subprocess, json, sys
B="http://localhost:3122"
def sh(*a, **k): return subprocess.run(a, capture_output=True, text=True, **k).stdout
def get(jar, path): return sh("curl","-s","-b",jar,"-c",jar,"-w","\n__HTTP__%{http_code}",B+path)
def body(r): return r.rsplit("\n__HTTP__",1)[0]
def code(r): return r.rsplit("__HTTP__",1)[1]
def forms(html): return re.findall(r'<form[^>]*>(.*?)</form>', html, re.S)
def aid(f): m=re.search(r'name="(\$ACTION_ID_[0-9a-f]+)"', f); return m.group(1) if m else None
def post(jar, path, act, **fields):
    args=["curl","-s","-o","/dev/null","-D","/tmp/hdr","-b",jar,"-c",jar,"-F",act+"="]
    for k,v in fields.items(): args+=["-F",f"{k}={v}"]
    sh(*args, B+path)
    h=open("/tmp/hdr").read()
    st=h.split("\r\n")[0]; loc=re.search(r"(?im)^location:\s*(.*?)\r?$",h)
    from urllib.parse import unquote
    return st, unquote(loc.group(1)) if loc else None
def login(jar, email, pw):
    sh("rm","-f",jar); html=body(get(jar,"/admin/login")); a=aid(forms(html)[0])
    return post(jar,"/admin/login",a,email=email,password=pw,next="/admin")
def mocklog(): return json.loads(sh("curl","-s","localhost:54321/_log"))
ok=True
def check(name, cond, extra=""):
    global ok; ok &= bool(cond); print(("  ✓ " if cond else "  ✗ ")+name+(f"  [{extra}]" if extra and not cond else ""))

print("super admin"); S="/tmp/jS"; st,loc=login(S,"super@x.com","pw1"); check("signs in -> /admin", loc=="/admin", f"{st} {loc}")
page=body(get(S,"/admin/admins")); fs=forms(page)
grant=[f for f in fs if 'name="email"' in f][0]; revoke=[f for f in fs if 'name="user_id"' in f][0]
GA,RA=aid(grant),aid(revoke); check("found grant + revoke action ids (not the sign-out form)", GA and RA and GA!=RA)
n0=len([l for l in mocklog() if l.startswith("RPC admin_set_role_by_email")])
st,loc=post(S,"/admin/admins",GA,email="nobody@x.com",role="analyst"); check("unknown email -> error shown on /admin/admins", loc and loc.startswith("/admin/admins?error=") and "no account with that email" in loc, loc)
st,loc=post(S,"/admin/admins",GA,email="learner@x.com",role="content_manager"); check("valid grant -> success message", loc and loc.startswith("/admin/admins?ok=") and "Content manager" in loc, loc)
st,loc=post(S,"/admin/admins",GA,email="learner@x.com",role="root"); check("invalid role rejected before reaching the database", loc and "error=Choose%20a%20role" in loc.replace("+","%20") or (loc and "Choose a role" in loc), loc)
st,loc=post(S,"/admin/admins",GA,email="not-an-email",role="analyst"); check("invalid email rejected before reaching the database", loc and "valid email" in loc, loc)
rpcs=[l for l in mocklog() if l.startswith("RPC admin_set_role_by_email")]
check("exactly 2 role RPCs reached the database (unknown email + valid grant)", len(rpcs)-n0==2, str(rpcs[-3:]))
check("RPC carried the submitted email and role", any('"p_email":"learner@x.com"' in l and '"p_role":"content_manager"' in l for l in rpcs))
st,loc=post(S,"/admin/admins",RA,user_id="00000000-0000-0000-0000-0000000000a2"); check("revoke -> success message", loc and loc.startswith("/admin/admins?ok="), loc)
check("revoke RPC reached the database with the user id", any(l.startswith("RPC admin_revoke_role") and "0000a2" in l for l in mocklog()))
st,loc=post(S,"/admin/admins",RA,user_id="not-a-uuid"); check("malformed user id rejected before the database", loc and "Invalid" in loc, loc)
check("sign-in was audited (admin.login RPC)", any(l.startswith("RPC write_audit") and "admin.login" in l and "0000a1" in l for l in mocklog()))
check("super admin still signed in after all that", code(get(S,"/admin"))=="200")

print("analyst"); A="/tmp/jA"; st,loc=login(A,"analyst@x.com","pw2"); check("signs in", loc=="/admin")
for p in ("/admin/audit","/admin/admins"):
    out=sh("curl","-s","-o","/tmp/o","-w","%{http_code} %{redirect_url}","-b",A,B+p).split()
    check(f"{p}: analyst gets a real 307 back to /admin, no page rendered", out[0]=="307" and out[1].endswith("/admin") and not any(m in open("/tmp/o").read() for m in ("Audit log","Admin users","super@x.com","admin.login")), " ".join(out))
n1=len([l for l in mocklog() if l.startswith("RPC admin_set_role_by_email")])
st,loc=post(A,"/admin/admins",GA,email="analyst@x.com",role="super_admin")
n2=len([l for l in mocklog() if l.startswith("RPC admin_set_role_by_email")])
check("analyst replaying the grant form: nothing reaches the database", n2==n1, f"{st} {loc}")
n3=len([l for l in mocklog() if l.startswith("RPC admin_revoke_role")])
post(A,"/admin/admins",RA,user_id="00000000-0000-0000-0000-0000000000a1")
check("analyst replaying the revoke form: nothing reaches the database", len([l for l in mocklog() if l.startswith("RPC admin_revoke_role")])==n3)

print("learner / sign out"); L="/tmp/jL"; st,loc=login(L,"learner@x.com","pw3"); check("learner refused (noaccess)", loc and "error=noaccess" in loc, loc)
check("no usable session left for the learner", sh("curl","-s","-o","/dev/null","-w","%{http_code}","-b",L,B+"/admin")=="307")
page=body(get(S,"/admin")); out=aid(forms(page)[0]); st,loc=post(S,"/admin",out); check("sign out -> /admin/login", loc=="/admin/login", f"{st} {loc}")
check("signed-out super admin is redirected", sh("curl","-s","-o","/dev/null","-w","%{http_code}","-b",S,B+"/admin")=="307")
print("\nALL OK" if ok else "\nFAILURES"); sys.exit(0 if ok else 1)
