const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token. Please login again!");
    }
    // token verification, if verified it gives back the verified user.
    const decodedMessage = await jwt.verify(token, "SECRET_DEV@Tinder2026");
    // Find user from the DB.
    const { _id } = decodedMessage;
    const user = await User.findById({ _id });

    if (!user) {
      throw new Error(`User not found. Please login`);
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
};

module.exports = {
  userAuth,
};
