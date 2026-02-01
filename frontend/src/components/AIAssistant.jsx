import React, { useState } from 'react';
import axios from 'axios';
import { Bot, Send, Loader, Sparkles, X } from 'lucide-react';

const AIAssistant = ({ weatherData, earthquakes, aqiData, city }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your disaster intelligence assistant. Ask me about safety conditions, weather patterns, or seismic activity in ${city || 'your area'}.`
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call backend AI chat API with context
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        message: input,
        context: {
          weather: weatherData,
          earthquakes: earthquakes,
          aqi: aqiData,
          city: city
        }
      });

      const aiResponse = response.data.response;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Removed old generateSmartResponse function - now using real AI!

  return (
    <>
      {/* floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110 z-50 group"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6 group-hover:animate-pulse" />
        )}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>

      {/* chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[600px] glass rounded-2xl shadow-2xl z-50 flex flex-col animate-slide-up border border-gray-700">
          {/* header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <Bot className="h-6 w-6 text-white" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div className="ml-3">
                <h3 className="text-white font-bold flex items-center">
                  AI Assistant
                  <Sparkles className="h-4 w-4 ml-2 animate-pulse-slow" />
                </h3>
                <p className="text-orange-100 text-xs">Disaster Intelligence</p>
              </div>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-dark-200 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-dark-200 text-gray-200 p-3 rounded-2xl rounded-bl-none border border-gray-700">
                  <Loader className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about safety conditions..."
                className="flex-1 bg-dark-200 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-white p-2 rounded-xl transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;