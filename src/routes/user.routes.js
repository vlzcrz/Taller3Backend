var express = require("express");
var UserController = require("../controllers/UserController");
const AuthenticateToken = require("../middleware/AuthMiddleware");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.use(express.json());
router.post("/user/register", UserController.register);
router.post("/user/login", UserController.login);

router.use(AuthenticateToken);
router.get("/user/getUsers", UserController.getUsers);
router.get("/user/getUser:id", UserController.getUsers);
router.put(`/user/updateUser`, UserController.updateUser);
router.post("/user/searchUser", UserController.searchUser);

module.exports = router;
