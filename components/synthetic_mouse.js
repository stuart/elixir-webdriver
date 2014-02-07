var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    a.length || void 0 === b ? c = c[d] ? c[d] : c[d] = {} : c[d] = b
  }
};
goog.define = function(a, b) {
  var c = b;
  COMPILED || goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]);
  goog.exportPath_(a, c)
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(goog.DEPENDENCIES_ENABLED) {
    var d;
    a = a.replace(/\\/g, "/");
    for(var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if("complete" == b.readyState) {
      if(/\bdeps.js$/.test(a)) {
        return!1
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
    return!0
  }
  return!1
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for(var g in d.requires[e]) {
          if(!goog.isProvided_(g)) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e))
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
};
goog.isDef = function(a) {
  return void 0 !== a
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return"array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    a = a.split("-");
    for(var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.getMsgWithFallback = function(a, b) {
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() expects not to be running in strict mode. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
var fxdriver = {Timer:function() {
  this.timer = null
}};
fxdriver.Timer.prototype.setTimeout = function(a, b) {
  var c = Components.interfaces, d = b || 10;
  this.timer = Components.classes["@mozilla.org/timer;1"].createInstance(c.nsITimer);
  this.timer.initWithCallback({notify:function() {
    a.apply(null)
  }}, d, c.nsITimer.TYPE_ONE_SHOT)
};
fxdriver.Timer.prototype.runWhenTrue = function(a, b, c, d) {
  var e = c, f = this, g = function() {
    var c = a();
    0 <= e && !c ? (e -= 100, f.setTimeout(g, 100)) : 0 >= e ? d() : b(c)
  };
  g()
};
fxdriver.Timer.prototype.cancel = function() {
  this.timer && this.timer.cancel()
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
  for(var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift()
  }
  return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && (b < a.length && 0 < c) && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", n = RegExp("(\\d*)(\\D*)", "g"), q = RegExp("(\\d*)(\\D*)", "g");
    do {
      var l = n.exec(h) || ["", "", ""], r = q.exec(k) || ["", "", ""];
      if(0 == l[0].length && 0 == r[0].length) {
        break
      }
      var c = 0 == l[1].length ? 0 : parseInt(l[1], 10), p = 0 == r[1].length ? 0 : parseInt(r[1], 10), c = goog.string.compareElements_(c, p) || goog.string.compareElements_(0 == l[2].length, 0 == r[2].length) || goog.string.compareElements_(l[2], r[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
  return/^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
  a = a.split(b);
  for(var d = [];0 < c && a.length;) {
    d.push(a.shift()), c--
  }
  a.length && d.push(a.join(b));
  return d
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !0;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == a.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != a.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == b.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
  var a = goog.userAgent.getUserAgentString();
  goog.userAgent.detectedAndroid_ = !!a && 0 <= a.indexOf("Android");
  goog.userAgent.detectedIPhone_ = !!a && 0 <= a.indexOf("iPhone");
  goog.userAgent.detectedIPad_ = !!a && 0 <= a.indexOf("iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var a = goog.global.document;
  return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0
}();
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = !1;
goog.userAgent.product.ASSUME_CAMINO = !1;
goog.userAgent.product.ASSUME_IPHONE = !1;
goog.userAgent.product.ASSUME_IPAD = !1;
goog.userAgent.product.ASSUME_ANDROID = !1;
goog.userAgent.product.ASSUME_CHROME = !1;
goog.userAgent.product.ASSUME_SAFARI = !1;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_CAMINO || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.init_ = function() {
  goog.userAgent.product.detectedFirefox_ = !1;
  goog.userAgent.product.detectedCamino_ = !1;
  goog.userAgent.product.detectedIphone_ = !1;
  goog.userAgent.product.detectedIpad_ = !1;
  goog.userAgent.product.detectedAndroid_ = !1;
  goog.userAgent.product.detectedChrome_ = !1;
  goog.userAgent.product.detectedSafari_ = !1;
  var a = goog.userAgent.getUserAgentString();
  a && (-1 != a.indexOf("Firefox") ? goog.userAgent.product.detectedFirefox_ = !0 : -1 != a.indexOf("Camino") ? goog.userAgent.product.detectedCamino_ = !0 : -1 != a.indexOf("iPhone") || -1 != a.indexOf("iPod") ? goog.userAgent.product.detectedIphone_ = !0 : -1 != a.indexOf("iPad") ? goog.userAgent.product.detectedIpad_ = !0 : -1 != a.indexOf("Android") ? goog.userAgent.product.detectedAndroid_ = !0 : -1 != a.indexOf("Chrome") ? goog.userAgent.product.detectedChrome_ = !0 : -1 != a.indexOf("Safari") && 
  (goog.userAgent.product.detectedSafari_ = !0))
};
goog.userAgent.product.PRODUCT_KNOWN_ || goog.userAgent.product.init_();
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.userAgent.product.detectedFirefox_;
goog.userAgent.product.CAMINO = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CAMINO : goog.userAgent.product.detectedCamino_;
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.detectedIphone_;
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.userAgent.product.detectedIpad_;
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.userAgent.product.detectedAndroid_;
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.userAgent.product.detectedChrome_;
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.detectedSafari_;
goog.userAgent.product.determineVersion_ = function() {
  if(goog.userAgent.product.FIREFOX) {
    return goog.userAgent.product.getFirstRegExpGroup_(/Firefox\/([0-9.]+)/)
  }
  if(goog.userAgent.product.IE || goog.userAgent.product.OPERA) {
    return goog.userAgent.VERSION
  }
  if(goog.userAgent.product.CHROME) {
    return goog.userAgent.product.getFirstRegExpGroup_(/Chrome\/([0-9.]+)/)
  }
  if(goog.userAgent.product.SAFARI) {
    return goog.userAgent.product.getFirstRegExpGroup_(/Version\/([0-9.]+)/)
  }
  if(goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD) {
    var a = goog.userAgent.product.execRegExp_(/Version\/(\S+).*Mobile\/(\S+)/);
    if(a) {
      return a[1] + "." + a[2]
    }
  }else {
    if(goog.userAgent.product.ANDROID) {
      return(a = goog.userAgent.product.getFirstRegExpGroup_(/Android\s+([0-9.]+)/)) ? a : goog.userAgent.product.getFirstRegExpGroup_(/Version\/([0-9.]+)/)
    }
    if(goog.userAgent.product.CAMINO) {
      return goog.userAgent.product.getFirstRegExpGroup_(/Camino\/([0-9.]+)/)
    }
  }
  return""
};
goog.userAgent.product.getFirstRegExpGroup_ = function(a) {
  return(a = goog.userAgent.product.execRegExp_(a)) ? a[1] : ""
};
goog.userAgent.product.execRegExp_ = function(a) {
  return a.exec(goog.userAgent.getUserAgentString())
};
goog.userAgent.product.VERSION = goog.userAgent.product.determineVersion_();
goog.userAgent.product.isVersion = function(a) {
  return 0 <= goog.string.compareVersions(goog.userAgent.product.VERSION, a)
};
var bot = {userAgent:{}};
bot.userAgent.isEngineVersion = function(a) {
  return bot.userAgent.FIREFOX_EXTENSION ? bot.userAgent.FIREFOX_EXTENSION_IS_ENGINE_VERSION_(a) : goog.userAgent.IE ? 0 <= goog.string.compareVersions(goog.userAgent.DOCUMENT_MODE, a) : goog.userAgent.isVersionOrHigher(a)
};
bot.userAgent.isProductVersion = function(a) {
  return bot.userAgent.FIREFOX_EXTENSION ? bot.userAgent.FIREFOX_EXTENSION_IS_PRODUCT_VERSION_(a) : goog.userAgent.product.ANDROID ? 0 <= goog.string.compareVersions(bot.userAgent.ANDROID_VERSION_, a) : goog.userAgent.product.isVersion(a)
};
bot.userAgent.FIREFOX_EXTENSION = function() {
  if(!goog.userAgent.GECKO) {
    return!1
  }
  var a = goog.global.Components;
  if(!a) {
    return!1
  }
  try {
    if(!a.classes) {
      return!1
    }
  }catch(b) {
    return!1
  }
  var c = a.classes, a = a.interfaces, d = c["@mozilla.org/xpcom/version-comparator;1"].getService(a.nsIVersionComparator), c = c["@mozilla.org/xre/app-info;1"].getService(a.nsIXULAppInfo), e = c.platformVersion, f = c.version;
  bot.userAgent.FIREFOX_EXTENSION_IS_ENGINE_VERSION_ = function(a) {
    return 0 <= d.compare(e, "" + a)
  };
  bot.userAgent.FIREFOX_EXTENSION_IS_PRODUCT_VERSION_ = function(a) {
    return 0 <= d.compare(f, "" + a)
  };
  return!0
}();
bot.userAgent.IOS = goog.userAgent.product.IPAD || goog.userAgent.product.IPHONE;
bot.userAgent.MOBILE = bot.userAgent.IOS || goog.userAgent.product.ANDROID;
bot.userAgent.ANDROID_VERSION_ = function() {
  if(goog.userAgent.product.ANDROID) {
    var a = goog.userAgent.getUserAgentString();
    return(a = /Android\s+([0-9\.]+)/.exec(a)) ? a[1] : "0"
  }
  return"0"
}();
bot.userAgent.IE_DOC_PRE8 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8);
bot.userAgent.IE_DOC_9 = goog.userAgent.isDocumentModeOrHigher(9);
bot.userAgent.IE_DOC_PRE9 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9);
bot.userAgent.IE_DOC_10 = goog.userAgent.isDocumentModeOrHigher(10);
bot.userAgent.IE_DOC_PRE10 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(10);
bot.userAgent.ANDROID_PRE_GINGERBREAD = goog.userAgent.product.ANDROID && !bot.userAgent.isProductVersion(2.3);
fxdriver.files = {};
fxdriver.files.createTempFile = function(a, b) {
  for(var c = a || "", d = b || "", e = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile), f = !0, g;f;) {
    f = c + Math.round(Math.random() * (new Date).getTime()) + d, g = e.clone(), g.append(f), f = g.exists()
  }
  g.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 438);
  return new fxdriver.files.File(g)
};
fxdriver.files.getFile = function(a) {
  if(a) {
    return new fxdriver.files.File(fxdriver.files.getLocalFile_(a))
  }
};
fxdriver.files.getLocalFile_ = function(a) {
  var b = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile);
  b.initWithPath(a);
  b.exists() || b.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 438);
  return b
};
fxdriver.files.File = function(a) {
  this.nsIFile_ = a
};
fxdriver.files.APPEND_MODE_ = 18;
fxdriver.files.READ_MODE_ = 1;
fxdriver.files.File.prototype.append = function(a) {
  var b = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
  b.init(this.nsIFile_, fxdriver.files.APPEND_MODE_, 438, 0);
  var c = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
  c.init(b, "UTF-8", 0, 0);
  c.writeString(a);
  c.close();
  b.close()
};
fxdriver.files.File.prototype.read = function() {
  var a = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
  a.init(this.nsIFile_, fxdriver.files.READ_MODE_, 438, 0);
  var b = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
  b.init(a, "UTF-8", 1024, 0);
  for(var c = "", d = {};0 != b.readString(4096, d);) {
    c += d.value
  }
  b.close();
  a.close();
  return c
};
fxdriver.files.File.prototype.resetBuffer = function() {
  var a = this.nsIFile_.path;
  this.nsIFile_.remove(!0);
  this.nsIFile_ = fxdriver.files.getLocalFile_(a)
};
fxdriver.files.File.prototype.getFilePath = function() {
  return this.nsIFile_.path
};
fxdriver.prefs = {};
fxdriver.prefs.PREFS_ = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
fxdriver.prefs.getCharPref = function(a, b) {
  var c = fxdriver.prefs.PREFS_.prefHasUserValue(a) && fxdriver.prefs.PREFS_.getCharPref(a);
  c || (c = b);
  return c
};
fxdriver.prefs.setCharPref = function(a, b) {
  fxdriver.prefs.PREFS_.setCharPref(a, b)
};
fxdriver.prefs.getBoolPref = function(a, b) {
  var c = fxdriver.prefs.PREFS_.prefHasUserValue(a) && fxdriver.prefs.PREFS_.getBoolPref(a);
  c || (c = b);
  return c
};
fxdriver.prefs.setBoolPref = function(a, b) {
  fxdriver.prefs.PREFS_.setBoolPref(a, b)
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d
  }, c);
  return d
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, n;
    n = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < n ? f = k + 1 : (g = k, h = !n)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for(var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for(var e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for(var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b, c) {
  for(var d = {}, e = 0;e < a.length;e++) {
    var f = a[e], g = b.call(c, f, e, a);
    goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
  }
  return d
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e
  });
  return d
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if(0 > c * (f - e)) {
    return[]
  }
  if(0 < c) {
    for(a = e;a < f;a += c) {
      d.push(a)
    }
  }else {
    for(a = e;a > f;a += c) {
      d.push(a)
    }
  }
  return d
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now()
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(a) {
  this.relativeTimeStart_ = a
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now())
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_
};
goog.debug.Formatter = function(a) {
  this.prefix_ = a || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance()
};
goog.debug.Formatter.prototype.showAbsoluteTime = !0;
goog.debug.Formatter.prototype.showRelativeTime = !0;
goog.debug.Formatter.prototype.showLoggerName = !0;
goog.debug.Formatter.prototype.showExceptionText = !1;
goog.debug.Formatter.prototype.showSeverityLevel = !1;
goog.debug.Formatter.prototype.setStartTimeProvider = function(a) {
  this.startTimeProvider_ = a
};
goog.debug.Formatter.prototype.getStartTimeProvider = function() {
  return this.startTimeProvider_
};
goog.debug.Formatter.prototype.resetRelativeTimeStart = function() {
  this.startTimeProvider_.reset()
};
goog.debug.Formatter.getDateTimeStamp_ = function(a) {
  a = new Date(a.getMillis());
  return goog.debug.Formatter.getTwoDigitString_(a.getFullYear() - 2E3) + goog.debug.Formatter.getTwoDigitString_(a.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(a.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(a.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(a.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(a.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(a.getMilliseconds() / 10))
};
goog.debug.Formatter.getTwoDigitString_ = function(a) {
  return 10 > a ? "0" + a : String(a)
};
goog.debug.Formatter.getRelativeTime_ = function(a, b) {
  var c = (a.getMillis() - b) / 1E3, d = c.toFixed(3), e = 0;
  if(1 > c) {
    e = 2
  }else {
    for(;100 > c;) {
      e++, c *= 10
    }
  }
  for(;0 < e--;) {
    d = " " + d
  }
  return d
};
goog.debug.HtmlFormatter = function(a) {
  goog.debug.Formatter.call(this, a)
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = !0;
goog.debug.HtmlFormatter.prototype.formatRecord = function(a) {
  var b;
  switch(a.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      b = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      b = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      b = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      b = "dbg-i";
      break;
    default:
      b = "dbg-f"
  }
  var c = [];
  c.push(this.prefix_, " ");
  this.showAbsoluteTime && c.push("[", goog.debug.Formatter.getDateTimeStamp_(a), "] ");
  this.showRelativeTime && c.push("[", goog.string.whitespaceEscape(goog.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get())), "s] ");
  this.showLoggerName && c.push("[", goog.string.htmlEscape(a.getLoggerName()), "] ");
  this.showSeverityLevel && c.push("[", goog.string.htmlEscape(a.getLevel().name), "] ");
  c.push('<span class="', b, '">', goog.string.newLineToBr(goog.string.whitespaceEscape(goog.string.htmlEscape(a.getMessage()))));
  this.showExceptionText && a.getException() && c.push("<br>", goog.string.newLineToBr(goog.string.whitespaceEscape(a.getExceptionText() || "")));
  c.push("</span><br>");
  return c.join("")
};
goog.debug.TextFormatter = function(a) {
  goog.debug.Formatter.call(this, a)
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(a) {
  var b = [];
  b.push(this.prefix_, " ");
  this.showAbsoluteTime && b.push("[", goog.debug.Formatter.getDateTimeStamp_(a), "] ");
  this.showRelativeTime && b.push("[", goog.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get()), "s] ");
  this.showLoggerName && b.push("[", a.getLoggerName(), "] ");
  this.showSeverityLevel && b.push("[", a.getLevel().name, "] ");
  b.push(a.getMessage(), "\n");
  this.showExceptionText && a.getException() && b.push(a.getExceptionText(), "\n");
  return b.join("")
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && (a = a[d[c]], goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a)
};
goog.structs = {};
goog.structs.getCount = function(a) {
  return"function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
  if("function" == typeof a.getValues) {
    return a.getValues()
  }
  if(goog.isString(a)) {
    return a.split("")
  }
  if(goog.isArrayLike(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
  if("function" == typeof a.getKeys) {
    return a.getKeys()
  }
  if("function" != typeof a.getValues) {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      var b = [];
      a = a.length;
      for(var c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return goog.object.getKeys(a)
  }
};
goog.structs.contains = function(a, b) {
  return"function" == typeof a.contains ? a.contains(b) : "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
  return"function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c)
    }else {
      for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a)
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if("function" == typeof a.filter) {
    return a.filter(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      b.call(c, f[h], e[h], a) && (d[e[h]] = f[h])
    }
  }else {
    for(d = [], h = 0;h < g;h++) {
      b.call(c, f[h], void 0, a) && d.push(f[h])
    }
  }
  return d
};
goog.structs.map = function(a, b, c) {
  if("function" == typeof a.map) {
    return a.map(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      d[e[h]] = b.call(c, f[h], e[h], a)
    }
  }else {
    for(d = [], h = 0;h < g;h++) {
      d[h] = b.call(c, f[h], void 0, a)
    }
  }
  return d
};
goog.structs.some = function(a, b, c) {
  if("function" == typeof a.some) {
    return a.some(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(b.call(c, e[g], d && d[g], a)) {
      return!0
    }
  }
  return!1
};
goog.structs.every = function(a, b, c) {
  if("function" == typeof a.every) {
    return a.every(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(!b.call(c, e[g], d && d[g], a)) {
      return!1
    }
  }
  return!0
};
goog.structs.Collection = function() {
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(a) {
  return this
};
goog.iter.toIterator = function(a) {
  if(a instanceof goog.iter.Iterator) {
    return a
  }
  if("function" == typeof a.__iterator__) {
    return a.__iterator__(!1)
  }
  if(goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for(;;) {
        if(b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if(b in a) {
          return a[b++]
        }
        b++
      }
    };
    return c
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if(goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c)
    }catch(d) {
      if(d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }else {
    a = goog.iter.toIterator(a);
    try {
      for(;;) {
        b.call(c, a.next(), void 0, a)
      }
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = d.next();
      if(b.call(c, a, void 0, d)) {
        return a
      }
    }
  };
  return a
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  1 < arguments.length && (d = a, e = b);
  if(0 == f) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if(0 < f && d >= e || 0 > f && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d += f;
    return a
  };
  return g
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = d.next();
      return b.call(c, a, void 0, d)
    }
  };
  return a
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a)
  });
  return e
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(b.call(c, a.next(), void 0, a)) {
        return!0
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!1
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(!b.call(c, a.next(), void 0, a)) {
        return!1
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!0
};
goog.iter.chain = function(a) {
  var b = arguments, c = b.length, d = 0, e = new goog.iter.Iterator;
  e.next = function() {
    try {
      if(d >= c) {
        throw goog.iter.StopIteration;
      }
      return goog.iter.toIterator(b[d]).next()
    }catch(a) {
      if(a !== goog.iter.StopIteration || d >= c) {
        throw a;
      }
      d++;
      return this.next()
    }
  };
  return e
};
goog.iter.dropWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for(;;) {
      var a = d.next();
      if(!e || !b.call(c, a, void 0, d)) {
        return e = !1, a
      }
    }
  };
  return a
};
goog.iter.takeWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for(;;) {
      if(e) {
        var a = d.next();
        if(b.call(c, a, void 0, d)) {
          return a
        }
        e = !1
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return a
};
goog.iter.toArray = function(a) {
  if(goog.isArrayLike(a)) {
    return goog.array.toArray(a)
  }
  a = goog.iter.toIterator(a);
  var b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a)
  });
  return b
};
goog.iter.equals = function(a, b) {
  a = goog.iter.toIterator(a);
  b = goog.iter.toIterator(b);
  var c, d;
  try {
    for(;;) {
      c = d = !1;
      var e = a.next();
      c = !0;
      var f = b.next();
      d = !0;
      if(e != f) {
        break
      }
    }
  }catch(g) {
    if(g !== goog.iter.StopIteration) {
      throw g;
    }
    if(c && !d) {
      return!1
    }
    if(!d) {
      try {
        b.next()
      }catch(h) {
        if(h !== goog.iter.StopIteration) {
          throw h;
        }
        return!0
      }
    }
  }
  return!1
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next()
  }catch(c) {
    if(c != goog.iter.StopIteration) {
      throw c;
    }
    return b
  }
};
goog.iter.product = function(a) {
  if(goog.array.some(arguments, function(a) {
    return!a.length
  }) || !arguments.length) {
    return new goog.iter.Iterator
  }
  var b = new goog.iter.Iterator, c = arguments, d = goog.array.repeat(0, c.length);
  b.next = function() {
    if(d) {
      for(var a = goog.array.map(d, function(a, b) {
        return c[b][a]
      }), b = d.length - 1;0 <= b;b--) {
        goog.asserts.assert(d);
        if(d[b] < c[b].length - 1) {
          d[b]++;
          break
        }
        if(0 == b) {
          d = null;
          break
        }
        d[b] = 0
      }
      return a
    }
    throw goog.iter.StopIteration;
  };
  return b
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0;
  a = new goog.iter.Iterator;
  var e = !1;
  a.next = function() {
    var a = null;
    if(!e) {
      try {
        return a = b.next(), c.push(a), a
      }catch(g) {
        if(g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a
  };
  return a
};
goog.structs.Map = function(a, b) {
  this.map_ = {};
  this.keys_ = [];
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.addAll(a)
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for(var a = [], b = 0;b < this.keys_.length;b++) {
    a.push(this.map_[this.keys_[b]])
  }
  return a
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a)
};
goog.structs.Map.prototype.containsValue = function(a) {
  for(var b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    if(goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) {
      return!0
    }
  }
  return!1
};
goog.structs.Map.prototype.equals = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.count_ != a.getCount()) {
    return!1
  }
  var c = b || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var d, e = 0;d = this.keys_[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0
};
goog.structs.Map.prototype.remove = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    for(var a = 0, b = 0;a < this.keys_.length;) {
      var c = this.keys_[a];
      goog.structs.Map.hasKey_(this.map_, c) && (this.keys_[b++] = c);
      a++
    }
    this.keys_.length = b
  }
  if(this.count_ != this.keys_.length) {
    for(var d = {}, b = a = 0;a < this.keys_.length;) {
      c = this.keys_[a], goog.structs.Map.hasKey_(d, c) || (this.keys_[b++] = c, d[c] = 1), a++
    }
    this.keys_.length = b
  }
};
goog.structs.Map.prototype.get = function(a, b) {
  return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b
};
goog.structs.Map.prototype.set = function(a, b) {
  goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = b
};
goog.structs.Map.prototype.addAll = function(a) {
  var b;
  a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  for(var a = new goog.structs.Map, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a.set(this.map_[c], c)
  }
  return a
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for(var a = {}, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a[c] = this.map_[c]
  }
  return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, c = this.keys_, d = this.map_, e = this.version_, f = this, g = new goog.iter.Iterator;
  g.next = function() {
    for(;;) {
      if(e != f.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw goog.iter.StopIteration;
      }
      var g = c[b++];
      return a ? g : d[g]
    }
  };
  return g
};
goog.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
};
goog.structs.Set = function(a) {
  this.map_ = new goog.structs.Map;
  a && this.addAll(a)
};
goog.structs.Set.getKey_ = function(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + goog.getUid(a) : b.substr(0, 1) + a
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount()
};
goog.structs.Set.prototype.add = function(a) {
  this.map_.set(goog.structs.Set.getKey_(a), a)
};
goog.structs.Set.prototype.addAll = function(a) {
  a = goog.structs.getValues(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
goog.structs.Set.prototype.removeAll = function(a) {
  a = goog.structs.getValues(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
goog.structs.Set.prototype.remove = function(a) {
  return this.map_.remove(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(a) {
  return this.map_.containsKey(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.containsAll = function(a) {
  return goog.structs.every(a, this.contains, this)
};
goog.structs.Set.prototype.intersection = function(a) {
  var b = new goog.structs.Set;
  a = goog.structs.getValues(a);
  for(var c = 0;c < a.length;c++) {
    var d = a[c];
    this.contains(d) && b.add(d)
  }
  return b
};
goog.structs.Set.prototype.difference = function(a) {
  var b = this.clone();
  b.removeAll(a);
  return b
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(a) {
  return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a)
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
  var b = goog.structs.getCount(a);
  if(this.getCount() > b) {
    return!1
  }
  !(a instanceof goog.structs.Set) && 5 < b && (a = new goog.structs.Set(a));
  return goog.structs.every(this, function(b) {
    return goog.structs.contains(a, b)
  })
};
goog.structs.Set.prototype.__iterator__ = function(a) {
  return this.map_.__iterator__(!1)
};
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.catchErrors = function(a, b, c) {
  c = c || goog.global;
  var d = c.onerror, e = !!b;
  goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3") && (e = !e);
  c.onerror = function(b, c, h) {
    d && d(b, c, h);
    a({message:b, fileName:c, line:h});
    return e
  }
};
goog.debug.expose = function(a, b) {
  if("undefined" == typeof a) {
    return"undefined"
  }
  if(null == a) {
    return"NULL"
  }
  var c = [], d;
  for(d in a) {
    if(b || !goog.isFunction(a[d])) {
      var e = d + " = ";
      try {
        e += a[d]
      }catch(f) {
        e += "*** " + f + " ***"
      }
      c.push(e)
    }
  }
  return c.join("\n")
};
goog.debug.deepExpose = function(a, b) {
  var c = new goog.structs.Set, d = [], e = function(a, g) {
    var h = g + "  ";
    try {
      if(goog.isDef(a)) {
        if(goog.isNull(a)) {
          d.push("NULL")
        }else {
          if(goog.isString(a)) {
            d.push('"' + a.replace(/\n/g, "\n" + g) + '"')
          }else {
            if(goog.isFunction(a)) {
              d.push(String(a).replace(/\n/g, "\n" + g))
            }else {
              if(goog.isObject(a)) {
                if(c.contains(a)) {
                  d.push("*** reference loop detected ***")
                }else {
                  c.add(a);
                  d.push("{");
                  for(var k in a) {
                    if(b || !goog.isFunction(a[k])) {
                      d.push("\n"), d.push(h), d.push(k + " = "), e(a[k], h)
                    }
                  }
                  d.push("\n" + g + "}")
                }
              }else {
                d.push(a)
              }
            }
          }
        }
      }else {
        d.push("undefined")
      }
    }catch(n) {
      d.push("*** " + n + " ***")
    }
  };
  e(a, "");
  return d.join("")
};
goog.debug.exposeArray = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    goog.isArray(a[c]) ? b.push(goog.debug.exposeArray(a[c])) : b.push(a[c])
  }
  return"[ " + b.join(", ") + " ]"
};
goog.debug.exposeException = function(a, b) {
  try {
    var c = goog.debug.normalizeErrorObject(a);
    return"Message: " + goog.string.htmlEscape(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(b) + "-> ")
  }catch(d) {
    return"Exception trying to expose exception! You win, we lose. " + d
  }
};
goog.debug.normalizeErrorObject = function(a) {
  var b = goog.getObjectByName("window.location.href");
  if(goog.isString(a)) {
    return{message:a, name:"Unknown error", lineNumber:"Not available", fileName:b, stack:"Not available"}
  }
  var c, d, e = !1;
  try {
    c = a.lineNumber || a.line || "Not available"
  }catch(f) {
    c = "Not available", e = !0
  }
  try {
    d = a.fileName || a.filename || a.sourceURL || goog.global.$googDebugFname || b
  }catch(g) {
    d = "Not available", e = !0
  }
  return!e && a.lineNumber && a.fileName && a.stack ? a : {message:a.message, name:a.name, lineNumber:c, fileName:d, stack:a.stack || "Not available"}
};
goog.debug.enhanceError = function(a, b) {
  var c = "string" == typeof a ? Error(a) : a;
  c.stack || (c.stack = goog.debug.getStacktrace(arguments.callee.caller));
  if(b) {
    for(var d = 0;c["message" + d];) {
      ++d
    }
    c["message" + d] = String(b)
  }
  return c
};
goog.debug.getStacktraceSimple = function(a) {
  for(var b = [], c = arguments.callee.caller, d = 0;c && (!a || d < a);) {
    b.push(goog.debug.getFunctionName(c));
    b.push("()\n");
    try {
      c = c.caller
    }catch(e) {
      b.push("[exception trying to get caller]\n");
      break
    }
    d++;
    if(d >= goog.debug.MAX_STACK_DEPTH) {
      b.push("[...long stack...]");
      break
    }
  }
  a && d >= a ? b.push("[...reached max depth limit...]") : b.push("[end]");
  return b.join("")
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getStacktrace = function(a) {
  return goog.debug.getStacktraceHelper_(a || arguments.callee.caller, [])
};
goog.debug.getStacktraceHelper_ = function(a, b) {
  var c = [];
  if(goog.array.contains(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < goog.debug.MAX_STACK_DEPTH) {
      c.push(goog.debug.getFunctionName(a) + "(");
      for(var d = a.arguments, e = 0;e < d.length;e++) {
        0 < e && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = goog.debug.getFunctionName(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(goog.debug.getStacktraceHelper_(a.caller, b))
      }catch(g) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
};
goog.debug.setFunctionResolver = function(a) {
  goog.debug.fnNameResolver_ = a
};
goog.debug.getFunctionName = function(a) {
  if(goog.debug.fnNameCache_[a]) {
    return goog.debug.fnNameCache_[a]
  }
  if(goog.debug.fnNameResolver_) {
    var b = goog.debug.fnNameResolver_(a);
    if(b) {
      return goog.debug.fnNameCache_[a] = b
    }
  }
  a = String(a);
  goog.debug.fnNameCache_[a] || (b = /function ([^\(]+)/.exec(a), goog.debug.fnNameCache_[a] = b ? b[1] : "[Anonymous]");
  return goog.debug.fnNameCache_[a]
};
goog.debug.makeWhitespaceVisible = function(a) {
  return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
};
goog.debug.fnNameCache_ = {};
goog.debug.LogRecord = function(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
};
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(a, b, c, d, e) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && (this.sequenceNumber_ = "number" == typeof e ? e : goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = d || goog.now();
  this.level_ = a;
  this.msg_ = b;
  this.loggerName_ = c;
  delete this.exception_;
  delete this.exceptionText_
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_
};
goog.debug.LogRecord.prototype.setException = function(a) {
  this.exception_ = a
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_
};
goog.debug.LogRecord.prototype.setExceptionText = function(a) {
  this.exceptionText_ = a
};
goog.debug.LogRecord.prototype.setLoggerName = function(a) {
  this.loggerName_ = a
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_
};
goog.debug.LogRecord.prototype.setLevel = function(a) {
  this.level_ = a
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_
};
goog.debug.LogRecord.prototype.setMessage = function(a) {
  this.msg_ = a
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_
};
goog.debug.LogRecord.prototype.setMillis = function(a) {
  this.time_ = a
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_
};
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear()
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(a, b, c) {
  var d = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = d;
  if(this.isFull_) {
    return d = this.buffer_[d], d.reset(a, b, c), d
  }
  this.isFull_ = d == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[d] = new goog.debug.LogRecord(a, b, c)
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1
};
goog.debug.LogBuffer.prototype.forEachRecord = function(a) {
  var b = this.buffer_;
  if(b[0]) {
    var c = this.curIndex_, d = this.isFull_ ? c : -1;
    do {
      d = (d + 1) % goog.debug.LogBuffer.CAPACITY, a(b[d])
    }while(d != c)
  }
};
goog.debug.Logger = function(a) {
  this.name_ = a
};
goog.debug.Logger.prototype.parent_ = null;
goog.debug.Logger.prototype.level_ = null;
goog.debug.Logger.prototype.children_ = null;
goog.debug.Logger.prototype.handlers_ = null;
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(a, b) {
  this.name = a;
  this.value = b
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for(var a = 0, b;b = goog.debug.Logger.Level.PREDEFINED_LEVELS[a];a++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[b.value] = b, goog.debug.Logger.Level.predefinedLevelsCache_[b.name] = b
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[a] || null
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if(a in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[a]
  }
  for(var b = 0;b < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++b) {
    var c = goog.debug.Logger.Level.PREDEFINED_LEVELS[b];
    if(c.value <= a) {
      return c
    }
  }
  return null
};
goog.debug.Logger.getLogger = function(a) {
  return goog.debug.LogManager.getLogger(a)
};
goog.debug.Logger.logToProfilers = function(a) {
  goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(a) : goog.global.console.markTimeline && goog.global.console.markTimeline(a));
  goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(a)
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_
};
goog.debug.Logger.prototype.addHandler = function(a) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(a)) : (goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootHandlers_.push(a)))
};
goog.debug.Logger.prototype.removeHandler = function(a) {
  if(goog.debug.LOGGING_ENABLED) {
    var b = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return!!b && goog.array.remove(b, a)
  }
  return!1
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_
};
goog.debug.Logger.prototype.getChildren = function() {
  this.children_ || (this.children_ = {});
  return this.children_
};
goog.debug.Logger.prototype.setLevel = function(a) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? this.level_ = a : (goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootLevel_ = a))
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if(!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF
  }
  if(!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_
  }
  if(this.level_) {
    return this.level_
  }
  if(this.parent_) {
    return this.parent_.getEffectiveLevel()
  }
  goog.asserts.fail("Root logger has no level set.");
  return null
};
goog.debug.Logger.prototype.isLoggable = function(a) {
  return goog.debug.LOGGING_ENABLED && a.value >= this.getEffectiveLevel().value
};
goog.debug.Logger.prototype.log = function(a, b, c) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(a) && this.doLogRecord_(this.getLogRecord(a, b, c))
};
goog.debug.Logger.prototype.getLogRecord = function(a, b, c) {
  var d = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(a, b, this.name_) : new goog.debug.LogRecord(a, String(b), this.name_);
  c && (d.setException(c), d.setExceptionText(goog.debug.exposeException(c, arguments.callee.caller)));
  return d
};
goog.debug.Logger.prototype.shout = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SHOUT, a, b)
};
goog.debug.Logger.prototype.severe = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SEVERE, a, b)
};
goog.debug.Logger.prototype.warning = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.WARNING, a, b)
};
goog.debug.Logger.prototype.info = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.INFO, a, b)
};
goog.debug.Logger.prototype.config = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.CONFIG, a, b)
};
goog.debug.Logger.prototype.fine = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINE, a, b)
};
goog.debug.Logger.prototype.finer = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINER, a, b)
};
goog.debug.Logger.prototype.finest = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINEST, a, b)
};
goog.debug.Logger.prototype.logRecord = function(a) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(a.getLevel()) && this.doLogRecord_(a)
};
goog.debug.Logger.prototype.doLogRecord_ = function(a) {
  goog.debug.Logger.logToProfilers("log:" + a.getMessage());
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    for(var b = this;b;) {
      b.callPublish_(a), b = b.getParent()
    }
  }else {
    for(var b = 0, c;c = goog.debug.Logger.rootHandlers_[b++];) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(a) {
  if(this.handlers_) {
    for(var b = 0, c;c = this.handlers_[b];b++) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(a) {
  this.parent_ = a
};
goog.debug.Logger.prototype.addChild_ = function(a, b) {
  this.getChildren()[a] = b
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  goog.debug.LogManager.rootLogger_ || (goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(""), goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_, goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG))
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_
};
goog.debug.LogManager.getLogger = function(a) {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.loggers_[a] || goog.debug.LogManager.createLogger_(a)
};
goog.debug.LogManager.createFunctionForCatchErrors = function(a) {
  return function(b) {
    (a || goog.debug.LogManager.getRoot()).severe("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.line + ")")
  }
};
goog.debug.LogManager.createLogger_ = function(a) {
  var b = new goog.debug.Logger(a);
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var c = a.lastIndexOf("."), d = a.substr(0, c), c = a.substr(c + 1), d = goog.debug.LogManager.getLogger(d);
    d.addChild_(c, b);
    b.setParent_(d)
  }
  return goog.debug.LogManager.loggers_[a] = b
};
fxdriver.logging = {};
fxdriver.logging.LogLevel = {ALL:{value:-Math.pow(2, 31), name:"ALL"}, DEBUG:{value:500, name:"DEBUG"}, INFO:{value:800, name:"INFO"}, WARNING:{value:900, name:"WARNING"}, SEVERE:{value:1E3, name:"SEVERE"}, OFF:{value:Math.pow(2, 31) - 1, name:"OFF"}};
fxdriver.logging.LogType = {BROWSER:"browser", DRIVER:"driver", PROFILER:"profiler"};
fxdriver.logging.LogEntry = function(a, b) {
  this.timestamp = (new Date).getTime();
  this.level = a;
  this.message = b
};
fxdriver.logging.debug = function(a) {
  fxdriver.logging.initialize_();
  fxdriver.logging.getDriverLogger_().fine(a)
};
fxdriver.logging.info = function(a) {
  fxdriver.logging.initialize_();
  fxdriver.logging.getDriverLogger_().info(a)
};
fxdriver.logging.warning = function(a) {
  fxdriver.logging.initialize_();
  fxdriver.logging.getDriverLogger_().warning(a)
};
fxdriver.logging.error = function(a) {
  fxdriver.logging.initialize_();
  fxdriver.logging.getDriverLogger_().severe(a)
};
fxdriver.logging.log = function(a, b, c) {
  fxdriver.logging.initialize_();
  "string" != typeof c && (c = JSON.stringify(c));
  a = fxdriver.logging.getLogFile_(a);
  b = new fxdriver.logging.LogEntry(b.name, c);
  b = JSON.stringify(b);
  b = b.replace(/\n/g, " ");
  a.append(b + "\n")
};
fxdriver.logging.getDriverLogger_ = function() {
  return goog.debug.Logger.getLogger("webdriver")
};
fxdriver.logging.getLog = function(a) {
  fxdriver.logging.initialize_();
  return fxdriver.logging.shouldIgnoreLogType_(a) ? [] : fxdriver.logging.filterLogEntries_(a, fxdriver.logging.getLogFromFile_(a))
};
fxdriver.logging.getAvailableLogTypes = function() {
  var a = [];
  goog.object.forEach(fxdriver.logging.LogType, function(b, c) {
    fxdriver.logging.shouldIgnoreLogType_(b) || a.push(b)
  });
  return a
};
fxdriver.logging.configure = function(a, b) {
  fxdriver.logging.initialize_();
  goog.isString(a) && (a = JSON.parse(a));
  goog.object.forEach(a, function(a, b) {
    a == fxdriver.logging.LogLevel.OFF.name ? fxdriver.logging.ignoreLogType_(b) : fxdriver.logging.setLogLevel_(b, a)
  });
  b || fxdriver.logging.ignoreLogType_(fxdriver.logging.LogType.PROFILER)
};
fxdriver.logging.initialized_ = !1;
fxdriver.logging.initialize_ = function() {
  if(!fxdriver.logging.initialized_) {
    fxdriver.logging.initialized_ = !0;
    var a = goog.debug.Logger.getLogger("");
    fxdriver.logging.addClosureToDriverFileLogger_(a);
    fxdriver.logging.addClosureToConsoleLogger_(a);
    fxdriver.logging.addClosureToFileLogger_(a);
    fxdriver.logging.hasConsoleListenerBeenRegistered_() || (fxdriver.logging.setConsoleListenerToRegistered_(), fxdriver.logging.addConsoleToFileLogger_())
  }
};
fxdriver.logging.addConsoleToFileLogger_ = function() {
  var a = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService), b = new fxdriver.logging.ConsoleToLogEntryFormatter, c = fxdriver.logging.getLogFile_(fxdriver.logging.LogType.BROWSER), d = {}, d = a.getMessageArray(d, {}) || d.value || [];
  goog.array.forEach(d, function(a) {
    c.append(b.formatConsoleEntry(a))
  });
  var e = new fxdriver.logging.ConsoleToLogEntryFilter, c = fxdriver.logging.getLogFile_(fxdriver.logging.LogType.BROWSER), d = {observe:function(a) {
    e.excludeConsoleEntry(a) || c.append(b.formatConsoleEntry(a))
  }};
  d.QueryInterface = fxdriver.moz.queryInterface(d, [Components.interfaces.nsIConsoleListener]);
  a.registerListener(d)
};
fxdriver.logging.addClosureToConsoleLogger_ = function(a) {
  var b = new fxdriver.logging.ClosureToConsoleFormatter;
  b.showSeverityLevel = !0;
  var c = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
  a.addHandler(function(a) {
    c.logStringMessage(b.formatRecord(a))
  })
};
fxdriver.logging.addClosureToFileLogger_ = function(a) {
  var b = fxdriver.prefs.getCharPref(fxdriver.logging.getPrefNameLogFile_(), void 0);
  if(b) {
    var c = new goog.debug.TextFormatter("webdriver");
    if("/dev/stdout" == b) {
      a.addHandler(function(a) {
        dump(c.formatRecord(a))
      })
    }else {
      var d = fxdriver.files.getFile(b);
      a.addHandler(function(a) {
        d.append(c.formatRecord(a))
      })
    }
  }
};
fxdriver.logging.addClosureToDriverFileLogger_ = function(a) {
  var b = new fxdriver.logging.ClosureToLogEntryFormatter, c = fxdriver.logging.getLogFile_(fxdriver.logging.LogType.DRIVER);
  a.addHandler(function(a) {
    c.append(b.formatRecord(a))
  })
};
fxdriver.logging.filterLogEntries_ = function(a, b) {
  var c = [], d = fxdriver.logging.getLogLevel_(a);
  goog.array.forEach(b, function(a) {
    a.level.value >= d.value && c.push(a)
  });
  return c
};
fxdriver.logging.ConsoleToLogEntryFilter = function() {
};
fxdriver.logging.ConsoleToLogEntryFilter.prototype.excludeConsoleEntry = function(a) {
  a = fxdriver.logging.getConsoleEntryMessage_(a);
  return goog.string.contains(a, "[WEBDRIVER]")
};
fxdriver.logging.ConsoleToLogEntryFormatter = function() {
};
fxdriver.logging.ConsoleToLogEntryFormatter.prototype.formatConsoleEntry = function(a) {
  a = {level:fxdriver.logging.getConsoleEntryLogLevel_(a).name, message:fxdriver.logging.getConsoleEntryMessage_(a), timestamp:(new Date).getTime()};
  return JSON.stringify(a).replace(/\n/g, " ") + "\n"
};
fxdriver.logging.getConsoleEntryMessage_ = function(a) {
  try {
    return a.QueryInterface(Components.interfaces.nsIScriptError), a.errorMessage
  }catch(b) {
  }
  try {
    return a.QueryInterface(Components.interfaces.nsIConsoleMessage), a.message + "\n"
  }catch(c) {
  }
  return"" + a
};
fxdriver.logging.getConsoleEntryLogLevel_ = function(a) {
  try {
    a.QueryInterface(Components.interfaces.nsIScriptError);
    if(a.flags & a.exceptionFlag) {
      return fxdriver.logging.LogLevel.SEVERE
    }
    if(a.flags & a.warningFlag) {
      return fxdriver.logging.LogLevel.WARNING
    }
  }catch(b) {
  }
  return fxdriver.logging.LogLevel.INFO
};
fxdriver.logging.ClosureToLogEntryFormatter = function() {
  goog.debug.Formatter.call(this)
};
goog.inherits(fxdriver.logging.ClosureToLogEntryFormatter, goog.debug.Formatter);
fxdriver.logging.ClosureToLogEntryFormatter.prototype.formatRecord = function(a) {
  a = {message:JSON.stringify(fxdriver.logging.formatMessage_(a, this.showExceptionText)), level:fxdriver.logging.getLevelFromLogRecord_(a.getLevel()).name, timestamp:(new Date).getTime()};
  return JSON.stringify(a).replace(/\n/g, " ") + "\n"
};
fxdriver.logging.getLevelFromLogRecord_ = function(a) {
  switch(a) {
    case goog.debug.Logger.Level.WARNING:
      return fxdriver.logging.LogLevel.WARNING;
    case goog.debug.Logger.Level.ERROR:
      return fxdriver.logging.LogLevel.ERROR;
    case goog.debug.Logger.Level.INFO:
      return fxdriver.logging.LogLevel.INFO
  }
  return fxdriver.logging.LogLevel.DEBUG
};
fxdriver.logging.ClosureToConsoleFormatter = function() {
  goog.debug.Formatter.call(this)
};
goog.inherits(fxdriver.logging.ClosureToConsoleFormatter, goog.debug.Formatter);
fxdriver.logging.ClosureToConsoleFormatter.prototype.formatRecord = function(a) {
  var b = [];
  b.push("[WEBDRIVER] ");
  this.showSeverityLevel && b.push("[", a.getLevel().name, "] ");
  b.push(fxdriver.logging.formatMessage_(a, this.showExceptionText));
  return b.join("")
};
fxdriver.logging.formatMessage_ = function(a, b) {
  for(var c = [], d = Components.stack, e = 0;8 > e && d;e++) {
    d = d.caller
  }
  e = d.filename.replace(/.*\//, "");
  c.push(e + ":" + d.lineNumber + " ");
  c.push(a.getMessage(), "\n");
  b && a.getException() && c.push(a.getExceptionText(), "\n");
  return c.join("")
};
fxdriver.logging.createNewLogFile_ = function(a) {
  var b = fxdriver.files.createTempFile(a + "_log", ".txt");
  fxdriver.prefs.setCharPref(fxdriver.logging.getPrefNameLogFile_(a), b.getFilePath());
  return b
};
fxdriver.logging.getLogFile_ = function(a) {
  var b = fxdriver.prefs.getCharPref(fxdriver.logging.getPrefNameLogFile_(a), void 0);
  (b = fxdriver.files.getFile(b)) || (b = fxdriver.logging.createNewLogFile_(a));
  return b
};
fxdriver.logging.getLogFromFile_ = function(a) {
  a = fxdriver.logging.getLogFile_(a);
  var b = a.read().trim().split("\n").join(",\n"), b = JSON.parse("[" + b + "]");
  a.resetBuffer();
  goog.array.forEach(b, function(a) {
    a.level = fxdriver.logging.LogLevel[a.level]
  });
  return b
};
fxdriver.logging.setLogLevel_ = function(a, b) {
  fxdriver.prefs.setCharPref(fxdriver.logging.getPrefNameLogLevel_(a), b)
};
fxdriver.logging.getLogLevel_ = function(a) {
  return fxdriver.logging.LogLevel[fxdriver.prefs.getCharPref(fxdriver.logging.getPrefNameLogLevel_(a), "INFO")]
};
fxdriver.logging.getPrefNameLogLevel_ = function(a) {
  return"webdriver.log." + a + ".level"
};
fxdriver.logging.getPrefNameLogFile_ = function(a) {
  return a ? "webdriver.log." + a + ".file" : "webdriver.log.file"
};
fxdriver.logging.hasConsoleListenerBeenRegistered_ = function() {
  return fxdriver.prefs.getBoolPref(fxdriver.logging.prefNameInitialized_, !1)
};
fxdriver.logging.setConsoleListenerToRegistered_ = function() {
  fxdriver.prefs.setBoolPref(fxdriver.logging.prefNameInitialized_, !0)
};
fxdriver.logging.prefNameInitialized_ = "webdriver.log.init";
fxdriver.logging.ignoreLogType_ = function(a) {
  fxdriver.prefs.setBoolPref(fxdriver.logging.getPrefNameLogIgnore_(a), !0)
};
fxdriver.logging.shouldIgnoreLogType_ = function(a) {
  return fxdriver.prefs.getBoolPref(fxdriver.logging.getPrefNameLogIgnore_(a), !1)
};
fxdriver.logging.getPrefNameLogIgnore_ = function(a) {
  return"webdriver.log." + a + ".ignore"
};
fxdriver.logging.dumpObject = function(a) {
  var b, c = [];
  b = "=============\nSupported interfaces: ";
  for(var d in Components.interfaces) {
    try {
      a.QueryInterface(Components.interfaces[d]), b += d + ", "
    }catch(e) {
    }
  }
  b += "\n------------\n";
  try {
    fxdriver.logging.dumpProperties_(a, c)
  }catch(f) {
  }
  c.sort();
  for(var g in c) {
    b += c[g] + "\n"
  }
  fxdriver.logging.info(b + "=============\n\n\n")
};
fxdriver.logging.dumpProperties_ = function(a, b) {
  for(var c in a) {
    var d = "\t" + c + ": ";
    try {
      d = typeof a[c] == typeof Function ? d + " function()" : d + String(a[c])
    }catch(e) {
      d += " Cannot obtain value"
    }
    b.push(d)
  }
};
fxdriver.moz = {};
var CC = Components.classes, CI = Components.interfaces, CR = Components.results, CU = Components.utils;
fxdriver.moz.load = function(a) {
  Components.utils["import"]("resource://gre/modules/XPCOMUtils.jsm")
};
fxdriver.moz.getService = function(a, b) {
  var c = CC[a];
  if(void 0 == c) {
    throw Error("Cannot create component " + a);
  }
  return c.getService(CI[b])
};
fxdriver.moz.queryInterface = function(a, b) {
  return function(c) {
    if(!c) {
      return CR.NS_ERROR_NO_INTERFACE
    }
    if(c.equals(CI.nsISupports) || goog.array.reduce(b, function(a, b) {
      return b ? a || b.equals(c) : a
    }, !1)) {
      return a
    }
    throw CR.NS_ERROR_NO_INTERFACE;
  }
};
fxdriver.moz.unwrap = function(a) {
  if(!goog.isDefAndNotNull(a) || a.__fxdriver_unwrapped) {
    return a
  }
  if(a.wrappedJSObject) {
    return a.wrappedJSObject.__fxdriver_unwrapped = !0, a.wrappedJSObject
  }
  try {
    if(a == XPCNativeWrapper(a)) {
      var b = XPCNativeWrapper.unwrap(a), b = b ? b : a;
      b.__fxdriver_unwrapped = !0;
      return b
    }
  }catch(c) {
  }
  return a
};
fxdriver.moz.unwrapXpcOnly = function(a) {
  if(XPCNativeWrapper && "unwrap" in XPCNativeWrapper) {
    try {
      return XPCNativeWrapper.unwrap(a)
    }catch(b) {
      fxdriver.logging.warning("Unwrap From XPC only failed: " + b)
    }
  }
  return a
};
fxdriver.moz.unwrapFor4 = function(a) {
  return bot.userAgent.isProductVersion(4) ? fxdriver.moz.unwrap(a) : a
};
fxdriver.io = {};
fxdriver.io.isLoadExpected = function(a, b) {
  if(!b) {
    return!0
  }
  var c = fxdriver.moz.getService("@mozilla.org/network/io-service;1", "nsIIOService"), d = c.newURI(a, "", null), c = c.newURI(b, "", d), e = !0;
  if("javascript" == c.scheme) {
    return!1
  }
  d && (c && d.prePath == c.prePath && d.filePath == c.filePath) && (e = -1 == c.path.indexOf("#"));
  return e
};
var STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
function DoNothing(a, b, c) {
  this.browser = a;
  this.onComplete = b;
  this.win = c;
  this.active = !0
}
DoNothing.prototype.onLocationChange = function() {
  return 0
};
DoNothing.prototype.onProgressChange = function() {
  return 0
};
DoNothing.prototype.onStateChange = function() {
  return 0
};
DoNothing.prototype.onStatusChange = function() {
  return 0
};
DoNothing.prototype.onSecurityChange = function() {
  return 0
};
DoNothing.prototype.onLinkIconAvailable = function() {
  return 0
};
DoNothing.prototype.QueryInterface = function(a) {
  if(a.equals(Components.interfaces.nsIWebProgressListener) || a.equals(Components.interfaces.nsISupportsWeakReference) || a.equals(Components.interfaces.nsISupports)) {
    return this
  }
  throw Components.results.NS_NOINTERFACE;
};
function PatientListener(a, b, c) {
  this.browser = a;
  this.onComplete = b;
  this.win = c;
  this.active = !0
}
PatientListener.prototype = new DoNothing;
PatientListener.prototype.onStateChange = function(a, b, c) {
  if(!this.active) {
    return 0
  }
  c & STATE_STOP && (fxdriver.logging.info("request status is " + b.status), b.URI && (this.active = !1, bot.userAgent.isProductVersion("4") && WebLoadingListener.removeListener(this.browser, this), this.onComplete()));
  return 0
};
function ImpatientListener(a, b, c) {
  this.browser = a;
  this.browserProgress = a.webProgress;
  this.active = !0;
  this.onComplete = b;
  this.win = c || null
}
ImpatientListener.prototype = new PatientListener;
ImpatientListener.prototype.onProgressChange = function(a) {
  if(!this.active || !this.win || this.win.closed) {
    return 0
  }
  a = this.win.document && this.win.document.readyState;
  var b = this.win.document.location;
  "complete" != a && "interactive" != a || "about:blank" == b || (this.active = !1, bot.userAgent.isProductVersion("4") && WebLoadingListener.removeListener(this.browser, this), this.onComplete());
  return 0
};
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
function buildHandler(a, b, c) {
  return prefs.prefHasUserValue("webdriver.load.strategy") && "unstable" == prefs.getCharPref("webdriver.load.strategy") ? new ImpatientListener(a, b, c) : new PatientListener(a, b, c)
}
var loadingListenerTimer, WebLoadingListener = function(a, b, c, d) {
  loadingListenerTimer = new fxdriver.Timer;
  var e = function(a) {
    loadingListenerTimer.cancel();
    b(a)
  };
  this.handler = buildHandler(a, e, d);
  a.addProgressListener(this.handler);
  var f = this.handler;
  -1 == c && (c = 18E5);
  loadingListenerTimer.setTimeout(function() {
    e(!0);
    WebLoadingListener.removeListener(a, f)
  }, c)
};
WebLoadingListener.removeListener = function(a, b) {
  a.removeProgressListener(b.handler)
};
bot.ErrorCode = {SUCCESS:0, NO_SUCH_ELEMENT:7, NO_SUCH_FRAME:8, UNKNOWN_COMMAND:9, UNSUPPORTED_OPERATION:9, STALE_ELEMENT_REFERENCE:10, ELEMENT_NOT_VISIBLE:11, INVALID_ELEMENT_STATE:12, UNKNOWN_ERROR:13, ELEMENT_NOT_SELECTABLE:15, JAVASCRIPT_ERROR:17, XPATH_LOOKUP_ERROR:19, TIMEOUT:21, NO_SUCH_WINDOW:23, INVALID_COOKIE_DOMAIN:24, UNABLE_TO_SET_COOKIE:25, MODAL_DIALOG_OPENED:26, NO_MODAL_DIALOG_OPEN:27, SCRIPT_TIMEOUT:28, INVALID_ELEMENT_COORDINATES:29, IME_NOT_AVAILABLE:30, IME_ENGINE_ACTIVATION_FAILED:31, 
INVALID_SELECTOR_ERROR:32, SESSION_NOT_CREATED:33, MOVE_TARGET_OUT_OF_BOUNDS:34, SQL_DATABASE_ERROR:35, INVALID_XPATH_SELECTOR:51, INVALID_XPATH_SELECTOR_RETURN_TYPE:52, METHOD_NOT_ALLOWED:405};
bot.Error = function(a, b) {
  this.code = a;
  this.state = bot.Error.CODE_TO_STATE_[a] || bot.Error.State.UNKNOWN_ERROR;
  this.message = b || "";
  var c = this.state.replace(/((?:^|\s+)[a-z])/g, function(a) {
    return a.toUpperCase().replace(/^[\s\xa0]+/g, "")
  }), d = c.length - 5;
  if(0 > d || c.indexOf("Error", d) != d) {
    c += "Error"
  }
  this.name = c;
  c = Error(this.message);
  c.name = this.name;
  this.stack = c.stack || ""
};
goog.inherits(bot.Error, Error);
bot.Error.State = {ELEMENT_NOT_SELECTABLE:"element not selectable", ELEMENT_NOT_VISIBLE:"element not visible", IME_ENGINE_ACTIVATION_FAILED:"ime engine activation failed", IME_NOT_AVAILABLE:"ime not available", INVALID_COOKIE_DOMAIN:"invalid cookie domain", INVALID_ELEMENT_COORDINATES:"invalid element coordinates", INVALID_ELEMENT_STATE:"invalid element state", INVALID_SELECTOR:"invalid selector", JAVASCRIPT_ERROR:"javascript error", MOVE_TARGET_OUT_OF_BOUNDS:"move target out of bounds", NO_SUCH_ALERT:"no such alert", 
NO_SUCH_DOM:"no such dom", NO_SUCH_ELEMENT:"no such element", NO_SUCH_FRAME:"no such frame", NO_SUCH_WINDOW:"no such window", SCRIPT_TIMEOUT:"script timeout", SESSION_NOT_CREATED:"session not created", STALE_ELEMENT_REFERENCE:"stale element reference", SUCCESS:"success", TIMEOUT:"timeout", UNABLE_TO_SET_COOKIE:"unable to set cookie", UNEXPECTED_ALERT_OPEN:"unexpected alert open", UNKNOWN_COMMAND:"unknown command", UNKNOWN_ERROR:"unknown error", UNSUPPORTED_OPERATION:"unsupported operation"};
bot.Error.CODE_TO_STATE_ = {};
bot.Error.CODE_TO_STATE_[bot.ErrorCode.ELEMENT_NOT_SELECTABLE] = bot.Error.State.ELEMENT_NOT_SELECTABLE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.ELEMENT_NOT_VISIBLE] = bot.Error.State.ELEMENT_NOT_VISIBLE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.IME_ENGINE_ACTIVATION_FAILED] = bot.Error.State.IME_ENGINE_ACTIVATION_FAILED;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.IME_NOT_AVAILABLE] = bot.Error.State.IME_NOT_AVAILABLE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_COOKIE_DOMAIN] = bot.Error.State.INVALID_COOKIE_DOMAIN;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_ELEMENT_COORDINATES] = bot.Error.State.INVALID_ELEMENT_COORDINATES;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_ELEMENT_STATE] = bot.Error.State.INVALID_ELEMENT_STATE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_SELECTOR_ERROR] = bot.Error.State.INVALID_SELECTOR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_XPATH_SELECTOR] = bot.Error.State.INVALID_SELECTOR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.INVALID_XPATH_SELECTOR_RETURN_TYPE] = bot.Error.State.INVALID_SELECTOR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.JAVASCRIPT_ERROR] = bot.Error.State.JAVASCRIPT_ERROR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.METHOD_NOT_ALLOWED] = bot.Error.State.UNSUPPORTED_OPERATION;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS] = bot.Error.State.MOVE_TARGET_OUT_OF_BOUNDS;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_MODAL_DIALOG_OPEN] = bot.Error.State.NO_SUCH_ALERT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_SUCH_ELEMENT] = bot.Error.State.NO_SUCH_ELEMENT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_SUCH_FRAME] = bot.Error.State.NO_SUCH_FRAME;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.NO_SUCH_WINDOW] = bot.Error.State.NO_SUCH_WINDOW;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.SCRIPT_TIMEOUT] = bot.Error.State.SCRIPT_TIMEOUT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.SESSION_NOT_CREATED] = bot.Error.State.SESSION_NOT_CREATED;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.STALE_ELEMENT_REFERENCE] = bot.Error.State.STALE_ELEMENT_REFERENCE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.SUCCESS] = bot.Error.State.SUCCESS;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.TIMEOUT] = bot.Error.State.TIMEOUT;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.UNABLE_TO_SET_COOKIE] = bot.Error.State.UNABLE_TO_SET_COOKIE;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.MODAL_DIALOG_OPENED] = bot.Error.State.UNEXPECTED_ALERT_OPEN;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.UNKNOWN_ERROR] = bot.Error.State.UNKNOWN_ERROR;
bot.Error.CODE_TO_STATE_[bot.ErrorCode.UNSUPPORTED_OPERATION] = bot.Error.State.UNKNOWN_COMMAND;
bot.Error.prototype.isAutomationError = !0;
goog.DEBUG && (bot.Error.prototype.toString = function() {
  return this.name + ": " + this.message
});
try {
  bot.window_ = window
}catch(ignored$$1) {
  bot.window_ = goog.global
}
bot.getWindow = function() {
  return bot.window_
};
bot.setWindow = function(a) {
  bot.window_ = a
};
bot.getDocument = function() {
  return bot.window_.document
};
goog.color = {};
goog.color.names = {aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4", azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000", blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a", burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e", coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c", cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b", 
darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b", darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc", darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b", darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3", deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969", dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0", 
forestgreen:"#228b22", fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700", goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f", grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c", indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa", lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6", lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3", 
lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a", lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899", lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32", linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa", mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370db", mediumseagreen:"#3cb371", mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a", 
mediumturquoise:"#48d1cc", mediumvioletred:"#c71585", midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5", navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000", olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6", palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#db7093", papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb", plum:"#dda0dd", powderblue:"#b0e0e6", 
purple:"#800080", red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513", salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee", sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd", slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f", steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8", tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3", white:"#ffffff", whitesmoke:"#f5f5f5", 
yellow:"#ffff00", yellowgreen:"#9acd32"};
bot.color = {};
bot.color.standardizeColor = function(a, b) {
  return bot.color.isColorProperty(a) && bot.color.isConvertibleColor(b) ? bot.color.standardizeToRgba_(b) : b
};
bot.color.standardizeToRgba_ = function(a) {
  var b = bot.color.parseRgbaColor(a);
  b.length || (b = bot.color.convertToRgba_(a), bot.color.addAlphaIfNecessary_(b));
  return 4 != b.length ? a : bot.color.toRgbaStyle_(b)
};
bot.color.convertToRgba_ = function(a) {
  var b = bot.color.parseRgbColor_(a);
  if(b.length) {
    return b
  }
  b = (b = goog.color.names[a.toLowerCase()]) ? b : bot.color.prependHashIfNecessary_(a);
  return bot.color.isValidHexColor_(b) && (b = bot.color.hexToRgb(bot.color.normalizeHex(b)), b.length) ? b : []
};
bot.color.isConvertibleColor = function(a) {
  return!!(bot.color.isValidHexColor_(bot.color.prependHashIfNecessary_(a)) || bot.color.parseRgbColor_(a).length || goog.color.names && goog.color.names[a.toLowerCase()] || bot.color.parseRgbaColor(a).length)
};
bot.color.COLOR_PROPERTIES_ = "background-color border-top-color border-right-color border-bottom-color border-left-color color outline-color".split(" ");
bot.color.isColorProperty = function(a) {
  return goog.array.contains(bot.color.COLOR_PROPERTIES_, a)
};
bot.color.HEX_TRIPLET_RE_ = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/;
bot.color.normalizeHex = function(a) {
  if(!bot.color.isValidHexColor_(a)) {
    throw Error("'" + a + "' is not a valid hex color");
  }
  4 == a.length && (a = a.replace(bot.color.HEX_TRIPLET_RE_, "#$1$1$2$2$3$3"));
  return a.toLowerCase()
};
bot.color.hexToRgb = function(a) {
  a = bot.color.normalizeHex(a);
  var b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16);
  a = parseInt(a.substr(5, 2), 16);
  return[b, c, a]
};
bot.color.VALID_HEX_COLOR_RE_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
bot.color.isValidHexColor_ = function(a) {
  return bot.color.VALID_HEX_COLOR_RE_.test(a)
};
bot.color.NORMALIZED_HEX_COLOR_RE_ = /^#[0-9a-f]{6}$/;
bot.color.isNormalizedHexColor_ = function(a) {
  return bot.color.NORMALIZED_HEX_COLOR_RE_.test(a)
};
bot.color.RGBA_COLOR_RE_ = /^(?:rgba)?\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3}),\s?(0|1|0\.\d*)\)$/i;
bot.color.parseRgbaColor = function(a) {
  var b = a.match(bot.color.RGBA_COLOR_RE_);
  if(b) {
    a = Number(b[1]);
    var c = Number(b[2]), d = Number(b[3]), b = Number(b[4]);
    if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= d && 255 >= d && 0 <= b && 1 >= b) {
      return[a, c, d, b]
    }
  }
  return[]
};
bot.color.RGB_COLOR_RE_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
bot.color.parseRgbColor_ = function(a) {
  var b = a.match(bot.color.RGB_COLOR_RE_);
  if(b) {
    a = Number(b[1]);
    var c = Number(b[2]), b = Number(b[3]);
    if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= b && 255 >= b) {
      return[a, c, b]
    }
  }
  return[]
};
bot.color.prependHashIfNecessary_ = function(a) {
  return"#" == a.charAt(0) ? a : "#" + a
};
bot.color.addAlphaIfNecessary_ = function(a) {
  3 == a.length && a.push(1);
  return a
};
bot.color.toRgbaStyle_ = function(a) {
  return"rgba(" + a.join(", ") + ")"
};
goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = c.length + d.length;
  goog.dom.classes.add_(c, d);
  goog.dom.classes.set(a, c.join(" "));
  return c.length == e
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = goog.dom.classes.getDifference_(c, d);
  goog.dom.classes.set(a, e.join(" "));
  return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
  for(var c = 0;c < b.length;c++) {
    goog.array.contains(a, b[c]) || a.push(b[c])
  }
};
goog.dom.classes.getDifference_ = function(a, b) {
  return goog.array.filter(a, function(a) {
    return!goog.array.contains(b, a)
  })
};
goog.dom.classes.swap = function(a, b, c) {
  for(var d = goog.dom.classes.get(a), e = !1, f = 0;f < d.length;f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0)
  }
  e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  goog.dom.classes.set(a, d.join(" "))
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(a, b) {
    return a == b
  };
  d = d || function(b, c) {
    return a[b]
  };
  for(var e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0
  }
  for(var k = 0;k < f + 1;k++) {
    g[0][k] = 0
  }
  for(h = 1;h <= e;h++) {
    for(k = 1;k <= f;k++) {
      c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1])
    }
  }
  for(var n = [], h = e, k = f;0 < h && 0 < k;) {
    c(a[h - 1], b[k - 1]) ? (n.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--
  }
  return n
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
  var b = arguments.length;
  if(2 > b) {
    return 0
  }
  var c = goog.math.average.apply(null, arguments), b = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2)
  })) / (b - 1);
  return Math.sqrt(b)
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
goog.math.safeFloor = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.ceil(a - (b || 2E-15))
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this
};
goog.math.Coordinate.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += a, goog.isNumber(b) && (this.y += b));
  return this
};
goog.math.Coordinate.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.x *= a;
  this.y *= c;
  return this
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.width *= a;
  this.height *= c;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return!(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      d = {};
      for(var e = 0, f = 0, g;g = a[f];f++) {
        b == g.nodeName && (d[e++] = g)
      }
      d.length = e;
      return d
    }
    return a
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    for(f = e = 0;g = a[f];f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g)
    }
    d.length = e;
    return d
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    a = goog.dom.getViewportSize_(a).height;
    var c = b.body, d = b.documentElement;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a);
  a = goog.dom.getWindow_(a);
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      delete e.type;
      d = e
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(String(a))
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  for(var e = ["<tr>"], f = 0;f < c;f++) {
    e.push(d ? "<td>&nbsp;</td>" : "<td></td>")
  }
  e.push("</tr>");
  e = e.join("");
  c = ["<table>"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("</table>");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
  if(1 == c.childNodes.length) {
    return c.removeChild(c.firstChild)
  }
  for(var d = a.createDocumentFragment();c.firstChild;) {
    d.appendChild(c.firstChild)
  }
  return d
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;b = a.firstChild;) {
      c.insertBefore(b, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && a instanceof goog.global.SVGElement)) {
    return a.parentElement
  }
  a = a.parentNode;
  return goog.dom.isElement(a) ? a : null
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if(a.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1
    }
    if(b.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1
    }
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if(!c) {
    return null
  }
  if(1 == c) {
    return arguments[0]
  }
  var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g), g = g.parentNode
    }
    d.push(f);
    e = Math.min(e, f.length)
  }
  f = null;
  for(b = 0;b < e;b++) {
    for(var g = d[0][b], h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }
    f = g
  }
  return f
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      goog.dom.removeChildren(a);
      var c = goog.dom.getOwnerDocument(a);
      a.appendChild(c.createTextNode(String(b)))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var b = goog.dom.getOwnerDocument(a).createElement("div");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(null != a) {
    for(a = a.firstChild;a;) {
      if(b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return!0
      }
      a = a.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var b = a.getAttributeNode("tabindex");
  return b && b.specified ? (a = a.tabIndex, goog.isNumber(a) && 0 <= a && 32768 > a) : !1
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  for(var c = b || goog.dom.getOwnerDocument(a).body, d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  a = [a];
  for(var d = 0, e = null;0 < a.length && d < b;) {
    if(e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;0 <= f;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  if(!b && !c) {
    return null
  }
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  c || (a = a.parentNode);
  c = null == d;
  for(var e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement
  }catch(b) {
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(String(a))
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
var wgxpath = {Context:function(a, b, c) {
  this.node_ = a;
  this.position_ = b || 1;
  this.last_ = c || 1
}};
wgxpath.Context.prototype.getNode = function() {
  return this.node_
};
wgxpath.Context.prototype.getPosition = function() {
  return this.position_
};
wgxpath.Context.prototype.getLast = function() {
  return this.last_
};
wgxpath.userAgent = {};
wgxpath.userAgent.IE_DOC_PRE_9 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9);
wgxpath.userAgent.IE_DOC_PRE_8 = goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8);
wgxpath.IEAttrWrapper = function(a, b, c, d, e) {
  this.node_ = a;
  this.nodeName = c;
  this.nodeValue = d;
  this.nodeType = goog.dom.NodeType.ATTRIBUTE;
  this.ownerElement = b;
  this.parentSourceIndex_ = e;
  this.parentNode = b
};
wgxpath.IEAttrWrapper.forAttrOf = function(a, b, c) {
  var d = wgxpath.userAgent.IE_DOC_PRE_8 && "href" == b.nodeName ? a.getAttribute(b.nodeName, 2) : b.nodeValue;
  return new wgxpath.IEAttrWrapper(b, a, b.nodeName, d, c)
};
wgxpath.IEAttrWrapper.forStyleOf = function(a, b) {
  return new wgxpath.IEAttrWrapper(a.style, a, "style", a.style.cssText, b)
};
wgxpath.IEAttrWrapper.prototype.getParentSourceIndex = function() {
  return this.parentSourceIndex_
};
wgxpath.IEAttrWrapper.prototype.getNode = function() {
  return this.node_
};
wgxpath.Lexer = function(a) {
  this.tokens_ = a;
  this.index_ = 0
};
wgxpath.Lexer.tokenize = function(a) {
  a = a.match(wgxpath.Lexer.TOKEN_);
  for(var b = 0;b < a.length;b++) {
    wgxpath.Lexer.LEADING_WHITESPACE_.test(a[b]) && a.splice(b, 1)
  }
  return new wgxpath.Lexer(a)
};
wgxpath.Lexer.TOKEN_ = RegExp("\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+|\\/\\/|\\.\\.|::|\\d+(?:\\.\\d*)?|\\.\\d+|\"[^\"]*\"|'[^']*'|[!<>]=|\\s+|.", "g");
wgxpath.Lexer.LEADING_WHITESPACE_ = /^\s/;
wgxpath.Lexer.prototype.peek = function(a) {
  return this.tokens_[this.index_ + (a || 0)]
};
wgxpath.Lexer.prototype.next = function() {
  return this.tokens_[this.index_++]
};
wgxpath.Lexer.prototype.back = function() {
  this.index_--
};
wgxpath.Lexer.prototype.empty = function() {
  return this.tokens_.length <= this.index_
};
wgxpath.Node = {};
wgxpath.Node.equal = function(a, b) {
  return a == b || a instanceof wgxpath.IEAttrWrapper && b instanceof wgxpath.IEAttrWrapper && a.getNode() == b.getNode()
};
wgxpath.Node.getValueAsString = function(a) {
  var b = null, c = a.nodeType;
  c == goog.dom.NodeType.ELEMENT && (b = a.textContent, b = void 0 == b || null == b ? a.innerText : b, b = void 0 == b || null == b ? "" : b);
  if("string" != typeof b) {
    if(wgxpath.userAgent.IE_DOC_PRE_9 && "title" == a.nodeName.toLowerCase() && c == goog.dom.NodeType.ELEMENT) {
      b = a.text
    }else {
      if(c == goog.dom.NodeType.DOCUMENT || c == goog.dom.NodeType.ELEMENT) {
        a = c == goog.dom.NodeType.DOCUMENT ? a.documentElement : a.firstChild;
        for(var c = 0, d = [], b = "";a;) {
          do {
            a.nodeType != goog.dom.NodeType.ELEMENT && (b += a.nodeValue), wgxpath.userAgent.IE_DOC_PRE_9 && "title" == a.nodeName.toLowerCase() && (b += a.text), d[c++] = a
          }while(a = a.firstChild);
          for(;c && !(a = d[--c].nextSibling);) {
          }
        }
      }else {
        b = a.nodeValue
      }
    }
  }
  return"" + b
};
wgxpath.Node.getValueAsNumber = function(a) {
  return+wgxpath.Node.getValueAsString(a)
};
wgxpath.Node.getValueAsBool = function(a) {
  return!!wgxpath.Node.getValueAsString(a)
};
wgxpath.Node.attrMatches = function(a, b, c) {
  if(goog.isNull(b)) {
    return!0
  }
  try {
    if(!a.getAttribute) {
      return!1
    }
  }catch(d) {
    return!1
  }
  wgxpath.userAgent.IE_DOC_PRE_8 && "class" == b && (b = "className");
  return null == c ? !!a.getAttribute(b) : a.getAttribute(b, 2) == c
};
wgxpath.Node.getDescendantNodes = function(a, b, c, d, e) {
  e = e || new wgxpath.NodeSet;
  var f = wgxpath.userAgent.IE_DOC_PRE_9 ? wgxpath.Node.getDescendantNodesIEPre9_ : wgxpath.Node.getDescendantNodesGeneric_;
  c = goog.isString(c) ? c : null;
  d = goog.isString(d) ? d : null;
  return f.call(null, a, b, c, d, e)
};
wgxpath.Node.getDescendantNodesIEPre9_ = function(a, b, c, d, e) {
  if(wgxpath.Node.doesNeedSpecialHandlingIEPre9_(a, c)) {
    var f = b.all;
    if(!f) {
      return e
    }
    a = wgxpath.Node.getNameFromTestIEPre9_(a);
    if("*" != a && (f = b.getElementsByTagName(a), !f)) {
      return e
    }
    if(c) {
      for(var g = [], h = 0;b = f[h++];) {
        wgxpath.Node.attrMatches(b, c, d) && g.push(b)
      }
      f = g
    }
    for(h = 0;b = f[h++];) {
      "*" == a && "!" == b.tagName || e.add(b)
    }
    return e
  }
  wgxpath.Node.doRecursiveAttrMatch_(a, b, c, d, e);
  return e
};
wgxpath.Node.getDescendantNodesGeneric_ = function(a, b, c, d, e) {
  b.getElementsByName && d && "name" == c && !goog.userAgent.IE ? (b = b.getElementsByName(d), goog.array.forEach(b, function(b) {
    a.matches(b) && e.add(b)
  })) : b.getElementsByClassName && d && "class" == c ? (b = b.getElementsByClassName(d), goog.array.forEach(b, function(b) {
    b.className == d && a.matches(b) && e.add(b)
  })) : a instanceof wgxpath.KindTest ? wgxpath.Node.doRecursiveAttrMatch_(a, b, c, d, e) : b.getElementsByTagName && (b = b.getElementsByTagName(a.getName()), goog.array.forEach(b, function(a) {
    wgxpath.Node.attrMatches(a, c, d) && e.add(a)
  }));
  return e
};
wgxpath.Node.getChildNodes = function(a, b, c, d, e) {
  e = e || new wgxpath.NodeSet;
  var f = wgxpath.userAgent.IE_DOC_PRE_9 ? wgxpath.Node.getChildNodesIEPre9_ : wgxpath.Node.getChildNodesGeneric_;
  c = goog.isString(c) ? c : null;
  d = goog.isString(d) ? d : null;
  return f.call(null, a, b, c, d, e)
};
wgxpath.Node.getChildNodesIEPre9_ = function(a, b, c, d, e) {
  var f;
  if(wgxpath.Node.doesNeedSpecialHandlingIEPre9_(a, c) && (f = b.childNodes)) {
    var g = wgxpath.Node.getNameFromTestIEPre9_(a);
    if("*" != g && (f = goog.array.filter(f, function(a) {
      return a.tagName && a.tagName.toLowerCase() == g
    }), !f)) {
      return e
    }
    c && (f = goog.array.filter(f, function(a) {
      return wgxpath.Node.attrMatches(a, c, d)
    }));
    goog.array.forEach(f, function(a) {
      "*" == g && ("!" == a.tagName || "*" == g && a.nodeType != goog.dom.NodeType.ELEMENT) || e.add(a)
    });
    return e
  }
  return wgxpath.Node.getChildNodesGeneric_(a, b, c, d, e)
};
wgxpath.Node.getChildNodesGeneric_ = function(a, b, c, d, e) {
  for(b = b.firstChild;b;b = b.nextSibling) {
    wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b)
  }
  return e
};
wgxpath.Node.doRecursiveAttrMatch_ = function(a, b, c, d, e) {
  for(b = b.firstChild;b;b = b.nextSibling) {
    wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b), wgxpath.Node.doRecursiveAttrMatch_(a, b, c, d, e)
  }
};
wgxpath.Node.doesNeedSpecialHandlingIEPre9_ = function(a, b) {
  return a instanceof wgxpath.NameTest || a.getType() == goog.dom.NodeType.COMMENT || !!b && goog.isNull(a.getType())
};
wgxpath.Node.getNameFromTestIEPre9_ = function(a) {
  if(a instanceof wgxpath.KindTest) {
    if(a.getType() == goog.dom.NodeType.COMMENT) {
      return"!"
    }
    if(goog.isNull(a.getType())) {
      return"*"
    }
  }
  return a.getName()
};
wgxpath.NodeSet = function() {
  this.last_ = this.first_ = null;
  this.length_ = 0
};
wgxpath.NodeSet.Entry_ = function(a) {
  this.node = a;
  this.next = this.prev = null
};
wgxpath.NodeSet.merge = function(a, b) {
  if(!a.first_) {
    return b
  }
  if(!b.first_) {
    return a
  }
  for(var c = a.first_, d = b.first_, e = null, f = null, g = 0;c && d;) {
    wgxpath.Node.equal(c.node, d.node) ? (f = c, c = c.next, d = d.next) : 0 < goog.dom.compareNodeOrder(c.node, d.node) ? (f = d, d = d.next) : (f = c, c = c.next), (f.prev = e) ? e.next = f : a.first_ = f, e = f, g++
  }
  for(f = c || d;f;) {
    f.prev = e, e = e.next = f, g++, f = f.next
  }
  a.last_ = e;
  a.length_ = g;
  return a
};
wgxpath.NodeSet.prototype.unshift = function(a) {
  a = new wgxpath.NodeSet.Entry_(a);
  a.next = this.first_;
  this.last_ ? this.first_.prev = a : this.first_ = this.last_ = a;
  this.first_ = a;
  this.length_++
};
wgxpath.NodeSet.prototype.add = function(a) {
  a = new wgxpath.NodeSet.Entry_(a);
  a.prev = this.last_;
  this.first_ ? this.last_.next = a : this.first_ = this.last_ = a;
  this.last_ = a;
  this.length_++
};
wgxpath.NodeSet.prototype.getFirst = function() {
  var a = this.first_;
  return a ? a.node : null
};
wgxpath.NodeSet.prototype.getLength = function() {
  return this.length_
};
wgxpath.NodeSet.prototype.string = function() {
  var a = this.getFirst();
  return a ? wgxpath.Node.getValueAsString(a) : ""
};
wgxpath.NodeSet.prototype.number = function() {
  return+this.string()
};
wgxpath.NodeSet.prototype.iterator = function(a) {
  return new wgxpath.NodeSet.Iterator(this, !!a)
};
wgxpath.NodeSet.Iterator = function(a, b) {
  this.nodeset_ = a;
  this.current_ = (this.reverse_ = b) ? a.last_ : a.first_;
  this.lastReturned_ = null
};
wgxpath.NodeSet.Iterator.prototype.next = function() {
  var a = this.current_;
  if(null == a) {
    return null
  }
  var b = this.lastReturned_ = a;
  this.current_ = this.reverse_ ? a.prev : a.next;
  return b.node
};
wgxpath.NodeSet.Iterator.prototype.remove = function() {
  var a = this.nodeset_, b = this.lastReturned_;
  if(!b) {
    throw Error("Next must be called at least once before remove.");
  }
  var c = b.prev, b = b.next;
  c ? c.next = b : a.first_ = b;
  b ? b.prev = c : a.last_ = c;
  a.length_--;
  this.lastReturned_ = null
};
wgxpath.DataType = {VOID:0, NUMBER:1, BOOLEAN:2, STRING:3, NODESET:4};
wgxpath.Expr = function(a) {
  this.dataType_ = a;
  this.needContextNode_ = this.needContextPosition_ = !1;
  this.quickAttr_ = null
};
wgxpath.Expr.indent = function(a) {
  return"\n  " + a.toString().split("\n").join("\n  ")
};
wgxpath.Expr.prototype.getDataType = function() {
  return this.dataType_
};
wgxpath.Expr.prototype.doesNeedContextPosition = function() {
  return this.needContextPosition_
};
wgxpath.Expr.prototype.setNeedContextPosition = function(a) {
  this.needContextPosition_ = a
};
wgxpath.Expr.prototype.doesNeedContextNode = function() {
  return this.needContextNode_
};
wgxpath.Expr.prototype.setNeedContextNode = function(a) {
  this.needContextNode_ = a
};
wgxpath.Expr.prototype.getQuickAttr = function() {
  return this.quickAttr_
};
wgxpath.Expr.prototype.setQuickAttr = function(a) {
  this.quickAttr_ = a
};
wgxpath.Expr.prototype.asNumber = function(a) {
  a = this.evaluate(a);
  return a instanceof wgxpath.NodeSet ? a.number() : +a
};
wgxpath.Expr.prototype.asString = function(a) {
  a = this.evaluate(a);
  return a instanceof wgxpath.NodeSet ? a.string() : "" + a
};
wgxpath.Expr.prototype.asBool = function(a) {
  a = this.evaluate(a);
  return a instanceof wgxpath.NodeSet ? !!a.getLength() : !!a
};
wgxpath.BinaryExpr = function(a, b, c) {
  wgxpath.Expr.call(this, a.dataType_);
  this.op_ = a;
  this.left_ = b;
  this.right_ = c;
  this.setNeedContextPosition(b.doesNeedContextPosition() || c.doesNeedContextPosition());
  this.setNeedContextNode(b.doesNeedContextNode() || c.doesNeedContextNode());
  this.op_ == wgxpath.BinaryExpr.Op.EQUAL && (c.doesNeedContextNode() || c.doesNeedContextPosition() || c.getDataType() == wgxpath.DataType.NODESET || c.getDataType() == wgxpath.DataType.VOID || !b.getQuickAttr() ? b.doesNeedContextNode() || (b.doesNeedContextPosition() || b.getDataType() == wgxpath.DataType.NODESET || b.getDataType() == wgxpath.DataType.VOID || !c.getQuickAttr()) || this.setQuickAttr({name:c.getQuickAttr().name, valueExpr:b}) : this.setQuickAttr({name:b.getQuickAttr().name, valueExpr:c}))
};
goog.inherits(wgxpath.BinaryExpr, wgxpath.Expr);
wgxpath.BinaryExpr.compare_ = function(a, b, c, d, e) {
  b = b.evaluate(d);
  c = c.evaluate(d);
  var f;
  if(b instanceof wgxpath.NodeSet && c instanceof wgxpath.NodeSet) {
    e = b.iterator();
    for(d = e.next();d;d = e.next()) {
      for(b = c.iterator(), f = b.next();f;f = b.next()) {
        if(a(wgxpath.Node.getValueAsString(d), wgxpath.Node.getValueAsString(f))) {
          return!0
        }
      }
    }
    return!1
  }
  if(b instanceof wgxpath.NodeSet || c instanceof wgxpath.NodeSet) {
    b instanceof wgxpath.NodeSet ? e = b : (e = c, c = b);
    e = e.iterator();
    b = typeof c;
    for(d = e.next();d;d = e.next()) {
      switch(b) {
        case "number":
          d = wgxpath.Node.getValueAsNumber(d);
          break;
        case "boolean":
          d = wgxpath.Node.getValueAsBool(d);
          break;
        case "string":
          d = wgxpath.Node.getValueAsString(d);
          break;
        default:
          throw Error("Illegal primitive type for comparison.");
      }
      if(a(d, c)) {
        return!0
      }
    }
    return!1
  }
  return e ? "boolean" == typeof b || "boolean" == typeof c ? a(!!b, !!c) : "number" == typeof b || "number" == typeof c ? a(+b, +c) : a(b, c) : a(+b, +c)
};
wgxpath.BinaryExpr.prototype.evaluate = function(a) {
  return this.op_.evaluate_(this.left_, this.right_, a)
};
wgxpath.BinaryExpr.prototype.toString = function() {
  var a = "Binary Expression: " + this.op_, a = a + wgxpath.Expr.indent(this.left_);
  return a += wgxpath.Expr.indent(this.right_)
};
wgxpath.BinaryExpr.Op_ = function(a, b, c, d) {
  this.opString_ = a;
  this.precedence_ = b;
  this.dataType_ = c;
  this.evaluate_ = d
};
wgxpath.BinaryExpr.Op_.prototype.getPrecedence = function() {
  return this.precedence_
};
wgxpath.BinaryExpr.Op_.prototype.toString = function() {
  return this.opString_
};
wgxpath.BinaryExpr.stringToOpMap_ = {};
wgxpath.BinaryExpr.createOp_ = function(a, b, c, d) {
  if(a in wgxpath.BinaryExpr.stringToOpMap_) {
    throw Error("Binary operator already created: " + a);
  }
  a = new wgxpath.BinaryExpr.Op_(a, b, c, d);
  return wgxpath.BinaryExpr.stringToOpMap_[a.toString()] = a
};
wgxpath.BinaryExpr.getOp = function(a) {
  return wgxpath.BinaryExpr.stringToOpMap_[a] || null
};
wgxpath.BinaryExpr.Op = {DIV:wgxpath.BinaryExpr.createOp_("div", 6, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) / b.asNumber(c)
}), MOD:wgxpath.BinaryExpr.createOp_("mod", 6, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) % b.asNumber(c)
}), MULT:wgxpath.BinaryExpr.createOp_("*", 6, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) * b.asNumber(c)
}), PLUS:wgxpath.BinaryExpr.createOp_("+", 5, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) + b.asNumber(c)
}), MINUS:wgxpath.BinaryExpr.createOp_("-", 5, wgxpath.DataType.NUMBER, function(a, b, c) {
  return a.asNumber(c) - b.asNumber(c)
}), LESSTHAN:wgxpath.BinaryExpr.createOp_("<", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a < b
  }, a, b, c)
}), GREATERTHAN:wgxpath.BinaryExpr.createOp_(">", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a > b
  }, a, b, c)
}), LESSTHAN_EQUAL:wgxpath.BinaryExpr.createOp_("<=", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a <= b
  }, a, b, c)
}), GREATERTHAN_EQUAL:wgxpath.BinaryExpr.createOp_(">=", 4, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a >= b
  }, a, b, c)
}), EQUAL:wgxpath.BinaryExpr.createOp_("=", 3, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a == b
  }, a, b, c, !0)
}), NOT_EQUAL:wgxpath.BinaryExpr.createOp_("!=", 3, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return wgxpath.BinaryExpr.compare_(function(a, b) {
    return a != b
  }, a, b, c, !0)
}), AND:wgxpath.BinaryExpr.createOp_("and", 2, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return a.asBool(c) && b.asBool(c)
}), OR:wgxpath.BinaryExpr.createOp_("or", 1, wgxpath.DataType.BOOLEAN, function(a, b, c) {
  return a.asBool(c) || b.asBool(c)
})};
wgxpath.FilterExpr = function(a, b) {
  if(b.getLength() && a.getDataType() != wgxpath.DataType.NODESET) {
    throw Error("Primary expression must evaluate to nodeset if filter has predicate(s).");
  }
  wgxpath.Expr.call(this, a.getDataType());
  this.primary_ = a;
  this.predicates_ = b;
  this.setNeedContextPosition(a.doesNeedContextPosition());
  this.setNeedContextNode(a.doesNeedContextNode())
};
goog.inherits(wgxpath.FilterExpr, wgxpath.Expr);
wgxpath.FilterExpr.prototype.evaluate = function(a) {
  a = this.primary_.evaluate(a);
  return this.predicates_.evaluatePredicates(a)
};
wgxpath.FilterExpr.prototype.toString = function() {
  var a;
  a = "Filter:" + wgxpath.Expr.indent(this.primary_);
  return a += wgxpath.Expr.indent(this.predicates_)
};
wgxpath.FunctionCall = function(a, b) {
  if(b.length < a.minArgs_) {
    throw Error("Function " + a.name_ + " expects at least" + a.minArgs_ + " arguments, " + b.length + " given");
  }
  if(!goog.isNull(a.maxArgs_) && b.length > a.maxArgs_) {
    throw Error("Function " + a.name_ + " expects at most " + a.maxArgs_ + " arguments, " + b.length + " given");
  }
  a.nodesetsRequired_ && goog.array.forEach(b, function(b, d) {
    if(b.getDataType() != wgxpath.DataType.NODESET) {
      throw Error("Argument " + d + " to function " + a.name_ + " is not of type Nodeset: " + b);
    }
  });
  wgxpath.Expr.call(this, a.dataType_);
  this.func_ = a;
  this.args_ = b;
  this.setNeedContextPosition(a.needContextPosition_ || goog.array.some(b, function(a) {
    return a.doesNeedContextPosition()
  }));
  this.setNeedContextNode(a.needContextNodeWithoutArgs_ && !b.length || a.needContextNodeWithArgs_ && !!b.length || goog.array.some(b, function(a) {
    return a.doesNeedContextNode()
  }))
};
goog.inherits(wgxpath.FunctionCall, wgxpath.Expr);
wgxpath.FunctionCall.prototype.evaluate = function(a) {
  return this.func_.evaluate_.apply(null, goog.array.concat(a, this.args_))
};
wgxpath.FunctionCall.prototype.toString = function() {
  var a = "Function: " + this.func_;
  if(this.args_.length) {
    var b = goog.array.reduce(this.args_, function(a, b) {
      return a + wgxpath.Expr.indent(b)
    }, "Arguments:"), a = a + wgxpath.Expr.indent(b)
  }
  return a
};
wgxpath.FunctionCall.Func_ = function(a, b, c, d, e, f, g, h, k) {
  this.name_ = a;
  this.dataType_ = b;
  this.needContextPosition_ = c;
  this.needContextNodeWithoutArgs_ = d;
  this.needContextNodeWithArgs_ = e;
  this.evaluate_ = f;
  this.minArgs_ = g;
  this.maxArgs_ = goog.isDef(h) ? h : g;
  this.nodesetsRequired_ = !!k
};
wgxpath.FunctionCall.Func_.prototype.toString = function() {
  return this.name_
};
wgxpath.FunctionCall.nameToFuncMap_ = {};
wgxpath.FunctionCall.createFunc_ = function(a, b, c, d, e, f, g, h, k) {
  if(a in wgxpath.FunctionCall.nameToFuncMap_) {
    throw Error("Function already created: " + a + ".");
  }
  b = new wgxpath.FunctionCall.Func_(a, b, c, d, e, f, g, h, k);
  return wgxpath.FunctionCall.nameToFuncMap_[a] = b
};
wgxpath.FunctionCall.getFunc = function(a) {
  return wgxpath.FunctionCall.nameToFuncMap_[a] || null
};
wgxpath.FunctionCall.Func = {BOOLEAN:wgxpath.FunctionCall.createFunc_("boolean", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b) {
  return b.asBool(a)
}, 1), CEILING:wgxpath.FunctionCall.createFunc_("ceiling", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return Math.ceil(b.asNumber(a))
}, 1), CONCAT:wgxpath.FunctionCall.createFunc_("concat", wgxpath.DataType.STRING, !1, !1, !1, function(a, b) {
  var c = goog.array.slice(arguments, 1);
  return goog.array.reduce(c, function(b, c) {
    return b + c.asString(a)
  }, "")
}, 2, null), CONTAINS:wgxpath.FunctionCall.createFunc_("contains", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b, c) {
  return goog.string.contains(b.asString(a), c.asString(a))
}, 2), COUNT:wgxpath.FunctionCall.createFunc_("count", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return b.evaluate(a).getLength()
}, 1, 1, !0), FALSE:wgxpath.FunctionCall.createFunc_("false", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a) {
  return!1
}, 0), FLOOR:wgxpath.FunctionCall.createFunc_("floor", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return Math.floor(b.asNumber(a))
}, 1), ID:wgxpath.FunctionCall.createFunc_("id", wgxpath.DataType.NODESET, !1, !1, !1, function(a, b) {
  function c(a) {
    if(wgxpath.userAgent.IE_DOC_PRE_9) {
      var b = e.all[a];
      if(b) {
        if(b.nodeType && a == b.id) {
          return b
        }
        if(b.length) {
          return goog.array.find(b, function(b) {
            return a == b.id
          })
        }
      }
      return null
    }
    return e.getElementById(a)
  }
  var d = a.getNode(), e = d.nodeType == goog.dom.NodeType.DOCUMENT ? d : d.ownerDocument, d = b.asString(a).split(/\s+/), f = [];
  goog.array.forEach(d, function(a) {
    (a = c(a)) && !goog.array.contains(f, a) && f.push(a)
  });
  f.sort(goog.dom.compareNodeOrder);
  var g = new wgxpath.NodeSet;
  goog.array.forEach(f, function(a) {
    g.add(a)
  });
  return g
}, 1), LANG:wgxpath.FunctionCall.createFunc_("lang", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b) {
  return!1
}, 1), LAST:wgxpath.FunctionCall.createFunc_("last", wgxpath.DataType.NUMBER, !0, !1, !1, function(a) {
  if(1 != arguments.length) {
    throw Error("Function last expects ()");
  }
  return a.getLast()
}, 0), LOCAL_NAME:wgxpath.FunctionCall.createFunc_("local-name", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  var c = b ? b.evaluate(a).getFirst() : a.getNode();
  return c ? c.nodeName.toLowerCase() : ""
}, 0, 1, !0), NAME:wgxpath.FunctionCall.createFunc_("name", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  var c = b ? b.evaluate(a).getFirst() : a.getNode();
  return c ? c.nodeName.toLowerCase() : ""
}, 0, 1, !0), NAMESPACE_URI:wgxpath.FunctionCall.createFunc_("namespace-uri", wgxpath.DataType.STRING, !0, !1, !1, function(a, b) {
  return""
}, 0, 1, !0), NORMALIZE_SPACE:wgxpath.FunctionCall.createFunc_("normalize-space", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  var c = b ? b.asString(a) : wgxpath.Node.getValueAsString(a.getNode());
  return goog.string.collapseWhitespace(c)
}, 0, 1), NOT:wgxpath.FunctionCall.createFunc_("not", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b) {
  return!b.asBool(a)
}, 1), NUMBER:wgxpath.FunctionCall.createFunc_("number", wgxpath.DataType.NUMBER, !1, !0, !1, function(a, b) {
  return b ? b.asNumber(a) : wgxpath.Node.getValueAsNumber(a.getNode())
}, 0, 1), POSITION:wgxpath.FunctionCall.createFunc_("position", wgxpath.DataType.NUMBER, !0, !1, !1, function(a) {
  return a.getPosition()
}, 0), ROUND:wgxpath.FunctionCall.createFunc_("round", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  return Math.round(b.asNumber(a))
}, 1), STARTS_WITH:wgxpath.FunctionCall.createFunc_("starts-with", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a, b, c) {
  return goog.string.startsWith(b.asString(a), c.asString(a))
}, 2), STRING:wgxpath.FunctionCall.createFunc_("string", wgxpath.DataType.STRING, !1, !0, !1, function(a, b) {
  return b ? b.asString(a) : wgxpath.Node.getValueAsString(a.getNode())
}, 0, 1), STRING_LENGTH:wgxpath.FunctionCall.createFunc_("string-length", wgxpath.DataType.NUMBER, !1, !0, !1, function(a, b) {
  return(b ? b.asString(a) : wgxpath.Node.getValueAsString(a.getNode())).length
}, 0, 1), SUBSTRING:wgxpath.FunctionCall.createFunc_("substring", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c, d) {
  c = c.asNumber(a);
  if(isNaN(c) || Infinity == c || -Infinity == c) {
    return""
  }
  d = d ? d.asNumber(a) : Infinity;
  if(isNaN(d) || -Infinity === d) {
    return""
  }
  c = Math.round(c) - 1;
  var e = Math.max(c, 0);
  a = b.asString(a);
  if(Infinity == d) {
    return a.substring(e)
  }
  b = Math.round(d);
  return a.substring(e, c + b)
}, 2, 3), SUBSTRING_AFTER:wgxpath.FunctionCall.createFunc_("substring-after", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c) {
  b = b.asString(a);
  a = c.asString(a);
  c = b.indexOf(a);
  return-1 == c ? "" : b.substring(c + a.length)
}, 2), SUBSTRING_BEFORE:wgxpath.FunctionCall.createFunc_("substring-before", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c) {
  b = b.asString(a);
  a = c.asString(a);
  a = b.indexOf(a);
  return-1 == a ? "" : b.substring(0, a)
}, 2), SUM:wgxpath.FunctionCall.createFunc_("sum", wgxpath.DataType.NUMBER, !1, !1, !1, function(a, b) {
  for(var c = b.evaluate(a).iterator(), d = 0, e = c.next();e;e = c.next()) {
    d += wgxpath.Node.getValueAsNumber(e)
  }
  return d
}, 1, 1, !0), TRANSLATE:wgxpath.FunctionCall.createFunc_("translate", wgxpath.DataType.STRING, !1, !1, !1, function(a, b, c, d) {
  b = b.asString(a);
  c = c.asString(a);
  var e = d.asString(a);
  a = [];
  for(d = 0;d < c.length;d++) {
    var f = c.charAt(d);
    f in a || (a[f] = e.charAt(d))
  }
  c = "";
  for(d = 0;d < b.length;d++) {
    f = b.charAt(d), c += f in a ? a[f] : f
  }
  return c
}, 3), TRUE:wgxpath.FunctionCall.createFunc_("true", wgxpath.DataType.BOOLEAN, !1, !1, !1, function(a) {
  return!0
}, 0)};
wgxpath.NodeTest = function() {
};
wgxpath.KindTest = function(a, b) {
  this.typeName_ = a;
  this.literal_ = goog.isDef(b) ? b : null;
  this.type_ = null;
  switch(a) {
    case "comment":
      this.type_ = goog.dom.NodeType.COMMENT;
      break;
    case "text":
      this.type_ = goog.dom.NodeType.TEXT;
      break;
    case "processing-instruction":
      this.type_ = goog.dom.NodeType.PROCESSING_INSTRUCTION;
      break;
    case "node":
      break;
    default:
      throw Error("Unexpected argument");
  }
};
wgxpath.KindTest.isValidType = function(a) {
  return"comment" == a || "text" == a || "processing-instruction" == a || "node" == a
};
wgxpath.KindTest.prototype.matches = function(a) {
  return goog.isNull(this.type_) || this.type_ == a.nodeType
};
wgxpath.KindTest.prototype.getType = function() {
  return this.type_
};
wgxpath.KindTest.prototype.getName = function() {
  return this.typeName_
};
wgxpath.KindTest.prototype.toString = function() {
  var a = "Kind Test: " + this.typeName_;
  goog.isNull(this.literal_) || (a += wgxpath.Expr.indent(this.literal_));
  return a
};
wgxpath.Literal = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.STRING);
  this.text_ = a.substring(1, a.length - 1)
};
goog.inherits(wgxpath.Literal, wgxpath.Expr);
wgxpath.Literal.prototype.evaluate = function(a) {
  return this.text_
};
wgxpath.Literal.prototype.toString = function() {
  return"Literal: " + this.text_
};
wgxpath.NameTest = function(a, b) {
  this.name_ = a.toLowerCase();
  this.namespaceUri_ = b ? b.toLowerCase() : wgxpath.NameTest.HTML_NAMESPACE_URI_
};
wgxpath.NameTest.HTML_NAMESPACE_URI_ = "http://www.w3.org/1999/xhtml";
wgxpath.NameTest.prototype.matches = function(a) {
  var b = a.nodeType;
  if(b != goog.dom.NodeType.ELEMENT && b != goog.dom.NodeType.ATTRIBUTE || "*" != this.name_ && this.name_ != a.nodeName.toLowerCase()) {
    return!1
  }
  a = a.namespaceURI ? a.namespaceURI.toLowerCase() : wgxpath.NameTest.HTML_NAMESPACE_URI_;
  return this.namespaceUri_ == a
};
wgxpath.NameTest.prototype.getName = function() {
  return this.name_
};
wgxpath.NameTest.prototype.getNamespaceUri = function() {
  return this.namespaceUri_
};
wgxpath.NameTest.prototype.toString = function() {
  return"Name Test: " + (this.namespaceUri_ == wgxpath.NameTest.HTML_NAMESPACE_URI_ ? "" : this.namespaceUri_ + ":") + this.name_
};
wgxpath.Number = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.NUMBER);
  this.value_ = a
};
goog.inherits(wgxpath.Number, wgxpath.Expr);
wgxpath.Number.prototype.evaluate = function(a) {
  return this.value_
};
wgxpath.Number.prototype.toString = function() {
  return"Number: " + this.value_
};
wgxpath.PathExpr = function(a, b) {
  wgxpath.Expr.call(this, a.getDataType());
  this.filter_ = a;
  this.steps_ = b;
  this.setNeedContextPosition(a.doesNeedContextPosition());
  this.setNeedContextNode(a.doesNeedContextNode());
  if(1 == this.steps_.length) {
    var c = this.steps_[0];
    c.doesIncludeDescendants() || c.getAxis() != wgxpath.Step.Axis.ATTRIBUTE || (c = c.getTest(), "*" != c.getName() && this.setQuickAttr({name:c.getName(), valueExpr:null}))
  }
};
goog.inherits(wgxpath.PathExpr, wgxpath.Expr);
wgxpath.PathExpr.RootHelperExpr = function() {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET)
};
goog.inherits(wgxpath.PathExpr.RootHelperExpr, wgxpath.Expr);
wgxpath.PathExpr.RootHelperExpr.prototype.evaluate = function(a) {
  var b = new wgxpath.NodeSet;
  a = a.getNode();
  a.nodeType == goog.dom.NodeType.DOCUMENT ? b.add(a) : b.add(a.ownerDocument);
  return b
};
wgxpath.PathExpr.RootHelperExpr.prototype.toString = function() {
  return"Root Helper Expression"
};
wgxpath.PathExpr.ContextHelperExpr = function() {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET)
};
goog.inherits(wgxpath.PathExpr.ContextHelperExpr, wgxpath.Expr);
wgxpath.PathExpr.ContextHelperExpr.prototype.evaluate = function(a) {
  var b = new wgxpath.NodeSet;
  b.add(a.getNode());
  return b
};
wgxpath.PathExpr.ContextHelperExpr.prototype.toString = function() {
  return"Context Helper Expression"
};
wgxpath.PathExpr.isValidOp = function(a) {
  return"/" == a || "//" == a
};
wgxpath.PathExpr.prototype.evaluate = function(a) {
  var b = this.filter_.evaluate(a);
  if(!(b instanceof wgxpath.NodeSet)) {
    throw Error("Filter expression must evaluate to nodeset.");
  }
  a = this.steps_;
  for(var c = 0, d = a.length;c < d && b.getLength();c++) {
    var e = a[c], f = e.getAxis().isReverse(), f = b.iterator(f), g;
    if(e.doesNeedContextPosition() || e.getAxis() != wgxpath.Step.Axis.FOLLOWING) {
      if(e.doesNeedContextPosition() || e.getAxis() != wgxpath.Step.Axis.PRECEDING) {
        for(g = f.next(), b = e.evaluate(new wgxpath.Context(g));null != (g = f.next());) {
          g = e.evaluate(new wgxpath.Context(g)), b = wgxpath.NodeSet.merge(b, g)
        }
      }else {
        g = f.next(), b = e.evaluate(new wgxpath.Context(g))
      }
    }else {
      for(g = f.next();(b = f.next()) && (!g.contains || g.contains(b)) && b.compareDocumentPosition(g) & 8;g = b) {
      }
      b = e.evaluate(new wgxpath.Context(g))
    }
  }
  return b
};
wgxpath.PathExpr.prototype.toString = function() {
  var a;
  a = "Path Expression:" + wgxpath.Expr.indent(this.filter_);
  if(this.steps_.length) {
    var b = goog.array.reduce(this.steps_, function(a, b) {
      return a + wgxpath.Expr.indent(b)
    }, "Steps:");
    a += wgxpath.Expr.indent(b)
  }
  return a
};
wgxpath.Predicates = function(a, b) {
  this.predicates_ = a;
  this.reverse_ = !!b
};
wgxpath.Predicates.prototype.evaluatePredicates = function(a, b) {
  for(var c = b || 0;c < this.predicates_.length;c++) {
    for(var d = this.predicates_[c], e = a.iterator(), f = a.getLength(), g, h = 0;g = e.next();h++) {
      var k = this.reverse_ ? f - h : h + 1;
      g = d.evaluate(new wgxpath.Context(g, k, f));
      if("number" == typeof g) {
        k = k == g
      }else {
        if("string" == typeof g || "boolean" == typeof g) {
          k = !!g
        }else {
          if(g instanceof wgxpath.NodeSet) {
            k = 0 < g.getLength()
          }else {
            throw Error("Predicate.evaluate returned an unexpected type.");
          }
        }
      }
      k || e.remove()
    }
  }
  return a
};
wgxpath.Predicates.prototype.getQuickAttr = function() {
  return 0 < this.predicates_.length ? this.predicates_[0].getQuickAttr() : null
};
wgxpath.Predicates.prototype.doesNeedContextPosition = function() {
  for(var a = 0;a < this.predicates_.length;a++) {
    var b = this.predicates_[a];
    if(b.doesNeedContextPosition() || b.getDataType() == wgxpath.DataType.NUMBER || b.getDataType() == wgxpath.DataType.VOID) {
      return!0
    }
  }
  return!1
};
wgxpath.Predicates.prototype.getLength = function() {
  return this.predicates_.length
};
wgxpath.Predicates.prototype.getPredicates = function() {
  return this.predicates_
};
wgxpath.Predicates.prototype.toString = function() {
  return goog.array.reduce(this.predicates_, function(a, b) {
    return a + wgxpath.Expr.indent(b)
  }, "Predicates:")
};
wgxpath.Step = function(a, b, c, d) {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET);
  this.axis_ = a;
  this.test_ = b;
  this.predicates_ = c || new wgxpath.Predicates([]);
  this.descendants_ = !!d;
  b = this.predicates_.getQuickAttr();
  a.supportsQuickAttr_ && b && (a = b.name, a = wgxpath.userAgent.IE_DOC_PRE_9 ? a.toLowerCase() : a, this.setQuickAttr({name:a, valueExpr:b.valueExpr}));
  this.setNeedContextPosition(this.predicates_.doesNeedContextPosition())
};
goog.inherits(wgxpath.Step, wgxpath.Expr);
wgxpath.Step.prototype.evaluate = function(a) {
  var b = a.getNode(), c = null, c = this.getQuickAttr(), d = null, e = null, f = 0;
  c && (d = c.name, e = c.valueExpr ? c.valueExpr.asString(a) : null, f = 1);
  if(this.descendants_) {
    if(this.doesNeedContextPosition() || this.axis_ != wgxpath.Step.Axis.CHILD) {
      if(a = (new wgxpath.Step(wgxpath.Step.Axis.DESCENDANT_OR_SELF, new wgxpath.KindTest("node"))).evaluate(a).iterator(), b = a.next()) {
        for(c = this.evaluate_(b, d, e, f);null != (b = a.next());) {
          c = wgxpath.NodeSet.merge(c, this.evaluate_(b, d, e, f))
        }
      }else {
        c = new wgxpath.NodeSet
      }
    }else {
      c = wgxpath.Node.getDescendantNodes(this.test_, b, d, e), c = this.predicates_.evaluatePredicates(c, f)
    }
  }else {
    c = this.evaluate_(a.getNode(), d, e, f)
  }
  return c
};
wgxpath.Step.prototype.evaluate_ = function(a, b, c, d) {
  a = this.axis_.func_(this.test_, a, b, c);
  return a = this.predicates_.evaluatePredicates(a, d)
};
wgxpath.Step.prototype.doesIncludeDescendants = function() {
  return this.descendants_
};
wgxpath.Step.prototype.getAxis = function() {
  return this.axis_
};
wgxpath.Step.prototype.getTest = function() {
  return this.test_
};
wgxpath.Step.prototype.toString = function() {
  var a;
  a = "Step:" + wgxpath.Expr.indent("Operator: " + (this.descendants_ ? "//" : "/"));
  this.axis_.name_ && (a += wgxpath.Expr.indent("Axis: " + this.axis_));
  a += wgxpath.Expr.indent(this.test_);
  if(this.predicates_.getLength()) {
    var b = goog.array.reduce(this.predicates_.getPredicates(), function(a, b) {
      return a + wgxpath.Expr.indent(b)
    }, "Predicates:");
    a += wgxpath.Expr.indent(b)
  }
  return a
};
wgxpath.Step.Axis_ = function(a, b, c, d) {
  this.name_ = a;
  this.func_ = b;
  this.reverse_ = c;
  this.supportsQuickAttr_ = d
};
wgxpath.Step.Axis_.prototype.isReverse = function() {
  return this.reverse_
};
wgxpath.Step.Axis_.prototype.toString = function() {
  return this.name_
};
wgxpath.Step.nameToAxisMap_ = {};
wgxpath.Step.createAxis_ = function(a, b, c, d) {
  if(a in wgxpath.Step.nameToAxisMap_) {
    throw Error("Axis already created: " + a);
  }
  b = new wgxpath.Step.Axis_(a, b, c, !!d);
  return wgxpath.Step.nameToAxisMap_[a] = b
};
wgxpath.Step.getAxis = function(a) {
  return wgxpath.Step.nameToAxisMap_[a] || null
};
wgxpath.Step.Axis = {ANCESTOR:wgxpath.Step.createAxis_("ancestor", function(a, b) {
  for(var c = new wgxpath.NodeSet, d = b;d = d.parentNode;) {
    a.matches(d) && c.unshift(d)
  }
  return c
}, !0), ANCESTOR_OR_SELF:wgxpath.Step.createAxis_("ancestor-or-self", function(a, b) {
  var c = new wgxpath.NodeSet, d = b;
  do {
    a.matches(d) && c.unshift(d)
  }while(d = d.parentNode);
  return c
}, !0), ATTRIBUTE:wgxpath.Step.createAxis_("attribute", function(a, b) {
  var c = new wgxpath.NodeSet, d = a.getName();
  if("style" == d && b.style && wgxpath.userAgent.IE_DOC_PRE_9) {
    return c.add(wgxpath.IEAttrWrapper.forStyleOf(b, b.sourceIndex)), c
  }
  var e = b.attributes;
  if(e) {
    if(a instanceof wgxpath.KindTest && goog.isNull(a.getType()) || "*" == d) {
      for(var d = b.sourceIndex, f = 0, g;g = e[f];f++) {
        wgxpath.userAgent.IE_DOC_PRE_9 ? g.nodeValue && c.add(wgxpath.IEAttrWrapper.forAttrOf(b, g, d)) : c.add(g)
      }
    }else {
      (g = e.getNamedItem(d)) && (wgxpath.userAgent.IE_DOC_PRE_9 ? g.nodeValue && c.add(wgxpath.IEAttrWrapper.forAttrOf(b, g, b.sourceIndex)) : c.add(g))
    }
  }
  return c
}, !1), CHILD:wgxpath.Step.createAxis_("child", wgxpath.Node.getChildNodes, !1, !0), DESCENDANT:wgxpath.Step.createAxis_("descendant", wgxpath.Node.getDescendantNodes, !1, !0), DESCENDANT_OR_SELF:wgxpath.Step.createAxis_("descendant-or-self", function(a, b, c, d) {
  var e = new wgxpath.NodeSet;
  wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b);
  return wgxpath.Node.getDescendantNodes(a, b, c, d, e)
}, !1, !0), FOLLOWING:wgxpath.Step.createAxis_("following", function(a, b, c, d) {
  var e = new wgxpath.NodeSet;
  do {
    for(var f = b;f = f.nextSibling;) {
      wgxpath.Node.attrMatches(f, c, d) && a.matches(f) && e.add(f), e = wgxpath.Node.getDescendantNodes(a, f, c, d, e)
    }
  }while(b = b.parentNode);
  return e
}, !1, !0), FOLLOWING_SIBLING:wgxpath.Step.createAxis_("following-sibling", function(a, b) {
  for(var c = new wgxpath.NodeSet, d = b;d = d.nextSibling;) {
    a.matches(d) && c.add(d)
  }
  return c
}, !1), NAMESPACE:wgxpath.Step.createAxis_("namespace", function(a, b) {
  return new wgxpath.NodeSet
}, !1), PARENT:wgxpath.Step.createAxis_("parent", function(a, b) {
  var c = new wgxpath.NodeSet;
  if(b.nodeType == goog.dom.NodeType.DOCUMENT) {
    return c
  }
  if(b.nodeType == goog.dom.NodeType.ATTRIBUTE) {
    return c.add(b.ownerElement), c
  }
  var d = b.parentNode;
  a.matches(d) && c.add(d);
  return c
}, !1), PRECEDING:wgxpath.Step.createAxis_("preceding", function(a, b, c, d) {
  var e = new wgxpath.NodeSet, f = [];
  do {
    f.unshift(b)
  }while(b = b.parentNode);
  for(var g = 1, h = f.length;g < h;g++) {
    var k = [];
    for(b = f[g];b = b.previousSibling;) {
      k.unshift(b)
    }
    for(var n = 0, q = k.length;n < q;n++) {
      b = k[n], wgxpath.Node.attrMatches(b, c, d) && a.matches(b) && e.add(b), e = wgxpath.Node.getDescendantNodes(a, b, c, d, e)
    }
  }
  return e
}, !0, !0), PRECEDING_SIBLING:wgxpath.Step.createAxis_("preceding-sibling", function(a, b) {
  for(var c = new wgxpath.NodeSet, d = b;d = d.previousSibling;) {
    a.matches(d) && c.unshift(d)
  }
  return c
}, !0), SELF:wgxpath.Step.createAxis_("self", function(a, b) {
  var c = new wgxpath.NodeSet;
  a.matches(b) && c.add(b);
  return c
}, !1)};
wgxpath.UnaryExpr = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.NUMBER);
  this.expr_ = a;
  this.setNeedContextPosition(a.doesNeedContextPosition());
  this.setNeedContextNode(a.doesNeedContextNode())
};
goog.inherits(wgxpath.UnaryExpr, wgxpath.Expr);
wgxpath.UnaryExpr.prototype.evaluate = function(a) {
  return-this.expr_.asNumber(a)
};
wgxpath.UnaryExpr.prototype.toString = function() {
  return"Unary Expression: -" + wgxpath.Expr.indent(this.expr_)
};
wgxpath.UnionExpr = function(a) {
  wgxpath.Expr.call(this, wgxpath.DataType.NODESET);
  this.paths_ = a;
  this.setNeedContextPosition(goog.array.some(this.paths_, function(a) {
    return a.doesNeedContextPosition()
  }));
  this.setNeedContextNode(goog.array.some(this.paths_, function(a) {
    return a.doesNeedContextNode()
  }))
};
goog.inherits(wgxpath.UnionExpr, wgxpath.Expr);
wgxpath.UnionExpr.prototype.evaluate = function(a) {
  var b = new wgxpath.NodeSet;
  goog.array.forEach(this.paths_, function(c) {
    c = c.evaluate(a);
    if(!(c instanceof wgxpath.NodeSet)) {
      throw Error("Path expression must evaluate to NodeSet.");
    }
    b = wgxpath.NodeSet.merge(b, c)
  });
  return b
};
wgxpath.UnionExpr.prototype.toString = function() {
  return goog.array.reduce(this.paths_, function(a, b) {
    return a + wgxpath.Expr.indent(b)
  }, "Union Expression:")
};
wgxpath.Parser = function(a, b) {
  this.lexer_ = a;
  this.nsResolver_ = b
};
wgxpath.Parser.prototype.parseExpr = function() {
  for(var a, b = [];;) {
    this.checkNotEmpty_("Missing right hand side of binary expression.");
    a = this.parseUnaryExpr_();
    var c = this.lexer_.next();
    if(!c) {
      break
    }
    var d = (c = wgxpath.BinaryExpr.getOp(c)) && c.getPrecedence();
    if(!d) {
      this.lexer_.back();
      break
    }
    for(;b.length && d <= b[b.length - 1].getPrecedence();) {
      a = new wgxpath.BinaryExpr(b.pop(), b.pop(), a)
    }
    b.push(a, c)
  }
  for(;b.length;) {
    a = new wgxpath.BinaryExpr(b.pop(), b.pop(), a)
  }
  return a
};
wgxpath.Parser.prototype.checkNotEmpty_ = function(a) {
  if(this.lexer_.empty()) {
    throw Error(a);
  }
};
wgxpath.Parser.prototype.checkNextEquals_ = function(a) {
  var b = this.lexer_.next();
  if(b != a) {
    throw Error("Bad token, expected: " + a + " got: " + b);
  }
};
wgxpath.Parser.prototype.checkNextNotEquals_ = function(a) {
  var b = this.lexer_.next();
  if(b != a) {
    throw Error("Bad token: " + b);
  }
};
wgxpath.Parser.prototype.parseFilterExpr_ = function() {
  var a;
  a = this.lexer_.peek();
  var b = a.charAt(0);
  switch(b) {
    case "$":
      throw Error("Variable reference not allowed in HTML XPath");;
    case "(":
      this.lexer_.next();
      a = this.parseExpr();
      this.checkNotEmpty_('unclosed "("');
      this.checkNextEquals_(")");
      break;
    case '"':
    ;
    case "'":
      a = this.parseLiteral_();
      break;
    default:
      if(isNaN(+a)) {
        if(!wgxpath.KindTest.isValidType(a) && /(?![0-9])[\w]/.test(b) && "(" == this.lexer_.peek(1)) {
          a = this.parseFunctionCall_()
        }else {
          return null
        }
      }else {
        a = this.parseNumber_()
      }
  }
  if("[" != this.lexer_.peek()) {
    return a
  }
  b = new wgxpath.Predicates(this.parsePredicates_());
  return new wgxpath.FilterExpr(a, b)
};
wgxpath.Parser.prototype.parseFunctionCall_ = function() {
  var a = this.lexer_.next(), a = wgxpath.FunctionCall.getFunc(a);
  this.lexer_.next();
  for(var b = [];")" != this.lexer_.peek();) {
    this.checkNotEmpty_("Missing function argument list.");
    b.push(this.parseExpr());
    if("," != this.lexer_.peek()) {
      break
    }
    this.lexer_.next()
  }
  this.checkNotEmpty_("Unclosed function argument list.");
  this.checkNextNotEquals_(")");
  return new wgxpath.FunctionCall(a, b)
};
wgxpath.Parser.prototype.parseKindTest_ = function() {
  var a = this.lexer_.next();
  if(!wgxpath.KindTest.isValidType(a)) {
    throw Error("Invalid type name: " + a);
  }
  this.checkNextEquals_("(");
  this.checkNotEmpty_("Bad nodetype");
  var b = this.lexer_.peek().charAt(0), c = null;
  if('"' == b || "'" == b) {
    c = this.parseLiteral_()
  }
  this.checkNotEmpty_("Bad nodetype");
  this.checkNextNotEquals_(")");
  return new wgxpath.KindTest(a, c)
};
wgxpath.Parser.prototype.parseLiteral_ = function() {
  var a = this.lexer_.next();
  if(2 > a.length) {
    throw Error("Unclosed literal string");
  }
  return new wgxpath.Literal(a)
};
wgxpath.Parser.prototype.parseNameTest_ = function() {
  var a = this.lexer_.next(), b = a.indexOf(":");
  if(-1 == b) {
    return new wgxpath.NameTest(a)
  }
  var c = a.substring(0, b), d = this.nsResolver_(c);
  if(!d) {
    throw Error("Namespace prefix not declared: " + c);
  }
  a = a.substr(b + 1);
  return new wgxpath.NameTest(a, d)
};
wgxpath.Parser.prototype.parseNumber_ = function() {
  return new wgxpath.Number(+this.lexer_.next())
};
wgxpath.Parser.prototype.parsePathExpr_ = function() {
  var a, b = [], c;
  if(wgxpath.PathExpr.isValidOp(this.lexer_.peek())) {
    a = this.lexer_.next();
    c = this.lexer_.peek();
    if("/" == a && (this.lexer_.empty() || "." != c && ".." != c && "@" != c && "*" != c && !/(?![0-9])[\w]/.test(c))) {
      return new wgxpath.PathExpr.RootHelperExpr
    }
    c = new wgxpath.PathExpr.RootHelperExpr;
    this.checkNotEmpty_("Missing next location step.");
    a = this.parseStep_(a);
    b.push(a)
  }else {
    if(a = this.parseFilterExpr_()) {
      if(wgxpath.PathExpr.isValidOp(this.lexer_.peek())) {
        c = a
      }else {
        return a
      }
    }else {
      a = this.parseStep_("/"), c = new wgxpath.PathExpr.ContextHelperExpr, b.push(a)
    }
  }
  for(;wgxpath.PathExpr.isValidOp(this.lexer_.peek());) {
    a = this.lexer_.next(), this.checkNotEmpty_("Missing next location step."), a = this.parseStep_(a), b.push(a)
  }
  return new wgxpath.PathExpr(c, b)
};
wgxpath.Parser.prototype.parseStep_ = function(a) {
  var b, c, d;
  if("/" != a && "//" != a) {
    throw Error('Step op should be "/" or "//"');
  }
  if("." == this.lexer_.peek()) {
    return c = new wgxpath.Step(wgxpath.Step.Axis.SELF, new wgxpath.KindTest("node")), this.lexer_.next(), c
  }
  if(".." == this.lexer_.peek()) {
    return c = new wgxpath.Step(wgxpath.Step.Axis.PARENT, new wgxpath.KindTest("node")), this.lexer_.next(), c
  }
  var e;
  if("@" == this.lexer_.peek()) {
    e = wgxpath.Step.Axis.ATTRIBUTE, this.lexer_.next(), this.checkNotEmpty_("Missing attribute name")
  }else {
    if("::" == this.lexer_.peek(1)) {
      if(!/(?![0-9])[\w]/.test(this.lexer_.peek().charAt(0))) {
        throw Error("Bad token: " + this.lexer_.next());
      }
      b = this.lexer_.next();
      e = wgxpath.Step.getAxis(b);
      if(!e) {
        throw Error("No axis with name: " + b);
      }
      this.lexer_.next();
      this.checkNotEmpty_("Missing node name")
    }else {
      e = wgxpath.Step.Axis.CHILD
    }
  }
  b = this.lexer_.peek();
  if(/(?![0-9])[\w]/.test(b.charAt(0))) {
    if("(" == this.lexer_.peek(1)) {
      if(!wgxpath.KindTest.isValidType(b)) {
        throw Error("Invalid node type: " + b);
      }
      b = this.parseKindTest_()
    }else {
      b = this.parseNameTest_()
    }
  }else {
    if("*" == b) {
      b = this.parseNameTest_()
    }else {
      throw Error("Bad token: " + this.lexer_.next());
    }
  }
  d = new wgxpath.Predicates(this.parsePredicates_(), e.isReverse());
  return c || new wgxpath.Step(e, b, d, "//" == a)
};
wgxpath.Parser.prototype.parsePredicates_ = function() {
  for(var a = [];"[" == this.lexer_.peek();) {
    this.lexer_.next();
    this.checkNotEmpty_("Missing predicate expression.");
    var b = this.parseExpr();
    a.push(b);
    this.checkNotEmpty_("Unclosed predicate expression.");
    this.checkNextEquals_("]")
  }
  return a
};
wgxpath.Parser.prototype.parseUnaryExpr_ = function() {
  return"-" == this.lexer_.peek() ? (this.lexer_.next(), new wgxpath.UnaryExpr(this.parseUnaryExpr_())) : this.parseUnionExpr_()
};
wgxpath.Parser.prototype.parseUnionExpr_ = function() {
  var a = this.parsePathExpr_();
  if("|" != this.lexer_.peek()) {
    return a
  }
  for(a = [a];"|" == this.lexer_.next();) {
    this.checkNotEmpty_("Missing next union location path."), a.push(this.parsePathExpr_())
  }
  this.lexer_.back();
  return new wgxpath.UnionExpr(a)
};
wgxpath.XPathResultType_ = {ANY_TYPE:0, NUMBER_TYPE:1, STRING_TYPE:2, BOOLEAN_TYPE:3, UNORDERED_NODE_ITERATOR_TYPE:4, ORDERED_NODE_ITERATOR_TYPE:5, UNORDERED_NODE_SNAPSHOT_TYPE:6, ORDERED_NODE_SNAPSHOT_TYPE:7, ANY_UNORDERED_NODE_TYPE:8, FIRST_ORDERED_NODE_TYPE:9};
wgxpath.XPathExpression_ = function(a, b) {
  if(!a.length) {
    throw Error("Empty XPath expression.");
  }
  var c = wgxpath.Lexer.tokenize(a);
  if(c.empty()) {
    throw Error("Invalid XPath expression.");
  }
  b ? goog.isFunction(b) || (b = goog.bind(b.lookupNamespaceURI, b)) : b = function(a) {
    return null
  };
  var d = (new wgxpath.Parser(c, b)).parseExpr();
  if(!c.empty()) {
    throw Error("Bad token: " + c.next());
  }
  this.evaluate = function(a, b) {
    var c = d.evaluate(new wgxpath.Context(a));
    return new wgxpath.XPathResult_(c, b)
  }
};
wgxpath.XPathResult_ = function(a, b) {
  if(b == wgxpath.XPathResultType_.ANY_TYPE) {
    if(a instanceof wgxpath.NodeSet) {
      b = wgxpath.XPathResultType_.UNORDERED_NODE_ITERATOR_TYPE
    }else {
      if("string" == typeof a) {
        b = wgxpath.XPathResultType_.STRING_TYPE
      }else {
        if("number" == typeof a) {
          b = wgxpath.XPathResultType_.NUMBER_TYPE
        }else {
          if("boolean" == typeof a) {
            b = wgxpath.XPathResultType_.BOOLEAN_TYPE
          }else {
            throw Error("Unexpected evaluation result.");
          }
        }
      }
    }
  }
  if(b != wgxpath.XPathResultType_.STRING_TYPE && b != wgxpath.XPathResultType_.NUMBER_TYPE && b != wgxpath.XPathResultType_.BOOLEAN_TYPE && !(a instanceof wgxpath.NodeSet)) {
    throw Error("value could not be converted to the specified type");
  }
  this.resultType = b;
  var c;
  switch(b) {
    case wgxpath.XPathResultType_.STRING_TYPE:
      this.stringValue = a instanceof wgxpath.NodeSet ? a.string() : "" + a;
      break;
    case wgxpath.XPathResultType_.NUMBER_TYPE:
      this.numberValue = a instanceof wgxpath.NodeSet ? a.number() : +a;
      break;
    case wgxpath.XPathResultType_.BOOLEAN_TYPE:
      this.booleanValue = a instanceof wgxpath.NodeSet ? 0 < a.getLength() : !!a;
      break;
    case wgxpath.XPathResultType_.UNORDERED_NODE_ITERATOR_TYPE:
    ;
    case wgxpath.XPathResultType_.ORDERED_NODE_ITERATOR_TYPE:
    ;
    case wgxpath.XPathResultType_.UNORDERED_NODE_SNAPSHOT_TYPE:
    ;
    case wgxpath.XPathResultType_.ORDERED_NODE_SNAPSHOT_TYPE:
      var d = a.iterator();
      c = [];
      for(var e = d.next();e;e = d.next()) {
        c.push(e instanceof wgxpath.IEAttrWrapper ? e.getNode() : e)
      }
      this.snapshotLength = a.getLength();
      this.invalidIteratorState = !1;
      break;
    case wgxpath.XPathResultType_.ANY_UNORDERED_NODE_TYPE:
    ;
    case wgxpath.XPathResultType_.FIRST_ORDERED_NODE_TYPE:
      d = a.getFirst();
      this.singleNodeValue = d instanceof wgxpath.IEAttrWrapper ? d.getNode() : d;
      break;
    default:
      throw Error("Unknown XPathResult type.");
  }
  var f = 0;
  this.iterateNext = function() {
    if(b != wgxpath.XPathResultType_.UNORDERED_NODE_ITERATOR_TYPE && b != wgxpath.XPathResultType_.ORDERED_NODE_ITERATOR_TYPE) {
      throw Error("iterateNext called with wrong result type");
    }
    return f >= c.length ? null : c[f++]
  };
  this.snapshotItem = function(a) {
    if(b != wgxpath.XPathResultType_.UNORDERED_NODE_SNAPSHOT_TYPE && b != wgxpath.XPathResultType_.ORDERED_NODE_SNAPSHOT_TYPE) {
      throw Error("snapshotItem called with wrong result type");
    }
    return a >= c.length || 0 > a ? null : c[a]
  }
};
wgxpath.XPathResult_.ANY_TYPE = wgxpath.XPathResultType_.ANY_TYPE;
wgxpath.XPathResult_.NUMBER_TYPE = wgxpath.XPathResultType_.NUMBER_TYPE;
wgxpath.XPathResult_.STRING_TYPE = wgxpath.XPathResultType_.STRING_TYPE;
wgxpath.XPathResult_.BOOLEAN_TYPE = wgxpath.XPathResultType_.BOOLEAN_TYPE;
wgxpath.XPathResult_.UNORDERED_NODE_ITERATOR_TYPE = wgxpath.XPathResultType_.UNORDERED_NODE_ITERATOR_TYPE;
wgxpath.XPathResult_.ORDERED_NODE_ITERATOR_TYPE = wgxpath.XPathResultType_.ORDERED_NODE_ITERATOR_TYPE;
wgxpath.XPathResult_.UNORDERED_NODE_SNAPSHOT_TYPE = wgxpath.XPathResultType_.UNORDERED_NODE_SNAPSHOT_TYPE;
wgxpath.XPathResult_.ORDERED_NODE_SNAPSHOT_TYPE = wgxpath.XPathResultType_.ORDERED_NODE_SNAPSHOT_TYPE;
wgxpath.XPathResult_.ANY_UNORDERED_NODE_TYPE = wgxpath.XPathResultType_.ANY_UNORDERED_NODE_TYPE;
wgxpath.XPathResult_.FIRST_ORDERED_NODE_TYPE = wgxpath.XPathResultType_.FIRST_ORDERED_NODE_TYPE;
wgxpath.install = function(a) {
  a = a || goog.global;
  var b = a.document;
  b.evaluate || (a.XPathResult = wgxpath.XPathResult_, b.evaluate = function(a, b, e, f, g) {
    return(new wgxpath.XPathExpression_(a, e)).evaluate(b, f)
  }, b.createExpression = function(a, b) {
    return new wgxpath.XPathExpression_(a, b)
  })
};
bot.locators = {};
bot.locators.xpath = {};
bot.locators.XPathResult_ = {ORDERED_NODE_SNAPSHOT_TYPE:7, FIRST_ORDERED_NODE_TYPE:9};
bot.locators.xpath.DEFAULT_RESOLVER_ = function() {
  var a = {svg:"http://www.w3.org/2000/svg"};
  return function(b) {
    return a[b] || null
  }
}();
bot.locators.xpath.evaluate_ = function(a, b, c) {
  var d = goog.dom.getOwnerDocument(a);
  (goog.userAgent.IE || goog.userAgent.product.ANDROID) && wgxpath.install(goog.dom.getWindow(d));
  try {
    var e = d.createNSResolver ? d.createNSResolver(d.documentElement) : bot.locators.xpath.DEFAULT_RESOLVER_;
    return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(7) ? d.evaluate.call(d, b, a, e, c, null) : d.evaluate(b, a, e, c, null)
  }catch(f) {
    if(!goog.userAgent.GECKO || "NS_ERROR_ILLEGAL_VALUE" != f.name) {
      throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "Unable to locate an element with the xpath expression " + b + " because of the following error:\n" + f);
    }
  }
};
bot.locators.xpath.checkElement_ = function(a, b) {
  if(!a || a.nodeType != goog.dom.NodeType.ELEMENT) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, 'The result of the xpath expression "' + b + '" is: ' + a + ". It should be an element.");
  }
};
bot.locators.xpath.single = function(a, b) {
  var c = function() {
    var c = bot.locators.xpath.evaluate_(b, a, bot.locators.XPathResult_.FIRST_ORDERED_NODE_TYPE);
    return c ? (c = c.singleNodeValue, goog.userAgent.OPERA ? c : c || null) : b.selectSingleNode ? (c = goog.dom.getOwnerDocument(b), c.setProperty && c.setProperty("SelectionLanguage", "XPath"), b.selectSingleNode(a)) : null
  }();
  goog.isNull(c) || bot.locators.xpath.checkElement_(c, a);
  return c
};
bot.locators.xpath.many = function(a, b) {
  var c = function() {
    var c = bot.locators.xpath.evaluate_(b, a, bot.locators.XPathResult_.ORDERED_NODE_SNAPSHOT_TYPE);
    if(c) {
      var e = c.snapshotLength;
      goog.userAgent.OPERA && !goog.isDef(e) && bot.locators.xpath.checkElement_(null, a);
      for(var f = [], g = 0;g < e;++g) {
        f.push(c.snapshotItem(g))
      }
      return f
    }
    return b.selectNodes ? (c = goog.dom.getOwnerDocument(b), c.setProperty && c.setProperty("SelectionLanguage", "XPath"), b.selectNodes(a)) : []
  }();
  goog.array.forEach(c, function(b) {
    bot.locators.xpath.checkElement_(b, a)
  });
  return c
};
goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d
};
goog.math.Box.boundingBox = function(a) {
  for(var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1;c < arguments.length;c++) {
    var d = arguments[c];
    b.top = Math.min(b.top, d.y);
    b.right = Math.max(b.right, d.x);
    b.bottom = Math.max(b.bottom, d.y);
    b.left = Math.min(b.left, d.x)
  }
  return b
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
  goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += b, this.bottom += c, this.left -= d);
  return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1
};
goog.math.Box.contains = function(a, b) {
  return a && b ? b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom : !1
};
goog.math.Box.relativePositionX = function(a, b) {
  return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, b) {
  return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0
};
goog.math.Box.distance = function(a, b) {
  var c = goog.math.Box.relativePositionX(a, b), d = goog.math.Box.relativePositionY(a, b);
  return Math.sqrt(c * c + d * d)
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
  return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this
};
goog.math.Box.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
  return this
};
goog.math.Box.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.right *= a;
  this.top *= c;
  this.bottom *= c;
  return this
};
goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1
};
goog.math.Rect.prototype.intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if(b <= c) {
    var d = Math.max(this.top, a.top);
    a = Math.min(this.top + this.height, a.top + a.height);
    if(d <= a) {
      return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
    }
  }
  return!1
};
goog.math.Rect.intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if(c <= d) {
    var e = Math.max(a.top, b.top), f = Math.min(a.top + a.height, b.top + b.height);
    if(e <= f) {
      return new goog.math.Rect(c, e, d - c, f - e)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
  var c = goog.math.Rect.intersection(a, b);
  if(!c || !c.height || !c.width) {
    return[a.clone()]
  }
  var c = [], d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, k = b.top + b.height;
  b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
  k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
  if(!a || !b) {
    return null
  }
  var c = a.clone();
  c.boundingRect(b);
  return c
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.squaredDistance = function(a) {
  var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
  a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
  return b * b + a * a
};
goog.math.Rect.prototype.distance = function(a) {
  return Math.sqrt(this.squaredDistance(a))
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top)
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2)
};
goog.math.Rect.prototype.getBottomRight = function() {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height)
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Rect.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += a, goog.isNumber(b) && (this.top += b));
  return this
};
goog.math.Rect.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.width *= a;
  this.top *= c;
  this.height *= c;
  return this
};
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
  return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null
};
goog.dom.vendor.getVendorPrefix = function() {
  return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null
};
goog.style = {};
goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS = !1;
goog.style.setStyle = function(a, b, c) {
  goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
  (c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b)
};
goog.style.getVendorJsStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  if(void 0 === a.style[c]) {
    var d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(b);
    if(void 0 !== a.style[d]) {
      return d
    }
  }
  return c
};
goog.style.getVendorStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(b), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b
};
goog.style.getStyle = function(a, b) {
  var c = a.style[goog.string.toCamelCase(b)];
  return"undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, b, c) {
  var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersionOrHigher("1.9");
  b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
  a.style.left = goog.style.getPixelStyleValue_(d, e);
  a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
  a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(a).isCss1CompatMode() ? a.documentElement : a.body
};
goog.style.getViewportPageOffset = function(a) {
  var b = a.body;
  a = a.documentElement;
  return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop)
};
goog.style.getBoundingClientRect_ = function(a) {
  var b;
  try {
    b = a.getBoundingClientRect()
  }catch(c) {
    return{left:0, top:0, right:0, bottom:0}
  }
  goog.userAgent.IE && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b
};
goog.style.getOffsetParent = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return a.offsetParent
  }
  var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = "fixed" == c || "absolute" == c;
  for(a = a.parentNode;a && a != b;a = a.parentNode) {
    if(c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(a) {
  for(var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement();a = goog.style.getOffsetParent(a);) {
    if(!(goog.userAgent.IE && 0 == a.clientWidth || goog.userAgent.WEBKIT && 0 == a.clientHeight && a == d || a == d || a == e || "visible" == goog.style.getStyle_(a, "overflow"))) {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x)
    }
  }
  d = f.scrollLeft;
  f = f.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, f);
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, f + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
  var d = goog.style.getPageOffset(a), e = goog.style.getPageOffset(b), f = goog.style.getBorderBox(b), g = d.x - e.x - f.left, d = d.y - e.y - f.top, e = b.clientWidth - a.offsetWidth;
  a = b.clientHeight - a.offsetHeight;
  f = b.scrollLeft;
  b = b.scrollTop;
  c ? (f += g - e / 2, b += d - a / 2) : (f += Math.min(g, Math.max(g - e, 0)), b += Math.min(d, Math.max(d - a, 0)));
  return new goog.math.Coordinate(f, b)
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  a = goog.style.getContainerOffsetToScrollInto(a, b, c);
  b.scrollLeft = a.x;
  b.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("1.9")) {
    var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
    if(goog.style.isRightToLeft(a)) {
      var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")), b = b + c
    }
    return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
  }
  return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
  var b, c = goog.dom.getOwnerDocument(a), d = goog.style.getStyle_(a, "position");
  goog.asserts.assertObject(a, "Parameter is required");
  var e = !goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS && goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY), f = new goog.math.Coordinate(0, 0), g = goog.style.getClientViewportElement(c);
  if(a == g) {
    return f
  }
  if(goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y
  }else {
    if(c.getBoxObjectFor && !e) {
      b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY
    }else {
      b = a;
      do {
        f.x += b.offsetLeft;
        f.y += b.offsetTop;
        b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
        if(goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
          f.x += c.body.scrollLeft;
          f.y += c.body.scrollTop;
          break
        }
        b = b.offsetParent
      }while(b && b != a);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) {
        f.y -= c.body.offsetTop
      }
      for(b = a;(b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) {
        f.x -= b.scrollLeft, goog.userAgent.OPERA && "TR" == b.tagName || (f.y -= b.scrollTop)
      }
    }
  }
  return f
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), e = a;
  do {
    var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPositionForElement_(goog.asserts.assert(e));
    c.x += f.x;
    c.y += f.y
  }while(d && d != b && (e = d.frameElement) && (d = d.parent));
  return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if(b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body;
    c = goog.style.getFramedPageOffset(d, c.getWindow());
    c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
    goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
    a.left += c.x;
    a.top += c.y
  }
};
goog.style.getRelativePosition = function(a, b) {
  var c = goog.style.getClientPosition(a), d = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPositionForElement_ = function(a) {
  var b;
  if(goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a), b = new goog.math.Coordinate(b.left, b.top)
  }else {
    b = goog.dom.getDomHelper(a).getDocumentScroll();
    var c = goog.style.getPageOffset(a);
    b = new goog.math.Coordinate(c.x - b.x, c.y - b.y)
  }
  return goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(12) ? goog.math.Coordinate.sum(b, goog.style.getCssTranslation(a)) : b
};
goog.style.getClientPosition = function(a) {
  goog.asserts.assert(a);
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_(a)
  }
  var b = goog.isFunction(a.getBrowserEvent), c = a;
  a.targetTouches ? c = a.targetTouches[0] : b && a.getBrowserEvent().targetTouches && (c = a.getBrowserEvent().targetTouches[0]);
  return new goog.math.Coordinate(c.clientX, c.clientY)
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
  goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
  if(b instanceof goog.math.Size) {
    c = b.height, b = b.width
  }else {
    if(void 0 == c) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
  if("none" != goog.style.getStyle_(a, "display")) {
    return goog.style.getSizeWithDisplay_(a)
  }
  var b = a.style, c = b.display, d = b.visibility, e = b.position;
  b.visibility = "hidden";
  b.position = "absolute";
  b.display = "inline";
  a = goog.style.getSizeWithDisplay_(a);
  b.display = c;
  b.position = e;
  b.visibility = d;
  return a
};
goog.style.getSizeWithDisplay_ = function(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = goog.userAgent.WEBKIT && !b && !c;
  return goog.isDef(b) && !d || !a.getBoundingClientRect ? new goog.math.Size(b, c) : (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top))
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a);
  a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
  var b = a.style;
  a = "";
  "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
  return"" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
  var c = a.style;
  "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  var c = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
  goog.style.setElementShown(a, b)
};
goog.style.setElementShown = function(a, b) {
  a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
  return"none" != a.style.display
};
goog.style.installStyles = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = null;
  if(goog.userAgent.IE) {
    d = c.getDocument().createStyleSheet(), goog.style.setStyles(d, a)
  }else {
    var e = c.getElementsByTagNameAndClass("head")[0];
    e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d));
    d = c.createDom("style");
    goog.style.setStyles(d, a);
    c.appendChild(e, d)
  }
  return d
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
  goog.userAgent.IE ? a.cssText = b : a.innerHTML = b
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersionOrHigher("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
  return"rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
  c = c ? null : a.getElementsByTagName("*");
  var d = goog.style.unselectableStyle_;
  if(d) {
    if(b = b ? "none" : "", a.style[d] = b, c) {
      a = 0;
      for(var e;e = c[a];a++) {
        e.style[d] = b
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      if(b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for(a = 0;e = c[a];a++) {
          e.setAttribute("unselectable", b)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) {
    goog.style.setBoxSizingSize_(a, b, "border-box")
  }else {
    if(c = a.style, d) {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
      c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    }else {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }
  }
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if(c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) {
    return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a)
  }
  c = goog.style.getBorderBoxSize(a);
  b = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) {
    goog.style.setBoxSizingSize_(a, b, "content-box")
  }else {
    if(c = a.style, d) {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }else {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
      c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
  }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
  a.width = Math.max(b.width, 0) + "px";
  a.height = Math.max(b.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if(/^\d+px?$/.test(b)) {
    return parseInt(b, 10)
  }
  var e = a.style[c], f = a.runtimeStyle[c];
  a.runtimeStyle[c] = a.currentStyle[c];
  a.style[c] = b;
  b = a.style[d];
  a.style[c] = e;
  a.runtimeStyle[c] = f;
  return b
};
goog.style.getIePixelDistance_ = function(a, b) {
  var c = goog.style.getCascadedStyle(a, b);
  return c ? goog.style.getIePixelValue_(a, c, "left", "pixelLeft") : 0
};
goog.style.getBox_ = function(a, b) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left"), d = goog.style.getIePixelDistance_(a, b + "Right"), e = goog.style.getIePixelDistance_(a, b + "Top"), f = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, f, c)
  }
  c = goog.style.getComputedStyle(a, b + "Left");
  d = goog.style.getComputedStyle(a, b + "Right");
  e = goog.style.getComputedStyle(a, b + "Top");
  f = goog.style.getComputedStyle(a, b + "Bottom");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if("none" == goog.style.getCascadedStyle(a, b + "Style")) {
    return 0
  }
  var c = goog.style.getCascadedStyle(a, b + "Width");
  return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
  if(goog.userAgent.IE) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft"), c = goog.style.getIePixelBorder_(a, "borderRight"), d = goog.style.getIePixelBorder_(a, "borderTop");
    a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b)
  }
  b = goog.style.getComputedStyle(a, "borderLeftWidth");
  c = goog.style.getComputedStyle(a, "borderRightWidth");
  d = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if(b.body.createTextRange) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName")
    }catch(d) {
      c = ""
    }
  }
  c || (c = goog.style.getStyle_(a, "fontFamily"));
  a = c.split(",");
  1 < a.length && (c = a[0]);
  return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return(a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if(b && "px" == c) {
    return parseInt(b, 10)
  }
  if(goog.userAgent.IE) {
    if(c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft")
    }
    if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
    }
  }
  c = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    a = a.split(/\s*:\s*/);
    2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
  });
  return b
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    b.push(goog.string.toSelectorCase(d), ":", a, ";")
  });
  return b.join("")
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
  var b = goog.dom.createElement("div");
  a && (b.className = a);
  b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("div");
  goog.style.setSize(a, "200px", "200px");
  b.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  a = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
  var b;
  goog.userAgent.IE ? b = "-ms-transform" : goog.userAgent.WEBKIT ? b = "-webkit-transform" : goog.userAgent.OPERA ? b = "-o-transform" : goog.userAgent.GECKO && (b = "-moz-transform");
  var c;
  b && (c = goog.style.getStyle_(a, b));
  c || (c = goog.style.getStyle_(a, "transform"));
  return c ? (a = c.match(goog.style.MATRIX_TRANSLATION_REGEX_)) ? new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2])) : new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(0, 0)
};
bot.dom = {};
bot.dom.getActiveElement = function(a) {
  return goog.dom.getActiveElement(goog.dom.getOwnerDocument(a))
};
bot.dom.isElement = function(a, b) {
  return!!a && a.nodeType == goog.dom.NodeType.ELEMENT && (!b || a.tagName.toUpperCase() == b)
};
bot.dom.isInteractable = function(a) {
  return bot.dom.isShown(a, !0) && bot.dom.isEnabled(a) && !bot.dom.hasPointerEventsDisabled_(a)
};
bot.dom.hasPointerEventsDisabled_ = function(a) {
  return goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.GECKO && !bot.userAgent.isEngineVersion("1.9.2") ? !1 : "none" == bot.dom.getEffectiveStyle(a, "pointer-events")
};
bot.dom.isSelectable = function(a) {
  return bot.dom.isElement(a, goog.dom.TagName.OPTION) ? !0 : bot.dom.isElement(a, goog.dom.TagName.INPUT) ? (a = a.type.toLowerCase(), "checkbox" == a || "radio" == a) : !1
};
bot.dom.isSelected = function(a) {
  if(!bot.dom.isSelectable(a)) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "Element is not selectable");
  }
  var b = "selected", c = a.type && a.type.toLowerCase();
  if("checkbox" == c || "radio" == c) {
    b = "checked"
  }
  return!!bot.dom.getProperty(a, b)
};
bot.dom.FOCUSABLE_FORM_FIELDS_ = [goog.dom.TagName.A, goog.dom.TagName.AREA, goog.dom.TagName.BUTTON, goog.dom.TagName.INPUT, goog.dom.TagName.LABEL, goog.dom.TagName.SELECT, goog.dom.TagName.TEXTAREA];
bot.dom.isFocusable = function(a) {
  return goog.array.some(bot.dom.FOCUSABLE_FORM_FIELDS_, function(b) {
    return a.tagName.toUpperCase() == b
  }) || null != bot.dom.getAttribute(a, "tabindex") && 0 <= Number(bot.dom.getProperty(a, "tabIndex"))
};
bot.dom.getProperty = function(a, b) {
  return bot.userAgent.IE_DOC_PRE8 && "value" == b && bot.dom.isElement(a, goog.dom.TagName.OPTION) && goog.isNull(bot.dom.getAttribute(a, "value")) ? goog.dom.getRawTextContent(a) : a[b]
};
bot.dom.SPLIT_STYLE_ATTRIBUTE_ON_SEMICOLONS_REGEXP_ = /[;]+(?=(?:(?:[^"]*"){2})*[^"]*$)(?=(?:(?:[^']*'){2})*[^']*$)(?=(?:[^()]*\([^()]*\))*[^()]*$)/;
bot.dom.standardizeStyleAttribute_ = function(a) {
  a = a.split(bot.dom.SPLIT_STYLE_ATTRIBUTE_ON_SEMICOLONS_REGEXP_);
  var b = [];
  goog.array.forEach(a, function(a) {
    var d = a.indexOf(":");
    0 < d && (a = [a.slice(0, d), a.slice(d + 1)], 2 == a.length && b.push(a[0].toLowerCase(), ":", a[1], ";"))
  });
  b = b.join("");
  b = ";" == b.charAt(b.length - 1) ? b : b + ";";
  return goog.userAgent.OPERA ? b.replace(/\w+:;/g, "") : b
};
bot.dom.getAttribute = function(a, b) {
  b = b.toLowerCase();
  if("style" == b) {
    return bot.dom.standardizeStyleAttribute_(a.style.cssText)
  }
  if(bot.userAgent.IE_DOC_PRE8 && "value" == b && bot.dom.isElement(a, goog.dom.TagName.INPUT)) {
    return a.value
  }
  if(bot.userAgent.IE_DOC_PRE9 && !0 === a[b]) {
    return String(a.getAttribute(b))
  }
  var c = a.getAttributeNode(b);
  return c && c.specified ? c.value : null
};
bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_ = [goog.dom.TagName.BUTTON, goog.dom.TagName.INPUT, goog.dom.TagName.OPTGROUP, goog.dom.TagName.OPTION, goog.dom.TagName.SELECT, goog.dom.TagName.TEXTAREA];
bot.dom.isEnabled = function(a) {
  var b = a.tagName.toUpperCase();
  return goog.array.contains(bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_, b) ? bot.dom.getProperty(a, "disabled") ? !1 : a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && goog.dom.TagName.OPTGROUP == b || goog.dom.TagName.OPTION == b ? bot.dom.isEnabled(a.parentNode) : !goog.dom.getAncestor(a, function(a) {
    var b = a.parentNode;
    if(b && bot.dom.isElement(b, goog.dom.TagName.FIELDSET) && bot.dom.getProperty(b, "disabled")) {
      if(!bot.dom.isElement(a, goog.dom.TagName.LEGEND)) {
        return!0
      }
      for(;a = goog.dom.getPreviousElementSibling(a);) {
        if(bot.dom.isElement(a, goog.dom.TagName.LEGEND)) {
          return!0
        }
      }
    }
    return!1
  }, !0) : !0
};
bot.dom.TEXTUAL_INPUT_TYPES_ = "text search tel url email password number".split(" ");
bot.dom.isTextual = function(a) {
  return bot.dom.isElement(a, goog.dom.TagName.TEXTAREA) ? !0 : bot.dom.isElement(a, goog.dom.TagName.INPUT) ? (a = a.type.toLowerCase(), goog.array.contains(bot.dom.TEXTUAL_INPUT_TYPES_, a)) : bot.dom.isContentEditable(a) ? !0 : !1
};
bot.dom.isContentEditable = function(a) {
  function b(a) {
    return"inherit" == a.contentEditable ? (a = bot.dom.getParentElement(a)) ? b(a) : !1 : "true" == a.contentEditable
  }
  return goog.isDef(a.contentEditable) ? !goog.userAgent.IE && goog.isDef(a.isContentEditable) ? a.isContentEditable : b(a) : !1
};
bot.dom.isEditable = function(a) {
  return bot.dom.isTextual(a) && !bot.dom.getProperty(a, "readOnly")
};
bot.dom.getParentElement = function(a) {
  for(a = a.parentNode;a && a.nodeType != goog.dom.NodeType.ELEMENT && a.nodeType != goog.dom.NodeType.DOCUMENT && a.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT;) {
    a = a.parentNode
  }
  return bot.dom.isElement(a) ? a : null
};
bot.dom.getInlineStyle = function(a, b) {
  return goog.style.getStyle(a, b)
};
bot.dom.getEffectiveStyle = function(a, b) {
  var c = goog.string.toCamelCase(b);
  if("float" == c || "cssFloat" == c || "styleFloat" == c) {
    c = bot.userAgent.IE_DOC_PRE9 ? "styleFloat" : "cssFloat"
  }
  c = goog.style.getComputedStyle(a, c) || bot.dom.getCascadedStyle_(a, c);
  return null === c ? null : bot.color.standardizeColor(b, c)
};
bot.dom.getCascadedStyle_ = function(a, b) {
  var c = a.currentStyle || a.style, d = c[b];
  !goog.isDef(d) && goog.isFunction(c.getPropertyValue) && (d = c.getPropertyValue(b));
  return"inherit" != d ? goog.isDef(d) ? d : null : (c = bot.dom.getParentElement(a)) ? bot.dom.getCascadedStyle_(c, b) : null
};
bot.dom.isShown = function(a, b) {
  function c(a) {
    if("none" == bot.dom.getEffectiveStyle(a, "display")) {
      return!1
    }
    a = bot.dom.getParentElement(a);
    return!a || c(a)
  }
  function d(a) {
    var b = bot.dom.getClientRect(a);
    return 0 < b.height && 0 < b.width ? !0 : bot.dom.isElement(a, "PATH") && (0 < b.height || 0 < b.width) ? (a = bot.dom.getEffectiveStyle(a, "stroke-width"), !!a && 0 < parseInt(a, 10)) : "hidden" != bot.dom.getEffectiveStyle(a, "overflow") && goog.array.some(a.childNodes, function(a) {
      return a.nodeType == goog.dom.NodeType.TEXT || bot.dom.isElement(a) && d(a)
    })
  }
  function e(a) {
    var b = bot.dom.getEffectiveStyle(a, "-o-transform") || bot.dom.getEffectiveStyle(a, "-webkit-transform") || bot.dom.getEffectiveStyle(a, "-ms-transform") || bot.dom.getEffectiveStyle(a, "-moz-transform") || bot.dom.getEffectiveStyle(a, "transform");
    if(b && "none" !== b) {
      return b = goog.style.getClientPosition(a), a = bot.dom.getClientRect(a), 0 <= b.x + a.width && 0 <= b.y + a.height ? !0 : !1
    }
    a = bot.dom.getParentElement(a);
    return!a || e(a)
  }
  if(!bot.dom.isElement(a)) {
    throw Error("Argument to isShown must be of type Element");
  }
  if(bot.dom.isElement(a, goog.dom.TagName.OPTION) || bot.dom.isElement(a, goog.dom.TagName.OPTGROUP)) {
    var f = goog.dom.getAncestor(a, function(a) {
      return bot.dom.isElement(a, goog.dom.TagName.SELECT)
    });
    return!!f && bot.dom.isShown(f, !0)
  }
  return(f = bot.dom.maybeFindImageMap_(a)) ? !!f.image && 0 < f.rect.width && 0 < f.rect.height && bot.dom.isShown(f.image, b) : bot.dom.isElement(a, goog.dom.TagName.INPUT) && "hidden" == a.type.toLowerCase() || bot.dom.isElement(a, goog.dom.TagName.NOSCRIPT) || "hidden" == bot.dom.getEffectiveStyle(a, "visibility") || !c(a) || !b && 0 == bot.dom.getOpacity(a) || !d(a) || bot.dom.getOverflowState(a) == bot.dom.OverflowState.HIDDEN ? !1 : e(a)
};
bot.dom.OverflowState = {NONE:"none", HIDDEN:"hidden", SCROLL:"scroll"};
bot.dom.getOverflowState = function(a) {
  function b(a) {
    var b = a;
    if("visible" == h) {
      if(a == f) {
        b = g
      }else {
        if(a == g) {
          return{x:"visible", y:"visible"}
        }
      }
    }
    b = {x:bot.dom.getEffectiveStyle(b, "overflow-x"), y:bot.dom.getEffectiveStyle(b, "overflow-y")};
    a == f && (b.x = "hidden" == b.x ? "hidden" : "auto", b.y = "hidden" == b.y ? "hidden" : "auto");
    return b
  }
  function c(a) {
    function b(a) {
      if(a == f) {
        return!0
      }
      var d = bot.dom.getEffectiveStyle(a, "display");
      return goog.string.startsWith(d, "inline") || "absolute" == c && "static" == bot.dom.getEffectiveStyle(a, "position") ? !1 : !0
    }
    var c = bot.dom.getEffectiveStyle(a, "position");
    if("fixed" == c) {
      return f
    }
    for(a = bot.dom.getParentElement(a);a && !b(a);) {
      a = bot.dom.getParentElement(a)
    }
    return a
  }
  var d = bot.dom.getClientRect(a), e = goog.dom.getOwnerDocument(a), f = e.documentElement, g = e.body, h = bot.dom.getEffectiveStyle(f, "overflow");
  for(a = c(a);a;a = c(a)) {
    var k = bot.dom.getClientRect(a), e = b(a), n = d.left >= k.left + k.width, k = d.top >= k.top + k.height;
    if(n && "hidden" == e.x || k && "hidden" == e.y) {
      return bot.dom.OverflowState.HIDDEN
    }
    if(n && "visible" != e.x || k && "visible" != e.y) {
      return bot.dom.getOverflowState(a) == bot.dom.OverflowState.HIDDEN ? bot.dom.OverflowState.HIDDEN : bot.dom.OverflowState.SCROLL
    }
  }
  return bot.dom.OverflowState.NONE
};
bot.dom.getClientRect = function(a) {
  var b = bot.dom.maybeFindImageMap_(a);
  if(b) {
    return b.rect
  }
  if(goog.isFunction(a.getBBox)) {
    try {
      var c = a.getBBox();
      return new goog.math.Rect(c.x, c.y, c.width, c.height)
    }catch(d) {
      if(goog.userAgent.GECKO && ("NS_ERROR_FAILURE" === d.name || goog.string.contains(d.message, "Component returned failure code: 0x80004005"))) {
        return new goog.math.Rect(0, 0, 0, 0)
      }
      throw d;
    }
  }else {
    if(bot.dom.isElement(a, goog.dom.TagName.HTML)) {
      return a = goog.dom.getOwnerDocument(a), a = goog.dom.getViewportSize(goog.dom.getWindow(a)), new goog.math.Rect(0, 0, a.width, a.height)
    }
    var b = goog.style.getClientPosition(a), c = a.offsetWidth, e = a.offsetHeight;
    goog.userAgent.WEBKIT && (!c && !e && a.getBoundingClientRect) && (a = a.getBoundingClientRect(), c = a.right - a.left, e = a.bottom - a.top);
    return new goog.math.Rect(b.x, b.y, c, e)
  }
};
bot.dom.maybeFindImageMap_ = function(a) {
  var b = bot.dom.isElement(a, goog.dom.TagName.MAP);
  if(!b && !bot.dom.isElement(a, goog.dom.TagName.AREA)) {
    return null
  }
  var c = b ? a : bot.dom.isElement(a.parentNode, goog.dom.TagName.MAP) ? a.parentNode : null, d = null, e = null;
  if(c && c.name && (d = goog.dom.getOwnerDocument(c), d = bot.locators.xpath.single('/descendant::*[@usemap = "#' + c.name + '"]', d)) && (e = bot.dom.getClientRect(d), !b && "default" != a.shape.toLowerCase())) {
    var f = bot.dom.getAreaRelativeRect_(a);
    a = Math.min(Math.max(f.left, 0), e.width);
    b = Math.min(Math.max(f.top, 0), e.height);
    c = Math.min(f.width, e.width - a);
    f = Math.min(f.height, e.height - b);
    e = new goog.math.Rect(a + e.left, b + e.top, c, f)
  }
  return{image:d, rect:e || new goog.math.Rect(0, 0, 0, 0)}
};
bot.dom.getAreaRelativeRect_ = function(a) {
  var b = a.shape.toLowerCase();
  a = a.coords.split(",");
  if("rect" == b && 4 == a.length) {
    var b = a[0], c = a[1];
    return new goog.math.Rect(b, c, a[2] - b, a[3] - c)
  }
  if("circle" == b && 3 == a.length) {
    return b = a[2], new goog.math.Rect(a[0] - b, a[1] - b, 2 * b, 2 * b)
  }
  if("poly" == b && 2 < a.length) {
    for(var b = a[0], c = a[1], d = b, e = c, f = 2;f + 1 < a.length;f += 2) {
      b = Math.min(b, a[f]), d = Math.max(d, a[f]), c = Math.min(c, a[f + 1]), e = Math.max(e, a[f + 1])
    }
    return new goog.math.Rect(b, c, d - b, e - c)
  }
  return new goog.math.Rect(0, 0, 0, 0)
};
bot.dom.isInParentOverflow = function(a, b) {
  var c = goog.style.getOffsetParent(a), d = goog.userAgent.GECKO || goog.userAgent.IE || goog.userAgent.OPERA ? bot.dom.getParentElement(a) : c;
  (goog.userAgent.GECKO || goog.userAgent.IE || goog.userAgent.OPERA) && bot.dom.isElement(d, goog.dom.TagName.BODY) && (c = d);
  if(c && ("scroll" == bot.dom.getEffectiveStyle(c, "overflow") || "auto" == bot.dom.getEffectiveStyle(c, "overflow"))) {
    var d = bot.dom.getClientRect(c), e = bot.dom.getClientRect(a), f, g;
    b ? (f = b.x, g = b.y) : (f = e.width / 2, g = e.height / 2);
    f = e.left + f;
    e = e.top + g;
    return f >= d.left + d.width || f <= d.left || e >= d.top + d.height || e <= d.top ? !0 : bot.dom.isInParentOverflow(c)
  }
  return!1
};
bot.dom.trimExcludingNonBreakingSpaceCharacters_ = function(a) {
  return a.replace(/^[^\S\xa0]+|[^\S\xa0]+$/g, "")
};
bot.dom.getVisibleText = function(a) {
  var b = [];
  bot.dom.appendVisibleTextLinesFromElement_(a, b);
  b = goog.array.map(b, bot.dom.trimExcludingNonBreakingSpaceCharacters_);
  a = b.join("\n");
  return bot.dom.trimExcludingNonBreakingSpaceCharacters_(a).replace(/\xa0/g, " ")
};
bot.dom.appendVisibleTextLinesFromElement_ = function(a, b) {
  if(bot.dom.isElement(a, goog.dom.TagName.BR)) {
    b.push("")
  }else {
    var c = bot.dom.isElement(a, goog.dom.TagName.TD), d = bot.dom.getEffectiveStyle(a, "display"), e = !c && !goog.array.contains(bot.dom.INLINE_DISPLAY_BOXES_, d), f = goog.dom.getPreviousElementSibling(a), f = f ? bot.dom.getEffectiveStyle(f, "display") : "", g = bot.dom.getEffectiveStyle(a, "float") || bot.dom.getEffectiveStyle(a, "cssFloat") || bot.dom.getEffectiveStyle(a, "styleFloat");
    !e || ("run-in" == f && "none" == g || goog.string.isEmpty(goog.array.peek(b) || "")) || b.push("");
    var h = bot.dom.isShown(a), k = null, n = null;
    h && (k = bot.dom.getEffectiveStyle(a, "white-space"), n = bot.dom.getEffectiveStyle(a, "text-transform"));
    goog.array.forEach(a.childNodes, function(a) {
      a.nodeType == goog.dom.NodeType.TEXT && h ? bot.dom.appendVisibleTextLinesFromTextNode_(a, b, k, n) : bot.dom.isElement(a) && bot.dom.appendVisibleTextLinesFromElement_(a, b)
    });
    f = goog.array.peek(b) || "";
    !c && "table-cell" != d || (!f || goog.string.endsWith(f, " ")) || (b[b.length - 1] += " ");
    e && ("run-in" != d && !goog.string.isEmpty(f)) && b.push("")
  }
};
bot.dom.INLINE_DISPLAY_BOXES_ = "inline inline-block inline-table none table-cell table-column table-column-group".split(" ");
bot.dom.appendVisibleTextLinesFromTextNode_ = function(a, b, c, d) {
  a = a.nodeValue.replace(/\u200b/g, "");
  a = goog.string.canonicalizeNewlines(a);
  if("normal" == c || "nowrap" == c) {
    a = a.replace(/\n/g, " ")
  }
  a = "pre" == c || "pre-wrap" == c ? a.replace(/[ \f\t\v\u2028\u2029]/g, "\u00a0") : a.replace(/[\ \f\t\v\u2028\u2029]+/g, " ");
  "capitalize" == d ? a = a.replace(/(^|\s)(\S)/g, function(a, b, c) {
    return b + c.toUpperCase()
  }) : "uppercase" == d ? a = a.toUpperCase() : "lowercase" == d && (a = a.toLowerCase());
  c = b.pop() || "";
  goog.string.endsWith(c, " ") && goog.string.startsWith(a, " ") && (a = a.substr(1));
  b.push(c + a)
};
bot.dom.getOpacity = function(a) {
  if(bot.userAgent.IE_DOC_PRE10) {
    if("relative" == bot.dom.getEffectiveStyle(a, "position")) {
      return 1
    }
    a = bot.dom.getEffectiveStyle(a, "filter");
    return(a = a.match(/^alpha\(opacity=(\d*)\)/) || a.match(/^progid:DXImageTransform.Microsoft.Alpha\(Opacity=(\d*)\)/)) ? Number(a[1]) / 100 : 1
  }
  return bot.dom.getOpacityNonIE_(a)
};
bot.dom.getOpacityNonIE_ = function(a) {
  var b = 1, c = bot.dom.getEffectiveStyle(a, "opacity");
  c && (b = Number(c));
  (a = bot.dom.getParentElement(a)) && (b *= bot.dom.getOpacityNonIE_(a));
  return b
};
bot.dom.calculateViewportScrolling_ = function(a, b) {
  return a >= b ? a - (b - 1) : 0 > a ? a : 0
};
bot.dom.getInViewLocation = function(a, b) {
  var c = b || bot.getWindow(), d = goog.dom.getViewportSize(c), e = bot.dom.calculateViewportScrolling_(a.x, d.width), f = bot.dom.calculateViewportScrolling_(a.y, d.height), g = goog.dom.getDomHelper(c.document).getDocumentScroll();
  0 == e && 0 == f || c.scrollBy(e, f);
  c = goog.dom.getDomHelper(c.document).getDocumentScroll();
  if(g.x + e != c.x || g.y + f != c.y) {
    throw new bot.Error(bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "The target location (" + (a.x + g.x) + ", " + (a.y + g.y) + ") is not on the webpage.");
  }
  e = new goog.math.Coordinate(a.x - e, a.y - f);
  if(0 > e.x || e.x >= d.width) {
    throw new bot.Error(bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "The target location (" + e.x + ", " + e.y + ") should be within the viewport (" + d.width + ":" + d.height + ") after scrolling.");
  }
  if(0 > e.y || e.y >= d.height) {
    throw new bot.Error(bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "The target location (" + e.x + ", " + e.y + ") should be within the viewport (" + d.width + ":" + d.height + ") after scrolling.");
  }
  return e
};
bot.dom.scrollRegionIntoView_ = function(a, b) {
  b.scrollLeft += Math.min(a.left, Math.max(a.left - a.width, 0));
  b.scrollTop += Math.min(a.top, Math.max(a.top - a.height, 0))
};
bot.dom.scrollElementRegionIntoContainerView_ = function(a, b, c) {
  a = goog.style.getPageOffset(a);
  var d = goog.style.getPageOffset(c), e = goog.style.getBorderBox(c);
  bot.dom.scrollRegionIntoView_(new goog.math.Rect(a.x + b.left - d.x - e.left, a.y + b.top - d.y - e.top, c.clientWidth - b.width, c.clientHeight - b.height), c)
};
bot.dom.scrollElementRegionIntoClientView = function(a, b) {
  for(var c = goog.dom.getOwnerDocument(a), d = bot.dom.getParentElement(a);d && d != c.body && d != c.documentElement;d = bot.dom.getParentElement(d)) {
    bot.dom.scrollElementRegionIntoContainerView_(a, b, d)
  }
  var d = goog.style.getPageOffset(a), e = goog.dom.getDomHelper(c).getViewportSize(), d = new goog.math.Rect(d.x + b.left - (c.body ? c.body.scrollLeft : 0), d.y + b.top - (c.body ? c.body.scrollTop : 0), e.width - b.width, e.height - b.height);
  bot.dom.scrollRegionIntoView_(d, c.body || c.documentElement)
};
bot.dom.getLocationInView = function(a, b) {
  var c;
  c = b ? new goog.math.Rect(b.left, b.top, b.width, b.height) : new goog.math.Rect(0, 0, a.offsetWidth, a.offsetHeight);
  bot.dom.scrollElementRegionIntoClientView(a, c);
  var d = a.getClientRects ? a.getClientRects()[0] : null, d = d ? new goog.math.Coordinate(d.left, d.top) : bot.dom.getClientRect(a);
  return new goog.math.Coordinate(d.x + c.left, d.y + c.top)
};
bot.dom.isScrolledIntoView = function(a, b) {
  for(var c = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), d = c.top, e = goog.style.getSize(a);;c = c.parent) {
    var f = goog.dom.getDomHelper(c.document).getDocumentScroll(), g = goog.dom.getViewportSize(c), f = new goog.math.Rect(f.x, f.y, g.width, g.height), g = goog.style.getFramedPageOffset(a, c), g = new goog.math.Rect(g.x, g.y, e.width, e.height);
    if(!goog.math.Rect.intersects(f, g)) {
      return!1
    }
    if(c == d) {
      break
    }
  }
  d = goog.style.getVisibleRectForElement(a);
  if(!d) {
    return!1
  }
  if(b) {
    return e = goog.style.getPageOffset(a), e = goog.math.Coordinate.sum(e, b), d.contains(e)
  }
  e = goog.style.getBounds(a).toBox();
  return goog.math.Box.intersects(d, e)
};
fxdriver.utils = {};
fxdriver.moz.queryInterface = function(a, b) {
  return function(c) {
    if(!c) {
      return CR.NS_ERROR_NO_INTERFACE
    }
    if(c.equals(CI.nsISupports) || goog.array.reduce(b, function(a, b) {
      return b ? a || b.equals(c) : a
    }, !1)) {
      return a
    }
    throw CR.NS_ERROR_NO_INTERFACE;
  }
};
fxdriver.utils.windowMediator = function() {
  var a = CC["@mozilla.org/appshell/window-mediator;1"];
  if(!a) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_COMMAND);
  }
  return a.getService(CI.nsIWindowMediator)
};
fxdriver.utils.getChromeWindow = function(a) {
  return a.QueryInterface(CI.nsIInterfaceRequestor).getInterface(CI.nsIWebNavigation).QueryInterface(CI.nsIDocShellTreeItem).rootTreeItem.QueryInterface(CI.nsIInterfaceRequestor).getInterface(CI.nsIDOMWindow).QueryInterface(CI.nsIDOMChromeWindow)
};
fxdriver.utils.getUniqueId = function() {
  fxdriver.utils._generator || (fxdriver.utils._generator = fxdriver.moz.getService("@mozilla.org/uuid-generator;1", "nsIUUIDGenerator"));
  return fxdriver.utils._generator.generateUUID().toString()
};
fxdriver.utils.newCoordinates = function(a, b, c) {
  return{QueryInterface:function(a) {
    if(a.equals(Components.interfaces.wdICoordinate) || a.equals(Components.interfaces.nsISupports)) {
      return this
    }
    throw Components.results.NS_NOINTERFACE;
  }, auxiliary:a, x:b, y:c}
};
fxdriver.error = {};
fxdriver.error.toJSON = function(a) {
  var b = [], c = {message:a.message ? a.message : a.toString(), stackTrace:b};
  if(a.stack) {
    for(var d = a.stack.replace(/\s*$/, "").split("\n"), e = d.shift();e;e = d.shift()) {
      e = e.match(/^([a-zA-Z_$][\w./<]*)?(?:\(.*\))?@(.+)?:(\d*)$/), b.push({methodName:e[1], fileName:e[2], lineNumber:Number(e[3])})
    }
  }
  if(a.additionalFields && a.additionalFields.length) {
    for(b = 0;b < a.additionalFields.length;++b) {
      c[a.additionalFields[b]] = a[a.additionalFields[b]]
    }
  }
  return c
};
var Utils = {}, WebDriverError = function(a, b, c) {
  var d;
  b instanceof Error ? (d = b.message, b = b.stack) : (d = b.toString(), b = Error(d).stack.split("\n"), b.shift(), b = b.join("\n"));
  this.additionalFields = [];
  if(c) {
    for(var e in c) {
      this.additionalFields.push(e), this[e] = c[e]
    }
  }
  this.code = a;
  this.message = d;
  this.stack = b;
  this.isWebDriverError = !0
};
function notifyOfCloseWindow(a) {
  a = a || 0;
  if(Utils.useNativeEvents()) {
    var b = Utils.getNativeEvents();
    b && b.notifyOfCloseWindow(a)
  }
}
function notifyOfSwitchToWindow(a) {
  if(Utils.useNativeEvents()) {
    var b = Utils.getNativeEvents();
    b && b.notifyOfSwitchToWindow(a)
  }
}
Utils.newInstance = function(a, b) {
  var c = Components.classes[a];
  if(c) {
    var d = Components.interfaces[b];
    try {
      return c.createInstance(d)
    }catch(e) {
      throw fxdriver.logging.warning("Cannot create: " + a + " from " + b), fxdriver.logging.warning(e), e;
    }
  }else {
    fxdriver.logging.warning("Unable to find class: " + a)
  }
};
Utils.getServer = function() {
  return Utils.newInstance("@googlecode.com/webdriver/fxdriver;1", "nsISupports").wrappedJSObject
};
Utils.getActiveElement = function(a) {
  var b = goog.dom.getWindow(a);
  a.activeElement ? b = a.activeElement : (b = b.top.activeElement) && a != b.ownerDocument && (b = null);
  b || (b = Utils.getMainDocumentElement(a));
  return b
};
Utils.addToKnownElements = function(a) {
  var b = {};
  Components.utils["import"]("resource://fxdriver/modules/web_element_cache.js", b);
  return b.put(a)
};
Utils.getElementAt = function(a, b) {
  var c = {};
  Components.utils["import"]("resource://fxdriver/modules/web_element_cache.js", c);
  return c.get(a, b)
};
Utils.isAttachedToDom = function(a) {
  function b(a) {
    return bot.userAgent.isProductVersion(4) ? a ? new XPCNativeWrapper(a) : null : a
  }
  var c = b(a.ownerDocument.documentElement);
  for(a = b(a);a && a != c;) {
    a = b(a.parentNode)
  }
  return a == c
};
Utils.shiftCount = 0;
Utils.getNativeComponent = function(a, b) {
  try {
    return Components.classes[a].createInstance().QueryInterface(b)
  }catch(c) {
    fxdriver.logging.warning("Unable to find native component: " + a), fxdriver.logging.warning(c)
  }
};
Utils.getNativeEvents = function() {
  return Utils.getNativeComponent("@openqa.org/nativeevents;1", Components.interfaces.nsINativeEvents)
};
Utils.getNativeMouse = function() {
  return Utils.getNativeComponent("@openqa.org/nativemouse;1", Components.interfaces.nsINativeMouse)
};
Utils.getNativeKeyboard = function() {
  return Utils.getNativeComponent("@openqa.org/nativekeyboard;1", Components.interfaces.nsINativeKeyboard)
};
Utils.getNativeIME = function() {
  return Utils.getNativeComponent("@openqa.org/nativeime;1", Components.interfaces.nsINativeIME)
};
Utils.getNodeForNativeEvents = function(a) {
  try {
    return Utils.newInstance("@mozilla.org/accessibleRetrieval;1", "nsIAccessibleRetrieval").getAccessibleFor(a.ownerDocument).QueryInterface(Components.interfaces.nsIAccessibleDocument).QueryInterface(Components.interfaces.nsISupports)
  }catch(b) {
  }
};
Utils.useNativeEvents = function() {
  var a = fxdriver.moz.getService("@mozilla.org/preferences-service;1", "nsIPrefBranch");
  return!!(a.prefHasUserValue("webdriver_enable_native_events") && a.getBoolPref("webdriver_enable_native_events") && Utils.getNativeEvents())
};
Utils.type = function(a, b, c, d, e, f, g) {
  c = c.replace(/[\b]/g, "\ue003").replace(/\t/g, "\ue004").replace(/(\r\n|\n|\r)/g, "\ue006");
  var h = Utils.getNativeKeyboard(), k = Utils.getNodeForNativeEvents(b), n = Components.classes["@mozilla.org/thread-manager;1"];
  if(d && h && k && n) {
    a = Utils.getPageUnloadedIndicator(b), h.sendKeys(k, c, f), Utils.waitForNativeEventsProcessing(b, Utils.getNativeEvents(), a, e)
  }else {
    fxdriver.logging.info("Doing sendKeys in a non-native way...");
    d = k = h = e = !1;
    g && (e = g.isControlPressed(), h = g.isShiftPressed(), k = g.isAltPressed(), d = g.isMetaPressed());
    Utils.shiftCount = 0;
    for(var n = c.toUpperCase(), q = 0;q < c.length;q++) {
      var l = c.charAt(q);
      if("\ue000" == l) {
        e && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CONTROL, Utils.keyEvent(a, b, "keyup", l, 0, e = !1, h, k, d, !1)), h && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keyup", l, 0, e, h = !1, k, d, !1)), k && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ALT, Utils.keyEvent(a, b, "keyup", l, 0, e, h, k = !1, d, !1)), d && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_META, Utils.keyEvent(a, b, "keyup", l, 0, e, h, k, d = !1, !1))
      }else {
        var r = "", p = 0, m = 0;
        "\ue001" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CANCEL : "\ue002" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_HELP : "\ue003" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_SPACE : "\ue004" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_TAB : "\ue005" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CLEAR : "\ue006" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_RETURN : "\ue007" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ENTER : 
        "\ue008" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, r = (h = !h) ? "keydown" : "keyup") : "\ue009" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CONTROL, r = (e = !e) ? "keydown" : "keyup") : "\ue00a" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ALT, r = (k = !k) ? "keydown" : "keyup") : "\ue03d" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_META, r = (d = !d) ? "keydown" : "keyup") : "\ue00b" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PAUSE : 
        "\ue00c" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ESCAPE : "\ue00d" == l ? m = p = 32 : "\ue00e" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PAGE_UP : "\ue00f" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PAGE_DOWN : "\ue010" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_END : "\ue011" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_HOME : "\ue012" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_LEFT : "\ue013" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_UP : 
        "\ue014" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_RIGHT : "\ue015" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DOWN : "\ue016" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_INSERT : "\ue017" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DELETE : "\ue018" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SEMICOLON, p = 59) : "\ue019" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_EQUALS, p = 61) : "\ue01a" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD0, 
        p = 48) : "\ue01b" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD1, p = 49) : "\ue01c" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD2, p = 50) : "\ue01d" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD3, p = 51) : "\ue01e" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD4, p = 52) : "\ue01f" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD5, p = 53) : "\ue020" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD6, 
        p = 54) : "\ue021" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD7, p = 55) : "\ue022" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD8, p = 56) : "\ue023" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD9, p = 57) : "\ue024" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_MULTIPLY, p = 42) : "\ue025" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ADD, p = 43) : "\ue026" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SEPARATOR, 
        p = 44) : "\ue027" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SUBTRACT, p = 45) : "\ue028" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DECIMAL, p = 46) : "\ue029" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DIVIDE, p = 47) : "\ue031" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F1 : "\ue032" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F2 : "\ue033" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F3 : "\ue034" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F4 : 
        "\ue035" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F5 : "\ue036" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F6 : "\ue037" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F7 : "\ue038" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F8 : "\ue039" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F9 : "\ue03a" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F10 : "\ue03b" == l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F11 : "\ue03c" == 
        l ? m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F12 : "," == l || "<" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_COMMA, p = l.charCodeAt(0)) : "." == l || ">" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PERIOD, p = l.charCodeAt(0)) : "/" == l || "?" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SLASH, p = c.charCodeAt(q)) : "`" == l || "~" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_QUOTE, p = l.charCodeAt(0)) : "{" == l || "[" == l ? 
        (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_OPEN_BRACKET, p = l.charCodeAt(0)) : "\\" == l || "|" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_SLASH, p = l.charCodeAt(0)) : "}" == l || "]" == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CLOSE_BRACKET, p = l.charCodeAt(0)) : "'" == l || '"' == l ? (m = Components.interfaces.nsIDOMKeyEvent.DOM_VK_QUOTE, p = l.charCodeAt(0)) : (m = n.charCodeAt(q), p = c.charCodeAt(q));
        if(r) {
          Utils.keyEvent(a, b, r, m, 0, e, h, k, d, !1)
        }else {
          r = !1;
          p && (r = /[A-Z\!\$\^\*\(\)\+\{\}\:\?\|~@#%&_"<>]/.test(l));
          r && !h && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keydown", l, 0, e, !0, k, d, !1), Utils.shiftCount += 1);
          l = m;
          if(32 <= p && 127 > p && (l = 0, !r && h && 32 < p)) {
            if(97 <= p && 122 >= p) {
              p = p + 65 - 97
            }else {
              var s = String.fromCharCode(p).replace(/([\[\\\.])/g, "\\$1"), s = "`1234567890-=[]\\;',./".search(s);
              0 <= s && (p = '~!@#$%^&*()_+{}|:"<>?'.charCodeAt(s))
            }
          }
          s = Utils.keyEvent(a, b, "keydown", m, 0, e, r || h, k, d, !1);
          Utils.keyEvent(a, b, "keypress", l, p, e, r || h, k, d, !s);
          Utils.keyEvent(a, b, "keyup", m, 0, e, r || h, k, d, !1);
          r && !h && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keyup", l, 0, e, !1, k, d, !1))
        }
      }
    }
    e && f && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CONTROL, Utils.keyEvent(a, b, "keyup", l, 0, e = !1, h, k, d, !1));
    h && f && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keyup", l, 0, e, h = !1, k, d, !1));
    k && f && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ALT, Utils.keyEvent(a, b, "keyup", l, 0, e, h, k = !1, d, !1));
    d && f && (l = Components.interfaces.nsIDOMKeyEvent.DOM_VK_META, Utils.keyEvent(a, b, "keyup", l, 0, e, h, k, d = !1, !1));
    g && (g.setControlPressed(e), g.setShiftPressed(h), g.setAltPressed(k), g.setMetaPressed(d))
  }
};
Utils.keyEvent = function(a, b, c, d, e, f, g, h, k, n) {
  b = void 0 == n ? !1 : n;
  n = 0;
  h && (n |= 1);
  f && (n |= 2);
  g && (n |= 4);
  k && (n |= 8);
  return a.defaultView.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).sendKeyEvent(c, d, e, n, b)
};
Utils.fireHtmlEvent = function(a, b) {
  var c = a.ownerDocument.createEvent("HTMLEvents");
  c.initEvent(b, !0, !0);
  return a.dispatchEvent(c)
};
Utils.fireMouseEventOn = function(a, b, c, d) {
  Utils.triggerMouseEvent(a, b, c, d)
};
Utils.triggerMouseEvent = function(a, b, c, d) {
  var e = a.ownerDocument.createEvent("MouseEvents"), f = a.ownerDocument.defaultView;
  e.initMouseEvent(b, !0, !0, f, 1, 0, 0, c || 0, d || 0, !1, !1, !1, !1, 0, a);
  a.dispatchEvent(e)
};
Utils.getElementLocation = function(a) {
  a = a.getBoundingClientRect();
  var b = {};
  b.x = a.left;
  b.y = a.top;
  return b
};
Utils.getLocationViaAccessibilityInterface = function(a) {
  if(a = Utils.newInstance("@mozilla.org/accessibleRetrieval;1", "nsIAccessibleRetrieval").getAccessibleFor(a)) {
    var b = {}, c = {}, d = {}, e = {};
    a.getBounds(b, c, d, e);
    return{x:b.value, y:c.value, width:d.value, height:e.value}
  }
};
Utils.getLocation = function(a, b) {
  try {
    a = a.wrappedJSObject ? a.wrappedJSObject : a;
    var c = void 0;
    if(b && 1 < a.getClientRects().length) {
      for(var d = 0;d < a.getClientRects().length;d++) {
        var e = a.getClientRects()[d];
        if(0 != e.width && 0 != e.height) {
          c = e;
          break
        }
      }
      c || (c = a.getBoundingClientRect())
    }else {
      c = a.getBoundingClientRect()
    }
    if(c.width) {
      if("area" == a.tagName.toLowerCase()) {
        var f = a.coords.split(",");
        if("rect" == a.shape) {
          var g = Number(f[0]), h = Number(f[1]);
          return{x:c.left + g, y:c.top + h, width:Number(f[2]) - g, height:Number(f[3]) - h}
        }
        if("circle" == a.shape) {
          var k = Number(f[2]);
          return{x:c.left + Number(f[0]) - k, y:c.top + Number(f[1]) - k, width:2 * k, height:2 * k}
        }
        if("poly" == a.shape) {
          for(var n = Number(f[0]), q = Number(f[1]), e = n, g = q, d = 0;d < f.length / 2;d++) {
            var l = Number(f[2 * d]), r = Number(f[2 * d + 1]), n = Math.min(n, l), q = Math.min(q, r), e = Math.max(e, l), g = Math.max(g, r)
          }
          return{x:c.left + n, y:c.top + q, width:e - n, height:g - q}
        }
      }
      return{x:c.left, y:c.top, width:c.width, height:c.height}
    }
    if(void 0 !== c.top) {
      return{x:c.left, y:c.top, width:c.right - c.left, height:c.bottom - c.top}
    }
    fxdriver.logging.info("Falling back to firefox3 mechanism");
    var p = Utils.getLocationViaAccessibilityInterface(a);
    p.x = c.left;
    p.y = c.top;
    return p
  }catch(m) {
    return fxdriver.logging.warning("Falling back to using closure to find the location of the element"), fxdriver.logging.warning(m), c = goog.style.getClientPosition(a), d = goog.style.getBorderBoxSize(a), f = bot.dom.isShown(a, !0), {x:c.x, y:c.y, width:f ? d.width : 0, height:f ? d.height : 0}
  }
};
Utils.getLocationRelativeToWindowHandle = function(a, b) {
  var c = Utils.getLocation(a, b);
  if(bot.userAgent.isProductVersion(3.6)) {
    var d = a.ownerDocument.defaultView, e = d.top, f = a.ownerDocument.defaultView.mozInnerScreenY - e.mozInnerScreenY;
    c.x += d.mozInnerScreenX - e.mozInnerScreenX;
    c.y += f
  }
  return c
};
Utils.getBrowserSpecificOffset = function(a) {
  var b = 0, c = 0;
  bot.userAgent.isProductVersion(4) && (a = a.getBoundingClientRect(), c += a.top, b += a.left, fxdriver.logging.info("Browser-specific offset (X,Y): " + b + ", " + c));
  return{x:b, y:c}
};
Utils.getLocationOnceScrolledIntoView = function(a, b) {
  "function" == typeof a.scrollIntoView && a.scrollIntoView();
  return Utils.getLocationRelativeToWindowHandle(a, b)
};
Utils.unwrapParameters = function(a, b) {
  switch(typeof a) {
    case "number":
    ;
    case "string":
    ;
    case "boolean":
      return a;
    case "object":
      if(null == a) {
        return null
      }
      if("number" !== typeof a.length || a.propertyIsEnumerable("length")) {
        if("string" === typeof a.ELEMENT) {
          var c = Utils.getElementAt(a.ELEMENT, b);
          return c = c.wrappedJSObject ? c.wrappedJSObject : c
        }
        var c = {}, d;
        for(d in a) {
          c[d] = Utils.unwrapParameters(a[d], b)
        }
        return c
      }
      for(c = [];a && 0 < a.length;) {
        d = a.shift(), c.push(Utils.unwrapParameters(d, b))
      }
      return c
  }
};
Utils.wrapResult = function(a, b) {
  a = fxdriver.moz.unwrap(a);
  switch(typeof a) {
    case "string":
    ;
    case "number":
    ;
    case "boolean":
      return a;
    case "function":
      return a.toString();
    case "undefined":
      return null;
    case "object":
      if(null == a) {
        return null
      }
      if(a.tagName) {
        return{ELEMENT:Utils.addToKnownElements(a)}
      }
      if("number" === typeof a.length && !a.propertyIsEnumerable("length")) {
        for(var c = [], d = 0;d < a.length;d++) {
          c.push(Utils.wrapResult(a[d], b))
        }
        return c
      }
      try {
        for(var e = a.QueryInterface(CI.nsIDOMNodeList), c = [], d = 0;d < e.length;d++) {
          c.push(Utils.wrapResult(a.item(d), b))
        }
        return c
      }catch(f) {
        fxdriver.logging.warning(f)
      }
      try {
        if(null != Object.getPrototypeOf(a) && goog.string.endsWith(Object.getPrototypeOf(a).toString(), "Error")) {
          try {
            return fxdriver.error.toJSON(a)
          }catch(g) {
            return fxdriver.logging.info(g), a.toString()
          }
        }
      }catch(h) {
        fxdriver.logging.info(h)
      }
      var c = {}, k;
      for(k in a) {
        c[k] = Utils.wrapResult(a[k], b)
      }
      return c;
    default:
      return a
  }
};
Utils.loadUrl = function(a) {
  fxdriver.logging.info("Loading: " + a);
  var b = fxdriver.moz.getService("@mozilla.org/network/io-service;1", "nsIIOService").newChannel(a, null, null).open(), c = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
  c.init(b);
  var d = Utils.newInstance("@mozilla.org/intl/scriptableunicodeconverter", "nsIScriptableUnicodeConverter");
  d.charset = "UTF-8";
  for(var e = "", f = c.read(4096);f;f = c.read(4096)) {
    e += d.ConvertToUnicode(f)
  }
  c.close();
  b.close();
  fxdriver.logging.info("Done reading: " + a);
  return e
};
Utils.installWindowCloseListener = function(a) {
  var b = a.session.getBrowser(), c = goog.bind(a.send, a);
  a.send = function() {
    e.unregisterNotification(d);
    c()
  };
  var d = {observe:function(c, d, e) {
    "domwindowclosed" == d && b.contentWindow == c.content && (fxdriver.logging.info("Window was closed."), a.send())
  }}, e = fxdriver.moz.getService("@mozilla.org/embedcomp/window-watcher;1", "nsIWindowWatcher");
  e.registerNotification(d)
};
Utils.installClickListener = function(a, b) {
  var c = a.session.getBrowser(), d = a.session.getWindow(), e = new b(c, function(b) {
    fxdriver.logging.info("New page loading.");
    var e;
    try {
      e = d.closed
    }catch(f) {
      e = !0
    }
    e && (fxdriver.logging.info("Detected page load in top window; changing session focus from frame to new top window."), a.session.setWindow(c.contentWindow));
    b && a.sendError(new WebDriverError(bot.ErrorCode.TIMEOUT, "Timed out waiting for page load."));
    a.send()
  }, a.session.getPageLoadTimeout(), d), f = c.contentWindow, g = function() {
    c.webProgress.isLoadingDocument || (b.removeListener(c, e), fxdriver.logging.info("Not loading document anymore."), a.send())
  };
  f.closed ? (fxdriver.logging.info("Content window closed."), a.send()) : f.setTimeout(g, 50)
};
Utils.waitForNativeEventsProcessing = function(a, b, c, d) {
  var e = Components.classes["@mozilla.org/thread-manager;1"], f = Utils.getNodeForNativeEvents(a), g = {}, e = e.getService(Components.interfaces.nsIThreadManager).currentThread;
  do {
    var h = !1;
    d.setTimeout(function() {
      fxdriver.logging.info("Done native event wait.");
      h = !0
    }, 100);
    b.hasUnhandledEvents(f, g);
    fxdriver.logging.info("Pending native events: " + g.value);
    for(var k = 0;!h && g.value && !c.wasUnloaded && 350 > k;) {
      e.processNextEvent(!0), k += 1
    }
    fxdriver.logging.info("Extra events processed: " + k + " Page Unloaded: " + c.wasUnloaded)
  }while(!0 == g.value && !c.wasUnloaded);
  fxdriver.logging.info("Done main loop.");
  c.wasUnloaded ? fxdriver.logging.info("Page has been reloaded while waiting for native events to be processed. Remaining events? " + g.value) : Utils.removePageUnloadEventListener(a, c);
  a = 0;
  for(b = e.processNextEvent(!1);b && 200 > a;) {
    b = e.processNextEvent(!1), a += 1
  }
  fxdriver.logging.info("Done extra event loop, " + a)
};
Utils.getPageUnloadedIndicator = function(a) {
  var b = {wasUnloaded:!1}, c = function() {
    b.wasUnloaded = !0
  };
  b.callback = c;
  Utils.getMainDocumentElement(a.ownerDocument).addEventListener("unload", c, !1);
  a.ownerDocument.defaultView.addEventListener("pagehide", c, !1);
  return b
};
Utils.removePageUnloadEventListener = function(a, b) {
  if(b.callback && a.ownerDocument) {
    var c = Utils.getMainDocumentElement(a.ownerDocument);
    c && c.removeEventListener("unload", b.callback, !1);
    a.ownerDocument.defaultView && a.ownerDocument.defaultView.removeEventListener("pagehide", b.callback, !1)
  }
};
Utils.convertNSIArrayToNative = function(a) {
  var b = [];
  if(null == a) {
    return b
  }
  b.length = a.length;
  a = a.enumerate();
  for(var c = 0;a.hasMoreElements();) {
    var d = Components.interfaces, d = a.getNext().QueryInterface(d.nsISupportsCString);
    b[c] = d.toString();
    c += 1
  }
  return b
};
Utils.isSVG = function(a) {
  return a.documentElement && "svg" == a.documentElement.nodeName
};
Utils.getMainDocumentElement = function(a) {
  return Utils.isSVG(a) ? a.documentElement : a.body
};
bot.locators.className = {};
bot.locators.className.canUseQuerySelector_ = function(a) {
  return!(!a.querySelectorAll || !a.querySelector)
};
bot.locators.className.single = function(a, b) {
  if(!a) {
    throw Error("No class name specified");
  }
  a = goog.string.trim(a);
  if(1 < a.split(/\s+/).length) {
    throw Error("Compound class names not permitted");
  }
  if(bot.locators.className.canUseQuerySelector_(b)) {
    return b.querySelector("." + a.replace(/\./g, "\\.")) || null
  }
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", a, b);
  return c.length ? c[0] : null
};
bot.locators.className.many = function(a, b) {
  if(!a) {
    throw Error("No class name specified");
  }
  a = goog.string.trim(a);
  if(1 < a.split(/\s+/).length) {
    throw Error("Compound class names not permitted");
  }
  return bot.locators.className.canUseQuerySelector_(b) ? b.querySelectorAll("." + a.replace(/\./g, "\\.")) : goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", a, b)
};
bot.locators.css = {};
bot.locators.css.single = function(a, b) {
  if(!goog.isFunction(b.querySelector) && goog.userAgent.IE && bot.userAgent.isEngineVersion(8) && !goog.isObject(b.querySelector)) {
    throw Error("CSS selection is not supported");
  }
  if(!a) {
    throw Error("No selector specified");
  }
  a = goog.string.trim(a);
  var c = b.querySelector(a);
  return c && c.nodeType == goog.dom.NodeType.ELEMENT ? c : null
};
bot.locators.css.many = function(a, b) {
  if(!goog.isFunction(b.querySelectorAll) && goog.userAgent.IE && bot.userAgent.isEngineVersion(8) && !goog.isObject(b.querySelector)) {
    throw Error("CSS selection is not supported");
  }
  if(!a) {
    throw Error("No selector specified");
  }
  a = goog.string.trim(a);
  return b.querySelectorAll(a)
};
bot.locators.id = {};
bot.locators.id.single = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = c.getElement(a);
  if(!d) {
    return null
  }
  if(bot.dom.getAttribute(d, "id") == a && goog.dom.contains(b, d)) {
    return d
  }
  c = c.getElementsByTagNameAndClass("*");
  return goog.array.find(c, function(c) {
    return bot.dom.getAttribute(c, "id") == a && goog.dom.contains(b, c)
  })
};
bot.locators.id.many = function(a, b) {
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.filter(c, function(b) {
    return bot.dom.getAttribute(b, "id") == a
  })
};
bot.locators.linkText = {};
bot.locators.partialLinkText = {};
bot.locators.linkText.single_ = function(a, b, c) {
  var d;
  try {
    d = bot.locators.css.many("a", b)
  }catch(e) {
    d = goog.dom.getDomHelper(b).getElementsByTagNameAndClass(goog.dom.TagName.A, null, b)
  }
  return goog.array.find(d, function(b) {
    b = bot.dom.getVisibleText(b);
    return c && -1 != b.indexOf(a) || b == a
  })
};
bot.locators.linkText.many_ = function(a, b, c) {
  var d;
  try {
    d = bot.locators.css.many("a", b)
  }catch(e) {
    d = goog.dom.getDomHelper(b).getElementsByTagNameAndClass(goog.dom.TagName.A, null, b)
  }
  return goog.array.filter(d, function(b) {
    b = bot.dom.getVisibleText(b);
    return c && -1 != b.indexOf(a) || b == a
  })
};
bot.locators.linkText.single = function(a, b) {
  return bot.locators.linkText.single_(a, b, !1)
};
bot.locators.linkText.many = function(a, b) {
  return bot.locators.linkText.many_(a, b, !1)
};
bot.locators.partialLinkText.single = function(a, b) {
  return bot.locators.linkText.single_(a, b, !0)
};
bot.locators.partialLinkText.many = function(a, b) {
  return bot.locators.linkText.many_(a, b, !0)
};
bot.locators.name = {};
bot.locators.name.single = function(a, b) {
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.find(c, function(b) {
    return bot.dom.getAttribute(b, "name") == a
  })
};
bot.locators.name.many = function(a, b) {
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.filter(c, function(b) {
    return bot.dom.getAttribute(b, "name") == a
  })
};
bot.locators.tagName = {};
bot.locators.tagName.single = function(a, b) {
  return b.getElementsByTagName(a)[0] || null
};
bot.locators.tagName.many = function(a, b) {
  return b.getElementsByTagName(a)
};
bot.locators.STRATEGIES_ = {className:bot.locators.className, "class name":bot.locators.className, css:bot.locators.css, "css selector":bot.locators.css, id:bot.locators.id, linkText:bot.locators.linkText, "link text":bot.locators.linkText, name:bot.locators.name, partialLinkText:bot.locators.partialLinkText, "partial link text":bot.locators.partialLinkText, tagName:bot.locators.tagName, "tag name":bot.locators.tagName, xpath:bot.locators.xpath};
bot.locators.add = function(a, b) {
  bot.locators.STRATEGIES_[a] = b
};
bot.locators.getOnlyKey = function(a) {
  for(var b in a) {
    if(a.hasOwnProperty(b)) {
      return b
    }
  }
  return null
};
bot.locators.findElement = function(a, b) {
  var c = bot.locators.getOnlyKey(a);
  if(c) {
    var d = bot.locators.STRATEGIES_[c];
    if(d && goog.isFunction(d.single)) {
      var e = b || bot.getDocument();
      return d.single(a[c], e)
    }
  }
  throw Error("Unsupported locator strategy: " + c);
};
bot.locators.findElements = function(a, b) {
  var c = bot.locators.getOnlyKey(a);
  if(c) {
    var d = bot.locators.STRATEGIES_[c];
    if(d && goog.isFunction(d.many)) {
      var e = b || bot.getDocument();
      return d.many(a[c], e)
    }
  }
  throw Error("Unsupported locator strategy: " + c);
};
bot.Device = function(a, b) {
  this.element_ = bot.getDocument().documentElement;
  this.select_ = null;
  var c = bot.dom.getActiveElement(this.element_);
  c && this.setElement(c);
  this.modifiersState = a || new bot.Device.ModifiersState;
  this.eventEmitter = b || new bot.Device.EventEmitter
};
bot.Device.prototype.getElement = function() {
  return this.element_
};
bot.Device.prototype.setElement = function(a) {
  this.element_ = a;
  bot.dom.isElement(a, goog.dom.TagName.OPTION) ? this.select_ = goog.dom.getAncestor(a, function(a) {
    return bot.dom.isElement(a, goog.dom.TagName.SELECT)
  }) : this.select_ = null
};
bot.Device.prototype.fireHtmlEvent = function(a) {
  return this.eventEmitter.fireHtmlEvent(this.element_, a)
};
bot.Device.prototype.fireKeyboardEvent = function(a, b) {
  return this.eventEmitter.fireKeyboardEvent(this.element_, a, b)
};
bot.Device.prototype.fireMouseEvent = function(a, b, c, d, e, f, g) {
  if(!f && !bot.dom.isInteractable(this.element_)) {
    return!1
  }
  if(d && bot.events.EventType.MOUSEOVER != a && bot.events.EventType.MOUSEOUT != a) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Event type does not allow related target: " + a);
  }
  b = {clientX:b.x, clientY:b.y, button:c, altKey:this.modifiersState.isAltPressed(), ctrlKey:this.modifiersState.isControlPressed(), shiftKey:this.modifiersState.isShiftPressed(), metaKey:this.modifiersState.isMetaPressed(), wheelDelta:e || 0, relatedTarget:d || null};
  g = g || bot.Device.MOUSE_MS_POINTER_ID;
  c = this.element_;
  a != bot.events.EventType.CLICK && a != bot.events.EventType.MOUSEDOWN && g in bot.Device.pointerElementMap_ ? c = bot.Device.pointerElementMap_[g] : this.select_ && (c = this.getTargetOfOptionMouseEvent_(a));
  return c ? this.eventEmitter.fireMouseEvent(c, a, b) : !0
};
bot.Device.prototype.fireTouchEvent = function(a, b, c, d, e) {
  function f(b, c) {
    var d = {identifier:b, screenX:c.x, screenY:c.y, clientX:c.x, clientY:c.y, pageX:c.x, pageY:c.y};
    g.changedTouches.push(d);
    if(a == bot.events.EventType.TOUCHSTART || a == bot.events.EventType.TOUCHMOVE) {
      g.touches.push(d), g.targetTouches.push(d)
    }
  }
  var g = {touches:[], targetTouches:[], changedTouches:[], altKey:this.modifiersState.isAltPressed(), ctrlKey:this.modifiersState.isControlPressed(), shiftKey:this.modifiersState.isShiftPressed(), metaKey:this.modifiersState.isMetaPressed(), relatedTarget:null, scale:0, rotation:0};
  f(b, c);
  goog.isDef(d) && f(d, e);
  return this.eventEmitter.fireTouchEvent(this.element_, a, g)
};
bot.Device.prototype.fireMSPointerEvent = function(a, b, c, d, e, f, g, h) {
  if(!h && !bot.dom.isInteractable(this.element_)) {
    return!1
  }
  if(g && bot.events.EventType.MSPOINTEROVER != a && bot.events.EventType.MSPOINTEROUT != a) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Event type does not allow related target: " + a);
  }
  b = {clientX:b.x, clientY:b.y, button:c, altKey:!1, ctrlKey:!1, shiftKey:!1, metaKey:!1, relatedTarget:g || null, width:0, height:0, pressure:0, rotation:0, pointerId:d, tiltX:0, tiltY:0, pointerType:e, isPrimary:f};
  c = this.select_ ? this.getTargetOfOptionMouseEvent_(a) : this.element_;
  bot.Device.pointerElementMap_[d] && (c = bot.Device.pointerElementMap_[d]);
  d = goog.dom.getWindow(goog.dom.getOwnerDocument(this.element_));
  var k;
  d && a == bot.events.EventType.MSPOINTERDOWN && (k = d.Element.prototype.msSetPointerCapture, d.Element.prototype.msSetPointerCapture = function(a) {
    bot.Device.pointerElementMap_[a] = this
  });
  a = c ? this.eventEmitter.fireMSPointerEvent(c, a, b) : !0;
  k && (d.Element.prototype.msSetPointerCapture = k);
  return a
};
bot.Device.prototype.getTargetOfOptionMouseEvent_ = function(a) {
  if(goog.userAgent.IE) {
    switch(a) {
      case bot.events.EventType.MOUSEOVER:
      ;
      case bot.events.EventType.MSPOINTEROVER:
        return null;
      case bot.events.EventType.CONTEXTMENU:
      ;
      case bot.events.EventType.MOUSEMOVE:
      ;
      case bot.events.EventType.MSPOINTERMOVE:
        return this.select_.multiple ? this.select_ : null;
      default:
        return this.select_
    }
  }
  if(goog.userAgent.OPERA) {
    switch(a) {
      case bot.events.EventType.CONTEXTMENU:
      ;
      case bot.events.EventType.MOUSEOVER:
        return this.select_.multiple ? this.element_ : null;
      default:
        return this.element_
    }
  }
  if(goog.userAgent.WEBKIT) {
    switch(a) {
      case bot.events.EventType.CLICK:
      ;
      case bot.events.EventType.MOUSEUP:
        return this.select_.multiple ? this.element_ : this.select_;
      default:
        return this.select_.multiple ? this.element_ : null
    }
  }
  return this.element_
};
bot.Device.prototype.clickElement = function(a, b, c) {
  if(bot.dom.isInteractable(this.element_)) {
    var d = null, e = null;
    if(!bot.Device.ALWAYS_FOLLOWS_LINKS_ON_CLICK_) {
      for(var f = this.element_;f;f = f.parentNode) {
        if(bot.dom.isElement(f, goog.dom.TagName.A)) {
          d = f;
          break
        }else {
          if(bot.Device.isFormSubmitElement(f)) {
            e = f;
            break
          }
        }
      }
    }
    var g = (f = !this.select_ && bot.dom.isSelectable(this.element_)) && bot.dom.isSelected(this.element_);
    goog.userAgent.IE && e ? e.click() : this.fireMouseEvent(bot.events.EventType.CLICK, a, b, null, 0, !1, c) && (d && bot.Device.shouldFollowHref_(d) ? bot.Device.followHref_(d) : f && this.toggleRadioButtonOrCheckbox_(g))
  }
};
bot.Device.prototype.focusOnElement = function() {
  var a = this.select_ || this.element_, b = bot.dom.getActiveElement(a);
  if(a == b) {
    return!1
  }
  if(b && (goog.isFunction(b.blur) || goog.userAgent.IE && goog.isObject(b.blur))) {
    if(!bot.dom.isElement(b, goog.dom.TagName.BODY)) {
      try {
        b.blur()
      }catch(c) {
        if(!goog.userAgent.IE || "Unspecified error." != c.message) {
          throw c;
        }
      }
    }
    goog.userAgent.IE && !bot.userAgent.isEngineVersion(8) && goog.dom.getWindow(goog.dom.getOwnerDocument(a)).focus()
  }
  return goog.isFunction(a.focus) || goog.userAgent.IE && goog.isObject(a.focus) ? (goog.userAgent.OPERA && bot.userAgent.isEngineVersion(11) && !bot.dom.isShown(a) ? bot.events.fire(a, bot.events.EventType.FOCUS) : a.focus(), !0) : !1
};
bot.Device.ALWAYS_FOLLOWS_LINKS_ON_CLICK_ = goog.userAgent.WEBKIT || goog.userAgent.OPERA || bot.userAgent.FIREFOX_EXTENSION && bot.userAgent.isProductVersion(3.6);
bot.Device.isFormSubmitElement = function(a) {
  if(bot.dom.isElement(a, goog.dom.TagName.INPUT)) {
    var b = a.type.toLowerCase();
    if("submit" == b || "image" == b) {
      return!0
    }
  }
  return bot.dom.isElement(a, goog.dom.TagName.BUTTON) && (b = a.type.toLowerCase(), "submit" == b) ? !0 : !1
};
bot.Device.shouldFollowHref_ = function(a) {
  if(bot.Device.ALWAYS_FOLLOWS_LINKS_ON_CLICK_ || !a.href) {
    return!1
  }
  if(!bot.userAgent.FIREFOX_EXTENSION) {
    return!0
  }
  if(a.target || 0 == a.href.toLowerCase().indexOf("javascript")) {
    return!1
  }
  var b = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), c = b.location.href;
  a = bot.Device.resolveUrl_(b.location, a.href);
  return c.split("#")[0] !== a.split("#")[0]
};
bot.Device.followHref_ = function(a) {
  var b = a.href, c = goog.dom.getWindow(goog.dom.getOwnerDocument(a));
  goog.userAgent.IE && !bot.userAgent.isEngineVersion(8) && (b = bot.Device.resolveUrl_(c.location, b));
  a.target ? c.open(b, a.target) : c.location.href = b
};
bot.Device.prototype.maybeToggleOption = function() {
  if(this.select_ && bot.dom.isInteractable(this.element_)) {
    var a = this.select_, b = bot.dom.isSelected(this.element_);
    if(!b || a.multiple) {
      this.element_.selected = !b, (!goog.userAgent.WEBKIT || !a.multiple || goog.userAgent.product.ANDROID && bot.userAgent.isProductVersion(4)) && bot.events.fire(a, bot.events.EventType.CHANGE)
    }
  }
};
bot.Device.prototype.toggleRadioButtonOrCheckbox_ = function(a) {
  goog.userAgent.GECKO || goog.userAgent.WEBKIT || a && "radio" == this.element_.type.toLowerCase() || (this.element_.checked = !a, goog.userAgent.OPERA && !bot.userAgent.isEngineVersion(11) && bot.events.fire(this.element_, bot.events.EventType.CHANGE))
};
bot.Device.findAncestorForm = function(a) {
  return goog.dom.getAncestor(a, bot.Device.isForm_, !0)
};
bot.Device.isForm_ = function(a) {
  return bot.dom.isElement(a, goog.dom.TagName.FORM)
};
bot.Device.prototype.submitForm = function(a) {
  if(!bot.Device.isForm_(a)) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element is not a form, so could not submit.");
  }
  if(bot.events.fire(a, bot.events.EventType.SUBMIT)) {
    if(bot.dom.isElement(a.submit)) {
      if(!goog.userAgent.IE || bot.userAgent.isEngineVersion(8)) {
        a.constructor.prototype.submit.call(a)
      }else {
        var b = bot.locators.findElements({id:"submit"}, a), c = bot.locators.findElements({name:"submit"}, a);
        goog.array.forEach(b, function(a) {
          a.removeAttribute("id")
        });
        goog.array.forEach(c, function(a) {
          a.removeAttribute("name")
        });
        a = a.submit;
        goog.array.forEach(b, function(a) {
          a.setAttribute("id", "submit")
        });
        goog.array.forEach(c, function(a) {
          a.setAttribute("name", "submit")
        });
        a()
      }
    }else {
      a.submit()
    }
  }
};
bot.Device.URL_REGEXP_ = /^([^:/?#.]+:)?(?:\/\/([^/]*))?([^?#]+)?(\?[^#]*)?(#.*)?$/;
bot.Device.resolveUrl_ = function(a, b) {
  var c = b.match(bot.Device.URL_REGEXP_);
  if(!c) {
    return""
  }
  var d = c[1] || "", e = c[2] || "", f = c[3] || "", g = c[4] || "", c = c[5] || "";
  if(!d && (d = a.protocol, !e)) {
    if(e = a.host, !f) {
      f = a.pathname, g = g || a.search
    }else {
      if("/" != f.charAt(0)) {
        var h = a.pathname.lastIndexOf("/");
        -1 != h && (f = a.pathname.substr(0, h + 1) + f)
      }
    }
  }
  return d + "//" + e + f + g + c
};
bot.Device.ModifiersState = function() {
  this.pressedModifiers_ = 0
};
bot.Device.Modifier = {SHIFT:1, CONTROL:2, ALT:4, META:8};
bot.Device.ModifiersState.prototype.isPressed = function(a) {
  return 0 != (this.pressedModifiers_ & a)
};
bot.Device.ModifiersState.prototype.setPressed = function(a, b) {
  this.pressedModifiers_ = b ? this.pressedModifiers_ | a : this.pressedModifiers_ & ~a
};
bot.Device.ModifiersState.prototype.isShiftPressed = function() {
  return this.isPressed(bot.Device.Modifier.SHIFT)
};
bot.Device.ModifiersState.prototype.isControlPressed = function() {
  return this.isPressed(bot.Device.Modifier.CONTROL)
};
bot.Device.ModifiersState.prototype.isAltPressed = function() {
  return this.isPressed(bot.Device.Modifier.ALT)
};
bot.Device.ModifiersState.prototype.isMetaPressed = function() {
  return this.isPressed(bot.Device.Modifier.META)
};
bot.Device.MOUSE_MS_POINTER_ID = 1;
bot.Device.pointerElementMap_ = {};
bot.Device.getPointerElement = function(a) {
  return bot.Device.pointerElementMap_[a]
};
bot.Device.clearPointerMap = function() {
  bot.Device.pointerElementMap_ = {}
};
bot.Device.EventEmitter = function() {
};
bot.Device.EventEmitter.prototype.fireHtmlEvent = function(a, b) {
  return bot.events.fire(a, b)
};
bot.Device.EventEmitter.prototype.fireKeyboardEvent = function(a, b, c) {
  return bot.events.fire(a, b, c)
};
bot.Device.EventEmitter.prototype.fireMouseEvent = function(a, b, c) {
  return bot.events.fire(a, b, c)
};
bot.Device.EventEmitter.prototype.fireTouchEvent = function(a, b, c) {
  return bot.events.fire(a, b, c)
};
bot.Device.EventEmitter.prototype.fireMSPointerEvent = function(a, b, c) {
  return bot.events.fire(a, b, c)
};
bot.events = {};
bot.events.SUPPORTS_TOUCH_EVENTS = !(goog.userAgent.IE && !bot.userAgent.isEngineVersion(10)) && !goog.userAgent.OPERA;
bot.events.BROKEN_TOUCH_API_ = function() {
  return goog.userAgent.product.ANDROID ? !bot.userAgent.isProductVersion(4) : !bot.userAgent.IOS
}();
bot.events.SUPPORTS_MSPOINTER_EVENTS = goog.userAgent.IE && bot.getWindow().navigator.msPointerEnabled;
bot.events.EventFactory_ = function(a, b, c) {
  this.type_ = a;
  this.bubbles_ = b;
  this.cancelable_ = c
};
bot.events.EventFactory_.prototype.create = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  bot.userAgent.IE_DOC_PRE9 ? c = c.createEventObject() : (c = c.createEvent("HTMLEvents"), c.initEvent(this.type_, this.bubbles_, this.cancelable_));
  return c
};
bot.events.EventFactory_.prototype.toString = function() {
  return this.type_
};
bot.events.MouseEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c)
};
goog.inherits(bot.events.MouseEventFactory_, bot.events.EventFactory_);
bot.events.MouseEventFactory_.prototype.create = function(a, b) {
  if(!goog.userAgent.GECKO && this == bot.events.EventType.MOUSEPIXELSCROLL) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support a mouse pixel scroll event.");
  }
  var c = goog.dom.getOwnerDocument(a), d;
  if(bot.userAgent.IE_DOC_PRE9) {
    d = c.createEventObject();
    d.altKey = b.altKey;
    d.ctrlKey = b.ctrlKey;
    d.metaKey = b.metaKey;
    d.shiftKey = b.shiftKey;
    d.button = b.button;
    d.clientX = b.clientX;
    d.clientY = b.clientY;
    c = function(a, b) {
      Object.defineProperty(d, a, {get:function() {
        return b
      }})
    };
    if(this == bot.events.EventType.MOUSEOUT || this == bot.events.EventType.MOUSEOVER) {
      if(Object.defineProperty) {
        var e = this == bot.events.EventType.MOUSEOUT;
        c("fromElement", e ? a : b.relatedTarget);
        c("toElement", e ? b.relatedTarget : a)
      }else {
        d.relatedTarget = b.relatedTarget
      }
    }
    this == bot.events.EventType.MOUSEWHEEL && (Object.defineProperty ? c("wheelDelta", b.wheelDelta) : d.detail = b.wheelDelta)
  }else {
    e = goog.dom.getWindow(c);
    d = c.createEvent("MouseEvents");
    var f = 1;
    this == bot.events.EventType.MOUSEWHEEL && (goog.userAgent.GECKO || (d.wheelDelta = b.wheelDelta), goog.userAgent.GECKO || goog.userAgent.OPERA) && (f = b.wheelDelta / -40);
    goog.userAgent.GECKO && this == bot.events.EventType.MOUSEPIXELSCROLL && (f = b.wheelDelta);
    d.initMouseEvent(this.type_, this.bubbles_, this.cancelable_, e, f, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget);
    if(goog.userAgent.IE && 0 === d.pageX && 0 === d.pageY && Object.defineProperty) {
      var e = goog.dom.getDomHelper(a).getDocumentScrollElement(), c = goog.style.getClientViewportElement(c), g = b.clientX + e.scrollLeft - c.clientLeft, h = b.clientY + e.scrollTop - c.clientTop;
      Object.defineProperty(d, "pageX", {get:function() {
        return g
      }});
      Object.defineProperty(d, "pageY", {get:function() {
        return h
      }})
    }
  }
  return d
};
bot.events.KeyboardEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c)
};
goog.inherits(bot.events.KeyboardEventFactory_, bot.events.EventFactory_);
bot.events.KeyboardEventFactory_.prototype.create = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  if(goog.userAgent.GECKO) {
    var d = goog.dom.getWindow(c), e = b.charCode ? 0 : b.keyCode, c = c.createEvent("KeyboardEvent");
    c.initKeyEvent(this.type_, this.bubbles_, this.cancelable_, d, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, e, b.charCode);
    this.type_ == bot.events.EventType.KEYPRESS && b.preventDefault && c.preventDefault()
  }else {
    bot.userAgent.IE_DOC_PRE9 ? c = c.createEventObject() : (c = c.createEvent("Events"), c.initEvent(this.type_, this.bubbles_, this.cancelable_)), c.altKey = b.altKey, c.ctrlKey = b.ctrlKey, c.metaKey = b.metaKey, c.shiftKey = b.shiftKey, c.keyCode = b.charCode || b.keyCode, goog.userAgent.WEBKIT && (c.charCode = this == bot.events.EventType.KEYPRESS ? c.keyCode : 0)
  }
  return c
};
bot.events.TouchEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c)
};
goog.inherits(bot.events.TouchEventFactory_, bot.events.EventFactory_);
bot.events.TouchEventFactory_.prototype.create = function(a, b) {
  function c(b) {
    b = goog.array.map(b, function(b) {
      return f.createTouch(g, a, b.identifier, b.pageX, b.pageY, b.screenX, b.screenY)
    });
    return f.createTouchList.apply(f, b)
  }
  function d(b) {
    var c = goog.array.map(b, function(b) {
      return{identifier:b.identifier, screenX:b.screenX, screenY:b.screenY, clientX:b.clientX, clientY:b.clientY, pageX:b.pageX, pageY:b.pageY, target:a}
    });
    c.item = function(a) {
      return c[a]
    };
    return c
  }
  function e(a) {
    return bot.events.BROKEN_TOUCH_API_ ? d(a) : c(a)
  }
  if(!bot.events.SUPPORTS_TOUCH_EVENTS) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support firing touch events.");
  }
  var f = goog.dom.getOwnerDocument(a), g = goog.dom.getWindow(f), h = e(b.changedTouches), k = b.touches == b.changedTouches ? h : e(b.touches), n = b.targetTouches == b.changedTouches ? h : e(b.targetTouches), q;
  bot.events.BROKEN_TOUCH_API_ ? (q = f.createEvent("MouseEvents"), q.initMouseEvent(this.type_, this.bubbles_, this.cancelable_, g, 1, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, 0, b.relatedTarget), q.touches = k, q.targetTouches = n, q.changedTouches = h, q.scale = b.scale, q.rotation = b.rotation) : (q = f.createEvent("TouchEvent"), goog.userAgent.product.ANDROID ? q.initTouchEvent(k, n, h, this.type_, g, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, 
  b.metaKey) : q.initTouchEvent(this.type_, this.bubbles_, this.cancelable_, g, 1, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, k, n, h, b.scale, b.rotation), q.relatedTarget = b.relatedTarget);
  return q
};
bot.events.MSGestureEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c)
};
goog.inherits(bot.events.MSGestureEventFactory_, bot.events.EventFactory_);
bot.events.MSGestureEventFactory_.prototype.create = function(a, b) {
  if(!bot.events.SUPPORTS_MSPOINTER_EVENTS) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support MSGesture events.");
  }
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getWindow(c), c = c.createEvent("MSGestureEvent"), e = (new Date).getTime();
  c.initGestureEvent(this.type_, this.bubbles_, this.cancelable_, d, 1, 0, 0, b.clientX, b.clientY, 0, 0, b.translationX, b.translationY, b.scale, b.expansion, b.rotation, b.velocityX, b.velocityY, b.velocityExpansion, b.velocityAngular, e, b.relatedTarget);
  return c
};
bot.events.MSPointerEventFactory_ = function(a, b, c) {
  bot.events.EventFactory_.call(this, a, b, c)
};
goog.inherits(bot.events.MSPointerEventFactory_, bot.events.EventFactory_);
bot.events.MSPointerEventFactory_.prototype.create = function(a, b) {
  if(!bot.events.SUPPORTS_MSPOINTER_EVENTS) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Browser does not support MSPointer events.");
  }
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getWindow(c), c = c.createEvent("MSPointerEvent");
  c.initPointerEvent(this.type_, this.bubbles_, this.cancelable_, d, 0, 0, 0, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget, 0, 0, b.width, b.height, b.pressure, b.rotation, b.tiltX, b.tiltY, b.pointerId, b.pointerType, 0, b.isPrimary);
  return c
};
bot.events.EventType = {BLUR:new bot.events.EventFactory_("blur", !1, !1), CHANGE:new bot.events.EventFactory_("change", !0, !1), FOCUS:new bot.events.EventFactory_("focus", !1, !1), FOCUSIN:new bot.events.EventFactory_("focusin", !0, !1), FOCUSOUT:new bot.events.EventFactory_("focusout", !0, !1), INPUT:new bot.events.EventFactory_("input", !0, !1), ORIENTATIONCHANGE:new bot.events.EventFactory_("orientationchange", !1, !1), PROPERTYCHANGE:new bot.events.EventFactory_("propertychange", !1, !1), SELECT:new bot.events.EventFactory_("select", 
!0, !1), SUBMIT:new bot.events.EventFactory_("submit", !0, !0), TEXTINPUT:new bot.events.EventFactory_("textInput", !0, !0), CLICK:new bot.events.MouseEventFactory_("click", !0, !0), CONTEXTMENU:new bot.events.MouseEventFactory_("contextmenu", !0, !0), DBLCLICK:new bot.events.MouseEventFactory_("dblclick", !0, !0), MOUSEDOWN:new bot.events.MouseEventFactory_("mousedown", !0, !0), MOUSEMOVE:new bot.events.MouseEventFactory_("mousemove", !0, !1), MOUSEOUT:new bot.events.MouseEventFactory_("mouseout", 
!0, !0), MOUSEOVER:new bot.events.MouseEventFactory_("mouseover", !0, !0), MOUSEUP:new bot.events.MouseEventFactory_("mouseup", !0, !0), MOUSEWHEEL:new bot.events.MouseEventFactory_(goog.userAgent.GECKO ? "DOMMouseScroll" : "mousewheel", !0, !0), MOUSEPIXELSCROLL:new bot.events.MouseEventFactory_("MozMousePixelScroll", !0, !0), KEYDOWN:new bot.events.KeyboardEventFactory_("keydown", !0, !0), KEYPRESS:new bot.events.KeyboardEventFactory_("keypress", !0, !0), KEYUP:new bot.events.KeyboardEventFactory_("keyup", 
!0, !0), TOUCHEND:new bot.events.TouchEventFactory_("touchend", !0, !0), TOUCHMOVE:new bot.events.TouchEventFactory_("touchmove", !0, !0), TOUCHSTART:new bot.events.TouchEventFactory_("touchstart", !0, !0), MSGESTURECHANGE:new bot.events.MSGestureEventFactory_("MSGestureChange", !0, !0), MSGESTUREEND:new bot.events.MSGestureEventFactory_("MSGestureEnd", !0, !0), MSGESTUREHOLD:new bot.events.MSGestureEventFactory_("MSGestureHold", !0, !0), MSGESTURESTART:new bot.events.MSGestureEventFactory_("MSGestureStart", 
!0, !0), MSGESTURETAP:new bot.events.MSGestureEventFactory_("MSGestureTap", !0, !0), MSINERTIASTART:new bot.events.MSGestureEventFactory_("MSInertiaStart", !0, !0), MSGOTPOINTERCAPTURE:new bot.events.MSPointerEventFactory_("MSGotPointerCapture", !0, !1), MSLOSTPOINTERCAPTURE:new bot.events.MSPointerEventFactory_("MSLostPointerCapture", !0, !1), MSPOINTERCANCEL:new bot.events.MSPointerEventFactory_("MSPointerCancel", !0, !0), MSPOINTERDOWN:new bot.events.MSPointerEventFactory_("MSPointerDown", !0, 
!0), MSPOINTERMOVE:new bot.events.MSPointerEventFactory_("MSPointerMove", !0, !0), MSPOINTEROVER:new bot.events.MSPointerEventFactory_("MSPointerOver", !0, !0), MSPOINTEROUT:new bot.events.MSPointerEventFactory_("MSPointerOut", !0, !0), MSPOINTERUP:new bot.events.MSPointerEventFactory_("MSPointerUp", !0, !0)};
bot.events.fire = function(a, b, c) {
  c = b.create(a, c);
  "isTrusted" in c || (c.isTrusted = !1);
  return bot.userAgent.IE_DOC_PRE9 ? a.fireEvent("on" + b.type_, c) : a.dispatchEvent(c)
};
bot.events.isSynthetic = function(a) {
  a = a.getBrowserEvent ? a.getBrowserEvent() : a;
  return"isTrusted" in a ? !a.isTrusted : !1
};
bot.Mouse = function(a, b, c) {
  bot.Device.call(this, b, c);
  this.elementPressed_ = this.buttonPressed_ = null;
  this.clientXY_ = new goog.math.Coordinate(0, 0);
  this.hasEverInteracted_ = this.nextClickIsDoubleClick_ = !1;
  if(a) {
    this.buttonPressed_ = a.buttonPressed;
    try {
      bot.dom.isElement(a.elementPressed) && (this.elementPressed_ = a.elementPressed)
    }catch(d) {
      this.buttonPressed_ = null
    }
    this.clientXY_ = a.clientXY;
    this.nextClickIsDoubleClick_ = a.nextClickIsDoubleClick;
    this.hasEverInteracted_ = a.hasEverInteracted;
    try {
      bot.dom.isElement(a.element) && this.setElement(a.element)
    }catch(e) {
      this.buttonPressed_ = null
    }
  }
};
goog.inherits(bot.Mouse, bot.Device);
bot.Mouse.Button = {LEFT:0, MIDDLE:1, RIGHT:2};
bot.Mouse.NO_BUTTON_VALUE_INDEX_ = 3;
bot.Mouse.MOUSE_BUTTON_VALUE_MAP_ = function() {
  var a = {};
  bot.userAgent.IE_DOC_PRE9 ? (a[bot.events.EventType.CLICK] = [0, 0, 0, null], a[bot.events.EventType.CONTEXTMENU] = [null, null, 0, null], a[bot.events.EventType.MOUSEUP] = [1, 4, 2, null], a[bot.events.EventType.MOUSEOUT] = [0, 0, 0, 0], a[bot.events.EventType.MOUSEMOVE] = [1, 4, 2, 0]) : goog.userAgent.WEBKIT || bot.userAgent.IE_DOC_9 ? (a[bot.events.EventType.CLICK] = [0, 1, 2, null], a[bot.events.EventType.CONTEXTMENU] = [null, null, 2, null], a[bot.events.EventType.MOUSEUP] = [0, 1, 2, null], 
  a[bot.events.EventType.MOUSEOUT] = [0, 1, 2, 0], a[bot.events.EventType.MOUSEMOVE] = [0, 1, 2, 0]) : (a[bot.events.EventType.CLICK] = [0, 1, 2, null], a[bot.events.EventType.CONTEXTMENU] = [null, null, 2, null], a[bot.events.EventType.MOUSEUP] = [0, 1, 2, null], a[bot.events.EventType.MOUSEOUT] = [0, 0, 0, 0], a[bot.events.EventType.MOUSEMOVE] = [0, 0, 0, 0]);
  bot.userAgent.IE_DOC_10 && (a[bot.events.EventType.MSPOINTERDOWN] = a[bot.events.EventType.MOUSEUP], a[bot.events.EventType.MSPOINTERUP] = a[bot.events.EventType.MOUSEUP], a[bot.events.EventType.MSPOINTERMOVE] = [-1, -1, -1, -1], a[bot.events.EventType.MSPOINTEROUT] = a[bot.events.EventType.MSPOINTERMOVE], a[bot.events.EventType.MSPOINTEROVER] = a[bot.events.EventType.MSPOINTERMOVE]);
  a[bot.events.EventType.DBLCLICK] = a[bot.events.EventType.CLICK];
  a[bot.events.EventType.MOUSEDOWN] = a[bot.events.EventType.MOUSEUP];
  a[bot.events.EventType.MOUSEOVER] = a[bot.events.EventType.MOUSEOUT];
  return a
}();
bot.Mouse.MOUSE_EVENT_MAP_ = function() {
  var a = {};
  a[bot.events.EventType.MOUSEDOWN] = bot.events.EventType.MSPOINTERDOWN;
  a[bot.events.EventType.MOUSEMOVE] = bot.events.EventType.MSPOINTERMOVE;
  a[bot.events.EventType.MOUSEOUT] = bot.events.EventType.MSPOINTEROUT;
  a[bot.events.EventType.MOUSEOVER] = bot.events.EventType.MSPOINTEROVER;
  a[bot.events.EventType.MOUSEUP] = bot.events.EventType.MSPOINTERUP;
  return a
}();
bot.Mouse.prototype.fireMousedown_ = function() {
  var a = goog.userAgent.GECKO && !bot.userAgent.isProductVersion(4);
  if((goog.userAgent.WEBKIT || a) && (bot.dom.isElement(this.getElement(), goog.dom.TagName.OPTION) || bot.dom.isElement(this.getElement(), goog.dom.TagName.SELECT))) {
    return!0
  }
  var b;
  (a = goog.userAgent.GECKO || goog.userAgent.IE) && (b = bot.dom.getActiveElement(this.getElement()));
  var c = this.fireMouseEvent_(bot.events.EventType.MOUSEDOWN);
  return c && a && b != bot.dom.getActiveElement(this.getElement()) ? !1 : c
};
bot.Mouse.prototype.pressButton = function(a) {
  if(!goog.isNull(this.buttonPressed_)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot press more then one button or an already pressed button.");
  }
  this.buttonPressed_ = a;
  this.elementPressed_ = this.getElement();
  this.fireMousedown_() && (bot.userAgent.IE_DOC_10 && (this.buttonPressed_ == bot.Mouse.Button.LEFT && bot.dom.isElement(this.elementPressed_, goog.dom.TagName.OPTION)) && this.fireMSPointerEvent(bot.events.EventType.MSGOTPOINTERCAPTURE, this.clientXY_, 0, bot.Device.MOUSE_MS_POINTER_ID, MSPointerEvent.MSPOINTER_TYPE_MOUSE, !0), this.focusOnElement())
};
bot.Mouse.prototype.releaseButton = function() {
  if(goog.isNull(this.buttonPressed_)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot release a button when no button is pressed.");
  }
  this.maybeToggleOption();
  this.fireMouseEvent_(bot.events.EventType.MOUSEUP);
  this.buttonPressed_ == bot.Mouse.Button.LEFT && this.getElement() == this.elementPressed_ ? (this.clickElement(this.clientXY_, this.getButtonValue_(bot.events.EventType.CLICK)), this.maybeDoubleClickElement_(), bot.userAgent.IE_DOC_10 && (this.buttonPressed_ == bot.Mouse.Button.LEFT && bot.dom.isElement(this.elementPressed_, goog.dom.TagName.OPTION)) && this.fireMSPointerEvent(bot.events.EventType.MSLOSTPOINTERCAPTURE, new goog.math.Coordinate(0, 0), 0, bot.Device.MOUSE_MS_POINTER_ID, MSPointerEvent.MSPOINTER_TYPE_MOUSE, 
  !1)) : this.buttonPressed_ == bot.Mouse.Button.RIGHT && this.fireMouseEvent_(bot.events.EventType.CONTEXTMENU);
  bot.Device.clearPointerMap();
  this.elementPressed_ = this.buttonPressed_ = null
};
bot.Mouse.prototype.maybeDoubleClickElement_ = function() {
  this.nextClickIsDoubleClick_ && this.fireMouseEvent_(bot.events.EventType.DBLCLICK);
  this.nextClickIsDoubleClick_ = !this.nextClickIsDoubleClick_
};
bot.Mouse.prototype.move = function(a, b) {
  var c = bot.dom.isInteractable(a), d = bot.dom.getClientRect(a);
  this.clientXY_.x = b.x + d.left;
  this.clientXY_.y = b.y + d.top;
  d = this.getElement();
  if(a != d) {
    try {
      goog.dom.getWindow(goog.dom.getOwnerDocument(d)).closed && (d = null)
    }catch(e) {
      d = null
    }
    if(d) {
      var f = d === bot.getDocument().documentElement || d === bot.getDocument().body, d = !this.hasEverInteracted_ && f ? null : d;
      this.fireMouseEvent_(bot.events.EventType.MOUSEOUT, a)
    }
    this.setElement(a);
    goog.userAgent.IE || this.fireMouseEvent_(bot.events.EventType.MOUSEOVER, d, null, c)
  }
  this.fireMouseEvent_(bot.events.EventType.MOUSEMOVE, null, null, c);
  goog.userAgent.IE && a != d && this.fireMouseEvent_(bot.events.EventType.MOUSEOVER, d, null, c);
  this.nextClickIsDoubleClick_ = !1
};
bot.Mouse.prototype.scroll = function(a) {
  if(0 == a) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Must scroll a non-zero number of ticks.");
  }
  for(var b = 0 < a ? -120 : 120, c = 0 < a ? 57 : -57, d = 0;d < Math.abs(a);d++) {
    this.fireMouseEvent_(bot.events.EventType.MOUSEWHEEL, null, b), goog.userAgent.GECKO && this.fireMouseEvent_(bot.events.EventType.MOUSEPIXELSCROLL, null, c)
  }
};
bot.Mouse.prototype.fireMouseEvent_ = function(a, b, c, d) {
  this.hasEverInteracted_ = !0;
  if(bot.userAgent.IE_DOC_10) {
    var e = bot.Mouse.MOUSE_EVENT_MAP_[a];
    if(e && !this.fireMSPointerEvent(e, this.clientXY_, this.getButtonValue_(e), bot.Device.MOUSE_MS_POINTER_ID, MSPointerEvent.MSPOINTER_TYPE_MOUSE, !0, b, d)) {
      return!1
    }
  }
  return this.fireMouseEvent(a, this.clientXY_, this.getButtonValue_(a), b, c, d)
};
bot.Mouse.prototype.getButtonValue_ = function(a) {
  if(!(a in bot.Mouse.MOUSE_BUTTON_VALUE_MAP_)) {
    return 0
  }
  var b = goog.isNull(this.buttonPressed_) ? bot.Mouse.NO_BUTTON_VALUE_INDEX_ : this.buttonPressed_;
  a = bot.Mouse.MOUSE_BUTTON_VALUE_MAP_[a][b];
  if(goog.isNull(a)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Event does not permit the specified mouse button.");
  }
  return a
};
bot.Mouse.prototype.getState = function() {
  var a = {};
  a.buttonPressed = this.buttonPressed_;
  a.elementPressed = this.elementPressed_;
  a.clientXY = this.clientXY_;
  a.nextClickIsDoubleClick = this.nextClickIsDoubleClick_;
  a.hasEverInteracted = this.hasEverInteracted_;
  a.element = this.getElement();
  return a
};
goog.dom.selection = {};
goog.dom.selection.setStart = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionStart = b
  }else {
    if(goog.userAgent.IE) {
      var c = goog.dom.selection.getRangeIe_(a), d = c[0];
      d.inRange(c[1]) && (b = goog.dom.selection.canonicalizePositionIe_(a, b), d.collapse(!0), d.move("character", b), d.select())
    }
  }
};
goog.dom.selection.getStart = function(a) {
  return goog.dom.selection.getEndPoints_(a, !0)[0]
};
goog.dom.selection.getEndPointsTextareaIe_ = function(a, b, c) {
  b = b.duplicate();
  for(var d = a.text, e = d, f = b.text, g = f, h = !1;!h;) {
    0 == a.compareEndPoints("StartToEnd", a) ? h = !0 : (a.moveEnd("character", -1), a.text == d ? e += "\r\n" : h = !0)
  }
  if(c) {
    return[e.length, -1]
  }
  for(a = !1;!a;) {
    0 == b.compareEndPoints("StartToEnd", b) ? a = !0 : (b.moveEnd("character", -1), b.text == f ? g += "\r\n" : a = !0)
  }
  return[e.length, e.length + g.length]
};
goog.dom.selection.getEndPoints = function(a) {
  return goog.dom.selection.getEndPoints_(a, !1)
};
goog.dom.selection.getEndPoints_ = function(a, b) {
  var c = 0, d = 0;
  if(goog.dom.selection.useSelectionProperties_(a)) {
    c = a.selectionStart, d = b ? -1 : a.selectionEnd
  }else {
    if(goog.userAgent.IE) {
      var e = goog.dom.selection.getRangeIe_(a), f = e[0], e = e[1];
      if(f.inRange(e)) {
        f.setEndPoint("EndToStart", e);
        if("textarea" == a.type) {
          return goog.dom.selection.getEndPointsTextareaIe_(f, e, b)
        }
        c = f.text.length;
        d = b ? -1 : f.text.length + e.text.length
      }
    }
  }
  return[c, d]
};
goog.dom.selection.setEnd = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionEnd = b
  }else {
    if(goog.userAgent.IE) {
      var c = goog.dom.selection.getRangeIe_(a), d = c[1];
      c[0].inRange(d) && (b = goog.dom.selection.canonicalizePositionIe_(a, b), c = goog.dom.selection.canonicalizePositionIe_(a, goog.dom.selection.getStart(a)), d.collapse(!0), d.moveEnd("character", b - c), d.select())
    }
  }
};
goog.dom.selection.getEnd = function(a) {
  return goog.dom.selection.getEndPoints_(a, !1)[1]
};
goog.dom.selection.setCursorPosition = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionStart = b, a.selectionEnd = b
  }else {
    if(goog.userAgent.IE) {
      b = goog.dom.selection.canonicalizePositionIe_(a, b);
      var c = a.createTextRange();
      c.collapse(!0);
      c.move("character", b);
      c.select()
    }
  }
};
goog.dom.selection.setText = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    var c = a.value, d = a.selectionStart, e = c.substr(0, d), c = c.substr(a.selectionEnd);
    a.value = e + b + c;
    a.selectionStart = d;
    a.selectionEnd = d + b.length
  }else {
    if(goog.userAgent.IE) {
      e = goog.dom.selection.getRangeIe_(a), d = e[1], e[0].inRange(d) && (e = d.duplicate(), d.text = b, d.setEndPoint("StartToStart", e), d.select())
    }else {
      throw Error("Cannot set the selection end");
    }
  }
};
goog.dom.selection.getText = function(a) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    return a.value.substring(a.selectionStart, a.selectionEnd)
  }
  if(goog.userAgent.IE) {
    var b = goog.dom.selection.getRangeIe_(a), c = b[1];
    return b[0].inRange(c) ? "textarea" == a.type ? goog.dom.selection.getSelectionRangeText_(c) : c.text : ""
  }
  throw Error("Cannot get the selection text");
};
goog.dom.selection.getSelectionRangeText_ = function(a) {
  a = a.duplicate();
  for(var b = a.text, c = b, d = !1;!d;) {
    0 == a.compareEndPoints("StartToEnd", a) ? d = !0 : (a.moveEnd("character", -1), a.text == b ? c += "\r\n" : d = !0)
  }
  return c
};
goog.dom.selection.getRangeIe_ = function(a) {
  var b = a.ownerDocument || a.document, c = b.selection.createRange();
  "textarea" == a.type ? (b = b.body.createTextRange(), b.moveToElementText(a)) : b = a.createTextRange();
  return[b, c]
};
goog.dom.selection.canonicalizePositionIe_ = function(a, b) {
  if("textarea" == a.type) {
    var c = a.value.substring(0, b);
    b = goog.string.canonicalizeNewlines(c).length
  }
  return b
};
goog.dom.selection.useSelectionProperties_ = function(a) {
  try {
    return"number" == typeof a.selectionStart
  }catch(b) {
    return!1
  }
};
bot.Keyboard = function(a) {
  bot.Device.call(this);
  this.editable_ = bot.dom.isEditable(this.getElement());
  this.currentPos_ = 0;
  this.pressed_ = new goog.structs.Set;
  a && (goog.array.forEach(a.pressed, function(a) {
    this.setKeyPressed_(a, !0)
  }, this), this.currentPos_ = a.currentPos)
};
goog.inherits(bot.Keyboard, bot.Device);
bot.Keyboard.CHAR_TO_KEY_ = {};
bot.Keyboard.newKey_ = function(a, b, c) {
  goog.isObject(a) && (a = goog.userAgent.GECKO ? a.gecko : goog.userAgent.OPERA ? a.opera : a.ieWebkit);
  a = new bot.Keyboard.Key(a, b, c);
  !b || b in bot.Keyboard.CHAR_TO_KEY_ && !c || (bot.Keyboard.CHAR_TO_KEY_[b] = {key:a, shift:!1}, c && (bot.Keyboard.CHAR_TO_KEY_[c] = {key:a, shift:!0}));
  return a
};
bot.Keyboard.Key = function(a, b, c) {
  this.code = a;
  this.character = b || null;
  this.shiftChar = c || this.character
};
bot.Keyboard.Keys = {BACKSPACE:bot.Keyboard.newKey_(8), TAB:bot.Keyboard.newKey_(9), ENTER:bot.Keyboard.newKey_(13), SHIFT:bot.Keyboard.newKey_(16), CONTROL:bot.Keyboard.newKey_(17), ALT:bot.Keyboard.newKey_(18), PAUSE:bot.Keyboard.newKey_(19), CAPS_LOCK:bot.Keyboard.newKey_(20), ESC:bot.Keyboard.newKey_(27), SPACE:bot.Keyboard.newKey_(32, " "), PAGE_UP:bot.Keyboard.newKey_(33), PAGE_DOWN:bot.Keyboard.newKey_(34), END:bot.Keyboard.newKey_(35), HOME:bot.Keyboard.newKey_(36), LEFT:bot.Keyboard.newKey_(37), 
UP:bot.Keyboard.newKey_(38), RIGHT:bot.Keyboard.newKey_(39), DOWN:bot.Keyboard.newKey_(40), PRINT_SCREEN:bot.Keyboard.newKey_(44), INSERT:bot.Keyboard.newKey_(45), DELETE:bot.Keyboard.newKey_(46), ZERO:bot.Keyboard.newKey_(48, "0", ")"), ONE:bot.Keyboard.newKey_(49, "1", "!"), TWO:bot.Keyboard.newKey_(50, "2", "@"), THREE:bot.Keyboard.newKey_(51, "3", "#"), FOUR:bot.Keyboard.newKey_(52, "4", "$"), FIVE:bot.Keyboard.newKey_(53, "5", "%"), SIX:bot.Keyboard.newKey_(54, "6", "^"), SEVEN:bot.Keyboard.newKey_(55, 
"7", "&"), EIGHT:bot.Keyboard.newKey_(56, "8", "*"), NINE:bot.Keyboard.newKey_(57, "9", "("), A:bot.Keyboard.newKey_(65, "a", "A"), B:bot.Keyboard.newKey_(66, "b", "B"), C:bot.Keyboard.newKey_(67, "c", "C"), D:bot.Keyboard.newKey_(68, "d", "D"), E:bot.Keyboard.newKey_(69, "e", "E"), F:bot.Keyboard.newKey_(70, "f", "F"), G:bot.Keyboard.newKey_(71, "g", "G"), H:bot.Keyboard.newKey_(72, "h", "H"), I:bot.Keyboard.newKey_(73, "i", "I"), J:bot.Keyboard.newKey_(74, "j", "J"), K:bot.Keyboard.newKey_(75, 
"k", "K"), L:bot.Keyboard.newKey_(76, "l", "L"), M:bot.Keyboard.newKey_(77, "m", "M"), N:bot.Keyboard.newKey_(78, "n", "N"), O:bot.Keyboard.newKey_(79, "o", "O"), P:bot.Keyboard.newKey_(80, "p", "P"), Q:bot.Keyboard.newKey_(81, "q", "Q"), R:bot.Keyboard.newKey_(82, "r", "R"), S:bot.Keyboard.newKey_(83, "s", "S"), T:bot.Keyboard.newKey_(84, "t", "T"), U:bot.Keyboard.newKey_(85, "u", "U"), V:bot.Keyboard.newKey_(86, "v", "V"), W:bot.Keyboard.newKey_(87, "w", "W"), X:bot.Keyboard.newKey_(88, "x", "X"), 
Y:bot.Keyboard.newKey_(89, "y", "Y"), Z:bot.Keyboard.newKey_(90, "z", "Z"), META:bot.Keyboard.newKey_(goog.userAgent.WINDOWS ? {gecko:91, ieWebkit:91, opera:219} : goog.userAgent.MAC ? {gecko:224, ieWebkit:91, opera:17} : {gecko:0, ieWebkit:91, opera:null}), META_RIGHT:bot.Keyboard.newKey_(goog.userAgent.WINDOWS ? {gecko:92, ieWebkit:92, opera:220} : goog.userAgent.MAC ? {gecko:224, ieWebkit:93, opera:17} : {gecko:0, ieWebkit:92, opera:null}), CONTEXT_MENU:bot.Keyboard.newKey_(goog.userAgent.WINDOWS ? 
{gecko:93, ieWebkit:93, opera:0} : goog.userAgent.MAC ? {gecko:0, ieWebkit:0, opera:16} : {gecko:93, ieWebkit:null, opera:0}), NUM_ZERO:bot.Keyboard.newKey_({gecko:96, ieWebkit:96, opera:48}, "0"), NUM_ONE:bot.Keyboard.newKey_({gecko:97, ieWebkit:97, opera:49}, "1"), NUM_TWO:bot.Keyboard.newKey_({gecko:98, ieWebkit:98, opera:50}, "2"), NUM_THREE:bot.Keyboard.newKey_({gecko:99, ieWebkit:99, opera:51}, "3"), NUM_FOUR:bot.Keyboard.newKey_({gecko:100, ieWebkit:100, opera:52}, "4"), NUM_FIVE:bot.Keyboard.newKey_({gecko:101, 
ieWebkit:101, opera:53}, "5"), NUM_SIX:bot.Keyboard.newKey_({gecko:102, ieWebkit:102, opera:54}, "6"), NUM_SEVEN:bot.Keyboard.newKey_({gecko:103, ieWebkit:103, opera:55}, "7"), NUM_EIGHT:bot.Keyboard.newKey_({gecko:104, ieWebkit:104, opera:56}, "8"), NUM_NINE:bot.Keyboard.newKey_({gecko:105, ieWebkit:105, opera:57}, "9"), NUM_MULTIPLY:bot.Keyboard.newKey_({gecko:106, ieWebkit:106, opera:goog.userAgent.LINUX ? 56 : 42}, "*"), NUM_PLUS:bot.Keyboard.newKey_({gecko:107, ieWebkit:107, opera:goog.userAgent.LINUX ? 
61 : 43}, "+"), NUM_MINUS:bot.Keyboard.newKey_({gecko:109, ieWebkit:109, opera:goog.userAgent.LINUX ? 109 : 45}, "-"), NUM_PERIOD:bot.Keyboard.newKey_({gecko:110, ieWebkit:110, opera:goog.userAgent.LINUX ? 190 : 78}, "."), NUM_DIVISION:bot.Keyboard.newKey_({gecko:111, ieWebkit:111, opera:goog.userAgent.LINUX ? 191 : 47}, "/"), NUM_LOCK:bot.Keyboard.newKey_(goog.userAgent.LINUX && goog.userAgent.OPERA ? null : 144), F1:bot.Keyboard.newKey_(112), F2:bot.Keyboard.newKey_(113), F3:bot.Keyboard.newKey_(114), 
F4:bot.Keyboard.newKey_(115), F5:bot.Keyboard.newKey_(116), F6:bot.Keyboard.newKey_(117), F7:bot.Keyboard.newKey_(118), F8:bot.Keyboard.newKey_(119), F9:bot.Keyboard.newKey_(120), F10:bot.Keyboard.newKey_(121), F11:bot.Keyboard.newKey_(122), F12:bot.Keyboard.newKey_(123), EQUALS:bot.Keyboard.newKey_({gecko:107, ieWebkit:187, opera:61}, "=", "+"), SEPARATOR:bot.Keyboard.newKey_(108, ","), HYPHEN:bot.Keyboard.newKey_({gecko:109, ieWebkit:189, opera:109}, "-", "_"), COMMA:bot.Keyboard.newKey_(188, ",", 
"<"), PERIOD:bot.Keyboard.newKey_(190, ".", ">"), SLASH:bot.Keyboard.newKey_(191, "/", "?"), BACKTICK:bot.Keyboard.newKey_(192, "`", "~"), OPEN_BRACKET:bot.Keyboard.newKey_(219, "[", "{"), BACKSLASH:bot.Keyboard.newKey_(220, "\\", "|"), CLOSE_BRACKET:bot.Keyboard.newKey_(221, "]", "}"), SEMICOLON:bot.Keyboard.newKey_({gecko:59, ieWebkit:186, opera:59}, ";", ":"), APOSTROPHE:bot.Keyboard.newKey_(222, "'", '"')};
bot.Keyboard.Key.fromChar = function(a) {
  if(1 != a.length) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Argument not a single character: " + a);
  }
  var b = bot.Keyboard.CHAR_TO_KEY_[a];
  if(!b) {
    var b = a.toUpperCase(), c = b.charCodeAt(0), b = bot.Keyboard.newKey_(c, a.toLowerCase(), b), b = {key:b, shift:a != b.character}
  }
  return b
};
bot.Keyboard.MODIFIERS = [bot.Keyboard.Keys.ALT, bot.Keyboard.Keys.CONTROL, bot.Keyboard.Keys.META, bot.Keyboard.Keys.SHIFT];
bot.Keyboard.MODIFIER_TO_KEY_MAP_ = function() {
  var a = new goog.structs.Map;
  a.set(bot.Device.Modifier.SHIFT, bot.Keyboard.Keys.SHIFT);
  a.set(bot.Device.Modifier.CONTROL, bot.Keyboard.Keys.CONTROL);
  a.set(bot.Device.Modifier.ALT, bot.Keyboard.Keys.ALT);
  a.set(bot.Device.Modifier.META, bot.Keyboard.Keys.META);
  return a
}();
bot.Keyboard.KEY_TO_MODIFIER_ = function(a) {
  var b = new goog.structs.Map;
  goog.array.forEach(a.getKeys(), function(c) {
    b.set(a.get(c).code, c)
  });
  return b
}(bot.Keyboard.MODIFIER_TO_KEY_MAP_);
bot.Keyboard.prototype.setKeyPressed_ = function(a, b) {
  if(goog.array.contains(bot.Keyboard.MODIFIERS, a)) {
    var c = bot.Keyboard.KEY_TO_MODIFIER_.get(a.code);
    this.modifiersState.setPressed(c, b)
  }
  b ? this.pressed_.add(a) : this.pressed_.remove(a)
};
bot.Keyboard.NEW_LINE_ = goog.userAgent.IE || goog.userAgent.OPERA ? "\r\n" : "\n";
bot.Keyboard.prototype.isPressed = function(a) {
  return this.pressed_.contains(a)
};
bot.Keyboard.prototype.pressKey = function(a) {
  if(goog.array.contains(bot.Keyboard.MODIFIERS, a) && this.isPressed(a)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot press a modifier key that is already pressed.");
  }
  var b = !goog.isNull(a.code) && this.fireKeyEvent_(bot.events.EventType.KEYDOWN, a);
  !b && !goog.userAgent.GECKO || (this.requiresKeyPress_(a) && !this.fireKeyEvent_(bot.events.EventType.KEYPRESS, a, !b) || !b) || (this.maybeSubmitForm_(a), this.editable_ && this.maybeEditText_(a));
  this.setKeyPressed_(a, !0)
};
bot.Keyboard.prototype.requiresKeyPress_ = function(a) {
  if(a.character || a == bot.Keyboard.Keys.ENTER) {
    return!0
  }
  if(goog.userAgent.WEBKIT) {
    return!1
  }
  if(goog.userAgent.IE) {
    return a == bot.Keyboard.Keys.ESC
  }
  switch(a) {
    case bot.Keyboard.Keys.SHIFT:
    ;
    case bot.Keyboard.Keys.CONTROL:
    ;
    case bot.Keyboard.Keys.ALT:
      return!1;
    case bot.Keyboard.Keys.META:
    ;
    case bot.Keyboard.Keys.META_RIGHT:
    ;
    case bot.Keyboard.Keys.CONTEXT_MENU:
      return goog.userAgent.GECKO;
    default:
      return!0
  }
};
bot.Keyboard.prototype.maybeSubmitForm_ = function(a) {
  if(a == bot.Keyboard.Keys.ENTER && (!goog.userAgent.GECKO && bot.dom.isElement(this.getElement(), goog.dom.TagName.INPUT)) && (a = bot.Device.findAncestorForm(this.getElement()))) {
    var b = a.getElementsByTagName("input");
    (goog.array.some(b, function(a) {
      return bot.Device.isFormSubmitElement(a)
    }) || 1 == b.length || goog.userAgent.WEBKIT && !bot.userAgent.isEngineVersion(534)) && this.submitForm(a)
  }
};
bot.Keyboard.prototype.maybeEditText_ = function(a) {
  if(a.character) {
    this.updateOnCharacter_(a)
  }else {
    switch(a) {
      case bot.Keyboard.Keys.ENTER:
        this.updateOnEnter_();
        break;
      case bot.Keyboard.Keys.BACKSPACE:
      ;
      case bot.Keyboard.Keys.DELETE:
        this.updateOnBackspaceOrDelete_(a);
        break;
      case bot.Keyboard.Keys.LEFT:
      ;
      case bot.Keyboard.Keys.RIGHT:
        this.updateOnLeftOrRight_(a);
        break;
      case bot.Keyboard.Keys.HOME:
      ;
      case bot.Keyboard.Keys.END:
        this.updateOnHomeOrEnd_(a)
    }
  }
};
bot.Keyboard.prototype.releaseKey = function(a) {
  if(!this.isPressed(a)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot release a key that is not pressed. (" + a.code + ")");
  }
  goog.isNull(a.code) || this.fireKeyEvent_(bot.events.EventType.KEYUP, a);
  this.setKeyPressed_(a, !1)
};
bot.Keyboard.prototype.getChar_ = function(a) {
  if(!a.character) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "not a character key");
  }
  return this.isPressed(bot.Keyboard.Keys.SHIFT) ? a.shiftChar : a.character
};
bot.Keyboard.KEYPRESS_EDITS_TEXT_ = goog.userAgent.GECKO && !bot.userAgent.isEngineVersion(12);
bot.Keyboard.prototype.updateOnCharacter_ = function(a) {
  if(!bot.Keyboard.KEYPRESS_EDITS_TEXT_) {
    a = this.getChar_(a);
    var b = goog.dom.selection.getStart(this.getElement()) + 1;
    goog.dom.selection.setText(this.getElement(), a);
    goog.dom.selection.setStart(this.getElement(), b);
    goog.userAgent.WEBKIT && this.fireHtmlEvent(bot.events.EventType.TEXTINPUT);
    bot.userAgent.IE_DOC_PRE9 || this.fireHtmlEvent(bot.events.EventType.INPUT);
    this.updateCurrentPos_(b)
  }
};
bot.Keyboard.prototype.updateOnEnter_ = function() {
  if(!bot.Keyboard.KEYPRESS_EDITS_TEXT_ && (goog.userAgent.WEBKIT && this.fireHtmlEvent(bot.events.EventType.TEXTINPUT), bot.dom.isElement(this.getElement(), goog.dom.TagName.TEXTAREA))) {
    var a = goog.dom.selection.getStart(this.getElement()) + bot.Keyboard.NEW_LINE_.length;
    goog.dom.selection.setText(this.getElement(), bot.Keyboard.NEW_LINE_);
    goog.dom.selection.setStart(this.getElement(), a);
    goog.userAgent.IE || this.fireHtmlEvent(bot.events.EventType.INPUT);
    this.updateCurrentPos_(a)
  }
};
bot.Keyboard.prototype.updateOnBackspaceOrDelete_ = function(a) {
  if(!bot.Keyboard.KEYPRESS_EDITS_TEXT_) {
    var b = goog.dom.selection.getEndPoints(this.getElement());
    b[0] == b[1] && (a == bot.Keyboard.Keys.BACKSPACE ? (goog.dom.selection.setStart(this.getElement(), b[1] - 1), goog.dom.selection.setEnd(this.getElement(), b[1])) : goog.dom.selection.setEnd(this.getElement(), b[1] + 1));
    b = goog.dom.selection.getEndPoints(this.getElement());
    b = !(b[0] == this.getElement().value.length || 0 == b[1]);
    goog.dom.selection.setText(this.getElement(), "");
    (!goog.userAgent.IE && b || goog.userAgent.GECKO && a == bot.Keyboard.Keys.BACKSPACE) && this.fireHtmlEvent(bot.events.EventType.INPUT);
    b = goog.dom.selection.getEndPoints(this.getElement());
    this.updateCurrentPos_(b[1])
  }
};
bot.Keyboard.prototype.updateOnLeftOrRight_ = function(a) {
  var b = this.getElement(), c = goog.dom.selection.getStart(b), d = goog.dom.selection.getEnd(b), e = 0, f = 0;
  a == bot.Keyboard.Keys.LEFT ? this.isPressed(bot.Keyboard.Keys.SHIFT) ? this.currentPos_ == c ? (e = Math.max(c - 1, 0), f = d, a = e) : (e = c, a = f = d - 1) : a = c == d ? Math.max(c - 1, 0) : c : this.isPressed(bot.Keyboard.Keys.SHIFT) ? this.currentPos_ == d ? (e = c, a = f = Math.min(d + 1, b.value.length)) : (e = c + 1, f = d, a = e) : a = c == d ? Math.min(d + 1, b.value.length) : d;
  this.isPressed(bot.Keyboard.Keys.SHIFT) ? (goog.dom.selection.setStart(b, e), goog.dom.selection.setEnd(b, f)) : goog.dom.selection.setCursorPosition(b, a);
  this.updateCurrentPos_(a)
};
bot.Keyboard.prototype.updateOnHomeOrEnd_ = function(a) {
  var b = this.getElement(), c = goog.dom.selection.getStart(b), d = goog.dom.selection.getEnd(b);
  a == bot.Keyboard.Keys.HOME ? (this.isPressed(bot.Keyboard.Keys.SHIFT) ? (goog.dom.selection.setStart(b, 0), goog.dom.selection.setEnd(b, this.currentPos_ == c ? d : c)) : goog.dom.selection.setCursorPosition(b, 0), this.updateCurrentPos_(0)) : (this.isPressed(bot.Keyboard.Keys.SHIFT) ? (this.currentPos_ == c && goog.dom.selection.setStart(b, d), goog.dom.selection.setEnd(b, b.value.length)) : goog.dom.selection.setCursorPosition(b, b.value.length), this.updateCurrentPos_(b.value.length))
};
bot.Keyboard.prototype.updateCurrentPos_ = function(a) {
  this.currentPos_ = a
};
bot.Keyboard.prototype.fireKeyEvent_ = function(a, b, c) {
  if(goog.isNull(b.code)) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Key must have a keycode to be fired.");
  }
  b = {altKey:this.isPressed(bot.Keyboard.Keys.ALT), ctrlKey:this.isPressed(bot.Keyboard.Keys.CONTROL), metaKey:this.isPressed(bot.Keyboard.Keys.META), shiftKey:this.isPressed(bot.Keyboard.Keys.SHIFT), keyCode:b.code, charCode:b.character && a == bot.events.EventType.KEYPRESS ? this.getChar_(b).charCodeAt(0) : 0, preventDefault:!!c};
  return this.fireKeyboardEvent(a, b)
};
bot.Keyboard.prototype.moveCursor = function(a) {
  this.setElement(a);
  this.editable_ = bot.dom.isEditable(a);
  var b = this.focusOnElement();
  this.editable_ && b && (goog.dom.selection.setCursorPosition(a, a.value.length), this.updateCurrentPos_(a.value.length))
};
bot.Keyboard.prototype.getState = function() {
  return{pressed:this.pressed_.getValues(), currentPos:this.currentPos_}
};
bot.Keyboard.prototype.getModifiersState = function() {
  return this.modifiersState
};
bot.Touchscreen = function() {
  bot.Device.call(this);
  this.clientXY_ = new goog.math.Coordinate(0, 0);
  this.clientXY2_ = new goog.math.Coordinate(0, 0)
};
goog.inherits(bot.Touchscreen, bot.Device);
bot.Touchscreen.prototype.hasMovedAfterPress_ = !1;
bot.Touchscreen.prototype.cancelled_ = !1;
bot.Touchscreen.prototype.touchIdentifier_ = 0;
bot.Touchscreen.prototype.touchIdentifier2_ = 0;
bot.Touchscreen.prototype.touchCounter_ = 2;
bot.Touchscreen.prototype.press = function(a) {
  if(this.isPressed()) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot press touchscreen when already pressed.");
  }
  this.hasMovedAfterPress_ = !1;
  this.touchIdentifier_ = this.touchCounter_++;
  a && (this.touchIdentifier2_ = this.touchCounter_++);
  bot.userAgent.IE_DOC_10 ? this.firePointerEvents_(bot.Touchscreen.fireSinglePressPointer_) : this.fireTouchEvent_(bot.events.EventType.TOUCHSTART)
};
bot.Touchscreen.prototype.release = function() {
  if(!this.isPressed()) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot release touchscreen when not already pressed.");
  }
  bot.userAgent.IE_DOC_10 ? this.cancelled_ || this.firePointerEvents_(bot.Touchscreen.fireSingleReleasePointer_) : this.fireTouchReleaseEvents_();
  bot.Device.clearPointerMap();
  this.touchIdentifier2_ = this.touchIdentifier_ = 0;
  this.cancelled_ = !1
};
bot.Touchscreen.prototype.move = function(a, b, c) {
  var d = this.getElement();
  this.isPressed() && !bot.userAgent.IE_DOC_10 || this.setElement(a);
  var e = bot.dom.getClientRect(a);
  this.clientXY_.x = b.x + e.left;
  this.clientXY_.y = b.y + e.top;
  goog.isDef(c) && (this.clientXY2_.x = c.x + e.left, this.clientXY2_.y = c.y + e.top);
  this.isPressed() && (bot.userAgent.IE_DOC_10 ? this.cancelled_ || (a != d && (this.hasMovedAfterPress_ = !0), bot.Touchscreen.hasMsTouchActionsEnabled_(a) ? this.firePointerEvents_(bot.Touchscreen.fireSingleMovePointer_) : (this.fireMSPointerEvent(bot.events.EventType.MSPOINTEROUT, b, -1, this.touchIdentifier_, MSPointerEvent.MSPOINTER_TYPE_TOUCH, !0), this.fireMouseEvent(bot.events.EventType.MOUSEOUT, b, 0), this.fireMSPointerEvent(bot.events.EventType.MSPOINTERCANCEL, b, 0, this.touchIdentifier_, 
  MSPointerEvent.MSPOINTER_TYPE_TOUCH, !0), this.cancelled_ = !0, bot.Device.clearPointerMap())) : (this.hasMovedAfterPress_ = !0, this.fireTouchEvent_(bot.events.EventType.TOUCHMOVE)))
};
bot.Touchscreen.prototype.isPressed = function() {
  return!!this.touchIdentifier_
};
bot.Touchscreen.prototype.fireTouchEvent_ = function(a) {
  if(!this.isPressed()) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Should never fire event when touchscreen is not pressed.");
  }
  var b, c;
  this.touchIdentifier2_ && (b = this.touchIdentifier2_, c = this.clientXY2_);
  this.fireTouchEvent(a, this.touchIdentifier_, this.clientXY_, b, c)
};
bot.Touchscreen.prototype.fireTouchReleaseEvents_ = function() {
  this.fireTouchEvent_(bot.events.EventType.TOUCHEND);
  this.hasMovedAfterPress_ || (this.fireMouseEvent(bot.events.EventType.MOUSEMOVE, this.clientXY_, 0), this.fireMouseEvent(bot.events.EventType.MOUSEDOWN, this.clientXY_, 0) && this.focusOnElement(), this.maybeToggleOption(), this.fireMouseEvent(bot.events.EventType.MOUSEUP, this.clientXY_, 0), this.clickElement(this.clientXY_, 0))
};
bot.Touchscreen.prototype.firePointerEvents_ = function(a) {
  a(this, this.getElement(), this.clientXY_, this.touchIdentifier_, !0);
  this.touchIdentifier2_ && bot.Touchscreen.hasMsTouchActionsEnabled_(this.getElement()) && a(this, this.getElement(), this.clientXY2_, this.touchIdentifier2_, !1)
};
bot.Touchscreen.fireSinglePressPointer_ = function(a, b, c, d, e) {
  a.fireMouseEvent(bot.events.EventType.MOUSEMOVE, c, 0);
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTEROVER, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEOVER, c, 0);
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTERDOWN, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEDOWN, c, 0) && (bot.dom.isSelectable(b) && a.fireMSPointerEvent(bot.events.EventType.MSGOTPOINTERCAPTURE, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e), a.focusOnElement())
};
bot.Touchscreen.fireSingleReleasePointer_ = function(a, b, c, d, e) {
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTERUP, c, 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEUP, c, 0, null, 0, !1, d);
  a.hasMovedAfterPress_ || (a.maybeToggleOption(), a.clickElement(a.clientXY_, 0, d));
  bot.dom.isSelectable(b) && a.fireMSPointerEvent(bot.events.EventType.MSLOSTPOINTERCAPTURE, new goog.math.Coordinate(0, 0), 0, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, !1);
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTEROUT, c, -1, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEOUT, c, 0, null, 0, !1, d)
};
bot.Touchscreen.fireSingleMovePointer_ = function(a, b, c, d, e) {
  a.fireMSPointerEvent(bot.events.EventType.MSPOINTERMOVE, c, -1, d, MSPointerEvent.MSPOINTER_TYPE_TOUCH, e);
  a.fireMouseEvent(bot.events.EventType.MOUSEMOVE, c, 0, null, 0, !1, d)
};
bot.Touchscreen.hasMsTouchActionsEnabled_ = function(a) {
  if(!bot.userAgent.IE_DOC_10) {
    throw Error("hasMsTouchActionsEnable should only be called from IE 10");
  }
  if("none" == bot.dom.getEffectiveStyle(a, "ms-touch-action")) {
    return!0
  }
  a = bot.dom.getParentElement(a);
  return!!a && bot.Touchscreen.hasMsTouchActionsEnabled_(a)
};
goog.math.Vec2 = function(a, b) {
  this.x = a;
  this.y = b
};
goog.inherits(goog.math.Vec2, goog.math.Coordinate);
goog.math.Vec2.randomUnit = function() {
  var a = 2 * Math.random() * Math.PI;
  return new goog.math.Vec2(Math.cos(a), Math.sin(a))
};
goog.math.Vec2.random = function() {
  var a = Math.sqrt(Math.random()), b = 2 * Math.random() * Math.PI;
  return new goog.math.Vec2(Math.cos(b) * a, Math.sin(b) * a)
};
goog.math.Vec2.fromCoordinate = function(a) {
  return new goog.math.Vec2(a.x, a.y)
};
goog.math.Vec2.prototype.clone = function() {
  return new goog.math.Vec2(this.x, this.y)
};
goog.math.Vec2.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y)
};
goog.math.Vec2.prototype.squaredMagnitude = function() {
  return this.x * this.x + this.y * this.y
};
goog.math.Vec2.prototype.scale = goog.math.Coordinate.prototype.scale;
goog.math.Vec2.prototype.invert = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this
};
goog.math.Vec2.prototype.normalize = function() {
  return this.scale(1 / this.magnitude())
};
goog.math.Vec2.prototype.add = function(a) {
  this.x += a.x;
  this.y += a.y;
  return this
};
goog.math.Vec2.prototype.subtract = function(a) {
  this.x -= a.x;
  this.y -= a.y;
  return this
};
goog.math.Vec2.prototype.rotate = function(a) {
  var b = Math.cos(a);
  a = Math.sin(a);
  var c = this.y * b + this.x * a;
  this.x = this.x * b - this.y * a;
  this.y = c;
  return this
};
goog.math.Vec2.rotateAroundPoint = function(a, b, c) {
  return a.clone().subtract(b).rotate(c).add(b)
};
goog.math.Vec2.prototype.equals = function(a) {
  return this == a || !!a && this.x == a.x && this.y == a.y
};
goog.math.Vec2.distance = goog.math.Coordinate.distance;
goog.math.Vec2.squaredDistance = goog.math.Coordinate.squaredDistance;
goog.math.Vec2.equals = goog.math.Coordinate.equals;
goog.math.Vec2.sum = function(a, b) {
  return new goog.math.Vec2(a.x + b.x, a.y + b.y)
};
goog.math.Vec2.difference = function(a, b) {
  return new goog.math.Vec2(a.x - b.x, a.y - b.y)
};
goog.math.Vec2.dot = function(a, b) {
  return a.x * b.x + a.y * b.y
};
goog.math.Vec2.lerp = function(a, b, c) {
  return new goog.math.Vec2(goog.math.lerp(a.x, b.x, c), goog.math.lerp(a.y, b.y, c))
};
bot.action = {};
bot.action.checkShown_ = function(a) {
  if(!bot.dom.isShown(a, !0)) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_VISIBLE, "Element is not currently visible and may not be manipulated");
  }
};
bot.action.checkInteractable_ = function(a) {
  if(!bot.dom.isInteractable(a)) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element is not currently interactable and may not be manipulated");
  }
};
bot.action.clear = function(a) {
  bot.action.checkInteractable_(a);
  if(!bot.dom.isEditable(a)) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element must be user-editable in order to clear it.");
  }
  bot.action.LegacyDevice_.focusOnElement(a);
  a.value && (a.value = "", bot.events.fire(a, bot.events.EventType.CHANGE));
  bot.dom.isContentEditable(a) && (a.innerHTML = " ")
};
bot.action.focusOnElement = function(a) {
  bot.action.checkInteractable_(a);
  bot.action.LegacyDevice_.focusOnElement(a)
};
bot.action.type = function(a, b, c, d) {
  function e(a) {
    goog.isString(a) ? goog.array.forEach(a.split(""), function(a) {
      a = bot.Keyboard.Key.fromChar(a);
      var b = f.isPressed(bot.Keyboard.Keys.SHIFT);
      a.shift && !b && f.pressKey(bot.Keyboard.Keys.SHIFT);
      f.pressKey(a.key);
      f.releaseKey(a.key);
      a.shift && !b && f.releaseKey(bot.Keyboard.Keys.SHIFT)
    }) : goog.array.contains(bot.Keyboard.MODIFIERS, a) ? f.isPressed(a) ? f.releaseKey(a) : f.pressKey(a) : (f.pressKey(a), f.releaseKey(a))
  }
  bot.action.checkShown_(a);
  bot.action.checkInteractable_(a);
  var f = c || new bot.Keyboard;
  f.moveCursor(a);
  if((!goog.userAgent.product.SAFARI || goog.userAgent.MOBILE) && goog.userAgent.WEBKIT && "date" == a.type) {
    c = goog.isArray(b) ? b = b.join("") : b;
    var g = /\d{4}-\d{2}-\d{2}/;
    if(c.match(g)) {
      goog.userAgent.MOBILE && goog.userAgent.product.SAFARI && (bot.events.fire(a, bot.events.EventType.TOUCHSTART), bot.events.fire(a, bot.events.EventType.TOUCHEND));
      bot.events.fire(a, bot.events.EventType.FOCUS);
      a.value = c.match(g)[0];
      bot.events.fire(a, bot.events.EventType.CHANGE);
      bot.events.fire(a, bot.events.EventType.BLUR);
      return
    }
  }
  goog.isArray(b) ? goog.array.forEach(b, e) : e(b);
  d || goog.array.forEach(bot.Keyboard.MODIFIERS, function(a) {
    f.isPressed(a) && f.releaseKey(a)
  })
};
bot.action.submit = function(a) {
  var b = bot.action.LegacyDevice_.findAncestorForm(a);
  if(!b) {
    throw new bot.Error(bot.ErrorCode.NO_SUCH_ELEMENT, "Element was not in a form, so could not submit.");
  }
  bot.action.LegacyDevice_.submitForm(a, b)
};
bot.action.moveMouse = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  (c || new bot.Mouse).move(a, b)
};
bot.action.click = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Mouse;
  c.move(a, b);
  c.pressButton(bot.Mouse.Button.LEFT);
  c.releaseButton()
};
bot.action.rightClick = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Mouse;
  c.move(a, b);
  c.pressButton(bot.Mouse.Button.RIGHT);
  c.releaseButton()
};
bot.action.doubleClick = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Mouse;
  c.move(a, b);
  c.pressButton(bot.Mouse.Button.LEFT);
  c.releaseButton();
  c.pressButton(bot.Mouse.Button.LEFT);
  c.releaseButton()
};
bot.action.scrollMouse = function(a, b, c, d) {
  c = bot.action.prepareToInteractWith_(a, c);
  d = d || new bot.Mouse;
  d.move(a, c);
  d.scroll(b)
};
bot.action.drag = function(a, b, c, d, e, f) {
  e = bot.action.prepareToInteractWith_(a, e);
  var g = bot.dom.getClientRect(a);
  f = f || new bot.Mouse;
  f.move(a, e);
  f.pressButton(bot.Mouse.Button.LEFT);
  d = goog.isDef(d) ? d : 2;
  if(1 > d) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "There must be at least one step as part of a drag.");
  }
  for(var h = 1;h <= d;h++) {
    var k = Math.floor(h * b / d), n = Math.floor(h * c / d), q = bot.dom.getClientRect(a), k = new goog.math.Coordinate(e.x + g.left + k - q.left, e.y + g.top + n - q.top);
    f.move(a, k)
  }
  f.releaseButton()
};
bot.action.tap = function(a, b, c) {
  b = bot.action.prepareToInteractWith_(a, b);
  c = c || new bot.Touchscreen;
  c.move(a, b);
  c.press();
  c.release()
};
bot.action.swipe = function(a, b, c, d, e, f) {
  e = bot.action.prepareToInteractWith_(a, e);
  f = f || new bot.Touchscreen;
  var g = bot.dom.getClientRect(a);
  f.move(a, e);
  f.press();
  d = goog.isDef(d) ? d : 2;
  if(1 > d) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "There must be at least one step as part of a swipe.");
  }
  for(var h = 1;h <= d;h++) {
    var k = Math.floor(h * b / d), n = Math.floor(h * c / d), q = bot.dom.getClientRect(a), k = new goog.math.Coordinate(e.x + g.left + k - q.left, e.y + g.top + n - q.top);
    f.move(a, k)
  }
  f.release()
};
bot.action.pinch = function(a, b, c, d) {
  if(0 == b) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot pinch by a distance of zero.");
  }
  var e = b / 2;
  bot.action.multiTouchAction_(a, function(a) {
    if(0 > b) {
      var c = a.magnitude();
      a.scale(c ? (c + b) / c : 0)
    }
  }, function(a) {
    var b = a.magnitude();
    a.scale(b ? (b - e) / b : 0)
  }, c, d)
};
bot.action.rotate = function(a, b, c, d) {
  if(0 == b) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "Cannot rotate by an angle of zero.");
  }
  var e = Math.PI * (b / 180) / 2;
  bot.action.multiTouchAction_(a, function(a) {
    a.scale(0.5)
  }, function(a) {
    a.rotate(e)
  }, c, d)
};
bot.action.multiTouchAction_ = function(a, b, c, d, e) {
  d = bot.action.prepareToInteractWith_(a, d);
  var f = bot.action.getInteractableSize(a), f = new goog.math.Vec2(Math.min(d.x, f.width - d.x), Math.min(d.y, f.height - d.y));
  e = e || new bot.Touchscreen;
  b(f);
  b = goog.math.Vec2.sum(d, f);
  var g = goog.math.Vec2.difference(d, f);
  e.move(a, b, g);
  e.press(!0);
  b = bot.dom.getClientRect(a);
  c(f);
  var g = goog.math.Vec2.sum(d, f), h = goog.math.Vec2.difference(d, f);
  e.move(a, g, h);
  g = bot.dom.getClientRect(a);
  b = goog.math.Vec2.difference(new goog.math.Vec2(g.left, g.top), new goog.math.Vec2(b.left, b.top));
  c(f);
  c = goog.math.Vec2.sum(d, f).subtract(b);
  d = goog.math.Vec2.difference(d, f).subtract(b);
  e.move(a, c, d);
  e.release()
};
bot.action.prepareToInteractWith_ = function(a, b) {
  bot.action.checkShown_(a);
  var c = goog.dom.getOwnerDocument(a);
  goog.style.scrollIntoContainerView(a, goog.userAgent.WEBKIT ? c.body : c.documentElement);
  if(b) {
    return goog.math.Vec2.fromCoordinate(b)
  }
  c = bot.action.getInteractableSize(a);
  return new goog.math.Vec2(c.width / 2, c.height / 2)
};
bot.action.getInteractableSize = function(a) {
  var b = goog.style.getSize(a);
  return 0 < b.width && 0 < b.height || !a.offsetParent ? b : bot.action.getInteractableSize(a.offsetParent)
};
bot.action.LegacyDevice_ = function() {
  bot.Device.call(this)
};
goog.inherits(bot.action.LegacyDevice_, bot.Device);
goog.addSingletonGetter(bot.action.LegacyDevice_);
bot.action.LegacyDevice_.focusOnElement = function(a) {
  var b = bot.action.LegacyDevice_.getInstance();
  b.setElement(a);
  return b.focusOnElement()
};
bot.action.LegacyDevice_.submitForm = function(a, b) {
  var c = bot.action.LegacyDevice_.getInstance();
  c.setElement(a);
  c.submitForm(b)
};
bot.action.LegacyDevice_.findAncestorForm = function(a) {
  return bot.Device.findAncestorForm(a)
};
bot.action.scrollIntoView = function(a, b) {
  if(!bot.dom.isScrolledIntoView(a, b) && (a.scrollIntoView && a.scrollIntoView(), goog.userAgent.OPERA && !bot.userAgent.isEngineVersion(11))) {
    for(var c = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), c = c.frameElement;c;c = c.frameElement) {
      c.scrollIntoView(), c = goog.dom.getWindow(goog.dom.getOwnerDocument(c))
    }
  }
  b && (c = new goog.math.Rect(b.x, b.y, 1, 1), bot.dom.scrollElementRegionIntoClientView(a, c));
  c = bot.dom.isScrolledIntoView(a, b);
  if(!c && b) {
    var d = bot.dom.getClientRect(a), d = goog.math.Coordinate.sum(new goog.math.Coordinate(d.left, d.top), b);
    try {
      bot.dom.getInViewLocation(d, goog.dom.getWindow(goog.dom.getOwnerDocument(a))), c = !0
    }catch(e) {
      c = !1
    }
  }
  return c
};
bot.window = {};
bot.window.HISTORY_LENGTH_INCLUDES_NEW_PAGE_ = !goog.userAgent.IE && !goog.userAgent.OPERA;
bot.window.HISTORY_LENGTH_INCLUDES_FORWARD_PAGES_ = !goog.userAgent.OPERA && (!goog.userAgent.WEBKIT || bot.userAgent.isEngineVersion("533"));
bot.window.Orientation = {PORTRAIT:"portrait-primary", PORTRAIT_SECONDARY:"portrait-secondary", LANDSCAPE:"landscape-primary", LANDSCAPE_SECONDARY:"landscape-secondary"};
bot.window.getOrientationDegrees_ = function() {
  var a;
  return function(b) {
    a || (a = {}, goog.userAgent.MOBILE ? (a[bot.window.Orientation.PORTRAIT] = 0, a[bot.window.Orientation.LANDSCAPE] = 90, a[bot.window.Orientation.LANDSCAPE_SECONDARY] = -90, goog.userAgent.product.IPAD && (a[bot.window.Orientation.PORTRAIT_SECONDARY] = 180)) : goog.userAgent.product.ANDROID && (a[bot.window.Orientation.PORTRAIT] = -90, a[bot.window.Orientation.LANDSCAPE] = 0, a[bot.window.Orientation.PORTRAIT_SECONDARY] = 90, a[bot.window.Orientation.LANDSCAPE_SECONDARY] = 180));
    return a[b]
  }
}();
bot.window.back = function(a) {
  var b = bot.window.HISTORY_LENGTH_INCLUDES_NEW_PAGE_ ? bot.getWindow().history.length - 1 : bot.getWindow().history.length;
  a = bot.window.checkNumPages_(b, a);
  bot.getWindow().history.go(-a)
};
bot.window.forward = function(a) {
  var b = bot.window.HISTORY_LENGTH_INCLUDES_FORWARD_PAGES_ ? bot.getWindow().history.length - 1 : null;
  a = bot.window.checkNumPages_(b, a);
  bot.getWindow().history.go(a)
};
bot.window.checkNumPages_ = function(a, b) {
  var c = goog.isDef(b) ? b : 1;
  if(0 >= c) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be positive");
  }
  if(null !== a && c > a) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be less than the length of the browser history");
  }
  return c
};
bot.window.getInteractableSize = function(a) {
  var b = (a || bot.getWindow()).document;
  a = b.documentElement;
  var c = b.body;
  if(!c) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "No BODY element present");
  }
  b = [a.clientHeight, a.scrollHeight, a.offsetHeight, c.scrollHeight, c.offsetHeight];
  a = Math.max.apply(null, [a.clientWidth, a.scrollWidth, a.offsetWidth, c.scrollWidth, c.offsetWidth]);
  b = Math.max.apply(null, b);
  return new goog.math.Size(a, b)
};
bot.window.getFrame_ = function(a) {
  try {
    return a.frameElement
  }catch(b) {
    return null
  }
};
bot.window.getSize = function(a) {
  a = a || bot.getWindow();
  var b = bot.window.getFrame_(a);
  if(bot.userAgent.ANDROID_PRE_GINGERBREAD) {
    return b ? (a = goog.style.getBorderBox(b), new goog.math.Size(b.clientWidth - a.left - a.right, b.clientHeight)) : new goog.math.Size(320, 240)
  }
  if(b) {
    return new goog.math.Size(b.clientWidth, b.clientHeight)
  }
  var b = a.document.documentElement, c = a.document.body;
  return new goog.math.Size(a.outerWidth || b && b.clientWidth || c && c.clientWidth || 0, a.outerHeight || b && b.clientHeight || c && c.clientHeight || 0)
};
bot.window.setSize = function(a, b) {
  var c = b || bot.getWindow(), d = bot.window.getFrame_(c);
  d ? (d.style.minHeight = "0px", d.style.minWidth = "0px", d.width = a.width + "px", d.style.width = a.width + "px", d.height = a.height + "px", d.style.height = a.height + "px") : c.resizeTo(a.width, a.height)
};
bot.window.getScroll = function(a) {
  a = a || bot.getWindow();
  return(new goog.dom.DomHelper(a.document)).getDocumentScroll()
};
bot.window.setScroll = function(a, b) {
  (b || bot.getWindow()).scrollTo(a.x, a.y)
};
bot.window.getPosition = function(a) {
  var b = a || bot.getWindow();
  goog.userAgent.IE ? (a = b.screenLeft, b = b.screenTop) : (a = b.screenX, b = b.screenY);
  return new goog.math.Coordinate(a, b)
};
bot.window.setPosition = function(a, b) {
  (b || bot.getWindow()).moveTo(a.x, a.y)
};
bot.window.getCurrentOrientationDegrees_ = function() {
  var a = bot.getWindow();
  goog.isDef(a.orientation) || (a.orientation = 0);
  return a.orientation
};
bot.window.changeOrientation = function(a) {
  var b = bot.getWindow(), c = bot.window.getCurrentOrientationDegrees_(), d = bot.window.getOrientationDegrees_(a);
  if(c != d && goog.isDef(d)) {
    if(Object.getOwnPropertyDescriptor && Object.defineProperty) {
      var e = Object.getOwnPropertyDescriptor(b, "orientation");
      e && e.configurable && Object.defineProperty(b, "orientation", {configurable:!0, get:function() {
        return d
      }})
    }
    bot.events.fire(b, bot.events.EventType.ORIENTATIONCHANGE);
    0 != Math.abs(c - d) % 180 && (c = bot.window.getSize(), b = c.getShortest(), c = c.getLongest(), a == bot.window.Orientation.PORTRAIT || a == bot.window.Orientation.PORTRAIT_SECONDARY ? bot.window.setSize(new goog.math.Size(b, c)) : bot.window.setSize(new goog.math.Size(c, b)))
  }
};
var SyntheticMouse = function() {
  this.wrappedJSObject = this;
  this.QueryInterface = fxdriver.moz.queryInterface(this, [CI.nsISupports, CI.wdIMouse]);
  this.lastElement = this.buttonDown = null;
  this.isButtonPressed = !1;
  this.viewPortOffset = new goog.math.Coordinate(0, 0)
};
SyntheticMouse.newResponse = function(a, b) {
  return{status:a, message:b, QueryInterface:function(a) {
    if(a.equals(Components.interfaces.wdIStatus) || a.equals(Components.interfaces.nsISupports)) {
      return this
    }
    throw Components.results.NS_NOINTERFACE;
  }}
};
SyntheticMouse.prototype.isElementShown = function(a) {
  if(!bot.dom.isShown(a, !0)) {
    return SyntheticMouse.newResponse(bot.ErrorCode.ELEMENT_NOT_VISIBLE, "Element is not currently visible and so may not be interacted with")
  }
};
SyntheticMouse.prototype.getElement_ = function(a) {
  return a.auxiliary || this.lastElement
};
SyntheticMouse.prototype.getMouse_ = function(a) {
  this.mouse || (this.mouse = new bot.Mouse(null, a || this.modifierKeys, new SyntheticMouse.EventEmitter));
  return this.mouse
};
SyntheticMouse.prototype.initialize = function(a) {
  this.modifierKeys = a
};
SyntheticMouse.prototype.move = function(a, b, c) {
  fxdriver.logging.info("SyntheticMouse.move " + a + " " + b + " " + c);
  b = b || 0;
  c = c || 0;
  var d;
  a && (a.nodeType == goog.dom.NodeType.ELEMENT ? d = a : this.lastElement ? (d = this.lastElement, b = this.lastMousePosition.x + b, c = this.lastMousePosition.y + c) : (d = Utils.getMainDocumentElement(a), a = goog.style.getClientPosition(d), b -= a.x, c -= a.y));
  var e = goog.dom.getOwnerDocument(d);
  bot.setWindow(goog.dom.getWindow(e));
  var f = a = 0;
  this.isButtonPressed && (e = goog.dom.getDomHelper(e).getDocumentScroll(), a = 2 * (e.x - this.viewPortOffset.x), f = 2 * (e.y - this.viewPortOffset.y), fxdriver.logging.info("xCompensate = " + a + " yCompensate = " + f));
  b = new goog.math.Coordinate(b + a, c + f);
  fxdriver.logging.info("Calling mouse.move with: " + b.x + ", " + b.y + ", " + d);
  this.getMouse_().move(d, b);
  this.lastElement = d;
  this.lastMousePosition = b;
  return SyntheticMouse.newResponse(bot.ErrorCode.SUCCESS, "ok")
};
SyntheticMouse.prototype.click = function(a) {
  fxdriver.logging.info("SyntheticMouse.click " + a);
  a = a ? a : this.lastElement;
  var b = this.isElementShown(a);
  if(b) {
    return b
  }
  if("option" == a.tagName.toLowerCase()) {
    for(b = a;null != b.parentNode && "select" != b.tagName.toLowerCase();) {
      b = b.parentNode
    }
    b && ("select" == b.tagName.toLowerCase() && !b.multiple) && bot.action.click(b, void 0)
  }
  fxdriver.logging.info("About to do a bot.action.click on " + a);
  b = new bot.Device.ModifiersState;
  void 0 !== this.modifierKeys && (b.setPressed(bot.Device.Modifier.SHIFT, this.modifierKeys.isShiftPressed()), b.setPressed(bot.Device.Modifier.CONTROL, this.modifierKeys.isControlPressed()), b.setPressed(bot.Device.Modifier.ALT, this.modifierKeys.isAltPressed()), b.setPressed(bot.Device.Modifier.META, this.modifierKeys.isMetaPressed()));
  bot.action.click(a, void 0, new bot.Mouse(null, b));
  this.lastElement = a;
  return SyntheticMouse.newResponse(bot.ErrorCode.SUCCESS, "ok")
};
SyntheticMouse.prototype.contextClick = function(a) {
  fxdriver.logging.info("SyntheticMouse.contextClick " + a);
  a = a ? a : this.lastElement;
  var b = this.isElementShown(a);
  if(b) {
    return b
  }
  fxdriver.logging.info("About to do a bot.action.rightClick on " + a);
  bot.action.rightClick(a, void 0);
  this.lastElement = a;
  return SyntheticMouse.newResponse(bot.ErrorCode.SUCCESS, "ok")
};
SyntheticMouse.prototype.doubleClick = function(a) {
  fxdriver.logging.info("SyntheticMouse.doubleClick " + a);
  a = a ? a : this.lastElement;
  var b = this.isElementShown(a);
  if(b) {
    return b
  }
  fxdriver.logging.info("About to do a bot.action.doubleClick on " + a);
  bot.action.doubleClick(a, void 0);
  this.lastElement = a;
  return SyntheticMouse.newResponse(bot.ErrorCode.SUCCESS, "ok")
};
SyntheticMouse.prototype.down = function(a) {
  fxdriver.logging.info("SyntheticMouse.down " + a);
  a = this.getElement_(a);
  this.getMouse_().pressButton(bot.Mouse.Button.LEFT);
  this.isButtonPressed = !0;
  var b = goog.dom.getOwnerDocument(a);
  this.viewPortOffset = goog.dom.getDomHelper(b).getDocumentScroll();
  this.lastElement = a;
  return SyntheticMouse.newResponse(bot.ErrorCode.SUCCESS, "ok")
};
SyntheticMouse.prototype.up = function(a) {
  fxdriver.logging.info("SyntheticMouse.up " + a);
  a = this.getElement_(a);
  this.getMouse_().releaseButton();
  this.buttonDown = null;
  this.isButtonPressed = !1;
  this.viewPortOffset.x = 0;
  this.viewPortOffset.y = 0;
  this.lastElement = a;
  return SyntheticMouse.newResponse(bot.ErrorCode.SUCCESS, "ok")
};
SyntheticMouse.prototype.addEventModifierKeys = function(a) {
  void 0 !== this.modifierKeys && (a.altKey = this.modifierKeys.isAltPressed(), a.ctrlKey = this.modifierKeys.isControlPressed(), a.metaKey = this.modifierKeys.isMetaPressed(), a.shiftKey = this.modifierKeys.isShiftPressed())
};
SyntheticMouse.EventEmitter = function() {
  bot.Device.EventEmitter.call(this)
};
goog.inherits(SyntheticMouse.EventEmitter, bot.Device.EventEmitter);
SyntheticMouse.EventEmitter.prototype._parseModifiers = function(a) {
  var b = Components.interfaces.nsIDOMNSEvent, c = 0;
  a.shiftKey && (c |= b.SHIFT_MASK);
  a.ctrlKey && (c |= b.CONTROL_MASK);
  a.altKey && (c |= b.ALT_MASK);
  a.metaKey && (c |= b.META_MASK);
  a.accelKey && (c |= 0 <= navigator.platform.indexOf("Mac") ? b.META_MASK : b.CONTROL_MASK);
  return c
};
SyntheticMouse.EventEmitter.prototype._getDOMWindowUtils = function(a) {
  a || (a = window);
  return a.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils)
};
SyntheticMouse.EventEmitter.prototype.fireHtmlEvent = function(a, b) {
  return bot.events.fire(a, b)
};
SyntheticMouse.EventEmitter.prototype.fireKeyboardEvent = function(a, b, c) {
  a = goog.dom.getOwnerDocument(a);
  a = goog.dom.getWindow(a);
  a = this._getDOMWindowUtils(a);
  var d = this._parseModifiers(c);
  a.sendKeyEvent(b, c.keyCode, c.charCode, d);
  return!0
};
SyntheticMouse.EventEmitter.prototype.fireMouseEvent = function(a, b, c) {
  fxdriver.logging.info("Calling fireMouseEvent " + b + " " + c.clientX + ", " + c.clientY + ", " + a);
  if("click" == b) {
    return!0
  }
  var d = goog.dom.getOwnerDocument(a), d = goog.dom.getWindow(d), d = this._getDOMWindowUtils(d), e = this._parseModifiers(c);
  d.sendMouseEventToWindow(b, Math.round(c.clientX), Math.round(c.clientY), c.button, 1, e);
  fxdriver.logging.info("Called fireMouseEvent " + b + " " + c.clientX + ", " + c.clientY + ", " + a);
  return!0
};
SyntheticMouse.EventEmitter.prototype.fireTouchEvent = function(a, b, c) {
  return bot.events.fire(a, b, c)
};
SyntheticMouse.EventEmitter.prototype.fireMSPointerEvent = function(a, b, c) {
  return bot.events.fire(a, b, c)
};
SyntheticMouse.prototype.classDescription = "Pure JS implementation of a mouse";
SyntheticMouse.prototype.contractID = "@googlecode.com/webdriver/syntheticmouse;1";
SyntheticMouse.prototype.classID = Components.ID("{E8F9FEFE-C513-4097-98BE-BE00A41D3645}");
var components = [SyntheticMouse];
fxdriver.moz.load("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.generateNSGetFactory ? NSGetFactory = XPCOMUtils.generateNSGetFactory(components) : NSGetModule = XPCOMUtils.generateNSGetModule(components);
goog.exportSymbol("SyntheticMouse", SyntheticMouse);
goog.exportSymbol("SyntheticMouse.prototype.down", SyntheticMouse.prototype.down);
goog.exportSymbol("SyntheticMouse.prototype.up", SyntheticMouse.prototype.up);
goog.exportSymbol("SyntheticMouse.prototype.move", SyntheticMouse.prototype.move);
goog.exportSymbol("SyntheticMouse.prototype.click", SyntheticMouse.prototype.click);
goog.exportSymbol("SyntheticMouse.prototype.doubleClick", SyntheticMouse.prototype.doubleClick);
goog.exportSymbol("SyntheticMouse.prototype.contextClick", SyntheticMouse.prototype.contextClick);

