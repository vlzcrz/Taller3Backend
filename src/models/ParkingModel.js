module.exports = (sequelize, DataTypes) => {
  const Parking = sequelize.define(
    "parking",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      base_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      floor_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      places_per_floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "parkings",
      sequelize,
      modelName: "ParkingModel",
    }
  );
  return Parking;
};
