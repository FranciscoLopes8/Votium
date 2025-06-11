const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Muitas tentativas de login. Tente novamente mais tarde." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/login", loginLimiter, async (req, res) => {
    const { telefone, password } = req.body;
    const ip = req.ip;
    const timestamp = new Date().toISOString();

    try {
        const user = await User.findOne({ telefone });
        if (!user) {
            return res.status(400).json({ message: "Utilizador não encontrado!" });
        }

        const isMatch = await bcrypt.compare(password, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: "Palavra-passe incorreta!" });
        }

        console.log(`[${timestamp}] Login bem sucedido - Telefone: ${telefone} - IP: ${ip}`);

        const token = jwt.sign(
            { id: user._id, telefone: user.telefone, role: user.role, codigoPessoal: user.codigoPessoal },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                primeiroNome: user.primeiroNome,
                ultimoNome: user.ultimoNome,
                telefone: user.telefone,
                role: user.role,
                codigoPessoal: user.codigoPessoal,
            },
        });
    } catch (error) {
        console.error(`[${timestamp}] Erro no servidor login - Telefone: ${telefone} - IP: ${ip} - Erro: ${error.message}`);
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
});

module.exports = router;
