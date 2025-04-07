const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../middleware/upload"); 
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");


router.put("/:telefone", upload.single("imagem"), async (req, res) => {
  try {
    const { telefone } = req.params;
    const { primeiroNome, ultimoNome, senha } = req.body;

    const user = await User.findOne({ telefone });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (primeiroNome) user.primeiroNome = primeiroNome;
    if (ultimoNome) user.ultimoNome = ultimoNome;


    if (senha) {
      const salt = await bcrypt.genSalt(10);
      user.senha = await bcrypt.hash(senha, salt);
    }


    if (req.file) {
      if (user.imagem && fs.existsSync(path.join(__dirname, "..", user.imagem))) {
        fs.unlinkSync(path.join(__dirname, "..", user.imagem));
      }

      user.imagem = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "Perfil atualizado com sucesso",
      user: {
        primeiroNome: user.primeiroNome,
        ultimoNome: user.ultimoNome,
        telefone: user.telefone,
        imagem: user.imagem,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

module.exports = router;
