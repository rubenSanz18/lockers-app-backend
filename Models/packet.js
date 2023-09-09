const {Schema, model} = require("mongoose");

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
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    locker: {
        type: Schema.Types.ObjectId,
        ref: "Locker",
        required: true
    }
})
module.exports = model("Packet", PacketSchema, "packets");