const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { Wallet, ethers } = require("ethers")
const crypto = require("crypto")
const User = require("../models/User")

const router = express.Router()

const GANACHE_URL = "HTTP://192.168.1.183:7545"
const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL)

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        return res.status(401).json({ message: "Acesso não autorizado" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: "Token inválido" })
    }
}

const generateSecureCode = (length = 8) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length

    const randomBytes = crypto.randomBytes(length)
    let result = ""

    for (let i = 0; i < length; i++) {
        const randomIndex = randomBytes[i] % charactersLength
        result += characters[randomIndex]
    }

    return result
}

const transferirETH = async (paraEndereco) => {
    const admin = await User.findOne({ role: "Admin" })
    if (!admin || !admin.walletPrivateKey) {
        throw new Error("Admin ou sua chave privada não encontrada.")
    }

    const adminWallet = new ethers.Wallet(admin.walletPrivateKey, provider)

    const tx = await adminWallet.sendTransaction({
        to: paraEndereco,
        value: ethers.utils.parseEther("0.1"),
    })

    await tx.wait()
    console.log(`Transferido 0.1 ETH para ${paraEndereco}`)
}

router.get("/perfil", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" })
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
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erro no servidor", error: error.message })
    }
})

// Nova rota para adicionar admin
router.post("/adicionar-admin", authMiddleware, async (req, res) => {
    const timestamp = new Date().toISOString()
    const ip = req.ip

    console.log(`[${timestamp}] Iniciando criação de admin - User ID: ${req.user.id} - IP: ${ip}`)

    try {
        // Verificar se o usuário atual é admin
        const currentUser = await User.findById(req.user.id)
        console.log(
            `[${timestamp}] Usuário atual encontrado:`,
            currentUser ? `${currentUser.telefone} - Role: ${currentUser.role}` : "Não encontrado",
        )

        if (!currentUser || currentUser.role !== "Admin") {
            console.log(`[${timestamp}] Tentativa não autorizada de criar admin - User ID: ${req.user.id} - IP: ${ip}`)
            return res.status(403).json({ message: "Acesso negado. Apenas admins podem criar outros admins." })
        }

        // Buscar todos os admins para gerar o próximo número sequencial
        console.log(`[${timestamp}] Buscando admins existentes...`)
        const admins = await User.find({ role: "Admin" }).sort({ telefone: 1 })
        console.log(`[${timestamp}] Admins encontrados: ${admins.length}`)

        // Buscar todos os admins para gerar o próximo número sequencial
        const admins_ = await User.find({ role: "Admin" }).sort({ telefone: 1 })

        let nextPhoneNumber = "000000000" // Primeiro admin
        if (admins_.length > 0) {
            // Encontrar o próximo número disponível na sequência
            for (let i = 0; i < admins_.length; i++) {
                const expectedNumber = i.toString().padStart(9, "0")
                if (admins_[i].telefone !== expectedNumber) {
                    nextPhoneNumber = expectedNumber
                    break
                }
                if (i === admins_.length - 1) {
                    // Se chegou ao final, o próximo número é o seguinte
                    nextPhoneNumber = (i + 1).toString().padStart(9, "0")
                }
            }
        }

        // Verificar se o número já existe (segurança extra)
        const existingPhone = await User.findOne({ telefone: nextPhoneNumber })
        if (existingPhone) {
            // Se por algum motivo o número já existe, encontrar o próximo disponível
            const lastAdmin = await User.findOne({ role: "Admin" }).sort({ telefone: -1 })
            const lastNumber = Number.parseInt(lastAdmin.telefone)
            nextPhoneNumber = (lastNumber + 1).toString().padStart(9, "0")
        }

        // Remover esta seção:
        // Gerar código pessoal único
        // let codigoPessoal
        // let codeExists = true
        // while (codeExists) {
        //   codigoPessoal = generateSecureCode()
        //   const existingCode = await User.findOne({ codigoPessoal })
        //   if (!existingCode) {
        //     codeExists = false
        //   }
        // }

        // Substituir por:
        // Código pessoal fixo para todos os admins
        const codigoPessoal = "00000000"

        // Buscar a carteira do admin principal (000000000)
        console.log(`[${timestamp}] Buscando admin principal...`)
        const adminPrincipal = await User.findOne({ telefone: "000000000", role: "Admin" })
        console.log(`[${timestamp}] Admin principal encontrado:`, adminPrincipal ? "Sim" : "Não")

        if (!adminPrincipal || !adminPrincipal.walletPrivateKey) {
            console.log(`[${timestamp}] Erro: Admin principal não encontrado ou sem carteira`)
            return res.status(500).json({ message: "Admin principal não encontrado ou sem carteira configurada" })
        }

        // Hash da senha padrão
        console.log(`[${timestamp}] Gerando hash da senha...`)
        const hashedPassword = await bcrypt.hash("admin123", 10)

        // Criar novo admin usando a mesma carteira do admin principal
        console.log(`[${timestamp}] Criando novo admin com telefone: ${nextPhoneNumber}`)
        const newAdmin = new User({
            primeiroNome: "Admin",
            ultimoNome: `Sistema ${nextPhoneNumber.slice(-3)}`,
            telefone: nextPhoneNumber,
            senha: hashedPassword,
            role: "Admin",
            codigoPessoal: codigoPessoal,
            imagem: "",
            walletPrivateKey: adminPrincipal.walletPrivateKey, // Usar a mesma carteira
        })

        console.log(`[${timestamp}] Salvando novo admin...`)
        await newAdmin.save()
        console.log(`[${timestamp}] Admin salvo com sucesso`)

        console.log(
            `[${timestamp}] Novo admin criado - Telefone: ${nextPhoneNumber} - Criado por: ${currentUser.telefone} - IP: ${ip} - Usando carteira do admin principal`,
        )

        res.status(201).json({
            message: "Admin criado com sucesso",
            telefone: nextPhoneNumber,
            codigoPessoal: codigoPessoal,
            nome: `Admin Sistema ${nextPhoneNumber.slice(-3)}`,
        })
    } catch (error) {
        console.error(`[${timestamp}] Erro ao criar admin - User ID: ${req.user.id} - IP: ${ip} - Erro: ${error.message}`)
        res.status(500).json({ message: "Erro interno do servidor", error: error.message })
    }
})

module.exports = router
