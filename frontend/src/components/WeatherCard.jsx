import React from 'react';
import { Cloud, Droplets, Wind, Eye, Gauge, Thermometer, CloudRain, CloudSnow, Sun, CloudDrizzle } from 'lucide-react';

const WeatherCard = ({ weather, forecast }) => {
  if (!weather) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const temp = Math.round(weather.main?.temp - 273.15); // Kelvin to Celsius
  const feelsLike = Math.round(weather.main?.feels_like - 273.15);
  const humidity = weather.main?.humidity;
  const windSpeed = weather.wind?.speed;
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A';
  const pressure = weather.main?.pressure;
  const description = weather.weather?.[0]?.description || 'Clear';
  const icon = weather.weather?.[0]?.icon;

  // Process forecast data - get one forecast per day (next 5 days)
  const getDailyForecasts = () => {
    if (!forecast || !forecast.list) return [];

    const dailyData = [];
    const processedDates = new Set();

    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toLocaleDateString();

      // Get midday forecast (12:00) for each day, skip today
      if (!processedDates.has(dateStr) && dailyData.length < 5) {
        const hour = date.getHours();
        if (hour >= 11 && hour <= 14) {
          processedDates.add(dateStr);
          dailyData.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate(),
            temp: Math.round(item.main.temp - 273.15),
            tempMin: Math.round(item.main.temp_min - 273.15),
            tempMax: Math.round(item.main.temp_max - 273.15),
            icon: item.weather[0].icon,
            description: item.weather[0].main
          });
        }
      }
    });

    return dailyData;
  };

  const dailyForecasts = getDailyForecasts();

  return (
    <div className="glass rounded-2xl p-6 hover:glow transition-smooth animate-slide-up group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-smooth">
            {weather.name}, {weather.sys?.country}
          </h3>
          <p className="text-gray-400 text-sm capitalize">{description}</p>
        </div>
        {icon && (
          <img
            src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="weather"
            className="w-16 h-16 group-hover:scale-110 transition-smooth"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth">
          <div className="flex items-center justify-between">
            <Thermometer className="text-primary h-6 w-6" />
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{temp}°C</p>
              <p className="text-xs text-gray-400">Feels like {feelsLike}°C</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth">
          <div className="flex items-center justify-between">
            <Droplets className="text-gray-400 h-6 w-6" />
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{humidity}%</p>
              <p className="text-xs text-gray-400">Humidity</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth">
          <div className="flex items-center justify-between">
            <Wind className="text-green-400 h-6 w-6" />
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{windSpeed} m/s</p>
              <p className="text-xs text-gray-400">Wind Speed</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth">
          <div className="flex items-center justify-between">
            <Eye className="text-gray-400 h-6 w-6" />
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{visibility} km</p>
              <p className="text-xs text-gray-400">Visibility</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-400">
          <Gauge className="h-4 w-4 mr-2 text-primary" />
          <span>Pressure: <span className="text-white font-medium">{pressure} hPa</span></span>
        </div>
      </div>

      {/* 5-Day Forecast - Premium Design */}
      {dailyForecasts.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-white">5-Day Forecast</h4>
            <div className="flex items-center text-xs text-gray-500">
              <Cloud className="h-3 w-3 mr-1" />
              <span>Extended</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {dailyForecasts.map((day, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-dark-200/60 to-dark-300/40 rounded-xl p-3 text-center hover:from-dark-200/80 hover:to-dark-300/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 border border-gray-700/50 hover:border-primary/30 group"
              >
                {/* Day & Date */}
                <div className="mb-2">
                  <p className="text-xs font-bold text-primary group-hover:text-accent transition-colors">{day.day}</p>
                  <p className="text-[10px] text-gray-500">{day.date}</p>
                </div>

                {/* Weather Icon - Larger */}
                <div className="my-2">
                  <img
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                    className="w-14 h-14 mx-auto group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-1">
                  <p className="text-xl font-black text-white group-hover:text-primary transition-colors">{day.temp}°</p>
                  <div className="flex items-center justify-center gap-1 text-[10px]">
                    <span className="text-gray-500">↑{day.tempMax}°</span>
                    <span className="text-gray-600">↓{day.tempMin}°</span>
                  </div>
                </div>

                {/* Weather Description */}
                <p className="text-[10px] text-gray-400 capitalize mt-2 truncate">{day.description}</p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;