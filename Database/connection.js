const mongoose = require("mongoose");

const connection = async() => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/lockersApp");
        console.log("Connected to the database");
    }catch(error){
        console.log(error);
        throw new Error("It wasn't possible to connect to the database");
    }
}

module.exports = {
    connection
}