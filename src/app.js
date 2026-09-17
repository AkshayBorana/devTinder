const express = require('express');
const app = express();


// Request handler. This will respond to localhost:3000 or localhost:3000/test or localhost:3000/hello or localhost:3000/helloworl
// How to make your server respond to a specific route.

// Route 1
app.use("/hello", (req, res) => {
    res.send('hello hello hello!!')
});

// Route 2
app.use("/test", (req, res) => {
    res.send('test test test!!')
});

// Route 3 ( Wild Card Route )
/** This is a wild card route and it should be placed as the last routing in your routing file.
 * Why? Because if it's kept at the top, it by defauly matchs all the route and will send the same information, regardless of anyother route/url
 */
app.use("", (req, res) => {
    res.send('hei!!')
});


// Route 4: Make a GET request and send user data.
app.get('/user', (req, res) => {
    res.send({firstName: 'Akshay', lastName: 'Borana'});
});

// Route 5: Make a POST request and add user data.
app.post('/user', (req, res) => {
    res.send("User added successfully!!!");
});

// Route 6: Make a DELETE request and delete user data.
app.delete('/user', (req, res) => {
    res.send("User deleted successfully!!!");
});

// Route 7: Make a request to read the query params.
app.get('/user', (req, res) => {
    console.log(req.query);
    res.send("User deleted successfully!!!");
});

// Route 8: Make a /create dynamic route and read the params ( route parameters ).
app.get('/user/:userId', (req, res) => {
    console.log(req.params);
    res.send("User deleted successfully!!!");
});


// Server is listening on port 3000;
app.listen(3000, () => {
    console.log('Serveer is listening on port: 3000')
});