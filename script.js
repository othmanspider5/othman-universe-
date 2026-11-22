const STORAGE_KEY="othman_universe_v1";
const defaultData={
  name:"OTHMAN LAMMALLAH",
  intro:"A place for my projects, latest updates, and the people who make this journey special.",
  about:"I'm Othman Lammallah. I enjoy exploring technology, creating websites, and turning ideas into digital experiences. This space brings my work and community together.",
  accent:"#1769d2",
  projects:[
    {id:1,title:"OTHMAN ENGLISH",category:"EDUCATION",description:"A learning space designed to help Moroccan learners improve their English.",url:"https://englishothmanspider.netlify.app/",symbol:"EN"},
    {id:2,title:"WORLD BARCA",category:"SPORTS",description:"A fan-focused destination for FC Barcelona news and information.",url:"https://worldbarca1.netlify.app/",symbol:"WB"},
    {id:3,title:"OTHMAN WEB CREATOR",category:"WEB DESIGN",description:"A showcase of website projects and digital creation services.",url:"https://othmancreator.netlify.app/",symbol:"OW"}
  ],
  news:[{id:1,title:"Welcome to Othman Universe",date:"2026-11-22",description:"The official digital space is taking shape. More updates and projects are coming soon."}],
  messages:[],
  sections:[
    {id:"home",name:"Home",visible:true,locked:true},
    {id:"projects",name:"Projects",visible:true,locked:true},
    {id:"news",name:"News",visible:true,locked:true},
    {id:"fanzone",name:"Fan Zone",visible:true,locked:true},
    {id:"fanwall",name:"Fan Wall",visible:true,locked:true},
    {id:"about",name:"About Me",visible:true,locked:true}
  ],
  customCss:"",
  customJs:""
};
let data=loadData();
let adminUnlocked=false;
let toastTimer;
function loadData(){try{const saved=localStorage.getItem(STORAGE_KEY);if(saved){const parsed=JSON.parse(saved);return {...structuredClone(defaultData),...parsed}}}catch(e){}return structuredClone(defaultData)}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function ensureCustomSections(){
 data.sections.filter(s=>!s.locked).forEach(s=>{
  if(document.getElementById(s.id))return;
  const section=document.createElement("section");section.className="section custom-section";section.id=s.id;
  section.innerHTML=`<div class="eyebrow">CUSTOM SECTION</div><h2>${esc(s.name)} <span style="color:#1769d2">.</span></h2><p style="color:#858992">A custom space in OTHMAN UNIVERSE.</p>`;
  document.getElementById("siteMain").appendChild(section);
 });
}
function applyContent(){
 ensureCustomSections();
 document.documentElement.style.setProperty("--accent",data.accent||"#1769d2");
 document.querySelector(".brand-name").innerHTML=`${esc(data.name||"OTHMAN LAMMALLAH").split(" ")[0]} <b>UNIVERSE</b>`;
 document.getElementById("heroIntro").textContent=data.intro;
 document.getElementById("aboutText").textContent=data.about;
 document.getElementById("customStyle").textContent=data.customCss||"";
 document.title=(data.name||"OTHMAN LAMMALLAH")+" — Official Website";
 document.querySelectorAll(".section").forEach(section=>{const item=data.sections.find(s=>s.id===section.id);section.style.display=item&&item.visible===false?"none":""});
 renderProjects();renderNews();renderMessages();renderAdmin();applyNav();
}
function renderProjects(){
 const grid=document.getElementById("projectGrid");
 const photoPosition=p=>p.id===1?"100% 0%":p.id===2?"0% 100%":p.id===3?"0% 0%":"100% 100%";
 grid.innerHTML=data.projects.length?data.projects.map(p=>`<article class="project-card"><div class="project-visual photo-tile" style="--photo-position:${photoPosition(p)}"><span>${esc(p.symbol||"✳")}</span></div><div class="project-info"><small>${esc(p.category||"PROJECT")}</small><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.url?`<a class="text-link" href="${esc(p.url)}" target="_blank" rel="noopener">Visit project <span>↗</span></a>`:""}</div></article>`).join(""):`<p>No projects yet. Add your first project from the dashboard.</p>`;
}
function renderNews(){
 document.getElementById("newsList").innerHTML=data.news.length?data.news.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(n=>`<article class="news-item"><div class="news-date">${esc(n.date||"UPDATE")}</div><div><h3>${esc(n.title)}</h3><p>${esc(n.description)}</p></div><span class="news-arrow">↗</span></article>`).join(""):`<p>No news posted yet.</p>`;
}
function renderMessages(){
 const wall=document.getElementById("wallMessages");
 wall.innerHTML=data.messages.length?data.messages.slice().reverse().map(m=>`<article class="wall-note"><p>“${esc(m.message)}”</p><b>${esc(m.name)}</b><span>${esc(m.date||"Community message")}</span></article>`).join(""):`<div class="wall-note"><p>Your message could be the first one on the wall. Share something positive with the community.</p><b>OTHMAN UNIVERSE</b><span>Community</span></div>`;
}
function applyNav(){
 const nav=document.getElementById("mainNav");
 nav.innerHTML=data.sections.filter(s=>s.visible).map(s=>`<a href="#${esc(s.id)}" class="nav-link">${esc(s.name)}</a>`).join("");
}
function openAdmin(){document.getElementById("adminModal").classList.add("open");document.getElementById("adminModal").setAttribute("aria-hidden","false");if(adminUnlocked)showDashboard()}
function closeAdmin(){document.getElementById("adminModal").classList.remove("open");document.getElementById("adminModal").setAttribute("aria-hidden","true")}
function showDashboard(){document.getElementById("loginView").classList.add("hidden");document.getElementById("dashboardView").classList.remove("hidden");renderAdmin()}
function renderAdmin(){
 document.getElementById("statProjects").textContent=data.projects.length;
 document.getElementById("statNews").textContent=data.news.length;
 document.getElementById("statMessages").textContent=data.messages.length;
 document.getElementById("statSections").textContent=data.sections.filter(s=>!s.locked).length;
 document.getElementById("adminProjects").innerHTML=data.projects.map(p=>adminItem(p.title,p.category,`editProject(${p.id})`,`deleteProject(${p.id})`)).join("")||emptyText();
 document.getElementById("adminNews").innerHTML=data.news.map(n=>adminItem(n.title,n.date,`editNews(${n.id})`,`deleteNews(${n.id})`)).join("")||emptyText();
 document.getElementById("adminMessages").innerHTML=data.messages.map(m=>adminItem(m.name,m.message,`viewMessage(${m.id})`,`deleteMessage(${m.id})`)).join("")||emptyText();
 document.getElementById("adminSections").innerHTML=data.sections.map(s=>`<div class="admin-item"><div><strong>${esc(s.name)}</strong><small>${s.locked?"Main section":"Custom section"} · ${s.visible?"Visible":"Hidden"}</small></div><div class="item-actions"><button onclick="toggleSection('${esc(s.id)}')">${s.visible?"Hide":"Show"}</button>${s.locked?"":`<button onclick="editSection('${esc(s.id)}')">Edit</button><button class="delete" onclick="deleteSection('${esc(s.id)}')">Delete</button>`}</div></div>`).join("");
 document.getElementById("editIntro").value=data.intro;
 document.getElementById("editAbout").value=data.about;
 document.getElementById("editAccent").value=data.accent;
 document.getElementById("editName").value=data.name;
 document.getElementById("customCss").value=data.customCss||"";
 document.getElementById("customJs").value=data.customJs||"";
}
function emptyText(){return `<div class="notice"><p>Nothing here yet. Use the add button to create your first item.</p></div>`}
function adminItem(title,sub,edit,del){return `<div class="admin-item"><div><strong>${esc(title)}</strong><small>${esc(sub||"")}</small></div><div class="item-actions"><button onclick="${edit}">Edit</button><button class="delete" onclick="${del}">Delete</button></div></div>`}
function nextId(list){return Math.max(0,...list.map(x=>Number(x.id)||0))+1}
function addProject(){const title=prompt("Project name:");if(!title)return;const description=prompt("Short description:")||"";const url=prompt("Project URL (optional):")||"";const category=prompt("Category:")||"PROJECT";data.projects.push({id:nextId(data.projects),title,description,url,category,symbol:title.slice(0,2).toUpperCase()});saveData();applyContent();toast("Project added.")}
function editProject(id){const p=data.projects.find(x=>x.id===id);if(!p)return;const title=prompt("Project name:",p.title);if(title===null)return;const description=prompt("Description:",p.description);if(description===null)return;const url=prompt("Project URL:",p.url);if(url===null)return;const category=prompt("Category:",p.category);if(category===null)return;Object.assign(p,{title,description,url,category,symbol:title.slice(0,2).toUpperCase()});saveData();applyContent();toast("Project updated.")}
function deleteProject(id){if(!confirm("Delete this project?"))return;data.projects=data.projects.filter(x=>x.id!==id);saveData();applyContent();toast("Project deleted.")}
function addNews(){const title=prompt("News title:");if(!title)return;const description=prompt("News text:")||"";data.news.push({id:nextId(data.news),title,description,date:new Date().toISOString().slice(0,10)});saveData();applyContent();toast("News published.")}
function editNews(id){const n=data.news.find(x=>x.id===id);if(!n)return;const title=prompt("Title:",n.title);if(title===null)return;const description=prompt("Text:",n.description);if(description===null)return;n.title=title;n.description=description;saveData();applyContent();toast("News updated.")}
function deleteNews(id){if(!confirm("Delete this news post?"))return;data.news=data.news.filter(x=>x.id!==id);saveData();applyContent();toast("News deleted.")}
function viewMessage(id){const m=data.messages.find(x=>x.id===id);if(m)alert(m.name+" wrote:\\n\\n"+m.message)}
function deleteMessage(id){if(!confirm("Delete this fan message?"))return;data.messages=data.messages.filter(x=>x.id!==id);saveData();applyContent();toast("Message deleted.")}
function addSection(){const name=prompt("New section name:");if(!name)return;let id=name.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");if(!id)id="section-"+Date.now();if(data.sections.some(s=>s.id===id)){toast("A section with this name already exists.");return}data.sections.push({id,name,visible:true,locked:false});const section=document.createElement("section");section.className="section custom-section";section.id=id;section.innerHTML=`<div class="eyebrow">CUSTOM SECTION</div><h2>${esc(name)} <span style="color:#e63b3b">.</span></h2><p style="color:#858992">Edit this section using the dashboard or custom code editor.</p>`;document.getElementById("siteMain").appendChild(section);saveData();applyContent();toast("Section created.")}
function editSection(id){const s=data.sections.find(x=>x.id===id);if(!s)return;const name=prompt("Section name:",s.name);if(name===null)return;s.name=name;const el=document.getElementById(id);if(el){const h=el.querySelector("h2");if(h)h.innerHTML=esc(name)+' <span style="color:#e63b3b">.</span>'}saveData();applyContent();toast("Section updated.")}
function toggleSection(id){const s=data.sections.find(x=>x.id===id);if(!s)return;s.visible=!s.visible;saveData();applyContent();toast("Section visibility updated.")}
function deleteSection(id){const s=data.sections.find(x=>x.id===id);if(!s||s.locked)return;if(!confirm("Delete this section?"))return;data.sections=data.sections.filter(x=>x.id!==id);document.getElementById(id)?.remove();saveData();applyContent();toast("Section deleted.")}
window.editProject=editProject;window.deleteProject=deleteProject;window.editNews=editNews;window.deleteNews=deleteNews;window.viewMessage=viewMessage;window.deleteMessage=deleteMessage;window.editSection=editSection;window.toggleSection=toggleSection;window.deleteSection=deleteSection;
document.getElementById("adminOpen").addEventListener("click",openAdmin);
document.getElementById("adminClose").addEventListener("click",closeAdmin);
document.getElementById("adminModal").addEventListener("click",e=>{if(e.target.id==="adminModal")closeAdmin()});
document.getElementById("loginForm").addEventListener("submit",e=>{e.preventDefault();const code=document.getElementById("adminCode").value;if(code==="1889"){adminUnlocked=true;document.getElementById("loginError").textContent="";showDashboard();toast("Dashboard unlocked.")}else{document.getElementById("loginError").textContent="Incorrect access code. Try again.";document.getElementById("adminCode").value=""}});
document.getElementById("logoutBtn").addEventListener("click",()=>{adminUnlocked=false;document.getElementById("dashboardView").classList.add("hidden");document.getElementById("loginView").classList.remove("hidden");document.getElementById("adminCode").value="";toast("You have logged out.")});
document.querySelectorAll(".dash-tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".dash-tab").forEach(b=>b.classList.toggle("active",b===btn));document.querySelectorAll(".dash-page").forEach(p=>p.classList.toggle("active",p.id==="tab-"+btn.dataset.tab))}));
document.getElementById("addProject").addEventListener("click",addProject);
document.getElementById("addNews").addEventListener("click",addNews);
document.getElementById("addSection").addEventListener("click",addSection);
document.getElementById("contentForm").addEventListener("submit",e=>{e.preventDefault();data.intro=document.getElementById("editIntro").value;data.about=document.getElementById("editAbout").value;data.accent=document.getElementById("editAccent").value;data.name=document.getElementById("editName").value||"OTHMAN LAMMALLAH";saveData();applyContent();toast("Site content saved.")});
document.getElementById("saveCode").addEventListener("click",()=>{data.customCss=document.getElementById("customCss").value;data.customJs=document.getElementById("customJs").value;saveData();applyContent();runCustomJs();toast("Custom code saved and applied.")});
document.getElementById("clearCode").addEventListener("click",()=>{if(!confirm("Clear custom CSS and JavaScript?"))return;data.customCss="";data.customJs="";saveData();applyContent();toast("Custom code cleared.")});
function runCustomJs(){if(!data.customJs)return;try{new Function(data.customJs)()}catch(e){toast("Custom JavaScript error: "+e.message)}}
document.getElementById("fanForm").addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("fanName").value.trim(),message=document.getElementById("fanMessage").value.trim();if(!name||!message)return;data.messages.push({id:nextId(data.messages),name,message,date:new Date().toLocaleDateString()});saveData();renderMessages();document.getElementById("fanForm").reset();toast("Your message has been posted.")});
document.getElementById("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="othman-universe-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)});
document.getElementById("importData").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const parsed=JSON.parse(await file.text());data={...structuredClone(defaultData),...parsed};saveData();applyContent();toast("Backup imported.")}catch(err){toast("Could not import this backup.")}e.target.value=""});
document.getElementById("resetData").addEventListener("click",()=>{if(!confirm("This will erase locally saved content and restore the starter site. Continue?"))return;data=structuredClone(defaultData);saveData();applyContent();toast("Site data reset.")});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.getElementById("mainNav").addEventListener("click",e=>{if(e.target.matches("a")){document.getElementById("mainNav").classList.remove("open");document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a===e.target))}});
document.getElementById("year").textContent=new Date().getFullYear();
applyContent();runCustomJs();
