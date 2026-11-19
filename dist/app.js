function shareChoice(type,value=''){document.dispatchEvent(new CustomEvent('sanvi-choice',{detail:{type,value}}));}
const $=s=>document.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let soundOn=false,audioCtx,toastTimer;
function chime(){if(!soundOn)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();[523.25,659.25,783.99,1046.5].forEach((freq,i)=>{const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),t=audioCtx.currentTime+i*.13;osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.08,t+.02);gain.gain.exponentialRampToValueAtTime(.001,t+1);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(t);osc.stop(t+1);});}catch{soundOn=false;}}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
function confetti(){chime();if(reduced)return;const colors=['#aa2446','#e9ad4d','#f09cbd','#fff8ee'];for(let i=0;i<65;i++){const p=document.createElement('span');p.className='confetti-piece';p.textContent=['✦','♡','●','✧'][i%4];p.style.setProperty('--x',Math.random()*100+'%');p.style.setProperty('--color',colors[i%4]);p.style.setProperty('--duration',2+Math.random()*2+'s');p.style.setProperty('--drift',Math.random()*200-100+'px');p.style.animationDelay=Math.random()*.4+'s';$('#confetti').append(p);setTimeout(()=>p.remove(),4500);}}
let openingTimer;
function resetOpening(){
  clearTimeout(openingTimer);$('.royal-hero').classList.remove('is-crowning');
  $('#celebrate').disabled=false;$('.royal-button-label').textContent='Let me crown you';$('#opening-status').textContent='';
}
$('#celebrate').addEventListener('click',()=>{
  if($('#celebrate').disabled||chapter!==0)return;
  shareChoice('started');$('#celebrate').disabled=true;$('.royal-hero').classList.add('is-crowning');
  $('.royal-button-label').textContent='There’s my princess';$('#opening-status').textContent='Your royal treatment starts now, Sanvi.';
  chime();openingTimer=setTimeout(()=>showChapter(1),reduced?0:1450);
});
$('#open-letter').addEventListener('click',()=>{chime();shareChoice('letter');$('#letter-dialog').showModal();$('#letter-dialog').scrollTop=0;$('#love-letter-title').focus({preventScroll:true});});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
const chapters=[...document.querySelectorAll('main > section')];
const gateIndex=chapters.indexOf($('#secret-door')),proposalIndex=chapters.indexOf($('#proposal'));
const chapterLabels=['My little surprise for you','My letter to you','Our first little adventure','I saved a surprise for you','I want to ask you something'];
let chapter=0;
const chapterNav=document.createElement('div');
chapterNav.className='chapter-nav';chapterNav.setAttribute('role','group');chapterNav.setAttribute('aria-label','Continue your Princess Day journey');
chapterNav.innerHTML='<button type="button" id="playful-back">Wanna go back? ♡</button><span class="chapter-progress" aria-live="polite"></span><button type="button" id="chapter-next">Read my letter ♡</button>';
document.querySelector('main').after(chapterNav);
function showChapter(index,focus=true){chapter=Math.max(0,Math.min(chapters.length-1,index));chapters.forEach((section,i)=>{section.hidden=i!==chapter;if(i===chapter)section.scrollTop=0;});$('.chapter-progress').textContent=chapterLabels[chapter];$('#chapter-next').textContent=['Read my letter ♡','Let’s make a little plan','I saved one more surprise ✧','',''][chapter];chapterNav.hidden=chapter===0||chapter>=gateIndex;document.body.classList.toggle('night-scene',chapter>=gateIndex);document.querySelector('meta[name="theme-color"]').content=chapter>=gateIndex?'#100d1b':'#fbe3ee';if(chapter===gateIndex)resetFinale();if(chapter>1){clearTimeout(toastTimer);$('#toast').classList.remove('visible');$('#confetti').replaceChildren();}if(focus){const heading=chapters[chapter].querySelector('h1,h2');heading.tabIndex=-1;heading.classList.add('chapter-title');heading.focus({preventScroll:true});}}
$('#playful-back').addEventListener('click',()=>{chime();$('#stay-dialog').showModal();});
$('#chapter-next').addEventListener('click',()=>showChapter((chapter+1)%chapters.length));
document.querySelectorAll('a[href="#letter"],a[href="#wishes"],a.brand').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showChapter(link.hash==='#letter'?1:link.hash==='#wishes'?2:0);}));
let doorTimer;
function resetFinale(){resetBubbles();clearTimeout(doorTimer);$('#secret-door').classList.remove('is-opening');$('#open-door').disabled=false;$('#door-status').textContent='Go on, baby girl. I made this moment for you.';$('#proposal-question').hidden=false;$('#proposal-answer').hidden=true;}
$('#open-door').addEventListener('click',()=>{if($('#open-door').disabled)return;shareChoice('gate');$('#open-door').disabled=true;$('#secret-door').classList.add('is-opening');$('#door-status').textContent='Come on in, Sanvi. I’m right here.';chime();doorTimer=setTimeout(()=>showChapter(proposalIndex),reduced?0:1900);});
$('#say-yes').addEventListener('click',()=>{if(!lastBubbleOpened||$('#say-yes').disabled)return;shareChoice('answer','yes');$('#proposal-question').hidden=true;$('#proposal-answer').hidden=false;$('#yes-heading').focus({preventScroll:true});$('#proposal').scrollTop=0;confetti();});
$('#replay').addEventListener('click',()=>{resetFinale();resetAdventure();resetOpening();showChapter(0);});
const datePlans={
  movie:{title:'Big screen.<br><em>Better company.</em>',note:'You pick the movie.<br>I’m hoping you’ll let me hold your hand.',caption:'Bas tum paas baithna. I might forget the plot. ♡'},
  icecream:{title:'Two scoops.<br><em>Zero hurry.</em>',note:'I’ll get the ice cream. You pick the flavours.<br>Yes, we can swap halfway through.',caption:'Excellent choice, cuto. I’m still asking for a bite.'},
  chai:{title:'A little rain.<br><em>A little chai.</em>',note:'I’ll save the window seat for you.<br>We can let the rest of the day wait.',caption:'Your window seat awaits, my highness.'},
  walk:{title:'No map.<br><em>Good company.</em>',note:'I’ll walk with you until we find somewhere worth stopping.<br>A snack stop absolutely counts.',caption:'You pick the direction. I’ll find the snacks.'}
};
function chooseAdventure(button){
  const plan=datePlans[button.dataset.date],isMovie=button.dataset.date==='movie';
  $('.date-ticket').classList.toggle('movie-ticket',isMovie);
  $('#ticket-brand').textContent=isMovie?'PVR':'ONE LITTLE ADVENTURE';
  $('#ticket-category').textContent=isMovie?'MOVIE DATE INVITATION':'JUST US TWO';
  $('#ticket-detail-label').textContent=isMovie?'OUR SEATS':'WHEN';
  $('#ticket-detail').textContent=isMovie?'You + me, side by side':'When we’re both free';
  document.querySelectorAll('[data-date]').forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
  $('#ticket-title').innerHTML=plan.title;$('#ticket-note').innerHTML=plan.note;
  $('#ticket-kicker').textContent='OUR LITTLE PLAN';$('#ticket-stamp').innerHTML=isMovie?'MOVIE<br><strong>DATE ♡</strong>':'IT’S A<br><strong>DATE ♡</strong>';
  $('#date-status').textContent=plan.caption;$('#adventure').classList.add('has-date');
  const ticket=$('.date-ticket');ticket.classList.remove('ticket-printing');void ticket.offsetWidth;ticket.classList.add('ticket-printing');
}
function resetAdventure(){
  chooseAdventure(document.querySelector('[data-date="movie"]'));
  $('.date-ticket').classList.remove('ticket-printing');
}
document.querySelectorAll('[data-date]').forEach(button=>button.addEventListener('click',()=>{chooseAdventure(button);shareChoice('date',button.dataset.date)}));
// Each bubble leaves a short promise behind; the last one is a separate reveal.
const littlePromises=[
  ['You call me “baby.”', 'I forget how to act normal.'],
  ['Those eyes. Those soft lips.', 'My first-meeting distraction.'],
  ['If your day gets heavy,', 'I want to listen, baby girl.'],
  ['One Bumble match.', 'A real beginning, I hope.']
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
  if(poppedBubbles.has(index)||chapter!==proposalIndex)return;
  shareChoice('bubble',index);poppedBubbles.add(index);burstBubble(button);button.disabled=true;button.classList.add('is-popped');
  $('#promise-invitation').hidden=true;
  const line=document.createElement('p');line.className='promise-line';
  const plain=document.createElement('span');plain.textContent=littlePromises[index][0];
  const emphasis=document.createElement('em');emphasis.textContent=littlePromises[index][1];
  line.append(plain,emphasis);$('#promise-lines').append(line);
  const remaining=4-poppedBubbles.size;
  $('#bubble-progress').textContent=remaining===0?'I saved my biggest wish for last.':remaining===1?'One little confession left, cutieee.':remaining+' little confessions still floating…';
  if(!remaining){$('#last-bubble').hidden=false;$('#promise-signature').hidden=false;$('.bubble-garden').classList.add('last-wish-ready');}
  const next=remaining?document.querySelector('.love-bubble[data-promise]:not(:disabled)'):$('#last-bubble');
  next.focus({preventScroll:true});
}
function revealLastBubble(){
  if(poppedBubbles.size!==4||lastBubbleOpened)return;
  shareChoice('bubble','last');lastBubbleOpened=true;burstBubble($('#last-bubble'));$('#last-bubble').classList.add('is-popped');
  $('#last-bubble').disabled=true;$('#proposal').classList.add('final-unfolding');
  bubbleLater(()=>{
    $('#bubble-chapter').hidden=true;$('#bubble-progress').hidden=true;$('.bubble-intro').hidden=true;
    $('#final-confession').hidden=false;$('#proposal').classList.add('confession-open');
    startWriting();
  },reduced?0:650);
}
function resetBubbles(){
  resetWriting();
  bubbleTimers.forEach(clearTimeout);bubbleTimers.clear();poppedBubbles.clear();lastBubbleOpened=false;
  $('#proposal').classList.remove('final-unfolding','confession-open');
  $('#promise-lines').replaceChildren();$('.bubble-bursts').replaceChildren();
  $('#promise-invitation').hidden=false;$('#promise-signature').hidden=true;
  $('#last-bubble').hidden=true;$('.bubble-garden').classList.remove('last-wish-ready');
  document.querySelectorAll('.love-bubble').forEach(button=>{button.disabled=false;button.classList.remove('is-popped');});
  $('#bubble-chapter').hidden=false;$('.bubble-intro').hidden=false;$('#bubble-progress').hidden=false;
  $('#bubble-progress').textContent='Four little confessions. All your doing.';$('#final-confession').hidden=true;
}
document.querySelectorAll('[data-promise]').forEach(button=>button.addEventListener('click',()=>popLoveBubble(button)));
$('#last-bubble').addEventListener('click',revealLastBubble);
// Ink follows a fountain-pen nib; the answer is enabled only after the final line.
let writingFrame=0,writingRun=0,writingWords=[];
const writingTargets=['.confession-whisper','#final-confession h3','.confession-promise','.confession-question','.confession-footnote'];
function prepareWriting(){
  writingTargets.forEach(selector=>{
    const el=$(selector);el.setAttribute('aria-label',el.textContent);
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{
      if(!word.trim()){fragment.append(document.createTextNode(word));return;}
      const shell=document.createElement('span');shell.className='ink-word';shell.setAttribute('aria-hidden','true');
      const fill=document.createElement('span');fill.className='ink-fill';fill.textContent=word;shell.append(fill);fragment.append(shell);writingWords.push({shell,fill,duration:Math.max(130,word.length*46)});
    });node.replaceWith(fragment);});
  });
}
function resetWriting(){
  writingRun++;cancelAnimationFrame(writingFrame);$('#final-confession').classList.remove('is-writing','writing-complete');
  $('#say-yes').disabled=true;$('#writing-skip').hidden=true;$('#writing-status').textContent='';
  writingWords.forEach(({fill})=>fill.style.clipPath='inset(0 100% 0 0)');
}
function finishWriting(){
  writingRun++;cancelAnimationFrame(writingFrame);writingWords.forEach(({fill})=>fill.style.clipPath='inset(0 0% 0 0)');
  $('#final-confession').classList.remove('is-writing');$('#final-confession').classList.add('writing-complete');
  const wasSkip=document.activeElement===$('#writing-skip');$('#writing-skip').hidden=true;$('#say-yes').disabled=false;
  $('#writing-status').textContent='My question is yours to answer, Sanvi.';
  if(wasSkip)$('#say-yes').focus({preventScroll:true});
}
async function startWriting(){
  resetWriting();const run=writingRun;
  $('#final-confession').classList.add('is-writing');
  if(reduced){finishWriting();return;}
  $('#writing-skip').hidden=false;$('#writing-status').textContent='A few words, written just for you.';
  await document.fonts.ready;if(run!==writingRun)return;
  let index=0,start;const pen=$('#writing-pen');
  function draw(now){
    if(run!==writingRun)return;if(start===undefined)start=now+250;
    const word=writingWords[index];if(!word){finishWriting();return;}
    const progress=Math.max(0,Math.min(1,(now-start)/word.duration));
    word.fill.style.clipPath=`inset(0 ${(1-progress)*100}% 0 0)`;
    const r=word.shell.getBoundingClientRect(),base=$('#final-confession').getBoundingClientRect();
    const scale=innerWidth<=600?.62:.85;
    pen.style.transform=`translate(${r.left-base.left+r.width*progress-60*scale}px,${r.bottom-base.top-r.height*.18-170*scale}px) scale(${scale})`;
    pen.style.opacity=now>=start?'1':'0';
    if(progress===1){index++;start=now+65;}
    writingFrame=requestAnimationFrame(draw);
  }
  writingFrame=requestAnimationFrame(draw);
}
prepareWriting();
$('#writing-skip').addEventListener('click',finishWriting);

resetAdventure();
showChapter(0,false);
