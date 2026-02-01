import React from 'react';
import { AlertTriangle, Shield, TrendingUp, Info, Newspaper } from 'lucide-react';
import { getRiskColor } from '../utils/riskCalculator';

const RiskScore = ({ riskData, newsData }) => {
  if (!riskData) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const { score, level, breakdown } = riskData;

  const getRiskIcon = () => {
    if (level === 'Extreme' || level === 'High') {
      return <AlertTriangle className="h-8 w-8 text-red-400 animate-pulse-slow" />;
    }
    return <Shield className="h-8 w-8 text-green-400" />;
  };

  const getGradient = () => {
    if (level === 'Extreme') return 'from-red-500 to-red-700';
    if (level === 'High') return 'from-orange-500 to-orange-700';
    if (level === 'Moderate') return 'from-yellow-500 to-yellow-700';
    return 'from-green-500 to-green-700';
  };

  return (
    <div className="glass rounded-2xl p-6 hover:glow-strong transition-smooth animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          {getRiskIcon()}
          <span className="ml-3 ">Disaster Risk Assessment</span>
        </h3>
        <div className="relative group">
          <Info className="h-5 w-5 text-gray-400 cursor-help hover:text-primary transition-smooth" />
          <div className="absolute right-0 top-8 w-64 bg-dark-100 border border-gray-700 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-xs">
            <p className="text-gray-300">Risk score is calculated using:</p>
            <ul className="mt-2 space-y-1 text-gray-400">
              {newsData && newsData.newsRisk && newsData.newsRisk.score > 0 ? (
                <>
                  <li>• News Intelligence (20%)</li>
                  <li>• Weather conditions (32%)</li>
                  <li>• Seismic activity (32%)</li>
                  <li>• Air quality (16%)</li>
                </>
              ) : (
                <>
                  <li>• Weather conditions (40%)</li>
                  <li>• Seismic activity (40%)</li>
                  <li>• Air quality (20%)</li>
                </>
              )}
            </ul>

          </div>
        </div>
      </div>

      {/* Main Risk Display */}
      <div className="relative">
        <div className={`bg-gradient-to-r ${getGradient()} rounded-2xl p-8 mb-6 shadow-2xl`}>
          <div className="text-center">
            <p className="text-white/80 text-sm font-medium mb-2">Current Risk Level</p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-6xl font-black text-white drop-shadow-lg">{score}</div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white">{level}</div>
                <div className="text-white/80 text-sm">out of 10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="space-y-3">
          <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 group-hover:animate-pulse"></div>
                Weather Severity
              </span>
              <span className="text-white font-bold">{breakdown.weather}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(breakdown.weather / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm flex items-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 group-hover:animate-pulse"></div>
                Earthquake Activity
              </span>
              <span className="text-white font-bold">{breakdown.earthquake}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(breakdown.earthquake / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-2 group-hover:animate-pulse"></div>
                Air Quality Index
              </span>
              <span className="text-white font-bold">{breakdown.aqi}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-600 to-amber-800 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(breakdown.aqi / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* NEWS RISK INTELLIGENCE - NEW! */}
          {breakdown.news && parseFloat(breakdown.news) > 0 && (
            <div className="bg-dark-200/50 rounded-xl p-4 hover:bg-dark-200/70 transition-smooth group border-2 border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 group-hover:animate-pulse"></div>
                  News Intelligence
                  <Newspaper className="h-3 w-3 ml-2 text-primary" />
                </span>
                <span className="text-white font-bold">{breakdown.news}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(breakdown.news / 10) * 100}%` }}
                ></div>
              </div>
              {newsData && newsData.newsRisk && newsData.newsRisk.events && newsData.newsRisk.events.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  {newsData.newsRisk.events.length} event{newsData.newsRisk.events.length > 1 ? 's' : ''} detected from AI news analysis
                </div>
              )}
            </div>
          )}
        </div>

        {/* Risk Indicator Bar */}
        <div className="mt-6 bg-dark-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Extreme</span>
          </div>
          <div className="relative w-full h-3 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-dark-100 transition-all duration-1000"
              style={{ left: `${(score / 10) * 100}%`, transform: 'translate(-50%, -50%)' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className={`mt-6 p-4 rounded-xl border ${getRiskColor(level)} transition-smooth`}>
        <p className="text-sm font-medium">
          {level === 'Low' && '✓ Conditions are safe. Normal activities can proceed.'}
          {level === 'Moderate' && '⚠ Stay alert. Monitor weather and seismic updates.'}
          {level === 'High' && '⚠ Exercise caution. Prepare emergency supplies.'}
          {level === 'Extreme' && '🚨 ALERT: High risk detected. Follow safety protocols immediately.'}
        </p>
      </div>
    </div>
  );
};

export default RiskScore;