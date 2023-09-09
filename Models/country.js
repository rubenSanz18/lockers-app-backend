const {Schema, model} = require("mongoose");

const CountrySchema = Schema({
    name: {
        type: String,
        required: true
    },
    continent: {
        type: Schema.Types.ObjectId,
        ref: "Continent",
        required: true
    }
})

module.exports = model("Country", CountrySchema, "countries");