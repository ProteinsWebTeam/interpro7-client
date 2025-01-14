"use strict";(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[6506],{54617:(e,t,a)=>{a.d(t,{j:()=>r,kW:()=>n,xH:()=>o});var r=["G3DSA:[0-9]{1}\\.[0-9]{2,3}\\.[0-9]{1,4}\\.[0-9]{2,4}","(?:c|s)d[0-9]{5}","MF_[0-9]{5}(_(A|B){1})?","PTHR[0-9]{5}(:SF[0-9]{1,3})?","PF[0-9]{5}","PIRSF[0-9]{6}","PR[0-9]{5}","PD[A-Z0-9]{6}","PS[0-9]{5}","PS[0-9]{5}","sfld[gfs]\\d{5}","SM[0-9]{5}","SSF[0-9]{5,6}","TIGR[0-9]{5}","NF[0-9]{6}","ANF[0-9]{5}"],n=[{title:"Rice",kingdom:"Eukaryota",description:"Oryza sativa subsp. japonica",icon:"6",color:"#5cb85c",tax_id:"39947"},{title:"Mouse-ear cress",kingdom:"Eukaryota",description:"Arabidopsis thaliana",icon:"B",color:"#5cb85c",tax_id:"3702"},{title:"Human",kingdom:"Eukaryota",description:"Homo sapiens",icon:"H",color:"#d9534f",tax_id:"9606"},{title:"Zebrafish",kingdom:"Eukaryota",description:"Danio rerio",icon:"Z",color:"#d9534f",tax_id:"7955"},{title:"Mouse",kingdom:"Eukaryota",description:"Mus musculus",icon:"M",color:"#d9534f",tax_id:"10090"},{title:"Fruit fly",kingdom:"Eukaryota",description:"Drosophila melanogaster",icon:"F",color:"#d9534f",tax_id:"7227"},{title:"Caenorhabditis elegans",kingdom:"Eukaryota",description:"Caenorhabditis elegans",icon:"W",color:"#d9534f",tax_id:"6239"},{title:"Baker’s yeast",kingdom:"Eukaryota",description:"Saccharomyces cerevisiae (strain ATCC 204508 / S288c)",icon:"Y",color:"#5bc0de",tax_id:"559292"},{title:"Fission yeast",kingdom:"Eukaryota",description:"Schizosaccharomyces pombe (strain 972 / ATCC 24843)",icon:"Y",color:"#5bc0de",tax_id:"284812"},{title:"Escherichia coli",kingdom:"Bacteria",description:"Escherichia coli O127:H6 (strain E2348/69 / EPEC)",icon:"L",color:"#5bc0de",tax_id:"83333"},{title:"Halobacterium salinarum",kingdom:"Archea",description:"Escherichia virus T4",icon:"v",color:"#5bc0de",tax_id:"2242"},{title:"Enterobacteria phage T4",kingdom:"Virus",description:"Escherichia virus T4",icon:"v",color:"#5bc0de",tax_id:"10665"}],o=[{type:"Domain",description:"\n      Domains are distinct functional, structural or sequence units that may\n      exist in a variety of biological contexts. A match to an InterPro entry of\n      this type indicates the presence of a domain.\n    "},{type:"Family",description:"\n      A protein family is a group of proteins that share a common evolutionary\n      origin reflected by their related functions, similarities in sequence, or\n      similar primary, secondary or tertiary structure. A match to an InterPro\n      entry of this type indicates membership of a protein family.\n    "},{type:"Homologous Superfamily",description:"A homologous superfamily is a group of proteins that share a common evolutionary origin, reflected by similarity in their structure. Since superfamily members often display very low similarity at the sequence level, this type of InterPro entry is usually based on a collection of underlying hidden Markov models, rather than a single signature."},{type:"Repeat",description:"\n      A short sequence that is typically repeated within a\n      protein.\n    "},{type:"Conserved Site",description:"\n      A short sequence that contains one or more conserved residues\n    "},{type:"Active Site",description:"\n      A short sequence that contains one or more conserved residues, which allow the protein to bind to a ligand.\n    "},{type:"Binding Site",description:"\n      A short sequence that contains one or more conserved residues, which form a protein interaction site.\n    "},{type:"PTM",description:"\n      A short sequence that contains one or more conserved residues.\n      Post-translational modification site.\n    "}]},51663:(e,t,a)=>{a.d(t,{Z:()=>i});var r=a(67294),n=a(57359),o=a(76371),s=a(40025),c=(0,o.Z)(s.Z);const i=e=>{var{entryDB:t,entryName:a,entryAccession:o,counters:s,memberDBs:i}=e,{proteins:l,domain_architectures:m,taxa:d,structures:u,sets:p}=s||{};return r.createElement("div",{className:c("card-counter-block")},r.createElement(n.Z,{endpoint:"protein",count:l,name:a,to:{description:{main:{key:"entry"},entry:{db:t,accession:o},protein:{isFilter:!0,db:"UniProt"}}}}),r.createElement(n.Z,{endpoint:"domain architecture",count:m,name:a,to:{description:{main:{key:"entry"},entry:{db:t,accession:o,detail:"domain_architecture"}}}}),r.createElement(n.Z,{endpoint:"taxonomy",count:d,name:a,to:{description:{main:{key:"entry"},entry:{db:t,accession:o},taxonomy:{isFilter:!0,db:"uniprot"}}}}),r.createElement(n.Z,{endpoint:"structure",count:u,name:a,to:{description:{main:{key:"entry"},entry:{db:t,accession:o},structure:{isFilter:!0,db:"PDB"}}}}),"cdd"===t.toLowerCase()||"pfam"===t.toLowerCase()||"pirsf"===t.toLowerCase()?r.createElement(n.Z,{endpoint:"set",count:p,name:a,to:{description:{main:{key:"entry"},entry:{db:t,accession:o},set:{isFilter:!0,db:t}}}}):null,i&&Object.keys(i).map((e=>Object.keys(i[e]).map((t=>r.createElement(n.Z,{key:e+"-"+t,endpoint:"entry",count:1,name:a,db:e,signature:t,to:{description:{main:{key:"entry"},entry:{db:e,accession:t}}}}))))))}},57359:(e,t,a)=>{a.d(t,{Z:()=>y});var r=a(67294),n=a(2191),o=a(29643),s=a(719),c=a(5647),i=a(63139),l=a(76371),m=a(40025),d=a(82806),u=(0,l.Z)(m.Z,d.Z),p={entry:"icon-entries",protein:"icon-proteins",proteome:"icon-count-proteome",taxonomy:"icon-count-species",structure:"icon-structures",set:"icon-count-set","domain architecture":"icon-count-ida"};const y=e=>{var{count:t,endpoint:a,name:l,to:m,db:d,signature:y}=e;return r.createElement(n.Z,{title:y?d+" signature: "+y:t+" "+(0,i.iZ)(a,t,!0)+" matching "+l,className:u("icon-link"),style:{display:"flex"}},r.createElement(o.Z,{to:m,className:u(t?null:"ico-disabled"),disabled:!t||!m},r.createElement("div",{className:u("icon","icon-conceptual","icon-wrapper",p[a])},"entry"===a&&r.createElement("div",{style:{position:"relative",top:"7px",left:"-2px"}},r.createElement(c.Z,{type:d||"all",className:u("md-small")})),0!==t&&r.createElement("div",{className:u("icon-over-animation")})),!y&&r.createElement(s.ZP,{abbr:!0},t)))}},53477:(e,t,a)=>{a.d(t,{C:()=>l});var r=a(67294),n=a(29643),o=a(76371),s=a(29143),c=a(82806),i=(0,o.Z)(s.Z,c.Z);const l=e=>{var{title:t,imageComponent:a,imageIconClass:o,subHeader:s,footer:c,linkForMore:l,labelForMore:m,compact:d=!1,className:u="",children:p}=e;return r.createElement("div",{className:i("new-card",u,{compact:d})},(a||o||t||s)&&r.createElement("header",null,(a||o)&&r.createElement("div",{className:i("image",o,{icon:!!o})},a),t&&r.createElement("div",{className:i("title")},t),s&&r.createElement("div",{className:i("subheader")},s)),r.createElement("section",{className:i("content")},p),(c||l)&&r.createElement(r.Fragment,null,r.createElement("div",{className:i("footer")},c,l&&r.createElement("div",{className:i("card-more")},r.createElement(n.Z,{href:l,target:"_blank",buttonType:"tertiary"},r.createElement("span",{className:i("icon","icon-common","icon-right"),"data-icon":""})," ",m||"See more"))," ")))}},77250:(e,t,a)=>{a.r(t),a.d(t,{default:()=>Le}),a(752),a(76265),a(86544),a(64043),a(61514),a(73964),a(76801),a(57267),a(60429),a(65137),a(52003),a(12826);var r=a(67294),n=a(2191),o=a(65455),s=a(29643),c=a(99972),i=a(18677),l=a(45007),m=a(19119),d=a(67289),u=(a(278),a(8575)),p=a(719),y=a(34287),_=a(10838),g=a(87616),b=a(4267),h=a(76371),E=a(73467),v=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)t.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]])}return a},f=(0,h.Z)(E.Z),C=/^all$/i,Z=e=>C.test(e);class O extends r.PureComponent{constructor(){super(...arguments),this._handleSelection=e=>{var t,a,{target:r}=e;if(!this.props.customLocation)return null;var n=r.value,o=this.props.customLocation.search,{page:s,type:c}=o,i=v(o,["page","type"]);Z(n)||(i.type=n),delete i.cursor,null===(a=(t=this.props).goToCustomLocation)||void 0===a||a.call(t,Object.assign(Object.assign({},this.props.customLocation),{search:i}))},this._formatType=e=>"ptm"===e?"PTM":"unknown"===e?"Other":e.replace("_"," ")}componentDidMount(){(0,b.Z)((()=>a.e(5085).then(a.bind(a,93841)).then((e=>e.InterproType)))).as("interpro-type")}render(){if(!this.props.data||!this.props.customLocation)return null;var{data:{loading:e,payload:t},isStale:a,customLocation:{description:{entry:n},search:o}}=this.props,s=null==n?void 0:n.db,c=Object.entries((0,d.uQ)(t,e,a)).sort(((e,t)=>{var[a]=e,[r]=t,n=["family","domain","homologous_superfamily","repeat","conserved_site","active_site","binding_site","ptm"],o=n.indexOf(a.toLowerCase()),s=n.indexOf(r.toLowerCase());return-1===o&&-1===s?a.localeCompare(r):-1===o?1:o-s}));return e||c.unshift(["All",c.reduce(((e,t)=>{var[,a]=t;return e+a}),0)]),r.createElement("div",{className:f("list-entries","filter",{stale:a})},c.map((t=>{var[n,c]=t,i=!o.type&&Z(n)||o.type===n.toLowerCase();return r.createElement("label",{key:n,className:f("radio-btn-label",{checked:i})},r.createElement("input",{type:"radio",name:"entry_type",className:f("radio-btn"),value:n.toLowerCase(),onChange:this._handleSelection,disabled:a,checked:i,style:{margin:"0.25em"}}),r.createElement("span",null,Z(n)||"InterPro"!==s?this._formatType(n):r.createElement("interpro-type",{type:n.replace("_"," "),expanded:!0,dimension:"17px"},n)),r.createElement(p.ZP,{label:!0,loading:e,className:f("filter-label"),abbr:!0},c))})))}}var P=(0,m.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>{var{protocol:r,hostname:n,port:o,root:s}=e,{type:c,search:i,cursor:l}=a,m=v(a,["type","search","cursor"]);return m.group_by="type",(0,u.format)({protocol:r,hostname:n,port:o,pathname:s+(0,_.Z)(t),query:m})})),k=(0,m.P1)((e=>e.customLocation),(e=>({customLocation:e})));const N=(0,y.Z)({getUrl:P,mapStateToProps:k,mapDispatchToProps:{goToCustomLocation:g.xb}})(O);var w=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)t.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]])}return a},j=(0,h.Z)(E.Z),x=(0,m.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>{var{protocol:r,hostname:n,port:o,root:s}=e,c=Object.assign(Object.assign({},t),{entry:Object.assign(Object.assign({},t.entry),{integration:null})}),{search:i,cursor:l}=a,m=w(a,["search","cursor"]);return m.interpro_status="",(0,u.format)({protocol:r,hostname:n,port:o,pathname:s+(0,_.Z)(c),query:m})})),L=(0,m.P1)((e=>e.customLocation),(e=>({customLocation:e})));const T=(0,y.Z)({getUrl:x,mapStateToProps:L,mapDispatchToProps:{goToCustomLocation:g.xb}})((e=>{var{data:t,isStale:a,goToCustomLocation:n,customLocation:o}=e;if(!t||!o)return null;var{loading:s,payload:c}=t,i=o.description.entry.integration||"";["unintegrated","integrated"].includes(i)||(i="both");var l=(0,d.uQ)(c,s,a);s||(l.both=(l.integrated||0)+(l.unintegrated||0));var m=e=>{var{target:t}=e,a=t.value,{description:r,search:s}=o,c=w(o,["description","search"]),{cursor:i}=s,l=w(s,["cursor"]);null==n||n(Object.assign(Object.assign({},c),{search:l,description:Object.assign(Object.assign({},r),{entry:Object.assign(Object.assign({},r.entry),{integration:"both"===a?null:a})})}))};return r.createElement("div",{className:j("list-integrated","filter",{stale:a})},Object.keys(l).sort().map((e=>r.createElement("label",{key:e,className:j("radio-btn-label",{checked:i===e})},r.createElement("input",{type:"radio",name:"interpro_state",value:e,className:j("radio-btn"),disabled:a,onChange:m,checked:i===e,style:{margin:"0.25em"}}),r.createElement("span",{style:{textTransform:"capitalize"}},e),r.createElement(p.ZP,{label:!0,loading:s,abbr:!0},l[e])))))}));var I=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)t.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]])}return a},S=(0,h.Z)(E.Z),A=(0,m.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>{var{protocol:r,hostname:n,port:o,root:s}=e,{search:c,cursor:i}=a,l=I(a,["search","cursor"]);return l.latest_entries="",(0,u.format)({protocol:r,hostname:n,port:o,pathname:s+(0,_.Z)(t),query:l})})),F=(0,m.P1)((e=>e.customLocation),(e=>({customLocation:e,latest:"latest_entries"in e.search})));const D=(0,y.Z)({getUrl:A,mapStateToProps:F,mapDispatchToProps:{goToCustomLocation:g.xb}})((e=>{var{data:t,isStale:a,latest:n,customLocation:o,goToCustomLocation:s}=e;if(!t)return null;if(!t.payload||!o)return null;var c=()=>{var e=o.search,{page:t}=e,a=I(e,["page"]),{latest_entries:r}=a,c=I(a,["latest_entries"]);n||(c.latest_entries=""),null==s||s(Object.assign(Object.assign({},o),{search:c}))};return r.createElement("div",{className:S("vf-stack","vf-stack--200","filter")},r.createElement("label",{className:S("radio-btn-label",{checked:!n})},r.createElement("input",{type:"radio",name:"latest_all",className:S("radio-btn"),value:"All",disabled:a,onChange:c,checked:!n,style:{margin:"0.25em"}}),r.createElement("span",null,"All")),r.createElement("label",{className:S("radio-btn-label",{checked:n})},r.createElement("input",{type:"radio",name:"latest_on",className:S("radio-btn"),value:"latest",disabled:a,onChange:c,checked:n,style:{margin:"0.25em"}}),r.createElement("span",null,"New Entries"),r.createElement(p.ZP,{label:!0,loading:t.loading,className:S("filter-label"),abbr:!0},t.payload.count)))}));var B=a(77222),M=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)t.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]])}return a},H=(0,h.Z)(B.Z,E.Z),q={"Biological Process":"P","Cellular Component":"C","Molecular Function":"F"},R={"Biological Process":"BP","Cellular Component":"CC","Molecular Function":"MF"},K=(0,m.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>{var{protocol:r,hostname:n,port:o,root:s}=e,{page_size:c,search:i,cursor:l,go_category:m}=a,d=M(a,["page_size","search","cursor","go_category"]);return d.group_by="go_categories",(0,u.format)({protocol:r,hostname:n,port:o,pathname:s+(0,_.Z)(t),query:d})})),z=(0,m.P1)((e=>e.customLocation),(e=>({customLocation:e})));const G=(0,y.Z)({getUrl:K,mapStateToProps:z,mapDispatchToProps:{goToCustomLocation:g.xb}})((e=>{var{data:t,isStale:a,customLocation:o,goToCustomLocation:s}=e;if(!t||!o)return null;var{loading:c,payload:i}=t,{search:l}=o,m=e=>{var{target:t}=e,a=t.value,{page:r,go_category:n,cursor:c}=l,i=M(l,["page","go_category","cursor"]);"All"!==a&&(i.go_category=a),null==s||s(Object.assign(Object.assign({},o),{search:i}))},u=Object.entries((0,d.uQ)(i,c,a)).sort(((e,t)=>{var[,a]=e,[,r]=t;return r-a}));return c||u.unshift(["All",NaN]),r.createElement("div",{className:H({stale:a})},r.createElement("div",{className:H("filter")},u.map((e=>{var[t,o]=e,s=t,i="All"===s&&!l.go_category||l.go_category===q[s];return r.createElement("label",{key:s,className:H("radio-btn-label",{checked:i})},r.createElement("input",{type:"radio",name:"go_category",className:H("radio-btn"),value:q[s]||"All",disabled:a,onChange:m,checked:i,style:{margin:"0.25em"}}),r.createElement("span",null,s),s in R&&r.createElement(n.Z,{title:s+" category"},r.createElement("small",{className:H("go-short-label","sign-label-head",R[s].toLowerCase())},R[s])),void 0===o||isNaN(o)?null:r.createElement(p.ZP,{label:!0,loading:c,className:H("filter-label"),abbr:!0},o))}))))}));var U=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)t.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]])}return a},Q=(0,h.Z)(B.Z,E.Z),W={Curated:"curated","AI-Generated (reviewed)":"ai-reviewed","AI-Generated (unreviewed)":"ai-unreviewed"},Y=(0,m.P1)((e=>e.settings.api),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>{var{protocol:r,hostname:n,port:o,root:s}=e,{page_size:c,search:i,cursor:l,curation_status:m}=a,d=U(a,["page_size","search","cursor","curation_status"]);return d.group_by="curation_statuses",(0,u.format)({protocol:r,hostname:n,port:o,pathname:s+(0,_.Z)(t),query:d})})),X=(0,m.P1)((e=>e.customLocation),(e=>({customLocation:e})));const $=(0,y.Z)({getUrl:Y,mapStateToProps:X,mapDispatchToProps:{goToCustomLocation:g.xb}})((e=>{var{data:t,isStale:a,customLocation:n,goToCustomLocation:o}=e;if(!t||!n)return null;var{loading:s,payload:c}=t,{search:i}=n,l=e=>{var{target:t}=e,a=t.value,{page:r,curation_status:s,cursor:c}=i,l=U(i,["page","curation_status","cursor"]);"All"!==a&&(l.curation_status=a),null==o||o(Object.assign(Object.assign({},n),{search:l}))},m=Object.entries((0,d.uQ)(c,s,a)).sort(((e,t)=>{var[,a]=e,[,r]=t;return r-a}));return s||m.unshift(["All",m.reduce(((e,t)=>{var[,a]=t;return e+a}),0)]),r.createElement("div",{className:Q({stale:a})},r.createElement("div",{className:Q("filter")},m.map((e=>{var[t,n]=e,o=t,c="All"===o&&!i.curation_status||i.curation_status===W[o];return"All"==o||n>0?r.createElement("label",{key:o,className:Q("radio-btn-label",{checked:c})},r.createElement("input",{type:"radio",name:"curation_status",className:Q("radio-btn"),value:W[o]||"All",disabled:a,onChange:l,checked:c,style:{margin:"0.25em"}}),r.createElement("span",null,o),r.createElement(p.ZP,{label:!0,loading:s,className:Q("filter-label"),abbr:!0},n)):""}))))}));var V=(0,m.P1)((e=>e.customLocation.description.main.key&&e.customLocation.description[e.customLocation.description.main.key]),(e=>({mainDB:e.db||""})));const J=(0,l.$j)(V)((e=>{var{mainDB:t}=e;return r.createElement(d.ZP,null,r.createElement(N,{label:("InterPro"===t?"InterPro":"Member Database Entry")+" Type"}),"InterPro"!==t&&r.createElement(T,{label:"InterPro State"}),"InterPro"===t&&r.createElement(G,{label:"GO Terms"}),"InterPro"===t&&r.createElement(D,{label:"New entries"}),r.createElement($,{label:"Curation status"}))}));var ee=a(5647),te=a(35096),ae=a(16392),re=a(41089),ne=a(35692),oe=a(30673),se=a(21105),ce=a(61759),ie=a(43596),le=a(52727),me=a(54617),de=a(45913),ue=a(82806),pe=a(83373),ye=a(21223),_e=a(53477),ge=a(85869),be=a(51663);const he=e=>{var t,a,{data:o,search:c,entryDB:i}=e,l="string"==typeof(null===(t=o.extra_fields)||void 0===t?void 0:t.short_name)?null===(a=o.extra_fields)||void 0===a?void 0:a.short_name:o.metadata.accession,m="string"==typeof o.metadata.name?o.metadata.name:o.metadata.name.name;return r.createElement(_e.C,{imageComponent:r.createElement(n.Z,{title:o.metadata.type.replace("_"," ")+" type"},r.createElement("interpro-type",{dimension:"2em",type:o.metadata.type.replace("_"," "),"aria-label":"Entry type"})),title:r.createElement(s.Z,{to:{description:{main:{key:"entry"},entry:{db:o.metadata.source_database,accession:o.metadata.accession}}}},r.createElement(ne.Z,{text:l||"",textToHighlight:c})),subHeader:r.createElement(r.Fragment,null,m),footer:r.createElement(r.Fragment,null,r.createElement("div",null,r.createElement(ne.Z,{text:o.metadata.accession||"",textToHighlight:c})),"interpro"===i.toLowerCase()?r.createElement("div",null):r.createElement("div",null,o.metadata.integrated?r.createElement("div",null,"Integrated into"," ",r.createElement("div",null,r.createElement(s.Z,{to:{description:{main:{key:"entry"},entry:{db:"InterPro",accession:o.metadata.integrated}}}},o.metadata.integrated))):"Not integrated"))},r.createElement("div",null,o.extra_fields?r.createElement(be.Z,{entryDB:i,entryAccession:o.metadata.accession,entryName:l,counters:o.extra_fields.counters}):r.createElement(ge.Z,null)))};var Ee=a(72694),ve=a(63294),fe=(0,h.Z)(B.Z,de.Z,ue.Z,pe.Z,ye.Z),Ce=new Map([["P","#d1eaef"],["F","#e0f2d1"],["C","#f5ddd3"]]),Ze=e=>{var{name:t,page:a}=e;return r.createElement("div",{className:fe("row")},r.createElement("div",{className:fe("columns","large-12")},r.createElement(o.Z,{type:"info"},r.createElement("p",null,r.createElement("strong",null,t," has retired"),r.createElement("br",null),"While ",t," is no longer receiving updates, InterPro now serves as an archival source, granting continued access to its data.",r.createElement("br",null),"Further information about ",t," can be found"," ",r.createElement(s.Z,{href:le.default.root.readthedocs.href+a+".html",className:fe("ext"),target:"_blank"},"in our documentation"),"."))))},Oe=e=>{var{description:t,search:a,count:n,fileType:o,name:s}=e;return r.createElement(te.Z,{fileType:o,name:s||"entries."+o,count:n,customLocationDescription:t,search:a,endpoint:"entry"})},Pe=e=>{var t,o,l,m,d,{data:u,customLocation:p,isStale:y,dataBase:g}=e;if((0,r.useEffect)((()=>{(0,b.Z)((()=>a.e(5085).then(a.bind(a,93841)).then((e=>e.InterproType)))).as("interpro-type")}),[]),!u||!p)return null;var{payload:h}=u,{description:E,search:v}=p,f=h,C=E.entry.db,Z=!u.loading&&200!==u.status,O=null===(t=null==g?void 0:g.payload)||void 0===t?void 0:t.databases,P=y&&(null===(d=null===(m=null===(l=null===(o=null==f?void 0:f.results)||void 0===o?void 0:o[0])||void 0===l?void 0:l.metadata)||void 0===m?void 0:m.source_database)||void 0===d?void 0:d.toLowerCase())!==C.toLowerCase();(u.loading||Z||P)&&(f={results:[],count:0});var k=u.url,N="interpro"!==(null==C?void 0:C.toLowerCase()),w=(null==f?void 0:f.count)||0;return r.createElement("div",{className:fe("row","filters-and-table")},r.createElement("nav",null,r.createElement("div",{className:fe("browse-side-panel")},N&&r.createElement(r.Fragment,null,r.createElement("div",{className:fe("selector-container")},r.createElement(i.Z,{contentType:"entry",className:"pp-left-side-db-selector"})),r.createElement("hr",{style:{paddingTop:"0.5rem"}})),r.createElement(J,null))),r.createElement("section",null,O&&C&&O[C.toLowerCase()]&&r.createElement(Ne,{data:{data:{db:O[C.toLowerCase()]},location:window.location},processData:ve.B5}),C&&["prints","sfld"].includes(C)?r.createElement(Ze,{name:C.toUpperCase(),page:C.toLowerCase()}):null,r.createElement(re.ZP,{dataTable:null==f?void 0:f.results,contentType:"entry",loading:u.loading,ok:u.ok,status:u.status,isStale:y,actualSize:w,query:v,notFound:Z,withGrid:!!k,databases:O,nextAPICall:null==f?void 0:f.next,previousAPICall:null==f?void 0:f.previous,currentAPICall:u.url},r.createElement(re.uX,null,r.createElement("div",{className:fe("menu-grid")},r.createElement(Oe,{description:E,search:v,count:w,fileType:"json",name:"json"}),r.createElement(Oe,{description:E,search:v,count:w,fileType:"tsv",name:"tsv"}),r.createElement(ae.Z,{type:"api",url:(0,Ee.Y2)(u.url)}),r.createElement(ae.Z,{search:v,type:"scriptgen",subpath:(0,_.Z)(E)}))),r.createElement(re.xw,null),r.createElement(re.Zb,null,(e=>r.createElement(he,{data:e,search:v.search,entryDB:C}))),r.createElement(re.Rj,{loading:y},"Search entries"),r.createElement(re.kY,null),"InterPro"===C&&r.createElement(re.sg,{dataKey:"type",headerClassName:fe("col-type","table-center"),cellClassName:fe("table-center"),renderer:e=>{var t=e.replace("_"," ");return r.createElement(n.Z,{title:t+" type"},r.createElement("interpro-type",{type:t,dimension:"26px"}))}}),r.createElement(re.sg,{dataKey:"accession",isSortable:!0,renderer:(e,t)=>r.createElement(s.Z,{to:t=>({description:Object.assign(Object.assign({},t.description),{entry:Object.assign(Object.assign({},t.description.entry),{accession:e})})})},r.createElement(Ne,{data:{data:{row:t,endpoint:"entry"},location:window.location},processData:ve.sX}),r.createElement("span",{className:fe("acc-row")},r.createElement(ne.Z,{text:e||"",textToHighlight:v.search})))},"Accession"),r.createElement(re.sg,{dataKey:"counters.extra_fields.short_name",renderer:(e,t,a)=>(null==a?void 0:a.short_name)?r.createElement(s.Z,{to:e=>({description:Object.assign(Object.assign({},e.description),{entry:Object.assign(Object.assign({},e.description.entry),{accession:t.accession})}),search:{}})},r.createElement(ne.Z,{text:a.short_name,textToHighlight:v.search})):null},"Short name"),r.createElement(re.sg,{dataKey:"name",renderer:(e,t)=>{var{accession:a}=t;return r.createElement(s.Z,{to:e=>({description:Object.assign(Object.assign({},e.description),{entry:Object.assign(Object.assign({},e.description.entry),{accession:a})}),search:{}})},r.createElement(ne.Z,{text:e,textToHighlight:v.search}))}},"Name"),"InterPro"!==C&&r.createElement(re.sg,{dataKey:"type",headerClassName:fe("col-type","table-center"),cellClassName:fe("table-center"),renderer:e=>r.createElement(n.Z,{title:e.replace("_"," ")+" type (as defined by "+(O&&O[C]&&O[C].name||C)+")"},e.replace("_"," "))},C+" Type"),"InterPro"!==C&&r.createElement(re.sg,{dataKey:"source_database",headerClassName:fe("table-center"),cellClassName:fe("table-center"),renderer:(e,t)=>{var{accession:a}=t,o=(0,oe.ZP)(e),c=r.createElement(ee.Z,{type:e,className:fe("md-small")});return"pfam"!==e.toLowerCase()&&o?r.createElement(n.Z,{title:"link to "+a+" on the "+(O&&O[e]&&O[e].name||e)+" website",distance:-5,useContext:!0},r.createElement(s.Z,{target:"_blank",href:o(a),style:{borderBottomWidth:0}},c)):c}},"DB"),"InterPro"===C?r.createElement(re.sg,{dataKey:"member_databases",cellClassName:fe("col-md"),renderer:e=>r.createElement("div",{className:fe("signature-container")},e&&Object.entries(e).map((e=>{var[t,a]=e;return Object.entries(a).map((e=>{var[a,o]=e;return r.createElement(n.Z,{key:a,title:o+" ("+(O&&O[t]&&O[t].name||t)+")",className:fe("signature",{"corresponds-to-filter":v.signature_in&&v.signature_in.toLowerCase()===t.toLowerCase()})},r.createElement(s.Z,{to:{description:{main:{key:"entry"},entry:{db:t,accession:a}}}},a))}))})))},"Integrated Signature(s)"):r.createElement(re.sg,{dataKey:"integrated",headerClassName:fe("table-center"),renderer:e=>e?r.createElement(s.Z,{to:{description:{main:{key:"entry"},entry:{db:"InterPro",accession:e}},search:{}}},r.createElement(n.Z,{title:""+e},e)):""},"Integrated Into"),"InterPro"===C?r.createElement(re.sg,{dataKey:"go_terms",headerClassName:fe("col-go-head"),cellClassName:fe("col-go"),renderer:e=>r.createElement("div",{className:fe("go-container")},e&&Array.from(e).sort(((e,t)=>e.category.code>t.category.code?0:e.category.code<t.category.code||e.name>t.name?1:0)).map((e=>r.createElement("span",{key:e.identifier,className:fe("go-list")},r.createElement(n.Z,{title:e.category.name.replace("_"," ")+" term"},r.createElement("span",{className:fe("go-circle"),style:{background:Ce.get(e.category.code)||"#ddd"}})),r.createElement(n.Z,{title:e.name+" ("+e.identifier+")"},r.createElement(c.Z,{id:e.identifier,className:fe("ext")},e.name?e.name:"None"))))))},"GO Terms"," ",r.createElement(n.Z,{title:"Biological process category"},r.createElement("span",{className:fe("sign-label-head","bp")},"BP"))," ",r.createElement(n.Z,{title:"Molecular function category"},r.createElement("span",{className:fe("sign-label-head","mf")},"MF"))," ",r.createElement(n.Z,{title:"Cellular component category"},r.createElement("span",{className:fe("sign-label-head","cc")},"CC"))):null)))},ke=(0,se.Z)({loader:()=>Promise.resolve().then(a.bind(a,16023)),loading:()=>null}),Ne=(0,se.Z)({loader:()=>a.e(1169).then(a.bind(a,25392)),loading:()=>null}),we=new Map;for(var je of le.default.pages.entry.subPages)we.set(je,ie.Z.get(je));var xe=new RegExp("("+me.j.join("|")+"|IPR[0-9]{6})","i");const Le=()=>r.createElement(ce.Z,{subpagesRoutes:xe,listOfEndpointEntities:Pe,SummaryAsync:ke,subPagesForEndpoint:we})},40025:(e,t,a)=>{a.d(t,{Z:()=>r});const r={"icon-link":"CounterIcon_styles__icon-link___c3","icon-over-animation":"CounterIcon_styles__icon-over-animation___ef","icon-wrapper":"CounterIcon_styles__icon-wrapper___b8","md-small":"CounterIcon_styles__md-small___a8","mod-img-pos":"CounterIcon_styles__mod-img-pos___c0",icon:"CounterIcon_styles__icon___e4","icon-count-species":"CounterIcon_styles__icon-count-species___e0","icon-count-ida":"CounterIcon_styles__icon-count-ida___ce","icon-count-set":"CounterIcon_styles__icon-count-set___de","icon-count-hmm":"CounterIcon_styles__icon-count-hmm___c7","icon-count-proteome":"CounterIcon_styles__icon-count-proteome___ad","card-counter-block":"CounterIcon_styles__card-counter-block___de"}},29143:(e,t,a)=>{a.d(t,{Z:()=>r});const r={"new-card":"Card_styles__new-card___df",image:"Card_styles__image___b8","card-tag":"Card_styles__card-tag___bf",icon:"Card_styles__icon___d1",title:"Card_styles__title___fb",subheader:"Card_styles__subheader___ca",content:"Card_styles__content___f0",footer:"Card_styles__footer___fe","card-more":"Card_styles__card-more___c3","button-more":"Card_styles__button-more___f8",compact:"Card_styles__compact___e9","tag-publi":"Card_styles__tag-publi___f0","tag-tuto":"Card_styles__tag-tuto___b1","tag-tool":"Card_styles__tag-tool___dd","tag-focus":"Card_styles__tag-focus___e5","tag-blog":"Card_styles__tag-blog___a7","white-link":"Card_styles__white-link___a2","card-info-author":"Card_styles__card-info-author___e9",button:"Card_styles__button___ee",hollow:"Card_styles__hollow___d5",secondary:"Card_styles__secondary___d8","margin-bottom-large":"Card_styles__margin-bottom-large___d8"}}}]);
//# sourceMappingURL=6506.module.entry-page.df3.js.map