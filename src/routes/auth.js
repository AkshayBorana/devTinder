const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

/**
 * Create a user signup API, to save new user's to database.
 */
authRouter.post("/signup", async (req, res) => {
  try {
    // STEP 1: First thing is to validate the data.
    // write this validator func in try/catch. If error occurs catch will catch it and throw an error.
    validateSignUpData(req);
    // STEP 2: Encrypt password and then store in the the DB.
    const { firstName, lastName, emailId, password, mobile } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new user object.
    const newUser = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      mobile,
    };
    // Creating a new instance of User model.
    const user = new User(newUser);
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send(`Error saving the User ${error.message}`);
  }
});

/**
 * Login API
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // If either of emailId or password is not present.
    if (!emailId || !password) {
      throw new Error(`Please enter valid emailId and password to login`);
    }

    // Find user from emailId in DB
    const user = await User.findOne({ emailId });
    // Check if email id exists or not.
    if (!user) {
      throw new Error("User does not exists. Please signup!");
    }
    //User password validation moved to DB Schema methods.
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Getting jwt token from User schema ( Added a off-loader function to DB)
      const jwtToken = await user.getJWT();

      // Add the JWT token into a Cookie and send the response back to the server.
      res.cookie("token", jwtToken);
      res.send(`Login successfull!`);
    } else {
      throw new Error("Invalid credentials. Please try again!");
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

/**
 * Logout API to logout a user.
 */
authRouter.post("/logout", async(req, res) => {
  // Remove token form the cookie and expire the cookie.
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .status(200)
    .send(`Logout Successfull.`);
});

module.exports = authRouter;
