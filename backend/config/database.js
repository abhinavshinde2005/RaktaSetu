const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ MongoDB Connected Successfully\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('\n🔧 Solutions:');
    console.log('1. Check internet connection');
    console.log('2. Whitelist IP in MongoDB Atlas (0.0.0.0/0)');
    console.log('3. Verify credentials in .env');
    console.log('4. Try mobile hotspot');
    console.log('5. Install local MongoDB\n');
    process.exit(1);
  }
};

module.exports = { connectDB };
