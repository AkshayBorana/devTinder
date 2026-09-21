const express = require("express");
const app = express();
const connectDB = require("./config/database");

/**
 * 1. Connect to the Db first and then listen to the server.
 */
connectDB()
  .then(() => {
    console.log(`Databse connected successfully!!!!!`);
    // Server is listening on port 3000;
    app.listen(3000, () => {
      console.log("Serveer is listening on port: 3000");
    });
  })
  .catch((error) => {
    console.log(`Error connecting ot the Database!!!`);
  });
