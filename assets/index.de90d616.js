import{x as D,_ as r,y as f,E as _,B as V,b as x,z as l,C as M,F as b,H as v}from"./App.4d672324.js";import{a3 as A,a7 as p,bb as R,a8 as j,ai as k,a4 as s,a9 as O,ac as m,aZ as c,b1 as L,ad as q,a5 as $}from"./vendor.0227b33d.js";import{a as C}from"./templates.7b09f335.js";function B(e){switch(e){case"./other/date-picker/src/date-picker.ts":return r(()=>import("./date-picker.53bbcc86.js"),["assets/date-picker.53bbcc86.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data-field.0ba3a232.js","assets/data.580aa51d.js"]);default:return new Promise(function(o,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function F(e){switch(e){case"./media/bg-box/src/bg-box.ts":return r(()=>import("./App.4d672324.js").then(function(o){return o.aa}),["assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js"]);case"./media/border-box/src/border-box.ts":return r(()=>import("./App.4d672324.js").then(function(o){return o.a9}),["assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js"]);case"./media/decoration/src/decoration.ts":return r(()=>import("./App.4d672324.js").then(function(o){return o.ab}),["assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js"]);case"./media/main-img/src/main-img.ts":return r(()=>import("./main-img.b863e2da.js"),["assets/main-img.b863e2da.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data.580aa51d.js"]);default:return new Promise(function(o,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function S(e){switch(e){case"./button/full-screen/src/full-screen.ts":return r(()=>import("./full-screen.4924a3be.js"),["assets/full-screen.4924a3be.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data.580aa51d.js"]);default:return new Promise(function(o,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function U(e){switch(e){case"./text/main-title/src/main-title.ts":return r(()=>import("./main-title.2299bddb.js"),["assets/main-title.2299bddb.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data-field.0ba3a232.js","assets/data.580aa51d.js"]);case"./text/marquee/src/marquee.ts":return r(()=>import("./marquee.13ed81f8.js"),["assets/marquee.13ed81f8.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data-field.0ba3a232.js","assets/data.580aa51d.js"]);case"./text/number-title-flop/src/number-title-flop.ts":return r(()=>import("./number-title-flop.913d041b.js"),["assets/number-title-flop.913d041b.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data-field.0ba3a232.js","assets/data.580aa51d.js"]);case"./text/paragraph/src/paragraph.ts":return r(()=>import("./paragraph.685bd473.js"),["assets/paragraph.685bd473.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data-field.0ba3a232.js","assets/data.580aa51d.js"]);case"./text/timer/src/timer.ts":return r(()=>import("./timer.08527758.js"),["assets/timer.08527758.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data.580aa51d.js"]);default:return new Promise(function(o,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function N(e){switch(e){case"./chart/word-cloud/src/word-cloud.ts":return r(()=>import("./word-cloud.86dda831.js"),["assets/word-cloud.86dda831.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data-field.0ba3a232.js","assets/data.580aa51d.js"]);default:return new Promise(function(o,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function z(e){switch(e){case"./bar/basic-bar/src/basic-bar.ts":return r(()=>import("./basic-bar.3ecdc978.js"),["assets/basic-bar.3ecdc978.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/data-field.0ba3a232.js","assets/data.580aa51d.js"]);default:return new Promise(function(o,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}async function H(e){const o=D(e.substring(1));switch(e.substring(1)){case"BasicBar":{const t=await z(`./bar/${o}/src/${o}.ts`);return new t.default}case"WordCloud":{const t=await N(`./chart/${o}/src/${o}.ts`);return new t.default}case"MainTitle":case"Marquee":case"NumberTitleFlop":case"Paragraph":case"Timer":{const t=await U(`./text/${o}/src/${o}.ts`);return new t.default}case"FullScreen":{const t=await S(`./button/${o}/src/${o}.ts`);return new t.default}case"BgBox":case"BorderBox":case"Decoration":case"MainImg":{const t=await F(`./media/${o}/src/${o}.ts`);return new t.default}case"DatePicker":{const t=await B(`./other/${o}/src/${o}.ts`);return new t.default}default:throw Error(`Unknown component type: ${e}.`)}}const W=async()=>{const{pageConfig:e}=_,t=["VMainTitle","VNumberTitleFlop","VDatePicker","VBgBox","VBorderBox","VDecoration","VBasicBar","VMarquee","VParagraph","VTimer","VFullScreen","VMainImg","VWordCloud"].map(a=>H(a)),d=await Promise.all(t),u=d.map(a=>(a.attr.x=f(e.width-a.attr.w),a.attr.y=f(e.height-a.attr.h),_.addCom(a)));await Promise.all(u);const i=[],n=[];d.forEach(a=>{a.apis.source&&(n.push(a.id),i.push(a.loadData()))}),i.length>0&&(await Promise.all(i),setTimeout(()=>{n.forEach(a=>{V.datavComponents[a].$DATAV_requestData()})},200))};const X=A({name:"ScreenEditor",components:{HeaderToolbar:p(()=>r(()=>import("./index.2cb3baa9.js"),["assets/index.2cb3baa9.js","assets/index.891400cf.css","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/screen.e6ae4b3f.js","assets/layer.09210bf1.js","assets/publish-screen.6bedcdd3.js","assets/publish-screen.df6080ef.css","assets/release.8c60ebd0.js","assets/help.f3b2fca0.js"])),FooterToolbar:p(()=>r(()=>import("./index.3dcd40e0.js"),["assets/index.3dcd40e0.js","assets/index.9993353f.css","assets/vendor.0227b33d.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/arrow-down.4e5ad581.js"])),EditorContextMenu:p(()=>r(()=>import("./index.8e49354c.js"),["assets/index.8e49354c.js","assets/index.e4ffd428.css","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/dom.2deab946.js","assets/warning.7062b572.js","assets/edit.b08c42b1.js","assets/delete.ef1afe75.js","assets/copy.2a54fcd9.js","assets/lock.ad87ace9.js","assets/show.b9f188c6.js","assets/hide.413e4668.js","assets/index.8b599c1e.js"])),CanvasMain:l(()=>r(()=>import("./index.d4299a25.js"),["assets/index.d4299a25.js","assets/index.e3e9f1e6.css","assets/vendor.0227b33d.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/dom.2deab946.js","assets/index.8b599c1e.js","assets/templates.7b09f335.js"])),LayerPanel:l(()=>r(()=>import("./index.6b20701f.js"),["assets/index.6b20701f.js","assets/index.f8bf7f5e.css","assets/vendor.0227b33d.js","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/warning.7062b572.js","assets/delete.ef1afe75.js","assets/back.7688ceb0.js","assets/lock.ad87ace9.js","assets/hide.413e4668.js","assets/view-grid.bd3a5a7f.js","assets/index.8b599c1e.js","assets/dom.2deab946.js"])),ComponentsPanel:l(()=>r(()=>import("./index.570c8a90.js"),["assets/index.570c8a90.js","assets/index.193d8278.css","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/search.8cb7376b.js","assets/back.7688ceb0.js","assets/templates.7b09f335.js"])),ConfigPanel:l(()=>r(()=>import("./index.08d47456.js"),["assets/index.08d47456.js","assets/index.1e2ad6b6.css","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/interact.248be664.js"])),ToolboxPanel:l(()=>r(()=>import("./index.c0274a9d.js"),["assets/index.c0274a9d.js","assets/index.87378182.css","assets/vendor.0227b33d.js","assets/App.4d672324.js","assets/App.0e26ef44.css"])),FilterManagerDrawer:l(()=>r(()=>import("./filter-manager-drawer.ba1b927a.js"),["assets/filter-manager-drawer.ba1b927a.js","assets/filter-manager-drawer.24f26014.css","assets/App.4d672324.js","assets/App.0e26ef44.css","assets/vendor.0227b33d.js","assets/warning.7062b572.js","assets/document.c402f011.js","assets/filter-collapse-panel.c6254065.js","assets/arrow-left.e9f28599.js","assets/edit.b08c42b1.js","assets/delete.ef1afe75.js","assets/release.8c60ebd0.js"]))},props:{projectId:{type:[String,Number],required:!0}},setup(e){const o=R(),t=j(!0);return M.enableDebug(),_.setEditMode(),k(async()=>{var d;try{const u=parseInt(o.query.tpl);if(u>0){const{data:i}=await C(u);if(i){const{config:n}=i;_.setEditorOption({screen:{id:+e.projectId,name:i.name},config:{width:n.width,height:n.height,bgimage:n.bgimage,bgcolor:n.bgcolor,styleFilterParams:n.styleFilterParams},coms:n.coms,variables:n.variables}),b.setFilterOption({dataFilters:(d=n.dataFilters)!=null?d:[]})}u===1&&W()}else{const i=+e.projectId;_.loadScreen(i),b.loadFilters(i),await _.loadComs(i)}}catch(u){console.log(u)}finally{t.value=!1,document.title=`${_.screen.name} | \u7F16\u8F91\u5668`,_.autoCanvasScale(()=>({offsetX:v.getPanelOffsetX,offsetY:v.getPanelOffsetY}))}}),{loading:t}}}),Y={class:"g-layout is-vertical edit-container"},Z={class:"g-header"},G={id:"edit-main-wp",class:"g-layout edit-main-wp"},J={class:"g-layout edit-main"};function K(e,o,t,d,u,i){const n=s("header-toolbar"),a=s("layer-panel"),g=s("components-panel"),E=s("filter-manager-drawer"),w=s("toolbox-panel"),P=s("canvas-main"),y=s("g-loading"),T=s("footer-toolbar"),h=s("config-panel"),I=s("editor-context-menu");return $(),O(q,null,[m("div",Y,[m("div",Z,[c(n)]),m("div",G,[c(a),c(g),c(E),m("div",J,[c(w),c(y,{spinning:e.loading},{default:L(()=>[c(P)]),_:1},8,["spinning"]),c(T)]),c(h)])]),c(I)],64)}var Q=x(X,[["render",K],["__scopeId","data-v-b54f1d56"]]),re=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Q});export{H as c,re as i};
