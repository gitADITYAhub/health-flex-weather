
import "./App.css";
import { useState } from "react";

// Update the API configuration
const api = {
  key: "LiNyItOYJLm9NxC3w7sR5QwQB57nH70m", // Ensure you replace this with your actual API key
  baseRealtime: "https://api.tomorrow.io/v4/weather/realtime",
  baseForecast: "https://api.tomorrow.io/v4/weather/forecast",
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPressed = () => {
    setLoading(true);
    setError("");
    fetchWeatherData();
    fetchForecastData();
  };
  const fetchWeatherDataByCoords = (lat, lon) => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json' }
    };

    const locationQuery = `${lat},${lon}`;
    fetch(`${api.baseRealtime}?location=${locationQuery}&apikey=${api.key}`, options)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch weather data.");

      });
  };

  const fetchForecastDataByCoords = (lat, lon) => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json' }
    };

    const locationQuery = `${lat},${lon}`;
    fetch(`${api.baseForecast}?location=${locationQuery}&apikey=${api.key}`, options)
      .then(res => res.json())
      .then(result => {
        setForecast(result);
      })
      .catch(err => {
        console.error(err);

      });
  };
  const fetchWeatherData = () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json' }
    };

    const locationQuery = encodeURIComponent(search);
    fetch(`${api.baseRealtime}?location=${locationQuery}&apikey=${api.key}`, options)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setWeather(result);
      })
      .catch(err => console.error(err));
  };

  const fetchForecastData = () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json' }
    };

    const locationQuery = encodeURIComponent(search);
    fetch(`${api.baseForecast}?location=${locationQuery}&apikey=${api.key}`, options)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setForecast(result);
      })
      .catch(err => console.error(err));
  };
  const fetchLocationAndWeather = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      fetchWeatherDataByCoords(latitude, longitude);
      fetchForecastDataByCoords(latitude, longitude);
    })
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <div>
          <input
            type="text"
            placeholder="Enter city/town..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchPressed}>Search</button>
          <button onClick={fetchLocationAndWeather}>Use My Location</button>
        </div>



        {/* Display the real-time weather information if it exists */}
        {weather.data ? (
          <div>
            <p>{weather.location.name}</p>
            <p>{weather.data.values.temperature.toFixed(2)}°C</p>
            <p>Weather Code: {weather.data.values.weatherCode}</p>
            <p>Humidity: {weather.data.values.humidity}%</p>
            <p>Wind Speed: {weather.data.values.windSpeed} km/h</p>
            <p>Visibility: {weather.data.values.visibility} km</p>
          </div>

        ) : (
          ""
        )}

        {/* Display hourly forecast weather information if it exists */}
        {forecast.timelines && forecast.timelines.hourly && forecast.timelines.hourly.length > 0 ? (
          <div>
            <h2>Hourly Forecast</h2>
            <div className="hourly-forecast-container">
              {forecast.timelines.hourly.slice(0, 7).map((interval, index) => (
                <div key={index} className="hourly-forecast-item">
                  <p>Time: {new Date(interval.time).toLocaleTimeString()}</p>
                  <p>Temperature: {interval.values.temperature.toFixed(2)}°C</p>
                  <p>Weather Code: {interval.values.weatherCode}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No hourly forecast data available.</p>
        )}
      </header>
    </div>
  );
}

export default App;
