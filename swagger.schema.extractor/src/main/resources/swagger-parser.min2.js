(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SwaggerParser = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** !
 * Swagger Parser v3.4.0
 *
 * @link https://github.com/BigstickCarpet/swagger-parser
 * @license MIT
 */
"use strict";function SwaggerParser(){$RefParser.apply(this,arguments)}var validateSchema=require("./validate-schema"),validateSpec=require("./validate-spec"),util=require("./util"),Options=require("./options"),Promise=require("./promise"),maybe=require("call-me-maybe"),ono=require("ono"),$RefParser=require("json-schema-ref-parser"),dereference=require("json-schema-ref-parser/lib/dereference");module.exports=SwaggerParser,util.inherits(SwaggerParser,$RefParser),SwaggerParser.YAML=$RefParser.YAML,SwaggerParser.parse=$RefParser.parse,SwaggerParser.resolve=$RefParser.resolve,SwaggerParser.bundle=$RefParser.bundle,SwaggerParser.dereference=$RefParser.dereference,Object.defineProperty(SwaggerParser.prototype,"api",{configurable:!0,enumerable:!0,get:function(){return this.schema}}),SwaggerParser.prototype.parse=function(e,r,a){"function"==typeof r&&(a=r,r=void 0),r=new Options(r);var i=e;return $RefParser.prototype.parse.call(this,e,r).then(function(e){var r=["2.0"];if(void 0===e.swagger||void 0===e.info||void 0===e.paths)throw ono.syntax("%s is not a valid Swagger API definition",i);if("number"==typeof e.swagger)throw ono.syntax('Swagger version number must be a string (e.g. "2.0") not a number.');if("number"==typeof e.info.version)throw ono.syntax('API version number must be a string (e.g. "1.0.0") not a number.');if(-1===r.indexOf(e.swagger))throw ono.syntax("Unsupported Swagger version: %d. Swagger Parser only supports version %s",e.swagger,r.join(", "));return maybe(a,Promise.resolve(e))})["catch"](function(e){return maybe(a,Promise.reject(e))})},SwaggerParser.validate=function(e,r,a){var i=this;return(new i).validate(e,r,a)},SwaggerParser.prototype.validate=function(e,r,a){"function"==typeof r&&(a=r,r=void 0),r=new Options(r);var i=this,s=r.$refs.circular;return r.validate.schema&&(r.$refs.circular="ignore"),this.dereference(e,r).then(function(){if(r.$refs.circular=s,r.validate.schema&&(validateSchema(i.api),i.$refs.circular))if(s===!0)dereference(i,r);else if(s===!1)throw ono.reference("The API contains circular references");return r.validate.spec&&validateSpec(i.api),maybe(a,Promise.resolve(i.schema))})["catch"](function(e){return maybe(a,Promise.reject(e))})};

},{"./options":2,"./promise":3,"./util":4,"./validate-schema":5,"./validate-spec":6,"call-me-maybe":13,"json-schema-ref-parser":59,"json-schema-ref-parser/lib/dereference":58,"ono":75}],2:[function(require,module,exports){
"use strict";function ParserOptions(s){this.validate={schema:!0,spec:!0},$RefParserOptions.apply(this,arguments)}var $RefParserOptions=require("json-schema-ref-parser/lib/options"),util=require("util");module.exports=ParserOptions,util.inherits(ParserOptions,$RefParserOptions);

},{"json-schema-ref-parser/lib/options":60,"util":104}],3:[function(require,module,exports){
"use strict";module.exports="function"==typeof Promise?Promise:require("es6-promise").Promise;

},{"es6-promise":17}],4:[function(require,module,exports){
"use strict";var debug=require("debug"),util=require("util");exports.format=util.format,exports.inherits=util.inherits,exports.debug=debug("swagger:parser"),exports.swaggerParamRegExp=/\{([^\/}]+)}/g;

},{"debug":15,"util":104}],5:[function(require,module,exports){
"use strict";function validateSchema(a){util.debug("Validating against the Swagger 2.0 schema");var e=ZSchema.validate(a,swaggerSchema);if(!e){var r=ZSchema.getLastError(),i="Swagger schema validation failed. \n"+formatZSchemaError(r.details);throw ono.syntax(r,{details:r.details},i)}util.debug("    Validated successfully")}function initializeZSchema(){ZSchema=new ZSchema({breakOnFirstError:!0,noExtraKeywords:!0,ignoreUnknownFormats:!1,reportPathAsArray:!0})}function formatZSchemaError(a,e){e=e||"  ";var r="";return a.forEach(function(a,i){r+=util.format("%s%s at #/%s\n",e,a.message,a.path.join("/")),a.inner&&(r+=formatZSchemaError(a.inner,e+"  "))}),r}var util=require("./util"),ono=require("ono"),ZSchema=require("z-schema"),swaggerSchema=require("swagger-schema-official/schema");module.exports=validateSchema,initializeZSchema();

},{"./util":4,"ono":75,"swagger-schema-official/schema":99,"z-schema":116}],6:[function(require,module,exports){
"use strict";function validateSpec(a){util.debug("Validating against the Swagger 2.0 spec");var e=Object.keys(a.paths||{});e.forEach(function(e){var t=a.paths[e],i="/paths"+e;t&&0===e.indexOf("/")&&validatePath(a,t,i)}),util.debug("    Validated successfully")}function validatePath(a,e,t){swaggerMethods.forEach(function(i){var n=e[i],r=t+"/"+i;if(n){validateParameters(a,e,t,n,r);var s=Object.keys(n.responses||{});s.forEach(function(a){var e=n.responses[a],t=r+"/responses/"+a;validateResponse(a,e,t)})}})}function validateParameters(a,e,t,i,n){var r=e.parameters||[],s=i.parameters||[];try{checkForDuplicates(r)}catch(o){throw ono.syntax(o,"Validation failed. %s has duplicate parameters",t)}try{checkForDuplicates(s)}catch(o){throw ono.syntax(o,"Validation failed. %s has duplicate parameters",n)}var l=r.reduce(function(a,e){var t=a.some(function(a){return a["in"]===e["in"]&&a.name===e.name});return t||a.push(e),a},s.slice());validateBodyParameters(l,n),validatePathParameters(l,t,n),validateParameterTypes(l,a,i,n)}function validateBodyParameters(a,e){var t=a.filter(function(a){return"body"===a["in"]}),i=a.filter(function(a){return"formData"===a["in"]});if(t.length>1)throw ono.syntax("Validation failed. %s has %d body parameters. Only one is allowed.",e,t.length);if(t.length>0&&i.length>0)throw ono.syntax("Validation failed. %s has body parameters and formData parameters. Only one or the other is allowed.",e)}function validatePathParameters(a,e,t){for(var i=e.match(util.swaggerParamRegExp)||[],n=0;n<i.length;n++)for(var r=n+1;r<i.length;r++)if(i[n]===i[r])throw ono.syntax("Validation failed. %s has multiple path placeholders named %s",t,i[n]);if(a.filter(function(a){return"path"===a["in"]}).forEach(function(a){if(a.required!==!0)throw ono.syntax('Validation failed. Path parameters cannot be optional. Set required=true for the "%s" parameter at %s',a.name,t);var e=i.indexOf("{"+a.name+"}");if(-1===e)throw ono.syntax('Validation failed. %s has a path parameter named "%s", but there is no corresponding {%s} in the path string',t,a.name,a.name);i.splice(e,1)}),i.length>0)throw ono.syntax("Validation failed. %s is missing path parameter(s) for %s",t,i)}function validateParameterTypes(a,e,t,i){a.forEach(function(a){var n,r,s=i+"/parameters/"+a.name;switch(a["in"]){case"body":n=a.schema,r=schemaTypes;break;case"formData":n=a,r=primitiveTypes.concat("file");break;default:n=a,r=primitiveTypes}if(validateSchema(n,s,r),"file"===n.type){var o=t.consumes||e.consumes||[];if(-1===o.indexOf("multipart/form-data")&&-1===o.indexOf("application/x-www-form-urlencoded"))throw ono.syntax("Validation failed. %s has a file parameter, so it must consume multipart/form-data or application/x-www-form-urlencoded",i)}})}function checkForDuplicates(a){for(var e=0;e<a.length-1;e++)for(var t=a[e],i=e+1;i<a.length;i++){var n=a[i];if(t.name===n.name&&t["in"]===n["in"])throw ono.syntax('Validation failed. Found multiple %s parameters named "%s"',t["in"],t.name)}}function validateResponse(a,e,t){if("default"!==a&&(100>a||a>599))throw ono.syntax("Validation failed. %s has an invalid response code (%s)",t,a);var i=Object.keys(e.headers||{});if(i.forEach(function(a){var i=e.headers[a],n=t+"/headers/"+a;validateSchema(i,n,primitiveTypes)}),e.schema){var n=schemaTypes.concat("file");if(-1===n.indexOf(e.schema.type))throw ono.syntax("Validation failed. %s has an invalid response schema type (%s)",t,e.schema.type)}}function validateSchema(a,e,t){if(-1===t.indexOf(a.type))throw ono.syntax("Validation failed. %s has an invalid type (%s)",e,a.type);if("array"===a.type&&!a.items)throw ono.syntax('Validation failed. %s is an array, so it must include an "items" schema',e)}var util=require("./util"),ono=require("ono"),swaggerMethods=require("swagger-methods"),primitiveTypes=["array","boolean","integer","number","string"],schemaTypes=["array","boolean","integer","number","string","object","null",void 0];module.exports=validateSpec;

},{"./util":4,"ono":75,"swagger-methods":98}],7:[function(require,module,exports){
var lookup="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";!function(t){"use strict";function r(t){var r=t.charCodeAt(0);return r===h||r===u?62:r===c||r===f?63:o>r?-1:o+10>r?r-o+26+26:i+26>r?r-i:A+26>r?r-A+26:void 0}function e(t){function e(t){i[f++]=t}var n,h,c,o,A,i;if(t.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var u=t.length;A="="===t.charAt(u-2)?2:"="===t.charAt(u-1)?1:0,i=new a(3*t.length/4-A),c=A>0?t.length-4:t.length;var f=0;for(n=0,h=0;c>n;n+=4,h+=3)o=r(t.charAt(n))<<18|r(t.charAt(n+1))<<12|r(t.charAt(n+2))<<6|r(t.charAt(n+3)),e((16711680&o)>>16),e((65280&o)>>8),e(255&o);return 2===A?(o=r(t.charAt(n))<<2|r(t.charAt(n+1))>>4,e(255&o)):1===A&&(o=r(t.charAt(n))<<10|r(t.charAt(n+1))<<4|r(t.charAt(n+2))>>2,e(o>>8&255),e(255&o)),i}function n(t){function r(t){return lookup.charAt(t)}function e(t){return r(t>>18&63)+r(t>>12&63)+r(t>>6&63)+r(63&t)}var n,a,h,c=t.length%3,o="";for(n=0,h=t.length-c;h>n;n+=3)a=(t[n]<<16)+(t[n+1]<<8)+t[n+2],o+=e(a);switch(c){case 1:a=t[t.length-1],o+=r(a>>2),o+=r(a<<4&63),o+="==";break;case 2:a=(t[t.length-2]<<8)+t[t.length-1],o+=r(a>>10),o+=r(a>>4&63),o+=r(a<<2&63),o+="="}return o}var a="undefined"!=typeof Uint8Array?Uint8Array:Array,h="+".charCodeAt(0),c="/".charCodeAt(0),o="0".charCodeAt(0),A="a".charCodeAt(0),i="A".charCodeAt(0),u="-".charCodeAt(0),f="_".charCodeAt(0);t.toByteArray=e,t.fromByteArray=n}("undefined"==typeof exports?this.base64js={}:exports);

},{}],8:[function(require,module,exports){

},{}],9:[function(require,module,exports){

},{}],10:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
"use strict";function typedArraySupport(){function t(){}try{var e=new Uint8Array(1);return e.foo=function(){return 42},e.constructor=t,42===e.foo()&&e.constructor===t&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(r){return!1}}function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function Buffer(t){return this instanceof Buffer?(Buffer.TYPED_ARRAY_SUPPORT||(this.length=0,this.parent=void 0),"number"==typeof t?fromNumber(this,t):"string"==typeof t?fromString(this,t,arguments.length>1?arguments[1]:"utf8"):fromObject(this,t)):arguments.length>1?new Buffer(t,arguments[1]):new Buffer(t)}function fromNumber(t,e){if(t=allocate(t,0>e?0:0|checked(e)),!Buffer.TYPED_ARRAY_SUPPORT)for(var r=0;e>r;r++)t[r]=0;return t}function fromString(t,e,r){("string"!=typeof r||""===r)&&(r="utf8");var n=0|byteLength(e,r);return t=allocate(t,n),t.write(e,r),t}function fromObject(t,e){if(Buffer.isBuffer(e))return fromBuffer(t,e);if(isArray(e))return fromArray(t,e);if(null==e)throw new TypeError("must start with number, buffer, array or string");if("undefined"!=typeof ArrayBuffer){if(e.buffer instanceof ArrayBuffer)return fromTypedArray(t,e);if(e instanceof ArrayBuffer)return fromArrayBuffer(t,e)}return e.length?fromArrayLike(t,e):fromJsonObject(t,e)}function fromBuffer(t,e){var r=0|checked(e.length);return t=allocate(t,r),e.copy(t,0,0,r),t}function fromArray(t,e){var r=0|checked(e.length);t=allocate(t,r);for(var n=0;r>n;n+=1)t[n]=255&e[n];return t}function fromTypedArray(t,e){var r=0|checked(e.length);t=allocate(t,r);for(var n=0;r>n;n+=1)t[n]=255&e[n];return t}function fromArrayBuffer(t,e){return Buffer.TYPED_ARRAY_SUPPORT?(e.byteLength,t=Buffer._augment(new Uint8Array(e))):t=fromTypedArray(t,new Uint8Array(e)),t}function fromArrayLike(t,e){var r=0|checked(e.length);t=allocate(t,r);for(var n=0;r>n;n+=1)t[n]=255&e[n];return t}function fromJsonObject(t,e){var r,n=0;"Buffer"===e.type&&isArray(e.data)&&(r=e.data,n=0|checked(r.length)),t=allocate(t,n);for(var f=0;n>f;f+=1)t[f]=255&r[f];return t}function allocate(t,e){Buffer.TYPED_ARRAY_SUPPORT?(t=Buffer._augment(new Uint8Array(e)),t.__proto__=Buffer.prototype):(t.length=e,t._isBuffer=!0);var r=0!==e&&e<=Buffer.poolSize>>>1;return r&&(t.parent=rootParent),t}function checked(t){if(t>=kMaxLength())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+kMaxLength().toString(16)+" bytes");return 0|t}function SlowBuffer(t,e){if(!(this instanceof SlowBuffer))return new SlowBuffer(t,e);var r=new Buffer(t,e);return delete r.parent,r}function byteLength(t,e){"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"binary":case"raw":case"raws":return r;case"utf8":case"utf-8":return utf8ToBytes(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(t).length;default:if(n)return utf8ToBytes(t).length;e=(""+e).toLowerCase(),n=!0}}function slowToString(t,e,r){var n=!1;if(e=0|e,r=void 0===r||r===1/0?this.length:0|r,t||(t="utf8"),0>e&&(e=0),r>this.length&&(r=this.length),e>=r)return"";for(;;)switch(t){case"hex":return hexSlice(this,e,r);case"utf8":case"utf-8":return utf8Slice(this,e,r);case"ascii":return asciiSlice(this,e,r);case"binary":return binarySlice(this,e,r);case"base64":return base64Slice(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function hexWrite(t,e,r,n){r=Number(r)||0;var f=t.length-r;n?(n=Number(n),n>f&&(n=f)):n=f;var i=e.length;if(i%2!==0)throw new Error("Invalid hex string");n>i/2&&(n=i/2);for(var o=0;n>o;o++){var u=parseInt(e.substr(2*o,2),16);if(isNaN(u))throw new Error("Invalid hex string");t[r+o]=u}return o}function utf8Write(t,e,r,n){return blitBuffer(utf8ToBytes(e,t.length-r),t,r,n)}function asciiWrite(t,e,r,n){return blitBuffer(asciiToBytes(e),t,r,n)}function binaryWrite(t,e,r,n){return asciiWrite(t,e,r,n)}function base64Write(t,e,r,n){return blitBuffer(base64ToBytes(e),t,r,n)}function ucs2Write(t,e,r,n){return blitBuffer(utf16leToBytes(e,t.length-r),t,r,n)}function base64Slice(t,e,r){return 0===e&&r===t.length?base64.fromByteArray(t):base64.fromByteArray(t.slice(e,r))}function utf8Slice(t,e,r){r=Math.min(t.length,r);for(var n=[],f=e;r>f;){var i=t[f],o=null,u=i>239?4:i>223?3:i>191?2:1;if(r>=f+u){var s,a,h,c;switch(u){case 1:128>i&&(o=i);break;case 2:s=t[f+1],128===(192&s)&&(c=(31&i)<<6|63&s,c>127&&(o=c));break;case 3:s=t[f+1],a=t[f+2],128===(192&s)&&128===(192&a)&&(c=(15&i)<<12|(63&s)<<6|63&a,c>2047&&(55296>c||c>57343)&&(o=c));break;case 4:s=t[f+1],a=t[f+2],h=t[f+3],128===(192&s)&&128===(192&a)&&128===(192&h)&&(c=(15&i)<<18|(63&s)<<12|(63&a)<<6|63&h,c>65535&&1114112>c&&(o=c))}}null===o?(o=65533,u=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),f+=u}return decodeCodePointsArray(n)}function decodeCodePointsArray(t){var e=t.length;if(MAX_ARGUMENTS_LENGTH>=e)return String.fromCharCode.apply(String,t);for(var r="",n=0;e>n;)r+=String.fromCharCode.apply(String,t.slice(n,n+=MAX_ARGUMENTS_LENGTH));return r}function asciiSlice(t,e,r){var n="";r=Math.min(t.length,r);for(var f=e;r>f;f++)n+=String.fromCharCode(127&t[f]);return n}function binarySlice(t,e,r){var n="";r=Math.min(t.length,r);for(var f=e;r>f;f++)n+=String.fromCharCode(t[f]);return n}function hexSlice(t,e,r){var n=t.length;(!e||0>e)&&(e=0),(!r||0>r||r>n)&&(r=n);for(var f="",i=e;r>i;i++)f+=toHex(t[i]);return f}function utf16leSlice(t,e,r){for(var n=t.slice(e,r),f="",i=0;i<n.length;i+=2)f+=String.fromCharCode(n[i]+256*n[i+1]);return f}function checkOffset(t,e,r){if(t%1!==0||0>t)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function checkInt(t,e,r,n,f,i){if(!Buffer.isBuffer(t))throw new TypeError("buffer must be a Buffer instance");if(e>f||i>e)throw new RangeError("value is out of bounds");if(r+n>t.length)throw new RangeError("index out of range")}function objectWriteUInt16(t,e,r,n){0>e&&(e=65535+e+1);for(var f=0,i=Math.min(t.length-r,2);i>f;f++)t[r+f]=(e&255<<8*(n?f:1-f))>>>8*(n?f:1-f)}function objectWriteUInt32(t,e,r,n){0>e&&(e=4294967295+e+1);for(var f=0,i=Math.min(t.length-r,4);i>f;f++)t[r+f]=e>>>8*(n?f:3-f)&255}function checkIEEE754(t,e,r,n,f,i){if(e>f||i>e)throw new RangeError("value is out of bounds");if(r+n>t.length)throw new RangeError("index out of range");if(0>r)throw new RangeError("index out of range")}function writeFloat(t,e,r,n,f){return f||checkIEEE754(t,e,r,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(t,e,r,n,23,4),r+4}function writeDouble(t,e,r,n,f){return f||checkIEEE754(t,e,r,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(t,e,r,n,52,8),r+8}function base64clean(t){if(t=stringtrim(t).replace(INVALID_BASE64_RE,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function stringtrim(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function toHex(t){return 16>t?"0"+t.toString(16):t.toString(16)}function utf8ToBytes(t,e){e=e||1/0;for(var r,n=t.length,f=null,i=[],o=0;n>o;o++){if(r=t.charCodeAt(o),r>55295&&57344>r){if(!f){if(r>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(o+1===n){(e-=3)>-1&&i.push(239,191,189);continue}f=r;continue}if(56320>r){(e-=3)>-1&&i.push(239,191,189),f=r;continue}r=(f-55296<<10|r-56320)+65536}else f&&(e-=3)>-1&&i.push(239,191,189);if(f=null,128>r){if((e-=1)<0)break;i.push(r)}else if(2048>r){if((e-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(65536>r){if((e-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(1114112>r))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function asciiToBytes(t){for(var e=[],r=0;r<t.length;r++)e.push(255&t.charCodeAt(r));return e}function utf16leToBytes(t,e){for(var r,n,f,i=[],o=0;o<t.length&&!((e-=2)<0);o++)r=t.charCodeAt(o),n=r>>8,f=r%256,i.push(f),i.push(n);return i}function base64ToBytes(t){return base64.toByteArray(base64clean(t))}function blitBuffer(t,e,r,n){for(var f=0;n>f&&!(f+r>=e.length||f>=t.length);f++)e[f+r]=t[f];return f}var base64=require("base64-js"),ieee754=require("ieee754"),isArray=require("isarray");exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50,Buffer.poolSize=8192;var rootParent={};Buffer.TYPED_ARRAY_SUPPORT=void 0!==global.TYPED_ARRAY_SUPPORT?global.TYPED_ARRAY_SUPPORT:typedArraySupport(),Buffer.TYPED_ARRAY_SUPPORT?(Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array):(Buffer.prototype.length=void 0,Buffer.prototype.parent=void 0),Buffer.isBuffer=function(t){return!(null==t||!t._isBuffer)},Buffer.compare=function(t,e){if(!Buffer.isBuffer(t)||!Buffer.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,f=0,i=Math.min(r,n);i>f&&t[f]===e[f];)++f;return f!==i&&(r=t[f],n=e[f]),n>r?-1:r>n?1:0},Buffer.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(t,e){if(!isArray(t))throw new TypeError("list argument must be an Array of Buffers.");if(0===t.length)return new Buffer(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;r++)e+=t[r].length;var n=new Buffer(e),f=0;for(r=0;r<t.length;r++){var i=t[r];i.copy(n,f),f+=i.length}return n},Buffer.byteLength=byteLength,Buffer.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?utf8Slice(this,0,t):slowToString.apply(this,arguments)},Buffer.prototype.equals=function(t){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t?!0:0===Buffer.compare(this,t)},Buffer.prototype.inspect=function(){var t="",e=exports.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},Buffer.prototype.compare=function(t){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t?0:Buffer.compare(this,t)},Buffer.prototype.indexOf=function(t,e){function r(t,e,r){for(var n=-1,f=0;r+f<t.length;f++)if(t[r+f]===e[-1===n?0:f-n]){if(-1===n&&(n=f),f-n+1===e.length)return r+n}else n=-1;return-1}if(e>2147483647?e=2147483647:-2147483648>e&&(e=-2147483648),e>>=0,0===this.length)return-1;if(e>=this.length)return-1;if(0>e&&(e=Math.max(this.length+e,0)),"string"==typeof t)return 0===t.length?-1:String.prototype.indexOf.call(this,t,e);if(Buffer.isBuffer(t))return r(this,t,e);if("number"==typeof t)return Buffer.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,t,e):r(this,[t],e);throw new TypeError("val must be string, number or Buffer")},Buffer.prototype.get=function(t){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(t)},Buffer.prototype.set=function(t,e){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(t,e)},Buffer.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else if(isFinite(e))e=0|e,isFinite(r)?(r=0|r,void 0===n&&(n="utf8")):(n=r,r=void 0);else{var f=n;n=e,e=0|r,r=f}var i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(0>r||0>e)||e>this.length)throw new RangeError("attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return hexWrite(this,t,e,r);case"utf8":case"utf-8":return utf8Write(this,t,e,r);case"ascii":return asciiWrite(this,t,e,r);case"binary":return binaryWrite(this,t,e,r);case"base64":return base64Write(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var MAX_ARGUMENTS_LENGTH=4096;Buffer.prototype.slice=function(t,e){var r=this.length;t=~~t,e=void 0===e?r:~~e,0>t?(t+=r,0>t&&(t=0)):t>r&&(t=r),0>e?(e+=r,0>e&&(e=0)):e>r&&(e=r),t>e&&(e=t);var n;if(Buffer.TYPED_ARRAY_SUPPORT)n=Buffer._augment(this.subarray(t,e));else{var f=e-t;n=new Buffer(f,void 0);for(var i=0;f>i;i++)n[i]=this[i+t]}return n.length&&(n.parent=this.parent||this),n},Buffer.prototype.readUIntLE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t],f=1,i=0;++i<e&&(f*=256);)n+=this[t+i]*f;return n},Buffer.prototype.readUIntBE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t+--e],f=1;e>0&&(f*=256);)n+=this[t+--e]*f;return n},Buffer.prototype.readUInt8=function(t,e){return e||checkOffset(t,1,this.length),this[t]},Buffer.prototype.readUInt16LE=function(t,e){return e||checkOffset(t,2,this.length),this[t]|this[t+1]<<8},Buffer.prototype.readUInt16BE=function(t,e){return e||checkOffset(t,2,this.length),this[t]<<8|this[t+1]},Buffer.prototype.readUInt32LE=function(t,e){return e||checkOffset(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},Buffer.prototype.readUInt32BE=function(t,e){return e||checkOffset(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},Buffer.prototype.readIntLE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=this[t],f=1,i=0;++i<e&&(f*=256);)n+=this[t+i]*f;return f*=128,n>=f&&(n-=Math.pow(2,8*e)),n},Buffer.prototype.readIntBE=function(t,e,r){t=0|t,e=0|e,r||checkOffset(t,e,this.length);for(var n=e,f=1,i=this[t+--n];n>0&&(f*=256);)i+=this[t+--n]*f;return f*=128,i>=f&&(i-=Math.pow(2,8*e)),i},Buffer.prototype.readInt8=function(t,e){return e||checkOffset(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},Buffer.prototype.readInt16LE=function(t,e){e||checkOffset(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function(t,e){e||checkOffset(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function(t,e){return e||checkOffset(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},Buffer.prototype.readInt32BE=function(t,e){return e||checkOffset(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},Buffer.prototype.readFloatLE=function(t,e){return e||checkOffset(t,4,this.length),ieee754.read(this,t,!0,23,4)},Buffer.prototype.readFloatBE=function(t,e){return e||checkOffset(t,4,this.length),ieee754.read(this,t,!1,23,4)},Buffer.prototype.readDoubleLE=function(t,e){return e||checkOffset(t,8,this.length),ieee754.read(this,t,!0,52,8)},Buffer.prototype.readDoubleBE=function(t,e){return e||checkOffset(t,8,this.length),ieee754.read(this,t,!1,52,8)},Buffer.prototype.writeUIntLE=function(t,e,r,n){t=+t,e=0|e,r=0|r,n||checkInt(this,t,e,r,Math.pow(2,8*r),0);var f=1,i=0;for(this[e]=255&t;++i<r&&(f*=256);)this[e+i]=t/f&255;return e+r},Buffer.prototype.writeUIntBE=function(t,e,r,n){t=+t,e=0|e,r=0|r,n||checkInt(this,t,e,r,Math.pow(2,8*r),0);var f=r-1,i=1;for(this[e+f]=255&t;--f>=0&&(i*=256);)this[e+f]=t/i&255;return e+r},Buffer.prototype.writeUInt8=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,1,255,0),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},Buffer.prototype.writeUInt16LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):objectWriteUInt16(this,t,e,!0),e+2},Buffer.prototype.writeUInt16BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):objectWriteUInt16(this,t,e,!1),e+2},Buffer.prototype.writeUInt32LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):objectWriteUInt32(this,t,e,!0),e+4},Buffer.prototype.writeUInt32BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):objectWriteUInt32(this,t,e,!1),e+4},Buffer.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e=0|e,!n){var f=Math.pow(2,8*r-1);checkInt(this,t,e,r,f-1,-f)}var i=0,o=1,u=0>t?1:0;for(this[e]=255&t;++i<r&&(o*=256);)this[e+i]=(t/o>>0)-u&255;return e+r},Buffer.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e=0|e,!n){var f=Math.pow(2,8*r-1);checkInt(this,t,e,r,f-1,-f)}var i=r-1,o=1,u=0>t?1:0;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=(t/o>>0)-u&255;return e+r},Buffer.prototype.writeInt8=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,1,127,-128),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),0>t&&(t=255+t+1),this[e]=255&t,e+1},Buffer.prototype.writeInt16LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):objectWriteUInt16(this,t,e,!0),e+2},Buffer.prototype.writeInt16BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):objectWriteUInt16(this,t,e,!1),e+2},Buffer.prototype.writeInt32LE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,2147483647,-2147483648),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):objectWriteUInt32(this,t,e,!0),e+4},Buffer.prototype.writeInt32BE=function(t,e,r){return t=+t,e=0|e,r||checkInt(this,t,e,4,2147483647,-2147483648),0>t&&(t=4294967295+t+1),Buffer.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):objectWriteUInt32(this,t,e,!1),e+4},Buffer.prototype.writeFloatLE=function(t,e,r){return writeFloat(this,t,e,!0,r)},Buffer.prototype.writeFloatBE=function(t,e,r){return writeFloat(this,t,e,!1,r)},Buffer.prototype.writeDoubleLE=function(t,e,r){return writeDouble(this,t,e,!0,r)},Buffer.prototype.writeDoubleBE=function(t,e,r){return writeDouble(this,t,e,!1,r)},Buffer.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&r>n&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(0>e)throw new RangeError("targetStart out of bounds");if(0>r||r>=this.length)throw new RangeError("sourceStart out of bounds");if(0>n)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var f,i=n-r;if(this===t&&e>r&&n>e)for(f=i-1;f>=0;f--)t[f+e]=this[f+r];else if(1e3>i||!Buffer.TYPED_ARRAY_SUPPORT)for(f=0;i>f;f++)t[f+e]=this[f+r];else t._set(this.subarray(r,r+i),e);return i},Buffer.prototype.fill=function(t,e,r){if(t||(t=0),e||(e=0),r||(r=this.length),e>r)throw new RangeError("end < start");if(r!==e&&0!==this.length){if(0>e||e>=this.length)throw new RangeError("start out of bounds");if(0>r||r>this.length)throw new RangeError("end out of bounds");var n;if("number"==typeof t)for(n=e;r>n;n++)this[n]=t;else{var f=utf8ToBytes(t.toString()),i=f.length;for(n=e;r>n;n++)this[n]=f[n%i]}return this}},Buffer.prototype.toArrayBuffer=function(){if("undefined"!=typeof Uint8Array){if(Buffer.TYPED_ARRAY_SUPPORT)return new Buffer(this).buffer;for(var t=new Uint8Array(this.length),e=0,r=t.length;r>e;e+=1)t[e]=this[e];return t.buffer}throw new TypeError("Buffer.toArrayBuffer not supported in this browser")};var BP=Buffer.prototype;Buffer._augment=function(t){return t.constructor=Buffer,t._isBuffer=!0,t._set=t.set,t.get=BP.get,t.set=BP.set,t.write=BP.write,t.toString=BP.toString,t.toLocaleString=BP.toString,t.toJSON=BP.toJSON,t.equals=BP.equals,t.compare=BP.compare,t.indexOf=BP.indexOf,t.copy=BP.copy,t.slice=BP.slice,t.readUIntLE=BP.readUIntLE,t.readUIntBE=BP.readUIntBE,t.readUInt8=BP.readUInt8,t.readUInt16LE=BP.readUInt16LE,t.readUInt16BE=BP.readUInt16BE,t.readUInt32LE=BP.readUInt32LE,t.readUInt32BE=BP.readUInt32BE,t.readIntLE=BP.readIntLE,t.readIntBE=BP.readIntBE,t.readInt8=BP.readInt8,t.readInt16LE=BP.readInt16LE,t.readInt16BE=BP.readInt16BE,t.readInt32LE=BP.readInt32LE,t.readInt32BE=BP.readInt32BE,t.readFloatLE=BP.readFloatLE,t.readFloatBE=BP.readFloatBE,t.readDoubleLE=BP.readDoubleLE,t.readDoubleBE=BP.readDoubleBE,t.writeUInt8=BP.writeUInt8,t.writeUIntLE=BP.writeUIntLE,t.writeUIntBE=BP.writeUIntBE,t.writeUInt16LE=BP.writeUInt16LE,t.writeUInt16BE=BP.writeUInt16BE,t.writeUInt32LE=BP.writeUInt32LE,t.writeUInt32BE=BP.writeUInt32BE,t.writeIntLE=BP.writeIntLE,t.writeIntBE=BP.writeIntBE,t.writeInt8=BP.writeInt8,t.writeInt16LE=BP.writeInt16LE,t.writeInt16BE=BP.writeInt16BE,t.writeInt32LE=BP.writeInt32LE,t.writeInt32BE=BP.writeInt32BE,t.writeFloatLE=BP.writeFloatLE,t.writeFloatBE=BP.writeFloatBE,t.writeDoubleLE=BP.writeDoubleLE,t.writeDoubleBE=BP.writeDoubleBE,t.fill=BP.fill,t.inspect=BP.inspect,t.toArrayBuffer=BP.toArrayBuffer,t};var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":7,"ieee754":21,"isarray":11}],11:[function(require,module,exports){
var toString={}.toString;module.exports=Array.isArray||function(r){return"[object Array]"==toString.call(r)};

},{}],12:[function(require,module,exports){
module.exports={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",300:"Multiple Choices",301:"Moved Permanently",302:"Moved Temporarily",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Time-out",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request-URI Too Large",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",418:"I'm a teapot",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Unordered Collection",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Time-out",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",509:"Bandwidth Limit Exceeded",510:"Not Extended",511:"Network Authentication Required"};

},{}],13:[function(require,module,exports){
(function (process,global){
"use strict";var next=global.process&&process.nextTick||global.setImmediate||function(n){setTimeout(n,0)};module.exports=function(n,t){return n?void t.then(function(t){next(function(){n(null,t)})},function(t){next(function(){n(t)})}):t};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":77}],14:[function(require,module,exports){
(function (Buffer){
function isArray(r){return Array.isArray?Array.isArray(r):"[object Array]"===objectToString(r)}function isBoolean(r){return"boolean"==typeof r}function isNull(r){return null===r}function isNullOrUndefined(r){return null==r}function isNumber(r){return"number"==typeof r}function isString(r){return"string"==typeof r}function isSymbol(r){return"symbol"==typeof r}function isUndefined(r){return void 0===r}function isRegExp(r){return"[object RegExp]"===objectToString(r)}function isObject(r){return"object"==typeof r&&null!==r}function isDate(r){return"[object Date]"===objectToString(r)}function isError(r){return"[object Error]"===objectToString(r)||r instanceof Error}function isFunction(r){return"function"==typeof r}function isPrimitive(r){return null===r||"boolean"==typeof r||"number"==typeof r||"string"==typeof r||"symbol"==typeof r||"undefined"==typeof r}function objectToString(r){return Object.prototype.toString.call(r)}exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=Buffer.isBuffer;

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})

},{"../../is-buffer/index.js":25}],15:[function(require,module,exports){
function useColors(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function formatArgs(){var o=arguments,e=this.useColors;if(o[0]=(e?"%c":"")+this.namespace+(e?" %c":" ")+o[0]+(e?"%c ":" ")+"+"+exports.humanize(this.diff),!e)return o;var r="color: "+this.color;o=[o[0],r,"color: inherit"].concat(Array.prototype.slice.call(o,1));var t=0,s=0;return o[0].replace(/%[a-z%]/g,function(o){"%%"!==o&&(t++,"%c"===o&&(s=t))}),o.splice(s,0,r),o}function log(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(o){try{null==o?exports.storage.removeItem("debug"):exports.storage.debug=o}catch(e){}}function load(){var o;try{o=exports.storage.debug}catch(e){}return o}function localstorage(){try{return window.localStorage}catch(o){}}exports=module.exports=require("./debug"),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:localstorage(),exports.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],exports.formatters.j=function(o){return JSON.stringify(o)},exports.enable(load());

},{"./debug":16}],16:[function(require,module,exports){
function selectColor(){return exports.colors[prevColor++%exports.colors.length]}function debug(e){function r(){}function o(){var e=o,r=+new Date,s=r-(prevTime||r);e.diff=s,e.prev=prevTime,e.curr=r,prevTime=r,null==e.useColors&&(e.useColors=exports.useColors()),null==e.color&&e.useColors&&(e.color=selectColor());var t=Array.prototype.slice.call(arguments);t[0]=exports.coerce(t[0]),"string"!=typeof t[0]&&(t=["%o"].concat(t));var n=0;t[0]=t[0].replace(/%([a-z%])/g,function(r,o){if("%%"===r)return r;n++;var s=exports.formatters[o];if("function"==typeof s){var p=t[n];r=s.call(e,p),t.splice(n,1),n--}return r}),"function"==typeof exports.formatArgs&&(t=exports.formatArgs.apply(e,t));var p=o.log||exports.log||console.log.bind(console);p.apply(e,t)}r.enabled=!1,o.enabled=!0;var s=exports.enabled(e)?o:r;return s.namespace=e,s}function enable(e){exports.save(e);for(var r=(e||"").split(/[\s,]+/),o=r.length,s=0;o>s;s++)r[s]&&(e=r[s].replace(/\*/g,".*?"),"-"===e[0]?exports.skips.push(new RegExp("^"+e.substr(1)+"$")):exports.names.push(new RegExp("^"+e+"$")))}function disable(){exports.enable("")}function enabled(e){var r,o;for(r=0,o=exports.skips.length;o>r;r++)if(exports.skips[r].test(e))return!1;for(r=0,o=exports.names.length;o>r;r++)if(exports.names[r].test(e))return!0;return!1}function coerce(e){return e instanceof Error?e.stack||e.message:e}exports=module.exports=debug,exports.coerce=coerce,exports.disable=disable,exports.enable=enable,exports.enabled=enabled,exports.humanize=require("ms"),exports.names=[],exports.skips=[],exports.formatters={};var prevColor=0,prevTime;

},{"ms":74}],17:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.0.2
 */
(function(){"use strict";function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function n(t){return"function"==typeof t}function e(t){return"object"==typeof t&&null!==t}function r(t){U=t}function o(t){G=t}function i(){return function(){process.nextTick(f)}}function u(){return function(){N(f)}}function s(){var t=0,n=new Q(f),e=document.createTextNode("");return n.observe(e,{characterData:!0}),function(){e.data=t=++t%2}}function c(){var t=new MessageChannel;return t.port1.onmessage=f,function(){t.port2.postMessage(0)}}function a(){return function(){setTimeout(f,1)}}function f(){for(var t=0;B>t;t+=2){var n=X[t],e=X[t+1];n(e),X[t]=void 0,X[t+1]=void 0}B=0}function l(){try{var t=require,n=t("vertx");return N=n.runOnLoop||n.runOnContext,u()}catch(e){return a()}}function p(){}function _(){return new TypeError("You cannot resolve a promise with itself")}function h(){return new TypeError("A promises callback cannot return that same promise.")}function v(t){try{return t.then}catch(n){return nt.error=n,nt}}function d(t,n,e,r){try{t.call(n,e,r)}catch(o){return o}}function y(t,n,e){G(function(t){var r=!1,o=d(e,n,function(e){r||(r=!0,n!==e?g(t,e):A(t,e))},function(n){r||(r=!0,E(t,n))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,E(t,o))},t)}function m(t,n){n._state===$?A(t,n._result):n._state===tt?E(t,n._result):j(n,void 0,function(n){g(t,n)},function(n){E(t,n)})}function b(t,e){if(e.constructor===t.constructor)m(t,e);else{var r=v(e);r===nt?E(t,nt.error):void 0===r?A(t,e):n(r)?y(t,e,r):A(t,e)}}function g(n,e){n===e?E(n,_()):t(e)?b(n,e):A(n,e)}function w(t){t._onerror&&t._onerror(t._result),S(t)}function A(t,n){t._state===Z&&(t._result=n,t._state=$,0!==t._subscribers.length&&G(S,t))}function E(t,n){t._state===Z&&(t._state=tt,t._result=n,G(w,t))}function j(t,n,e,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=n,o[i+$]=e,o[i+tt]=r,0===i&&t._state&&G(S,t)}function S(t){var n=t._subscribers,e=t._state;if(0!==n.length){for(var r,o,i=t._result,u=0;u<n.length;u+=3)r=n[u],o=n[u+e],r?x(e,r,o,i):o(i);t._subscribers.length=0}}function T(){this.error=null}function P(t,n){try{return t(n)}catch(e){return et.error=e,et}}function x(t,e,r,o){var i,u,s,c,a=n(r);if(a){if(i=P(r,o),i===et?(c=!0,u=i.error,i=null):s=!0,e===i)return void E(e,h())}else i=o,s=!0;e._state!==Z||(a&&s?g(e,i):c?E(e,u):t===$?A(e,i):t===tt&&E(e,i))}function C(t,n){try{n(function(n){g(t,n)},function(n){E(t,n)})}catch(e){E(t,e)}}function M(t,n){var e=this;e._instanceConstructor=t,e.promise=new t(p),e._validateInput(n)?(e._input=n,e.length=n.length,e._remaining=n.length,e._init(),0===e.length?A(e.promise,e._result):(e.length=e.length||0,e._enumerate(),0===e._remaining&&A(e.promise,e._result))):E(e.promise,e._validationError())}function O(t){return new rt(this,t).promise}function k(t){function n(t){g(o,t)}function e(t){E(o,t)}var r=this,o=new r(p);if(!z(t))return E(o,new TypeError("You must pass an array to race.")),o;for(var i=t.length,u=0;o._state===Z&&i>u;u++)j(r.resolve(t[u]),void 0,n,e);return o}function Y(t){var n=this;if(t&&"object"==typeof t&&t.constructor===n)return t;var e=new n(p);return g(e,t),e}function q(t){var n=this,e=new n(p);return E(e,t),e}function F(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function I(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function D(t){this._id=ct++,this._state=void 0,this._result=void 0,this._subscribers=[],p!==t&&(n(t)||F(),this instanceof D||I(),C(this,t))}function K(){var t;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(n){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;(!e||"[object Promise]"!==Object.prototype.toString.call(e.resolve())||e.cast)&&(t.Promise=at)}var L;L=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var N,U,W,z=L,B=0,G=({}.toString,function(t,n){X[B]=t,X[B+1]=n,B+=2,2===B&&(U?U(f):W())}),H="undefined"!=typeof window?window:void 0,J=H||{},Q=J.MutationObserver||J.WebKitMutationObserver,R="undefined"!=typeof process&&"[object process]"==={}.toString.call(process),V="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,X=new Array(1e3);W=R?i():Q?s():V?c():void 0===H&&"function"==typeof require?l():a();var Z=void 0,$=1,tt=2,nt=new T,et=new T;M.prototype._validateInput=function(t){return z(t)},M.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},M.prototype._init=function(){this._result=new Array(this.length)};var rt=M;M.prototype._enumerate=function(){for(var t=this,n=t.length,e=t.promise,r=t._input,o=0;e._state===Z&&n>o;o++)t._eachEntry(r[o],o)},M.prototype._eachEntry=function(t,n){var r=this,o=r._instanceConstructor;e(t)?t.constructor===o&&t._state!==Z?(t._onerror=null,r._settledAt(t._state,n,t._result)):r._willSettleAt(o.resolve(t),n):(r._remaining--,r._result[n]=t)},M.prototype._settledAt=function(t,n,e){var r=this,o=r.promise;o._state===Z&&(r._remaining--,t===tt?E(o,e):r._result[n]=e),0===r._remaining&&A(o,r._result)},M.prototype._willSettleAt=function(t,n){var e=this;j(t,void 0,function(t){e._settledAt($,n,t)},function(t){e._settledAt(tt,n,t)})};var ot=O,it=k,ut=Y,st=q,ct=0,at=D;D.all=ot,D.race=it,D.resolve=ut,D.reject=st,D._setScheduler=r,D._setAsap=o,D._asap=G,D.prototype={constructor:D,then:function(t,n){var e=this,r=e._state;if(r===$&&!t||r===tt&&!n)return this;var o=new this.constructor(p),i=e._result;if(r){var u=arguments[r-1];G(function(){x(r,o,u,i)})}else j(e,o,t,n);return o},"catch":function(t){return this.then(null,t)}};var ft=K,lt={Promise:at,polyfill:ft};"function"==typeof define&&define.amd?define(function(){return lt}):"undefined"!=typeof module&&module.exports?module.exports=lt:"undefined"!=typeof this&&(this.ES6Promise=lt),ft()}).call(this);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":77}],18:[function(require,module,exports){
!function(e,u){"use strict";"function"==typeof define&&define.amd?define(["exports"],u):u("undefined"!=typeof exports?exports:e.esprima={})}(this,function(e){"use strict";function u(e,u){if(!e)throw new Error("ASSERT: "+u)}function t(e){return e>=48&&57>=e}function n(e){return"0123456789abcdefABCDEF".indexOf(e)>=0}function i(e){return"01234567".indexOf(e)>=0}function r(e){var u="0"!==e,t="01234567".indexOf(e);return Et>st&&i(rt[st])&&(u=!0,t=8*t+"01234567".indexOf(rt[st++]),"0123".indexOf(e)>=0&&Et>st&&i(rt[st])&&(t=8*t+"01234567".indexOf(rt[st++]))),{code:t,octal:u}}function a(e){return 32===e||9===e||11===e||12===e||160===e||e>=5760&&[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279].indexOf(e)>=0}function s(e){return 10===e||13===e||8232===e||8233===e}function o(e){return 65536>e?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10))+String.fromCharCode(56320+(e-65536&1023))}function l(e){return 36===e||95===e||e>=65&&90>=e||e>=97&&122>=e||92===e||e>=128&&it.NonAsciiIdentifierStart.test(o(e))}function D(e){return 36===e||95===e||e>=65&&90>=e||e>=97&&122>=e||e>=48&&57>=e||92===e||e>=128&&it.NonAsciiIdentifierPart.test(o(e))}function c(e){switch(e){case"enum":case"export":case"import":case"super":return!0;default:return!1}}function f(e){switch(e){case"implements":case"interface":case"package":case"private":case"protected":case"public":case"static":case"yield":case"let":return!0;default:return!1}}function h(e){return"eval"===e||"arguments"===e}function p(e){switch(e.length){case 2:return"if"===e||"in"===e||"do"===e;case 3:return"var"===e||"for"===e||"new"===e||"try"===e||"let"===e;case 4:return"this"===e||"else"===e||"case"===e||"void"===e||"with"===e||"enum"===e;case 5:return"while"===e||"break"===e||"catch"===e||"throw"===e||"const"===e||"yield"===e||"class"===e||"super"===e;case 6:return"return"===e||"typeof"===e||"delete"===e||"switch"===e||"export"===e||"import"===e;case 7:return"default"===e||"finally"===e||"extends"===e;case 8:return"function"===e||"continue"===e||"debugger"===e;case 10:return"instanceof"===e;default:return!1}}function C(e,t,n,i,r){var a;u("number"==typeof n,"Comment must have valid position"),mt.lastCommentStart=n,a={type:e,value:t},Bt.range&&(a.range=[n,i]),Bt.loc&&(a.loc=r),Bt.comments.push(a),Bt.attachComment&&(Bt.leadingComments.push(a),Bt.trailingComments.push(a)),Bt.tokenize&&(a.type=a.type+"Comment",Bt.delegate&&(a=Bt.delegate(a)),Bt.tokens.push(a))}function F(e){var u,t,n,i;for(u=st-e,t={start:{line:ot,column:st-lt-e}};Et>st;)if(n=rt.charCodeAt(st),++st,s(n))return Dt=!0,Bt.comments&&(i=rt.slice(u+e,st-1),t.end={line:ot,column:st-lt-1},C("Line",i,u,st-1,t)),13===n&&10===rt.charCodeAt(st)&&++st,++ot,void(lt=st);Bt.comments&&(i=rt.slice(u+e,st),t.end={line:ot,column:st-lt},C("Line",i,u,st,t))}function A(){var e,u,t,n;for(Bt.comments&&(e=st-2,u={start:{line:ot,column:st-lt-2}});Et>st;)if(t=rt.charCodeAt(st),s(t))13===t&&10===rt.charCodeAt(st+1)&&++st,Dt=!0,++ot,++st,lt=st;else if(42===t){if(47===rt.charCodeAt(st+1))return++st,++st,void(Bt.comments&&(n=rt.slice(e+2,st-2),u.end={line:ot,column:st-lt},C("Block",n,e,st,u)));++st}else++st;Bt.comments&&(u.end={line:ot,column:st-lt},n=rt.slice(e+2,st),C("Block",n,e,st,u)),te()}function E(){var e,u;for(Dt=!1,u=0===st;Et>st;)if(e=rt.charCodeAt(st),a(e))++st;else if(s(e))Dt=!0,++st,13===e&&10===rt.charCodeAt(st)&&++st,++ot,lt=st,u=!0;else if(47===e)if(e=rt.charCodeAt(st+1),47===e)++st,++st,F(2),u=!0;else{if(42!==e)break;++st,++st,A()}else if(u&&45===e){if(45!==rt.charCodeAt(st+1)||62!==rt.charCodeAt(st+2))break;st+=3,F(3)}else{if(60!==e)break;if("!--"!==rt.slice(st+1,st+4))break;++st,++st,++st,++st,F(4)}}function d(e){var u,t,i,r=0;for(t="u"===e?4:2,u=0;t>u;++u){if(!(Et>st&&n(rt[st])))return"";i=rt[st++],r=16*r+"0123456789abcdef".indexOf(i.toLowerCase())}return String.fromCharCode(r)}function m(){var e,u;for(e=rt[st],u=0,"}"===e&&ue();Et>st&&(e=rt[st++],n(e));)u=16*u+"0123456789abcdef".indexOf(e.toLowerCase());return(u>1114111||"}"!==e)&&ue(),o(u)}function B(e){var u,t,n;return u=rt.charCodeAt(e),u>=55296&&56319>=u&&(n=rt.charCodeAt(e+1),n>=56320&&57343>=n&&(t=u,u=1024*(t-55296)+n-56320+65536)),u}function y(){var e,u,t;for(e=B(st),t=o(e),st+=t.length,92===e&&(117!==rt.charCodeAt(st)&&ue(),++st,"{"===rt[st]?(++st,u=m()):(u=d("u"),e=u.charCodeAt(0),u&&"\\"!==u&&l(e)||ue()),t=u);Et>st&&(e=B(st),D(e));)u=o(e),t+=u,st+=u.length,92===e&&(t=t.substr(0,t.length-1),117!==rt.charCodeAt(st)&&ue(),++st,"{"===rt[st]?(++st,u=m()):(u=d("u"),e=u.charCodeAt(0),u&&"\\"!==u&&D(e)||ue()),t+=u);return t}function g(){var e,u;for(e=st++;Et>st;){if(u=rt.charCodeAt(st),92===u)return st=e,y();if(u>=55296&&57343>u)return st=e,y();if(!D(u))break;++st}return rt.slice(e,st)}function S(){var e,u,t;return e=st,u=92===rt.charCodeAt(st)?y():g(),t=1===u.length?Qu.Identifier:p(u)?Qu.Keyword:"null"===u?Qu.NullLiteral:"true"===u||"false"===u?Qu.BooleanLiteral:Qu.Identifier,{type:t,value:u,lineNumber:ot,lineStart:lt,start:e,end:st}}function v(){var e,u;switch(e={type:Qu.Punctuator,value:"",lineNumber:ot,lineStart:lt,start:st,end:st},u=rt[st]){case"(":Bt.tokenize&&(Bt.openParenToken=Bt.tokenValues.length),++st;break;case"{":Bt.tokenize&&(Bt.openCurlyToken=Bt.tokenValues.length),mt.curlyStack.push("{"),++st;break;case".":++st,"."===rt[st]&&"."===rt[st+1]&&(st+=2,u="...");break;case"}":++st,mt.curlyStack.pop();break;case")":case";":case",":case"[":case"]":case":":case"?":case"~":++st;break;default:u=rt.substr(st,4),">>>="===u?st+=4:(u=u.substr(0,3),"==="===u||"!=="===u||">>>"===u||"<<="===u||">>="===u?st+=3:(u=u.substr(0,2),"&&"===u||"||"===u||"=="===u||"!="===u||"+="===u||"-="===u||"*="===u||"/="===u||"++"===u||"--"===u||"<<"===u||">>"===u||"&="===u||"|="===u||"^="===u||"%="===u||"<="===u||">="===u||"=>"===u?st+=2:(u=rt[st],"<>=!+-*%&|^/".indexOf(u)>=0&&++st)))}return st===e.start&&ue(),e.end=st,e.value=u,e}function x(e){for(var u="";Et>st&&n(rt[st]);)u+=rt[st++];return 0===u.length&&ue(),l(rt.charCodeAt(st))&&ue(),{type:Qu.NumericLiteral,value:parseInt("0x"+u,16),lineNumber:ot,lineStart:lt,start:e,end:st}}function w(e){var u,n;for(n="";Et>st&&(u=rt[st],"0"===u||"1"===u);)n+=rt[st++];return 0===n.length&&ue(),Et>st&&(u=rt.charCodeAt(st),(l(u)||t(u))&&ue()),{type:Qu.NumericLiteral,value:parseInt(n,2),lineNumber:ot,lineStart:lt,start:e,end:st}}function b(e,u){var n,r;for(i(e)?(r=!0,n="0"+rt[st++]):(r=!1,++st,n="");Et>st&&i(rt[st]);)n+=rt[st++];return r||0!==n.length||ue(),(l(rt.charCodeAt(st))||t(rt.charCodeAt(st)))&&ue(),{type:Qu.NumericLiteral,value:parseInt(n,8),octal:r,lineNumber:ot,lineStart:lt,start:u,end:st}}function k(){var e,u;for(e=st+1;Et>e;++e){if(u=rt[e],"8"===u||"9"===u)return!1;if(!i(u))return!0}return!0}function I(){var e,n,r;if(r=rt[st],u(t(r.charCodeAt(0))||"."===r,"Numeric literal must start with a decimal digit or a decimal point"),n=st,e="","."!==r){if(e=rt[st++],r=rt[st],"0"===e){if("x"===r||"X"===r)return++st,x(n);if("b"===r||"B"===r)return++st,w(n);if("o"===r||"O"===r)return b(r,n);if(i(r)&&k())return b(r,n)}for(;t(rt.charCodeAt(st));)e+=rt[st++];r=rt[st]}if("."===r){for(e+=rt[st++];t(rt.charCodeAt(st));)e+=rt[st++];r=rt[st]}if("e"===r||"E"===r)if(e+=rt[st++],r=rt[st],("+"===r||"-"===r)&&(e+=rt[st++]),t(rt.charCodeAt(st)))for(;t(rt.charCodeAt(st));)e+=rt[st++];else ue();return l(rt.charCodeAt(st))&&ue(),{type:Qu.NumericLiteral,value:parseFloat(e),lineNumber:ot,lineStart:lt,start:n,end:st}}function P(){var e,t,n,a,o,l="",D=!1;for(e=rt[st],u("'"===e||'"'===e,"String literal must starts with a quote"),t=st,++st;Et>st;){if(n=rt[st++],n===e){e="";break}if("\\"===n)if(n=rt[st++],n&&s(n.charCodeAt(0)))++ot,"\r"===n&&"\n"===rt[st]&&++st,lt=st;else switch(n){case"u":case"x":if("{"===rt[st])++st,l+=m();else{if(a=d(n),!a)throw ue();l+=a}break;case"n":l+="\n";break;case"r":l+="\r";break;case"t":l+="	";break;case"b":l+="\b";break;case"f":l+="\f";break;case"v":l+="\x0B";break;case"8":case"9":l+=n,te();break;default:i(n)?(o=r(n),D=o.octal||D,l+=String.fromCharCode(o.code)):l+=n}else{if(s(n.charCodeAt(0)))break;l+=n}}return""!==e&&ue(),{type:Qu.StringLiteral,value:l,octal:D,lineNumber:Ct,lineStart:Ft,start:t,end:st}}function L(){var e,u,n,r,a,o,l,D,c="";for(r=!1,o=!1,u=st,a="`"===rt[st],n=2,++st;Et>st;){if(e=rt[st++],"`"===e){n=1,o=!0,r=!0;break}if("$"===e){if("{"===rt[st]){mt.curlyStack.push("${"),++st,r=!0;break}c+=e}else if("\\"===e)if(e=rt[st++],s(e.charCodeAt(0)))++ot,"\r"===e&&"\n"===rt[st]&&++st,lt=st;else switch(e){case"n":c+="\n";break;case"r":c+="\r";break;case"t":c+="	";break;case"u":case"x":"{"===rt[st]?(++st,c+=m()):(l=st,D=d(e),D?c+=D:(st=l,c+=e));break;case"b":c+="\b";break;case"f":c+="\f";break;case"v":c+="\x0B";break;default:"0"===e?(t(rt.charCodeAt(st))&&Q(nt.TemplateOctalLiteral),c+="\x00"):i(e)?Q(nt.TemplateOctalLiteral):c+=e}else s(e.charCodeAt(0))?(++ot,"\r"===e&&"\n"===rt[st]&&++st,lt=st,c+="\n"):c+=e}return r||ue(),a||mt.curlyStack.pop(),{type:Qu.Template,value:{cooked:c,raw:rt.slice(u+1,st-n)},head:a,tail:o,lineNumber:ot,lineStart:lt,start:u,end:st}}function T(e,u){var t="￿",n=e;u.indexOf("u")>=0&&(n=n.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g,function(e,u,n){var i=parseInt(u||n,16);return i>1114111&&ue(null,nt.InvalidRegExp),65535>=i?String.fromCharCode(i):t}).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,t));try{RegExp(n)}catch(i){ue(null,nt.InvalidRegExp)}try{return new RegExp(e,u)}catch(r){return null}}function N(){var e,t,n,i,r;for(e=rt[st],u("/"===e,"Regular expression literal must start with a slash"),t=rt[st++],n=!1,i=!1;Et>st;)if(e=rt[st++],t+=e,"\\"===e)e=rt[st++],s(e.charCodeAt(0))&&ue(null,nt.UnterminatedRegExp),t+=e;else if(s(e.charCodeAt(0)))ue(null,nt.UnterminatedRegExp);else if(n)"]"===e&&(n=!1);else{if("/"===e){i=!0;break}"["===e&&(n=!0)}return i||ue(null,nt.UnterminatedRegExp),r=t.substr(1,t.length-2),{value:r,literal:t}}function O(){var e,u,t,n;for(u="",t="";Et>st&&(e=rt[st],D(e.charCodeAt(0)));)if(++st,"\\"===e&&Et>st)if(e=rt[st],"u"===e){if(++st,n=st,e=d("u"))for(t+=e,u+="\\u";st>n;++n)u+=rt[n];else st=n,t+="u",u+="\\u";te()}else u+="\\",te();else t+=e,u+=e;return{value:t,literal:u}}function R(){var e,u,t,n;return At=!0,dt=null,E(),e=st,u=N(),t=O(),n=T(u.value,t.value),At=!1,Bt.tokenize?{type:Qu.RegularExpression,value:n,regex:{pattern:u.value,flags:t.value},lineNumber:ot,lineStart:lt,start:e,end:st}:{literal:u.literal+t.literal,value:n,regex:{pattern:u.value,flags:t.value},start:e,end:st}}function U(){var e,u,t,n;return E(),e=st,u={start:{line:ot,column:st-lt}},t=R(),u.end={line:ot,column:st-lt},Bt.tokenize||(Bt.tokens.length>0&&(n=Bt.tokens[Bt.tokens.length-1],n.range[0]===e&&"Punctuator"===n.type&&("/"===n.value||"/="===n.value)&&Bt.tokens.pop()),Bt.tokens.push({type:"RegularExpression",value:t.literal,regex:t.regex,range:[e,st],loc:u})),t}function Y(e){return e.type===Qu.Identifier||e.type===Qu.Keyword||e.type===Qu.BooleanLiteral||e.type===Qu.NullLiteral}function M(){function e(e){return e&&e.length>1&&e[0]>="a"&&e[0]<="z"}var u,t,n;switch(t=Bt.tokenValues[Bt.tokens.length-1],u=null!==t,t){case"this":case"]":u=!1;break;case")":n=Bt.tokenValues[Bt.openParenToken-1],u="if"===n||"while"===n||"for"===n||"with"===n;break;case"}":u=!1,e(Bt.tokenValues[Bt.openCurlyToken-3])?(n=Bt.tokenValues[Bt.openCurlyToken-4],u=n?et.indexOf(n)<0:!1):e(Bt.tokenValues[Bt.openCurlyToken-4])&&(n=Bt.tokenValues[Bt.openCurlyToken-5],u=n?et.indexOf(n)<0:!0)}return u?U():v()}function j(){var e,u;return st>=Et?{type:Qu.EOF,lineNumber:ot,lineStart:lt,start:st,end:st}:(e=rt.charCodeAt(st),l(e)?(u=S(),at&&f(u.value)&&(u.type=Qu.Keyword),u):40===e||41===e||59===e?v():39===e||34===e?P():46===e?t(rt.charCodeAt(st+1))?I():v():t(e)?I():Bt.tokenize&&47===e?M():96===e||125===e&&"${"===mt.curlyStack[mt.curlyStack.length-1]?L():e>=55296&&57343>e&&(e=B(st),l(e))?S():v())}function V(){var e,u,t,n;return e={start:{line:ot,column:st-lt}},u=j(),e.end={line:ot,column:st-lt},u.type!==Qu.EOF&&(t=rt.slice(u.start,u.end),n={type:Zu[u.type],value:t,range:[u.start,u.end],loc:e},u.regex&&(n.regex={pattern:u.regex.pattern,flags:u.regex.flags}),Bt.tokenValues&&Bt.tokenValues.push("Punctuator"===n.type||"Keyword"===n.type?n.value:null),Bt.tokenize&&(Bt.range||delete n.range,Bt.loc||delete n.loc,Bt.delegate&&(n=Bt.delegate(n))),Bt.tokens.push(n)),u}function W(){var e;return At=!0,ct=st,ft=ot,ht=lt,E(),e=dt,pt=st,Ct=ot,Ft=lt,dt="undefined"!=typeof Bt.tokens?V():j(),At=!1,e}function H(){At=!0,E(),ct=st,ft=ot,ht=lt,pt=st,Ct=ot,Ft=lt,dt="undefined"!=typeof Bt.tokens?V():j(),At=!1}function K(){this.line=Ct,this.column=pt-Ft}function q(){this.start=new K,this.end=null}function z(e){this.start={line:e.lineNumber,column:e.start-e.lineStart},this.end=null}function _(){Bt.range&&(this.range=[pt,0]),Bt.loc&&(this.loc=new q)}function $(e){Bt.range&&(this.range=[e.start,0]),Bt.loc&&(this.loc=new z(e))}function G(e){var u,t;for(u=0;u<Bt.errors.length;u++)if(t=Bt.errors[u],t.index===e.index&&t.message===e.message)return;Bt.errors.push(e)}function X(e,u){var t=new Error(e);try{throw t}catch(n){Object.create&&Object.defineProperty&&(t=Object.create(n),Object.defineProperty(t,"column",{value:u}))}finally{return t}}function J(e,u,t){var n,i,r;return n="Line "+e+": "+t,i=u-(At?lt:ht)+1,r=X(n,i),r.lineNumber=e,r.description=t,r.index=u,r}function Q(e){var t,n;throw t=Array.prototype.slice.call(arguments,1),n=e.replace(/%(\d)/g,function(e,n){return u(n<t.length,"Message reference must be in range"),t[n]}),J(ft,ct,n)}function Z(e){var t,n,i;if(t=Array.prototype.slice.call(arguments,1),n=e.replace(/%(\d)/g,function(e,n){return u(n<t.length,"Message reference must be in range"),t[n]}),i=J(ot,ct,n),!Bt.errors)throw i;G(i)}function ee(e,u){var t,n=u||nt.UnexpectedToken;return e?(u||(n=e.type===Qu.EOF?nt.UnexpectedEOS:e.type===Qu.Identifier?nt.UnexpectedIdentifier:e.type===Qu.NumericLiteral?nt.UnexpectedNumber:e.type===Qu.StringLiteral?nt.UnexpectedString:e.type===Qu.Template?nt.UnexpectedTemplate:nt.UnexpectedToken,e.type===Qu.Keyword&&(c(e.value)?n=nt.UnexpectedReserved:at&&f(e.value)&&(n=nt.StrictReservedWord))),t=e.type===Qu.Template?e.value.raw:e.value):t="ILLEGAL",n=n.replace("%0",t),e&&"number"==typeof e.lineNumber?J(e.lineNumber,e.start,n):J(At?ot:ft,At?st:ct,n)}function ue(e,u){throw ee(e,u)}function te(e,u){var t=ee(e,u);if(!Bt.errors)throw t;G(t)}function ne(e){var u=W();(u.type!==Qu.Punctuator||u.value!==e)&&ue(u)}function ie(){var e;Bt.errors?(e=dt,e.type===Qu.Punctuator&&","===e.value?W():e.type===Qu.Punctuator&&";"===e.value?(W(),te(e)):te(e,nt.UnexpectedToken)):ne(",")}function re(e){var u=W();(u.type!==Qu.Keyword||u.value!==e)&&ue(u)}function ae(e){return dt.type===Qu.Punctuator&&dt.value===e}function se(e){return dt.type===Qu.Keyword&&dt.value===e}function oe(e){return dt.type===Qu.Identifier&&dt.value===e}function le(){var e;return dt.type!==Qu.Punctuator?!1:(e=dt.value,"="===e||"*="===e||"/="===e||"%="===e||"+="===e||"-="===e||"<<="===e||">>="===e||">>>="===e||"&="===e||"^="===e||"|="===e)}function De(){return 59===rt.charCodeAt(pt)||ae(";")?void W():void(Dt||(ct=pt,ft=Ct,ht=Ft,dt.type===Qu.EOF||ae("}")||ue(dt)))}function ce(e){var u,t=yt,n=gt,i=St;return yt=!0,gt=!0,St=null,u=e(),null!==St&&ue(St),yt=t,gt=n,St=i,u}function fe(e){var u,t=yt,n=gt,i=St;return yt=!0,gt=!0,St=null,u=e(),yt=yt&&t,gt=gt&&n,St=i||St,u}function he(e,u){var t,n,i=new _,r=[];for(ne("[");!ae("]");)if(ae(","))W(),r.push(null);else{if(ae("...")){n=new _,W(),e.push(dt),t=Ze(u),r.push(n.finishRestElement(t));break}r.push(Ae(e,u)),ae("]")||ne(",")}return ne("]"),i.finishArrayPattern(r)}function pe(e,u){var t,n,i,r=new _,a=ae("[");if(dt.type===Qu.Identifier){if(n=dt,t=Ze(),ae("="))return e.push(n),W(),i=$e(),r.finishProperty("init",t,!1,new $(n).finishAssignmentPattern(t,i),!1,!1);if(!ae(":"))return e.push(n),r.finishProperty("init",t,!1,t,!1,!0)}else t=Be();return ne(":"),i=Ae(e,u),r.finishProperty("init",t,a,i,!1,!1)}function Ce(e,u){var t=new _,n=[];for(ne("{");!ae("}");)n.push(pe(e,u)),ae("}")||ne(",");return W(),t.finishObjectPattern(n)}function Fe(e,u){return ae("[")?he(e,u):ae("{")?Ce(e,u):(se("let")&&("const"===u||"let"===u)&&te(dt,nt.UnexpectedToken),e.push(dt),Ze(u))}function Ae(e,u){var t,n,i,r=dt;return t=Fe(e,u),ae("=")&&(W(),n=mt.allowYield,mt.allowYield=!0,i=ce($e),mt.allowYield=n,t=new $(r).finishAssignmentPattern(t,i)),t}function Ee(){var e,u=[],t=new _;for(ne("[");!ae("]");)ae(",")?(W(),u.push(null)):ae("...")?(e=new _,W(),e.finishSpreadElement(fe($e)),ae("]")||(gt=yt=!1,ne(",")),u.push(e)):(u.push(fe($e)),ae("]")||ne(","));return W(),t.finishArrayExpression(u)}function de(e,u,t){var n,i;return gt=yt=!1,n=at,i=ce(wu),at&&u.firstRestricted&&te(u.firstRestricted,u.message),at&&u.stricted&&te(u.stricted,u.message),at=n,e.finishFunctionExpression(null,u.params,u.defaults,i,t)}function me(){var e,u,t=new _,n=mt.allowYield;return mt.allowYield=!1,e=Iu(),mt.allowYield=n,mt.allowYield=!1,u=de(t,e,!1),mt.allowYield=n,u}function Be(){var e,u,t=new _;switch(e=W(),e.type){case Qu.StringLiteral:case Qu.NumericLiteral:return at&&e.octal&&te(e,nt.StrictOctalLiteral),t.finishLiteral(e);case Qu.Identifier:case Qu.BooleanLiteral:case Qu.NullLiteral:case Qu.Keyword:return t.finishIdentifier(e.value);case Qu.Punctuator:if("["===e.value)return u=ce($e),ne("]"),u}ue(e)}function ye(){switch(dt.type){case Qu.Identifier:case Qu.StringLiteral:case Qu.BooleanLiteral:case Qu.NullLiteral:case Qu.NumericLiteral:case Qu.Keyword:return!0;case Qu.Punctuator:return"["===dt.value}return!1}function ge(e,u,t,n){var i,r,a,s,o=mt.allowYield;if(e.type===Qu.Identifier){if("get"===e.value&&ye())return t=ae("["),u=Be(),a=new _,ne("("),ne(")"),mt.allowYield=!1,i=de(a,{params:[],defaults:[],stricted:null,firstRestricted:null,message:null},!1),mt.allowYield=o,n.finishProperty("get",u,t,i,!1,!1);if("set"===e.value&&ye())return t=ae("["),u=Be(),a=new _,ne("("),r={params:[],defaultCount:0,defaults:[],firstRestricted:null,paramSet:{}},ae(")")?te(dt):(mt.allowYield=!1,ku(r),mt.allowYield=o,0===r.defaultCount&&(r.defaults=[])),ne(")"),mt.allowYield=!1,i=de(a,r,!1),mt.allowYield=o,n.finishProperty("set",u,t,i,!1,!1)}else if(e.type===Qu.Punctuator&&"*"===e.value&&ye())return t=ae("["),u=Be(),a=new _,mt.allowYield=!0,s=Iu(),mt.allowYield=o,mt.allowYield=!1,i=de(a,s,!0),mt.allowYield=o,n.finishProperty("init",u,t,i,!0,!1);return u&&ae("(")?(i=me(),n.finishProperty("init",u,t,i,!0,!1)):null}function Se(e){var u,t,n,i,r,a=dt,s=new _;return u=ae("["),ae("*")?W():t=Be(),(n=ge(a,t,u,s))?n:(t||ue(dt),u||(i=t.type===ut.Identifier&&"__proto__"===t.name||t.type===ut.Literal&&"__proto__"===t.value,e.value&&i&&Z(nt.DuplicateProtoProperty),e.value|=i),ae(":")?(W(),r=fe($e),s.finishProperty("init",t,u,r,!1,!1)):a.type===Qu.Identifier?ae("=")?(St=dt,W(),r=ce($e),s.finishProperty("init",t,u,new $(a).finishAssignmentPattern(t,r),!1,!0)):s.finishProperty("init",t,u,t,!1,!0):void ue(dt))}function ve(){var e=[],u={value:!1},t=new _;for(ne("{");!ae("}");)e.push(Se(u)),ae("}")||ie();return ne("}"),t.finishObjectExpression(e)}function xe(e){var u;switch(e.type){case ut.Identifier:case ut.MemberExpression:case ut.RestElement:case ut.AssignmentPattern:break;case ut.SpreadElement:e.type=ut.RestElement,xe(e.argument);break;case ut.ArrayExpression:for(e.type=ut.ArrayPattern,u=0;u<e.elements.length;u++)null!==e.elements[u]&&xe(e.elements[u]);break;case ut.ObjectExpression:for(e.type=ut.ObjectPattern,u=0;u<e.properties.length;u++)xe(e.properties[u].value);break;case ut.AssignmentExpression:e.type=ut.AssignmentPattern,xe(e.left)}}function we(e){var u,t;return(dt.type!==Qu.Template||e.head&&!dt.head)&&ue(),u=new _,t=W(),u.finishTemplateElement({raw:t.value.raw,cooked:t.value.cooked},t.tail)}function be(){var e,u,t,n=new _;for(e=we({head:!0}),u=[e],t=[];!e.tail;)t.push(Ge()),e=we({head:!1}),u.push(e);return n.finishTemplateLiteral(u,t)}function ke(){var e,u,t,n,i=[];if(ne("("),ae(")"))return W(),ae("=>")||ne("=>"),{type:tt.ArrowParameterPlaceHolder,params:[],rawParams:[]};if(t=dt,ae("..."))return e=lu(i),ne(")"),ae("=>")||ne("=>"),{type:tt.ArrowParameterPlaceHolder,params:[e]};if(yt=!0,e=fe($e),ae(",")){for(gt=!1,u=[e];Et>pt&&ae(",");){if(W(),ae("...")){for(yt||ue(dt),u.push(lu(i)),ne(")"),ae("=>")||ne("=>"),yt=!1,n=0;n<u.length;n++)xe(u[n]);return{type:tt.ArrowParameterPlaceHolder,params:u}}u.push(fe($e))}e=new $(t).finishSequenceExpression(u)}if(ne(")"),ae("=>")){if(e.type===ut.Identifier&&"yield"===e.name)return{type:tt.ArrowParameterPlaceHolder,params:[e]};if(yt||ue(dt),e.type===ut.SequenceExpression)for(n=0;n<e.expressions.length;n++)xe(e.expressions[n]);else xe(e);e={type:tt.ArrowParameterPlaceHolder,params:e.type===ut.SequenceExpression?e.expressions:[e]}}return yt=!1,e}function Ie(){var e,u,t,n;if(ae("("))return yt=!1,fe(ke);if(ae("["))return fe(Ee);if(ae("{"))return fe(ve);if(e=dt.type,n=new _,e===Qu.Identifier)"module"===mt.sourceType&&"await"===dt.value&&te(dt),t=n.finishIdentifier(W().value);else if(e===Qu.StringLiteral||e===Qu.NumericLiteral)gt=yt=!1,at&&dt.octal&&te(dt,nt.StrictOctalLiteral),t=n.finishLiteral(W());else if(e===Qu.Keyword){if(!at&&mt.allowYield&&se("yield"))return Le();if(!at&&se("let"))return n.finishIdentifier(W().value);if(gt=yt=!1,se("function"))return Lu();if(se("this"))return W(),n.finishThisExpression();if(se("class"))return Ou();ue(W())}else e===Qu.BooleanLiteral?(gt=yt=!1,u=W(),u.value="true"===u.value,t=n.finishLiteral(u)):e===Qu.NullLiteral?(gt=yt=!1,u=W(),u.value=null,t=n.finishLiteral(u)):ae("/")||ae("/=")?(gt=yt=!1,st=pt,u="undefined"!=typeof Bt.tokens?U():R(),W(),t=n.finishLiteral(u)):e===Qu.Template?t=be():ue(W());return t}function Pe(){var e,u=[];if(ne("("),!ae(")"))for(;Et>pt&&(ae("...")?(e=new _,W(),e.finishSpreadElement(ce($e))):e=ce($e),u.push(e),!ae(")"));)ie();return ne(")"),u}function Le(){var e,u=new _;return e=W(),Y(e)||ue(e),u.finishIdentifier(e.value)}function Te(){return ne("."),Le()}function Ne(){var e;return ne("["),e=ce(Ge),ne("]"),e}function Oe(){var e,u,t=new _;if(re("new"),ae(".")){if(W(),dt.type===Qu.Identifier&&"target"===dt.value&&mt.inFunctionBody)return W(),t.finishMetaProperty("new","target");ue(dt)}return e=ce(Ue),u=ae("(")?Pe():[],gt=yt=!1,t.finishNewExpression(e,u)}function Re(){var e,u,t,n,i,r=mt.allowIn;for(i=dt,mt.allowIn=!0,se("super")&&mt.inFunctionBody?(u=new _,W(),u=u.finishSuper(),ae("(")||ae(".")||ae("[")||ue(dt)):u=fe(se("new")?Oe:Ie);;)if(ae("."))yt=!1,gt=!0,n=Te(),u=new $(i).finishMemberExpression(".",u,n);else if(ae("("))yt=!1,gt=!1,t=Pe(),u=new $(i).finishCallExpression(u,t);else if(ae("["))yt=!1,gt=!0,n=Ne(),u=new $(i).finishMemberExpression("[",u,n);else{if(dt.type!==Qu.Template||!dt.head)break;e=be(),u=new $(i).finishTaggedTemplateExpression(u,e)}return mt.allowIn=r,u}function Ue(){var e,t,n,i;for(u(mt.allowIn,"callee of new expression always allow in keyword."),i=dt,se("super")&&mt.inFunctionBody?(t=new _,W(),t=t.finishSuper(),ae("[")||ae(".")||ue(dt)):t=fe(se("new")?Oe:Ie);;)if(ae("["))yt=!1,gt=!0,n=Ne(),t=new $(i).finishMemberExpression("[",t,n);else if(ae("."))yt=!1,gt=!0,n=Te(),t=new $(i).finishMemberExpression(".",t,n);else{if(dt.type!==Qu.Template||!dt.head)break;e=be(),t=new $(i).finishTaggedTemplateExpression(t,e)}return t}function Ye(){var e,u,t=dt;return e=fe(Re),Dt||dt.type!==Qu.Punctuator||(ae("++")||ae("--"))&&(at&&e.type===ut.Identifier&&h(e.name)&&Z(nt.StrictLHSPostfix),gt||Z(nt.InvalidLHSInAssignment),gt=yt=!1,u=W(),e=new $(t).finishPostfixExpression(u.value,e)),e}function Me(){var e,u,t;return dt.type!==Qu.Punctuator&&dt.type!==Qu.Keyword?u=Ye():ae("++")||ae("--")?(t=dt,e=W(),u=fe(Me),at&&u.type===ut.Identifier&&h(u.name)&&Z(nt.StrictLHSPrefix),gt||Z(nt.InvalidLHSInAssignment),u=new $(t).finishUnaryExpression(e.value,u),gt=yt=!1):ae("+")||ae("-")||ae("~")||ae("!")?(t=dt,e=W(),u=fe(Me),u=new $(t).finishUnaryExpression(e.value,u),gt=yt=!1):se("delete")||se("void")||se("typeof")?(t=dt,e=W(),u=fe(Me),u=new $(t).finishUnaryExpression(e.value,u),at&&"delete"===u.operator&&u.argument.type===ut.Identifier&&Z(nt.StrictDelete),gt=yt=!1):u=Ye(),u}function je(e,u){var t=0;if(e.type!==Qu.Punctuator&&e.type!==Qu.Keyword)return 0;switch(e.value){case"||":t=1;break;case"&&":t=2;break;case"|":t=3;break;case"^":t=4;break;case"&":t=5;break;case"==":case"!=":case"===":case"!==":t=6;break;case"<":case">":case"<=":case">=":case"instanceof":t=7;break;case"in":t=u?7:0;break;case"<<":case">>":case">>>":t=8;break;case"+":case"-":t=9;break;case"*":case"/":case"%":t=11}return t}function Ve(){var e,u,t,n,i,r,a,s,o,l;if(e=dt,o=fe(Me),n=dt,i=je(n,mt.allowIn),0===i)return o;for(gt=yt=!1,n.prec=i,W(),u=[e,dt],a=ce(Me),r=[o,n,a];(i=je(dt,mt.allowIn))>0;){for(;r.length>2&&i<=r[r.length-2].prec;)a=r.pop(),s=r.pop().value,o=r.pop(),u.pop(),t=new $(u[u.length-1]).finishBinaryExpression(s,o,a),r.push(t);n=W(),n.prec=i,r.push(n),u.push(dt),t=ce(Me),r.push(t)}for(l=r.length-1,t=r[l],u.pop();l>1;)t=new $(u.pop()).finishBinaryExpression(r[l-1].value,r[l-2],t),l-=2;return t}function We(){var e,u,t,n,i;return i=dt,e=fe(Ve),ae("?")&&(W(),u=mt.allowIn,mt.allowIn=!0,t=ce($e),mt.allowIn=u,ne(":"),n=ce($e),e=new $(i).finishConditionalExpression(e,t,n),gt=yt=!1),e}function He(){return ae("{")?wu():ce($e)}function Ke(e,t){var n;switch(t.type){case ut.Identifier:bu(e,t,t.name);break;case ut.RestElement:Ke(e,t.argument);break;case ut.AssignmentPattern:Ke(e,t.left);break;case ut.ArrayPattern:for(n=0;n<t.elements.length;n++)null!==t.elements[n]&&Ke(e,t.elements[n]);break;case ut.YieldExpression:break;default:for(u(t.type===ut.ObjectPattern,"Invalid type"),n=0;n<t.properties.length;n++)Ke(e,t.properties[n].value)}}function qe(e){var u,t,n,i,r,a,s,o;switch(r=[],a=0,i=[e],e.type){case ut.Identifier:break;case tt.ArrowParameterPlaceHolder:i=e.params;break;default:return null}for(s={paramSet:{}},u=0,t=i.length;t>u;u+=1)switch(n=i[u],n.type){case ut.AssignmentPattern:i[u]=n.left,n.right.type===ut.YieldExpression&&(n.right.argument&&ue(dt),n.right.type=ut.Identifier,n.right.name="yield",delete n.right.argument,delete n.right.delegate),r.push(n.right),++a,Ke(s,n.left);break;default:Ke(s,n),i[u]=n,r.push(null)}if(at||!mt.allowYield)for(u=0,t=i.length;t>u;u+=1)n=i[u],n.type===ut.YieldExpression&&ue(dt);return s.message===nt.StrictParamDupe&&(o=at?s.stricted:s.firstRestricted,ue(o,s.message)),0===a&&(r=[]),{params:i,defaults:r,stricted:s.stricted,firstRestricted:s.firstRestricted,message:s.message}}function ze(e,u){var t,n,i;return Dt&&te(dt),ne("=>"),t=at,n=mt.allowYield,mt.allowYield=!0,i=He(),at&&e.firstRestricted&&ue(e.firstRestricted,e.message),at&&e.stricted&&te(e.stricted,e.message),at=t,mt.allowYield=n,u.finishArrowFunctionExpression(e.params,e.defaults,i,i.type!==ut.BlockStatement)}function _e(){var e,u,t,n;return e=null,u=new _,t=!1,re("yield"),Dt||(n=mt.allowYield,mt.allowYield=!1,t=ae("*"),t?(W(),e=$e()):ae(";")||ae("}")||ae(")")||dt.type===Qu.EOF||(e=$e()),mt.allowYield=n),u.finishYieldExpression(e,t)}function $e(){var e,u,t,n,i;return i=dt,e=dt,!mt.allowYield&&se("yield")?_e():(u=We(),u.type===tt.ArrowParameterPlaceHolder||ae("=>")?(gt=yt=!1,n=qe(u),n?(St=null,ze(n,new $(i))):u):(le()&&(gt||Z(nt.InvalidLHSInAssignment),at&&u.type===ut.Identifier&&(h(u.name)&&te(e,nt.StrictLHSAssignment),f(u.name)&&te(e,nt.StrictReservedWord)),ae("=")?xe(u):gt=yt=!1,e=W(),t=ce($e),u=new $(i).finishAssignmentExpression(e.value,u,t),St=null),u))}function Ge(){var e,u,t=dt;if(e=ce($e),ae(",")){for(u=[e];Et>pt&&ae(",");)W(),u.push(ce($e));e=new $(t).finishSequenceExpression(u)}return e}function Xe(){if(dt.type===Qu.Keyword)switch(dt.value){case"export":return"module"!==mt.sourceType&&te(dt,nt.IllegalExportDeclaration),Vu();case"import":return"module"!==mt.sourceType&&te(dt,nt.IllegalImportDeclaration),zu();case"const":return ou({inFor:!1});case"function":return Pu(new _);case"class":return Nu()}return se("let")&&su()?ou({inFor:!1}):xu()}function Je(){for(var e=[];Et>pt&&!ae("}");)e.push(Xe());return e}function Qe(){var e,u=new _;return ne("{"),e=Je(),ne("}"),u.finishBlockStatement(e)}function Ze(e){var u,t=new _;return u=W(),u.type===Qu.Keyword&&"yield"===u.value?(at&&te(u,nt.StrictReservedWord),mt.allowYield||ue(u)):u.type!==Qu.Identifier?at&&u.type===Qu.Keyword&&f(u.value)?te(u,nt.StrictReservedWord):(at||"let"!==u.value||"var"!==e)&&ue(u):"module"===mt.sourceType&&u.type===Qu.Identifier&&"await"===u.value&&te(u),t.finishIdentifier(u.value)}function eu(e){var u,t=null,n=new _,i=[];return u=Fe(i,"var"),at&&h(u.name)&&Z(nt.StrictVarName),ae("=")?(W(),t=ce($e)):u.type===ut.Identifier||e.inFor||ne("="),n.finishVariableDeclarator(u,t)}function uu(e){var u,t;for(u={inFor:e.inFor},t=[eu(u)];ae(",");)W(),t.push(eu(u));return t}function tu(e){var u;return re("var"),u=uu({inFor:!1}),De(),e.finishVariableDeclaration(u)}function nu(e,u){var t,n=null,i=new _,r=[];return t=Fe(r,e),at&&t.type===ut.Identifier&&h(t.name)&&Z(nt.StrictVarName),"const"===e?se("in")||oe("of")||(ne("="),n=ce($e)):(!u.inFor&&t.type!==ut.Identifier||ae("="))&&(ne("="),n=ce($e)),i.finishVariableDeclarator(t,n)}function iu(e,u){for(var t=[nu(e,u)];ae(",");)W(),t.push(nu(e,u));return t}function ru(){return{index:st,lineNumber:ot,lineStart:lt,hasLineTerminator:Dt,lastIndex:ct,lastLineNumber:ft,lastLineStart:ht,startIndex:pt,startLineNumber:Ct,startLineStart:Ft,lookahead:dt,tokenCount:Bt.tokens?Bt.tokens.length:0}}function au(e){st=e.index,ot=e.lineNumber,lt=e.lineStart,Dt=e.hasLineTerminator,ct=e.lastIndex,ft=e.lastLineNumber,ht=e.lastLineStart,pt=e.startIndex,Ct=e.startLineNumber,Ft=e.startLineStart,dt=e.lookahead,Bt.tokens&&Bt.tokens.splice(e.tokenCount,Bt.tokens.length)}function su(){var e,u;return u=ru(),W(),e=dt.type===Qu.Identifier||ae("[")||ae("{")||se("let")||se("yield"),au(u),e}function ou(e){var t,n,i=new _;return t=W().value,u("let"===t||"const"===t,"Lexical declaration must be either let or const"),n=iu(t,e),De(),i.finishLexicalDeclaration(n,t)}function lu(e){var u,t=new _;return W(),ae("{")&&Q(nt.ObjectPatternAsRestParameter),e.push(dt),u=Ze(),ae("=")&&Q(nt.DefaultRestParameter),ae(")")||Q(nt.ParameterAfterRestParameter),t.finishRestElement(u)}function Du(e){return ne(";"),e.finishEmptyStatement()}function cu(e){var u=Ge();return De(),e.finishExpressionStatement(u)}function fu(e){var u,t,n;return re("if"),ne("("),u=Ge(),ne(")"),t=xu(),se("else")?(W(),n=xu()):n=null,e.finishIfStatement(u,t,n)}function hu(e){var u,t,n;return re("do"),n=mt.inIteration,mt.inIteration=!0,u=xu(),mt.inIteration=n,re("while"),ne("("),t=Ge(),ne(")"),ae(";")&&W(),e.finishDoWhileStatement(u,t)}function pu(e){var u,t,n;return re("while"),ne("("),u=Ge(),ne(")"),n=mt.inIteration,mt.inIteration=!0,t=xu(),mt.inIteration=n,e.finishWhileStatement(u,t)}function Cu(e){var u,t,n,i,r,a,s,o,l,D,c,f,h=mt.allowIn;if(u=r=a=null,t=!0,re("for"),ne("("),ae(";"))W();else if(se("var"))u=new _,W(),mt.allowIn=!1,D=uu({inFor:!0}),mt.allowIn=h,1===D.length&&se("in")?(u=u.finishVariableDeclaration(D),W(),s=u,o=Ge(),u=null):1===D.length&&null===D[0].init&&oe("of")?(u=u.finishVariableDeclaration(D),W(),s=u,o=$e(),u=null,t=!1):(u=u.finishVariableDeclaration(D),ne(";"));else if(se("const")||se("let"))u=new _,l=W().value,at||"in"!==dt.value?(mt.allowIn=!1,D=iu(l,{inFor:!0}),mt.allowIn=h,1===D.length&&null===D[0].init&&se("in")?(u=u.finishLexicalDeclaration(D,l),W(),s=u,o=Ge(),u=null):1===D.length&&null===D[0].init&&oe("of")?(u=u.finishLexicalDeclaration(D,l),W(),s=u,o=$e(),u=null,t=!1):(De(),u=u.finishLexicalDeclaration(D,l))):(u=u.finishIdentifier(l),W(),s=u,o=Ge(),u=null);else if(i=dt,mt.allowIn=!1,u=fe($e),mt.allowIn=h,se("in"))gt||Z(nt.InvalidLHSInForIn),W(),xe(u),s=u,o=Ge(),u=null;else if(oe("of"))gt||Z(nt.InvalidLHSInForLoop),W(),xe(u),s=u,o=$e(),u=null,t=!1;else{if(ae(",")){for(n=[u];ae(",");)W(),n.push(ce($e));u=new $(i).finishSequenceExpression(n)}ne(";")}return"undefined"==typeof s&&(ae(";")||(r=Ge()),ne(";"),ae(")")||(a=Ge())),ne(")"),f=mt.inIteration,mt.inIteration=!0,c=ce(xu),mt.inIteration=f,"undefined"==typeof s?e.finishForStatement(u,r,a,c):t?e.finishForInStatement(s,o,c):e.finishForOfStatement(s,o,c)}function Fu(e){var u,t=null;return re("continue"),
59===rt.charCodeAt(pt)?(W(),mt.inIteration||Q(nt.IllegalContinue),e.finishContinueStatement(null)):Dt?(mt.inIteration||Q(nt.IllegalContinue),e.finishContinueStatement(null)):(dt.type===Qu.Identifier&&(t=Ze(),u="$"+t.name,Object.prototype.hasOwnProperty.call(mt.labelSet,u)||Q(nt.UnknownLabel,t.name)),De(),null!==t||mt.inIteration||Q(nt.IllegalContinue),e.finishContinueStatement(t))}function Au(e){var u,t=null;return re("break"),59===rt.charCodeAt(ct)?(W(),mt.inIteration||mt.inSwitch||Q(nt.IllegalBreak),e.finishBreakStatement(null)):(Dt?mt.inIteration||mt.inSwitch||Q(nt.IllegalBreak):dt.type===Qu.Identifier&&(t=Ze(),u="$"+t.name,Object.prototype.hasOwnProperty.call(mt.labelSet,u)||Q(nt.UnknownLabel,t.name)),De(),null!==t||mt.inIteration||mt.inSwitch||Q(nt.IllegalBreak),e.finishBreakStatement(t))}function Eu(e){var u=null;return re("return"),mt.inFunctionBody||Z(nt.IllegalReturn),32===rt.charCodeAt(ct)&&l(rt.charCodeAt(ct+1))?(u=Ge(),De(),e.finishReturnStatement(u)):Dt?e.finishReturnStatement(null):(ae(";")||ae("}")||dt.type===Qu.EOF||(u=Ge()),De(),e.finishReturnStatement(u))}function du(e){var u,t;return at&&Z(nt.StrictModeWith),re("with"),ne("("),u=Ge(),ne(")"),t=xu(),e.finishWithStatement(u,t)}function mu(){var e,u,t=[],n=new _;for(se("default")?(W(),e=null):(re("case"),e=Ge()),ne(":");Et>pt&&!(ae("}")||se("default")||se("case"));)u=Xe(),t.push(u);return n.finishSwitchCase(e,t)}function Bu(e){var u,t,n,i,r;if(re("switch"),ne("("),u=Ge(),ne(")"),ne("{"),t=[],ae("}"))return W(),e.finishSwitchStatement(u,t);for(i=mt.inSwitch,mt.inSwitch=!0,r=!1;Et>pt&&!ae("}");)n=mu(),null===n.test&&(r&&Q(nt.MultipleDefaultsInSwitch),r=!0),t.push(n);return mt.inSwitch=i,ne("}"),e.finishSwitchStatement(u,t)}function yu(e){var u;return re("throw"),Dt&&Q(nt.NewlineAfterThrow),u=Ge(),De(),e.finishThrowStatement(u)}function gu(){var e,u,t,n,i=[],r={},a=new _;for(re("catch"),ne("("),ae(")")&&ue(dt),e=Fe(i),t=0;t<i.length;t++)u="$"+i[t].value,Object.prototype.hasOwnProperty.call(r,u)&&Z(nt.DuplicateBinding,i[t].value),r[u]=!0;return at&&h(e.name)&&Z(nt.StrictCatchVariable),ne(")"),n=Qe(),a.finishCatchClause(e,n)}function Su(e){var u,t=null,n=null;return re("try"),u=Qe(),se("catch")&&(t=gu()),se("finally")&&(W(),n=Qe()),t||n||Q(nt.NoCatchOrFinally),e.finishTryStatement(u,t,n)}function vu(e){return re("debugger"),De(),e.finishDebuggerStatement()}function xu(){var e,u,t,n,i=dt.type;if(i===Qu.EOF&&ue(dt),i===Qu.Punctuator&&"{"===dt.value)return Qe();if(gt=yt=!0,n=new _,i===Qu.Punctuator)switch(dt.value){case";":return Du(n);case"(":return cu(n)}else if(i===Qu.Keyword)switch(dt.value){case"break":return Au(n);case"continue":return Fu(n);case"debugger":return vu(n);case"do":return hu(n);case"for":return Cu(n);case"function":return Pu(n);case"if":return fu(n);case"return":return Eu(n);case"switch":return Bu(n);case"throw":return yu(n);case"try":return Su(n);case"var":return tu(n);case"while":return pu(n);case"with":return du(n)}return e=Ge(),e.type===ut.Identifier&&ae(":")?(W(),t="$"+e.name,Object.prototype.hasOwnProperty.call(mt.labelSet,t)&&Q(nt.Redeclaration,"Label",e.name),mt.labelSet[t]=!0,u=xu(),delete mt.labelSet[t],n.finishLabeledStatement(e,u)):(De(),n.finishExpressionStatement(e))}function wu(){var e,u,t,n,i,r,a,s,o,l=[],D=new _;for(ne("{");Et>pt&&dt.type===Qu.StringLiteral&&(u=dt,e=Xe(),l.push(e),e.expression.type===ut.Literal);)t=rt.slice(u.start+1,u.end-1),"use strict"===t?(at=!0,n&&te(n,nt.StrictOctalLiteral)):!n&&u.octal&&(n=u);for(i=mt.labelSet,r=mt.inIteration,a=mt.inSwitch,s=mt.inFunctionBody,o=mt.parenthesizedCount,mt.labelSet={},mt.inIteration=!1,mt.inSwitch=!1,mt.inFunctionBody=!0,mt.parenthesizedCount=0;Et>pt&&!ae("}");)l.push(Xe());return ne("}"),mt.labelSet=i,mt.inIteration=r,mt.inSwitch=a,mt.inFunctionBody=s,mt.parenthesizedCount=o,D.finishBlockStatement(l)}function bu(e,u,t){var n="$"+t;at?(h(t)&&(e.stricted=u,e.message=nt.StrictParamName),Object.prototype.hasOwnProperty.call(e.paramSet,n)&&(e.stricted=u,e.message=nt.StrictParamDupe)):e.firstRestricted||(h(t)?(e.firstRestricted=u,e.message=nt.StrictParamName):f(t)?(e.firstRestricted=u,e.message=nt.StrictReservedWord):Object.prototype.hasOwnProperty.call(e.paramSet,n)&&(e.stricted=u,e.message=nt.StrictParamDupe)),e.paramSet[n]=!0}function ku(e){var u,t,n,i,r=[];if(u=dt,"..."===u.value)return t=lu(r),bu(e,t.argument,t.argument.name),e.params.push(t),e.defaults.push(null),!1;for(t=Ae(r),n=0;n<r.length;n++)bu(e,r[n],r[n].value);return t.type===ut.AssignmentPattern&&(i=t.right,t=t.left,++e.defaultCount),e.params.push(t),e.defaults.push(i),!ae(")")}function Iu(e){var u;if(u={params:[],defaultCount:0,defaults:[],firstRestricted:e},ne("("),!ae(")"))for(u.paramSet={};Et>pt&&ku(u);)ne(",");return ne(")"),0===u.defaultCount&&(u.defaults=[]),{params:u.params,defaults:u.defaults,stricted:u.stricted,firstRestricted:u.firstRestricted,message:u.message}}function Pu(e,u){var t,n,i,r,a,s,o,l,D,c=null,p=[],C=[];return D=mt.allowYield,re("function"),l=ae("*"),l&&W(),u&&ae("(")||(n=dt,c=Ze(),at?h(n.value)&&te(n,nt.StrictFunctionName):h(n.value)?(a=n,s=nt.StrictFunctionName):f(n.value)&&(a=n,s=nt.StrictReservedWord)),mt.allowYield=!l,r=Iu(a),p=r.params,C=r.defaults,i=r.stricted,a=r.firstRestricted,r.message&&(s=r.message),o=at,t=wu(),at&&a&&ue(a,s),at&&i&&te(i,s),at=o,mt.allowYield=D,e.finishFunctionDeclaration(c,p,C,t,l)}function Lu(){var e,u,t,n,i,r,a,s,o,l=null,D=[],c=[],p=new _;return o=mt.allowYield,re("function"),s=ae("*"),s&&W(),mt.allowYield=!s,ae("(")||(e=dt,l=at||s||!se("yield")?Ze():Le(),at?h(e.value)&&te(e,nt.StrictFunctionName):h(e.value)?(t=e,n=nt.StrictFunctionName):f(e.value)&&(t=e,n=nt.StrictReservedWord)),i=Iu(t),D=i.params,c=i.defaults,u=i.stricted,t=i.firstRestricted,i.message&&(n=i.message),a=at,r=wu(),at&&t&&ue(t,n),at&&u&&te(u,n),at=a,mt.allowYield=o,p.finishFunctionExpression(l,D,c,r,s)}function Tu(){var e,u,t,n,i,r,a,s=!1;for(e=new _,ne("{"),n=[];!ae("}");)ae(";")?W():(i=new _,u=dt,t=!1,r=ae("["),ae("*")?W():(a=Be(),"static"===a.name&&(ye()||ae("*"))&&(u=dt,t=!0,r=ae("["),ae("*")?W():a=Be())),i=ge(u,a,r,i),i?(i["static"]=t,"init"===i.kind&&(i.kind="method"),t?i.computed||"prototype"!==(i.key.name||i.key.value.toString())||ue(u,nt.StaticPrototype):i.computed||"constructor"!==(i.key.name||i.key.value.toString())||(("method"!==i.kind||!i.method||i.value.generator)&&ue(u,nt.ConstructorSpecialMethod),s?ue(u,nt.DuplicateConstructor):s=!0,i.kind="constructor"),i.type=ut.MethodDefinition,delete i.method,delete i.shorthand,n.push(i)):ue(dt));return W(),e.finishClassBody(n)}function Nu(e){var u,t=null,n=null,i=new _,r=at;return at=!0,re("class"),e&&dt.type!==Qu.Identifier||(t=Ze()),se("extends")&&(W(),n=ce(Re)),u=Tu(),at=r,i.finishClassDeclaration(t,n,u)}function Ou(){var e,u=null,t=null,n=new _,i=at;return at=!0,re("class"),dt.type===Qu.Identifier&&(u=Ze()),se("extends")&&(W(),t=ce(Re)),e=Tu(),at=i,n.finishClassExpression(u,t,e)}function Ru(){var e=new _;return dt.type!==Qu.StringLiteral&&Q(nt.InvalidModuleSpecifier),e.finishLiteral(W())}function Uu(){var e,u,t,n=new _;return se("default")?(t=new _,W(),u=t.finishIdentifier("default")):u=Ze(),oe("as")&&(W(),e=Le()),n.finishExportSpecifier(u,e)}function Yu(e){var u,t=null,n=null,i=[];if(dt.type===Qu.Keyword)switch(dt.value){case"let":case"const":return t=ou({inFor:!1}),e.finishExportNamedDeclaration(t,i,null);case"var":case"class":case"function":return t=Xe(),e.finishExportNamedDeclaration(t,i,null)}for(ne("{");!ae("}")&&(u=u||se("default"),i.push(Uu()),ae("}")||(ne(","),!ae("}"))););return ne("}"),oe("from")?(W(),n=Ru(),De()):u?Q(dt.value?nt.UnexpectedToken:nt.MissingFromClause,dt.value):De(),e.finishExportNamedDeclaration(t,i,n)}function Mu(e){var u=null,t=null;return re("default"),se("function")?(u=Pu(new _,!0),e.finishExportDefaultDeclaration(u)):se("class")?(u=Nu(!0),e.finishExportDefaultDeclaration(u)):(oe("from")&&Q(nt.UnexpectedToken,dt.value),t=ae("{")?ve():ae("[")?Ee():$e(),De(),e.finishExportDefaultDeclaration(t))}function ju(e){var u;return ne("*"),oe("from")||Q(dt.value?nt.UnexpectedToken:nt.MissingFromClause,dt.value),W(),u=Ru(),De(),e.finishExportAllDeclaration(u)}function Vu(){var e=new _;return mt.inFunctionBody&&Q(nt.IllegalExportDeclaration),re("export"),se("default")?Mu(e):ae("*")?ju(e):Yu(e)}function Wu(){var e,u,t=new _;return u=Le(),oe("as")&&(W(),e=Ze()),t.finishImportSpecifier(e,u)}function Hu(){var e=[];for(ne("{");!ae("}")&&(e.push(Wu()),ae("}")||(ne(","),!ae("}"))););return ne("}"),e}function Ku(){var e,u=new _;return e=Le(),u.finishImportDefaultSpecifier(e)}function qu(){var e,u=new _;return ne("*"),oe("as")||Q(nt.NoAsAfterImportNamespace),W(),e=Le(),u.finishImportNamespaceSpecifier(e)}function zu(){var e,u=[],t=new _;return mt.inFunctionBody&&Q(nt.IllegalImportDeclaration),re("import"),dt.type===Qu.StringLiteral?e=Ru():(ae("{")?u=u.concat(Hu()):ae("*")?u.push(qu()):Y(dt)&&!se("default")?(u.push(Ku()),ae(",")&&(W(),ae("*")?u.push(qu()):ae("{")?u=u.concat(Hu()):ue(dt))):ue(W()),oe("from")||Q(dt.value?nt.UnexpectedToken:nt.MissingFromClause,dt.value),W(),e=Ru()),De(),t.finishImportDeclaration(u,e)}function _u(){for(var e,u,t,n,i=[];Et>pt&&(u=dt,u.type===Qu.StringLiteral)&&(e=Xe(),i.push(e),e.expression.type===ut.Literal);)t=rt.slice(u.start+1,u.end-1),"use strict"===t?(at=!0,n&&te(n,nt.StrictOctalLiteral)):!n&&u.octal&&(n=u);for(;Et>pt&&(e=Xe(),"undefined"!=typeof e);)i.push(e);return i}function $u(){var e,u;return H(),u=new _,e=_u(),u.finishProgram(e,mt.sourceType)}function Gu(){var e,u,t,n=[];for(e=0;e<Bt.tokens.length;++e)u=Bt.tokens[e],t={type:u.type,value:u.value},u.regex&&(t.regex={pattern:u.regex.pattern,flags:u.regex.flags}),Bt.range&&(t.range=u.range),Bt.loc&&(t.loc=u.loc),n.push(t);Bt.tokens=n}function Xu(e,u,t){var n,i;n=String,"string"==typeof e||e instanceof String||(e=n(e)),rt=e,st=0,ot=rt.length>0?1:0,lt=0,pt=st,Ct=ot,Ft=lt,Et=rt.length,dt=null,mt={allowIn:!0,allowYield:!0,labelSet:{},inFunctionBody:!1,inIteration:!1,inSwitch:!1,lastCommentStart:-1,curlyStack:[]},Bt={},u=u||{},u.tokens=!0,Bt.tokens=[],Bt.tokenValues=[],Bt.tokenize=!0,Bt.delegate=t,Bt.openParenToken=-1,Bt.openCurlyToken=-1,Bt.range="boolean"==typeof u.range&&u.range,Bt.loc="boolean"==typeof u.loc&&u.loc,"boolean"==typeof u.comment&&u.comment&&(Bt.comments=[]),"boolean"==typeof u.tolerant&&u.tolerant&&(Bt.errors=[]);try{if(H(),dt.type===Qu.EOF)return Bt.tokens;for(W();dt.type!==Qu.EOF;)try{W()}catch(r){if(Bt.errors){G(r);break}throw r}i=Bt.tokens,"undefined"!=typeof Bt.errors&&(i.errors=Bt.errors)}catch(a){throw a}finally{Bt={}}return i}function Ju(e,u){var t,n;n=String,"string"==typeof e||e instanceof String||(e=n(e)),rt=e,st=0,ot=rt.length>0?1:0,lt=0,pt=st,Ct=ot,Ft=lt,Et=rt.length,dt=null,mt={allowIn:!0,allowYield:!0,labelSet:{},inFunctionBody:!1,inIteration:!1,inSwitch:!1,lastCommentStart:-1,curlyStack:[],sourceType:"script"},at=!1,Bt={},"undefined"!=typeof u&&(Bt.range="boolean"==typeof u.range&&u.range,Bt.loc="boolean"==typeof u.loc&&u.loc,Bt.attachComment="boolean"==typeof u.attachComment&&u.attachComment,Bt.loc&&null!==u.source&&void 0!==u.source&&(Bt.source=n(u.source)),"boolean"==typeof u.tokens&&u.tokens&&(Bt.tokens=[]),"boolean"==typeof u.comment&&u.comment&&(Bt.comments=[]),"boolean"==typeof u.tolerant&&u.tolerant&&(Bt.errors=[]),Bt.attachComment&&(Bt.range=!0,Bt.comments=[],Bt.bottomRightStack=[],Bt.trailingComments=[],Bt.leadingComments=[]),"module"===u.sourceType&&(mt.sourceType=u.sourceType,at=!0));try{t=$u(),"undefined"!=typeof Bt.comments&&(t.comments=Bt.comments),"undefined"!=typeof Bt.tokens&&(Gu(),t.tokens=Bt.tokens),"undefined"!=typeof Bt.errors&&(t.errors=Bt.errors)}catch(i){throw i}finally{Bt={}}return t}var Qu,Zu,et,ut,tt,nt,it,rt,at,st,ot,lt,Dt,ct,ft,ht,pt,Ct,Ft,At,Et,dt,mt,Bt,yt,gt,St;Qu={BooleanLiteral:1,EOF:2,Identifier:3,Keyword:4,NullLiteral:5,NumericLiteral:6,Punctuator:7,StringLiteral:8,RegularExpression:9,Template:10},Zu={},Zu[Qu.BooleanLiteral]="Boolean",Zu[Qu.EOF]="<end>",Zu[Qu.Identifier]="Identifier",Zu[Qu.Keyword]="Keyword",Zu[Qu.NullLiteral]="Null",Zu[Qu.NumericLiteral]="Numeric",Zu[Qu.Punctuator]="Punctuator",Zu[Qu.StringLiteral]="String",Zu[Qu.RegularExpression]="RegularExpression",Zu[Qu.Template]="Template",et=["(","{","[","in","typeof","instanceof","new","return","case","delete","throw","void","=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","&=","|=","^=",",","+","-","*","/","%","++","--","<<",">>",">>>","&","|","^","!","~","&&","||","?",":","===","==",">=","<=","<",">","!=","!=="],ut={AssignmentExpression:"AssignmentExpression",AssignmentPattern:"AssignmentPattern",ArrayExpression:"ArrayExpression",ArrayPattern:"ArrayPattern",ArrowFunctionExpression:"ArrowFunctionExpression",BlockStatement:"BlockStatement",BinaryExpression:"BinaryExpression",BreakStatement:"BreakStatement",CallExpression:"CallExpression",CatchClause:"CatchClause",ClassBody:"ClassBody",ClassDeclaration:"ClassDeclaration",ClassExpression:"ClassExpression",ConditionalExpression:"ConditionalExpression",ContinueStatement:"ContinueStatement",DoWhileStatement:"DoWhileStatement",DebuggerStatement:"DebuggerStatement",EmptyStatement:"EmptyStatement",ExportAllDeclaration:"ExportAllDeclaration",ExportDefaultDeclaration:"ExportDefaultDeclaration",ExportNamedDeclaration:"ExportNamedDeclaration",ExportSpecifier:"ExportSpecifier",ExpressionStatement:"ExpressionStatement",ForStatement:"ForStatement",ForOfStatement:"ForOfStatement",ForInStatement:"ForInStatement",FunctionDeclaration:"FunctionDeclaration",FunctionExpression:"FunctionExpression",Identifier:"Identifier",IfStatement:"IfStatement",ImportDeclaration:"ImportDeclaration",ImportDefaultSpecifier:"ImportDefaultSpecifier",ImportNamespaceSpecifier:"ImportNamespaceSpecifier",ImportSpecifier:"ImportSpecifier",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",MetaProperty:"MetaProperty",MethodDefinition:"MethodDefinition",NewExpression:"NewExpression",ObjectExpression:"ObjectExpression",ObjectPattern:"ObjectPattern",Program:"Program",Property:"Property",RestElement:"RestElement",ReturnStatement:"ReturnStatement",SequenceExpression:"SequenceExpression",SpreadElement:"SpreadElement",Super:"Super",SwitchCase:"SwitchCase",SwitchStatement:"SwitchStatement",TaggedTemplateExpression:"TaggedTemplateExpression",TemplateElement:"TemplateElement",TemplateLiteral:"TemplateLiteral",ThisExpression:"ThisExpression",ThrowStatement:"ThrowStatement",TryStatement:"TryStatement",UnaryExpression:"UnaryExpression",UpdateExpression:"UpdateExpression",VariableDeclaration:"VariableDeclaration",VariableDeclarator:"VariableDeclarator",WhileStatement:"WhileStatement",WithStatement:"WithStatement",YieldExpression:"YieldExpression"},tt={ArrowParameterPlaceHolder:"ArrowParameterPlaceHolder"},nt={UnexpectedToken:"Unexpected token %0",UnexpectedNumber:"Unexpected number",UnexpectedString:"Unexpected string",UnexpectedIdentifier:"Unexpected identifier",UnexpectedReserved:"Unexpected reserved word",UnexpectedTemplate:"Unexpected quasi %0",UnexpectedEOS:"Unexpected end of input",NewlineAfterThrow:"Illegal newline after throw",InvalidRegExp:"Invalid regular expression",UnterminatedRegExp:"Invalid regular expression: missing /",InvalidLHSInAssignment:"Invalid left-hand side in assignment",InvalidLHSInForIn:"Invalid left-hand side in for-in",InvalidLHSInForLoop:"Invalid left-hand side in for-loop",MultipleDefaultsInSwitch:"More than one default clause in switch statement",NoCatchOrFinally:"Missing catch or finally after try",UnknownLabel:"Undefined label '%0'",Redeclaration:"%0 '%1' has already been declared",IllegalContinue:"Illegal continue statement",IllegalBreak:"Illegal break statement",IllegalReturn:"Illegal return statement",StrictModeWith:"Strict mode code may not include a with statement",StrictCatchVariable:"Catch variable may not be eval or arguments in strict mode",StrictVarName:"Variable name may not be eval or arguments in strict mode",StrictParamName:"Parameter name eval or arguments is not allowed in strict mode",StrictParamDupe:"Strict mode function may not have duplicate parameter names",StrictFunctionName:"Function name may not be eval or arguments in strict mode",StrictOctalLiteral:"Octal literals are not allowed in strict mode.",StrictDelete:"Delete of an unqualified identifier in strict mode.",StrictLHSAssignment:"Assignment to eval or arguments is not allowed in strict mode",StrictLHSPostfix:"Postfix increment/decrement may not have eval or arguments operand in strict mode",StrictLHSPrefix:"Prefix increment/decrement may not have eval or arguments operand in strict mode",StrictReservedWord:"Use of future reserved word in strict mode",TemplateOctalLiteral:"Octal literals are not allowed in template strings.",ParameterAfterRestParameter:"Rest parameter must be last formal parameter",DefaultRestParameter:"Unexpected token =",ObjectPatternAsRestParameter:"Unexpected token {",DuplicateProtoProperty:"Duplicate __proto__ fields are not allowed in object literals",ConstructorSpecialMethod:"Class constructor may not be an accessor",DuplicateConstructor:"A class may only have one constructor",StaticPrototype:"Classes may not have static property named prototype",MissingFromClause:"Unexpected token",NoAsAfterImportNamespace:"Unexpected token",InvalidModuleSpecifier:"Unexpected token",IllegalImportDeclaration:"Unexpected token",IllegalExportDeclaration:"Unexpected token",DuplicateBinding:"Duplicate binding %0"},it={NonAsciiIdentifierStart:/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,NonAsciiIdentifierPart:/[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/},$.prototype=_.prototype={processComment:function(){var e,u,t,n,i,r,a=Bt.bottomRightStack,s=a[a.length-1];if(!(this.type===ut.Program&&this.body.length>0)){if(this.type===ut.BlockStatement&&0===this.body.length){for(u=[],i=Bt.leadingComments.length-1;i>=0;--i)r=Bt.leadingComments[i],this.range[1]>=r.range[1]&&(u.unshift(r),Bt.leadingComments.splice(i,1),Bt.trailingComments.splice(i,1));if(u.length)return void(this.innerComments=u)}if(Bt.trailingComments.length>0){
for(n=[],i=Bt.trailingComments.length-1;i>=0;--i)r=Bt.trailingComments[i],r.range[0]>=this.range[1]&&(n.unshift(r),Bt.trailingComments.splice(i,1));Bt.trailingComments=[]}else s&&s.trailingComments&&s.trailingComments[0].range[0]>=this.range[1]&&(n=s.trailingComments,delete s.trailingComments);for(;s&&s.range[0]>=this.range[0];)e=a.pop(),s=a[a.length-1];if(e){if(e.leadingComments){for(t=[],i=e.leadingComments.length-1;i>=0;--i)r=e.leadingComments[i],r.range[1]<=this.range[0]&&(t.unshift(r),e.leadingComments.splice(i,1));e.leadingComments.length||(e.leadingComments=void 0)}}else if(Bt.leadingComments.length>0)for(t=[],i=Bt.leadingComments.length-1;i>=0;--i)r=Bt.leadingComments[i],r.range[1]<=this.range[0]&&(t.unshift(r),Bt.leadingComments.splice(i,1));t&&t.length>0&&(this.leadingComments=t),n&&n.length>0&&(this.trailingComments=n),a.push(this)}},finish:function(){Bt.range&&(this.range[1]=ct),Bt.loc&&(this.loc.end={line:ft,column:ct-ht},Bt.source&&(this.loc.source=Bt.source)),Bt.attachComment&&this.processComment()},finishArrayExpression:function(e){return this.type=ut.ArrayExpression,this.elements=e,this.finish(),this},finishArrayPattern:function(e){return this.type=ut.ArrayPattern,this.elements=e,this.finish(),this},finishArrowFunctionExpression:function(e,u,t,n){return this.type=ut.ArrowFunctionExpression,this.id=null,this.params=e,this.defaults=u,this.body=t,this.generator=!1,this.expression=n,this.finish(),this},finishAssignmentExpression:function(e,u,t){return this.type=ut.AssignmentExpression,this.operator=e,this.left=u,this.right=t,this.finish(),this},finishAssignmentPattern:function(e,u){return this.type=ut.AssignmentPattern,this.left=e,this.right=u,this.finish(),this},finishBinaryExpression:function(e,u,t){return this.type="||"===e||"&&"===e?ut.LogicalExpression:ut.BinaryExpression,this.operator=e,this.left=u,this.right=t,this.finish(),this},finishBlockStatement:function(e){return this.type=ut.BlockStatement,this.body=e,this.finish(),this},finishBreakStatement:function(e){return this.type=ut.BreakStatement,this.label=e,this.finish(),this},finishCallExpression:function(e,u){return this.type=ut.CallExpression,this.callee=e,this.arguments=u,this.finish(),this},finishCatchClause:function(e,u){return this.type=ut.CatchClause,this.param=e,this.body=u,this.finish(),this},finishClassBody:function(e){return this.type=ut.ClassBody,this.body=e,this.finish(),this},finishClassDeclaration:function(e,u,t){return this.type=ut.ClassDeclaration,this.id=e,this.superClass=u,this.body=t,this.finish(),this},finishClassExpression:function(e,u,t){return this.type=ut.ClassExpression,this.id=e,this.superClass=u,this.body=t,this.finish(),this},finishConditionalExpression:function(e,u,t){return this.type=ut.ConditionalExpression,this.test=e,this.consequent=u,this.alternate=t,this.finish(),this},finishContinueStatement:function(e){return this.type=ut.ContinueStatement,this.label=e,this.finish(),this},finishDebuggerStatement:function(){return this.type=ut.DebuggerStatement,this.finish(),this},finishDoWhileStatement:function(e,u){return this.type=ut.DoWhileStatement,this.body=e,this.test=u,this.finish(),this},finishEmptyStatement:function(){return this.type=ut.EmptyStatement,this.finish(),this},finishExpressionStatement:function(e){return this.type=ut.ExpressionStatement,this.expression=e,this.finish(),this},finishForStatement:function(e,u,t,n){return this.type=ut.ForStatement,this.init=e,this.test=u,this.update=t,this.body=n,this.finish(),this},finishForOfStatement:function(e,u,t){return this.type=ut.ForOfStatement,this.left=e,this.right=u,this.body=t,this.finish(),this},finishForInStatement:function(e,u,t){return this.type=ut.ForInStatement,this.left=e,this.right=u,this.body=t,this.each=!1,this.finish(),this},finishFunctionDeclaration:function(e,u,t,n,i){return this.type=ut.FunctionDeclaration,this.id=e,this.params=u,this.defaults=t,this.body=n,this.generator=i,this.expression=!1,this.finish(),this},finishFunctionExpression:function(e,u,t,n,i){return this.type=ut.FunctionExpression,this.id=e,this.params=u,this.defaults=t,this.body=n,this.generator=i,this.expression=!1,this.finish(),this},finishIdentifier:function(e){return this.type=ut.Identifier,this.name=e,this.finish(),this},finishIfStatement:function(e,u,t){return this.type=ut.IfStatement,this.test=e,this.consequent=u,this.alternate=t,this.finish(),this},finishLabeledStatement:function(e,u){return this.type=ut.LabeledStatement,this.label=e,this.body=u,this.finish(),this},finishLiteral:function(e){return this.type=ut.Literal,this.value=e.value,this.raw=rt.slice(e.start,e.end),e.regex&&(this.regex=e.regex),this.finish(),this},finishMemberExpression:function(e,u,t){return this.type=ut.MemberExpression,this.computed="["===e,this.object=u,this.property=t,this.finish(),this},finishMetaProperty:function(e,u){return this.type=ut.MetaProperty,this.meta=e,this.property=u,this.finish(),this},finishNewExpression:function(e,u){return this.type=ut.NewExpression,this.callee=e,this.arguments=u,this.finish(),this},finishObjectExpression:function(e){return this.type=ut.ObjectExpression,this.properties=e,this.finish(),this},finishObjectPattern:function(e){return this.type=ut.ObjectPattern,this.properties=e,this.finish(),this},finishPostfixExpression:function(e,u){return this.type=ut.UpdateExpression,this.operator=e,this.argument=u,this.prefix=!1,this.finish(),this},finishProgram:function(e,u){return this.type=ut.Program,this.body=e,this.sourceType=u,this.finish(),this},finishProperty:function(e,u,t,n,i,r){return this.type=ut.Property,this.key=u,this.computed=t,this.value=n,this.kind=e,this.method=i,this.shorthand=r,this.finish(),this},finishRestElement:function(e){return this.type=ut.RestElement,this.argument=e,this.finish(),this},finishReturnStatement:function(e){return this.type=ut.ReturnStatement,this.argument=e,this.finish(),this},finishSequenceExpression:function(e){return this.type=ut.SequenceExpression,this.expressions=e,this.finish(),this},finishSpreadElement:function(e){return this.type=ut.SpreadElement,this.argument=e,this.finish(),this},finishSwitchCase:function(e,u){return this.type=ut.SwitchCase,this.test=e,this.consequent=u,this.finish(),this},finishSuper:function(){return this.type=ut.Super,this.finish(),this},finishSwitchStatement:function(e,u){return this.type=ut.SwitchStatement,this.discriminant=e,this.cases=u,this.finish(),this},finishTaggedTemplateExpression:function(e,u){return this.type=ut.TaggedTemplateExpression,this.tag=e,this.quasi=u,this.finish(),this},finishTemplateElement:function(e,u){return this.type=ut.TemplateElement,this.value=e,this.tail=u,this.finish(),this},finishTemplateLiteral:function(e,u){return this.type=ut.TemplateLiteral,this.quasis=e,this.expressions=u,this.finish(),this},finishThisExpression:function(){return this.type=ut.ThisExpression,this.finish(),this},finishThrowStatement:function(e){return this.type=ut.ThrowStatement,this.argument=e,this.finish(),this},finishTryStatement:function(e,u,t){return this.type=ut.TryStatement,this.block=e,this.guardedHandlers=[],this.handlers=u?[u]:[],this.handler=u,this.finalizer=t,this.finish(),this},finishUnaryExpression:function(e,u){return this.type="++"===e||"--"===e?ut.UpdateExpression:ut.UnaryExpression,this.operator=e,this.argument=u,this.prefix=!0,this.finish(),this},finishVariableDeclaration:function(e){return this.type=ut.VariableDeclaration,this.declarations=e,this.kind="var",this.finish(),this},finishLexicalDeclaration:function(e,u){return this.type=ut.VariableDeclaration,this.declarations=e,this.kind=u,this.finish(),this},finishVariableDeclarator:function(e,u){return this.type=ut.VariableDeclarator,this.id=e,this.init=u,this.finish(),this},finishWhileStatement:function(e,u){return this.type=ut.WhileStatement,this.test=e,this.body=u,this.finish(),this},finishWithStatement:function(e,u){return this.type=ut.WithStatement,this.object=e,this.body=u,this.finish(),this},finishExportSpecifier:function(e,u){return this.type=ut.ExportSpecifier,this.exported=u||e,this.local=e,this.finish(),this},finishImportDefaultSpecifier:function(e){return this.type=ut.ImportDefaultSpecifier,this.local=e,this.finish(),this},finishImportNamespaceSpecifier:function(e){return this.type=ut.ImportNamespaceSpecifier,this.local=e,this.finish(),this},finishExportNamedDeclaration:function(e,u,t){return this.type=ut.ExportNamedDeclaration,this.declaration=e,this.specifiers=u,this.source=t,this.finish(),this},finishExportDefaultDeclaration:function(e){return this.type=ut.ExportDefaultDeclaration,this.declaration=e,this.finish(),this},finishExportAllDeclaration:function(e){return this.type=ut.ExportAllDeclaration,this.source=e,this.finish(),this},finishImportSpecifier:function(e,u){return this.type=ut.ImportSpecifier,this.local=e||u,this.imported=u,this.finish(),this},finishImportDeclaration:function(e,u){return this.type=ut.ImportDeclaration,this.specifiers=e,this.source=u,this.finish(),this},finishYieldExpression:function(e,u){return this.type=ut.YieldExpression,this.argument=e,this.delegate=u,this.finish(),this}},e.version="2.7.1",e.tokenize=Xu,e.parse=Ju,e.Syntax=function(){var e,u={};"function"==typeof Object.create&&(u=Object.create(null));for(e in ut)ut.hasOwnProperty(e)&&(u[e]=ut[e]);return"function"==typeof Object.freeze&&Object.freeze(u),u}()});

},{}],19:[function(require,module,exports){
function EventEmitter(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function isFunction(e){return"function"==typeof e}function isNumber(e){return"number"==typeof e}function isObject(e){return"object"==typeof e&&null!==e}function isUndefined(e){return void 0===e}module.exports=EventEmitter,EventEmitter.EventEmitter=EventEmitter,EventEmitter.prototype._events=void 0,EventEmitter.prototype._maxListeners=void 0,EventEmitter.defaultMaxListeners=10,EventEmitter.prototype.setMaxListeners=function(e){if(!isNumber(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},EventEmitter.prototype.emit=function(e){var t,n,i,s,r,o;if(this._events||(this._events={}),"error"===e&&(!this._events.error||isObject(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(n=this._events[e],isUndefined(n))return!1;if(isFunction(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:s=Array.prototype.slice.call(arguments,1),n.apply(this,s)}else if(isObject(n))for(s=Array.prototype.slice.call(arguments,1),o=n.slice(),i=o.length,r=0;i>r;r++)o[r].apply(this,s);return!0},EventEmitter.prototype.addListener=function(e,t){var n;if(!isFunction(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,isFunction(t.listener)?t.listener:t),this._events[e]?isObject(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,isObject(this._events[e])&&!this._events[e].warned&&(n=isUndefined(this._maxListeners)?EventEmitter.defaultMaxListeners:this._maxListeners,n&&n>0&&this._events[e].length>n&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())),this},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.once=function(e,t){function n(){this.removeListener(e,n),i||(i=!0,t.apply(this,arguments))}if(!isFunction(t))throw TypeError("listener must be a function");var i=!1;return n.listener=t,this.on(e,n),this},EventEmitter.prototype.removeListener=function(e,t){var n,i,s,r;if(!isFunction(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],s=n.length,i=-1,n===t||isFunction(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(isObject(n)){for(r=s;r-- >0;)if(n[r]===t||n[r].listener&&n[r].listener===t){i=r;break}if(0>i)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(i,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},EventEmitter.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],isFunction(n))this.removeListener(e,n);else if(n)for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},EventEmitter.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?isFunction(this._events[e])?[this._events[e]]:this._events[e].slice():[]},EventEmitter.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(isFunction(t))return 1;if(t)return t.length}return 0},EventEmitter.listenerCount=function(e,t){return e.listenerCount(t)};

},{}],20:[function(require,module,exports){
var http=require("http"),https=module.exports;for(var key in http)http.hasOwnProperty(key)&&(https[key]=http[key]);https.request=function(t,e){return t||(t={}),t.scheme="https",t.protocol="https:",http.request.call(this,t,e)};

},{"http":93}],21:[function(require,module,exports){
exports.read=function(a,o,t,r,h){var M,p,w=8*h-r-1,f=(1<<w)-1,e=f>>1,i=-7,N=t?h-1:0,n=t?-1:1,s=a[o+N];for(N+=n,M=s&(1<<-i)-1,s>>=-i,i+=w;i>0;M=256*M+a[o+N],N+=n,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+a[o+N],N+=n,i-=8);if(0===M)M=1-e;else{if(M===f)return p?NaN:(s?-1:1)*(1/0);p+=Math.pow(2,r),M-=e}return(s?-1:1)*p*Math.pow(2,M-r)},exports.write=function(a,o,t,r,h,M){var p,w,f,e=8*M-h-1,i=(1<<e)-1,N=i>>1,n=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,s=r?0:M-1,u=r?1:-1,l=0>o||0===o&&0>1/o?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(w=isNaN(o)?1:0,p=i):(p=Math.floor(Math.log(o)/Math.LN2),o*(f=Math.pow(2,-p))<1&&(p--,f*=2),o+=p+N>=1?n/f:n*Math.pow(2,1-N),o*f>=2&&(p++,f/=2),p+N>=i?(w=0,p=i):p+N>=1?(w=(o*f-1)*Math.pow(2,h),p+=N):(w=o*Math.pow(2,N-1)*Math.pow(2,h),p=0));h>=8;a[t+s]=255&w,s+=u,w/=256,h-=8);for(p=p<<h|w,e+=h;e>0;a[t+s]=255&p,s+=u,p/=256,e-=8);a[t+s-u]|=128*l};

},{}],22:[function(require,module,exports){
/*!
 * node-inherit
 * Copyright(c) 2011 Dmitry Filatov <dfilatov@yandex-team.ru>
 * MIT Licensed
 */
module.exports=require("./lib/inherit");

},{"./lib/inherit":23}],23:[function(require,module,exports){
!function(t){function r(t){var r=a(t);if(v)for(var n,o=0;n=g[o++];)t.hasOwnProperty(n)&&r.push(n);return r}function n(t,n,o){for(var e,i,c=r(o),f=0,a=c.length;a>f;)"__self"!==(e=c[f++])&&(i=o[e],l(i)&&(!u||i.toString().indexOf(".__base")>-1)?n[e]=function(r,o){var e=t[r]?t[r]:"__constructor"===r?n.__self.__parent:y;return function(){var t=this.__base;this.__base=e;var r=o.apply(this,arguments);return this.__base=t,r}}(e,i):n[e]=i)}function o(t,r){for(var n,o=1;n=t[o++];)r?l(n)?e.self(r,n.prototype,n):e.self(r,n):r=l(n)?e(t[0],n.prototype,n):e(t[0],n);return r||t[0]}function e(){var t=arguments,r=_(t[0]),e=r||l(t[0]),u=e?r?o(t[0]):t[0]:i,c=t[e?1:0]||{},a=t[e?2:1],s=c.__constructor||e&&u.prototype.__constructor?function(){return this.__constructor.apply(this,arguments)}:e?function(){return u.apply(this,arguments)}:function(){};if(!e)return s.prototype=c,s.prototype.__self=s.prototype.constructor=s,p(s,a);p(s,u),s.__parent=u;var y=u.prototype,v=s.prototype=f(y);return v.__self=v.constructor=s,c&&n(y,v,c),a&&n(u,s,a),s}var u=function(){"_"}.toString().indexOf("_")>-1,i=function(){},c=Object.prototype.hasOwnProperty,f=Object.create||function(t){var r=function(){};return r.prototype=t,new r},a=Object.keys||function(t){var r=[];for(var n in t)c.call(t,n)&&r.push(n);return r},p=function(t,r){for(var n in r)c.call(r,n)&&(t[n]=r[n]);return t},s=Object.prototype.toString,_=Array.isArray||function(t){return"[object Array]"===s.call(t)},l=function(t){return"[object Function]"===s.call(t)},y=function(){},v=!0,h={toString:""};for(var b in h)h.hasOwnProperty(b)&&(v=!1);var g=v?["toString","valueOf"]:null;e.self=function(){var t=arguments,r=_(t[0]),e=r?o(t[0],t[0][0]):t[0],u=t[1],i=t[2],c=e.prototype;return u&&n(c,c,u),i&&n(e,e,i),e};var O=!0;"object"==typeof exports&&(module.exports=e,O=!1),"object"==typeof modules&&(modules.define("inherit",function(t){t(e)}),O=!1),"function"==typeof define&&(define(function(t,r,n){n.exports=e}),O=!1),O&&(t.inherit=e)}(this);

},{}],24:[function(require,module,exports){
"function"==typeof Object.create?module.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t};

},{}],25:[function(require,module,exports){
module.exports=function(r){return!(null==r||!(r._isBuffer||r.constructor&&"function"==typeof r.constructor.isBuffer&&r.constructor.isBuffer(r)))};

},{}],26:[function(require,module,exports){
module.exports=Array.isArray||function(r){return"[object Array]"==Object.prototype.toString.call(r)};

},{}],27:[function(require,module,exports){
"use strict";var yaml=require("./lib/js-yaml.js");module.exports=yaml;

},{"./lib/js-yaml.js":28}],28:[function(require,module,exports){
"use strict";function deprecated(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}var loader=require("./js-yaml/loader"),dumper=require("./js-yaml/dumper");module.exports.Type=require("./js-yaml/type"),module.exports.Schema=require("./js-yaml/schema"),module.exports.FAILSAFE_SCHEMA=require("./js-yaml/schema/failsafe"),module.exports.JSON_SCHEMA=require("./js-yaml/schema/json"),module.exports.CORE_SCHEMA=require("./js-yaml/schema/core"),module.exports.DEFAULT_SAFE_SCHEMA=require("./js-yaml/schema/default_safe"),module.exports.DEFAULT_FULL_SCHEMA=require("./js-yaml/schema/default_full"),module.exports.load=loader.load,module.exports.loadAll=loader.loadAll,module.exports.safeLoad=loader.safeLoad,module.exports.safeLoadAll=loader.safeLoadAll,module.exports.dump=dumper.dump,module.exports.safeDump=dumper.safeDump,module.exports.YAMLException=require("./js-yaml/exception"),module.exports.MINIMAL_SCHEMA=require("./js-yaml/schema/failsafe"),module.exports.SAFE_SCHEMA=require("./js-yaml/schema/default_safe"),module.exports.DEFAULT_SCHEMA=require("./js-yaml/schema/default_full"),module.exports.scan=deprecated("scan"),module.exports.parse=deprecated("parse"),module.exports.compose=deprecated("compose"),module.exports.addConstructor=deprecated("addConstructor");

},{"./js-yaml/dumper":30,"./js-yaml/exception":31,"./js-yaml/loader":32,"./js-yaml/schema":34,"./js-yaml/schema/core":35,"./js-yaml/schema/default_full":36,"./js-yaml/schema/default_safe":37,"./js-yaml/schema/failsafe":38,"./js-yaml/schema/json":39,"./js-yaml/type":40}],29:[function(require,module,exports){
"use strict";function isNothing(e){return"undefined"==typeof e||null===e}function isObject(e){return"object"==typeof e&&null!==e}function toArray(e){return Array.isArray(e)?e:isNothing(e)?[]:[e]}function extend(e,t){var r,o,n,i;if(t)for(i=Object.keys(t),r=0,o=i.length;o>r;r+=1)n=i[r],e[n]=t[n];return e}function repeat(e,t){var r,o="";for(r=0;t>r;r+=1)o+=e;return o}function isNegativeZero(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e}module.exports.isNothing=isNothing,module.exports.isObject=isObject,module.exports.toArray=toArray,module.exports.repeat=repeat,module.exports.isNegativeZero=isNegativeZero,module.exports.extend=extend;

},{}],30:[function(require,module,exports){
"use strict";function compileStyleMap(e,t){var n,i,r,E,o,s,c;if(null===t)return{};for(n={},i=Object.keys(t),r=0,E=i.length;E>r;r+=1)o=i[r],s=String(t[o]),"!!"===o.slice(0,2)&&(o="tag:yaml.org,2002:"+o.slice(2)),c=e.compiledTypeMap[o],c&&_hasOwnProperty.call(c.styleAliases,s)&&(s=c.styleAliases[s]),n[o]=s;return n}function encodeHex(e){var t,n,i;if(t=e.toString(16).toUpperCase(),255>=e)n="x",i=2;else if(65535>=e)n="u",i=4;else{if(!(4294967295>=e))throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");n="U",i=8}return"\\"+n+common.repeat("0",i-t.length)+t}function State(e){this.schema=e.schema||DEFAULT_FULL_SCHEMA,this.indent=Math.max(1,e.indent||2),this.skipInvalid=e.skipInvalid||!1,this.flowLevel=common.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=compileStyleMap(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function indentString(e,t){for(var n,i=common.repeat(" ",t),r=0,E=-1,o="",s=e.length;s>r;)E=e.indexOf("\n",r),-1===E?(n=e.slice(r),r=s):(n=e.slice(r,E+1),r=E+1),n.length&&"\n"!==n&&(o+=i),o+=n;return o}function generateNextLine(e,t){return"\n"+common.repeat(" ",e.indent*t)}function testImplicitResolving(e,t){var n,i,r;for(n=0,i=e.implicitTypes.length;i>n;n+=1)if(r=e.implicitTypes[n],r.resolve(t))return!0;return!1}function StringBuilder(e){this.source=e,this.result="",this.checkpoint=0}function writeScalar(e,t,n,i){var r,E,o,s,c,p,l,u,A,a,C,_,d,f,S,h,R,m,g,N,H;if(0===t.length)return void(e.dump="''");if(-1!==DEPRECATED_BOOLEANS_SYNTAX.indexOf(t))return void(e.dump="'"+t+"'");for(r=!0,E=t.length?t.charCodeAt(0):0,o=CHAR_SPACE===E||CHAR_SPACE===t.charCodeAt(t.length-1),(CHAR_MINUS===E||CHAR_QUESTION===E||CHAR_COMMERCIAL_AT===E||CHAR_GRAVE_ACCENT===E)&&(r=!1),o?(r=!1,s=!1,c=!1):(s=!i,c=!i),p=!0,l=new StringBuilder(t),u=!1,A=0,a=0,C=e.indent*n,_=e.lineWidth,-1===_&&(_=9007199254740991),40>C?_-=C:_=40,f=0;f<t.length;f++){if(d=t.charCodeAt(f),r){if(simpleChar(d))continue;r=!1}p&&d===CHAR_SINGLE_QUOTE&&(p=!1),S=ESCAPE_SEQUENCES[d],h=needsHexEscape(d),(S||h)&&(d!==CHAR_LINE_FEED&&d!==CHAR_DOUBLE_QUOTE&&d!==CHAR_SINGLE_QUOTE?(s=!1,c=!1):d===CHAR_LINE_FEED&&(u=!0,p=!1,f>0&&(R=t.charCodeAt(f-1),R===CHAR_SPACE&&(c=!1,s=!1)),s&&(m=f-A,A=f,m>a&&(a=m))),d!==CHAR_DOUBLE_QUOTE&&(p=!1),l.takeUpTo(f),l.escapeChar())}if(r&&testImplicitResolving(e,t)&&(r=!1),g="",(s||c)&&(N=0,t.charCodeAt(t.length-1)===CHAR_LINE_FEED&&(N+=1,t.charCodeAt(t.length-2)===CHAR_LINE_FEED&&(N+=1)),0===N?g="-":2===N&&(g="+")),c&&_>a&&(s=!1),u||(c=!1),r)e.dump=t;else if(p)e.dump="'"+t+"'";else if(s)H=fold(t,_),e.dump=">"+g+"\n"+indentString(H,C);else if(c)g||(t=t.replace(/\n$/,"")),e.dump="|"+g+"\n"+indentString(t,C);else{if(!l)throw new Error("Failed to dump scalar value");l.finish(),e.dump='"'+l.result+'"'}}function fold(e,t){var n,i="",r=0,E=e.length,o=/\n+$/.exec(e);for(o&&(E=o.index+1);E>r;)n=e.indexOf("\n",r),n>E||-1===n?(i&&(i+="\n\n"),i+=foldLine(e.slice(r,E),t),r=E):(i&&(i+="\n\n"),i+=foldLine(e.slice(r,n),t),r=n+1);return o&&"\n"!==o[0]&&(i+=o[0]),i}function foldLine(e,t){if(""===e)return e;for(var n,i,r,E=/[^\s] [^\s]/g,o="",s=0,c=0,p=E.exec(e);p;)n=p.index,n-c>t&&(i=s!==c?s:n,o&&(o+="\n"),r=e.slice(c,i),o+=r,c=i+1),s=n+1,p=E.exec(e);return o&&(o+="\n"),o+=c!==s&&e.length-c>t?e.slice(c,s)+"\n"+e.slice(s+1):e.slice(c)}function simpleChar(e){return CHAR_TAB!==e&&CHAR_LINE_FEED!==e&&CHAR_CARRIAGE_RETURN!==e&&CHAR_COMMA!==e&&CHAR_LEFT_SQUARE_BRACKET!==e&&CHAR_RIGHT_SQUARE_BRACKET!==e&&CHAR_LEFT_CURLY_BRACKET!==e&&CHAR_RIGHT_CURLY_BRACKET!==e&&CHAR_SHARP!==e&&CHAR_AMPERSAND!==e&&CHAR_ASTERISK!==e&&CHAR_EXCLAMATION!==e&&CHAR_VERTICAL_LINE!==e&&CHAR_GREATER_THAN!==e&&CHAR_SINGLE_QUOTE!==e&&CHAR_DOUBLE_QUOTE!==e&&CHAR_PERCENT!==e&&CHAR_COLON!==e&&!ESCAPE_SEQUENCES[e]&&!needsHexEscape(e)}function needsHexEscape(e){return!(e>=32&&126>=e||133===e||e>=160&&55295>=e||e>=57344&&65533>=e||e>=65536&&1114111>=e)}function writeFlowSequence(e,t,n){var i,r,E="",o=e.tag;for(i=0,r=n.length;r>i;i+=1)writeNode(e,t,n[i],!1,!1)&&(0!==i&&(E+=", "),E+=e.dump);e.tag=o,e.dump="["+E+"]"}function writeBlockSequence(e,t,n,i){var r,E,o="",s=e.tag;for(r=0,E=n.length;E>r;r+=1)writeNode(e,t+1,n[r],!0,!0)&&(i&&0===r||(o+=generateNextLine(e,t)),o+="- "+e.dump);e.tag=s,e.dump=o||"[]"}function writeFlowMapping(e,t,n){var i,r,E,o,s,c="",p=e.tag,l=Object.keys(n);for(i=0,r=l.length;r>i;i+=1)s="",0!==i&&(s+=", "),E=l[i],o=n[E],writeNode(e,t,E,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+": ",writeNode(e,t,o,!1,!1)&&(s+=e.dump,c+=s));e.tag=p,e.dump="{"+c+"}"}function writeBlockMapping(e,t,n,i){var r,E,o,s,c,p,l="",u=e.tag,A=Object.keys(n);if(e.sortKeys===!0)A.sort();else if("function"==typeof e.sortKeys)A.sort(e.sortKeys);else if(e.sortKeys)throw new YAMLException("sortKeys must be a boolean or a function");for(r=0,E=A.length;E>r;r+=1)p="",i&&0===r||(p+=generateNextLine(e,t)),o=A[r],s=n[o],writeNode(e,t+1,o,!0,!0,!0)&&(c=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024,c&&(p+=e.dump&&CHAR_LINE_FEED===e.dump.charCodeAt(0)?"?":"? "),p+=e.dump,c&&(p+=generateNextLine(e,t)),writeNode(e,t+1,s,!0,c)&&(p+=e.dump&&CHAR_LINE_FEED===e.dump.charCodeAt(0)?":":": ",p+=e.dump,l+=p));e.tag=u,e.dump=l||"{}"}function detectType(e,t,n){var i,r,E,o,s,c;for(r=n?e.explicitTypes:e.implicitTypes,E=0,o=r.length;o>E;E+=1)if(s=r[E],(s.instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(e.tag=n?s.tag:"?",s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===_toString.call(s.represent))i=s.represent(t,c);else{if(!_hasOwnProperty.call(s.represent,c))throw new YAMLException("!<"+s.tag+'> tag resolver accepts not "'+c+'" style');i=s.represent[c](t,c)}e.dump=i}return!0}return!1}function writeNode(e,t,n,i,r,E){e.tag=null,e.dump=n,detectType(e,n,!1)||detectType(e,n,!0);var o=_toString.call(e.dump);i&&(i=0>e.flowLevel||e.flowLevel>t);var s,c,p="[object Object]"===o||"[object Array]"===o;if(p&&(s=e.duplicates.indexOf(n),c=-1!==s),(null!==e.tag&&"?"!==e.tag||c||2!==e.indent&&t>0)&&(r=!1),c&&e.usedDuplicates[s])e.dump="*ref_"+s;else{if(p&&c&&!e.usedDuplicates[s]&&(e.usedDuplicates[s]=!0),"[object Object]"===o)i&&0!==Object.keys(e.dump).length?(writeBlockMapping(e,t,e.dump,r),c&&(e.dump="&ref_"+s+e.dump)):(writeFlowMapping(e,t,e.dump),c&&(e.dump="&ref_"+s+" "+e.dump));else if("[object Array]"===o)i&&0!==e.dump.length?(writeBlockSequence(e,t,e.dump,r),c&&(e.dump="&ref_"+s+e.dump)):(writeFlowSequence(e,t,e.dump),c&&(e.dump="&ref_"+s+" "+e.dump));else{if("[object String]"!==o){if(e.skipInvalid)return!1;throw new YAMLException("unacceptable kind of an object to dump "+o)}"?"!==e.tag&&writeScalar(e,e.dump,t,E)}null!==e.tag&&"?"!==e.tag&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function getDuplicateReferences(e,t){var n,i,r=[],E=[];for(inspectNode(e,r,E),n=0,i=E.length;i>n;n+=1)t.duplicates.push(r[E[n]]);t.usedDuplicates=new Array(i)}function inspectNode(e,t,n){var i,r,E;if(null!==e&&"object"==typeof e)if(r=t.indexOf(e),-1!==r)-1===n.indexOf(r)&&n.push(r);else if(t.push(e),Array.isArray(e))for(r=0,E=e.length;E>r;r+=1)inspectNode(e[r],t,n);else for(i=Object.keys(e),r=0,E=i.length;E>r;r+=1)inspectNode(e[i[r]],t,n)}function dump(e,t){t=t||{};var n=new State(t);return getDuplicateReferences(e,n),writeNode(n,0,e,!0,!0)?n.dump+"\n":""}function safeDump(e,t){return dump(e,common.extend({schema:DEFAULT_SAFE_SCHEMA},t))}var common=require("./common"),YAMLException=require("./exception"),DEFAULT_FULL_SCHEMA=require("./schema/default_full"),DEFAULT_SAFE_SCHEMA=require("./schema/default_safe"),_toString=Object.prototype.toString,_hasOwnProperty=Object.prototype.hasOwnProperty,CHAR_TAB=9,CHAR_LINE_FEED=10,CHAR_CARRIAGE_RETURN=13,CHAR_SPACE=32,CHAR_EXCLAMATION=33,CHAR_DOUBLE_QUOTE=34,CHAR_SHARP=35,CHAR_PERCENT=37,CHAR_AMPERSAND=38,CHAR_SINGLE_QUOTE=39,CHAR_ASTERISK=42,CHAR_COMMA=44,CHAR_MINUS=45,CHAR_COLON=58,CHAR_GREATER_THAN=62,CHAR_QUESTION=63,CHAR_COMMERCIAL_AT=64,CHAR_LEFT_SQUARE_BRACKET=91,CHAR_RIGHT_SQUARE_BRACKET=93,CHAR_GRAVE_ACCENT=96,CHAR_LEFT_CURLY_BRACKET=123,CHAR_VERTICAL_LINE=124,CHAR_RIGHT_CURLY_BRACKET=125,ESCAPE_SEQUENCES={};ESCAPE_SEQUENCES[0]="\\0",ESCAPE_SEQUENCES[7]="\\a",ESCAPE_SEQUENCES[8]="\\b",ESCAPE_SEQUENCES[9]="\\t",ESCAPE_SEQUENCES[10]="\\n",ESCAPE_SEQUENCES[11]="\\v",ESCAPE_SEQUENCES[12]="\\f",ESCAPE_SEQUENCES[13]="\\r",ESCAPE_SEQUENCES[27]="\\e",ESCAPE_SEQUENCES[34]='\\"',ESCAPE_SEQUENCES[92]="\\\\",ESCAPE_SEQUENCES[133]="\\N",ESCAPE_SEQUENCES[160]="\\_",ESCAPE_SEQUENCES[8232]="\\L",ESCAPE_SEQUENCES[8233]="\\P";var DEPRECATED_BOOLEANS_SYNTAX=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];StringBuilder.prototype.takeUpTo=function(e){var t;if(e<this.checkpoint)throw t=new Error("position should be > checkpoint"),t.position=e,t.checkpoint=this.checkpoint,t;return this.result+=this.source.slice(this.checkpoint,e),this.checkpoint=e,this},StringBuilder.prototype.escapeChar=function(){var e,t;return e=this.source.charCodeAt(this.checkpoint),t=ESCAPE_SEQUENCES[e]||encodeHex(e),this.result+=t,this.checkpoint+=1,this},StringBuilder.prototype.finish=function(){this.source.length>this.checkpoint&&this.takeUpTo(this.source.length)},module.exports.dump=dump,module.exports.safeDump=safeDump;

},{"./common":29,"./exception":31,"./schema/default_full":36,"./schema/default_safe":37}],31:[function(require,module,exports){
"use strict";function YAMLException(r,t){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||"",this.name="YAMLException",this.reason=r,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():"")}var inherits=require("inherit");inherits(YAMLException,Error),YAMLException.prototype.toString=function(r){var t=this.name+": ";return t+=this.reason||"(unknown reason)",!r&&this.mark&&(t+=" "+this.mark.toString()),t},module.exports=YAMLException;

},{"inherit":22}],32:[function(require,module,exports){
"use strict";function is_EOL(e){return 10===e||13===e}function is_WHITE_SPACE(e){return 9===e||32===e}function is_WS_OR_EOL(e){return 9===e||32===e||10===e||13===e}function is_FLOW_INDICATOR(e){return 44===e||91===e||93===e||123===e||125===e}function fromHexCode(e){var t;return e>=48&&57>=e?e-48:(t=32|e,t>=97&&102>=t?t-97+10:-1)}function escapedHexLen(e){return 120===e?2:117===e?4:85===e?8:0}function fromDecimalCode(e){return e>=48&&57>=e?e-48:-1}function simpleEscapeSequence(e){return 48===e?"\x00":97===e?"":98===e?"\b":116===e?"	":9===e?"	":110===e?"\n":118===e?"\x0B":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function charFromCodepoint(e){return 65535>=e?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function State(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||DEFAULT_FULL_SCHEMA,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function generateError(e,t){return new YAMLException(t,new Mark(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function throwError(e,t){throw generateError(e,t)}function throwWarning(e,t){e.onWarning&&e.onWarning.call(null,generateError(e,t))}function captureSegment(e,t,n,i){var o,r,a,p;if(n>t){if(p=e.input.slice(t,n),i)for(o=0,r=p.length;r>o;o+=1)a=p.charCodeAt(o),9===a||a>=32&&1114111>=a||throwError(e,"expected valid JSON character");else PATTERN_NON_PRINTABLE.test(p)&&throwError(e,"the stream contains non-printable characters");e.result+=p}}function mergeMappings(e,t,n){var i,o,r,a;for(common.isObject(n)||throwError(e,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(n),r=0,a=i.length;a>r;r+=1)o=i[r],_hasOwnProperty.call(t,o)||(t[o]=n[o])}function storeMappingPair(e,t,n,i,o){var r,a;if(i=String(i),null===t&&(t={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(o))for(r=0,a=o.length;a>r;r+=1)mergeMappings(e,t,o[r]);else mergeMappings(e,t,o);else t[i]=o;return t}function readLineBreak(e){var t;t=e.input.charCodeAt(e.position),10===t?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):throwError(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function skipSeparationSpace(e,t,n){for(var i=0,o=e.input.charCodeAt(e.position);0!==o;){for(;is_WHITE_SPACE(o);)o=e.input.charCodeAt(++e.position);if(t&&35===o)do o=e.input.charCodeAt(++e.position);while(10!==o&&13!==o&&0!==o);if(!is_EOL(o))break;for(readLineBreak(e),o=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==n&&0!==i&&e.lineIndent<n&&throwWarning(e,"deficient indentation"),i}function testDocumentSeparator(e){var t,n=e.position;return t=e.input.charCodeAt(n),45!==t&&46!==t||e.input.charCodeAt(n+1)!==t||e.input.charCodeAt(n+2)!==t||(n+=3,t=e.input.charCodeAt(n),0!==t&&!is_WS_OR_EOL(t))?!1:!0}function writeFoldedLines(e,t){1===t?e.result+=" ":t>1&&(e.result+=common.repeat("\n",t-1))}function readPlainScalar(e,t,n){var i,o,r,a,p,s,c,l,u,d=e.kind,h=e.result;if(u=e.input.charCodeAt(e.position),is_WS_OR_EOL(u)||is_FLOW_INDICATOR(u)||35===u||38===u||42===u||33===u||124===u||62===u||39===u||34===u||37===u||64===u||96===u)return!1;if((63===u||45===u)&&(o=e.input.charCodeAt(e.position+1),is_WS_OR_EOL(o)||n&&is_FLOW_INDICATOR(o)))return!1;for(e.kind="scalar",e.result="",r=a=e.position,p=!1;0!==u;){if(58===u){if(o=e.input.charCodeAt(e.position+1),is_WS_OR_EOL(o)||n&&is_FLOW_INDICATOR(o))break}else if(35===u){if(i=e.input.charCodeAt(e.position-1),is_WS_OR_EOL(i))break}else{if(e.position===e.lineStart&&testDocumentSeparator(e)||n&&is_FLOW_INDICATOR(u))break;if(is_EOL(u)){if(s=e.line,c=e.lineStart,l=e.lineIndent,skipSeparationSpace(e,!1,-1),e.lineIndent>=t){p=!0,u=e.input.charCodeAt(e.position);continue}e.position=a,e.line=s,e.lineStart=c,e.lineIndent=l;break}}p&&(captureSegment(e,r,a,!1),writeFoldedLines(e,e.line-s),r=a=e.position,p=!1),is_WHITE_SPACE(u)||(a=e.position+1),u=e.input.charCodeAt(++e.position)}return captureSegment(e,r,a,!1),e.result?!0:(e.kind=d,e.result=h,!1)}function readSingleQuotedScalar(e,t){var n,i,o;if(n=e.input.charCodeAt(e.position),39!==n)return!1;for(e.kind="scalar",e.result="",e.position++,i=o=e.position;0!==(n=e.input.charCodeAt(e.position));)if(39===n){if(captureSegment(e,i,e.position,!0),n=e.input.charCodeAt(++e.position),39!==n)return!0;i=o=e.position,e.position++}else is_EOL(n)?(captureSegment(e,i,o,!0),writeFoldedLines(e,skipSeparationSpace(e,!1,t)),i=o=e.position):e.position===e.lineStart&&testDocumentSeparator(e)?throwError(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);throwError(e,"unexpected end of the stream within a single quoted scalar")}function readDoubleQuotedScalar(e,t){var n,i,o,r,a,p;if(p=e.input.charCodeAt(e.position),34!==p)return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;0!==(p=e.input.charCodeAt(e.position));){if(34===p)return captureSegment(e,n,e.position,!0),e.position++,!0;if(92===p){if(captureSegment(e,n,e.position,!0),p=e.input.charCodeAt(++e.position),is_EOL(p))skipSeparationSpace(e,!1,t);else if(256>p&&simpleEscapeCheck[p])e.result+=simpleEscapeMap[p],e.position++;else if((a=escapedHexLen(p))>0){for(o=a,r=0;o>0;o--)p=e.input.charCodeAt(++e.position),(a=fromHexCode(p))>=0?r=(r<<4)+a:throwError(e,"expected hexadecimal character");e.result+=charFromCodepoint(r),e.position++}else throwError(e,"unknown escape sequence");n=i=e.position}else is_EOL(p)?(captureSegment(e,n,i,!0),writeFoldedLines(e,skipSeparationSpace(e,!1,t)),n=i=e.position):e.position===e.lineStart&&testDocumentSeparator(e)?throwError(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}throwError(e,"unexpected end of the stream within a double quoted scalar")}function readFlowCollection(e,t){var n,i,o,r,a,p,s,c,l,u,d,h=!0,f=e.tag,_=e.anchor;if(d=e.input.charCodeAt(e.position),91===d)r=93,s=!1,i=[];else{if(123!==d)return!1;r=125,s=!0,i={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=i),d=e.input.charCodeAt(++e.position);0!==d;){if(skipSeparationSpace(e,!0,t),d=e.input.charCodeAt(e.position),d===r)return e.position++,e.tag=f,e.anchor=_,e.kind=s?"mapping":"sequence",e.result=i,!0;h||throwError(e,"missed comma between flow collection entries"),l=c=u=null,a=p=!1,63===d&&(o=e.input.charCodeAt(e.position+1),is_WS_OR_EOL(o)&&(a=p=!0,e.position++,skipSeparationSpace(e,!0,t))),n=e.line,composeNode(e,t,CONTEXT_FLOW_IN,!1,!0),l=e.tag,c=e.result,skipSeparationSpace(e,!0,t),d=e.input.charCodeAt(e.position),!p&&e.line!==n||58!==d||(a=!0,d=e.input.charCodeAt(++e.position),skipSeparationSpace(e,!0,t),composeNode(e,t,CONTEXT_FLOW_IN,!1,!0),u=e.result),s?storeMappingPair(e,i,l,c,u):a?i.push(storeMappingPair(e,null,l,c,u)):i.push(c),skipSeparationSpace(e,!0,t),d=e.input.charCodeAt(e.position),44===d?(h=!0,d=e.input.charCodeAt(++e.position)):h=!1}throwError(e,"unexpected end of the stream within a flow collection")}function readBlockScalar(e,t){var n,i,o,r,a=CHOMPING_CLIP,p=!1,s=t,c=0,l=!1;if(r=e.input.charCodeAt(e.position),124===r)i=!1;else{if(62!==r)return!1;i=!0}for(e.kind="scalar",e.result="";0!==r;)if(r=e.input.charCodeAt(++e.position),43===r||45===r)CHOMPING_CLIP===a?a=43===r?CHOMPING_KEEP:CHOMPING_STRIP:throwError(e,"repeat of a chomping mode identifier");else{if(!((o=fromDecimalCode(r))>=0))break;0===o?throwError(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):p?throwError(e,"repeat of an indentation width identifier"):(s=t+o-1,p=!0)}if(is_WHITE_SPACE(r)){do r=e.input.charCodeAt(++e.position);while(is_WHITE_SPACE(r));if(35===r)do r=e.input.charCodeAt(++e.position);while(!is_EOL(r)&&0!==r)}for(;0!==r;){for(readLineBreak(e),e.lineIndent=0,r=e.input.charCodeAt(e.position);(!p||e.lineIndent<s)&&32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position);if(!p&&e.lineIndent>s&&(s=e.lineIndent),is_EOL(r))c++;else{if(e.lineIndent<s){a===CHOMPING_KEEP?e.result+=common.repeat("\n",c):a===CHOMPING_CLIP&&p&&(e.result+="\n");break}for(i?is_WHITE_SPACE(r)?(l=!0,e.result+=common.repeat("\n",c+1)):l?(l=!1,e.result+=common.repeat("\n",c+1)):0===c?p&&(e.result+=" "):e.result+=common.repeat("\n",c):p?e.result+=common.repeat("\n",c+1):e.result+=common.repeat("\n",c),p=!0,c=0,n=e.position;!is_EOL(r)&&0!==r;)r=e.input.charCodeAt(++e.position);captureSegment(e,n,e.position,!1)}}return!0}function readBlockSequence(e,t){var n,i,o,r=e.tag,a=e.anchor,p=[],s=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=p),o=e.input.charCodeAt(e.position);0!==o&&45===o&&(i=e.input.charCodeAt(e.position+1),is_WS_OR_EOL(i));)if(s=!0,e.position++,skipSeparationSpace(e,!0,-1)&&e.lineIndent<=t)p.push(null),o=e.input.charCodeAt(e.position);else if(n=e.line,composeNode(e,t,CONTEXT_BLOCK_IN,!1,!0),p.push(e.result),skipSeparationSpace(e,!0,-1),o=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&0!==o)throwError(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return s?(e.tag=r,e.anchor=a,e.kind="sequence",e.result=p,!0):!1}function readBlockMapping(e,t,n){var i,o,r,a,p=e.tag,s=e.anchor,c={},l=null,u=null,d=null,h=!1,f=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=c),a=e.input.charCodeAt(e.position);0!==a;){if(i=e.input.charCodeAt(e.position+1),r=e.line,63!==a&&58!==a||!is_WS_OR_EOL(i)){if(!composeNode(e,n,CONTEXT_FLOW_OUT,!1,!0))break;if(e.line===r){for(a=e.input.charCodeAt(e.position);is_WHITE_SPACE(a);)a=e.input.charCodeAt(++e.position);if(58===a)a=e.input.charCodeAt(++e.position),is_WS_OR_EOL(a)||throwError(e,"a whitespace character is expected after the key-value separator within a block mapping"),h&&(storeMappingPair(e,c,l,u,null),l=u=d=null),f=!0,h=!1,o=!1,l=e.tag,u=e.result;else{if(!f)return e.tag=p,e.anchor=s,!0;throwError(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!f)return e.tag=p,e.anchor=s,!0;throwError(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===a?(h&&(storeMappingPair(e,c,l,u,null),l=u=d=null),f=!0,h=!0,o=!0):h?(h=!1,o=!0):throwError(e,"incomplete explicit mapping pair; a key node is missed"),e.position+=1,a=i;if((e.line===r||e.lineIndent>t)&&(composeNode(e,t,CONTEXT_BLOCK_OUT,!0,o)&&(h?u=e.result:d=e.result),h||(storeMappingPair(e,c,l,u,d),l=u=d=null),skipSeparationSpace(e,!0,-1),a=e.input.charCodeAt(e.position)),e.lineIndent>t&&0!==a)throwError(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return h&&storeMappingPair(e,c,l,u,null),f&&(e.tag=p,e.anchor=s,e.kind="mapping",e.result=c),f}function readTagProperty(e){var t,n,i,o,r=!1,a=!1;if(o=e.input.charCodeAt(e.position),33!==o)return!1;if(null!==e.tag&&throwError(e,"duplication of a tag property"),o=e.input.charCodeAt(++e.position),60===o?(r=!0,o=e.input.charCodeAt(++e.position)):33===o?(a=!0,n="!!",o=e.input.charCodeAt(++e.position)):n="!",t=e.position,r){do o=e.input.charCodeAt(++e.position);while(0!==o&&62!==o);e.position<e.length?(i=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):throwError(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!is_WS_OR_EOL(o);)33===o&&(a?throwError(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),PATTERN_TAG_HANDLE.test(n)||throwError(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),PATTERN_FLOW_INDICATORS.test(i)&&throwError(e,"tag suffix cannot contain flow indicator characters")}return i&&!PATTERN_TAG_URI.test(i)&&throwError(e,"tag name cannot contain such characters: "+i),r?e.tag=i:_hasOwnProperty.call(e.tagMap,n)?e.tag=e.tagMap[n]+i:"!"===n?e.tag="!"+i:"!!"===n?e.tag="tag:yaml.org,2002:"+i:throwError(e,'undeclared tag handle "'+n+'"'),!0}function readAnchorProperty(e){var t,n;if(n=e.input.charCodeAt(e.position),38!==n)return!1;for(null!==e.anchor&&throwError(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!is_WS_OR_EOL(n)&&!is_FLOW_INDICATOR(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&throwError(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function readAlias(e){var t,n,i;if(i=e.input.charCodeAt(e.position),42!==i)return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!is_WS_OR_EOL(i)&&!is_FLOW_INDICATOR(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&throwError(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),e.anchorMap.hasOwnProperty(n)||throwError(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],skipSeparationSpace(e,!0,-1),!0}function composeNode(e,t,n,i,o){var r,a,p,s,c,l,u,d,h=1,f=!1,_=!1;if(e.tag=null,e.anchor=null,e.kind=null,e.result=null,r=a=p=CONTEXT_BLOCK_OUT===n||CONTEXT_BLOCK_IN===n,i&&skipSeparationSpace(e,!0,-1)&&(f=!0,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)),1===h)for(;readTagProperty(e)||readAnchorProperty(e);)skipSeparationSpace(e,!0,-1)?(f=!0,p=r,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)):p=!1;if(p&&(p=f||o),(1===h||CONTEXT_BLOCK_OUT===n)&&(u=CONTEXT_FLOW_IN===n||CONTEXT_FLOW_OUT===n?t:t+1,d=e.position-e.lineStart,1===h?p&&(readBlockSequence(e,d)||readBlockMapping(e,d,u))||readFlowCollection(e,u)?_=!0:(a&&readBlockScalar(e,u)||readSingleQuotedScalar(e,u)||readDoubleQuotedScalar(e,u)?_=!0:readAlias(e)?(_=!0,(null!==e.tag||null!==e.anchor)&&throwError(e,"alias node should not have any properties")):readPlainScalar(e,u,CONTEXT_FLOW_IN===n)&&(_=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===h&&(_=p&&readBlockSequence(e,d))),null!==e.tag&&"!"!==e.tag)if("?"===e.tag){for(s=0,c=e.implicitTypes.length;c>s;s+=1)if(l=e.implicitTypes[s],l.resolve(e.result)){e.result=l.construct(e.result),e.tag=l.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else _hasOwnProperty.call(e.typeMap,e.tag)?(l=e.typeMap[e.tag],null!==e.result&&l.kind!==e.kind&&throwError(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+l.kind+'", not "'+e.kind+'"'),l.resolve(e.result)?(e.result=l.construct(e.result),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):throwError(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):throwError(e,"unknown tag !<"+e.tag+">");return null!==e.tag||null!==e.anchor||_}function readDocument(e){var t,n,i,o,r=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};0!==(o=e.input.charCodeAt(e.position))&&(skipSeparationSpace(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==o));){for(a=!0,o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!is_WS_OR_EOL(o);)o=e.input.charCodeAt(++e.position);for(n=e.input.slice(t,e.position),i=[],n.length<1&&throwError(e,"directive name must not be less than one character in length");0!==o;){for(;is_WHITE_SPACE(o);)o=e.input.charCodeAt(++e.position);if(35===o){do o=e.input.charCodeAt(++e.position);while(0!==o&&!is_EOL(o));break}if(is_EOL(o))break;for(t=e.position;0!==o&&!is_WS_OR_EOL(o);)o=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==o&&readLineBreak(e),_hasOwnProperty.call(directiveHandlers,n)?directiveHandlers[n](e,n,i):throwWarning(e,'unknown document directive "'+n+'"')}return skipSeparationSpace(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,skipSeparationSpace(e,!0,-1)):a&&throwError(e,"directives end mark is expected"),composeNode(e,e.lineIndent-1,CONTEXT_BLOCK_OUT,!1,!0),skipSeparationSpace(e,!0,-1),e.checkLineBreaks&&PATTERN_NON_ASCII_LINE_BREAKS.test(e.input.slice(r,e.position))&&throwWarning(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&testDocumentSeparator(e)?void(46===e.input.charCodeAt(e.position)&&(e.position+=3,skipSeparationSpace(e,!0,-1))):void(e.position<e.length-1&&throwError(e,"end of the stream or a document separator is expected"))}function loadDocuments(e,t){e=String(e),t=t||{},0!==e.length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var n=new State(e,t);for(n.input+="\x00";32===n.input.charCodeAt(n.position);)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)readDocument(n);return n.documents}function loadAll(e,t,n){var i,o,r=loadDocuments(e,n);for(i=0,o=r.length;o>i;i+=1)t(r[i])}function load(e,t){var n=loadDocuments(e,t);if(0!==n.length){if(1===n.length)return n[0];throw new YAMLException("expected a single document in the stream, but found more")}}function safeLoadAll(e,t,n){loadAll(e,t,common.extend({schema:DEFAULT_SAFE_SCHEMA},n))}function safeLoad(e,t){return load(e,common.extend({schema:DEFAULT_SAFE_SCHEMA},t))}for(var common=require("./common"),YAMLException=require("./exception"),Mark=require("./mark"),DEFAULT_SAFE_SCHEMA=require("./schema/default_safe"),DEFAULT_FULL_SCHEMA=require("./schema/default_full"),_hasOwnProperty=Object.prototype.hasOwnProperty,CONTEXT_FLOW_IN=1,CONTEXT_FLOW_OUT=2,CONTEXT_BLOCK_IN=3,CONTEXT_BLOCK_OUT=4,CHOMPING_CLIP=1,CHOMPING_STRIP=2,CHOMPING_KEEP=3,PATTERN_NON_PRINTABLE=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,PATTERN_NON_ASCII_LINE_BREAKS=/[\x85\u2028\u2029]/,PATTERN_FLOW_INDICATORS=/[,\[\]\{\}]/,PATTERN_TAG_HANDLE=/^(?:!|!!|![a-z\-]+!)$/i,PATTERN_TAG_URI=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i,simpleEscapeCheck=new Array(256),simpleEscapeMap=new Array(256),i=0;256>i;i++)simpleEscapeCheck[i]=simpleEscapeSequence(i)?1:0,simpleEscapeMap[i]=simpleEscapeSequence(i);var directiveHandlers={YAML:function(e,t,n){var i,o,r;null!==e.version&&throwError(e,"duplication of %YAML directive"),1!==n.length&&throwError(e,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(n[0]),null===i&&throwError(e,"ill-formed argument of the YAML directive"),o=parseInt(i[1],10),r=parseInt(i[2],10),1!==o&&throwError(e,"unacceptable YAML version of the document"),e.version=n[0],e.checkLineBreaks=2>r,1!==r&&2!==r&&throwWarning(e,"unsupported YAML version of the document")},TAG:function(e,t,n){var i,o;2!==n.length&&throwError(e,"TAG directive accepts exactly two arguments"),i=n[0],o=n[1],PATTERN_TAG_HANDLE.test(i)||throwError(e,"ill-formed tag handle (first argument) of the TAG directive"),_hasOwnProperty.call(e.tagMap,i)&&throwError(e,'there is a previously declared suffix for "'+i+'" tag handle'),PATTERN_TAG_URI.test(o)||throwError(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagMap[i]=o}};module.exports.loadAll=loadAll,module.exports.load=load,module.exports.safeLoadAll=safeLoadAll,module.exports.safeLoad=safeLoad;

},{"./common":29,"./exception":31,"./mark":33,"./schema/default_full":36,"./schema/default_safe":37}],33:[function(require,module,exports){
"use strict";function Mark(t,i,n,e,r){this.name=t,this.buffer=i,this.position=n,this.line=e,this.column=r}var common=require("./common");Mark.prototype.getSnippet=function(t,i){var n,e,r,o,s;if(!this.buffer)return null;for(t=t||4,i=i||75,n="",e=this.position;e>0&&-1==="\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(e-1));)if(e-=1,this.position-e>i/2-1){n=" ... ",e+=5;break}for(r="",o=this.position;o<this.buffer.length&&-1==="\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(o));)if(o+=1,o-this.position>i/2-1){r=" ... ",o-=5;break}return s=this.buffer.slice(e,o),common.repeat(" ",t)+n+s+r+"\n"+common.repeat(" ",t+this.position-e+n.length)+"^"},Mark.prototype.toString=function(t){var i,n="";return this.name&&(n+='in "'+this.name+'" '),n+="at line "+(this.line+1)+", column "+(this.column+1),t||(i=this.getSnippet(),i&&(n+=":\n"+i)),n},module.exports=Mark;

},{"./common":29}],34:[function(require,module,exports){
"use strict";function compileList(i,e,t){var c=[];return i.include.forEach(function(i){t=compileList(i,e,t)}),i[e].forEach(function(i){t.forEach(function(e,t){e.tag===i.tag&&c.push(t)}),t.push(i)}),t.filter(function(i,e){return-1===c.indexOf(e)})}function compileMap(){function i(i){c[i.tag]=i}var e,t,c={};for(e=0,t=arguments.length;t>e;e+=1)arguments[e].forEach(i);return c}function Schema(i){this.include=i.include||[],this.implicit=i.implicit||[],this.explicit=i.explicit||[],this.implicit.forEach(function(i){if(i.loadKind&&"scalar"!==i.loadKind)throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=compileList(this,"implicit",[]),this.compiledExplicit=compileList(this,"explicit",[]),this.compiledTypeMap=compileMap(this.compiledImplicit,this.compiledExplicit)}var common=require("./common"),YAMLException=require("./exception"),Type=require("./type");Schema.DEFAULT=null,Schema.create=function(){var i,e;switch(arguments.length){case 1:i=Schema.DEFAULT,e=arguments[0];break;case 2:i=arguments[0],e=arguments[1];break;default:throw new YAMLException("Wrong number of arguments for Schema.create function")}if(i=common.toArray(i),e=common.toArray(e),!i.every(function(i){return i instanceof Schema}))throw new YAMLException("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!e.every(function(i){return i instanceof Type}))throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new Schema({include:i,explicit:e})},module.exports=Schema;

},{"./common":29,"./exception":31,"./type":40}],35:[function(require,module,exports){
"use strict";var Schema=require("../schema");module.exports=new Schema({include:[require("./json")]});

},{"../schema":34,"./json":39}],36:[function(require,module,exports){
"use strict";var Schema=require("../schema");module.exports=Schema.DEFAULT=new Schema({include:[require("./default_safe")],explicit:[require("../type/js/undefined"),require("../type/js/regexp"),require("../type/js/function")]});

},{"../schema":34,"../type/js/function":45,"../type/js/regexp":46,"../type/js/undefined":47,"./default_safe":37}],37:[function(require,module,exports){
"use strict";var Schema=require("../schema");module.exports=new Schema({include:[require("./core")],implicit:[require("../type/timestamp"),require("../type/merge")],explicit:[require("../type/binary"),require("../type/omap"),require("../type/pairs"),require("../type/set")]});

},{"../schema":34,"../type/binary":41,"../type/merge":49,"../type/omap":51,"../type/pairs":52,"../type/set":54,"../type/timestamp":56,"./core":35}],38:[function(require,module,exports){
"use strict";var Schema=require("../schema");module.exports=new Schema({explicit:[require("../type/str"),require("../type/seq"),require("../type/map")]});

},{"../schema":34,"../type/map":48,"../type/seq":53,"../type/str":55}],39:[function(require,module,exports){
"use strict";var Schema=require("../schema");module.exports=new Schema({include:[require("./failsafe")],implicit:[require("../type/null"),require("../type/bool"),require("../type/int"),require("../type/float")]});

},{"../schema":34,"../type/bool":42,"../type/float":43,"../type/int":44,"../type/null":50,"./failsafe":38}],40:[function(require,module,exports){
"use strict";function compileStyleAliases(e){var t={};return null!==e&&Object.keys(e).forEach(function(n){e[n].forEach(function(e){t[String(e)]=n})}),t}function Type(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===TYPE_CONSTRUCTOR_OPTIONS.indexOf(t))throw new YAMLException('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=compileStyleAliases(t.styleAliases||null),-1===YAML_NODE_KINDS.indexOf(this.kind))throw new YAMLException('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}var YAMLException=require("./exception"),TYPE_CONSTRUCTOR_OPTIONS=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],YAML_NODE_KINDS=["scalar","sequence","mapping"];module.exports=Type;

},{"./exception":31}],41:[function(require,module,exports){
"use strict";function resolveYamlBinary(r){if(null===r)return!1;var e,n,u=0,t=r.length,f=BASE64_MAP;for(n=0;t>n;n++)if(e=f.indexOf(r.charAt(n)),!(e>64)){if(0>e)return!1;u+=6}return u%8===0}function constructYamlBinary(r){var e,n,u=r.replace(/[\r\n=]/g,""),t=u.length,f=BASE64_MAP,a=0,i=[];for(e=0;t>e;e++)e%4===0&&e&&(i.push(a>>16&255),i.push(a>>8&255),i.push(255&a)),a=a<<6|f.indexOf(u.charAt(e));return n=t%4*6,0===n?(i.push(a>>16&255),i.push(a>>8&255),i.push(255&a)):18===n?(i.push(a>>10&255),i.push(a>>2&255)):12===n&&i.push(a>>4&255),NodeBuffer?new NodeBuffer(i):i}function representYamlBinary(r){var e,n,u="",t=0,f=r.length,a=BASE64_MAP;for(e=0;f>e;e++)e%3===0&&e&&(u+=a[t>>18&63],u+=a[t>>12&63],u+=a[t>>6&63],u+=a[63&t]),t=(t<<8)+r[e];return n=f%3,0===n?(u+=a[t>>18&63],u+=a[t>>12&63],u+=a[t>>6&63],u+=a[63&t]):2===n?(u+=a[t>>10&63],u+=a[t>>4&63],u+=a[t<<2&63],u+=a[64]):1===n&&(u+=a[t>>2&63],u+=a[t<<4&63],u+=a[64],u+=a[64]),u}function isBinary(r){return NodeBuffer&&NodeBuffer.isBuffer(r)}var NodeBuffer=require("buffer").Buffer,Type=require("../type"),BASE64_MAP="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";module.exports=new Type("tag:yaml.org,2002:binary",{kind:"scalar",resolve:resolveYamlBinary,construct:constructYamlBinary,predicate:isBinary,represent:representYamlBinary});

},{"../type":40,"buffer":8}],42:[function(require,module,exports){
"use strict";function resolveYamlBoolean(e){if(null===e)return!1;var r=e.length;return 4===r&&("true"===e||"True"===e||"TRUE"===e)||5===r&&("false"===e||"False"===e||"FALSE"===e)}function constructYamlBoolean(e){return"true"===e||"True"===e||"TRUE"===e}function isBoolean(e){return"[object Boolean]"===Object.prototype.toString.call(e)}var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:bool",{kind:"scalar",resolve:resolveYamlBoolean,construct:constructYamlBoolean,predicate:isBoolean,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});

},{"../type":40}],43:[function(require,module,exports){
"use strict";function resolveYamlFloat(e){return null===e?!1:YAML_FLOAT_PATTERN.test(e)?!0:!1}function constructYamlFloat(e){var r,t,a,n;return r=e.replace(/_/g,"").toLowerCase(),t="-"===r[0]?-1:1,n=[],0<="+-".indexOf(r[0])&&(r=r.slice(1)),".inf"===r?1===t?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===r?NaN:0<=r.indexOf(":")?(r.split(":").forEach(function(e){n.unshift(parseFloat(e,10))}),r=0,a=1,n.forEach(function(e){r+=e*a,a*=60}),t*r):t*parseFloat(r,10)}function representYamlFloat(e,r){var t;if(isNaN(e))switch(r){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(r){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(r){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(common.isNegativeZero(e))return"-0.0";return t=e.toString(10),SCIENTIFIC_WITHOUT_DOT.test(t)?t.replace("e",".e"):t}function isFloat(e){return"[object Number]"===Object.prototype.toString.call(e)&&(0!==e%1||common.isNegativeZero(e))}var common=require("../common"),Type=require("../type"),YAML_FLOAT_PATTERN=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?|\\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),SCIENTIFIC_WITHOUT_DOT=/^[-+]?[0-9]+e/;module.exports=new Type("tag:yaml.org,2002:float",{kind:"scalar",resolve:resolveYamlFloat,construct:constructYamlFloat,predicate:isFloat,represent:representYamlFloat,defaultStyle:"lowercase"});

},{"../common":29,"../type":40}],44:[function(require,module,exports){
"use strict";function isHexCode(e){return e>=48&&57>=e||e>=65&&70>=e||e>=97&&102>=e}function isOctCode(e){return e>=48&&55>=e}function isDecCode(e){return e>=48&&57>=e}function resolveYamlInteger(e){if(null===e)return!1;var r,t=e.length,n=0,i=!1;if(!t)return!1;if(r=e[n],("-"===r||"+"===r)&&(r=e[++n]),"0"===r){if(n+1===t)return!0;if(r=e[++n],"b"===r){for(n++;t>n;n++)if(r=e[n],"_"!==r){if("0"!==r&&"1"!==r)return!1;i=!0}return i}if("x"===r){for(n++;t>n;n++)if(r=e[n],"_"!==r){if(!isHexCode(e.charCodeAt(n)))return!1;i=!0}return i}for(;t>n;n++)if(r=e[n],"_"!==r){if(!isOctCode(e.charCodeAt(n)))return!1;i=!0}return i}for(;t>n;n++)if(r=e[n],"_"!==r){if(":"===r)break;if(!isDecCode(e.charCodeAt(n)))return!1;i=!0}return i?":"!==r?!0:/^(:[0-5]?[0-9])+$/.test(e.slice(n)):!1}function constructYamlInteger(e){var r,t,n=e,i=1,o=[];return-1!==n.indexOf("_")&&(n=n.replace(/_/g,"")),r=n[0],("-"===r||"+"===r)&&("-"===r&&(i=-1),n=n.slice(1),r=n[0]),"0"===n?0:"0"===r?"b"===n[1]?i*parseInt(n.slice(2),2):"x"===n[1]?i*parseInt(n,16):i*parseInt(n,8):-1!==n.indexOf(":")?(n.split(":").forEach(function(e){o.unshift(parseInt(e,10))}),n=0,t=1,o.forEach(function(e){n+=e*t,t*=60}),i*n):i*parseInt(n,10)}function isInteger(e){return"[object Number]"===Object.prototype.toString.call(e)&&0===e%1&&!common.isNegativeZero(e)}var common=require("../common"),Type=require("../type");module.exports=new Type("tag:yaml.org,2002:int",{kind:"scalar",resolve:resolveYamlInteger,construct:constructYamlInteger,predicate:isInteger,represent:{binary:function(e){return"0b"+e.toString(2)},octal:function(e){return"0"+e.toString(8)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return"0x"+e.toString(16).toUpperCase()}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}});

},{"../common":29,"../type":40}],45:[function(require,module,exports){
"use strict";function resolveJavascriptFunction(e){if(null===e)return!1;try{var r="("+e+")",n=esprima.parse(r,{range:!0});return"Program"!==n.type||1!==n.body.length||"ExpressionStatement"!==n.body[0].type||"FunctionExpression"!==n.body[0].expression.type?!1:!0}catch(t){return!1}}function constructJavascriptFunction(e){var r,n="("+e+")",t=esprima.parse(n,{range:!0}),o=[];if("Program"!==t.type||1!==t.body.length||"ExpressionStatement"!==t.body[0].type||"FunctionExpression"!==t.body[0].expression.type)throw new Error("Failed to resolve function");return t.body[0].expression.params.forEach(function(e){o.push(e.name)}),r=t.body[0].expression.body.range,new Function(o,n.slice(r[0]+1,r[1]-1))}function representJavascriptFunction(e){return e.toString()}function isFunction(e){return"[object Function]"===Object.prototype.toString.call(e)}var esprima;try{esprima=require("esprima")}catch(_){"undefined"!=typeof window&&(esprima=window.esprima)}var Type=require("../../type");module.exports=new Type("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:resolveJavascriptFunction,construct:constructJavascriptFunction,predicate:isFunction,represent:representJavascriptFunction});

},{"../../type":40,"esprima":18}],46:[function(require,module,exports){
"use strict";function resolveJavascriptRegExp(e){if(null===e)return!1;if(0===e.length)return!1;var r=e,t=/\/([gim]*)$/.exec(e),n="";if("/"===r[0]){if(t&&(n=t[1]),n.length>3)return!1;if("/"!==r[r.length-n.length-1])return!1;r=r.slice(1,r.length-n.length-1)}try{return!0}catch(i){return!1}}function constructJavascriptRegExp(e){var r=e,t=/\/([gim]*)$/.exec(e),n="";return"/"===r[0]&&(t&&(n=t[1]),r=r.slice(1,r.length-n.length-1)),new RegExp(r,n)}function representJavascriptRegExp(e){var r="/"+e.source+"/";return e.global&&(r+="g"),e.multiline&&(r+="m"),e.ignoreCase&&(r+="i"),r}function isRegExp(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var Type=require("../../type");module.exports=new Type("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:resolveJavascriptRegExp,construct:constructJavascriptRegExp,predicate:isRegExp,represent:representJavascriptRegExp});

},{"../../type":40}],47:[function(require,module,exports){
"use strict";function resolveJavascriptUndefined(){return!0}function constructJavascriptUndefined(){}function representJavascriptUndefined(){return""}function isUndefined(e){return"undefined"==typeof e}var Type=require("../../type");module.exports=new Type("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:resolveJavascriptUndefined,construct:constructJavascriptUndefined,predicate:isUndefined,represent:representJavascriptUndefined});

},{"../../type":40}],48:[function(require,module,exports){
"use strict";var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}});

},{"../type":40}],49:[function(require,module,exports){
"use strict";function resolveYamlMerge(e){return"<<"===e||null===e}var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:merge",{kind:"scalar",resolve:resolveYamlMerge});

},{"../type":40}],50:[function(require,module,exports){
"use strict";function resolveYamlNull(l){if(null===l)return!0;var e=l.length;return 1===e&&"~"===l||4===e&&("null"===l||"Null"===l||"NULL"===l)}function constructYamlNull(){return null}function isNull(l){return null===l}var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:null",{kind:"scalar",resolve:resolveYamlNull,construct:constructYamlNull,predicate:isNull,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"});

},{"../type":40}],51:[function(require,module,exports){
"use strict";function resolveYamlOmap(r){if(null===r)return!0;var t,e,n,o,u,a=[],l=r;for(t=0,e=l.length;e>t;t+=1){if(n=l[t],u=!1,"[object Object]"!==_toString.call(n))return!1;for(o in n)if(_hasOwnProperty.call(n,o)){if(u)return!1;u=!0}if(!u)return!1;if(-1!==a.indexOf(o))return!1;a.push(o)}return!0}function constructYamlOmap(r){return null!==r?r:[]}var Type=require("../type"),_hasOwnProperty=Object.prototype.hasOwnProperty,_toString=Object.prototype.toString;module.exports=new Type("tag:yaml.org,2002:omap",{kind:"sequence",resolve:resolveYamlOmap,construct:constructYamlOmap});

},{"../type":40}],52:[function(require,module,exports){
"use strict";function resolveYamlPairs(r){if(null===r)return!0;var e,t,n,l,o,a=r;for(o=new Array(a.length),e=0,t=a.length;t>e;e+=1){if(n=a[e],"[object Object]"!==_toString.call(n))return!1;if(l=Object.keys(n),1!==l.length)return!1;o[e]=[l[0],n[l[0]]]}return!0}function constructYamlPairs(r){if(null===r)return[];var e,t,n,l,o,a=r;for(o=new Array(a.length),e=0,t=a.length;t>e;e+=1)n=a[e],l=Object.keys(n),o[e]=[l[0],n[l[0]]];return o}var Type=require("../type"),_toString=Object.prototype.toString;module.exports=new Type("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:resolveYamlPairs,construct:constructYamlPairs});

},{"../type":40}],53:[function(require,module,exports){
"use strict";var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}});

},{"../type":40}],54:[function(require,module,exports){
"use strict";function resolveYamlSet(e){if(null===e)return!0;var r,t=e;for(r in t)if(_hasOwnProperty.call(t,r)&&null!==t[r])return!1;return!0}function constructYamlSet(e){return null!==e?e:{}}var Type=require("../type"),_hasOwnProperty=Object.prototype.hasOwnProperty;module.exports=new Type("tag:yaml.org,2002:set",{kind:"mapping",resolve:resolveYamlSet,construct:constructYamlSet});

},{"../type":40}],55:[function(require,module,exports){
"use strict";var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:str",{kind:"scalar",construct:function(r){return null!==r?r:""}});

},{"../type":40}],56:[function(require,module,exports){
"use strict";function resolveYamlTimestamp(e){return null===e?!1:null===YAML_TIMESTAMP_REGEXP.exec(e)?!1:!0}function constructYamlTimestamp(e){var t,r,n,a,m,s,l,i,T,o,u=0,c=null;if(t=YAML_TIMESTAMP_REGEXP.exec(e),null===t)throw new Error("Date resolve error");if(r=+t[1],n=+t[2]-1,a=+t[3],!t[4])return new Date(Date.UTC(r,n,a));if(m=+t[4],s=+t[5],l=+t[6],t[7]){for(u=t[7].slice(0,3);u.length<3;)u+="0";u=+u}return t[9]&&(i=+t[10],T=+(t[11]||0),c=6e4*(60*i+T),"-"===t[9]&&(c=-c)),o=new Date(Date.UTC(r,n,a,m,s,l,u)),c&&o.setTime(o.getTime()-c),o}function representYamlTimestamp(e){return e.toISOString()}var Type=require("../type"),YAML_TIMESTAMP_REGEXP=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?)?$");module.exports=new Type("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:resolveYamlTimestamp,construct:constructYamlTimestamp,instanceOf:Date,represent:representYamlTimestamp});

},{"../type":40}],57:[function(require,module,exports){
/** !
 * JSON Schema $Ref Parser v1.4.1
 *
 * @link https://github.com/BigstickCarpet/json-schema-ref-parser
 * @license MIT
 */
"use strict";function bundle(e,r){util.debug("Bundling $ref pointers in %s",e._basePath),remap(e.$refs,r),dereference(e._basePath,e.$refs,r)}function remap(e,r){var t=[];Object.keys(e._$refs).forEach(function(f){var a=e._$refs[f];crawl(a.value,a.path+"#",e,t,r)});for(var f=0;f<t.length;f++){var a=t[f];a.old$Ref.$ref=a.new$Ref.$ref}}function crawl(e,r,t,f,a){e&&"object"==typeof e&&Object.keys(e).forEach(function(o){var u=Pointer.join(r,o),n=e[o];if($Ref.is$Ref(n)){util.debug('Re-mapping $ref pointer "%s" at %s',n.$ref,u);var i=url.resolve(r,n.$ref),s=t._resolve(i,a),l=s.$ref.pathFromRoot+util.path.getHash(s.path).substr(1);util.debug("    new value: %s",l),f.push({old$Ref:n,new$Ref:{$ref:l}})}else crawl(n,u,t,f,a)})}function dereference(e,r,t){e=util.path.stripHash(e),Object.keys(r._$refs).forEach(function(f){var a=r._$refs[f];"#"!==a.pathFromRoot&&r.set(e+a.pathFromRoot,a.value,t)})}var $Ref=require("./ref"),Pointer=require("./pointer"),util=require("./util"),url=require("url");module.exports=bundle;

},{"./pointer":62,"./ref":65,"./util":68,"url":100}],58:[function(require,module,exports){
"use strict";function dereference(e,r){util.debug("Dereferencing $ref pointers in %s",e._basePath),e.$refs.circular=!1,crawl(e.schema,e._basePath,[],e.$refs,r)}function crawl(e,r,n,c,f){var u=!1;return e&&"object"==typeof e&&(n.push(e),Object.keys(e).forEach(function(i){var t=Pointer.join(r,i),o=e[i],a=!1;if($Ref.isAllowed$Ref(o,f)){util.debug('Dereferencing $ref pointer "%s" at %s',o.$ref,t);var l=url.resolve(r,o.$ref),s=c._resolve(l,f);a=s.circular||-1!==n.indexOf(s.value),a&&foundCircularReference(t,c,f);var d=getDereferencedValue(o,s.value);a||(a=crawl(d,s.path,n,c,f)),a&&f.$refs.circular!==!0||(e[i]=d)}else a=-1===n.indexOf(o)?crawl(o,t,n,c,f):foundCircularReference(t,c,f);u=u||a}),n.pop()),u}function getDereferencedValue(e,r){if(r&&"object"==typeof r&&Object.keys(e).length>1){var n={};return Object.keys(e).forEach(function(r){"$ref"!==r&&(n[r]=e[r])}),Object.keys(r).forEach(function(e){e in n||(n[e]=r[e])}),n}return r}function foundCircularReference(e,r,n){if(r.circular=!0,!n.$refs.circular)throw ono.reference("Circular $ref pointer found at %s",e);return!0}var $Ref=require("./ref"),Pointer=require("./pointer"),util=require("./util"),ono=require("ono"),url=require("url");module.exports=dereference;

},{"./pointer":62,"./ref":65,"./util":68,"ono":75,"url":100}],59:[function(require,module,exports){
(function (Buffer){
"use strict";function $RefParser(){this.schema=null,this.$refs=new $Refs,this._basePath=""}function normalizeArgs(e){var r=e[1],t=e[2];return"function"==typeof r&&(t=r,r=void 0),r instanceof Options||(r=new Options(r)),{schema:e[0],options:r,callback:t}}var Promise=require("./promise"),Options=require("./options"),$Refs=require("./refs"),$Ref=require("./ref"),read=require("./read"),resolve=require("./resolve"),bundle=require("./bundle"),dereference=require("./dereference"),util=require("./util"),url=require("url"),maybe=require("call-me-maybe"),ono=require("ono");module.exports=$RefParser,module.exports.YAML=require("./yaml"),$RefParser.parse=function(e,r,t){var s=this;return(new s).parse(e,r,t)},$RefParser.prototype.parse=function(e,r,t){var s=normalizeArgs(arguments);if(s.schema&&"object"==typeof s.schema){this.schema=s.schema,this._basePath="";var a=new $Ref(this.$refs,this._basePath);return a.setValue(this.schema,s.options),maybe(s.callback,Promise.resolve(this.schema))}if(!s.schema||"string"!=typeof s.schema){var n=ono("Expected a file path, URL, or object. Got %s",s.schema);return maybe(s.callback,Promise.reject(n))}var o=this;return s.schema=util.path.localPathToUrl(s.schema),s.schema=url.resolve(util.path.cwd(),s.schema),this._basePath=util.path.stripHash(s.schema),read(s.schema,this.$refs,s.options).then(function(e){var r=e.$ref.value;if(!r||"object"!=typeof r||r instanceof Buffer)throw ono.syntax('"%s" is not a valid JSON Schema',o._basePath);return o.schema=r,maybe(s.callback,Promise.resolve(o.schema))})["catch"](function(e){return maybe(s.callback,Promise.reject(e))})},$RefParser.resolve=function(e,r,t){var s=this;return(new s).resolve(e,r,t)},$RefParser.prototype.resolve=function(e,r,t){var s=this,a=normalizeArgs(arguments);return this.parse(a.schema,a.options).then(function(){return resolve(s,a.options)}).then(function(){return maybe(a.callback,Promise.resolve(s.$refs))})["catch"](function(e){return maybe(a.callback,Promise.reject(e))})},$RefParser.bundle=function(e,r,t){var s=this;return(new s).bundle(e,r,t)},$RefParser.prototype.bundle=function(e,r,t){var s=this,a=normalizeArgs(arguments);return this.resolve(a.schema,a.options).then(function(){return bundle(s,a.options),maybe(a.callback,Promise.resolve(s.schema))})["catch"](function(e){return maybe(a.callback,Promise.reject(e))})},$RefParser.dereference=function(e,r,t){var s=this;return(new s).dereference(e,r,t)},$RefParser.prototype.dereference=function(e,r,t){var s=this,a=normalizeArgs(arguments);return this.resolve(a.schema,a.options).then(function(){return dereference(s,a.options),maybe(a.callback,Promise.resolve(s.schema))})["catch"](function(e){return maybe(a.callback,Promise.reject(e))})};

}).call(this,require("buffer").Buffer)

},{"./bundle":57,"./dereference":58,"./options":60,"./promise":63,"./read":64,"./ref":65,"./refs":66,"./resolve":67,"./util":68,"./yaml":69,"buffer":10,"call-me-maybe":13,"ono":75,"url":100}],60:[function(require,module,exports){
"use strict";function $RefParserOptions(e){this.allow={json:!0,yaml:!0,empty:!0,unknown:!0},this.$refs={internal:!0,external:!0,circular:!0},this.cache={fs:60,http:300,https:300},merge(e,this)}function merge(e,t){if(e)for(var r=Object.keys(e),s=0;s<r.length;s++){var i=r[s],n=e[i];if(void 0===t[i])t[i]=n;else for(var o=Object.keys(n),a=0;a<o.length;a++){var f=o[a],l=n[f];void 0!==l&&(t[i][f]=l)}}}module.exports=$RefParserOptions;

},{}],61:[function(require,module,exports){
(function (Buffer){
"use strict";function parse(e,t,r){var n;try{r.allow.yaml?(util.debug("Parsing YAML file: %s",t),n=YAML.parse(e.toString()),util.debug("    Parsed successfully")):r.allow.json?(util.debug("Parsing JSON file: %s",t),n=JSON.parse(e.toString()),util.debug("    Parsed successfully")):n=e}catch(s){var i=util.path.extname(t);if(!r.allow.unknown||-1!==[".json",".yaml",".yml"].indexOf(i))throw ono.syntax(s,'Error parsing "%s"',t);util.debug("    Unknown file format. Not parsed."),n=e}if(isEmpty(n)&&!r.allow.empty)throw ono.syntax('Error parsing "%s". \nParsed value is empty',t);return n}function isEmpty(e){return!e||"object"==typeof e&&0===Object.keys(e).length||"string"==typeof e&&0===e.trim().length||e instanceof Buffer&&0===e.length}var YAML=require("./yaml"),util=require("./util"),ono=require("ono");module.exports=parse;

}).call(this,require("buffer").Buffer)

},{"./util":68,"./yaml":69,"buffer":10,"ono":75}],62:[function(require,module,exports){
"use strict";function Pointer(e,t){this.$ref=e,this.path=t,this.value=void 0,this.circular=!1}function resolveIf$Ref(e,t){if($Ref.isAllowed$Ref(e.value,t)){var r=url.resolve(e.path,e.value.$ref);if(r===e.path)e.circular=!0;else if(1===Object.keys(e.value).length){var i=e.$ref.$refs._resolve(r);return e.$ref=i.$ref,e.path=i.path,e.value=i.value,!0}}}function setValue(e,t,r){if(!e.value||"object"!=typeof e.value)throw ono.syntax('Error assigning $ref pointer "%s". \nCannot set "%s" of a non-object.',e.path,t);return"-"===t&&Array.isArray(e.value)?e.value.push(r):e.value[t]=r,r}module.exports=Pointer;var $Ref=require("./ref"),util=require("./util"),url=require("url"),ono=require("ono"),slashes=/\//g,tildes=/~/g,escapedSlash=/~1/g,escapedTilde=/~0/g;Pointer.prototype.resolve=function(e,t){var r=Pointer.parse(this.path);this.value=e;for(var i=0;i<r.length;i++){resolveIf$Ref(this,t)&&(this.path=Pointer.join(this.path,r.slice(i)));var s=r[i];if(void 0===this.value[s])throw ono.syntax('Error resolving $ref pointer "%s". \nToken "%s" does not exist.',this.path,s);this.value=this.value[s]}return resolveIf$Ref(this,t),this},Pointer.prototype.set=function(e,t,r){var i,s=Pointer.parse(this.path);if(0===s.length)return this.value=t,t;this.value=e;for(var a=0;a<s.length-1;a++)resolveIf$Ref(this,r),i=s[a],this.value&&void 0!==this.value[i]?this.value=this.value[i]:this.value=setValue(this,i,{});return resolveIf$Ref(this,r),i=s[s.length-1],setValue(this,i,t),e},Pointer.parse=function(e){var t=util.path.getHash(e).substr(1);if(!t)return[];t=t.split("/");for(var r=0;r<t.length;r++)t[r]=decodeURI(t[r].replace(escapedSlash,"/").replace(escapedTilde,"~"));if(""!==t[0])throw ono.syntax('Invalid $ref pointer "%s". Pointers must begin with "#/"',t);return t.slice(1)},Pointer.join=function(e,t){-1===e.indexOf("#")&&(e+="#"),t=Array.isArray(t)?t:[t];for(var r=0;r<t.length;r++){var i=t[r];e+="/"+encodeURI(i.replace(tildes,"~0").replace(slashes,"~1"))}return e};

},{"./ref":65,"./util":68,"ono":75,"url":100}],63:[function(require,module,exports){
"use strict";module.exports="function"==typeof Promise?Promise:require("es6-promise").Promise;

},{"es6-promise":17}],64:[function(require,module,exports){
(function (process,Buffer){
"use strict";function read(e,r,t){try{e=util.path.stripHash(e),util.debug("Reading %s",e);var o=r._get$Ref(e);return o&&!o.isExpired()?(util.debug("    cached from %s",o.pathType),Promise.resolve({$ref:o,cached:!0})):(o=new $Ref(r,e),read$Ref(o,t))}catch(n){return Promise.reject(n)}}function read$Ref(e,r){try{var t=r.$refs.external&&(read$RefFile(e,r)||read$RefUrl(e,r));return t?t.then(function(t){var o=parse(t,e.path,r);return e.setValue(o,r),{$ref:e,cached:!1}}):Promise.reject(ono.syntax('Unable to resolve $ref pointer "%s"',e.path))}catch(o){return Promise.reject(o)}}function read$RefFile(e,r){return process.browser||util.path.isUrl(e.path)?void 0:(e.pathType="fs",new Promise(function(r,t){var o;try{o=util.path.urlToLocalPath(e.path)}catch(n){t(ono.uri(n,"Malformed URI: %s",e.path))}util.debug("Opening file: %s",o);try{fs.readFile(o,function(o,n){o?t(ono(o,'Error opening file "%s"',e.path)):r(n)})}catch(n){t(ono(n,'Error opening file "%s"',o))}}))}function read$RefUrl(e,r){var t=url.parse(e.path);return process.browser&&!t.protocol&&(t.protocol=url.parse(location.href).protocol),"http:"===t.protocol?(e.pathType="http",download(http,t,r)):"https:"===t.protocol?(e.pathType="https",download(https,t,r)):void 0}function download(e,r,t){return new Promise(function(o,n){function a(e){var a;e.on("data",function(e){a=a?Buffer.concat([new Buffer(a),new Buffer(e)]):e}),e.on("end",function(){e.statusCode>=400?n(ono("GET %s \nHTTP ERROR %d \n%s",r.href,e.statusCode,a)):204!==e.statusCode&&a&&a.length||t.allow.empty?o(a||""):n(ono("GET %s \nHTTP 204: No Content",r.href))}),e.on("error",function(e){n(ono(e,'Error downloading file "%s"',r.href))})}try{util.debug("Downloading file: %s",r);var i=e.get({hostname:r.hostname,port:r.port,path:r.path,auth:r.auth},a);"function"==typeof i.setTimeout&&i.setTimeout(5e3),i.on("timeout",function(){i.abort()}),i.on("error",function(e){n(ono(e,'Error downloading file "%s"',r.href))})}catch(u){n(ono(u,'Error downloading file "%s"',r.href))}})}var fs=require("fs"),http=require("http"),https=require("https"),parse=require("./parse"),util=require("./util"),$Ref=require("./ref"),Promise=require("./promise"),url=require("url"),ono=require("ono");module.exports=read;

}).call(this,require('_process'),require("buffer").Buffer)

},{"./parse":61,"./promise":63,"./ref":65,"./util":68,"_process":77,"buffer":10,"fs":9,"http":93,"https":20,"ono":75,"url":100}],65:[function(require,module,exports){
"use strict";function $Ref(e,t){t=util.path.stripHash(t),e._$refs[t]=this,this.$refs=e,this.path=t,this.pathType=void 0,this.pathFromRoot="#",this.value=void 0,this.expires=void 0}module.exports=$Ref;var Pointer=require("./pointer"),util=require("./util");$Ref.prototype.isExpired=function(){return!!(this.expires&&this.expires<=new Date)},$Ref.prototype.expire=function(){this.expires=new Date},$Ref.prototype.setValue=function(e,t){this.value=e;var i=t.cache[this.pathType];if(i>0){var r=Date.now()+1e3*i;this.expires=new Date(r)}},$Ref.prototype.exists=function(e){try{return this.resolve(e),!0}catch(t){return!1}},$Ref.prototype.get=function(e,t){return this.resolve(e,t).value},$Ref.prototype.resolve=function(e,t){var i=new Pointer(this,e);return i.resolve(this.value,t)},$Ref.prototype.set=function(e,t,i){var r=new Pointer(this,e);this.value=r.set(this.value,t,i)},$Ref.is$Ref=function(e){return e&&"object"==typeof e&&"string"==typeof e.$ref&&e.$ref.length>0},$Ref.isExternal$Ref=function(e){return $Ref.is$Ref(e)&&"#"!==e.$ref[0]},$Ref.isAllowed$Ref=function(e,t){if($Ref.is$Ref(e))if("#"===e.$ref[0]){if(t.$refs.internal)return!0}else if(t.$refs.external)return!0};

},{"./pointer":62,"./util":68}],66:[function(require,module,exports){
"use strict";function $Refs(){this.circular=!1,this._$refs={}}function getPaths(e,t){var r=Object.keys(e);return t=Array.isArray(t[0])?t[0]:Array.prototype.slice.call(t),t.length>0&&t[0]&&(r=r.filter(function(r){return-1!==t.indexOf(e[r].pathType)})),r.map(function(t){return{encoded:t,decoded:"fs"===e[t].pathType?util.path.urlToLocalPath(t):t}})}var Options=require("./options"),util=require("./util"),ono=require("ono");module.exports=$Refs,$Refs.prototype.paths=function(e){var t=getPaths(this._$refs,arguments);return t.map(function(e){return e.decoded})},$Refs.prototype.values=function(e){var t=this._$refs,r=getPaths(t,arguments);return r.reduce(function(e,r){return e[r.decoded]=t[r.encoded].value,e},{})},$Refs.prototype.toJSON=$Refs.prototype.values,$Refs.prototype.isExpired=function(e){var t=this._get$Ref(e);return void 0===t||t.isExpired()},$Refs.prototype.expire=function(e){var t=this._get$Ref(e);t&&t.expire()},$Refs.prototype.exists=function(e){try{return this._resolve(e),!0}catch(t){return!1}},$Refs.prototype.get=function(e,t){return this._resolve(e,t).value},$Refs.prototype.set=function(e,t,r){var o=util.path.stripHash(e),s=this._$refs[o];if(!s)throw ono('Error resolving $ref pointer "%s". \n"%s" not found.',e,o);r=new Options(r),s.set(e,t,r)},$Refs.prototype._resolve=function(e,t){var r=util.path.stripHash(e),o=this._$refs[r];if(!o)throw ono('Error resolving $ref pointer "%s". \n"%s" not found.',e,r);return t=new Options(t),o.resolve(e,t)},$Refs.prototype._get$Ref=function(e){var t=util.path.stripHash(e);return this._$refs[t]};

},{"./options":60,"./util":68,"ono":75}],67:[function(require,module,exports){
"use strict";function resolve(e,r){try{if(!r.$refs.external)return Promise.resolve();util.debug("Resolving $ref pointers in %s",e._basePath);var i=crawl(e.schema,e._basePath+"#","#",e.$refs,r);return Promise.all(i)}catch(t){return Promise.reject(t)}}function crawl(e,r,i,t,o){var n=[];if(e&&"object"==typeof e){var a=Object.keys(e),s=a.indexOf("definitions");s>0&&a.splice(0,0,a.splice(s,1)[0]),a.forEach(function(a){var s=Pointer.join(r,a),u=Pointer.join(i,a),l=e[a];if($Ref.isExternal$Ref(l)){util.debug('Resolving $ref pointer "%s" at %s',l.$ref,s);var c=url.resolve(r,l.$ref),f=crawl$Ref(c,u,t,o)["catch"](function(e){throw ono.syntax(e,"Error at %s",s)});n.push(f)}else n=n.concat(crawl(l,s,u,t,o))})}return n}function crawl$Ref(e,r,i,t){return read(e,i,t).then(function(e){if(!e.cached){var o=e.$ref;o.pathFromRoot=r,util.debug("Resolving $ref pointers in %s",o.path);var n=crawl(o.value,o.path+"#",r,i,t);return Promise.all(n)}})}var Promise=require("./promise"),$Ref=require("./ref"),Pointer=require("./pointer"),read=require("./read"),util=require("./util"),url=require("url"),ono=require("ono");module.exports=resolve;

},{"./pointer":62,"./promise":63,"./read":64,"./ref":65,"./util":68,"ono":75,"url":100}],68:[function(require,module,exports){
(function (process){
"use strict";var debug=require("debug"),isWindows=/^win/.test(process.platform),forwardSlashPattern=/\//g,protocolPattern=/^[a-z0-9.+-]+:\/\//i,urlEncodePatterns=[/\?/g,"%3F",/\#/g,"%23",isWindows?/\\/g:/\//,"/"],urlDecodePatterns=[/\%23/g,"#",/\%24/g,"$",/\%26/g,"&",/\%2C/g,",",/\%40/g,"@"];exports.debug=debug("json-schema-ref-parser"),exports.path={},exports.path.cwd=function(){return process.browser?location.href:process.cwd()+"/"},exports.path.isUrl=function(r){return protocolPattern.test(r)},exports.path.localPathToUrl=function(r){if(!process.browser&&!exports.path.isUrl(r)){for(var e=0;e<urlEncodePatterns.length;e+=2)r=r.replace(urlEncodePatterns[e],urlEncodePatterns[e+1]);r=encodeURI(r)}return r},exports.path.urlToLocalPath=function(r){r=decodeURI(r);for(var e=0;e<urlDecodePatterns.length;e+=2)r=r.replace(urlDecodePatterns[e],urlDecodePatterns[e+1]);return isWindows&&(r=r.replace(forwardSlashPattern,"\\")),r},exports.path.getHash=function(r){var e=r.indexOf("#");return e>=0?r.substr(e):""},exports.path.stripHash=function(r){var e=r.indexOf("#");return e>=0&&(r=r.substr(0,e)),r},exports.path.extname=function(r){var e=r.lastIndexOf(".");return e>=0?r.substr(e).toLowerCase():""};

}).call(this,require('_process'))

},{"_process":77,"debug":15}],69:[function(require,module,exports){
"use strict";var yaml=require("js-yaml"),ono=require("ono");module.exports={parse:function(r,e){try{return yaml.safeLoad(r)}catch(o){throw o instanceof Error?o:ono(o,o.message)}},stringify:function(r,e,o){try{var t=("string"==typeof o?o.length:o)||2;return yaml.safeDump(r,{indent:t})}catch(n){throw n instanceof Error?n:ono(n,n.message)}}};

},{"js-yaml":27,"ono":75}],70:[function(require,module,exports){
function baseGet(t,e,n){if(null!=t){void 0!==n&&n in toObject(t)&&(e=[n]);for(var o=0,c=e.length;null!=t&&c>o;)t=t[e[o++]];return o&&o==c?t:void 0}}function toObject(t){return isObject(t)?t:Object(t)}function isObject(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}module.exports=baseGet;

},{}],71:[function(require,module,exports){
function baseToString(r){return null==r?"":r+""}function toPath(r){if(isArray(r))return r;var e=[];return baseToString(r).replace(rePropName,function(r,a,n,t){e.push(n?t.replace(reEscapeChar,"$1"):a||r)}),e}var isArray=require("lodash.isarray"),rePropName=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,reEscapeChar=/\\(\\)?/g;module.exports=toPath;

},{"lodash.isarray":73}],72:[function(require,module,exports){
function get(e,t,a){var o=null==e?void 0:baseGet(e,toPath(t),t+"");return void 0===o?a:o}var baseGet=require("lodash._baseget"),toPath=require("lodash._topath");module.exports=get;

},{"lodash._baseget":70,"lodash._topath":71}],73:[function(require,module,exports){
function isObjectLike(t){return!!t&&"object"==typeof t}function getNative(t,r){var e=null==t?void 0:t[r];return isNative(e)?e:void 0}function isLength(t){return"number"==typeof t&&t>-1&&t%1==0&&MAX_SAFE_INTEGER>=t}function isFunction(t){return isObject(t)&&objToString.call(t)==funcTag}function isObject(t){var r=typeof t;return!!t&&("object"==r||"function"==r)}function isNative(t){return null==t?!1:isFunction(t)?reIsNative.test(fnToString.call(t)):isObjectLike(t)&&reIsHostCtor.test(t)}var arrayTag="[object Array]",funcTag="[object Function]",reIsHostCtor=/^\[object .+?Constructor\]$/,objectProto=Object.prototype,fnToString=Function.prototype.toString,hasOwnProperty=objectProto.hasOwnProperty,objToString=objectProto.toString,reIsNative=RegExp("^"+fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),nativeIsArray=getNative(Array,"isArray"),MAX_SAFE_INTEGER=9007199254740991,isArray=nativeIsArray||function(t){return isObjectLike(t)&&isLength(t.length)&&objToString.call(t)==arrayTag};module.exports=isArray;

},{}],74:[function(require,module,exports){
function parse(e){if(e=""+e,!(e.length>1e4)){var a=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(a){var r=parseFloat(a[1]),c=(a[2]||"ms").toLowerCase();switch(c){case"years":case"year":case"yrs":case"yr":case"y":return r*y;case"days":case"day":case"d":return r*d;case"hours":case"hour":case"hrs":case"hr":case"h":return r*h;case"minutes":case"minute":case"mins":case"min":case"m":return r*m;case"seconds":case"second":case"secs":case"sec":case"s":return r*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r}}}}function short(e){return e>=d?Math.round(e/d)+"d":e>=h?Math.round(e/h)+"h":e>=m?Math.round(e/m)+"m":e>=s?Math.round(e/s)+"s":e+"ms"}function long(e){return plural(e,d,"day")||plural(e,h,"hour")||plural(e,m,"minute")||plural(e,s,"second")||e+" ms"}function plural(s,e,a){return e>s?void 0:1.5*e>s?Math.floor(s/e)+" "+a:Math.ceil(s/e)+" "+a+"s"}var s=1e3,m=60*s,h=60*m,d=24*h,y=365.25*d;module.exports=function(s,e){return e=e||{},"string"==typeof s?parse(s):e["long"]?long(s):short(s)};

},{}],75:[function(require,module,exports){
/**!
 * Ono v2.0.1
 *
 * @link https://github.com/BigstickCarpet/ono
 * @license MIT
 */
"use strict";function create(r){return function(e,t,o,n){var a,c=module.exports.formatter;"string"==typeof e?(a=c.apply(null,arguments),e=t=void 0):a="string"==typeof t?c.apply(null,slice.call(arguments,1)):c.apply(null,slice.call(arguments,2)),e instanceof Error||(t=e,e=void 0),e&&(a+=(a?" \n":"")+e.message);var i=new r(a);return extendError(i,e),extendToJSON(i),extend(i,t),i}}function extendError(r,e){if(e){var t=e.stack;t&&(r.stack+=" \n\n"+e.stack),extend(r,e,!0)}}function extendToJSON(r){r.toJSON=errorToJSON,r.inspect=errorToJSON}function extend(r,e,t){if(e&&"object"==typeof e)for(var o=Object.keys(e),n=0;n<o.length;n++){var a=o[n];if(!(t&&vendorSpecificErrorProperties.indexOf(a)>=0))try{r[a]=e[a]}catch(c){}}}function errorToJSON(){var r={},e=Object.keys(this);e=e.concat(vendorSpecificErrorProperties);for(var t=0;t<e.length;t++){var o=e[t],n=this[o];void 0!==n&&(r[o]=n)}return r}var util=require("util"),slice=Array.prototype.slice,vendorSpecificErrorProperties=["name","message","description","number","fileName","lineNumber","columnNumber","sourceURL","line","column","stack"];module.exports=create(Error),module.exports.error=create(Error),module.exports.eval=create(EvalError),module.exports.range=create(RangeError),module.exports.reference=create(ReferenceError),module.exports.syntax=create(SyntaxError),module.exports.type=create(TypeError),module.exports.uri=create(URIError),module.exports.formatter=util.format;

},{"util":104}],76:[function(require,module,exports){
(function (process){
"use strict";function nextTick(e){for(var s=new Array(arguments.length-1),n=0;n<s.length;)s[n++]=arguments[n];process.nextTick(function(){e.apply(null,s)})}!process.version||0===process.version.indexOf("v0.")||0===process.version.indexOf("v1.")&&0!==process.version.indexOf("v1.8.")?module.exports=nextTick:module.exports=process.nextTick;

}).call(this,require('_process'))

},{"_process":77}],77:[function(require,module,exports){
function cleanUpNextTick(){draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue()}function drainQueue(){if(!draining){var e=setTimeout(cleanUpNextTick);draining=!0;for(var n=queue.length;n;){for(currentQueue=queue,queue=[];++queueIndex<n;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,n=queue.length}currentQueue=null,draining=!1,clearTimeout(e)}}function Item(e,n){this.fun=e,this.array=n}function noop(){}var process=module.exports={},queue=[],draining=!1,currentQueue,queueIndex=-1;process.nextTick=function(e){var n=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)n[r-1]=arguments[r];queue.push(new Item(e,n)),1!==queue.length||draining||setTimeout(drainQueue,0)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0};

},{}],78:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.0 by @mathias */
!function(e){function o(e){throw new RangeError(T[e])}function n(e,o){for(var n=e.length,r=[];n--;)r[n]=o(e[n]);return r}function r(e,o){var r=e.split("@"),t="";r.length>1&&(t=r[0]+"@",e=r[1]),e=e.replace(S,".");var u=e.split("."),i=n(u,o).join(".");return t+i}function t(e){for(var o,n,r=[],t=0,u=e.length;u>t;)o=e.charCodeAt(t++),o>=55296&&56319>=o&&u>t?(n=e.charCodeAt(t++),56320==(64512&n)?r.push(((1023&o)<<10)+(1023&n)+65536):(r.push(o),t--)):r.push(o);return r}function u(e){return n(e,function(e){var o="";return e>65535&&(e-=65536,o+=P(e>>>10&1023|55296),e=56320|1023&e),o+=P(e)}).join("")}function i(e){return 10>e-48?e-22:26>e-65?e-65:26>e-97?e-97:b}function f(e,o){return e+22+75*(26>e)-((0!=o)<<5)}function c(e,o,n){var r=0;for(e=n?M(e/j):e>>1,e+=M(e/o);e>L*C>>1;r+=b)e=M(e/L);return M(r+(L+1)*e/(e+m))}function l(e){var n,r,t,f,l,s,d,a,p,h,v=[],g=e.length,w=0,m=I,j=A;for(r=e.lastIndexOf(E),0>r&&(r=0),t=0;r>t;++t)e.charCodeAt(t)>=128&&o("not-basic"),v.push(e.charCodeAt(t));for(f=r>0?r+1:0;g>f;){for(l=w,s=1,d=b;f>=g&&o("invalid-input"),a=i(e.charCodeAt(f++)),(a>=b||a>M((x-w)/s))&&o("overflow"),w+=a*s,p=j>=d?y:d>=j+C?C:d-j,!(p>a);d+=b)h=b-p,s>M(x/h)&&o("overflow"),s*=h;n=v.length+1,j=c(w-l,n,0==l),M(w/n)>x-m&&o("overflow"),m+=M(w/n),w%=n,v.splice(w++,0,m)}return u(v)}function s(e){var n,r,u,i,l,s,d,a,p,h,v,g,w,m,j,F=[];for(e=t(e),g=e.length,n=I,r=0,l=A,s=0;g>s;++s)v=e[s],128>v&&F.push(P(v));for(u=i=F.length,i&&F.push(E);g>u;){for(d=x,s=0;g>s;++s)v=e[s],v>=n&&d>v&&(d=v);for(w=u+1,d-n>M((x-r)/w)&&o("overflow"),r+=(d-n)*w,n=d,s=0;g>s;++s)if(v=e[s],n>v&&++r>x&&o("overflow"),v==n){for(a=r,p=b;h=l>=p?y:p>=l+C?C:p-l,!(h>a);p+=b)j=a-h,m=b-h,F.push(P(f(h+j%m,0))),a=M(j/m);F.push(P(f(a,0))),l=c(r,w,u==i),r=0,++u}++r,++n}return F.join("")}function d(e){return r(e,function(e){return F.test(e)?l(e.slice(4).toLowerCase()):e})}function a(e){return r(e,function(e){return O.test(e)?"xn--"+s(e):e})}var p="object"==typeof exports&&exports&&!exports.nodeType&&exports,h="object"==typeof module&&module&&!module.nodeType&&module,v="object"==typeof global&&global;(v.global===v||v.window===v||v.self===v)&&(e=v);var g,w,x=2147483647,b=36,y=1,C=26,m=38,j=700,A=72,I=128,E="-",F=/^xn--/,O=/[^\x20-\x7E]/,S=/[\x2E\u3002\uFF0E\uFF61]/g,T={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},L=b-y,M=Math.floor,P=String.fromCharCode;if(g={version:"1.3.2",ucs2:{decode:t,encode:u},decode:l,encode:s,toASCII:a,toUnicode:d},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return g});else if(p&&h)if(module.exports==p)h.exports=g;else for(w in g)g.hasOwnProperty(w)&&(p[w]=g[w]);else e.punycode=g}(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],79:[function(require,module,exports){
"use strict";function hasOwnProperty(r,e){return Object.prototype.hasOwnProperty.call(r,e)}module.exports=function(r,e,t,n){e=e||"&",t=t||"=";var o={};if("string"!=typeof r||0===r.length)return o;var a=/\+/g;r=r.split(e);var s=1e3;n&&"number"==typeof n.maxKeys&&(s=n.maxKeys);var p=r.length;s>0&&p>s&&(p=s);for(var y=0;p>y;++y){var u,c,i,l,f=r[y].replace(a,"%20"),v=f.indexOf(t);v>=0?(u=f.substr(0,v),c=f.substr(v+1)):(u=f,c=""),i=decodeURIComponent(u),l=decodeURIComponent(c),hasOwnProperty(o,i)?isArray(o[i])?o[i].push(l):o[i]=[o[i],l]:o[i]=l}return o};var isArray=Array.isArray||function(r){return"[object Array]"===Object.prototype.toString.call(r)};

},{}],80:[function(require,module,exports){
"use strict";function map(r,e){if(r.map)return r.map(e);for(var t=[],n=0;n<r.length;n++)t.push(e(r[n],n));return t}var stringifyPrimitive=function(r){switch(typeof r){case"string":return r;case"boolean":return r?"true":"false";case"number":return isFinite(r)?r:"";default:return""}};module.exports=function(r,e,t,n){return e=e||"&",t=t||"=",null===r&&(r=void 0),"object"==typeof r?map(objectKeys(r),function(n){var i=encodeURIComponent(stringifyPrimitive(n))+t;return isArray(r[n])?map(r[n],function(r){return i+encodeURIComponent(stringifyPrimitive(r))}).join(e):i+encodeURIComponent(stringifyPrimitive(r[n]))}).join(e):n?encodeURIComponent(stringifyPrimitive(n))+t+encodeURIComponent(stringifyPrimitive(r)):""};var isArray=Array.isArray||function(r){return"[object Array]"===Object.prototype.toString.call(r)},objectKeys=Object.keys||function(r){var e=[];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&e.push(t);return e};

},{}],81:[function(require,module,exports){
"use strict";exports.decode=exports.parse=require("./decode"),exports.encode=exports.stringify=require("./encode");

},{"./decode":79,"./encode":80}],82:[function(require,module,exports){
module.exports=require("./lib/_stream_duplex.js");

},{"./lib/_stream_duplex.js":83}],83:[function(require,module,exports){
"use strict";function Duplex(e){return this instanceof Duplex?(Readable.call(this,e),Writable.call(this,e),e&&e.readable===!1&&(this.readable=!1),e&&e.writable===!1&&(this.writable=!1),this.allowHalfOpen=!0,e&&e.allowHalfOpen===!1&&(this.allowHalfOpen=!1),void this.once("end",onend)):new Duplex(e)}function onend(){this.allowHalfOpen||this._writableState.ended||processNextTick(onEndNT,this)}function onEndNT(e){e.end()}function forEach(e,t){for(var r=0,i=e.length;i>r;r++)t(e[r],r)}var objectKeys=Object.keys||function(e){var t=[];for(var r in e)t.push(r);return t};module.exports=Duplex;var processNextTick=require("process-nextick-args"),util=require("core-util-is");util.inherits=require("inherits");var Readable=require("./_stream_readable"),Writable=require("./_stream_writable");util.inherits(Duplex,Readable);for(var keys=objectKeys(Writable.prototype),v=0;v<keys.length;v++){var method=keys[v];Duplex.prototype[method]||(Duplex.prototype[method]=Writable.prototype[method])}

},{"./_stream_readable":85,"./_stream_writable":87,"core-util-is":14,"inherits":24,"process-nextick-args":76}],84:[function(require,module,exports){
"use strict";function PassThrough(r){return this instanceof PassThrough?void Transform.call(this,r):new PassThrough(r)}module.exports=PassThrough;var Transform=require("./_stream_transform"),util=require("core-util-is");util.inherits=require("inherits"),util.inherits(PassThrough,Transform),PassThrough.prototype._transform=function(r,s,i){i(null,r)};

},{"./_stream_transform":86,"core-util-is":14,"inherits":24}],85:[function(require,module,exports){
(function (process){
"use strict";function ReadableState(e,t){Duplex=Duplex||require("./_stream_duplex"),e=e||{},this.objectMode=!!e.objectMode,t instanceof Duplex&&(this.objectMode=this.objectMode||!!e.readableObjectMode);var r=e.highWaterMark,n=this.objectMode?16:16384;this.highWaterMark=r||0===r?r:n,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.defaultEncoding=e.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,e.encoding&&(StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this.decoder=new StringDecoder(e.encoding),this.encoding=e.encoding)}function Readable(e){return Duplex=Duplex||require("./_stream_duplex"),this instanceof Readable?(this._readableState=new ReadableState(e,this),this.readable=!0,e&&"function"==typeof e.read&&(this._read=e.read),void Stream.call(this)):new Readable(e)}function readableAddChunk(e,t,r,n,a){var i=chunkInvalid(t,r);if(i)e.emit("error",i);else if(null===r)t.reading=!1,onEofChunk(e,t);else if(t.objectMode||r&&r.length>0)if(t.ended&&!a){var d=new Error("stream.push() after EOF");e.emit("error",d)}else if(t.endEmitted&&a){var d=new Error("stream.unshift() after end event");e.emit("error",d)}else!t.decoder||a||n||(r=t.decoder.write(r)),a||(t.reading=!1),t.flowing&&0===t.length&&!t.sync?(e.emit("data",r),e.read(0)):(t.length+=t.objectMode?1:r.length,a?t.buffer.unshift(r):t.buffer.push(r),t.needReadable&&emitReadable(e)),maybeReadMore(e,t);else a||(t.reading=!1);return needMoreData(t)}function needMoreData(e){return!e.ended&&(e.needReadable||e.length<e.highWaterMark||0===e.length)}function computeNewHighWaterMark(e){return e>=MAX_HWM?e=MAX_HWM:(e--,e|=e>>>1,e|=e>>>2,e|=e>>>4,e|=e>>>8,e|=e>>>16,e++),e}function howMuchToRead(e,t){return 0===t.length&&t.ended?0:t.objectMode?0===e?0:1:null===e||isNaN(e)?t.flowing&&t.buffer.length?t.buffer[0].length:t.length:0>=e?0:(e>t.highWaterMark&&(t.highWaterMark=computeNewHighWaterMark(e)),e>t.length?t.ended?t.length:(t.needReadable=!0,0):e)}function chunkInvalid(e,t){var r=null;return Buffer.isBuffer(t)||"string"==typeof t||null===t||void 0===t||e.objectMode||(r=new TypeError("Invalid non-string/buffer chunk")),r}function onEofChunk(e,t){if(!t.ended){if(t.decoder){var r=t.decoder.end();r&&r.length&&(t.buffer.push(r),t.length+=t.objectMode?1:r.length)}t.ended=!0,emitReadable(e)}}function emitReadable(e){var t=e._readableState;t.needReadable=!1,t.emittedReadable||(debug("emitReadable",t.flowing),t.emittedReadable=!0,t.sync?processNextTick(emitReadable_,e):emitReadable_(e))}function emitReadable_(e){debug("emit readable"),e.emit("readable"),flow(e)}function maybeReadMore(e,t){t.readingMore||(t.readingMore=!0,processNextTick(maybeReadMore_,e,t))}function maybeReadMore_(e,t){for(var r=t.length;!t.reading&&!t.flowing&&!t.ended&&t.length<t.highWaterMark&&(debug("maybeReadMore read 0"),e.read(0),r!==t.length);)r=t.length;t.readingMore=!1}function pipeOnDrain(e){return function(){var t=e._readableState;debug("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&EElistenerCount(e,"data")&&(t.flowing=!0,flow(e))}}function nReadingNextTick(e){debug("readable nexttick read 0"),e.read(0)}function resume(e,t){t.resumeScheduled||(t.resumeScheduled=!0,processNextTick(resume_,e,t))}function resume_(e,t){t.reading||(debug("resume read 0"),e.read(0)),t.resumeScheduled=!1,e.emit("resume"),flow(e),t.flowing&&!t.reading&&e.read(0)}function flow(e){var t=e._readableState;if(debug("flow",t.flowing),t.flowing)do var r=e.read();while(null!==r&&t.flowing)}function fromList(e,t){var r,n=t.buffer,a=t.length,i=!!t.decoder,d=!!t.objectMode;if(0===n.length)return null;if(0===a)r=null;else if(d)r=n.shift();else if(!e||e>=a)r=i?n.join(""):1===n.length?n[0]:Buffer.concat(n,a),n.length=0;else if(e<n[0].length){var o=n[0];r=o.slice(0,e),n[0]=o.slice(e)}else if(e===n[0].length)r=n.shift();else{r=i?"":new Buffer(e);for(var l=0,u=0,s=n.length;s>u&&e>l;u++){var o=n[0],h=Math.min(e-l,o.length);i?r+=o.slice(0,h):o.copy(r,l,0,h),h<o.length?n[0]=o.slice(h):n.shift(),l+=h}}return r}function endReadable(e){var t=e._readableState;if(t.length>0)throw new Error("endReadable called on non-empty stream");t.endEmitted||(t.ended=!0,processNextTick(endReadableNT,t,e))}function endReadableNT(e,t){e.endEmitted||0!==e.length||(e.endEmitted=!0,t.readable=!1,t.emit("end"))}function forEach(e,t){for(var r=0,n=e.length;n>r;r++)t(e[r],r)}function indexOf(e,t){for(var r=0,n=e.length;n>r;r++)if(e[r]===t)return r;return-1}module.exports=Readable;var processNextTick=require("process-nextick-args"),isArray=require("isarray"),Buffer=require("buffer").Buffer;Readable.ReadableState=ReadableState;var EE=require("events"),EElistenerCount=function(e,t){return e.listeners(t).length},Stream;!function(){try{Stream=require("stream")}catch(e){}finally{Stream||(Stream=require("events").EventEmitter)}}();var Buffer=require("buffer").Buffer,util=require("core-util-is");util.inherits=require("inherits");var debugUtil=require("util"),debug;debug=debugUtil&&debugUtil.debuglog?debugUtil.debuglog("stream"):function(){};var StringDecoder;util.inherits(Readable,Stream);var Duplex,Duplex;Readable.prototype.push=function(e,t){var r=this._readableState;return r.objectMode||"string"!=typeof e||(t=t||r.defaultEncoding,t!==r.encoding&&(e=new Buffer(e,t),t="")),readableAddChunk(this,r,e,t,!1)},Readable.prototype.unshift=function(e){var t=this._readableState;return readableAddChunk(this,t,e,"",!0)},Readable.prototype.isPaused=function(){return this._readableState.flowing===!1},Readable.prototype.setEncoding=function(e){return StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this._readableState.decoder=new StringDecoder(e),this._readableState.encoding=e,this};var MAX_HWM=8388608;Readable.prototype.read=function(e){debug("read",e);var t=this._readableState,r=e;if(("number"!=typeof e||e>0)&&(t.emittedReadable=!1),0===e&&t.needReadable&&(t.length>=t.highWaterMark||t.ended))return debug("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?endReadable(this):emitReadable(this),null;if(e=howMuchToRead(e,t),0===e&&t.ended)return 0===t.length&&endReadable(this),null;var n=t.needReadable;debug("need readable",n),(0===t.length||t.length-e<t.highWaterMark)&&(n=!0,debug("length less than watermark",n)),(t.ended||t.reading)&&(n=!1,debug("reading or ended",n)),n&&(debug("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1),n&&!t.reading&&(e=howMuchToRead(r,t));var a;return a=e>0?fromList(e,t):null,null===a&&(t.needReadable=!0,e=0),t.length-=e,0!==t.length||t.ended||(t.needReadable=!0),r!==e&&t.ended&&0===t.length&&endReadable(this),null!==a&&this.emit("data",a),a},Readable.prototype._read=function(e){this.emit("error",new Error("not implemented"))},Readable.prototype.pipe=function(e,t){function r(e){debug("onunpipe"),e===s&&a()}function n(){debug("onend"),e.end()}function a(){debug("cleanup"),e.removeListener("close",o),e.removeListener("finish",l),e.removeListener("drain",c),e.removeListener("error",d),e.removeListener("unpipe",r),s.removeListener("end",n),s.removeListener("end",a),s.removeListener("data",i),g=!0,!h.awaitDrain||e._writableState&&!e._writableState.needDrain||c()}function i(t){debug("ondata");var r=e.write(t);!1===r&&(1!==h.pipesCount||h.pipes[0]!==e||1!==s.listenerCount("data")||g||(debug("false write response, pause",s._readableState.awaitDrain),s._readableState.awaitDrain++),s.pause())}function d(t){debug("onerror",t),u(),e.removeListener("error",d),0===EElistenerCount(e,"error")&&e.emit("error",t)}function o(){e.removeListener("finish",l),u()}function l(){debug("onfinish"),e.removeListener("close",o),u()}function u(){debug("unpipe"),s.unpipe(e)}var s=this,h=this._readableState;switch(h.pipesCount){case 0:h.pipes=e;break;case 1:h.pipes=[h.pipes,e];break;default:h.pipes.push(e)}h.pipesCount+=1,debug("pipe count=%d opts=%j",h.pipesCount,t);var f=(!t||t.end!==!1)&&e!==process.stdout&&e!==process.stderr,p=f?n:a;h.endEmitted?processNextTick(p):s.once("end",p),e.on("unpipe",r);var c=pipeOnDrain(s);e.on("drain",c);var g=!1;return s.on("data",i),e._events&&e._events.error?isArray(e._events.error)?e._events.error.unshift(d):e._events.error=[d,e._events.error]:e.on("error",d),e.once("close",o),e.once("finish",l),e.emit("pipe",s),h.flowing||(debug("pipe resume"),s.resume()),e},Readable.prototype.unpipe=function(e){var t=this._readableState;if(0===t.pipesCount)return this;if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this),this);if(!e){var r=t.pipes,n=t.pipesCount;t.pipes=null,t.pipesCount=0,t.flowing=!1;for(var a=0;n>a;a++)r[a].emit("unpipe",this);return this}var a=indexOf(t.pipes,e);return-1===a?this:(t.pipes.splice(a,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this),this)},Readable.prototype.on=function(e,t){var r=Stream.prototype.on.call(this,e,t);if("data"===e&&!1!==this._readableState.flowing&&this.resume(),"readable"===e&&this.readable){var n=this._readableState;n.readableListening||(n.readableListening=!0,n.emittedReadable=!1,n.needReadable=!0,n.reading?n.length&&emitReadable(this,n):processNextTick(nReadingNextTick,this))}return r},Readable.prototype.addListener=Readable.prototype.on,Readable.prototype.resume=function(){var e=this._readableState;return e.flowing||(debug("resume"),e.flowing=!0,resume(this,e)),this},Readable.prototype.pause=function(){return debug("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(debug("pause"),this._readableState.flowing=!1,this.emit("pause")),this},Readable.prototype.wrap=function(e){var t=this._readableState,r=!1,n=this;e.on("end",function(){if(debug("wrapped end"),t.decoder&&!t.ended){var e=t.decoder.end();e&&e.length&&n.push(e)}n.push(null)}),e.on("data",function(a){if(debug("wrapped data"),t.decoder&&(a=t.decoder.write(a)),(!t.objectMode||null!==a&&void 0!==a)&&(t.objectMode||a&&a.length)){var i=n.push(a);i||(r=!0,e.pause())}});for(var a in e)void 0===this[a]&&"function"==typeof e[a]&&(this[a]=function(t){return function(){return e[t].apply(e,arguments)}}(a));var i=["error","close","destroy","pause","resume"];return forEach(i,function(t){e.on(t,n.emit.bind(n,t))}),n._read=function(t){debug("wrapped _read",t),r&&(r=!1,e.resume())},n},Readable._fromList=fromList;

}).call(this,require('_process'))

},{"./_stream_duplex":83,"_process":77,"buffer":10,"core-util-is":14,"events":19,"inherits":24,"isarray":26,"process-nextick-args":76,"stream":92,"string_decoder/":97,"util":8}],86:[function(require,module,exports){
"use strict";function TransformState(r){this.afterTransform=function(t,n){return afterTransform(r,t,n)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null}function afterTransform(r,t,n){var e=r._transformState;e.transforming=!1;var a=e.writecb;if(!a)return r.emit("error",new Error("no writecb in Transform class"));e.writechunk=null,e.writecb=null,null!==n&&void 0!==n&&r.push(n),a&&a(t);var i=r._readableState;i.reading=!1,(i.needReadable||i.length<i.highWaterMark)&&r._read(i.highWaterMark)}function Transform(r){if(!(this instanceof Transform))return new Transform(r);Duplex.call(this,r),this._transformState=new TransformState(this);var t=this;this._readableState.needReadable=!0,this._readableState.sync=!1,r&&("function"==typeof r.transform&&(this._transform=r.transform),"function"==typeof r.flush&&(this._flush=r.flush)),this.once("prefinish",function(){"function"==typeof this._flush?this._flush(function(r){done(t,r)}):done(t)})}function done(r,t){if(t)return r.emit("error",t);var n=r._writableState,e=r._transformState;if(n.length)throw new Error("calling transform done when ws.length != 0");if(e.transforming)throw new Error("calling transform done when still transforming");return r.push(null)}module.exports=Transform;var Duplex=require("./_stream_duplex"),util=require("core-util-is");util.inherits=require("inherits"),util.inherits(Transform,Duplex),Transform.prototype.push=function(r,t){return this._transformState.needTransform=!1,Duplex.prototype.push.call(this,r,t)},Transform.prototype._transform=function(r,t,n){throw new Error("not implemented")},Transform.prototype._write=function(r,t,n){var e=this._transformState;if(e.writecb=n,e.writechunk=r,e.writeencoding=t,!e.transforming){var a=this._readableState;(e.needTransform||a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark)}},Transform.prototype._read=function(r){var t=this._transformState;null!==t.writechunk&&t.writecb&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};

},{"./_stream_duplex":83,"core-util-is":14,"inherits":24}],87:[function(require,module,exports){
"use strict";function nop(){}function WriteReq(e,t,r){this.chunk=e,this.encoding=t,this.callback=r,this.next=null}function WritableState(e,t){Duplex=Duplex||require("./_stream_duplex"),e=e||{},this.objectMode=!!e.objectMode,t instanceof Duplex&&(this.objectMode=this.objectMode||!!e.writableObjectMode);var r=e.highWaterMark,i=this.objectMode?16:16384;this.highWaterMark=r||0===r?r:i,this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;var n=e.decodeStrings===!1;this.decodeStrings=!n,this.defaultEncoding=e.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(e){onwrite(t,e)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1}function Writable(e){return Duplex=Duplex||require("./_stream_duplex"),this instanceof Writable||this instanceof Duplex?(this._writableState=new WritableState(e,this),this.writable=!0,e&&("function"==typeof e.write&&(this._write=e.write),"function"==typeof e.writev&&(this._writev=e.writev)),void Stream.call(this)):new Writable(e)}function writeAfterEnd(e,t){var r=new Error("write after end");e.emit("error",r),processNextTick(t,r)}function validChunk(e,t,r,i){var n=!0;if(!Buffer.isBuffer(r)&&"string"!=typeof r&&null!==r&&void 0!==r&&!t.objectMode){var f=new TypeError("Invalid non-string/buffer chunk");e.emit("error",f),processNextTick(i,f),n=!1}return n}function decodeChunk(e,t,r){return e.objectMode||e.decodeStrings===!1||"string"!=typeof t||(t=new Buffer(t,r)),t}function writeOrBuffer(e,t,r,i,n){r=decodeChunk(t,r,i),Buffer.isBuffer(r)&&(i="buffer");var f=t.objectMode?1:r.length;t.length+=f;var o=t.length<t.highWaterMark;if(o||(t.needDrain=!0),t.writing||t.corked){var u=t.lastBufferedRequest;t.lastBufferedRequest=new WriteReq(r,i,n),u?u.next=t.lastBufferedRequest:t.bufferedRequest=t.lastBufferedRequest}else doWrite(e,t,!1,f,r,i,n);return o}function doWrite(e,t,r,i,n,f,o){t.writelen=i,t.writecb=o,t.writing=!0,t.sync=!0,r?e._writev(n,t.onwrite):e._write(n,f,t.onwrite),t.sync=!1}function onwriteError(e,t,r,i,n){--t.pendingcb,r?processNextTick(n,i):n(i),e._writableState.errorEmitted=!0,e.emit("error",i)}function onwriteStateUpdate(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function onwrite(e,t){var r=e._writableState,i=r.sync,n=r.writecb;if(onwriteStateUpdate(r),t)onwriteError(e,r,i,t,n);else{var f=needFinish(r);f||r.corked||r.bufferProcessing||!r.bufferedRequest||clearBuffer(e,r),i?processNextTick(afterWrite,e,r,f,n):afterWrite(e,r,f,n)}}function afterWrite(e,t,r,i){r||onwriteDrain(e,t),t.pendingcb--,i(),finishMaybe(e,t)}function onwriteDrain(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function clearBuffer(e,t){t.bufferProcessing=!0;var r=t.bufferedRequest;if(e._writev&&r&&r.next){for(var i=[],n=[];r;)n.push(r.callback),i.push(r),r=r.next;t.pendingcb++,t.lastBufferedRequest=null,doWrite(e,t,!0,t.length,i,"",function(e){for(var r=0;r<n.length;r++)t.pendingcb--,n[r](e)})}else{for(;r;){var f=r.chunk,o=r.encoding,u=r.callback,s=t.objectMode?1:f.length;if(doWrite(e,t,!1,s,f,o,u),r=r.next,t.writing)break}null===r&&(t.lastBufferedRequest=null)}t.bufferedRequest=r,t.bufferProcessing=!1}function needFinish(e){return e.ending&&0===e.length&&null===e.bufferedRequest&&!e.finished&&!e.writing}function prefinish(e,t){t.prefinished||(t.prefinished=!0,e.emit("prefinish"))}function finishMaybe(e,t){var r=needFinish(t);return r&&(0===t.pendingcb?(prefinish(e,t),t.finished=!0,e.emit("finish")):prefinish(e,t)),r}function endWritable(e,t,r){t.ending=!0,finishMaybe(e,t),r&&(t.finished?processNextTick(r):e.once("finish",r)),t.ended=!0}module.exports=Writable;var processNextTick=require("process-nextick-args"),Buffer=require("buffer").Buffer;Writable.WritableState=WritableState;var util=require("core-util-is");util.inherits=require("inherits");var internalUtil={deprecate:require("util-deprecate")},Stream;!function(){try{Stream=require("stream")}catch(e){}finally{Stream||(Stream=require("events").EventEmitter)}}();var Buffer=require("buffer").Buffer;util.inherits(Writable,Stream);var Duplex;WritableState.prototype.getBuffer=function(){for(var e=this.bufferedRequest,t=[];e;)t.push(e),e=e.next;return t},function(){try{Object.defineProperty(WritableState.prototype,"buffer",{get:internalUtil.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")})}catch(e){}}();var Duplex;Writable.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe. Not readable."))},Writable.prototype.write=function(e,t,r){var i=this._writableState,n=!1;return"function"==typeof t&&(r=t,t=null),Buffer.isBuffer(e)?t="buffer":t||(t=i.defaultEncoding),"function"!=typeof r&&(r=nop),i.ended?writeAfterEnd(this,r):validChunk(this,i,e,r)&&(i.pendingcb++,n=writeOrBuffer(this,i,e,t,r)),n},Writable.prototype.cork=function(){var e=this._writableState;e.corked++},Writable.prototype.uncork=function(){var e=this._writableState;e.corked&&(e.corked--,e.writing||e.corked||e.finished||e.bufferProcessing||!e.bufferedRequest||clearBuffer(this,e))},Writable.prototype.setDefaultEncoding=function(e){if("string"==typeof e&&(e=e.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((e+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+e);this._writableState.defaultEncoding=e},Writable.prototype._write=function(e,t,r){r(new Error("not implemented"))},Writable.prototype._writev=null,Writable.prototype.end=function(e,t,r){var i=this._writableState;"function"==typeof e?(r=e,e=null,t=null):"function"==typeof t&&(r=t,t=null),null!==e&&void 0!==e&&this.write(e,t),i.corked&&(i.corked=1,this.uncork()),i.ending||i.finished||endWritable(this,i,r)};

},{"./_stream_duplex":83,"buffer":10,"core-util-is":14,"events":19,"inherits":24,"process-nextick-args":76,"stream":92,"util-deprecate":102}],88:[function(require,module,exports){
module.exports=require("./lib/_stream_passthrough.js");

},{"./lib/_stream_passthrough.js":84}],89:[function(require,module,exports){
var Stream=function(){try{return require("stream")}catch(r){}}();exports=module.exports=require("./lib/_stream_readable.js"),exports.Stream=Stream||exports,exports.Readable=exports,exports.Writable=require("./lib/_stream_writable.js"),exports.Duplex=require("./lib/_stream_duplex.js"),exports.Transform=require("./lib/_stream_transform.js"),exports.PassThrough=require("./lib/_stream_passthrough.js");

},{"./lib/_stream_duplex.js":83,"./lib/_stream_passthrough.js":84,"./lib/_stream_readable.js":85,"./lib/_stream_transform.js":86,"./lib/_stream_writable.js":87,"stream":92}],90:[function(require,module,exports){
module.exports=require("./lib/_stream_transform.js");

},{"./lib/_stream_transform.js":86}],91:[function(require,module,exports){
module.exports=require("./lib/_stream_writable.js");

},{"./lib/_stream_writable.js":87}],92:[function(require,module,exports){
function Stream(){EE.call(this)}module.exports=Stream;var EE=require("events").EventEmitter,inherits=require("inherits");inherits(Stream,EE),Stream.Readable=require("readable-stream/readable.js"),Stream.Writable=require("readable-stream/writable.js"),Stream.Duplex=require("readable-stream/duplex.js"),Stream.Transform=require("readable-stream/transform.js"),Stream.PassThrough=require("readable-stream/passthrough.js"),Stream.Stream=Stream,Stream.prototype.pipe=function(e,r){function t(r){e.writable&&!1===e.write(r)&&m.pause&&m.pause()}function n(){m.readable&&m.resume&&m.resume()}function a(){u||(u=!0,e.end())}function o(){u||(u=!0,"function"==typeof e.destroy&&e.destroy())}function i(e){if(s(),0===EE.listenerCount(this,"error"))throw e}function s(){m.removeListener("data",t),e.removeListener("drain",n),m.removeListener("end",a),m.removeListener("close",o),m.removeListener("error",i),e.removeListener("error",i),m.removeListener("end",s),m.removeListener("close",s),e.removeListener("close",s)}var m=this;m.on("data",t),e.on("drain",n),e._isStdio||r&&r.end===!1||(m.on("end",a),m.on("close",o));var u=!1;return m.on("error",i),e.on("error",i),m.on("end",s),m.on("close",s),e.on("close",s),e.emit("pipe",m),e};

},{"events":19,"inherits":24,"readable-stream/duplex.js":82,"readable-stream/passthrough.js":88,"readable-stream/readable.js":89,"readable-stream/transform.js":90,"readable-stream/writable.js":91}],93:[function(require,module,exports){
var ClientRequest=require("./lib/request"),extend=require("xtend"),statusCodes=require("builtin-status-codes"),url=require("url"),http=exports;http.request=function(t,e){t="string"==typeof t?url.parse(t):extend(t);var r=t.protocol||"",s=t.hostname||t.host,n=t.port,u=t.path||"/";s&&-1!==s.indexOf(":")&&(s="["+s+"]"),t.url=(s?r+"//"+s:"")+(n?":"+n:"")+u,t.method=(t.method||"GET").toUpperCase(),t.headers=t.headers||{};var C=new ClientRequest(t);return e&&C.on("response",e),C},http.get=function(t,e){var r=http.request(t,e);return r.end(),r},http.Agent=function(){},http.Agent.defaultMaxSockets=4,http.STATUS_CODES=statusCodes,http.METHODS=["CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REPORT","SEARCH","SUBSCRIBE","TRACE","UNLOCK","UNSUBSCRIBE"];

},{"./lib/request":95,"builtin-status-codes":12,"url":100,"xtend":106}],94:[function(require,module,exports){
(function (global){
function checkTypeSupport(e){try{return xhr.responseType=e,xhr.responseType===e}catch(r){}return!1}function isFunction(e){return"function"==typeof e}exports.fetch=isFunction(global.fetch)&&isFunction(global.ReadableByteStream),exports.blobConstructor=!1;try{new Blob([new ArrayBuffer(1)]),exports.blobConstructor=!0}catch(e){}var xhr=new global.XMLHttpRequest;xhr.open("GET",global.location.host?"/":"https://example.com");var haveArrayBuffer="undefined"!=typeof global.ArrayBuffer,haveSlice=haveArrayBuffer&&isFunction(global.ArrayBuffer.prototype.slice);exports.arraybuffer=haveArrayBuffer&&checkTypeSupport("arraybuffer"),exports.msstream=!exports.fetch&&haveSlice&&checkTypeSupport("ms-stream"),exports.mozchunkedarraybuffer=!exports.fetch&&haveArrayBuffer&&checkTypeSupport("moz-chunked-arraybuffer"),exports.overrideMimeType=isFunction(xhr.overrideMimeType),exports.vbArray=isFunction(global.VBArray),xhr=null;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],95:[function(require,module,exports){
(function (process,global,Buffer){
function decideMode(e){return capability.fetch?"fetch":capability.mozchunkedarraybuffer?"moz-chunked-arraybuffer":capability.msstream?"ms-stream":capability.arraybuffer&&e?"arraybuffer":capability.vbArray&&e?"text:vbarray":"text"}function statusValid(e){try{return null!==e.status}catch(t){return!1}}var capability=require("./capability"),inherits=require("inherits"),response=require("./response"),stream=require("stream"),IncomingMessage=response.IncomingMessage,rStates=response.readyStates,ClientRequest=module.exports=function(e){var t=this;stream.Writable.call(t),t._opts=e,t._body=[],t._headers={},e.auth&&t.setHeader("Authorization","Basic "+new Buffer(e.auth).toString("base64")),Object.keys(e.headers).forEach(function(r){t.setHeader(r,e.headers[r])});var r;if("prefer-streaming"===e.mode)r=!1;else if("allow-wrong-content-type"===e.mode)r=!capability.overrideMimeType;else{if(e.mode&&"default"!==e.mode&&"prefer-fast"!==e.mode)throw new Error("Invalid value for opts.mode");r=!0}t._mode=decideMode(r),t.on("finish",function(){t._onFinish()})};inherits(ClientRequest,stream.Writable),ClientRequest.prototype.setHeader=function(e,t){var r=this,o=e.toLowerCase();-1===unsafeHeaders.indexOf(o)&&(r._headers[o]={name:e,value:t})},ClientRequest.prototype.getHeader=function(e){var t=this;return t._headers[e.toLowerCase()].value},ClientRequest.prototype.removeHeader=function(e){var t=this;delete t._headers[e.toLowerCase()]},ClientRequest.prototype._onFinish=function(){var e=this;if(!e._destroyed){var t,r=e._opts,o=e._headers;if(("POST"===r.method||"PUT"===r.method||"PATCH"===r.method)&&(t=capability.blobConstructor?new global.Blob(e._body.map(function(e){return e.toArrayBuffer()}),{type:(o["content-type"]||{}).value||""}):Buffer.concat(e._body).toString()),"fetch"===e._mode){var n=Object.keys(o).map(function(e){return[o[e].name,o[e].value]});global.fetch(e._opts.url,{method:e._opts.method,headers:n,body:t,mode:"cors",credentials:r.withCredentials?"include":"same-origin"}).then(function(t){e._fetchResponse=t,e._connect()},function(t){e.emit("error",t)})}else{var s=e._xhr=new global.XMLHttpRequest;try{s.open(e._opts.method,e._opts.url,!0)}catch(i){return void process.nextTick(function(){e.emit("error",i)})}"responseType"in s&&(s.responseType=e._mode.split(":")[0]),"withCredentials"in s&&(s.withCredentials=!!r.withCredentials),"text"===e._mode&&"overrideMimeType"in s&&s.overrideMimeType("text/plain; charset=x-user-defined"),Object.keys(o).forEach(function(e){s.setRequestHeader(o[e].name,o[e].value)}),e._response=null,s.onreadystatechange=function(){switch(s.readyState){case rStates.LOADING:case rStates.DONE:e._onXHRProgress()}},"moz-chunked-arraybuffer"===e._mode&&(s.onprogress=function(){e._onXHRProgress()}),s.onerror=function(){e._destroyed||e.emit("error",new Error("XHR error"))};try{s.send(t)}catch(i){return void process.nextTick(function(){e.emit("error",i)})}}}},ClientRequest.prototype._onXHRProgress=function(){var e=this;statusValid(e._xhr)&&!e._destroyed&&(e._response||e._connect(),e._response._onXHRProgress())},ClientRequest.prototype._connect=function(){var e=this;e._destroyed||(e._response=new IncomingMessage(e._xhr,e._fetchResponse,e._mode),e.emit("response",e._response))},ClientRequest.prototype._write=function(e,t,r){var o=this;o._body.push(e),r()},ClientRequest.prototype.abort=ClientRequest.prototype.destroy=function(){var e=this;e._destroyed=!0,e._response&&(e._response._destroyed=!0),e._xhr&&e._xhr.abort()},ClientRequest.prototype.end=function(e,t,r){var o=this;"function"==typeof e&&(r=e,e=void 0),stream.Writable.prototype.end.call(o,e,t,r)},ClientRequest.prototype.flushHeaders=function(){},ClientRequest.prototype.setTimeout=function(){},ClientRequest.prototype.setNoDelay=function(){},ClientRequest.prototype.setSocketKeepAlive=function(){};var unsafeHeaders=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","date","dnt","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","user-agent","via"];

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)

},{"./capability":94,"./response":96,"_process":77,"buffer":10,"inherits":24,"stream":92}],96:[function(require,module,exports){
(function (process,global,Buffer){
var capability=require("./capability"),inherits=require("inherits"),stream=require("stream"),rStates=exports.readyStates={UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4},IncomingMessage=exports.IncomingMessage=function(e,r,a){function s(){u.read().then(function(e){if(!t._destroyed){if(e.done)return void t.push(null);t.push(new Buffer(e.value)),s()}})}var t=this;if(stream.Readable.call(t),t._mode=a,t.headers={},t.rawHeaders=[],t.trailers={},t.rawTrailers=[],t.on("end",function(){process.nextTick(function(){t.emit("close")})}),"fetch"===a){t._fetchResponse=r,t.statusCode=r.status,t.statusMessage=r.statusText;for(var n,o,i=r.headers[Symbol.iterator]();n=(o=i.next()).value,!o.done;)t.headers[n[0].toLowerCase()]=n[1],t.rawHeaders.push(n[0],n[1]);var u=r.body.getReader();s()}else{t._xhr=e,t._pos=0,t.statusCode=e.status,t.statusMessage=e.statusText;var h=e.getAllResponseHeaders().split(/\r?\n/);if(h.forEach(function(e){var r=e.match(/^([^:]+):\s*(.*)/);if(r){var a=r[1].toLowerCase();void 0!==t.headers[a]?t.headers[a]+=", "+r[2]:t.headers[a]=r[2],t.rawHeaders.push(r[1],r[2])}}),t._charset="x-user-defined",!capability.overrideMimeType){var f=t.rawHeaders["mime-type"];if(f){var c=f.match(/;\s*charset=([^;])(;|$)/);c&&(t._charset=c[1].toLowerCase())}t._charset||(t._charset="utf-8")}}};inherits(IncomingMessage,stream.Readable),IncomingMessage.prototype._read=function(){},IncomingMessage.prototype._onXHRProgress=function(){var e=this,r=e._xhr,a=null;switch(e._mode){case"text:vbarray":if(r.readyState!==rStates.DONE)break;try{a=new global.VBArray(r.responseBody).toArray()}catch(s){}if(null!==a){e.push(new Buffer(a));break}case"text":try{a=r.responseText}catch(s){e._mode="text:vbarray";break}if(a.length>e._pos){var t=a.substr(e._pos);if("x-user-defined"===e._charset){for(var n=new Buffer(t.length),o=0;o<t.length;o++)n[o]=255&t.charCodeAt(o);e.push(n)}else e.push(t,e._charset);e._pos=a.length}break;case"arraybuffer":if(r.readyState!==rStates.DONE)break;a=r.response,e.push(new Buffer(new Uint8Array(a)));break;case"moz-chunked-arraybuffer":if(a=r.response,r.readyState!==rStates.LOADING||!a)break;e.push(new Buffer(new Uint8Array(a)));break;case"ms-stream":if(a=r.response,r.readyState!==rStates.LOADING)break;var i=new global.MSStreamReader;i.onprogress=function(){i.result.byteLength>e._pos&&(e.push(new Buffer(new Uint8Array(i.result.slice(e._pos)))),e._pos=i.result.byteLength)},i.onload=function(){e.push(null)},i.readAsArrayBuffer(a)}e._xhr.readyState===rStates.DONE&&"ms-stream"!==e._mode&&e.push(null)};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)

},{"./capability":94,"_process":77,"buffer":10,"inherits":24,"stream":92}],97:[function(require,module,exports){
function assertEncoding(e){if(e&&!isBufferEncoding(e))throw new Error("Unknown encoding: "+e)}function passThroughWrite(e){return e.toString(this.encoding)}function utf16DetectIncompleteChar(e){this.charReceived=e.length%2,this.charLength=this.charReceived?2:0}function base64DetectIncompleteChar(e){this.charReceived=e.length%3,this.charLength=this.charReceived?3:0}var Buffer=require("buffer").Buffer,isBufferEncoding=Buffer.isEncoding||function(e){switch(e&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}},StringDecoder=exports.StringDecoder=function(e){switch(this.encoding=(e||"utf8").toLowerCase().replace(/[-_]/,""),assertEncoding(e),this.encoding){case"utf8":this.surrogateSize=3;break;case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=utf16DetectIncompleteChar;break;case"base64":this.surrogateSize=3,this.detectIncompleteChar=base64DetectIncompleteChar;break;default:return void(this.write=passThroughWrite)}this.charBuffer=new Buffer(6),this.charReceived=0,this.charLength=0};StringDecoder.prototype.write=function(e){for(var t="";this.charLength;){var r=e.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:e.length;if(e.copy(this.charBuffer,this.charReceived,0,r),this.charReceived+=r,this.charReceived<this.charLength)return"";e=e.slice(r,e.length),t=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var h=t.charCodeAt(t.length-1);if(!(h>=55296&&56319>=h)){if(this.charReceived=this.charLength=0,0===e.length)return t;break}this.charLength+=this.surrogateSize,t=""}this.detectIncompleteChar(e);var i=e.length;this.charLength&&(e.copy(this.charBuffer,0,e.length-this.charReceived,i),i-=this.charReceived),t+=e.toString(this.encoding,0,i);var i=t.length-1,h=t.charCodeAt(i);if(h>=55296&&56319>=h){var c=this.surrogateSize;return this.charLength+=c,this.charReceived+=c,this.charBuffer.copy(this.charBuffer,c,0,c),e.copy(this.charBuffer,0,0,c),t.substring(0,i)}return t},StringDecoder.prototype.detectIncompleteChar=function(e){for(var t=e.length>=3?3:e.length;t>0;t--){var r=e[e.length-t];if(1==t&&r>>5==6){this.charLength=2;break}if(2>=t&&r>>4==14){this.charLength=3;break}if(3>=t&&r>>3==30){this.charLength=4;break}}this.charReceived=t},StringDecoder.prototype.end=function(e){var t="";if(e&&e.length&&(t=this.write(e)),this.charReceived){var r=this.charReceived,h=this.charBuffer,i=this.encoding;t+=h.slice(0,r).toString(i)}return t};

},{"buffer":10}],98:[function(require,module,exports){
module.exports=["get","put","post","delete","options","head","patch"];

},{}],99:[function(require,module,exports){
module.exports={
  "title": "A JSON Schema for Swagger 2.0 API.",
  "id": "http://swagger.io/v2/schema.json#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "required": [
    "swagger",
    "info",
    "paths"
  ],
  "additionalProperties": false,
  "patternProperties": {
    "^x-": {
      "$ref": "#/definitions/vendorExtension"
    }
  },
  "properties": {
    "swagger": {
      "type": "string",
      "enum": [
        "2.0"
      ],
      "description": "The Swagger version of this document."
    },
    "info": {
      "$ref": "#/definitions/info"
    },
    "host": {
      "type": "string",
      "pattern": "^[^{}/ :\\\\]+(?::\\d+)?$",
      "description": "The host (name or ip) of the API. Example: 'swagger.io'"
    },
    "basePath": {
      "type": "string",
      "pattern": "^/",
      "description": "The base path to the API. Example: '/api'."
    },
    "schemes": {
      "$ref": "#/definitions/schemesList"
    },
    "consumes": {
      "description": "A list of MIME types accepted by the API.",
      "$ref": "#/definitions/mediaTypeList"
    },
    "produces": {
      "description": "A list of MIME types the API can produce.",
      "$ref": "#/definitions/mediaTypeList"
    },
    "paths": {
      "$ref": "#/definitions/paths"
    },
    "definitions": {
      "$ref": "#/definitions/definitions"
    },
    "parameters": {
      "$ref": "#/definitions/parameterDefinitions"
    },
    "responses": {
      "$ref": "#/definitions/responseDefinitions"
    },
    "security": {
      "$ref": "#/definitions/security"
    },
    "securityDefinitions": {
      "$ref": "#/definitions/securityDefinitions"
    },
    "tags": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/tag"
      },
      "uniqueItems": true
    },
    "externalDocs": {
      "$ref": "#/definitions/externalDocs"
    }
  },
  "definitions": {
    "info": {
      "type": "object",
      "description": "General information about the API.",
      "required": [
        "version",
        "title"
      ],
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "title": {
          "type": "string",
          "description": "A unique and precise title of the API."
        },
        "version": {
          "type": "string",
          "description": "A semantic version number of the API."
        },
        "description": {
          "type": "string",
          "description": "A longer description of the API. Should be different from the title.  GitHub Flavored Markdown is allowed."
        },
        "termsOfService": {
          "type": "string",
          "description": "The terms of service for the API."
        },
        "contact": {
          "$ref": "#/definitions/contact"
        },
        "license": {
          "$ref": "#/definitions/license"
        }
      }
    },
    "contact": {
      "type": "object",
      "description": "Contact information for the owners of the API.",
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string",
          "description": "The identifying name of the contact person/organization."
        },
        "url": {
          "type": "string",
          "description": "The URL pointing to the contact information.",
          "format": "uri"
        },
        "email": {
          "type": "string",
          "description": "The email address of the contact person/organization.",
          "format": "email"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "license": {
      "type": "object",
      "required": [
        "name"
      ],
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the license type. It's encouraged to use an OSI compatible license."
        },
        "url": {
          "type": "string",
          "description": "The URL pointing to the license.",
          "format": "uri"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "paths": {
      "type": "object",
      "description": "Relative paths to the individual endpoints. They must be relative to the 'basePath'.",
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        },
        "^/": {
          "$ref": "#/definitions/pathItem"
        }
      },
      "additionalProperties": false
    },
    "definitions": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/schema"
      },
      "description": "One or more JSON objects describing the schemas being consumed and produced by the API."
    },
    "parameterDefinitions": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/parameter"
      },
      "description": "One or more JSON representations for parameters"
    },
    "responseDefinitions": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/response"
      },
      "description": "One or more JSON representations for parameters"
    },
    "externalDocs": {
      "type": "object",
      "additionalProperties": false,
      "description": "information about external documentation",
      "required": [
        "url"
      ],
      "properties": {
        "description": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "examples": {
      "type": "object",
      "additionalProperties": true
    },
    "mimeType": {
      "type": "string",
      "description": "The MIME type of the HTTP message."
    },
    "operation": {
      "type": "object",
      "required": [
        "responses"
      ],
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "uniqueItems": true
        },
        "summary": {
          "type": "string",
          "description": "A brief summary of the operation."
        },
        "description": {
          "type": "string",
          "description": "A longer description of the operation, GitHub Flavored Markdown is allowed."
        },
        "externalDocs": {
          "$ref": "#/definitions/externalDocs"
        },
        "operationId": {
          "type": "string",
          "description": "A unique identifier of the operation."
        },
        "produces": {
          "description": "A list of MIME types the API can produce.",
          "$ref": "#/definitions/mediaTypeList"
        },
        "consumes": {
          "description": "A list of MIME types the API can consume.",
          "$ref": "#/definitions/mediaTypeList"
        },
        "parameters": {
          "$ref": "#/definitions/parametersList"
        },
        "responses": {
          "$ref": "#/definitions/responses"
        },
        "schemes": {
          "$ref": "#/definitions/schemesList"
        },
        "deprecated": {
          "type": "boolean",
          "default": false
        },
        "security": {
          "$ref": "#/definitions/security"
        }
      }
    },
    "pathItem": {
      "type": "object",
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "$ref": {
          "type": "string"
        },
        "get": {
          "$ref": "#/definitions/operation"
        },
        "put": {
          "$ref": "#/definitions/operation"
        },
        "post": {
          "$ref": "#/definitions/operation"
        },
        "delete": {
          "$ref": "#/definitions/operation"
        },
        "options": {
          "$ref": "#/definitions/operation"
        },
        "head": {
          "$ref": "#/definitions/operation"
        },
        "patch": {
          "$ref": "#/definitions/operation"
        },
        "parameters": {
          "$ref": "#/definitions/parametersList"
        }
      }
    },
    "responses": {
      "type": "object",
      "description": "Response objects names can either be any valid HTTP status code or 'default'.",
      "minProperties": 1,
      "additionalProperties": false,
      "patternProperties": {
        "^([0-9]{3})$|^(default)$": {
          "$ref": "#/definitions/responseValue"
        },
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "not": {
        "type": "object",
        "additionalProperties": false,
        "patternProperties": {
          "^x-": {
            "$ref": "#/definitions/vendorExtension"
          }
        }
      }
    },
    "responseValue": {
      "oneOf": [
        {
          "$ref": "#/definitions/response"
        },
        {
          "$ref": "#/definitions/jsonReference"
        }
      ]
    },
    "response": {
      "type": "object",
      "required": [
        "description"
      ],
      "properties": {
        "description": {
          "type": "string"
        },
        "schema": {
          "oneOf": [
            {
              "$ref": "#/definitions/schema"
            },
            {
              "$ref": "#/definitions/fileSchema"
            }
          ]
        },
        "headers": {
          "$ref": "#/definitions/headers"
        },
        "examples": {
          "$ref": "#/definitions/examples"
        }
      },
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "headers": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/header"
      }
    },
    "header": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "string",
            "number",
            "integer",
            "boolean",
            "array"
          ]
        },
        "format": {
          "type": "string"
        },
        "items": {
          "$ref": "#/definitions/primitivesItems"
        },
        "collectionFormat": {
          "$ref": "#/definitions/collectionFormat"
        },
        "default": {
          "$ref": "#/definitions/default"
        },
        "maximum": {
          "$ref": "#/definitions/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "#/definitions/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "#/definitions/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "#/definitions/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "#/definitions/maxLength"
        },
        "minLength": {
          "$ref": "#/definitions/minLength"
        },
        "pattern": {
          "$ref": "#/definitions/pattern"
        },
        "maxItems": {
          "$ref": "#/definitions/maxItems"
        },
        "minItems": {
          "$ref": "#/definitions/minItems"
        },
        "uniqueItems": {
          "$ref": "#/definitions/uniqueItems"
        },
        "enum": {
          "$ref": "#/definitions/enum"
        },
        "multipleOf": {
          "$ref": "#/definitions/multipleOf"
        },
        "description": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "vendorExtension": {
      "description": "Any property starting with x- is valid.",
      "additionalProperties": true,
      "additionalItems": true
    },
    "bodyParameter": {
      "type": "object",
      "required": [
        "name",
        "in",
        "schema"
      ],
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "description": {
          "type": "string",
          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed."
        },
        "name": {
          "type": "string",
          "description": "The name of the parameter."
        },
        "in": {
          "type": "string",
          "description": "Determines the location of the parameter.",
          "enum": [
            "body"
          ]
        },
        "required": {
          "type": "boolean",
          "description": "Determines whether or not this parameter is required or optional.",
          "default": false
        },
        "schema": {
          "$ref": "#/definitions/schema"
        }
      },
      "additionalProperties": false
    },
    "headerParameterSubSchema": {
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "required": {
          "type": "boolean",
          "description": "Determines whether or not this parameter is required or optional.",
          "default": false
        },
        "in": {
          "type": "string",
          "description": "Determines the location of the parameter.",
          "enum": [
            "header"
          ]
        },
        "description": {
          "type": "string",
          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed."
        },
        "name": {
          "type": "string",
          "description": "The name of the parameter."
        },
        "type": {
          "type": "string",
          "enum": [
            "string",
            "number",
            "boolean",
            "integer",
            "array"
          ]
        },
        "format": {
          "type": "string"
        },
        "items": {
          "$ref": "#/definitions/primitivesItems"
        },
        "collectionFormat": {
          "$ref": "#/definitions/collectionFormat"
        },
        "default": {
          "$ref": "#/definitions/default"
        },
        "maximum": {
          "$ref": "#/definitions/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "#/definitions/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "#/definitions/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "#/definitions/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "#/definitions/maxLength"
        },
        "minLength": {
          "$ref": "#/definitions/minLength"
        },
        "pattern": {
          "$ref": "#/definitions/pattern"
        },
        "maxItems": {
          "$ref": "#/definitions/maxItems"
        },
        "minItems": {
          "$ref": "#/definitions/minItems"
        },
        "uniqueItems": {
          "$ref": "#/definitions/uniqueItems"
        },
        "enum": {
          "$ref": "#/definitions/enum"
        },
        "multipleOf": {
          "$ref": "#/definitions/multipleOf"
        }
      }
    },
    "queryParameterSubSchema": {
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "required": {
          "type": "boolean",
          "description": "Determines whether or not this parameter is required or optional.",
          "default": false
        },
        "in": {
          "type": "string",
          "description": "Determines the location of the parameter.",
          "enum": [
            "query"
          ]
        },
        "description": {
          "type": "string",
          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed."
        },
        "name": {
          "type": "string",
          "description": "The name of the parameter."
        },
        "allowEmptyValue": {
          "type": "boolean",
          "default": false,
          "description": "allows sending a parameter by name only or with an empty value."
        },
        "type": {
          "type": "string",
          "enum": [
            "string",
            "number",
            "boolean",
            "integer",
            "array"
          ]
        },
        "format": {
          "type": "string"
        },
        "items": {
          "$ref": "#/definitions/primitivesItems"
        },
        "collectionFormat": {
          "$ref": "#/definitions/collectionFormatWithMulti"
        },
        "default": {
          "$ref": "#/definitions/default"
        },
        "maximum": {
          "$ref": "#/definitions/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "#/definitions/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "#/definitions/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "#/definitions/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "#/definitions/maxLength"
        },
        "minLength": {
          "$ref": "#/definitions/minLength"
        },
        "pattern": {
          "$ref": "#/definitions/pattern"
        },
        "maxItems": {
          "$ref": "#/definitions/maxItems"
        },
        "minItems": {
          "$ref": "#/definitions/minItems"
        },
        "uniqueItems": {
          "$ref": "#/definitions/uniqueItems"
        },
        "enum": {
          "$ref": "#/definitions/enum"
        },
        "multipleOf": {
          "$ref": "#/definitions/multipleOf"
        }
      }
    },
    "formDataParameterSubSchema": {
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "required": {
          "type": "boolean",
          "description": "Determines whether or not this parameter is required or optional.",
          "default": false
        },
        "in": {
          "type": "string",
          "description": "Determines the location of the parameter.",
          "enum": [
            "formData"
          ]
        },
        "description": {
          "type": "string",
          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed."
        },
        "name": {
          "type": "string",
          "description": "The name of the parameter."
        },
        "allowEmptyValue": {
          "type": "boolean",
          "default": false,
          "description": "allows sending a parameter by name only or with an empty value."
        },
        "type": {
          "type": "string",
          "enum": [
            "string",
            "number",
            "boolean",
            "integer",
            "array",
            "file"
          ]
        },
        "format": {
          "type": "string"
        },
        "items": {
          "$ref": "#/definitions/primitivesItems"
        },
        "collectionFormat": {
          "$ref": "#/definitions/collectionFormatWithMulti"
        },
        "default": {
          "$ref": "#/definitions/default"
        },
        "maximum": {
          "$ref": "#/definitions/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "#/definitions/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "#/definitions/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "#/definitions/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "#/definitions/maxLength"
        },
        "minLength": {
          "$ref": "#/definitions/minLength"
        },
        "pattern": {
          "$ref": "#/definitions/pattern"
        },
        "maxItems": {
          "$ref": "#/definitions/maxItems"
        },
        "minItems": {
          "$ref": "#/definitions/minItems"
        },
        "uniqueItems": {
          "$ref": "#/definitions/uniqueItems"
        },
        "enum": {
          "$ref": "#/definitions/enum"
        },
        "multipleOf": {
          "$ref": "#/definitions/multipleOf"
        }
      }
    },
    "pathParameterSubSchema": {
      "additionalProperties": false,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "required": [
        "required"
      ],
      "properties": {
        "required": {
          "type": "boolean",
          "enum": [
            true
          ],
          "description": "Determines whether or not this parameter is required or optional."
        },
        "in": {
          "type": "string",
          "description": "Determines the location of the parameter.",
          "enum": [
            "path"
          ]
        },
        "description": {
          "type": "string",
          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed."
        },
        "name": {
          "type": "string",
          "description": "The name of the parameter."
        },
        "type": {
          "type": "string",
          "enum": [
            "string",
            "number",
            "boolean",
            "integer",
            "array"
          ]
        },
        "format": {
          "type": "string"
        },
        "items": {
          "$ref": "#/definitions/primitivesItems"
        },
        "collectionFormat": {
          "$ref": "#/definitions/collectionFormat"
        },
        "default": {
          "$ref": "#/definitions/default"
        },
        "maximum": {
          "$ref": "#/definitions/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "#/definitions/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "#/definitions/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "#/definitions/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "#/definitions/maxLength"
        },
        "minLength": {
          "$ref": "#/definitions/minLength"
        },
        "pattern": {
          "$ref": "#/definitions/pattern"
        },
        "maxItems": {
          "$ref": "#/definitions/maxItems"
        },
        "minItems": {
          "$ref": "#/definitions/minItems"
        },
        "uniqueItems": {
          "$ref": "#/definitions/uniqueItems"
        },
        "enum": {
          "$ref": "#/definitions/enum"
        },
        "multipleOf": {
          "$ref": "#/definitions/multipleOf"
        }
      }
    },
    "nonBodyParameter": {
      "type": "object",
      "required": [
        "name",
        "in",
        "type"
      ],
      "oneOf": [
        {
          "$ref": "#/definitions/headerParameterSubSchema"
        },
        {
          "$ref": "#/definitions/formDataParameterSubSchema"
        },
        {
          "$ref": "#/definitions/queryParameterSubSchema"
        },
        {
          "$ref": "#/definitions/pathParameterSubSchema"
        }
      ]
    },
    "parameter": {
      "oneOf": [
        {
          "$ref": "#/definitions/bodyParameter"
        },
        {
          "$ref": "#/definitions/nonBodyParameter"
        }
      ]
    },
    "schema": {
      "type": "object",
      "description": "A deterministic version of a JSON Schema object.",
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "$ref": {
          "type": "string"
        },
        "format": {
          "type": "string"
        },
        "title": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/title"
        },
        "description": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/description"
        },
        "default": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/default"
        },
        "multipleOf": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/multipleOf"
        },
        "maximum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
        },
        "minLength": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
        },
        "pattern": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/pattern"
        },
        "maxItems": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
        },
        "minItems": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
        },
        "uniqueItems": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/uniqueItems"
        },
        "maxProperties": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
        },
        "minProperties": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
        },
        "required": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/stringArray"
        },
        "enum": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/enum"
        },
        "additionalProperties": {
          "anyOf": [
            {
              "$ref": "#/definitions/schema"
            },
            {
              "type": "boolean"
            }
          ],
          "default": {}
        },
        "type": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/type"
        },
        "items": {
          "anyOf": [
            {
              "$ref": "#/definitions/schema"
            },
            {
              "type": "array",
              "minItems": 1,
              "items": {
                "$ref": "#/definitions/schema"
              }
            }
          ],
          "default": {}
        },
        "allOf": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/schema"
          }
        },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/schema"
          },
          "default": {}
        },
        "discriminator": {
          "type": "string"
        },
        "readOnly": {
          "type": "boolean",
          "default": false
        },
        "xml": {
          "$ref": "#/definitions/xml"
        },
        "externalDocs": {
          "$ref": "#/definitions/externalDocs"
        },
        "example": {}
      },
      "additionalProperties": false
    },
    "fileSchema": {
      "type": "object",
      "description": "A deterministic version of a JSON Schema object.",
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "required": [
        "type"
      ],
      "properties": {
        "format": {
          "type": "string"
        },
        "title": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/title"
        },
        "description": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/description"
        },
        "default": {
          "$ref": "http://json-schema.org/draft-04/schema#/properties/default"
        },
        "required": {
          "$ref": "http://json-schema.org/draft-04/schema#/definitions/stringArray"
        },
        "type": {
          "type": "string",
          "enum": [
            "file"
          ]
        },
        "readOnly": {
          "type": "boolean",
          "default": false
        },
        "externalDocs": {
          "$ref": "#/definitions/externalDocs"
        },
        "example": {}
      },
      "additionalProperties": false
    },
    "primitivesItems": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "string",
            "number",
            "integer",
            "boolean",
            "array"
          ]
        },
        "format": {
          "type": "string"
        },
        "items": {
          "$ref": "#/definitions/primitivesItems"
        },
        "collectionFormat": {
          "$ref": "#/definitions/collectionFormat"
        },
        "default": {
          "$ref": "#/definitions/default"
        },
        "maximum": {
          "$ref": "#/definitions/maximum"
        },
        "exclusiveMaximum": {
          "$ref": "#/definitions/exclusiveMaximum"
        },
        "minimum": {
          "$ref": "#/definitions/minimum"
        },
        "exclusiveMinimum": {
          "$ref": "#/definitions/exclusiveMinimum"
        },
        "maxLength": {
          "$ref": "#/definitions/maxLength"
        },
        "minLength": {
          "$ref": "#/definitions/minLength"
        },
        "pattern": {
          "$ref": "#/definitions/pattern"
        },
        "maxItems": {
          "$ref": "#/definitions/maxItems"
        },
        "minItems": {
          "$ref": "#/definitions/minItems"
        },
        "uniqueItems": {
          "$ref": "#/definitions/uniqueItems"
        },
        "enum": {
          "$ref": "#/definitions/enum"
        },
        "multipleOf": {
          "$ref": "#/definitions/multipleOf"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "security": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/securityRequirement"
      },
      "uniqueItems": true
    },
    "securityRequirement": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "uniqueItems": true
      }
    },
    "xml": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string"
        },
        "namespace": {
          "type": "string"
        },
        "prefix": {
          "type": "string"
        },
        "attribute": {
          "type": "boolean",
          "default": false
        },
        "wrapped": {
          "type": "boolean",
          "default": false
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "tag": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "name"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "externalDocs": {
          "$ref": "#/definitions/externalDocs"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "securityDefinitions": {
      "type": "object",
      "additionalProperties": {
        "oneOf": [
          {
            "$ref": "#/definitions/basicAuthenticationSecurity"
          },
          {
            "$ref": "#/definitions/apiKeySecurity"
          },
          {
            "$ref": "#/definitions/oauth2ImplicitSecurity"
          },
          {
            "$ref": "#/definitions/oauth2PasswordSecurity"
          },
          {
            "$ref": "#/definitions/oauth2ApplicationSecurity"
          },
          {
            "$ref": "#/definitions/oauth2AccessCodeSecurity"
          }
        ]
      }
    },
    "basicAuthenticationSecurity": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "basic"
          ]
        },
        "description": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "apiKeySecurity": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "name",
        "in"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "apiKey"
          ]
        },
        "name": {
          "type": "string"
        },
        "in": {
          "type": "string",
          "enum": [
            "header",
            "query"
          ]
        },
        "description": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "oauth2ImplicitSecurity": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "flow",
        "authorizationUrl"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "oauth2"
          ]
        },
        "flow": {
          "type": "string",
          "enum": [
            "implicit"
          ]
        },
        "scopes": {
          "$ref": "#/definitions/oauth2Scopes"
        },
        "authorizationUrl": {
          "type": "string",
          "format": "uri"
        },
        "description": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "oauth2PasswordSecurity": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "flow",
        "tokenUrl"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "oauth2"
          ]
        },
        "flow": {
          "type": "string",
          "enum": [
            "password"
          ]
        },
        "scopes": {
          "$ref": "#/definitions/oauth2Scopes"
        },
        "tokenUrl": {
          "type": "string",
          "format": "uri"
        },
        "description": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "oauth2ApplicationSecurity": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "flow",
        "tokenUrl"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "oauth2"
          ]
        },
        "flow": {
          "type": "string",
          "enum": [
            "application"
          ]
        },
        "scopes": {
          "$ref": "#/definitions/oauth2Scopes"
        },
        "tokenUrl": {
          "type": "string",
          "format": "uri"
        },
        "description": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "oauth2AccessCodeSecurity": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "flow",
        "authorizationUrl",
        "tokenUrl"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "oauth2"
          ]
        },
        "flow": {
          "type": "string",
          "enum": [
            "accessCode"
          ]
        },
        "scopes": {
          "$ref": "#/definitions/oauth2Scopes"
        },
        "authorizationUrl": {
          "type": "string",
          "format": "uri"
        },
        "tokenUrl": {
          "type": "string",
          "format": "uri"
        },
        "description": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      }
    },
    "oauth2Scopes": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "mediaTypeList": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/mimeType"
      },
      "uniqueItems": true
    },
    "parametersList": {
      "type": "array",
      "description": "The parameters needed to send a valid API call.",
      "additionalItems": false,
      "items": {
        "oneOf": [
          {
            "$ref": "#/definitions/parameter"
          },
          {
            "$ref": "#/definitions/jsonReference"
          }
        ]
      },
      "uniqueItems": true
    },
    "schemesList": {
      "type": "array",
      "description": "The transfer protocol of the API.",
      "items": {
        "type": "string",
        "enum": [
          "http",
          "https",
          "ws",
          "wss"
        ]
      },
      "uniqueItems": true
    },
    "collectionFormat": {
      "type": "string",
      "enum": [
        "csv",
        "ssv",
        "tsv",
        "pipes"
      ],
      "default": "csv"
    },
    "collectionFormatWithMulti": {
      "type": "string",
      "enum": [
        "csv",
        "ssv",
        "tsv",
        "pipes",
        "multi"
      ],
      "default": "csv"
    },
    "title": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/title"
    },
    "description": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/description"
    },
    "default": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/default"
    },
    "multipleOf": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/multipleOf"
    },
    "maximum": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/maximum"
    },
    "exclusiveMaximum": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum"
    },
    "minimum": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/minimum"
    },
    "exclusiveMinimum": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum"
    },
    "maxLength": {
      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
    },
    "minLength": {
      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
    },
    "pattern": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/pattern"
    },
    "maxItems": {
      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger"
    },
    "minItems": {
      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0"
    },
    "uniqueItems": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/uniqueItems"
    },
    "enum": {
      "$ref": "http://json-schema.org/draft-04/schema#/properties/enum"
    },
    "jsonReference": {
      "type": "object",
      "required": [
        "$ref"
      ],
      "additionalProperties": false,
      "properties": {
        "$ref": {
          "type": "string"
        }
      }
    }
  }
}
},{}],100:[function(require,module,exports){
"use strict";function Url(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function urlParse(t,s,e){if(t&&util.isObject(t)&&t instanceof Url)return t;var h=new Url;return h.parse(t,s,e),h}function urlFormat(t){return util.isString(t)&&(t=urlParse(t)),t instanceof Url?t.format():Url.prototype.format.call(t)}function urlResolve(t,s){return urlParse(t,!1,!0).resolve(s)}function urlResolveObject(t,s){return t?urlParse(t,!1,!0).resolveObject(s):s}var punycode=require("punycode"),util=require("./util");exports.parse=urlParse,exports.resolve=urlResolve,exports.resolveObject=urlResolveObject,exports.format=urlFormat,exports.Url=Url;var protocolPattern=/^([a-z0-9.+-]+:)/i,portPattern=/:[0-9]*$/,simplePathPattern=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,delims=["<",">",'"',"`"," ","\r","\n","	"],unwise=["{","}","|","\\","^","`"].concat(delims),autoEscape=["'"].concat(unwise),nonHostChars=["%","/","?",";","#"].concat(autoEscape),hostEndingChars=["/","?","#"],hostnameMaxLen=255,hostnamePartPattern=/^[+a-z0-9A-Z_-]{0,63}$/,hostnamePartStart=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,unsafeProtocol={javascript:!0,"javascript:":!0},hostlessProtocol={javascript:!0,"javascript:":!0},slashedProtocol={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},querystring=require("querystring");Url.prototype.parse=function(t,s,e){if(!util.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var h=t.indexOf("?"),r=-1!==h&&h<t.indexOf("#")?"?":"#",a=t.split(r),o=/\\/g;a[0]=a[0].replace(o,"/"),t=a.join(r);var n=t;if(n=n.trim(),!e&&1===t.split("#").length){var i=simplePathPattern.exec(n);if(i)return this.path=n,this.href=n,this.pathname=i[1],i[2]?(this.search=i[2],s?this.query=querystring.parse(this.search.substr(1)):this.query=this.search.substr(1)):s&&(this.search="",this.query={}),this}var l=protocolPattern.exec(n);if(l){l=l[0];var u=l.toLowerCase();this.protocol=u,n=n.substr(l.length)}if(e||l||n.match(/^\/\/[^@\/]+@[^@\/]+/)){var p="//"===n.substr(0,2);!p||l&&hostlessProtocol[l]||(n=n.substr(2),this.slashes=!0)}if(!hostlessProtocol[l]&&(p||l&&!slashedProtocol[l])){for(var c=-1,f=0;f<hostEndingChars.length;f++){var m=n.indexOf(hostEndingChars[f]);-1!==m&&(-1===c||c>m)&&(c=m)}var v,g;g=-1===c?n.lastIndexOf("@"):n.lastIndexOf("@",c),-1!==g&&(v=n.slice(0,g),n=n.slice(g+1),this.auth=decodeURIComponent(v)),c=-1;for(var f=0;f<nonHostChars.length;f++){var m=n.indexOf(nonHostChars[f]);-1!==m&&(-1===c||c>m)&&(c=m)}-1===c&&(c=n.length),this.host=n.slice(0,c),n=n.slice(c),this.parseHost(),this.hostname=this.hostname||"";var y="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!y)for(var P=this.hostname.split(/\./),f=0,d=P.length;d>f;f++){var q=P[f];if(q&&!q.match(hostnamePartPattern)){for(var b="",O=0,j=q.length;j>O;O++)b+=q.charCodeAt(O)>127?"x":q[O];if(!b.match(hostnamePartPattern)){var x=P.slice(0,f),U=P.slice(f+1),C=q.match(hostnamePartStart);C&&(x.push(C[1]),U.unshift(C[2])),U.length&&(n="/"+U.join(".")+n),this.hostname=x.join(".");break}}}this.hostname.length>hostnameMaxLen?this.hostname="":this.hostname=this.hostname.toLowerCase(),y||(this.hostname=punycode.toASCII(this.hostname));var A=this.port?":"+this.port:"",w=this.hostname||"";this.host=w+A,this.href+=this.host,y&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==n[0]&&(n="/"+n))}if(!unsafeProtocol[u])for(var f=0,d=autoEscape.length;d>f;f++){var E=autoEscape[f];if(-1!==n.indexOf(E)){var I=encodeURIComponent(E);I===E&&(I=escape(E)),n=n.split(E).join(I)}}var R=n.indexOf("#");-1!==R&&(this.hash=n.substr(R),n=n.slice(0,R));var S=n.indexOf("?");if(-1!==S?(this.search=n.substr(S),this.query=n.substr(S+1),s&&(this.query=querystring.parse(this.query)),n=n.slice(0,S)):s&&(this.search="",this.query={}),n&&(this.pathname=n),slashedProtocol[u]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var A=this.pathname||"",k=this.search||"";this.path=A+k}return this.href=this.format(),this},Url.prototype.format=function(){var t=this.auth||"";t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,":"),t+="@");var s=this.protocol||"",e=this.pathname||"",h=this.hash||"",r=!1,a="";this.host?r=t+this.host:this.hostname&&(r=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(r+=":"+this.port)),this.query&&util.isObject(this.query)&&Object.keys(this.query).length&&(a=querystring.stringify(this.query));var o=this.search||a&&"?"+a||"";return s&&":"!==s.substr(-1)&&(s+=":"),this.slashes||(!s||slashedProtocol[s])&&r!==!1?(r="//"+(r||""),e&&"/"!==e.charAt(0)&&(e="/"+e)):r||(r=""),h&&"#"!==h.charAt(0)&&(h="#"+h),o&&"?"!==o.charAt(0)&&(o="?"+o),e=e.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),o=o.replace("#","%23"),s+r+e+o+h},Url.prototype.resolve=function(t){return this.resolveObject(urlParse(t,!1,!0)).format()},Url.prototype.resolveObject=function(t){if(util.isString(t)){var s=new Url;s.parse(t,!1,!0),t=s}for(var e=new Url,h=Object.keys(this),r=0;r<h.length;r++){var a=h[r];e[a]=this[a]}if(e.hash=t.hash,""===t.href)return e.href=e.format(),e;if(t.slashes&&!t.protocol){for(var o=Object.keys(t),n=0;n<o.length;n++){var i=o[n];"protocol"!==i&&(e[i]=t[i])}return slashedProtocol[e.protocol]&&e.hostname&&!e.pathname&&(e.path=e.pathname="/"),e.href=e.format(),e}if(t.protocol&&t.protocol!==e.protocol){if(!slashedProtocol[t.protocol]){for(var l=Object.keys(t),u=0;u<l.length;u++){var p=l[u];e[p]=t[p]}return e.href=e.format(),e}if(e.protocol=t.protocol,t.host||hostlessProtocol[t.protocol])e.pathname=t.pathname;else{for(var c=(t.pathname||"").split("/");c.length&&!(t.host=c.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==c[0]&&c.unshift(""),c.length<2&&c.unshift(""),e.pathname=c.join("/")}if(e.search=t.search,e.query=t.query,e.host=t.host||"",e.auth=t.auth,e.hostname=t.hostname||t.host,e.port=t.port,e.pathname||e.search){var f=e.pathname||"",m=e.search||"";e.path=f+m}return e.slashes=e.slashes||t.slashes,e.href=e.format(),e}var v=e.pathname&&"/"===e.pathname.charAt(0),g=t.host||t.pathname&&"/"===t.pathname.charAt(0),y=g||v||e.host&&t.pathname,P=y,d=e.pathname&&e.pathname.split("/")||[],c=t.pathname&&t.pathname.split("/")||[],q=e.protocol&&!slashedProtocol[e.protocol];if(q&&(e.hostname="",e.port=null,e.host&&(""===d[0]?d[0]=e.host:d.unshift(e.host)),e.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===c[0]?c[0]=t.host:c.unshift(t.host)),t.host=null),y=y&&(""===c[0]||""===d[0])),g)e.host=t.host||""===t.host?t.host:e.host,e.hostname=t.hostname||""===t.hostname?t.hostname:e.hostname,e.search=t.search,e.query=t.query,d=c;else if(c.length)d||(d=[]),d.pop(),d=d.concat(c),e.search=t.search,e.query=t.query;else if(!util.isNullOrUndefined(t.search)){if(q){e.hostname=e.host=d.shift();var b=e.host&&e.host.indexOf("@")>0?e.host.split("@"):!1;b&&(e.auth=b.shift(),e.host=e.hostname=b.shift())}return e.search=t.search,e.query=t.query,util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.href=e.format(),e}if(!d.length)return e.pathname=null,e.search?e.path="/"+e.search:e.path=null,e.href=e.format(),e;for(var O=d.slice(-1)[0],j=(e.host||t.host||d.length>1)&&("."===O||".."===O)||""===O,x=0,U=d.length;U>=0;U--)O=d[U],"."===O?d.splice(U,1):".."===O?(d.splice(U,1),x++):x&&(d.splice(U,1),x--);if(!y&&!P)for(;x--;x)d.unshift("..");!y||""===d[0]||d[0]&&"/"===d[0].charAt(0)||d.unshift(""),j&&"/"!==d.join("/").substr(-1)&&d.push("");var C=""===d[0]||d[0]&&"/"===d[0].charAt(0);if(q){e.hostname=e.host=C?"":d.length?d.shift():"";var b=e.host&&e.host.indexOf("@")>0?e.host.split("@"):!1;b&&(e.auth=b.shift(),e.host=e.hostname=b.shift())}return y=y||e.host&&d.length,y&&!C&&d.unshift(""),d.length?e.pathname=d.join("/"):(e.pathname=null,e.path=null),util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.auth=t.auth||e.auth,e.slashes=e.slashes||t.slashes,e.href=e.format(),e},Url.prototype.parseHost=function(){var t=this.host,s=portPattern.exec(t);s&&(s=s[0],":"!==s&&(this.port=s.substr(1)),t=t.substr(0,t.length-s.length)),t&&(this.hostname=t)};

},{"./util":101,"punycode":78,"querystring":81}],101:[function(require,module,exports){
"use strict";module.exports={isString:function(n){return"string"==typeof n},isObject:function(n){return"object"==typeof n&&null!==n},isNull:function(n){return null===n},isNullOrUndefined:function(n){return null==n}};

},{}],102:[function(require,module,exports){
(function (global){
function deprecate(r,e){function o(){if(!t){if(config("throwDeprecation"))throw new Error(e);config("traceDeprecation")?console.trace(e):console.warn(e),t=!0}return r.apply(this,arguments)}if(config("noDeprecation"))return r;var t=!1;return o}function config(r){try{if(!global.localStorage)return!1}catch(e){return!1}var o=global.localStorage[r];return null==o?!1:"true"===String(o).toLowerCase()}module.exports=deprecate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],103:[function(require,module,exports){
module.exports=function(o){return o&&"object"==typeof o&&"function"==typeof o.copy&&"function"==typeof o.fill&&"function"==typeof o.readUInt8};

},{}],104:[function(require,module,exports){
(function (process,global){
function inspect(e,r){var t={seen:[],stylize:stylizeNoColor};return arguments.length>=3&&(t.depth=arguments[2]),arguments.length>=4&&(t.colors=arguments[3]),isBoolean(r)?t.showHidden=r:r&&exports._extend(t,r),isUndefined(t.showHidden)&&(t.showHidden=!1),isUndefined(t.depth)&&(t.depth=2),isUndefined(t.colors)&&(t.colors=!1),isUndefined(t.customInspect)&&(t.customInspect=!0),t.colors&&(t.stylize=stylizeWithColor),formatValue(t,e,t.depth)}function stylizeWithColor(e,r){var t=inspect.styles[r];return t?"["+inspect.colors[t][0]+"m"+e+"["+inspect.colors[t][1]+"m":e}function stylizeNoColor(e,r){return e}function arrayToHash(e){var r={};return e.forEach(function(e,t){r[e]=!0}),r}function formatValue(e,r,t){if(e.customInspect&&r&&isFunction(r.inspect)&&r.inspect!==exports.inspect&&(!r.constructor||r.constructor.prototype!==r)){var n=r.inspect(t,e);return isString(n)||(n=formatValue(e,n,t)),n}var i=formatPrimitive(e,r);if(i)return i;var o=Object.keys(r),s=arrayToHash(o);if(e.showHidden&&(o=Object.getOwnPropertyNames(r)),isError(r)&&(o.indexOf("message")>=0||o.indexOf("description")>=0))return formatError(r);if(0===o.length){if(isFunction(r)){var u=r.name?": "+r.name:"";return e.stylize("[Function"+u+"]","special")}if(isRegExp(r))return e.stylize(RegExp.prototype.toString.call(r),"regexp");if(isDate(r))return e.stylize(Date.prototype.toString.call(r),"date");if(isError(r))return formatError(r)}var a="",c=!1,l=["{","}"];if(isArray(r)&&(c=!0,l=["[","]"]),isFunction(r)){var p=r.name?": "+r.name:"";a=" [Function"+p+"]"}if(isRegExp(r)&&(a=" "+RegExp.prototype.toString.call(r)),isDate(r)&&(a=" "+Date.prototype.toUTCString.call(r)),isError(r)&&(a=" "+formatError(r)),0===o.length&&(!c||0==r.length))return l[0]+a+l[1];if(0>t)return isRegExp(r)?e.stylize(RegExp.prototype.toString.call(r),"regexp"):e.stylize("[Object]","special");e.seen.push(r);var f;return f=c?formatArray(e,r,t,s,o):o.map(function(n){return formatProperty(e,r,t,s,n,c)}),e.seen.pop(),reduceToSingleString(f,a,l)}function formatPrimitive(e,r){if(isUndefined(r))return e.stylize("undefined","undefined");if(isString(r)){var t="'"+JSON.stringify(r).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(t,"string")}return isNumber(r)?e.stylize(""+r,"number"):isBoolean(r)?e.stylize(""+r,"boolean"):isNull(r)?e.stylize("null","null"):void 0}function formatError(e){return"["+Error.prototype.toString.call(e)+"]"}function formatArray(e,r,t,n,i){for(var o=[],s=0,u=r.length;u>s;++s)hasOwnProperty(r,String(s))?o.push(formatProperty(e,r,t,n,String(s),!0)):o.push("");return i.forEach(function(i){i.match(/^\d+$/)||o.push(formatProperty(e,r,t,n,i,!0))}),o}function formatProperty(e,r,t,n,i,o){var s,u,a;if(a=Object.getOwnPropertyDescriptor(r,i)||{value:r[i]},a.get?u=a.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):a.set&&(u=e.stylize("[Setter]","special")),hasOwnProperty(n,i)||(s="["+i+"]"),u||(e.seen.indexOf(a.value)<0?(u=isNull(t)?formatValue(e,a.value,null):formatValue(e,a.value,t-1),u.indexOf("\n")>-1&&(u=o?u.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+u.split("\n").map(function(e){return"   "+e}).join("\n"))):u=e.stylize("[Circular]","special")),isUndefined(s)){if(o&&i.match(/^\d+$/))return u;s=JSON.stringify(""+i),s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+u}function reduceToSingleString(e,r,t){var n=0,i=e.reduce(function(e,r){return n++,r.indexOf("\n")>=0&&n++,e+r.replace(/\u001b\[\d\d?m/g,"").length+1},0);return i>60?t[0]+(""===r?"":r+"\n ")+" "+e.join(",\n  ")+" "+t[1]:t[0]+r+" "+e.join(", ")+" "+t[1]}function isArray(e){return Array.isArray(e)}function isBoolean(e){return"boolean"==typeof e}function isNull(e){return null===e}function isNullOrUndefined(e){return null==e}function isNumber(e){return"number"==typeof e}function isString(e){return"string"==typeof e}function isSymbol(e){return"symbol"==typeof e}function isUndefined(e){return void 0===e}function isRegExp(e){return isObject(e)&&"[object RegExp]"===objectToString(e)}function isObject(e){return"object"==typeof e&&null!==e}function isDate(e){return isObject(e)&&"[object Date]"===objectToString(e)}function isError(e){return isObject(e)&&("[object Error]"===objectToString(e)||e instanceof Error)}function isFunction(e){return"function"==typeof e}function isPrimitive(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function objectToString(e){return Object.prototype.toString.call(e)}function pad(e){return 10>e?"0"+e.toString(10):e.toString(10)}function timestamp(){var e=new Date,r=[pad(e.getHours()),pad(e.getMinutes()),pad(e.getSeconds())].join(":");return[e.getDate(),months[e.getMonth()],r].join(" ")}function hasOwnProperty(e,r){return Object.prototype.hasOwnProperty.call(e,r)}var formatRegExp=/%[sdj%]/g;exports.format=function(e){if(!isString(e)){for(var r=[],t=0;t<arguments.length;t++)r.push(inspect(arguments[t]));return r.join(" ")}for(var t=1,n=arguments,i=n.length,o=String(e).replace(formatRegExp,function(e){if("%%"===e)return"%";if(t>=i)return e;switch(e){case"%s":return String(n[t++]);case"%d":return Number(n[t++]);case"%j":try{return JSON.stringify(n[t++])}catch(r){return"[Circular]"}default:return e}}),s=n[t];i>t;s=n[++t])o+=isNull(s)||!isObject(s)?" "+s:" "+inspect(s);return o},exports.deprecate=function(e,r){function t(){if(!n){if(process.throwDeprecation)throw new Error(r);process.traceDeprecation?console.trace(r):console.error(r),n=!0}return e.apply(this,arguments)}if(isUndefined(global.process))return function(){return exports.deprecate(e,r).apply(this,arguments)};if(process.noDeprecation===!0)return e;var n=!1;return t};var debugs={},debugEnviron;exports.debuglog=function(e){if(isUndefined(debugEnviron)&&(debugEnviron=process.env.NODE_DEBUG||""),e=e.toUpperCase(),!debugs[e])if(new RegExp("\\b"+e+"\\b","i").test(debugEnviron)){var r=process.pid;debugs[e]=function(){var t=exports.format.apply(exports,arguments);console.error("%s %d: %s",e,r,t)}}else debugs[e]=function(){};return debugs[e]},exports.inspect=inspect,inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},inspect.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=require("./support/isBuffer");var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];exports.log=function(){console.log("%s - %s",timestamp(),exports.format.apply(exports,arguments))},exports.inherits=require("inherits"),exports._extend=function(e,r){if(!r||!isObject(r))return e;for(var t=Object.keys(r),n=t.length;n--;)e[t[n]]=r[t[n]];return e};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":103,"_process":77,"inherits":24}],105:[function(require,module,exports){
/*!
 * Copyright (c) 2015 Chris O'Hara <cohara87@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
!function(t,e){"undefined"!=typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&"object"==typeof define.amd?define(e):"function"==typeof define&&"object"==typeof define.petal?define(t,[],e):this[t]=e()}("validator",function(t){"use strict";function e(t){var e,r,n,i,o=t.match(N);if(o){if(e=o[21],!e||"z"===e||"Z"===e)return 0;r=o[22],-1!==e.indexOf(":")?(n=parseInt(o[23]),i=parseInt(o[24])):(n=0,i=parseInt(o[23]))}else{if(t=t.toLowerCase(),e=t.match(/(?:\s|gmt\s*)(-|\+)(\d{1,4})(\s|$)/),!e)return-1!==t.indexOf("gmt")?0:null;r=e[1];var u=e[2];3===u.length&&(u="0"+u),u.length<=2?(n=0,i=parseInt(u)):(n=parseInt(u.slice(0,2)),i=parseInt(u.slice(2,4)))}return(60*n+i)*("-"===r?1:-1)}function r(t,e){t=t||{};for(var r in e)"undefined"==typeof t[r]&&(t[r]=e[r]);return t}function n(t){var e="(\\"+t.symbol.replace(/\./g,"\\.")+")"+(t.require_symbol?"":"?"),r="-?",n="[1-9]\\d*",i="[1-9]\\d{0,2}(\\"+t.thousands_separator+"\\d{3})*",o=["0",n,i],u="("+o.join("|")+")?",a="(\\"+t.decimal_separator+"\\d{2})?",s=u+a;return t.allow_negatives&&!t.parens_for_negatives&&(t.negative_sign_after_digits?s+=r:t.negative_sign_before_digits&&(s=r+s)),t.allow_negative_sign_placeholder?s="( (?!\\-))?"+s:t.allow_space_after_symbol?s=" ?"+s:t.allow_space_after_digits&&(s+="( (?!$))?"),t.symbol_after_digits?s+=e:s=e+s,t.allow_negatives&&(t.parens_for_negatives?s="(\\("+s+"\\)|"+s+")":t.negative_sign_before_digits||t.negative_sign_after_digits||(s=r+s)),new RegExp("^(?!-? )(?=.*\\d)"+s+"$")}t={version:"4.4.0"};var i=/^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i,o=/^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i,u=/^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i,a=/^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i,s=/^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i,l=/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,f=/^[A-Z]{2}[0-9A-Z]{9}[0-9]$/,c=/^(?:[0-9]{9}X|[0-9]{10})$/,d=/^(?:[0-9]{13})$/,g=/^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/,p=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,F=/^[0-9A-F]{1,4}$/i,_={3:/^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,4:/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,5:/^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,all:/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i},x=/^[A-Z]+$/i,h=/^[0-9A-Z]+$/i,v=/^[-+]?[0-9]+$/,m=/^(?:[-+]?(?:0|[1-9][0-9]*))$/,A=/^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,$=/^[0-9A-F]+$/i,w=/^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/,D=/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i,b=/^[\x00-\x7F]+$/,y=/[^\x00-\x7F]/,I=/[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/,O=/[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/,E=/[\uD800-\uDBFF][\uDC00-\uDFFF]/,C=/^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i,S={"zh-CN":/^(\+?0?86\-?)?1[345789]\d{9}$/,"zh-TW":/^(\+?886\-?|0)?9\d{8}$/,"en-ZA":/^(\+?27|0)\d{9}$/,"en-AU":/^(\+?61|0)4\d{8}$/,"en-HK":/^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,"fr-FR":/^(\+?33|0)[67]\d{8}$/,"pt-PT":/^(\+351)?9[1236]\d{7}$/,"el-GR":/^(\+30)?((2\d{9})|(69\d{8}))$/,"en-GB":/^(\+?44|0)7\d{9}$/,"en-US":/^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,"en-ZM":/^(\+26)?09[567]\d{7}$/,"ru-RU":/^(\+?7|8)?9\d{9}$/,"nb-NO":/^(\+?47)?[49]\d{7}$/,"nn-NO":/^(\+?47)?[49]\d{7}$/,"vi-VN":/^(0|\+?84)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,"en-NZ":/^(\+?64|0)2\d{7,9}$/},N=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;t.extend=function(e,r){t[e]=function(){var e=Array.prototype.slice.call(arguments);return e[0]=t.toString(e[0]),r.apply(t,e)}},t.init=function(){for(var e in t)"function"==typeof t[e]&&"toString"!==e&&"toDate"!==e&&"extend"!==e&&"init"!==e&&t.extend(e,t[e])},t.toString=function(t){return"object"==typeof t&&null!==t&&t.toString?t=t.toString():(null===t||"undefined"==typeof t||isNaN(t)&&!t.length)&&(t=""),""+t},t.toDate=function(t){return"[object Date]"===Object.prototype.toString.call(t)?t:(t=Date.parse(t),isNaN(t)?null:new Date(t))},t.toFloat=function(t){return parseFloat(t)},t.toInt=function(t,e){return parseInt(t,e||10)},t.toBoolean=function(t,e){return e?"1"===t||"true"===t:"0"!==t&&"false"!==t&&""!==t},t.equals=function(e,r){return e===t.toString(r)},t.contains=function(e,r){return e.indexOf(t.toString(r))>=0},t.matches=function(t,e,r){return"[object RegExp]"!==Object.prototype.toString.call(e)&&(e=new RegExp(e,r)),e.test(t)};var j={allow_display_name:!1,allow_utf8_local_part:!0,require_tld:!0};t.isEmail=function(e,n){if(n=r(n,j),n.allow_display_name){var l=e.match(s);l&&(e=l[1])}var f=e.split("@"),c=f.pop(),d=f.join("@"),g=c.toLowerCase();if(("gmail.com"===g||"googlemail.com"===g)&&(d=d.replace(/\./g,"").toLowerCase()),!t.isByteLength(d,0,64)||!t.isByteLength(c,0,256))return!1;if(!t.isFQDN(c,{require_tld:n.require_tld}))return!1;if('"'===d[0])return d=d.slice(1,d.length-1),n.allow_utf8_local_part?a.test(d):o.test(d);for(var p=n.allow_utf8_local_part?u:i,F=d.split("."),_=0;_<F.length;_++)if(!p.test(F[_]))return!1;return!0};var B={protocols:["http","https","ftp"],require_tld:!0,require_protocol:!1,require_valid_protocol:!0,allow_underscores:!1,allow_trailing_dot:!1,allow_protocol_relative_urls:!1};t.isURL=function(e,n){if(!e||e.length>=2083||/\s/.test(e))return!1;if(0===e.indexOf("mailto:"))return!1;n=r(n,B);var i,o,u,a,s,l,f;if(f=e.split("://"),f.length>1){if(i=f.shift(),n.require_valid_protocol&&-1===n.protocols.indexOf(i))return!1}else{if(n.require_protocol)return!1;n.allow_protocol_relative_urls&&"//"===e.substr(0,2)&&(f[0]=e.substr(2))}return e=f.join("://"),f=e.split("#"),e=f.shift(),f=e.split("?"),e=f.shift(),f=e.split("/"),e=f.shift(),f=e.split("@"),f.length>1&&(o=f.shift(),o.indexOf(":")>=0&&o.split(":").length>2)?!1:(a=f.join("@"),f=a.split(":"),u=f.shift(),f.length&&(l=f.join(":"),s=parseInt(l,10),!/^[0-9]+$/.test(l)||0>=s||s>65535)?!1:t.isIP(u)||t.isFQDN(u,n)||"localhost"===u?n.host_whitelist&&-1===n.host_whitelist.indexOf(u)?!1:n.host_blacklist&&-1!==n.host_blacklist.indexOf(u)?!1:!0:!1)},t.isMACAddress=function(t){return g.test(t)},t.isIP=function(e,r){if(r=t.toString(r),!r)return t.isIP(e,4)||t.isIP(e,6);if("4"===r){if(!p.test(e))return!1;var n=e.split(".").sort(function(t,e){return t-e});return n[3]<=255}if("6"===r){var i=e.split(":"),o=!1,u=t.isIP(i[i.length-1],4),a=u?7:8;if(i.length>a)return!1;if("::"===e)return!0;"::"===e.substr(0,2)?(i.shift(),i.shift(),o=!0):"::"===e.substr(e.length-2)&&(i.pop(),i.pop(),o=!0);for(var s=0;s<i.length;++s)if(""===i[s]&&s>0&&s<i.length-1){if(o)return!1;o=!0}else if(u&&s==i.length-1);else if(!F.test(i[s]))return!1;return o?i.length>=1:i.length===a}return!1};var Z={require_tld:!0,allow_underscores:!1,allow_trailing_dot:!1};t.isFQDN=function(t,e){e=r(e,Z),e.allow_trailing_dot&&"."===t[t.length-1]&&(t=t.substring(0,t.length-1));var n=t.split(".");if(e.require_tld){var i=n.pop();if(!n.length||!/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(i))return!1}for(var o,u=0;u<n.length;u++){if(o=n[u],e.allow_underscores){if(o.indexOf("__")>=0)return!1;o=o.replace(/_/g,"")}if(!/^[a-z\u00a1-\uffff0-9-]+$/i.test(o))return!1;if(/[\uff01-\uff5e]/.test(o))return!1;if("-"===o[0]||"-"===o[o.length-1]||o.indexOf("---")>=0)return!1}return!0},t.isBoolean=function(t){return["true","false","1","0"].indexOf(t)>=0},t.isAlpha=function(t){return x.test(t)},t.isAlphanumeric=function(t){return h.test(t)},t.isNumeric=function(t){return v.test(t)},t.isDecimal=function(t){return""!==t&&w.test(t)},t.isHexadecimal=function(t){return $.test(t)},t.isHexColor=function(t){return D.test(t)},t.isLowercase=function(t){return t===t.toLowerCase()},t.isUppercase=function(t){return t===t.toUpperCase()},t.isInt=function(t,e){return e=e||{},m.test(t)&&(!e.hasOwnProperty("min")||t>=e.min)&&(!e.hasOwnProperty("max")||t<=e.max)},t.isFloat=function(t,e){return e=e||{},""===t||"."===t?!1:A.test(t)&&(!e.hasOwnProperty("min")||t>=e.min)&&(!e.hasOwnProperty("max")||t<=e.max)},t.isDivisibleBy=function(e,r){return t.toFloat(e)%t.toInt(r)===0},t.isNull=function(t){return 0===t.length},t.isLength=function(t,e,r){var n=t.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)||[],i=t.length-n.length;return i>=e&&("undefined"==typeof r||r>=i)},t.isByteLength=function(t,e,r){var n=encodeURI(t).split(/%..|./).length-1;return n>=e&&("undefined"==typeof r||r>=n)},t.isUUID=function(t,e){var r=_[e?e:"all"];return r&&r.test(t)},t.isDate=function(t){var r=new Date(Date.parse(t));if(isNaN(r))return!1;var n=e(t);if(null!==n){var i=r.getTimezoneOffset()-n;r=new Date(r.getTime()+6e4*i)}var o,u,a,s=String(r.getDate());return(u=t.match(/(^|[^:\d])[23]\d([^:\d]|$)/g))?(o=u.map(function(t){return t.match(/\d+/g)[0]}).join("/"),a=String(r.getFullYear()).slice(-2),o===s||o===a?!0:o===s+"/"+a||o===a+"/"+s?!0:!1):!0},t.isAfter=function(e,r){var n=t.toDate(r||new Date),i=t.toDate(e);return!!(i&&n&&i>n)},t.isBefore=function(e,r){var n=t.toDate(r||new Date),i=t.toDate(e);return!!(i&&n&&n>i)},t.isIn=function(e,r){var n;if("[object Array]"===Object.prototype.toString.call(r)){var i=[];for(n in r)i[n]=t.toString(r[n]);return i.indexOf(e)>=0}return"object"==typeof r?r.hasOwnProperty(e):r&&"function"==typeof r.indexOf?r.indexOf(e)>=0:!1},t.isWhitelisted=function(t,e){for(var r=t.length-1;r>=0;r--)if(-1===e.indexOf(t[r]))return!1;return!0},t.isCreditCard=function(t){var e=t.replace(/[^0-9]+/g,"");if(!l.test(e))return!1;for(var r,n,i,o=0,u=e.length-1;u>=0;u--)r=e.substring(u,u+1),n=parseInt(r,10),i?(n*=2,o+=n>=10?n%10+1:n):o+=n,i=!i;return!!(o%10===0?e:!1)},t.isISIN=function(t){if(!f.test(t))return!1;for(var e,r,n=t.replace(/[A-Z]/g,function(t){return parseInt(t,36)}),i=0,o=!0,u=n.length-2;u>=0;u--)e=n.substring(u,u+1),r=parseInt(e,10),o?(r*=2,i+=r>=10?r+1:r):i+=r,o=!o;return parseInt(t.substr(t.length-1),10)===(1e4-i)%10},t.isISBN=function(e,r){if(r=t.toString(r),!r)return t.isISBN(e,10)||t.isISBN(e,13);var n,i=e.replace(/[\s-]+/g,""),o=0;if("10"===r){if(!c.test(i))return!1;for(n=0;9>n;n++)o+=(n+1)*i.charAt(n);if(o+="X"===i.charAt(9)?100:10*i.charAt(9),o%11===0)return!!i}else if("13"===r){if(!d.test(i))return!1;var u=[1,3];for(n=0;12>n;n++)o+=u[n%2]*i.charAt(n);if(i.charAt(12)-(10-o%10)%10===0)return!!i}return!1},t.isMobilePhone=function(t,e){return e in S?S[e].test(t):!1};var z={symbol:"$",require_symbol:!1,allow_space_after_symbol:!1,symbol_after_digits:!1,allow_negatives:!0,parens_for_negatives:!1,negative_sign_before_digits:!1,negative_sign_after_digits:!1,allow_negative_sign_placeholder:!1,thousands_separator:",",decimal_separator:".",allow_space_after_digits:!1};t.isCurrency=function(t,e){return e=r(e,z),n(e).test(t)},t.isJSON=function(t){try{var e=JSON.parse(t);return!!e&&"object"==typeof e}catch(r){}return!1},t.isMultibyte=function(t){return y.test(t)},t.isAscii=function(t){return b.test(t)},t.isFullWidth=function(t){return I.test(t)},t.isHalfWidth=function(t){return O.test(t)},t.isVariableWidth=function(t){return I.test(t)&&O.test(t)},t.isSurrogatePair=function(t){return E.test(t)},t.isBase64=function(t){return C.test(t)},t.isMongoId=function(e){return t.isHexadecimal(e)&&24===e.length},t.isISO8601=function(t){return N.test(t)},t.ltrim=function(t,e){var r=e?new RegExp("^["+e+"]+","g"):/^\s+/g;return t.replace(r,"")},t.rtrim=function(t,e){var r=e?new RegExp("["+e+"]+$","g"):/\s+$/g;return t.replace(r,"")},t.trim=function(t,e){var r=e?new RegExp("^["+e+"]+|["+e+"]+$","g"):/^\s+|\s+$/g;return t.replace(r,"")},t.escape=function(t){return t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\//g,"&#x2F;").replace(/\`/g,"&#96;")},t.stripLow=function(e,r){var n=r?"\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F":"\\x00-\\x1F\\x7F";return t.blacklist(e,n)},t.whitelist=function(t,e){return t.replace(new RegExp("[^"+e+"]+","g"),"")},t.blacklist=function(t,e){return t.replace(new RegExp("["+e+"]+","g"),"")};var q={lowercase:!0,remove_dots:!0,remove_extension:!0};return t.normalizeEmail=function(e,n){if(n=r(n,q),!t.isEmail(e))return!1;var i=e.split("@",2);if(i[1]=i[1].toLowerCase(),"gmail.com"===i[1]||"googlemail.com"===i[1]){if(n.remove_extension&&(i[0]=i[0].split("+")[0]),n.remove_dots&&(i[0]=i[0].replace(/\./g,"")),!i[0].length)return!1;i[0]=i[0].toLowerCase(),i[1]="gmail.com"}else n.lowercase&&(i[0]=i[0].toLowerCase());return i.join("@")},t.init(),t});

},{}],106:[function(require,module,exports){
function extend(){for(var r={},e=0;e<arguments.length;e++){var t=arguments[e];for(var n in t)hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r}module.exports=extend;var hasOwnProperty=Object.prototype.hasOwnProperty;

},{}],107:[function(require,module,exports){
"use strict";module.exports={INVALID_TYPE:"Expected type {0} but found type {1}",INVALID_FORMAT:"Object didn't pass validation for format {0}: {1}",ENUM_MISMATCH:"No enum match for: {0}",ANY_OF_MISSING:"Data does not match any schemas from 'anyOf'",ONE_OF_MISSING:"Data does not match any schemas from 'oneOf'",ONE_OF_MULTIPLE:"Data is valid against more than one schema from 'oneOf'",NOT_PASSED:"Data matches schema from 'not'",ARRAY_LENGTH_SHORT:"Array is too short ({0}), minimum {1}",ARRAY_LENGTH_LONG:"Array is too long ({0}), maximum {1}",ARRAY_UNIQUE:"Array items are not unique (indexes {0} and {1})",ARRAY_ADDITIONAL_ITEMS:"Additional items not allowed",MULTIPLE_OF:"Value {0} is not a multiple of {1}",MINIMUM:"Value {0} is less than minimum {1}",MINIMUM_EXCLUSIVE:"Value {0} is equal or less than exclusive minimum {1}",MAXIMUM:"Value {0} is greater than maximum {1}",MAXIMUM_EXCLUSIVE:"Value {0} is equal or greater than exclusive maximum {1}",OBJECT_PROPERTIES_MINIMUM:"Too few properties defined ({0}), minimum {1}",OBJECT_PROPERTIES_MAXIMUM:"Too many properties defined ({0}), maximum {1}",OBJECT_MISSING_REQUIRED_PROPERTY:"Missing required property: {0}",OBJECT_ADDITIONAL_PROPERTIES:"Additional properties not allowed: {0}",OBJECT_DEPENDENCY_KEY:"Dependency failed - key must exist: {0} (due to key: {1})",MIN_LENGTH:"String is too short ({0} chars), minimum {1}",MAX_LENGTH:"String is too long ({0} chars), maximum {1}",PATTERN:"String does not match pattern {0}: {1}",KEYWORD_TYPE_EXPECTED:"Keyword '{0}' is expected to be of type '{1}'",KEYWORD_UNDEFINED_STRICT:"Keyword '{0}' must be defined in strict mode",KEYWORD_UNEXPECTED:"Keyword '{0}' is not expected to appear in the schema",KEYWORD_MUST_BE:"Keyword '{0}' must be {1}",KEYWORD_DEPENDENCY:"Keyword '{0}' requires keyword '{1}'",KEYWORD_PATTERN:"Keyword '{0}' is not a valid RegExp pattern: {1}",KEYWORD_VALUE_TYPE:"Each element of keyword '{0}' array must be a '{1}'",UNKNOWN_FORMAT:"There is no validation function for format '{0}'",CUSTOM_MODE_FORCE_PROPERTIES:"{0} must define at least one property if present",REF_UNRESOLVED:"Reference has not been resolved during compilation: {0}",UNRESOLVABLE_REFERENCE:"Reference could not be resolved: {0}",SCHEMA_NOT_REACHABLE:"Validator was not able to read schema with uri: {0}",SCHEMA_TYPE_EXPECTED:"Schema is expected to be of type 'object'",SCHEMA_NOT_AN_OBJECT:"Schema is not an object: {0}",ASYNC_TIMEOUT:"{0} asynchronous task(s) have timed out after {1} ms",PARENT_SCHEMA_VALIDATION_FAILED:"Schema failed to validate against its parent schema, see inner errors for details.",REMOTE_NOT_VALID:"Remote reference didn't compile successfully: {0}"};

},{}],108:[function(require,module,exports){
var validator=require("validator"),FormatValidators={date:function(t){if("string"!=typeof t)return!0;var r=/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(t);return null===r?!1:r[2]<"01"||r[2]>"12"||r[3]<"01"||r[3]>"31"?!1:!0},"date-time":function(t){if("string"!=typeof t)return!0;var r=t.toLowerCase().split("t");if(!FormatValidators.date(r[0]))return!1;var i=/^([0-9]{2}):([0-9]{2}):([0-9]{2})(.[0-9]+)?(z|([+-][0-9]{2}:[0-9]{2}))$/.exec(r[1]);return null===i?!1:i[1]>"23"||i[2]>"59"||i[3]>"59"?!1:!0},email:function(t){return"string"!=typeof t?!0:validator.isEmail(t,{require_tld:!0})},hostname:function(t){if("string"!=typeof t)return!0;var r=/^[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?(\.[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?)*$/.test(t);if(r){if(t.length>255)return!1;for(var i=t.split("."),e=0;e<i.length;e++)if(i[e].length>63)return!1}return r},"host-name":function(t){return FormatValidators.hostname.call(this,t)},ipv4:function(t){return"string"!=typeof t?!0:validator.isIP(t,4)},ipv6:function(t){return"string"!=typeof t?!0:validator.isIP(t,6)},regex:function(t){try{return RegExp(t),!0}catch(r){return!1}},uri:function(t){return this.options.strictUris?FormatValidators["strict-uri"].apply(this,arguments):"string"!=typeof t||RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?").test(t)},"strict-uri":function(t){return"string"!=typeof t||validator.isURL(t)}};module.exports=FormatValidators;

},{"validator":105}],109:[function(require,module,exports){
"use strict";var FormatValidators=require("./FormatValidators"),Report=require("./Report"),Utils=require("./Utils"),JsonValidators={multipleOf:function(r,e,t){"number"==typeof t&&"integer"!==Utils.whatIs(t/e.multipleOf)&&r.addError("MULTIPLE_OF",[t,e.multipleOf],null,e.description)},maximum:function(r,e,t){"number"==typeof t&&(e.exclusiveMaximum!==!0?t>e.maximum&&r.addError("MAXIMUM",[t,e.maximum],null,e.description):t>=e.maximum&&r.addError("MAXIMUM_EXCLUSIVE",[t,e.maximum],null,e.description))},exclusiveMaximum:function(){},minimum:function(r,e,t){"number"==typeof t&&(e.exclusiveMinimum!==!0?t<e.minimum&&r.addError("MINIMUM",[t,e.minimum],null,e.description):t<=e.minimum&&r.addError("MINIMUM_EXCLUSIVE",[t,e.minimum],null,e.description))},exclusiveMinimum:function(){},maxLength:function(r,e,t){"string"==typeof t&&Utils.ucs2decode(t).length>e.maxLength&&r.addError("MAX_LENGTH",[t.length,e.maxLength],null,e.description)},minLength:function(r,e,t){"string"==typeof t&&Utils.ucs2decode(t).length<e.minLength&&r.addError("MIN_LENGTH",[t.length,e.minLength],null,e.description)},pattern:function(r,e,t){"string"==typeof t&&RegExp(e.pattern).test(t)===!1&&r.addError("PATTERN",[e.pattern,t],null,e.description)},additionalItems:function(r,e,t){Array.isArray(t)&&e.additionalItems===!1&&Array.isArray(e.items)&&t.length>e.items.length&&r.addError("ARRAY_ADDITIONAL_ITEMS",null,null,e.description)},items:function(){},maxItems:function(r,e,t){Array.isArray(t)&&t.length>e.maxItems&&r.addError("ARRAY_LENGTH_LONG",[t.length,e.maxItems],null,e.description)},minItems:function(r,e,t){Array.isArray(t)&&t.length<e.minItems&&r.addError("ARRAY_LENGTH_SHORT",[t.length,e.minItems],null,e.description)},uniqueItems:function(r,e,t){if(Array.isArray(t)&&e.uniqueItems===!0){var i=[];Utils.isUniqueArray(t,i)===!1&&r.addError("ARRAY_UNIQUE",i,null,e.description)}},maxProperties:function(r,e,t){if("object"===Utils.whatIs(t)){var i=Object.keys(t).length;i>e.maxProperties&&r.addError("OBJECT_PROPERTIES_MAXIMUM",[i,e.maxProperties],null,e.description)}},minProperties:function(r,e,t){if("object"===Utils.whatIs(t)){var i=Object.keys(t).length;i<e.minProperties&&r.addError("OBJECT_PROPERTIES_MINIMUM",[i,e.minProperties],null,e.description)}},required:function(r,e,t){if("object"===Utils.whatIs(t))for(var i=e.required.length;i--;){var n=e.required[i];void 0===t[n]&&r.addError("OBJECT_MISSING_REQUIRED_PROPERTY",[n],null,e.description)}},additionalProperties:function(r,e,t){return void 0===e.properties&&void 0===e.patternProperties?JsonValidators.properties.call(this,r,e,t):void 0},patternProperties:function(r,e,t){return void 0===e.properties?JsonValidators.properties.call(this,r,e,t):void 0},properties:function(r,e,t){if("object"===Utils.whatIs(t)){var i=void 0!==e.properties?e.properties:{},n=void 0!==e.patternProperties?e.patternProperties:{};if(e.additionalProperties===!1){var o=Object.keys(t),s=Object.keys(i),a=Object.keys(n);o=Utils.difference(o,s);for(var l=a.length;l--;)for(var d=RegExp(a[l]),p=o.length;p--;)d.test(o[p])===!0&&o.splice(p,1);if(o.length>0){var u=this.options.assumeAdditional.length;if(u)for(;u--;){var c=o.indexOf(this.options.assumeAdditional[u]);-1!==c&&o.splice(c,1)}o.length>0&&r.addError("OBJECT_ADDITIONAL_PROPERTIES",[o],null,e.description)}}}},dependencies:function(r,e,t){if("object"===Utils.whatIs(t))for(var i=Object.keys(e.dependencies),n=i.length;n--;){var o=i[n];if(t[o]){var s=e.dependencies[o];if("object"===Utils.whatIs(s))exports.validate.call(this,r,s,t);else for(var a=s.length;a--;){var l=s[a];void 0===t[l]&&r.addError("OBJECT_DEPENDENCY_KEY",[l,o],null,e.description)}}}},"enum":function(r,e,t){for(var i=!1,n=e["enum"].length;n--;)if(Utils.areEqual(t,e["enum"][n])){i=!0;break}i===!1&&r.addError("ENUM_MISMATCH",[t],null,e.description)},allOf:function(r,e,t){for(var i=e.allOf.length;i--;){var n=exports.validate.call(this,r,e.allOf[i],t);if(this.options.breakOnFirstError&&n===!1)break}},anyOf:function(r,e,t){for(var i=[],n=!1,o=e.anyOf.length;o--&&n===!1;){var s=new Report(r);i.push(s),n=exports.validate.call(this,s,e.anyOf[o],t)}n===!1&&r.addError("ANY_OF_MISSING",void 0,i,e.description)},oneOf:function(r,e,t){for(var i=0,n=[],o=e.oneOf.length;o--;){var s=new Report(r,{maxErrors:1});n.push(s),exports.validate.call(this,s,e.oneOf[o],t)===!0&&i++}0===i?r.addError("ONE_OF_MISSING",void 0,n,e.description):i>1&&r.addError("ONE_OF_MULTIPLE",null,null,e.description)},not:function(r,e,t){var i=new Report(r);exports.validate.call(this,i,e.not,t)===!0&&r.addError("NOT_PASSED",null,null,e.description)},definitions:function(){},format:function(r,e,t){var i=FormatValidators[e.format];"function"==typeof i?2===i.length?r.addAsyncTask(i,[t],function(i){i!==!0&&r.addError("INVALID_FORMAT",[e.format,t],null,e.description)}):i.call(this,t)!==!0&&r.addError("INVALID_FORMAT",[e.format,t],null,e.description):this.options.ignoreUnknownFormats!==!0&&r.addError("UNKNOWN_FORMAT",[e.format],null,e.description)}},recurseArray=function(r,e,t){var i=t.length;if(Array.isArray(e.items))for(;i--;)i<e.items.length?(r.path.push(i.toString()),exports.validate.call(this,r,e.items[i],t[i]),r.path.pop()):"object"==typeof e.additionalItems&&(r.path.push(i.toString()),exports.validate.call(this,r,e.additionalItems,t[i]),r.path.pop());else if("object"==typeof e.items)for(;i--;)r.path.push(i.toString()),exports.validate.call(this,r,e.items,t[i]),r.path.pop()},recurseObject=function(r,e,t){var i=e.additionalProperties;(i===!0||void 0===i)&&(i={});for(var n=e.properties?Object.keys(e.properties):[],o=e.patternProperties?Object.keys(e.patternProperties):[],s=Object.keys(t),a=s.length;a--;){var l=s[a],d=t[l],p=[];-1!==n.indexOf(l)&&p.push(e.properties[l]);for(var u=o.length;u--;){var c=o[u];RegExp(c).test(l)===!0&&p.push(e.patternProperties[c])}for(0===p.length&&i!==!1&&p.push(i),u=p.length;u--;)r.path.push(l),exports.validate.call(this,r,p[u],d),r.path.pop()}};exports.validate=function(r,e,t){r.commonErrorMessage="JSON_OBJECT_VALIDATION_FAILED";var i=Utils.whatIs(e);if("object"!==i)return r.addError("SCHEMA_NOT_AN_OBJECT",[i],null,e.description),!1;var n=Object.keys(e);if(0===n.length)return!0;var o=!1;if(r.rootSchema||(r.rootSchema=e,o=!0),void 0!==e.$ref){for(var s=99;e.$ref&&s>0;){if(!e.__$refResolved){r.addError("REF_UNRESOLVED",[e.$ref],null,e.description);break}if(e.__$refResolved===e)break;e=e.__$refResolved,n=Object.keys(e),s--}if(0===s)throw new Error("Circular dependency by $ref references!")}var a=Utils.whatIs(t);if(e.type)if("string"==typeof e.type){if(a!==e.type&&("integer"!==a||"number"!==e.type)&&(r.addError("INVALID_TYPE",[e.type,a],null,e.description),this.options.breakOnFirstError))return!1}else if(-1===e.type.indexOf(a)&&("integer"!==a||-1===e.type.indexOf("number"))&&(r.addError("INVALID_TYPE",[e.type,a],null,e.description),this.options.breakOnFirstError))return!1;for(var l=n.length;l--&&!(JsonValidators[n[l]]&&(JsonValidators[n[l]].call(this,r,e,t),r.errors.length&&this.options.breakOnFirstError)););return(0===r.errors.length||this.options.breakOnFirstError===!1)&&("array"===a?recurseArray.call(this,r,e,t):"object"===a&&recurseObject.call(this,r,e,t)),o&&(r.rootSchema=void 0),0===r.errors.length};

},{"./FormatValidators":108,"./Report":111,"./Utils":115}],110:[function(require,module,exports){
"function"!=typeof Number.isFinite&&(Number.isFinite=function(e){return"number"!=typeof e?!1:e!==e||e===1/0||e===-(1/0)?!1:!0});

},{}],111:[function(require,module,exports){
(function (process){
"use strict";function Report(r,t){this.parentReport=r instanceof Report?r:void 0,this.options=r instanceof Report?r.options:r||{},this.reportOptions=t||{},this.errors=[],this.path=[],this.asyncTasks=[]}var get=require("lodash.get"),Errors=require("./Errors"),Utils=require("./Utils");Report.prototype.isValid=function(){if(this.asyncTasks.length>0)throw new Error("Async tasks pending, can't answer isValid");return 0===this.errors.length},Report.prototype.addAsyncTask=function(r,t,o){this.asyncTasks.push([r,t,o])},Report.prototype.processAsyncTasks=function(r,t){function o(){process.nextTick(function(){var r=0===h.errors.length,o=r?void 0:h.errors;t(o,r)})}function e(r){return function(t){a||(r(t),0===--n&&o())}}var s=r||2e3,n=this.asyncTasks.length,i=n,a=!1,h=this;if(0===n||this.errors.length>0)return void o();for(;i--;){var p=this.asyncTasks[i];p[0].apply(null,p[1].concat(e(p[2])))}setTimeout(function(){n>0&&(a=!0,h.addError("ASYNC_TIMEOUT",[n,s]),t(h.errors,!1))},s)},Report.prototype.getPath=function(){var r=[];return this.parentReport&&(r=r.concat(this.parentReport.path)),r=r.concat(this.path),this.options.reportPathAsArray!==!0&&(r="#/"+r.map(function(r){return Utils.isAbsoluteUri(r)?"uri("+r+")":r.replace(/\~/g,"~0").replace(/\//g,"~1")}).join("/")),r},Report.prototype.getSchemaId=function(){if(!this.rootSchema)return null;var r=[];for(this.parentReport&&(r=r.concat(this.parentReport.path)),r=r.concat(this.path);r.length>0;){var t=get(this.rootSchema,r);if(t&&t.id)return t.id;r.pop()}return this.rootSchema.id},Report.prototype.hasError=function(r,t){for(var o=this.errors.length;o--;)if(this.errors[o].code===r){for(var e=!0,s=this.errors[o].params.length;s--;)this.errors[o].params[s]!==t[s]&&(e=!1);if(e)return e}return!1},Report.prototype.addError=function(r,t,o,e){if(!(this.errors.length>=this.reportOptions.maxErrors)){if(!r)throw new Error("No errorCode passed into addError()");if(!Errors[r])throw new Error("No errorMessage known for code "+r);t=t||[];for(var s=t.length,n=Errors[r];s--;){var i=Utils.whatIs(t[s]),a="object"===i||"null"===i?JSON.stringify(t[s]):t[s];n=n.replace("{"+s+"}",a)}var h={code:r,params:t,message:n,path:this.getPath(),schemaId:this.getSchemaId()};if(e&&(h.description=e),null!=o){for(Array.isArray(o)||(o=[o]),h.inner=[],s=o.length;s--;)for(var p=o[s],c=p.errors.length;c--;)h.inner.push(p.errors[c]);0===h.inner.length&&(h.inner=void 0)}this.errors.push(h)}},module.exports=Report;

}).call(this,require('_process'))

},{"./Errors":107,"./Utils":115,"_process":77,"lodash.get":72}],112:[function(require,module,exports){
"use strict";function decodeJSONPointer(e){return decodeURIComponent(e).replace(/~[0-1]/g,function(e){return"~1"===e?"/":"~"})}function getRemotePath(e){var t=e.indexOf("#");return-1===t?e:e.slice(0,t)}function getQueryPath(e){var t=e.indexOf("#"),r=-1===t?void 0:e.slice(t+1);return r}function findId(e,t){if("object"==typeof e&&null!==e){if(!t)return e;if(e.id&&(e.id===t||"#"===e.id[0]&&e.id.substring(1)===t))return e;var r,i;if(Array.isArray(e)){for(r=e.length;r--;)if(i=findId(e[r],t))return i}else{var a=Object.keys(e);for(r=a.length;r--;){var n=a[r];if(0!==n.indexOf("__$")&&(i=findId(e[n],t)))return i}}}}var Report=require("./Report"),SchemaCompilation=require("./SchemaCompilation"),SchemaValidation=require("./SchemaValidation"),Utils=require("./Utils");exports.cacheSchemaByUri=function(e,t){var r=getRemotePath(e);r&&(this.cache[r]=t)},exports.removeFromCacheByUri=function(e){var t=getRemotePath(e);t&&delete this.cache[t]},exports.checkCacheForUri=function(e){var t=getRemotePath(e);return t?null!=this.cache[t]:!1},exports.getSchema=function(e,t){return"object"==typeof t&&(t=exports.getSchemaByReference.call(this,e,t)),"string"==typeof t&&(t=exports.getSchemaByUri.call(this,e,t)),t},exports.getSchemaByReference=function(e,t){for(var r=this.referenceCache.length;r--;)if(this.referenceCache[r][0]===t)return this.referenceCache[r][1];var i=Utils.cloneDeep(t);return this.referenceCache.push([t,i]),i},exports.getSchemaByUri=function(e,t,r){var i=getRemotePath(t),a=getQueryPath(t),n=i?this.cache[i]:r;if(n&&i){var c=n!==r;if(c){e.path.push(i);var o=new Report(e);SchemaCompilation.compileSchema.call(this,o,n)&&SchemaValidation.validateSchema.call(this,o,n);var h=o.isValid();if(h||e.addError("REMOTE_NOT_VALID",[t],o),e.path.pop(),!h)return}}if(n&&a)for(var f=a.split("/"),s=0,u=f.length;n&&u>s;s++){var l=decodeJSONPointer(f[s]);n=0===s?findId(n,l):n[l]}return n},exports.getRemotePath=getRemotePath;

},{"./Report":111,"./SchemaCompilation":113,"./SchemaValidation":114,"./Utils":115}],113:[function(require,module,exports){
"use strict";function mergeReference(e,r){if(Utils.isAbsoluteUri(r))return r;var i,s=e.join(""),c=Utils.isAbsoluteUri(s),t=Utils.isRelativeUri(s),a=Utils.isRelativeUri(r);c&&a?(i=s.match(/\/[^\/]*$/),i&&(s=s.slice(0,i.index+1))):t&&a?s="":(i=s.match(/[^#\/]+$/),i&&(s=s.slice(0,i.index)));var o=s+r;return o=o.replace(/##/,"#")}function collectReferences(e,r,i,s){if(r=r||[],i=i||[],s=s||[],"object"!=typeof e||null===e)return r;"string"==typeof e.id&&i.push(e.id),"string"==typeof e.$ref&&"undefined"==typeof e.__$refResolved&&r.push({ref:mergeReference(i,e.$ref),key:"$ref",obj:e,path:s.slice(0)}),"string"==typeof e.$schema&&"undefined"==typeof e.__$schemaResolved&&r.push({ref:mergeReference(i,e.$schema),key:"$schema",obj:e,path:s.slice(0)});var c;if(Array.isArray(e))for(c=e.length;c--;)s.push(c.toString()),collectReferences(e[c],r,i,s),s.pop();else{var t=Object.keys(e);for(c=t.length;c--;)0!==t[c].indexOf("__$")&&(s.push(t[c]),collectReferences(e[t[c]],r,i,s),s.pop())}return"string"==typeof e.id&&i.pop(),r}function findId(e,r){for(var i=e.length;i--;)if(e[i].id===r)return e[i];return null}var Report=require("./Report"),SchemaCache=require("./SchemaCache"),Utils=require("./Utils"),compileArrayOfSchemasLoop=function(e,r){for(var i=r.length,s=0;i--;){var c=new Report(e),t=exports.compileSchema.call(this,c,r[i]);t&&s++,e.errors=e.errors.concat(c.errors)}return s},compileArrayOfSchemas=function(e,r){var i,s=0;do{for(var c=e.errors.length;c--;)"UNRESOLVABLE_REFERENCE"===e.errors[c].code&&e.errors.splice(c,1);for(i=s,s=compileArrayOfSchemasLoop.call(this,e,r),c=r.length;c--;){var t=r[c];if(t.__$missingReferences){for(var a=t.__$missingReferences.length;a--;){var o=t.__$missingReferences[a],l=findId(r,o.ref);l&&(o.obj["__"+o.key+"Resolved"]=l,t.__$missingReferences.splice(a,1))}0===t.__$missingReferences.length&&delete t.__$missingReferences}}}while(s!==r.length&&s!==i);return e.isValid()};exports.compileSchema=function(e,r){if(e.commonErrorMessage="SCHEMA_COMPILATION_FAILED","string"==typeof r){var i=SchemaCache.getSchemaByUri.call(this,e,r);if(!i)return e.addError("SCHEMA_NOT_REACHABLE",[r]),!1;r=i}if(Array.isArray(r))return compileArrayOfSchemas.call(this,e,r);if(r.__$compiled&&r.id&&SchemaCache.checkCacheForUri.call(this,r.id)===!1&&(r.__$compiled=void 0),r.__$compiled)return!0;r.id&&"string"==typeof r.id&&SchemaCache.cacheSchemaByUri.call(this,r.id,r);var s=!1;e.rootSchema||(e.rootSchema=r,s=!0);var c=e.isValid();delete r.__$missingReferences;for(var t=collectReferences.call(this,r),a=t.length;a--;){var o=t[a],l=SchemaCache.getSchemaByUri.call(this,e,o.ref,r);if(!l){var n=this.getSchemaReader();if(n){var h=n(o.ref);if(h){h.id=o.ref;var f=new Report(e);exports.compileSchema.call(this,f,h)?l=SchemaCache.getSchemaByUri.call(this,e,o.ref,r):e.errors=e.errors.concat(f.errors)}}}if(!l){var m=e.hasError("REMOTE_NOT_VALID",[o.ref]),p=Utils.isAbsoluteUri(o.ref),d=!1,_=this.options.ignoreUnresolvableReferences===!0;p&&(d=SchemaCache.checkCacheForUri.call(this,o.ref)),m||_&&p||d||(Array.prototype.push.apply(e.path,o.path),e.addError("UNRESOLVABLE_REFERENCE",[o.ref]),e.path=e.path.slice(0,-o.path.length),c&&(r.__$missingReferences=r.__$missingReferences||[],r.__$missingReferences.push(o)))}o.obj["__"+o.key+"Resolved"]=l}var g=e.isValid();return g?r.__$compiled=!0:r.id&&"string"==typeof r.id&&SchemaCache.removeFromCacheByUri.call(this,r.id),s&&(e.rootSchema=void 0),g};

},{"./Report":111,"./SchemaCache":112,"./Utils":115}],114:[function(require,module,exports){
"use strict";var FormatValidators=require("./FormatValidators"),JsonValidation=require("./JsonValidation"),Report=require("./Report"),Utils=require("./Utils"),SchemaValidators={$ref:function(e,r){"string"!=typeof r.$ref&&e.addError("KEYWORD_TYPE_EXPECTED",["$ref","string"])},$schema:function(e,r){"string"!=typeof r.$schema&&e.addError("KEYWORD_TYPE_EXPECTED",["$schema","string"])},multipleOf:function(e,r){"number"!=typeof r.multipleOf?e.addError("KEYWORD_TYPE_EXPECTED",["multipleOf","number"]):r.multipleOf<=0&&e.addError("KEYWORD_MUST_BE",["multipleOf","strictly greater than 0"])},maximum:function(e,r){"number"!=typeof r.maximum&&e.addError("KEYWORD_TYPE_EXPECTED",["maximum","number"])},exclusiveMaximum:function(e,r){"boolean"!=typeof r.exclusiveMaximum?e.addError("KEYWORD_TYPE_EXPECTED",["exclusiveMaximum","boolean"]):void 0===r.maximum&&e.addError("KEYWORD_DEPENDENCY",["exclusiveMaximum","maximum"])},minimum:function(e,r){"number"!=typeof r.minimum&&e.addError("KEYWORD_TYPE_EXPECTED",["minimum","number"])},exclusiveMinimum:function(e,r){"boolean"!=typeof r.exclusiveMinimum?e.addError("KEYWORD_TYPE_EXPECTED",["exclusiveMinimum","boolean"]):void 0===r.minimum&&e.addError("KEYWORD_DEPENDENCY",["exclusiveMinimum","minimum"])},maxLength:function(e,r){"integer"!==Utils.whatIs(r.maxLength)?e.addError("KEYWORD_TYPE_EXPECTED",["maxLength","integer"]):r.maxLength<0&&e.addError("KEYWORD_MUST_BE",["maxLength","greater than, or equal to 0"])},minLength:function(e,r){"integer"!==Utils.whatIs(r.minLength)?e.addError("KEYWORD_TYPE_EXPECTED",["minLength","integer"]):r.minLength<0&&e.addError("KEYWORD_MUST_BE",["minLength","greater than, or equal to 0"])},pattern:function(e,r){if("string"!=typeof r.pattern)e.addError("KEYWORD_TYPE_EXPECTED",["pattern","string"]);else try{RegExp(r.pattern)}catch(t){e.addError("KEYWORD_PATTERN",["pattern",r.pattern])}},additionalItems:function(e,r){var t=Utils.whatIs(r.additionalItems);"boolean"!==t&&"object"!==t?e.addError("KEYWORD_TYPE_EXPECTED",["additionalItems",["boolean","object"]]):"object"===t&&(e.path.push("additionalItems"),exports.validateSchema.call(this,e,r.additionalItems),e.path.pop())},items:function(e,r){var t=Utils.whatIs(r.items);if("object"===t)e.path.push("items"),exports.validateSchema.call(this,e,r.items),e.path.pop();else if("array"===t)for(var a=r.items.length;a--;)e.path.push("items"),e.path.push(a.toString()),exports.validateSchema.call(this,e,r.items[a]),e.path.pop(),e.path.pop();else e.addError("KEYWORD_TYPE_EXPECTED",["items",["array","object"]]);this.options.forceAdditional===!0&&void 0===r.additionalItems&&Array.isArray(r.items)&&e.addError("KEYWORD_UNDEFINED_STRICT",["additionalItems"]),this.options.assumeAdditional&&void 0===r.additionalItems&&Array.isArray(r.items)&&(r.additionalItems=!1)},maxItems:function(e,r){"number"!=typeof r.maxItems?e.addError("KEYWORD_TYPE_EXPECTED",["maxItems","integer"]):r.maxItems<0&&e.addError("KEYWORD_MUST_BE",["maxItems","greater than, or equal to 0"])},minItems:function(e,r){"integer"!==Utils.whatIs(r.minItems)?e.addError("KEYWORD_TYPE_EXPECTED",["minItems","integer"]):r.minItems<0&&e.addError("KEYWORD_MUST_BE",["minItems","greater than, or equal to 0"])},uniqueItems:function(e,r){"boolean"!=typeof r.uniqueItems&&e.addError("KEYWORD_TYPE_EXPECTED",["uniqueItems","boolean"])},maxProperties:function(e,r){"integer"!==Utils.whatIs(r.maxProperties)?e.addError("KEYWORD_TYPE_EXPECTED",["maxProperties","integer"]):r.maxProperties<0&&e.addError("KEYWORD_MUST_BE",["maxProperties","greater than, or equal to 0"])},minProperties:function(e,r){"integer"!==Utils.whatIs(r.minProperties)?e.addError("KEYWORD_TYPE_EXPECTED",["minProperties","integer"]):r.minProperties<0&&e.addError("KEYWORD_MUST_BE",["minProperties","greater than, or equal to 0"])},required:function(e,r){if("array"!==Utils.whatIs(r.required))e.addError("KEYWORD_TYPE_EXPECTED",["required","array"]);else if(0===r.required.length)e.addError("KEYWORD_MUST_BE",["required","an array with at least one element"]);else{for(var t=r.required.length;t--;)"string"!=typeof r.required[t]&&e.addError("KEYWORD_VALUE_TYPE",["required","string"]);Utils.isUniqueArray(r.required)===!1&&e.addError("KEYWORD_MUST_BE",["required","an array with unique items"])}},additionalProperties:function(e,r){var t=Utils.whatIs(r.additionalProperties);"boolean"!==t&&"object"!==t?e.addError("KEYWORD_TYPE_EXPECTED",["additionalProperties",["boolean","object"]]):"object"===t&&(e.path.push("additionalProperties"),exports.validateSchema.call(this,e,r.additionalProperties),e.path.pop())},properties:function(e,r){if("object"!==Utils.whatIs(r.properties))return void e.addError("KEYWORD_TYPE_EXPECTED",["properties","object"]);for(var t=Object.keys(r.properties),a=t.length;a--;){var i=t[a],o=r.properties[i];e.path.push("properties"),e.path.push(i),exports.validateSchema.call(this,e,o),e.path.pop(),e.path.pop()}this.options.forceAdditional===!0&&void 0===r.additionalProperties&&e.addError("KEYWORD_UNDEFINED_STRICT",["additionalProperties"]),this.options.assumeAdditional&&void 0===r.additionalProperties&&(r.additionalProperties=!1),this.options.forceProperties===!0&&0===t.length&&e.addError("CUSTOM_MODE_FORCE_PROPERTIES",["properties"])},patternProperties:function(e,r){if("object"!==Utils.whatIs(r.patternProperties))return void e.addError("KEYWORD_TYPE_EXPECTED",["patternProperties","object"]);for(var t=Object.keys(r.patternProperties),a=t.length;a--;){var i=t[a],o=r.patternProperties[i];try{RegExp(i)}catch(n){e.addError("KEYWORD_PATTERN",["patternProperties",i])}e.path.push("patternProperties"),e.path.push(i.toString()),exports.validateSchema.call(this,e,o),e.path.pop(),e.path.pop()}this.options.forceProperties===!0&&0===t.length&&e.addError("CUSTOM_MODE_FORCE_PROPERTIES",["patternProperties"])},dependencies:function(e,r){if("object"!==Utils.whatIs(r.dependencies))e.addError("KEYWORD_TYPE_EXPECTED",["dependencies","object"]);else for(var t=Object.keys(r.dependencies),a=t.length;a--;){var i=t[a],o=r.dependencies[i],n=Utils.whatIs(o);if("object"===n)e.path.push("dependencies"),e.path.push(i),exports.validateSchema.call(this,e,o),e.path.pop(),e.path.pop();else if("array"===n){var s=o.length;for(0===s&&e.addError("KEYWORD_MUST_BE",["dependencies","not empty array"]);s--;)"string"!=typeof o[s]&&e.addError("KEYWORD_VALUE_TYPE",["dependensices","string"]);Utils.isUniqueArray(o)===!1&&e.addError("KEYWORD_MUST_BE",["dependencies","an array with unique items"])}else e.addError("KEYWORD_VALUE_TYPE",["dependencies","object or array"])}},"enum":function(e,r){Array.isArray(r["enum"])===!1?e.addError("KEYWORD_TYPE_EXPECTED",["enum","array"]):0===r["enum"].length?e.addError("KEYWORD_MUST_BE",["enum","an array with at least one element"]):Utils.isUniqueArray(r["enum"])===!1&&e.addError("KEYWORD_MUST_BE",["enum","an array with unique elements"])},type:function(e,r){var t=["array","boolean","integer","number","null","object","string"],a=t.join(","),i=Array.isArray(r.type);if(i){for(var o=r.type.length;o--;)-1===t.indexOf(r.type[o])&&e.addError("KEYWORD_TYPE_EXPECTED",["type",a]);Utils.isUniqueArray(r.type)===!1&&e.addError("KEYWORD_MUST_BE",["type","an object with unique properties"])}else"string"==typeof r.type?-1===t.indexOf(r.type)&&e.addError("KEYWORD_TYPE_EXPECTED",["type",a]):e.addError("KEYWORD_TYPE_EXPECTED",["type",["string","array"]]);this.options.noEmptyStrings===!0&&("string"===r.type||i&&-1!==r.type.indexOf("string"))&&void 0===r.minLength&&void 0===r["enum"]&&void 0===r.format&&(r.minLength=1),this.options.noEmptyArrays===!0&&("array"===r.type||i&&-1!==r.type.indexOf("array"))&&void 0===r.minItems&&(r.minItems=1),this.options.forceProperties===!0&&("object"===r.type||i&&-1!==r.type.indexOf("object"))&&void 0===r.properties&&void 0===r.patternProperties&&e.addError("KEYWORD_UNDEFINED_STRICT",["properties"]),this.options.forceItems===!0&&("array"===r.type||i&&-1!==r.type.indexOf("array"))&&void 0===r.items&&e.addError("KEYWORD_UNDEFINED_STRICT",["items"]),this.options.forceMinItems===!0&&("array"===r.type||i&&-1!==r.type.indexOf("array"))&&void 0===r.minItems&&e.addError("KEYWORD_UNDEFINED_STRICT",["minItems"]),this.options.forceMaxItems===!0&&("array"===r.type||i&&-1!==r.type.indexOf("array"))&&void 0===r.maxItems&&e.addError("KEYWORD_UNDEFINED_STRICT",["maxItems"]),this.options.forceMinLength===!0&&("string"===r.type||i&&-1!==r.type.indexOf("string"))&&void 0===r.minLength&&void 0===r.format&&void 0===r["enum"]&&void 0===r.pattern&&e.addError("KEYWORD_UNDEFINED_STRICT",["minLength"]),this.options.forceMaxLength===!0&&("string"===r.type||i&&-1!==r.type.indexOf("string"))&&void 0===r.maxLength&&void 0===r.format&&void 0===r["enum"]&&void 0===r.pattern&&e.addError("KEYWORD_UNDEFINED_STRICT",["maxLength"])},allOf:function(e,r){if(Array.isArray(r.allOf)===!1)e.addError("KEYWORD_TYPE_EXPECTED",["allOf","array"]);else if(0===r.allOf.length)e.addError("KEYWORD_MUST_BE",["allOf","an array with at least one element"]);else for(var t=r.allOf.length;t--;)e.path.push("allOf"),e.path.push(t.toString()),exports.validateSchema.call(this,e,r.allOf[t]),e.path.pop(),e.path.pop()},anyOf:function(e,r){if(Array.isArray(r.anyOf)===!1)e.addError("KEYWORD_TYPE_EXPECTED",["anyOf","array"]);else if(0===r.anyOf.length)e.addError("KEYWORD_MUST_BE",["anyOf","an array with at least one element"]);else for(var t=r.anyOf.length;t--;)e.path.push("anyOf"),e.path.push(t.toString()),exports.validateSchema.call(this,e,r.anyOf[t]),e.path.pop(),e.path.pop()},oneOf:function(e,r){if(Array.isArray(r.oneOf)===!1)e.addError("KEYWORD_TYPE_EXPECTED",["oneOf","array"]);else if(0===r.oneOf.length)e.addError("KEYWORD_MUST_BE",["oneOf","an array with at least one element"]);else for(var t=r.oneOf.length;t--;)e.path.push("oneOf"),e.path.push(t.toString()),exports.validateSchema.call(this,e,r.oneOf[t]),e.path.pop(),e.path.pop()},not:function(e,r){"object"!==Utils.whatIs(r.not)?e.addError("KEYWORD_TYPE_EXPECTED",["not","object"]):(e.path.push("not"),exports.validateSchema.call(this,e,r.not),e.path.pop())},definitions:function(e,r){if("object"!==Utils.whatIs(r.definitions))e.addError("KEYWORD_TYPE_EXPECTED",["definitions","object"]);else for(var t=Object.keys(r.definitions),a=t.length;a--;){var i=t[a],o=r.definitions[i];e.path.push("definitions"),e.path.push(i),exports.validateSchema.call(this,e,o),e.path.pop(),e.path.pop()}},format:function(e,r){"string"!=typeof r.format?e.addError("KEYWORD_TYPE_EXPECTED",["format","string"]):void 0===FormatValidators[r.format]&&this.options.ignoreUnknownFormats!==!0&&e.addError("UNKNOWN_FORMAT",[r.format])},id:function(e,r){"string"!=typeof r.id&&e.addError("KEYWORD_TYPE_EXPECTED",["id","string"])},title:function(e,r){"string"!=typeof r.title&&e.addError("KEYWORD_TYPE_EXPECTED",["title","string"])},description:function(e,r){"string"!=typeof r.description&&e.addError("KEYWORD_TYPE_EXPECTED",["description","string"])},"default":function(){}},validateArrayOfSchemas=function(e,r){for(var t=r.length;t--;)exports.validateSchema.call(this,e,r[t]);return e.isValid()};exports.validateSchema=function(e,r){if(e.commonErrorMessage="SCHEMA_VALIDATION_FAILED",Array.isArray(r))return validateArrayOfSchemas.call(this,e,r);if(r.__$validated)return!0;var t=r.$schema&&r.id!==r.$schema;if(t)if(r.__$schemaResolved&&r.__$schemaResolved!==r){var a=new Report(e),i=JsonValidation.validate.call(this,a,r.__$schemaResolved,r);i===!1&&e.addError("PARENT_SCHEMA_VALIDATION_FAILED",null,a)}else this.options.ignoreUnresolvableReferences!==!0&&e.addError("REF_UNRESOLVED",[r.$schema]);if(this.options.noTypeless===!0){if(void 0!==r.type){var o=[];Array.isArray(r.anyOf)&&(o=o.concat(r.anyOf)),Array.isArray(r.oneOf)&&(o=o.concat(r.oneOf)),Array.isArray(r.allOf)&&(o=o.concat(r.allOf)),o.forEach(function(e){e.type||(e.type=r.type)})}void 0===r["enum"]&&void 0===r.type&&void 0===r.anyOf&&void 0===r.oneOf&&void 0===r.not&&void 0===r.$ref&&e.addError("KEYWORD_UNDEFINED_STRICT",["type"])}for(var n=Object.keys(r),s=n.length;s--;){var E=n[s];0!==E.indexOf("__")&&(void 0!==SchemaValidators[E]?SchemaValidators[E].call(this,e,r):t||this.options.noExtraKeywords===!0&&e.addError("KEYWORD_UNEXPECTED",[E]))}if(this.options.pedanticCheck===!0){if(r["enum"]){var d=Utils.clone(r);for(delete d["enum"],delete d["default"],e.path.push("enum"),s=r["enum"].length;s--;)e.path.push(s.toString()),JsonValidation.validate.call(this,e,d,r["enum"][s]),e.path.pop();e.path.pop()}r["default"]&&(e.path.push("default"),JsonValidation.validate.call(this,e,r,r["default"]),e.path.pop())}var p=e.isValid();return p&&(r.__$validated=!0),p};

},{"./FormatValidators":108,"./JsonValidation":109,"./Report":111,"./Utils":115}],115:[function(require,module,exports){
"use strict";exports.isAbsoluteUri=function(r){return/^https?:\/\//.test(r)},exports.isRelativeUri=function(r){return/.+#/.test(r)},exports.whatIs=function(r){var e=typeof r;return"object"===e?null===r?"null":Array.isArray(r)?"array":"object":"number"===e?Number.isFinite(r)?r%1===0?"integer":"number":Number.isNaN(r)?"not-a-number":"unknown-number":e},exports.areEqual=function r(e,t){if(e===t)return!0;var n,u;if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return!1;for(u=e.length,n=0;u>n;n++)if(!r(e[n],t[n]))return!1;return!0}if("object"===exports.whatIs(e)&&"object"===exports.whatIs(t)){var o=Object.keys(e),i=Object.keys(t);if(!r(o,i))return!1;for(u=o.length,n=0;u>n;n++)if(!r(e[o[n]],t[o[n]]))return!1;return!0}return!1},exports.isUniqueArray=function(r,e){var t,n,u=r.length;for(t=0;u>t;t++)for(n=t+1;u>n;n++)if(exports.areEqual(r[t],r[n]))return e&&e.push(t,n),!1;return!0},exports.difference=function(r,e){for(var t=[],n=r.length;n--;)-1===e.indexOf(r[n])&&t.push(r[n]);return t},exports.clone=function(r){if("undefined"!=typeof r){if("object"!=typeof r||null===r)return r;var e,t;if(Array.isArray(r))for(e=[],t=r.length;t--;)e[t]=r[t];else{e={};var n=Object.keys(r);for(t=n.length;t--;){var u=n[t];e[u]=r[u]}}return e}},exports.cloneDeep=function(r){function e(r){if("object"!=typeof r||null===r)return r;var u,o,i;if(i=t.indexOf(r),-1!==i)return n[i];if(t.push(r),Array.isArray(r))for(u=[],n.push(u),o=r.length;o--;)u[o]=e(r[o]);else{u={},n.push(u);var s=Object.keys(r);for(o=s.length;o--;){var f=s[o];u[f]=e(r[f])}}return u}var t=[],n=[];return e(r)},exports.ucs2decode=function(r){for(var e,t,n=[],u=0,o=r.length;o>u;)e=r.charCodeAt(u++),e>=55296&&56319>=e&&o>u?(t=r.charCodeAt(u++),56320==(64512&t)?n.push(((1023&e)<<10)+(1023&t)+65536):(n.push(e),u--)):n.push(e);return n};

},{}],116:[function(require,module,exports){
(function (process){
"use strict";function ZSchema(e){if(this.cache={},this.referenceCache=[],this.setRemoteReference("http://json-schema.org/draft-04/schema",Draft4Schema),this.setRemoteReference("http://json-schema.org/draft-04/hyper-schema",Draft4HyperSchema),"object"==typeof e){for(var t,r=Object.keys(e),a=r.length;a--;)if(t=r[a],void 0===defaultOptions[t])throw new Error("Unexpected option passed to constructor: "+t);for(r=Object.keys(defaultOptions),a=r.length;a--;)t=r[a],void 0===e[t]&&(e[t]=Utils.clone(defaultOptions[t]));this.options=e}else this.options=Utils.clone(defaultOptions);this.options.strictMode===!0&&(this.options.forceAdditional=!0,this.options.forceItems=!0,this.options.forceMaxLength=!0,this.options.forceProperties=!0,this.options.noExtraKeywords=!0,this.options.noTypeless=!0,this.options.noEmptyStrings=!0,this.options.noEmptyArrays=!0)}require("./Polyfills");var get=require("lodash.get"),Report=require("./Report"),FormatValidators=require("./FormatValidators"),JsonValidation=require("./JsonValidation"),SchemaCache=require("./SchemaCache"),SchemaCompilation=require("./SchemaCompilation"),SchemaValidation=require("./SchemaValidation"),Utils=require("./Utils"),Draft4Schema=require("./schemas/schema.json"),Draft4HyperSchema=require("./schemas/hyper-schema.json"),defaultOptions={asyncTimeout:2e3,forceAdditional:!1,assumeAdditional:!1,forceItems:!1,forceMinItems:!1,forceMaxItems:!1,forceMinLength:!1,forceMaxLength:!1,forceProperties:!1,ignoreUnresolvableReferences:!1,noExtraKeywords:!1,noTypeless:!1,noEmptyStrings:!1,noEmptyArrays:!1,strictUris:!1,strictMode:!1,reportPathAsArray:!1,breakOnFirstError:!0,pedanticCheck:!1,ignoreUnknownFormats:!1};ZSchema.prototype.compileSchema=function(e){var t=new Report(this.options);return e=SchemaCache.getSchema.call(this,t,e),SchemaCompilation.compileSchema.call(this,t,e),this.lastReport=t,t.isValid()},ZSchema.prototype.validateSchema=function(e){if(Array.isArray(e)&&0===e.length)throw new Error(".validateSchema was called with an empty array");var t=new Report(this.options);e=SchemaCache.getSchema.call(this,t,e);var r=SchemaCompilation.compileSchema.call(this,t,e);return r&&SchemaValidation.validateSchema.call(this,t,e),this.lastReport=t,t.isValid()},ZSchema.prototype.validate=function(e,t,r,a){"function"===Utils.whatIs(r)&&(a=r,r={}),r||(r={});var o=Utils.whatIs(t);if("string"!==o&&"object"!==o){var i=new Error("Invalid .validate call - schema must be an string or object but "+o+" was passed!");if(a)return void process.nextTick(function(){a(i,!1)});throw i}var s=!1,n=new Report(this.options);if("string"==typeof t){var c=t;if(t=SchemaCache.getSchema.call(this,n,c),!t)throw new Error("Schema with id '"+c+"' wasn't found in the validator cache!")}else t=SchemaCache.getSchema.call(this,n,t);var h=!1;s||(h=SchemaCompilation.compileSchema.call(this,n,t)),h||(this.lastReport=n,s=!0);var l=!1;if(s||(l=SchemaValidation.validateSchema.call(this,n,t)),l||(this.lastReport=n,s=!0),r.schemaPath&&(n.rootSchema=t,t=get(t,r.schemaPath),!t))throw new Error("Schema path '"+r.schemaPath+"' wasn't found in the schema!");if(s||JsonValidation.validate.call(this,n,t,e),a)return void n.processAsyncTasks(this.options.asyncTimeout,a);if(n.asyncTasks.length>0)throw new Error("This validation has async tasks and cannot be done in sync mode, please provide callback argument.");return this.lastReport=n,n.isValid()},ZSchema.prototype.getLastError=function(){if(0===this.lastReport.errors.length)return null;var e=new Error;return e.name="z-schema validation error",e.message=this.lastReport.commonErrorMessage,e.details=this.lastReport.errors,e},ZSchema.prototype.getLastErrors=function(){return this.lastReport&&this.lastReport.errors.length>0?this.lastReport.errors:void 0},ZSchema.prototype.getMissingReferences=function(e){e=e||this.lastReport.errors;for(var t=[],r=e.length;r--;){var a=e[r];if("UNRESOLVABLE_REFERENCE"===a.code){var o=a.params[0];-1===t.indexOf(o)&&t.push(o)}a.inner&&(t=t.concat(this.getMissingReferences(a.inner)))}return t},ZSchema.prototype.getMissingRemoteReferences=function(){for(var e=this.getMissingReferences(),t=[],r=e.length;r--;){var a=SchemaCache.getRemotePath(e[r]);a&&-1===t.indexOf(a)&&t.push(a)}return t},ZSchema.prototype.setRemoteReference=function(e,t){t="string"==typeof t?JSON.parse(t):Utils.cloneDeep(t),SchemaCache.cacheSchemaByUri.call(this,e,t)},ZSchema.prototype.getResolvedSchema=function(e){var t=new Report(this.options);e=SchemaCache.getSchema.call(this,t,e),e=Utils.cloneDeep(e);var r=[],a=function(e){var t,o=Utils.whatIs(e);if(("object"===o||"array"===o)&&!e.___$visited){if(e.___$visited=!0,r.push(e),e.$ref&&e.__$refResolved){var i=e.__$refResolved,s=e;delete e.$ref,delete e.__$refResolved;for(t in i)i.hasOwnProperty(t)&&(s[t]=i[t])}for(t in e)e.hasOwnProperty(t)&&(0===t.indexOf("__$")?delete e[t]:a(e[t]))}};if(a(e),r.forEach(function(e){delete e.___$visited}),this.lastReport=t,t.isValid())return e;throw this.getLastError()},ZSchema.prototype.setSchemaReader=function(e){return ZSchema.setSchemaReader(e)},ZSchema.prototype.getSchemaReader=function(){return ZSchema.schemaReader},ZSchema.setSchemaReader=function(e){ZSchema.schemaReader=e},ZSchema.registerFormat=function(e,t){FormatValidators[e]=t},ZSchema.unregisterFormat=function(e){delete FormatValidators[e]},ZSchema.getRegisteredFormats=function(){return Object.keys(FormatValidators)},ZSchema.getDefaultOptions=function(){return Utils.cloneDeep(defaultOptions)},module.exports=ZSchema;

}).call(this,require('_process'))

},{"./FormatValidators":108,"./JsonValidation":109,"./Polyfills":110,"./Report":111,"./SchemaCache":112,"./SchemaCompilation":113,"./SchemaValidation":114,"./Utils":115,"./schemas/hyper-schema.json":117,"./schemas/schema.json":118,"_process":77,"lodash.get":72}],117:[function(require,module,exports){
module.exports={
    "$schema": "http://json-schema.org/draft-04/hyper-schema#",
    "id": "http://json-schema.org/draft-04/hyper-schema#",
    "title": "JSON Hyper-Schema",
    "allOf": [
        {
            "$ref": "http://json-schema.org/draft-04/schema#"
        }
    ],
    "properties": {
        "additionalItems": {
            "anyOf": [
                {
                    "type": "boolean"
                },
                {
                    "$ref": "#"
                }
            ]
        },
        "additionalProperties": {
            "anyOf": [
                {
                    "type": "boolean"
                },
                {
                    "$ref": "#"
                }
            ]
        },
        "dependencies": {
            "additionalProperties": {
                "anyOf": [
                    {
                        "$ref": "#"
                    },
                    {
                        "type": "array"
                    }
                ]
            }
        },
        "items": {
            "anyOf": [
                {
                    "$ref": "#"
                },
                {
                    "$ref": "#/definitions/schemaArray"
                }
            ]
        },
        "definitions": {
            "additionalProperties": {
                "$ref": "#"
            }
        },
        "patternProperties": {
            "additionalProperties": {
                "$ref": "#"
            }
        },
        "properties": {
            "additionalProperties": {
                "$ref": "#"
            }
        },
        "allOf": {
            "$ref": "#/definitions/schemaArray"
        },
        "anyOf": {
            "$ref": "#/definitions/schemaArray"
        },
        "oneOf": {
            "$ref": "#/definitions/schemaArray"
        },
        "not": {
            "$ref": "#"
        },

        "links": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/linkDescription"
            }
        },
        "fragmentResolution": {
            "type": "string"
        },
        "media": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "A media type, as described in RFC 2046",
                    "type": "string"
                },
                "binaryEncoding": {
                    "description": "A content encoding scheme, as described in RFC 2045",
                    "type": "string"
                }
            }
        },
        "pathStart": {
            "description": "Instances' URIs must start with this value for this schema to apply to them",
            "type": "string",
            "format": "uri"
        }
    },
    "definitions": {
        "schemaArray": {
            "type": "array",
            "items": {
                "$ref": "#"
            }
        },
        "linkDescription": {
            "title": "Link Description Object",
            "type": "object",
            "required": [ "href", "rel" ],
            "properties": {
                "href": {
                    "description": "a URI template, as defined by RFC 6570, with the addition of the $, ( and ) characters for pre-processing",
                    "type": "string"
                },
                "rel": {
                    "description": "relation to the target resource of the link",
                    "type": "string"
                },
                "title": {
                    "description": "a title for the link",
                    "type": "string"
                },
                "targetSchema": {
                    "description": "JSON Schema describing the link target",
                    "$ref": "#"
                },
                "mediaType": {
                    "description": "media type (as defined by RFC 2046) describing the link target",
                    "type": "string"
                },
                "method": {
                    "description": "method for requesting the target of the link (e.g. for HTTP this might be \"GET\" or \"DELETE\")",
                    "type": "string"
                },
                "encType": {
                    "description": "The media type in which to submit data along with the request",
                    "type": "string",
                    "default": "application/json"
                },
                "schema": {
                    "description": "Schema describing the data to submit along with the request",
                    "$ref": "#"
                }
            }
        }
    }
}


},{}],118:[function(require,module,exports){
module.exports={
    "id": "http://json-schema.org/draft-04/schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "Core schema meta-schema",
    "definitions": {
        "schemaArray": {
            "type": "array",
            "minItems": 1,
            "items": { "$ref": "#" }
        },
        "positiveInteger": {
            "type": "integer",
            "minimum": 0
        },
        "positiveIntegerDefault0": {
            "allOf": [ { "$ref": "#/definitions/positiveInteger" }, { "default": 0 } ]
        },
        "simpleTypes": {
            "enum": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        },
        "stringArray": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1,
            "uniqueItems": true
        }
    },
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "format": "uri"
        },
        "$schema": {
            "type": "string",
            "format": "uri"
        },
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "default": {},
        "multipleOf": {
            "type": "number",
            "minimum": 0,
            "exclusiveMinimum": true
        },
        "maximum": {
            "type": "number"
        },
        "exclusiveMaximum": {
            "type": "boolean",
            "default": false
        },
        "minimum": {
            "type": "number"
        },
        "exclusiveMinimum": {
            "type": "boolean",
            "default": false
        },
        "maxLength": { "$ref": "#/definitions/positiveInteger" },
        "minLength": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "pattern": {
            "type": "string",
            "format": "regex"
        },
        "additionalItems": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "items": {
            "anyOf": [
                { "$ref": "#" },
                { "$ref": "#/definitions/schemaArray" }
            ],
            "default": {}
        },
        "maxItems": { "$ref": "#/definitions/positiveInteger" },
        "minItems": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "uniqueItems": {
            "type": "boolean",
            "default": false
        },
        "maxProperties": { "$ref": "#/definitions/positiveInteger" },
        "minProperties": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "required": { "$ref": "#/definitions/stringArray" },
        "additionalProperties": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "definitions": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "properties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "patternProperties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "dependencies": {
            "type": "object",
            "additionalProperties": {
                "anyOf": [
                    { "$ref": "#" },
                    { "$ref": "#/definitions/stringArray" }
                ]
            }
        },
        "enum": {
            "type": "array",
            "minItems": 1,
            "uniqueItems": true
        },
        "type": {
            "anyOf": [
                { "$ref": "#/definitions/simpleTypes" },
                {
                    "type": "array",
                    "items": { "$ref": "#/definitions/simpleTypes" },
                    "minItems": 1,
                    "uniqueItems": true
                }
            ]
        },
        "format": { "type": "string" },
        "allOf": { "$ref": "#/definitions/schemaArray" },
        "anyOf": { "$ref": "#/definitions/schemaArray" },
        "oneOf": { "$ref": "#/definitions/schemaArray" },
        "not": { "$ref": "#" }
    },
    "dependencies": {
        "exclusiveMaximum": [ "maximum" ],
        "exclusiveMinimum": [ "minimum" ]
    },
    "default": {}
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=swagger-parser.min.js.map