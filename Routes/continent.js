const express = require("express");
const router = express.Router();
const continentController = require("../Controllers/continent");
const auth = require("../Middlewares/auth");

router.post("/uploadContinents", auth.auth, continentController.uploadContinents);

module.exports = router;