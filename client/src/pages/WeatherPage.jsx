import { CloudSun } from "lucide-react";
import React from "react";

export default function WeatherPage({ loadWeather, loading, setWeatherCity, weatherCity, weatherData }) {
  return (
    <section className="panel weather-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Environment</p>
          <h2>Weather Advice</h2>
        </div>
        <CloudSun />
      </div>
      <form className="inline-form" onSubmit={(event) => { event.preventDefault(); loadWeather(); }}>
        <label>
          City
          <input value={weatherCity} onChange={(event) => setWeatherCity(event.target.value)} placeholder="Lahore" required />
        </label>
        <button className="primary-button" disabled={loading}>Get Weather</button>
      </form>
      {weatherData?.configured === false && (
        <p className="notice">
          {weatherData.error || "OpenWeatherMap key is not configured yet, so fallback advice is shown."}
        </p>
      )}
      {weatherData?.weather && (
        <div className="weather-summary">
          <article>
            <strong>{weatherData.location.name}{weatherData.location.country ? `, ${weatherData.location.country}` : ""}</strong>
            <span>{weatherData.weather.condition} {weatherData.weather.description ? `- ${weatherData.weather.description}` : ""}</span>
          </article>
          <article><strong>{weatherData.weather.temperature}C</strong><span>Temperature</span></article>
          <article><strong>{weatherData.weather.humidity}%</strong><span>Humidity</span></article>
          <article><strong>{weatherData.weather.windSpeed} m/s</strong><span>Wind</span></article>
        </div>
      )}
      <div className="weather-grid">
        {(weatherData?.advice || []).map((item) => (
          <article key={item.condition}>
            <h3>{item.condition}</h3>
            <p>{item.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
