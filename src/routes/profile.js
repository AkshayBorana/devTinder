const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


/**
 * Get user profile API
 */
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

module.exports = profileRouter;