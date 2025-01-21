/*! For license information please see 7509.module.ipscan-status.da2.js.LICENSE.txt */
(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[7509],{55381:(e,t,n)=>{"use strict";n.r(t),n.d(t,{IPScanStatus:()=>J,default:()=>Q,getIProScanURL:()=>H}),n(73964),n(64043),n(61514),n(752),n(76265),n(86544);var i=n(67294),r=n(8575),s=n(10838),a=n(87616),o=n(45007),c=n(19119),l=n(29643),u=n(53506),d=n(41089),p=n(2191),h=n(26940),m=n(60047),f=n(81128),b=n(81667),v=n(52727),y=n(12728),g=(n(22462),n(268),n(34287)),_=n(85869),w=n(65455),O=n(74482),j=n(34017),S=e=>{var t=e.match(j.ol),n=null==t?void 0:t[2];return n&&n.startsWith("-")?e.slice(0,-n.length):e},E=(0,c.P1)((e=>e.settings.ipScan),(e=>e.customLocation.description.result.job||""),((e,t)=>{var{protocol:n,hostname:i,port:s,root:a}=e;return(0,r.format)({protocol:n,hostname:i,port:s,pathname:a+"/status/"+S(t)})})),P=(0,c.P1)((e=>e.customLocation.description.result.job),(e=>({jobAccession:e})));const I=(0,g.Z)({getUrl:E,mapStateToProps:P,mapDispatchToProps:{importJob:a.tj},fetchOptions:{useCache:!1,responseType:"text"}})((e=>{var{jobAccession:t,shouldImport:n,data:r,importJob:s,handleImported:a}=e;if(!r||!t)return null;var[o,c]=(0,i.useState)(!1);return(0,i.useEffect)((()=>{200===r.status&&"FINISHED"===r.payload&&!o&&n&&(c(!0),null==s||s({metadata:{localID:(0,O.Z)("internal-"+Date.now()),type:"InterProScan",remoteID:S(t)},data:{input:""}}),a())}),[r.payload]),n?r.loading?i.createElement(_.Z,null):200!==r.status||"FINISHED"!==r.payload?i.createElement(w.Z,{type:"alert"},"There was an error retrieving the InterProScan Job with ID"," ",t,200===r.status&&i.createElement("div",null,"Server response: ",i.createElement("code",null,r.payload))):i.createElement(_.Z,null):null}));var k=n(13072),T=(n(60429),n(78730),n(79307),n(3817)),M=n(76371),C=n(82806),x=n(75560),F=(0,M.Z)(C.Z,x.Z),Z=(0,c.P1)((e=>e.settings.ipScan),((e,t)=>{var n;return(null===(n=null==t?void 0:t.job)||void 0===n?void 0:n.remoteID)||""}),((e,t)=>{if(!t)return null;var{protocol:n,hostname:i,port:s,root:a}=e;return(0,r.format)({protocol:n,hostname:i,port:s,pathname:a+"/status/"+t})})),D=(0,c.P1)((e=>e.settings.ipScan),(e=>{var{protocol:t,hostname:n,root:i}=e;return{dataURL:t+"//"+n+i+"result"}}));const A=(0,g.Z)({getUrl:Z,mapStateToProps:D,fetchOptions:{useCache:!1,responseType:"text"}})((e=>{var{job:t,jobsData:n,data:r,dataURL:s}=e,a=t.remoteID;return a&&"FINISHED"===(null==r?void 0:r.payload)?["sequence","tsv","json","xml","gff"].map((e=>{var t="sequence"===e?"fasta":e;return i.createElement("li",{key:e},i.createElement(p.Z,{title:i.createElement("div",null,"This will download the data that was originally loaded to our servers. This is only available for 7 days after running the job.")},i.createElement(l.Z,{target:"_blank",href:s+"/"+a+"/"+e,download:"InterProScan-"+a+"."+t,buttonType:"hollow",className:F("download-option")},i.createElement("span",{className:F("icon","icon-fileformats","icon-"+t.toUpperCase())})," ",t.toUpperCase()," ","fasta"===t?"input":"output")))})):i.createElement("li",null,i.createElement(p.Z,{title:i.createElement("div",null,"This will create a single JSON file with all the"," ",i.createElement("b",null,"locally saved")," results of this group")},i.createElement(T.Z,{className:F("group, download-option"),type:"hollow",onClick:()=>{return e=void 0,i=void 0,s=function*(){var e,i,r,s,a,o;(null==n?void 0:n.length)&&(e=function(e,t){var n=(null==t?void 0:t[0])||{},{results:i}=n,r=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(n[i[r]]=e[i[r]])}return n}(n,["results"]);return Object.assign(Object.assign(Object.assign({},e),r),{results:t.map((e=>{var t;return null===(t=e.results)||void 0===t?void 0:t[0]})).filter(Boolean)})}(t,n),i=t.remoteID+".json",s=JSON.stringify(e),a=new Blob([s],{type:"application/json"}),(o=document.createElement("a")).style.display="none",o.href=URL.createObjectURL(a),o.download=i,null===(r=document.body)||void 0===r||r.appendChild(o),o.click(),setTimeout((()=>{var e;URL.revokeObjectURL(o.href),null===(e=o.parentNode)||void 0===e||e.removeChild(o)}),0))},new((r=void 0)||(r=Promise))((function(t,n){function a(e){try{c(s.next(e))}catch(e){n(e)}}function o(e){try{c(s.throw(e))}catch(e){n(e)}}function c(e){var n;e.done?t(e.value):(n=e.value,n instanceof r?n:new r((function(e){e(n)}))).then(a,o)}c((s=s.apply(e,i||[])).next())}));var e,i,r,s},icon:"icon-download","aria-label":"Download group results"},"JSON output")))}));var N=e=>{var t,n,i="",r=1;for(var s of e)i+="> "+((null===(n=null===(t=s.xref)||void 0===t?void 0:t[0])||void 0===n?void 0:n.id)||"Sequence "+r++)+"\n"+((s.sequence||"").match(/(.{1,60})/g)||[]).join("\n")+"\n";return i};const B=(0,o.$j)(void 0,{goToCustomLocation:a.xb})((e=>{var{jobsData:t,goToCustomLocation:n}=e;return i.createElement(p.Z,{title:i.createElement("div",null,"Start a new sequence search using the same sequences as this job.")},i.createElement(T.Z,{type:"secondary",onClick:()=>{return e=void 0,i=void 0,s=function*(){var e,i={},r=null===(e=null==t?void 0:t[0])||void 0===e?void 0:e.applications;r&&(i.applications="string"==typeof r?[r]:r),n({description:{main:{key:"search"},search:{type:"sequence",value:N((null==t?void 0:t.map((e=>{var t;return null===(t=e.results)||void 0===t?void 0:t[0]})).filter(Boolean))||[])}},search:i})},new((r=void 0)||(r=Promise))((function(t,n){function a(e){try{c(s.next(e))}catch(e){n(e)}}function o(e){try{c(s.throw(e))}catch(e){n(e)}}function c(e){var n;e.done?t(e.value):(n=e.value,n instanceof r?n:new r((function(e){e(n)}))).then(a,o)}c((s=s.apply(e,i||[])).next())}));var e,i,r,s},icon:"icon-undo","aria-label":"Resubmit all sequences"},i.createElement("span",null,"Resubmit All")))}));var L=n(53322),q=n(76382),R=n(18933),U=n(5931),z=n(33594),$=n(98296),G=(0,M.Z)(C.Z,q.Z,R.Z,U.Z),H=e=>{var{protocol:t,hostname:n,port:i,pathname:a}=v.default.root.website;return(0,r.format)({protocol:t,hostname:n,port:i,pathname:a+(0,s.Z)({main:{key:"result"},result:{type:"InterProScan",accession:e}})})},J=e=>{var t,n,{job:r,search:s,defaultPageSize:a,updateJobStatus:o}=e,[c,v]=(0,i.useState)([]),[g,_]=(0,i.useState)(!1),[w,O]=(0,i.useState)(!1);if((0,i.useEffect)((()=>{r?(e=>{return t=void 0,n=void 0,r=function*(){var t,n=yield(0,f.ZP)(f.zG),i=[],r=yield n.get(null==e?void 0:e.localID);r&&(null===(t=r.results)||void 0===t?void 0:t.length)&&i.push(r);for(var s=1;s<=((null==e?void 0:e.entries)||1);s++){var a=yield n.get((null==e?void 0:e.localID)+"-"+s);a&&i.push(a)}return i},new((i=void 0)||(i=Promise))((function(e,s){function a(e){try{c(r.next(e))}catch(e){s(e)}}function o(e){try{c(r.throw(e))}catch(e){s(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(a,o)}c((r=r.apply(t,n||[])).next())}));var t,n,i,r})(r).then((e=>v(e))):w||(_(!0),O(!0),o())}),[r,w]),!r)return i.createElement(I,{shouldImport:g,handleImported:()=>{_(!1),O(!1)}});var j=["localTitle","matches","sequence"],S=[...c];(0,u.Z2)(S,s,j,{localTitle:(e,t)=>{var n,i,r;return(null===(r=null===(i=null===(n=null==t?void 0:t.results)||void 0===n?void 0:n[0].xref)||void 0===i?void 0:i[0])||void 0===r?void 0:r.name)||e}}),S=(0,u.TL)(S,s,j,{localTitle:(e,t)=>{var n,i,r;return(null===(r=null===(i=null===(n=null==t?void 0:t.results)||void 0===n?void 0:n[0].xref)||void 0===i?void 0:i[0])||void 0===r?void 0:r.name)||e}});var E=s.page_size||a;return S=S.splice(((Number(s.page)||1)-1)*Number(E),Number(E)),i.createElement("section",null,i.createElement($.Z,{ipScanVersion:null===(t=null==c?void 0:c[0])||void 0===t?void 0:t["interproscan-version"]}),i.createElement("h3",{className:G("light")},"Your InterProScan Search Results (Sequences)"," ",i.createElement(m.Z,{rtdPage:"searchways.html#sequence-search-results"})),i.createElement(z.Z,{type:"job",accession:(null==r?void 0:r.localID)||"",localTitle:(null==r?void 0:r.localTitle)||"",status:null==r?void 0:r.status,payload:r}),i.createElement("section",{className:G("summary-row")},i.createElement("header",null,"Job ID"," ",i.createElement(p.Z,{title:"Case sensitive"},i.createElement("span",{className:G("small","icon","icon-common"),"data-icon":"","aria-label":"Case sensitive"}))),i.createElement("section",{style:{display:"flex"}},i.createElement(b.Z,{accession:(null==r?void 0:r.remoteID)||(null==r?void 0:r.localID)||"",title:"Job ID"})," ")),i.createElement("section",{className:G("summary-row")},i.createElement("header",null,"Sequence type"),i.createElement("section",null,"n"===(null==r?void 0:r.seqtype)?"Nucleotides":"Amino acids")),i.createElement("section",{className:G("summary-row")},i.createElement("header",null,"Number of Sequences"),i.createElement("section",null,(null==r?void 0:r.entries)||1)),i.createElement("section",{className:G("summary-row")},i.createElement("header",null,"Actions"),i.createElement("section",null,i.createElement(k.Z,{localID:(null==r?void 0:r.localID)||"",status:(null==r?void 0:r.status)||"",MoreActions:i.createElement(i.Fragment,null,i.createElement(B,{jobsData:c}),i.createElement(h.Z,{label:"Download",icon:"icon-download"},i.createElement(A,{job:r,jobsData:c})))}))),i.createElement("section",{className:G("summary-row")},i.createElement("header",null,"Status"),i.createElement("section",null,i.createElement(y.Z,{status:null==r?void 0:r.status}))),"finished"===(null==r?void 0:r.status)&&i.createElement("section",{className:G("summary-row")},i.createElement("header",null,"Expires"," ",i.createElement(p.Z,{title:"InterProScan Jobs are only kept in our servers for 1 week."},i.createElement("span",{className:G("small","icon","icon-common"),"data-icon":"","aria-label":"Case sensitive"}))),i.createElement("section",null,new Date(((null===(n=null==r?void 0:r.times)||void 0===n?void 0:n.created)||0)+L.G).toDateString())),i.createElement(d.ZP,{dataTable:S,rowKey:"localID",contentType:"result",actualSize:(null==r?void 0:r.entries)||1,query:s,showTableIcon:!1},i.createElement(d.sg,{dataKey:"localTitle",isSearchable:!0,isSortable:!0,renderer:(e,t)=>{var n,s,a,o;return i.createElement(i.Fragment,null,i.createElement("span",{style:{marginRight:"1em"}},i.createElement(l.Z,{to:{description:{main:{key:"result"},result:{type:"InterProScan",job:null==r?void 0:r.remoteID,accession:t.localID}}}},(null===(o=null===(a=(null===(n=t.results[0])||void 0===n?void 0:n.crossReferences)||(null===(s=t.results[0])||void 0===s?void 0:s.xref))||void 0===a?void 0:a[0])||void 0===o?void 0:o.id)||("∅"===e?null:e)||t.localID)))}},"Sequence"),i.createElement(d.sg,{defaultKey:"matches",dataKey:"results",displayIf:"n"!==r.seqtype,renderer:e=>e[0].matches.length},"Matches"),i.createElement(d.sg,{defaultKey:"length",dataKey:"results",renderer:e=>e[0].sequence.length},"Sequence length")))},K=(0,c.P1)((e=>Object.values(e.jobs||{}).find((t=>t.metadata.remoteID===e.customLocation.description.result.job))),(e=>e.customLocation.search),(e=>e.settings.navigation.pageSize),((e,t,n)=>({job:null==e?void 0:e.metadata,search:t,defaultPageSize:n})));const Q=(0,o.$j)(K,{updateJobStatus:a.L2,updateJobTitle:a.Rn})(J)},66830:(e,t,n)=>{"use strict";n.d(t,{NQ:()=>m,fV:()=>p,jF:()=>c,uj:()=>s,wt:()=>l}),n(60429),n(86544),n(76801),n(752),n(76265),n(64043),n(61514);var i=n(76635),r=(0,n(76371).Z)(),s=[{href:"https://www.ebi.ac.uk",icon:"",name:"EMBL-EBI",iconClass:"common"},{href:"https://www.ebi.ac.uk/services",icon:"",name:"Services",iconClass:"common"},{href:"https://www.ebi.ac.uk/research",icon:"",name:"Research",iconClass:"common"},{href:"https://www.ebi.ac.uk/training",icon:"",name:"Training",iconClass:"common"},{href:"https://www.ebi.ac.uk/about",icon:"",name:"About EBI",iconClass:"common"}],a=e=>{var{entry:t}=e;return t.db?{db:t.db,isFilter:!0}:{db:"InterPro",isFilter:!0}},o=e=>{var{taxonomy:t,main:n}=e;if("taxonomy"!==n.key&&t.db)return Object.assign(Object.assign({},t),{isFilter:!0})},c=[{to:e=>({description:{main:{key:"entry"},entry:{db:"InterPro"}},hash:e.hash}),name:"By InterPro"},{to(e){var t,n=null===(t=e.description.entry.db)||void 0===t?void 0:t.toLowerCase();return{description:{main:{key:"entry"},entry:{db:"interpro"===n?"Pfam":n||"Pfam",integration:e.description.entry.integration}},hash:e.hash}},name:"By Member DB"},{to:e=>({description:{main:{key:"protein"},protein:{db:e.description.protein.db||"UniProt"},entry:a(e.description),taxonomy:o(e.description)},hash:e.hash}),name:"By Protein"},{to:e=>({description:{main:{key:"structure"},structure:{db:"PDB"},entry:a(e.description)},hash:e.hash}),name:"By Structure"},{to:e=>({description:{main:{key:"taxonomy"},taxonomy:{db:e.description.taxonomy.db||"uniprot"},entry:a(e.description)},hash:e.hash}),name:"By Taxonomy"},{to:e=>({description:{main:{key:"proteome"},proteome:{db:e.description.proteome.db||"uniprot"},entry:{db:"interpro",isFilter:!0}},hash:e.hash}),name:"By Proteome"},{to(e){var t,n;return{description:{main:{key:"set"},set:{db:"all"},entry:{isFilter:!0,db:["cdd","panther","pfam","pirsf"].includes(((null===(n=null===(t=e.description)||void 0===t?void 0:t.entry)||void 0===n?void 0:n.db)||"").toLowerCase())?e.description.entry.db:"Pfam"}},hash:e.hash}},name:"By Clan/Set"}],l=new Map([["overview",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:null})})}},name:"Overview",exact:!0}],["entry",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:null}),entry:{isFilter:!0,db:"set"===t?e.description.set.db:"InterPro"}}),search:void 0!==e.search.orf?{orf:String(e.search.orf)}:void 0}},name:"Entries",counter:"entries"}],["protein",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:null}),protein:{isFilter:!0,db:"UniProt"}})}},name:"Proteins",counter:"proteins"}],["structure",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:null}),structure:{isFilter:!0,db:"PDB"}})}},name:"Structures",counter:"structures"}],["taxonomy",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:null}),taxonomy:{isFilter:!0,db:"uniprot"}})}},name:"Taxonomy",counter:"taxa"}],["proteome",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:null}),proteome:{isFilter:!0,db:"uniprot"}})}},name:"Proteomes",counter:"proteomes"}],["set",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:null}),set:{isFilter:!0,db:e.description[t].db}})}},name:"Sets",counter:"sets"}],["sequence",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"sequence"})}),search:void 0!==e.search.orf?{orf:String(e.search.orf)}:void 0}},name:"Sequence"}],["domain_architecture",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"domain_architecture"})})}},name:"Domain Architectures",counter:"domain_architectures"}],["similar_proteins",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"similar_proteins"})})}},name:"Similar Proteins",counter:"similar_proteins"}],["logo",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"logo"})})}},name:"Signature"}],["alphafold",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"alphafold"})})}},name:"AlphaFold",counter:"structural_models.alphafold"}],["entry_alignments",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"entry_alignments"})})}},name:"Alignment"}],["interactions",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"interactions"})})}},name:"Interactions",counter:"interactions"}],["pathways",{to(e){var t=e.description.main.key;return{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:Object.assign(Object.assign({},e.description[t]),{detail:"pathways"})})}},name:"Pathways",counter:"pathways"}],["subfamilies",{to:e=>({description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:"entry"},entry:Object.assign(Object.assign({},e.description.entry),{detail:"subfamilies"})})}),name:"Subfamilies",counter:"subfamilies"}],["curation",{to:e=>({description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:"entry"},entry:Object.assign(Object.assign({},e.description.entry),{detail:"curation"})})}),name:"Curation"}]]),u=[{name:"By Sequence",to:{description:{main:{key:"search"},search:{type:"sequence"}}},activeClass(e){var{description:{search:{type:t}}}=e;return"InterProScan"===t&&r("is-active")}},{name:"By Text",to:{description:{main:{key:"search"},search:{type:"text"}}},activeClass(e){var{description:{search:{type:t}}}=e;return"download"===t&&r("is-active")}},{name:"By Domain Architecture",to:{description:{main:{key:"search"},search:{type:"ida"}}},activeClass(e){var{description:{search:{type:t}}}=e;return"download"===t&&r("is-active")}}],d=[{to:{description:{main:{key:"result"},result:{type:"InterProScan"}}},activeClass(e){var{description:{result:{type:t}}}=e;return"InterProScan"===t&&r("is-active")},name:"Your InterProScan searches"},{name:"Your downloads",to:{description:{main:{key:"result"},result:{type:"download"}}},activeClass(e){var{description:{result:{type:t}}}=e;return"download"===t&&r("is-active")}}],p=(r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),r("is-active"),[{to:{description:{}},icon:"H",name:"Home",exact:!0},{to:{description:{main:{key:"search"}}},icon:"",name:"Search",iconClass:"common",entities:u},{to(e){var t=e.description.main.key;return t&&"search"!==t&&"result"!==t?e.description.set.accession?{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:"set"},set:{db:"all"},entry:{isFilter:!0,db:e.description.set.db}})}:{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:t},[t]:{db:e.description[t].db},entry:{isFilter:"entry"!==t,db:e.description.entry.db||"InterPro"}})}:{description:Object.assign(Object.assign({},(0,i.Z)()),{main:{key:"entry"},entry:{db:"InterPro"}})}},activeClass(e){var{description:{main:t}}=e;return!(!t.key||"search"===t.key||"result"===t.key)&&r("is-active")},icon:"b",name:"Browse",iconClass:"common",entities:c},{to(e){var{description:{result:{type:t}}}=e;return{description:{main:{key:"result"},result:{type:t}}}},icon:"*",name:"Results",iconClass:"common",entities:d},{to:{description:{other:["release_notes"]}},icon:"",name:"Release notes",iconClass:"common"},{to:{description:{other:["download"]}},icon:"=",name:"Download",iconClass:"common"},{to:{description:{other:["help"]}},icon:"",name:"Help",iconClass:"common"},{to:{description:{other:["settings"]}},icon:"",name:"Settings",iconClass:"common"}]),h=["PRODOM","COILS","SCOP","MOBIDB","MOBIDB_LITE","MOBIDBLT","SIGNALP","SIGNALP_E","SIGNALP_G-","SIGNALP_G+","SIGNALP_EUK","SIGNALP_GRAM_POSITIVE","SIGNALP_GRAM_NEGATIVE","PHOBIUS","TMHMM","CATH","SWISS-MODEL","MODBASE","SMODEL","FUNFAM","PFAM-N","ALPHAFOLD","ELM"],m=new Set(h.concat(h.map((e=>e.toLowerCase()))))},64350:e=>{self,e.exports=function(){"use strict";var e={55:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.setBezierFunction=t.getCubicBezierTransition=void 0;const i=n(188);t.getCubicBezierTransition=(e=.25,t=.25,n=.75,i=.75)=>r=>function(e,t,n,i,r,s){let a=0,o=0,c=0,l=0,u=0,d=0;const p=e=>((a*e+o)*e+c)*e,h=e=>(3*a*e+2*o)*e+c,m=e=>e>=0?e:0-e;return c=3*t,o=3*(i-t)-c,a=1-c-o,d=3*n,u=3*(r-n)-d,l=1-d-u,.005,(e=>((l*e+u)*e+d)*e)(((e,t)=>{let n,i,r,s,a,o;for(r=e,o=0;o<8;o++){if(s=p(r)-e,m(s)<.005)return r;if(a=h(r),m(a)<1e-6)break;r-=s/a}if(n=0,i=1,r=e,r<n)return n;if(r>i)return i;for(;n<i;){if(s=p(r),m(s-e)<.005)return r;e>s?n=r:i=r,r=.5*(i-n)+n}return r})(e))}(r,e,t,n,i),t.setBezierFunction=(e,n,r,s,a)=>{const o=(0,t.getCubicBezierTransition)(n,r,s,a);return o.displayName=e,o.x1=n,o.y1=r,o.x2=s,o.y2=a,i.Tweenable.easing[e]=o}},607:function(e,t,n){var i=this&&this.__createBinding||(Object.create?function(e,t,n,i){void 0===i&&(i=n);var r=Object.getOwnPropertyDescriptor(t,n);r&&!("get"in r?!t.__esModule:r.writable||r.configurable)||(r={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,i,r)}:function(e,t,n,i){void 0===i&&(i=n),e[i]=t[n]}),r=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||i(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),t.VERSION=t.standardEasingFunctions=t.setBezierFunction=t.Scene=t.interpolate=t.tween=t.Tweenable=t.shouldScheduleUpdate=t.processTweens=void 0;const s=n(188);Object.defineProperty(t,"processTweens",{enumerable:!0,get:function(){return s.processTweens}}),Object.defineProperty(t,"shouldScheduleUpdate",{enumerable:!0,get:function(){return s.shouldScheduleUpdate}}),Object.defineProperty(t,"Tweenable",{enumerable:!0,get:function(){return s.Tweenable}}),Object.defineProperty(t,"tween",{enumerable:!0,get:function(){return s.tween}});var a=n(166);Object.defineProperty(t,"interpolate",{enumerable:!0,get:function(){return a.interpolate}});var o=n(147);Object.defineProperty(t,"Scene",{enumerable:!0,get:function(){return o.Scene}});var c=n(55);Object.defineProperty(t,"setBezierFunction",{enumerable:!0,get:function(){return c.setBezierFunction}});var l=n(64);Object.defineProperty(t,"standardEasingFunctions",{enumerable:!0,get:function(){return l.standardEasingFunctions}}),r(n(699),t),t.VERSION=String("3.0.3")},166:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.interpolate=void 0;const i=n(188),r=new i.Tweenable,{filters:s}=i.Tweenable;t.interpolate=(e,t,n,a=i.Tweenable.easing.linear,o=0)=>{const c=Object.assign({},e),l=(0,i.composeEasingObject)(e,a);r._filters.length=0,r.setState({}),r._currentState=c,r._originalState=e,r._targetState=t,r._easing=l;for(const e in s)s[e].doesApply(r)&&r._filters.push(s[e]);r._applyFilter("tweenCreated"),r._applyFilter("beforeTween");const u=(0,i.tweenProps)(n,c,e,t,1,o,l);return r._applyFilter("afterTween"),u}},147:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.Scene=void 0,t.Scene=class{constructor(...e){this._tweenables=[],e.forEach(this.add.bind(this))}get tweenables(){return[...this._tweenables]}get promises(){return this._tweenables.map((e=>e.then()))}add(e){return this._tweenables.push(e),e}remove(e){const t=this._tweenables.indexOf(e);return t>-1&&this._tweenables.splice(t,1),e}empty(){return this.tweenables.map(this.remove.bind(this))}get isPlaying(){return this._tweenables.some((({isPlaying:e})=>e))}tween(){return this._tweenables.forEach((e=>e.tween())),this}pause(){return this._tweenables.forEach((e=>e.pause())),this}resume(){return this._tweenables.filter((({hasEnded:e})=>!e)).forEach((e=>e.resume())),this}stop(e){return this._tweenables.forEach((t=>t.stop(e))),this}}},64:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.standardEasingFunctions=void 0,t.standardEasingFunctions=Object.freeze({linear:e=>e,easeInQuad:e=>Math.pow(e,2),easeOutQuad:e=>-(Math.pow(e-1,2)-1),easeInOutQuad:e=>(e/=.5)<1?.5*Math.pow(e,2):-.5*((e-=2)*e-2),easeInCubic:e=>Math.pow(e,3),easeOutCubic:e=>Math.pow(e-1,3)+1,easeInOutCubic:e=>(e/=.5)<1?.5*Math.pow(e,3):.5*(Math.pow(e-2,3)+2),easeInQuart:e=>Math.pow(e,4),easeOutQuart:e=>-(Math.pow(e-1,4)-1),easeInOutQuart:e=>(e/=.5)<1?.5*Math.pow(e,4):-.5*((e-=2)*Math.pow(e,3)-2),easeInQuint:e=>Math.pow(e,5),easeOutQuint:e=>Math.pow(e-1,5)+1,easeInOutQuint:e=>(e/=.5)<1?.5*Math.pow(e,5):.5*(Math.pow(e-2,5)+2),easeInSine:e=>1-Math.cos(e*(Math.PI/2)),easeOutSine:e=>Math.sin(e*(Math.PI/2)),easeInOutSine:e=>-.5*(Math.cos(Math.PI*e)-1),easeInExpo:e=>0===e?0:Math.pow(2,10*(e-1)),easeOutExpo:e=>1===e?1:1-Math.pow(2,-10*e),easeInOutExpo:e=>0===e?0:1===e?1:(e/=.5)<1?.5*Math.pow(2,10*(e-1)):.5*(2-Math.pow(2,-10*--e)),easeInCirc:e=>-(Math.sqrt(1-e*e)-1),easeOutCirc:e=>Math.sqrt(1-Math.pow(e-1,2)),easeInOutCirc:e=>(e/=.5)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1),easeOutBounce:e=>e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375,easeInBack:e=>{const t=1.70158;return e*e*((t+1)*e-t)},easeOutBack:e=>{const t=1.70158;return(e-=1)*e*((t+1)*e+t)+1},easeInOutBack:e=>{let t=1.70158;return(e/=.5)<1?e*e*((1+(t*=1.525))*e-t)*.5:.5*((e-=2)*e*((1+(t*=1.525))*e+t)+2)},elastic:e=>-1*Math.pow(4,-8*e)*Math.sin((6*e-1)*(2*Math.PI)/2)+1,swingFromTo:e=>{let t=1.70158;return(e/=.5)<1?e*e*((1+(t*=1.525))*e-t)*.5:.5*((e-=2)*e*((1+(t*=1.525))*e+t)+2)},swingFrom:e=>{const t=1.70158;return e*e*((t+1)*e-t)},swingTo:e=>{const t=1.70158;return(e-=1)*e*((t+1)*e+t)+1},bounce:e=>e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375,bouncePast:e=>e<1/2.75?7.5625*e*e:e<2/2.75?2-(7.5625*(e-=1.5/2.75)*e+.75):e<2.5/2.75?2-(7.5625*(e-=2.25/2.75)*e+.9375):2-(7.5625*(e-=2.625/2.75)*e+.984375),easeFromTo:e=>(e/=.5)<1?.5*Math.pow(e,4):-.5*((e-=2)*Math.pow(e,3)-2),easeFrom:e=>Math.pow(e,4),easeTo:e=>Math.pow(e,.25)})},432:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.afterTween=t.beforeTween=t.tweenCreated=t.doesApply=void 0;const i=n(699),r=/(\d|-|\.)/,s=/([^\-0-9.]+)/g,a=/[0-9.-]+/g,o=(()=>{const e=a.source,t=/,\s*/.source;return new RegExp(`rgba?\\(${e}${t}${e}${t}${e}(${t}${e})?\\)`,"g")})(),c=/^.*\(/,l=/#([0-9]|[a-f]){3,6}/gi,u="VAL",d=(e,t)=>e.map(((e,n)=>`_${t}_${n}`)),p=e=>{let t=e.match(s);return t?(1===t.length||e.charAt(0).match(r))&&t.unshift(""):t=["",""],t.join(u)};function h(e){return parseInt(e,16)}const m=e=>`rgb(${(e=>{if(3===(e=e.replace(/#/,"")).length){const[t,n,i]=e.split("");e=t+t+n+n+i+i}return[h(e.substring(0,2)),h(e.substring(2,4)),h(e.substring(4,6))]})(e).join(",")})`,f=(e,t,n)=>{const i=t.match(e);let r=t.replace(e,u);return i&&i.forEach((e=>r=r.replace(u,n(e)))),r},b=e=>{for(const t in e){const n=e[t];"string"==typeof n&&n.match(l)&&(e[t]=f(l,n,m))}},v=e=>{var t,n;const i=null!==(t=e.match(a))&&void 0!==t?t:[],r=i.slice(0,3).map((e=>Math.floor(Number(e)))),s=null===(n=e.match(c))||void 0===n?void 0:n[0];if(3===i.length)return`${s}${r.join(",")})`;if(4===i.length)return`${s}${r.join(",")},${i[3]})`;throw new Error(`Invalid rgbChunk: ${e}`)},y=e=>{var t;return null!==(t=e.match(a))&&void 0!==t?t:[]},g=(e,t)=>{const n={};return t.forEach((t=>{n[t]=e[t],delete e[t]})),n},_=(e,t)=>t.map((t=>Number(e[t]))),w=(e,t)=>(t.forEach((t=>e=e.replace(u,String(+t.toFixed(4))))),e);t.doesApply=e=>{for(const t in e._currentState)if("string"==typeof e._currentState[t])return!0;return!1},t.tweenCreated=function(e){const{_currentState:t,_originalState:n,_targetState:i}=e;[t,n,i].forEach(b),e._tokenData=(e=>{var t;const n={};for(const i in e){const r=e[i];"string"==typeof r&&(n[i]={formatString:p(r),chunkNames:d(null===(t=y(r))||void 0===t?void 0:t.map(Number),i)})}return n})(t)},t.beforeTween=function(e){const{_currentState:t,_originalState:n,_targetState:r,_easing:s,_tokenData:a}=e;"function"!=typeof s&&a&&((e,t)=>{var n;for(const r in t){const{chunkNames:s}=t[r],a=e[r];if("string"==typeof a){const t=a.split(" "),r=t[t.length-1];for(let a=0;a<s.length;a++){const o=s[a],c=null!==(n=t[a])&&void 0!==n?n:r;(0,i.isEasingKey)(c)&&(e[o]=c)}}else s.forEach((t=>e[t]=a));delete e[r]}})(s,a),[t,n,r].forEach((e=>((e,t)=>{for(const n in t)y(String(e[n])).forEach(((i,r)=>e[t[n].chunkNames[r]]=+i)),delete e[n]})(e,null!=a?a:{})))},t.afterTween=function(e){const{_currentState:t,_originalState:n,_targetState:i,_easing:r,_tokenData:s}=e;[t,n,i].forEach((e=>((e,t)=>{for(const n in t){const{chunkNames:i,formatString:r}=t[n],s=w(r,_(g(e,i),i));e[n]=f(o,s,v)}})(e,null!=s?s:{}))),"function"!=typeof r&&s&&((e,t)=>{for(const n in t){const{chunkNames:i}=t[n],r=e[i[0]];e[n]="string"==typeof r?i.map((t=>{const n=e[t];return delete e[t],n})).join(" "):r}})(r,s)}},188:function(e,t,n){var i,r=this&&this.__createBinding||(Object.create?function(e,t,n,i){void 0===i&&(i=n);var r=Object.getOwnPropertyDescriptor(t,n);r&&!("get"in r?!t.__esModule:r.writable||r.configurable)||(r={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,i,r)}:function(e,t,n,i){void 0===i&&(i=n),e[i]=t[n]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.shouldScheduleUpdate=t.tween=t.Tweenable=t.composeEasingObject=t.scheduleUpdate=t.processTweens=t.tweenProps=t.getListTail=t.getListHead=t.resetList=void 0;const o=n(64),c=n(55),l=n(699),u=a(n(432)),d="linear",p="undefined"!=typeof window?window:n.g,h="afterTween",m="beforeTween",f="string",b="function";let v=p.requestAnimationFrame;v||(v="undefined"==typeof window?setTimeout:window.webkitRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||window.mozCancelRequestAnimationFrame&&window.mozRequestAnimationFrame||setTimeout);const y=()=>{};let g=null,_=null;t.resetList=()=>{g=_=null},t.getListHead=()=>g,t.getListTail=()=>_,t.tweenProps=(e,t,n,i,r,s,a)=>{var c;let l,u=0;const d=e<s?0:(e-s)/r;let p;for(const e in t){if(typeof a===b)p=a;else{const t=a[e];p=typeof t===b?t:null!==(c=I.easing[t])&&void 0!==c?c:o.standardEasingFunctions.linear}u=p(d),l=n[e],t[e]=l+(i[e]-l)*u}return t};const w=(e,n)=>{var i;let r=null!==(i=e._timestamp)&&void 0!==i?i:0;const s=e._currentState,a=e._delay;if(n<r+a)return;let o=e._duration;const c=e._targetState,l=r+a+o;let u=n>l?l:n;e._hasEnded=u>=l;const d=o-(l-u);if(e._hasEnded)return e._render(c,d,e._data),e.stop(!0);e._applyFilter(m),u<r+a?r=o=u=1:r+=a,(0,t.tweenProps)(u,s,e._originalState,c,o,r,e._easing),e._applyFilter(h),e._render(s,d,e._data)};t.processTweens=()=>{let e;const t=I.now();let n=g;for(;n;)e=n._next,w(n,t),n=e};const{now:O}=Date;let j,S=!1;t.scheduleUpdate=()=>{j=O(),S&&v.call(p,t.scheduleUpdate,16.666666666666668),(0,t.processTweens)()},t.composeEasingObject=(e,t=d,n={})=>{if(typeof t===f&&(0,l.isEasingKey)(t))return I.easing[t];if(Array.isArray(t))return(0,c.getCubicBezierTransition)(...t);if("object"==typeof n)if(typeof t===f||typeof t===b)for(const i in e)n[i]=t;else for(const i in e)n[i]=t[i]||d;return n};const E=(()=>{let e,t;return n=>{e=null,t=null,n===g?(g=n._next,g?g._previous=null:_=null):n===_?(_=n._previous,_?_._next=null:g=null):(e=n._previous,t=n._next,e&&(e._next=t),t&&(t._previous=e)),n._previous=n._next=null}})(),P=typeof Promise===b?Promise:null;class I{constructor(e={},t){this[i]="Promise",this._next=null,this._previous=null,this._config={},this._data={},this._delay=0,this._duration=500,this._filters=[],this._timestamp=null,this._hasEnded=!1,this._resolve=null,this._reject=null,this._originalState={},this._targetState={},this._start=y,this._render=y,this._promiseCtor=P,this._promise=null,this._isPlaying=!1,this._pausedAtTime=null,this._easing={},this._currentState=e||{},t&&this.setConfig(t)}_applyFilter(e){var t;for(let n=this._filters.length;n>0;n--){const i=this._filters[n-n];null===(t=i[e])||void 0===t||t.call(i,this)}}tween(e){return this._isPlaying&&this.stop(),!e&&this._config||this.setConfig(e),this._pausedAtTime=null,this._timestamp=I.now(),this._start(this.state,this._data),this._delay&&this._render(this._currentState,0,this._data),this._resume(this._timestamp)}setConfig(e={}){var n;const{_config:i}=this;let r;for(r in e)i[r]=e[r];const{promise:s=this._promiseCtor,start:a=y,finish:o,render:c=y}=i;this._data=i.data||this._data,this._isPlaying=!1,this._pausedAtTime=null,this._delay=e.delay||0,this._start=a,this._render=c,this._duration=i.duration||500,this._promiseCtor=s,o&&(this._resolve=o);const{from:l,to:u={}}=e,{_currentState:d,_originalState:p,_targetState:h}=this;for(const e in l)d[e]=l[e];let m=!1;for(const e in d){const t=d[e];m||typeof t!==f||(m=!0),p[e]=t,h[e]=null!==(n=u[e])&&void 0!==n?n:t}if(this._easing=(0,t.composeEasingObject)(this._currentState,i.easing,this._easing),this._filters.length=0,m){for(const e in I.filters)I.filters[e].doesApply(this)&&this._filters.push(I.filters[e]);this._applyFilter("tweenCreated")}return this}then(e,t){if(!this._promiseCtor)throw new Error("Promise implementation is unavailable");return this._promise=new this._promiseCtor(((e,t)=>{this._resolve=e,this._reject=t})),this._promise.then(e,t)}catch(e){return this.then().catch(e)}finally(e){return this.then().finally(e)}get state(){return Object.assign({},this._currentState)}setState(e){this._currentState=e}pause(){return this._isPlaying?(this._pausedAtTime=I.now(),this._isPlaying=!1,E(this),this):this}resume(){return this._resume()}_resume(e=I.now()){return null===this._timestamp?this.tween():(this._isPlaying&&this._promise||(this._pausedAtTime&&(this._timestamp+=e-this._pausedAtTime,this._pausedAtTime=null),this._isPlaying=!0,null===g?(g=this,_=this):(this._previous=_,_&&(_._next=this),_=this)),this)}seek(e){var t;e=Math.max(e,0);const n=I.now();return(null!==(t=this._timestamp)&&void 0!==t?t:0)+e===0||(this._timestamp=n-e,w(this,n)),this}stop(e=!1){var n;return this._isPlaying?(this._isPlaying=!1,E(this),e&&(this._applyFilter(m),(0,t.tweenProps)(1,this._currentState,this._originalState,this._targetState,1,0,this._easing),this._applyFilter(h),this._applyFilter("afterTweenEnd")),null===(n=this._resolve)||void 0===n||n.call(this,{data:this._data,state:this._currentState,tweenable:this}),this._resolve=null,this._reject=null,this):this}cancel(e=!1){var t;const{_currentState:n,_data:i,_isPlaying:r}=this;return r?(null===(t=this._reject)||void 0===t||t.call(this,{data:i,state:n,tweenable:this}),this._resolve=null,this._reject=null,this.stop(e)):this}get isPlaying(){return this._isPlaying}get hasEnded(){return this._hasEnded}data(e=null){return e&&(this._data=Object.assign({},e)),this._data}dispose(){for(const e in this)delete this[e]}}t.Tweenable=I,i=Symbol.toStringTag,I.now=()=>j,I.setScheduleFunction=e=>v=e,I.filters={token:u},I.easing=Object.create(o.standardEasingFunctions),t.tween=function(e={}){return new I({},{}).tween(e)},t.shouldScheduleUpdate=e=>{e&&S||(S=e,e&&(0,t.scheduleUpdate)())},(0,t.shouldScheduleUpdate)(!0)},699:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.isEasingKey=void 0;const i=n(188);t.isEasingKey=e=>e in i.Tweenable.easing}},t={};function n(i){var r=t[i];if(void 0!==r)return r.exports;var s=t[i]={exports:{}};return e[i].call(s.exports,s,s.exports,n),s.exports}return n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n(607)}()},93967:(e,t)=>{var n;!function(){"use strict";var i={}.hasOwnProperty;function r(){for(var e="",t=0;t<arguments.length;t++){var n=arguments[t];n&&(e=a(e,s(n)))}return e}function s(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return r.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var n in e)i.call(e,n)&&e[n]&&(t=a(t,n));return t}function a(e,t){return t?e?e+" "+t:e+t:e}e.exports?(r.default=r,e.exports=r):void 0===(n=function(){return r}.apply(t,[]))||(e.exports=n)}()}}]);
//# sourceMappingURL=7509.module.ipscan-status.da2.js.map