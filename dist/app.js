const $=s=>document.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let soundOn=false,audioCtx,toastTimer;
function chime(){if(!soundOn)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();[523.25,659.25,783.99,1046.5].forEach((freq,i)=>{const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),t=audioCtx.currentTime+i*.13;osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.08,t+.02);gain.gain.exponentialRampToValueAtTime(.001,t+1);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(t);osc.stop(t+1);});}catch{soundOn=false;}}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
function confetti(){chime();if(reduced)return;const colors=['#aa2446','#e9ad4d','#f09cbd','#fff8ee'];for(let i=0;i<65;i++){const p=document.createElement('span');p.className='confetti-piece';p.textContent=['✦','♡','●','✧'][i%4];p.style.setProperty('--x',Math.random()*100+'%');p.style.setProperty('--color',colors[i%4]);p.style.setProperty('--duration',2+Math.random()*2+'s');p.style.setProperty('--drift',Math.random()*200-100+'px');p.style.animationDelay=Math.random()*.4+'s';$('#confetti').append(p);setTimeout(()=>p.remove(),4500);}}
$('#celebrate').addEventListener('click',()=>{confetti();$('#celebrate').innerHTML='My princess, always <span>♛</span>';toast('Sanvi, you’ve had my heart. Now here’s your crown. ♡');});
$('#open-letter').addEventListener('click',()=>{chime();$('#letter-dialog').showModal();$('#letter-dialog').scrollTop=0;$('#love-letter-title').focus({preventScroll:true});});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
const compliments=["I don’t need every moment with you to be special. I just want you in the ordinary ones, too.", "If I could give you one thing today, it would be a glimpse of how lovely you are to me.", "I want to be the person you can tell the smallest, silliest thing to. I’ll want to hear it.", "I love you, baby girl. And yes, I’m going to keep finding little ways to tell you.", "Out of everything I could have made today, making you smile was what mattered to me."];let complimentIndex=0;
$('#extra').addEventListener('click',()=>{$('#compliment').textContent=compliments[complimentIndex++%compliments.length];chime();});

const chapters=[...document.querySelectorAll('main > section')];
const chapterLabels=['My little surprise for you','My letter to you','A little piece of my heart','With all my love','I saved a surprise for you','I want to ask you something'];
let chapter=0;
const chapterNav=document.createElement('div');
chapterNav.className='chapter-nav';chapterNav.setAttribute('role','group');chapterNav.setAttribute('aria-label','Continue your Princess Day journey');
chapterNav.innerHTML='<button type="button" id="playful-back">Wanna go back? ♡</button><span class="chapter-progress" aria-live="polite"></span><button type="button" id="chapter-next">Read my letter ♡</button>';
document.querySelector('main').after(chapterNav);
function showChapter(index,focus=true){cancelHeartHold();chapter=Math.max(0,Math.min(chapters.length-1,index));chapters.forEach((section,i)=>{section.hidden=i!==chapter;if(i===chapter)section.scrollTop=0;});$('.chapter-progress').textContent=chapterLabels[chapter];$('#chapter-next').textContent=['Read my letter ♡','A little piece of my heart ♡','One more thing, Sanvi ♡','I have one more surprise ✧','',''][chapter];chapterNav.hidden=chapter===0||chapter>=4;document.body.classList.toggle('night-scene',chapter>=4);document.querySelector('meta[name="theme-color"]').content=chapter>=4?'#100d1b':'#fbe3ee';if(chapter===4)resetFinale();if(focus){const heading=chapters[chapter].querySelector('h1,h2');heading.tabIndex=-1;heading.classList.add('chapter-title');heading.focus({preventScroll:true});}}
$('#playful-back').addEventListener('click',()=>{chime();$('#stay-dialog').showModal();});
$('#chapter-next').addEventListener('click',()=>showChapter((chapter+1)%chapters.length));
document.querySelectorAll('a[href="#letter"],a[href="#wishes"],a.brand').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showChapter(link.hash==='#letter'?1:link.hash==='#wishes'?2:0);}));
$('#celebrate').addEventListener('click',()=>showChapter(1));
let doorTimer;
function resetFinale(){resetBubbles();clearTimeout(doorTimer);$('#secret-door').classList.remove('is-opening');$('#open-door').disabled=false;$('#door-status').textContent='Go on, baby girl. I made this moment for you.';$('#proposal-question').hidden=false;$('#proposal-answer').hidden=true;$('#answer-note').textContent='';}
$('#open-door').addEventListener('click',()=>{if($('#open-door').disabled)return;$('#open-door').disabled=true;$('#secret-door').classList.add('is-opening');$('#door-status').textContent='Come on in, Sanvi. I’m right here.';chime();doorTimer=setTimeout(()=>showChapter(5),reduced?0:1900);});
$('#say-yes').addEventListener('click',()=>{if(!lastBubbleOpened)return;$('#proposal-question').hidden=true;$('#proposal-answer').hidden=false;$('#yes-heading').focus({preventScroll:true});$('#proposal').scrollTop=0;confetti();});
$('#talk-first').addEventListener('click',()=>{$('#answer-note').textContent='Take your time, darling. I want to hear your heart, too. ♡';});
$('#replay').addEventListener('click',()=>{resetFinale();resetHeart();showChapter(0);});
const heartScene=$('#wishes'),heartButton=$('#heart-reveal');
let heartFrame=0,heartOpened=false,heartStart=0;
function cancelHeartHold(){
  cancelAnimationFrame(heartFrame);heartFrame=0;
  heartScene.classList.remove('is-holding');
  if(!heartOpened)heartButton.style.setProperty('--heart-progress',0);
}
function openHeart(){
  if(heartOpened||chapter!==2)return;
  heartOpened=true;cancelHeartHold();
  heartButton.style.setProperty('--heart-progress',1);
  heartScene.classList.add('is-revealed');
  heartButton.setAttribute('aria-expanded','true');
  heartButton.setAttribute('aria-label','Sanvi, you are in my heart');
  $('#heart-heading').innerHTML='You, my darling.<br><em>Always you.</em>';
  $('#heart-hint').textContent='Every little beat has your name on it.';
  $('.heart-message').textContent='It’s you, Sanvi. Always you. ♡';
  chime();
}
function startHeartHold(event){
  if(heartOpened||event.button!==0)return;
  cancelHeartHold();heartStart=performance.now();
  heartScene.classList.add('is-holding');
  const tick=now=>{
    const progress=Math.min(1,(now-heartStart)/1200);
    heartButton.style.setProperty('--heart-progress',progress);
    if(progress===1)openHeart();else heartFrame=requestAnimationFrame(tick);
  };
  heartFrame=requestAnimationFrame(tick);
}
function resetHeart(){
  heartOpened=false;cancelHeartHold();heartScene.classList.remove('is-revealed');
  heartButton.setAttribute('aria-expanded','false');
  heartButton.setAttribute('aria-label','Open my heart, Sanvi');
  $('#heart-heading').innerHTML='A little piece<br>of <em>my heart.</em>';
  $('#heart-hint').textContent='Hold my heart… or tap to peek.';
  $('.heart-message').textContent='';
}
heartButton.addEventListener('pointerdown',startHeartHold);
['pointerup','pointercancel','pointerleave'].forEach(type=>heartButton.addEventListener(type,cancelHeartHold));
heartButton.addEventListener('click',openHeart);
window.addEventListener('blur',cancelHeartHold);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelHeartHold();});
// Each bubble leaves a short promise behind; the last one is a separate reveal.
const littlePromises=[
  ['I want to be a reason', 'you laugh like that.'],
  ['When the day feels heavy,', 'I want to hold your hand.'],
  ['Tell me the smallest thing.', 'I’ll still want to hear it.'],
  ['When I picture tomorrow,', 'I keep looking for you.']
];
const poppedBubbles=new Set();
let lastBubbleOpened=false;
const bubbleTimers=new Set();
function bubbleLater(fn,delay){const timer=setTimeout(()=>{bubbleTimers.delete(timer);fn();},delay);bubbleTimers.add(timer);}
function burstBubble(button){
  if(reduced)return;
  const garden=$('.bubble-garden').getBoundingClientRect(),box=button.getBoundingClientRect();
  const burst=document.createElement('span');burst.className='bubble-burst';
  burst.style.left=(box.x-garden.x+box.width/2)+'px';burst.style.top=(box.y-garden.y+box.height/2)+'px';
  for(let i=0;i<12;i++){
    const drop=document.createElement('i'),angle=i*Math.PI/6;
    drop.style.setProperty('--dx',Math.cos(angle)*(60+i%3*18)+'px');
    drop.style.setProperty('--dy',Math.sin(angle)*(60+i%3*18)+'px');
    burst.append(drop);
  }
  $('.bubble-bursts').append(burst);bubbleLater(()=>burst.remove(),1000);
}
function popLoveBubble(button){
  const index=Number(button.dataset.promise);
  if(poppedBubbles.has(index)||chapter!==5)return;
  poppedBubbles.add(index);burstBubble(button);button.disabled=true;button.classList.add('is-popped');
  $('#promise-invitation').hidden=true;
  const line=document.createElement('p');line.className='promise-line';
  const plain=document.createElement('span');plain.textContent=littlePromises[index][0];
  const emphasis=document.createElement('em');emphasis.textContent=littlePromises[index][1];
  line.append(plain,emphasis);$('#promise-lines').append(line);
  const remaining=4-poppedBubbles.size;
  $('#bubble-progress').textContent=remaining===0?'I saved my biggest wish for last.':remaining===1?'One little promise left, darling.':remaining+' little promises still floating…';
  if(!remaining){$('#last-bubble').hidden=false;$('#promise-signature').hidden=false;$('.bubble-garden').classList.add('last-wish-ready');}
  const next=remaining?document.querySelector('.love-bubble[data-promise]:not(:disabled)'):$('#last-bubble');
  next.focus({preventScroll:true});
}
function revealLastBubble(){
  if(poppedBubbles.size!==4||lastBubbleOpened)return;
  lastBubbleOpened=true;burstBubble($('#last-bubble'));$('#last-bubble').classList.add('is-popped');
  $('#last-bubble').disabled=true;$('#proposal').classList.add('final-unfolding');
  bubbleLater(()=>{
    $('#bubble-chapter').hidden=true;$('#bubble-progress').hidden=true;$('.bubble-intro').hidden=true;
    $('#final-confession').hidden=false;$('#proposal').classList.add('confession-open');
    $('#confession-question').focus({preventScroll:true});
  },reduced?0:650);
}
function resetBubbles(){
  bubbleTimers.forEach(clearTimeout);bubbleTimers.clear();poppedBubbles.clear();lastBubbleOpened=false;
  $('#proposal').classList.remove('final-unfolding','confession-open');
  $('#promise-lines').replaceChildren();$('.bubble-bursts').replaceChildren();
  $('#promise-invitation').hidden=false;$('#promise-signature').hidden=true;
  $('#last-bubble').hidden=true;$('.bubble-garden').classList.remove('last-wish-ready');
  document.querySelectorAll('.love-bubble').forEach(button=>{button.disabled=false;button.classList.remove('is-popped');});
  $('#bubble-chapter').hidden=false;$('.bubble-intro').hidden=false;$('#bubble-progress').hidden=false;
  $('#bubble-progress').textContent='Four little bubbles. A heart full of you.';$('#final-confession').hidden=true;
}
document.querySelectorAll('[data-promise]').forEach(button=>button.addEventListener('click',()=>popLoveBubble(button)));
$('#last-bubble').addEventListener('click',revealLastBubble);
$('#read-promises').addEventListener('click',()=>{resetBubbles();$('#answer-note').textContent='';document.querySelector('[data-promise]').focus({preventScroll:true});});
showChapter(0,false);
