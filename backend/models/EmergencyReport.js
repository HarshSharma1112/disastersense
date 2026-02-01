const mongoose = require('mongoose');

const emergencyReportSchema = new mongoose.Schema({
    disasterType: {
        type: String,
        required: true,
        enum: ['Flood', 'Fire', 'Earthquake', 'Landslide', 'Medical Emergency', 'Cyclone', 'Other']
    },
    lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    description: {
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// index for geospatial queries, in future i can use this for finding nearby emergency reports
emergencyReportSchema.index({ lat: 1, lng: 1 });

// index for sorting by recent reports
emergencyReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('EmergencyReport', emergencyReportSchema);

