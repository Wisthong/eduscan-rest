const Student = require("../models/Student");
const Log = require("../models/Log");
const admin = require("../config/firebase");

/**
 * ESCANEAR QR (PORTERIA)
 */
exports.scanQR = async (req, res) => {
  try {
    const { qrCode } = req.body;

    const student = await Student.findOne({ qrCode }).populate("parent");

    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    // Buscar último registro
    const lastLog = await Log.findOne({ student: student._id })
      .sort({ timestamp: -1 });

    let type = "entrada";

    if (lastLog && lastLog.type === "entrada") {
      type = "salida";
    }

    // Crear nuevo log
    const newLog = await Log.create({
      student: student._id,
      type,
    });

    // 🔥 Enviar notificación si existe deviceToken
    if (student.parent?.deviceToken) {
      await admin.messaging().send({
        token: student.parent.deviceToken,
        notification: {
          title: "Eduscan",
          body: `${student.name} registró ${type}`,
        },
      });
    }

    res.json({
      message: `${type.toUpperCase()} registrada`,
      student: student.name,
      type,
      timestamp: newLog.timestamp,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en escaneo" });
  }
};

/**
 * VER HISTORIAL DEL HIJO (PADRE)
 */
exports.getMyChildLogs = async (req, res) => {
  try {
    const parentId = req.user.id;

    const student = await Student.findOne({ parent: parentId });

    if (!student) {
      return res.status(404).json({ message: "No tiene estudiante asociado" });
    }

    const logs = await Log.find({ student: student._id })
      .sort({ timestamp: -1 });

    res.json({
      student: student.name,
      logs,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo historial" });
  }
};

/**
 * VER ESTADO ACTUAL (PADRE)
 */
exports.getStatus = async (req, res) => {
  try {
    const parentId = req.user.id;

    const student = await Student.findOne({ parent: parentId });

    if (!student) {
      return res.status(404).json({ message: "No tiene estudiante asociado" });
    }

    const lastLog = await Log.findOne({ student: student._id })
      .sort({ timestamp: -1 });

    if (!lastLog) {
      return res.json({
        student: student.name,
        status: "SIN REGISTROS",
      });
    }

    res.json({
      student: student.name,
      status: lastLog.type.toUpperCase(),
      lastUpdate: lastLog.timestamp,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo estado" });
  }
};

