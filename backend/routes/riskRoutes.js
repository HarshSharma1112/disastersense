const express = require('express');
const router = express.Router();
const RiskLog = require('../models/RiskLog');

/**
 * POST /api/risk/log
 * Log a risk score calculation
 */
router.post('/log', async (req, res) => {
    try {
        const { city, riskScore } = req.body;

        // validate required fields
        if (!city || riskScore === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: city, riskScore'
            });
        }

        // create new risk log
        const riskLog = new RiskLog({
            city,
            riskScore
        });

        // save to database
        const savedLog = await riskLog.save();

        res.status(201).json({
            success: true,
            message: 'Risk score logged successfully',
            data: savedLog
        });
    } catch (error) {
        console.error('Error logging risk score:', error);

        // handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to log risk score',
            error: error.message
        });
    }
});

/**
 * GET /api/risk/logs?city=CityName
 * fetch risk logs, optionally filtered by city
 */
router.get('/logs', async (req, res) => {
    try {
        const { city } = req.query;
        const limit = parseInt(req.query.limit) || 100;
        const skip = parseInt(req.query.skip) || 0;

        // build query
        const query = city ? { city: new RegExp(city, 'i') } : {};

        // fetch logs sorted by most recent first
        const logs = await RiskLog.find(query)
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip);

        const total = await RiskLog.countDocuments(query);

        res.json({
            success: true,
            count: logs.length,
            total: total,
            data: logs
        });
    } catch (error) {
        console.error('Error fetching risk logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch risk logs',
            error: error.message
        });
    }
});

module.exports = router;

