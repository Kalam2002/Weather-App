import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Wind, Droplets, Thermometer, ArrowDown } from 'lucide-react';
import type { WeatherData, ForecastData } from './types';

function App() {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '67cb79fed8399fa72a16287f9d7c977d';
  const API_URL = 'https://api.openweathermap.org/data/2.5';

  const getBackgroundImage = (temp: number, weatherMain: string) => {
    if (weatherMain.toLowerCase() === 'rain' || weatherMain.toLowerCase() === 'drizzle') {
      return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2000&q=80';
    } else if (weatherMain.toLowerCase() === 'snow') {
      return 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=2000&q=80';
    } else if (weatherMain.toLowerCase() === 'thunderstorm') {
      return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=2000&q=80';
    } else if (weatherMain.toLowerCase() === 'clouds') {
      return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000&q=80';
    } else if (temp >= 30) {
      return 'https://images.unsplash.com/photo-1524594081293-190a2fe0baae?auto=format&fit=crop&w=2000&q=80';
    } else if (temp >= 20) {
      return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';
    } else if (temp >= 10) {
      return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1560258018-c7db7645254e?auto=format&fit=crop&w=2000&q=80';
    }
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(`${API_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`),
        axios.get(`${API_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
      ]);

      setWeatherData(weatherResponse.data);
      setForecast(forecastResponse.data);
    } catch (err) {
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  const getDayName = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const backgroundImage = weatherData 
    ? getBackgroundImage(weatherData.main.temp, weatherData.weather[0].main)
    : 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=2000&q=80';

  return (
    <div 
      className="min-h-screen p-8 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Search className="text-white" size={24} />
            </button>
          </div>
          {error && <p className="text-red-200 mt-2">{error}</p>}
        </form>

        {weatherData && (
          <div className="bg-black/30 backdrop-blur-md rounded-3xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {weatherData.name}, {weatherData.sys.country}
                </h1>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-24 h-24"
                  />
                  <div>
                    <div className="text-6xl font-bold">
                      {Math.round(weatherData.main.temp)}°C
                    </div>
                    <div className="text-xl capitalize">
                      {weatherData.weather[0].description}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
                  <Thermometer className="text-yellow-300" size={24} />
                  <div>
                    <div className="text-sm opacity-70">Feels Like</div>
                    <div className="text-xl font-semibold">
                      {Math.round(weatherData.main.feels_like)}°C
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
                  <Droplets className="text-blue-300" size={24} />
                  <div>
                    <div className="text-sm opacity-70">Humidity</div>
                    <div className="text-xl font-semibold">
                      {weatherData.main.humidity}%
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
                  <Wind className="text-green-300" size={24} />
                  <div>
                    <div className="text-sm opacity-70">Wind Speed</div>
                    <div className="text-xl font-semibold">
                      {weatherData.wind.speed} m/s
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
                  <ArrowDown className="text-red-300" size={24} />
                  <div>
                    <div className="text-sm opacity-70">Pressure</div>
                    <div className="text-xl font-semibold">
                      {weatherData.main.pressure} hPa
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {forecast && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
                <div className="grid grid-cols-5 gap-4">
                  {forecast.list
                    .filter((item, index) => index % 8 === 0)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/10 p-4 rounded-xl text-center backdrop-blur-sm"
                      >
                        <div className="text-lg font-semibold">
                          {getDayName(item.dt)}
                        </div>
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt={item.weather[0].description}
                          className="w-12 h-12 mx-auto"
                        />
                        <div className="text-xl font-bold">
                          {Math.round(item.main.temp)}°C
                        </div>
                        <div className="text-sm opacity-70">
                          {item.weather[0].main}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-center text-white/50 mt-8 font-semibold">
        Made By Kalam
      </div>
    </div>
  );
}

export default App;