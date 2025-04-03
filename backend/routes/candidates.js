const express = require('express');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Rota para obter todos os candidatos
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar os candidatos" });
  }
});

// Rota para adicionar um candidato (caso queiras adicionar mais candidatos)
router.post('/', async (req, res) => {
  const { nome, partido, imagem } = req.body;

  const newCandidate = new Candidate({
    nome,
    partido,
    imagem,
  });

  try {
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar o candidato" });
  }
});

module.exports = router;
