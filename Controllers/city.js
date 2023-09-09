const fs = require("fs");
const City = require("../Models/city");

const uploadCities = (req, res) => {
    let user = req.user;

    if(user.role == "admin_role"){
        const data = JSON.parse(fs.readFileSync("../cities.json", "utf-8"));

        City.insertMany(data)
        .then(() => {
            return res.status(200).json({
                status: "Success",
                message: "Cities imported successfully"
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
    uploadCities
}