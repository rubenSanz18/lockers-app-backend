const express = require("express");
const router = express.Router();
const packetController = require("../Controllers/packet");
const auth = require("../middlewares/auth");

router.post("/order", auth.auth, packetController.order);
router.delete("/cancel/:id", auth.auth, packetController.cancel);

module.exports = router;