$(document).ready(function () {
  //search button listener
  $("#searchBtn").on("click", function () {
    //get value in input.
    var searchInput = $("#searchInput").val();
    //empty input field.
    $("#searchInput").val("");
    weatherFunction(searchInput);
    weatherForecast(searchInput);
  });

  //pulls our previous searches from local storage
  var userHistory = JSON.parse(localStorage.getItem("history")) || [];

  //sets history array search the correct length
  if (userHistory.length > 0) {
    weatherFunction(userHistory[userHistory.length - 1]);
  }
  //makes a row for each element
  for (var i = 0; i < userHistory.length; i++) {
    createRow(userHistory[i]);
  }

  function weatherFunction(searchInput) {

    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=821bc241f16a1118d8b69741134d772e",


    }).then(function (data) {
      //making an if statement just in case it doesnt exisat
      if (userHistory.indexOf(searchInput) === -1) {
        userHistory.push(searchInput);
        //places input into local storage
        localStorage.setItem("userHistory", JSON.stringify(userHistory));
        createRow(searchInput);
      }
      // clearing out old content
      $("#current").empty();

      var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
      var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


      var card = $("<div>").addClass("card");
      var cardBody = $("<div>").addClass("card-body");
      var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
      var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
      var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");
      console.log(data)
      var lon = data.coord.lon;
      var lat = data.coord.lat;

    
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=821bc241f16a1118d8b69741134d772e&lat=" + lat + "&lon=" + lon,


      }).then(function (response) {
        console.log(response);

        var uvResponse = response.value;
        var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);


        if (uvResponse < 3) {
          btn.addClass("btn-success");
        } else if (uvResponse < 7) {
          btn.addClass("btn-warning");
        } else {
          btn.addClass("btn-danger");
        }

        cardBody.append(uvIndex);
        $("#current .card-body").append(uvIndex.append(btn));

      });

      // merges while adding it to our page
      title.append(img);
      cardBody.append(title, temp, humid, wind);
      card.append(cardBody);
      $("#current").append(card);
      console.log(data);
    });
  }
  // function weatherForecast(searchInput) 
  function weatherForecast(searchInput) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=821bc241f16a1118d8b69741134d772e&units=imperial",

    }).then(function (data) {
      console.log(data);
      $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

      //creates a new card for 5 days and pulls data image from search
      for (var i = 0; i < data.list.length; i++) {

        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

          var titleOutput = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
          var imgOutput = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
          var colOutput = $("<div>").addClass("col-md-2.5");
          var cardOutput = $("<div>").addClass("card bg-primary text-white");
          var cardOutput = $("<div>").addClass("card-body p-2");
          var humidOutput = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
          var tempOutput = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

          //merges everything and puts it on the page
          colOutput.append(cardOutput.append(cardOutput.append(titleOutput, imgOutput, tempOutput, humidOutput)));
          //append the card to the collumn, other elements to the body, and the body to the card
          $("#forecast .row").append(colOutput);
        }
      }
    });
  }

});