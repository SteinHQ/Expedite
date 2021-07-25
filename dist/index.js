"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function updateHTML(){for(var t,e=document.querySelectorAll("[data-stein-url]"),n=function(t,e){var n=e.dataset.steinSearch,o=e.dataset.steinLimit,r=e.dataset.steinOffset,i=e.dataset.steinUrl;if(i=i.slice(-1)?i:i+"/","FORM"===e.tagName)return{v:configureForm(e,i)};e.style.display="none";var f=e.hasAttribute("data-stein-hide-empty");fetchData({URL:i,search:n,limit:o,offset:r}).then((function(t){for(var n=[],o=0;o<t.length;o++)n.push(e.innerHTML);var r=n.map((function(e,n){return interpolateString(e,t[n],f)}));e.innerHTML=r.join(""),e.style.display=""})).catch((function(t){throw console.log(t),new Error(t)}))},o=0;t=e[o];o++){var r=n(0,t);if("object"===_typeof(r))return r.v}}function fetchData(t){var e=t.URL,n=t.search,o=t.limit,r=t.offset,i=[o?"limit=".concat(o):"",r?"offset=".concat(r):"",n?"search=".concat(n):""],f="".concat(e,"?").concat(i.join("&"));return legacyFetch(f).then((function(t){return JSON.parse(t.response)}))}function interpolateString(t,e,n){return t.replace(/{{([^{}]*)}}/g,(function(t,o){var r=e[o];return"string"==typeof r?r:n?"":t}))}function configureForm(t,e){t.addEventListener("submit",(function(n){n.preventDefault();var o=new FormData(t),r={};o.forEach((function(t,e){r[e]=t})),legacyFetch(e,"POST",JSON.stringify([r])).then((function(t){var e=t.response;return{status:200,body:JSON.parse(e)}})).then((function(t){var e=new CustomEvent("ResponseReceived",{detail:t});n.target.dispatchEvent(e)})).catch((function(t){throw new Error(t)}))}))}!function(t,e){"object"==("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?e():"function"==typeof define&&define.amd?define(e):e()}(0,(function(){function t(t){var e=this.constructor;return this.then((function(n){return e.resolve(t()).then((function(){return n}))}),(function(n){return e.resolve(t()).then((function(){return e.reject(n)}))}))}function e(t){return!(!t||void 0===t.length)}function n(){}function o(t){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],c(t,this)}function r(t,e){for(;3===t._state;)t=t._value;0!==t._state?(t._handled=!0,o._immediateFn((function(){var n=1===t._state?e.onFulfilled:e.onRejected;if(null!==n){var o;try{o=n(t._value)}catch(t){return void f(e.promise,t)}i(e.promise,o)}else(1===t._state?i:f)(e.promise,t._value)}))):t._deferreds.push(e)}function i(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==_typeof(e)||"function"==typeof e)){var n=e.then;if(e instanceof o)return t._state=3,t._value=e,void u(t);if("function"==typeof n)return void c(function(t,e){return function(){t.apply(e,arguments)}}(n,e),t)}t._state=1,t._value=e,u(t)}catch(e){f(t,e)}}function f(t,e){t._state=2,t._value=e,u(t)}function u(t){2===t._state&&0===t._deferreds.length&&o._immediateFn((function(){t._handled||o._unhandledRejectionFn(t._value)}));for(var e=0,n=t._deferreds.length;n>e;e++)r(t,t._deferreds[e]);t._deferreds=null}function c(t,e){var n=!1;try{t((function(t){n||(n=!0,i(e,t))}),(function(t){n||(n=!0,f(e,t))}))}catch(t){if(n)return;n=!0,f(e,t)}}var a=setTimeout;o.prototype.catch=function(t){return this.then(null,t)},o.prototype.then=function(t,e){var o=new this.constructor(n);return r(this,new function(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n}(t,e,o)),o},o.prototype.finally=t,o.all=function(t){return new o((function(n,o){function r(t,e){try{if(e&&("object"==_typeof(e)||"function"==typeof e)){var u=e.then;if("function"==typeof u)return void u.call(e,(function(e){r(t,e)}),o)}i[t]=e,0==--f&&n(i)}catch(t){o(t)}}if(!e(t))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(t);if(0===i.length)return n([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u])}))},o.resolve=function(t){return t&&"object"==_typeof(t)&&t.constructor===o?t:new o((function(e){e(t)}))},o.reject=function(t){return new o((function(e,n){n(t)}))},o.race=function(t){return new o((function(n,r){if(!e(t))return r(new TypeError("Promise.race accepts an array"));for(var i=0,f=t.length;f>i;i++)o.resolve(t[i]).then(n,r)}))},o._immediateFn="function"==typeof setImmediate&&function(t){setImmediate(t)}||function(t){a(t,0)},o._unhandledRejectionFn=function(t){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)};var s=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in s?s.Promise.prototype.finally||(s.Promise.prototype.finally=t):s.Promise=o})),window.legacyFetch=function(t,e,n){var o=new XMLHttpRequest;return new Promise((function(r,i){o.onreadystatechange=function(){4===o.readyState&&(o.status>=200&&o.status<300?r(o):i({status:o.status,statusText:o.statusText}))},o.open(e||"GET",t,!0),o.send(n)}))},document.addEventListener("DOMContentLoaded",updateHTML);