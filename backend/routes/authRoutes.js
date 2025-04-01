const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require('crypto');

const router = express.Router();

const generateSecureCode = (length = 8) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

router.post("/register", async (req, res) => {
    const { primeiroNome, ultimoNome, telefone, senha, role = "User", codigoPessoal } = req.body;

    try {
        const userExistente = await User.findOne({ telefone });
        if (userExistente) return res.status(400).json({ message: "Telefone já registado" });

        const senhaHash = await bcrypt.hash(senha, 10);
        codigoPessoal = generateSecureCode();

        const novoUsuario = new User({ primeiroNome, ultimoNome, telefone, senha: senhaHash, role: role || "user", codigoPessoal });
        await novoUsuario.save();

        res.status(201).json({ message: "Conta Criada" });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
});

module.exports = router;
