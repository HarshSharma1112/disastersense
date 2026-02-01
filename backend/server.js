const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/disastersense';

//  so to connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log(`📊 Database: ${mongoose.connection.name}`);

        //  so to start server after successful database connection
        app.listen(PORT, () => {
            console.log(`🚀 DisasterSense API server running on port ${PORT}`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
            console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
            console.log(`\n📋 Available endpoints:`);
            console.log(`   GET  /api/responders?lat=XX&lng=YY`);
            console.log(`   POST /api/emergency/report`);
            console.log(`   GET  /api/emergency/reports`);
            console.log(`   POST /api/risk/log`);
            console.log(`   GET  /api/risk/logs`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('\n⚠️  Make sure MongoDB is running:');
        console.error('   - Local: mongod');
        console.error('   - Or update MONGODB_URI in .env to use MongoDB Atlas');
        process.exit(1);
    });

// handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (error) => {
    console.error('MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
});

//shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});
