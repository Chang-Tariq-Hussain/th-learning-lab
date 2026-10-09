// Transpiles src/features/teacher-tests (and mpt-mock) to CommonJS for node tests.
const ts = require('/home/claude/proj/node_modules/typescript'), fs = require('fs'), path = require('path');
const out = process.argv[2];
function walk(d, o) {
  fs.mkdirSync(o, { recursive: true });
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, path.join(o, f));
    else if (/\.ts$/.test(f)) {
      let js = ts.transpileModule(fs.readFileSync(p, 'utf8'), { compilerOptions: { module: 'commonjs', target: 'es2020', resolveJsonModule: true } }).outputText;
      js = js.replace(/require\("@\/features\/([^"]+)"\)/g, 'require("' + out + '/features/$1")');
      fs.writeFileSync(path.join(o, f.replace(/\.ts$/, '.js')), js);
    } else if (/\.json$/.test(f)) fs.copyFileSync(p, path.join(o, f));
  }
}
walk('/home/claude/proj/src/features/teacher-tests', out + '/features/teacher-tests');
walk('/home/claude/proj/src/features/mpt-mock', out + '/features/mpt-mock');
