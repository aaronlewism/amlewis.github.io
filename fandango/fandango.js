(function(obj) {
  var _fandango_utils = {};

  function createDivider(title) {
    var divider = $("<li></li>")
    divider.attr("data-role", "list-divider")
    divider.attr("role", "heading")
    divider.text(title)

    return divider
  }

  function createRow(image, title, description, onClickCallback) {
    var row = $("<li></li>")
    row.attr("data-icon", "false")

    var a = $("<a/>")
    a.attr("href", "#")
    a.click(onClickCallback)

    var img = $("<img/>")
    img.attr("src", image)
    img.attr("class", "list-img")
    a.append(img)

    var h2 = $("<h2></h2>")
    h2.html(title)
    a.append(h2)

    if (description) {
      var p = $("<p></p>")
      p.html(description)
      a.append(p)
    }

    row.append(a)
    return row
  }

  function createMovieCallback(movie_id) {
    return function (event) {
      _fandango_utils.movie_id = movie_id
      $.mobile.pageContainer.pagecontainer("change", "#movie")
    }
  }


  _fandango_utils.createDivider = createDivider
  _fandango_utils.createRow = createRow
  _fandango_utils.createMovieCallback = createMovieCallback

  _fandango_utils._search_counter = 0
  _fandango_utils._cur_displayed_search = -1
  _fandango_utils.movie_id = null

  obj._fandango_utils = _fandango_utils;
})(window);

$(document).on("pageinit", function () {
    $("[data-role='navbar']").navbar();
    $("[data-role='header']").toolbar();
});

// In Theaters
$(document).on("pagebeforeshow", "#inTheaters", function() {
  $("#navbar").show()
  $("#backButton").hide()
  $("#backButtonSpan").hide()
  $("#shareButton").hide()
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

          var list =$("<ul></ul>")
          list.attr("data-role", "listview")
          list.attr("data-inset", "true")
          list.attr("data-divider-theme", "a")

          if (openingMovies.length > 0) {
            list.append(_fandango_utils.createDivider("Opening This Week"))
            for (var i=0; i<openingMovies.length; i++) {
              var movie = openingMovies[i]
              list.append(_fandango_utils.createRow(
                movie.image,
                movie.title,
                movie.description,
                _fandango_utils.createMovieCallback(movie.id)))
            }
          }
          
          if (playingMovies.length > 0) {
            list.append(_fandango_utils.createDivider("Now Playing"))
            for (var i=0; i<playingMovies.length; i++) {
              var movie = playingMovies[i]
              list.append(_fandango_utils.createRow(
                movie.image,
                movie.title,
                movie.description,
                _fandango_utils.createMovieCallback(movie.id)))
            }
          }

          content.append(list)

          $.mobile.loading( "hide" )
          content.enhanceWithin()
        } else {
          var content = $("#inTheaters").find("#content")
          content.empty()

          var list =$("<ul></ul>")
          list.attr("data-role", "listview")
          list.attr("data-inset", "true")
          list.attr("data-divider-theme", "a")


          list.append(_fandango_utils.createDivider("Opening This Week"))
          list.append(_fandango_utils.createRow(
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
$(document).on("pagebeforeshow", "#comingSoon", function() {
  $("#navbar").show()
  $("#backButton").hide()
  $("#backButtonSpan").hide()
  $("#shareButton").hide()
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

          var list =$("<ul></ul>")
          list.attr("data-role", "listview")
          list.attr("data-inset", "true")
          list.attr("data-divider-theme", "a")

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
                list.append(_fandango_utils.createDivider(title))
              }
              var description = movie.description
              if (curWeekStart < Date.now()) {
                description += "<br> Opens " + weekday[movie.time.getDay()] 
              }
              list.append(_fandango_utils.createRow(
                movie.image,
                movie.title,
                description,
                _fandango_utils.createMovieCallback(movie.id)))
            }
          }
          
          content.append(list)

          $.mobile.loading( "hide" )
          content.enhanceWithin()
        } else {
          var content = $("#comingSoon").find("#content")
          content.empty()

          var list =$("<ul></ul>")
          list.attr("data-role", "listview")
          list.attr("data-inset", "true")
          list.attr("data-divider-theme", "a")


          list.append(_fandango_utils.createDivider("Opening This Week"))
          list.append(_fandango_utils.createRow(
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
$(document).on("pagebeforeshow", "#search", function() {
  $("#navbar").show()
  $("#backButton").hide()
  $("#backButtonSpan").hide()
  $("#shareButton").hide()
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

            var list =$("<ul></ul>")
            list.attr("data-role", "listview")
            list.attr("data-inset", "true")
            list.attr("data-divider-theme", "a")

            for (var i=0; i<movieDescriptions.length; i++) {
              var movie = movieDescriptions[i]
              list.append(_fandango_utils.createRow(
                movie.image,
                movie.title,
                movie.description,
                _fandango_utils.createMovieCallback(movie.id)))
            }

            content.append(list)

            $.mobile.loading( "hide" )
            content.enhanceWithin()
          } else if (searchId > _fandango_utils._cur_displayed_search) {
            _fandango_utils._cur_displayed_search = searchId
            var content = $("#search").find("#results")
            content.empty()

            var list =$("<ul></ul>")
            list.attr("data-role", "listview")
            list.attr("data-inset", "true")
            list.attr("data-divider-theme", "a")

            list.append(_fandango_utils.createRow(
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

// Movie page
$(document).on("pagebeforeshow", "#movie", function() {
  $("#navbar").hide()
  $("#backButton").show()
  $("#backButtonSpan").show()
  $("#shareButton").show()

  $("#shareButton").click("")
  var movieId = _fandango_utils.movie_id

  var content = $("#movie").find("#content")
  content.empty()
  content.enhanceWithin()

  $("#movieMain").hide()

  var interval = setInterval(function(){
    $.mobile.loading('show');
    clearInterval(interval);
  },1); 

  setTimeout(function() {
      wand.httpRequest(
        {
          "url": "http://www.fandango.com/" + movieId.replace('-', '_') + "/movieoverview"
        },
        function (status, result) {
          if (status === 200 && result.status === 200 && movieId === _fandango_utils.movie_id) {

            var body = document.createElement('html');
            body.innerHTML = result.body

            var movie = $("[itemtype=\"http://schema.org/Movie\"]", body)
            var trailer = movie.find("[itemprop=\"trailer\"]")
            var actors = movie.find("[itemprop=\"actor\"]")
            var directors = movie.find("[itemprop=\"director\"]")
            var movieDetails = $(".movie-detail", body)

            var desc = ""
            if (actors.length > 0) {
              if (actors.length >= 2) {
                desc = actors.children("[itemprop=\"name\"]").attr("content") + ", " +
                    actors.next().children("[itemprop=\"name\"]").attr("content") 
              } else {
                desc = actors.children("[itemprop=\"name\"]").attr("content")
              }
            }

            if (desc) {
              desc += "<br/>"
            }
            desc += movieDetails.find(".movie-rating").text()

            if (desc) {
              desc += "<br/>"
            }
            desc += movieDetails.find(".movie-genre").text().replace("<br>", ", ")

            var smartMovie = {}
            smartMovie.meta = {}
            smartMovie.meta["@"] = "movie"
            smartMovie.meta.url = movie.children("[itemprop=\"url\"]").attr("content")
            smartMovie.meta.icon = movie.children("[itemprop=\"icon\"]").attr("content")

            smartMovie.title = movie.children("[itemprop=\"name\"]").attr("content")
            smartMovie.synopsis = movie.children("[itemprop=\"description\"]").attr("content")
            smartMovie.maturity_rating = movie.children("[itemprop=\"contentRating\"]").attr("content")

            if (directors.length > 0) {
              smartMovie.directors = []
              directors.each(function (index) {
                var smartDirector = {}
                smartDirector.meta = {}
                smartDirector.meta["@"] = "person"
                smartDirector.meta.url = $(this).children("[itemprop=\"url\"]").attr("content")
                smartDirector.meta.icon = $(this).children("[itemprop=\"image\"]").attr("content")
                smartDirector.name =  $(this).children("[itemprop=\"name\"]").attr("content")
                smartMovie.directors.push(smartDirector)
              })
            }

            if (actors.length > 0) {
              smartMovie.actors = []
              directors.each(function (index) {
                var smartActor = {}
                smartActor.meta = {}
                smartActor.meta["@"] = "person"
                smartActor.meta.url = $(this).children("[itemprop=\"url\"]").attr("content")
                smartActor.meta.icon = $(this).children("[itemprop=\"image\"]").attr("content")
                smartActor.name =  $(this).children("[itemprop=\"name\"]").attr("content")
                smartMovie.actors.push(smartActor)
              })
            }


            $("#movie").find("#title").text(smartMovie.title)
            $("#movie").find("#videoThumb").attr("src", trailer.children("[itemprop=\"thumbnailUrl\"]").attr("content"))
            $("#movie").find("#desc").html(desc)
            $("#movie").find("#summary").text(smartMovie.synopsis)

            var content = $("#movie").find("#content")
            content.empty()

            var list =$("<ul></ul>")
            list.attr("data-role", "listview")
            list.attr("data-inset", "true")
            list.attr("data-divider-theme", "a")

            if (smartMovie.directors) {
              list.append(_fandango_utils.createDivider("Director"))
              for (var index=0; index < smartMovie.directors.length; ++index) {
                var director = smartMovie.directors[index]
                var image = director.meta.icon
                if (!image) {
                  image =  "http://images.fandango.com/r99.5/redesign/static/img/no-image-portrait.png"
                }
                list.append(_fandango_utils.createRow(
                  image,
                  director.title,
                  "",
                  function() { wand.handleTypedData(director, null) }))
              }
            }

            if (smartMovie.actors) {
              list.append(_fandango_utils.createDivider("Cast"))
              for (var index=0; index < smartMovie.actors.length; ++index) {
                var actor = smartMovie.actors[index]
                var image = actor.meta.icon
                if (!image) {
                  image =  "http://images.fandango.com/r99.5/redesign/static/img/no-image-portrait.png"
                }
                list.append(_fandango_utils.createRow(
                  image,
                  actor.title,
                  "",
                  function() { wand.handleTypedData(actor, null) }))
              }
            }

            content.append(list)

            $("#shareButton").click(function() { wand.handleTypedData(smartMovie, null) })

            $.mobile.loading( "hide" )
            $("#movieMain").show()
            content.enhanceWithin()
          } else if ( movieId === _fandango_utils.movie_id) {
            var content = $("#movie").find("#content")
            content.empty()

            var list =$("<ul></ul>")
            list.attr("data-role", "listview")
            list.attr("data-inset", "true")
            list.attr("data-divider-theme", "a")

            list.append(_fandango_utils.createRow(
              "",
              movieId,
              "Errors happened",
              ""))

            content.append(list)

            $.mobile.loading( "hide" )
            $("#movieMain").show()
            content.enhanceWithin()
          }
        }
      )
    }
  )
})

// Keep proper tab selected
$( document ).on( "pagecontainerchange", function() {
      var current = $( ".ui-page-active" ).jqmData( "title" );

      if (current !== "Movie") {
        $( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
        // Add active class to current nav button
        $( "[data-role='navbar'] a" ).each(function() {
          if ( $( this ).text() === current ) {
            $( this ).addClass( "ui-btn-active" );
          }
        });
      }
    });