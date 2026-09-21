// Logic to connect to the cluster.
const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://akshayborana1_db_user:u4hSlX6LLum9fwKG@namastenode.iyqpwet.mongodb.net/');
}

connectDB()
    .then(() => {
        console.log(`Databse connected successfully!!!!!`);
    })
    .catch(error => {
        console.log(`Error connecting ot the Database!!!`)
    });