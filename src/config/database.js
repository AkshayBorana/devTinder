// Logic to connect to the cluster.
// Connecting to the Mongoose Cluster ( NamasteNode )
// A Cluster can have multiple databases.
const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://akshayborana1_db_user:u4hSlX6LLum9fwKG@namastenode.iyqpwet.mongodb.net/devTinder'); // devTinder is the name of the Database, the rest of the url is the Cluster's url.
}

module.exports = connectDB;