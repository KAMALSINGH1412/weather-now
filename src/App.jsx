import React, { useState } from "react";

// Weather Now App for Jamie (Outdoor Enthusiast)
// Framework: React
// Styling: Tailwind CSS
// API: Open-Meteo (no auth required)

export default function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch weather from Open-Meteo API
    const fetchWeather = async () => {
        setLoading(true);
        setError("");
        setWeather(null);
        try {
            // Step 1: Get coordinates from Open-Meteo geocoding API
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                setError("City not found");
                setLoading(false);
                return; // ✅ safely inside fetchWeather
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // Step 2: Fetch current weather
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherRes.json();

            setWeather({
                city: name,
                country,
                temp: weatherData.current_weather.temperature,
                wind: weatherData.current_weather.windspeed,
                time: weatherData.current_weather.time,
            });
        } catch (err) {
            setError("Failed to fetch weather");
        } finally {
            setLoading(false);
        }
    };

    // Component UI
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">Weather Now ☀️</h1>
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="px-4 py-2 rounded-lg text-black"
                />
                <button
                    onClick={fetchWeather}
                    disabled={!city || loading}
                    className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Check Weather"}
                </button>
            </div>

            {error && <p className="text-red-200 mb-4">{error}</p>}

            {weather && (
                <div className="bg-white text-blue-900 rounded-xl shadow-lg p-6 w-80 text-center">
                    <h2 className="text-xl font-bold mb-2">
                        {weather.city}, {weather.country}
                    </h2>
                    <p className="text-4xl font-bold mb-2">{weather.temp}°C</p>
                    <p className="mb-1">💨 Wind: {weather.wind} km/h</p>
                    <p className="text-sm text-gray-600">
                        Updated: {new Date(weather.time).toLocaleString()}
                    </p>
                </div>
            )}
        </div>
    );
}
