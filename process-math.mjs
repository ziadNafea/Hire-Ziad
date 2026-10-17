export function processScrollState(scrollPosition,sectionTop,stickyTop,travel,count){
 const start=sectionTop-stickyTop,progress=travel>0?Math.max(0,Math.min(1,(scrollPosition-start)/travel)):0;
 return {progress,index:Math.min(count-1,Math.floor(progress*count)),start,end:start+travel};
}
export function stageScrollTarget(index,count,start,travel){return start+(Math.max(0,Math.min(count-1,index))+.12)/count*travel;}
