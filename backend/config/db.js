const mongoose = require("mongoose");

// In serverless environments (Vercel) a new module instance can be reused
// across invocations, so we cache the connection promise to avoid
// reconnecting to Atlas on every request.
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Atlas connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Locally (npm run dev) it's fine to crash loudly; in serverless we
    // instead let the caller decide how to respond to the request.
    if (require.main === module) process.exit(1);
    throw error;
  }
};

module.exports = connectDB;
