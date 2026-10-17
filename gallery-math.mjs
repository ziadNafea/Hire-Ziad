export function clamp(value,min,max){return Math.min(max,Math.max(min,value));}
export function galleryState(scrollPosition,sectionTop,stickyTop,travel,count){
 const start=sectionTop-stickyTop;
 const progress=travel>0?clamp((scrollPosition-start)/travel,0,1):0;
 return {progress,offset:progress*travel,index:Math.round(progress*Math.max(0,count-1)),start,end:start+travel};
}
export function nextOffset(offsets,current,direction,travel){
 const stops=[...new Set(offsets.map(offset=>clamp(offset,0,travel)))].sort((a,b)=>a-b);
 return direction>0?(stops.find(offset=>offset>current+8)??travel):([...stops].reverse().find(offset=>offset<current-8)??0);
}
