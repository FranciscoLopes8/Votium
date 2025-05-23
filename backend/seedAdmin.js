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
            walletPrivateKey: "0x4548489519d5cfbdcaac0552044e6e1a6dc0f24a21cb29a1ccfd3fbbfb60ba90"
        });

        await adminUser.save();
    } catch (error) {
        console.error(error);
    }
};

module.exports = seedAdmin;