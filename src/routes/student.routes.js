const router = require("express").Router();
const { body, param } = require("express-validator");

const studentController = require("../controllers/student.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

/**
 * CREAR ESTUDIANTE (Solo ADMIN)
 */
router.post(
  "/",
  auth,
  role(["ADMIN"]),
  body("name").notEmpty().withMessage("Nombre es obligatorio"),
  body("grade").notEmpty().withMessage("Grado es obligatorio"),
  body("parent").isMongoId().withMessage("ID del padre inválido"),
  validate,
  studentController.createStudent
);

/**
 * OBTENER TODOS LOS ESTUDIANTES
 */
router.get(
  "/",
  auth,
  role(["ADMIN", "PORTERIA"]),
  studentController.getStudents
);

/**
 * OBTENER UN ESTUDIANTE POR ID
 */
router.get(
  "/:id",
  auth,
  param("id").isMongoId().withMessage("ID inválido"),
  validate,
  studentController.getStudentById
);

/**
 * ELIMINAR ESTUDIANTE (Solo ADMIN)
 */
router.delete(
  "/:id",
  auth,
  role(["ADMIN"]),
  param("id").isMongoId().withMessage("ID inválido"),
  validate,
  studentController.deleteStudent
);

module.exports = router;
