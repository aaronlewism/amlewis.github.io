/*
    WIP
*/
// Create wand object
(function(obj) {
    var wand = {};
    wand.enabled = false;
    obj.wand = wand
})(window);

// Initialize wand object
(function(window, document, wand) {
  function execute(url) 
  {
    // Credit to http://stackoverflow.com/a/13176471
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute('src', url);
    document.documentElement.appendChild(iframe);
    document.documentElement.removeChild(iframe);
    iframe = null;
  }

  wand.execute = execute
})(window, document, wand);

alert(14)
wand.execute("wand-client-action:blah")
alert(20)