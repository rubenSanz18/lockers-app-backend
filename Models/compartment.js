const {Schema, model} = require("mongoose");

const CompartmentSchema = Schema({
    lockerID: {
        type: String,
        required: true
    },
    compNumber: {   
        type: Number,   
        integer: true,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

module.exports = model("Compartment", CompartmentSchema, "compartments");