const {Schema, model} = require("mongoose");
const Country = require("./country");

const CitySchema = Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: Country,
        required: true
    },
    numLockers: {
        type: Number,
        integer: true,
        default: 0
    }
})

module.exports = model("City", CitySchema, "cities");