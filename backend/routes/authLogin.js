const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { telefone, password } = req.body;

    try {
        const user = await User.findOne({ telefone });
        if (!user) {
            return res.status(400).json({ message: "Utilizador não encontrado!" });
        }

        const isMatch = await bcrypt.compare(password, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: "Palavra-passe incorreta!" });
        }

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
        console.log(error);
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
});

module.exports = router;