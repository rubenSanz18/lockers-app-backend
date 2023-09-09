const {Schema, model} = require("mongoose");

const ContinentSchema = Schema({
    name: {
        type: String,
        required: true
    }
})
module.exports = model("Continent", ContinentSchema, "continents");