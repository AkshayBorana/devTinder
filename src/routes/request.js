const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

/**
 * Send connection request to a user with statues ( Interested or Ignored ).
 */
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params; // ignored or interested

    const allowedStatuses = ['ignored', 'interested'];

    if(!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status type ${status}`
      });
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