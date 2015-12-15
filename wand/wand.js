/*
    WIP
*/

function execute(url) 
{
  // Credit to http://stackoverflow.com/a/13176471
  var iframe = document.createElement("IFRAME");
  iframe.style.display = "none";
  iframe..src = url;
  document.documentElement.appendChild(iframe);
  document.documentElement.removeChild(iframe);
  iframe = null;
}

window.alert(5 + 6);