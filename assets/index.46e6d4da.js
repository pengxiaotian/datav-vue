import{x as I,_ as o,y as p,E as u,B as V,b as x,z as d,C as M,F as f,H as b}from"./App.718241ee.js";import{a2 as A,a6 as m,ba as R,a7 as j,ah as k,a3 as i,a8 as O,ab as l,a_ as s,b0 as L,ac as q,a4 as $}from"./vendor.97d7e3b4.js";import{a as C}from"./templates.b77523ce.js";function B(e){switch(e){case"./other/date-picker/src/date-picker.ts":return o(()=>import("./date-picker.4160e44c.js"),["assets/date-picker.4160e44c.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data-field.0ba3a232.js","assets/data.47c2bb42.js"]);default:return new Promise(function(r,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function F(e){switch(e){case"./media/bg-box/src/bg-box.ts":return o(()=>import("./App.718241ee.js").then(function(r){return r.ad}),["assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js"]);case"./media/border-box/src/border-box.ts":return o(()=>import("./App.718241ee.js").then(function(r){return r.ac}),["assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js"]);case"./media/decoration/src/decoration.ts":return o(()=>import("./App.718241ee.js").then(function(r){return r.ae}),["assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js"]);case"./media/main-img/src/main-img.ts":return o(()=>import("./main-img.bb66c602.js"),["assets/main-img.bb66c602.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data.47c2bb42.js"]);default:return new Promise(function(r,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function S(e){switch(e){case"./button/full-screen/src/full-screen.ts":return o(()=>import("./full-screen.7335b272.js"),["assets/full-screen.7335b272.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data.47c2bb42.js"]);default:return new Promise(function(r,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function U(e){switch(e){case"./text/main-title/src/main-title.ts":return o(()=>import("./main-title.891f61e9.js"),["assets/main-title.891f61e9.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data-field.0ba3a232.js","assets/data.47c2bb42.js"]);case"./text/marquee/src/marquee.ts":return o(()=>import("./marquee.bd2d69b4.js"),["assets/marquee.bd2d69b4.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data-field.0ba3a232.js","assets/data.47c2bb42.js"]);case"./text/number-title-flop/src/number-title-flop.ts":return o(()=>import("./number-title-flop.88937efb.js"),["assets/number-title-flop.88937efb.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data-field.0ba3a232.js","assets/data.47c2bb42.js"]);case"./text/paragraph/src/paragraph.ts":return o(()=>import("./paragraph.69ed7368.js"),["assets/paragraph.69ed7368.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data-field.0ba3a232.js","assets/data.47c2bb42.js"]);case"./text/timer/src/timer.ts":return o(()=>import("./timer.ca0bd98d.js"),["assets/timer.ca0bd98d.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data.47c2bb42.js"]);default:return new Promise(function(r,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function N(e){switch(e){case"./chart/word-cloud/src/word-cloud.ts":return o(()=>import("./word-cloud.1c50299e.js"),["assets/word-cloud.1c50299e.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data-field.0ba3a232.js","assets/data.47c2bb42.js"]);default:return new Promise(function(r,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}function z(e){switch(e){case"./bar/basic-bar/src/basic-bar.ts":return o(()=>import("./basic-bar.9236f942.js"),["assets/basic-bar.9236f942.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/data-field.0ba3a232.js","assets/data.47c2bb42.js"]);default:return new Promise(function(r,t){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(t.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}async function H(e){const r=I(e.substr(1));switch(e.substr(1)){case"BasicBar":{const t=await z(`./bar/${r}/src/${r}.ts`);return new t.default}case"WordCloud":{const t=await N(`./chart/${r}/src/${r}.ts`);return new t.default}case"MainTitle":case"Marquee":case"NumberTitleFlop":case"Paragraph":case"Timer":{const t=await U(`./text/${r}/src/${r}.ts`);return new t.default}case"FullScreen":{const t=await S(`./button/${r}/src/${r}.ts`);return new t.default}case"BgBox":case"BorderBox":case"Decoration":case"MainImg":{const t=await F(`./media/${r}/src/${r}.ts`);return new t.default}case"DatePicker":{const t=await B(`./other/${r}/src/${r}.ts`);return new t.default}default:throw Error(`Unknown component type: ${e}.`)}}const W=()=>{const{pageConfig:e}=u;["VMainTitle","VNumberTitleFlop","VDatePicker","VBgBox","VBorderBox","VDecoration","VBasicBar","VMarquee","VParagraph","VTimer","VFullScreen","VMainImg","VWordCloud"].forEach(t=>{H(t).then(n=>{n.attr.x=p(e.width-n.attr.w),n.attr.y=p(e.height-n.attr.h),u.addCom(n),n.apis.source&&n.loadData().then(()=>{V.datavComponents[n.id].$DATAV_requestData()})})})};const X=A({name:"ScreenEditor",components:{HeaderToolbar:m(()=>o(()=>import("./index.0fb12b86.js"),["assets/index.0fb12b86.js","assets/index.891400cf.css","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/screen.3c9c4720.js","assets/layer.e46e48fd.js","assets/publish-screen.b1c4723d.js","assets/publish-screen.df6080ef.css","assets/release.6e088373.js","assets/help.5e29aa3b.js"])),FooterToolbar:m(()=>o(()=>import("./index.4c1331e6.js"),["assets/index.4c1331e6.js","assets/index.dae957f0.css","assets/vendor.97d7e3b4.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/arrow-down.d8f637fe.js"])),EditorContextMenu:m(()=>o(()=>import("./index.75d5da77.js"),["assets/index.75d5da77.js","assets/index.e4ffd428.css","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/dom.6b90dd47.js","assets/warning.3f7e1d33.js","assets/edit.bc054393.js","assets/delete.6ed582c9.js","assets/copy.907fc003.js","assets/lock.f428a3d9.js","assets/show.70bf56a9.js","assets/hide.49b8dfbe.js","assets/index.382e1d7e.js"])),CanvasMain:d(()=>o(()=>import("./index.471ffb20.js"),["assets/index.471ffb20.js","assets/index.e3e9f1e6.css","assets/vendor.97d7e3b4.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/dom.6b90dd47.js","assets/index.382e1d7e.js","assets/templates.b77523ce.js"])),LayerPanel:d(()=>o(()=>import("./index.23b0bc6c.js"),["assets/index.23b0bc6c.js","assets/index.f8bf7f5e.css","assets/vendor.97d7e3b4.js","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/warning.3f7e1d33.js","assets/delete.6ed582c9.js","assets/back.e9298ebe.js","assets/lock.f428a3d9.js","assets/hide.49b8dfbe.js","assets/view-grid.2c511712.js","assets/index.382e1d7e.js","assets/dom.6b90dd47.js"])),ComponentsPanel:d(()=>o(()=>import("./index.58755328.js"),["assets/index.58755328.js","assets/index.193d8278.css","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/search.b4e689d3.js","assets/back.e9298ebe.js","assets/templates.b77523ce.js"])),ConfigPanel:d(()=>o(()=>import("./index.bcc33e5b.js"),["assets/index.bcc33e5b.js","assets/index.1e2ad6b6.css","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/interact.d11f3e9c.js"])),ToolboxPanel:d(()=>o(()=>import("./index.4af76ca2.js"),["assets/index.4af76ca2.js","assets/index.be6b7622.css","assets/vendor.97d7e3b4.js","assets/App.718241ee.js","assets/App.2afe0aa3.css"])),FilterManagerDrawer:d(()=>o(()=>import("./filter-manager-drawer.560158fc.js"),["assets/filter-manager-drawer.560158fc.js","assets/filter-manager-drawer.24f26014.css","assets/App.718241ee.js","assets/App.2afe0aa3.css","assets/vendor.97d7e3b4.js","assets/warning.3f7e1d33.js","assets/document.91fe3b04.js","assets/filter-collapse-panel.33930b8e.js","assets/arrow-left.0b6feab1.js","assets/edit.bc054393.js","assets/delete.6ed582c9.js","assets/release.6e088373.js"]))},props:{projectId:{type:[String,Number],required:!0}},setup(e){const r=R(),t=j(!0);return M.enableDebug(),u.setEditMode(),k(async()=>{var n;try{const _=parseInt(r.query.tpl);if(_>0){const{data:c}=await C(_);if(c){const{config:a}=c;u.setEditorOption({screen:{id:+e.projectId,name:c.name},config:{width:a.width,height:a.height,bgimage:a.bgimage,bgcolor:a.bgcolor,styleFilterParams:a.styleFilterParams},coms:a.coms,variables:a.variables}),f.setFilterOption({dataFilters:(n=a.dataFilters)!=null?n:[]})}_===1&&W()}else{const c=+e.projectId;u.loadScreen(c),f.loadFilters(c),await u.loadComs(c)}}catch(_){console.log(_)}finally{t.value=!1,document.title=`${u.screen.name} | \u7F16\u8F91\u5668`,u.autoCanvasScale(()=>({offsetX:b.getPanelOffsetX,offsetY:b.getPanelOffsetY}))}}),{loading:t}}}),Y={class:"g-layout is-vertical edit-container"},G={class:"g-header"},J={id:"edit-main-wp",class:"g-layout edit-main-wp"},K={class:"g-layout edit-main"};function Q(e,r,t,n,_,c){const a=i("header-toolbar"),v=i("layer-panel"),E=i("components-panel"),g=i("filter-manager-drawer"),w=i("toolbox-panel"),y=i("canvas-main"),P=i("g-loading"),T=i("footer-toolbar"),h=i("config-panel"),D=i("editor-context-menu");return $(),O(q,null,[l("div",Y,[l("div",G,[s(a)]),l("div",J,[s(v),s(E),s(g),l("div",K,[s(w),s(P,{spinning:e.loading},{default:L(()=>[s(y)]),_:1},8,["spinning"]),s(T)]),s(h)])]),s(D)],64)}var Z=x(X,[["render",Q],["__scopeId","data-v-b54f1d56"]]),oe=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Z});export{H as c,oe as i};
