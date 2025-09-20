// common.js - shared helpers for Soul Sync pages
function navigate(href){ window.location.href = href; }

function toast(msg, timeout=2200){
  let t = document.createElement('div');
  t.innerText = msg;
  Object.assign(t.style,{position:'fixed',bottom:'24px',left:'50%',transform:'translateX(-50%)',
    background:'rgba(0,0,0,0.75)',color:'#fff',padding:'10px 16px',borderRadius:'12px',zIndex:9999});
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), timeout);
}

function saveJSON(key,obj){ localStorage.setItem(key, JSON.stringify(obj)); }
function loadJSON(key, fallback){ try{ const v = localStorage.getItem(key); return v?JSON.parse(v):fallback;}catch(e){return fallback;} }
