const express = require('express');
const app = express();


// Request handler. This will respond to localhost:3000 or localhost:3000/test or localhost:3000/hello or localhost:3000/helloworl
// app.use((req, res) => {
//     console.log('Hello from the server');
// });

// How to make your server respond to a specific route.
app.use("/", (req, res) => {
    res.send('hello')
})

app.listen(3000, () => {
    console.log('Serveer is listening on port: 3000')
}); // Server is listening on port 3000;