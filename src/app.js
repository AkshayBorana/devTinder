const express = require('express');
const app = express();


app.get("/getUserData", (req, res) => {
    // logic of  Db call and get user data.
    res.send("User available...");
})

// Server is listening on port 3000;
app.listen(3000, () => {
    console.log('Serveer is listening on port: 3000')
});