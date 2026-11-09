// node tools/check_coverage.js : reports source lines that are not covered by any explained item
const fs=require('fs');global.window={UI:{},PAGES:{}};global.registerFilePage=()=>{};global.EX={};
const dir=__dirname+'/../assets/js/';
for(const f of ['data','render','cases','app','effects','css','html']) require(dir+'ex-'+f+'.js');
const SRC=(()=>{global.window={};eval(fs.readFileSync(dir+'sources.js','utf8').replace('window.SRC','global.SRCX'));return global.SRCX})();
for(const k of Object.keys(EX)){const d=EX[k];const lines=SRC[d.src].split('\n');const cov=new Set();
 d.blocks.forEach(b=>(b.items||[]).forEach(it=>{const p=String(it[0]).split('-');const a=+p[0],z=+(p[1]||p[0]);for(let i=a;i<=z;i++)cov.add(i)}));
 const miss=[];lines.forEach((t,i)=>{if(t.trim()&&!cov.has(i+1))miss.push(i+1)});
 console.log(k,d.src,lines.length,'lines; uncovered non-blank:',miss.join(',')||'none');}
