const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

 // This middleware will run for all routes to read the JSON object ( converts JSON obj to Javascript Obj).
app.use(express.json());


/**
 * Create a user signup API, to save new user's to database.
 */
app.post("/signup", async (req, res) => {
  const newUser = req.body;
  const user = new User(newUser);
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send(`Error saving the User ${error.message}`);
  }
});

/**
 * Feed API - GET /feed Get all the users from the database.
 */
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if(!users.length) {
      res.status(404).send('Users not found');
    }
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(`Something went wrong`)
  }
});


/**
 * GET User by Id - GET /user.
 */
app.get("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findById({ _id: userId });
    if(!user) {
      res.status(404).send('Users not found');
    }
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(`Something went wrong`)
  }
});


/**
 * Delete a user by userId
 */
app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
      res.status(200).send('Error deleting the user.');
    }
    res.send(user);
  } catch (error) {
    res.status(400).send('Something went wrong.');
  }
})

/**
 * 1. Connect to the Db first and then listen to the server.
 */
connectDB()
  .then(() => {
    console.log(`Database connected successfully!!!!!`);
    // Server is listening on port 3000;
    app.listen(3000, () => {
      console.log("Server is listening on port: 3000");
    });
  })
  .catch((error) => {
    console.log(`Error connecting ot the Database!!!`);
  });
