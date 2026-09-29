const validator = require('validator');

const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName) {
        throw new Error('Please enter a valid First name!');
    } else if(firstName.length < 4 || firstName.length > 30) {
        throw new Error("First name cannot be less then 4 characters or more then 30 characters!");
    } else if(!validator.isEmail(emailId)) {
        throw new Error('Please enter a valid email address!');
    } 
    // else if(!validator.isStrongPassword(password)) {
    //     throw new Error('Please enter a strong password!');
    // }
};

const validateEditProfileData = (req) => {
    // Lits of fields the user can update in it's profile
    const allowedEditFields = [
        "age",
        "gender",
        "about",
        "photoUrl",
        "skills",
        "lastName",
        "firstName"
    ];

    const isUpdateAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isUpdateAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData };