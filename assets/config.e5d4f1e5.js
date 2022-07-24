import{f as p,a as V,j as b}from"./select-options.18b9e052.js";import{a as B}from"./AppRoot.2c69a8d3.js";import{a4 as C,aD as E,a5 as d,aa as v,aX as n,a$ as o,a6 as y}from"./vendor.d03ee3fb.js";import"./echarts-animation.c54de7ad.js";const S=C({name:"VNumberTitleFlopProp",props:{com:{type:Object,required:!0}},setup(u){return{config:E(u.com,"config"),arrangements:[{id:"top",value:"\u6807\u9898\u5728\u4E0A"},{id:"left",value:"\u6807\u9898\u5728\u5DE6"},{id:"bottom",value:"\u6807\u9898\u5728\u4E0B"}],fontFamilys:p,fontWeights:V,justifyContents:b}}}),D={class:"setting-panel-gui"};function U(u,e,F,A,W,z){const a=d("g-select"),t=d("g-field"),f=d("g-slider"),m=d("g-field-collapse"),s=d("g-input"),i=d("g-input-number"),r=d("g-color-picker"),g=d("n-switch");return y(),v("div",D,[n(m,{label:"\u5168\u5C40"},{default:o(()=>[n(t,{level:2,tooltip:"\u8BF7\u9009\u62E9\u60A8\u7CFB\u7EDF\u6709\u7684\u5B57\u4F53\uFF0C\u5982\u679C\u60A8\u7CFB\u7EDF\u65E0\u6B64\u5B57\u4F53\uFF0C\u6807\u9898\u5C06\u4F1A\u663E\u793A\u9ED8\u8BA4\u5B57\u4F53",label:"\u5B57\u4F53"},{default:o(()=>[n(a,{modelValue:u.config.global.fontFamily,"onUpdate:modelValue":e[0]||(e[0]=l=>u.config.global.fontFamily=l),data:u.fontFamilys},null,8,["modelValue","data"])]),_:1}),n(t,{level:2,label:"\u6392\u5217\u65B9\u5F0F"},{default:o(()=>[n(a,{modelValue:u.config.global.arrangement,"onUpdate:modelValue":e[1]||(e[1]=l=>u.config.global.arrangement=l),data:u.arrangements},null,8,["modelValue","data"])]),_:1}),n(t,{level:2,label:"\u95F4\u9694"},{default:o(()=>[n(f,{modelValue:u.config.global.distance,"onUpdate:modelValue":e[2]||(e[2]=l=>u.config.global.distance=l),min:-100,max:500,step:.5,suffix:"px"},null,8,["modelValue","step"])]),_:1})]),_:1}),n(m,{label:"\u6807\u9898"},{default:o(()=>[n(t,{level:2,tooltip:"\u652F\u6301\u4ECE\u6570\u636E\u4E2D\u83B7\u53D6\u6807\u9898\u5185\u5BB9\uFF0C\u8BE6\u89C1\u6570\u636E\u9762\u677F",label:"\u6807\u9898\u540D"},{default:o(()=>[n(s,{modelValue:u.config.title.content,"onUpdate:modelValue":e[3]||(e[3]=l=>u.config.title.content=l)},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u6587\u672C\u6837\u5F0F","is-flat":!0},{default:o(()=>[n(i,{modelValue:u.config.title.textStyle.fontSize,"onUpdate:modelValue":e[4]||(e[4]=l=>u.config.title.textStyle.fontSize=l),min:12,max:100,step:1,suffix:"px",inline:"inline",label:"\u5B57\u53F7"},null,8,["modelValue"]),n(r,{modelValue:u.config.title.textStyle.color,"onUpdate:modelValue":e[5]||(e[5]=l=>u.config.title.textStyle.color=l),inline:"inline",label:"\u5B57\u4F53\u989C\u8272"},null,8,["modelValue"]),n(a,{modelValue:u.config.title.textStyle.fontWeight,"onUpdate:modelValue":e[6]||(e[6]=l=>u.config.title.textStyle.fontWeight=l),data:u.fontWeights,inline:"inline",label:"\u5B57\u4F53\u7C97\u7EC6"},null,8,["modelValue","data"]),n(a,{modelValue:u.config.title.textStyle.textAlign,"onUpdate:modelValue":e[7]||(e[7]=l=>u.config.title.textStyle.textAlign=l),data:u.justifyContents,inline:"inline",label:"\u5BF9\u9F50\u65B9\u5F0F"},null,8,["modelValue","data"])]),_:1})]),_:1}),n(m,{label:"\u7FFB\u724C\u5668"},{default:o(()=>[n(t,{level:2,tooltip:"\u8BF7\u9009\u62E9\u60A8\u7CFB\u7EDF\u6709\u7684\u5B57\u4F53\uFF0C\u5982\u679C\u60A8\u7CFB\u7EDF\u65E0\u6B64\u5B57\u4F53\uFF0C\u6807\u9898\u5C06\u4F1A\u663E\u793A\u9ED8\u8BA4\u5B57\u4F53",label:"\u5B57\u4F53"},{default:o(()=>[n(a,{modelValue:u.config.counter.fontFamily,"onUpdate:modelValue":e[8]||(e[8]=l=>u.config.counter.fontFamily=l),data:u.fontFamilys},null,8,["modelValue","data"])]),_:1}),n(t,{level:2,label:"\u6C34\u5E73\u5BF9\u9F50"},{default:o(()=>[n(a,{modelValue:u.config.counter.justifyContent,"onUpdate:modelValue":e[9]||(e[9]=l=>u.config.counter.justifyContent=l),data:u.justifyContents},null,8,["modelValue","data"])]),_:1}),n(t,{level:2,label:"\u95F4\u8DDD","is-flat":!0},{default:o(()=>[n(i,{modelValue:u.config.counter.margin.preNum,"onUpdate:modelValue":e[10]||(e[10]=l=>u.config.counter.margin.preNum=l),min:-1e3,max:1e3,step:1,suffix:"px",inline:"inline",label:"\u524D\u7F00-\u6570\u5B57"},null,8,["modelValue"]),n(i,{modelValue:u.config.counter.margin.numSuff,"onUpdate:modelValue":e[11]||(e[11]=l=>u.config.counter.margin.numSuff=l),min:-1e3,max:1e3,step:1,suffix:"px",inline:"inline",label:"\u6570\u5B57-\u540E\u7F00"},null,8,["modelValue"])]),_:1}),n(m,{label:"\u524D\u7F00"},{default:o(()=>[n(t,{level:2,label:"\u5185\u5BB9"},{default:o(()=>[n(s,{modelValue:u.config.counter.prefix.content,"onUpdate:modelValue":e[12]||(e[12]=l=>u.config.counter.prefix.content=l)},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u6587\u672C\u6837\u5F0F","is-flat":!0},{default:o(()=>[n(i,{modelValue:u.config.counter.prefix.textStyle.fontSize,"onUpdate:modelValue":e[13]||(e[13]=l=>u.config.counter.prefix.textStyle.fontSize=l),min:12,max:100,step:1,suffix:"px",inline:"inline",label:"\u5B57\u53F7"},null,8,["modelValue"]),n(r,{modelValue:u.config.counter.prefix.textStyle.color,"onUpdate:modelValue":e[14]||(e[14]=l=>u.config.counter.prefix.textStyle.color=l),inline:"inline",label:"\u5B57\u4F53\u989C\u8272"},null,8,["modelValue"]),n(a,{modelValue:u.config.counter.prefix.textStyle.fontWeight,"onUpdate:modelValue":e[15]||(e[15]=l=>u.config.counter.prefix.textStyle.fontWeight=l),data:u.fontWeights,inline:"inline-single",label:"\u5B57\u4F53\u7C97\u7EC6"},null,8,["modelValue","data"])]),_:1})]),_:1}),n(m,{label:"\u540E\u7F00"},{default:o(()=>[n(t,{level:2,label:"\u5185\u5BB9"},{default:o(()=>[n(s,{modelValue:u.config.counter.suffix.content,"onUpdate:modelValue":e[16]||(e[16]=l=>u.config.counter.suffix.content=l)},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u6587\u672C\u6837\u5F0F","is-flat":!0},{default:o(()=>[n(i,{modelValue:u.config.counter.suffix.textStyle.fontSize,"onUpdate:modelValue":e[17]||(e[17]=l=>u.config.counter.suffix.textStyle.fontSize=l),min:12,max:100,step:1,suffix:"px",inline:"inline",label:"\u5B57\u53F7"},null,8,["modelValue"]),n(r,{modelValue:u.config.counter.suffix.textStyle.color,"onUpdate:modelValue":e[18]||(e[18]=l=>u.config.counter.suffix.textStyle.color=l),inline:"inline",label:"\u5B57\u4F53\u989C\u8272"},null,8,["modelValue"]),n(a,{modelValue:u.config.counter.suffix.textStyle.fontWeight,"onUpdate:modelValue":e[19]||(e[19]=l=>u.config.counter.suffix.textStyle.fontWeight=l),data:u.fontWeights,inline:"inline-single",label:"\u5B57\u4F53\u7C97\u7EC6"},null,8,["modelValue","data"])]),_:1})]),_:1})]),_:1}),n(m,{label:"\u6570\u5B57"},{default:o(()=>[n(m,{label:"\u6587\u672C\u6837\u5F0F"},{default:o(()=>[n(t,{level:2,label:"\u5B57\u53F7"},{default:o(()=>[n(i,{modelValue:u.config.numbers.textStyle.fontSize,"onUpdate:modelValue":e[20]||(e[20]=l=>u.config.numbers.textStyle.fontSize=l),min:12,max:100,step:1,suffix:"px"},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u5B57\u4F53\u989C\u8272"},{default:o(()=>[n(r,{modelValue:u.config.numbers.textStyle.color,"onUpdate:modelValue":e[21]||(e[21]=l=>u.config.numbers.textStyle.color=l)},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u5B57\u4F53\u7C97\u7EC6"},{default:o(()=>[n(a,{modelValue:u.config.numbers.textStyle.fontWeight,"onUpdate:modelValue":e[22]||(e[22]=l=>u.config.numbers.textStyle.fontWeight=l),data:u.fontWeights},null,8,["modelValue","data"])]),_:1})]),_:1}),n(t,{level:2,label:"\u6570\u5B57\u95F4\u9694"},{default:o(()=>[n(f,{modelValue:u.config.numbers.marginRight,"onUpdate:modelValue":e[23]||(e[23]=l=>u.config.numbers.marginRight=l),min:0,max:10,step:.5},null,8,["modelValue","step"])]),_:1}),n(t,{level:2,tooltip:"\u6CE8\u610F\uFF1A\u5B57\u4F53\u989C\u8272\u4E3A\u6E10\u53D8\u8272\u65F6\uFF0C\u5B57\u4F53\u80CC\u666F\u8272\u5C06\u4F1A\u5931\u6548\u3002",label:"\u80CC\u666F\u8272"},{default:o(()=>[n(r,{modelValue:u.config.numbers.bgColor,"onUpdate:modelValue":e[24]||(e[24]=l=>u.config.numbers.bgColor=l)},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u80CC\u666F\u5706\u89D2"},{default:o(()=>[n(f,{modelValue:u.config.numbers.bgRadius,"onUpdate:modelValue":e[25]||(e[25]=l=>u.config.numbers.bgRadius=l),min:0,max:1e3,step:1},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u5206\u9694\u7B26\u80CC\u666F"},{default:o(()=>[n(g,{value:u.config.numbers.bgSeparating,"onUpdate:value":e[26]||(e[26]=l=>u.config.numbers.bgSeparating=l)},null,8,["value"])]),_:1}),n(t,{level:2,label:"\u9ED8\u8BA4\u4F4D\u6570"},{default:o(()=>[n(f,{modelValue:u.config.numbers.digit,"onUpdate:modelValue":e[27]||(e[27]=l=>u.config.numbers.digit=l),min:0,max:100,step:1},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u5C0F\u6570\u70B9\u4F4D\u6570"},{default:o(()=>[n(f,{modelValue:u.config.numbers.decimal,"onUpdate:modelValue":e[28]||(e[28]=l=>u.config.numbers.decimal=l),min:0,max:8,step:1},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u9664\u6570"},{default:o(()=>[n(i,{modelValue:u.config.numbers.divisor,"onUpdate:modelValue":e[29]||(e[29]=l=>u.config.numbers.divisor=l),step:1},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u5343\u4F4D\u5206\u9694\u7B26"},{default:o(()=>[n(g,{value:u.config.numbers.separatingChart,"onUpdate:value":e[30]||(e[30]=l=>u.config.numbers.separatingChart=l)},null,8,["value"])]),_:1}),n(t,{level:2,tooltip:"\u5206\u9694\u7B26\u6700\u957F\u4E00\u4F4D\uFF0C\u8D85\u51FA\u4E00\u4F4D\u53D6\u7B2C\u4E00\u4F4D\uFF0C\u65E0\u6CD5\u4EE5\u6570\u5B57\u4E3A\u5206\u9694\u7B26",label:"\u5343\u4F4D\u5206\u9694\u7B26\u7B26\u53F7"},{default:o(()=>[n(s,{modelValue:u.config.numbers.separatingSymbol,"onUpdate:modelValue":e[31]||(e[31]=l=>u.config.numbers.separatingSymbol=l)},null,8,["modelValue"])]),_:1}),n(t,{level:2,tooltip:"\u5206\u9694\u7B26\u6700\u957F\u4E00\u4F4D\uFF0C\u8D85\u51FA\u4E00\u4F4D\u53D6\u7B2C\u4E00\u4F4D\uFF0C\u65E0\u6CD5\u4EE5\u6570\u5B57\u4E3A\u5206\u9694\u7B26",label:"\u5C0F\u6570\u5206\u9694\u7B26\u7B26\u53F7"},{default:o(()=>[n(s,{modelValue:u.config.numbers.decimalSymbol,"onUpdate:modelValue":e[32]||(e[32]=l=>u.config.numbers.decimalSymbol=l)},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u5B9A\u5BBD"},{default:o(()=>[n(i,{modelValue:u.config.numbers.fixedWidth,"onUpdate:modelValue":e[33]||(e[33]=l=>u.config.numbers.fixedWidth=l),min:0,max:100,step:1},null,8,["modelValue"])]),_:1}),n(t,{level:2,label:"\u5F00\u542F\u52A8\u753B"},{default:o(()=>[n(g,{value:u.config.numbers.animation,"onUpdate:value":e[34]||(e[34]=l=>u.config.numbers.animation=l)},null,8,["value"])]),_:1}),n(t,{level:2,label:"\u52A8\u753B\u65F6\u957F"},{default:o(()=>[n(i,{modelValue:u.config.numbers.duration,"onUpdate:modelValue":e[35]||(e[35]=l=>u.config.numbers.duration=l),min:0,step:500,suffix:"ms"},null,8,["modelValue"])]),_:1})]),_:1})])}var N=B(S,[["render",U]]);export{N as default};
