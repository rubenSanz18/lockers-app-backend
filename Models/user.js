const {Schema, model} = require("mongoose");
const City = require("./city");
const Country = require("./country");
const Continent = require("./continent");

const UserSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: City,
        required: true
    },
    country: {
        type: Country,
        required: true
    },
    continent: {
        type: Continent,
        required: true
    },
    packets: {
        type: [Packet],
        default: []
    }
})
module.exports = model("User", UserSchema, "users");