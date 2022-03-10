const mongoose = require("mongoose");

const connect_db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoDB_Connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.log("Error Connecting to MongoDB:", error.message);
    process.exit();
  }
};

module.exports = connect_db;
