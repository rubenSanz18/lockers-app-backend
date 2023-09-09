const fs = require("fs");
const Continent = require("../Models/continent");

const uploadContinents = (req, res) => {

    let user = req.user;

    if(user.role == "admin_role"){
        const data = JSON.parse(fs.readFileSync("../continents.json", "utf-8"));

        Continent.insertMany(data)
        .then(() => {
            return res.status(200).json({
                status: "Success",
                message: "Continents imported successfully"
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
    uploadContinents
}