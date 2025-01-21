"use strict";(self.webpackChunkinterpro7_client=self.webpackChunkinterpro7_client||[]).push([[189],{89005:(n,e,t)=>{t.r(e),t.d(e,{default:()=>w}),t(73964);try{self["workbox:window:7.0.0"]&&_()}catch(r){}function r(n,e){return new Promise((function(t){var r=new MessageChannel;r.port1.onmessage=function(n){t(n.data)},n.postMessage(e,[r.port2])}))}function i(n,e){(null==e||e>n.length)&&(e=n.length);for(var t=0,r=new Array(e);t<e;t++)r[t]=n[t];return r}function o(n,e){var t;if("undefined"==typeof Symbol||null==n[Symbol.iterator]){if(Array.isArray(n)||(t=function(n,e){if(n){if("string"==typeof n)return i(n,e);var t=Object.prototype.toString.call(n).slice(8,-1);return"Object"===t&&n.constructor&&(t=n.constructor.name),"Map"===t||"Set"===t?Array.from(n):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?i(n,e):void 0}}(n))||e&&n&&"number"==typeof n.length){t&&(n=t);var r=0;return function(){return r>=n.length?{done:!0}:{done:!1,value:n[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(t=n[Symbol.iterator]()).next.bind(t)}try{self["workbox:core:7.0.0"]&&_()}catch(r){}var a=function(){var n=this;this.promise=new Promise((function(e,t){n.resolve=e,n.reject=t}))};function s(n,e){var t=location.href;return new URL(n,t).href===new URL(e,t).href}var c=function(n,e){this.type=n,Object.assign(this,e)};function u(n,e,t){return t?e?e(n):n:(n&&n.then||(n=Promise.resolve(n)),e?n.then(e):n)}function v(){}var f={type:"SKIP_WAITING"};function l(n,e){if(!e)return n&&n.then?n.then(v):Promise.resolve()}var d=function(n){var e,t;function i(e,t){var r,i;return void 0===t&&(t={}),(r=n.call(this)||this).nn={},r.tn=0,r.rn=new a,r.en=new a,r.on=new a,r.un=0,r.an=new Set,r.cn=function(){var n=r.fn,e=n.installing;r.tn>0||!s(e.scriptURL,r.sn.toString())||performance.now()>r.un+6e4?(r.vn=e,n.removeEventListener("updatefound",r.cn)):(r.hn=e,r.an.add(e),r.rn.resolve(e)),++r.tn,e.addEventListener("statechange",r.ln)},r.ln=function(n){var e=r.fn,t=n.target,i=t.state,o=t===r.vn,a={sw:t,isExternal:o,originalEvent:n};!o&&r.mn&&(a.isUpdate=!0),r.dispatchEvent(new c(i,a)),"installed"===i?r.wn=self.setTimeout((function(){"installed"===i&&e.waiting===t&&r.dispatchEvent(new c("waiting",a))}),200):"activating"===i&&(clearTimeout(r.wn),o||r.en.resolve(t))},r.dn=function(n){var e=r.hn,t=e!==navigator.serviceWorker.controller;r.dispatchEvent(new c("controlling",{isExternal:t,originalEvent:n,sw:e,isUpdate:r.mn})),t||r.on.resolve(e)},r.gn=(i=function(n){var e=n.data,t=n.ports,i=n.source;return u(r.getSW(),(function(){r.an.has(i)&&r.dispatchEvent(new c("message",{data:e,originalEvent:n,ports:t,sw:i}))}))},function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];try{return Promise.resolve(i.apply(this,n))}catch(n){return Promise.reject(n)}}),r.sn=e,r.nn=t,navigator.serviceWorker.addEventListener("message",r.gn),r}t=n,(e=i).prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t;var o,v=i.prototype;return v.register=function(n){var e=(void 0===n?{}:n).immediate,t=void 0!==e&&e;try{var r=this;return function(n,e){var t=n();return t&&t.then?t.then(e):e()}((function(){if(!t&&"complete"!==document.readyState)return l(new Promise((function(n){return window.addEventListener("load",n)})))}),(function(){return r.mn=Boolean(navigator.serviceWorker.controller),r.yn=r.pn(),u(r.bn(),(function(n){r.fn=n,r.yn&&(r.hn=r.yn,r.en.resolve(r.yn),r.on.resolve(r.yn),r.yn.addEventListener("statechange",r.ln,{once:!0}));var e=r.fn.waiting;return e&&s(e.scriptURL,r.sn.toString())&&(r.hn=e,Promise.resolve().then((function(){r.dispatchEvent(new c("waiting",{sw:e,wasWaitingBeforeRegister:!0}))})).then((function(){}))),r.hn&&(r.rn.resolve(r.hn),r.an.add(r.hn)),r.fn.addEventListener("updatefound",r.cn),navigator.serviceWorker.addEventListener("controllerchange",r.dn),r.fn}))}))}catch(n){return Promise.reject(n)}},v.update=function(){try{return this.fn?l(this.fn.update()):void 0}catch(n){return Promise.reject(n)}},v.getSW=function(){return void 0!==this.hn?Promise.resolve(this.hn):this.rn.promise},v.messageSW=function(n){try{return u(this.getSW(),(function(e){return r(e,n)}))}catch(n){return Promise.reject(n)}},v.messageSkipWaiting=function(){this.fn&&this.fn.waiting&&r(this.fn.waiting,f)},v.pn=function(){var n=navigator.serviceWorker.controller;return n&&s(n.scriptURL,this.sn.toString())?n:void 0},v.bn=function(){try{var n=this;return function(n,e){try{var t=n()}catch(n){return e(n)}return t&&t.then?t.then(void 0,e):t}((function(){return u(navigator.serviceWorker.register(n.sn,n.nn),(function(e){return n.un=performance.now(),e}))}),(function(n){throw n}))}catch(n){return Promise.reject(n)}},(o=[{key:"active",get:function(){return this.en.promise}},{key:"controlling",get:function(){return this.on.promise}}])&&function(n,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}(i.prototype,o),i}(function(){function n(){this.Pn=new Map}var e=n.prototype;return e.addEventListener=function(n,e){this.Sn(n).add(e)},e.removeEventListener=function(n,e){this.Sn(n).delete(e)},e.dispatchEvent=function(n){n.target=this;for(var e,t=o(this.Sn(n.type));!(e=t()).done;)(0,e.value)(n)},e.Sn=function(n){return this.Pn.has(n)||this.Pn.set(n,new Set),this.Pn.get(n)},n}()),h=t(75490),p=t(87616);function g(n,e,t,r,i,o,a){try{var s=n[o](a),c=s.value}catch(n){return void t(n)}s.done?e(c):Promise.resolve(c).then(r,i)}const w=function(){var n,e=(n=function*(n){var{dispatch:e}=n;if("serviceWorker"in navigator){var t,i=yield(()=>{try{return new Function("return import('data:text/javascript;base64,Cg==').then(r => true)")()}catch(n){return Promise.resolve(!1)}})(),o=new d("sw."+(i?"module":"legacy")+".js"),a=()=>{e((0,p.fz)({title:"New version ready",body:"A new version of this website is ready, reload this page to activate it.\n              ⚠️ The website might not function correctly until updated.",action:{text:"Load new version",fn(){console.log("fn"),t&&t.waiting&&r(t.waiting,{type:"SKIP_WAITING"})}}},"new-version-toast"))};for(o.addEventListener("waiting",a),o.addEventListener("externalwaiting",a),o.addEventListener("controlling",(()=>window.location.reload())),o.addEventListener("activated",(()=>window.location.reload())),o.register().then((n=>t=n));;)yield(0,h._v)(18e5),yield(0,h.Os)(),t&&t.update()}},function(){var e=this,t=arguments;return new Promise((function(r,i){var o=n.apply(e,t);function a(n){g(o,r,i,a,s,"next",n)}function s(n){g(o,r,i,a,s,"throw",n)}a(void 0)}))});return function(n){return e.apply(this,arguments)}}()}}]);
//# sourceMappingURL=189.module.offline.81f.js.map