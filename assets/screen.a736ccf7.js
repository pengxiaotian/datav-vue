import{ad as a}from"./App.1bf88bb8.js";const t="DataV-Preview";async function o(e){await a.get("/screen",{params:{screenId:e}});try{const r=localStorage.getItem(t);if(r)return JSON.parse(r)}catch{localStorage.removeItem(t)}return null}function s(e){return localStorage.setItem(t,JSON.stringify(e)),a.post("/screen",e)}export{o as g,s};