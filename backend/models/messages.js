const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Chat = sequelize.define("message", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: Sequelize.STRING,
  receivedBy: Sequelize.STRING,
  sentBy: Sequelize.STRING,
});

module.exports = Chat;
