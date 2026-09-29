const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");

/**
 * Send connection request.
 */
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { user } = req;
  res.send(`${user.firstName} sent a connection request.`);
})

module.exports = requestRouter;