import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer } from 'lucide-react';

const TemperatureChart = ({ forecastData }) => {
  if (!forecastData || !forecastData.list) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-48 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const data = forecastData.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: Math.round(item.main.temp - 273.15),
      feelsLike: Math.round(item.main.feels_like - 273.15),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const avgTemp = (data.reduce((sum, item) => sum + item.temp, 0) / data.length).toFixed(1);
  const maxTemp = Math.max(...data.map(d => d.temp));
  const minTemp = Math.min(...data.map(d => d.temp));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-gray-700">
          <p className="text-white font-medium">{payload[0].payload.date}</p>
          <p className="text-gray-400 text-sm">{payload[0].payload.time}</p>
          <p className="text-primary font-bold text-lg mt-1">
            {payload[0].value}°C
          </p>
          <p className="text-gray-400 text-xs">
            Feels like: {payload[0].payload.feelsLike}°C
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6 hover:glow transition-smooth animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Thermometer className="mr-2 text-primary" />
          Temperature Forecast
        </h3>
        <span className="text-sm text-gray-400 bg-dark-200/50 px-3 py-1 rounded-full">
          Next 24 hours
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-200/50 rounded-xl p-4 text-center hover:bg-dark-200/70 transition-smooth">
          <p className="text-gray-400 text-sm mb-1">Average</p>
          <p className="text-2xl font-bold text-white">{avgTemp}°C</p>
        </div>
        <div className="bg-dark-200/50 rounded-xl p-4 text-center hover:bg-dark-200/70 transition-smooth">
          <p className="text-gray-400 text-sm mb-1">High</p>
          <p className="text-2xl font-bold text-red-400">{maxTemp}°C</p>
        </div>
        <div className="bg-dark-200/50 rounded-xl p-4 text-center hover:bg-dark-200/70 transition-smooth">
          <p className="text-gray-400 text-sm mb-1">Low</p>
          <p className="text-2xl font-bold text-gray-400">{minTemp}°C</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#f59e0b"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTemp)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
          <span className="text-gray-400">Temperature</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary/30 rounded-full mr-2"></div>
          <span className="text-gray-400">Forecast Range</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;