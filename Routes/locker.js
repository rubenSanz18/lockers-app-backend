const express = require("express");
const router = express.Router();
const lockerController = require("../Controllers/locker");
const auth = require("../middlewares/auth");

router.post("/create", auth.auth, lockerController.create);

module.exports = router;