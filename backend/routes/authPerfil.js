// authPerfil.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Acesso não autorizado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};


router.get("/perfil", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.status(200).json({
            id: user._id,
            primeiroNome: user.primeiroNome,
            ultimoNome: user.ultimoNome,
            telefone: user.telefone,
            role: user.role,
            codigoPessoal: user.codigoPessoal,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
});

module.exports = router;
