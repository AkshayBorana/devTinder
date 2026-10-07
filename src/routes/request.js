const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");

/**
 * Send connection request to a user with statues ( Interested or Ignored ).
 */
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params; // ignored or interested

    const allowedStatuses = ['ignored', 'interested'];

    // User cannot send request to self.
    if(fromUserId.toString() === toUserId) {
      return res.status(400).json({message: "Action not allowed!"});
    }

    // Check for allowed statues while sending a connection request: ignored and interested.
    if(!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status type ${status}`
      });
    };
    
    // Check if the toUserId is a valid valid 24-character hex string
    if(!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ message: `Error: Not a valid Id!`});
    }

    // Check if the user exists ( user here is the receiver).
    const toUser = await User.findById(toUserId);
    if(!toUser) {
      return res.status(404).json({message: "User not found!"});
    }

    // Check if a connection already exists between User A --> B or User B--> A
    const existingConnecitonRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });
    // If a connection already exisits, throw an error.
    if(existingConnecitonRequest) {
      return res.status(400).json({ message: `Connection request already exists!`});
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId, toUserId, status
    });

    const data = await connectionRequest.save(); // Save connection request to DB.
    if (data) {
      //Send response back from the server.
      res.json({
        message: `Request sent successfully!`,
        data: data,
      });
    } else {
      throw new Error(`Error sending connection.`)
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

/**
 * 
 * Review a connection request by either accepting or rejecting it.
 */
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;

    // Validate incoming request status.
    const allowedStatues = ['accepted', 'rejected'];
    if(!allowedStatues.includes(status)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    // Validate if the requestId is a valid MongooDB Id.
    if(!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new Error("Invalid request!");
    }

    // Validate the toUserId, only allow the request with interested statues to be either accepted/rejected, validate requestId exists in DB.

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested'
    });

    if(!connectionRequest) {
      return res.status(404).json({ message: `Connection request not found!` });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.status(200).json({ message: `Connection request ${status}`, data })
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
})

module.exports = requestRouter;