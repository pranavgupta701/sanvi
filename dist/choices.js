import {firebaseConfig} from './firebase-config.js';
if(firebaseConfig){
  document.querySelectorAll('.choice-disclosure').forEach(e=>e.hidden=false);
  let connection;
  const connect=()=>connection??=Promise.all([
    import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js')
  ]).then(async([app,auth,db])=>{
    const instance=app.initializeApp(firebaseConfig,'visitor');const a=auth.getAuth(instance);
    await auth.setPersistence(a,auth.browserLocalPersistence);await a.authStateReady();
    const user=a.currentUser??(await auth.signInAnonymously(a)).user;
    return {db,store:db.getFirestore(instance),uid:user.uid};
  }).catch(error=>{connection=null;throw error});
  const pending=new Map();let flushing=false;
  const statuses=()=>document.querySelectorAll('.choice-save-status');
  function status(text){statuses().forEach(e=>e.textContent=text)}
  async function flush(){
    if(flushing||!pending.size)return;flushing=true;status('Sharing your choices…');
    try{
      const {db,store,uid}=await connect();
      for(const [id,event] of pending){await db.setDoc(db.doc(store,'visits',uid,'events',id),{...event,createdAt:db.serverTimestamp()});pending.delete(id)}
      status('Your choices have been shared with me. ♡');
    }catch{status('Your choices haven’t been shared yet. Tap to retry.');}
    finally{flushing=false}
  }
  document.addEventListener('sanvi-choice',e=>{pending.set(crypto.randomUUID(),{type:e.detail.type,value:String(e.detail.value??'')});flush()});
  statuses().forEach(e=>e.addEventListener('click',flush));window.addEventListener('online',flush);
}
