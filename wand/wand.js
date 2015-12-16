/*
    WIP
*/
(function(obj) {
    var wand = {};
    a.enabled = false;
    obj.wand = wand
})(window);
(function(window, document, wand) {
  function execute(url) 
  {
    // Credit to http://stackoverflow.com/a/13176471
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute('src', url);
    alert(13)
    document.documentElement.appendChild(iframe);
    document.documentElement.removeChild(iframe);
    iframe = null;
    alert(20)
  }

  wand.execute = execute
})(window, document, wand);

wand.execute("wand-client-action:blah")