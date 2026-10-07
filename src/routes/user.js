const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");


/**
 * Get connection requests a loggedin user has received ( only with status -> interested). 
 * We can also GET the ignored request if we wish to, just remove the status filter from the query.
 */
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequests || !connectionRequests?.length) {
      return res.status(404).json({ message: `No requests found!` });
    }

    res.status(200).json({ data: connectionRequests });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});


module.exports = userRouter;