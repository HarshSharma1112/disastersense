const express = require('express');
const router = express.Router();
const EmergencyReport = require('../models/EmergencyReport');

/**
 * POST /api/emergency/report
 * create a new emergency SOS report
 */
router.post('/report', async (req, res) => {
    try {
        const { disasterType, lat, lng, description } = req.body;

        // to validate required fields
        if (!disasterType || lat === undefined || lng === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: disasterType, lat, lng'
            });
        }

        // create new emergency report
        const report = new EmergencyReport({
            disasterType,
            lat,
            lng,
            description: description || ''
        });

        // save to database
        const savedReport = await report.save();

        res.status(201).json({
            success: true,
            message: 'Emergency report created successfully',
            data: savedReport
        });
    } catch (error) {
        console.error('Error creating emergency report:', error);

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
            message: 'Failed to create emergency report',
            error: error.message
        });
    }
});

/**
 * GET /api/emergency/reports
 * Fetch all emergency reports (admin/demo view)
 */
router.get('/reports', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const skip = parseInt(req.query.skip) || 0;

        // fetch reports sorted by most recent first
        const reports = await EmergencyReport.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await EmergencyReport.countDocuments();

        res.json({
            success: true,
            count: reports.length,
            total: total,
            data: reports
        });
    } catch (error) {
        console.error('Error fetching emergency reports:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch emergency reports',
            error: error.message
        });
    }
});

/**
 * GET /api/emergency/reports/:id
 * fetch a specific emergency report by ID
 */
router.get('/reports/:id', async (req, res) => {
    try {
        const report = await EmergencyReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Emergency report not found'
            });
        }

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error fetching emergency report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch emergency report',
            error: error.message
        });
    }
});

module.exports = router;
