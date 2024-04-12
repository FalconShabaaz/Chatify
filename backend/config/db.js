const mongoose = require('mongoose');
const colors = require('colors')

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect("mongodb+srv://mohammedShabaaz:j1ao8tcvhFt7iB47@cluster0.7lhydzd.mongodb.net/?retryWrites=true&w=majority",{
        });
        console.log(`MongoDB Connected : ${conn.connection.host} `.bgBlue.bold);
    }
    catch(error){
        console.log(`error : ${error.message}`);
        console.log("MongoDB Connection Failed!".red.bold);
        process.exit();
    }
}

module.exports = connectDB;