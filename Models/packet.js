const {Schema, model} = require("mongoose");
const User = require("./user");
const Locker = require("./locker");

const PacketSchema = Schema({
    weight: {
        type: Number,
        required: true
    },
    arrivalDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: User,
        required: true
    },
    locker: {
        type: Locker,
        required: true
    }
})
module.exports = model("Packet", PacketSchema, "packets");