const express = require("express");
const router = express.Router();
const cityController = require("../Controllers/city");
const auth = require("../Middlewares/auth");

router.post("/uploadContinents", auth.auth, cityController.uploadCities);

module.exports = router;