const router = require("express").Router();
const { body } = require("express-validator");

const scanController = require("../controllers/scan.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

/**
 * ESCANEAR QR (Solo PORTERIA)
 */
router.post(
  "/",
  auth,
  role(["PORTERIA"]),
  body("qrCode").notEmpty().withMessage("QR requerido"),
  validate,
  scanController.scanQR
);

/**
 * VER HISTORIAL DEL PADRE
 */
router.get(
  "/my-logs",
  auth,
  role(["PADRE"]),
  scanController.getMyChildLogs
);

/**
 * VER ESTADO ACTUAL DEL HIJO
 */
router.get(
  "/status",
  auth,
  role(["PADRE"]),
  scanController.getStatus
);

module.exports = router;
