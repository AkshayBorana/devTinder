const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

/**
 * Create a user signup API, to save new user's to database.
 */
app.post("/signup", async (req, res) => {
  const newUser = {
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "viratkohli@gmail.com",
    password: "12345",
  };
  const user = new User(newUser);

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send(`Error saving the User ${error.message}`);
  }
});

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
