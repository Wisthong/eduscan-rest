const express = require('express');
const cors = require('cors');
const morgan = require('morgan');



const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const scanRoutes = require('./routes/scan.routes');

const app = express();

app.use(morgan('dev'));  // Muestra método, URL, status y tiempo
app.use(cors());
app.use(express.json());

const notificationRoutes = require("./routes/notification.routes");
const userRoutes = require("./routes/user.routes");

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/scan', scanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notification", notificationRoutes);

module.exports = app;
