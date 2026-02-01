import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';

const EmergencyContacts = () => {
    const contacts = [
        { name: 'Police', number: '100', color: 'from-blue-600 to-blue-500', icon: '🚓' },
        { name: 'Ambulance', number: '102', color: 'from-red-600 to-red-500', icon: '🚑' },
        { name: 'Fire', number: '101', color: 'from-orange-600 to-orange-500', icon: '🚒' },
        { name: 'Emergency', number: '112', color: 'from-purple-600 to-purple-500', icon: '🆘' }
    ];

    return (
        <div className="glass rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Emergency Contacts</h2>
                    <p className="text-sm text-gray-400">Quick access to emergency services</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {contacts.map((contact) => (
                    <a
                        key={contact.number}
                        href={`tel:${contact.number}`}
                        className="group relative overflow-hidden bg-dark-200 hover:bg-dark-100 border border-gray-700 hover:border-primary rounded-lg p-4 transition-smooth text-center"
                    >
                        <div className="space-y-2">
                            <div className="text-3xl">{contact.icon}</div>
                            <div>
                                <p className="text-sm font-medium text-gray-300">{contact.name}</p>
                                <p className="text-2xl font-bold text-white mt-1">{contact.number}</p>
                            </div>
                            <div className="flex items-center justify-center space-x-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-smooth">
                                <Phone className="h-3 w-3" />
                                <span>Tap to call</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-xs text-amber-400 text-center">
                    ⚠️ For life-threatening emergencies, call immediately. These numbers are for Bharat.
                </p>
            </div>
        </div>
    );
};

export default EmergencyContacts;
