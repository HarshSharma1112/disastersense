import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, Globe, RefreshCw, AlertTriangle } from 'lucide-react';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import EarthquakeTable from './EarthquakeTable';
import RiskScore from './RiskScore';
import AirQualityChart from './AirQualityChart';
import TemperatureChart from './TemperatureChart';
import AIAssistant from './AIAssistant';
import SOSModal from './SOSModal';
import NearestHelp from './NearestHelp';
import EmergencyContacts from './EmergencyContacts';
import LocationPermissionModal from './LocationPermissionModal';
import DisasterNews from './DisasterNews';
import { calculateRiskScore } from '../utils/riskCalculator';

const Dashboard = () => {
  const [city, setCity] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [earthquakes, setEarthquakes] = useState([]);
  const [aqiData, setAqiData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [userLocation, setUserLocation] = useState(null);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationPermissionChecked, setLocationPermissionChecked] = useState(false);

  const API_KEY = 'd2668b312d247cbd8d62a299c5071e63';
  const fetchAllData = async (searchCity) => {
    setLoading(true);
    try {
      // fetching weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`
      );
      setWeather(weatherRes.data);

      // fitching forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}`
      );
      setForecast(forecastRes.data);

      // fetching AQI
      const { lat, lon } = weatherRes.data.coord;
      const aqiRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      setAqiData(aqiRes.data);

      // fetch earthquakes - filter for Asia region based on user location
      const earthquakeRes = await axios.get(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
      );

      // filter thee earthquakes for South Asia region near to bharat and nearby areas
      // we ask earthquakes closer to user's location
      const userLat = weatherRes.data.coord.lat;
      const userLon = weatherRes.data.coord.lon;

      const filteredEarthquakes = earthquakeRes.data.features.filter(eq => {
        const eqLat = eq.geometry.coordinates[1];
        const eqLon = eq.geometry.coordinates[0];

        // calculating rough distance 
        const latDiff = Math.abs(eqLat - userLat);
        const lonDiff = Math.abs(eqLon - userLon);
        const roughDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

        // we show earthquakes within ~20 degrees (roughly 2000km) - closer to India too avoid unneccessary data
        const isNearby = roughDistance < 30;

        // south asia region (India, Pak, Nepal, Bangladesh, Sri Lanka, Myanmar)
        const isSouthAsia = eqLat >= 5 && eqLat <= 40 && eqLon >= 60 && eqLon <= 100;

        return isNearby || isSouthAsia;
      });

      setEarthquakes(filteredEarthquakes.length > 0 ? filteredEarthquakes : earthquakeRes.data.features.slice(0, 10));

      // FETCH NEWS RISK ANALYSIS (NEW!)
      let newsRiskData = null;
      try {
        const newsRes = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/news/analyze?city=${searchCity}`, {
          timeout: 10000
        });
        if (newsRes.data.success) {
          newsRiskData = newsRes.data;
          setNewsData(newsRiskData);
        }
      } catch (newsError) {
        console.error('Failed to fetch news analysis:', newsError);
        // Don't block UI if news fails, continue with other data
      }

      // now i calculate risk score using filtered earthquakes (not all global data!)
      const earthquakesToUse = filteredEarthquakes.length > 0 ? filteredEarthquakes : earthquakeRes.data.features.slice(0, 10);
      const risk = calculateRiskScore(
        weatherRes.data,
        earthquakesToUse,
        aqiRes.data.list[0].main.aqi * 50,
        newsRiskData?.newsRisk // Pass news risk to calculator
      );
      setRiskData(risk);

      // now log risk score to backend 
      try {
        await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/risk/log`, {
          city: searchCity,
          riskScore: risk.score
        });
      } catch (logError) {
        console.error('Failed to log risk score:', logError);
        // so it don't block UI for logging failures, so we ignore this error
      }

      setCity(searchCity);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(city);
    // auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchAllData(city);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Check location permission status and show modal if needed
  useEffect(() => {
    const checkLocationPermission = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.');
        return;
      }

      // Check if we've already asked the user for location
      const hasAskedForLocation = localStorage.getItem('disastersense_location_asked');

      if (!hasAskedForLocation) {
        // First time user - show the modal
        console.log('First time user - showing location permission modal');
        setShowLocationModal(true);
      } else {
        // User has been asked before - try to get location silently
        console.log('Returning user - attempting to get location silently');
        requestLocation();
      }
    };

    // Small delay to ensure UI is ready
    setTimeout(checkLocationPermission, 500);
  }, []);

  // Function to request location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowLocationModal(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location access was denied. Emergency services and nearest help features will not be available.');
          }
          setShowLocationModal(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  // Handle location permission modal actions
  const handleAllowLocation = () => {
    // Mark that we've asked the user
    localStorage.setItem('disastersense_location_asked', 'true');
    requestLocation();
  };

  const handleDenyLocation = () => {
    // Mark that we've asked the user
    localStorage.setItem('disastersense_location_asked', 'true');
    setShowLocationModal(false);
    console.log('User declined location access');
  };

  const handleRefresh = () => {
    fetchAllData(city);
  };

  return (
    <div className="min-h-screen bg-stone-800 text-white">
      {/* Header */}
      <header className="glass border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  DisasterSense
                </h1>
                <p className="text-xs text-gray-400">Real-Time Global Disaster Intelligence and SOS System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="h-4 w-4 text-primary" />
                <span>Live Data</span>
              </div>
              <button
                onClick={() => setShowSOSModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-4 py-2 rounded-lg transition-smooth border border-red-500/30 hover:border-red-400 animate-pulse-slow"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-bold">SOS</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 bg-dark-200 hover:bg-dark-100 px-4 py-2 rounded-lg transition-smooth border border-gray-700 hover:border-primary disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* search Bar */}
        <SearchBar onSearch={fetchAllData} currentCity={city} />

        {/* last Updated */}
        <div className="text-center text-gray-500 text-sm mb-6">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>

        {loading && !weather ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-4"></div>
              <p className="text-gray-400">Fetching disaster intelligence...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* emergency Contacts - Top Priority */}
            <EmergencyContacts />

            {/* nearest Help - Show if location available */}
            {userLocation && <NearestHelp userLocation={userLocation} />}

            {/* DISASTER NEWS INTELLIGENCE - NEW! */}
            <DisasterNews newsData={newsData} city={city} />

            {/* top Row: Weather and Risk Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherCard weather={weather} forecast={forecast} />
              <RiskScore riskData={riskData} newsData={newsData} />
            </div>

            {/*   harts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TemperatureChart forecastData={forecast} />
              <AirQualityChart aqiData={aqiData} />
            </div>

            {/*  earthquake Table */}
            <EarthquakeTable earthquakes={earthquakes} />
          </div>
        )}
      </main>

      {/* AI Assistant */}
      <AIAssistant
        weatherData={weather}
        earthquakes={earthquakes}
        aqiData={aqiData}
        city={city}
      />

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
        onClose={handleDenyLocation}
      />

      {/* SOS Modal */}
      <SOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        userLocation={userLocation}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-800 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>© 2026 DisasterSense. Built by Harsh Sharma with real-time global data APIs.</p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                System Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
