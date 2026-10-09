const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

/**
 * Dislay user's connections with which user has matched.
 */
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
        "skills"
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ]);

    const data = connectionRequests
    .map((el) => {
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


/**
 * Feed API
 */
userRouter.get('/user/feed', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 10 ? 10 : limit; // Adding validation to always set limit to 10 no matter. 
        const skipNumber = (page -1) * limit;

        const sentOrReceivedRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        sentOrReceivedRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId );
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const usersFeed = await User.find({
            $and: [ 
                {_id: { $nin: Array.from(sentOrReceivedRequests) }}, 
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(["firstName", "lastName", "photoUrl", "about", "age", "skills"])
        .skip(skipNumber).limit(limit);

        res.send(usersFeed);


    } catch (error) {
        res.status(400).json({ message: `Error: ${error.message}` });
    }
})



// feed?page=1&limit=10 => 1-10 .skip(0) & .limit(10)

// feed?page=2&limit=10 => 11-20 .skip(10) & .limit(10)

// feed?page=3&limit=10 => 21-30 .skip(20) & .limit(10)

// skip formula => (page - 1) * limit;


module.exports = userRouter;
