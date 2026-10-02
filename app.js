// JARVIS v1 - simple browser assistant. No server, no hardcoded key.
const $ = id => document.getElementById(id);
const chat = $("chat"), input = $("input"), statusEl = $("status");

const SYSTEM_PROMPT =
  "You are JARVIS, a smart, polite, witty AI assistant. The user is a young Indian student who writes in Hindi, English or Hinglish (Hindi in Roman letters). " +
  "Reply in the same language and style the user used. Address the user as 'boss'. Keep answers short and clear unless asked for detail. " +
  "You cannot control the device or send messages; if asked, say so honestly.";

const store = {
  get key(){ return localStorage.getItem("jarvis_key") || ""; },
  get model(){ return localStorage.getItem("jarvis_model") || "gemini-2.5-flash"; },
  get lang(){ return localStorage.getItem("jarvis_lang") || "hi-IN"; },
  get speak(){ return localStorage.getItem("jarvis_speak") !== "off"; }
};

let history = []; // session memory: {role:"user"|"model", parts:[{text}]}

function addMsg(text, cls){
  const d = document.createElement("div");
  d.className = "msg " + cls;
  d.textContent = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return d;
}

function speak(text){
  if(!store.speak || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[*_`#]/g, ""));
  u.lang = store.lang;
  speechSynthesis.speak(u);
}

async function ask(text){
  if(!store.key){
    addMsg("Boss, pehle Settings me Gemini API key daalo. README me likha hai kaise milti hai.", "err");
    return;
  }
  addMsg(text, "user");
  history.push({role:"user", parts:[{text}]});
  statusEl.textContent = "Soch raha hu...";
  $("sendBtn").disabled = true;
  try{
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(store.model)}:generateContent`;
    const res = await fetch(url, {
      method:"POST",
      headers:{"Content-Type":"application/json","x-goog-api-key":store.key},
      body:JSON.stringify({
        systemInstruction:{parts:[{text:SYSTEM_PROMPT}]},
        contents:history
      })
    });
    const data = await res.json();
    if(!res.ok){
      throw new Error(data?.error?.message || ("Error " + res.status));
    }
    const reply = data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("") || "";
    if(!reply) throw new Error("Khaali jawab aaya (shayad safety filter). Dusre tareeke se poochho.");
    history.push({role:"model", parts:[{text:reply}]});
    addMsg(reply, "bot");
    speak(reply);
  }catch(e){
    history.pop(); // failed question ko memory se hata do
    addMsg("Problem: " + e.message, "err");
  }finally{
    statusEl.textContent = "";
    $("sendBtn").disabled = false;
  }
}

function send(){
  const t = input.value.trim();
  if(!t) return;
  input.value = "";
  ask(t);
}
$("sendBtn").onclick = send;
input.addEventListener("keydown", e => { if(e.key === "Enter") send(); });

// ---- Voice input ----
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, listening = false;
if(!SR){
  $("micBtn").disabled = true;
  $("micBtn").title = "Is browser me mic support nahi. Chrome ya Edge use karo.";
} else {
  rec = new SR();
  rec.interimResults = true;
  rec.continuous = false;
  rec.onstart = () => { listening = true; $("micBtn").classList.add("listening"); statusEl.textContent = "Sun raha hu..."; };
  rec.onend = () => { listening = false; $("micBtn").classList.remove("listening"); if(statusEl.textContent === "Sun raha hu...") statusEl.textContent = ""; };
  rec.onerror = e => { statusEl.textContent = "Mic error: " + e.error + (e.error === "not-allowed" ? " (mic permission do)" : ""); };
  rec.onresult = e => {
    let t = "";
    for(const r of e.results) t += r[0].transcript;
    input.value = t;
    if(e.results[e.results.length-1].isFinal){ send(); }
  };
}
$("micBtn").onclick = () => {
  if(!rec) return;
  if(listening){ rec.stop(); return; }
  speechSynthesis.cancel();
  rec.lang = store.lang;
  try{ rec.start(); }catch(_){}
};

// ---- Settings ----
function refreshSpeakBtn(){ $("speakToggle").textContent = "🔊 Voice: " + (store.speak ? "ON" : "OFF"); }
$("speakToggle").onclick = () => {
  localStorage.setItem("jarvis_speak", store.speak ? "off" : "on");
  if(!store.speak) speechSynthesis.cancel();
  refreshSpeakBtn();
};
$("settingsBtn").onclick = () => {
  $("keyInput").value = store.key;
  $("modelInput").value = store.model;
  $("langSelect").value = store.lang;
  $("modal").classList.remove("hidden");
};
$("closeBtn").onclick = () => $("modal").classList.add("hidden");
$("saveBtn").onclick = () => {
  localStorage.setItem("jarvis_key", $("keyInput").value.trim());
  localStorage.setItem("jarvis_model", $("modelInput").value.trim() || "gemini-2.5-flash");
  localStorage.setItem("jarvis_lang", $("langSelect").value);
  $("modal").classList.add("hidden");
  addMsg("Settings save ho gayi, boss.", "bot");
};
$("clearBtn").onclick = () => { history = []; chat.innerHTML = ""; greet(); };

function greet(){
  addMsg(store.key
    ? "Namaste boss! Main JARVIS hu. Mic dabao ya type karo - kya poochna hai?"
    : "Namaste boss! Main JARVIS hu. Shuru karne se pehle ⚙ Settings me apni Gemini API key daalo (README me steps hain).", "bot");
}
refreshSpeakBtn();
greet();

// ---- PWA: offline shell ----
if("serviceWorker" in navigator){ window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(()=>{})); }
