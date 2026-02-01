import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, MapPin, Phone, CheckCircle } from 'lucide-react';
import axios from 'axios';

const SOSModal = ({ isOpen, onClose, userLocation }) => {
    const [step, setStep] = useState('form'); // 'form' or 'success'
    const [formData, setFormData] = useState({
        disasterType: '',
        description: '',
        lat: userLocation?.lat || null,
        lng: userLocation?.lng || null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const disasterTypes = [
        'Flood',
        'Fire',
        'Earthquake',
        'Landslide',
        'Medical Emergency',
        'Cyclone',
        'Other'
    ];

    const emergencyNumbers = [
        { name: 'Ambulance', number: '108', icon: '🚑' },
        { name: 'Police', number: '100', icon: '🚓' },
        { name: 'Fire', number: '101', icon: '🚒' }
    ];

    // i add this to update location when prop changes
    useEffect(() => {
        if (userLocation) {
            setFormData(prev => ({
                ...prev,
                lat: userLocation.lat,
                lng: userLocation.lng
            }));
        }
    }, [userLocation]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('form');
                setFormData({
                    disasterType: '',
                    description: '',
                    lat: userLocation?.lat || null,
                    lng: userLocation?.lng || null
                });
                setError('');
            }, 300);
        }
    }, [isOpen, userLocation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate location
            if (!formData.lat || !formData.lng) {
                throw new Error('Location not available. Please enable location services.');
            }

            // Send SOS report to backend
            await axios.post('http://localhost:5000/api/emergency/report', {
                disasterType: formData.disasterType,
                lat: formData.lat,
                lng: formData.lng,
                description: formData.description
            });

            // Show success step
            setStep('success');
        } catch (err) {
            console.error('Error sending SOS:', err);
            setError(err.response?.data?.message || err.message || 'Failed to send SOS. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
            <div className="bg-dark-300 rounded-xl shadow-2xl max-w-md w-full border border-red-500/30 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-500/20 p-2 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {step === 'form' ? 'Emergency SOS' : 'Alert Sent'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-smooth"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'form' ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Location Display */}
                            <div className="bg-dark-200 p-3 rounded-lg border border-gray-700">
                                <div className="flex items-center space-x-2 text-sm text-gray-300">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>
                                        {formData.lat && formData.lng
                                            ? `Location: ${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}`
                                            : 'Location not available'}
                                    </span>
                                </div>
                            </div>

                            {/* Disaster Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Emergency Type *
                                </label>
                                <select
                                    required
                                    value={formData.disasterType}
                                    onChange={(e) => setFormData({ ...formData, disasterType: e.target.value })}
                                    className="w-full bg-dark-200 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-smooth"
                                >
                                    <option value="">Select emergency type</option>
                                    {disasterTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Provide additional details..."
                                    rows="3"
                                    maxLength="500"
                                    className="w-full bg-dark-200 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-smooth resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.description.length}/500 characters
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !formData.lat || !formData.lng}
                                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>Sending SOS...</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="h-5 w-5" />
                                        <span>Send Emergency Alert</span>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Success Message */}
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                                    <CheckCircle className="h-10 w-10 text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Emergency Alert Sent!
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Emergency alert sent to nearest responders. 
                                    (Hospitals/Police Stations)
                                </p>
                            </div>

                            {/* Emergency Call Buttons */}
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-300 text-center">
                                    Call Emergency Services:
                                </p>
                                {emergencyNumbers.map(({ name, number, icon }) => (
                                    <a
                                        key={number}
                                        href={`tel:${number}`}
                                        className="flex items-center justify-between bg-dark-200 hover:bg-dark-100 border border-gray-700 hover:border-primary rounded-lg p-4 transition-smooth group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{icon}</span>
                                            <div>
                                                <p className="font-medium text-white">{name}</p>
                                                <p className="text-sm text-gray-400">Tap to call</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xl font-bold text-primary">{number}</span>
                                            <Phone className="h-5 w-5 text-primary group-hover:animate-pulse" />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full bg-dark-200 hover:bg-dark-100 text-white font-medium py-3 rounded-lg transition-smooth border border-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SOSModal;
