const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

 // This middleware will run for all routes to read the JSON object ( converts JSON obj to Javascript Obj).
app.use(express.json());


/**
 * Create a user signup API, to save new user's to database.
 */
app.post("/signup", async (req, res) => {
  const newUser = req.body;
  const user = new User(newUser);
  try {

    // Added api level validation for required fields.
    const { firstName, emailId, password, skills, age, about } = user;
    if(!firstName.length || !emailId || !password) {
      throw new Error("Please fill all required fields.")
    }

    // password min lenght check.
    if(password?.length < 6) {
      throw new Error('Password must be atleast 6 characters or more.');
    }

    // Check user's age ( only above 18 allowed )
    if(age < 18) {
      throw new Error("Only 18years above can signup.");
    }

    // Only allow user to enter 10skills.
    if((Array.isArray(skills) && skills.length > 10)) {
      throw new Error("Skills cannot be more then 10.");
    }

    // Description field cannot be more then 200 characters.
    if(about.lenght > 200) {
      throw new Error("Description caannot be more then 200 characters.");
    }

    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send(`Error saving the User ${error.message}`);
  }
});

/**
 * Feed API - GET /feed Get all the users from the database.
 */
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if(!users.length) {
      res.status(404).send('Users not found');
    }
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(`Something went wrong`)
  }
});


/**
 * GET User by Id - GET /user.
 */
app.get("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findById({ _id: userId });
    if(!user) {
      res.status(404).send('Users not found');
    }
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(`Something went wrong`)
  }
});


/**
 * Delete a user by userId
 */
app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
      res.status(200).send('Error deleting the user.');
    }
    res.send(user);
  } catch (error) {
    res.status(400).send('Something went wrong.');
  }
});


/**
 * Update the user /PATCH API to update a user by userId
 */
app.patch("/user/:userId", async (req, res) => {
  console.log(req.body);
  const updateUser = req.body;
  const userId = req.params?.userId;

  try {
    // Only these fields are allowed to be updated.
    const allowed_fields = [
      "lastName",
      "gender",
      "photoURL",
      "about",
      "skills",
      "password"
    ];
    const isUpdatedAllowed = Object.keys(updateUser).every((k) =>
      allowed_fields.includes(k),
    );

    // Check only allowed fields can be updated.
    if (!isUpdatedAllowed) {
      throw new Error("Update not allowed");
    }

    // Gender must match.
    const { gender, skills, password, about } = updateUser;
    if(gender && !["male", "female", "other"].includes(gender)) {
      throw new Error("Please add a valid Gender");
    }

    // Throw error if skills are exceed more then 10.
    if(Array.isArray(skills) && skills.length > 10) {
      throw new Error("Skills cannot be more then 10.");
    }

    // Password cannot be more less then 6 characters.
    if(password && password.length < 6) {
      throw new Error('Password must be atleast 6 characters or more.');
    }

    if(about && about.lenght > 200) {
      throw new Error("Description cananot be more then 200 characters.");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, updateUser, {
      runValidators: true, // custom options can be passed inside an object. runValidators makes sure validation/custom validations runs on updates/patches, unlike just working on new documents beign added to the DB.
    });
    if (!user) {
      res.status(404).send("User not found!");
    }
    res.status(200).send("User data updated successfully");
  } catch (error) {
    res.status(400).send(`Something went wrong! ${error.message}`);
  }
});

/**
 * Update user via user emailId
 */
// app.patch("/user", async (req, res) => {
//   const user = req.body;
//   const emailId = user.emailId;

//   // Only these fields are allowed to be updated.
//   const allowed_fields = ["userId", "lastName", "gender", "photoURL", "about", "skills"];
//   const isUpdatedAllowed = Object.keys(user).every(k => allowed_fields.includes(k));

//   if(!isUpdatedAllowed) {
//     res.status(400).send("Update not allowed.");
//   }

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       {
//         emailId: emailId // emailId on which it will run the filteration.
//       }, 
//       user, // new updated user object
//       {
//         runValidators: true // custom options can be passed inside an object. runValidators makes sure validation/custom validations runs on updates/patches, unlike just working on new documents beign added to the DB.
//       }
//     );
//     if(!updatedUser) {
//       res.status(404).send('User not found!');
//     } else {
//       res.status(200).send('User data updated successfully!');
//     }
//   } catch (error) {
//     res.status(400).send('Something went wrong!');
//   }
// });


/**
 * 1. Connect to the Db first and then listen to the server.
 */
connectDB()
  .then(() => {
    console.log(`Database connected successfully!!!!!`);
    // Server is listening on port 3000;
    app.listen(3000, () => {
      console.log("Server is listening on port: 3000");
    });
  })
  .catch((error) => {
    console.log(`Error connecting ot the Database!!!`);
  });
