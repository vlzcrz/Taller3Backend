module.exports = (sequelize, DataTypes) => {
    const jwt = require('jsonwebtoken');

    const User = sequelize.define(
      "user",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        priority: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: "users",
        sequelize,
        modelName: "UserModel",
      }
    );

    User.prototype.generateAuthToken = function() {
        const token = jwt.sign({ id: this.id }, 'mysecretkey');
        return token;
      };
    return User;
  };
  