const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Rota para registrar usuário
router.post("/register", async (req, res) => {
    const { primeiroNome, ultimoNome, telefone, senha, role = "User" } = req.body;

    try {
        const userExistente = await User.findOne({ telefone });
        if (userExistente) return res.status(400).json({ message: "Telefone já cadastrado" });

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = new User({ primeiroNome, ultimoNome, telefone, senha: senhaHash, role: role || "user" });
        await novoUsuario.save();

        res.status(201).json({ message: "Conta Criada" });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
});

module.exports = router;
