require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const seedAdmin = require("./seedAdmin");
const seedCandidates = require('./seedCandidates');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        await seedAdmin();
        await seedCandidates();
        console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));

// Rotas
app.use("/auth", require("./routes/authRegister.js"));
app.use("/auth", require("./routes/authLogin.js"));
app.use("/auth", require("./routes/authPerfil.js"));
app.use("/candidates", require("./routes/candidates.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
