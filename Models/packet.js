const {Schema, model} = require("mongoose");
const moment = require("moment");

const PacketSchema = Schema({
    orderDate: {
        type: Date,
        default: Date.now
    },
    arrivalDate:  {
        type: Date,
        default: () => moment().add(2, "days").toDate()
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