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
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
    ]); // This will give us the first name and last name of the user who sent the request.

    if (!connectionRequests || !connectionRequests?.length) {
      return res.status(404).json({ message: `No requests found!` });
    }

    res.status(200).json({ data: connectionRequests });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ]);

    const data = connectionRequests.map((el) => {
        if(el.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return el.toUserId;
        }
        return el.fromUserId;
    });

    if (!data || !data?.length) {
      throw new Error("No connection found");
    }

    res
      .status(200)
      .json({ message: `Connection fetched successfully`, data });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = userRouter;
