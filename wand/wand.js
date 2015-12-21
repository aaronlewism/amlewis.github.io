/*
    WIP
*/
// Create wand object
(function(obj) {
    var wand = {};
    wand.enabled = false;
    obj.wand = wand;
})(window);

// Initialize wand object
(function(window, document, wand) {
  wand._callbacks = {}
  var uniqueId = 0

  function _execute(method, args, callback) {
    var url = "wand-client-action:///" + method;
    var argsString = null;
    if (callback) {
      var callbackHandle = _prepCallback(callback);
      argsString = (argsString == null) ? "" : argsString + "&"
      argsString += "c=" + encodeURIComponent(callbackHandle)
    }
    if (args) {
      argsString = (argsString == null) ? "" : argsString + "&"
      argsString += "&a=" + encodeURIComponent(JSON.stringify(args));
    }
    if (argsString) {
      url += "?" + argsString
    }
    _execute_url(url);
  }

  function _prepCallback(callback) {
    var callbackHandle = "__CALLBACK__" + (uniqueId++);
    wand._callbacks[callbackHandle] = callback;
    return callbackHandle;
  }

  function _execute_url(url) {
    // Credit to http://stackoverflow.com/a/13176471
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute('src', url);
    document.documentElement.appendChild(iframe);
    document.documentElement.removeChild(iframe);
    iframe = null;
  }

  function _handleClientResponse(encodedCallbackHandle, status, result) {
    var callbackHandle = decodeURIComponent(encodedCallbackHandle)
    if (wand._callbacks[callbackHandle]) {
      var callback = wand._callbacks[callbackHandle]
      delete wand._callbacks[callbackHandle]
      setTimeout(function() {
        callback(status, decodeURIComponent(result))
      })
    }
  }

  function getUser(callback) {
    _execute("getUser", null, callback);
  }

  wand._handleClientResponse = _handleClientResponse
  wand.getUser = getUser
})(window, document, wand);