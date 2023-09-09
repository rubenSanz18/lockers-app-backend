const fs = require("fs");
const Country = require("../Models/country");

const uploadCountries = (req, res) => {
    let user = req.user;

    if(user.role == "admin_role"){
        const data = JSON.parse(fs.readFileSync("../country-by-name.json", "utf-8"));

        Country.insertMany(data)
        .then(() => {
            return res.status(200).json({
                status: "Success",
                message: "Countries imported successfully"
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: "Error",
                error
            })
        })
    } else{
        return res.status(400).json({
            status: "Error",
            message: "You must be an admin"
        })
    }
}

module.exports = {
    uploadCountries
}