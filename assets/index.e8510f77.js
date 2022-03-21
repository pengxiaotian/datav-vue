import{a4 as y,a5 as m,a6 as P,aa as C,ad as o,aX as a,a$ as n,a_ as V,a9 as _,aC as f,aB as g,ac as w,ab as B,ba as $,bb as x,aN as k,b0 as h}from"./vendor.1c7e0fbb.js";import{a as A,C as D,x as L}from"./AppRoot.9161bc33.js";const U=y({name:"ToolboxFilterPanel",props:{styleFilterParams:{type:Object}}}),N={class:"filter-toolbox-panel"},S={class:"content"},M={class:"gui-wrap"};function z(e,l,d,b,r,v){const t=m("g-slider"),u=m("g-field");return P(),C("div",N,[o("div",S,[o("div",M,[a(u,{disabled:!e.styleFilterParams.enable,label:"\u8272\u76F8",caption:"\u8272\u76F8: [ 0, 360 ]","label-span":7},{default:n(()=>[a(t,{modelValue:e.styleFilterParams.hue,"onUpdate:modelValue":l[0]||(l[0]=s=>e.styleFilterParams.hue=s),min:0,max:360,suffix:"\u5EA6"},null,8,["modelValue"])]),_:1},8,["disabled"]),a(u,{disabled:!e.styleFilterParams.enable,label:"\u9971\u548C\u5EA6",caption:"\u9971\u548C\u5EA6: [ 0, 200 ]","label-span":7},{default:n(()=>[a(t,{modelValue:e.styleFilterParams.saturate,"onUpdate:modelValue":l[1]||(l[1]=s=>e.styleFilterParams.saturate=s),min:0,max:200,suffix:"%"},null,8,["modelValue"])]),_:1},8,["disabled"]),a(u,{disabled:!e.styleFilterParams.enable,label:"\u4EAE\u5EA6",caption:"\u4EAE\u5EA6: [ 0, 200 ]","label-span":7},{default:n(()=>[a(t,{modelValue:e.styleFilterParams.brightness,"onUpdate:modelValue":l[2]||(l[2]=s=>e.styleFilterParams.brightness=s),min:0,max:200,suffix:"%"},null,8,["modelValue"])]),_:1},8,["disabled"]),a(u,{disabled:!e.styleFilterParams.enable,label:"\u5BF9\u6BD4\u5EA6",caption:"\u5BF9\u6BD4\u5EA6: [ 0, 200 ]","label-span":7},{default:n(()=>[a(t,{modelValue:e.styleFilterParams.contrast,"onUpdate:modelValue":l[3]||(l[3]=s=>e.styleFilterParams.contrast=s),min:0,max:200,suffix:"%"},null,8,["modelValue"])]),_:1},8,["disabled"]),a(u,{disabled:!e.styleFilterParams.enable,label:"\u4E0D\u900F\u660E\u5EA6",caption:"\u4E0D\u900F\u660E\u5EA6: [ 0, 100 ]","label-span":7},{default:n(()=>[a(t,{modelValue:e.styleFilterParams.opacity,"onUpdate:modelValue":l[4]||(l[4]=s=>e.styleFilterParams.opacity=s),min:0,max:100,suffix:"%"},null,8,["modelValue"])]),_:1},8,["disabled"])])])])}var T=A(U,[["render",z],["__scopeId","data-v-f7239e5c"]]);const I=y({name:"ToolboxPanel",components:{FilterToolboxPanel:T},setup(){const e=V(),l=D(),d=L(),b=_(d.isNormalResizeMode),r=_(!1),v=f(()=>l.toolbox.show),t=f(()=>d.referLine),u=f(()=>d.alignLine),s=f(()=>d.pageConfig.styleFilterParams),F=()=>{r.value=!r.value},c=()=>{r.value=!1,document.removeEventListener("click",c)},i=p=>{b.value=p,d.isNormalResizeMode=p};return g(()=>s.value.enable,p=>{r.value=p,e.success(p?"\u6EE4\u955C\u5DF2\u5F00\u542F\u5E94\u7528":"\u6EE4\u955C\u5DF2\u5173\u95ED")}),g(()=>r.value,p=>{p&&document.addEventListener("click",c)}),{visiblePanel:v,isNormal:b,referLine:t,alignLine:u,visibleFilterPanel:r,styleFilterParams:s,toggleFilterPanel:F,handleResizeModeChange:i}}}),E=e=>($("data-v-2777391d"),e=e(),x(),e),R={class:"toolbox-panel"},j={class:"btn-box"},O=E(()=>o("span",{class:"btn-text --help"},"\u7EC4\u4EF6\u7F29\u653E",-1)),X=h(" \u52FE\u9009\u65F6\u4E3A\u81EA\u7136\u6A21\u5F0F\uFF0C\u5426\u5219\u4E3A\u62C9\u4F38\u6A21\u5F0F\uFF0C\u9ED8\u8BA4\u52FE\u9009 "),q={class:"btn-box"},G=E(()=>o("span",{class:"btn-text"},"\u53C2\u8003\u7EBF",-1)),H={class:"btn-box"},J=E(()=>o("span",{class:"btn-text --help"},"\u5BF9\u9F50\u7EBF",-1)),K=h(" \u7EC4\u4EF6\u6570\u91CF\u591A\u65F6\uFF0C\u5BB9\u6613\u5361\u987F\uFF0C\u5EFA\u8BAE\u5173\u95ED ");function Q(e,l,d,b,r,v){const t=m("n-switch"),u=m("filter-toolbox-panel"),s=m("n-popover"),F=m("n-tooltip"),c=m("n-checkbox");return P(),C("div",{class:B(["toolbox-panel-wp",{"--hide":!e.visiblePanel}])},[o("div",R,[a(s,{show:e.visibleFilterPanel,width:320,placement:"bottom-start",trigger:"manual","show-arrow":!1,raw:"",style:w({"--n-color":"var(--datav-component-bg)"})},{trigger:n(()=>[o("div",{class:"btn-box",onClick:l[2]||(l[2]=k(()=>{},["stop"]))},[o("span",{class:"btn-text --label",onClick:l[0]||(l[0]=(...i)=>e.toggleFilterPanel&&e.toggleFilterPanel(...i))},"\u6EE4\u955C\u914D\u7F6E"),a(t,{value:e.styleFilterParams.enable,"onUpdate:value":l[1]||(l[1]=i=>e.styleFilterParams.enable=i)},null,8,["value"])])]),default:n(()=>[a(u,{"style-filter-params":e.styleFilterParams},null,8,["style-filter-params"])]),_:1},8,["show","style"]),o("div",j,[a(F,{placement:"bottom"},{trigger:n(()=>[O]),default:n(()=>[X]),_:1}),a(c,{checked:e.isNormal,"onUpdate:checked":e.handleResizeModeChange},null,8,["checked","onUpdate:checked"])]),o("div",q,[G,a(t,{value:e.referLine.enable,"onUpdate:value":l[3]||(l[3]=i=>e.referLine.enable=i)},null,8,["value"])]),o("div",H,[a(F,{placement:"bottom"},{trigger:n(()=>[J]),default:n(()=>[K]),_:1}),a(t,{value:e.alignLine.enable,"onUpdate:value":l[4]||(l[4]=i=>e.alignLine.enable=i)},null,8,["value"])])])],2)}var Z=A(I,[["render",Q],["__scopeId","data-v-2777391d"]]);export{Z as default};