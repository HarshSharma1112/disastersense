const express = require('express');
const router = express.Router();
const { findNearestResponders } = require('../services/mapsService');

/**
 * GET /api/responders?lat=XX&lng=YY
 * Find nearest emergency responders (hospitals and police stations)
 */
router.get('/', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // validate query parameters
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: lat and lng'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // validate coordinate ranges
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates: lat and lng must be numbers'
            });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinate ranges'
            });
        }

        // fetch nearest responders
        const responders = await findNearestResponders(latitude, longitude);

        res.json({
            success: true,
            count: responders.length,
            data: responders
        });
    } catch (error) {
        console.error('Error in responder route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch nearest responders',
            error: error.message
        });
    }
});

module.exports = router;


