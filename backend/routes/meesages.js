const express = require("express");

const chatController = require("../controllers/messages");

const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.post(
  "/send/messages",
  userAuthentication.authenticate,
  chatController.sendMessages
);

router.get(
  "/get/messages",
  userAuthentication.authenticate,
  chatController.getMessages
);

module.exports = router;
