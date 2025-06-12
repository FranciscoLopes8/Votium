const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: "Admin" });
        if (existingAdmin) {
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);
        const adminUser = new User({
            primeiroNome: "Administrador",
            ultimoNome: "Sistema",
            telefone: "000000000",
            senha: hashedPassword,
            role: "Admin",
            codigoPessoal: "00000000",
            imagem: "",
            walletPrivateKey: "0x2b46987ce8e83a2addbe6d3c7577451b4af7f4d554a2cbeb29d4797c6fb71aa1"
        });

        await adminUser.save();
    } catch (error) {
        console.error(error);
    }
};

module.exports = seedAdmin;