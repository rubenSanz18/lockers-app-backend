const {Schema, model} = require("mongoose");

const LockerSchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
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