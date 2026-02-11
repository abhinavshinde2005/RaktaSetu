require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  console.log('Connecting to:', process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB Connection: SUCCESS');
    console.log('✅ Database Access: OK');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Collections:', collections.map(c => c.name).join(', ') || 'None yet\n');
    
    await mongoose.connection.close();
    console.log('✅ All tests passed! You can run: npm start\n');
  } catch (err) {
    console.log('❌ MongoDB Connection: FAILED');
    console.log('   Error:', err.message);
    console.log('\n🔧 Check:');
    console.log('   1. MongoDB service is running: sc query MongoDB');
    console.log('   2. Connection string in .env is correct\n');
  }
}

testConnection();
