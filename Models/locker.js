const {Schema, model} = require("mongoose");
const City = require("./city");
const Address = require("./address");

const LockerSchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: Address,
        required: true
    },
    city: {
        type: City
    },
    smallCompartments: {
        type: Number,
        integer: true
    },
    largeCompartments: {
        type: Number,
        integer: true
    }
})
module.exports = model("Locker", LockerSchema, "lockers");