const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user");
//const auth = require("../middlewares/auth");

router.post("/register", userController.register);

module.exports = router;