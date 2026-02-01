import React from 'react';
import { MapPin, AlertCircle, X } from 'lucide-react';

const LocationPermissionModal = ({ isOpen, onAllow, onDeny, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-dark-200 to-dark-100 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-full">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Location Access Required</h2>
                        </div>
                        <button
                            onClick={onDeny}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start space-x-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                            <p className="font-semibold text-amber-400 mb-1">Why we need your location</p>
                            <p>DisasterSense requires your location to provide:</p>
                        </div>
                    </div>

                    <ul className="space-y-3 ml-2">
                        <li className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm">
                                <strong className="text-white">Emergency SOS Services</strong> - Send your exact location to responders
                            </span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm">
                                <strong className="text-white">Nearest Help Finder</strong> - Locate nearby hospitals, police, and fire stations
                            </span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm">
                                <strong className="text-white">Local Disaster Alerts</strong> - Get relevant warnings for your area
                            </span>
                        </li>
                    </ul>

                    <div className="bg-dark-300/50 border border-gray-700 rounded-lg p-3 mt-4">
                        <p className="text-xs text-gray-400 text-center">
                            🔒 Your location is only used for emergency services and is never stored or shared
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onDeny}
                        className="flex-1 px-4 py-3 bg-dark-300 hover:bg-dark-200 text-gray-300 rounded-lg transition-smooth border border-gray-700 hover:border-gray-600 font-medium"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={onAllow}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-lg transition-smooth font-bold shadow-lg hover:shadow-primary/50"
                    >
                        Allow Location Access
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPermissionModal;
