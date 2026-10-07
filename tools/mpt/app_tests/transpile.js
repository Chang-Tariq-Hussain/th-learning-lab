const ts=require('/home/claude/proj/node_modules/typescript'),fs=require('fs'),path=require('path');
const src='/home/claude/proj/src/features/mpt-mock',out=process.argv[2]+'/features/mpt-mock';
function walk(d,o){fs.mkdirSync(o,{recursive:true});for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory())walk(p,path.join(o,f));else if(/\.ts$/.test(f)){fs.writeFileSync(path.join(o,f.replace(/\.ts$/,'.js')),ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:'commonjs',target:'es2020'}}).outputText)}}}
walk(src,out);
