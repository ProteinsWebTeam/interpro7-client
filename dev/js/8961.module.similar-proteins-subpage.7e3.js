"use strict";(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[8961],{7877:(e,t,a)=>{a.d(t,{Z:()=>b}),a(268);var n=a(67294),r=a(29643),o=a(719),i=(a(752),a(76265),a(34287)),s=a(10838),c=a(19119),l=a(8575),d=a(41220),m=a(30048),p=(0,c.P1)((e=>e.settings.api),((e,t)=>t),((e,t)=>{var{protocol:a,hostname:n,port:r,root:o}=e;if(!t.shouldLoad)return null;var i={main:{key:t.type},[t.type]:{accession:t.accession,db:t.source}};return(0,l.format)({protocol:a,hostname:n,port:r,pathname:o+(0,s.Z)(i)})})),u=(0,i.Z)(p)((e=>{var{data:t,onLoad:a,databases:r,locations:o}=e;return(0,n.useEffect)((()=>{if(t&&!t.loading&&t.payload&&t.payload.metadata){var{accession:e,name:{name:i},source_database:s}=t.payload.metadata;a((()=>n.createElement(m.Z,{locations:o,accession:e,dbName:r[s].name,name:i})))}})),null}));const h=e=>{var{type:t,source:a,accession:r,children:o,databases:i,locations:s}=e,[c,l]=(0,n.useState)(!1),[m,p]=(0,n.useState)((()=>n.createElement("b",null,r))),[h,v]=(0,n.useState)(s);return n.createElement(n.Fragment,null,n.createElement(d.Z,{message:m,onMouseOverFeature:e=>{l(!0),v(e)}},o),n.createElement(u,{accession:r,type:t,source:a,onLoad:p,databases:i,locations:h,shouldLoad:c}))};var v=a(16772),_=a(55733),y=a(76371),g=a(44543),f=(0,y.Z)(g.Z);const b=e=>{var{matches:t,length:a,maxLength:i,databases:s,highlight:c=[]}=e,l=80*a/i+"%";return n.createElement("div",{className:f("ida-protvista")},t.map(((e,t)=>n.createElement("div",{key:e.accession+"-"+t,className:f("track-row")},n.createElement("div",{className:f("track-component",{highlight:c.indexOf(e.accession)>=0}),style:{width:l}},n.createElement(h,{type:"entry",source:e.accession.toLowerCase().startsWith("ipr")?"interpro":"pfam",accession:""+e.accession,databases:s,locations:e.locations},n.createElement(_.Z,{length:a,"display-start":1,"display-end":a,data:[e],shape:"roundRectangle","margin-color":"#fafafa",expanded:!0,"use-ctrl-to-zoom":!0,height:22,color:(0,v.mt)({accession:e.accession},v.tK.ACCESSION)}))),n.createElement("div",{className:f("track-accession")},n.createElement(r.Z,{to:{description:{main:{key:"entry"},entry:{db:e.accession.toLowerCase().startsWith("ipr")?"InterPro":"pfam",accession:e.accession}}}},e.name))))),n.createElement("div",{className:f("track-row")},n.createElement("div",{className:f("track-length"),style:{width:l}},n.createElement("div",{className:f("note")}),n.createElement("div",{className:f("length")},n.createElement(o.ZP,{noTitle:!0},a)))))}},65013:(e,t,a)=>{a.d(t,{Z:()=>w}),a(64043),a(61514),a(60429),a(86544);var n=a(67294),r=a(19119),o=a(45007),i=a(8575),s=a(10838),c=a(87616),l=a(2191),d=a(76820),m=a(21164),p=a(16392),u=a(35096),h=(0,r.P1)((e=>e.customLocation.description.entry),(e=>e.customLocation.search),((e,t)=>({entryLocation:e,search:t})));const v=(0,o.$j)(h)((e=>{var{entryLocation:t,search:a,fileType:r,count:o}=e;return n.createElement(u.Z,{fileType:r,name:"ida-search-results."+r,count:o,customLocationDescription:{main:{key:"entry"},entry:Object.assign(Object.assign({},t||{}),{detail:void 0})},search:(null==t?void 0:t.accession)?{ida:""}:a,endpoint:"ida"})}));var _=a(76371),y=a(83373),g=a(72694),f=(0,_.Z)({"options-panel":"Options_style__options-panel___b5","accession-selector-panel":"Options_style__accession-selector-panel___bb"},y.Z),b=(e,t,a)=>{var{protocol:n,hostname:r,port:o,root:c}=e,l={main:{key:"entry"},entry:Object.assign(Object.assign({},t||{}),{detail:void 0})};return(0,i.format)({protocol:n,hostname:r,port:o,pathname:c+(0,s.Z)(l),query:(null==t?void 0:t.accession)?{ida:""}:a})},E=(0,r.P1)((e=>e.settings.api),(e=>e.customLocation.description.entry),(e=>e.customLocation.search),(e=>e.settings.ui),((e,t,a,n)=>{var{idaAccessionDB:r}=n;return{api:e,entryLocation:t,search:a,idaAccessionDB:r}}));const w=(0,o.$j)(E,{changeSettingsRaw:c.Ft})((e=>{var{changeSettingsRaw:t,idaAccessionDB:a,api:r,count:o=0,showDBSelector:i=!0,showExporter:s=!0,search:c,entryLocation:u}=e;return n.createElement("nav",{className:f("options-panel")},i&&n.createElement("div",{className:f("accession-selector-panel")},n.createElement("label",null,"Database:"," ",n.createElement(l.Z,{title:"Switch between domain architectures based on Pfam and InterPro entries"},n.createElement(d.Z,{switchCond:"pfam"===a,name:"accessionDB",id:"accessionDB-input",SRLabel:"Use accessions from",onValue:"Pfam",offValue:"InterPro",handleChange:()=>{t("ui","idaAccessionDB","pfam"===a?"interpro":"pfam")},addAccessionStyle:!0})))),s&&n.createElement(m.Z,{includeSettings:!1},n.createElement("div",{className:f("menu-grid")},n.createElement(v,{count:o,fileType:"json"}),n.createElement(v,{count:o,fileType:"tsv"}),r&&n.createElement(p.Z,{type:"api",url:(0,g.Y2)(b(r,u,c))}))))}))},77180:(e,t,a)=>{a.d(t,{Z:()=>i}),a(268);var n=a(67294),r=a(29643),o=(0,a(76371).Z)({"ida-text-domain":"TextIDA_style__ida-text-domain___ce"});const i=e=>{var{accessions:t}=e;return n.createElement("div",{style:{display:"flex"}},n.createElement("div",null,t.map(((e,t)=>n.createElement(n.Fragment,{key:t},0!==t&&" - ",n.createElement("span",{className:o("ida-text-domain")},n.createElement(r.Z,{to:{description:{main:{key:"entry"},entry:{db:e.toLowerCase().startsWith("ipr")?"InterPro":"pfam",accession:e}}}}," ",e)))))))}},96753:(e,t,a)=>{a.d(t,{HR:()=>O,ZP:()=>x,rg:()=>k}),a(752),a(73964),a(76265),a(278),a(60429),a(64043),a(61514),a(86544),a(57267);var n=a(67294),r=a(19119),o=a(8575),i=a(10838),s=a(29643),c=a(85869),l=a(65455),d=a(95524),m=a(40730),p=a(5064),u=a(65013),h=a(7877),v=a(77180),_=a(34287),y=a(21105),g=a(9033),f=a(63139),b=a(76371),E=a(82806),w=a(44543),Z=(0,b.Z)({svgContainer:"DomainArchitectures_style__svgContainer___a2",svg:"DomainArchitectures_style__svg___ae",guidelines:"DomainArchitectures_style__guidelines___f5",highlight:"DomainArchitectures_style__highlight___ee","ida-protvista":"DomainArchitectures_style__ida-protvista___e2","track-component":"DomainArchitectures_style__track-component___f7","track-placehoder":"DomainArchitectures_style__track-placehoder___f2","track-accession":"DomainArchitectures_style__track-accession___bc"},w.Z,E.Z),P=(0,y.Z)({loader:()=>a.e(1169).then(a.bind(a,25392)),loading:()=>null}),S=1e3,L=e=>({"@id":"@additionalProperty","@type":"PropertyValue",name:"isContainedIn",value:[{"@type":"CreativeWork",additionalType:"DomainArchitecture",identifier:e.ida_id,name:e.ida}]}),k=(e,t,a)=>{var n=e.split("-"),r=n.length,o=(S-5*(r+1))/r,i=t?[...t.domains]:[],s=n.map(((e,n)=>{var[r,s]=e.split(":"),[c,l]=e.split(":"),d=[{fragments:[{start:5+n*(5+o),end:(n+1)*(5+o)}]}];if(t){var[m,p]=i.splice(0,s?2:1);(null==m?void 0:m.name)&&(c=m.name),(null==p?void 0:p.name)&&(l=p.name),d="pfam"===a?null==m?void 0:m.coordinates:(null==p?void 0:p.coordinates)||(null==m?void 0:m.coordinates)}return{accession:"pfam"===a?r:s||r,name:"pfam"===a?c:l||c,unintegrated:!s,locations:d}})),c=s.reduce(((e,t)=>(e[t.accession]?e[t.accession].locations.push(t.locations[0]):e[t.accession]=Object.assign(Object.assign({},t),{locations:[...t.locations]}),e)),{});return{length:(null==t?void 0:t.length)||S,domains:Object.values(c),accessions:s.map((e=>e.accession))}},O=e=>{var{data:t,mainAccession:a,search:r,dataDB:o,highlight:i=[],idaAccessionDB:_,database:y}=e,{loading:g,payload:b,status:E}=t||{};if(g||(null==o?void 0:o.loading))return n.createElement(c.Z,null);var w=m.dG.get(E||0);if(w)return n.createElement(p.ZP,{text:w,status:E||0});if(!(null==b?void 0:b.results))return null;var O,A=0===i.length&&a?[a]:i;O=0===b.count?n.createElement(l.Z,{type:"warning"},"No domain architectures found. Domain architectures are determined for Pfam entries, and InterPro entries that integrate Pfam entries."):n.createElement("h4",null,b.count," domain architectures");var D,x,C=(D=b.results||[],0===(x=Math.max(...D.map((e=>{var t;return(null===(t=null==e?void 0:e.representative)||void 0===t?void 0:t.length)||0}))))?S:100*Math.ceil(x/100));return n.createElement("div",{className:Z("vf-stack","vf-stack--400")},O,n.createElement(u.Z,{showDBSelector:!y,count:b.count}),(b.results||[]).map((e=>{var t,r,i=(y||_||"").toLowerCase(),c=k(e.ida,e.representative,i),l=null===(t=null==e?void 0:e.representative)||void 0===t?void 0:t.accession;return n.createElement("div",{key:e.ida_id,className:Z("margin-bottom-large")},n.createElement(P,{data:e,processData:L}),n.createElement("div",null,n.createElement(s.Z,{to:{description:{main:{key:"protein"},protein:{db:"UniProt"},entry:{db:y||_,accession:a}},search:{ida:e.ida_id}}},"There ",e.unique_proteins>1?"are":"is"," ",e.unique_proteins," ",(0,f.iZ)("protein",e.unique_proteins)," "),"with this architecture",l&&n.createElement(n.Fragment,null," ","(represented by"," ",n.createElement(s.Z,{to:{description:{main:{key:"protein"},protein:{db:"uniprot",accession:l}}}},l),")"),":"),n.createElement(v.Z,{accessions:c.accessions}),n.createElement(h.Z,{matches:c.domains,length:c.length,maxLength:C,databases:(null===(r=null==o?void 0:o.payload)||void 0===r?void 0:r.databases)||{},highlight:A}))})),n.createElement(d.Z,{withPageSizeSelector:!0,actualSize:b.count,pagination:r||{},nextAPICall:b.next,previousAPICall:b.previous,notFound:!1}))},A=(0,r.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>{var{protocol:n,hostname:r,port:s,root:c}=e,{type:l,search:d}=a,m=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(n=Object.getOwnPropertySymbols(e);r<n.length;r++)t.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(e,n[r])&&(a[n[r]]=e[n[r]])}return a}(a,["type","search"]);return m.ida="",(0,o.format)({protocol:n,hostname:r,port:s,pathname:c+(0,i.Z)(t).replace("domain_architecture",""),query:m})})),D=(0,r.P1)((e=>e.customLocation.description.main.key&&e.customLocation.description[e.customLocation.description.main.key].accession),(e=>e.customLocation.search),(e=>e.settings.ui),((e,t,a)=>{var{idaAccessionDB:n}=a;return{mainAccession:e,search:t,idaAccessionDB:n}}));const x=(0,_.Z)({getUrl:g.g$,propNamespace:"DB"})((0,_.Z)({getUrl:A,mapStateToProps:D})(O))},76820:(e,t,a)=>{a.d(t,{Z:()=>s}),a(752),a(76265),a(60429);var n=a(67294),r=a(76371),o=a(82806),i=(0,r.Z)(o.Z,{"new-switch":"ToggleSwitch_style__new-switch___f6","switch-input":"ToggleSwitch_style__switch-input___b8","switch-paddle":"ToggleSwitch_style__switch-paddle___c6","switch-active":"ToggleSwitch_style__switch-active___d8","switch-inactive":"ToggleSwitch_style__switch-inactive___d2",tiny:"ToggleSwitch_style__tiny___a1",small:"ToggleSwitch_style__small___d3",large:"ToggleSwitch_style__large___e1",disabled:"ToggleSwitch_style__disabled___fa","accession-selector":"ToggleSwitch_style__accession-selector___cc"});const s=e=>{var{name:t="switch",id:a,size:r="large",switchCond:o,disabled:s=!1,label:c,SRLabel:l,onValue:d="On",offValue:m="Off",handleChange:p,addAccessionStyle:u=!1,width:h}=e,[v,_]=(0,n.useState)(o);(0,n.useEffect)((()=>{_(o)}),[o]);var y=h?{width:h}:{};return n.createElement("div",{className:i("new-switch",r)},n.createElement("label",{htmlFor:a},n.createElement("input",{type:"checkbox",checked:v,className:i("switch-input"),name:t,id:a,onChange:e=>{p?p(e):_(!v)},disabled:s}),c,n.createElement("label",{className:i("switch-paddle",u?"accession-selector":"",s?"disabled":""),style:Object.assign({},y),htmlFor:a},l?n.createElement("span",{className:i("show-for-sr")},l,":"):null,n.createElement("span",{className:i("switch-active"),"aria-hidden":"true"},d),n.createElement("span",{className:i("switch-inactive"),"aria-hidden":"true"},m))))}},45537:(e,t,a)=>{a.r(t),a.d(t,{default:()=>R}),a(752),a(76265),a(86544);var n=a(67294),r=a(45007),o=a(19119),i=a(85869),s=a(2191),c=a(76820),l=(a(73964),a(64043),a(61514),a(8575)),d=a(10838),m=a(21105),p=a(34287),u=a(29643),h=a(41089),v=a(35096);const _=e=>{var{description:t,count:a,ida:r,fileType:o,db:i}=e;return n.createElement(v.Z,{fileType:o,name:"protein-similar-to-"+t[t.main.key].accession+"."+o,count:a,customLocationDescription:{main:{key:"protein"},protein:{db:i}},search:{ida:r},endpoint:"protein"})};var y=a(16392),g=a(76371),f=a(82806),b=a(11772),E=a(83373),w=a(44166),Z=(0,g.Z)(w.Z,f.Z,{},E.Z,b.Z),P=(0,m.Z)({loader:()=>a.e(1169).then(a.bind(a,25392)),loading:()=>null}),S=e=>({"@id":"@additionalProperty","@type":"PropertyValue",name:"SimilarProteins",value:e.map((e=>"https://www.ebi.ac.uk/interpro/protein/"+e.metadata.source_database+"/"+e.metadata.accession+"/"))}),L=(e,t,a)=>{var{protocol:n,hostname:r,port:o,root:i}=e;return(0,l.format)({protocol:n,hostname:r,port:o,pathname:i+(0,d.Z)({main:{key:"protein"},protein:{db:a}}),query:{ida:t}})},k=(0,o.P1)((e=>e.settings.api),(e=>e.customLocation.search),((e,t)=>t.ida),((e,t)=>t.db),((e,t,a,n)=>{var{protocol:r,hostname:o,port:i,root:s}=e,{type:c,search:m}=t,p=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(n=Object.getOwnPropertySymbols(e);r<n.length;r++)t.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(e,n[r])&&(a[n[r]]=e[n[r]])}return a}(t,["type","search"]);p.ida=a;var u={main:{key:"protein"},protein:{db:n}};return(0,l.format)({protocol:r,hostname:o,port:i,pathname:s+(0,d.Z)(u),query:p})})),O=(0,o.P1)((e=>e.customLocation.search),(e=>e.customLocation.description),(e=>e.settings.api),((e,t,a)=>({search:e,description:t,api:a})));const A=(0,p.Z)({getUrl:k,propNamespace:"IDA",mapStateToProps:O})((e=>{var{dataIDA:t,isStaleIDA:a,db:r,ida:o,description:c,search:l,api:m}=e,{loading:p,payload:v,url:g}=t||{};return p||!v?n.createElement(i.Z,null):c&&m?n.createElement(n.Fragment,null,n.createElement(P,{data:v.results,processData:S}),n.createElement(h.ZP,{dataTable:v.results,actualSize:v.count,query:l,isStale:a,currentAPICall:g,nextAPICall:v.next,previousAPICall:v.previous,notFound:0===v.results.length},n.createElement(h.xw,null),n.createElement(h.uX,null,n.createElement("div",{className:Z("menu-grid")},n.createElement(_,{description:c,ida:o,db:r,count:v.count,fileType:"fasta"}),n.createElement(_,{description:c,ida:o,db:r,count:v.count,fileType:"json"}),n.createElement(_,{description:c,ida:o,db:r,count:v.count,fileType:"tsv"}),n.createElement(y.Z,{type:"api",url:L(m,o,r)}),n.createElement(y.Z,{search:l,type:"scriptgen",subpath:(0,d.Z)(c)}))),n.createElement(h.sg,{dataKey:"accession",renderer:(e,t)=>{var{source_database:a}=t;return n.createElement(n.Fragment,null,n.createElement(u.Z,{to:{description:{main:{key:"protein"},protein:{db:a,accession:e}}}},e)," ","reviewed"===a&&n.createElement(s.Z,{title:"Reviewed by UniProtKB curators"},n.createElement("span",{className:Z("icon","icon-common"),"data-icon":"","aria-label":"reviewed"})))}},"Accession"),n.createElement(h.sg,{dataKey:"name",renderer:(e,t)=>{var{accession:a}=t;return n.createElement(u.Z,{to:{description:{main:{key:"protein"},protein:{db:"uniprot",accession:a}}}},e)}},"Name"),n.createElement(h.sg,{dataKey:"source_organism",renderer:e=>e.taxId?n.createElement(u.Z,{to:{description:{main:{key:"taxonomy"},taxonomy:{db:"uniprot",accession:""+e.taxId}}}},e.fullName):String(e)},"Organism"),n.createElement(h.sg,{dataKey:"length"},"Length"),n.createElement(h.sg,{dataKey:"gene"},"Gene"),n.createElement(h.sg,{dataKey:"in_alphafold",renderer:(e,t)=>{var{accession:a}=t;return e?n.createElement(u.Z,{to:{description:{main:{key:"protein"},protein:{db:"uniprot",accession:a,detail:"alphafold"}}}},"AlphaFold"):null}},"Predicted structure"))):null}));a(9873),a(57267);var D=a(96753),x=a(7877),C=a(65013),N=a(77180),T=e=>{var{accession:t,data:a,dataDomain:r,databases:o,idaAccessionDB:s}=e,{payload:c,loading:l}=a||{},{payload:d,loading:m}=r||{};if(l||m)return n.createElement(i.Z,null);if(!c||!d)return null;var p=((e,t)=>{var a,n,r,o,i,s,c,l,d={};e.results.forEach((e=>{var t;if("interpro"===e.metadata.source_database.toLowerCase()){var a=e.metadata.accession;d[a.toLowerCase()]=(null===(t=null==e?void 0:e.extra_fields)||void 0===t?void 0:t.short_name)||a}}));var m={};e.results.forEach((e=>{var t;if("pfam"===e.metadata.source_database.toLowerCase()){var a=e.metadata.accession;d[a.toLowerCase()]=(null===(t=null==e?void 0:e.extra_fields)||void 0===t?void 0:t.short_name)||a,m[a.toLowerCase()]=[...e.proteins[0].entry_protein_locations],e.metadata.integrated&&(m[e.metadata.integrated.toLowerCase()]=[...e.proteins[0].entry_protein_locations])}}));var p=[];return t.split(/[:-]/).forEach((e=>{p.push({entry:e.toUpperCase(),coordinates:m[e.toLowerCase()].splice(0,1),name:d[e.toLowerCase()]||e})})),{accession:null===(o=null===(r=null===(n=null===(a=e.results)||void 0===a?void 0:a[0])||void 0===n?void 0:n.proteins)||void 0===r?void 0:r[0])||void 0===o?void 0:o.accession,length:null===(l=null===(c=null===(s=null===(i=e.results)||void 0===i?void 0:i[0])||void 0===s?void 0:s.proteins)||void 0===c?void 0:c[0])||void 0===l?void 0:l.protein_length,domains:p}})(d,c.ida);if(!p)return null;var u=(0,D.rg)(c.ida,p,s);return n.createElement("div",null,n.createElement("header",null,"All proteins featured on this page exhibit the same domain architecture as the protein identified by the accession ",n.createElement("b",null,t),".",n.createElement(C.Z,{showExporter:!1})),n.createElement(N.Z,{accessions:u.accessions}),n.createElement(x.Z,{matches:u.domains,length:(null==u?void 0:u.length)||1e3,maxLength:(null==u?void 0:u.length)||1e3,databases:o}),n.createElement("br",null))},j=(0,o.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>{var{protocol:n,hostname:r,port:o,root:i}=e,{type:s,search:c}=a,m=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(n=Object.getOwnPropertySymbols(e);r<n.length;r++)t.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(e,n[r])&&(a[n[r]]=e[n[r]])}return a}(a,["type","search"]);return m.ida="",(0,l.format)({protocol:n,hostname:r,port:o,pathname:i+(0,d.Z)(t).replace("/similar_proteins",""),query:m})})),B=(0,o.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t)=>{var{protocol:a,hostname:n,port:r,root:o}=e,i={main:{key:"entry"},entry:{db:"all"},protein:{accession:t.protein.accession,db:"uniprot",isFilter:!0}};return(0,l.format)({protocol:a,hostname:n,port:r,pathname:o+(0,d.Z)(i),query:{extra_fields:"short_name",page_size:100}})})),I=(0,o.P1)((e=>e.settings.ui),(e=>{var{idaAccessionDB:t}=e;return{idaAccessionDB:t}}));const F=(0,p.Z)({getUrl:B,propNamespace:"Domain"})((0,p.Z)({getUrl:j,mapStateToProps:I})(n.memo(T)));var U=(0,g.Z)({"accession-selector-panel":"SimilarProteins_style__accession-selector-panel___f0","similar-proteins-selector-panel":"SimilarProteins_style__similar-proteins-selector-panel___f4"}),q=(0,o.P1)((e=>e.customLocation.description.protein.accession),(e=>({proteinAccession:e})));const R=(0,r.$j)(q)((e=>{var{data:{loading:t,payload:a},dataBase:r,proteinAccession:o}=e,{ida_accession:l}=(null==a?void 0:a.metadata)||{},[d,m]=(0,n.useState)("uniprot");return t?n.createElement(i.Z,null):n.createElement("div",{className:U("vf-stack","vf-stack--400")},n.createElement(F,{accession:o||"",databases:r.payload&&r.payload.databases||{}}),n.createElement("div",{className:U("similar-proteins-selector-panel")},n.createElement("p",null,"The table below lists similar proteins from"),n.createElement(s.Z,{title:"Switch to view similar proteins from UniProt or Reviewed databases"},n.createElement(c.Z,{switchCond:"uniprot"===d,name:"proteinDB",id:"proteinDB-input",SRLabel:"View proteins from",onValue:"UniProtKB",offValue:"Reviewed (Swiss-Prot)",handleChange:()=>m("uniprot"===d?"reviewed":"uniprot"),addAccessionStyle:!0,width:"14rem"}))),n.createElement(A,{ida:l||"",db:d}))}))}}]);
//# sourceMappingURL=8961.module.similar-proteins-subpage.7e3.js.map