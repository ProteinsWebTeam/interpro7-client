"use strict";(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[1169],{25392:(e,t,n)=>{n.r(t),n.d(t,{Manager:()=>g,default:()=>b}),n(752),n(76265),n(73964);var r=n(67294),o=n(45697),s=n.n(o),a=n(75490);function i(e,t,n,r,o,s,a){try{var i=e[s](a),d=i.value}catch(e){return void n(e)}i.done?t(d):Promise.resolve(d).then(r,o)}function d(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var s=e.apply(t,n);function a(e){i(s,r,o,a,d,"next",e)}function d(e){i(s,r,o,a,d,"throw",e)}a(void 0)}))}}var c={"@context":"http://schema.org","@type":"WebSite",mainEntityOfPage:"@mainEntity"},u=function(){var e=d((function*(e,t){var n=e;return e.timeRemaining()||(t&&console.log("⌛ No more time remaining! Re-schedule work for later"),n=yield(0,a.Os)(250)),n}));return function(t,n){return e.apply(this,arguments)}}(),l=function(){var e=d((function*(e,t,n,r){void 0===n&&(n=c),yield u(t,r);var o={};for(var[s,a]of Object.entries(n))if(a&&"@"===a[0]){var i=Array.from(e.get(a)||[]);i.length&&(1===i.length?o[s]=yield l(e,t,i[0]):o[s]=yield Promise.all(i.map((n=>l(e,t,n)))))}else null!==a&&(o[s]=a);return o}));return function(t,n,r,o){return e.apply(this,arguments)}}();const p=l;var h,v=["@id"];function _(e,t,n,r,o,s,a){try{var i=e[s](a),d=i.value}catch(e){return void n(e)}i.done?t(d):Promise.resolve(d).then(r,o)}function f(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var s=e.apply(t,n);function a(e){_(s,r,o,a,i,"next",e)}function i(e){_(s,r,o,a,i,"throw",e)}a(void 0)}))}}var m=1e3;class g{constructor(e){var{maxDelay:t=m,dev:n,root:r}=void 0===e?{}:e;document&&(this._node=document.createElement("script"),this._node.type="application/ld+json",this._maxDelay=t,this._dev=n,this._rootData=r,this._subscriptions=new Map,this._dataMap=new Map,this._plannedRender=!1,document.head&&(this._planRender(),h=this))}disconnect(){this.parentNode.removeChild(this._node),this._node=null}_render(e){if(this._node){var t=JSON.stringify(e,null,2);return this._node.textContent=t,!this._node.parentNode&&document.head&&document.head.appendChild(this._node),t}}_planRender(){var e=this;return f((function*(){if(!e._plannedRender){e._plannedRender=!0;var t=yield(0,a.Os)(e._maxDelay);if(e._dev&&console.groupCollapsed("Schema.org rendering"),e._dev&&console.time("schema.org rendering took"),e._dev&&console.groupCollapsed("data maps"),e._dev)for(var[n,r]of(console.group("@@root"),console.log(e._rootData),console.groupEnd(),e._dataMap)){for(var o of(console.group(n),r))console.log(o);console.groupEnd()}e._dev&&console.groupEnd(),e._dev&&console.time("Schema.org merger");var s=yield p(e._dataMap,t,e._rootData,e._dev);e._dev&&console.timeEnd("Schema.org merger"),e._plannedRender=!1,e._dev&&console.time("Schema.org stringify to DOM");var i=e._render(s);e._dev&&console.timeEnd("Schema.org stringify to DOM"),e._dev&&console.group("Stringified schema"),e._dev&&console.log(i),e._dev&&console.groupEnd(),e._dev&&console.groupEnd(),e._dev&&console.timeEnd("schema.org rendering took")}}))()}_process(e){var t=this;return f((function*(){if(yield(0,a.Os)(t._maxDelay),t._subscriptions.has(e.subscriber)){var n=e.processData(e.data),{"@id":r}=n,o=function(e,t){if(null==e)return{};var n,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(n,v);if(!r)throw new Error('no "@id" found');var s=t._dataMap.get(r)||new Set;s.add(o),t._dataMap.set(r,s),t._subscriptions.set(e.subscriber,r),t._planRender()}}))()}subscribe(e){this._subscriptions.set(e.subscriber,!0),this._process(e)}unsubscribe(e){var t=this._subscriptions.get(e);this._subscriptions.delete(e),t&&(this._dataMap.delete(t),this._planRender())}}class b extends r.PureComponent{componentDidMount(){if(h){var{data:e,processData:t}=this.props;h.subscribe({subscriber:this,data:e,processData:t})}}componentDidUpdate(e){var t,n,{data:r}=e;r&&r.data&&this.props.data&&this.props.data.data&&(t=r.data,n=this.props.data.data,!Object.keys(t).every((e=>null!==t[e]&&"object"==typeof t[e]&&"object"==typeof n[e]?Object.keys(t[e]).every((r=>t[e][r]===n[e][r])):t[e]===n[e])))&&(h.unsubscribe(this),h.subscribe({subscriber:this,data:this.props.data,processData:this.props.processData}))}componentWillUnmount(){h&&h.unsubscribe(this)}render(){var{children:e}=this.props;return e||null}}b.propTypes={data:s().any,processData:s().func.isRequired,children:s().node},b.defaultProps={processData:e=>e}}}]);
//# sourceMappingURL=1169.module.schemaOrg.042.js.map