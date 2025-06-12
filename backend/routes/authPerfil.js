const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

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
            imagem: user.imagem,
            walletPrivateKey: user.walletPrivateKey,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
});

module.exports = router;
