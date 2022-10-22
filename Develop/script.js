const APIKey = "d8c43ebfa45c5f82ce5ff59666802f19"
var city = '';

// What happens when we click search after putting exact city name?

// Clicking search button runs the below function
document.getElementById("search").addEventListener("click", cityFinder);

function cityFinder() {
    city = document.getElementById("citySearch").value;

    citySearchResults();
}

function citySearchResults() {
    saveSearch(city);

    searchHistory();

    console.log(city);


    var queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;

    fetch(queryURL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            console.log(data[0].lat);
            console.log(data[0].lon);
//------------------------------------------------------------------//
        
            var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
            fetch(weatherURL)
                .then((response) => response.json())
                .then((data) => {

                    console.log(data);

                    // Todays Weather
                    document.getElementById("selectedCity").innerText = city.toUpperCase();

                    var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                    document.getElementById("icon").src = iconUrl;

                    document.getElementById("currentDate").innerText = moment(new Date()).format("MM/DD/YYYY");
                    
                    //-------------------------------------------------------------------
                    
                    document.getElementById("fahrenheit").innerText = data.current.temp + " °F";
                    document.getElementById("mph").innerText = data.current.wind_speed + " MPH";
                    document.getElementById("percent").innerText = data.current.humidity + " %";
                    document.getElementById("decimal").innerText = data.current.uvi;

                    uvColor(data.current.uvi);

                    // 5 Day Weather

                    for (i = 1; i < 6; i++) {
                        var date = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
                        var iconUrl = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
                        const y = createWeeklyForecast(date, iconUrl, data.daily[i].temp.day, data.daily[i].wind_speed, data.daily[i].humidity);
                        document.getElementById("day" + i).innerHTML = "";
                        document.getElementById("day" + i).appendChild(y);
                    }

                });
        });
}

// -------------------------
function createWeeklyForecast(date, icon, temp, wind, humidity) {

    const ul = document.createElement("ul");
    ul.classList.add("forecast");
    const liDate = document.createElement("li");
    const liIcon = document.createElement("img");
    const liTemp = document.createElement("li");
    const liWind = document.createElement("li");
    const liHumidity = document.createElement("li");

    liDate.innerText = date;
    liIcon.setAttribute("src", icon);
    liTemp.innerText = "Temp: " + temp + " °F";
    liWind.innerText = "Wind: " + wind + " MPH";
    liHumidity.innerText = "Humidity: " + humidity + " %";

    ul.appendChild(liDate);
    ul.appendChild(liIcon);
    ul.appendChild(liTemp);
    ul.appendChild(liWind);
    ul.appendChild(liHumidity);

    return ul;
}

// -----------------------------------------
function saveSearch(city) {
    var history = JSON.parse(localStorage.getItem("history"));
    if (history == null) {
        history = [];
    }
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));

}

// -------------------------------------------
function searchHistory() {
    document.getElementById("searchHistory").innerHTML = "";
    var searchArray = JSON.parse(localStorage.getItem("history"));
    if (searchArray == null) {
        searchArray = [];
    }
    for (let i = 0; i < searchArray.length; i++) {
        const pastCity = document.createElement("button");
        pastCity.innerText = searchArray[i];
        document.getElementById("searchHistory").appendChild(pastCity);
        pastCity.addEventListener("click", (event) => {
            // tutor taught me this cool button calling itself
            console.log(event.target.innerText);
            city = event.target.innerText;
            // this is the input being searched
            citySearchResults();
        })
    }
    console.log(searchArray);
}

// ------------------------------------------------------
function uvColor(z) {
    if (z > 5) {
        decimal.style.backgroundColor = "red";
    } else if (z >= 3 && decimal <= 5) {
        decimal.style.backgroundColor = "yellow";
    } else {
        decimal.style.backgroundColor = "green";
    };
}