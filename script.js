// --- Event Listener for Enter Key ---
function handleKeyDown(event) {
  if (event.key === "Enter") {
    getWeather();  
  }
}

// --- Function to Fetch and Display Current Weather ---
function getWeather() {
  const location = document.getElementById("location-input").value;
  const countryCode = document.getElementById("country-code").value; 
  const apiKey = 'fa7a767539fa4aceee95d83889fd1ce9'; 

  let apiUrl;
  if (location.match(/^\d+$/)) { 
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${location},${countryCode}&appid=${apiKey}&units=imperial`;
  } else {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location},${countryCode}&appid=${apiKey}&units=imperial`;
  }

  fetch(apiUrl)
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
  .then(data => {
      displayWeather(data);

      // After displaying weather, fetch and display the forecast
      const city = data.name;
      const country = data.sys.country;
      getForecast(city, country);
    })
  .catch(error => {
      document.getElementById("weather-info").innerHTML = `<p>Error: ${error.message}</p>`;
      console.error("Error fetching weather data:", error);
    });
}

// --- Function to Display Current Weather Data ---
function displayWeather(data) {
  if (!data || data.cod!== 200) {
    document.getElementById("weather-info").innerHTML = "<p>Could not retrieve weather information.</p>";
    return;
  }

  const weatherInfo = document.getElementById("weather-info");
  const temperature = data.main.temp;
  const city = data.name;
  const country = data.sys.country;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

    // Create weather summary
    let summary = "";
    if (data.weather && Array.isArray(data.weather) && data.weather.length > 0) {
        const weather = data.weather; // Access the first element of the array
        summary += weather.main; // Add the general condition (e.g., "Clouds", "Rain")
        if (weather.description) {
            summary += `: ${weather.description}`; // Add the detailed description
        }
    }
    if (data.main && data.main.temp) {
        summary += `, Temp: ${data.main.temp}°F`;
    }
    if (data.wind && data.wind.speed) {
        summary += `, Wind: ${data.wind.speed} mph`;
    }
    if (data.main && data.main.humidity) {
        summary += `, Humidity: ${data.main.humidity}%`;
    }

  weatherInfo.innerHTML = `
    <h2>${city}, ${country}</h2>
    <div class="weather-details">
      <div class="weather-detail">
        <h3>Temperature</h3>
        <p>The current temperature is ${temperature}°F.</p> 
      </div>
      <div class="weather-detail">
        <h3>Description</h3>
        <p>The weather is currently ${summary}.</p> 
      </div>
      <div class="weather-detail">
        <h3>Humidity</h3>
        <p>The humidity level is ${humidity}%, making it feel ${humidity < 50? 'relatively dry': 'quite humid'}.</p> 
      </div>
      <div class="weather-detail">
        <h3>Wind Speed</h3>
        <p>The wind is blowing at ${windSpeed} mph. ${windSpeed < 10? 'It is calm outside.': windSpeed < 30? 'There is a moderate breeze.': 'It is windy!'} </p> 
      </div>
    </div>
  `;
}

// --- Function to Fetch 5-Day/3-Hour Forecast ---
function getForecast(location, countryCode) {
    const apiKey = 'fa7a767539fa4aceee95d83889fd1ce9'; // **REPLACE WITH YOUR ACTUAL API KEY**
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location},${countryCode}&appid=${apiKey}&units=imperial&cnt=40`; // 5-day/3-hour

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(forecastData => {
            displayForecast(forecastData);
        })
        .catch(error => {
            document.getElementById("forecast-info").innerHTML = `<p>Error: ${error.message}</p>`;
            console.error("Error fetching forecast data:", error);
        });
}

// --- Function to Display 5-Day/3-Hour Forecast Data (Modified) ---
function displayForecast(forecastData) {
    const forecastInfo = document.getElementById("forecast-info");
    if (!forecastData || !forecastData.list || forecastData.cod !== "200") {
        forecastInfo.innerHTML = "<p>Could not retrieve forecast information.</p>";
        return;
    }

    let forecastHTML = "<h2>5-Day Forecast</h2>"; // Updated heading
    const dailyData = {};

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (!dailyData[day]) {
            dailyData[day] = item;
        }
    });

    for (const day in dailyData) {
        const item = dailyData[day];
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        const temp = item.main.temp;
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        forecastHTML += `
            <div class="forecast-day">
                <p>${date}</p>
                <img src="${iconUrl}" alt="${description}" class="forecast-icon">
                <p>Temp: ${temp}°F</p>
                <p>${description}</p>
            </div>
        `;
    }

    forecastInfo.innerHTML = forecastHTML;
}