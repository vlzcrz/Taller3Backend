import { Router } from "express";
import { methods as ParkingController } from "../controllers/ParkingController";
import { reservationController } from "../controllers/ReservationController";
const AuthenticateToken = require("../middleware/AuthMiddleware");

const router = Router();

// Obtener todos los datos de estacionamientos
//Ruta protegida
router.use(AuthenticateToken);
router.get("/parking/", ParkingController.getAllParkingData);

router.get("/", (req, res) => {
  res.send("Parknmove API");
});

// Calcular costo adicional
//Ruta protegida
router.use(AuthenticateToken);
router.get("/calculateExtraFee", ParkingController.calculateExtraFee);

// Calcular pago final
//Ruta protegida
router.use(AuthenticateToken);
router.post("/calculateFinalPayment", ParkingController.calculateFinalPayment);

// Crear una nueva reserva (nueva ruta POST)
//Ruta protegida
router.use(AuthenticateToken);
router.post("/reservations", reservationController.createReservation);

// Ruta para obtener espacios ocupados en un estacionamiento específico
//Ruta protegida
router.use(AuthenticateToken);
router.get("/parking/occupiedSpaces", ParkingController.getOccupiedSpaces);

//Ruta protegida
router.use(AuthenticateToken);
router.get("/parking/history/:userId", ParkingController.getHistory);

//Ruta protegida
router.use(AuthenticateToken);
router.post("/registerPayment", ParkingController.registerPayment);

//Ruta protegida
router.use(AuthenticateToken);
router.post("/parkinguserdata", ParkingController.getParkingUserData);

// Ruta para obtener una reserva por user_id y exit_time nulo
//Ruta protegida
router.use(AuthenticateToken);
router.get("/reservations/user/:userId", reservationController.getReservationByUserId);

//Ruta protegida
router.use(AuthenticateToken);
router.get("/parking/getParkings", ParkingController.getParkings);

router.get("parking/getParking/:parkingId", ParkingController.getParking);

//ruta para obtener el historial de un parking
router.get("/parking/report", ParkingController.getHistoryParking);

router.post("/parking/editPrice", ParkingController.editPrice);

router.put("/parking/editParking", ParkingController.editParking);

router.get("/reservations/history" , reservationController.getHistory)

export default router;
