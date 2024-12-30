const db = require("../models");
const Reservation = db.parking_user;
const User = db.user;
const Parking = db.parking;

/**
 * @description
 * Esta función se encarga de crear una nueva reserva.
 * @returns res.status(201).json(reservation).
 */
const createReservation = async (req, res) => {
  console.log(req.body);
  try {
    const { user_id, parking_id, total_price, entry_time, exit_time, extra_fee } = req.body;
    
    const validation = await Reservation.findOne({
      where: {
        parking_id: req.body.parking_id,
        user_id: req.body.user_id,
        exit_time: null,
      },
    });

    if (validation){
      res.status(400).json({ error: "Ya existe una reserva con ese usuario y estacionamiento" });
    } else {
      // Crea una nueva reserva en la base de datos
      var entryTime = new Date(req.body.entry_time).toLocaleString("es-CL");
      const reservation = await Reservation.create({
      parking_id: req.body.parking_id,
      user_id: req.body.user_id,
      total_price: 0,
      entry_time: entryTime,
      exit_time: req.body.exit_time,
      extra_fee: req.body.extra_fee,
    });
    console.log(reservation.entry_time);
    // Devuelve la reserva creada en la respuesta
      res.status(201).json(reservation);
    }

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
};

/**
 * @description
 * Esta función se encarga de obtener la reserva activa de un usuario.
 * @returns res.status(200).json(reservation).
 */
const getReservationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservation = await Reservation.findOne({
      where: {
        user_id: userId,
        exit_time: null,
      },
    });
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ message: "No se encontró ninguna reserva activa para este usuario." });
    }
    
  } catch (error) {
    console.error("Error al obtener la reserva:", error);
    res.status(500).json({ error: "Error al obtener la reserva" });
  }
};

/**
 * @description
 * Esta función se encarga de obtener el historial de reservas.
 * @returns res.status(200).json({ history }).
 */
const getHistory = async (req, res) => {
  try{
    let history = await Reservation.findAll();

    for (let i = 0; i < history.length; i++) {
      const user = await User.findOne({
        where: {
          id: history[i].user_id,
        },
        attributes: ['name', 'lastname'], // Solo recuperar firstName y lastName
      });
      const parking = await Parking.findOne({
        where: {
          id: history[i].parking_id,
        },
        attributes: ['address'], // Solo recuperar address
      });
      history[i].dataValues.userName = user.name;
      history[i].dataValues.userLastName = user.lastname;
      history[i].dataValues.parkingAddress = parking.address;
    }
    res.status(200).json({ history });
  }catch(error){
    console.error("Error getting historial:", error);
    res.status(500).json({ error: "Error getting historial" });
  }
};

export const reservationController = {
  createReservation,
  getReservationByUserId,
  getHistory,
};
