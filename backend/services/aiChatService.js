const axios = require('axios');

/**
 * AI Chat Service using Groq
 * Provides intelligent responses about disaster risk using real-time data
 */

/**
 * Get AI response for user query with disaster context
 * @param {string} userMessage - User's question
 * @param {Object} context - Disaster data context (weather, earthquakes, aqi, city)
 * @returns {Promise<string>} AI response
 */
async function getAIResponse(userMessage, context = {}) {
    try {
        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        if (!GROQ_API_KEY) {
            console.warn('Groq API key not configured');
            return 'AI service is currently unavailable. Please check the API configuration.';
        }

        const { weather, earthquakes, aqi, city } = context;

        // Build context summary for AI
        let contextInfo = `You are a disaster risk analysis expert assistant. `;

        if (city) {
            contextInfo += `The user is asking about ${city}. `;
        }

        if (weather) {
            const temp = weather.main?.temp ? Math.round(weather.main.temp - 273.15) : null;
            const desc = weather.weather?.[0]?.description || 'N/A';
            const humidity = weather.main?.humidity || 'N/A';
            const windSpeed = weather.wind?.speed || 'N/A';

            contextInfo += `Current weather: ${temp}°C, ${desc}, humidity ${humidity}%, wind speed ${windSpeed} m/s. `;
        }

        if (aqi) {
            const aqiValue = aqi.list?.[0]?.main?.aqi || 0;
            const aqiScore = aqiValue * 50;
            contextInfo += `Air Quality Index: ${aqiScore.toFixed(0)} (${aqiValue === 1 ? 'Good' : aqiValue === 2 ? 'Fair' : aqiValue === 3 ? 'Moderate' : aqiValue === 4 ? 'Poor' : 'Very Poor'}). `;
        }

        if (earthquakes && earthquakes.length > 0) {
            const recentQuakes = earthquakes.slice(0, 3);
            const quakeInfo = recentQuakes.map(eq => {
                const mag = eq.properties?.mag || 0;
                const place = eq.properties?.place || 'unknown';
                return `magnitude ${mag.toFixed(1)} at ${place}`;
            }).join(', ');
            contextInfo += `Recent earthquakes: ${quakeInfo}. `;
        }

        // AI System Prompt
        const systemPrompt = `You are a friendly and knowledgeable disaster risk analysis assistant for DisasterSense. 
You help users understand disaster risks, weather patterns, seismic activity, and safety conditions.

${contextInfo}

Provide helpful, accurate, and concise responses. Be empathetic and prioritize safety.
If asked about current conditions, use the context provided above.
Keep responses under 100 words unless more detail is needed.
Use a friendly, professional tone.`;

        // Call Groq API
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7, // More creative for conversational responses
                max_tokens: 300
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        return aiResponse;

    } catch (error) {
        console.error('Error getting AI response from Groq:', error.message);
        return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
}

module.exports = {
    getAIResponse
};
