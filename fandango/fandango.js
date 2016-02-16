(function(obj) {
  var _fandango_utils = {};

  function createDivider(title) {
    var divider = document.createElement("li")
    divider.setAttribute("data-role", "list-divider")
    divider.setAttribute("role", "heading")
    divider.textContent = title

    return divider
  }

  function createRow(image, title, description, onClickCallback) {
    var row = document.createElement("li")
    row.setAttribute("data-icon", "false")

    var a = document.createElement("a")
    a.setAttribute("onclick", onClickCallback)

    var img = document.createElement("img")
    img.setAttribute("src", image)
    a.appendChild(img)

    var h2 = document.createElement("h2")
    h2.innerHTML = title
    a.appendChild(h2)

    var p = document.createElement("p")
    p.innerHTML = description
    a.appendChild(p)

    row.appendChild(a)

    return row
  }


  _fandango_utils.createDivider = createDivider
  _fandango_utils.createRow = createRow

  obj._fandango_utils = _fandango_utils;
})(window);

$(document).on("pageinit", function () {
    $("[data-role='navbar']").navbar();
    $("[data-role='header']").toolbar();
});

// In Theaters
$(document).on('pagebeforecreate', '#inTheaters', function() {

  wand.httpRequest(
    {
      "url": "http://mobile.fandango.com/movies-in-theaters"
    },
    function (status, result) {
      alert(status + " " + result['status'])
      if (status === 200 && result['status'] === 200) {
        var content = $("#inTheaters").find("#content")
        content.empty()

        var p = document.createElement("p")
        p.textContent = result['body']
        content.append(p)

        $("#inTheaters").enhanceWithin()
      } else {
        var content = $("#inTheaters").find("#content")
        content.empty()

        var list = document.createElement("ul")
        list.setAttribute("data-role", "listview")
        list.setAttribute("data-inset", "true")
        list.setAttribute("data-divider-theme", "a")


        list.appendChild(_fandango_utils.createDivider("Opening This Week"))
        list.appendChild(_fandango_utils.createRow(
          "http://demos.jquerymobile.com/1.4.0/_assets/img/album-bb.jpg",
          "ERROR LOADING",
          "Errors happened",
          ""))

        content.append(list)
        $("#inTheaters").enhanceWithin()
      }
    }
  )

  var content = $("#inTheaters").find("#content")
  content.empty()

  var list = document.createElement("ul")
  list.setAttribute("data-role", "listview")
  list.setAttribute("data-inset", "true")
  list.setAttribute("data-divider-theme", "a")


  list.appendChild(_fandango_utils.createDivider("Opening This Week"))
  list.appendChild(_fandango_utils.createRow(
    "http://demos.jquerymobile.com/1.4.0/_assets/img/album-bb.jpg",
    "LOADING",
    "Loading some shit",
    ""))

  content.append(list)
})

// Coming Soon
$(document).on('pagebeforecreate', '#comingSoon', function() {
  var content =  $("#comingSoon").find("#content")
  content.empty()

  var list = document.createElement("ul")
  list.setAttribute("data-role", "listview")
  list.setAttribute("data-inset", "true")
  list.setAttribute("data-divider-theme", "a")


  list.appendChild(_fandango_utils.createDivider("Opening This Week"))
  list.appendChild(_fandango_utils.createRow(
    "http://demos.jquerymobile.com/1.4.0/_assets/img/album-bb.jpg",
    "Ford",
    "American Car Company",
    ""))

  content.append(list)
})

// Search
$(document).on('pagebeforecreate', '#search', function() {
  var content =  $("#search").find("#content")
  content.empty()

  var list = document.createElement("ul")
  list.setAttribute("data-role", "listview")
  list.setAttribute("data-inset", "true")
  list.setAttribute("data-divider-theme", "a")


  list.appendChild(_fandango_utils.createDivider("Opening This Week"))
  list.appendChild(_fandango_utils.createRow(
    "http://demos.jquerymobile.com/1.4.0/_assets/img/album-bb.jpg",
    "Toyota",
    "Car Company",
    ""))

  content.append(list)
})

// Keep proper tab selected
$( document ).on( "pagecontainerchange", function() {
      var current = $( ".ui-page-active" ).jqmData( "title" );
      $( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
      // Add active class to current nav button
      $( "[data-role='navbar'] a" ).each(function() {
        if ( $( this ).text() === current ) {
          $( this ).addClass( "ui-btn-active" );
        }
      });
    });