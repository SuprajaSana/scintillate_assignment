const User = require("../models/users");
const Messages = require("../models/messages");
const path = require("node:path");
const { and, Op } = require("sequelize");

exports.sendMessages = async (req, res, next) => {
  const msg = req.body.msg;
  const receivername = req.body.name;

  await Messages.create({
    message: msg,
    receivedBy: receivername,
    userId: req.user.id,
    sentBy: req.user.username,
  })
    .then((message) => {
      res.status(201).json({
        success: true,
        message: "Successfully sent message",
        messages: message,
      });
    })
    .catch((err) => {
      res.status(500).json({ success: true, message: err });
    });
};

exports.getMessages = async (req, res, next) => {
  const name = req.query.receiver;
  await Messages.findAll({
    where: {
      [Op.or]: [
        { receivedBy: name, sentBy: req.user.username },
        { receivedBy: req.user.username, sentBy: name },
      ],
    },
  })
    .then((messages) => {
      res.status(200).json({
        messages: messages,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
