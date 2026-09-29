const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // Makes the field required
      minLength: 4,
      maxLength: 30
    },
    lastName: {
      type: String,
      require: true
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // Makes the emailId uqniue in the DB. Throws error if another user enters same emailId. Won't allow adding same emailId in the DB
      lowercase: true, // Stored the emailId in lowercase, even if user it in uppercase/mix.
      trim: true, // To trim the whitespaces before and after the email
      validate(email) {
        if(!validator.isEmail(email)) {
            throw new Error('Please enter valid email address.');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6, // Makes the password take more then 6 characters/number/string in length
    },
    age: {
      type: Number,
      min: 18, // Only 18 years old users allowed to signup.
    },
    gender: {
      type: String,
      lowercase: true,
      validate: {
        validator: (value) => {
          return ["male", "female", "other"].includes(value);
        },
        message: "Please enter a valid Gender.",
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "Your default description.", // Default value that gets stored in the DB if user doen't provide one.
      maxLength: 200, // Take only 200 characters only.
    },
    skills: {
      type: [String],
      validate: {
        validator: (skills) => {
          return Array.isArray(skills) && skills.length <= 10;
        },
        message: "Only upto 10 skills are allowed.",
      },
    },
    mobile: {
      type: Number,
      minLength: 10,
      unique: true
    },
  },
  { timestamps: true },
);

/**
 * Method generates JWT toke for a user.
 * @returns jwt token
 */
userSchema.methods.getJWT = async function() {
  const user = this;
  const jwtToken = await jwt.sign({ _id: user._id }, "SECRET_DEV@Tinder2026", { expiresIn: "1h"});
  return jwtToken;
}

/**
 * 
 * @param {userPassword: string} userInputPassword 
 * @returns if the user is validated/not
 */
userSchema.methods.validatePassword = async function(userInputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(userInputPassword, passwordHash);
  return isPasswordValid;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
