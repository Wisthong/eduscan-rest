const router = require("express").Router();
const admin = require("../config/firebase");

router.post("/test", async (req, res) => {
  try {
    const { token } = req.body;

    await admin.messaging().send({
      token,
      notification: {
        title: "Prueba Eduscan",
        body: "Notificación funcionando correctamente 🔥",
      },
    });

    res.json({ message: "Notificación enviada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enviando notificación" });
  }
});

module.exports = router;
