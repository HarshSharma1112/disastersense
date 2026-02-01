import React from 'react';
import { Activity, MapPin, Clock, TrendingUp } from 'lucide-react';

const EarthquakeTable = ({ earthquakes }) => {
  if (!earthquakes || earthquakes.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Activity className="mr-2 text-primary" />
          Recent Earthquakes
        </h3>
        <p className="text-gray-400 text-center py-8">No recent seismic activity detected</p>
      </div>
    );
  }

  const getMagnitudeColor = (mag) => {
    if (mag >= 7) return 'text-red-400 bg-red-500/10';
    if (mag >= 5) return 'text-orange-400 bg-orange-500/10';
    if (mag >= 3) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass rounded-2xl p-6 hover:glow transition-smooth animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Activity className="mr-2 text-primary animate-pulse-slow" />
          Recent Earthquakes Globally
        </h3>
        <span className="text-sm text-gray-400 bg-dark-200/50 px-3 py-1 rounded-full">
          Last 24 hours
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Location</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Magnitude</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Depth</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Time</th>
            </tr>
          </thead>
          <tbody>
            {earthquakes.slice(0, 10).map((eq, index) => {
              const props = eq.properties;
              const coords = eq.geometry?.coordinates;
              
              return (
                <tr
                  key={eq.id || index}
                  className="border-b border-gray-800 hover:bg-dark-200/30 transition-smooth group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium group-hover:text-primary transition-smooth">
                          {props?.place || 'Unknown Location'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {coords?.[1]?.toFixed(2)}°, {coords?.[0]?.toFixed(2)}°
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-sm ${getMagnitudeColor(props?.mag)}`}>
                        {props?.mag?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-white font-medium">{coords?.[2]?.toFixed(0) || 'N/A'} km</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(props?.time)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
          <span>Data from OpenWeatherMap API</span>
        </div>
        <span className="text-gray-500">Updated in real-time</span>
      </div>
    </div>
  );
};

export default EarthquakeTable;