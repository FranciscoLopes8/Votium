const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    primeiroNome: { type: String, required: true },
    ultimoNome: { type: String, required: true },
    telefone: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    codigoPessoal: { type: String, required: true, unique: true },
    imagem: { type: String },
    walletPrivateKey: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);

