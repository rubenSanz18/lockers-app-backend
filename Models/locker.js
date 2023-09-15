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
    compartments: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: 'It must be an integer number'
        },
        required: true
    },
    packets: [{
        type: Schema.Types.ObjectId,
        ref: "Packet"
    }]
})
module.exports = model("Locker", LockerSchema, "lockers");