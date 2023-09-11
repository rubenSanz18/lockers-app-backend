const {Schema, model} = require("mongoose");

const LockerSchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        postalCode: {
            type: Number,
            validate: {
                validator: Number.isInteger,
                message: 'Debe ser un número entero'
            },
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
    },
    smallCompartments: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: 'Debe ser un número entero'
        }
    },
    largeCompartments: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: 'Debe ser un número entero'
        }
    }
})
module.exports = model("Locker", LockerSchema, "lockers");