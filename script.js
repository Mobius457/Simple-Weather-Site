const citySelect = document.getElementById('citySelect');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherInfo = document.getElementById('weatherInfo');

const API_KEY = 'd0c17489a6e7005c6839ae1e9d382d21'; 

getWeatherBtn.addEventListener('click', () => {
    const selectedCity = citySelect.value;
    getWeather(selectedCity);
});

async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`; // Example API URL

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherInfo.innerHTML = "<p>Error fetching weather data. Please try again later.</p>";
    }
}

function displayWeather(data) {
  if (!data || !data.list || data.list.length === 0) {
      weatherInfo.innerHTML = "<p>No forecast data available.</p>";
      return;
  }

    let weatherHTML = "<h2>" + data.city.name + "</h2>";
    weatherHTML += "<p>Current Temperature: " + data.list[0].main.temp + "°C</p>"; // Example

    weatherHTML += "<h3>7-Day Forecast</h3><ul>";
    for (let i = 0; i < data.list.length; i += 8) { // Data every 3 hours, so increment by 8 for daily
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000); // Convert timestamp to date
        weatherHTML += "<li>" + date.toLocaleDateString() + ": " + forecast.main.temp + "°C, " + forecast.weather[0].description + "</li>";
    }
    weatherHTML += "</ul>";

    weatherInfo.innerHTML = weatherHTML;
}