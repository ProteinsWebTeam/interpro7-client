"use strict";(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[2530],{72618:(e,t,r)=>{r.r(t),r.d(t,{SearchHistory:()=>u,default:()=>y}),r(752),r(76265);var a=r(67294),s=r(54049),c=r(29643),l=r(65455),n=r(3817),m=r(3509),o=r(16786),i=r(29239),h=r(45913),_=(0,m.D)(h.Z,i.Z,o.Z,{"search-terms-div":"SearchHistory_styles__search-terms-div___cb","search-term":"SearchHistory_styles__search-term___d1","remove-term":"SearchHistory_styles__remove-term___a9","search-link":"SearchHistory_styles__search-link___c9"}),u=()=>{var[e,t]=(0,a.useState)([]);return(0,a.useEffect)((()=>{s.Z&&s.Z.getValue()?t(s.Z.getValue()):t([])}),[]),a.createElement(a.Fragment,null,a.createElement("div",{className:_("row")},a.createElement("div",{className:_("search-terms-div")},e.map((e=>a.createElement("div",{className:_("tag","search-term"),key:e},a.createElement("button",{className:_("remove-term"),onClick:()=>(e=>{var r=s.Z.getValue();r.splice(r.indexOf(e),1),s.Z.setValue(r),t(r)})(e)},"✖"),a.createElement(c.Z,{to:{description:{main:{key:"search"},search:{type:"text",value:e}}},className:_("search-link")},a.createElement("span",null,e))))))),e.length>0?a.createElement("div",{className:_("row")},a.createElement("div",{className:_("column")},a.createElement(n.Z,{type:"tertiary",onClick:()=>{s.Z.setValue([]),t([])}},"Clear History"))):a.createElement(l.Z,{type:"info"},a.createElement("span",{style:{fontWeight:"bold"}},"There has been no recent searches.")))};const y=u},54049:(e,t,r)=>{r.d(t,{Z:()=>c});var a,s=r(47750);try{a=new s.Z("search","local",1e3)}catch(e){console.error("Unable to create a persistent storage for the search terms"),console.error(e)}const c=a}}]);
//# sourceMappingURL=2530.module.search-history.df4.js.map