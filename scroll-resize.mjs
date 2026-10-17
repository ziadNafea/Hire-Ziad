// Preserve the user's place when a pinned section changes its scroll extent.
export function resizeScrollTarget(scroll, start, oldTravel, newStart, newTravel, heightDelta) {
 if(oldTravel<=0||scroll<start)return scroll;
 if(scroll>start+oldTravel)return scroll+heightDelta;
 return newStart+Math.max(0,Math.min(1,(scroll-start)/oldTravel))*newTravel;
}
