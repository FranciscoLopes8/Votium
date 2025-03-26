require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const seedAdmin = require("./seedAdmin");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        await seedAdmin();
        console.log("MongoDB conectado");
    })
    .catch((err) => console.log(err));

// Rotas
app.use("/auth", require("./routes/authRoutes.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
