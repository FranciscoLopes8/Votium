const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Wallet, ethers } = require("ethers");

const User = require("../models/User");
const router = express.Router();

const GANACHE_URL = "HTTP://192.168.1.170:7545";
const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);

const generateSecureCode = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

const transferirETH = async (paraEndereco) => {
    const admin = await User.findOne({ role: "Admin" });
    if (!admin || !admin.walletPrivateKey) {
        throw new Error("Admin ou sua chave privada não encontrada.");
    }

    const adminWallet = new ethers.Wallet(admin.walletPrivateKey, provider);

    const tx = await adminWallet.sendTransaction({
        to: paraEndereco,
        value: ethers.utils.parseEther("0.1"),
    });

    await tx.wait();
    console.log(` Transferido 0.1 ETH para ${paraEndereco}`);
};

router.post("/register", async (req, res) => {
    const { primeiroNome, ultimoNome, telefone, senha, role = "User" } = req.body;

    try {
        const userExistente = await User.findOne({ telefone });
        if (userExistente) {
            return res.status(400).json({ message: "Telefone já registado" });
        }

        const novaWallet = Wallet.createRandom();

        await transferirETH(novaWallet.address);

        const senhaHash = await bcrypt.hash(senha, 10);
        const codigoPessoal = generateSecureCode();

        const novoUsuario = new User({
            primeiroNome,
            ultimoNome,
            telefone,
            senha: senhaHash,
            role,
            codigoPessoal,
            walletPrivateKey: novaWallet.privateKey,
        });

        await novoUsuario.save();

        const token = jwt.sign(
            {
                id: novoUsuario._id,
                telefone: novoUsuario.telefone,
                role: novoUsuario.role,
                codigoPessoal: novoUsuario.codigoPessoal
            },
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
                walletPrivateKey: novoUsuario.walletPrivateKey
            },
        });
    } catch (error) {
        console.error("Erro ao registar usuário:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

module.exports = router;
