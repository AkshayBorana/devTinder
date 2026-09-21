const express = require('express');
const app = express();
// importing admin auth middleware
const { adminAuth } = require('./middlewares/auth');

// Creating a middleware to check if the user is authorized/not for only all /admin routes
app.use('/admin', adminAuth);


// Example to check if user is authoriized ot not..
app.get("/admin/getAllData", (req, res) => {
    res.status(200).send("Sending all data successfully"); 
});

// Example to check if user is authoriized ot not..
app.delete("/admin/delete", (req, res) => {
    res.status(200).send("User deleted successfuly"); 
});

// Server is listening on port 3000;
app.listen(3000, () => {
    console.log('Serveer is listening on port: 3000')
});