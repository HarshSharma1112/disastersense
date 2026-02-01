const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../services/aiChatService');

/**
 * POST /api/ai/chat
 * Get AI response for user message with disaster context
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Get AI response
        const aiResponse = await getAIResponse(message, context);

        res.json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        console.error('Error in AI chat route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get AI response',
            error: error.message
        });
    }
});

module.exports = router;
