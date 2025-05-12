// File: app/page.tsx
"use client";

import { useState } from "react";

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

interface WeatherData {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast?: {
    forecastday: ForecastDay[];
  };
  error?: {
    message: string;
  };
}

export default function WeatherBoard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
      );
      const data: WeatherData = await res.json();
      if ((data as any).error) {
        setError((data as any).error.message);
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-6">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow">🌤️ Weather Board</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="px-4 py-2 rounded shadow focus:outline-none"
        />
        <button
          onClick={getWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Get Weather
        </button>
      </div>

      {loading && <div className="text-white mb-4 animate-pulse">⏳ Fetching weather...</div>}

      {error && <div className="text-red-700 font-semibold mb-4">{error}</div>}

      {weather && weather.current && (
        <div className="bg-white rounded-xl shadow-xl p-6 text-center w-96 mb-6">
          <h2 className="text-2xl font-bold mb-2">{weather.location.name}</h2>
          <img
            src={`https:${weather.current.condition.icon}`}
            alt=""
            className="mx-auto mb-2"
          />
          <p className="text-lg">🌡️ {weather.current.temp_c}°C</p>
          <p className="text-gray-600">{weather.current.condition.text}</p>
          <p className="text-sm mt-2">Humidity: {weather.current.humidity}%</p>
          <p className="text-sm">Wind: {weather.current.wind_kph} kph</p>
        </div>
      )}

      {weather?.forecast?.forecastday && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weather.forecast.forecastday.map((day, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md text-center w-64"
            >
              <h3 className="font-semibold text-lg mb-1">{day.date}</h3>
              <img
                src={`https:${day.day.condition.icon}`}
                alt=""
                className="mx-auto mb-1"
              />
              <p>{day.day.condition.text}</p>
              <p className="text-sm">Avg Temp: {day.day.avgtemp_c}°C</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}