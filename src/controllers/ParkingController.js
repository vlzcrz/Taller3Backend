import app from '../app';
const db = require("../models");
const Parking = db.parking;
const Parking_User = db.parking_user;

/**
  * @description
  * Esta función se encarga de obtener todos los datos de los estacionamientos.
  * @returns res.status(200).json(parkingData).
 */
const getAllParkingData = async (req, res) => {
  try {
    const parkingData = await Parking.findAll();
    res.status(200).json(parkingData);
  } catch (error) {
    console.error("Error fetching parking data:", error);
    res.status(500).json({ error: "Error fetching parking data" });
  }
};


/**
  * @description
  * Esta función se encarga de obtener todos los espacios ocupados. 
  * @returns res.status(200).json(occupiedSpaces.length).
 */
const getOccupiedSpaces = async (req, res) => {
  try {
    const occupiedSpaces = await Parking_User.findAll({
      where: {
        total_price: 0,
      },
    });
    res.json(occupiedSpaces.length);
  } catch (error) {
    console.error("Error fetching occupied spaces:", error);
    res.status(500).json({ error: "Error fetching occupied spaces" });
  }
};

/**
 * @description
 * Esta función se encarga de calcular el cobro extra por cada espacio ocupado.
 * @returns res.status(200).json({ ExtraFee }).
 */
const calculateExtraFee = async (req, res) => {
  try {
    const parkingId = 1;
    const places = await Parking_User.findAll({
      where: {
        parking_id: parkingId,
        total_price: 0,
      },
    });

    const parking = await Parking.findOne({
      where: {
        id: parkingId,
      },
    });

    var occupiedPlaces = places.length;
    if (occupiedPlaces === 0) {
      occupiedPlaces = 1;
    }
    const totalPlaces = parking.floor_count * parking.places_per_floor;
    const ExtraFee = (parking.base_price * occupiedPlaces) / totalPlaces;
    res.status(200).json({ ExtraFee });
  } catch (error) {
    console.error("Error calculating total places:", error);
    res.status(500).json({ error: "Error calculating total places" });
  }
};


/**
 * @description
 * Esta función se encarga de calcular el pago final de un usuario.
 * @returns res.status(200).json({ FinalPayment }).
 */
const calculateFinalPayment = async (req, res) => {
  try {
    const parkingId = 1;
    const userId = req.body.reservationDataInfo.response.user_id;
    const transaction = await Parking_User.findOne({
      where: {
        user_id: userId,
        total_price: 0,
      },
      order: [['entry_time', 'DESC']],
    });
    const id = transaction.id;
    const parking = await Parking.findOne({
      where: {
        id: parkingId,
      },
    });
    console.log("entry_time: ", transaction.entry_time);
    console.log("exit_time: ", transaction.exit_time);
    const dateToHours = Math.round((transaction.exit_time - transaction.entry_time)/1000);
    console.log("dateToHours", dateToHours);
    const FinalPayment = Math.round(parking.base_price + transaction.extra_fee * dateToHours);
    await transaction.update({
      total_price: FinalPayment,
    });

    res.status(200).json( FinalPayment );
  } catch (error) {
    console.error("Error calculating payment:", error);
    res.status(500).json({ error: "Error calculating payment" });
  }
};


/**
 * @description
 * Esta función se encarga de registrar el pago de un usuario.
 * @returns res.status(200).json({ registerDate }).
 */
const registerPayment = async (req, res) => {
  try{
    const parkingId = 1;
    const userId = req.body.user_id;

    var registerDate = new Date().toLocaleString("es-CL");
    const transaction = await Parking_User.findOne({
      where: {
        user_id: userId,
        total_price: 0,
      },
    });
    
    await transaction.update({
      exit_time: new Date(registerDate).toLocaleString("es-CL"),
    });
    res.status(200).json({ registerDate });
  }catch(error){
    console.error("Error registering payment:", error);
    res.status(500).json({ error: "Error registering payment" });
  }
};


/**
 * @description
 * Esta función se encarga de obtener los datos de un usuario.
 * @returns res.status(200).json( info ).
 */
const getParkingUserData = async (req, res) => {
  try{
    const parkingId = req.body.parking_id;
    const userId = req.body.user_id;

    const info = await Parking_User.findOne({
      where: {
        parking_Id: parkingId,
        user_Id: userId,
        total_price: 0,
      },
    });
    res.status(200).json( info );
  }catch(error){
    console.error("Error getting parking user data:", error);
    res.status(500).json({ error: "Error getting parking user data" });
  }
};


/**
 * @description
 * Esta función se encarga de obtener el historial de un usuario.
 * @returns res.status(200).json({ history }).
 */
const getHistory = async (req, res) => {
  try{
    const userId = req.params.userId;

    const history = await Parking_User.findAll({
      where: {
        user_Id: userId,
      },
    });

    res.status(200).json({ history });
  }catch(error){
    console.error("Error getting historial:", error);
    res.status(500).json({ error: "Error getting historial" });
  }
}

/**
 * @description
 * Esta función se encarga de obtener el historial de un estacionamiento.
 * @returns res.status(200).json({ history }).
 */
const getHistoryParking = async (req, res) => {
  try{
    const ParkingId = req.params.ParkingId;

    const history = await Parking_User.findAll({
      where: {
        parking_Id: ParkingId,
      },
    });

    res.status(200).json({ history });
  }catch(error){
    console.error("Error getting historial:", error);
    res.status(500).json({ error: "Error getting historial" });
  }
}

/**
 * @description
 * Esta función se encarga de obtener los datos de un estacionamiento.
 * @returns res.status(200).json({ parkings }).
 */
const getParkings = async (req, res) => {
  try {
    const parkings = await Parking.findAll({
      attributes: ["id", "name", "address", "base_price", "floor_count", "places_per_floor"],
    });
    res.status(200).json({ parkings });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
 * @description
 * Esta función se encarga de editar el precio base de un estacionamiento.
 * @returns res.status(200).json({ parking }).
 */
const editPrice = async (req, res) => {
  try {
    const parkingId = req.body.parkingId;
    const newBasePrice = req.body.newBasePrice;
    const parking = await Parking.update({
      base_price: newBasePrice,
    }, {
      where: {
        id: parkingId,
      },
    });
    res.status(200).json({ parking });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
 * @description
 * Esta función se encarga de editar los datos de un estacionamiento.
 * @returns res.status(200).json({ parking }).
 */
const editParking = async (req, res) => {
  console.log(req.body)
  try {
    const newParking = req.body.newParking;
    const parking = await Parking.update({
      floor_count: newParking.floor_count,
      places_per_floor: newParking.places_per_floor,
      base_price: newParking.base_price,
    }, {
      where: {
        id: newParking.id,
      },
    });
    res.status(200).json({ parking });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
 * @description
 * Esta función se encarga de obtener los datos de un estacionamiento.
 * @returns res.status(200).json({ parking }). 
 */
const getParking = async (req, res) => {
  try {
    const parkingId = req.params.parkingId;
    const parking = await Parking.findOne({
      where: {
        id: parkingId,
        attributes: ["Address"],
      },
    });
    res.status(200).json({ parking });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export const methods = {
  getAllParkingData,
  calculateExtraFee,
  calculateFinalPayment,
  getHistory,
  getOccupiedSpaces,
  registerPayment,
  getParkingUserData,
  getParkings,
  editPrice,
  editParking,
  getHistoryParking,
  getParking,
};
