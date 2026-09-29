const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");

/**
 * Get user profile API
 */
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
  try {
    if(!validateEditProfileData(req)) {
      throw new Error("Profile update not allowed.");
    }

    const loggedInUser = req.user; // We get this data from the auth middleware. It verifies the user and attaches it to the request.

    const updatedFieldsObject = req.body;
    Object.keys(updatedFieldsObject).forEach(field => (loggedInUser[field] = updatedFieldsObject[field]));

    const user = await User.findByIdAndUpdate(loggedInUser._id, loggedInUser, {
      runValidators: true,
    });

    // OR ( ways of saving user data )
    // await loggedInUser.save()
    // for this adda check too 

    if(!user) {
      throw new Error("Error updating your profile.")
    }

    // res.status(200).send(`${loggedInUser.firstName} your profile was updated successfully!`);

    //OR
    // Another way to send response back.

    res.json({
      message: `${loggedInUser.firstName} your profile was updated successfully!`,
      data: loggedInUser
    })

  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
})

module.exports = profileRouter;