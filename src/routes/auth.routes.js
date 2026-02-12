const router = require("express").Router();
const { body } = require("express-validator");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

/**
 * REGISTER
 */
router.post(
  "/register",
  body("name").notEmpty().withMessage("Nombre es obligatorio"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mínimo 6 caracteres"),
  body("role")
    .isIn(["PADRE", "PORTERIA", "ADMIN"])
    .withMessage("Rol inválido"),
  validate,
  authController.register
);

/**
 * LOGIN
 */
router.post(
  "/login",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Password requerido"),
  validate,
  authController.login
);

/**
 * GUARDAR DEVICE TOKEN (Para notificaciones)
 */
router.post(
  "/device-token",
  authMiddleware,
  body("deviceToken").notEmpty().withMessage("Device token requerido"),
  validate,
  authController.saveDeviceToken
);

module.exports = router;
