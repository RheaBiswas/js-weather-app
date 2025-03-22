const apikey = "af2784a6794b62b1e1ddcf2dccf9e65d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-Icon");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const toggleThemeBtn = document.getElementById("toggle-theme");

const weatherImages = {
  "Clouds": "clouds.png",
  "Clear": "clear.png",
  "Rain": "rain.png",
  "Drizzle": "drizzle.png",
  "Mist": "mist.png",
  "Snow": "snow.png",
};


let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];


function displayHistory() {
  historyList.innerHTML = "";
  searchHistory.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => checkWeather(city));
    historyList.appendChild(li);
  });

  clearHistoryBtn.style.display = searchHistory.length > 0 ? "block" : "none";
}


function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    if (searchHistory.length > 5) searchHistory.shift(); // Keep only the last 5 searches
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
    displayHistory();
  }
}


async function checkWeather(city) {
  if (city.trim() === "") {
    alert("Please enter a city name!");
    return;
  }

  try {
    const response = await fetch(apiUrl + city + `&appid=${apikey}`);

    if (!response.ok) throw new Error("Invalid city name!");

    const data = await response.json();


    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    weatherIcon.src = weatherImages[data.weather[0].main] || "default.png";

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";

    updateSearchHistory(data.name);
  } catch (error) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}


function clearHistory() {
  searchHistory = [];
  localStorage.removeItem("weatherHistory");
  displayHistory();
}


toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});


searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
  searchBox.value = "";
});
clearHistoryBtn.addEventListener("click", clearHistory);


window.addEventListener("load", () => {
  displayHistory();
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});
