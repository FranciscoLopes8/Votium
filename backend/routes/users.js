const express = require("express");
const Users = require("../models/User");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao carregar os Users" });
    }
});

module.exports = router;
