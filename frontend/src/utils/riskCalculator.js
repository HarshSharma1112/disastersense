export const calculateRiskScore = (weatherData, earthquakes, aqi, newsRisk = null) => {
  let weatherSeverity = 0;
  let earthquakeProximity = 0;
  let aqiSeverity = 0;
  let newsSeverity = 0;

  // to calculate weather severity (0-10)
  if (weatherData) {
    const temp = weatherData.main?.temp ? (weatherData.main.temp - 273.15) : 20; // Convert Kelvin to Celsius
    const humidity = weatherData.main?.humidity || 50;
    const windSpeed = weatherData.wind?.speed || 0;

    if (temp > 40 || temp < -10) weatherSeverity += 4;
    else if (temp > 35 || temp < 0) weatherSeverity += 2;

    if (humidity > 90) weatherSeverity += 2;
    if (windSpeed > 20) weatherSeverity += 3;
    else if (windSpeed > 10) weatherSeverity += 1;

    if (weatherData.weather?.[0]?.main === 'Thunderstorm') weatherSeverity += 3;
    else if (weatherData.weather?.[0]?.main === 'Rain') weatherSeverity += 1;
  }

  // earthquake proximity (0-10) - Realistic scoring, most areas 0-3
  if (earthquakes && earthquakes.length > 0) {
    const recentQuakes = earthquakes.filter(eq => {
      const quakeTime = new Date(eq.properties?.time);
      const hoursSince = (Date.now() - quakeTime) / (1000 * 60 * 60);
      const mag = eq.properties?.mag || 0;
      // only count significant earthquakes >= 4.5 magnitude
      return hoursSince < 24 && mag >= 4.5;
    });

    // much more conservative scoring
    recentQuakes.forEach(eq => {
      const mag = eq.properties?.mag || 0;
      if (mag >= 7.5) earthquakeProximity += 8;      // Major earthquake - very rare
      else if (mag >= 7.0) earthquakeProximity += 5; // Major earthquake
      else if (mag >= 6.5) earthquakeProximity += 3; // Strong earthquake
      else if (mag >= 6.0) earthquakeProximity += 2; // Strong earthquake
      else if (mag >= 5.5) earthquakeProximity += 1; // Moderate earthquake
      else if (mag >= 5.0) earthquakeProximity += 0.5; // Light earthquake
      else if (mag >= 4.5) earthquakeProximity += 0.3; // Minor earthquake
    });

    // cap at 10 and apply dampening for realism
    earthquakeProximity = Math.min(earthquakeProximity * 0.8, 10);
  }

  // aqi severity (0-10)
  if (aqi) {
    if (aqi > 300) aqiSeverity = 10;
    else if (aqi > 200) aqiSeverity = 7;
    else if (aqi > 150) aqiSeverity = 5;
    else if (aqi > 100) aqiSeverity = 3;
    else if (aqi > 50) aqiSeverity = 1;
  }

  // NEWS RISK SEVERITY (0-10) - NEW!
  // AI-analyzed news events contribute to overall risk
  if (newsRisk && newsRisk.score) {
    newsSeverity = Math.min(newsRisk.score, 10);
  }

  // UPDATED: calculate total risk with NEWS factor (20% weight)
  // News: 20%, Weather: 32%, Earthquake: 32%, AQI: 16%
  const totalRisk = newsRisk
    ? (weatherSeverity * 0.32) + (earthquakeProximity * 0.32) + (aqiSeverity * 0.16) + (newsSeverity * 0.20)
    : (weatherSeverity * 0.4) + (earthquakeProximity * 0.4) + (aqiSeverity * 0.2); // Fallback if no news data

  let riskLevel = 'Low';
  let color = 'green';

  if (totalRisk > 7) {
    riskLevel = 'Extreme';
    color = 'red';
  } else if (totalRisk > 5) {
    riskLevel = 'High';
    color = 'orange';
  } else if (totalRisk > 3) {
    riskLevel = 'Moderate';
    color = 'yellow';
  }

  return {
    score: totalRisk.toFixed(1),
    level: riskLevel,
    color,
    breakdown: {
      weather: weatherSeverity.toFixed(1),
      earthquake: earthquakeProximity.toFixed(1),
      aqi: aqiSeverity.toFixed(1),
      news: newsSeverity.toFixed(1) // NEW!
    }
  };
};

export const getRiskColor = (level) => {
  const colors = {
    Low: 'text-green-400 bg-green-500/10 border-green-500/30',
    Moderate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    Extreme: 'text-red-400 bg-red-500/10 border-red-500/30'
  };
  return colors[level] || colors.Low;
};