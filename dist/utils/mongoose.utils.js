var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/fastify-plugin@5.0.1/node_modules/fastify-plugin/lib/getPluginName.js
var require_getPluginName = __commonJS({
  "node_modules/.pnpm/fastify-plugin@5.0.1/node_modules/fastify-plugin/lib/getPluginName.js"(exports, module) {
    "use strict";
    var fpStackTracePattern = /at\s{1}(?:.*\.)?plugin\s{1}.*\n\s*(.*)/;
    var fileNamePattern = /(\w*(\.\w*)*)\..*/;
    module.exports = function getPluginName(fn) {
      if (fn.name.length > 0) return fn.name;
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 10;
      try {
        throw new Error("anonymous function");
      } catch (e) {
        Error.stackTraceLimit = stackTraceLimit;
        return extractPluginName(e.stack);
      }
    };
    function extractPluginName(stack) {
      const m = stack.match(fpStackTracePattern);
      return m ? m[1].split(/[/\\]/).slice(-1)[0].match(fileNamePattern)[1] : "anonymous";
    }
    module.exports.extractPluginName = extractPluginName;
  }
});

// node_modules/.pnpm/fastify-plugin@5.0.1/node_modules/fastify-plugin/lib/toCamelCase.js
var require_toCamelCase = __commonJS({
  "node_modules/.pnpm/fastify-plugin@5.0.1/node_modules/fastify-plugin/lib/toCamelCase.js"(exports, module) {
    "use strict";
    module.exports = function toCamelCase(name) {
      if (name[0] === "@") {
        name = name.slice(1).replace("/", "-");
      }
      return name.replace(/-(.)/g, function(match, g1) {
        return g1.toUpperCase();
      });
    };
  }
});

// node_modules/.pnpm/fastify-plugin@5.0.1/node_modules/fastify-plugin/plugin.js
var require_plugin = __commonJS({
  "node_modules/.pnpm/fastify-plugin@5.0.1/node_modules/fastify-plugin/plugin.js"(exports, module) {
    "use strict";
    var getPluginName = require_getPluginName();
    var toCamelCase = require_toCamelCase();
    var count = 0;
    function plugin(fn, options = {}) {
      let autoName = false;
      if (fn.default !== void 0) {
        fn = fn.default;
      }
      if (typeof fn !== "function") {
        throw new TypeError(
          `fastify-plugin expects a function, instead got a '${typeof fn}'`
        );
      }
      if (typeof options === "string") {
        options = {
          fastify: options
        };
      }
      if (typeof options !== "object" || Array.isArray(options) || options === null) {
        throw new TypeError("The options object should be an object");
      }
      if (options.fastify !== void 0 && typeof options.fastify !== "string") {
        throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof options.fastify}'`);
      }
      if (!options.name) {
        autoName = true;
        options.name = getPluginName(fn) + "-auto-" + count++;
      }
      fn[Symbol.for("skip-override")] = options.encapsulate !== true;
      fn[Symbol.for("fastify.display-name")] = options.name;
      fn[Symbol.for("plugin-meta")] = options;
      if (!fn.default) {
        fn.default = fn;
      }
      const camelCase = toCamelCase(options.name);
      if (!autoName && !fn[camelCase]) {
        fn[camelCase] = fn;
      }
      return fn;
    }
    module.exports = plugin;
    module.exports.default = plugin;
    module.exports.fastifyPlugin = plugin;
  }
});

// node_modules/.pnpm/forwarded@0.2.0/node_modules/forwarded/index.js
var require_forwarded = __commonJS({
  "node_modules/.pnpm/forwarded@0.2.0/node_modules/forwarded/index.js"(exports, module) {
    "use strict";
    module.exports = forwarded;
    function forwarded(req) {
      if (!req) {
        throw new TypeError("argument req is required");
      }
      var proxyAddrs = parse(req.headers["x-forwarded-for"] || "");
      var socketAddr = getSocketAddr(req);
      var addrs = [socketAddr].concat(proxyAddrs);
      return addrs;
    }
    function getSocketAddr(req) {
      return req.socket ? req.socket.remoteAddress : req.connection.remoteAddress;
    }
    function parse(header) {
      var end = header.length;
      var list = [];
      var start = header.length;
      for (var i = header.length - 1; i >= 0; i--) {
        switch (header.charCodeAt(i)) {
          case 32:
            if (start === end) {
              start = end = i;
            }
            break;
          case 44:
            if (start !== end) {
              list.push(header.substring(start, end));
            }
            start = end = i;
            break;
          default:
            start = i;
            break;
        }
      }
      if (start !== end) {
        list.push(header.substring(start, end));
      }
      return list;
    }
  }
});

// node_modules/.pnpm/media-typer@0.3.0/node_modules/media-typer/index.js
var require_media_typer = __commonJS({
  "node_modules/.pnpm/media-typer@0.3.0/node_modules/media-typer/index.js"(exports) {
    var paramRegExp = /; *([!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) *= *("(?:[ !\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u0020-\u007e])*"|[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+) */g;
    var textRegExp = /^[\u0020-\u007e\u0080-\u00ff]+$/;
    var tokenRegExp = /^[!#$%&'\*\+\-\.0-9A-Z\^_`a-z\|~]+$/;
    var qescRegExp = /\\([\u0000-\u007f])/g;
    var quoteRegExp = /([\\"])/g;
    var subtypeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
    var typeNameRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
    var typeRegExp = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
    exports.format = format;
    exports.parse = parse;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var parameters = obj.parameters;
      var subtype = obj.subtype;
      var suffix = obj.suffix;
      var type = obj.type;
      if (!type || !typeNameRegExp.test(type)) {
        throw new TypeError("invalid type");
      }
      if (!subtype || !subtypeNameRegExp.test(subtype)) {
        throw new TypeError("invalid subtype");
      }
      var string = type + "/" + subtype;
      if (suffix) {
        if (!typeNameRegExp.test(suffix)) {
          throw new TypeError("invalid suffix");
        }
        string += "+" + suffix;
      }
      if (parameters && typeof parameters === "object") {
        var param;
        var params = Object.keys(parameters).sort();
        for (var i = 0; i < params.length; i++) {
          param = params[i];
          if (!tokenRegExp.test(param)) {
            throw new TypeError("invalid parameter name");
          }
          string += "; " + param + "=" + qstring(parameters[param]);
        }
      }
      return string;
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string === "object") {
        string = getcontenttype(string);
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var index = string.indexOf(";");
      var type = index !== -1 ? string.substr(0, index) : string;
      var key;
      var match;
      var obj = splitType(type);
      var params = {};
      var value;
      paramRegExp.lastIndex = index;
      while (match = paramRegExp.exec(string)) {
        if (match.index !== index) {
          throw new TypeError("invalid parameter format");
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.substr(1, value.length - 2).replace(qescRegExp, "$1");
        }
        params[key] = value;
      }
      if (index !== -1 && index !== string.length) {
        throw new TypeError("invalid parameter format");
      }
      obj.parameters = params;
      return obj;
    }
    function getcontenttype(obj) {
      if (typeof obj.getHeader === "function") {
        return obj.getHeader("content-type");
      }
      if (typeof obj.headers === "object") {
        return obj.headers && obj.headers["content-type"];
      }
    }
    function qstring(val) {
      var str = String(val);
      if (tokenRegExp.test(str)) {
        return str;
      }
      if (str.length > 0 && !textRegExp.test(str)) {
        throw new TypeError("invalid parameter value");
      }
      return '"' + str.replace(quoteRegExp, "\\$1") + '"';
    }
    function splitType(string) {
      var match = typeRegExp.exec(string.toLowerCase());
      if (!match) {
        throw new TypeError("invalid media type");
      }
      var type = match[1];
      var subtype = match[2];
      var suffix;
      var index = subtype.lastIndexOf("+");
      if (index !== -1) {
        suffix = subtype.substr(index + 1);
        subtype = subtype.substr(0, index);
      }
      var obj = {
        type,
        subtype,
        suffix
      };
      return obj;
    }
  }
});

// node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/db.json"(exports, module) {
    module.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});

// node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/index.js"(exports, module) {
    module.exports = require_db();
  }
});

// node_modules/.pnpm/mime-types@2.1.35/node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/.pnpm/mime-types@2.1.35/node_modules/mime-types/index.js"(exports) {
    "use strict";
    var db = require_mime_db();
    var extname = __require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports.charset = charset;
    exports.charsets = { lookup: charset };
    exports.contentType = contentType;
    exports.extension = extension;
    exports.extensions = /* @__PURE__ */ Object.create(null);
    exports.lookup = lookup;
    exports.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports.extensions, exports.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports.charset(mime);
        if (charset2) mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path) {
      if (!path || typeof path !== "string") {
        return false;
      }
      var extension2 = extname("x." + path).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});

// node_modules/.pnpm/type-is@1.6.18/node_modules/type-is/index.js
var require_type_is = __commonJS({
  "node_modules/.pnpm/type-is@1.6.18/node_modules/type-is/index.js"(exports, module) {
    "use strict";
    var typer = require_media_typer();
    var mime = require_mime_types();
    module.exports = typeofrequest;
    module.exports.is = typeis;
    module.exports.hasBody = hasbody;
    module.exports.normalize = normalize;
    module.exports.match = mimeMatch;
    function typeis(value, types_) {
      var i;
      var types = types_;
      var val = tryNormalizeType(value);
      if (!val) {
        return false;
      }
      if (types && !Array.isArray(types)) {
        types = new Array(arguments.length - 1);
        for (i = 0; i < types.length; i++) {
          types[i] = arguments[i + 1];
        }
      }
      if (!types || !types.length) {
        return val;
      }
      var type;
      for (i = 0; i < types.length; i++) {
        if (mimeMatch(normalize(type = types[i]), val)) {
          return type[0] === "+" || type.indexOf("*") !== -1 ? val : type;
        }
      }
      return false;
    }
    function hasbody(req) {
      return req.headers["transfer-encoding"] !== void 0 || !isNaN(req.headers["content-length"]);
    }
    function typeofrequest(req, types_) {
      var types = types_;
      if (!hasbody(req)) {
        return null;
      }
      if (arguments.length > 2) {
        types = new Array(arguments.length - 1);
        for (var i = 0; i < types.length; i++) {
          types[i] = arguments[i + 1];
        }
      }
      var value = req.headers["content-type"];
      return typeis(value, types);
    }
    function normalize(type) {
      if (typeof type !== "string") {
        return false;
      }
      switch (type) {
        case "urlencoded":
          return "application/x-www-form-urlencoded";
        case "multipart":
          return "multipart/*";
      }
      if (type[0] === "+") {
        return "*/*" + type;
      }
      return type.indexOf("/") === -1 ? mime.lookup(type) : type;
    }
    function mimeMatch(expected, actual) {
      if (expected === false) {
        return false;
      }
      var actualParts = actual.split("/");
      var expectedParts = expected.split("/");
      if (actualParts.length !== 2 || expectedParts.length !== 2) {
        return false;
      }
      if (expectedParts[0] !== "*" && expectedParts[0] !== actualParts[0]) {
        return false;
      }
      if (expectedParts[1].substr(0, 2) === "*+") {
        return expectedParts[1].length <= actualParts[1].length + 1 && expectedParts[1].substr(1) === actualParts[1].substr(1 - expectedParts[1].length);
      }
      if (expectedParts[1] !== "*" && expectedParts[1] !== actualParts[1]) {
        return false;
      }
      return true;
    }
    function normalizeType(value) {
      var type = typer.parse(value);
      type.parameters = void 0;
      return typer.format(type);
    }
    function tryNormalizeType(value) {
      if (!value) {
        return null;
      }
      try {
        return normalizeType(value);
      } catch (err) {
        return null;
      }
    }
  }
});

// node_modules/.pnpm/depd@2.0.0/node_modules/depd/index.js
var require_depd = __commonJS({
  "node_modules/.pnpm/depd@2.0.0/node_modules/depd/index.js"(exports, module) {
    var relative = __require("path").relative;
    module.exports = depd;
    var basePath = process.cwd();
    function containsNamespace(str, namespace) {
      var vals = str.split(/[ ,]+/);
      var ns = String(namespace).toLowerCase();
      for (var i = 0; i < vals.length; i++) {
        var val = vals[i];
        if (val && (val === "*" || val.toLowerCase() === ns)) {
          return true;
        }
      }
      return false;
    }
    function convertDataDescriptorToAccessor(obj, prop, message) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      var value = descriptor.value;
      descriptor.get = function getter() {
        return value;
      };
      if (descriptor.writable) {
        descriptor.set = function setter(val) {
          return value = val;
        };
      }
      delete descriptor.value;
      delete descriptor.writable;
      Object.defineProperty(obj, prop, descriptor);
      return descriptor;
    }
    function createArgumentsString(arity) {
      var str = "";
      for (var i = 0; i < arity; i++) {
        str += ", arg" + i;
      }
      return str.substr(2);
    }
    function createStackString(stack) {
      var str = this.name + ": " + this.namespace;
      if (this.message) {
        str += " deprecated " + this.message;
      }
      for (var i = 0; i < stack.length; i++) {
        str += "\n    at " + stack[i].toString();
      }
      return str;
    }
    function depd(namespace) {
      if (!namespace) {
        throw new TypeError("argument namespace is required");
      }
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      var file = site[0];
      function deprecate(message) {
        log.call(deprecate, message);
      }
      deprecate._file = file;
      deprecate._ignored = isignored(namespace);
      deprecate._namespace = namespace;
      deprecate._traced = istraced(namespace);
      deprecate._warned = /* @__PURE__ */ Object.create(null);
      deprecate.function = wrapfunction;
      deprecate.property = wrapproperty;
      return deprecate;
    }
    function eehaslisteners(emitter, type) {
      var count = typeof emitter.listenerCount !== "function" ? emitter.listeners(type).length : emitter.listenerCount(type);
      return count > 0;
    }
    function isignored(namespace) {
      if (process.noDeprecation) {
        return true;
      }
      var str = process.env.NO_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function istraced(namespace) {
      if (process.traceDeprecation) {
        return true;
      }
      var str = process.env.TRACE_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function log(message, site) {
      var haslisteners = eehaslisteners(process, "deprecation");
      if (!haslisteners && this._ignored) {
        return;
      }
      var caller;
      var callFile;
      var callSite;
      var depSite;
      var i = 0;
      var seen = false;
      var stack = getStack();
      var file = this._file;
      if (site) {
        depSite = site;
        callSite = callSiteLocation(stack[1]);
        callSite.name = depSite.name;
        file = callSite[0];
      } else {
        i = 2;
        depSite = callSiteLocation(stack[i]);
        callSite = depSite;
      }
      for (; i < stack.length; i++) {
        caller = callSiteLocation(stack[i]);
        callFile = caller[0];
        if (callFile === file) {
          seen = true;
        } else if (callFile === this._file) {
          file = this._file;
        } else if (seen) {
          break;
        }
      }
      var key = caller ? depSite.join(":") + "__" + caller.join(":") : void 0;
      if (key !== void 0 && key in this._warned) {
        return;
      }
      this._warned[key] = true;
      var msg = message;
      if (!msg) {
        msg = callSite === depSite || !callSite.name ? defaultMessage(depSite) : defaultMessage(callSite);
      }
      if (haslisteners) {
        var err = DeprecationError(this._namespace, msg, stack.slice(i));
        process.emit("deprecation", err);
        return;
      }
      var format = process.stderr.isTTY ? formatColor : formatPlain;
      var output = format.call(this, msg, caller, stack.slice(i));
      process.stderr.write(output + "\n", "utf8");
    }
    function callSiteLocation(callSite) {
      var file = callSite.getFileName() || "<anonymous>";
      var line = callSite.getLineNumber();
      var colm = callSite.getColumnNumber();
      if (callSite.isEval()) {
        file = callSite.getEvalOrigin() + ", " + file;
      }
      var site = [file, line, colm];
      site.callSite = callSite;
      site.name = callSite.getFunctionName();
      return site;
    }
    function defaultMessage(site) {
      var callSite = site.callSite;
      var funcName = site.name;
      if (!funcName) {
        funcName = "<anonymous@" + formatLocation(site) + ">";
      }
      var context = callSite.getThis();
      var typeName = context && callSite.getTypeName();
      if (typeName === "Object") {
        typeName = void 0;
      }
      if (typeName === "Function") {
        typeName = context.name || typeName;
      }
      return typeName && callSite.getMethodName() ? typeName + "." + funcName : funcName;
    }
    function formatPlain(msg, caller, stack) {
      var timestamp = (/* @__PURE__ */ new Date()).toUTCString();
      var formatted = timestamp + " " + this._namespace + " deprecated " + msg;
      if (this._traced) {
        for (var i = 0; i < stack.length; i++) {
          formatted += "\n    at " + stack[i].toString();
        }
        return formatted;
      }
      if (caller) {
        formatted += " at " + formatLocation(caller);
      }
      return formatted;
    }
    function formatColor(msg, caller, stack) {
      var formatted = "\x1B[36;1m" + this._namespace + "\x1B[22;39m \x1B[33;1mdeprecated\x1B[22;39m \x1B[0m" + msg + "\x1B[39m";
      if (this._traced) {
        for (var i = 0; i < stack.length; i++) {
          formatted += "\n    \x1B[36mat " + stack[i].toString() + "\x1B[39m";
        }
        return formatted;
      }
      if (caller) {
        formatted += " \x1B[36m" + formatLocation(caller) + "\x1B[39m";
      }
      return formatted;
    }
    function formatLocation(callSite) {
      return relative(basePath, callSite[0]) + ":" + callSite[1] + ":" + callSite[2];
    }
    function getStack() {
      var limit = Error.stackTraceLimit;
      var obj = {};
      var prep = Error.prepareStackTrace;
      Error.prepareStackTrace = prepareObjectStackTrace;
      Error.stackTraceLimit = Math.max(10, limit);
      Error.captureStackTrace(obj);
      var stack = obj.stack.slice(1);
      Error.prepareStackTrace = prep;
      Error.stackTraceLimit = limit;
      return stack;
    }
    function prepareObjectStackTrace(obj, stack) {
      return stack;
    }
    function wrapfunction(fn, message) {
      if (typeof fn !== "function") {
        throw new TypeError("argument fn must be a function");
      }
      var args = createArgumentsString(fn.length);
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      site.name = fn.name;
      var deprecatedfn = new Function(
        "fn",
        "log",
        "deprecate",
        "message",
        "site",
        '"use strict"\nreturn function (' + args + ") {log.call(deprecate, message, site)\nreturn fn.apply(this, arguments)\n}"
      )(fn, log, this, message, site);
      return deprecatedfn;
    }
    function wrapproperty(obj, prop, message) {
      if (!obj || typeof obj !== "object" && typeof obj !== "function") {
        throw new TypeError("argument obj must be object");
      }
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      if (!descriptor) {
        throw new TypeError("must call property on owner object");
      }
      if (!descriptor.configurable) {
        throw new TypeError("property must be configurable");
      }
      var deprecate = this;
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      site.name = prop;
      if ("value" in descriptor) {
        descriptor = convertDataDescriptorToAccessor(obj, prop, message);
      }
      var get = descriptor.get;
      var set = descriptor.set;
      if (typeof get === "function") {
        descriptor.get = function getter() {
          log.call(deprecate, message, site);
          return get.apply(this, arguments);
        };
      }
      if (typeof set === "function") {
        descriptor.set = function setter() {
          log.call(deprecate, message, site);
          return set.apply(this, arguments);
        };
      }
      Object.defineProperty(obj, prop, descriptor);
    }
    function DeprecationError(namespace, message, stack) {
      var error = new Error();
      var stackString;
      Object.defineProperty(error, "constructor", {
        value: DeprecationError
      });
      Object.defineProperty(error, "message", {
        configurable: true,
        enumerable: false,
        value: message,
        writable: true
      });
      Object.defineProperty(error, "name", {
        enumerable: false,
        configurable: true,
        value: "DeprecationError",
        writable: true
      });
      Object.defineProperty(error, "namespace", {
        configurable: true,
        enumerable: false,
        value: namespace,
        writable: true
      });
      Object.defineProperty(error, "stack", {
        configurable: true,
        enumerable: false,
        get: function() {
          if (stackString !== void 0) {
            return stackString;
          }
          return stackString = createStackString.call(this, stack);
        },
        set: function setter(val) {
          stackString = val;
        }
      });
      return error;
    }
  }
});

// node_modules/.pnpm/setprototypeof@1.2.0/node_modules/setprototypeof/index.js
var require_setprototypeof = __commonJS({
  "node_modules/.pnpm/setprototypeof@1.2.0/node_modules/setprototypeof/index.js"(exports, module) {
    "use strict";
    module.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);
    function setProtoOf(obj, proto) {
      obj.__proto__ = proto;
      return obj;
    }
    function mixinProperties(obj, proto) {
      for (var prop in proto) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
          obj[prop] = proto[prop];
        }
      }
      return obj;
    }
  }
});

// node_modules/.pnpm/statuses@2.0.1/node_modules/statuses/codes.json
var require_codes = __commonJS({
  "node_modules/.pnpm/statuses@2.0.1/node_modules/statuses/codes.json"(exports, module) {
    module.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a Teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Too Early",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/.pnpm/statuses@2.0.1/node_modules/statuses/index.js
var require_statuses = __commonJS({
  "node_modules/.pnpm/statuses@2.0.1/node_modules/statuses/index.js"(exports, module) {
    "use strict";
    var codes = require_codes();
    module.exports = status;
    status.message = codes;
    status.code = createMessageToStatusCodeMap(codes);
    status.codes = createStatusCodeList(codes);
    status.redirect = {
      300: true,
      301: true,
      302: true,
      303: true,
      305: true,
      307: true,
      308: true
    };
    status.empty = {
      204: true,
      205: true,
      304: true
    };
    status.retry = {
      502: true,
      503: true,
      504: true
    };
    function createMessageToStatusCodeMap(codes2) {
      var map = {};
      Object.keys(codes2).forEach(function forEachCode(code) {
        var message = codes2[code];
        var status2 = Number(code);
        map[message.toLowerCase()] = status2;
      });
      return map;
    }
    function createStatusCodeList(codes2) {
      return Object.keys(codes2).map(function mapCode(code) {
        return Number(code);
      });
    }
    function getStatusCode(message) {
      var msg = message.toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(status.code, msg)) {
        throw new Error('invalid status message: "' + message + '"');
      }
      return status.code[msg];
    }
    function getStatusMessage(code) {
      if (!Object.prototype.hasOwnProperty.call(status.message, code)) {
        throw new Error("invalid status code: " + code);
      }
      return status.message[code];
    }
    function status(code) {
      if (typeof code === "number") {
        return getStatusMessage(code);
      }
      if (typeof code !== "string") {
        throw new TypeError("code must be a number or string");
      }
      var n = parseInt(code, 10);
      if (!isNaN(n)) {
        return getStatusMessage(n);
      }
      return getStatusCode(code);
    }
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js"(exports, module) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function") throw "";
      module.exports = util.inherits;
    } catch (e) {
      module.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/.pnpm/toidentifier@1.0.1/node_modules/toidentifier/index.js
var require_toidentifier = __commonJS({
  "node_modules/.pnpm/toidentifier@1.0.1/node_modules/toidentifier/index.js"(exports, module) {
    "use strict";
    module.exports = toIdentifier;
    function toIdentifier(str) {
      return str.split(" ").map(function(token) {
        return token.slice(0, 1).toUpperCase() + token.slice(1);
      }).join("").replace(/[^ _0-9a-z]/gi, "");
    }
  }
});

// node_modules/.pnpm/http-errors@2.0.0/node_modules/http-errors/index.js
var require_http_errors = __commonJS({
  "node_modules/.pnpm/http-errors@2.0.0/node_modules/http-errors/index.js"(exports, module) {
    "use strict";
    var deprecate = require_depd()("http-errors");
    var setPrototypeOf = require_setprototypeof();
    var statuses = require_statuses();
    var inherits = require_inherits();
    var toIdentifier = require_toidentifier();
    module.exports = createError;
    module.exports.HttpError = createHttpErrorConstructor();
    module.exports.isHttpError = createIsHttpErrorFunction(module.exports.HttpError);
    populateConstructorExports(module.exports, statuses.codes, module.exports.HttpError);
    function codeClass(status) {
      return Number(String(status).charAt(0) + "00");
    }
    function createError() {
      var err;
      var msg;
      var status = 500;
      var props = {};
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var type = typeof arg;
        if (type === "object" && arg instanceof Error) {
          err = arg;
          status = err.status || err.statusCode || status;
        } else if (type === "number" && i === 0) {
          status = arg;
        } else if (type === "string") {
          msg = arg;
        } else if (type === "object") {
          props = arg;
        } else {
          throw new TypeError("argument #" + (i + 1) + " unsupported type " + type);
        }
      }
      if (typeof status === "number" && (status < 400 || status >= 600)) {
        deprecate("non-error status code; use only 4xx or 5xx status codes");
      }
      if (typeof status !== "number" || !statuses.message[status] && (status < 400 || status >= 600)) {
        status = 500;
      }
      var HttpError = createError[status] || createError[codeClass(status)];
      if (!err) {
        err = HttpError ? new HttpError(msg) : new Error(msg || statuses.message[status]);
        Error.captureStackTrace(err, createError);
      }
      if (!HttpError || !(err instanceof HttpError) || err.status !== status) {
        err.expose = status < 500;
        err.status = err.statusCode = status;
      }
      for (var key in props) {
        if (key !== "status" && key !== "statusCode") {
          err[key] = props[key];
        }
      }
      return err;
    }
    function createHttpErrorConstructor() {
      function HttpError() {
        throw new TypeError("cannot construct abstract class");
      }
      inherits(HttpError, Error);
      return HttpError;
    }
    function createClientErrorConstructor(HttpError, name, code) {
      var className = toClassName(name);
      function ClientError(message) {
        var msg = message != null ? message : statuses.message[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ClientError);
        setPrototypeOf(err, ClientError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ClientError, HttpError);
      nameFunc(ClientError, className);
      ClientError.prototype.status = code;
      ClientError.prototype.statusCode = code;
      ClientError.prototype.expose = true;
      return ClientError;
    }
    function createIsHttpErrorFunction(HttpError) {
      return function isHttpError(val) {
        if (!val || typeof val !== "object") {
          return false;
        }
        if (val instanceof HttpError) {
          return true;
        }
        return val instanceof Error && typeof val.expose === "boolean" && typeof val.statusCode === "number" && val.status === val.statusCode;
      };
    }
    function createServerErrorConstructor(HttpError, name, code) {
      var className = toClassName(name);
      function ServerError(message) {
        var msg = message != null ? message : statuses.message[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ServerError);
        setPrototypeOf(err, ServerError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ServerError, HttpError);
      nameFunc(ServerError, className);
      ServerError.prototype.status = code;
      ServerError.prototype.statusCode = code;
      ServerError.prototype.expose = false;
      return ServerError;
    }
    function nameFunc(func, name) {
      var desc = Object.getOwnPropertyDescriptor(func, "name");
      if (desc && desc.configurable) {
        desc.value = name;
        Object.defineProperty(func, "name", desc);
      }
    }
    function populateConstructorExports(exports2, codes, HttpError) {
      codes.forEach(function forEachCode(code) {
        var CodeError;
        var name = toIdentifier(statuses.message[code]);
        switch (codeClass(code)) {
          case 400:
            CodeError = createClientErrorConstructor(HttpError, name, code);
            break;
          case 500:
            CodeError = createServerErrorConstructor(HttpError, name, code);
            break;
        }
        if (CodeError) {
          exports2[code] = CodeError;
          exports2[name] = CodeError;
        }
      });
    }
    function toClassName(name) {
      return name.substr(-5) !== "Error" ? name + "Error" : name;
    }
  }
});

// node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/httpErrors.js
var require_httpErrors = __commonJS({
  "node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/httpErrors.js"(exports, module) {
    "use strict";
    var createError = require_http_errors();
    var statusCodes = __require("node:http").STATUS_CODES;
    var statusCodesMap = Object.assign({}, statusCodes);
    Object.keys(statusCodesMap).forEach((code) => {
      statusCodesMap[code] = normalize(code, statusCodesMap[code]);
    });
    function normalize(code, msg) {
      if (code === "414") return "uriTooLong";
      if (code === "505") return "httpVersionNotSupported";
      msg = msg.split(" ").join("").replace(/'/g, "");
      msg = msg[0].toLowerCase() + msg.slice(1);
      return msg;
    }
    var httpErrors2 = {
      badRequest: function badRequest(message) {
        return new createError.BadRequest(message);
      },
      unauthorized: function unauthorized(message) {
        return new createError.Unauthorized(message);
      },
      paymentRequired: function paymentRequired(message) {
        return new createError.PaymentRequired(message);
      },
      forbidden: function forbidden(message) {
        return new createError.Forbidden(message);
      },
      notFound: function notFound(message) {
        return new createError.NotFound(message);
      },
      methodNotAllowed: function methodNotAllowed(message) {
        return new createError.MethodNotAllowed(message);
      },
      notAcceptable: function notAcceptable(message) {
        return new createError.NotAcceptable(message);
      },
      proxyAuthenticationRequired: function proxyAuthenticationRequired(message) {
        return new createError.ProxyAuthenticationRequired(message);
      },
      requestTimeout: function requestTimeout(message) {
        return new createError.RequestTimeout(message);
      },
      conflict: function conflict(message) {
        return new createError.Conflict(message);
      },
      gone: function gone(message) {
        return new createError.Gone(message);
      },
      lengthRequired: function lengthRequired(message) {
        return new createError.LengthRequired(message);
      },
      preconditionFailed: function preconditionFailed(message) {
        return new createError.PreconditionFailed(message);
      },
      payloadTooLarge: function payloadTooLarge(message) {
        return new createError.PayloadTooLarge(message);
      },
      uriTooLong: function uriTooLong(message) {
        return new createError.URITooLong(message);
      },
      unsupportedMediaType: function unsupportedMediaType(message) {
        return new createError.UnsupportedMediaType(message);
      },
      rangeNotSatisfiable: function rangeNotSatisfiable(message) {
        return new createError.RangeNotSatisfiable(message);
      },
      expectationFailed: function expectationFailed(message) {
        return new createError.ExpectationFailed(message);
      },
      imateapot: function imateapot(message) {
        return new createError.ImATeapot(message);
      },
      misdirectedRequest: function misdirectedRequest(message) {
        return new createError.MisdirectedRequest(message);
      },
      unprocessableEntity: function unprocessableEntity(message) {
        return new createError.UnprocessableEntity(message);
      },
      locked: function locked(message) {
        return new createError.Locked(message);
      },
      failedDependency: function failedDependency(message) {
        return new createError.FailedDependency(message);
      },
      tooEarly: function tooEarly(message) {
        return new createError.TooEarly(message);
      },
      upgradeRequired: function upgradeRequired(message) {
        return new createError.UpgradeRequired(message);
      },
      preconditionRequired: function preconditionRequired(message) {
        return new createError.PreconditionRequired(message);
      },
      tooManyRequests: function tooManyRequests(message) {
        return new createError.TooManyRequests(message);
      },
      requestHeaderFieldsTooLarge: function requestHeaderFieldsTooLarge(message) {
        return new createError.RequestHeaderFieldsTooLarge(message);
      },
      unavailableForLegalReasons: function unavailableForLegalReasons(message) {
        return new createError.UnavailableForLegalReasons(message);
      },
      internalServerError: function internalServerError(message) {
        return new createError.InternalServerError(message);
      },
      notImplemented: function notImplemented(message) {
        return new createError.NotImplemented(message);
      },
      badGateway: function badGateway(message) {
        return new createError.BadGateway(message);
      },
      serviceUnavailable: function serviceUnavailable(message) {
        return new createError.ServiceUnavailable(message);
      },
      gatewayTimeout: function gatewayTimeout(message) {
        return new createError.GatewayTimeout(message);
      },
      httpVersionNotSupported: function httpVersionNotSupported(message) {
        return new createError.HTTPVersionNotSupported(message);
      },
      variantAlsoNegotiates: function variantAlsoNegotiates(message) {
        return new createError.VariantAlsoNegotiates(message);
      },
      insufficientStorage: function insufficientStorage(message) {
        return new createError.InsufficientStorage(message);
      },
      loopDetected: function loopDetected(message) {
        return new createError.LoopDetected(message);
      },
      bandwidthLimitExceeded: function bandwidthLimitExceeded(message) {
        return new createError.BandwidthLimitExceeded(message);
      },
      notExtended: function notExtended(message) {
        return new createError.NotExtended(message);
      },
      networkAuthenticationRequired: function networkAuthenticationRequired(message) {
        return new createError.NetworkAuthenticationRequired(message);
      }
    };
    function getHttpError(code, message) {
      return httpErrors2[statusCodesMap[code + ""]](message);
    }
    module.exports = httpErrors2;
    module.exports.getHttpError = getHttpError;
    module.exports.HttpError = createError.HttpError;
    module.exports.createError = createError;
  }
});

// node_modules/.pnpm/dequal@2.0.3/node_modules/dequal/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/dequal@2.0.3/node_modules/dequal/dist/index.js"(exports) {
    var has = Object.prototype.hasOwnProperty;
    function find2(iter, tar, key) {
      for (key of iter.keys()) {
        if (dequal(key, tar)) return key;
      }
    }
    function dequal(foo, bar) {
      var ctor, len, tmp;
      if (foo === bar) return true;
      if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
        if (ctor === Date) return foo.getTime() === bar.getTime();
        if (ctor === RegExp) return foo.toString() === bar.toString();
        if (ctor === Array) {
          if ((len = foo.length) === bar.length) {
            while (len-- && dequal(foo[len], bar[len])) ;
          }
          return len === -1;
        }
        if (ctor === Set) {
          if (foo.size !== bar.size) {
            return false;
          }
          for (len of foo) {
            tmp = len;
            if (tmp && typeof tmp === "object") {
              tmp = find2(bar, tmp);
              if (!tmp) return false;
            }
            if (!bar.has(tmp)) return false;
          }
          return true;
        }
        if (ctor === Map) {
          if (foo.size !== bar.size) {
            return false;
          }
          for (len of foo) {
            tmp = len[0];
            if (tmp && typeof tmp === "object") {
              tmp = find2(bar, tmp);
              if (!tmp) return false;
            }
            if (!dequal(len[1], bar.get(tmp))) {
              return false;
            }
          }
          return true;
        }
        if (ctor === ArrayBuffer) {
          foo = new Uint8Array(foo);
          bar = new Uint8Array(bar);
        } else if (ctor === DataView) {
          if ((len = foo.byteLength) === bar.byteLength) {
            while (len-- && foo.getInt8(len) === bar.getInt8(len)) ;
          }
          return len === -1;
        }
        if (ArrayBuffer.isView(foo)) {
          if ((len = foo.byteLength) === bar.byteLength) {
            while (len-- && foo[len] === bar[len]) ;
          }
          return len === -1;
        }
        if (!ctor || typeof foo === "object") {
          len = 0;
          for (ctor in foo) {
            if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
            if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
          }
          return Object.keys(bar).length === len;
        }
      }
      return foo !== foo && bar !== bar;
    }
    exports.dequal = dequal;
  }
});

// node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/assert.js
var require_assert = __commonJS({
  "node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/assert.js"(exports, module) {
    "use strict";
    var { dequal: deepEqual } = require_dist();
    var { getHttpError } = require_httpErrors();
    function assert(condition, code, message) {
      if (condition) return;
      throw getHttpError(code, message);
    }
    assert.ok = assert;
    assert.equal = function(a, b, code, message) {
      assert(a == b, code, message);
    };
    assert.notEqual = function(a, b, code, message) {
      assert(a != b, code, message);
    };
    assert.strictEqual = function(a, b, code, message) {
      assert(a === b, code, message);
    };
    assert.notStrictEqual = function(a, b, code, message) {
      assert(a !== b, code, message);
    };
    assert.deepEqual = function(a, b, code, message) {
      assert(deepEqual(a, b), code, message);
    };
    assert.notDeepEqual = function(a, b, code, message) {
      assert(!deepEqual(a, b), code, message);
    };
    module.exports = assert;
  }
});

// node_modules/.pnpm/vary@1.1.2/node_modules/vary/index.js
var require_vary = __commonJS({
  "node_modules/.pnpm/vary@1.1.2/node_modules/vary/index.js"(exports, module) {
    "use strict";
    module.exports = vary;
    module.exports.append = append;
    var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
    function append(header, field) {
      if (typeof header !== "string") {
        throw new TypeError("header argument is required");
      }
      if (!field) {
        throw new TypeError("field argument is required");
      }
      var fields = !Array.isArray(field) ? parse(String(field)) : field;
      for (var j = 0; j < fields.length; j++) {
        if (!FIELD_NAME_REGEXP.test(fields[j])) {
          throw new TypeError("field argument contains an invalid header name");
        }
      }
      if (header === "*") {
        return header;
      }
      var val = header;
      var vals = parse(header.toLowerCase());
      if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) {
        return "*";
      }
      for (var i = 0; i < fields.length; i++) {
        var fld = fields[i].toLowerCase();
        if (vals.indexOf(fld) === -1) {
          vals.push(fld);
          val = val ? val + ", " + fields[i] : fields[i];
        }
      }
      return val;
    }
    function parse(header) {
      var end = 0;
      var list = [];
      var start = 0;
      for (var i = 0, len = header.length; i < len; i++) {
        switch (header.charCodeAt(i)) {
          case 32:
            if (start === end) {
              start = end = i + 1;
            }
            break;
          case 44:
            list.push(header.substring(start, end));
            start = end = i + 1;
            break;
          default:
            end = i + 1;
            break;
        }
      }
      list.push(header.substring(start, end));
      return list;
    }
    function vary(res, field) {
      if (!res || !res.getHeader || !res.setHeader) {
        throw new TypeError("res argument is required");
      }
      var val = res.getHeader("Vary") || "";
      var header = Array.isArray(val) ? val.join(", ") : String(val);
      if (val = append(header, field)) {
        res.setHeader("Vary", val);
      }
    }
  }
});

// node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/vary.js
var require_vary2 = __commonJS({
  "node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/vary.js"(exports, module) {
    "use strict";
    var append = require_vary().append;
    function vary(field) {
      let value = this.getHeader("Vary") || "";
      const header = Array.isArray(value) ? value.join(", ") : String(value);
      value = append(header, field);
      this.header("Vary", value);
    }
    module.exports = vary;
    module.exports.append = append;
  }
});

// node_modules/.pnpm/@lukeed+ms@2.0.2/node_modules/@lukeed/ms/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/.pnpm/@lukeed+ms@2.0.2/node_modules/@lukeed/ms/dist/index.js"(exports) {
    var RGX = /^(-?(?:\d+)?\.?\d+) *(m(?:illiseconds?|s(?:ecs?)?))?(s(?:ec(?:onds?|s)?)?)?(m(?:in(?:utes?|s)?)?)?(h(?:ours?|rs?)?)?(d(?:ays?)?)?(w(?:eeks?|ks?)?)?(y(?:ears?|rs?)?)?$/;
    var SEC = 1e3;
    var MIN = SEC * 60;
    var HOUR = MIN * 60;
    var DAY = HOUR * 24;
    var YEAR = DAY * 365.25;
    function parse(val) {
      var num, arr = val.toLowerCase().match(RGX);
      if (arr != null && (num = parseFloat(arr[1]))) {
        if (arr[3] != null) return num * SEC;
        if (arr[4] != null) return num * MIN;
        if (arr[5] != null) return num * HOUR;
        if (arr[6] != null) return num * DAY;
        if (arr[7] != null) return num * DAY * 7;
        if (arr[8] != null) return num * YEAR;
        return num;
      }
    }
    function fmt(val, pfx, str, long) {
      var num = (val | 0) === val ? val : ~~(val + 0.5);
      return pfx + num + (long ? " " + str + (num != 1 ? "s" : "") : str[0]);
    }
    function format(num, long) {
      var pfx = num < 0 ? "-" : "", abs = num < 0 ? -num : num;
      if (abs < SEC) return num + (long ? " ms" : "ms");
      if (abs < MIN) return fmt(abs / SEC, pfx, "second", long);
      if (abs < HOUR) return fmt(abs / MIN, pfx, "minute", long);
      if (abs < DAY) return fmt(abs / HOUR, pfx, "hour", long);
      if (abs < YEAR) return fmt(abs / DAY, pfx, "day", long);
      return fmt(abs / YEAR, pfx, "year", long);
    }
    exports.format = format;
    exports.parse = parse;
  }
});

// node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/cache-control.js
var require_cache_control = __commonJS({
  "node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/lib/cache-control.js"(exports, module) {
    "use strict";
    var assert = __require("node:assert");
    var ms = require_dist2().parse;
    var validSingletimes = [
      "must-revalidate",
      "no-cache",
      "no-store",
      "no-transform",
      "public",
      "private",
      "proxy-revalidate",
      "immutable"
    ];
    var validMultitimes = [
      "max-age",
      "s-maxage",
      "stale-while-revalidate",
      "stale-if-error"
    ];
    function cacheControl(type, time) {
      const previoustime = this.getHeader("Cache-Control");
      if (time == null) {
        assert(validSingletimes.indexOf(type) !== -1, `Invalid Cache Control type: ${type}`);
        this.header("Cache-Control", previoustime ? `${previoustime}, ${type}` : type);
      } else {
        if (typeof time === "string") {
          time = ms(time) / 1e3;
        }
        assert(validMultitimes.indexOf(type) !== -1, `Invalid Cache Control type: ${type}`);
        assert(typeof time === "number", "The cache control time should be a number");
        this.header("Cache-Control", previoustime ? `${previoustime}, ${type}=${time}` : `${type}=${time}`);
      }
      return this;
    }
    function preventCache() {
      this.header("Cache-Control", "no-store, max-age=0, private").header("Pragma", "no-cache").header("Expires", 0);
      return this;
    }
    function maxAge(time) {
      return this.cacheControl("max-age", time);
    }
    function revalidate() {
      this.header("Cache-Control", "max-age=0, must-revalidate");
      return this;
    }
    function staticCache(time) {
      if (typeof time === "string") {
        time = ms(time) / 1e3;
      }
      assert(typeof time === "number", "The cache control time should be a number");
      this.header("Cache-Control", `public, max-age=${time}, immutable`);
      return this;
    }
    function stale(type, time) {
      if (type === "while-revalidate") {
        return this.cacheControl("stale-while-revalidate", time);
      } else if (type === "if-error") {
        return this.cacheControl("stale-if-error", time);
      } else {
        throw new Error(`Invalid cache control stale time ${time}`);
      }
    }
    module.exports = {
      cacheControl,
      preventCache,
      revalidate,
      staticCache,
      stale,
      maxAge
    };
  }
});

// node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/index.js
var require_sensible = __commonJS({
  "node_modules/.pnpm/@fastify+sensible@6.0.3/node_modules/@fastify/sensible/index.js"(exports, module) {
    "use strict";
    var fp = require_plugin();
    var forwarded = require_forwarded();
    var typeis = require_type_is();
    var httpErrors2 = require_httpErrors();
    var assert = require_assert();
    var vary = require_vary2();
    var cache = require_cache_control();
    function fastifySensible(fastify, opts, next) {
      fastify.decorate("httpErrors", httpErrors2);
      fastify.decorate("assert", assert);
      fastify.decorate("to", to);
      fastify.decorateRequest("forwarded", function() {
        return forwarded(this.raw);
      });
      fastify.decorateRequest("is", function(types) {
        return typeis(this.raw, Array.isArray(types) ? types : [types]);
      });
      fastify.decorateReply("vary", vary);
      fastify.decorateReply("cacheControl", cache.cacheControl);
      fastify.decorateReply("preventCache", cache.preventCache);
      fastify.decorateReply("revalidate", cache.revalidate);
      fastify.decorateReply("staticCache", cache.staticCache);
      fastify.decorateReply("stale", cache.stale);
      fastify.decorateReply("maxAge", cache.maxAge);
      const httpErrorsKeys = Object.keys(httpErrors2);
      for (let i = 0; i < httpErrorsKeys.length; ++i) {
        const httpError = httpErrorsKeys[i];
        switch (httpError) {
          case "HttpError":
            break;
          case "getHttpError":
            fastify.decorateReply("getHttpError", function(errorCode, message) {
              this.send(httpErrors2.getHttpError(errorCode, message));
              return this;
            });
            break;
          default:
            fastify.decorateReply(httpError, function(message) {
              this.send(httpErrors2[httpError](message));
              return this;
            });
        }
      }
      if (opts?.sharedSchemaId) {
        fastify.addSchema({
          $id: opts.sharedSchemaId,
          type: "object",
          properties: {
            statusCode: { type: "number" },
            code: { type: "string" },
            error: { type: "string" },
            message: { type: "string" }
          }
        });
      }
      function to(promise) {
        return promise.then((data) => [null, data], (err) => [err, void 0]);
      }
      next();
    }
    module.exports = fp(fastifySensible, {
      name: "@fastify/sensible",
      fastify: "5.x"
    });
    module.exports.default = fastifySensible;
    module.exports.fastifySensible = fastifySensible;
    module.exports.httpErrors = httpErrors2;
    module.exports.HttpError = httpErrors2.HttpError;
  }
});

// node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.min.js
var require_lodash_min = __commonJS({
  "node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.min.js"(exports, module) {
    (function() {
      function n(n2, t2, r2) {
        switch (r2.length) {
          case 0:
            return n2.call(t2);
          case 1:
            return n2.call(t2, r2[0]);
          case 2:
            return n2.call(t2, r2[0], r2[1]);
          case 3:
            return n2.call(t2, r2[0], r2[1], r2[2]);
        }
        return n2.apply(t2, r2);
      }
      function t(n2, t2, r2, e2) {
        for (var u2 = -1, i2 = null == n2 ? 0 : n2.length; ++u2 < i2; ) {
          var o2 = n2[u2];
          t2(e2, o2, r2(o2), n2);
        }
        return e2;
      }
      function r(n2, t2) {
        for (var r2 = -1, e2 = null == n2 ? 0 : n2.length; ++r2 < e2 && t2(n2[r2], r2, n2) !== false; ) ;
        return n2;
      }
      function e(n2, t2) {
        for (var r2 = null == n2 ? 0 : n2.length; r2-- && t2(n2[r2], r2, n2) !== false; ) ;
        return n2;
      }
      function u(n2, t2) {
        for (var r2 = -1, e2 = null == n2 ? 0 : n2.length; ++r2 < e2; ) if (!t2(n2[r2], r2, n2)) return false;
        return true;
      }
      function i(n2, t2) {
        for (var r2 = -1, e2 = null == n2 ? 0 : n2.length, u2 = 0, i2 = []; ++r2 < e2; ) {
          var o2 = n2[r2];
          t2(o2, r2, n2) && (i2[u2++] = o2);
        }
        return i2;
      }
      function o(n2, t2) {
        return !!(null == n2 ? 0 : n2.length) && y(n2, t2, 0) > -1;
      }
      function f(n2, t2, r2) {
        for (var e2 = -1, u2 = null == n2 ? 0 : n2.length; ++e2 < u2; ) if (r2(t2, n2[e2])) return true;
        return false;
      }
      function c(n2, t2) {
        for (var r2 = -1, e2 = null == n2 ? 0 : n2.length, u2 = Array(e2); ++r2 < e2; ) u2[r2] = t2(n2[r2], r2, n2);
        return u2;
      }
      function a(n2, t2) {
        for (var r2 = -1, e2 = t2.length, u2 = n2.length; ++r2 < e2; ) n2[u2 + r2] = t2[r2];
        return n2;
      }
      function l(n2, t2, r2, e2) {
        var u2 = -1, i2 = null == n2 ? 0 : n2.length;
        for (e2 && i2 && (r2 = n2[++u2]); ++u2 < i2; ) r2 = t2(r2, n2[u2], u2, n2);
        return r2;
      }
      function s(n2, t2, r2, e2) {
        var u2 = null == n2 ? 0 : n2.length;
        for (e2 && u2 && (r2 = n2[--u2]); u2--; ) r2 = t2(r2, n2[u2], u2, n2);
        return r2;
      }
      function h(n2, t2) {
        for (var r2 = -1, e2 = null == n2 ? 0 : n2.length; ++r2 < e2; ) if (t2(n2[r2], r2, n2)) return true;
        return false;
      }
      function p(n2) {
        return n2.split("");
      }
      function _(n2) {
        return n2.match($t) || [];
      }
      function v(n2, t2, r2) {
        var e2;
        return r2(n2, function(n3, r3, u2) {
          if (t2(n3, r3, u2)) return e2 = r3, false;
        }), e2;
      }
      function g(n2, t2, r2, e2) {
        for (var u2 = n2.length, i2 = r2 + (e2 ? 1 : -1); e2 ? i2-- : ++i2 < u2; ) if (t2(n2[i2], i2, n2)) return i2;
        return -1;
      }
      function y(n2, t2, r2) {
        return t2 === t2 ? Z(n2, t2, r2) : g(n2, b, r2);
      }
      function d(n2, t2, r2, e2) {
        for (var u2 = r2 - 1, i2 = n2.length; ++u2 < i2; ) if (e2(n2[u2], t2)) return u2;
        return -1;
      }
      function b(n2) {
        return n2 !== n2;
      }
      function w(n2, t2) {
        var r2 = null == n2 ? 0 : n2.length;
        return r2 ? k(n2, t2) / r2 : Cn;
      }
      function m(n2) {
        return function(t2) {
          return null == t2 ? X : t2[n2];
        };
      }
      function x(n2) {
        return function(t2) {
          return null == n2 ? X : n2[t2];
        };
      }
      function j(n2, t2, r2, e2, u2) {
        return u2(n2, function(n3, u3, i2) {
          r2 = e2 ? (e2 = false, n3) : t2(r2, n3, u3, i2);
        }), r2;
      }
      function A(n2, t2) {
        var r2 = n2.length;
        for (n2.sort(t2); r2--; ) n2[r2] = n2[r2].value;
        return n2;
      }
      function k(n2, t2) {
        for (var r2, e2 = -1, u2 = n2.length; ++e2 < u2; ) {
          var i2 = t2(n2[e2]);
          i2 !== X && (r2 = r2 === X ? i2 : r2 + i2);
        }
        return r2;
      }
      function O(n2, t2) {
        for (var r2 = -1, e2 = Array(n2); ++r2 < n2; ) e2[r2] = t2(r2);
        return e2;
      }
      function I(n2, t2) {
        return c(t2, function(t3) {
          return [t3, n2[t3]];
        });
      }
      function R(n2) {
        return n2 ? n2.slice(0, H(n2) + 1).replace(Lt, "") : n2;
      }
      function z(n2) {
        return function(t2) {
          return n2(t2);
        };
      }
      function E(n2, t2) {
        return c(t2, function(t3) {
          return n2[t3];
        });
      }
      function S(n2, t2) {
        return n2.has(t2);
      }
      function W(n2, t2) {
        for (var r2 = -1, e2 = n2.length; ++r2 < e2 && y(t2, n2[r2], 0) > -1; ) ;
        return r2;
      }
      function L(n2, t2) {
        for (var r2 = n2.length; r2-- && y(t2, n2[r2], 0) > -1; ) ;
        return r2;
      }
      function C(n2, t2) {
        for (var r2 = n2.length, e2 = 0; r2--; ) n2[r2] === t2 && ++e2;
        return e2;
      }
      function U(n2) {
        return "\\" + Yr[n2];
      }
      function B(n2, t2) {
        return null == n2 ? X : n2[t2];
      }
      function T(n2) {
        return Nr.test(n2);
      }
      function $(n2) {
        return Pr.test(n2);
      }
      function D(n2) {
        for (var t2, r2 = []; !(t2 = n2.next()).done; ) r2.push(t2.value);
        return r2;
      }
      function M(n2) {
        var t2 = -1, r2 = Array(n2.size);
        return n2.forEach(function(n3, e2) {
          r2[++t2] = [e2, n3];
        }), r2;
      }
      function F(n2, t2) {
        return function(r2) {
          return n2(t2(r2));
        };
      }
      function N(n2, t2) {
        for (var r2 = -1, e2 = n2.length, u2 = 0, i2 = []; ++r2 < e2; ) {
          var o2 = n2[r2];
          o2 !== t2 && o2 !== cn || (n2[r2] = cn, i2[u2++] = r2);
        }
        return i2;
      }
      function P(n2) {
        var t2 = -1, r2 = Array(n2.size);
        return n2.forEach(function(n3) {
          r2[++t2] = n3;
        }), r2;
      }
      function q(n2) {
        var t2 = -1, r2 = Array(n2.size);
        return n2.forEach(function(n3) {
          r2[++t2] = [n3, n3];
        }), r2;
      }
      function Z(n2, t2, r2) {
        for (var e2 = r2 - 1, u2 = n2.length; ++e2 < u2; ) if (n2[e2] === t2) return e2;
        return -1;
      }
      function K(n2, t2, r2) {
        for (var e2 = r2 + 1; e2--; ) if (n2[e2] === t2) return e2;
        return e2;
      }
      function V(n2) {
        return T(n2) ? J(n2) : _e(n2);
      }
      function G(n2) {
        return T(n2) ? Y(n2) : p(n2);
      }
      function H(n2) {
        for (var t2 = n2.length; t2-- && Ct.test(n2.charAt(t2)); ) ;
        return t2;
      }
      function J(n2) {
        for (var t2 = Mr.lastIndex = 0; Mr.test(n2); ) ++t2;
        return t2;
      }
      function Y(n2) {
        return n2.match(Mr) || [];
      }
      function Q(n2) {
        return n2.match(Fr) || [];
      }
      var X, nn = "4.17.21", tn = 200, rn = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", en = "Expected a function", un = "Invalid `variable` option passed into `_.template`", on = "__lodash_hash_undefined__", fn = 500, cn = "__lodash_placeholder__", an = 1, ln = 2, sn = 4, hn = 1, pn = 2, _n = 1, vn = 2, gn = 4, yn = 8, dn = 16, bn = 32, wn = 64, mn = 128, xn = 256, jn = 512, An = 30, kn = "...", On = 800, In = 16, Rn = 1, zn = 2, En = 3, Sn = 1 / 0, Wn = 9007199254740991, Ln = 17976931348623157e292, Cn = NaN, Un = 4294967295, Bn = Un - 1, Tn = Un >>> 1, $n = [["ary", mn], ["bind", _n], ["bindKey", vn], ["curry", yn], ["curryRight", dn], ["flip", jn], ["partial", bn], ["partialRight", wn], ["rearg", xn]], Dn = "[object Arguments]", Mn = "[object Array]", Fn = "[object AsyncFunction]", Nn = "[object Boolean]", Pn = "[object Date]", qn = "[object DOMException]", Zn = "[object Error]", Kn = "[object Function]", Vn = "[object GeneratorFunction]", Gn = "[object Map]", Hn = "[object Number]", Jn = "[object Null]", Yn = "[object Object]", Qn = "[object Promise]", Xn = "[object Proxy]", nt = "[object RegExp]", tt = "[object Set]", rt = "[object String]", et = "[object Symbol]", ut = "[object Undefined]", it = "[object WeakMap]", ot = "[object WeakSet]", ft = "[object ArrayBuffer]", ct = "[object DataView]", at = "[object Float32Array]", lt = "[object Float64Array]", st = "[object Int8Array]", ht = "[object Int16Array]", pt = "[object Int32Array]", _t = "[object Uint8Array]", vt = "[object Uint8ClampedArray]", gt = "[object Uint16Array]", yt = "[object Uint32Array]", dt = /\b__p \+= '';/g, bt = /\b(__p \+=) '' \+/g, wt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, mt = /&(?:amp|lt|gt|quot|#39);/g, xt = /[&<>"']/g, jt = RegExp(mt.source), At = RegExp(xt.source), kt = /<%-([\s\S]+?)%>/g, Ot = /<%([\s\S]+?)%>/g, It = /<%=([\s\S]+?)%>/g, Rt = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, zt = /^\w*$/, Et = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, St = /[\\^$.*+?()[\]{}|]/g, Wt = RegExp(St.source), Lt = /^\s+/, Ct = /\s/, Ut = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Bt = /\{\n\/\* \[wrapped with (.+)\] \*/, Tt = /,? & /, $t = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, Dt = /[()=,{}\[\]\/\s]/, Mt = /\\(\\)?/g, Ft = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Nt = /\w*$/, Pt = /^[-+]0x[0-9a-f]+$/i, qt = /^0b[01]+$/i, Zt = /^\[object .+?Constructor\]$/, Kt = /^0o[0-7]+$/i, Vt = /^(?:0|[1-9]\d*)$/, Gt = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Ht = /($^)/, Jt = /['\n\r\u2028\u2029\\]/g, Yt = "\\ud800-\\udfff", Qt = "\\u0300-\\u036f", Xt = "\\ufe20-\\ufe2f", nr = "\\u20d0-\\u20ff", tr = Qt + Xt + nr, rr = "\\u2700-\\u27bf", er = "a-z\\xdf-\\xf6\\xf8-\\xff", ur = "\\xac\\xb1\\xd7\\xf7", ir = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", or = "\\u2000-\\u206f", fr = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", cr = "A-Z\\xc0-\\xd6\\xd8-\\xde", ar = "\\ufe0e\\ufe0f", lr = ur + ir + or + fr, sr = "['\u2019]", hr = "[" + Yt + "]", pr = "[" + lr + "]", _r = "[" + tr + "]", vr = "\\d+", gr = "[" + rr + "]", yr = "[" + er + "]", dr = "[^" + Yt + lr + vr + rr + er + cr + "]", br = "\\ud83c[\\udffb-\\udfff]", wr = "(?:" + _r + "|" + br + ")", mr = "[^" + Yt + "]", xr = "(?:\\ud83c[\\udde6-\\uddff]){2}", jr = "[\\ud800-\\udbff][\\udc00-\\udfff]", Ar = "[" + cr + "]", kr = "\\u200d", Or = "(?:" + yr + "|" + dr + ")", Ir = "(?:" + Ar + "|" + dr + ")", Rr = "(?:" + sr + "(?:d|ll|m|re|s|t|ve))?", zr = "(?:" + sr + "(?:D|LL|M|RE|S|T|VE))?", Er = wr + "?", Sr = "[" + ar + "]?", Wr = "(?:" + kr + "(?:" + [mr, xr, jr].join("|") + ")" + Sr + Er + ")*", Lr = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Cr = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Ur = Sr + Er + Wr, Br = "(?:" + [gr, xr, jr].join("|") + ")" + Ur, Tr = "(?:" + [mr + _r + "?", _r, xr, jr, hr].join("|") + ")", $r = RegExp(sr, "g"), Dr = RegExp(_r, "g"), Mr = RegExp(br + "(?=" + br + ")|" + Tr + Ur, "g"), Fr = RegExp([Ar + "?" + yr + "+" + Rr + "(?=" + [pr, Ar, "$"].join("|") + ")", Ir + "+" + zr + "(?=" + [pr, Ar + Or, "$"].join("|") + ")", Ar + "?" + Or + "+" + Rr, Ar + "+" + zr, Cr, Lr, vr, Br].join("|"), "g"), Nr = RegExp("[" + kr + Yt + tr + ar + "]"), Pr = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, qr = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Zr = -1, Kr = {};
      Kr[at] = Kr[lt] = Kr[st] = Kr[ht] = Kr[pt] = Kr[_t] = Kr[vt] = Kr[gt] = Kr[yt] = true, Kr[Dn] = Kr[Mn] = Kr[ft] = Kr[Nn] = Kr[ct] = Kr[Pn] = Kr[Zn] = Kr[Kn] = Kr[Gn] = Kr[Hn] = Kr[Yn] = Kr[nt] = Kr[tt] = Kr[rt] = Kr[it] = false;
      var Vr = {};
      Vr[Dn] = Vr[Mn] = Vr[ft] = Vr[ct] = Vr[Nn] = Vr[Pn] = Vr[at] = Vr[lt] = Vr[st] = Vr[ht] = Vr[pt] = Vr[Gn] = Vr[Hn] = Vr[Yn] = Vr[nt] = Vr[tt] = Vr[rt] = Vr[et] = Vr[_t] = Vr[vt] = Vr[gt] = Vr[yt] = true, Vr[Zn] = Vr[Kn] = Vr[it] = false;
      var Gr = {
        "\xC0": "A",
        "\xC1": "A",
        "\xC2": "A",
        "\xC3": "A",
        "\xC4": "A",
        "\xC5": "A",
        "\xE0": "a",
        "\xE1": "a",
        "\xE2": "a",
        "\xE3": "a",
        "\xE4": "a",
        "\xE5": "a",
        "\xC7": "C",
        "\xE7": "c",
        "\xD0": "D",
        "\xF0": "d",
        "\xC8": "E",
        "\xC9": "E",
        "\xCA": "E",
        "\xCB": "E",
        "\xE8": "e",
        "\xE9": "e",
        "\xEA": "e",
        "\xEB": "e",
        "\xCC": "I",
        "\xCD": "I",
        "\xCE": "I",
        "\xCF": "I",
        "\xEC": "i",
        "\xED": "i",
        "\xEE": "i",
        "\xEF": "i",
        "\xD1": "N",
        "\xF1": "n",
        "\xD2": "O",
        "\xD3": "O",
        "\xD4": "O",
        "\xD5": "O",
        "\xD6": "O",
        "\xD8": "O",
        "\xF2": "o",
        "\xF3": "o",
        "\xF4": "o",
        "\xF5": "o",
        "\xF6": "o",
        "\xF8": "o",
        "\xD9": "U",
        "\xDA": "U",
        "\xDB": "U",
        "\xDC": "U",
        "\xF9": "u",
        "\xFA": "u",
        "\xFB": "u",
        "\xFC": "u",
        "\xDD": "Y",
        "\xFD": "y",
        "\xFF": "y",
        "\xC6": "Ae",
        "\xE6": "ae",
        "\xDE": "Th",
        "\xFE": "th",
        "\xDF": "ss",
        "\u0100": "A",
        "\u0102": "A",
        "\u0104": "A",
        "\u0101": "a",
        "\u0103": "a",
        "\u0105": "a",
        "\u0106": "C",
        "\u0108": "C",
        "\u010A": "C",
        "\u010C": "C",
        "\u0107": "c",
        "\u0109": "c",
        "\u010B": "c",
        "\u010D": "c",
        "\u010E": "D",
        "\u0110": "D",
        "\u010F": "d",
        "\u0111": "d",
        "\u0112": "E",
        "\u0114": "E",
        "\u0116": "E",
        "\u0118": "E",
        "\u011A": "E",
        "\u0113": "e",
        "\u0115": "e",
        "\u0117": "e",
        "\u0119": "e",
        "\u011B": "e",
        "\u011C": "G",
        "\u011E": "G",
        "\u0120": "G",
        "\u0122": "G",
        "\u011D": "g",
        "\u011F": "g",
        "\u0121": "g",
        "\u0123": "g",
        "\u0124": "H",
        "\u0126": "H",
        "\u0125": "h",
        "\u0127": "h",
        "\u0128": "I",
        "\u012A": "I",
        "\u012C": "I",
        "\u012E": "I",
        "\u0130": "I",
        "\u0129": "i",
        "\u012B": "i",
        "\u012D": "i",
        "\u012F": "i",
        "\u0131": "i",
        "\u0134": "J",
        "\u0135": "j",
        "\u0136": "K",
        "\u0137": "k",
        "\u0138": "k",
        "\u0139": "L",
        "\u013B": "L",
        "\u013D": "L",
        "\u013F": "L",
        "\u0141": "L",
        "\u013A": "l",
        "\u013C": "l",
        "\u013E": "l",
        "\u0140": "l",
        "\u0142": "l",
        "\u0143": "N",
        "\u0145": "N",
        "\u0147": "N",
        "\u014A": "N",
        "\u0144": "n",
        "\u0146": "n",
        "\u0148": "n",
        "\u014B": "n",
        "\u014C": "O",
        "\u014E": "O",
        "\u0150": "O",
        "\u014D": "o",
        "\u014F": "o",
        "\u0151": "o",
        "\u0154": "R",
        "\u0156": "R",
        "\u0158": "R",
        "\u0155": "r",
        "\u0157": "r",
        "\u0159": "r",
        "\u015A": "S",
        "\u015C": "S",
        "\u015E": "S",
        "\u0160": "S",
        "\u015B": "s",
        "\u015D": "s",
        "\u015F": "s",
        "\u0161": "s",
        "\u0162": "T",
        "\u0164": "T",
        "\u0166": "T",
        "\u0163": "t",
        "\u0165": "t",
        "\u0167": "t",
        "\u0168": "U",
        "\u016A": "U",
        "\u016C": "U",
        "\u016E": "U",
        "\u0170": "U",
        "\u0172": "U",
        "\u0169": "u",
        "\u016B": "u",
        "\u016D": "u",
        "\u016F": "u",
        "\u0171": "u",
        "\u0173": "u",
        "\u0174": "W",
        "\u0175": "w",
        "\u0176": "Y",
        "\u0177": "y",
        "\u0178": "Y",
        "\u0179": "Z",
        "\u017B": "Z",
        "\u017D": "Z",
        "\u017A": "z",
        "\u017C": "z",
        "\u017E": "z",
        "\u0132": "IJ",
        "\u0133": "ij",
        "\u0152": "Oe",
        "\u0153": "oe",
        "\u0149": "'n",
        "\u017F": "s"
      }, Hr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Jr = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }, Yr = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }, Qr = parseFloat, Xr = parseInt, ne = "object" == typeof global && global && global.Object === Object && global, te = "object" == typeof self && self && self.Object === Object && self, re = ne || te || Function("return this")(), ee = "object" == typeof exports && exports && !exports.nodeType && exports, ue = ee && "object" == typeof module && module && !module.nodeType && module, ie = ue && ue.exports === ee, oe = ie && ne.process, fe = function() {
        try {
          var n2 = ue && ue.require && ue.require("util").types;
          return n2 ? n2 : oe && oe.binding && oe.binding("util");
        } catch (n3) {
        }
      }(), ce = fe && fe.isArrayBuffer, ae = fe && fe.isDate, le = fe && fe.isMap, se = fe && fe.isRegExp, he = fe && fe.isSet, pe = fe && fe.isTypedArray, _e = m("length"), ve = x(Gr), ge = x(Hr), ye = x(Jr), de = function p2(x2) {
        function Z2(n2) {
          if (cc(n2) && !bh(n2) && !(n2 instanceof Ct2)) {
            if (n2 instanceof Y2) return n2;
            if (bl.call(n2, "__wrapped__")) return eo(n2);
          }
          return new Y2(n2);
        }
        function J2() {
        }
        function Y2(n2, t2) {
          this.__wrapped__ = n2, this.__actions__ = [], this.__chain__ = !!t2, this.__index__ = 0, this.__values__ = X;
        }
        function Ct2(n2) {
          this.__wrapped__ = n2, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = Un, this.__views__ = [];
        }
        function $t2() {
          var n2 = new Ct2(this.__wrapped__);
          return n2.__actions__ = Tu(this.__actions__), n2.__dir__ = this.__dir__, n2.__filtered__ = this.__filtered__, n2.__iteratees__ = Tu(this.__iteratees__), n2.__takeCount__ = this.__takeCount__, n2.__views__ = Tu(this.__views__), n2;
        }
        function Yt2() {
          if (this.__filtered__) {
            var n2 = new Ct2(this);
            n2.__dir__ = -1, n2.__filtered__ = true;
          } else n2 = this.clone(), n2.__dir__ *= -1;
          return n2;
        }
        function Qt2() {
          var n2 = this.__wrapped__.value(), t2 = this.__dir__, r2 = bh(n2), e2 = t2 < 0, u2 = r2 ? n2.length : 0, i2 = Oi(0, u2, this.__views__), o2 = i2.start, f2 = i2.end, c2 = f2 - o2, a2 = e2 ? f2 : o2 - 1, l2 = this.__iteratees__, s2 = l2.length, h2 = 0, p3 = Hl(c2, this.__takeCount__);
          if (!r2 || !e2 && u2 == c2 && p3 == c2) return wu(n2, this.__actions__);
          var _2 = [];
          n: for (; c2-- && h2 < p3; ) {
            a2 += t2;
            for (var v2 = -1, g2 = n2[a2]; ++v2 < s2; ) {
              var y2 = l2[v2], d2 = y2.iteratee, b2 = y2.type, w2 = d2(g2);
              if (b2 == zn) g2 = w2;
              else if (!w2) {
                if (b2 == Rn) continue n;
                break n;
              }
            }
            _2[h2++] = g2;
          }
          return _2;
        }
        function Xt2(n2) {
          var t2 = -1, r2 = null == n2 ? 0 : n2.length;
          for (this.clear(); ++t2 < r2; ) {
            var e2 = n2[t2];
            this.set(e2[0], e2[1]);
          }
        }
        function nr2() {
          this.__data__ = is ? is(null) : {}, this.size = 0;
        }
        function tr2(n2) {
          var t2 = this.has(n2) && delete this.__data__[n2];
          return this.size -= t2 ? 1 : 0, t2;
        }
        function rr2(n2) {
          var t2 = this.__data__;
          if (is) {
            var r2 = t2[n2];
            return r2 === on ? X : r2;
          }
          return bl.call(t2, n2) ? t2[n2] : X;
        }
        function er2(n2) {
          var t2 = this.__data__;
          return is ? t2[n2] !== X : bl.call(t2, n2);
        }
        function ur2(n2, t2) {
          var r2 = this.__data__;
          return this.size += this.has(n2) ? 0 : 1, r2[n2] = is && t2 === X ? on : t2, this;
        }
        function ir2(n2) {
          var t2 = -1, r2 = null == n2 ? 0 : n2.length;
          for (this.clear(); ++t2 < r2; ) {
            var e2 = n2[t2];
            this.set(e2[0], e2[1]);
          }
        }
        function or2() {
          this.__data__ = [], this.size = 0;
        }
        function fr2(n2) {
          var t2 = this.__data__, r2 = Wr2(t2, n2);
          return !(r2 < 0) && (r2 == t2.length - 1 ? t2.pop() : Ll.call(t2, r2, 1), --this.size, true);
        }
        function cr2(n2) {
          var t2 = this.__data__, r2 = Wr2(t2, n2);
          return r2 < 0 ? X : t2[r2][1];
        }
        function ar2(n2) {
          return Wr2(this.__data__, n2) > -1;
        }
        function lr2(n2, t2) {
          var r2 = this.__data__, e2 = Wr2(r2, n2);
          return e2 < 0 ? (++this.size, r2.push([n2, t2])) : r2[e2][1] = t2, this;
        }
        function sr2(n2) {
          var t2 = -1, r2 = null == n2 ? 0 : n2.length;
          for (this.clear(); ++t2 < r2; ) {
            var e2 = n2[t2];
            this.set(e2[0], e2[1]);
          }
        }
        function hr2() {
          this.size = 0, this.__data__ = { hash: new Xt2(), map: new (ts || ir2)(), string: new Xt2() };
        }
        function pr2(n2) {
          var t2 = xi(this, n2).delete(n2);
          return this.size -= t2 ? 1 : 0, t2;
        }
        function _r2(n2) {
          return xi(this, n2).get(n2);
        }
        function vr2(n2) {
          return xi(this, n2).has(n2);
        }
        function gr2(n2, t2) {
          var r2 = xi(this, n2), e2 = r2.size;
          return r2.set(n2, t2), this.size += r2.size == e2 ? 0 : 1, this;
        }
        function yr2(n2) {
          var t2 = -1, r2 = null == n2 ? 0 : n2.length;
          for (this.__data__ = new sr2(); ++t2 < r2; ) this.add(n2[t2]);
        }
        function dr2(n2) {
          return this.__data__.set(n2, on), this;
        }
        function br2(n2) {
          return this.__data__.has(n2);
        }
        function wr2(n2) {
          this.size = (this.__data__ = new ir2(n2)).size;
        }
        function mr2() {
          this.__data__ = new ir2(), this.size = 0;
        }
        function xr2(n2) {
          var t2 = this.__data__, r2 = t2.delete(n2);
          return this.size = t2.size, r2;
        }
        function jr2(n2) {
          return this.__data__.get(n2);
        }
        function Ar2(n2) {
          return this.__data__.has(n2);
        }
        function kr2(n2, t2) {
          var r2 = this.__data__;
          if (r2 instanceof ir2) {
            var e2 = r2.__data__;
            if (!ts || e2.length < tn - 1) return e2.push([n2, t2]), this.size = ++r2.size, this;
            r2 = this.__data__ = new sr2(e2);
          }
          return r2.set(n2, t2), this.size = r2.size, this;
        }
        function Or2(n2, t2) {
          var r2 = bh(n2), e2 = !r2 && dh(n2), u2 = !r2 && !e2 && mh(n2), i2 = !r2 && !e2 && !u2 && Oh(n2), o2 = r2 || e2 || u2 || i2, f2 = o2 ? O(n2.length, hl) : [], c2 = f2.length;
          for (var a2 in n2) !t2 && !bl.call(n2, a2) || o2 && ("length" == a2 || u2 && ("offset" == a2 || "parent" == a2) || i2 && ("buffer" == a2 || "byteLength" == a2 || "byteOffset" == a2) || Ci(a2, c2)) || f2.push(a2);
          return f2;
        }
        function Ir2(n2) {
          var t2 = n2.length;
          return t2 ? n2[tu(0, t2 - 1)] : X;
        }
        function Rr2(n2, t2) {
          return Xi(Tu(n2), Mr2(t2, 0, n2.length));
        }
        function zr2(n2) {
          return Xi(Tu(n2));
        }
        function Er2(n2, t2, r2) {
          (r2 === X || Gf(n2[t2], r2)) && (r2 !== X || t2 in n2) || Br2(n2, t2, r2);
        }
        function Sr2(n2, t2, r2) {
          var e2 = n2[t2];
          bl.call(n2, t2) && Gf(e2, r2) && (r2 !== X || t2 in n2) || Br2(n2, t2, r2);
        }
        function Wr2(n2, t2) {
          for (var r2 = n2.length; r2--; ) if (Gf(n2[r2][0], t2)) return r2;
          return -1;
        }
        function Lr2(n2, t2, r2, e2) {
          return ys(n2, function(n3, u2, i2) {
            t2(e2, n3, r2(n3), i2);
          }), e2;
        }
        function Cr2(n2, t2) {
          return n2 && $u(t2, Pc(t2), n2);
        }
        function Ur2(n2, t2) {
          return n2 && $u(t2, qc(t2), n2);
        }
        function Br2(n2, t2, r2) {
          "__proto__" == t2 && Tl ? Tl(n2, t2, { configurable: true, enumerable: true, value: r2, writable: true }) : n2[t2] = r2;
        }
        function Tr2(n2, t2) {
          for (var r2 = -1, e2 = t2.length, u2 = il(e2), i2 = null == n2; ++r2 < e2; ) u2[r2] = i2 ? X : Mc(n2, t2[r2]);
          return u2;
        }
        function Mr2(n2, t2, r2) {
          return n2 === n2 && (r2 !== X && (n2 = n2 <= r2 ? n2 : r2), t2 !== X && (n2 = n2 >= t2 ? n2 : t2)), n2;
        }
        function Fr2(n2, t2, e2, u2, i2, o2) {
          var f2, c2 = t2 & an, a2 = t2 & ln, l2 = t2 & sn;
          if (e2 && (f2 = i2 ? e2(n2, u2, i2, o2) : e2(n2)), f2 !== X) return f2;
          if (!fc(n2)) return n2;
          var s2 = bh(n2);
          if (s2) {
            if (f2 = zi(n2), !c2) return Tu(n2, f2);
          } else {
            var h2 = zs(n2), p3 = h2 == Kn || h2 == Vn;
            if (mh(n2)) return Iu(n2, c2);
            if (h2 == Yn || h2 == Dn || p3 && !i2) {
              if (f2 = a2 || p3 ? {} : Ei(n2), !c2) return a2 ? Mu(n2, Ur2(f2, n2)) : Du(n2, Cr2(f2, n2));
            } else {
              if (!Vr[h2]) return i2 ? n2 : {};
              f2 = Si(n2, h2, c2);
            }
          }
          o2 || (o2 = new wr2());
          var _2 = o2.get(n2);
          if (_2) return _2;
          o2.set(n2, f2), kh(n2) ? n2.forEach(function(r2) {
            f2.add(Fr2(r2, t2, e2, r2, n2, o2));
          }) : jh(n2) && n2.forEach(function(r2, u3) {
            f2.set(u3, Fr2(r2, t2, e2, u3, n2, o2));
          });
          var v2 = l2 ? a2 ? di : yi : a2 ? qc : Pc, g2 = s2 ? X : v2(n2);
          return r(g2 || n2, function(r2, u3) {
            g2 && (u3 = r2, r2 = n2[u3]), Sr2(f2, u3, Fr2(r2, t2, e2, u3, n2, o2));
          }), f2;
        }
        function Nr2(n2) {
          var t2 = Pc(n2);
          return function(r2) {
            return Pr2(r2, n2, t2);
          };
        }
        function Pr2(n2, t2, r2) {
          var e2 = r2.length;
          if (null == n2) return !e2;
          for (n2 = ll(n2); e2--; ) {
            var u2 = r2[e2], i2 = t2[u2], o2 = n2[u2];
            if (o2 === X && !(u2 in n2) || !i2(o2)) return false;
          }
          return true;
        }
        function Gr2(n2, t2, r2) {
          if ("function" != typeof n2) throw new pl(en);
          return Ws(function() {
            n2.apply(X, r2);
          }, t2);
        }
        function Hr2(n2, t2, r2, e2) {
          var u2 = -1, i2 = o, a2 = true, l2 = n2.length, s2 = [], h2 = t2.length;
          if (!l2) return s2;
          r2 && (t2 = c(t2, z(r2))), e2 ? (i2 = f, a2 = false) : t2.length >= tn && (i2 = S, a2 = false, t2 = new yr2(t2));
          n: for (; ++u2 < l2; ) {
            var p3 = n2[u2], _2 = null == r2 ? p3 : r2(p3);
            if (p3 = e2 || 0 !== p3 ? p3 : 0, a2 && _2 === _2) {
              for (var v2 = h2; v2--; ) if (t2[v2] === _2) continue n;
              s2.push(p3);
            } else i2(t2, _2, e2) || s2.push(p3);
          }
          return s2;
        }
        function Jr2(n2, t2) {
          var r2 = true;
          return ys(n2, function(n3, e2, u2) {
            return r2 = !!t2(n3, e2, u2);
          }), r2;
        }
        function Yr2(n2, t2, r2) {
          for (var e2 = -1, u2 = n2.length; ++e2 < u2; ) {
            var i2 = n2[e2], o2 = t2(i2);
            if (null != o2 && (f2 === X ? o2 === o2 && !bc(o2) : r2(o2, f2))) var f2 = o2, c2 = i2;
          }
          return c2;
        }
        function ne2(n2, t2, r2, e2) {
          var u2 = n2.length;
          for (r2 = kc(r2), r2 < 0 && (r2 = -r2 > u2 ? 0 : u2 + r2), e2 = e2 === X || e2 > u2 ? u2 : kc(e2), e2 < 0 && (e2 += u2), e2 = r2 > e2 ? 0 : Oc(e2); r2 < e2; ) n2[r2++] = t2;
          return n2;
        }
        function te2(n2, t2) {
          var r2 = [];
          return ys(n2, function(n3, e2, u2) {
            t2(n3, e2, u2) && r2.push(n3);
          }), r2;
        }
        function ee2(n2, t2, r2, e2, u2) {
          var i2 = -1, o2 = n2.length;
          for (r2 || (r2 = Li), u2 || (u2 = []); ++i2 < o2; ) {
            var f2 = n2[i2];
            t2 > 0 && r2(f2) ? t2 > 1 ? ee2(f2, t2 - 1, r2, e2, u2) : a(u2, f2) : e2 || (u2[u2.length] = f2);
          }
          return u2;
        }
        function ue2(n2, t2) {
          return n2 && bs(n2, t2, Pc);
        }
        function oe2(n2, t2) {
          return n2 && ws(n2, t2, Pc);
        }
        function fe2(n2, t2) {
          return i(t2, function(t3) {
            return uc(n2[t3]);
          });
        }
        function _e2(n2, t2) {
          t2 = ku(t2, n2);
          for (var r2 = 0, e2 = t2.length; null != n2 && r2 < e2; ) n2 = n2[no(t2[r2++])];
          return r2 && r2 == e2 ? n2 : X;
        }
        function de2(n2, t2, r2) {
          var e2 = t2(n2);
          return bh(n2) ? e2 : a(e2, r2(n2));
        }
        function we(n2) {
          return null == n2 ? n2 === X ? ut : Jn : Bl && Bl in ll(n2) ? ki(n2) : Ki(n2);
        }
        function me(n2, t2) {
          return n2 > t2;
        }
        function xe(n2, t2) {
          return null != n2 && bl.call(n2, t2);
        }
        function je(n2, t2) {
          return null != n2 && t2 in ll(n2);
        }
        function Ae(n2, t2, r2) {
          return n2 >= Hl(t2, r2) && n2 < Gl(t2, r2);
        }
        function ke(n2, t2, r2) {
          for (var e2 = r2 ? f : o, u2 = n2[0].length, i2 = n2.length, a2 = i2, l2 = il(i2), s2 = 1 / 0, h2 = []; a2--; ) {
            var p3 = n2[a2];
            a2 && t2 && (p3 = c(p3, z(t2))), s2 = Hl(p3.length, s2), l2[a2] = !r2 && (t2 || u2 >= 120 && p3.length >= 120) ? new yr2(a2 && p3) : X;
          }
          p3 = n2[0];
          var _2 = -1, v2 = l2[0];
          n: for (; ++_2 < u2 && h2.length < s2; ) {
            var g2 = p3[_2], y2 = t2 ? t2(g2) : g2;
            if (g2 = r2 || 0 !== g2 ? g2 : 0, !(v2 ? S(v2, y2) : e2(h2, y2, r2))) {
              for (a2 = i2; --a2; ) {
                var d2 = l2[a2];
                if (!(d2 ? S(d2, y2) : e2(n2[a2], y2, r2))) continue n;
              }
              v2 && v2.push(y2), h2.push(g2);
            }
          }
          return h2;
        }
        function Oe(n2, t2, r2, e2) {
          return ue2(n2, function(n3, u2, i2) {
            t2(e2, r2(n3), u2, i2);
          }), e2;
        }
        function Ie(t2, r2, e2) {
          r2 = ku(r2, t2), t2 = Gi(t2, r2);
          var u2 = null == t2 ? t2 : t2[no(jo(r2))];
          return null == u2 ? X : n(u2, t2, e2);
        }
        function Re(n2) {
          return cc(n2) && we(n2) == Dn;
        }
        function ze(n2) {
          return cc(n2) && we(n2) == ft;
        }
        function Ee(n2) {
          return cc(n2) && we(n2) == Pn;
        }
        function Se(n2, t2, r2, e2, u2) {
          return n2 === t2 || (null == n2 || null == t2 || !cc(n2) && !cc(t2) ? n2 !== n2 && t2 !== t2 : We(n2, t2, r2, e2, Se, u2));
        }
        function We(n2, t2, r2, e2, u2, i2) {
          var o2 = bh(n2), f2 = bh(t2), c2 = o2 ? Mn : zs(n2), a2 = f2 ? Mn : zs(t2);
          c2 = c2 == Dn ? Yn : c2, a2 = a2 == Dn ? Yn : a2;
          var l2 = c2 == Yn, s2 = a2 == Yn, h2 = c2 == a2;
          if (h2 && mh(n2)) {
            if (!mh(t2)) return false;
            o2 = true, l2 = false;
          }
          if (h2 && !l2) return i2 || (i2 = new wr2()), o2 || Oh(n2) ? pi(n2, t2, r2, e2, u2, i2) : _i(n2, t2, c2, r2, e2, u2, i2);
          if (!(r2 & hn)) {
            var p3 = l2 && bl.call(n2, "__wrapped__"), _2 = s2 && bl.call(t2, "__wrapped__");
            if (p3 || _2) {
              var v2 = p3 ? n2.value() : n2, g2 = _2 ? t2.value() : t2;
              return i2 || (i2 = new wr2()), u2(v2, g2, r2, e2, i2);
            }
          }
          return !!h2 && (i2 || (i2 = new wr2()), vi(n2, t2, r2, e2, u2, i2));
        }
        function Le(n2) {
          return cc(n2) && zs(n2) == Gn;
        }
        function Ce(n2, t2, r2, e2) {
          var u2 = r2.length, i2 = u2, o2 = !e2;
          if (null == n2) return !i2;
          for (n2 = ll(n2); u2--; ) {
            var f2 = r2[u2];
            if (o2 && f2[2] ? f2[1] !== n2[f2[0]] : !(f2[0] in n2)) return false;
          }
          for (; ++u2 < i2; ) {
            f2 = r2[u2];
            var c2 = f2[0], a2 = n2[c2], l2 = f2[1];
            if (o2 && f2[2]) {
              if (a2 === X && !(c2 in n2)) return false;
            } else {
              var s2 = new wr2();
              if (e2) var h2 = e2(a2, l2, c2, n2, t2, s2);
              if (!(h2 === X ? Se(l2, a2, hn | pn, e2, s2) : h2)) return false;
            }
          }
          return true;
        }
        function Ue(n2) {
          return !(!fc(n2) || Di(n2)) && (uc(n2) ? kl : Zt).test(to(n2));
        }
        function Be(n2) {
          return cc(n2) && we(n2) == nt;
        }
        function Te(n2) {
          return cc(n2) && zs(n2) == tt;
        }
        function $e(n2) {
          return cc(n2) && oc(n2.length) && !!Kr[we(n2)];
        }
        function De(n2) {
          return "function" == typeof n2 ? n2 : null == n2 ? La : "object" == typeof n2 ? bh(n2) ? Ze(n2[0], n2[1]) : qe(n2) : Fa(n2);
        }
        function Me(n2) {
          if (!Mi(n2)) return Vl(n2);
          var t2 = [];
          for (var r2 in ll(n2)) bl.call(n2, r2) && "constructor" != r2 && t2.push(r2);
          return t2;
        }
        function Fe(n2) {
          if (!fc(n2)) return Zi(n2);
          var t2 = Mi(n2), r2 = [];
          for (var e2 in n2) ("constructor" != e2 || !t2 && bl.call(n2, e2)) && r2.push(e2);
          return r2;
        }
        function Ne(n2, t2) {
          return n2 < t2;
        }
        function Pe(n2, t2) {
          var r2 = -1, e2 = Hf(n2) ? il(n2.length) : [];
          return ys(n2, function(n3, u2, i2) {
            e2[++r2] = t2(n3, u2, i2);
          }), e2;
        }
        function qe(n2) {
          var t2 = ji(n2);
          return 1 == t2.length && t2[0][2] ? Ni(t2[0][0], t2[0][1]) : function(r2) {
            return r2 === n2 || Ce(r2, n2, t2);
          };
        }
        function Ze(n2, t2) {
          return Bi(n2) && Fi(t2) ? Ni(no(n2), t2) : function(r2) {
            var e2 = Mc(r2, n2);
            return e2 === X && e2 === t2 ? Nc(r2, n2) : Se(t2, e2, hn | pn);
          };
        }
        function Ke(n2, t2, r2, e2, u2) {
          n2 !== t2 && bs(t2, function(i2, o2) {
            if (u2 || (u2 = new wr2()), fc(i2)) Ve(n2, t2, o2, r2, Ke, e2, u2);
            else {
              var f2 = e2 ? e2(Ji(n2, o2), i2, o2 + "", n2, t2, u2) : X;
              f2 === X && (f2 = i2), Er2(n2, o2, f2);
            }
          }, qc);
        }
        function Ve(n2, t2, r2, e2, u2, i2, o2) {
          var f2 = Ji(n2, r2), c2 = Ji(t2, r2), a2 = o2.get(c2);
          if (a2) return Er2(n2, r2, a2), X;
          var l2 = i2 ? i2(f2, c2, r2 + "", n2, t2, o2) : X, s2 = l2 === X;
          if (s2) {
            var h2 = bh(c2), p3 = !h2 && mh(c2), _2 = !h2 && !p3 && Oh(c2);
            l2 = c2, h2 || p3 || _2 ? bh(f2) ? l2 = f2 : Jf(f2) ? l2 = Tu(f2) : p3 ? (s2 = false, l2 = Iu(c2, true)) : _2 ? (s2 = false, l2 = Wu(c2, true)) : l2 = [] : gc(c2) || dh(c2) ? (l2 = f2, dh(f2) ? l2 = Rc(f2) : fc(f2) && !uc(f2) || (l2 = Ei(c2))) : s2 = false;
          }
          s2 && (o2.set(c2, l2), u2(l2, c2, e2, i2, o2), o2.delete(c2)), Er2(n2, r2, l2);
        }
        function Ge(n2, t2) {
          var r2 = n2.length;
          if (r2) return t2 += t2 < 0 ? r2 : 0, Ci(t2, r2) ? n2[t2] : X;
        }
        function He(n2, t2, r2) {
          t2 = t2.length ? c(t2, function(n3) {
            return bh(n3) ? function(t3) {
              return _e2(t3, 1 === n3.length ? n3[0] : n3);
            } : n3;
          }) : [La];
          var e2 = -1;
          return t2 = c(t2, z(mi())), A(Pe(n2, function(n3, r3, u2) {
            return { criteria: c(t2, function(t3) {
              return t3(n3);
            }), index: ++e2, value: n3 };
          }), function(n3, t3) {
            return Cu(n3, t3, r2);
          });
        }
        function Je(n2, t2) {
          return Ye(n2, t2, function(t3, r2) {
            return Nc(n2, r2);
          });
        }
        function Ye(n2, t2, r2) {
          for (var e2 = -1, u2 = t2.length, i2 = {}; ++e2 < u2; ) {
            var o2 = t2[e2], f2 = _e2(n2, o2);
            r2(f2, o2) && fu(i2, ku(o2, n2), f2);
          }
          return i2;
        }
        function Qe(n2) {
          return function(t2) {
            return _e2(t2, n2);
          };
        }
        function Xe(n2, t2, r2, e2) {
          var u2 = e2 ? d : y, i2 = -1, o2 = t2.length, f2 = n2;
          for (n2 === t2 && (t2 = Tu(t2)), r2 && (f2 = c(n2, z(r2))); ++i2 < o2; ) for (var a2 = 0, l2 = t2[i2], s2 = r2 ? r2(l2) : l2; (a2 = u2(f2, s2, a2, e2)) > -1; ) f2 !== n2 && Ll.call(f2, a2, 1), Ll.call(n2, a2, 1);
          return n2;
        }
        function nu(n2, t2) {
          for (var r2 = n2 ? t2.length : 0, e2 = r2 - 1; r2--; ) {
            var u2 = t2[r2];
            if (r2 == e2 || u2 !== i2) {
              var i2 = u2;
              Ci(u2) ? Ll.call(n2, u2, 1) : yu(n2, u2);
            }
          }
          return n2;
        }
        function tu(n2, t2) {
          return n2 + Nl(Ql() * (t2 - n2 + 1));
        }
        function ru(n2, t2, r2, e2) {
          for (var u2 = -1, i2 = Gl(Fl((t2 - n2) / (r2 || 1)), 0), o2 = il(i2); i2--; ) o2[e2 ? i2 : ++u2] = n2, n2 += r2;
          return o2;
        }
        function eu(n2, t2) {
          var r2 = "";
          if (!n2 || t2 < 1 || t2 > Wn) return r2;
          do
            t2 % 2 && (r2 += n2), t2 = Nl(t2 / 2), t2 && (n2 += n2);
          while (t2);
          return r2;
        }
        function uu(n2, t2) {
          return Ls(Vi(n2, t2, La), n2 + "");
        }
        function iu(n2) {
          return Ir2(ra(n2));
        }
        function ou(n2, t2) {
          var r2 = ra(n2);
          return Xi(r2, Mr2(t2, 0, r2.length));
        }
        function fu(n2, t2, r2, e2) {
          if (!fc(n2)) return n2;
          t2 = ku(t2, n2);
          for (var u2 = -1, i2 = t2.length, o2 = i2 - 1, f2 = n2; null != f2 && ++u2 < i2; ) {
            var c2 = no(t2[u2]), a2 = r2;
            if ("__proto__" === c2 || "constructor" === c2 || "prototype" === c2) return n2;
            if (u2 != o2) {
              var l2 = f2[c2];
              a2 = e2 ? e2(l2, c2, f2) : X, a2 === X && (a2 = fc(l2) ? l2 : Ci(t2[u2 + 1]) ? [] : {});
            }
            Sr2(f2, c2, a2), f2 = f2[c2];
          }
          return n2;
        }
        function cu(n2) {
          return Xi(ra(n2));
        }
        function au(n2, t2, r2) {
          var e2 = -1, u2 = n2.length;
          t2 < 0 && (t2 = -t2 > u2 ? 0 : u2 + t2), r2 = r2 > u2 ? u2 : r2, r2 < 0 && (r2 += u2), u2 = t2 > r2 ? 0 : r2 - t2 >>> 0, t2 >>>= 0;
          for (var i2 = il(u2); ++e2 < u2; ) i2[e2] = n2[e2 + t2];
          return i2;
        }
        function lu(n2, t2) {
          var r2;
          return ys(n2, function(n3, e2, u2) {
            return r2 = t2(n3, e2, u2), !r2;
          }), !!r2;
        }
        function su(n2, t2, r2) {
          var e2 = 0, u2 = null == n2 ? e2 : n2.length;
          if ("number" == typeof t2 && t2 === t2 && u2 <= Tn) {
            for (; e2 < u2; ) {
              var i2 = e2 + u2 >>> 1, o2 = n2[i2];
              null !== o2 && !bc(o2) && (r2 ? o2 <= t2 : o2 < t2) ? e2 = i2 + 1 : u2 = i2;
            }
            return u2;
          }
          return hu(n2, t2, La, r2);
        }
        function hu(n2, t2, r2, e2) {
          var u2 = 0, i2 = null == n2 ? 0 : n2.length;
          if (0 === i2) return 0;
          t2 = r2(t2);
          for (var o2 = t2 !== t2, f2 = null === t2, c2 = bc(t2), a2 = t2 === X; u2 < i2; ) {
            var l2 = Nl((u2 + i2) / 2), s2 = r2(n2[l2]), h2 = s2 !== X, p3 = null === s2, _2 = s2 === s2, v2 = bc(s2);
            if (o2) var g2 = e2 || _2;
            else g2 = a2 ? _2 && (e2 || h2) : f2 ? _2 && h2 && (e2 || !p3) : c2 ? _2 && h2 && !p3 && (e2 || !v2) : !p3 && !v2 && (e2 ? s2 <= t2 : s2 < t2);
            g2 ? u2 = l2 + 1 : i2 = l2;
          }
          return Hl(i2, Bn);
        }
        function pu(n2, t2) {
          for (var r2 = -1, e2 = n2.length, u2 = 0, i2 = []; ++r2 < e2; ) {
            var o2 = n2[r2], f2 = t2 ? t2(o2) : o2;
            if (!r2 || !Gf(f2, c2)) {
              var c2 = f2;
              i2[u2++] = 0 === o2 ? 0 : o2;
            }
          }
          return i2;
        }
        function _u(n2) {
          return "number" == typeof n2 ? n2 : bc(n2) ? Cn : +n2;
        }
        function vu(n2) {
          if ("string" == typeof n2) return n2;
          if (bh(n2)) return c(n2, vu) + "";
          if (bc(n2)) return vs ? vs.call(n2) : "";
          var t2 = n2 + "";
          return "0" == t2 && 1 / n2 == -Sn ? "-0" : t2;
        }
        function gu(n2, t2, r2) {
          var e2 = -1, u2 = o, i2 = n2.length, c2 = true, a2 = [], l2 = a2;
          if (r2) c2 = false, u2 = f;
          else if (i2 >= tn) {
            var s2 = t2 ? null : ks(n2);
            if (s2) return P(s2);
            c2 = false, u2 = S, l2 = new yr2();
          } else l2 = t2 ? [] : a2;
          n: for (; ++e2 < i2; ) {
            var h2 = n2[e2], p3 = t2 ? t2(h2) : h2;
            if (h2 = r2 || 0 !== h2 ? h2 : 0, c2 && p3 === p3) {
              for (var _2 = l2.length; _2--; ) if (l2[_2] === p3) continue n;
              t2 && l2.push(p3), a2.push(h2);
            } else u2(l2, p3, r2) || (l2 !== a2 && l2.push(p3), a2.push(h2));
          }
          return a2;
        }
        function yu(n2, t2) {
          return t2 = ku(t2, n2), n2 = Gi(n2, t2), null == n2 || delete n2[no(jo(t2))];
        }
        function du(n2, t2, r2, e2) {
          return fu(n2, t2, r2(_e2(n2, t2)), e2);
        }
        function bu(n2, t2, r2, e2) {
          for (var u2 = n2.length, i2 = e2 ? u2 : -1; (e2 ? i2-- : ++i2 < u2) && t2(n2[i2], i2, n2); ) ;
          return r2 ? au(n2, e2 ? 0 : i2, e2 ? i2 + 1 : u2) : au(n2, e2 ? i2 + 1 : 0, e2 ? u2 : i2);
        }
        function wu(n2, t2) {
          var r2 = n2;
          return r2 instanceof Ct2 && (r2 = r2.value()), l(t2, function(n3, t3) {
            return t3.func.apply(t3.thisArg, a([n3], t3.args));
          }, r2);
        }
        function mu(n2, t2, r2) {
          var e2 = n2.length;
          if (e2 < 2) return e2 ? gu(n2[0]) : [];
          for (var u2 = -1, i2 = il(e2); ++u2 < e2; ) for (var o2 = n2[u2], f2 = -1; ++f2 < e2; ) f2 != u2 && (i2[u2] = Hr2(i2[u2] || o2, n2[f2], t2, r2));
          return gu(ee2(i2, 1), t2, r2);
        }
        function xu(n2, t2, r2) {
          for (var e2 = -1, u2 = n2.length, i2 = t2.length, o2 = {}; ++e2 < u2; ) {
            r2(o2, n2[e2], e2 < i2 ? t2[e2] : X);
          }
          return o2;
        }
        function ju(n2) {
          return Jf(n2) ? n2 : [];
        }
        function Au(n2) {
          return "function" == typeof n2 ? n2 : La;
        }
        function ku(n2, t2) {
          return bh(n2) ? n2 : Bi(n2, t2) ? [n2] : Cs(Ec(n2));
        }
        function Ou(n2, t2, r2) {
          var e2 = n2.length;
          return r2 = r2 === X ? e2 : r2, !t2 && r2 >= e2 ? n2 : au(n2, t2, r2);
        }
        function Iu(n2, t2) {
          if (t2) return n2.slice();
          var r2 = n2.length, e2 = zl ? zl(r2) : new n2.constructor(r2);
          return n2.copy(e2), e2;
        }
        function Ru(n2) {
          var t2 = new n2.constructor(n2.byteLength);
          return new Rl(t2).set(new Rl(n2)), t2;
        }
        function zu(n2, t2) {
          return new n2.constructor(t2 ? Ru(n2.buffer) : n2.buffer, n2.byteOffset, n2.byteLength);
        }
        function Eu(n2) {
          var t2 = new n2.constructor(n2.source, Nt.exec(n2));
          return t2.lastIndex = n2.lastIndex, t2;
        }
        function Su(n2) {
          return _s ? ll(_s.call(n2)) : {};
        }
        function Wu(n2, t2) {
          return new n2.constructor(t2 ? Ru(n2.buffer) : n2.buffer, n2.byteOffset, n2.length);
        }
        function Lu(n2, t2) {
          if (n2 !== t2) {
            var r2 = n2 !== X, e2 = null === n2, u2 = n2 === n2, i2 = bc(n2), o2 = t2 !== X, f2 = null === t2, c2 = t2 === t2, a2 = bc(t2);
            if (!f2 && !a2 && !i2 && n2 > t2 || i2 && o2 && c2 && !f2 && !a2 || e2 && o2 && c2 || !r2 && c2 || !u2) return 1;
            if (!e2 && !i2 && !a2 && n2 < t2 || a2 && r2 && u2 && !e2 && !i2 || f2 && r2 && u2 || !o2 && u2 || !c2) return -1;
          }
          return 0;
        }
        function Cu(n2, t2, r2) {
          for (var e2 = -1, u2 = n2.criteria, i2 = t2.criteria, o2 = u2.length, f2 = r2.length; ++e2 < o2; ) {
            var c2 = Lu(u2[e2], i2[e2]);
            if (c2) {
              if (e2 >= f2) return c2;
              return c2 * ("desc" == r2[e2] ? -1 : 1);
            }
          }
          return n2.index - t2.index;
        }
        function Uu(n2, t2, r2, e2) {
          for (var u2 = -1, i2 = n2.length, o2 = r2.length, f2 = -1, c2 = t2.length, a2 = Gl(i2 - o2, 0), l2 = il(c2 + a2), s2 = !e2; ++f2 < c2; ) l2[f2] = t2[f2];
          for (; ++u2 < o2; ) (s2 || u2 < i2) && (l2[r2[u2]] = n2[u2]);
          for (; a2--; ) l2[f2++] = n2[u2++];
          return l2;
        }
        function Bu(n2, t2, r2, e2) {
          for (var u2 = -1, i2 = n2.length, o2 = -1, f2 = r2.length, c2 = -1, a2 = t2.length, l2 = Gl(i2 - f2, 0), s2 = il(l2 + a2), h2 = !e2; ++u2 < l2; ) s2[u2] = n2[u2];
          for (var p3 = u2; ++c2 < a2; ) s2[p3 + c2] = t2[c2];
          for (; ++o2 < f2; ) (h2 || u2 < i2) && (s2[p3 + r2[o2]] = n2[u2++]);
          return s2;
        }
        function Tu(n2, t2) {
          var r2 = -1, e2 = n2.length;
          for (t2 || (t2 = il(e2)); ++r2 < e2; ) t2[r2] = n2[r2];
          return t2;
        }
        function $u(n2, t2, r2, e2) {
          var u2 = !r2;
          r2 || (r2 = {});
          for (var i2 = -1, o2 = t2.length; ++i2 < o2; ) {
            var f2 = t2[i2], c2 = e2 ? e2(r2[f2], n2[f2], f2, r2, n2) : X;
            c2 === X && (c2 = n2[f2]), u2 ? Br2(r2, f2, c2) : Sr2(r2, f2, c2);
          }
          return r2;
        }
        function Du(n2, t2) {
          return $u(n2, Is(n2), t2);
        }
        function Mu(n2, t2) {
          return $u(n2, Rs(n2), t2);
        }
        function Fu(n2, r2) {
          return function(e2, u2) {
            var i2 = bh(e2) ? t : Lr2, o2 = r2 ? r2() : {};
            return i2(e2, n2, mi(u2, 2), o2);
          };
        }
        function Nu(n2) {
          return uu(function(t2, r2) {
            var e2 = -1, u2 = r2.length, i2 = u2 > 1 ? r2[u2 - 1] : X, o2 = u2 > 2 ? r2[2] : X;
            for (i2 = n2.length > 3 && "function" == typeof i2 ? (u2--, i2) : X, o2 && Ui(r2[0], r2[1], o2) && (i2 = u2 < 3 ? X : i2, u2 = 1), t2 = ll(t2); ++e2 < u2; ) {
              var f2 = r2[e2];
              f2 && n2(t2, f2, e2, i2);
            }
            return t2;
          });
        }
        function Pu(n2, t2) {
          return function(r2, e2) {
            if (null == r2) return r2;
            if (!Hf(r2)) return n2(r2, e2);
            for (var u2 = r2.length, i2 = t2 ? u2 : -1, o2 = ll(r2); (t2 ? i2-- : ++i2 < u2) && e2(o2[i2], i2, o2) !== false; ) ;
            return r2;
          };
        }
        function qu(n2) {
          return function(t2, r2, e2) {
            for (var u2 = -1, i2 = ll(t2), o2 = e2(t2), f2 = o2.length; f2--; ) {
              var c2 = o2[n2 ? f2 : ++u2];
              if (r2(i2[c2], c2, i2) === false) break;
            }
            return t2;
          };
        }
        function Zu(n2, t2, r2) {
          function e2() {
            return (this && this !== re && this instanceof e2 ? i2 : n2).apply(u2 ? r2 : this, arguments);
          }
          var u2 = t2 & _n, i2 = Gu(n2);
          return e2;
        }
        function Ku(n2) {
          return function(t2) {
            t2 = Ec(t2);
            var r2 = T(t2) ? G(t2) : X, e2 = r2 ? r2[0] : t2.charAt(0), u2 = r2 ? Ou(r2, 1).join("") : t2.slice(1);
            return e2[n2]() + u2;
          };
        }
        function Vu(n2) {
          return function(t2) {
            return l(Ra(ca(t2).replace($r, "")), n2, "");
          };
        }
        function Gu(n2) {
          return function() {
            var t2 = arguments;
            switch (t2.length) {
              case 0:
                return new n2();
              case 1:
                return new n2(t2[0]);
              case 2:
                return new n2(t2[0], t2[1]);
              case 3:
                return new n2(t2[0], t2[1], t2[2]);
              case 4:
                return new n2(t2[0], t2[1], t2[2], t2[3]);
              case 5:
                return new n2(t2[0], t2[1], t2[2], t2[3], t2[4]);
              case 6:
                return new n2(t2[0], t2[1], t2[2], t2[3], t2[4], t2[5]);
              case 7:
                return new n2(t2[0], t2[1], t2[2], t2[3], t2[4], t2[5], t2[6]);
            }
            var r2 = gs(n2.prototype), e2 = n2.apply(r2, t2);
            return fc(e2) ? e2 : r2;
          };
        }
        function Hu(t2, r2, e2) {
          function u2() {
            for (var o2 = arguments.length, f2 = il(o2), c2 = o2, a2 = wi(u2); c2--; ) f2[c2] = arguments[c2];
            var l2 = o2 < 3 && f2[0] !== a2 && f2[o2 - 1] !== a2 ? [] : N(f2, a2);
            return o2 -= l2.length, o2 < e2 ? oi(t2, r2, Qu, u2.placeholder, X, f2, l2, X, X, e2 - o2) : n(this && this !== re && this instanceof u2 ? i2 : t2, this, f2);
          }
          var i2 = Gu(t2);
          return u2;
        }
        function Ju(n2) {
          return function(t2, r2, e2) {
            var u2 = ll(t2);
            if (!Hf(t2)) {
              var i2 = mi(r2, 3);
              t2 = Pc(t2), r2 = function(n3) {
                return i2(u2[n3], n3, u2);
              };
            }
            var o2 = n2(t2, r2, e2);
            return o2 > -1 ? u2[i2 ? t2[o2] : o2] : X;
          };
        }
        function Yu(n2) {
          return gi(function(t2) {
            var r2 = t2.length, e2 = r2, u2 = Y2.prototype.thru;
            for (n2 && t2.reverse(); e2--; ) {
              var i2 = t2[e2];
              if ("function" != typeof i2) throw new pl(en);
              if (u2 && !o2 && "wrapper" == bi(i2)) var o2 = new Y2([], true);
            }
            for (e2 = o2 ? e2 : r2; ++e2 < r2; ) {
              i2 = t2[e2];
              var f2 = bi(i2), c2 = "wrapper" == f2 ? Os(i2) : X;
              o2 = c2 && $i(c2[0]) && c2[1] == (mn | yn | bn | xn) && !c2[4].length && 1 == c2[9] ? o2[bi(c2[0])].apply(o2, c2[3]) : 1 == i2.length && $i(i2) ? o2[f2]() : o2.thru(i2);
            }
            return function() {
              var n3 = arguments, e3 = n3[0];
              if (o2 && 1 == n3.length && bh(e3)) return o2.plant(e3).value();
              for (var u3 = 0, i3 = r2 ? t2[u3].apply(this, n3) : e3; ++u3 < r2; ) i3 = t2[u3].call(this, i3);
              return i3;
            };
          });
        }
        function Qu(n2, t2, r2, e2, u2, i2, o2, f2, c2, a2) {
          function l2() {
            for (var y2 = arguments.length, d2 = il(y2), b2 = y2; b2--; ) d2[b2] = arguments[b2];
            if (_2) var w2 = wi(l2), m2 = C(d2, w2);
            if (e2 && (d2 = Uu(d2, e2, u2, _2)), i2 && (d2 = Bu(d2, i2, o2, _2)), y2 -= m2, _2 && y2 < a2) {
              return oi(n2, t2, Qu, l2.placeholder, r2, d2, N(d2, w2), f2, c2, a2 - y2);
            }
            var x3 = h2 ? r2 : this, j2 = p3 ? x3[n2] : n2;
            return y2 = d2.length, f2 ? d2 = Hi(d2, f2) : v2 && y2 > 1 && d2.reverse(), s2 && c2 < y2 && (d2.length = c2), this && this !== re && this instanceof l2 && (j2 = g2 || Gu(j2)), j2.apply(x3, d2);
          }
          var s2 = t2 & mn, h2 = t2 & _n, p3 = t2 & vn, _2 = t2 & (yn | dn), v2 = t2 & jn, g2 = p3 ? X : Gu(n2);
          return l2;
        }
        function Xu(n2, t2) {
          return function(r2, e2) {
            return Oe(r2, n2, t2(e2), {});
          };
        }
        function ni(n2, t2) {
          return function(r2, e2) {
            var u2;
            if (r2 === X && e2 === X) return t2;
            if (r2 !== X && (u2 = r2), e2 !== X) {
              if (u2 === X) return e2;
              "string" == typeof r2 || "string" == typeof e2 ? (r2 = vu(r2), e2 = vu(e2)) : (r2 = _u(r2), e2 = _u(e2)), u2 = n2(r2, e2);
            }
            return u2;
          };
        }
        function ti(t2) {
          return gi(function(r2) {
            return r2 = c(r2, z(mi())), uu(function(e2) {
              var u2 = this;
              return t2(r2, function(t3) {
                return n(t3, u2, e2);
              });
            });
          });
        }
        function ri(n2, t2) {
          t2 = t2 === X ? " " : vu(t2);
          var r2 = t2.length;
          if (r2 < 2) return r2 ? eu(t2, n2) : t2;
          var e2 = eu(t2, Fl(n2 / V(t2)));
          return T(t2) ? Ou(G(e2), 0, n2).join("") : e2.slice(0, n2);
        }
        function ei(t2, r2, e2, u2) {
          function i2() {
            for (var r3 = -1, c2 = arguments.length, a2 = -1, l2 = u2.length, s2 = il(l2 + c2), h2 = this && this !== re && this instanceof i2 ? f2 : t2; ++a2 < l2; ) s2[a2] = u2[a2];
            for (; c2--; ) s2[a2++] = arguments[++r3];
            return n(h2, o2 ? e2 : this, s2);
          }
          var o2 = r2 & _n, f2 = Gu(t2);
          return i2;
        }
        function ui(n2) {
          return function(t2, r2, e2) {
            return e2 && "number" != typeof e2 && Ui(t2, r2, e2) && (r2 = e2 = X), t2 = Ac(t2), r2 === X ? (r2 = t2, t2 = 0) : r2 = Ac(r2), e2 = e2 === X ? t2 < r2 ? 1 : -1 : Ac(e2), ru(t2, r2, e2, n2);
          };
        }
        function ii(n2) {
          return function(t2, r2) {
            return "string" == typeof t2 && "string" == typeof r2 || (t2 = Ic(t2), r2 = Ic(r2)), n2(t2, r2);
          };
        }
        function oi(n2, t2, r2, e2, u2, i2, o2, f2, c2, a2) {
          var l2 = t2 & yn, s2 = l2 ? o2 : X, h2 = l2 ? X : o2, p3 = l2 ? i2 : X, _2 = l2 ? X : i2;
          t2 |= l2 ? bn : wn, t2 &= ~(l2 ? wn : bn), t2 & gn || (t2 &= ~(_n | vn));
          var v2 = [n2, t2, u2, p3, s2, _2, h2, f2, c2, a2], g2 = r2.apply(X, v2);
          return $i(n2) && Ss(g2, v2), g2.placeholder = e2, Yi(g2, n2, t2);
        }
        function fi(n2) {
          var t2 = al[n2];
          return function(n3, r2) {
            if (n3 = Ic(n3), r2 = null == r2 ? 0 : Hl(kc(r2), 292), r2 && Zl(n3)) {
              var e2 = (Ec(n3) + "e").split("e");
              return e2 = (Ec(t2(e2[0] + "e" + (+e2[1] + r2))) + "e").split("e"), +(e2[0] + "e" + (+e2[1] - r2));
            }
            return t2(n3);
          };
        }
        function ci(n2) {
          return function(t2) {
            var r2 = zs(t2);
            return r2 == Gn ? M(t2) : r2 == tt ? q(t2) : I(t2, n2(t2));
          };
        }
        function ai(n2, t2, r2, e2, u2, i2, o2, f2) {
          var c2 = t2 & vn;
          if (!c2 && "function" != typeof n2) throw new pl(en);
          var a2 = e2 ? e2.length : 0;
          if (a2 || (t2 &= ~(bn | wn), e2 = u2 = X), o2 = o2 === X ? o2 : Gl(kc(o2), 0), f2 = f2 === X ? f2 : kc(f2), a2 -= u2 ? u2.length : 0, t2 & wn) {
            var l2 = e2, s2 = u2;
            e2 = u2 = X;
          }
          var h2 = c2 ? X : Os(n2), p3 = [n2, t2, r2, e2, u2, l2, s2, i2, o2, f2];
          if (h2 && qi(p3, h2), n2 = p3[0], t2 = p3[1], r2 = p3[2], e2 = p3[3], u2 = p3[4], f2 = p3[9] = p3[9] === X ? c2 ? 0 : n2.length : Gl(p3[9] - a2, 0), !f2 && t2 & (yn | dn) && (t2 &= ~(yn | dn)), t2 && t2 != _n) _2 = t2 == yn || t2 == dn ? Hu(n2, t2, f2) : t2 != bn && t2 != (_n | bn) || u2.length ? Qu.apply(X, p3) : ei(n2, t2, r2, e2);
          else var _2 = Zu(n2, t2, r2);
          return Yi((h2 ? ms : Ss)(_2, p3), n2, t2);
        }
        function li(n2, t2, r2, e2) {
          return n2 === X || Gf(n2, gl[r2]) && !bl.call(e2, r2) ? t2 : n2;
        }
        function si(n2, t2, r2, e2, u2, i2) {
          return fc(n2) && fc(t2) && (i2.set(t2, n2), Ke(n2, t2, X, si, i2), i2.delete(t2)), n2;
        }
        function hi(n2) {
          return gc(n2) ? X : n2;
        }
        function pi(n2, t2, r2, e2, u2, i2) {
          var o2 = r2 & hn, f2 = n2.length, c2 = t2.length;
          if (f2 != c2 && !(o2 && c2 > f2)) return false;
          var a2 = i2.get(n2), l2 = i2.get(t2);
          if (a2 && l2) return a2 == t2 && l2 == n2;
          var s2 = -1, p3 = true, _2 = r2 & pn ? new yr2() : X;
          for (i2.set(n2, t2), i2.set(t2, n2); ++s2 < f2; ) {
            var v2 = n2[s2], g2 = t2[s2];
            if (e2) var y2 = o2 ? e2(g2, v2, s2, t2, n2, i2) : e2(v2, g2, s2, n2, t2, i2);
            if (y2 !== X) {
              if (y2) continue;
              p3 = false;
              break;
            }
            if (_2) {
              if (!h(t2, function(n3, t3) {
                if (!S(_2, t3) && (v2 === n3 || u2(v2, n3, r2, e2, i2))) return _2.push(t3);
              })) {
                p3 = false;
                break;
              }
            } else if (v2 !== g2 && !u2(v2, g2, r2, e2, i2)) {
              p3 = false;
              break;
            }
          }
          return i2.delete(n2), i2.delete(t2), p3;
        }
        function _i(n2, t2, r2, e2, u2, i2, o2) {
          switch (r2) {
            case ct:
              if (n2.byteLength != t2.byteLength || n2.byteOffset != t2.byteOffset) return false;
              n2 = n2.buffer, t2 = t2.buffer;
            case ft:
              return !(n2.byteLength != t2.byteLength || !i2(new Rl(n2), new Rl(t2)));
            case Nn:
            case Pn:
            case Hn:
              return Gf(+n2, +t2);
            case Zn:
              return n2.name == t2.name && n2.message == t2.message;
            case nt:
            case rt:
              return n2 == t2 + "";
            case Gn:
              var f2 = M;
            case tt:
              var c2 = e2 & hn;
              if (f2 || (f2 = P), n2.size != t2.size && !c2) return false;
              var a2 = o2.get(n2);
              if (a2) return a2 == t2;
              e2 |= pn, o2.set(n2, t2);
              var l2 = pi(f2(n2), f2(t2), e2, u2, i2, o2);
              return o2.delete(n2), l2;
            case et:
              if (_s) return _s.call(n2) == _s.call(t2);
          }
          return false;
        }
        function vi(n2, t2, r2, e2, u2, i2) {
          var o2 = r2 & hn, f2 = yi(n2), c2 = f2.length;
          if (c2 != yi(t2).length && !o2) return false;
          for (var a2 = c2; a2--; ) {
            var l2 = f2[a2];
            if (!(o2 ? l2 in t2 : bl.call(t2, l2))) return false;
          }
          var s2 = i2.get(n2), h2 = i2.get(t2);
          if (s2 && h2) return s2 == t2 && h2 == n2;
          var p3 = true;
          i2.set(n2, t2), i2.set(t2, n2);
          for (var _2 = o2; ++a2 < c2; ) {
            l2 = f2[a2];
            var v2 = n2[l2], g2 = t2[l2];
            if (e2) var y2 = o2 ? e2(g2, v2, l2, t2, n2, i2) : e2(v2, g2, l2, n2, t2, i2);
            if (!(y2 === X ? v2 === g2 || u2(v2, g2, r2, e2, i2) : y2)) {
              p3 = false;
              break;
            }
            _2 || (_2 = "constructor" == l2);
          }
          if (p3 && !_2) {
            var d2 = n2.constructor, b2 = t2.constructor;
            d2 != b2 && "constructor" in n2 && "constructor" in t2 && !("function" == typeof d2 && d2 instanceof d2 && "function" == typeof b2 && b2 instanceof b2) && (p3 = false);
          }
          return i2.delete(n2), i2.delete(t2), p3;
        }
        function gi(n2) {
          return Ls(Vi(n2, X, _o), n2 + "");
        }
        function yi(n2) {
          return de2(n2, Pc, Is);
        }
        function di(n2) {
          return de2(n2, qc, Rs);
        }
        function bi(n2) {
          for (var t2 = n2.name + "", r2 = fs[t2], e2 = bl.call(fs, t2) ? r2.length : 0; e2--; ) {
            var u2 = r2[e2], i2 = u2.func;
            if (null == i2 || i2 == n2) return u2.name;
          }
          return t2;
        }
        function wi(n2) {
          return (bl.call(Z2, "placeholder") ? Z2 : n2).placeholder;
        }
        function mi() {
          var n2 = Z2.iteratee || Ca;
          return n2 = n2 === Ca ? De : n2, arguments.length ? n2(arguments[0], arguments[1]) : n2;
        }
        function xi(n2, t2) {
          var r2 = n2.__data__;
          return Ti(t2) ? r2["string" == typeof t2 ? "string" : "hash"] : r2.map;
        }
        function ji(n2) {
          for (var t2 = Pc(n2), r2 = t2.length; r2--; ) {
            var e2 = t2[r2], u2 = n2[e2];
            t2[r2] = [e2, u2, Fi(u2)];
          }
          return t2;
        }
        function Ai(n2, t2) {
          var r2 = B(n2, t2);
          return Ue(r2) ? r2 : X;
        }
        function ki(n2) {
          var t2 = bl.call(n2, Bl), r2 = n2[Bl];
          try {
            n2[Bl] = X;
            var e2 = true;
          } catch (n3) {
          }
          var u2 = xl.call(n2);
          return e2 && (t2 ? n2[Bl] = r2 : delete n2[Bl]), u2;
        }
        function Oi(n2, t2, r2) {
          for (var e2 = -1, u2 = r2.length; ++e2 < u2; ) {
            var i2 = r2[e2], o2 = i2.size;
            switch (i2.type) {
              case "drop":
                n2 += o2;
                break;
              case "dropRight":
                t2 -= o2;
                break;
              case "take":
                t2 = Hl(t2, n2 + o2);
                break;
              case "takeRight":
                n2 = Gl(n2, t2 - o2);
            }
          }
          return { start: n2, end: t2 };
        }
        function Ii(n2) {
          var t2 = n2.match(Bt);
          return t2 ? t2[1].split(Tt) : [];
        }
        function Ri(n2, t2, r2) {
          t2 = ku(t2, n2);
          for (var e2 = -1, u2 = t2.length, i2 = false; ++e2 < u2; ) {
            var o2 = no(t2[e2]);
            if (!(i2 = null != n2 && r2(n2, o2))) break;
            n2 = n2[o2];
          }
          return i2 || ++e2 != u2 ? i2 : (u2 = null == n2 ? 0 : n2.length, !!u2 && oc(u2) && Ci(o2, u2) && (bh(n2) || dh(n2)));
        }
        function zi(n2) {
          var t2 = n2.length, r2 = new n2.constructor(t2);
          return t2 && "string" == typeof n2[0] && bl.call(n2, "index") && (r2.index = n2.index, r2.input = n2.input), r2;
        }
        function Ei(n2) {
          return "function" != typeof n2.constructor || Mi(n2) ? {} : gs(El(n2));
        }
        function Si(n2, t2, r2) {
          var e2 = n2.constructor;
          switch (t2) {
            case ft:
              return Ru(n2);
            case Nn:
            case Pn:
              return new e2(+n2);
            case ct:
              return zu(n2, r2);
            case at:
            case lt:
            case st:
            case ht:
            case pt:
            case _t:
            case vt:
            case gt:
            case yt:
              return Wu(n2, r2);
            case Gn:
              return new e2();
            case Hn:
            case rt:
              return new e2(n2);
            case nt:
              return Eu(n2);
            case tt:
              return new e2();
            case et:
              return Su(n2);
          }
        }
        function Wi(n2, t2) {
          var r2 = t2.length;
          if (!r2) return n2;
          var e2 = r2 - 1;
          return t2[e2] = (r2 > 1 ? "& " : "") + t2[e2], t2 = t2.join(r2 > 2 ? ", " : " "), n2.replace(Ut, "{\n/* [wrapped with " + t2 + "] */\n");
        }
        function Li(n2) {
          return bh(n2) || dh(n2) || !!(Cl && n2 && n2[Cl]);
        }
        function Ci(n2, t2) {
          var r2 = typeof n2;
          return t2 = null == t2 ? Wn : t2, !!t2 && ("number" == r2 || "symbol" != r2 && Vt.test(n2)) && n2 > -1 && n2 % 1 == 0 && n2 < t2;
        }
        function Ui(n2, t2, r2) {
          if (!fc(r2)) return false;
          var e2 = typeof t2;
          return !!("number" == e2 ? Hf(r2) && Ci(t2, r2.length) : "string" == e2 && t2 in r2) && Gf(r2[t2], n2);
        }
        function Bi(n2, t2) {
          if (bh(n2)) return false;
          var r2 = typeof n2;
          return !("number" != r2 && "symbol" != r2 && "boolean" != r2 && null != n2 && !bc(n2)) || (zt.test(n2) || !Rt.test(n2) || null != t2 && n2 in ll(t2));
        }
        function Ti(n2) {
          var t2 = typeof n2;
          return "string" == t2 || "number" == t2 || "symbol" == t2 || "boolean" == t2 ? "__proto__" !== n2 : null === n2;
        }
        function $i(n2) {
          var t2 = bi(n2), r2 = Z2[t2];
          if ("function" != typeof r2 || !(t2 in Ct2.prototype)) return false;
          if (n2 === r2) return true;
          var e2 = Os(r2);
          return !!e2 && n2 === e2[0];
        }
        function Di(n2) {
          return !!ml && ml in n2;
        }
        function Mi(n2) {
          var t2 = n2 && n2.constructor;
          return n2 === ("function" == typeof t2 && t2.prototype || gl);
        }
        function Fi(n2) {
          return n2 === n2 && !fc(n2);
        }
        function Ni(n2, t2) {
          return function(r2) {
            return null != r2 && (r2[n2] === t2 && (t2 !== X || n2 in ll(r2)));
          };
        }
        function Pi(n2) {
          var t2 = Cf(n2, function(n3) {
            return r2.size === fn && r2.clear(), n3;
          }), r2 = t2.cache;
          return t2;
        }
        function qi(n2, t2) {
          var r2 = n2[1], e2 = t2[1], u2 = r2 | e2, i2 = u2 < (_n | vn | mn), o2 = e2 == mn && r2 == yn || e2 == mn && r2 == xn && n2[7].length <= t2[8] || e2 == (mn | xn) && t2[7].length <= t2[8] && r2 == yn;
          if (!i2 && !o2) return n2;
          e2 & _n && (n2[2] = t2[2], u2 |= r2 & _n ? 0 : gn);
          var f2 = t2[3];
          if (f2) {
            var c2 = n2[3];
            n2[3] = c2 ? Uu(c2, f2, t2[4]) : f2, n2[4] = c2 ? N(n2[3], cn) : t2[4];
          }
          return f2 = t2[5], f2 && (c2 = n2[5], n2[5] = c2 ? Bu(c2, f2, t2[6]) : f2, n2[6] = c2 ? N(n2[5], cn) : t2[6]), f2 = t2[7], f2 && (n2[7] = f2), e2 & mn && (n2[8] = null == n2[8] ? t2[8] : Hl(n2[8], t2[8])), null == n2[9] && (n2[9] = t2[9]), n2[0] = t2[0], n2[1] = u2, n2;
        }
        function Zi(n2) {
          var t2 = [];
          if (null != n2) for (var r2 in ll(n2)) t2.push(r2);
          return t2;
        }
        function Ki(n2) {
          return xl.call(n2);
        }
        function Vi(t2, r2, e2) {
          return r2 = Gl(r2 === X ? t2.length - 1 : r2, 0), function() {
            for (var u2 = arguments, i2 = -1, o2 = Gl(u2.length - r2, 0), f2 = il(o2); ++i2 < o2; ) f2[i2] = u2[r2 + i2];
            i2 = -1;
            for (var c2 = il(r2 + 1); ++i2 < r2; ) c2[i2] = u2[i2];
            return c2[r2] = e2(f2), n(t2, this, c2);
          };
        }
        function Gi(n2, t2) {
          return t2.length < 2 ? n2 : _e2(n2, au(t2, 0, -1));
        }
        function Hi(n2, t2) {
          for (var r2 = n2.length, e2 = Hl(t2.length, r2), u2 = Tu(n2); e2--; ) {
            var i2 = t2[e2];
            n2[e2] = Ci(i2, r2) ? u2[i2] : X;
          }
          return n2;
        }
        function Ji(n2, t2) {
          if (("constructor" !== t2 || "function" != typeof n2[t2]) && "__proto__" != t2) return n2[t2];
        }
        function Yi(n2, t2, r2) {
          var e2 = t2 + "";
          return Ls(n2, Wi(e2, ro(Ii(e2), r2)));
        }
        function Qi(n2) {
          var t2 = 0, r2 = 0;
          return function() {
            var e2 = Jl(), u2 = In - (e2 - r2);
            if (r2 = e2, u2 > 0) {
              if (++t2 >= On) return arguments[0];
            } else t2 = 0;
            return n2.apply(X, arguments);
          };
        }
        function Xi(n2, t2) {
          var r2 = -1, e2 = n2.length, u2 = e2 - 1;
          for (t2 = t2 === X ? e2 : t2; ++r2 < t2; ) {
            var i2 = tu(r2, u2), o2 = n2[i2];
            n2[i2] = n2[r2], n2[r2] = o2;
          }
          return n2.length = t2, n2;
        }
        function no(n2) {
          if ("string" == typeof n2 || bc(n2)) return n2;
          var t2 = n2 + "";
          return "0" == t2 && 1 / n2 == -Sn ? "-0" : t2;
        }
        function to(n2) {
          if (null != n2) {
            try {
              return dl.call(n2);
            } catch (n3) {
            }
            try {
              return n2 + "";
            } catch (n3) {
            }
          }
          return "";
        }
        function ro(n2, t2) {
          return r($n, function(r2) {
            var e2 = "_." + r2[0];
            t2 & r2[1] && !o(n2, e2) && n2.push(e2);
          }), n2.sort();
        }
        function eo(n2) {
          if (n2 instanceof Ct2) return n2.clone();
          var t2 = new Y2(n2.__wrapped__, n2.__chain__);
          return t2.__actions__ = Tu(n2.__actions__), t2.__index__ = n2.__index__, t2.__values__ = n2.__values__, t2;
        }
        function uo(n2, t2, r2) {
          t2 = (r2 ? Ui(n2, t2, r2) : t2 === X) ? 1 : Gl(kc(t2), 0);
          var e2 = null == n2 ? 0 : n2.length;
          if (!e2 || t2 < 1) return [];
          for (var u2 = 0, i2 = 0, o2 = il(Fl(e2 / t2)); u2 < e2; ) o2[i2++] = au(n2, u2, u2 += t2);
          return o2;
        }
        function io(n2) {
          for (var t2 = -1, r2 = null == n2 ? 0 : n2.length, e2 = 0, u2 = []; ++t2 < r2; ) {
            var i2 = n2[t2];
            i2 && (u2[e2++] = i2);
          }
          return u2;
        }
        function oo() {
          var n2 = arguments.length;
          if (!n2) return [];
          for (var t2 = il(n2 - 1), r2 = arguments[0], e2 = n2; e2--; ) t2[e2 - 1] = arguments[e2];
          return a(bh(r2) ? Tu(r2) : [r2], ee2(t2, 1));
        }
        function fo(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          return e2 ? (t2 = r2 || t2 === X ? 1 : kc(t2), au(n2, t2 < 0 ? 0 : t2, e2)) : [];
        }
        function co(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          return e2 ? (t2 = r2 || t2 === X ? 1 : kc(t2), t2 = e2 - t2, au(n2, 0, t2 < 0 ? 0 : t2)) : [];
        }
        function ao(n2, t2) {
          return n2 && n2.length ? bu(n2, mi(t2, 3), true, true) : [];
        }
        function lo(n2, t2) {
          return n2 && n2.length ? bu(n2, mi(t2, 3), true) : [];
        }
        function so(n2, t2, r2, e2) {
          var u2 = null == n2 ? 0 : n2.length;
          return u2 ? (r2 && "number" != typeof r2 && Ui(n2, t2, r2) && (r2 = 0, e2 = u2), ne2(n2, t2, r2, e2)) : [];
        }
        function ho(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          if (!e2) return -1;
          var u2 = null == r2 ? 0 : kc(r2);
          return u2 < 0 && (u2 = Gl(e2 + u2, 0)), g(n2, mi(t2, 3), u2);
        }
        function po(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          if (!e2) return -1;
          var u2 = e2 - 1;
          return r2 !== X && (u2 = kc(r2), u2 = r2 < 0 ? Gl(e2 + u2, 0) : Hl(u2, e2 - 1)), g(n2, mi(t2, 3), u2, true);
        }
        function _o(n2) {
          return (null == n2 ? 0 : n2.length) ? ee2(n2, 1) : [];
        }
        function vo(n2) {
          return (null == n2 ? 0 : n2.length) ? ee2(n2, Sn) : [];
        }
        function go(n2, t2) {
          return (null == n2 ? 0 : n2.length) ? (t2 = t2 === X ? 1 : kc(t2), ee2(n2, t2)) : [];
        }
        function yo(n2) {
          for (var t2 = -1, r2 = null == n2 ? 0 : n2.length, e2 = {}; ++t2 < r2; ) {
            var u2 = n2[t2];
            e2[u2[0]] = u2[1];
          }
          return e2;
        }
        function bo(n2) {
          return n2 && n2.length ? n2[0] : X;
        }
        function wo(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          if (!e2) return -1;
          var u2 = null == r2 ? 0 : kc(r2);
          return u2 < 0 && (u2 = Gl(e2 + u2, 0)), y(n2, t2, u2);
        }
        function mo(n2) {
          return (null == n2 ? 0 : n2.length) ? au(n2, 0, -1) : [];
        }
        function xo(n2, t2) {
          return null == n2 ? "" : Kl.call(n2, t2);
        }
        function jo(n2) {
          var t2 = null == n2 ? 0 : n2.length;
          return t2 ? n2[t2 - 1] : X;
        }
        function Ao(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          if (!e2) return -1;
          var u2 = e2;
          return r2 !== X && (u2 = kc(r2), u2 = u2 < 0 ? Gl(e2 + u2, 0) : Hl(u2, e2 - 1)), t2 === t2 ? K(n2, t2, u2) : g(n2, b, u2, true);
        }
        function ko(n2, t2) {
          return n2 && n2.length ? Ge(n2, kc(t2)) : X;
        }
        function Oo(n2, t2) {
          return n2 && n2.length && t2 && t2.length ? Xe(n2, t2) : n2;
        }
        function Io(n2, t2, r2) {
          return n2 && n2.length && t2 && t2.length ? Xe(n2, t2, mi(r2, 2)) : n2;
        }
        function Ro(n2, t2, r2) {
          return n2 && n2.length && t2 && t2.length ? Xe(n2, t2, X, r2) : n2;
        }
        function zo(n2, t2) {
          var r2 = [];
          if (!n2 || !n2.length) return r2;
          var e2 = -1, u2 = [], i2 = n2.length;
          for (t2 = mi(t2, 3); ++e2 < i2; ) {
            var o2 = n2[e2];
            t2(o2, e2, n2) && (r2.push(o2), u2.push(e2));
          }
          return nu(n2, u2), r2;
        }
        function Eo(n2) {
          return null == n2 ? n2 : Xl.call(n2);
        }
        function So(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          return e2 ? (r2 && "number" != typeof r2 && Ui(n2, t2, r2) ? (t2 = 0, r2 = e2) : (t2 = null == t2 ? 0 : kc(t2), r2 = r2 === X ? e2 : kc(r2)), au(n2, t2, r2)) : [];
        }
        function Wo(n2, t2) {
          return su(n2, t2);
        }
        function Lo(n2, t2, r2) {
          return hu(n2, t2, mi(r2, 2));
        }
        function Co(n2, t2) {
          var r2 = null == n2 ? 0 : n2.length;
          if (r2) {
            var e2 = su(n2, t2);
            if (e2 < r2 && Gf(n2[e2], t2)) return e2;
          }
          return -1;
        }
        function Uo(n2, t2) {
          return su(n2, t2, true);
        }
        function Bo(n2, t2, r2) {
          return hu(n2, t2, mi(r2, 2), true);
        }
        function To(n2, t2) {
          if (null == n2 ? 0 : n2.length) {
            var r2 = su(n2, t2, true) - 1;
            if (Gf(n2[r2], t2)) return r2;
          }
          return -1;
        }
        function $o(n2) {
          return n2 && n2.length ? pu(n2) : [];
        }
        function Do(n2, t2) {
          return n2 && n2.length ? pu(n2, mi(t2, 2)) : [];
        }
        function Mo(n2) {
          var t2 = null == n2 ? 0 : n2.length;
          return t2 ? au(n2, 1, t2) : [];
        }
        function Fo(n2, t2, r2) {
          return n2 && n2.length ? (t2 = r2 || t2 === X ? 1 : kc(t2), au(n2, 0, t2 < 0 ? 0 : t2)) : [];
        }
        function No(n2, t2, r2) {
          var e2 = null == n2 ? 0 : n2.length;
          return e2 ? (t2 = r2 || t2 === X ? 1 : kc(t2), t2 = e2 - t2, au(n2, t2 < 0 ? 0 : t2, e2)) : [];
        }
        function Po(n2, t2) {
          return n2 && n2.length ? bu(n2, mi(t2, 3), false, true) : [];
        }
        function qo(n2, t2) {
          return n2 && n2.length ? bu(n2, mi(t2, 3)) : [];
        }
        function Zo(n2) {
          return n2 && n2.length ? gu(n2) : [];
        }
        function Ko(n2, t2) {
          return n2 && n2.length ? gu(n2, mi(t2, 2)) : [];
        }
        function Vo(n2, t2) {
          return t2 = "function" == typeof t2 ? t2 : X, n2 && n2.length ? gu(n2, X, t2) : [];
        }
        function Go(n2) {
          if (!n2 || !n2.length) return [];
          var t2 = 0;
          return n2 = i(n2, function(n3) {
            if (Jf(n3)) return t2 = Gl(n3.length, t2), true;
          }), O(t2, function(t3) {
            return c(n2, m(t3));
          });
        }
        function Ho(t2, r2) {
          if (!t2 || !t2.length) return [];
          var e2 = Go(t2);
          return null == r2 ? e2 : c(e2, function(t3) {
            return n(r2, X, t3);
          });
        }
        function Jo(n2, t2) {
          return xu(n2 || [], t2 || [], Sr2);
        }
        function Yo(n2, t2) {
          return xu(n2 || [], t2 || [], fu);
        }
        function Qo(n2) {
          var t2 = Z2(n2);
          return t2.__chain__ = true, t2;
        }
        function Xo(n2, t2) {
          return t2(n2), n2;
        }
        function nf(n2, t2) {
          return t2(n2);
        }
        function tf() {
          return Qo(this);
        }
        function rf() {
          return new Y2(this.value(), this.__chain__);
        }
        function ef() {
          this.__values__ === X && (this.__values__ = jc(this.value()));
          var n2 = this.__index__ >= this.__values__.length;
          return { done: n2, value: n2 ? X : this.__values__[this.__index__++] };
        }
        function uf() {
          return this;
        }
        function of(n2) {
          for (var t2, r2 = this; r2 instanceof J2; ) {
            var e2 = eo(r2);
            e2.__index__ = 0, e2.__values__ = X, t2 ? u2.__wrapped__ = e2 : t2 = e2;
            var u2 = e2;
            r2 = r2.__wrapped__;
          }
          return u2.__wrapped__ = n2, t2;
        }
        function ff() {
          var n2 = this.__wrapped__;
          if (n2 instanceof Ct2) {
            var t2 = n2;
            return this.__actions__.length && (t2 = new Ct2(this)), t2 = t2.reverse(), t2.__actions__.push({ func: nf, args: [Eo], thisArg: X }), new Y2(t2, this.__chain__);
          }
          return this.thru(Eo);
        }
        function cf() {
          return wu(this.__wrapped__, this.__actions__);
        }
        function af(n2, t2, r2) {
          var e2 = bh(n2) ? u : Jr2;
          return r2 && Ui(n2, t2, r2) && (t2 = X), e2(n2, mi(t2, 3));
        }
        function lf(n2, t2) {
          return (bh(n2) ? i : te2)(n2, mi(t2, 3));
        }
        function sf(n2, t2) {
          return ee2(yf(n2, t2), 1);
        }
        function hf(n2, t2) {
          return ee2(yf(n2, t2), Sn);
        }
        function pf(n2, t2, r2) {
          return r2 = r2 === X ? 1 : kc(r2), ee2(yf(n2, t2), r2);
        }
        function _f(n2, t2) {
          return (bh(n2) ? r : ys)(n2, mi(t2, 3));
        }
        function vf(n2, t2) {
          return (bh(n2) ? e : ds)(n2, mi(t2, 3));
        }
        function gf(n2, t2, r2, e2) {
          n2 = Hf(n2) ? n2 : ra(n2), r2 = r2 && !e2 ? kc(r2) : 0;
          var u2 = n2.length;
          return r2 < 0 && (r2 = Gl(u2 + r2, 0)), dc(n2) ? r2 <= u2 && n2.indexOf(t2, r2) > -1 : !!u2 && y(n2, t2, r2) > -1;
        }
        function yf(n2, t2) {
          return (bh(n2) ? c : Pe)(n2, mi(t2, 3));
        }
        function df(n2, t2, r2, e2) {
          return null == n2 ? [] : (bh(t2) || (t2 = null == t2 ? [] : [t2]), r2 = e2 ? X : r2, bh(r2) || (r2 = null == r2 ? [] : [r2]), He(n2, t2, r2));
        }
        function bf(n2, t2, r2) {
          var e2 = bh(n2) ? l : j, u2 = arguments.length < 3;
          return e2(n2, mi(t2, 4), r2, u2, ys);
        }
        function wf(n2, t2, r2) {
          var e2 = bh(n2) ? s : j, u2 = arguments.length < 3;
          return e2(n2, mi(t2, 4), r2, u2, ds);
        }
        function mf(n2, t2) {
          return (bh(n2) ? i : te2)(n2, Uf(mi(t2, 3)));
        }
        function xf(n2) {
          return (bh(n2) ? Ir2 : iu)(n2);
        }
        function jf(n2, t2, r2) {
          return t2 = (r2 ? Ui(n2, t2, r2) : t2 === X) ? 1 : kc(t2), (bh(n2) ? Rr2 : ou)(n2, t2);
        }
        function Af(n2) {
          return (bh(n2) ? zr2 : cu)(n2);
        }
        function kf(n2) {
          if (null == n2) return 0;
          if (Hf(n2)) return dc(n2) ? V(n2) : n2.length;
          var t2 = zs(n2);
          return t2 == Gn || t2 == tt ? n2.size : Me(n2).length;
        }
        function Of(n2, t2, r2) {
          var e2 = bh(n2) ? h : lu;
          return r2 && Ui(n2, t2, r2) && (t2 = X), e2(n2, mi(t2, 3));
        }
        function If(n2, t2) {
          if ("function" != typeof t2) throw new pl(en);
          return n2 = kc(n2), function() {
            if (--n2 < 1) return t2.apply(this, arguments);
          };
        }
        function Rf(n2, t2, r2) {
          return t2 = r2 ? X : t2, t2 = n2 && null == t2 ? n2.length : t2, ai(n2, mn, X, X, X, X, t2);
        }
        function zf(n2, t2) {
          var r2;
          if ("function" != typeof t2) throw new pl(en);
          return n2 = kc(n2), function() {
            return --n2 > 0 && (r2 = t2.apply(this, arguments)), n2 <= 1 && (t2 = X), r2;
          };
        }
        function Ef(n2, t2, r2) {
          t2 = r2 ? X : t2;
          var e2 = ai(n2, yn, X, X, X, X, X, t2);
          return e2.placeholder = Ef.placeholder, e2;
        }
        function Sf(n2, t2, r2) {
          t2 = r2 ? X : t2;
          var e2 = ai(n2, dn, X, X, X, X, X, t2);
          return e2.placeholder = Sf.placeholder, e2;
        }
        function Wf(n2, t2, r2) {
          function e2(t3) {
            var r3 = h2, e3 = p3;
            return h2 = p3 = X, d2 = t3, v2 = n2.apply(e3, r3);
          }
          function u2(n3) {
            return d2 = n3, g2 = Ws(f2, t2), b2 ? e2(n3) : v2;
          }
          function i2(n3) {
            var r3 = n3 - y2, e3 = n3 - d2, u3 = t2 - r3;
            return w2 ? Hl(u3, _2 - e3) : u3;
          }
          function o2(n3) {
            var r3 = n3 - y2, e3 = n3 - d2;
            return y2 === X || r3 >= t2 || r3 < 0 || w2 && e3 >= _2;
          }
          function f2() {
            var n3 = fh();
            return o2(n3) ? c2(n3) : (g2 = Ws(f2, i2(n3)), X);
          }
          function c2(n3) {
            return g2 = X, m2 && h2 ? e2(n3) : (h2 = p3 = X, v2);
          }
          function a2() {
            g2 !== X && As(g2), d2 = 0, h2 = y2 = p3 = g2 = X;
          }
          function l2() {
            return g2 === X ? v2 : c2(fh());
          }
          function s2() {
            var n3 = fh(), r3 = o2(n3);
            if (h2 = arguments, p3 = this, y2 = n3, r3) {
              if (g2 === X) return u2(y2);
              if (w2) return As(g2), g2 = Ws(f2, t2), e2(y2);
            }
            return g2 === X && (g2 = Ws(f2, t2)), v2;
          }
          var h2, p3, _2, v2, g2, y2, d2 = 0, b2 = false, w2 = false, m2 = true;
          if ("function" != typeof n2) throw new pl(en);
          return t2 = Ic(t2) || 0, fc(r2) && (b2 = !!r2.leading, w2 = "maxWait" in r2, _2 = w2 ? Gl(Ic(r2.maxWait) || 0, t2) : _2, m2 = "trailing" in r2 ? !!r2.trailing : m2), s2.cancel = a2, s2.flush = l2, s2;
        }
        function Lf(n2) {
          return ai(n2, jn);
        }
        function Cf(n2, t2) {
          if ("function" != typeof n2 || null != t2 && "function" != typeof t2) throw new pl(en);
          var r2 = function() {
            var e2 = arguments, u2 = t2 ? t2.apply(this, e2) : e2[0], i2 = r2.cache;
            if (i2.has(u2)) return i2.get(u2);
            var o2 = n2.apply(this, e2);
            return r2.cache = i2.set(u2, o2) || i2, o2;
          };
          return r2.cache = new (Cf.Cache || sr2)(), r2;
        }
        function Uf(n2) {
          if ("function" != typeof n2) throw new pl(en);
          return function() {
            var t2 = arguments;
            switch (t2.length) {
              case 0:
                return !n2.call(this);
              case 1:
                return !n2.call(this, t2[0]);
              case 2:
                return !n2.call(this, t2[0], t2[1]);
              case 3:
                return !n2.call(this, t2[0], t2[1], t2[2]);
            }
            return !n2.apply(this, t2);
          };
        }
        function Bf(n2) {
          return zf(2, n2);
        }
        function Tf(n2, t2) {
          if ("function" != typeof n2) throw new pl(en);
          return t2 = t2 === X ? t2 : kc(t2), uu(n2, t2);
        }
        function $f(t2, r2) {
          if ("function" != typeof t2) throw new pl(en);
          return r2 = null == r2 ? 0 : Gl(kc(r2), 0), uu(function(e2) {
            var u2 = e2[r2], i2 = Ou(e2, 0, r2);
            return u2 && a(i2, u2), n(t2, this, i2);
          });
        }
        function Df(n2, t2, r2) {
          var e2 = true, u2 = true;
          if ("function" != typeof n2) throw new pl(en);
          return fc(r2) && (e2 = "leading" in r2 ? !!r2.leading : e2, u2 = "trailing" in r2 ? !!r2.trailing : u2), Wf(n2, t2, { leading: e2, maxWait: t2, trailing: u2 });
        }
        function Mf(n2) {
          return Rf(n2, 1);
        }
        function Ff(n2, t2) {
          return ph(Au(t2), n2);
        }
        function Nf() {
          if (!arguments.length) return [];
          var n2 = arguments[0];
          return bh(n2) ? n2 : [n2];
        }
        function Pf(n2) {
          return Fr2(n2, sn);
        }
        function qf(n2, t2) {
          return t2 = "function" == typeof t2 ? t2 : X, Fr2(n2, sn, t2);
        }
        function Zf(n2) {
          return Fr2(n2, an | sn);
        }
        function Kf(n2, t2) {
          return t2 = "function" == typeof t2 ? t2 : X, Fr2(n2, an | sn, t2);
        }
        function Vf(n2, t2) {
          return null == t2 || Pr2(n2, t2, Pc(t2));
        }
        function Gf(n2, t2) {
          return n2 === t2 || n2 !== n2 && t2 !== t2;
        }
        function Hf(n2) {
          return null != n2 && oc(n2.length) && !uc(n2);
        }
        function Jf(n2) {
          return cc(n2) && Hf(n2);
        }
        function Yf(n2) {
          return n2 === true || n2 === false || cc(n2) && we(n2) == Nn;
        }
        function Qf(n2) {
          return cc(n2) && 1 === n2.nodeType && !gc(n2);
        }
        function Xf(n2) {
          if (null == n2) return true;
          if (Hf(n2) && (bh(n2) || "string" == typeof n2 || "function" == typeof n2.splice || mh(n2) || Oh(n2) || dh(n2))) return !n2.length;
          var t2 = zs(n2);
          if (t2 == Gn || t2 == tt) return !n2.size;
          if (Mi(n2)) return !Me(n2).length;
          for (var r2 in n2) if (bl.call(n2, r2)) return false;
          return true;
        }
        function nc(n2, t2) {
          return Se(n2, t2);
        }
        function tc(n2, t2, r2) {
          r2 = "function" == typeof r2 ? r2 : X;
          var e2 = r2 ? r2(n2, t2) : X;
          return e2 === X ? Se(n2, t2, X, r2) : !!e2;
        }
        function rc(n2) {
          if (!cc(n2)) return false;
          var t2 = we(n2);
          return t2 == Zn || t2 == qn || "string" == typeof n2.message && "string" == typeof n2.name && !gc(n2);
        }
        function ec(n2) {
          return "number" == typeof n2 && Zl(n2);
        }
        function uc(n2) {
          if (!fc(n2)) return false;
          var t2 = we(n2);
          return t2 == Kn || t2 == Vn || t2 == Fn || t2 == Xn;
        }
        function ic(n2) {
          return "number" == typeof n2 && n2 == kc(n2);
        }
        function oc(n2) {
          return "number" == typeof n2 && n2 > -1 && n2 % 1 == 0 && n2 <= Wn;
        }
        function fc(n2) {
          var t2 = typeof n2;
          return null != n2 && ("object" == t2 || "function" == t2);
        }
        function cc(n2) {
          return null != n2 && "object" == typeof n2;
        }
        function ac(n2, t2) {
          return n2 === t2 || Ce(n2, t2, ji(t2));
        }
        function lc(n2, t2, r2) {
          return r2 = "function" == typeof r2 ? r2 : X, Ce(n2, t2, ji(t2), r2);
        }
        function sc(n2) {
          return vc(n2) && n2 != +n2;
        }
        function hc(n2) {
          if (Es(n2)) throw new fl(rn);
          return Ue(n2);
        }
        function pc(n2) {
          return null === n2;
        }
        function _c(n2) {
          return null == n2;
        }
        function vc(n2) {
          return "number" == typeof n2 || cc(n2) && we(n2) == Hn;
        }
        function gc(n2) {
          if (!cc(n2) || we(n2) != Yn) return false;
          var t2 = El(n2);
          if (null === t2) return true;
          var r2 = bl.call(t2, "constructor") && t2.constructor;
          return "function" == typeof r2 && r2 instanceof r2 && dl.call(r2) == jl;
        }
        function yc(n2) {
          return ic(n2) && n2 >= -Wn && n2 <= Wn;
        }
        function dc(n2) {
          return "string" == typeof n2 || !bh(n2) && cc(n2) && we(n2) == rt;
        }
        function bc(n2) {
          return "symbol" == typeof n2 || cc(n2) && we(n2) == et;
        }
        function wc(n2) {
          return n2 === X;
        }
        function mc(n2) {
          return cc(n2) && zs(n2) == it;
        }
        function xc(n2) {
          return cc(n2) && we(n2) == ot;
        }
        function jc(n2) {
          if (!n2) return [];
          if (Hf(n2)) return dc(n2) ? G(n2) : Tu(n2);
          if (Ul && n2[Ul]) return D(n2[Ul]());
          var t2 = zs(n2);
          return (t2 == Gn ? M : t2 == tt ? P : ra)(n2);
        }
        function Ac(n2) {
          if (!n2) return 0 === n2 ? n2 : 0;
          if (n2 = Ic(n2), n2 === Sn || n2 === -Sn) {
            return (n2 < 0 ? -1 : 1) * Ln;
          }
          return n2 === n2 ? n2 : 0;
        }
        function kc(n2) {
          var t2 = Ac(n2), r2 = t2 % 1;
          return t2 === t2 ? r2 ? t2 - r2 : t2 : 0;
        }
        function Oc(n2) {
          return n2 ? Mr2(kc(n2), 0, Un) : 0;
        }
        function Ic(n2) {
          if ("number" == typeof n2) return n2;
          if (bc(n2)) return Cn;
          if (fc(n2)) {
            var t2 = "function" == typeof n2.valueOf ? n2.valueOf() : n2;
            n2 = fc(t2) ? t2 + "" : t2;
          }
          if ("string" != typeof n2) return 0 === n2 ? n2 : +n2;
          n2 = R(n2);
          var r2 = qt.test(n2);
          return r2 || Kt.test(n2) ? Xr(n2.slice(2), r2 ? 2 : 8) : Pt.test(n2) ? Cn : +n2;
        }
        function Rc(n2) {
          return $u(n2, qc(n2));
        }
        function zc(n2) {
          return n2 ? Mr2(kc(n2), -Wn, Wn) : 0 === n2 ? n2 : 0;
        }
        function Ec(n2) {
          return null == n2 ? "" : vu(n2);
        }
        function Sc(n2, t2) {
          var r2 = gs(n2);
          return null == t2 ? r2 : Cr2(r2, t2);
        }
        function Wc(n2, t2) {
          return v(n2, mi(t2, 3), ue2);
        }
        function Lc(n2, t2) {
          return v(n2, mi(t2, 3), oe2);
        }
        function Cc(n2, t2) {
          return null == n2 ? n2 : bs(n2, mi(t2, 3), qc);
        }
        function Uc(n2, t2) {
          return null == n2 ? n2 : ws(n2, mi(t2, 3), qc);
        }
        function Bc(n2, t2) {
          return n2 && ue2(n2, mi(t2, 3));
        }
        function Tc(n2, t2) {
          return n2 && oe2(n2, mi(t2, 3));
        }
        function $c(n2) {
          return null == n2 ? [] : fe2(n2, Pc(n2));
        }
        function Dc(n2) {
          return null == n2 ? [] : fe2(n2, qc(n2));
        }
        function Mc(n2, t2, r2) {
          var e2 = null == n2 ? X : _e2(n2, t2);
          return e2 === X ? r2 : e2;
        }
        function Fc(n2, t2) {
          return null != n2 && Ri(n2, t2, xe);
        }
        function Nc(n2, t2) {
          return null != n2 && Ri(n2, t2, je);
        }
        function Pc(n2) {
          return Hf(n2) ? Or2(n2) : Me(n2);
        }
        function qc(n2) {
          return Hf(n2) ? Or2(n2, true) : Fe(n2);
        }
        function Zc(n2, t2) {
          var r2 = {};
          return t2 = mi(t2, 3), ue2(n2, function(n3, e2, u2) {
            Br2(r2, t2(n3, e2, u2), n3);
          }), r2;
        }
        function Kc(n2, t2) {
          var r2 = {};
          return t2 = mi(t2, 3), ue2(n2, function(n3, e2, u2) {
            Br2(r2, e2, t2(n3, e2, u2));
          }), r2;
        }
        function Vc(n2, t2) {
          return Gc(n2, Uf(mi(t2)));
        }
        function Gc(n2, t2) {
          if (null == n2) return {};
          var r2 = c(di(n2), function(n3) {
            return [n3];
          });
          return t2 = mi(t2), Ye(n2, r2, function(n3, r3) {
            return t2(n3, r3[0]);
          });
        }
        function Hc(n2, t2, r2) {
          t2 = ku(t2, n2);
          var e2 = -1, u2 = t2.length;
          for (u2 || (u2 = 1, n2 = X); ++e2 < u2; ) {
            var i2 = null == n2 ? X : n2[no(t2[e2])];
            i2 === X && (e2 = u2, i2 = r2), n2 = uc(i2) ? i2.call(n2) : i2;
          }
          return n2;
        }
        function Jc(n2, t2, r2) {
          return null == n2 ? n2 : fu(n2, t2, r2);
        }
        function Yc(n2, t2, r2, e2) {
          return e2 = "function" == typeof e2 ? e2 : X, null == n2 ? n2 : fu(n2, t2, r2, e2);
        }
        function Qc(n2, t2, e2) {
          var u2 = bh(n2), i2 = u2 || mh(n2) || Oh(n2);
          if (t2 = mi(t2, 4), null == e2) {
            var o2 = n2 && n2.constructor;
            e2 = i2 ? u2 ? new o2() : [] : fc(n2) && uc(o2) ? gs(El(n2)) : {};
          }
          return (i2 ? r : ue2)(n2, function(n3, r2, u3) {
            return t2(e2, n3, r2, u3);
          }), e2;
        }
        function Xc(n2, t2) {
          return null == n2 || yu(n2, t2);
        }
        function na(n2, t2, r2) {
          return null == n2 ? n2 : du(n2, t2, Au(r2));
        }
        function ta(n2, t2, r2, e2) {
          return e2 = "function" == typeof e2 ? e2 : X, null == n2 ? n2 : du(n2, t2, Au(r2), e2);
        }
        function ra(n2) {
          return null == n2 ? [] : E(n2, Pc(n2));
        }
        function ea(n2) {
          return null == n2 ? [] : E(n2, qc(n2));
        }
        function ua(n2, t2, r2) {
          return r2 === X && (r2 = t2, t2 = X), r2 !== X && (r2 = Ic(r2), r2 = r2 === r2 ? r2 : 0), t2 !== X && (t2 = Ic(t2), t2 = t2 === t2 ? t2 : 0), Mr2(Ic(n2), t2, r2);
        }
        function ia(n2, t2, r2) {
          return t2 = Ac(t2), r2 === X ? (r2 = t2, t2 = 0) : r2 = Ac(r2), n2 = Ic(n2), Ae(n2, t2, r2);
        }
        function oa(n2, t2, r2) {
          if (r2 && "boolean" != typeof r2 && Ui(n2, t2, r2) && (t2 = r2 = X), r2 === X && ("boolean" == typeof t2 ? (r2 = t2, t2 = X) : "boolean" == typeof n2 && (r2 = n2, n2 = X)), n2 === X && t2 === X ? (n2 = 0, t2 = 1) : (n2 = Ac(n2), t2 === X ? (t2 = n2, n2 = 0) : t2 = Ac(t2)), n2 > t2) {
            var e2 = n2;
            n2 = t2, t2 = e2;
          }
          if (r2 || n2 % 1 || t2 % 1) {
            var u2 = Ql();
            return Hl(n2 + u2 * (t2 - n2 + Qr("1e-" + ((u2 + "").length - 1))), t2);
          }
          return tu(n2, t2);
        }
        function fa(n2) {
          return Qh(Ec(n2).toLowerCase());
        }
        function ca(n2) {
          return n2 = Ec(n2), n2 && n2.replace(Gt, ve).replace(Dr, "");
        }
        function aa(n2, t2, r2) {
          n2 = Ec(n2), t2 = vu(t2);
          var e2 = n2.length;
          r2 = r2 === X ? e2 : Mr2(kc(r2), 0, e2);
          var u2 = r2;
          return r2 -= t2.length, r2 >= 0 && n2.slice(r2, u2) == t2;
        }
        function la(n2) {
          return n2 = Ec(n2), n2 && At.test(n2) ? n2.replace(xt, ge) : n2;
        }
        function sa(n2) {
          return n2 = Ec(n2), n2 && Wt.test(n2) ? n2.replace(St, "\\$&") : n2;
        }
        function ha(n2, t2, r2) {
          n2 = Ec(n2), t2 = kc(t2);
          var e2 = t2 ? V(n2) : 0;
          if (!t2 || e2 >= t2) return n2;
          var u2 = (t2 - e2) / 2;
          return ri(Nl(u2), r2) + n2 + ri(Fl(u2), r2);
        }
        function pa(n2, t2, r2) {
          n2 = Ec(n2), t2 = kc(t2);
          var e2 = t2 ? V(n2) : 0;
          return t2 && e2 < t2 ? n2 + ri(t2 - e2, r2) : n2;
        }
        function _a(n2, t2, r2) {
          n2 = Ec(n2), t2 = kc(t2);
          var e2 = t2 ? V(n2) : 0;
          return t2 && e2 < t2 ? ri(t2 - e2, r2) + n2 : n2;
        }
        function va(n2, t2, r2) {
          return r2 || null == t2 ? t2 = 0 : t2 && (t2 = +t2), Yl(Ec(n2).replace(Lt, ""), t2 || 0);
        }
        function ga(n2, t2, r2) {
          return t2 = (r2 ? Ui(n2, t2, r2) : t2 === X) ? 1 : kc(t2), eu(Ec(n2), t2);
        }
        function ya() {
          var n2 = arguments, t2 = Ec(n2[0]);
          return n2.length < 3 ? t2 : t2.replace(n2[1], n2[2]);
        }
        function da(n2, t2, r2) {
          return r2 && "number" != typeof r2 && Ui(n2, t2, r2) && (t2 = r2 = X), (r2 = r2 === X ? Un : r2 >>> 0) ? (n2 = Ec(n2), n2 && ("string" == typeof t2 || null != t2 && !Ah(t2)) && (t2 = vu(t2), !t2 && T(n2)) ? Ou(G(n2), 0, r2) : n2.split(t2, r2)) : [];
        }
        function ba(n2, t2, r2) {
          return n2 = Ec(n2), r2 = null == r2 ? 0 : Mr2(kc(r2), 0, n2.length), t2 = vu(t2), n2.slice(r2, r2 + t2.length) == t2;
        }
        function wa(n2, t2, r2) {
          var e2 = Z2.templateSettings;
          r2 && Ui(n2, t2, r2) && (t2 = X), n2 = Ec(n2), t2 = Sh({}, t2, e2, li);
          var u2, i2, o2 = Sh({}, t2.imports, e2.imports, li), f2 = Pc(o2), c2 = E(o2, f2), a2 = 0, l2 = t2.interpolate || Ht, s2 = "__p += '", h2 = sl((t2.escape || Ht).source + "|" + l2.source + "|" + (l2 === It ? Ft : Ht).source + "|" + (t2.evaluate || Ht).source + "|$", "g"), p3 = "//# sourceURL=" + (bl.call(t2, "sourceURL") ? (t2.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Zr + "]") + "\n";
          n2.replace(h2, function(t3, r3, e3, o3, f3, c3) {
            return e3 || (e3 = o3), s2 += n2.slice(a2, c3).replace(Jt, U), r3 && (u2 = true, s2 += "' +\n__e(" + r3 + ") +\n'"), f3 && (i2 = true, s2 += "';\n" + f3 + ";\n__p += '"), e3 && (s2 += "' +\n((__t = (" + e3 + ")) == null ? '' : __t) +\n'"), a2 = c3 + t3.length, t3;
          }), s2 += "';\n";
          var _2 = bl.call(t2, "variable") && t2.variable;
          if (_2) {
            if (Dt.test(_2)) throw new fl(un);
          } else s2 = "with (obj) {\n" + s2 + "\n}\n";
          s2 = (i2 ? s2.replace(dt, "") : s2).replace(bt, "$1").replace(wt, "$1;"), s2 = "function(" + (_2 || "obj") + ") {\n" + (_2 ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (u2 ? ", __e = _.escape" : "") + (i2 ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + s2 + "return __p\n}";
          var v2 = Xh(function() {
            return cl(f2, p3 + "return " + s2).apply(X, c2);
          });
          if (v2.source = s2, rc(v2)) throw v2;
          return v2;
        }
        function ma(n2) {
          return Ec(n2).toLowerCase();
        }
        function xa(n2) {
          return Ec(n2).toUpperCase();
        }
        function ja(n2, t2, r2) {
          if (n2 = Ec(n2), n2 && (r2 || t2 === X)) return R(n2);
          if (!n2 || !(t2 = vu(t2))) return n2;
          var e2 = G(n2), u2 = G(t2);
          return Ou(e2, W(e2, u2), L(e2, u2) + 1).join("");
        }
        function Aa(n2, t2, r2) {
          if (n2 = Ec(n2), n2 && (r2 || t2 === X)) return n2.slice(0, H(n2) + 1);
          if (!n2 || !(t2 = vu(t2))) return n2;
          var e2 = G(n2);
          return Ou(e2, 0, L(e2, G(t2)) + 1).join("");
        }
        function ka(n2, t2, r2) {
          if (n2 = Ec(n2), n2 && (r2 || t2 === X)) return n2.replace(Lt, "");
          if (!n2 || !(t2 = vu(t2))) return n2;
          var e2 = G(n2);
          return Ou(e2, W(e2, G(t2))).join("");
        }
        function Oa(n2, t2) {
          var r2 = An, e2 = kn;
          if (fc(t2)) {
            var u2 = "separator" in t2 ? t2.separator : u2;
            r2 = "length" in t2 ? kc(t2.length) : r2, e2 = "omission" in t2 ? vu(t2.omission) : e2;
          }
          n2 = Ec(n2);
          var i2 = n2.length;
          if (T(n2)) {
            var o2 = G(n2);
            i2 = o2.length;
          }
          if (r2 >= i2) return n2;
          var f2 = r2 - V(e2);
          if (f2 < 1) return e2;
          var c2 = o2 ? Ou(o2, 0, f2).join("") : n2.slice(0, f2);
          if (u2 === X) return c2 + e2;
          if (o2 && (f2 += c2.length - f2), Ah(u2)) {
            if (n2.slice(f2).search(u2)) {
              var a2, l2 = c2;
              for (u2.global || (u2 = sl(u2.source, Ec(Nt.exec(u2)) + "g")), u2.lastIndex = 0; a2 = u2.exec(l2); ) var s2 = a2.index;
              c2 = c2.slice(0, s2 === X ? f2 : s2);
            }
          } else if (n2.indexOf(vu(u2), f2) != f2) {
            var h2 = c2.lastIndexOf(u2);
            h2 > -1 && (c2 = c2.slice(0, h2));
          }
          return c2 + e2;
        }
        function Ia(n2) {
          return n2 = Ec(n2), n2 && jt.test(n2) ? n2.replace(mt, ye) : n2;
        }
        function Ra(n2, t2, r2) {
          return n2 = Ec(n2), t2 = r2 ? X : t2, t2 === X ? $(n2) ? Q(n2) : _(n2) : n2.match(t2) || [];
        }
        function za(t2) {
          var r2 = null == t2 ? 0 : t2.length, e2 = mi();
          return t2 = r2 ? c(t2, function(n2) {
            if ("function" != typeof n2[1]) throw new pl(en);
            return [e2(n2[0]), n2[1]];
          }) : [], uu(function(e3) {
            for (var u2 = -1; ++u2 < r2; ) {
              var i2 = t2[u2];
              if (n(i2[0], this, e3)) return n(i2[1], this, e3);
            }
          });
        }
        function Ea(n2) {
          return Nr2(Fr2(n2, an));
        }
        function Sa(n2) {
          return function() {
            return n2;
          };
        }
        function Wa(n2, t2) {
          return null == n2 || n2 !== n2 ? t2 : n2;
        }
        function La(n2) {
          return n2;
        }
        function Ca(n2) {
          return De("function" == typeof n2 ? n2 : Fr2(n2, an));
        }
        function Ua(n2) {
          return qe(Fr2(n2, an));
        }
        function Ba(n2, t2) {
          return Ze(n2, Fr2(t2, an));
        }
        function Ta(n2, t2, e2) {
          var u2 = Pc(t2), i2 = fe2(t2, u2);
          null != e2 || fc(t2) && (i2.length || !u2.length) || (e2 = t2, t2 = n2, n2 = this, i2 = fe2(t2, Pc(t2)));
          var o2 = !(fc(e2) && "chain" in e2 && !e2.chain), f2 = uc(n2);
          return r(i2, function(r2) {
            var e3 = t2[r2];
            n2[r2] = e3, f2 && (n2.prototype[r2] = function() {
              var t3 = this.__chain__;
              if (o2 || t3) {
                var r3 = n2(this.__wrapped__);
                return (r3.__actions__ = Tu(this.__actions__)).push({ func: e3, args: arguments, thisArg: n2 }), r3.__chain__ = t3, r3;
              }
              return e3.apply(n2, a([this.value()], arguments));
            });
          }), n2;
        }
        function $a() {
          return re._ === this && (re._ = Al), this;
        }
        function Da() {
        }
        function Ma(n2) {
          return n2 = kc(n2), uu(function(t2) {
            return Ge(t2, n2);
          });
        }
        function Fa(n2) {
          return Bi(n2) ? m(no(n2)) : Qe(n2);
        }
        function Na(n2) {
          return function(t2) {
            return null == n2 ? X : _e2(n2, t2);
          };
        }
        function Pa() {
          return [];
        }
        function qa() {
          return false;
        }
        function Za() {
          return {};
        }
        function Ka() {
          return "";
        }
        function Va() {
          return true;
        }
        function Ga(n2, t2) {
          if (n2 = kc(n2), n2 < 1 || n2 > Wn) return [];
          var r2 = Un, e2 = Hl(n2, Un);
          t2 = mi(t2), n2 -= Un;
          for (var u2 = O(e2, t2); ++r2 < n2; ) t2(r2);
          return u2;
        }
        function Ha(n2) {
          return bh(n2) ? c(n2, no) : bc(n2) ? [n2] : Tu(Cs(Ec(n2)));
        }
        function Ja(n2) {
          var t2 = ++wl;
          return Ec(n2) + t2;
        }
        function Ya(n2) {
          return n2 && n2.length ? Yr2(n2, La, me) : X;
        }
        function Qa(n2, t2) {
          return n2 && n2.length ? Yr2(n2, mi(t2, 2), me) : X;
        }
        function Xa(n2) {
          return w(n2, La);
        }
        function nl(n2, t2) {
          return w(n2, mi(t2, 2));
        }
        function tl(n2) {
          return n2 && n2.length ? Yr2(n2, La, Ne) : X;
        }
        function rl(n2, t2) {
          return n2 && n2.length ? Yr2(n2, mi(t2, 2), Ne) : X;
        }
        function el(n2) {
          return n2 && n2.length ? k(n2, La) : 0;
        }
        function ul(n2, t2) {
          return n2 && n2.length ? k(n2, mi(t2, 2)) : 0;
        }
        x2 = null == x2 ? re : be.defaults(re.Object(), x2, be.pick(re, qr));
        var il = x2.Array, ol = x2.Date, fl = x2.Error, cl = x2.Function, al = x2.Math, ll = x2.Object, sl = x2.RegExp, hl = x2.String, pl = x2.TypeError, _l = il.prototype, vl = cl.prototype, gl = ll.prototype, yl = x2["__core-js_shared__"], dl = vl.toString, bl = gl.hasOwnProperty, wl = 0, ml = function() {
          var n2 = /[^.]+$/.exec(yl && yl.keys && yl.keys.IE_PROTO || "");
          return n2 ? "Symbol(src)_1." + n2 : "";
        }(), xl = gl.toString, jl = dl.call(ll), Al = re._, kl = sl("^" + dl.call(bl).replace(St, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), Ol = ie ? x2.Buffer : X, Il = x2.Symbol, Rl = x2.Uint8Array, zl = Ol ? Ol.allocUnsafe : X, El = F(ll.getPrototypeOf, ll), Sl = ll.create, Wl = gl.propertyIsEnumerable, Ll = _l.splice, Cl = Il ? Il.isConcatSpreadable : X, Ul = Il ? Il.iterator : X, Bl = Il ? Il.toStringTag : X, Tl = function() {
          try {
            var n2 = Ai(ll, "defineProperty");
            return n2({}, "", {}), n2;
          } catch (n3) {
          }
        }(), $l = x2.clearTimeout !== re.clearTimeout && x2.clearTimeout, Dl = ol && ol.now !== re.Date.now && ol.now, Ml = x2.setTimeout !== re.setTimeout && x2.setTimeout, Fl = al.ceil, Nl = al.floor, Pl = ll.getOwnPropertySymbols, ql = Ol ? Ol.isBuffer : X, Zl = x2.isFinite, Kl = _l.join, Vl = F(ll.keys, ll), Gl = al.max, Hl = al.min, Jl = ol.now, Yl = x2.parseInt, Ql = al.random, Xl = _l.reverse, ns = Ai(x2, "DataView"), ts = Ai(x2, "Map"), rs = Ai(x2, "Promise"), es = Ai(x2, "Set"), us = Ai(x2, "WeakMap"), is = Ai(ll, "create"), os = us && new us(), fs = {}, cs = to(ns), as = to(ts), ls = to(rs), ss = to(es), hs = to(us), ps = Il ? Il.prototype : X, _s = ps ? ps.valueOf : X, vs = ps ? ps.toString : X, gs = /* @__PURE__ */ function() {
          function n2() {
          }
          return function(t2) {
            if (!fc(t2)) return {};
            if (Sl) return Sl(t2);
            n2.prototype = t2;
            var r2 = new n2();
            return n2.prototype = X, r2;
          };
        }();
        Z2.templateSettings = { escape: kt, evaluate: Ot, interpolate: It, variable: "", imports: { _: Z2 } }, Z2.prototype = J2.prototype, Z2.prototype.constructor = Z2, Y2.prototype = gs(J2.prototype), Y2.prototype.constructor = Y2, Ct2.prototype = gs(J2.prototype), Ct2.prototype.constructor = Ct2, Xt2.prototype.clear = nr2, Xt2.prototype.delete = tr2, Xt2.prototype.get = rr2, Xt2.prototype.has = er2, Xt2.prototype.set = ur2, ir2.prototype.clear = or2, ir2.prototype.delete = fr2, ir2.prototype.get = cr2, ir2.prototype.has = ar2, ir2.prototype.set = lr2, sr2.prototype.clear = hr2, sr2.prototype.delete = pr2, sr2.prototype.get = _r2, sr2.prototype.has = vr2, sr2.prototype.set = gr2, yr2.prototype.add = yr2.prototype.push = dr2, yr2.prototype.has = br2, wr2.prototype.clear = mr2, wr2.prototype.delete = xr2, wr2.prototype.get = jr2, wr2.prototype.has = Ar2, wr2.prototype.set = kr2;
        var ys = Pu(ue2), ds = Pu(oe2, true), bs = qu(), ws = qu(true), ms = os ? function(n2, t2) {
          return os.set(n2, t2), n2;
        } : La, xs = Tl ? function(n2, t2) {
          return Tl(n2, "toString", {
            configurable: true,
            enumerable: false,
            value: Sa(t2),
            writable: true
          });
        } : La, js = uu, As = $l || function(n2) {
          return re.clearTimeout(n2);
        }, ks = es && 1 / P(new es([, -0]))[1] == Sn ? function(n2) {
          return new es(n2);
        } : Da, Os = os ? function(n2) {
          return os.get(n2);
        } : Da, Is = Pl ? function(n2) {
          return null == n2 ? [] : (n2 = ll(n2), i(Pl(n2), function(t2) {
            return Wl.call(n2, t2);
          }));
        } : Pa, Rs = Pl ? function(n2) {
          for (var t2 = []; n2; ) a(t2, Is(n2)), n2 = El(n2);
          return t2;
        } : Pa, zs = we;
        (ns && zs(new ns(new ArrayBuffer(1))) != ct || ts && zs(new ts()) != Gn || rs && zs(rs.resolve()) != Qn || es && zs(new es()) != tt || us && zs(new us()) != it) && (zs = function(n2) {
          var t2 = we(n2), r2 = t2 == Yn ? n2.constructor : X, e2 = r2 ? to(r2) : "";
          if (e2) switch (e2) {
            case cs:
              return ct;
            case as:
              return Gn;
            case ls:
              return Qn;
            case ss:
              return tt;
            case hs:
              return it;
          }
          return t2;
        });
        var Es = yl ? uc : qa, Ss = Qi(ms), Ws = Ml || function(n2, t2) {
          return re.setTimeout(n2, t2);
        }, Ls = Qi(xs), Cs = Pi(function(n2) {
          var t2 = [];
          return 46 === n2.charCodeAt(0) && t2.push(""), n2.replace(Et, function(n3, r2, e2, u2) {
            t2.push(e2 ? u2.replace(Mt, "$1") : r2 || n3);
          }), t2;
        }), Us = uu(function(n2, t2) {
          return Jf(n2) ? Hr2(n2, ee2(t2, 1, Jf, true)) : [];
        }), Bs = uu(function(n2, t2) {
          var r2 = jo(t2);
          return Jf(r2) && (r2 = X), Jf(n2) ? Hr2(n2, ee2(t2, 1, Jf, true), mi(r2, 2)) : [];
        }), Ts = uu(function(n2, t2) {
          var r2 = jo(t2);
          return Jf(r2) && (r2 = X), Jf(n2) ? Hr2(n2, ee2(t2, 1, Jf, true), X, r2) : [];
        }), $s = uu(function(n2) {
          var t2 = c(n2, ju);
          return t2.length && t2[0] === n2[0] ? ke(t2) : [];
        }), Ds = uu(function(n2) {
          var t2 = jo(n2), r2 = c(n2, ju);
          return t2 === jo(r2) ? t2 = X : r2.pop(), r2.length && r2[0] === n2[0] ? ke(r2, mi(t2, 2)) : [];
        }), Ms = uu(function(n2) {
          var t2 = jo(n2), r2 = c(n2, ju);
          return t2 = "function" == typeof t2 ? t2 : X, t2 && r2.pop(), r2.length && r2[0] === n2[0] ? ke(r2, X, t2) : [];
        }), Fs = uu(Oo), Ns = gi(function(n2, t2) {
          var r2 = null == n2 ? 0 : n2.length, e2 = Tr2(n2, t2);
          return nu(n2, c(t2, function(n3) {
            return Ci(n3, r2) ? +n3 : n3;
          }).sort(Lu)), e2;
        }), Ps = uu(function(n2) {
          return gu(ee2(n2, 1, Jf, true));
        }), qs = uu(function(n2) {
          var t2 = jo(n2);
          return Jf(t2) && (t2 = X), gu(ee2(n2, 1, Jf, true), mi(t2, 2));
        }), Zs = uu(function(n2) {
          var t2 = jo(n2);
          return t2 = "function" == typeof t2 ? t2 : X, gu(ee2(n2, 1, Jf, true), X, t2);
        }), Ks = uu(function(n2, t2) {
          return Jf(n2) ? Hr2(n2, t2) : [];
        }), Vs = uu(function(n2) {
          return mu(i(n2, Jf));
        }), Gs = uu(function(n2) {
          var t2 = jo(n2);
          return Jf(t2) && (t2 = X), mu(i(n2, Jf), mi(t2, 2));
        }), Hs = uu(function(n2) {
          var t2 = jo(n2);
          return t2 = "function" == typeof t2 ? t2 : X, mu(i(n2, Jf), X, t2);
        }), Js = uu(Go), Ys = uu(function(n2) {
          var t2 = n2.length, r2 = t2 > 1 ? n2[t2 - 1] : X;
          return r2 = "function" == typeof r2 ? (n2.pop(), r2) : X, Ho(n2, r2);
        }), Qs = gi(function(n2) {
          var t2 = n2.length, r2 = t2 ? n2[0] : 0, e2 = this.__wrapped__, u2 = function(t3) {
            return Tr2(t3, n2);
          };
          return !(t2 > 1 || this.__actions__.length) && e2 instanceof Ct2 && Ci(r2) ? (e2 = e2.slice(r2, +r2 + (t2 ? 1 : 0)), e2.__actions__.push({ func: nf, args: [u2], thisArg: X }), new Y2(e2, this.__chain__).thru(function(n3) {
            return t2 && !n3.length && n3.push(X), n3;
          })) : this.thru(u2);
        }), Xs = Fu(function(n2, t2, r2) {
          bl.call(n2, r2) ? ++n2[r2] : Br2(n2, r2, 1);
        }), nh = Ju(ho), th = Ju(po), rh = Fu(function(n2, t2, r2) {
          bl.call(n2, r2) ? n2[r2].push(t2) : Br2(n2, r2, [t2]);
        }), eh = uu(function(t2, r2, e2) {
          var u2 = -1, i2 = "function" == typeof r2, o2 = Hf(t2) ? il(t2.length) : [];
          return ys(t2, function(t3) {
            o2[++u2] = i2 ? n(r2, t3, e2) : Ie(t3, r2, e2);
          }), o2;
        }), uh = Fu(function(n2, t2, r2) {
          Br2(n2, r2, t2);
        }), ih = Fu(function(n2, t2, r2) {
          n2[r2 ? 0 : 1].push(t2);
        }, function() {
          return [[], []];
        }), oh = uu(function(n2, t2) {
          if (null == n2) return [];
          var r2 = t2.length;
          return r2 > 1 && Ui(n2, t2[0], t2[1]) ? t2 = [] : r2 > 2 && Ui(t2[0], t2[1], t2[2]) && (t2 = [t2[0]]), He(n2, ee2(t2, 1), []);
        }), fh = Dl || function() {
          return re.Date.now();
        }, ch = uu(function(n2, t2, r2) {
          var e2 = _n;
          if (r2.length) {
            var u2 = N(r2, wi(ch));
            e2 |= bn;
          }
          return ai(n2, e2, t2, r2, u2);
        }), ah = uu(function(n2, t2, r2) {
          var e2 = _n | vn;
          if (r2.length) {
            var u2 = N(r2, wi(ah));
            e2 |= bn;
          }
          return ai(t2, e2, n2, r2, u2);
        }), lh = uu(function(n2, t2) {
          return Gr2(n2, 1, t2);
        }), sh = uu(function(n2, t2, r2) {
          return Gr2(n2, Ic(t2) || 0, r2);
        });
        Cf.Cache = sr2;
        var hh = js(function(t2, r2) {
          r2 = 1 == r2.length && bh(r2[0]) ? c(r2[0], z(mi())) : c(ee2(r2, 1), z(mi()));
          var e2 = r2.length;
          return uu(function(u2) {
            for (var i2 = -1, o2 = Hl(u2.length, e2); ++i2 < o2; ) u2[i2] = r2[i2].call(this, u2[i2]);
            return n(t2, this, u2);
          });
        }), ph = uu(function(n2, t2) {
          return ai(n2, bn, X, t2, N(t2, wi(ph)));
        }), _h = uu(function(n2, t2) {
          return ai(n2, wn, X, t2, N(t2, wi(_h)));
        }), vh = gi(function(n2, t2) {
          return ai(n2, xn, X, X, X, t2);
        }), gh = ii(me), yh = ii(function(n2, t2) {
          return n2 >= t2;
        }), dh = Re(/* @__PURE__ */ function() {
          return arguments;
        }()) ? Re : function(n2) {
          return cc(n2) && bl.call(n2, "callee") && !Wl.call(n2, "callee");
        }, bh = il.isArray, wh = ce ? z(ce) : ze, mh = ql || qa, xh = ae ? z(ae) : Ee, jh = le ? z(le) : Le, Ah = se ? z(se) : Be, kh = he ? z(he) : Te, Oh = pe ? z(pe) : $e, Ih = ii(Ne), Rh = ii(function(n2, t2) {
          return n2 <= t2;
        }), zh = Nu(function(n2, t2) {
          if (Mi(t2) || Hf(t2)) return $u(t2, Pc(t2), n2), X;
          for (var r2 in t2) bl.call(t2, r2) && Sr2(n2, r2, t2[r2]);
        }), Eh = Nu(function(n2, t2) {
          $u(t2, qc(t2), n2);
        }), Sh = Nu(function(n2, t2, r2, e2) {
          $u(t2, qc(t2), n2, e2);
        }), Wh = Nu(function(n2, t2, r2, e2) {
          $u(t2, Pc(t2), n2, e2);
        }), Lh = gi(Tr2), Ch = uu(function(n2, t2) {
          n2 = ll(n2);
          var r2 = -1, e2 = t2.length, u2 = e2 > 2 ? t2[2] : X;
          for (u2 && Ui(t2[0], t2[1], u2) && (e2 = 1); ++r2 < e2; ) for (var i2 = t2[r2], o2 = qc(i2), f2 = -1, c2 = o2.length; ++f2 < c2; ) {
            var a2 = o2[f2], l2 = n2[a2];
            (l2 === X || Gf(l2, gl[a2]) && !bl.call(n2, a2)) && (n2[a2] = i2[a2]);
          }
          return n2;
        }), Uh = uu(function(t2) {
          return t2.push(X, si), n(Mh, X, t2);
        }), Bh = Xu(function(n2, t2, r2) {
          null != t2 && "function" != typeof t2.toString && (t2 = xl.call(t2)), n2[t2] = r2;
        }, Sa(La)), Th = Xu(function(n2, t2, r2) {
          null != t2 && "function" != typeof t2.toString && (t2 = xl.call(t2)), bl.call(n2, t2) ? n2[t2].push(r2) : n2[t2] = [r2];
        }, mi), $h = uu(Ie), Dh = Nu(function(n2, t2, r2) {
          Ke(n2, t2, r2);
        }), Mh = Nu(function(n2, t2, r2, e2) {
          Ke(n2, t2, r2, e2);
        }), Fh = gi(function(n2, t2) {
          var r2 = {};
          if (null == n2) return r2;
          var e2 = false;
          t2 = c(t2, function(t3) {
            return t3 = ku(t3, n2), e2 || (e2 = t3.length > 1), t3;
          }), $u(n2, di(n2), r2), e2 && (r2 = Fr2(r2, an | ln | sn, hi));
          for (var u2 = t2.length; u2--; ) yu(r2, t2[u2]);
          return r2;
        }), Nh = gi(function(n2, t2) {
          return null == n2 ? {} : Je(n2, t2);
        }), Ph = ci(Pc), qh = ci(qc), Zh = Vu(function(n2, t2, r2) {
          return t2 = t2.toLowerCase(), n2 + (r2 ? fa(t2) : t2);
        }), Kh = Vu(function(n2, t2, r2) {
          return n2 + (r2 ? "-" : "") + t2.toLowerCase();
        }), Vh = Vu(function(n2, t2, r2) {
          return n2 + (r2 ? " " : "") + t2.toLowerCase();
        }), Gh = Ku("toLowerCase"), Hh = Vu(function(n2, t2, r2) {
          return n2 + (r2 ? "_" : "") + t2.toLowerCase();
        }), Jh = Vu(function(n2, t2, r2) {
          return n2 + (r2 ? " " : "") + Qh(t2);
        }), Yh = Vu(function(n2, t2, r2) {
          return n2 + (r2 ? " " : "") + t2.toUpperCase();
        }), Qh = Ku("toUpperCase"), Xh = uu(function(t2, r2) {
          try {
            return n(t2, X, r2);
          } catch (n2) {
            return rc(n2) ? n2 : new fl(n2);
          }
        }), np = gi(function(n2, t2) {
          return r(t2, function(t3) {
            t3 = no(t3), Br2(n2, t3, ch(n2[t3], n2));
          }), n2;
        }), tp = Yu(), rp = Yu(true), ep = uu(function(n2, t2) {
          return function(r2) {
            return Ie(r2, n2, t2);
          };
        }), up = uu(function(n2, t2) {
          return function(r2) {
            return Ie(n2, r2, t2);
          };
        }), ip = ti(c), op = ti(u), fp = ti(h), cp = ui(), ap = ui(true), lp = ni(function(n2, t2) {
          return n2 + t2;
        }, 0), sp = fi("ceil"), hp = ni(function(n2, t2) {
          return n2 / t2;
        }, 1), pp = fi("floor"), _p = ni(function(n2, t2) {
          return n2 * t2;
        }, 1), vp = fi("round"), gp = ni(function(n2, t2) {
          return n2 - t2;
        }, 0);
        return Z2.after = If, Z2.ary = Rf, Z2.assign = zh, Z2.assignIn = Eh, Z2.assignInWith = Sh, Z2.assignWith = Wh, Z2.at = Lh, Z2.before = zf, Z2.bind = ch, Z2.bindAll = np, Z2.bindKey = ah, Z2.castArray = Nf, Z2.chain = Qo, Z2.chunk = uo, Z2.compact = io, Z2.concat = oo, Z2.cond = za, Z2.conforms = Ea, Z2.constant = Sa, Z2.countBy = Xs, Z2.create = Sc, Z2.curry = Ef, Z2.curryRight = Sf, Z2.debounce = Wf, Z2.defaults = Ch, Z2.defaultsDeep = Uh, Z2.defer = lh, Z2.delay = sh, Z2.difference = Us, Z2.differenceBy = Bs, Z2.differenceWith = Ts, Z2.drop = fo, Z2.dropRight = co, Z2.dropRightWhile = ao, Z2.dropWhile = lo, Z2.fill = so, Z2.filter = lf, Z2.flatMap = sf, Z2.flatMapDeep = hf, Z2.flatMapDepth = pf, Z2.flatten = _o, Z2.flattenDeep = vo, Z2.flattenDepth = go, Z2.flip = Lf, Z2.flow = tp, Z2.flowRight = rp, Z2.fromPairs = yo, Z2.functions = $c, Z2.functionsIn = Dc, Z2.groupBy = rh, Z2.initial = mo, Z2.intersection = $s, Z2.intersectionBy = Ds, Z2.intersectionWith = Ms, Z2.invert = Bh, Z2.invertBy = Th, Z2.invokeMap = eh, Z2.iteratee = Ca, Z2.keyBy = uh, Z2.keys = Pc, Z2.keysIn = qc, Z2.map = yf, Z2.mapKeys = Zc, Z2.mapValues = Kc, Z2.matches = Ua, Z2.matchesProperty = Ba, Z2.memoize = Cf, Z2.merge = Dh, Z2.mergeWith = Mh, Z2.method = ep, Z2.methodOf = up, Z2.mixin = Ta, Z2.negate = Uf, Z2.nthArg = Ma, Z2.omit = Fh, Z2.omitBy = Vc, Z2.once = Bf, Z2.orderBy = df, Z2.over = ip, Z2.overArgs = hh, Z2.overEvery = op, Z2.overSome = fp, Z2.partial = ph, Z2.partialRight = _h, Z2.partition = ih, Z2.pick = Nh, Z2.pickBy = Gc, Z2.property = Fa, Z2.propertyOf = Na, Z2.pull = Fs, Z2.pullAll = Oo, Z2.pullAllBy = Io, Z2.pullAllWith = Ro, Z2.pullAt = Ns, Z2.range = cp, Z2.rangeRight = ap, Z2.rearg = vh, Z2.reject = mf, Z2.remove = zo, Z2.rest = Tf, Z2.reverse = Eo, Z2.sampleSize = jf, Z2.set = Jc, Z2.setWith = Yc, Z2.shuffle = Af, Z2.slice = So, Z2.sortBy = oh, Z2.sortedUniq = $o, Z2.sortedUniqBy = Do, Z2.split = da, Z2.spread = $f, Z2.tail = Mo, Z2.take = Fo, Z2.takeRight = No, Z2.takeRightWhile = Po, Z2.takeWhile = qo, Z2.tap = Xo, Z2.throttle = Df, Z2.thru = nf, Z2.toArray = jc, Z2.toPairs = Ph, Z2.toPairsIn = qh, Z2.toPath = Ha, Z2.toPlainObject = Rc, Z2.transform = Qc, Z2.unary = Mf, Z2.union = Ps, Z2.unionBy = qs, Z2.unionWith = Zs, Z2.uniq = Zo, Z2.uniqBy = Ko, Z2.uniqWith = Vo, Z2.unset = Xc, Z2.unzip = Go, Z2.unzipWith = Ho, Z2.update = na, Z2.updateWith = ta, Z2.values = ra, Z2.valuesIn = ea, Z2.without = Ks, Z2.words = Ra, Z2.wrap = Ff, Z2.xor = Vs, Z2.xorBy = Gs, Z2.xorWith = Hs, Z2.zip = Js, Z2.zipObject = Jo, Z2.zipObjectDeep = Yo, Z2.zipWith = Ys, Z2.entries = Ph, Z2.entriesIn = qh, Z2.extend = Eh, Z2.extendWith = Sh, Ta(Z2, Z2), Z2.add = lp, Z2.attempt = Xh, Z2.camelCase = Zh, Z2.capitalize = fa, Z2.ceil = sp, Z2.clamp = ua, Z2.clone = Pf, Z2.cloneDeep = Zf, Z2.cloneDeepWith = Kf, Z2.cloneWith = qf, Z2.conformsTo = Vf, Z2.deburr = ca, Z2.defaultTo = Wa, Z2.divide = hp, Z2.endsWith = aa, Z2.eq = Gf, Z2.escape = la, Z2.escapeRegExp = sa, Z2.every = af, Z2.find = nh, Z2.findIndex = ho, Z2.findKey = Wc, Z2.findLast = th, Z2.findLastIndex = po, Z2.findLastKey = Lc, Z2.floor = pp, Z2.forEach = _f, Z2.forEachRight = vf, Z2.forIn = Cc, Z2.forInRight = Uc, Z2.forOwn = Bc, Z2.forOwnRight = Tc, Z2.get = Mc, Z2.gt = gh, Z2.gte = yh, Z2.has = Fc, Z2.hasIn = Nc, Z2.head = bo, Z2.identity = La, Z2.includes = gf, Z2.indexOf = wo, Z2.inRange = ia, Z2.invoke = $h, Z2.isArguments = dh, Z2.isArray = bh, Z2.isArrayBuffer = wh, Z2.isArrayLike = Hf, Z2.isArrayLikeObject = Jf, Z2.isBoolean = Yf, Z2.isBuffer = mh, Z2.isDate = xh, Z2.isElement = Qf, Z2.isEmpty = Xf, Z2.isEqual = nc, Z2.isEqualWith = tc, Z2.isError = rc, Z2.isFinite = ec, Z2.isFunction = uc, Z2.isInteger = ic, Z2.isLength = oc, Z2.isMap = jh, Z2.isMatch = ac, Z2.isMatchWith = lc, Z2.isNaN = sc, Z2.isNative = hc, Z2.isNil = _c, Z2.isNull = pc, Z2.isNumber = vc, Z2.isObject = fc, Z2.isObjectLike = cc, Z2.isPlainObject = gc, Z2.isRegExp = Ah, Z2.isSafeInteger = yc, Z2.isSet = kh, Z2.isString = dc, Z2.isSymbol = bc, Z2.isTypedArray = Oh, Z2.isUndefined = wc, Z2.isWeakMap = mc, Z2.isWeakSet = xc, Z2.join = xo, Z2.kebabCase = Kh, Z2.last = jo, Z2.lastIndexOf = Ao, Z2.lowerCase = Vh, Z2.lowerFirst = Gh, Z2.lt = Ih, Z2.lte = Rh, Z2.max = Ya, Z2.maxBy = Qa, Z2.mean = Xa, Z2.meanBy = nl, Z2.min = tl, Z2.minBy = rl, Z2.stubArray = Pa, Z2.stubFalse = qa, Z2.stubObject = Za, Z2.stubString = Ka, Z2.stubTrue = Va, Z2.multiply = _p, Z2.nth = ko, Z2.noConflict = $a, Z2.noop = Da, Z2.now = fh, Z2.pad = ha, Z2.padEnd = pa, Z2.padStart = _a, Z2.parseInt = va, Z2.random = oa, Z2.reduce = bf, Z2.reduceRight = wf, Z2.repeat = ga, Z2.replace = ya, Z2.result = Hc, Z2.round = vp, Z2.runInContext = p2, Z2.sample = xf, Z2.size = kf, Z2.snakeCase = Hh, Z2.some = Of, Z2.sortedIndex = Wo, Z2.sortedIndexBy = Lo, Z2.sortedIndexOf = Co, Z2.sortedLastIndex = Uo, Z2.sortedLastIndexBy = Bo, Z2.sortedLastIndexOf = To, Z2.startCase = Jh, Z2.startsWith = ba, Z2.subtract = gp, Z2.sum = el, Z2.sumBy = ul, Z2.template = wa, Z2.times = Ga, Z2.toFinite = Ac, Z2.toInteger = kc, Z2.toLength = Oc, Z2.toLower = ma, Z2.toNumber = Ic, Z2.toSafeInteger = zc, Z2.toString = Ec, Z2.toUpper = xa, Z2.trim = ja, Z2.trimEnd = Aa, Z2.trimStart = ka, Z2.truncate = Oa, Z2.unescape = Ia, Z2.uniqueId = Ja, Z2.upperCase = Yh, Z2.upperFirst = Qh, Z2.each = _f, Z2.eachRight = vf, Z2.first = bo, Ta(Z2, function() {
          var n2 = {};
          return ue2(Z2, function(t2, r2) {
            bl.call(Z2.prototype, r2) || (n2[r2] = t2);
          }), n2;
        }(), { chain: false }), Z2.VERSION = nn, r(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(n2) {
          Z2[n2].placeholder = Z2;
        }), r(["drop", "take"], function(n2, t2) {
          Ct2.prototype[n2] = function(r2) {
            r2 = r2 === X ? 1 : Gl(kc(r2), 0);
            var e2 = this.__filtered__ && !t2 ? new Ct2(this) : this.clone();
            return e2.__filtered__ ? e2.__takeCount__ = Hl(r2, e2.__takeCount__) : e2.__views__.push({ size: Hl(r2, Un), type: n2 + (e2.__dir__ < 0 ? "Right" : "") }), e2;
          }, Ct2.prototype[n2 + "Right"] = function(t3) {
            return this.reverse()[n2](t3).reverse();
          };
        }), r(["filter", "map", "takeWhile"], function(n2, t2) {
          var r2 = t2 + 1, e2 = r2 == Rn || r2 == En;
          Ct2.prototype[n2] = function(n3) {
            var t3 = this.clone();
            return t3.__iteratees__.push({ iteratee: mi(n3, 3), type: r2 }), t3.__filtered__ = t3.__filtered__ || e2, t3;
          };
        }), r(["head", "last"], function(n2, t2) {
          var r2 = "take" + (t2 ? "Right" : "");
          Ct2.prototype[n2] = function() {
            return this[r2](1).value()[0];
          };
        }), r(["initial", "tail"], function(n2, t2) {
          var r2 = "drop" + (t2 ? "" : "Right");
          Ct2.prototype[n2] = function() {
            return this.__filtered__ ? new Ct2(this) : this[r2](1);
          };
        }), Ct2.prototype.compact = function() {
          return this.filter(La);
        }, Ct2.prototype.find = function(n2) {
          return this.filter(n2).head();
        }, Ct2.prototype.findLast = function(n2) {
          return this.reverse().find(n2);
        }, Ct2.prototype.invokeMap = uu(function(n2, t2) {
          return "function" == typeof n2 ? new Ct2(this) : this.map(function(r2) {
            return Ie(r2, n2, t2);
          });
        }), Ct2.prototype.reject = function(n2) {
          return this.filter(Uf(mi(n2)));
        }, Ct2.prototype.slice = function(n2, t2) {
          n2 = kc(n2);
          var r2 = this;
          return r2.__filtered__ && (n2 > 0 || t2 < 0) ? new Ct2(r2) : (n2 < 0 ? r2 = r2.takeRight(-n2) : n2 && (r2 = r2.drop(n2)), t2 !== X && (t2 = kc(t2), r2 = t2 < 0 ? r2.dropRight(-t2) : r2.take(t2 - n2)), r2);
        }, Ct2.prototype.takeRightWhile = function(n2) {
          return this.reverse().takeWhile(n2).reverse();
        }, Ct2.prototype.toArray = function() {
          return this.take(Un);
        }, ue2(Ct2.prototype, function(n2, t2) {
          var r2 = /^(?:filter|find|map|reject)|While$/.test(t2), e2 = /^(?:head|last)$/.test(t2), u2 = Z2[e2 ? "take" + ("last" == t2 ? "Right" : "") : t2], i2 = e2 || /^find/.test(t2);
          u2 && (Z2.prototype[t2] = function() {
            var t3 = this.__wrapped__, o2 = e2 ? [1] : arguments, f2 = t3 instanceof Ct2, c2 = o2[0], l2 = f2 || bh(t3), s2 = function(n3) {
              var t4 = u2.apply(Z2, a([n3], o2));
              return e2 && h2 ? t4[0] : t4;
            };
            l2 && r2 && "function" == typeof c2 && 1 != c2.length && (f2 = l2 = false);
            var h2 = this.__chain__, p3 = !!this.__actions__.length, _2 = i2 && !h2, v2 = f2 && !p3;
            if (!i2 && l2) {
              t3 = v2 ? t3 : new Ct2(this);
              var g2 = n2.apply(t3, o2);
              return g2.__actions__.push({ func: nf, args: [s2], thisArg: X }), new Y2(g2, h2);
            }
            return _2 && v2 ? n2.apply(this, o2) : (g2 = this.thru(s2), _2 ? e2 ? g2.value()[0] : g2.value() : g2);
          });
        }), r(["pop", "push", "shift", "sort", "splice", "unshift"], function(n2) {
          var t2 = _l[n2], r2 = /^(?:push|sort|unshift)$/.test(n2) ? "tap" : "thru", e2 = /^(?:pop|shift)$/.test(n2);
          Z2.prototype[n2] = function() {
            var n3 = arguments;
            if (e2 && !this.__chain__) {
              var u2 = this.value();
              return t2.apply(bh(u2) ? u2 : [], n3);
            }
            return this[r2](function(r3) {
              return t2.apply(bh(r3) ? r3 : [], n3);
            });
          };
        }), ue2(Ct2.prototype, function(n2, t2) {
          var r2 = Z2[t2];
          if (r2) {
            var e2 = r2.name + "";
            bl.call(fs, e2) || (fs[e2] = []), fs[e2].push({ name: t2, func: r2 });
          }
        }), fs[Qu(X, vn).name] = [{ name: "wrapper", func: X }], Ct2.prototype.clone = $t2, Ct2.prototype.reverse = Yt2, Ct2.prototype.value = Qt2, Z2.prototype.at = Qs, Z2.prototype.chain = tf, Z2.prototype.commit = rf, Z2.prototype.next = ef, Z2.prototype.plant = of, Z2.prototype.reverse = ff, Z2.prototype.toJSON = Z2.prototype.valueOf = Z2.prototype.value = cf, Z2.prototype.first = Z2.prototype.head, Ul && (Z2.prototype[Ul] = uf), Z2;
      }, be = de();
      "function" == typeof define && "object" == typeof define.amd && define.amd ? (re._ = be, define(function() {
        return be;
      })) : ue ? ((ue.exports = be)._ = be, ee._ = be) : re._ = be;
    }).call(exports);
  }
});

// node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp/_mapping.js
var require_mapping = __commonJS({
  "node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp/_mapping.js"(exports) {
    exports.aliasToReal = {
      // Lodash aliases.
      "each": "forEach",
      "eachRight": "forEachRight",
      "entries": "toPairs",
      "entriesIn": "toPairsIn",
      "extend": "assignIn",
      "extendAll": "assignInAll",
      "extendAllWith": "assignInAllWith",
      "extendWith": "assignInWith",
      "first": "head",
      // Methods that are curried variants of others.
      "conforms": "conformsTo",
      "matches": "isMatch",
      "property": "get",
      // Ramda aliases.
      "__": "placeholder",
      "F": "stubFalse",
      "T": "stubTrue",
      "all": "every",
      "allPass": "overEvery",
      "always": "constant",
      "any": "some",
      "anyPass": "overSome",
      "apply": "spread",
      "assoc": "set",
      "assocPath": "set",
      "complement": "negate",
      "compose": "flowRight",
      "contains": "includes",
      "dissoc": "unset",
      "dissocPath": "unset",
      "dropLast": "dropRight",
      "dropLastWhile": "dropRightWhile",
      "equals": "isEqual",
      "identical": "eq",
      "indexBy": "keyBy",
      "init": "initial",
      "invertObj": "invert",
      "juxt": "over",
      "omitAll": "omit",
      "nAry": "ary",
      "path": "get",
      "pathEq": "matchesProperty",
      "pathOr": "getOr",
      "paths": "at",
      "pickAll": "pick",
      "pipe": "flow",
      "pluck": "map",
      "prop": "get",
      "propEq": "matchesProperty",
      "propOr": "getOr",
      "props": "at",
      "symmetricDifference": "xor",
      "symmetricDifferenceBy": "xorBy",
      "symmetricDifferenceWith": "xorWith",
      "takeLast": "takeRight",
      "takeLastWhile": "takeRightWhile",
      "unapply": "rest",
      "unnest": "flatten",
      "useWith": "overArgs",
      "where": "conformsTo",
      "whereEq": "isMatch",
      "zipObj": "zipObject"
    };
    exports.aryMethod = {
      "1": [
        "assignAll",
        "assignInAll",
        "attempt",
        "castArray",
        "ceil",
        "create",
        "curry",
        "curryRight",
        "defaultsAll",
        "defaultsDeepAll",
        "floor",
        "flow",
        "flowRight",
        "fromPairs",
        "invert",
        "iteratee",
        "memoize",
        "method",
        "mergeAll",
        "methodOf",
        "mixin",
        "nthArg",
        "over",
        "overEvery",
        "overSome",
        "rest",
        "reverse",
        "round",
        "runInContext",
        "spread",
        "template",
        "trim",
        "trimEnd",
        "trimStart",
        "uniqueId",
        "words",
        "zipAll"
      ],
      "2": [
        "add",
        "after",
        "ary",
        "assign",
        "assignAllWith",
        "assignIn",
        "assignInAllWith",
        "at",
        "before",
        "bind",
        "bindAll",
        "bindKey",
        "chunk",
        "cloneDeepWith",
        "cloneWith",
        "concat",
        "conformsTo",
        "countBy",
        "curryN",
        "curryRightN",
        "debounce",
        "defaults",
        "defaultsDeep",
        "defaultTo",
        "delay",
        "difference",
        "divide",
        "drop",
        "dropRight",
        "dropRightWhile",
        "dropWhile",
        "endsWith",
        "eq",
        "every",
        "filter",
        "find",
        "findIndex",
        "findKey",
        "findLast",
        "findLastIndex",
        "findLastKey",
        "flatMap",
        "flatMapDeep",
        "flattenDepth",
        "forEach",
        "forEachRight",
        "forIn",
        "forInRight",
        "forOwn",
        "forOwnRight",
        "get",
        "groupBy",
        "gt",
        "gte",
        "has",
        "hasIn",
        "includes",
        "indexOf",
        "intersection",
        "invertBy",
        "invoke",
        "invokeMap",
        "isEqual",
        "isMatch",
        "join",
        "keyBy",
        "lastIndexOf",
        "lt",
        "lte",
        "map",
        "mapKeys",
        "mapValues",
        "matchesProperty",
        "maxBy",
        "meanBy",
        "merge",
        "mergeAllWith",
        "minBy",
        "multiply",
        "nth",
        "omit",
        "omitBy",
        "overArgs",
        "pad",
        "padEnd",
        "padStart",
        "parseInt",
        "partial",
        "partialRight",
        "partition",
        "pick",
        "pickBy",
        "propertyOf",
        "pull",
        "pullAll",
        "pullAt",
        "random",
        "range",
        "rangeRight",
        "rearg",
        "reject",
        "remove",
        "repeat",
        "restFrom",
        "result",
        "sampleSize",
        "some",
        "sortBy",
        "sortedIndex",
        "sortedIndexOf",
        "sortedLastIndex",
        "sortedLastIndexOf",
        "sortedUniqBy",
        "split",
        "spreadFrom",
        "startsWith",
        "subtract",
        "sumBy",
        "take",
        "takeRight",
        "takeRightWhile",
        "takeWhile",
        "tap",
        "throttle",
        "thru",
        "times",
        "trimChars",
        "trimCharsEnd",
        "trimCharsStart",
        "truncate",
        "union",
        "uniqBy",
        "uniqWith",
        "unset",
        "unzipWith",
        "without",
        "wrap",
        "xor",
        "zip",
        "zipObject",
        "zipObjectDeep"
      ],
      "3": [
        "assignInWith",
        "assignWith",
        "clamp",
        "differenceBy",
        "differenceWith",
        "findFrom",
        "findIndexFrom",
        "findLastFrom",
        "findLastIndexFrom",
        "getOr",
        "includesFrom",
        "indexOfFrom",
        "inRange",
        "intersectionBy",
        "intersectionWith",
        "invokeArgs",
        "invokeArgsMap",
        "isEqualWith",
        "isMatchWith",
        "flatMapDepth",
        "lastIndexOfFrom",
        "mergeWith",
        "orderBy",
        "padChars",
        "padCharsEnd",
        "padCharsStart",
        "pullAllBy",
        "pullAllWith",
        "rangeStep",
        "rangeStepRight",
        "reduce",
        "reduceRight",
        "replace",
        "set",
        "slice",
        "sortedIndexBy",
        "sortedLastIndexBy",
        "transform",
        "unionBy",
        "unionWith",
        "update",
        "xorBy",
        "xorWith",
        "zipWith"
      ],
      "4": [
        "fill",
        "setWith",
        "updateWith"
      ]
    };
    exports.aryRearg = {
      "2": [1, 0],
      "3": [2, 0, 1],
      "4": [3, 2, 0, 1]
    };
    exports.iterateeAry = {
      "dropRightWhile": 1,
      "dropWhile": 1,
      "every": 1,
      "filter": 1,
      "find": 1,
      "findFrom": 1,
      "findIndex": 1,
      "findIndexFrom": 1,
      "findKey": 1,
      "findLast": 1,
      "findLastFrom": 1,
      "findLastIndex": 1,
      "findLastIndexFrom": 1,
      "findLastKey": 1,
      "flatMap": 1,
      "flatMapDeep": 1,
      "flatMapDepth": 1,
      "forEach": 1,
      "forEachRight": 1,
      "forIn": 1,
      "forInRight": 1,
      "forOwn": 1,
      "forOwnRight": 1,
      "map": 1,
      "mapKeys": 1,
      "mapValues": 1,
      "partition": 1,
      "reduce": 2,
      "reduceRight": 2,
      "reject": 1,
      "remove": 1,
      "some": 1,
      "takeRightWhile": 1,
      "takeWhile": 1,
      "times": 1,
      "transform": 2
    };
    exports.iterateeRearg = {
      "mapKeys": [1],
      "reduceRight": [1, 0]
    };
    exports.methodRearg = {
      "assignInAllWith": [1, 0],
      "assignInWith": [1, 2, 0],
      "assignAllWith": [1, 0],
      "assignWith": [1, 2, 0],
      "differenceBy": [1, 2, 0],
      "differenceWith": [1, 2, 0],
      "getOr": [2, 1, 0],
      "intersectionBy": [1, 2, 0],
      "intersectionWith": [1, 2, 0],
      "isEqualWith": [1, 2, 0],
      "isMatchWith": [2, 1, 0],
      "mergeAllWith": [1, 0],
      "mergeWith": [1, 2, 0],
      "padChars": [2, 1, 0],
      "padCharsEnd": [2, 1, 0],
      "padCharsStart": [2, 1, 0],
      "pullAllBy": [2, 1, 0],
      "pullAllWith": [2, 1, 0],
      "rangeStep": [1, 2, 0],
      "rangeStepRight": [1, 2, 0],
      "setWith": [3, 1, 2, 0],
      "sortedIndexBy": [2, 1, 0],
      "sortedLastIndexBy": [2, 1, 0],
      "unionBy": [1, 2, 0],
      "unionWith": [1, 2, 0],
      "updateWith": [3, 1, 2, 0],
      "xorBy": [1, 2, 0],
      "xorWith": [1, 2, 0],
      "zipWith": [1, 2, 0]
    };
    exports.methodSpread = {
      "assignAll": { "start": 0 },
      "assignAllWith": { "start": 0 },
      "assignInAll": { "start": 0 },
      "assignInAllWith": { "start": 0 },
      "defaultsAll": { "start": 0 },
      "defaultsDeepAll": { "start": 0 },
      "invokeArgs": { "start": 2 },
      "invokeArgsMap": { "start": 2 },
      "mergeAll": { "start": 0 },
      "mergeAllWith": { "start": 0 },
      "partial": { "start": 1 },
      "partialRight": { "start": 1 },
      "without": { "start": 1 },
      "zipAll": { "start": 0 }
    };
    exports.mutate = {
      "array": {
        "fill": true,
        "pull": true,
        "pullAll": true,
        "pullAllBy": true,
        "pullAllWith": true,
        "pullAt": true,
        "remove": true,
        "reverse": true
      },
      "object": {
        "assign": true,
        "assignAll": true,
        "assignAllWith": true,
        "assignIn": true,
        "assignInAll": true,
        "assignInAllWith": true,
        "assignInWith": true,
        "assignWith": true,
        "defaults": true,
        "defaultsAll": true,
        "defaultsDeep": true,
        "defaultsDeepAll": true,
        "merge": true,
        "mergeAll": true,
        "mergeAllWith": true,
        "mergeWith": true
      },
      "set": {
        "set": true,
        "setWith": true,
        "unset": true,
        "update": true,
        "updateWith": true
      }
    };
    exports.realToAlias = function() {
      var hasOwnProperty = Object.prototype.hasOwnProperty, object = exports.aliasToReal, result = {};
      for (var key in object) {
        var value = object[key];
        if (hasOwnProperty.call(result, value)) {
          result[value].push(key);
        } else {
          result[value] = [key];
        }
      }
      return result;
    }();
    exports.remap = {
      "assignAll": "assign",
      "assignAllWith": "assignWith",
      "assignInAll": "assignIn",
      "assignInAllWith": "assignInWith",
      "curryN": "curry",
      "curryRightN": "curryRight",
      "defaultsAll": "defaults",
      "defaultsDeepAll": "defaultsDeep",
      "findFrom": "find",
      "findIndexFrom": "findIndex",
      "findLastFrom": "findLast",
      "findLastIndexFrom": "findLastIndex",
      "getOr": "get",
      "includesFrom": "includes",
      "indexOfFrom": "indexOf",
      "invokeArgs": "invoke",
      "invokeArgsMap": "invokeMap",
      "lastIndexOfFrom": "lastIndexOf",
      "mergeAll": "merge",
      "mergeAllWith": "mergeWith",
      "padChars": "pad",
      "padCharsEnd": "padEnd",
      "padCharsStart": "padStart",
      "propertyOf": "get",
      "rangeStep": "range",
      "rangeStepRight": "rangeRight",
      "restFrom": "rest",
      "spreadFrom": "spread",
      "trimChars": "trim",
      "trimCharsEnd": "trimEnd",
      "trimCharsStart": "trimStart",
      "zipAll": "zip"
    };
    exports.skipFixed = {
      "castArray": true,
      "flow": true,
      "flowRight": true,
      "iteratee": true,
      "mixin": true,
      "rearg": true,
      "runInContext": true
    };
    exports.skipRearg = {
      "add": true,
      "assign": true,
      "assignIn": true,
      "bind": true,
      "bindKey": true,
      "concat": true,
      "difference": true,
      "divide": true,
      "eq": true,
      "gt": true,
      "gte": true,
      "isEqual": true,
      "lt": true,
      "lte": true,
      "matchesProperty": true,
      "merge": true,
      "multiply": true,
      "overArgs": true,
      "partial": true,
      "partialRight": true,
      "propertyOf": true,
      "random": true,
      "range": true,
      "rangeRight": true,
      "subtract": true,
      "zip": true,
      "zipObject": true,
      "zipObjectDeep": true
    };
  }
});

// node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp/placeholder.js
var require_placeholder = __commonJS({
  "node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp/placeholder.js"(exports, module) {
    module.exports = {};
  }
});

// node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp/_baseConvert.js
var require_baseConvert = __commonJS({
  "node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp/_baseConvert.js"(exports, module) {
    var mapping = require_mapping();
    var fallbackHolder = require_placeholder();
    var push = Array.prototype.push;
    function baseArity(func, n) {
      return n == 2 ? function(a, b) {
        return func.apply(void 0, arguments);
      } : function(a) {
        return func.apply(void 0, arguments);
      };
    }
    function baseAry(func, n) {
      return n == 2 ? function(a, b) {
        return func(a, b);
      } : function(a) {
        return func(a);
      };
    }
    function cloneArray(array) {
      var length = array ? array.length : 0, result = Array(length);
      while (length--) {
        result[length] = array[length];
      }
      return result;
    }
    function createCloner(func) {
      return function(object) {
        return func({}, object);
      };
    }
    function flatSpread(func, start) {
      return function() {
        var length = arguments.length, lastIndex = length - 1, args = Array(length);
        while (length--) {
          args[length] = arguments[length];
        }
        var array = args[start], otherArgs = args.slice(0, start);
        if (array) {
          push.apply(otherArgs, array);
        }
        if (start != lastIndex) {
          push.apply(otherArgs, args.slice(start + 1));
        }
        return func.apply(this, otherArgs);
      };
    }
    function wrapImmutable(func, cloner) {
      return function() {
        var length = arguments.length;
        if (!length) {
          return;
        }
        var args = Array(length);
        while (length--) {
          args[length] = arguments[length];
        }
        var result = args[0] = cloner.apply(void 0, args);
        func.apply(void 0, args);
        return result;
      };
    }
    function baseConvert(util, name, func, options) {
      var isLib = typeof name == "function", isObj = name === Object(name);
      if (isObj) {
        options = func;
        func = name;
        name = void 0;
      }
      if (func == null) {
        throw new TypeError();
      }
      options || (options = {});
      var config = {
        "cap": "cap" in options ? options.cap : true,
        "curry": "curry" in options ? options.curry : true,
        "fixed": "fixed" in options ? options.fixed : true,
        "immutable": "immutable" in options ? options.immutable : true,
        "rearg": "rearg" in options ? options.rearg : true
      };
      var defaultHolder = isLib ? func : fallbackHolder, forceCurry = "curry" in options && options.curry, forceFixed = "fixed" in options && options.fixed, forceRearg = "rearg" in options && options.rearg, pristine = isLib ? func.runInContext() : void 0;
      var helpers = isLib ? func : {
        "ary": util.ary,
        "assign": util.assign,
        "clone": util.clone,
        "curry": util.curry,
        "forEach": util.forEach,
        "isArray": util.isArray,
        "isError": util.isError,
        "isFunction": util.isFunction,
        "isWeakMap": util.isWeakMap,
        "iteratee": util.iteratee,
        "keys": util.keys,
        "rearg": util.rearg,
        "toInteger": util.toInteger,
        "toPath": util.toPath
      };
      var ary = helpers.ary, assign = helpers.assign, clone = helpers.clone, curry = helpers.curry, each = helpers.forEach, isArray = helpers.isArray, isError = helpers.isError, isFunction = helpers.isFunction, isWeakMap = helpers.isWeakMap, keys = helpers.keys, rearg = helpers.rearg, toInteger = helpers.toInteger, toPath = helpers.toPath;
      var aryMethodKeys = keys(mapping.aryMethod);
      var wrappers = {
        "castArray": function(castArray) {
          return function() {
            var value = arguments[0];
            return isArray(value) ? castArray(cloneArray(value)) : castArray.apply(void 0, arguments);
          };
        },
        "iteratee": function(iteratee) {
          return function() {
            var func2 = arguments[0], arity = arguments[1], result = iteratee(func2, arity), length = result.length;
            if (config.cap && typeof arity == "number") {
              arity = arity > 2 ? arity - 2 : 1;
              return length && length <= arity ? result : baseAry(result, arity);
            }
            return result;
          };
        },
        "mixin": function(mixin) {
          return function(source) {
            var func2 = this;
            if (!isFunction(func2)) {
              return mixin(func2, Object(source));
            }
            var pairs2 = [];
            each(keys(source), function(key) {
              if (isFunction(source[key])) {
                pairs2.push([key, func2.prototype[key]]);
              }
            });
            mixin(func2, Object(source));
            each(pairs2, function(pair) {
              var value = pair[1];
              if (isFunction(value)) {
                func2.prototype[pair[0]] = value;
              } else {
                delete func2.prototype[pair[0]];
              }
            });
            return func2;
          };
        },
        "nthArg": function(nthArg) {
          return function(n) {
            var arity = n < 0 ? 1 : toInteger(n) + 1;
            return curry(nthArg(n), arity);
          };
        },
        "rearg": function(rearg2) {
          return function(func2, indexes) {
            var arity = indexes ? indexes.length : 0;
            return curry(rearg2(func2, indexes), arity);
          };
        },
        "runInContext": function(runInContext) {
          return function(context) {
            return baseConvert(util, runInContext(context), options);
          };
        }
      };
      function castCap(name2, func2) {
        if (config.cap) {
          var indexes = mapping.iterateeRearg[name2];
          if (indexes) {
            return iterateeRearg(func2, indexes);
          }
          var n = !isLib && mapping.iterateeAry[name2];
          if (n) {
            return iterateeAry(func2, n);
          }
        }
        return func2;
      }
      function castCurry(name2, func2, n) {
        return forceCurry || config.curry && n > 1 ? curry(func2, n) : func2;
      }
      function castFixed(name2, func2, n) {
        if (config.fixed && (forceFixed || !mapping.skipFixed[name2])) {
          var data = mapping.methodSpread[name2], start = data && data.start;
          return start === void 0 ? ary(func2, n) : flatSpread(func2, start);
        }
        return func2;
      }
      function castRearg(name2, func2, n) {
        return config.rearg && n > 1 && (forceRearg || !mapping.skipRearg[name2]) ? rearg(func2, mapping.methodRearg[name2] || mapping.aryRearg[n]) : func2;
      }
      function cloneByPath(object, path) {
        path = toPath(path);
        var index = -1, length = path.length, lastIndex = length - 1, result = clone(Object(object)), nested = result;
        while (nested != null && ++index < length) {
          var key = path[index], value = nested[key];
          if (value != null && !(isFunction(value) || isError(value) || isWeakMap(value))) {
            nested[key] = clone(index == lastIndex ? value : Object(value));
          }
          nested = nested[key];
        }
        return result;
      }
      function convertLib(options2) {
        return _.runInContext.convert(options2)(void 0);
      }
      function createConverter(name2, func2) {
        var realName = mapping.aliasToReal[name2] || name2, methodName = mapping.remap[realName] || realName, oldOptions = options;
        return function(options2) {
          var newUtil = isLib ? pristine : helpers, newFunc = isLib ? pristine[methodName] : func2, newOptions = assign(assign({}, oldOptions), options2);
          return baseConvert(newUtil, realName, newFunc, newOptions);
        };
      }
      function iterateeAry(func2, n) {
        return overArg(func2, function(func3) {
          return typeof func3 == "function" ? baseAry(func3, n) : func3;
        });
      }
      function iterateeRearg(func2, indexes) {
        return overArg(func2, function(func3) {
          var n = indexes.length;
          return baseArity(rearg(baseAry(func3, n), indexes), n);
        });
      }
      function overArg(func2, transform) {
        return function() {
          var length = arguments.length;
          if (!length) {
            return func2();
          }
          var args = Array(length);
          while (length--) {
            args[length] = arguments[length];
          }
          var index = config.rearg ? 0 : length - 1;
          args[index] = transform(args[index]);
          return func2.apply(void 0, args);
        };
      }
      function wrap(name2, func2, placeholder) {
        var result, realName = mapping.aliasToReal[name2] || name2, wrapped = func2, wrapper = wrappers[realName];
        if (wrapper) {
          wrapped = wrapper(func2);
        } else if (config.immutable) {
          if (mapping.mutate.array[realName]) {
            wrapped = wrapImmutable(func2, cloneArray);
          } else if (mapping.mutate.object[realName]) {
            wrapped = wrapImmutable(func2, createCloner(func2));
          } else if (mapping.mutate.set[realName]) {
            wrapped = wrapImmutable(func2, cloneByPath);
          }
        }
        each(aryMethodKeys, function(aryKey) {
          each(mapping.aryMethod[aryKey], function(otherName) {
            if (realName == otherName) {
              var data = mapping.methodSpread[realName], afterRearg = data && data.afterRearg;
              result = afterRearg ? castFixed(realName, castRearg(realName, wrapped, aryKey), aryKey) : castRearg(realName, castFixed(realName, wrapped, aryKey), aryKey);
              result = castCap(realName, result);
              result = castCurry(realName, result, aryKey);
              return false;
            }
          });
          return !result;
        });
        result || (result = wrapped);
        if (result == func2) {
          result = forceCurry ? curry(result, 1) : function() {
            return func2.apply(this, arguments);
          };
        }
        result.convert = createConverter(realName, func2);
        result.placeholder = func2.placeholder = placeholder;
        return result;
      }
      if (!isObj) {
        return wrap(name, func, defaultHolder);
      }
      var _ = func;
      var pairs = [];
      each(aryMethodKeys, function(aryKey) {
        each(mapping.aryMethod[aryKey], function(key) {
          var func2 = _[mapping.remap[key] || key];
          if (func2) {
            pairs.push([key, wrap(key, func2, _)]);
          }
        });
      });
      each(keys(_), function(key) {
        var func2 = _[key];
        if (typeof func2 == "function") {
          var length = pairs.length;
          while (length--) {
            if (pairs[length][0] == key) {
              return;
            }
          }
          func2.convert = createConverter(key, func2);
          pairs.push([key, func2]);
        }
      });
      each(pairs, function(pair) {
        _[pair[0]] = pair[1];
      });
      _.convert = convertLib;
      _.placeholder = _;
      each(keys(_), function(key) {
        each(mapping.realToAlias[key] || [], function(alias) {
          _[alias] = _[key];
        });
      });
      return _;
    }
    module.exports = baseConvert;
  }
});

// node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp.js
var require_fp = __commonJS({
  "node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp.js"(exports, module) {
    var _ = require_lodash_min().runInContext();
    module.exports = require_baseConvert()(_, _);
  }
});

// src/utils/mongoose.utils.ts
var import_sensible = __toESM(require_sensible(), 1);
var import_fp = __toESM(require_fp(), 1);
import {
  DOCUMENT_NOT_FOUND,
  EMPTY_BODY,
  INVALID_BODY,
  SUBARRAY_NOT_FOUND,
  SUBITEM_NOT_FOUND
} from "../mrq.errors.mjs";
import { model } from "./db.utils.mjs";
import { leanOptions } from "../mrq.config.mjs";
function runStaticMethods({
  Model,
  docs,
  query,
  req
}) {
  for (const staticMethodName in Model.schema.statics) {
    if (query.select[staticMethodName] !== 1) continue;
    for (const doc of docs)
      doc[staticMethodName] = Model.schema.statics[staticMethodName].call(
        Model,
        doc,
        { req, query }
      );
  }
}
async function useSession(Model, req, cb) {
  const query = req.query;
  const shouldUseSession = query.useSession === "true";
  if (!shouldUseSession) return cb();
  const session = await Model.startSession();
  const res = await cb(session);
  session.endSession();
  return res;
}
function getArrayFromBodyWithId(body) {
  if (!Array.isArray(body))
    throw import_sensible.httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should be an array`
    );
  if (!body.length)
    throw import_sensible.httpErrors.unprocessableEntity(
      `${EMPTY_BODY}: body should contain at least one object`
    );
  body = body.filter((doc) => doc._id);
  if (!body.length)
    throw import_sensible.httpErrors.unprocessableEntity(
      `${INVALID_BODY}: body should contain at least one object with _id`
    );
  return body;
}
async function getSubarray(req, modelName, subPathName_, useLean = false) {
  const Model = model(req, modelName);
  const { id } = req.params;
  const [subPathName] = subPathName_.split(":");
  const p = Model.findById(id, {}, { req }).select(subPathName);
  const doc = await (useLean ? p.lean(leanOptions) : p);
  if (!doc) throw import_sensible.httpErrors.notFound(DOCUMENT_NOT_FOUND);
  if (!doc[subPathName]) throw import_sensible.httpErrors.notFound(SUBARRAY_NOT_FOUND);
  return {
    Model,
    doc,
    subarray: doc[subPathName]
  };
}
async function getChildarray(req, modelName, fullPathName, useLean = false) {
  const Model = model(req, modelName);
  const { id, subId } = req.params;
  const [subPathName, childPathName] = fullPathName.split(":");
  const p = Model.find(
    {
      _id: id,
      [`${subPathName}._id`]: subId
    },
    {},
    { req }
  ).select(`
      ${subPathName}._id
      ${subPathName}.${childPathName}
    `);
  const [doc] = await (useLean ? p.lean(leanOptions) : p) ?? [];
  if (!doc) throw import_sensible.httpErrors.notFound(DOCUMENT_NOT_FOUND);
  const subitem = (0, import_fp.find)((subitem2) => subitem2._id.equals(subId), doc[subPathName]);
  if (!subitem) throw import_sensible.httpErrors.notFound(SUBITEM_NOT_FOUND);
  return {
    Model,
    doc,
    subitem,
    subarray: subitem[childPathName]
  };
}
export {
  getArrayFromBodyWithId,
  getChildarray,
  getSubarray,
  runStaticMethods,
  useSession
};
/*! Bundled license information:

forwarded/index.js:
  (*!
   * forwarded
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

media-typer/index.js:
  (*!
   * media-typer
   * Copyright(c) 2014 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

type-is/index.js:
  (*!
   * type-is
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2014-2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

depd/index.js:
  (*!
   * depd
   * Copyright(c) 2014-2018 Douglas Christopher Wilson
   * MIT Licensed
   *)

statuses/index.js:
  (*!
   * statuses
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

toidentifier/index.js:
  (*!
   * toidentifier
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

http-errors/index.js:
  (*!
   * http-errors
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

vary/index.js:
  (*!
   * vary
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

lodash/lodash.min.js:
  (**
   * @license
   * Lodash <https://lodash.com/>
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
//# sourceMappingURL=mongoose.utils.js.map
