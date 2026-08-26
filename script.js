const TOTAL=9;let current=1;
const defs={
  sister:"https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1000&q=85",
  memory1:"https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=900&q=85",
  memory2:"https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=85",
  memory3:"https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85",
  memory4:"https://images.unsplash.com/photo-1499080863201-6e9d2d8f7f4a?auto=format&fit=crop&w=900&q=85"
};
const names=["sister","memory1","memory2","memory3","memory4"];
const dbName="rakhiPhotoDB", storeName="photos";
let db, objectUrls={};

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(dbName,1);
    req.onupgradeneeded=()=>req.result.createObjectStore(storeName);
    req.onsuccess=()=>{db=req.result;resolve(db)};
    req.onerror=()=>reject(req.error);
  });
}
function dbGet(key){
  return new Promise((resolve,reject)=>{
    const req=db.transaction(storeName,"readonly").objectStore(storeName).get(key);
    req.onsuccess=()=>resolve(req.result||null); req.onerror=()=>reject(req.error);
  });
}
function dbSet(key,val){
  return new Promise((resolve,reject)=>{
    const req=db.transaction(storeName,"readwrite").objectStore(storeName).put(val,key);
    req.onsuccess=resolve; req.onerror=()=>reject(req.error);
  });
}
function dbDelete(key){
  return new Promise((resolve,reject)=>{
    const req=db.transaction(storeName,"readwrite").objectStore(storeName).delete(key);
    req.onsuccess=resolve; req.onerror=()=>reject(req.error);
  });
}
function pos(n){return localStorage.getItem('rbp_'+n)||'50% 50%'}
function photoSrc(n,blob){
  if(objectUrls[n]){URL.revokeObjectURL(objectUrls[n]);delete objectUrls[n]}
  if(blob){objectUrls[n]=URL.createObjectURL(blob);return objectUrls[n]}
  return defs[n];
}
async function apply(){
  for(const n of names){
    const blob=await dbGet(n);
    const src=photoSrc(n,blob);
    document.querySelectorAll('.photo').forEach(i=>{if(i.dataset.photo===n){i.src=src;i.style.objectPosition=pos(n)}});
    const p=document.getElementById('pr_'+n);
    if(p){p.style.backgroundImage=`url("${src}")`;p.style.backgroundPosition=pos(n);p.classList.add("has-image")}
    const s=document.getElementById('p_'+n); if(s) s.value=pos(n);
  }
}
function compress(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error("Could not read this image."));
    reader.onload=()=>{
      const img=new Image();
      img.onerror=()=>reject(new Error("This image format is not supported by this browser."));
      img.onload=()=>{
        const max=1600, scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
        const canvas=document.createElement("canvas");
        canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
        canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
        canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
        canvas.toBlob(b=>b?resolve(b):reject(new Error("Could not prepare the image.")),"image/jpeg",.78);
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded",async()=>{
  const editor=document.getElementById('editor');
  document.getElementById('edit').onclick=()=>editor.classList.add('open');
  document.getElementById('close').onclick=()=>editor.classList.remove('open');
  const controls=document.getElementById('photoControls');

  try{await openDB();}catch(e){
    document.getElementById('status').textContent="Your browser does not allow local photo storage. Use Chrome/Edge/Safari.";
  }

  for(let i=0;i<names.length;i++){
    const n=names[i];
    controls.insertAdjacentHTML('beforeend',`<div class="control"><label>${i+1}. ${n==='sister'?'Sister / Hero Photo':'Memory Photo '+i}<small>Choose a photo from your computer</small></label><input id="f_${n}" type="file" accept="image/*"><div class="preview" id="pr_${n}"></div><select id="p_${n}"><option value="50% 50%">Center</option><option value="50% 20%">Top</option><option value="50% 80%">Bottom</option><option value="20% 50%">Left</option><option value="80% 50%">Right</option></select></div>`);
    const f=document.getElementById('f_'+n), s=document.getElementById('p_'+n);
    f.addEventListener('change',async()=>{
      if(!f.files[0]) return;
      const status=document.getElementById('status'); status.textContent="Adding photo…";
      try{
        if(!db) await openDB();
        const blob=await compress(f.files[0]);
        await dbSet(n,blob);
        await apply();
        status.textContent="Photo added ✓";
      }catch(e){
        status.textContent="Could not add photo: "+e.message;
        f.value="";
      }
    });
    s.addEventListener('change',()=>{localStorage.setItem('rbp_'+n,s.value);apply();document.getElementById('status').textContent="Crop position updated ✓"});
  }

  document.getElementById('save').onclick=async()=>{
    await apply();
    document.getElementById('status').textContent="Saved ✓ Your photos are stored on this device.";
  };
  document.getElementById('reset').onclick=async()=>{
    for(const n of names){await dbDelete(n);localStorage.removeItem('rbp_'+n);document.getElementById('f_'+n).value="";document.getElementById('p_'+n).value="50% 50%"}
    await apply();
    document.getElementById('status').textContent="Reset ✓ You can upload the photos again.";
  };
  await apply();
  dots();
});

function dots(){let d=document.getElementById('dots');d.innerHTML='';for(let i=1;i<=TOTAL;i++){let x=document.createElement('span');x.className=i===current?'active':'';d.appendChild(x)}}
function go(n){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.querySelector(`[data-s="${n}"]`).classList.add('active');current=n;dots()}
function gift(n){let m={1:'A little Rakhi happiness is coming your way ❤️',2:'You deserve the Best Sister Award 🏅',3:'Okay fine... the REAL surprise starts now ✨'};document.getElementById('hint').textContent=m[n];if(n===3)setTimeout(()=>go(5),850)}

const namesEditor=document.getElementById("namesEditor");
const namesToggle=document.getElementById("namesToggle");
const closeNames=document.getElementById("closeNames");
const saveNames=document.getElementById("saveNames");
const resetNames=document.getElementById("resetNames");
const sisterNameInput=document.getElementById("sisterName");
const yourNameInput=document.getElementById("yourName");
const sisterNameDisplay=document.getElementById("sisterNameDisplay");
const yourNameDisplay=document.getElementById("yourNameDisplay");
const nameNote=document.getElementById("nameNote");

function applyNames(){
  const sister=localStorage.getItem("rakhi_sister_name")||"Ritika";
  const you=localStorage.getItem("rakhi_your_name")||"Mainak";
  sisterNameInput.value=sister==="[SISTER'S NAME]"?"":sister;
  yourNameInput.value=you==="[YOUR NAME]"?"":you;
  sisterNameDisplay.textContent=sister;
  yourNameDisplay.textContent=you;
}
namesToggle.addEventListener("click",()=>namesEditor.classList.add("open"));
closeNames.addEventListener("click",()=>namesEditor.classList.remove("open"));
saveNames.addEventListener("click",()=>{
  localStorage.setItem("rakhi_sister_name",sisterNameInput.value.trim()||"Ritika");
  localStorage.setItem("rakhi_your_name",yourNameInput.value.trim()||"Mainak");
  applyNames(); nameNote.textContent="Names saved ✓";
});
resetNames.addEventListener("click",()=>{
  localStorage.setItem("rakhi_sister_name","Ritika");
  localStorage.setItem("rakhi_your_name","Mainak");
  applyNames(); nameNote.textContent="Names reset to Ritika & Mainak.";
});
applyNames();
