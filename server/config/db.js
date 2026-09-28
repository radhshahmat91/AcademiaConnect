const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    console.error('Is MongoDB running, and is MONGO_URI in server/.env correct?');
    throw err;
  }
};

module.exports = connectDB;
