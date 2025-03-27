const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { telefone, password } = req.body;
    console.log(telefone);
    console.log(password);

    try {
        const user = await User.findOne({ telefone });
        if (!user) {
            return res.status(400).json({ message: "Utilizador não encontrado!" });
        }

        const isMatch = await bcrypt.compare(password, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: "Palavra-passe incorreta!" });
        }

        res.status(200).json({ codigoVerificacao: user.codigoVerificacao });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor", error });
    }
});


module.exports = router;