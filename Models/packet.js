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
    userMail: {
        type: String,
        required: true
    },
    locker: {
        type: Schema.Types.ObjectId,
        ref: "Locker",
        required: true
    },
    status: {
        type: String,
        enum: [
            "Preparing",
            "Ready for delivery",
            "On the way to the locker",
            "Ready to pick up",
            "Picked up",
            "Timed out"
        ],
        default: "Preparing"
    }
})
module.exports = model("Packet", PacketSchema, "packets");