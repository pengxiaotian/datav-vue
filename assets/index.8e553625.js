import{w as G,x as I,J as m,$ as p}from"./AppRoot.2c69a8d3.js";import{o as S,b as P}from"./dom.616b1dc0.js";import{I as $}from"./warning.07582945.js";import{bp as A,a_ as T,bc as j,aC as r,b6 as B}from"./vendor.d03ee3fb.js";const a=A({x:0,y:0}),X=()=>{const C=T(),f=j(),o=G(),i=I(),d=r(()=>o.selectedComs.every(e=>e.locked)),l=r(()=>o.selectedComs.every(e=>e.hided)),h=r(()=>o.selectedComs.every(e=>e.type===m.layer)),g=r(()=>{var c;const e=o.selectedComs,s=(c=e[0])==null?void 0:c.parentId;return s?e.some(t=>t.type===m.layer)?!0:!o.coms.find(t=>t.id===s):e.some(t=>{var n;return(n=t.children)==null?void 0:n.some(b=>b.type===m.layer)})}),y=e=>{const s=o.selectedComs;if(s.length===0)return;const c=s[0].parentId,t=s.map(n=>n.id);(e===p.top||e===p.down)&&t.reverse(),t.forEach(n=>{o.move(e,n,c)})},E=()=>{const e=o.selectedComs;if(e.length===0)return;const s=!d.value;e.forEach(c=>{c.locked=s})},F=()=>{const e=o.selectedComs;if(e.length===0)return;const s=!l.value;e.forEach(c=>{c.hided=s})},v=()=>{const e=o.selectedComs;if(e.length===0)return;const s=e.map(t=>t.alias),c=f.create({content:`\u5220\u9664\u540E\u53EF\u80FD\u65E0\u6CD5\u6062\u590D\uFF0C\u662F\u5426\u5220\u9664${s.join("\uFF0C")}\uFF0C\u5171${s.length}\u4E2A\u7EC4\u4EF6`,negativeText:"\u53D6\u6D88",positiveText:"\u786E\u5B9A",iconPlacement:"top",icon:()=>B($),onPositiveClick:async()=>{c.loading=!0;try{await o.deletes(e)}catch(t){C.error(t.message)}}})},x=()=>{o.selectedComs[0].renameing=!0},D=()=>{o.selectedComs.forEach(e=>{o.copy(e.id)})},M=()=>{o.selectedComs.length!==0&&o.createGroup()},k=()=>{o.selectedComs.length!==0&&o.cancelGroup()},w=(e,s)=>{e.preventDefault(),e.stopPropagation(),s.selected&&(a.x=e.clientX,a.y=e.clientY,i.contextMenu.show=!0,S(document,"mouseup",u))},u=()=>{P(document,"mouseup",u),i.contextMenu.show=!1};return{pos:a,isLocked:d,isHided:l,isGroup:h,disableGroup:g,showMenu:w,hideMenu:u,moveCom:y,lockCom:E,hideCom:F,confirmDeleteCom:v,renameCom:x,copyCom:D,composeComs:M,decomposeComs:k}};export{X as u};
