const apikey = "af2784a6794b62b1e1ddcf2dccf9e65d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const unsplashKey = "CdziB3spStBik3DoIPmgXOMGsTGG1GV1qFWP9ZjgeGI";

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

// 🌄 Set Unsplash background based on weather
async function setWeatherBackground(city, weatherMain) {
  const query = `${weatherMain} in ${city}`;
  const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${unsplashKey}&orientation=landscape`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data?.urls?.full) {
      document.body.style.backgroundImage = `url(${data.urls.full})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  } catch (error) {
    console.error("Failed to fetch Unsplash image", error);
    document.body.style.backgroundImage = "url('fallback.jpg')";
  }
}

// ☀️🌙 Set time-based background
function applyTimeBasedBackground() {
  const hour = new Date().getHours();
  document.body.classList.remove("day-mode", "night-mode");

  if (!document.body.classList.contains("dark-mode")) {
    if (hour >= 6 && hour < 18) {
      document.body.classList.add("day-mode");
    } else {
      document.body.classList.add("night-mode");
    }
  }
}

// 📜 Display search history
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

// 🔁 Update search history
function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    if (searchHistory.length > 5) searchHistory.shift();
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
    displayHistory();
  }
}

// 🌦️ Main weather fetch
async function checkWeather(city) {
  if (city.trim() === "") {
    alert("Please enter a city name!");
    return;
  }

  try {
    const response = await fetch(apiUrl + city + `&appid=${apikey}`);
    if (!response.ok) throw new Error("Invalid city name!");

    const data = await response.json();

    // 🧊 Update UI with weather data
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    weatherIcon.src = weatherImages[data.weather[0].main] || "default.png";

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";

    updateSearchHistory(data.name);

    // ⛅ Update background
    await setWeatherBackground(data.name, data.weather[0].main);

    // ✅ Hide theme toggle after a valid search
    toggleThemeBtn.style.display = "none";

  } catch (error) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

// 🗑️ Clear history
function clearHistory() {
  searchHistory = [];
  localStorage.removeItem("weatherHistory");
  displayHistory();
}

// 🌗 Toggle theme
toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (isDark) {
    document.body.classList.remove("day-mode", "night-mode");
  } else {
    applyTimeBasedBackground();
  }
});

// 🔍 Search event
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
  searchBox.value = "";
});

// 🚮 Clear history button
clearHistoryBtn.addEventListener("click", clearHistory);

// 📦 Load on startup
window.addEventListener("load", () => {
  displayHistory();

  const savedTheme = localStorage.getItem("theme");

  if (!savedTheme) {
    // First-time visitor, apply time-based background
    applyTimeBasedBackground();
    localStorage.setItem("theme", "light");
  } else if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    applyTimeBasedBackground();
  }
});

// 📱 Toggle history (mobile support)
const toggleHistoryBtn = document.getElementById("toggle-history-btn");
const historyContainer = document.querySelector(".history-container");

if (toggleHistoryBtn) {
  toggleHistoryBtn.addEventListener("click", () => {
    historyContainer.classList.toggle("show");
  });
}

