const admin = require("firebase-admin");
const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/Users");


// Guardar device token
// router.post("/device-token", auth, async (req, res) => {
// router.post("/device-token", async (req, res) => {
//   try {
//     const { token } = req.body;

//     await User.findByIdAndUpdate(req.user.id, {
//       deviceToken: token
//     });

//     res.json({ message: "Token guardado correctamente" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error guardando token" });
//   }
// });

router.post("/device-token", async (req, res) => {
  try {
    const { token } = req.body;

    console.log("TOKEN RECIBIDO:", token);

    // 🔥 Solo para prueba
    const user = await User.findOne(); // toma el primero que exista

    if (!user) {
      return res.status(404).json({ message: "No hay usuarios creados" });
    }

    user.deviceToken = token;
    await user.save();

    res.json({ message: "Token guardado correctamente" });
  } catch (error) {
    console.error("ERROR GUARDANDO TOKEN:", error);
    res.status(500).json({ message: "Error guardando token" });
  }
});

router.post("/test-notification", async (req, res) => {
  try {
    const user = await User.findOne();

    if (!user.deviceToken) {
      return res.status(400).json({ message: "Usuario no tiene token" });
    }

    await admin.messaging().send({
      token: user.deviceToken,
      notification: {
        title: "Eduscan",
        body: "Notificación funcionando 🔥",
      },
    });

    res.json({ message: "Notificación enviada" });
  } catch (error) {
    console.error("ERROR ENVIANDO NOTIFICACIÓN:", error);
    res.status(500).json({ message: "Error enviando notificación" });
  }
});

module.exports = router;
