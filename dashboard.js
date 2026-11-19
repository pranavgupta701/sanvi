import {firebaseConfig,ownerUid} from './firebase-config.js';
const $=s=>document.querySelector(s);const message=s=>$('#status').textContent=s;
if(!firebaseConfig||!ownerUid){$('#setup').hidden=false;message('Setup pending. Your dashboard is not connected.');}
else boot().catch(()=>message('Could not connect to Firebase. Check your connection and project settings.'));
async function boot(){
  const [app,auth,db]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js')]);
  const instance=app.initializeApp(firebaseConfig,'owner'),a=auth.getAuth(instance),store=db.getFirestore(instance);
  await auth.setPersistence(a,auth.browserSessionPersistence);let unsubscribe,rows=[];
  const labels={started:'Opened the surprise',letter:'Opened the letter',date:'Picked a date',gate:'Opened the gate',bubble:'Popped a bubble',answer:'Answered the question'};
  const choices={movie:'PVR movie date',chai:'Chai & a rainy window',icecream:'Ice cream after dark',walk:'A walk with no plan',yes:'Yes ♡','0':'“baby”','1':'Those eyes','2':'Beside you','3':'Something real',last:'The final bubble'};
  function render(){const selected=$('#visitor').value,shown=rows.filter(r=>!selected||r.visitor===selected);$('#events').replaceChildren();$('#empty').hidden=shown.length>0;$('#date').textContent=choices[shown.find(r=>r.type==='date')?.value]??'No selection yet';$('#answer').textContent=shown.some(r=>r.type==='answer'&&r.value==='yes')?'Yes ♡':'No answer yet';shown.forEach(r=>{const tr=document.createElement('tr');[r.createdAt?.toDate().toLocaleString()??'Saving…',labels[r.type]??r.type,choices[r.value]??r.value,r.visitor.slice(0,8)].forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td)});$('#events').append(tr)})}
  $('#visitor').addEventListener('change',render);
  auth.onAuthStateChanged(a,user=>{
    unsubscribe?.();rows=[];$('#events').replaceChildren();$('#results').hidden=true;$('#login').hidden=!!user;
    if(!user){message('Sign in to view shared choices.');return;}
    if(user.uid!==ownerUid){message('This account is not the dashboard owner.');auth.signOut(a);return;}
    $('#results').hidden=false;message('Loading shared choices…');
    unsubscribe=db.onSnapshot(db.query(db.collectionGroup(store,'events'),db.orderBy('createdAt','desc'),db.limit(200)),snapshot=>{
      rows=snapshot.docs.map(d=>({...d.data(),visitor:d.ref.parent.parent.id}));const selected=$('#visitor').value;
      $('#visitor').replaceChildren(new Option('All browsers',''));[...new Set(rows.map(r=>r.visitor))].forEach(id=>$('#visitor').add(new Option(id.slice(0,8),id)));$('#visitor').value=selected;render();message('Connected · updates appear here automatically.');
    },()=>message('Could not read choices. Check the owner UID, Firestore rules and collection-group index.'));
  });
  $('#login').addEventListener('submit',async e=>{e.preventDefault();$('#signin').disabled=true;try{await auth.signInWithEmailAndPassword(a,$('#email').value,$('#password').value);$('#password').value=''}catch{message('Sign-in failed. Check your email and password.')}finally{$('#signin').disabled=false}});
  $('#logout').addEventListener('click',()=>auth.signOut(a));
}
