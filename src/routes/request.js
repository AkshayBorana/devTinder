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

// requestRouter.patch("/request/review/:status/:requestId", userAuth, async (req, res) => {
//   try {
//     const requestId = req.params._id;
//     const status = req.params.status;

//     const updatedConnection = await ConnectionRequest.findByIdAndUpdate(requestId, {})

//   } catch (error) {
    
//   }
// })

module.exports = requestRouter;