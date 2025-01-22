"use strict";(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[7714],{9033:(e,t,a)=>{a.d(t,{Em:()=>g,F6:()=>v,GC:()=>u,Gr:()=>m,Me:()=>_,UF:()=>d,g$:()=>h,ie:()=>p}),a(64043),a(57267),a(86544),a(61514),a(60429),a(76801),a(752),a(76265),a(22462);var r=a(19119),n=a(8575),s=a(10838),i=a(52727),o=a(24644),l=/([^:])\/{2,}/g,c=["pfam","cdd","pirsf"],d=function(e){return void 0===e&&(e=""),e.replace(l,"$1/")},h=(0,r.P1)((e=>e.settings.api),(e=>{var{protocol:t,hostname:a,port:r,root:s}=e;return d((0,n.format)({protocol:t,hostname:a,port:r,pathname:""+s}))})),u=e=>(0,r.P1)((()=>i.default.github[e]),(e=>{var{owner:t,repo:a}=e;return"https://api.github.com/repos/"+t+"/"+a+"/releases/latest"})),p=e=>(0,r.P1)((()=>i.default.github.ReadTheDocs),(t=>{var{owner:a,repo:r,branch:n="master"}=t;return"https://raw.githubusercontent.com/"+a+"/"+r+"/"+n+"/docs/"+e})),m=(0,r.P1)((e=>e),(e=>(0,r.P1)((t=>t.settings[e]),(e=>e.settings.navigation.pageSize),(e=>e.customLocation.description),(e=>e.customLocation.search),(e=>e.customLocation.hash),((e,t,a,r,i)=>{var{protocol:o,hostname:l,port:h,root:u}=e,p=a.main.key&&a[a.main.key].accession?{}:Object.assign({},r||{});if((!a[a.main.key].accession||Object.values(a).find((e=>{var{isFilter:t,db:a}=e;return t&&a}))||a.entry&&a.entry.memberDB)&&(p.page_size=p.page_size||t),"grid"===i)switch(a.main.key){case"entry":p.extra_fields="short_name,description,literature,counters:protein-ida-taxonomy-structure",c.includes(a.entry.db)&&(p.extra_fields+="-set");break;case"protein":p.extra_fields="counters:entry-structure";break;case"structure":p.extra_fields="counters:entry-protein-taxonomy";break;case"taxonomy":p.extra_fields="lineage,counters:entry-protein-structure-proteome";break;case"proteome":p.extra_fields="counters:entry-protein-structure";break;case"set":p.extra_fields="counters,description";break;default:p.extra_fields=void 0}if("table"===i)switch(a.main.key){case"entry":p.extra_fields="short_name";break;case"taxonomy":case"proteome":p.extra_fields="counters:entry-protein";break;case"set":p.extra_fields="counters:entry,description"}"tree"===i&&void 0!==p.search&&delete p.search;var m=a.main.key&&a[a.main.key].accession?{main:a.main,[a.main.key]:a[a.main.key]}:a,_=p.cursor;_&&delete p.cursor;var g=d((0,n.format)({protocol:o,hostname:l,port:h,pathname:u+(0,s.Z)(m),query:p}));if(_){var v=-1===g.indexOf("?")?"?":"&";return""+g+v+"cursor="+_}return g})))),_=(0,r.P1)((e=>e.settings.api),(e=>e.settings.navigation.pageSize),(e=>e.customLocation.description),(e=>e.customLocation.search),(e=>e.customLocation.hash),((e,t,a,r,i)=>{var l,{protocol:c,hostname:d,port:h,root:u}=e,p={},m=Object.assign({},r);for(var[_,g]of("tree"===i&&void 0!==m.search&&delete m.search,void 0!==m.model_page&&delete m.model_page,Object.entries(a)))p[_]="other"===_?[...g]:Object.assign({},g),g.isFilter&&1===g.order&&(l=_,p[_].isFilter=!1);p[a.main.key].isFilter=!0,p.main.key=l;var v=Object.assign({},m,{extra_fields:void 0,page_size:r.page_size||t});"entry"===l&&(v.extra_fields="short_name");var f=(0,o.e)(a.main.key,l);f&&(v.extra_fields?v.extra_fields+=","+f:v.extra_fields=f);var y=(0,n.format)({protocol:c,hostname:d,port:h,pathname:u+(0,s.Z)(p),query:v});return"entry"===a.main.key&&"taxonomy"===l&&(y=y.replace("/entry/","/protein/entry/")),"taxonomy"===a.main.key&&"proteome"===l&&(y=y.replace("/taxonomy/","/protein/taxonomy/")),y})),g=(e,t)=>t&&1!=+t&&!e.match(/taxonomy\/uniprot\/\d+/gi)?e.replace(/taxonomy\/uniprot\//,"/taxonomy/uniprot/"+t+"/"):e,v=function(){return m("api")(...arguments).replace("/entry_alignments","/").replace("/logo","/").replace("/alphafold","/").replace("/domain_architecture","/").replace("/interactions","/").replace("/subfamilies","/").replace("/pathways","/").replace("/feedback","/").replace("/sequence","/").replace("/similar_proteins","/").replace("/curation","/").replace(/\/set\/[a-zA-Z0-9]+\/entry\/([a-zA-Z0-9]+)\//,"/set/$1/")}},19963:(e,t,a)=>{a.d(t,{Z:()=>r});const r=e=>t=>(t.preventDefault(),t.stopPropagation(),e(t))},70295:(e,t,a)=>{a.r(t),a.d(t,{IPScanSearch:()=>ne,MAX_NUMBER_OF_SEQUENCES:()=>X,default:()=>ie}),a(752),a(73964),a(76265),a(28436),a(268),a(64043),a(61514),a(86544);var r=a(67294),n=a(45007),s=a(19119),i=a(79180),o=a(87616),l=a(21105),c=(a(76801),a(43843),a(8575)),d=a(34287),h=a(3817),u=a(76820),p=a(2191);const m=e=>{var{name:t,value:a,children:n,title:s,defaultChecked:i}=e,o=r.createElement(r.Fragment,null,r.createElement("input",{name:t,defaultChecked:i,type:"checkbox",value:a,"data-defaultchecked":i})," ",n);return s?r.createElement("label",null,r.createElement(p.Z,{title:s},o)):o};var _=a(76371),g=a(46997),v=(0,_.Z)({"new-fieldset":"AdvancedOptions_style__new-fieldset___d0","new-input-group":"AdvancedOptions_style__new-input-group___b9","new-input-group-label":"AdvancedOptions_style__new-input-group-label___eb","option-style":"AdvancedOptions_style__option-style___fb",triangle:"AdvancedOptions_style__triangle___ce"},g.Z),f=new Set(["CDD","HAMAP","Panther","PfamA","PIRSF","PRINTS","PrositeProfiles","SMART","NCBIfam","PrositePatterns","SFLD"]),y=new Set(["Gene3d","SuperFamily"]),S=new Set(["Coils","MobiDBLite","Phobius","SignalP","TMHMM"]),b=new Set,E=new Map([["PfamA","Pfam"],["Panther","PANTHER"],["SuperFamily","SUPERFAMILY"],["Gene3d","CATH-Gene3D"],["PrositeProfiles","PROSITE profiles"],["PrositePatterns","PROSITE patterns"]]),w=e=>{var{value:t,defaultValue:a,properties:n}=e;return r.createElement(m,{name:"appl",value:t,defaultChecked:a,title:n&&n.properties[0].value,key:t},E.get(t)||t)},P=(e,t)=>{if(t)for(var a of t.querySelectorAll('input[name="appl"]'))a.checked=e},T=(0,s.P1)((e=>e.settings.ipScan),(e=>{var{protocol:t,hostname:a,port:r,root:n}=e;return(0,c.format)({protocol:t,hostname:a,port:r,pathname:n+"/parameterdetails/appl"})}));const C=(0,d.Z)(T)((e=>{var{data:t,title:a,initialOptions:n,changeTitle:s}=e,i=(0,r.useRef)(null);if(!t)return null;var{loading:o,payload:l,ok:c}=t;if(o)return"Loading…";if(!c||!l)return"Failed…";var{mdb1:d,mdb2:p,other:m,noCategory:_}=((e,t)=>{var a=[],r=[],n=[],s=[],i=null==t?void 0:t.applications;for(var o of e)(null==i?void 0:i.length)&&(o.defaultValue=i.includes(o.value)),f.has(o.value)?a.push(o):y.has(o.value)?r.push(o):S.has(o.value)?n.push(o):b.has(o.value)||s.push(o);return{mdb1:a,mdb2:r,other:n,noCategory:s}})(l.values.values,n);return r.createElement("section",null,r.createElement("details",{className:v("option-style")},r.createElement("summary",null,r.createElement("span",{className:v("triangle")},"►"),r.createElement("span",null,"Advanced options")),r.createElement("fieldset",{className:v("new-fieldset")},r.createElement("legend",null,"Job configuration"),r.createElement("label",{style:{marginBottom:"1rem"}},r.createElement(u.Z,{id:"seqtype",name:"seqtype",switchCond:!1,label:"Sequence type:",size:"small",offValue:"protein (amino acids)",onValue:"DNA/RNA (nucleotides)",width:"11rem"})),r.createElement("br",null),r.createElement("label",{style:{marginBottom:"1rem"}},r.createElement(u.Z,{id:"stay",name:"stay",switchCond:!1,label:"Create another job after this one:",size:"small"})),r.createElement("label",{className:v("new-input-group")},r.createElement("span",{className:v("new-input-group-label")},"Job title"),r.createElement("input",{type:"text",className:v("input-group-field"),name:"local-title",defaultValue:a,onChange:s,placeholder:"Give this job a local title (only visible on this browser)"}))),r.createElement("fieldset",{className:v("new-fieldset"),ref:i},r.createElement("legend",null,"Applications"),r.createElement("p",null,l.description),r.createElement("div",{className:v("button-group","line-with-buttons")},r.createElement(h.Z,{type:"tertiary",onClick:e=>{e.preventDefault(),P(!0,i.current)}},"Select all"),r.createElement(h.Z,{type:"tertiary",onClick:e=>{e.preventDefault(),P(!1,i.current)}},"Unselect all")),r.createElement("fieldset",{className:v("new-fieldset")},r.createElement("legend",null,"Member databases"),r.createElement("fieldset",{className:v("new-fieldset")},r.createElement("legend",null,"Families, domains, sites & repeats"),d.map(w)),r.createElement("fieldset",{className:v("new-fieldset")},r.createElement("legend",null,"Structural domains"),p.map(w))),r.createElement("fieldset",{className:v("new-fieldset")},r.createElement("legend",null,"Other sequence features"),m.map(w),_.map(w)))))}));var k=a(76233),x=a(29643),R=a(65455),D=a(74482),N=a(19963),A=a(18890),O=a(63294),Z=(a(57267),a(9041)),L=a(98622),I=a(36237),q=a(35395),F=(0,_.Z)({"info-message":"InfoMessages_style__info-message___d7",header:"InfoMessages_style__header___af",warnings:"InfoMessages_style__warnings___e0"});const j=e=>{var{sequenceIssues:t}=e,a=0===t.length;return r.createElement(R.Z,{type:a?"announcement":"warning",style:{backgroundColor:"var(--colors-secondary-header)"},alt:!0,className:F("info-message")},a?r.createElement("div",null,r.createElement("span",{role:"img","aria-label":"warning"},"✅")," ","Valid Sequence."):r.createElement("ul",{className:F("warnings")},t.map((e=>{switch(e.type){case"invalidCharacters":return r.createElement("li",null,"The sequence with the header below has invalid characters."," ",r.createElement("div",{className:F("header")},e.header));case"tooShort":return r.createElement("li",null,"The sequence with the header below is too short (min: three characters)."," ",r.createElement("div",{className:F("header")},e.header));case"tooMany":return r.createElement("li",null,"There are too many sequences. The maximum allowed is"," ",X,"."," ");case"duplicatedHeaders":return r.createElement("li",null,"There are multiple sequences with the same header:"," ",r.createElement("div",{className:F("header")},e.header));default:return null}}))))};var M,G=(0,_.Z)(g.Z,L.Z,I.Z,q.Z),U=e=>t=>{var{offsetKey:a,children:n}=t;return r.createElement("span",{className:e,"data-offset-key":a},n)},V=(e,t)=>{var a=t.getBlockBefore(e.getKey());if(!a)return!0;var r=a.getText().trim();return""===r||r.startsWith(";")?V(a,t):!r.startsWith(">")},H=function(e,t){return void 0===t&&(t=!1),(a,r,n)=>{for(var s,i=a.getText();s=e.exec(i);){var o=V(a,n);t||!o&&!i.trim().startsWith(";")||r(s.index,s.index+s[0].length),t&&!o&&r(s.index,s.index+s[0].length)}}},K=new Z.CompositeDecorator([{strategy:H(/^\s*[;].*$/gm),component:U(G("comment"))},{strategy:H(/^\s*[>].*$/gm),component:U(G("fasta-header"))},{strategy:H(/^\s*[>].*$/gm,!0),component:U(G("invalid-comment"))},{strategy:(M=/[^a-z]+/gi,(e,t)=>{for(var a,r=e.getText();a=M.exec(r);)t(a.index,a.index+a[0].length)}),component:U(G("invalid-letter"))}]),W=/^\s*>.*$/m,z=/^[a-z\s]*$/im,Q=(e,t)=>{if(t+1>=e.length)return!1;var a=e[t+1].text.trim();return a.startsWith(";")||""===a?Q(e,t+1):!a.startsWith(">")},B=r.forwardRef(((e,t)=>{var{value:a,onChecksChange:n}=e,s=(0,r.useRef)(null),[i,o]=(0,r.useState)(Z.EditorState.createEmpty(K)),[l,c]=(0,r.useState)([]),d=e=>{var t=(e=>{var t=[],a=0,r=!0,n="",s={},i=0,o=(e=>e.map((e=>e.trim())).map((e=>!e.startsWith(";")&&e)).filter(Boolean))(e);for(var l of o){if(W.test(l)){!r&&a<3&&t.push({type:"tooShort",header:n}),n=l,a=0,i++;var c=l.slice(1).trim();s[c]?(s[c]++,t.push({type:"duplicatedHeaders",header:"> "+c})):s[c]=1}else z.test(l)||t.push({type:"invalidCharacters",detail:"Invalid characters",header:n}),a+=l.trim().length;r=!1}return a<3&&t.push({type:"tooShort",header:n}),i>X&&t.push({type:"tooMany"}),t})(e);t!==l&&(c(t),n&&n(t))},h=e=>{var t=Z.EditorState.createWithContent(Z.ContentState.createFromText(decodeURIComponent(e)),K),a=(0,Z.convertToRaw)(t.getCurrentContent()).blocks.map((e=>e.text));d(a),o(t)};(0,r.useEffect)((()=>{a&&h(a)}),[a]);var u=e=>{h(e||"")},p=()=>{var e=(e=>{var t={};return e.map(((e,a,r)=>{var{text:n}=e,s=n.trim();if(!s)return null;if(s.startsWith(";"))return s;if(s.startsWith(">")){var i=s,o=s.slice(1).trim();return o in t?(t[o]++,i+=" - "+t[o]):t[o]=1,Q(r,a)?i:null}return s.replace(/[^a-z\s]/gi,"").trim()})).filter(Boolean).join("\n")})((0,Z.convertToRaw)(i.getCurrentContent()).blocks);h(e)},m=()=>{s.current&&s.current.focus()},_=()=>(0,Z.convertToRaw)(i.getCurrentContent()).blocks.map((e=>e.text)).join("\n"),g=()=>i.getCurrentContent().hasText();(0,r.useImperativeHandle)(t,(()=>({reset:u,cleanUp:p,focusEditor:m,getContent:_,sequenceIssues:l,hasText:g})));var v=e=>{var t=(0,Z.convertToRaw)(e.getCurrentContent()).blocks.map((e=>e.text)),a=((e,t)=>{var a=1;if(e.getCurrentContent().hasText()){var r=((null==t?void 0:t[0])||"").trim();if(!r.startsWith(">")&&r.length>3){var n=">Sequence"+a++;t.splice(0,0,n);var s=Z.EditorState.createWithContent(Z.ContentState.createFromText(t.join("\n")),K);return Z.EditorState.moveFocusToEnd(s)}}return null})(e,t);a?v(a):(d(t),o(e))},f=0===l.length;return r.createElement("section",null,r.createElement("div",{onClick:m,role:"presentation"},r.createElement("div",{className:G("editor",{"invalid-block":!f&&g(),"valid-block":f&&g()})},r.createElement(Z.Editor,{placeholder:"Enter your sequence",editorState:i,onChange:v,handlePastedText:e=>{var t=Z.ContentState.createFromText(e).getBlockMap(),a=Z.EditorState.push(i,Z.Modifier.replaceWithFragment(i.getCurrentContent(),i.getSelection(),t),"insert-fragment");return v(a),"handled"},ref:s}))),g()&&r.createElement(j,{sequenceIssues:l}))}));B.displayName="SequenceInput";const Y=B;var J=a(82806),$=(0,_.Z)(I.Z,g.Z,L.Z,q.Z,J.Z),X=100,ee=(0,l.Z)({loader:()=>a.e(1169).then(a.bind(a,25392)),loading:()=>null}),te=e=>'input[name="'+e+'"]:checked',ae=e=>t=>!!t.querySelector(te(e)),re=ae("stay");class ne extends r.PureComponent{constructor(e){super(e),this.changeTitle=()=>{var e,t,a=((null===(t=null===(e=this._formRef.current)||void 0===e?void 0:e.querySelector('input[name="local-title"]'))||void 0===t?void 0:t.value)||"").trim();this.setState({title:a})},this._handleReset=e=>{var t;if(this._formRef.current&&"string"!=typeof e){var a=Array.from(this._formRef.current.querySelectorAll('input[name]:not([name="stay"])'));for(var r of a)r.checked=!!r.dataset.defaultchecked}this.setState({dragging:!1,title:void 0,submittedJob:null},(()=>{var e;return null===(e=this._editorRef.current)||void 0===e?void 0:e.focusEditor()})),null===(t=this._editorRef.current)||void 0===t||t.reset("string"==typeof e?e:void 0)},this._handleSubmit=e=>{var t;if(e.preventDefault(),this._formRef.current){var a=null===(t=this._editorRef.current)||void 0===t?void 0:t.getContent();if(a){var r,n=(0,D.Z)("internal-"+Date.now()),s=a.split("\n").filter((e=>e.trim().startsWith(">"))).length||1;this.props.createJob({metadata:{localID:n,entries:s,group:this.state.title,type:"InterProScan",seqtype:ae("seqtype")(this._formRef.current)?"n":"p"},data:{input:a,applications:(r=this._formRef.current,Array.from(r.querySelectorAll(te("appl")),(e=>e.value)))}}),(0,A.t)(),re(this._formRef.current)?(this._handleReset(),this.setState({submittedJob:n})):this.props.goToCustomLocation({description:{main:{key:"result"},result:{type:"InterProScan"}}})}}},this._handleFile=e=>{var t=new FileReader;t.onload=()=>{this._handleReset(t.result),this.setState({title:e.name})},t.readAsText(e)},this._loadExample=()=>this._handleReset(">sp|P04637|P53_HUMAN Cellular tumor antigen p53 OS=Homo sapiens OX=9606 GN=TP53 PE=1 SV=4\nMEEPQSDPSV EPPLSQETFS DLWKLLPENN VLSPLPSQAM DDLMLSPDDI EQWFTEDPGP\nDEAPRMPEAA PPVAPAPAAP TPAAPAPAPS WPLSSSVPSQ KTYQGSYGFR LGFLHSGTAK\nSVTCTYSPAL NKMFCQLAKT CPVQLWVDST PPPGTRVRAM AIYKQSQHMT EVVRRCPHHE\nRCSDSDGLAP PQHLIRVEGN LRVEYLDDRN TFRHSVVVPY EPPEVGSDCT TIHYNYMCNS\nSCMGGMNRRP ILTIITLEDS SGNLLGRNSF EVRVCACPGR DRRTEEENLR KKGEPHHELP\nPGSTKRALPN NTSSSPQPKK KPLDGEYFTL QIRGRERFEM FRELNEALEL KDAQAGKEPG\nGSRAHSSHLK SKKGQSTSRH KKLMFKTEGP DSD"),this._cleanUp=()=>{var e;return null===(e=this._editorRef.current)||void 0===e?void 0:e.cleanUp()},this._handleDroppedFiles=(0,N.Z)((e=>{var t,{dataTransfer:a}=e,r=null===(t=null==a?void 0:a.files)||void 0===t?void 0:t[0];r&&this._handleFile(r)})),this._handleDragging=(0,N.Z)((()=>this.setState({dragging:!0}))),this._handleUndragging=(0,N.Z)((()=>this.setState({dragging:!1}))),this._handleFileChange=e=>{var t,{target:a}=e,r=null===(t=a.files)||void 0===t?void 0:t[0];r&&(this._handleFile(r),a.value="")};var t=void 0;e.search&&(t=e.search),this.state={title:void 0,initialAdvancedOptions:t,submittedJob:null,sequenceIssues:[],dragging:!1},this._formRef=r.createRef(),this._editorRef=r.createRef(),this.props.value&&(this.sequenceToSet=this.props.value)}componentDidUpdate(){this.sequenceToSet&&this._editorRef.current&&(this._handleReset(this.sequenceToSet),this.sequenceToSet=null)}render(){var e;if(this.props.value)return r.createElement(k.Z,{to:{description:{main:{key:"search"},search:{type:"sequence"}}}});var{dragging:t}=this.state,a=0===this.state.sequenceIssues.length,n=!!this._editorRef.current&&(null===(e=this._editorRef.current)||void 0===e?void 0:e.hasText());return r.createElement("section",{className:$("vf-stack","vf-stack--400")},r.createElement("form",{onSubmit:this._handleSubmit,onDrop:this._handleDroppedFiles,onDrag:this._handleDragging,onDragStart:this._handleDragging,onDragEnd:this._handleUndragging,onDragOver:this._handleDragging,onDragEnter:this._handleDragging,onDragExit:this._handleUndragging,onDragLeave:this._handleUndragging,className:$("search-form",{dragging:t}),ref:this._formRef},r.createElement("div",null,r.createElement("div",{className:$("simple-box","ipscan-block")},r.createElement("header",null,"Scan your sequences"),r.createElement(ee,{data:{name:"Search By Sequence",description:"Search for InterPro matches in your sequences"},processData:O.o7}),r.createElement("div",{className:$("vf-stack","vf-stack--200")},"search"===this.props.main&&this.state.submittedJob&&r.createElement(R.Z,{type:"info"},"Your search job(",r.createElement("span",{className:$("mono")},this.state.submittedJob),") has been submitted. You can check its state in the"," ",r.createElement(x.Z,{to:{description:{main:{key:"result"},result:{type:"InterProScan"}}}},"Results page")),"search"===this.props.main&&r.createElement("div",{className:$("description")},r.createElement(i.ql,null,r.createElement("title",null,"InterProScan")),r.createElement("p",null,"This form enables you to submit sequences to the InterProScan web service for scanning against the InterPro protein signature databases.",r.createElement("br",null),"Please note that you can submit up to"," ",X," sequences at a time. Alternatively, you can"," ",r.createElement(x.Z,{to:{description:{other:["about","interproscan"]}}},"download InterProScan")," ","to scan your sequences locally.")),r.createElement(Y,{value:this.props.value,ref:this._editorRef,onChecksChange:e=>{this.setState({sequenceIssues:e})}})),r.createElement("div",null,r.createElement("label",{className:$("vf-button","vf-button--secondary","vf-button--sm","user-select-none")},r.createElement("span",{className:$("icon","icon-common","icon-folder-open")}),"Choose file",r.createElement("input",{type:"file",onChange:this._handleFileChange,hidden:!0})),r.createElement(h.Z,{type:"secondary",className:$("user-select-none"),onClick:this._loadExample},"Example protein sequence"),r.createElement(h.Z,{className:$({hidden:a||!n}),onClick:this._cleanUp,borderColor:"var(--colors-alert-main)",backgroundColor:"var(--colors-alert-main)"},"Automatic clean up")),r.createElement(C,{title:this.state.title,changeTitle:this.changeTitle,initialOptions:this.state.initialAdvancedOptions}),r.createElement("footer",null,r.createElement("div",null,r.createElement(h.Z,{submit:!0,className:$({disabled:!a||!n}),disabled:!a||!n,value:"Search"},"Search"),r.createElement(h.Z,{type:"secondary",onClick:this._handleReset},"Clear")),r.createElement("div",{className:$("search-adv")},r.createElement("span",null,"Powered by InterProScan"))))),r.createElement("div",{className:$("dragging-overlay")},"Drop your file here")))}}var se=(0,s.P1)((e=>e.settings.ipScan),(e=>e.customLocation.description),(e=>e.customLocation.search),((e,t,a)=>({ipScan:e,value:t.search.value,main:t.main.key,search:a})));const ie=(0,n.$j)(se,{createJob:o.Cq,goToCustomLocation:o.xb})(ne)},76820:(e,t,a)=>{a.d(t,{Z:()=>o}),a(752),a(76265),a(60429);var r=a(67294),n=a(76371),s=a(82806),i=(0,n.Z)(s.Z,{"new-switch":"ToggleSwitch_style__new-switch___f6","switch-input":"ToggleSwitch_style__switch-input___b8","switch-paddle":"ToggleSwitch_style__switch-paddle___c6","switch-active":"ToggleSwitch_style__switch-active___d8","switch-inactive":"ToggleSwitch_style__switch-inactive___d2",tiny:"ToggleSwitch_style__tiny___a1",small:"ToggleSwitch_style__small___d3",large:"ToggleSwitch_style__large___e1",disabled:"ToggleSwitch_style__disabled___fa","accession-selector":"ToggleSwitch_style__accession-selector___cc"});const o=e=>{var{name:t="switch",id:a,size:n="large",switchCond:s,disabled:o=!1,label:l,SRLabel:c,onValue:d="On",offValue:h="Off",handleChange:u,addAccessionStyle:p=!1,width:m}=e,[_,g]=(0,r.useState)(s);(0,r.useEffect)((()=>{g(s)}),[s]);var v=m?{width:m}:{};return r.createElement("div",{className:i("new-switch",n)},r.createElement("label",{htmlFor:a},r.createElement("input",{type:"checkbox",checked:_,className:i("switch-input"),name:t,id:a,onChange:e=>{u?u(e):g(!_)},disabled:o}),l,r.createElement("label",{className:i("switch-paddle",p?"accession-selector":"",o?"disabled":""),style:Object.assign({},v),htmlFor:a},c?r.createElement("span",{className:i("show-for-sr")},c,":"):null,r.createElement("span",{className:i("switch-active"),"aria-hidden":"true"},d),r.createElement("span",{className:i("switch-inactive"),"aria-hidden":"true"},h))))}},24644:(e,t,a)=>{a.d(t,{e:()=>r}),a(76801);var r=function(e,t,a){void 0===a&&(a=!1);var r=[];return a?["taxonomy","proteome","set"].includes(t)&&(r.push("protein"),r.push("entry")):["entry","taxonomy","set"].includes(e)&&["taxonomy","proteome"].includes(t)&&r.push("protein"),r.length?"counters:"+r.join("-"):""}},94028:(e,t,a)=>{a.d(t,{Z:()=>s});var r=a(76853),n=a(9033);const s=e=>{var t,a={getUrl:n.F6,fetchOptions:{},propNamespace:"",weight:1,mapStateToProps:r.Z,mapDispatchToProps:{}};return e?"object"!=typeof e?(a.getUrl="string"==typeof e?n.Gr(e):e,a):(a.getUrl=(void 0===(t=e.getUrl)&&(t=n.F6),"string"==typeof t?n.Gr(t):t),a.fetchOptions=e.fetchOptions||a.fetchOptions,a.propNamespace=e.propNamespace||a.propNamespace,a.weight=e.weight||a.weight,a.mapStateToProps=e.mapStateToProps||a.mapStateToProps,a.mapDispatchToProps=e.mapDispatchToProps||a.mapDispatchToProps,a):a}},72004:(e,t,a)=>{a.d(t,{Z:()=>n});var r=a(5350);const n=function(e){var{method:t,responseType:a}=void 0===e?{}:e;return"text"===a?r.OJ:"yaml"===a?r.JA:"gzip"===a?r.x2:"HEAD"!==t?r.r_:r.ZP}},34287:(e,t,a)=>{a.d(t,{Z:()=>_}),a(73964),a(60429),a(752),a(51090),a(76265);var r=a(67294),n=a(45007),s=a(19119),i=a(74482),o=a(66467),l=a(87616),c=a(94028),d=a(72004),h=a(27262),u=function(e,t,a,r,n){if("m"===r)throw new TypeError("Private method is not writable");if("a"===r&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!n:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===r?n.call(e,a):n?n.value=a:t.set(e,a),a},p=function(e,t,a,r){if("a"===a&&!r)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!r:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===a?r:"a"===a?r.call(e):r?r.value:t.get(e)},m=(0,s.P1)((e=>e),(e=>({appState:e})));const _=e=>{var{getUrl:t,fetchOptions:a,propNamespace:s,weight:_,mapStateToProps:g,mapDispatchToProps:v}=(0,c.Z)(e),f=(0,d.Z)(a),y=e=>({loading:!!e,progress:0,ok:!0,status:null,payload:null,url:e});return e=>{var c,d;class S extends r.PureComponent{constructor(e){super(e),c.set(this,void 0),d.set(this,void 0),this.timeoutID=0,this._cancel=()=>{var e,t;p(this,d,"f")&&p(this,d,"f").cancel(),null===(t=(e=this.props).dataProgressUnload)||void 0===t||t.call(e,p(this,c,"f"))},this._progress=e=>{var t,a;this.setState((t=>{var{data:a}=t;return{data:Object.assign(Object.assign({},a),{progress:e})}})),null===(a=(t=this.props).dataProgressInfo)||void 0===a||a.call(t,p(this,c,"f"),e,_)},this._load=e=>{return t=this,r=void 0,s=function*(){var t,r,n,s,i,l,h;if(e){null===(r=(t=this.props).dataProgressInfo)||void 0===r||r.call(t,p(this,c,"f"),0,_),u(this,d,(0,o.Z)((t=>f(e,Object.assign(Object.assign({},a),{signal:t}),this._progress,this.props.addToast))),"f");var m=p(this,d,"f");try{var g=yield m.promise;gtag("event","data",{event_category:"data",event_response:g.status,event_label:e,event_clientcache:g.headers.has("Client-Cache")?1:0,event_cache:g.headers.has("Cached")?1:0}),this.setState((e=>{var{data:t}=e,a=Object.assign(Object.assign(Object.assign({},t),g),{progress:1,loading:!1});return{data:a,staleData:a}})),null===(s=(n=this.props).dataProgressInfo)||void 0===s||s.call(n,p(this,c,"f"),1,_);var v=1e3*((null===(i=this.props.appState)||void 0===i?void 0:i.settings.navigation.secondsToRetry)||0);408===g.status&&(this.timeoutID=window.setTimeout((()=>{console.log("Retrying the Timed out query"),this.setState({retries:this.state.retries+1})}),v))}catch(t){m.canceled||(gtag("event","error",{event_category:"data",event_status:"fail",event_label:e,event_online:window.navigator.onLine?1:0}),this.setState((e=>{var{data:a}=e;return{data:Object.assign(Object.assign({},a),{loading:!1,progress:1,ok:!1,error:t})}})),null===(h=(l=this.props).dataProgressInfo)||void 0===h||h.call(l,p(this,c,"f"),1,_))}}else this.setState({staleData:Object.assign({},this.state.data)})},new((n=void 0)||(n=Promise))((function(e,a){function i(e){try{l(s.next(e))}catch(e){a(e)}}function o(e){try{l(s.throw(e))}catch(e){a(e)}}function l(t){var a;t.done?e(t.value):(a=t.value,a instanceof n?a:new n((function(e){e(a)}))).then(i,o)}l((s=s.apply(t,r||[])).next())}));var t,r,n,s},u(this,c,(0,i.Z)("data-loader"),"f");var r=(null==t?void 0:t(e.appState||{},e))||"";this.state={url:r,data:y(r),staleData:void 0,retries:0}}static getDerivedStateFromProps(e,a){var r=(null==t?void 0:t(e.appState||{},e))||"";return a.url===r?null:{data:y(r),url:r}}componentDidMount(){this._load(this.state.url)}componentDidUpdate(e,t){t.url===this.state.url&&t.retries===this.state.retries||(this._cancel(),this._load(this.state.url))}componentWillUnmount(){this._cancel(),this.timeoutID&&window.clearTimeout(this.timeoutID)}render(){var t=this.props,{dataProgressInfo:a,dataProgressUnload:n,addToast:i,appState:o}=t,l=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)t.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]])}return a}(t,["dataProgressInfo","dataProgressUnload","addToast","appState"]),c="isStale"+s,d={["data"+s]:this.state.staleData||this.state.data,[c]:this.state.staleData!==this.state.data};return this.state.data&&!this.state.data.loading&&this.state.data.url===this.state.url&&(d["isStale"+s]=!1),r.createElement(h.m,{customLocation:null==o?void 0:o.customLocation},r.createElement(e,Object.assign({},l,d,(null==g?void 0:g(o,Object.assign(Object.assign({},l),d)))||{})))}}c=new WeakMap,d=new WeakMap,S.displayName="loadData("+(e.displayName||e.name)+")";var b=Object.assign({dataProgressInfo:l.fF,dataProgressUnload:l.ks,addToast:l.fz},v);return(0,n.$j)(m,b)(S)}}},66467:(e,t,a)=>{a.d(t,{Z:()=>r}),a(73964);const r=function(e){void 0===e&&(e=Promise.resolve());var t=e,a=new AbortController;"then"in e||(t=e(a.signal));var r={promise:t.then((e=>{if(r.canceled)throw{canceled:r.canceled};return e})),canceled:!1,cancel(){r.canceled=!0,a.abort()}};return r}},46997:(e,t,a)=>{a.d(t,{Z:()=>r});const r={editor:"Search_style__editor___bf","line-with-buttons":"Search_style__line-with-buttons___aa","file-input-label":"Search_style__file-input-label___e3","search-form":"Search_style__search-form___e7",dragging:"Search_style__dragging___e6","dragging-overlay":"Search_style__dragging-overlay___f1","ipscan-block":"Search_style__ipscan-block___a7",description:"Search_style__description___b5",sequence:"Search_style__sequence___db",mono:"Search_style__mono___f7","invalid-block":"Search_style__invalid-block___d9","valid-block":"Search_style__valid-block___af",comment:"Search_style__comment___f6","fasta-header":"Search_style__fasta-header___f7","invalid-comment":"Search_style__invalid-comment___f6","invalid-letter":"Search_style__invalid-letter___fa","search-input":"Search_style__search-input___be","search-adv":"Search_style__search-adv___be","user-select-none":"Search_style__user-select-none___ee"}},36237:(e,t,a)=>{a.d(t,{Z:()=>r});const r={"tabs-panel-content":"Search_style__tabs-panel-content___ee","search-form":"Search_style__search-form___dd","help-col":"Search_style__help-col___e9",removed:"Search_style__removed___d3",hollow:"Search_style__hollow___f0","simple-box":"Search_style__simple-box___a1"}},98622:(e,t,a)=>{a.d(t,{Z:()=>r});const r={card:"styles_blocks__card___ad",grid:"styles_blocks__grid___b2","simple-box":"styles_blocks__simple-box___c3"}}}]);
//# sourceMappingURL=7714.module.ipscan-search.77b.js.map