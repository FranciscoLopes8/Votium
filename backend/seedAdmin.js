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
            walletPrivateKey: "0xbde69bc5ae597c87f6b077ba8106def0c10a6ffe2ab69f80d5bbf6b00c7a9573"
        });

        await adminUser.save();
    } catch (error) {
        console.error(error);
    }
};

module.exports = seedAdmin;