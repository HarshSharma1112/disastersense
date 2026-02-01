const mongoose = require('mongoose');

const riskLogSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for querying by city
riskLogSchema.index({ city: 1, timestamp: -1 });

module.exports = mongoose.model('RiskLog', riskLogSchema);
