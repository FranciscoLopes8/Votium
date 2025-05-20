const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");


router.put("/:id", upload.single("imagem"), async (req, res) => {
    try {
        const { id } = req.params;
        const { partido, nascimento, naturalidade, biografia, cor, nome, imagem } = req.body;

        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ error: "Candidato não encontrado" });
        }

        if (partido) candidate.partido = partido;
        if (nascimento) candidate.nascimento = nascimento;
        if (naturalidade) candidate.naturalidade = naturalidade;
        if (biografia) candidate.biografia = biografia;
        if (cor) candidate.cor = cor;
        if (nome) candidate.nome = nome;
        if (imagem) candidate.imagem = imagem;

        // Atualiza a imagem se houver nova
        if (req.file) {
            if (candidate.imagem && fs.existsSync(path.join(__dirname, "..", candidate.imagem))) {
                fs.unlinkSync(path.join(__dirname, "..", candidate.imagem));
            }
            candidate.imagem = `/uploads/${req.file.filename}`;
        }

        await candidate.save();

        res.status(200).json({
            message: "Candidato atualizado com sucesso",
            candidate: {
                nome: candidate.nome,
                partido: candidate.partido,
                nascimento: candidate.nascimento,
                naturalidade: candidate.naturalidade,
                biografia: candidate.biografia,
                imagem: candidate.imagem,
                cor: candidate.cor,
            },
        });
    } catch (error) {
        console.error("Erro ao atualizar candidato:", error);
        res.status(500).json({ error: "Erro ao atualizar candidato" });
    }
});

module.exports = router;
