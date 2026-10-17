const projects = [{"title": "Strategi Builder", "category": "B2B Website / UX/UI", "url": "https://www.strategibuilder.com/", "class": "strategi", "intro": "A clearer digital presence for a U.S.-based business.", "description": "Redesigned the website with a modern, responsive interface, focusing on visual hierarchy, navigation, and service clarity.", "role": "Website redesign \u00b7 UX/UI design", "tools": "Figma \u00b7 FigJam \u00b7 Miro", "focus": "Visual hierarchy, navigation, and a clearer presentation of services."}, {"title": "Ealameuon Training Center", "category": "Training Platform / Salla", "url": "https://ealameuon-tc.com/", "class": "ealameuon", "intro": "A training platform for exploring courses and professional programs.", "description": "A website project for Ealameuon Training Center, presenting its courses, programs, and trainers in an Arabic learning experience.", "role": "Website design & implementation", "tools": "Salla", "focus": "Course discovery, program information, and trainer profiles."}, {"title": "ENT Masters Program", "category": "Medical Education / Website", "url": "https://ziadnafea.github.io/ent-masters-program/", "class": "ent", "intro": "A focused digital experience for advanced surgical education.", "description": "A course website presenting the 1st Advanced Rhinoplasty Course, including its program, faculty, learning experience, and application information.", "role": "Website design & implementation", "tools": "Web implementation \u00b7 GitHub Pages", "focus": "Course information, faculty presentation, and the application journey."}, {"title": "Ceramica Plus", "category": "E-commerce / UX/UI", "url": "https://ceramicaplus.net/", "class": "ceramica", "intro": "Connecting materials with the spaces they help create.", "description": "Designed clear product-selection flows connecting construction materials with practical finishing applications.", "role": "UX/UI design \u00b7 Product-selection flows", "tools": "Figma \u00b7 Miro", "focus": "Helping shoppers navigate construction materials and finishing applications."}, {"title": "Malik Luxury Suites", "category": "Hospitality / WordPress", "url": "https://malikluxurysuites.com/", "class": "malik", "intro": "From finding the right stay to making a reservation.", "description": "Designed and built a hotel discovery and reservation experience using WordPress, WPrentals, and WooCommerce.", "role": "Website design & development", "tools": "Figma \u00b7 WordPress \u00b7 WPrentals \u00b7 WooCommerce", "focus": "Hotel discovery and a streamlined reservation experience."}];
const steps = [["Understand", "The right problem comes first.", "I learn about the product, its users, the market, and the business context."], ["Define", "Turn insights into a direction.", "I organize the findings into a focused problem, clear priorities, and a practical design direction."], ["Design", "Make the direction tangible.", "I build user flows, wireframes, visual systems, and responsive interfaces."], ["Validate", "Check the thinking against use.", "I review the experience, test assumptions, and refine decisions through feedback."], ["Deliver", "Carry the intent into the build.", "I prepare an organized handoff or implement the website using the most suitable platform."]];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const dialogTriggers = new WeakMap();
function openDialog(dialog, trigger) {
 const safeTrigger=trigger?.closest('dialog') ? document.querySelector('.resume-button') : trigger;
 document.querySelectorAll('dialog[open]').forEach(open=>{open.dataset.switching='true';open.close();});
 dialogTriggers.set(dialog,safeTrigger || document.activeElement);
 dialog.showModal(); document.body.classList.add('dialog-open');
 dialog.querySelector('.dialog-close')?.focus({preventScroll:true});
}
document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>openDialog(document.querySelector('#contact-dialog'),button)));
document.querySelectorAll('[data-cv]').forEach(button=>button.addEventListener('click',()=>{
 const frame=document.querySelector('#cv-frame');
 if(!frame.getAttribute('src')) frame.src='assets/ziad-nafea-cv.pdf#toolbar=0&navpanes=0&view=FitH';
 openDialog(document.querySelector('#cv-dialog'),button);
}));
const caseDialog=document.querySelector('#case-dialog');
document.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>{
 const project=projects[Number(button.dataset.case)]; if(!project) return;
 for(const field of ['title','description','role','tools','focus','category']) document.querySelector('#case-'+field).textContent=project[field];
 document.querySelector('#case-website').href=project.url;
 const cover=document.querySelector('#case-cover');cover.src='assets/screenshots/'+project.class+'.jpg';cover.alt=project.title+' actual website screenshot';
 openDialog(caseDialog,button);
}));
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{
  if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');
  if(dialog.dataset.switching){delete dialog.dataset.switching;return;}
  const trigger=dialogTriggers.get(dialog);if(trigger?.isConnected)trigger.focus({preventScroll:true});
 });
});
const menuButton=document.querySelector('.menu-toggle'),navigation=document.querySelector('#main-nav');
function setMenu(open){menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('is-open',open);menuButton.querySelector('use').setAttribute('href',open?'#i-close':'#i-menu');}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('is-open')){setMenu(false);menuButton.focus({preventScroll:true});}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header')&&navigation.classList.contains('is-open'))setMenu(false);});
const copyButton=document.querySelector('#copy-email');
copyButton.addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText('ziadnafea101@gmail.com');copyButton.firstChild.textContent='Email copied ';document.querySelector('#copy-status').textContent='Email address copied to clipboard.';setTimeout(()=>{copyButton.firstChild.textContent='Copy email ';},2300);}
 catch{document.querySelector('#copy-status').textContent='Please use the email link above to get in touch.';}
});
function setDesignStage(index){
 const step=steps[index];if(!step)return;
 document.querySelectorAll('[data-step]').forEach(button=>{const selected=Number(button.dataset.step)===index;button.classList.toggle('is-active',selected);button.classList.toggle('is-complete',Number(button.dataset.step)<index);button.setAttribute('aria-pressed',String(selected));});
 document.querySelector('#stage-counter').textContent=String(index+1).padStart(2,'0')+' / 05';document.querySelector('#stage-name').textContent=step[0].toUpperCase();document.querySelector('#stage-title').textContent=step[1];document.querySelector('#stage-copy').textContent=step[2];
 document.dispatchEvent(new CustomEvent('design-stage-change',{detail:{index}}));
}
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{
 const index=Number(button.dataset.step);setDesignStage(index);document.dispatchEvent(new CustomEvent('design-stage-request',{detail:{index}}));
}));
document.addEventListener('design-stage-scroll',event=>setDesignStage(event.detail.index));
const motionButton=document.querySelector('#motion-toggle');let paused=reducedMotion.matches;
function updateMotionButton(){motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'Play 3D motion':'Pause 3D motion');motionButton.querySelector('use').setAttribute('href',paused?'#i-play':'#i-pause');}
updateMotionButton();motionButton.addEventListener('click',()=>{paused=!paused;updateMotionButton();document.dispatchEvent(new CustomEvent('design-motion-change',{detail:{paused}}));});
reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;updateMotionButton();document.dispatchEvent(new CustomEvent('design-motion-change',{detail:{paused}}));});
if('IntersectionObserver' in window){
 const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});},{threshold:.08});
 if(!reducedMotion.matches){document.documentElement.classList.add('js-reveal');document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));}
 const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;navigation.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});},{rootMargin:'-10% 0px -65% 0px'});
 ['work','about','process'].forEach(id=>navObserver.observe(document.getElementById(id)));
}
let progressPending=false;const progress=document.querySelector('.reading-progress');
function updateProgress(){const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(range>0?Math.max(0,Math.min(1,scrollY/range)):0)+')';progressPending=false;}
addEventListener('scroll',()=>{if(!progressPending){progressPending=true;requestAnimationFrame(updateProgress);}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
document.querySelector('#year').textContent=new Date().getFullYear();
// Dock magnification: the focused icon grows and adjacent icons make room.
const dock=document.querySelector('.tool-dock'),dockTools=[...dock.querySelectorAll('.tool')];
function setDockPosition(position){dockTools.forEach((tool,index)=>{const influence=Math.exp(-Math.pow((index-position)/.95,2));tool.style.setProperty('--magnify',influence.toFixed(3));});}
function resetDock(){dockTools.forEach(tool=>tool.style.setProperty('--magnify','0'));}
dock.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||reducedMotion.matches)return;const bounds=dock.getBoundingClientRect(),padding=parseFloat(getComputedStyle(dock).paddingLeft)||0;const position=((event.clientX-bounds.left-padding)/Math.max(1,bounds.width-padding*2))*dockTools.length-.5;setDockPosition(Math.max(0,Math.min(dockTools.length-1,position)));});
dock.addEventListener('pointerleave',()=>{const focused=dockTools.indexOf(document.activeElement);if(focused>=0)setDockPosition(focused);else resetDock();});
dockTools.forEach((tool,index)=>{tool.addEventListener('focus',()=>{if(!reducedMotion.matches)setDockPosition(index);});tool.addEventListener('blur',()=>{if(!dock.contains(document.activeElement))resetDock();});});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)resetDock();});
// A gentle, pressure-like response on the portrait; no hover motion on touch.
const portraitSurface=document.querySelector('.portrait-surface');
function resetPortrait(){portraitSurface.classList.remove('is-hovered','is-pressed');portraitSurface.style.setProperty('--rotate-x','0deg');portraitSurface.style.setProperty('--rotate-y','0deg');}
portraitSurface.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&!reducedMotion.matches)portraitSurface.classList.add('is-hovered');});
portraitSurface.addEventListener('pointermove',event=>{
 if(event.pointerType!=='mouse'||reducedMotion.matches)return;
 const bounds=portraitSurface.getBoundingClientRect(),x=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width)),y=Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height));
 portraitSurface.style.setProperty('--rotate-x',((y-.5)*6).toFixed(2)+'deg');portraitSurface.style.setProperty('--rotate-y',((.5-x)*6).toFixed(2)+'deg');portraitSurface.style.setProperty('--portrait-x',(x*100).toFixed(1)+'%');portraitSurface.style.setProperty('--portrait-y',(y*100).toFixed(1)+'%');
});
portraitSurface.addEventListener('pointerdown',()=>{if(!reducedMotion.matches)portraitSurface.classList.add('is-pressed');});
portraitSurface.addEventListener('pointerup',()=>portraitSurface.classList.remove('is-pressed'));
portraitSurface.addEventListener('pointerleave',resetPortrait);portraitSurface.addEventListener('pointercancel',resetPortrait);
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)resetPortrait();});
const invitation=document.querySelector('.cta-invitation');
invitation.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reducedMotion.matches)return;const bounds=invitation.getBoundingClientRect();invitation.style.setProperty('--glow-x',((event.clientX-bounds.left)/bounds.width*100).toFixed(1)+'%');invitation.style.setProperty('--glow-y',((event.clientY-bounds.top)/bounds.height*100).toFixed(1)+'%');});
invitation.addEventListener('pointerleave',()=>{invitation.style.removeProperty('--glow-x');invitation.style.removeProperty('--glow-y');});
