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
            walletPrivateKey: "0xfea647ff49f2de6d1478693d1508d26419db565f52416a78c10146bb4c5155f0"
        });

        await adminUser.save();
    } catch (error) {
        console.error(error);
    }
};

module.exports = seedAdmin;