import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Building2, Shield, Flame } from 'lucide-react';
import axios from 'axios';

const NearestHelp = ({ userLocation }) => {
    const [responders, setResponders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userLocation?.lat && userLocation?.lng) {
            fetchResponders();
        }
    }, [userLocation]);

    const fetchResponders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/api/responders', {
                params: {
                    lat: userLocation.lat,
                    lng: userLocation.lng
                }
            });

            if (response.data.success) {
                setResponders(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching responders:', err);
            setError('Failed to load nearby emergency services');
        } finally {
            setLoading(false);
        }
    };

    if (!userLocation) return null;

    const hospitals = responders.filter(r => r.type === 'hospital');
    const policeStations = responders.filter(r => r.type === 'police');
    const fireStations = responders.filter(r => r.type === 'fire_station');

    // Function to open Google Maps directions
    const openInMaps = (lat, lng, name) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="glass rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                        <Navigation className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Nearest Emergency Services</h2>
                        <p className="text-sm text-gray-400">Based on your current location.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            ) : responders.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No emergency services found nearby</p>
                    <p className="text-sm mt-1">Try expanding search radius</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hospitals */}
                    {hospitals.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                <span>Hospitals ({hospitals.length})</span>
                            </h3>
                            {hospitals.slice(0, 3).map((hospital, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openInMaps(hospital.lat, hospital.lng, hospital.name)}
                                    className="bg-dark-200 border border-gray-700 rounded-lg p-3 hover:border-primary hover:bg-dark-100 transition-smooth cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-white text-sm">{hospital.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {hospital.distance ? `${hospital.distance.toFixed(1)} km away` : 'Distance unknown'}
                                            </p>
                                            <p className="text-xs text-primary mt-1">Click for directions →</p>
                                        </div>
                                        <Building2 className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Police Stations */}
                    {policeStations.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <span>Police Stations ({policeStations.length})</span>
                            </h3>
                            {policeStations.slice(0, 3).map((station, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openInMaps(station.lat, station.lng, station.name)}
                                    className="bg-dark-200 border border-gray-700 rounded-lg p-3 hover:border-primary hover:bg-dark-100 transition-smooth cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-white text-sm">{station.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {station.distance ? `${station.distance.toFixed(1)} km away` : 'Distance unknown'}
                                            </p>
                                            <p className="text-xs text-primary mt-1">Click for directions →</p>
                                        </div>
                                        <Shield className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fire Stations */}
                    {fireStations.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
                                <Flame className="h-4 w-4 text-primary" />
                                <span>Fire Stations ({fireStations.length})</span>
                            </h3>
                            {fireStations.slice(0, 3).map((station, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openInMaps(station.lat, station.lng, station.name)}
                                    className="bg-dark-200 border border-gray-700 rounded-lg p-3 hover:border-primary hover:bg-dark-100 transition-smooth cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-white text-sm">{station.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {station.distance ? `${station.distance.toFixed(1)} km away` : 'Distance unknown'}
                                            </p>
                                            <p className="text-xs text-primary mt-1">Click for directions →</p>
                                        </div>
                                        <Flame className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NearestHelp;
