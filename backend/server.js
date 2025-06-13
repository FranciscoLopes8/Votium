require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const upload = require("./middleware/upload");

const seedAdmin = require("./seedAdmin");
const seedCandidates = require('./seedCandidates');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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
app.use("/users", require("./routes/users.js"));
app.use('/uploads', express.static('uploads'));
app.use("/perfil", require("./routes/editProfile.js"));
app.use("/candidatoperfil", require("./routes/editCandidate.js"));


app.post('/upload', upload.single('imagem'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado');
    }

    res.status(200).json({ message: "Upload realizado com sucesso", path: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).send('Erro ao fazer upload do arquivo');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
