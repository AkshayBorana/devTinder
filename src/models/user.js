const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: true // Makes the field required
    },
    lastName: { 
        type: String 
    },
    emailId: { 
        type: String, 
        required: true, 
        unique: true, // Makes the emailId uqniue in the DB. Throws error if another user enters same emailId. Won't allow adding same emailId in the DB
        lowercase: true,  // Stored the emailId in lowercase, even if user it in uppercase/mix.
        trim: true // To trim the whitespaces before and after the email
    },
    password: { 
        type: String, 
        required: true,
        minLength: 6, // Makes the password take more then 6 characters/number/string in length 
    },
    age: { 
        type: Number,
        min: 18 // Only 18 years old users allowed to signup.  
    },
    gender: { 
        type: String,
        lowercase: true,
        validate: {
            validator: (value) => {
                return ["male", "female", "other"].includes(value);
            },
            message: "Please enter a valid Gender."
        } 
    },
    photoUrl: { 
        type: String 
    },
    about: { 
        type: String, 
        default: "Your default description.",  // Default value that gets stored in the DB if user doen't provide one.
        maxLength: 200 // Take only 200 characters only.
    },
    skills: { type: [String] },
    mobile: {
        type: Number,
        minLength: 10,
        unique: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
