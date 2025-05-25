const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");


router.put("/:id", upload.single("imagem"), async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nome,
            partido,
            nascimento,
            naturalidade,
            biografia,
            planoEleitoral,
            cor
        } = req.body;

        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ error: "Candidato não encontrado" });
        }

        if (nome) candidate.nome = nome;
        if (partido) candidate.partido = partido;
        if (nascimento) candidate.nascimento = nascimento;
        if (naturalidade) candidate.naturalidade = naturalidade;
        if (biografia) candidate.biografia = biografia;
        if (planoEleitoral) candidate.planoEleitoral = planoEleitoral;
        if (cor) candidate.cor = cor;

        
        if (req.file) {
            if (candidate.imagem) {
                const oldImagePath = path.join(__dirname, "..", candidate.imagem);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            candidate.imagem = `/uploads/${req.file.filename}`;
        }

        await candidate.save();

        res.status(200).json({
            message: "Candidato atualizado com sucesso",
            candidate: {
                _id: candidate._id,
                nome: candidate.nome,
                partido: candidate.partido,
                nascimento: candidate.nascimento,
                naturalidade: candidate.naturalidade,
                biografia: candidate.biografia,
                planoEleitoral: candidate.planoEleitoral,
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
