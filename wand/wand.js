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
  function execute(method, args, callback) {
    url = "wand-client-action://" + method + ";callback=aha";
    if (args) {
      url += "?args=" + encodeURIComponent(JSON.stringify(args));
    }
    execute_url(url);
  }

  function execute_url(url) {
    // Credit to http://stackoverflow.com/a/13176471
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute('src', url);
    document.documentElement.appendChild(iframe);
    document.documentElement.removeChild(iframe);
    iframe = null;
  }

  wand.getUser = function(callback) {
    execute("getUser", null, callback);
  }
})(window, document, wand);