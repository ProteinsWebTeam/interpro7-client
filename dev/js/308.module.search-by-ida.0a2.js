"use strict";(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[308],{5209:(e,t,a)=>{a.r(t),a.d(t,{SearchByIDA:()=>L,default:()=>R}),a(752),a(73964),a(76265),a(60429),a(64043),a(61514),a(28436);var r=a(67294),n=a(45007),s=a(87616),l=a(19119),i=a(21105),c=a(63294),o=a(76371);const _={"ida-workspace":"SearchByIDA_style__ida-workspace___b9",panels:"SearchByIDA_style__panels___da","ida-panel":"SearchByIDA_style__ida-panel___ce","ida-ignore":"SearchByIDA_style__ida-ignore___f5",options:"SearchByIDA_style__options___cb",switch:"SearchByIDA_style__switch___d6",disabled:"SearchByIDA_style__disabled___e0","ida-controls":"SearchByIDA_style__ida-controls___de","ida-button":"SearchByIDA_style__ida-button___fc","ida-list":"SearchByIDA_style__ida-list___f4",ordered:"SearchByIDA_style__ordered___df","ida-entry":"SearchByIDA_style__ida-entry___fe",close:"SearchByIDA_style__close___b4",drag:"SearchByIDA_style__drag___f8","react-select-container":"SearchByIDA_style__react-select-container___fd","react-select-labels":"SearchByIDA_style__react-select-labels___db","react-select-label-header":"SearchByIDA_style__react-select-label-header___c9","react-select-label-body":"SearchByIDA_style__react-select-label-body___e1","entry-name":"SearchByIDA_style__entry-name___bc",ignore:"SearchByIDA_style__ignore___bb","switch-paddle":"SearchByIDA_style__switch-paddle___cf","switch-active":"SearchByIDA_style__switch-active___b8","ida-search":"SearchByIDA_style__ida-search___cd"};var d=(0,o.Z)(_),h=30,m=18,g=7;const u=e=>{var{label:t,fill:a="#aaa",stroke:n="#333",width:s=h,height:l=m,lineW:i=g}=e,c=l/2;return r.createElement("svg",{className:d("ida-button"),width:s+2*i+2*c,height:l+2},r.createElement("line",{stroke:n,strokeWidth:3,x1:0,y1:c,x2:s+2*i+2*c,y2:c}),r.createElement("path",{className:"feature",d:"M"+c+",0h"+s+",0a"+c+","+c+" 0 0 1 "+c+","+c+"v2a"+c+","+c+" 0 0 1 -"+c+","+c+"h-"+s+"a"+c+","+c+" 0 0 1 -"+c+",-"+c+"v-2a"+c+","+c+" 0 0 1 "+c+",-"+c+"Z",fill:a,stroke:n,transform:"translate("+i+", 0)"}),r.createElement("text",{x:i+c+s/2,y:l-2,textAnchor:"middle"},t))};var y=a(98291),p=a(72004),v=a(8575),b=a(10838),f=a(16772),E=a(82806),S=a(85724),w=(0,o.Z)(E.Z,_),k=(0,p.Z)({method:"GET",responseType:"JSON"}),D=(e,t,a)=>{var{protocol:r,hostname:n,port:s,root:l}=e,i={main:{key:"entry"},entry:{db:t}};return(0,v.format)({protocol:r,hostname:n,port:s,pathname:l+(0,b.Z)(i),query:{search:a}})};class A extends r.PureComponent{constructor(e){super(e),this.state={draggable:!1,loadingPfamOptions:!1,loadingInterProOptions:!1},this._handleOnChange=e=>{var t=(null==e?void 0:e.value)||e;t&&this.props.changeEntryHandler(t)},this._handleOnInputChange=e=>{var t=(null==e?void 0:e.value)||e;t&&this.debouncedFetchOptions(t)},this.fetchOptions=e=>{this.setState({loadingPfamOptions:!0,loadingInterProOptions:!0}),k(D(this.props.api,"interpro",e)).then((e=>{this.props.mergeResults(e),this.setState({loadingInterProOptions:!1})})),k(D(this.props.api,"pfam",e)).then((e=>{this.props.mergeResults(e),this.setState({loadingPfamOptions:!1})}))},this._getDeltaFromDragging=e=>{var t=Math.floor((e.pageX-(this.startPos||0))/this.currentWidth);return t<=0&&t++,t},this._handleStartDragging=e=>{var t,a;this.currentWidth=(null===(a=null===(t=this.container)||void 0===t?void 0:t.current)||void 0===a?void 0:a.offsetWidth)||1,this.startPos=e.pageX},this._handleDragging=e=>{var t,a;null===(a=(t=this.props).handleMoveMarker)||void 0===a||a.call(t,this._getDeltaFromDragging(e))},this._handleEndDragging=e=>{var t,a,r,n,s=this._getDeltaFromDragging(e);null===(a=(t=this.props).handleMoveMarker)||void 0===a||a.call(t,null),s>0&&s--,0!==s&&(null===(n=(r=this.props).handleMoveEntry)||void 0===n||n.call(r,s)),this.currentWidth=1,this.startPos=0},this.container=r.createRef(),this.startPos=0,this.currentWidth=1,this.debouncedFetchOptions=(0,S.Z)(this.fetchOptions,300)}componentDidMount(){this.props.entry&&this._handleOnChange(this.props.entry)}render(){var e,{entry:t,removeEntryHandler:a,draggable:n=!1,options:s={}}=this.props,l=s[this.props.entry]?{background:(0,f.mt)({accession:this.props.entry,source_database:""},f.tK.ACCESSION)}:{};return r.createElement("div",{className:w("ida-entry"),draggable:this.state.draggable,onDragStart:this._handleStartDragging,onDragEnd:this._handleEndDragging,onDragCapture:this._handleDragging,ref:this.container,style:l},r.createElement(y.ZP,{options:Object.values(s).map((e=>{var{accession:t,name:a}=e;return{value:t,label:a}})),isLoading:this.state.loadingInterProOptions||this.state.loadingPfamOptions,onInputChange:this._handleOnInputChange,onChange:this._handleOnChange,className:w("react-select-container"),value:{value:t,label:null===(e=null==s?void 0:s[t])||void 0===e?void 0:e.name},styles:{menuList:e=>Object.assign(Object.assign({},e),{background:"white"}),menu:e=>Object.assign(Object.assign({},e),{top:void 0,width:"var(--entry-width)",marginTop:0}),control:e=>Object.assign(Object.assign({},e),{background:"transparent",border:0,boxShadow:void 0}),input:e=>Object.assign(Object.assign({},e),{color:"white"})},formatOptionLabel:(e,t)=>{var{value:a,label:n}=e,{context:s}=t;return r.createElement("div",{style:{color:"menu"===s?"black":"white",cursor:"menu"===s?"pointer":"text"},className:w("react-select-labels"),key:a},r.createElement("div",{className:w("react-select-label-header")},a),n&&r.createElement("div",{className:w("react-select-label-body")},n))}}),n&&r.createElement("button",{className:w("drag",{nodata:!s[t]}),onMouseEnter:()=>this.setState({draggable:!0}),onMouseLeave:()=>this.setState({draggable:!1})},r.createElement("i",{className:w("icon","icon-common","icon-ellipsis-v")})),r.createElement("button",{className:w("close"),onClick:a},"✖"))}}var I=(0,l.P1)((e=>e.settings.api),(e=>({api:e})));const O=(0,n.$j)(I)(A);var N=(0,o.Z)(_);const B=e=>{var{entryList:t,ignoreList:a,isOrdered:n,removeEntryHandler:s,changeEntryHandler:l,changeIgnoreHandler:i,removeIgnoreHandler:c,mergeResults:o,options:_,markerBeforeEntry:d=null,markerAfterEntry:h=null,handleMoveMarker:m,handleMoveEntry:g}=e;return r.createElement("div",{className:N("panels")},r.createElement("div",{className:N("ida-panel")},r.createElement("header",null,"Architectures must include"),r.createElement("div",null,r.createElement("ul",{className:N("ida-list",{ordered:n})},t&&t.map(((e,t)=>r.createElement(r.Fragment,{key:t},d===e&&r.createElement("div",null,"|"),r.createElement("li",null,r.createElement(O,{entry:e,draggable:n,handleMoveMarker:m(t),handleMoveEntry:g(t),removeEntryHandler:()=>s(t),changeEntryHandler:e=>l(t,e),mergeResults:o,options:_})),h===e&&r.createElement("div",null,"|"))))))),r.createElement("div",{className:N("ida-ignore")},r.createElement("header",null,"Architectures must ",r.createElement("u",null,"not")," include"),r.createElement("ul",{className:N("ida-list","ignore")},a&&a.map(((e,t)=>r.createElement("li",{key:t},r.createElement(O,{entry:e,removeEntryHandler:()=>c(t),changeEntryHandler:e=>i(t,e),mergeResults:o,options:_})))))))};var M=a(76820),x=a(3817),C=a(98622),Z=a(36237),P=a(46997),j=(0,o.Z)(_,C.Z,P.Z,Z.Z),T=(0,i.Z)({loader:()=>a.e(1169).then(a.bind(a,25392)),loading:()=>null});class L extends r.PureComponent{constructor(){super(...arguments),this.state={markerBeforeEntry:null,markerAfterEntry:null,options:{}},this._handleSubmit=e=>{var{entries:t,order:a,exact:r=!1,ignore:n}=e,s={ida_search:t.join(",")};a&&(s.ordered=!0,r&&(s.exact=!0)),n&&n.length&&(s.ida_ignore=n.join(",")),this.props.goToCustomLocation(Object.assign(Object.assign({},this.props.customLocation),{description:{main:{key:"search"},search:{type:"ida"}},search:s}))},this._handleMoveMarker=e=>t=>a=>{if(null!==a){var r=Math.max(0,Math.min(e.length,t+a));r===e.length?this.setState({markerBeforeEntry:null,markerAfterEntry:e[r-1]}):this.setState({markerBeforeEntry:e[r],markerAfterEntry:null})}else this.setState({markerBeforeEntry:null,markerAfterEntry:null})},this._handleMoveEntry=(e,t)=>a=>r=>{var n=Math.max(0,Math.min(e.length-1,a+r)),s=[...e];s.splice(a,1),s.splice(n,0,e[a]),this._handleSubmit({entries:s,order:!0,ignore:t})},this._mergeResults=e=>{var t;if(e&&e.ok){var a=Object.assign({},this.state.options);for(var r of(null===(t=e.payload)||void 0===t?void 0:t.results)||[])("interpro"===r.metadata.source_database&&"domain"===r.metadata.type||"pfam"===r.metadata.source_database)&&(a[r.metadata.accession]=r.metadata);this.setState({options:a})}}}render(){var{ida_search:e,ordered:t,exact:a,ida_ignore:n}=this.props.customLocation.search,s=e?e.split(","):[];void 0!==e&&""===e.trim()&&s.push("");var l=!!t,i=!!a,o=n?n.split(","):[];return void 0!==n&&""===n.trim()&&o.push(""),r.createElement("section",{className:j("vf-stack","vf-stack--400")},r.createElement("div",{className:j("simple-box")},r.createElement("header",null,"Search for proteins containing specific domains"),r.createElement(T,{data:{name:"Search By Domain Architecture IDA",description:"Search proteins which match a domain architecture"},processData:c.o7}),r.createElement("div",{className:j("vf-stack","vf-stack--400")},r.createElement("div",{className:j("search-input")},r.createElement("div",{className:j("description")},r.createElement("p",null,"Domain architectures are derived from matches to Pfam models. You can select domains to either be included or excluded from your search results. The results will include all proteins which match the domain architecture selected below. Domains can be selected using either a Pfam accession, or an InterPro accession, where that InterPro entry includes a Pfam model.")),r.createElement("div",{className:j("ida-workspace")},r.createElement(B,{entryList:s,ignoreList:o,isOrdered:l,markerBeforeEntry:this.state.markerBeforeEntry,markerAfterEntry:this.state.markerAfterEntry,handleMoveMarker:this._handleMoveMarker(s),handleMoveEntry:this._handleMoveEntry(s,o),mergeResults:this._mergeResults,options:this.state.options,removeEntryHandler:e=>this._handleSubmit({entries:s.slice(0,e).concat(s.slice(e+1)),order:l,ignore:o}),removeIgnoreHandler:e=>this._handleSubmit({ignore:o.slice(0,e).concat(o.slice(e+1)),entries:s,order:l}),changeEntryHandler:(e,t)=>{var a=[...s];a[e]=t,this._handleSubmit({entries:a,ignore:o,order:l})},changeIgnoreHandler:(e,t)=>{var a=[...o];a[e]=t,this._handleSubmit({ignore:a,entries:s,order:l})}})),r.createElement("div",{className:j("ida-controls")},r.createElement(x.Z,{className:j("ida-button"),onClick:()=>this._handleSubmit({entries:s.concat(""),ignore:o,order:l})},r.createElement(u,{label:"➕",fill:"#75bf40",stroke:"#75bf40"})," ",r.createElement("span",null,"Add Domain to include")),r.createElement(x.Z,{className:j("ida-button"),onClick:()=>this._handleSubmit({ignore:o.concat(""),entries:s,order:l})},r.createElement(u,{label:"✖️️",fill:"#bf4540",stroke:"#bf4540"})," ",r.createElement("span",null,"Add Domain to exclude")),r.createElement("div",{className:j("options")},r.createElement(M.Z,{switchCond:l,name:"order",id:"ordered",size:"tiny",label:"Order of domain matters: ",onValue:"Yes",offValue:"No",handleChange:e=>this._handleSubmit({order:(null==e?void 0:e.target).checked,entries:s,ignore:o})}),r.createElement(M.Z,{switchCond:i,name:"exact",id:"exact",disabled:!t,size:"tiny",label:"Exact match:",onValue:"Yes",offValue:"No",handleChange:e=>this._handleSubmit({exact:(null==e?void 0:e.target).checked,order:!0,entries:s,ignore:o})})))))))}}var H=(0,l.P1)((e=>e.customLocation),(e=>({customLocation:e})));const R=(0,n.$j)(H,{goToCustomLocation:s.xb})(L)},76820:(e,t,a)=>{a.d(t,{Z:()=>i}),a(752),a(76265),a(60429);var r=a(67294),n=a(76371),s=a(82806),l=(0,n.Z)(s.Z,{"new-switch":"ToggleSwitch_style__new-switch___f6","switch-input":"ToggleSwitch_style__switch-input___b8","switch-paddle":"ToggleSwitch_style__switch-paddle___c6","switch-active":"ToggleSwitch_style__switch-active___d8","switch-inactive":"ToggleSwitch_style__switch-inactive___d2",tiny:"ToggleSwitch_style__tiny___a1",small:"ToggleSwitch_style__small___d3",large:"ToggleSwitch_style__large___e1",disabled:"ToggleSwitch_style__disabled___fa","accession-selector":"ToggleSwitch_style__accession-selector___cc"});const i=e=>{var{name:t="switch",id:a,size:n="large",switchCond:s,disabled:i=!1,label:c,SRLabel:o,onValue:_="On",offValue:d="Off",handleChange:h,addAccessionStyle:m=!1,width:g}=e,[u,y]=(0,r.useState)(s);(0,r.useEffect)((()=>{y(s)}),[s]);var p=g?{width:g}:{};return r.createElement("div",{className:l("new-switch",n)},r.createElement("label",{htmlFor:a},r.createElement("input",{type:"checkbox",checked:u,className:l("switch-input"),name:t,id:a,onChange:e=>{h?h(e):y(!u)},disabled:i}),c,r.createElement("label",{className:l("switch-paddle",m?"accession-selector":"",i?"disabled":""),style:Object.assign({},p),htmlFor:a},o?r.createElement("span",{className:l("show-for-sr")},o,":"):null,r.createElement("span",{className:l("switch-active"),"aria-hidden":"true"},_),r.createElement("span",{className:l("switch-inactive"),"aria-hidden":"true"},d))))}},46997:(e,t,a)=>{a.d(t,{Z:()=>r});const r={editor:"Search_style__editor___bf","line-with-buttons":"Search_style__line-with-buttons___aa","file-input-label":"Search_style__file-input-label___e3","search-form":"Search_style__search-form___e7",dragging:"Search_style__dragging___e6","dragging-overlay":"Search_style__dragging-overlay___f1","ipscan-block":"Search_style__ipscan-block___a7",description:"Search_style__description___b5",sequence:"Search_style__sequence___db",mono:"Search_style__mono___f7","invalid-block":"Search_style__invalid-block___d9","valid-block":"Search_style__valid-block___af",comment:"Search_style__comment___f6","fasta-header":"Search_style__fasta-header___f7","invalid-comment":"Search_style__invalid-comment___f6","invalid-letter":"Search_style__invalid-letter___fa","search-input":"Search_style__search-input___be","search-adv":"Search_style__search-adv___be","user-select-none":"Search_style__user-select-none___ee"}},36237:(e,t,a)=>{a.d(t,{Z:()=>r});const r={"tabs-panel-content":"Search_style__tabs-panel-content___ee","search-form":"Search_style__search-form___dd","help-col":"Search_style__help-col___e9",removed:"Search_style__removed___d3",hollow:"Search_style__hollow___f0","simple-box":"Search_style__simple-box___a1"}}}]);
//# sourceMappingURL=308.module.search-by-ida.0a2.js.map