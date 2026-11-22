// Reference formatter: splits the minified live page into readable scripts and styles with prettier (npm i prettier@3). Usage: node format-live.js ../play/index.html out.txt
// The output is for reading only; it is not a build input and line breaks between tags may change spacing.
const fs=require('fs'),p=require('prettier');
(async()=>{
let h=fs.readFileSync(process.argv[2],'utf8'); const parts=h.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/i);
let out=[],n={js:0,css:0,other:0};
for(const s of parts){
 const m=/^(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2>)$/i.exec(s);
 if(!m){out.push(s.replace(/></g,'>\n<'));continue;}
 const [,o,t,b,c]=m; const text=/type=["']?text\/plain/i.test(o);
 try{
  if(text||!b.trim()){out.push(s);n.other++;continue;}
  const f=await p.format(b,{parser:t.toLowerCase()==='style'?'css':'babel',printWidth:120});
  out.push(o+'\n'+f+c); n[t.toLowerCase()==='style'?'css':'js']++;
 }catch(e){out.push(s);n.other++;console.error('skip',t,e.message.slice(0,80));}
}
fs.writeFileSync(process.argv[3],out.join(''));console.log(n);
})();
