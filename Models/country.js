const {Schema, model} = require("mongoose");
const Continent = require("./continent");

const CountrySchema = Schema({
    name: {
        type: String,
        required: true
    },
    continent: {
        type: Continent,
        required: true
    }
})

module.exports = model("Country", CountrySchema, "countries");