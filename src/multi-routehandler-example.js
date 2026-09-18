
const express = require('express');
const app = express();

// Example: Multi router handle,if you want the 2nd route handler to send response use next();
app.get(
  "/user",
  (req, res, next) => {
    console.log("1st response");
    next();
  },
  (req, res) => {
    console.log("2nd response");
    res.send("2nd Response");
  },
);

// Example: Multi router handles
app.get(
  "/product",
  (req, res, next) => {
    console.log("1st response");
    next();
  },
  (req, res, next) => {
    console.log("2nd response");
    next();
  },
    (req, res) => {
    console.log("3rd response");
    next();
  },
    (req, res) => {
    console.log("4th response");
    next();
  },
    (req, res) => {
    console.log("5th response");
    res.send("5th Response");
  },
);


// Example: Multi router handlers
app.get(
  "/product",
  [(req, res, next) => {
    console.log("1st response");
    next();
  }],
  (req, res, next) => {
    console.log("2nd response");
    next();
  },
    (req, res) => {
    console.log("3rd response");
    next();
  },
    (req, res) => {
    console.log("4th response");
    next();
  },
    (req, res) => {
    console.log("5th response");
    res.send("5th Response");
  },
);


// Example: Multi router handlers
app.get(
  "/product",
  [(req, res, next) => {
    console.log("1st response");
    next();
  },
  (req, res, next) => {
    console.log("2nd response");
    next();
  },
    (req, res) => {
    console.log("3rd response");
    next();
  },
    (req, res) => {
    console.log("4th response");
    next();
  }],
    (req, res) => {
    console.log("5th response");
    res.send("5th Response");
  },
);

// Server is listening on port 3000;
app.listen(3200, () => {
    console.log('Serveer is listening on port: 3000')
});