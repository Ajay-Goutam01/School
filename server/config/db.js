const mongoose = require("mongoose");

const connectionCache = globalThis.__schoolMongoConnection || {
  promise: null,
};

globalThis.__schoolMongoConnection = connectionCache;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionCache.promise) {
    connectionCache.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((error) => {
        connectionCache.promise = null;
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
      });
  }

  return connectionCache.promise;
};

module.exports = connectDB;
