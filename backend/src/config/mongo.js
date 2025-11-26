const mongoose = require("mongoose");
require("dotenv").config();

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("🚀 MongoDB conectado con éxito");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }
}

module.exports = connectMongo;
