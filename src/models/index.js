"use strict";
require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorsAliases: false,
    retry: {
      match: [
        Sequelize.ConnectionError,
        Sequelize.ConnectionTimedOutError,
        Sequelize.TimeoutError,
        Sequelize.ConnectionRefusedError,
      ],
      max: 25,
      backoffBase: 5000,
      backoffExponent: 1.5,
    },
  }
);


sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.parking = require("./ParkingModel.js")(sequelize, DataTypes);
db.parking_user = require("./ParkingUserModel.js")(sequelize, DataTypes);
db.user = require("./UserModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});

db.user.hasOne(db.parking, {
  foreignKey: "admin_id",
  as: "parking",
});

db.parking.belongsTo(db.user, {
  foreignKey: "admin_id",
  as: "user",
});

db.user.hasMany(db.parking_user, {
  foreignKey: "user_id",
  as: "parking_user",
});

db.parking_user.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.parking.hasMany(db.parking_user, {
  foreignKey: "parking_id",
  as: "parking_user",
});

db.parking_user.belongsTo(db.parking, {
  foreignKey: "parking_id",
  as: "parking",
});

module.exports = db;
