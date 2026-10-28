/* SkillSwap frontend for the SkillExchangeNetwork Spring Boot API.
   If serving this UI from Spring Boot's /static directory, keep API_BASE empty.
   If using VS Code Live Server (127.0.0.1:5500), API_BASE should be http://localhost:8081/api. */
const API_BASE = (location.port === "5500" || location.port === "5501")
  ? "http://localhost:8081/api"
  : "/api";

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = {
  user: null, profile: null, users: [], skills: [], userSkills: [],
  sentRequests: [], receivedRequests: [], notifications: [], messages: [],
  reviews: [], currentView: "home", authMode: "login", exchangeTab: "received",
  discoverQuery: "", discoverFilter: "ALL", activeConversation: null
};
const views = {
  home: "Overview", discover: "Discover skills", "my-skills": "My skills",
  exchanges: "Exchange requests", messages: "Messages", notifications: "Notifications",
  profile: "My profile", reviews: "Reviews"
};
const safe = v => String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials = name => (String(name || "?").trim().split(/\s+/).slice(0,2).map(s=>s[0]||"").join("").toUpperCase() || "?");
const idOf = obj => obj?.id ?? obj?.userId ?? "";
const personName = obj => obj?.name || obj?.user?.name || obj?.fullName || `User #${idOf(obj) || "?"}`;
const personId = obj => obj?.id ?? obj?.user?.id ?? obj?.userId;
const skillName = obj => obj?.skill?.name || obj?.name || "Skill";
const skillId = obj => obj?.skill?.id ?? obj?.id ?? obj?.skillId;
const dateText = v => { if(!v) return "Recently"; const d=new Date(v); return isNaN(d)?"Recently":d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); };
const timeText = v => { if(!v) return ""; const d=new Date(v); return isNaN(d)?"":d.toLocaleString(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}); };
const enumText = v => String(v ?? "").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
function toast(message, type="success"){ const el=document.createElement("div");el.className=`toast ${type}`;el.textContent=message;$("#toast-region").append(el);setTimeout(()=>el.remove(),4000); }
function requireLogin(){ if(!state.user){openAuth("login");toast("Please sign in to use this feature.","error");return false;}return true; }
function authHeaders(){return {};}
async function api(path, options={}) {
  const headers = {...authHeaders(), ...(options.headers||{})};
  if(options.body && !(options.body instanceof FormData)) headers["Content-Type"]="application/json";
  let response;
  try { response=await fetch(`${API_BASE}${path}`,{...options,headers}); }
  catch(e){throw new Error("Cannot reach the backend. Check that Spring Boot is running and API_BASE in app.js is correct.");}
  if(!response.ok){
    let msg=`Request failed (${response.status})`;
    try {const t=await response.text(); if(t) msg=t.length>250?t.slice(0,250)+"…":t;}catch{}
    throw new Error(msg);
  }
  if(response.status===204) return null;
  const text=await response.text(); if(!text) return null;
  try{return JSON.parse(text)}catch{return text}
}
async function safeApi(path, options, fallback){try{return await api(path,options)}catch(e){console.warn(path,e.message);return fallback}}
function showView(view){
  if(!views[view])view="home";
  state.currentView=view;
  $$(".view").forEach(el=>el.classList.toggle("active",el.id===`view-${view}`));
  $$(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
  $("#page-crumb").textContent=views[view];
  $("#sidebar").classList.remove("open");
  renderView(view);
  window.scrollTo({top:0,behavior:"smooth"});
}
function openAuth(mode="login"){
  state.authMode=mode; setAuthMode(mode);
  const dlg=$("#auth-dialog"); if(!dlg.open)dlg.showModal();
}
function setAuthMode(mode){
  state.authMode=mode;
  $$(".auth-tab").forEach(b=>b.classList.toggle("active",b.dataset.authMode===mode));
  $("#auth-title").textContent=mode==="login"?"Welcome back":"Create your account";
  $("#auth-subtitle").textContent=mode==="login"?"Sign in and keep growing.":"Join a community that learns by sharing.";
  $("#name-field").classList.toggle("hidden",mode!=="register");
  $("#phone-field").classList.toggle("hidden",mode!=="register");
  $("#auth-form [name=password]").autocomplete=mode==="login"?"current-password":"new-password";
  $("#auth-submit").innerHTML=mode==="login"?'Sign in <span>→</span>':'Create account <span>→</span>';
}
function syncAccount(){
  const u=state.user;
  $("#sidebar-name").textContent=u?.name||"Guest user";
  $("#sidebar-email").textContent=u?.email||"Sign in to continue";
  $("#sidebar-avatar").textContent=initials(u?.name);
  $("#top-avatar").textContent=initials(u?.name);
}
async function loadCore(){
  const [skills, users, allUserSkills] = await Promise.all([
    safeApi("/skill", {}, []),
    safeApi("/users", {}, []),
    safeApi("/userSkill", {}, [])
  ]);
  state.skills = Array.isArray(skills) ? skills : [];
  state.users = Array.isArray(users) ? users : [];
  state.userSkills = Array.isArray(allUserSkills) ? allUserSkills : [];
  if (state.user) {
    const uid = state.user.id;
    const profiles = await safeApi("/userProfile", {}, []);
    state.profile = Array.isArray(profiles) ? profiles.find(p => personId(p.user) === uid) || null : null;
    state.sentRequests = await safeApi(`/exchangeRequest/getsentRequests/${uid}`, {}, []);
    state.receivedRequests = await safeApi(`/exchangeRequest/getreceivedRequests/${uid}`, {}, []);
    state.notifications = await safeApi(`/notification/byuser/${uid}`, {}, []);
    const received = await safeApi(`/message/receivedmessage/${uid}`, {}, []);
    const sent = await safeApi(`/message/sentmessage/${uid}`, {}, []);
    state.messages = [...(Array.isArray(received) ? received : []), ...(Array.isArray(sent) ? sent : [])];
    state.reviews = await safeApi(`/review/getreviews/${uid}`, {}, []);
  } else {
    state.profile = null; state.sentRequests = []; state.receivedRequests = [];
    state.notifications = []; state.messages = []; state.reviews = [];
  }
  updateBadges();
}
function updateBadges(){
  const incoming=(state.receivedRequests||[]).filter(r=>(r.status||"PENDING")==="PENDING").length;
  const unread=(state.notifications||[]).filter(n=>!(n.read ?? n.isRead)).length;
  $("#request-badge").textContent=incoming;$("#request-badge").classList.toggle("hidden",!incoming);
  $("#notification-badge").textContent=unread;$("#notification-badge").classList.toggle("hidden",!unread);
}
async function refreshAndRender(){await loadCore();syncAccount();renderView(state.currentView);}
function heading(kicker,title,subtitle,actions=""){return `<div class="heading-row"><div><p class="eyebrow">${safe(kicker)}</p><h1 class="page-title">${safe(title)}</h1><p class="page-subtitle">${safe(subtitle)}</p></div><div class="heading-actions">${actions}</div></div>`;}
function empty(title,desc,button="",view="discover"){return `<div class="empty-state"><div class="empty-symbol">✳</div><strong>${safe(title)}</strong><div>${safe(desc)}</div>${button?`<button class="button button-secondary button-small" data-view="${view}">${safe(button)} →</button>`:""}</div>`;}
function stat(label,value,icon,foot){return `<div class="stat-card"><div class="stat-top"><span>${safe(label)}</span><span class="stat-icon">${icon}</span></div><div class="stat-number">${safe(value)}</div><div class="stat-foot">${foot}</div></div>`;}
function skillCard(s,opts={}) {
 const type=s.skillType||s.type||opts.type||"";
 const desc=s.description||s.skill?.description||"A skill to learn, share, and grow with.";
 return `<article class="skill-card"><div class="skill-top"><span class="skill-symbol">${(skillName(s).slice(0,1)||"✳").toUpperCase()}</span><span class="tag ${type==="LEARN"?"learn":""}">${safe(enumText(type||"SKILL"))}</span></div><h3>${safe(skillName(s))}</h3><p>${safe(desc)}</p><div class="skill-card-footer"><span>${safe(enumText(s.experience||s.level||"Community"))}</span>${opts.own?`<button class="text-link" data-delete-userskill="${safe(s.id)}">Remove</button>`:`<button class="text-link" data-request-skill="${safe(skillId(s))}">Exchange ↗</button>`}</div></article>`;
}
function personCard(u){
 const us=state.userSkills.filter(s=>personId(s.user)===u.id);
 const offered=us.filter(s=>(s.skillType||s.type)==="TEACH").slice(0,3);
 const profile=Array.isArray(u.profile)?u.profile[0]:u.profile;
 const bio=profile?.bio||"Open to meeting people, exchanging ideas, and learning something new.";
 const city=profile?.city||"Community member";
 const chips=offered.length?offered.map(s=>`<span class="mini-chip">${safe(skillName(s))}</span>`).join(""):`<span class="mini-chip">Skills profile coming soon</span>`;
 return `<article class="person-card"><div class="person-head"><div class="person-avatar">${safe(initials(u.name))}</div><div><h3>${safe(u.name||"Member")}</h3><p>Member #${safe(u.id)} · ${safe(city)}</p></div></div><p class="person-bio">${safe(bio)}</p><div class="person-skills">${chips}</div><div class="person-footer"><small><span class="available-dot"></span>Community member</small><button class="button button-secondary button-small" data-message-user="${safe(u.id)}">Message</button><button class="button button-primary button-small" data-request-user="${safe(u.id)}">Exchange</button></div></article>`;
}
function requestCard(r,incoming){
 const sender=r.sender||{},receiver=r.receiver||{},other=incoming?sender:receiver;
 const status=(r.status||"PENDING").toUpperCase();
 const statusClass=status==="ACCEPTED"?"":status==="PENDING"?"learn":"neutral";
 const skills=`${skillName(r.offeredSkill)} ⇄ ${skillName(r.requestedSkill)}`;
 const actions=incoming&&status==="PENDING"?`<button class="button button-primary button-small" data-request-action="accept" data-id="${safe(r.id)}">Accept</button><button class="button button-danger button-small" data-request-action="reject" data-id="${safe(r.id)}">Decline</button>`:
 status==="ACCEPTED"?`<button class="button button-secondary button-small" data-request-action="complete" data-id="${safe(r.id)}">Mark complete</button>`:"";
 return `<article class="request-card"><div class="person-avatar">${safe(initials(personName(other)))}</div><div class="request-content"><h3>${safe(personName(other))} <span class="muted-block">· #${safe(personId(other)||"?")}</span></h3><p>${safe(r.message||"Let's exchange skills and learn together.")}</p><div class="request-meta"><span>${safe(skills)}</span><span>·</span><span>${safe(dateText(r.createdAt))}</span><span class="tag ${statusClass}">${safe(enumText(status))}</span></div>${actions?`<div class="request-actions">${actions}</div>`:""}</div></article>`;
}
function renderHome(){
 const user=state.user;
 const my=state.userSkills.filter(s=>personId(s.user)===user?.id);
 const teach=my.filter(s=>(s.skillType||s.type)==="TEACH").length;
 const learn=my.filter(s=>(s.skillType||s.type)==="LEARN").length;
 const pending=(state.receivedRequests||[]).filter(r=>(r.status||"PENDING")==="PENDING").length;
 const recent=[...(state.receivedRequests||[]),...(state.sentRequests||[])].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)).slice(0,4);
 $("#view-home").innerHTML=`
  <div class="hero"><div class="hero-copy"><p class="eyebrow">A COMMUNITY OF CURIOUS MINDS</p><h1>${user?`Welcome back, ${safe((user.name||"friend").split(" ")[0])}.`:"Learn something. Teach something."}<br>Grow together.</h1><p>Share what you know, discover what others can teach, and turn your curiosity into meaningful connections.</p><button class="button" data-view="discover">Discover your next skill <span>→</span></button></div><div class="hero-art"><div class="orb one">✳</div><div class="orb two">↗</div><div class="orb three">✦</div></div></div>
  <div class="stat-grid">${stat("Skills in community",state.skills.length,"✳","Explore the skill library")}${stat("Skills you're sharing",teach,"↗",`<span>${teach}</span> teach skills in your profile`)}${stat("Skills you want to learn",learn,"⌕","Keep your curiosity active")}${stat("Incoming requests",pending,"⇄",pending?`<span>${pending} waiting</span> for your response`:"All caught up")}</div>
  <div class="content-grid"><div><div class="section-row"><div><h2 class="section-title">Explore popular skills</h2><div class="section-note">A little inspiration for what to learn next</div></div><button class="text-link" data-view="discover">View all →</button></div><div class="skill-grid">${state.skills.slice(0,4).map(s=>skillCard(s)).join("")||empty("No skills yet","The community skill catalog is empty.")}</div>
  <div class="section-row"><div><h2 class="section-title">Recent exchange activity</h2><div class="section-note">Your learning journey at a glance</div></div><button class="text-link" data-view="exchanges">All requests →</button></div><div class="panel"><div class="activity-list">${recent.map(r=>`<div class="activity"><div class="activity-icon">⇄</div><div class="activity-text"><strong>${safe(personName(r.sender?.id===user?.id?r.receiver:r.sender))}</strong> · ${safe(skillName(r.offeredSkill))} for ${safe(skillName(r.requestedSkill))}<small>${safe(enumText(r.status||"PENDING"))} · ${safe(dateText(r.createdAt))}</small></div></div>`).join("")||empty("Your journey starts here","Send your first exchange request to connect with someone.","Discover skills","discover")}</div></div></div>
  <div><div class="section-row"><div><h2 class="section-title">Quick actions</h2><div class="section-note">Keep the momentum going</div></div></div><div class="quick-grid"><button class="quick-action" data-view="discover"><span>⌕</span><strong>Find a skill</strong><small>Browse the catalog</small></button><button class="quick-action" data-view="my-skills"><span>✳</span><strong>Add your skills</strong><small>Share your strengths</small></button><button class="quick-action" data-view="exchanges"><span>⇄</span><strong>Requests</strong><small>Manage exchanges</small></button><button class="quick-action" data-view="profile"><span>◎</span><strong>Your profile</strong><small>Tell your story</small></button></div><div class="section-row"><div><h2 class="section-title">Community members</h2><div class="section-note">People you could learn with</div></div><button class="text-link" data-view="discover">Meet them →</button></div><div class="list-stack">${state.users.filter(u=>u.id!==user?.id).slice(0,2).map(u=>`<div class="panel" style="display:flex;align-items:center;gap:10px;padding:13px"><div class="person-avatar">${safe(initials(u.name))}</div><div style="flex:1;min-width:0"><strong style="font-size:11px">${safe(u.name)}</strong><div class="muted" style="font-size:10px;margin-top:4px">Member #${safe(u.id)}</div></div><button class="icon-button" data-message-user="${safe(u.id)}">✉</button></div>`).join("")||`<div class="panel">${empty("Your community awaits","Other members appear here after they register.")}</div>`}</div></div></div>`;
}
function renderDiscover(){
 const query=state.discoverQuery.toLowerCase();
 const skills=state.skills.filter(s=>(`${s.name||""} ${s.description||""}`).toLowerCase().includes(query));
 const users=state.users.filter(u=>u.id!==state.user?.id&&(`${u.name||""} ${u.email||""}`).toLowerCase().includes(query));
 $("#view-discover").innerHTML=heading("FIND YOUR NEXT THING","Discover skills","Browse the community catalog and meet people who can help you learn something new.",`<button class="button button-primary" data-view="my-skills">+ Add my skills</button>`)
 +`<div class="toolbar"><div class="search-box"><span>⌕</span><input id="discover-search" placeholder="Search skills, people, or topics..." value="${safe(state.discoverQuery)}"></div><select class="field filter-select" id="discover-filter"><option value="ALL">All skills</option><option value="TEACH" ${state.discoverFilter==="TEACH"?"selected":""}>People teaching</option><option value="LEARN" ${state.discoverFilter==="LEARN"?"selected":""}>People learning</option></select></div>
 <div class="section-row"><div><h2 class="section-title">Skill library</h2><div class="section-note">${skills.length} skill${skills.length===1?"":"s"} available</div></div></div><div class="skill-grid">${skills.map(s=>skillCard(s)).join("")||empty("No matching skills","Try another search or add a skill to the library.")}</div>
 <div class="section-row"><div><h2 class="section-title">Meet the community</h2><div class="section-note">Connect with learners and teachers</div></div></div><div class="people-grid">${users.map(personCard).join("")||empty("No members found","Try another search or invite a friend.")}</div>`;
 const input=$("#discover-search");input?.addEventListener("input",e=>{state.discoverQuery=e.target.value;const pos=e.target.selectionStart;renderDiscover();const next=$("#discover-search");next.focus();next.setSelectionRange(pos,pos);});
 $("#discover-filter")?.addEventListener("change",e=>{state.discoverFilter=e.target.value;renderDiscover();});
}
function renderMySkills(){
 const my=state.userSkills.filter(s=>personId(s.user)===state.user?.id);
 const options=state.skills.map(s=>`<option value="${safe(s.id)}">${safe(s.name)}</option>`).join("");
 $("#view-my-skills").innerHTML=heading("YOUR TOOLKIT","My skills","Show the community what you can teach and what you're excited to learn.",`<button class="button button-secondary" data-view="profile">Edit profile</button>`)
 +`<div class="content-grid"><div class="panel"><div class="panel-header"><div><h3>Add a skill to your profile</h3><p>Choose a skill, your role, and your experience level.</p></div><span class="stat-icon">✳</span></div>
 ${!state.user?`<div class="empty-state">Sign in before adding skills.<br><button class="button button-primary button-small" data-auth="login">Sign in</button></div>`:
 `<form id="add-user-skill-form" class="form-stack"><label>Skill<select name="skillId" required>${options||'<option value="">No catalog skills — add a skill first</option>'}</select></label><label>I'm here to<select name="type" required><option value="TEACH">Teach this skill</option><option value="LEARN">Learn this skill</option></select></label><label>Experience level<select name="level" required><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></label><button class="button button-primary" type="submit">Add to my skills <span>→</span></button></form>`}
 <div class="divider"></div><div class="panel-header"><div><h3>Add a new catalog skill</h3><p>Make a skill available to the whole community.</p></div></div>
 <form id="add-catalog-skill-form" class="form-stack"><label>Skill name<input name="name" required maxlength="100" placeholder="e.g. Photography"></label><label>Description<textarea name="description" rows="2" maxlength="500" placeholder="What makes this skill useful?"></textarea></label><button class="button button-secondary" type="submit">Create catalog skill</button></form>
 </div><div><div class="section-row" style="margin-top:0"><div><h2 class="section-title">Your skill profile</h2><div class="section-note">${my.length} skill entries</div></div></div><div class="skill-grid" style="grid-template-columns:1fr">${my.map(s=>skillCard(s,{own:true})).join("")||empty("Your skill list is empty","Add a skill on the left to start building your profile.")}</div></div></div>`;
}
function renderExchanges(){
 const incoming=state.exchangeTab==="received";
 const list=incoming?state.receivedRequests:state.sentRequests;
 $("#view-exchanges").innerHTML=heading("LEARN TOGETHER","Exchange requests","Coordinate skill swaps, accept new connections, and keep track of each exchange.",`<button class="button button-primary" data-view="discover">Find people <span>→</span></button>`)
 +`<div class="pill-tabs"><button data-exchange-tab="received" class="${incoming?"active":""}">Received (${state.receivedRequests.length})</button><button data-exchange-tab="sent" class="${!incoming?"active":""}">Sent (${state.sentRequests.length})</button></div><div class="list-stack">${(list||[]).map(r=>requestCard(r,incoming)).join("")||empty(incoming?"No incoming requests":"No sent requests",incoming?"When someone wants to exchange skills with you, it will appear here.":"Find a community member and send your first request.","Discover skills","discover")}</div>`;
}
function renderMessages(){
 const msgs=state.messages||[];
 const otherUsers=[...new Map(msgs.map(m=>{const other=personId(m.sender)===state.user?.id?m.receiver:m.sender;return [personId(other),other]}).filter(([id,u])=>id&&u)).values()];
 const active=state.activeConversation||personId(otherUsers[0]);
 const other=otherUsers.find(u=>personId(u)===active);
 const conv=msgs.filter(m=>[personId(m.sender),personId(m.receiver)].includes(active)).sort((a,b)=>new Date(a.sendAt||0)-new Date(b.sendAt||0));
 $("#view-messages").innerHTML=heading("STAY CONNECTED","Messages","Keep your conversations going as you plan your next skill exchange.",`<button class="button button-primary" data-open-message>+ New message</button>`)
 +`<div class="panel message-layout"><div class="conversation-list">${otherUsers.map(u=>`<div class="conversation-item ${personId(u)===active?"active":""}" data-conversation="${safe(personId(u))}"><div class="person-avatar">${safe(initials(personName(u)))}</div><div><strong>${safe(personName(u))}</strong><small>Member #${safe(personId(u))}</small></div></div>`).join("")||empty("No conversations","Send a message to start connecting.")}</div><div class="chat-panel"><div class="chat-head">${other?safe(personName(other)):"Choose a conversation"} ${other?`<span class="muted"> · #${safe(personId(other))}</span>`:""}</div><div class="chat-messages">${conv.map(m=>`<div class="chat-bubble ${personId(m.sender)===state.user?.id?"mine":""}">${safe(m.message)}<div style="font-size:9px;opacity:.65;margin-top:5px">${safe(timeText(m.sendAt))}</div></div>`).join("")||`<div class="empty-state">No messages in this conversation yet.</div>`}</div>${other?`<form id="chat-compose" class="chat-compose"><input name="message" required maxlength="2000" placeholder="Write a message..." autocomplete="off"><button class="button button-primary" type="submit">Send →</button></form>`:""}</div></div>`;
}
function renderNotifications(){
 const list=state.notifications||[];
 $("#view-notifications").innerHTML=heading("YOUR UPDATES","Notifications","Important updates about your skill exchanges and community activity.",`<button class="button button-secondary" id="refresh-notifications">Refresh</button>`)
 +`<div class="list-stack">${list.map(n=>`<article class="notification-card"><div class="activity-icon">${n.read||n.isRead?"✓":"♧"}</div><div class="notification-content"><h3>${safe(n.title||"Community update")} ${!(n.read??n.isRead)?'<span class="tag learn">NEW</span>':""}</h3><p>${safe(n.message||"You have a new update.")}</p><div class="request-meta">${safe(dateText(n.createdAt))}</div><div class="request-actions">${!(n.read??n.isRead)?`<button class="button button-secondary button-small" data-notification-read="${safe(n.id)}">Mark as read</button>`:""}<button class="button button-danger button-small" data-notification-delete="${safe(n.id)}">Delete</button></div></div></article>`).join("")||empty("You're all caught up","New notifications will appear here.")}</div>`;
}
function renderProfile(){
 const u=state.user,p=state.profile||{};
 const my=state.userSkills.filter(s=>personId(s.user)===u?.id);
 $("#view-profile").innerHTML=heading("YOUR SPACE","My profile","Help the community understand who you are and what you'd like to learn.",`<button class="button button-secondary" data-view="my-skills">Manage skills</button>`)
 +`<div class="profile-layout"><div class="panel profile-card"><div class="profile-big-avatar">${safe(initials(u?.name))}</div><h2>${safe(u?.name||"Guest user")}</h2><p class="muted">${safe(u?.email||"Sign in to create your profile")}</p><div class="profile-stats"><div><strong>${my.filter(s=>(s.skillType||s.type)==="TEACH").length}</strong><small>Teaching</small></div><div><strong>${my.filter(s=>(s.skillType||s.type)==="LEARN").length}</strong><small>Learning</small></div><div><strong>${state.reviews.length}</strong><small>Reviews</small></div></div><div class="divider"></div><p class="muted" style="font-size:11px;line-height:1.7">${safe(p.bio||"Add a short bio to introduce yourself to the community.")}</p><p style="font-size:11px;color:#9299a8">⌖ ${safe(p.city||"Add your city")}</p><span class="tag">${p.available===false?"Not available":"Open to exchanges"}</span></div>
 <div class="panel"><div class="panel-header"><div><h3>Profile details</h3><p>Update your public profile and contact information.</p></div></div>
 ${!u?`<div class="empty-state">Sign in to manage your profile.<br><button class="button button-primary button-small" data-auth="login">Sign in</button></div>`:
 `<form id="profile-form" class="form-stack"><div class="form-grid"><label>Full name<input name="name" required value="${safe(u.name)}"></label><label>Email<input name="email" type="email" required value="${safe(u.email)}"></label><label>Phone<input name="phone" value="${safe(u.phone||"")}"></label><label>City<input name="city" value="${safe(p.city||"")}" placeholder="Your city"></label><label class="wide">Short bio<textarea name="bio" rows="4" maxlength="800" placeholder="Tell the community about yourself...">${safe(p.bio||"")}</textarea></label><label class="wide">Profile photo URL (optional)<input name="profilePhoto" type="url" value="${safe(p.profilePhoto||"")}" placeholder="https://..."></label><label class="wide" style="display:flex;align-items:center;gap:9px"><input style="width:auto" type="checkbox" name="available" ${p.available!==false?"checked":""}> I'm currently available for skill exchanges</label><label class="wide">Password (only fill to change it)<input name="password" type="password" autocomplete="new-password" placeholder="Leave blank to keep current password"></label></div><button class="button button-primary" type="submit">Save profile <span>→</span></button></form>`}</div></div>`;
}
function renderReviews(){
 const list=state.reviews||[];
 const average=list.length?(list.reduce((n,r)=>n+Number(r.rating||0),0)/list.length).toFixed(1):"—";
 $("#view-reviews").innerHTML=heading("TRUST & FEEDBACK","Reviews","Thoughtful feedback helps everyone find a great skill exchange partner.",`<button class="button button-primary" data-open-review>+ Write a review</button>`)
 +`<div class="content-grid"><div class="panel"><div class="panel-header"><div><h3>Your community rating</h3><p>Based on reviews returned by your backend</p></div><span class="stat-icon">☆</span></div><div class="rating-big">${safe(average)} <span class="review-stars">★★★★★</span></div><p class="muted" style="font-size:11px">${list.length} review${list.length===1?"":"s"} available</p></div><div class="panel"><h3 class="section-title">Leave meaningful feedback</h3><p class="page-subtitle">After an exchange, share what went well and help the next person feel confident connecting.</p><button class="button button-secondary" style="margin-top:18px" data-open-review>Write a review →</button></div></div><div class="section-row"><div><h2 class="section-title">Reviews</h2><div class="section-note">Feedback from your community</div></div></div><div class="list-stack">${list.map(r=>`<article class="review-card"><div class="person-avatar">${safe(initials(personName(r.reviewer)))}</div><div class="review-content"><h3>${safe(personName(r.reviewer))} <span class="muted-block">· ${safe(dateText(r.createdAt))}</span></h3><div class="review-stars">${"★".repeat(Math.max(0,Math.min(5,Number(r.rating)||0)))}${"☆".repeat(5-Math.max(0,Math.min(5,Number(r.rating)||0)))}</div><p>${safe(r.comment||"No written comment.")}</p></div></article>`).join("")||empty("No reviews yet","Your reviews will show up here once available.")}</div>`;
}
function renderView(view){
 if(view==="home")renderHome();
 if(view==="discover")renderDiscover();
 if(view==="my-skills")renderMySkills();
 if(view==="exchanges")renderExchanges();
 if(view==="messages")renderMessages();
 if(view==="notifications")renderNotifications();
 if(view==="profile")renderProfile();
 if(view==="reviews")renderReviews();
}
function openExchange(receiverId=null,skillIdValue=null){
 if(!requireLogin())return;
 const teach=state.userSkills.filter(s=>personId(s.user)===state.user.id&&(s.skillType||s.type)==="TEACH");
 const all=state.skills;
 const options=all.map(s=>`<option value="${safe(s.id)}">${safe(s.name)}</option>`).join("");
 $("#offered-skill").innerHTML=teach.length?teach.map(s=>`<option value="${safe(skillId(s))}">${safe(skillName(s))}</option>`).join(""):options;
 $("#requested-skill").innerHTML=options;
 const form=$("#exchange-form");form.receiverId.value=receiverId||"";
 if(skillIdValue)$("#requested-skill").value=skillIdValue;
 if(!teach.length)toast("Tip: add a TEACH skill under My skills before sending a request.","error");
 $("#exchange-dialog").showModal();
}
function openMessage(receiverId=null){if(!requireLogin())return;const f=$("#message-form");f.reset();f.receiverId.value=receiverId||"";$("#message-dialog").showModal();}
function openReview(){if(!requireLogin())return;$("#review-form").reset();$("#review-dialog").showModal();}
function closeDialog(id){const d=$(id);if(d?.open)d.close();}
async function handleAuth(e){
 e.preventDefault();const f=e.currentTarget;const data=Object.fromEntries(new FormData(f).entries());
 try{
  const mode=state.authMode;
  const u=await api(mode==="login"?"/users/login":"/users/register",{method:"POST",body:JSON.stringify(data)});
  if(!u?.id)throw new Error("The backend returned no user ID. Check the response in your browser's Network tab.");
  state.user={id:u.id,name:u.name,email:u.email,phone:u.phone};
  localStorage.setItem("skillSwapUser",JSON.stringify(state.user));
  closeDialog("#auth-dialog");f.reset();syncAccount();await refreshAndRender();showView("home");toast(mode==="login"?"Welcome back!":"Account created successfully!");
 }catch(err){toast(err.message,"error");}
}
async function handleAddUserSkill(e){
 e.preventDefault();if(!requireLogin())return;
 const f=e.currentTarget,d=Object.fromEntries(new FormData(f).entries());
 const payload={skillId:Number(d.skillId),type:d.type,level:d.level,userId:state.user.id};
 try{await api(`/userSkill/addSkill/${state.user.id}`,{method:"POST",body:JSON.stringify(payload)});toast("Skill added to your profile.");f.reset();await refreshAndRender();}
 catch(err){toast(err.message,"error");}
}
async function handleAddCatalogSkill(e){
 e.preventDefault();if(!requireLogin())return;
 const d=Object.fromEntries(new FormData(e.currentTarget).entries());
 try{
  if(!state.profile?.id) throw new Error("Create your profile first from My profile, then add a catalog skill.");
  await api(`/skill/add/${state.profile.id}`,{method:"POST",body:JSON.stringify(d.name)});
  toast("Skill created and added to your profile. The current backend's add endpoint stores the name but not the description.");
  e.currentTarget.reset();await refreshAndRender();
 }catch(err){toast(err.message,"error");}
}
async function handleExchange(e){
 e.preventDefault();if(!requireLogin())return;
 const d=Object.fromEntries(new FormData(e.currentTarget).entries());
 if(Number(d.receiverId)===Number(state.user.id)){toast("You cannot send an exchange request to yourself.","error");return;}
 const payload={senderId:Number(state.user.id),receiverId:Number(d.receiverId),offeredSkillId:Number(d.offeredSkillId),requestedSkillId:Number(d.requestedSkillId),message:d.message,status:"PENDING"};
 try{await api("/exchangeRequest",{method:"POST",body:JSON.stringify(payload)});closeDialog("#exchange-dialog");toast("Exchange request sent!");await refreshAndRender();showView("exchanges");}
 catch(err){toast(err.message,"error");}
}
async function handleMessage(e){
 e.preventDefault();if(!requireLogin())return;
 const d=Object.fromEntries(new FormData(e.currentTarget).entries());
 try{await api("/message",{method:"POST",body:JSON.stringify({senderId:Number(state.user.id),receiverId:Number(d.receiverId),message:d.message,isRead:false})});closeDialog("#message-dialog");toast("Message sent.");await refreshAndRender();state.activeConversation=Number(d.receiverId);showView("messages");}
 catch(err){toast(err.message,"error");}
}
async function handleChat(e){
 e.preventDefault();if(!requireLogin()||!state.activeConversation)return;
 const d=Object.fromEntries(new FormData(e.currentTarget).entries());
 try{await api("/message",{method:"POST",body:JSON.stringify({senderId:Number(state.user.id),receiverId:Number(state.activeConversation),message:d.message,isRead:false})});await refreshAndRender();state.activeConversation=Number(state.activeConversation);renderMessages();}
 catch(err){toast(err.message,"error");}
}
async function handleProfile(e){
 e.preventDefault();if(!requireLogin())return;
 const d=Object.fromEntries(new FormData(e.currentTarget).entries());
 const userPayload={name:d.name,email:d.email,phone:d.phone};
 if(d.password)userPayload.password=d.password;
 const profilePayload={bio:d.bio,city:d.city,profilePhoto:d.profilePhoto,available:!!d.available};
 try{
   await api(`/users/update/${state.user.id}`,{method:"PUT",body:JSON.stringify(userPayload)});
   if(state.profile?.id) await api(`/userProfile/update/${state.profile.id}`,{method:"PUT",body:JSON.stringify(profilePayload)});
   else await api(`/userProfile/createProfile/${state.user.id}`,{method:"POST",body:JSON.stringify(profilePayload)});
   state.user={...state.user,name:d.name,email:d.email,phone:d.phone};localStorage.setItem("skillSwapUser",JSON.stringify(state.user));
   toast("Profile updated.");await refreshAndRender();
 }catch(err){toast("Profile save failed: "+err.message,"error");}
}
async function handleReview(e){
 e.preventDefault();if(!requireLogin())return;
 const d=Object.fromEntries(new FormData(e.currentTarget).entries());
 try{await api("/review/create",{method:"POST",body:JSON.stringify({reviewer_id:Number(state.user.id),reviewed_user_id:Number(d.reviewed_user_id),rating:Number(d.rating),comment:d.comment})});closeDialog("#review-dialog");toast("Review published.");await refreshAndRender();showView("reviews");}
 catch(err){toast(err.message,"error");}
}
document.addEventListener("click",async e=>{
 const viewBtn=e.target.closest("[data-view]");if(viewBtn){e.preventDefault();showView(viewBtn.dataset.view);return;}
 const auth=e.target.closest("[data-auth]");if(auth){openAuth(auth.dataset.auth);return;}
 const mode=e.target.closest("[data-auth-mode]");if(mode){setAuthMode(mode.dataset.authMode);return;}
 if(e.target.closest("[data-open-message]")){openMessage();return;}
 if(e.target.closest("[data-open-review]")){openReview();return;}
 const requestUser=e.target.closest("[data-request-user]");if(requestUser){openExchange(Number(requestUser.dataset.requestUser));return;}
 const requestSkill=e.target.closest("[data-request-skill]");if(requestSkill){openExchange(null,Number(requestSkill.dataset.requestSkill));return;}
 const messageUser=e.target.closest("[data-message-user]");if(messageUser){openMessage(Number(messageUser.dataset.messageUser));return;}
 const tab=e.target.closest("[data-exchange-tab]");if(tab){state.exchangeTab=tab.dataset.exchangeTab;renderExchanges();return;}
 const conv=e.target.closest("[data-conversation]");if(conv){state.activeConversation=Number(conv.dataset.conversation);renderMessages();return;}
 const action=e.target.closest("[data-request-action]");if(action){
  const id=action.dataset.id,act=action.dataset.requestAction;
  try{await api(`/exchangeRequest/${act}/${id}`,{method:"PUT"});toast(`Request ${act==="accept"?"accepted":act==="reject"?"declined":"marked complete"}.`);await refreshAndRender();}
  catch(err){toast(err.message,"error");}return;
 }
 const mark=e.target.closest("[data-notification-read]");if(mark){try{await api(`/notification/markAsRead/${mark.dataset.notificationRead}`,{method:"PUT"});await refreshAndRender();toast("Notification marked as read.");}catch(err){toast(err.message,"error");}return;}
 const del=e.target.closest("[data-notification-delete]");if(del){if(!confirm("Delete this notification?"))return;try{await api(`/notification/delete/${del.dataset.notificationDelete}`,{method:"DELETE"});await refreshAndRender();toast("Notification deleted.");}catch(err){toast(err.message,"error");}return;}
 const remove=e.target.closest("[data-delete-userskill]");if(remove){if(!confirm("Remove this skill entry?"))return;try{await api(`/userSkill/delete/${remove.dataset.deleteUserskill}`,{method:"DELETE"});await refreshAndRender();toast("Skill entry removed.");}catch(err){toast(err.message,"error");}return;}
 if(e.target.closest("#refresh-notifications")){await refreshAndRender();return;}
});
document.addEventListener("submit",e=>{
 if(e.target.id==="add-user-skill-form")handleAddUserSkill(e);
 if(e.target.id==="add-catalog-skill-form")handleAddCatalogSkill(e);
 if(e.target.id==="profile-form")handleProfile(e);
 if(e.target.id==="chat-compose")handleChat(e);
});
$("#logout-btn").addEventListener("click",()=>{state.user=null;state.profile=null;state.userSkills=[];state.sentRequests=[];state.receivedRequests=[];state.notifications=[];state.messages=[];localStorage.removeItem("skillSwapUser");syncAccount();updateBadges();showView("home");toast("You have signed out.");});
$("#mobile-menu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
document.addEventListener("click",e=>{if($("#sidebar").classList.contains("open")&&!e.target.closest("#sidebar")&&!e.target.closest("#mobile-menu"))$("#sidebar").classList.remove("open");});
$("#auth-form").addEventListener("submit",handleAuth);
$("#exchange-form").addEventListener("submit",handleExchange);
$("#message-form").addEventListener("submit",handleMessage);
$("#review-form").addEventListener("submit",handleReview);

async function init(){
 try{const saved=localStorage.getItem("skillSwapUser");if(saved)state.user=JSON.parse(saved);}catch{}
 syncAccount();
 // load catalog, users, and user skill entries without requiring a login
 const [skills,users,userSkills]=await Promise.all([
  safeApi("/skill",{},[]),safeApi("/users",{},[]),safeApi("/userSkill",{},[])
 ]);
 state.skills=Array.isArray(skills)?skills:[];
 state.users=Array.isArray(users)?users:[];
 state.userSkills=Array.isArray(userSkills)?userSkills:[];
 if(state.user){
   // Verify that the saved user still exists; clear stale local state if not.
   const actual=await safeApi(`/users/${state.user.id}`,{},null);
   if(actual?.id)state.user={id:actual.id,name:actual.name,email:actual.email,phone:actual.phone};
   else {state.user=null;localStorage.removeItem("skillSwapUser");}
 }
 await loadCore();syncAccount();showView("home");
}
init();
