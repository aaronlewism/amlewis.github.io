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

  _fandango_utils._search_counter = 0
  _fandango_utils._cur_displayed_search = -1

  obj._fandango_utils = _fandango_utils;
})(window);

$(document).on("pageinit", function () {
    $("[data-role='navbar']").navbar();
    $("[data-role='header']").toolbar();
});

// In Theaters
$(document).on("pageload", "#inTheaters", function() {
  $("#navbar").show(0)
  $("#backButton").hide(0)
  $("#header").enhanceWithin()
})

$(document).on('pagebeforecreate', '#inTheaters', function() {
  var interval = setInterval(function(){
      $.mobile.loading('show');
      clearInterval(interval);
  },1); 

  setTimeout(function() {
    wand.httpRequest(
      {
        "url": "http://mobile.fandango.com/movies-in-theaters"
      },
      function (status, result) {
        if (status === 200 && result.status === 200) {
          var body = document.createElement( 'html' );
          body.innerHTML = result.body

          var movies = $("#items-container", body).children("li").filter(".content-item")
          var openingMovies = []
          var playingMovies = []

          movies.each(function (index, element) {
            var movie = $(element)
            var movieData = {}

            var link = movie.find("a").attr("href")
            movieData.id = link.split('/')[3]
            
            var movieTitle = movie.find(".content-title")
            movieData.title = movieTitle.text()

            var movieDescription = movieTitle.next()
            movieData.description = movieDescription.html().replace(/(<br>\s*)+$/, '')

            movieData.image = movie.find("img").first().attr("src")

            var upcoming = movie.find(".upcoming-opening").first()
            if (upcoming.length != 0) {
              movieData.description += "<br> " + upcoming.text()
              openingMovies.push(movieData)
            } else {
              playingMovies.push(movieData)
            }
          })
          
          var content = $("#inTheaters").find("#content")
          content.empty()

          var list = document.createElement("ul")
          list.setAttribute("data-role", "listview")
          list.setAttribute("data-inset", "true")
          list.setAttribute("data-divider-theme", "a")

          if (openingMovies.length > 0) {
            list.appendChild(_fandango_utils.createDivider("Opening This Week"))
            for (var i=0; i<openingMovies.length; i++) {
              var movie = openingMovies[i]
              list.appendChild(_fandango_utils.createRow(
                movie.image,
                movie.title,
                movie.description,
                ""))
            }
          }
          
          if (playingMovies.length > 0) {
            list.appendChild(_fandango_utils.createDivider("Now Playing"))
            for (var i=0; i<playingMovies.length; i++) {
              var movie = playingMovies[i]
              list.appendChild(_fandango_utils.createRow(
                movie.image,
                movie.title,
                movie.description,
                ""))
            }
          }

          content.append(list)

          $.mobile.loading( "hide" )
          content.enhanceWithin()
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

          $.mobile.loading( "hide" )
          content.enhanceWithin()
        }
      }
    )
  }, 0)
})

// Coming Soon
$(document).on("pageload", "#comingSoon", function() {
  $("#navbar").show(0)
  $("#backButton").hide(0)
  $("#header").enhanceWithin()
})

$(document).on('pagebeforecreate', '#comingSoon', function() {
  var interval = setInterval(function(){
      $.mobile.loading('show');
      clearInterval(interval);
  },1);   

  setTimeout(function() {
    wand.httpRequest(
      {
        "url": "http://mobile.fandango.com/movies-coming-soon"
      },
      function (status, result) {
        if (status === 200 && result.status === 200) {
          var body = document.createElement( 'html' );
          body.innerHTML = result.body

          var movies = $("#items-container", body).children("li").filter(".content-item")
          var movieDescriptions = []

          movies.each(function (index, element) {
            var movie = $(element)
            var movieData = {}
            
            var link = movie.find("a").attr("href")
            movieData.id = link.split('/')[3]

            var movieTitle = movie.find(".content-title")
            movieData.title = movieTitle.text()

            var movieDescription = movieTitle.next()
            movieData.description = movieDescription.html().replace(/(<br>\s*)+$/, '')

            movieData.image = movie.find("img").first().attr("src")

            var upcoming = movie.find(".upcoming-opening").first()
            movieData.time = new Date(Date.parse(upcoming.text().substring(6)))
            movieDescriptions.push(movieData)
          })
          
          var content = $("#comingSoon").find("#content")
          content.empty()

          var list = document.createElement("ul")
          list.setAttribute("data-role", "listview")
          list.setAttribute("data-inset", "true")
          list.setAttribute("data-divider-theme", "a")

          function getWeekStart(dateUTC) {
            var date = new Date(dateUTC)
            var msInDay = (24 * 60 * 60 * 1000)
            var start = date - date.getDay() * msInDay
            return Math.floor(start / (msInDay)) * msInDay
          }

          var weekday = new Array(7);
          weekday[0]=  "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";

          var curWeekStart = 0;
          if (movieDescriptions.length > 0) {
            for (var i=0; i<movieDescriptions.length; i++) {
              var movie = movieDescriptions[i]
              var start = getWeekStart(movie.time)
              if (start != curWeekStart) {
                curWeekStart = start
                var curWeekEnd = curWeekStart + 6 * 24 * 60 * 60 * 1000
                var curWeekStartStr = new Date(curWeekStart).toDateString().split(' ').slice(1,3).join(' ')
                var curWeekEndStr = new Date(curWeekEnd).toDateString().split(' ').slice(1,3).join(' ')
                var title = "Week of " + curWeekStartStr + ' - ' + curWeekEndStr
                list.appendChild(_fandango_utils.createDivider(title))
              }
              var description = movie.description
              if (curWeekStart < Date.now()) {
                description += "<br> Opens " + weekday[movie.time.getDay()] 
              }
              list.appendChild(_fandango_utils.createRow(
                movie.image,
                movie.title,
                description,
                ""))
            }
          }
          
          content.append(list)

          $.mobile.loading( "hide" )
          content.enhanceWithin()
        } else {
          var content = $("#comingSoon").find("#content")
          content.empty()

          var list = document.createElement("ul")
          list.setAttribute("data-role", "listview")
          list.setAttribute("data-inset", "true")
          list.setAttribute("data-divider-theme", "a")


          list.appendChild(_fandango_utils.createDivider("Opening This Week"))
          list.appendChild(_fandango_utils.createRow(
            "",
            "ERROR LOADING",
            "Errors happened",
            ""))

          content.append(list)

          $.mobile.loading( "hide" )
          content.enhanceWithin()
        }
      }
    )
  }, 0)
})

// Search
$(document).on("pageload", "#search", function() {
  $("#navbar").hide(0)
  $("#backButton").show(0)
  $("#header").enhanceWithin()
})

$(document).on("keyup", "#search-query", function() {
  var query = $('#search-query').val()
  var searchId = _fandango_utils._search_counter++

  if (query === "") {
     _fandango_utils._cur_displayed_search = searchId
     var content = $("#search").find("#results")

     content.empty()

     content.enhanceWithin()
  } else {
    var content = $("#search").find("#results")
    if (content.length === 0) {
      var interval = setInterval(function(){
        $.mobile.loading('show');
        clearInterval(interval);
      },1); 
    }
    setTimeout(function() {
      wand.httpRequest(
        {
          "url": "http://mobile.fandango.com/Home/SearchLazyLoad?show=SearchMovies&query=" + encodeURIComponent(query)
        },
        function (status, result) {
          if (status === 200 && result.status === 200 && searchId > _fandango_utils._cur_displayed_search) {
            _fandango_utils._cur_displayed_search = searchId

            var body = document.createElement( 'html' );
            body.innerHTML = result.body

            var movies = $("#items-container", body).children("li").filter(".content-item")
            var movieDescriptions = []

            movies.each(function (index, element) {
              var movie = $(element)
              var movieData = {}

              var link = movie.find("a").attr("href")
              movieData.id = link.split('/')[3]
              
              var movieTitle = movie.find(".content-title")
              movieData.title = movieTitle.text()

              var movieDescription = movieTitle.next()
              movieData.description = movieDescription.html().replace(/(<br>\s*)+$/, '')

              movieData.image = movie.find("img").first().attr("src")
              movieDescriptions.push(movieData)
            })


            var content = $("#search").find("#results")
            content.empty()

            var list = document.createElement("ul")
            list.setAttribute("data-role", "listview")
            list.setAttribute("data-inset", "true")
            list.setAttribute("data-divider-theme", "a")

            for (var i=0; i<movieDescriptions.length; i++) {
              var movie = movieDescriptions[i]
              list.appendChild(_fandango_utils.createRow(
                movie.image,
                movie.title,
                movie.description,
                ""))
            }

            content.append(list)

            $.mobile.loading( "hide" )
            content.enhanceWithin()
          } else if (searchId > _fandango_utils._cur_displayed_search) {
            _fandango_utils._cur_displayed_search = searchId
            var content = $("#search").find("#results")
            content.empty()

            var list = document.createElement("ul")
            list.setAttribute("data-role", "listview")
            list.setAttribute("data-inset", "true")
            list.setAttribute("data-divider-theme", "a")

            list.appendChild(_fandango_utils.createRow(
              "",
              "ERROR LOADING",
              "Errors happened",
              ""))

            content.append(list)

            $.mobile.loading( "hide" )
            content.enhanceWithin()
          }
        }
      )
    }, 0)
  }
});

// Keep proper tab selected
$( document ).on( "pagecontainerchange", function() {
      var current = $( ".ui-page-active" ).jqmData( "title" );

      if (current === "Search") {
        $("#navbar").hide()
        $("#backButton").show()
        $("#header").enhanceWithin()
      } else {
        $("#navbar").show()
        $("#backButton").hide()
        $("#header").enhanceWithin()

        $( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
        // Add active class to current nav button
        $( "[data-role='navbar'] a" ).each(function() {
          if ( $( this ).text() === current ) {
            $( this ).addClass( "ui-btn-active" );
          }
        });
      } 
    });