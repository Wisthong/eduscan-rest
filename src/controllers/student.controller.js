const Student = require("../models/Student");

/**
 * CREAR ESTUDIANTE
 */
exports.createStudent = async (req, res) => {
  try {
    const { name, grade, parent } = req.body;

    const student = await Student.create({
      name,
      grade,
      parent
    });

    res.status(201).json(student);

  } catch (error) {
    console.error("ERROR CREANDO ESTUDIANTE:", error);
    res.status(500).json({ message: "Error creando estudiante" });
  }
};

/**
 * OBTENER TODOS
 */
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("parent", "name email role");

    res.json(students);

  } catch (error) {
    console.error("ERROR OBTENIENDO ESTUDIANTES:", error);
    res.status(500).json({ message: "Error obteniendo estudiantes" });
  }
};

/**
 * OBTENER POR ID
 */
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("parent", "name email role");

    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.json(student);

  } catch (error) {
    console.error("ERROR OBTENIENDO ESTUDIANTE:", error);
    res.status(500).json({ message: "Error obteniendo estudiante" });
  }
};

/**
 * ELIMINAR
 */
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.json({ message: "Estudiante eliminado correctamente" });

  } catch (error) {
    console.error("ERROR ELIMINANDO ESTUDIANTE:", error);
    res.status(500).json({ message: "Error eliminando estudiante" });
  }
};
