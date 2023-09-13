const axios = require("axios");

async function validateAddress(address, city) {
    const apiURL = "https://nominatim.openstreetmap.org/search?";
    const params = {
        q: address,
        format: "json"
    };

    try{
        const response = await axios.get(apiURL, {params})
        const results = response.data;
        console.log(results[0]);
        if(results.length > 0 && results[0].display_name.includes(city)){
            return true;
        }
        else
            return false;
    }
    catch (error){
        throw error;
    }
}

module.exports = {
    validateAddress
}