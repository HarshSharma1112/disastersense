import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind } from 'lucide-react';

const AirQualityChart = ({ aqiData }) => {
  // for now i generate mock historical data for demo (in real app, i fetch this from API)
  const generateHistoricalData = (currentAQI) => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        aqi: Math.max(0, currentAQI + (Math.random() - 0.5) * 40)
      });
    }
    return data;
  };

  const currentAQI = aqiData?.list?.[0]?.main?.aqi || 2;
  const aqiValue = currentAQI * 32; // i convert 1-5 scale to approximate AQI value because api gives 1-5 scale
  const data = generateHistoricalData(aqiValue);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { text: 'Good', color: '#10b981' };
    if (aqi <= 100) return { text: 'Moderate', color: '#f59e0b' };
    if (aqi <= 150) return { text: 'Unhealthy for Sensitive', color: '#ef4444' };
    if (aqi <= 200) return { text: 'Unhealthy', color: '#dc2626' };
    if (aqi <= 300) return { text: 'Very Unhealthy', color: '#991b1b' };
    return { text: 'Hazardous', color: '#7f1d1d' };
  };

  const status = getAQIStatus(aqiValue);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const aqi = payload[0].value.toFixed(0);
      const status = getAQIStatus(aqi);
      return (
        <div className="glass rounded-lg p-3 border border-gray-700">
          <p className="text-white font-medium">{payload[0].payload.date}</p>
          <p className="text-primary font-bold text-lg">AQI: {aqi}</p>
          <p className="text-gray-400 text-sm">{status.text}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6 hover:glow transition-smooth animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Wind className="mr-2 text-primary" />
          Air Quality Index
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
          <span className="text-sm font-medium" style={{ color: status.color }}>
            {status.text}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-black text-white">{aqiValue.toFixed(0)}</span>
          <span className="text-gray-400">AQI</span>
        </div>
        <p className="text-gray-400 text-sm mt-2">7-day trend analysis</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6, fill: '#f59e0b' }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-5 gap-2">
        {[
          { range: '0-50', label: 'Good', color: 'bg-green-500' },
          { range: '51-100', label: 'Moderate', color: 'bg-yellow-500' },
          { range: '101-150', label: 'Sensitive', color: 'bg-orange-500' },
          { range: '151-200', label: 'Unhealthy', color: 'bg-red-500' },
          { range: '201+', label: 'Hazardous', color: 'bg-red-800' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className={`${item.color} h-2 rounded-full mb-1`}></div>
            <p className="text-xs text-gray-400">{item.range}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityChart;