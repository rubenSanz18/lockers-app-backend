const {Schema, model} = require("mongoose");

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
    packets: [{
        type: Schema.Types.ObjectId,
        ref: "Packet",
    }],
    role: {
        type: String,
        default: "user_role"
    }
})
module.exports = model("User", UserSchema, "users");