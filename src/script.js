city.addEventListener("keypress",(event)=>{
    if(event.key==="Enter"){
        getCityName();
    }
});

const loading = document.getElementById("loading");
const searchButton = document.getElementById("searchButton");

function showLoading() {
    loading.style.display = "block";
    searchButton.disabled = true;
    searchButton.innerText = "🔄 Fetching...";
}

function hideLoading() {
    loading.style.display = "none";
    searchButton.disabled = false;
    searchButton.innerText = "CHECK WEATHER";
}

function getCityName(){
    let cityName = document.getElementById("city").value.trim();
    
    if(cityName == ""){
        alert("Please enter a city.");
        return;
    }
    
    showLoading();
    
    getCoordinates(cityName);
    
}

async function getCoordinates(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const cityCoordinates = await response.json();
    
    if (!cityCoordinates.results || cityCoordinates.results.length === 0) {
        alert("City not found");
        return;
    }

    document.getElementById("cityName").innerText = cityCoordinates.results[0].name;

    getWeatherDetails(cityCoordinates);

  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

async function getWeatherDetails(cityCoordinates){
    try {
        const cityDetails = cityCoordinates.results[0];
        const latitude = cityDetails.latitude;
        const longitude = cityDetails.longitude;

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=temperature_2m,apparent_temperature,relative_humidity_2m,rain,wind_speed_10m,visibility,cloud_cover,weather_code,surface_pressure,precipitation`;

        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const weatherDetails = await response.json();

        const weather = {
            city: cityDetails.name,
            temperature: weatherDetails.current.temperature_2m,
            feelsLike: weatherDetails.current.apparent_temperature,
            humidity: weatherDetails.current.relative_humidity_2m,
            rain: weatherDetails.current.rain,
            windSpeed: weatherDetails.current.wind_speed_10m,
            visibility: weatherDetails.current.visibility,
            cloudCover: weatherDetails.current.cloud_cover,
            pressure: weatherDetails.current.surface_pressure,
            precipitation: weatherDetails.current.precipitation,
            weatherCode: weatherDetails.current.weather_code,

            temperature_unit: weatherDetails.current_units.temperature_2m,
            feelsLike_unit: weatherDetails.current_units.apparent_temperature,
            humidity_unit: weatherDetails.current_units.relative_humidity_2m,
            rain_unit: weatherDetails.current_units.rain,
            windSpeed_unit: weatherDetails.current_units.wind_speed_10m,
            visibility_unit: weatherDetails.current_units.visibility,
            cloudCover_unit: weatherDetails.current_units.cloud_cover,
            pressure_unit: weatherDetails.current_units.surface_pressure,
            precipitation_unit: weatherDetails.current_units.precipitation,
        };

        displayWeather(weather);

    } catch(error){

        console.error("Fetch failed:", error);

    } finally {
        
        hideLoading();
        
    }

}

function  displayWeather(weather){
    document.getElementById('weatherCard').style.display = "block";

    document.getElementById('temperature').innerText = `${weather.temperature} ${weather.temperature_unit}`;
    document.getElementById('feelsLike').innerText = `${weather.feelsLike} ${weather.feelsLike_unit}`;
    document.getElementById('humidity').innerText = `${weather.humidity} ${weather.humidity_unit}`;
    document.getElementById('windSpeed').innerText = `${weather.windSpeed} ${weather.windSpeed_unit}`;
    document.getElementById('visibility').innerText = `${weather.visibility} ${weather.visibility_unit}`;
    document.getElementById('cloudCover').innerText = `${weather.cloudCover} ${weather.cloudCover_unit}`;
    document.getElementById('pressure').innerText = `${weather.pressure} ${weather.pressure_unit}`;
    document.getElementById('precipitation').innerText = `${weather.precipitation} ${weather.precipitation_unit}`;
    document.getElementById('rain').innerText = `${weather.rain} ${weather.rain_unit}`;

    const weatherMap={
        0:{icon:"☀️",text:"Clear Sky"},
        1:{icon:"🌤️",text:"Mainly Clear"},
        2:{icon:"⛅",text:"Partly Cloudy"},
        3:{icon:"☁️",text:"Overcast"},
        45:{icon:"🌫️",text:"Fog"},
        61:{icon:"🌧️",text:"Rain"},
        71:{icon:"❄️",text:"Snow"},
        95:{icon:"⛈️",text:"Thunderstorm"}
    };

    const currentWeather = weatherMap[weather.weatherCode] || {icon:"🌍",text:"Unknown"};

    document.getElementById("weatherIcon").innerText=currentWeather.icon;
    document.getElementById("weatherDescription").innerText=currentWeather.text;
    
}
