import {resizeScrollTarget} from './scroll-resize.mjs';
import {clamp,galleryState,nextOffset} from './gallery-math.mjs';
const section=document.querySelector('#work'),pin=section.querySelector('.work-pin'),viewport=section.querySelector('.work-viewport'),track=section.querySelector('.work-track');
const cards=[...track.querySelectorAll('.project')],previous=section.querySelector('[data-gallery-prev]'),next=section.querySelector('[data-gallery-next]'),counter=section.querySelector('.work-counter'),bar=section.querySelector('.work-progress>span');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let travel=0,stickyTop=0,sectionTop=0,pinned=false,offset=0,scheduled=false,measuring=false,cardOffsets=[];
function updateStatus(progress){const p=clamp(progress,0,1);bar.style.transform='scaleX('+(p*.96+.04)+')';counter.textContent=String(Math.round(p*(cards.length-1))+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');previous.disabled=p<=.001;next.disabled=p>=.999;}
function update(){scheduled=false;if(!pinned){offset=viewport.scrollLeft;updateStatus(travel?offset/travel:0);return;}const state=galleryState(scrollY,sectionTop,stickyTop,travel,cards.length);offset=state.offset;track.style.transform='translate3d('+(-offset)+'px,0,0)';updateStatus(state.progress);}
function scheduleUpdate(){if(scheduled)return;scheduled=true;requestAnimationFrame(update);}
function measure(){
 if(measuring)return;measuring=true;
 const oldScroll=scrollY,oldHeight=section.getBoundingClientRect().height,oldTravel=travel,wasPinned=pinned;
 const oldStart=section.getBoundingClientRect().top+oldScroll-stickyTop;
 const oldProgress=travel?Math.max(0,Math.min(1,offset/travel)):0;
 section.classList.toggle('is-pinned',!motion.matches&&innerHeight>=520);section.style.height='';track.style.transform='';viewport.scrollLeft=0;
 pinned=section.classList.contains('is-pinned');
 if(pinned&&pin.scrollHeight>pin.clientHeight+4){pinned=false;section.classList.remove('is-pinned');}
 travel=Math.max(0,track.scrollWidth-viewport.clientWidth);stickyTop=parseFloat(getComputedStyle(pin).top)||0;
 sectionTop=section.getBoundingClientRect().top+scrollY;
 if(pinned&&travel>0)section.style.height=(pin.getBoundingClientRect().height+travel)+'px';
 else{pinned=false;section.classList.remove('is-pinned');section.style.height='';}
 const firstLeft=cards[0].getBoundingClientRect().left;cardOffsets=cards.map(card=>card.getBoundingClientRect().left-firstLeft);
 if(!pinned)viewport.scrollLeft=oldProgress*travel;
 if(wasPinned){
  const target=resizeScrollTarget(oldScroll,oldStart,oldTravel,sectionTop-stickyTop,pinned?travel:0,section.getBoundingClientRect().height-oldHeight);
  if(Math.abs(target-scrollY)>.5)window.scrollTo({top:target,behavior:'instant'});
 }
 update();measuring=false;document.dispatchEvent(new Event('portfolio-layout-change'));
}
function goToOffset(target,smooth=true){
 const x=clamp(target,0,travel),behavior=smooth&&!motion.matches?'smooth':'instant';
 if(pinned)window.scrollTo({top:sectionTop-stickyTop+x,behavior});else viewport.scrollTo({left:x,behavior});
}
previous.addEventListener('click',()=>goToOffset(nextOffset(cardOffsets,offset,-1,travel)));
next.addEventListener('click',()=>goToOffset(nextOffset(cardOffsets,offset,1,travel)));
track.addEventListener('focusin',event=>{const card=event.target.closest('.project');if(!card)return;const box=card.getBoundingClientRect(),bounds=viewport.getBoundingClientRect();if(box.left<bounds.left+12||box.right>bounds.right-12)goToOffset(cardOffsets[cards.indexOf(card)],false);});
window.addEventListener('scroll',scheduleUpdate,{passive:true});viewport.addEventListener('scroll',scheduleUpdate,{passive:true});
let measureFrame=0;function scheduleMeasure(){cancelAnimationFrame(measureFrame);measureFrame=requestAnimationFrame(measure);}
let measuredWidth=innerWidth,measuredHeight=pin.getBoundingClientRect().height;
window.addEventListener('resize',()=>{
 const height=pin.getBoundingClientRect().height;
 if(innerWidth===measuredWidth&&Math.abs(height-measuredHeight)<1)return;
 measuredWidth=innerWidth;measuredHeight=height;scheduleMeasure();
});motion.addEventListener('change',scheduleMeasure);
window.addEventListener('load',scheduleMeasure,{once:true});document.fonts?.ready.then(scheduleMeasure);measure();
