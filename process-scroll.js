import {resizeScrollTarget} from './scroll-resize.mjs';
import {processScrollState,stageScrollTarget} from './process-math.mjs';
const section=document.querySelector('#process'),pin=section.querySelector('.process-pin'),buttons=[...section.querySelectorAll('[data-step]')],motion=matchMedia('(prefers-reduced-motion: reduce)');
let pinned=false,sectionTop=0,stickyTop=0,travel=0,lastIndex=-1,pending=false,measureFrame=0;
function update(){
 pending=false;if(!pinned)return;
 const state=processScrollState(scrollY,sectionTop,stickyTop,travel,buttons.length);
 pin.style.setProperty('--process-progress',state.progress.toFixed(4));
 if(state.index!==lastIndex){lastIndex=state.index;document.dispatchEvent(new CustomEvent('design-stage-scroll',{detail:{index:state.index}}));}
}
function scheduleUpdate(){if(pending)return;pending=true;requestAnimationFrame(update);}
function measure(){
 const oldScroll=scrollY,oldHeight=section.getBoundingClientRect().height,oldTravel=travel,wasPinned=pinned;
 const oldStart=section.getBoundingClientRect().top+oldScroll-stickyTop;
 section.classList.toggle('is-process-pinned',!motion.matches&&innerHeight>=520);section.style.height='';
 pinned=section.classList.contains('is-process-pinned');
 if(pinned&&pin.scrollHeight>pin.clientHeight+4){pinned=false;section.classList.remove('is-process-pinned');}
 stickyTop=parseFloat(getComputedStyle(pin).top)||0;sectionTop=section.getBoundingClientRect().top+scrollY;
 if(pinned){const stageDistance=Math.max(330,Math.min(550,pin.getBoundingClientRect().height*.62));travel=stageDistance*buttons.length;section.style.height=(pin.getBoundingClientRect().height+travel)+'px';}
 else{section.style.height='';travel=0;pin.style.removeProperty('--process-progress');}
 if(wasPinned){
  const target=resizeScrollTarget(oldScroll,oldStart,oldTravel,sectionTop-stickyTop,travel,section.getBoundingClientRect().height-oldHeight);
  if(Math.abs(target-scrollY)>.5)window.scrollTo({top:target,behavior:'instant'});
 }
 lastIndex=-1;update();
}
function scheduleMeasure(){cancelAnimationFrame(measureFrame);measureFrame=requestAnimationFrame(measure);}
document.addEventListener('design-stage-request',event=>{
 if(!pinned)return;const start=sectionTop-stickyTop;
 window.scrollTo({top:stageScrollTarget(event.detail.index,buttons.length,start,travel),behavior:motion.matches?'instant':'smooth'});
});
window.addEventListener('scroll',scheduleUpdate,{passive:true});let measuredWidth=innerWidth,measuredHeight=pin.getBoundingClientRect().height;
window.addEventListener('resize',()=>{
 const height=pin.getBoundingClientRect().height;
 if(innerWidth===measuredWidth&&Math.abs(height-measuredHeight)<1)return;
 measuredWidth=innerWidth;measuredHeight=height;scheduleMeasure();
});
document.addEventListener('portfolio-layout-change',scheduleMeasure);motion.addEventListener('change',scheduleMeasure);window.addEventListener('load',scheduleMeasure,{once:true});document.fonts?.ready.then(scheduleMeasure);
measure();
