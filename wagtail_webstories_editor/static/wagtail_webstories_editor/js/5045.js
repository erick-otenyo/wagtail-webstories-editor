(self.webpackChunkWebStories=self.webpackChunkWebStories||[]).push([[5045],{54985:(e,t,r)=>{"use strict";r.r(t),r.d(t,{defaultOptions:()=>o,fetchFile:()=>c,getCreateFFmpegCore:()=>s});const o={corePath:`https://unpkg.com/@ffmpeg/core@${r(93681).devDependencies["@ffmpeg/core"].substring(1)}/dist/ffmpeg-core.js`};var n=r(70888),a=r(93451);const i=async(e,t)=>{(0,n.log)("info",`fetch ${e}`);const r=await(await fetch(e)).arrayBuffer();(0,n.log)("info",`${e} file size = ${r.byteLength} bytes`);const o=new Blob([r],{type:t}),a=URL.createObjectURL(o);return(0,n.log)("info",`${e} blob URL = ${a}`),a},s=async({corePath:e,workerPath:t,wasmPath:r})=>{if("undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope){if("string"!=typeof e)throw Error("corePath should be a string!");const o=new URL(e,"file:///Users/otenyo/Projects/wmo/wagtail-webstories-editor/web-stories-editor-react/node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js").href,s=await i(o,"application/javascript"),c=await i(void 0!==r?r:o.replace("ffmpeg-core.js","ffmpeg-core.wasm"),"application/wasm"),l=await i(void 0!==t?t:o.replace("ffmpeg-core.js","ffmpeg-core.worker.js"),"application/javascript");return"undefined"==typeof createFFmpegCore?new Promise((e=>{if(globalThis.importScripts(s),"undefined"==typeof createFFmpegCore)throw Error((0,a.CREATE_FFMPEG_CORE_IS_NOT_DEFINED)(o));(0,n.log)("info","ffmpeg-core.js script loaded"),e({createFFmpegCore,corePath:s,wasmPath:c,workerPath:l})})):((0,n.log)("info","ffmpeg-core.js script is loaded already"),Promise.resolve({createFFmpegCore,corePath:s,wasmPath:c,workerPath:l}))}if("string"!=typeof e)throw Error("corePath should be a string!");const o=new URL(e,"file:///Users/otenyo/Projects/wmo/wagtail-webstories-editor/web-stories-editor-react/node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js").href,s=await i(o,"application/javascript"),c=await i(void 0!==r?r:o.replace("ffmpeg-core.js","ffmpeg-core.wasm"),"application/wasm"),l=await i(void 0!==t?t:o.replace("ffmpeg-core.js","ffmpeg-core.worker.js"),"application/javascript");return"undefined"==typeof createFFmpegCore?new Promise((e=>{const t=document.createElement("script"),r=()=>{if(t.removeEventListener("load",r),"undefined"==typeof createFFmpegCore)throw Error((0,a.CREATE_FFMPEG_CORE_IS_NOT_DEFINED)(o));(0,n.log)("info","ffmpeg-core.js script loaded"),e({createFFmpegCore,corePath:s,wasmPath:c,workerPath:l})};t.src=s,t.type="text/javascript",t.addEventListener("load",r),document.getElementsByTagName("head")[0].appendChild(t)})):((0,n.log)("info","ffmpeg-core.js script is loaded already"),Promise.resolve({createFFmpegCore,corePath:s,wasmPath:c,workerPath:l}))},c=async e=>{let t=e;if(void 0===e)return new Uint8Array;if("string"==typeof e)if(/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(e))t=atob(e.split(",")[1]).split("").map((e=>e.charCodeAt(0)));else{const r=await fetch(new URL(e,"file:///Users/otenyo/Projects/wmo/wagtail-webstories-editor/web-stories-editor-react/node_modules/@ffmpeg/ffmpeg/src/browser/fetchFile.js").href);t=await r.arrayBuffer()}else(e instanceof File||e instanceof Blob)&&(t=await(r=e,new Promise(((e,t)=>{const o=new FileReader;o.onload=()=>{e(o.result)},o.onerror=({target:{error:{code:e}}})=>{t(Error(`File could not be read! Code=${e}`))},o.readAsArrayBuffer(r)}))));var r;return new Uint8Array(t)}},41617:e=>{e.exports={defaultArgs:["./ffmpeg","-nostdin","-y"],baseOptions:{log:!1,logger:()=>{},progress:()=>{},corePath:""}}},22648:(e,t,r)=>{const{defaultArgs:o,baseOptions:n}=r(41617),a=r(7010),{defaultOptions:i,getCreateFFmpegCore:s}=r(54985),{version:c}=r(93681),l=Error("ffmpeg.wasm is not ready, make sure you have completed load().");e.exports=(e={})=>{const{log:t,logger:r,progress:f,...p}={...n,...i,...e};let u=null,h=null,m=null,g=null,d=!1,w=()=>{},y=t,v=f,b=0,F=0,E=!1,j=0;const x=(e,t)=>{w({type:e,message:t}),y&&console.log(`[${e}] ${t}`)},L=e=>{const[t,r,o]=e.split(":");return 60*parseFloat(t)*60+60*parseFloat(r)+parseFloat(o)},P=({type:e,message:t})=>{x(e,t),((e,t)=>{if("string"==typeof e)if(e.startsWith("  Duration")){const r=e.split(", ")[0].split(": ")[1],o=L(r);t({duration:o,ratio:j}),(0===b||b>o)&&(b=o,E=!0)}else if(E&&e.startsWith("    Stream")){const t=e.match(/([\d.]+) fps/);if(t){const e=parseFloat(t[1]);F=b*e}else F=0;E=!1}else if(e.startsWith("frame")||e.startsWith("size")){const r=e.split("time=")[1].split(" ")[0],o=L(r),n=e.match(/frame=\s*(\d+)/);if(F&&n){const e=parseFloat(n[1]);j=Math.min(e/F,1)}else j=o/b;t({ratio:j,time:o})}else e.startsWith("video:")&&(t({ratio:1}),b=0)})(t,v),(e=>{"FFMPEG_END"===e&&null!==m&&(m(),m=null,g=null,d=!1)})(t)};return x("info",`use ffmpeg.wasm v${c}`),{setProgress:e=>{v=e},setLogger:e=>{w=e},setLogging:e=>{y=e},load:async()=>{if(x("info","load ffmpeg-core"),null!==u)throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");{x("info","loading ffmpeg-core");const{createFFmpegCore:e,corePath:t,workerPath:r,wasmPath:o}=await s(p);u=await e({mainScriptUrlOrBlob:t,printErr:e=>P({type:"fferr",message:e}),print:e=>P({type:"ffout",message:e}),locateFile:(e,t)=>{if("undefined"!=typeof window||"undefined"!=typeof WorkerGlobalScope){if(void 0!==o&&e.endsWith("ffmpeg-core.wasm"))return o;if(void 0!==r&&e.endsWith("ffmpeg-core.worker.js"))return r}return t+e}}),h=u.cwrap(p.mainName||"proxy_main","number",["number","number"]),x("info","ffmpeg-core loaded")}},isLoaded:()=>null!==u,run:(...e)=>{if(x("info",`run ffmpeg command: ${e.join(" ")}`),null===u)throw l;if(d)throw Error("ffmpeg.wasm can only run one command at a time");return d=!0,new Promise(((t,r)=>{const n=[...o,...e].filter((e=>0!==e.length));m=t,g=r,h(...a(u,n))}))},exit:()=>{if(null===u)throw l;g&&g("ffmpeg has exited"),d=!1;try{u.exit(1)}catch(e){x(e.message),g&&g(e)}finally{u=null,h=null,m=null,g=null}},FS:(e,...t)=>{if(x("info",`run FS.${e} ${t.map((e=>"string"==typeof e?e:`<${e.length} bytes binary file>`)).join(" ")}`),null===u)throw l;{let r=null;try{r=u.FS[e](...t)}catch(r){throw"readdir"===e?Error(`ffmpeg.FS('readdir', '${t[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`):"readFile"===e?Error(`ffmpeg.FS('readFile', '${t[0]}') error. Check if the path exists`):Error("Oops, something went wrong in FS operation.")}return r}}}}},15045:(e,t,r)=>{r(35666);const o=r(22648),{fetchFile:n}=r(54985);e.exports={createFFmpeg:o,fetchFile:n}},93451:e=>{e.exports={CREATE_FFMPEG_CORE_IS_NOT_DEFINED:e=>`\ncreateFFmpegCore is not defined. ffmpeg.wasm is unable to find createFFmpegCore after loading ffmpeg-core.js from ${e}. Use another URL when calling createFFmpeg():\n\nconst ffmpeg = createFFmpeg({\n  corePath: 'http://localhost:3000/ffmpeg-core.js',\n});\n`}},70888:e=>{let t=!1,r=()=>{};e.exports={logging:t,setLogging:e=>{t=e},setCustomLogger:e=>{r=e},log:(e,o)=>{r({type:e,message:o}),t&&console.log(`[${e}] ${o}`)}}},7010:e=>{e.exports=(e,t)=>{const r=e._malloc(t.length*Uint32Array.BYTES_PER_ELEMENT);return t.forEach(((t,o)=>{const n=e.lengthBytesUTF8(t)+1,a=e._malloc(n);e.stringToUTF8(t,a,n),e.setValue(r+Uint32Array.BYTES_PER_ELEMENT*o,a,"i32")})),[t.length,r]}},35666:e=>{var t=function(e){"use strict";var t,r=Object.prototype,o=r.hasOwnProperty,n=Object.defineProperty||function(e,t,r){e[t]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",s=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag";function l(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"")}catch(e){l=function(e,t,r){return e[t]=r}}function f(e,t,r,o){var a=t&&t.prototype instanceof w?t:w,i=Object.create(a.prototype),s=new O(o||[]);return n(i,"_invoke",{value:P(e,r,s)}),i}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=f;var u="suspendedStart",h="suspendedYield",m="executing",g="completed",d={};function w(){}function y(){}function v(){}var b={};l(b,i,(function(){return this}));var F=Object.getPrototypeOf,E=F&&F(F(S([])));E&&E!==r&&o.call(E,i)&&(b=E);var j=v.prototype=w.prototype=Object.create(b);function x(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}))}))}function L(e,t){function r(n,a,i,s){var c=p(e[n],e,a);if("throw"!==c.type){var l=c.arg,f=l.value;return f&&"object"==typeof f&&o.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,i,s)}),(function(e){r("throw",e,i,s)})):t.resolve(f).then((function(e){l.value=e,i(l)}),(function(e){return r("throw",e,i,s)}))}s(c.arg)}var a;n(this,"_invoke",{value:function(e,o){function n(){return new t((function(t,n){r(e,o,t,n)}))}return a=a?a.then(n,n):n()}})}function P(e,t,r){var o=u;return function(n,a){if(o===m)throw new Error("Generator is already running");if(o===g){if("throw"===n)throw a;return T()}for(r.method=n,r.arg=a;;){var i=r.delegate;if(i){var s=_(i,r);if(s){if(s===d)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===u)throw o=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=m;var c=p(e,t,r);if("normal"===c.type){if(o=r.done?g:h,c.arg===d)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(o=g,r.method="throw",r.arg=c.arg)}}}function _(e,r){var o=r.method,n=e.iterator[o];if(n===t)return r.delegate=null,"throw"===o&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==o&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+o+"' method")),d;var a=p(n,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,d;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,d):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function C(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function S(e){if(e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,a=function r(){for(;++n<e.length;)if(o.call(e,n))return r.value=e[n],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}return{next:T}}function T(){return{value:t,done:!0}}return y.prototype=v,n(j,"constructor",{value:v,configurable:!0}),n(v,"constructor",{value:y,configurable:!0}),y.displayName=l(v,c,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===y||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,v):(e.__proto__=v,l(e,c,"GeneratorFunction")),e.prototype=Object.create(j),e},e.awrap=function(e){return{__await:e}},x(L.prototype),l(L.prototype,s,(function(){return this})),e.AsyncIterator=L,e.async=function(t,r,o,n,a){void 0===a&&(a=Promise);var i=new L(f(t,r,o,n),a);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},x(j),l(j,c,"Generator"),l(j,i,(function(){return this})),l(j,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),r=[];for(var o in t)r.push(o);return r.reverse(),function e(){for(;r.length;){var o=r.pop();if(o in t)return e.value=o,e.done=!1,e}return e.done=!0,e}},e.values=S,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(C),!e)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function n(o,n){return s.type="throw",s.arg=e,r.next=o,n&&(r.method="next",r.arg=t),!!n}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=o.call(i,"catchLoc"),l=o.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,d):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),d},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),C(r),d}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var o=r.completion;if("throw"===o.type){var n=o.arg;C(r)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,o){return this.delegate={iterator:S(e),resultName:r,nextLoc:o},"next"===this.method&&(this.arg=t),d}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}},93681:e=>{"use strict";e.exports=JSON.parse('{"name":"@ffmpeg/ffmpeg","version":"0.11.6","description":"FFmpeg WebAssembly version","main":"src/index.js","types":"src/index.d.ts","directories":{"example":"examples"},"scripts":{"start":"node scripts/server.js","start:worker":"node scripts/worker-server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","build:worker":"rimraf dist && webpack --config scripts/webpack.config.worker.prod.js","prepublishOnly":"npm run build","lint":"eslint src","wait":"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:ffmpeg test:node:all","test:node":"node node_modules/mocha/bin/_mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser":"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:ffmpeg":"npm run test:browser -- -f ./tests/ffmpeg.test.html"},"browser":{"./src/node/index.js":"./src/browser/index.js"},"repository":{"type":"git","url":"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"},"keywords":["ffmpeg","WebAssembly","video"],"author":"Jerome Wu <jeromewus@gmail.com>","license":"MIT","bugs":{"url":"https://github.com/ffmpegwasm/ffmpeg.wasm/issues"},"engines":{"node":">=12.16.1"},"homepage":"https://github.com/ffmpegwasm/ffmpeg.wasm#readme","dependencies":{"is-url":"^1.2.4","node-fetch":"^2.6.1","regenerator-runtime":"^0.13.7","resolve-url":"^0.2.1"},"devDependencies":{"@babel/core":"^7.12.3","@babel/preset-env":"^7.12.1","@ffmpeg/core":"^0.11.0","@types/emscripten":"^1.39.4","babel-eslint":"^10.1.0","babel-loader":"^8.1.0","chai":"^4.2.0","cors":"^2.8.5","eslint":"^7.12.1","eslint-config-airbnb-base":"^14.1.0","eslint-plugin-import":"^2.22.1","express":"^4.17.1","mocha":"^8.2.1","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","wait-on":"^5.3.0","webpack":"^5.3.2","webpack-cli":"^4.1.0","webpack-dev-middleware":"^4.0.0"}}')}}]);