const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const router = express.Router();

const generateSecureCode = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

router.post("/register", async (req, res) => {
    const { primeiroNome, ultimoNome, telefone, senha, role = "User" } = req.body;

    try {
        const userExistente = await User.findOne({ telefone });
        if (userExistente) return res.status(400).json({ message: "Telefone já registado" });

        const senhaHash = await bcrypt.hash(senha, 10);
        const codigoPessoal = generateSecureCode();

        const novoUsuario = new User({ primeiroNome, ultimoNome, telefone, senha: senhaHash, role: role || "user", codigoPessoal: codigoPessoal });
        await novoUsuario.save();

        const token = jwt.sign(
            { id: novoUsuario._id, telefone: novoUsuario.telefone, role: novoUsuario.role, codigoPessoal: novoUsuario.codigoPessoal },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({
            token,
            user: {
                id: novoUsuario._id,
                primeiroNome: novoUsuario.primeiroNome,
                ultimoNome: novoUsuario.ultimoNome,
                telefone: novoUsuario.telefone,
                role: novoUsuario.role,
                codigoPessoal: novoUsuario.codigoPessoal,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

module.exports = router;
