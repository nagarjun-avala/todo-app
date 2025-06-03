const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection established");
    });
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
// Note: The above code assumes that the MongoDB connection string is set in the environment variables.
