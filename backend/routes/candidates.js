const express = require('express');
const Candidate = require('../models/Candidate');
const upload = require('../middleware/upload');
const router = express.Router();

// GET - listar todos
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar os candidatos" });
  }
});

// POST - adicionar candidato
router.post('/', upload.single('imagem'), async (req, res) => {
  const { nome, partido, nascimento, naturalidade, biografia, cor } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Imagem é obrigatória" });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  const newCandidate = new Candidate({
    nome,
    partido,
    nascimento,
    naturalidade,
    biografia,
    imagem: imagePath,
    cor,
  });

  try {
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar o candidato" });
  }
});

// DELETE - remover candidato
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const candidato = await Candidate.findByIdAndDelete(id);

    if (!candidato) {
      return res.status(404).json({ message: 'Candidato não encontrado' });
    }

    res.status(200).json({ message: 'Candidato excluído com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar candidato:", error);
    res.status(500).json({ message: 'Erro ao excluir candidato', error });
  }
});

module.exports = router;
