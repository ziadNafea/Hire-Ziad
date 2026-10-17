const container=document.querySelector('#process-scene');
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let activeIndex=0,paused=motionQuery.matches,visible=false,loaded=false;
let wake=()=>{};
document.addEventListener('design-stage-change',event=>{activeIndex=event.detail.index;wake();});
document.addEventListener('design-motion-change',event=>{paused=event.detail.paused;wake();});
async function initialize(){
 if(loaded)return;loaded=true;
 try{
  const T=await import('./assets/vendor/three.module.min.js');
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,30);
  camera.position.set(3.8,2.6,5.5);camera.lookAt(0,0,0);
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement);container.classList.add('scene-ready');
  scene.add(new T.HemisphereLight(0xffffff,0x9a9a9a,3));const light=new T.DirectionalLight(0xffffff,4);light.position.set(-3,5,4);scene.add(light);
  const group=new T.Group();scene.add(group);const layers=[];
  const baseGeometry=new T.BoxGeometry(1.65,.07,1.02);
  for(let i=0;i<5;i++){
   const layer=new T.Group();const material=new T.MeshStandardMaterial({color:0xd7d7d4,metalness:.25,roughness:.4});
   const plane=new T.Mesh(baseGeometry,material);layer.add(plane);
   const edges=new T.LineSegments(new T.EdgesGeometry(baseGeometry),new T.LineBasicMaterial({color:0xaaaaa7,transparent:true,opacity:.7}));layer.add(edges);
   for(let j=0;j<3;j++){
    const line=new T.Mesh(new T.BoxGeometry(.65-j*.13,.012,.028),new T.MeshStandardMaterial({color:0xa8a8a6,roughness:.8}));line.position.set(.12,.043,-.2+j*.17);layer.add(line);
   }
   const dot=new T.Mesh(new T.SphereGeometry(.055,12,8),new T.MeshStandardMaterial({color:0x777777,roughness:.35}));dot.position.set(-.54,.07,-.2);layer.add(dot);
   group.add(layer);layers.push({group:layer,material,dot:dot.material});
  }
  const neutral=new T.Color(0xd7d7d4),orange=new T.Color(0xee762b);const selectedDot=new T.Color(0x512508),neutralDot=new T.Color(0x777777);let mouseX=0,mouseY=0;
  container.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||paused)return;const rect=container.getBoundingClientRect();mouseX=(event.clientX-rect.left)/rect.width-.5;mouseY=(event.clientY-rect.top)/rect.height-.5;});
  container.addEventListener('pointerleave',()=>{mouseX=0;mouseY=0;});
  const resize=()=>{const width=container.clientWidth,height=container.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();wake();};new ResizeObserver(resize).observe(container);resize();
  let last=0,time=0,frame=0;
  wake=()=>{if(frame||!visible||document.hidden)return;last=performance.now();frame=requestAnimationFrame(render);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
  function render(now){
   frame=0;if(!visible||document.hidden)return;
   const delta=Math.min((now-last)/1000||0,.05);last=now;if(!paused)time+=delta;
   const a=paused?1:.11;
   group.rotation.y=T.MathUtils.lerp(group.rotation.y,paused?-.18:Math.sin(time*.22)*.12+mouseX*.25-.18,paused?1:.06);
   group.rotation.z=T.MathUtils.lerp(group.rotation.z,paused?0:mouseY*.045,paused?1:.06);
   for(let i=0;i<layers.length;i++){
    const layer=layers[i],selected=i===activeIndex;
    layer.group.position.y=T.MathUtils.lerp(layer.group.position.y,(i-2)*.23+(selected?.2:0),a);
    layer.group.position.x=T.MathUtils.lerp(layer.group.position.x,selected?.24:0,a);
    layer.group.rotation.y=T.MathUtils.lerp(layer.group.rotation.y,selected?.08:0,a);
    layer.material.color.lerp(selected?orange:neutral,a);layer.dot.color.lerp(selected?selectedDot:neutralDot,a);
   }
   renderer.render(scene,camera);
   if(!paused)frame=requestAnimationFrame(render);
  }
  wake();
 }catch(error){container.classList.remove('scene-ready');console.warn('3D process illustration unavailable; text and stage controls remain available.');}
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){initialize();wake();}},{rootMargin:'180px'});observer.observe(container);}else{visible=true;initialize();}
