const mongoose = require('mongoose');

const connectDb  = async() => {
    // Connection to cluster
    // await mongoose.connect('mongodb+srv://Ishita_goswami:Ishita%40mongoDB@microservice.kmbyvka.mongodb.net/')

    // Connection to database
    await mongoose.connect('mongodb+srv://Ishita_goswami:Ishita%40mongoDB@microservice.kmbyvka.mongodb.net/devTinder')
}    

module.exports = connectDb