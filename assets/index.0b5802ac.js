import{a4 as E,aC as z,a6 as u,aa as g,a7 as H,bj as A,ac as $,aZ as F,ad as h,ae as _,af as I,ai as B,b6 as C,a5 as P,a9 as L,bk as W,b8 as T,aj as X,ah as D}from"./vendor.d03ee3fb.js";import{x as V,J as M,a as R,E as Y,w as Z,H as G,g as J,Z as S}from"./AppRoot.2c69a8d3.js";import{o as K,s as p}from"./dom.616b1dc0.js";import{g as Q}from"./screen.5f405b8c.js";const U=E({props:{com:{type:Object,required:!0}},setup(o){const a=V(),l=z(()=>{const n=a.pageConfig.styleFilterParams;let m="";return n.enable&&(m=`hue-rotate(${n.hue}deg) contrast(${n.contrast}%) opacity(${n.opacity}%) saturate(${n.saturate}%) brightness(${n.brightness}%)`),m});return(n,m)=>(u(),g("div",{style:$({"pointer-events":"none","z-index":0,left:o.com.attr.x+"px",top:o.com.attr.y+"px",width:o.com.attr.w+"px",height:o.com.attr.h+"px",opacity:o.com.attr.opacity,transform:`rotate(${o.com.attr.deg}deg) ${o.com.attr.filpH?"scaleX(-1)":""} ${o.com.attr.filpV?"scaleY(-1)":""}`,filter:F(l)}),class:"-datav-com absolute"},[(u(),H(A(o.com.name),{com:o.com},null,8,["com"]))],4))}}),tt=E({props:{com:{type:Object,required:!0}},setup(o){const a=o,l=z(()=>{const{attr:e}=a.com;return{"pointer-events":"none",position:"absolute",overflow:"visible",width:`${e.w}px`,height:`${e.h}px`,opacity:e.opacity,transform:`translate(${e.x}px, ${e.y}px)`}}),n=z(()=>{const{attr:e}=a.com;return e.apply3d?{width:"100%",height:"100%",perspective:`${e.perspective}px`,"perspective-origin":`${e.perspectiveOrigin.x}% ${e.perspectiveOrigin.y}%`}:{width:"100%",height:"100%"}}),m=(e,s)=>{const c=(v,f)=>v===f?1:0;return`rotate3d(${c(e,"x")}, ${c(e,"y")}, ${c(e,"z")}, ${s}deg)`},b=e=>{const{attr:s}=e,c={justifyContent:"center",alignItems:"center",display:"block",opacity:1,transform:"translate3d(0, 0, 0)",width:"auto",height:"auto",position:"absolute",transformOrigin:`${s.w/2+s.x}px ${s.h/2+s.y}`};if(a.com.attr.apply3d){const v=a.com.config.find(O=>O.transform3d.id===e.id),{rotate3d:f,scale3d:k,translate3d:w}=v.transform3d;c.transform=`translate3d(${w.x}px, ${w.y}px, ${w.z}px) scale3d(${k.x}, ${k.y}, 1) ${m(f.axis,f.deg)}`}return c};return(e,s)=>(u(),g("div",{key:o.com.id,style:$(F(l)),class:"-datav-layer slider"},[h("div",{class:"slider-wrap",style:$(F(n))},[(u(!0),g(_,null,I(o.com.children,c=>(u(),g("div",{key:c.id,class:"slider-item",style:$(b(c))},[B(e.$slots,"default",{data:c})],4))),128))],4)],4))}}),et=E({name:"DatavTransform",props:{com:{type:Object,required:!0}},setup(){const o=a=>a.type===M.com?C(U,{com:a},{default:()=>C(P(a.name),{com:a})}):C(tt,{com:a},{default:({data:l})=>o(l)});return{create:o}},render(){return this.create(this.$props.com)}});const ot="//files.pengxiaotian.com",rt=E({name:"Preview",components:{DatavCom:et},props:{screenId:{type:[String,Number],required:!0}},setup(o){const a=Y(),l=V(),n=Z(),m=G(),b=L(!0),{pageConfig:e}=W(l),{coms:s}=W(n),c=z(()=>{const t=e.value.styleFilterParams;let r="";return t.enable&&(r=`hue-rotate(${t.hue}deg) contrast(${t.contrast}%) opacity(${t.opacity}%) saturate(${t.saturate}%) brightness(${t.brightness}%)`),r}),v=(t,r)=>{const d=document.documentElement.clientWidth,x=document.documentElement.clientHeight,i=d/t,y=x/r;p(document.body,{transform:`scale(${i}, ${y})`,transformOrigin:"left top",backgroundSize:"100% 100%"})},f=t=>{const r=document.documentElement.clientWidth/t;p(document.body,{transform:`scale(${r})`,transformOrigin:"left top",backgroundSize:"100%"})},k=(t,r)=>{const d=document.documentElement.clientWidth,i=document.documentElement.clientHeight/r,y=(d-t*i)/2;p(document.body,{transform:`scale(${i})`,transformOrigin:"left top",backgroundSize:`${t/d*i*100}% 100%`,backgroundPosition:`${y.toFixed(3)}px top`,marginLeft:`${y.toFixed(3)}px`})},w=(t,r)=>{const d=document.documentElement.clientWidth,i=document.documentElement.clientHeight/r,y=(d-t*i)/2;p(document.body,{transform:`scale(${i})`,transformOrigin:"left top",backgroundSize:`${t/d*i*100}% 100%`,backgroundPosition:`${y.toFixed(3)}px top`}),document.documentElement.style.overflowX="scroll"},O=()=>{p(document.body,{overflow:"hidden",position:"relative"})},j=t=>{switch(t.zoomMode){case S.auto:v(t.width,t.height);break;case S.width:f(t.width);break;case S.height:k(t.width,t.height);break;case S.full:w(t.width,t.height);break;default:O();break}},q=t=>{document.title=l.screen.name,document.querySelector('meta[name="viewport"]').setAttribute("content",`width=${t.width}`),p(document.documentElement,{overflowX:"hidden",overflowY:"visible"}),p(document.body,{width:`${t.width}px`,height:`${t.height}px`,backgroundImage:`url(${e.value.bgimage})`,backgroundColor:e.value.bgcolor}),j(t)},N=T();return X(async()=>{var t;try{const r=await Q(+o.screenId);if(r){l.setEditorOption({screen:r.screen,config:r.config}),q(r.config),n.load(r.coms);const{componentsView:d,publishersView:x,subscribersView:i}=r.variables;m.$patch({componentsView:d,publishersView:x,subscribersView:i}),a.$patch({dataFilters:(t=r.dataFilters)!=null?t:[]}),setTimeout(()=>{b.value=!1},500),K(window,"resize",()=>{j(e.value)})}else throw new Error("404")}catch{N.replace({name:"NotFound",params:{catchAll:"error"}})}}),{cdn:ot,LOGO:J.logo,loading:b,pageConfig:e,coms:s,styleFilter:c}}}),at={target:"_blank",href:"javascript:;"},nt=["src"],st={key:0,href:"/",target:"_blank",class:"datav-watermark"},ct=["src"],it={class:"scene"};function lt(o,a,l,n,m,b){const e=P("datav-com");return u(),g(_,null,[h("div",{id:"datav-loading",style:$({background:"rgb(15, 42, 66)",display:o.loading?"block":"none"})},[h("a",at,[h("img",{class:"datav-logo",src:`${o.cdn}/datav/datav-loading.gif`},null,8,nt)])],4),h("div",{class:"datav-layout",style:$({visibility:o.loading?"hidden":"visible"})},[o.pageConfig.useWatermark?(u(),g("a",st,[h("img",{src:o.LOGO},null,8,ct)])):D("",!0),h("div",it,[(u(!0),g(_,null,I(o.coms,s=>(u(),H(e,{key:s.id,com:s},null,8,["com"]))),128))])],4)],64)}var ht=R(rt,[["render",lt]]);export{ht as default};
