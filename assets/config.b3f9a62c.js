import{a as i,L as p}from"./AppRoot.e99935fe.js";import{a4 as m,aB as f,a5 as a,a6 as d,aa as g,aV as t,aZ as s}from"./vendor.d49f6c0b.js";const u=m({name:"VBorderBoxProp",props:{com:{type:Object,required:!0}},setup(e){return{config:f(e.com,"config"),presetImages:p}}}),_={class:"setting-panel-gui"};function V(e,o,b,y,B,v){const n=a("g-select-image"),l=a("g-field"),r=a("g-field-collapse");return d(),g("div",_,[t(r,{label:"\u6846"},{default:s(()=>[t(l,{level:2,label:"\u6837\u5F0F"},{default:s(()=>[t(n,{modelValue:e.config.boxStyle.style,"onUpdate:modelValue":o[0]||(o[0]=c=>e.config.boxStyle.style=c),images:e.presetImages},null,8,["modelValue","images"])]),_:1})]),_:1})])}var C=i(u,[["render",V]]);export{C as default};
