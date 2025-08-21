require("dotenv").config();
const express = require('express');
const connectDb = require('./src/config/db');
const fileRoutes = require('./src/routes/fileRoutes');

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json());
app.use("/api/files", fileRoutes);

connectDb();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});