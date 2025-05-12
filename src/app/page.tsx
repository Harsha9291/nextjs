// File: app/page.tsx
"use client";

import { useState } from "react";

export default function WeatherBoard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      const data = await res.json();
      if (data.error) {
        setError(data.error.message);
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-4">🌤️ Weather Board</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={getWeather}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 font-semibold mb-4">{error}</div>
      )}

      {weather && weather.current && (
        <div className="bg-white rounded-xl shadow p-6 text-center w-80">
          <h2 className="text-2xl font-bold mb-2">{weather.location.name}</h2>
          <p className="text-lg">🌡️ {weather.current.temp_c}°C</p>
          <p className="text-gray-600">{weather.current.condition.text}</p>
          <p className="text-sm mt-2">Humidity: {weather.current.humidity}%</p>
          <p className="text-sm">Wind: {weather.current.wind_kph} kph</p>
        </div>
      )}
    </main>
  );
}
