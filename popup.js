const $ = id => document.getElementById(id);
let ideas = [], saved = [];
const selected = new Set([1,2,6,7,9,10,17,23,25,31,32,40]);
function renderMethods(){
  const groups = [...new Set(METHODS.map(m=>m.group))];
  $("methods").innerHTML = groups.map(g => `<div class="groupLabel" style="grid-column:1/-1;color:#7b659b;font-size:10px;font-weight:800;padding-top:4px">${g}</div>`+
    METHODS.filter(m=>m.group===g).map(m=>`<label class="method" title="${m.desc}"><input type="checkbox" data-id="${m.id}" ${selected.has(m.id)?"checked":""}><span>${m.id}. ${m.name}</span></label>`).join("")).join("");
  $("methods").querySelectorAll("input").forEach(el=>el.addEventListener("change",()=>{el.checked?selected.add(+el.dataset.id):selected.delete(+el.dataset.id);updateSelected()}));
  updateSelected();
}
function updateSelected(){ $("selectedCount").textContent=`${selected.size} selected`; }
function clean(s){return s.toLowerCase().trim().replace(/\s+/g," ")}
function generate(){
 const seed=clean($("seed").value); if(!seed){$("seed").focus();return}
 const type=$("category").value, mods=MODIFIERS[type]||MODIFIERS.digital;
 const candidates=[seed,...mods.map(m=>`${seed} ${m}`),...INTENTS.map(m=>`${seed} ${m}`)];
 const words=seed.split(" ");
 for(let i=0;i<26;i++){const letter=String.fromCharCode(97+i);candidates.push(`${seed} ${letter}`)}
 // Add relevant format/style branches without asserting demand.
 ["mockup","template","bundle","clipart","wall art","planner","invitation","coloring pages","sticker","SVG","PNG"].forEach(x=>{if(!seed.includes(x))candidates.push(`${seed} ${x}`)});
 ideas=[...new Set(candidates.map(s=>s.trim()).filter(Boolean))].slice(0,80);
 renderIdeas(); renderKeywordPicker();
}
function renderIdeas(){
 $("ideaCount").textContent=`${ideas.length} ideas`;
 $("ideas").innerHTML=ideas.map((k,i)=>`<div class="idea"><span>${escapeHtml(k)}</span><button data-copy="${i}" title="Copy">Copy</button></div>`).join("");
 $("ideas").querySelectorAll("button").forEach(b=>b.onclick=()=>navigator.clipboard.writeText(ideas[+b.dataset.copy]));
}
function renderKeywordPicker(){
 $("keywordPick").innerHTML='<option value="">Choose keyword…</option>'+ideas.map((k,i)=>`<option value="${i}">${escapeHtml(k)}</option>`).join("");
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openSources(){
 const seed=clean($("seed").value); if(!seed){$("seed").focus();return}
 const chosen=METHODS.filter(m=>selected.has(m.id)&&m.url);
 // Open only a few at a time to avoid overwhelming the browser.
 chosen.slice(0,8).forEach((m,i)=>setTimeout(()=>chrome.tabs.create({url:m.url+(m.url.includes("?")?"&":"?")+"q="+encodeURIComponent(seed),active:i===0}),i*250));
 if(chosen.length>8) alert(`Opened first 8 selected sources. ${chosen.length-8} more selected sources remain; deselect any you don't need and run again.`);
}
function metric(id){const v=$(id).value;return v===""?null:Number(v)}
function validate(){
 const keyword=ideas[+$("keywordPick").value] || $("seed").value.trim();
 if(!keyword){$("result").textContent="Generate ideas and choose a keyword first.";return null}
 const c=metric("competition"),v=metric("views"),p=metric("price"),f=metric("favrate"),kd=metric("kd"),g=$("google").value,t=$("trend").value,co=$("countries").value;
 const checks=[
 ["Competition < 50,000",c!==null&&c<50000],
 ["Average views > 5,000",v!==null&&v>5000],
 ["Average price > $2",p!==null&&p>2],
 ["Favourites/views > 1%",f!==null&&f>1],
 ["Google volume Green/Good",g==="good"],
 ["12-month trend Stable/Growing",t==="stable"||t==="growing"],
 ["Target-country demand confirmed",co==="yes"],
 ["Keyword difficulty < 50",kd!==null&&kd<50]
 ];
 const pass=checks.every(x=>x[1]);
 const missing=checks.filter(x=>!x[1]).map(x=>"• "+x[0]+": "+(x[1]?"PASS":"NOT PASSED / missing")).join("\n");
 $("result").className="result "+(pass?"pass":"fail");
 $("result").textContent=(pass?"PASS — all required checks meet thresholds.":"NOT PASS — do not add this to the qualified list yet.")+"\n"+checks.map(x=>(x[1]?"✓ ":"✗ ")+x[0]).join("\n")+"\n\nA missing metric counts as not passed. Save source/date evidence before treating this as verified.";
 return {keyword,competition:c,views:v,price:p,favrate:f,kd,google:g,trend:t,countries:co,evidence:$("evidence").value,checks,pass,date:new Date().toISOString()};
}
async function saveRecord(){
 const rec=validate(); if(!rec)return;
 saved.push(rec); await chrome.storage.local.set({saved}); renderSaved();
}
function renderSaved(){
 $("saved").innerHTML=saved.length?saved.map((r,i)=>`<div class="savedrow"><b>${escapeHtml(r.keyword)}</b> — <b>${r.pass?"PASS":"NOT PASS"}</b><br><span>${new Date(r.date).toLocaleDateString()} · competition ${r.competition??"—"} · views ${r.views??"—"}</span> <button data-remove="${i}" class="secondary">Remove</button></div>`).join(""):"No saved records yet.";
 $("saved").querySelectorAll("[data-remove]").forEach(b=>b.onclick=async()=>{saved.splice(+b.dataset.remove,1);await chrome.storage.local.set({saved});renderSaved()});
}
function csvCell(v){return '"'+String(v??"").replace(/"/g,'""')+'"'}
function downloadCsv(rows,name){
 if(!rows.length){alert("No records to export.");return}
 const headers=Object.keys(rows[0]);const csv=[headers.map(csvCell).join(","),...rows.map(r=>headers.map(h=>csvCell(Array.isArray(r[h])?r[h].map(x=>x[0]+": "+x[1]).join("; "):r[h])).join(","))].join("\r\n");
 const url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
$("generate").onclick=generate;
$("seed").addEventListener("keydown",e=>{if(e.key==="Enter")generate()});
$("allMethods").onclick=()=>{if(selected.size===METHODS.length)selected.clear();else METHODS.forEach(m=>selected.add(m.id));renderMethods();$("allMethods").textContent=selected.size===METHODS.length?"Deselect all":"Select all"};
$("runMethods").onclick=openSources;
$("copy").onclick=()=>navigator.clipboard.writeText(ideas.join("\n"));
$("export").onclick=()=>downloadCsv(ideas.map(keyword=>({keyword,seed:$("seed").value,product_type:$("category").value,generated_by:"Keyword expansion; validate with live data"})),"etsy-keyword-ideas.csv");
$("validate").onclick=validate;
$("save").onclick=saveRecord;
$("exportSaved").onclick=()=>downloadCsv(saved,"etsy-keyword-validation.csv");
chrome.storage.local.get({saved:[]}).then(data=>{saved=data.saved||[];renderSaved()});
renderMethods();
