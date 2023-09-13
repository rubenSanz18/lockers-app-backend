const {Schema, model} = require("mongoose");

const LockerSchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required:true
    },
    smallCompartments: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: 'It must be an integer number'
        },
        required: true
    },
    largeCompartments: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: 'It must be an integer number'
        },
        required: true
    }
})
module.exports = model("Locker", LockerSchema, "lockers");