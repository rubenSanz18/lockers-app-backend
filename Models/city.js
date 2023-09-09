const {Schema, model} = require("mongoose");

const CitySchema = Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true
    },
    numLockers: {
        type: Number,
        integer: true,
        default: 0
    }
})

module.exports = model("City", CitySchema, "cities");