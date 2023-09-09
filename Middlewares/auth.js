const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../Services/jwt");
const secret = libjwt.secret;

const auth = (req, res, next) => {
    if(!req.headers.authorization)
        return res.status(403).json({
            status: "Error",
            message: "The request has no authorization header"
        })

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        let payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix())
            return res.status(401).json({
                status: "Error",
                message: "Expirated token",
                error: error
            })
        req.user = payload

        next();
    }catch(error){
        return res.status(404).json({
            status: "Error",
            message: "Invalid token",
            error: error
        })
    }
}

module.exports = {
    auth
}