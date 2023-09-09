const {Schema, model} = require("mongoose");

const AddressSchema = Schema({
    street: {
        type: String,
        required: true
    },
    postalCode: {
        type: Number,
        integer: true,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})
module.exports = model("Address", AddressSchema, "addresses");