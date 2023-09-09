const express = require("express");
const router = express.Router();
const countryController = require("../Controllers/country");
const auth = require("../Middlewares/auth");

router.post("/uploadContinents", auth.auth, countryController.uploadCountries);

module.exports = router;