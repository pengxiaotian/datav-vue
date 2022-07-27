import{a4 as N,aY as $,a9 as _,b6 as O,aA as z,aj as R,a5 as v,a6 as w,aa as h,aV as l,aZ as i,ae as D,n as U,ad as s,af as B,ag as L,ab as q,ah as M,b8 as Y,b9 as G,a_ as C}from"./vendor.d49f6c0b.js";import{P as W}from"./project.14f90fe3.js";import{a as X,f as Z,v as H}from"./AppRoot.e99935fe.js";import{a as J}from"./templates.a29625ea.js";import{I as K}from"./arrow-left.2b284f25.js";import{I as Q}from"./arrow-right.db77a0c2.js";import{I as x}from"./plus.72a7560d.js";import{I as ee}from"./back.0296c12f.js";function se(e,o){if(typeof window=="undefined")return 0;const c=o?"pageYOffset":"pageXOffset",u=o?"scrollTop":"scrollLeft",r=e===window;let d=r?e[c]:e[u];return r&&typeof d!="number"&&(d=window.document.documentElement[u]),d}const V=window.requestAnimationFrame||(e=>setTimeout(e,16));function te(e,o,c,u){const r=c-o;return e/=u/2,e<1?r/2*e*e*e+o:r/2*((e-=2)*e*e+2)+o}function oe(e,o={}){const{getContainer:c=()=>window,callback:u,duration:r=450}=o,d=c(),m=se(d,!1),f=Date.now(),k=()=>{const p=Date.now()-f,F=te(p>r?r:p,m,e,r);d===window?window.scrollTo(F,window.pageYOffset):d.scrollLeft=F,p<r?V(k):typeof u=="function"&&u()};V(k)}const ae=N({name:"CreateScreen",components:{IconArrowLeft:K,IconArrowRight:Q,IconBack:ee,IconPlus:x},setup(){const e=$(),o=_(!0),c=_([]),u=_(!1),r=_(!1),d=_(""),m=_({}),f=_(0),k=_([new W(0,"\u672A\u5206\u7EC4")]),I=_(!1),p=O(),F=_(null),E=z(()=>k.value.map(a=>({value:a.id,label:a.name})));R(async()=>{const a=await J();o.value=!1,c.value=a.data,Z().then(({data:n})=>{n.code===0&&k.value.push(...n.data.map(({id:g,name:j})=>({id:g,name:j})))})});const A=a=>{m.value=a!=null?a:{},u.value=!0},P=(a,n)=>{m.value=a,r.value=!0,U(()=>{y(a,n)})},y=(a,n)=>{m.value=a,oe(149*n-350,{getContainer:()=>F.value})};return{loading:o,templates:c,visibleCreateDialog:u,visiblePreviewDialog:r,projectName:d,template:m,groupId:f,groups:k,groupOpts:E,saveLoading:I,scrollRef:F,confirmCreate:A,previewTemplate:P,togglePreviewTemplate:y,prevPreviewTemplate:()=>{const a=c.value.findIndex(n=>n.id===m.value.id);if(a>0){const n=a-1,g=c.value[n];y(g,n)}},nextPreviewTemplate:()=>{const a=c.value.findIndex(n=>n.id===m.value.id);if(a<c.value.length-1){const n=a+1,g=c.value[n];y(g,n)}},doCreate:async()=>{var a;try{if(!d.value){e.error("\u8BF7\u8F93\u5165\u5927\u5C4F\u540D\u79F0");return}I.value=!0;const n=(a=m.value)==null?void 0:a.id,g=await H({name:d.value,groupId:f.value,templateId:n!=null?n:0});if(g.data.code===0)u.value=!1,r.value=!1,p.push({name:"ScreenEditor",params:{projectId:g.data.data},query:{tpl:n}});else throw Error(g.data.message)}catch(n){e.error(n.message)}finally{I.value=!1}}}}}),b=e=>(Y("data-v-7d8f97a3"),e=e(),G(),e),ne={class:"create-screen"},le={class:"top-bar"},ie=b(()=>s("div",{class:"right-bar"},null,-1)),re=b(()=>s("div",{class:"left-bar"},null,-1)),ce={class:"return-text"},ue=C(" \u53D6\u6D88\u521B\u5EFA "),de={class:"creator-wp"},pe={class:"template-list"},me={class:"template-item --blank"},ve={class:"template-image"},fe=C(" \u521B\u5EFA\u9879\u76EE "),_e=b(()=>s("div",{class:"template-info"}," \u7A7A\u767D\u753B\u677F ",-1)),ge={class:"template-image"},we=["src"],he={class:"template-mask"},Ce=C(" \u521B\u5EFA\u9879\u76EE "),ke=C(" \u9884\u89C8 "),be={class:"template-info"},Fe={class:"template-name"},Ie={class:"template-size"},ye={class:"create-dialog"},De=b(()=>s("p",{class:"name-title"},[s("span",{class:"required"},"*"),C("\u6570\u636E\u5927\u5C4F\u540D\u79F0 ")],-1)),Ee=b(()=>s("p",{class:"name-title"},"\u5927\u5C4F\u5206\u7EC4",-1)),Ae=C(" \u53D6\u6D88 "),Pe=C(" \u521B\u5EFA "),Te={class:"preview-dialog"},Be={class:"preview-list"},Le=b(()=>s("p",{class:"template-list-title"},"\u6A21\u677F\u5217\u8868",-1)),Se={class:"blur-wp"},Ve={ref:"scrollRef",class:"scroll-wp"},je=["onClick"],Ne=["src"],$e={class:"preview-screen-name"},Oe={class:"preview-gif"},ze={class:"gif-wp"},Re=["src"],Ue={class:"preview-create"},qe={class:"create-dialog"},Me={key:0,class:"template-desc"},Ye=b(()=>s("p",{class:"name-title"},[s("span",{class:"required"},"*"),C("\u6570\u636E\u5927\u5C4F\u540D\u79F0 ")],-1)),Ge=b(()=>s("p",{class:"name-title"},"\u5927\u5C4F\u5206\u7EC4",-1)),We=C(" \u521B\u5EFA\u5927\u5C4F ");function Xe(e,o,c,u,r,d){const m=v("IconBack"),f=v("n-icon"),k=v("router-link"),I=v("IconPlus"),p=v("n-button"),F=v("g-loading"),E=v("new-input"),A=v("n-select"),P=v("n-modal"),y=v("IconArrowLeft"),S=v("IconArrowRight");return w(),h(D,null,[l(F,{type:"square",spinning:e.loading},{default:i(()=>[s("div",ne,[s("div",le,[ie,re,l(k,{to:"/",class:"return-btn"},{default:i(()=>[s("span",ce,[l(f,{class:"return-icon"},{default:i(()=>[l(m)]),_:1}),ue])]),_:1})]),s("div",de,[s("div",pe,[s("div",me,[s("div",ve,[l(p,{type:"primary",focusable:!1,onClick:o[0]||(o[0]=t=>e.confirmCreate(null))},{icon:i(()=>[l(f,null,{default:i(()=>[l(I)]),_:1})]),default:i(()=>[fe]),_:1})]),_e]),(w(!0),h(D,null,B(e.templates,(t,T)=>(w(),h("div",{key:t.id,class:"template-item"},[s("div",ge,[s("img",{src:t.thumbnail,alt:"",class:"preview-image"},null,8,we),s("div",he,[l(p,{type:"primary",focusable:!1,class:"create-btn",onClick:a=>e.confirmCreate(t)},{default:i(()=>[Ce]),_:2},1032,["onClick"]),l(p,{class:"preview-btn",focusable:!1,onClick:a=>e.previewTemplate(t,T)},{default:i(()=>[ke]),_:2},1032,["onClick"])])]),s("div",be,[s("div",Fe,L(t.name),1),s("div",Ie,[(w(!0),h(D,null,B(t.size,(a,n)=>(w(),h("p",{key:n},L(a),1))),128))])])]))),128)),(w(),h(D,null,B(3,t=>s("div",{key:t,class:"template-item-placehoder"})),64))])])])]),_:1},8,["spinning"]),l(P,{show:e.visibleCreateDialog,"onUpdate:show":o[4]||(o[4]=t=>e.visibleCreateDialog=t),preset:"dialog","show-icon":!1,title:"\u521B\u5EFA\u6570\u636E\u5927\u5C4F",style:{width:"400px"}},{action:i(()=>[l(p,{focusable:!1,onClick:o[3]||(o[3]=t=>e.visibleCreateDialog=!1)},{default:i(()=>[Ae]),_:1}),l(p,{type:"primary",focusable:!1,loading:e.saveLoading,onClick:e.doCreate},{default:i(()=>[Pe]),_:1},8,["loading","onClick"])]),default:i(()=>[s("div",ye,[De,l(E,{modelValue:e.projectName,"onUpdate:modelValue":o[1]||(o[1]=t=>e.projectName=t),placeholder:"\u8BF7\u8F93\u5165\u5927\u5C4F\u540D\u79F0",spellcheck:"false",class:"name-input"},null,8,["modelValue"]),Ee,l(A,{value:e.groupId,"onUpdate:value":o[2]||(o[2]=t=>e.groupId=t),options:e.groupOpts,size:"small"},null,8,["value","options"])])]),_:1},8,["show"]),l(P,{show:e.visiblePreviewDialog,"onUpdate:show":o[7]||(o[7]=t=>e.visiblePreviewDialog=t),preset:"dialog","show-icon":!1,title:"\u9884\u89C8",style:{width:"895px","padding-bottom":"0"}},{default:i(()=>[s("div",Te,[s("div",Be,[Le,s("div",Se,[s("div",Ve,[(w(!0),h(D,null,B(e.templates,(t,T)=>(w(),h("div",{key:t.id,class:q(["preview-wp",{selected:t.id===e.template.id}]),onClick:a=>e.togglePreviewTemplate(t,T)},[s("img",{src:t.thumbnail,class:"preview-small-img"},null,8,Ne),s("div",$e,L(t.name),1)],10,je))),128))],512)])]),s("div",Oe,[s("div",ze,[s("img",{class:"snapshot-gif",src:e.template.snapshot},null,8,Re),l(f,{class:"prev-icon",onClick:e.prevPreviewTemplate},{default:i(()=>[l(y)]),_:1},8,["onClick"]),l(f,{class:"next-icon",onClick:e.nextPreviewTemplate},{default:i(()=>[l(S)]),_:1},8,["onClick"])]),s("div",Ue,[s("div",qe,[e.template.description?(w(),h("p",Me,L(e.template.description),1)):M("",!0),Ye,l(E,{modelValue:e.projectName,"onUpdate:modelValue":o[5]||(o[5]=t=>e.projectName=t),placeholder:"\u8BF7\u8F93\u5165\u5927\u5C4F\u540D\u79F0",spellcheck:"false",class:"name-input"},null,8,["modelValue"]),Ge,l(A,{value:e.groupId,"onUpdate:value":o[6]||(o[6]=t=>e.groupId=t),options:e.groupOpts,size:"small"},null,8,["value","options"])]),l(p,{type:"primary",size:"tiny",focusable:!1,"icon-placement":"right",loading:e.saveLoading,class:"preview-create-btn",onClick:e.doCreate},{icon:i(()=>[l(f,{class:"next-icon"},{default:i(()=>[l(S)]),_:1})]),default:i(()=>[We]),_:1},8,["loading","onClick"])])])])]),_:1},8,["show"])],64)}var ts=X(ae,[["render",Xe],["__scopeId","data-v-7d8f97a3"]]);export{ts as default};
