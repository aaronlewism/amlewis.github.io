/*
    WIP
*/

function execute(url) 
{
  // Credit to http://stackoverflow.com/a/13176471
  var iframe = document.createElement("IFRAME");
  iframe.style.display = "none";
  iframe.setAttribute('src', url);
  alert(12)
  document.documentElement.appendChild(iframe);
  document.documentElement.removeChild(iframe);
  iframe = null;
  alert(20)
}

execute("wand_client:blah")