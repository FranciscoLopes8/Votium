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
            walletPrivateKey: "0xd9e4fe7efb52d1c3ae114f5d9ecffb68755246d9dcf6068190ec3ebd78cc4947"
        });

        await adminUser.save();
    } catch (error) {
        console.error(error);
    }
};

module.exports = seedAdmin;