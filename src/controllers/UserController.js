// Importar el modelo de usuario
const db = require("../models");
const User = db.user;
var crypto = require("crypto");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Op, literal } = require("sequelize");

dotenv.config();

function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}
/**
 * @description
 * Esta función se encarga de registrar un nuevo usuario.
 * @returns res.status(201).json({ message: "Usuario creado exitosamente", token }).
 */
exports.register = async (req, res) => {
  const { name, lastname, email, password, priority } = req.body;
  const errors = [];
  try {
    //Validaciones
    if (name === "" || lastname === "") {
      //return res.status(400).json({ error: "Parámetros inválidos." });
      errors.push("Parámetros inválidos.");
    }
    if (password.length < 8) {
      //return res.status(400).json({ error: "Contraseña inválida. (min 8)" });
      errors.push("Contraseña inválida. (min 8).");
    }
    if (!emailRegex.test(email)) {
      //return res.status(400).json({ error: "Correo electrónico inválido." });
      errors.push("Correo electrónico inválido.");
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    //Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      //return res.status(400).json({ error: "Ya hay un usuario registrado con este correo." });
      errors.push("Correo ya registrado.");
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const passwordHash = crypto
      .createHmac("sha256", process.env.TOKEN_SECRET)
      .update(password)
      .digest("hex");

    //Crear usuario
    const user = await User.create({
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: passwordHash,
      priority: 0,
    });

    const tokenPayload = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      priority: user.priority,
      // Agrega otros campos necesarios aquí
    };

    //Generar token
    const token = generateAccessToken(tokenPayload);
    res.status(201).json({ message: "Usuario creado exitosamente", token });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @description
 * Esta función se encarga de iniciar sesión.
 * @returns res.status(200).json({ message: "Inicio de sesión exitoso", token }).
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const errors = [];
  try {
    //Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: { email },
    });

    if (!existingUser) {
      //return res.status(400).json({ error: "No hay un usuario registrado con este correo." });
      errors.push("El usuario no existe.");
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    //Hash de la contraseña ingresada

    const passwordHash = crypto
      .createHmac("sha256", process.env.TOKEN_SECRET)
      .update(password)
      .digest("hex");

    const tokenPayload = {
      id: existingUser.id,
      name: existingUser.name,
      lastname: existingUser.lastname,
      email: existingUser.email,
      priority: existingUser.priority,
    };
    //Verificar si la contraseña es correcta
    if (passwordHash === existingUser.password) {
      const token = generateAccessToken(tokenPayload);
      return res
        .status(200)
        .json({ message: "Inicio de sesión exitoso", token });
    } else {
      //return res.status(401).json({ error: 'Credenciales inválidas' });
      errors.push("Error al iniciar sesión.");
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @description
 * Esta función se encarga de actualizar los datos de un usuario.
 * @returns res.status(200).json({ message: "Usuario actualizado exitosamente" }).
 */
exports.updateUser = async (req, res) => {
  try {
    console.log(req.body.user);
    const { id, name, lastname, email, priority } = req.body.user;
    const user = await User.findOne({ where: { id } });
    console.log(user);
    if (user) {
      if (name === "") {
        user.name = user.name;
      } else {
        user.name = name;
      }
      if (lastname === "") {
        user.lastname = user.lastname;
      } else {
        user.lastname = lastname;
      }
      if (email === "") {
        user.email = user.email;
      } else {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser && existingUser.id != id) {
          return res.status(400).json({ message: "Correo ya registrado" });
        } else {
          user.email = email;
        }
      }
      if (priority === "") {
        user.priority = user.priority;
      } else {
        user.priority = priority;
      }
      console.log("2", user);
      await user.save();
      res.status(200).json({ message: "Usuario actualizado exitosamente" });
    } else {
      res.status(400).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @description
 * Esta función se encarga de obtener los usuarios.
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "lastname", "email", "priority"],
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @description
 * Esta función se encarga de obtener los datos de un usuario.
 * @returns res.status(200).json({ user }).
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
      attributes: ["name", "lastname"],
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};


/**
 * @description
 * Esta función se encarga de buscar un usuario.
 * @returns res.status(200).json({ user }).
 */
exports.searchUser = async (req, res) => {
  try {
    const { searchData } = req.body;

    const user = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: `%${searchData}` } },
          { lastname: { [Op.substring]: `%${searchData}` } },
          { email: { [Op.substring]: `%${searchData}` } },
        ],
      },
    });
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(400).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
