const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  partido: { type: String, required: true },
  nascimento: { type: String, required: true }, 
  naturalidade: { type: String, required: true }, 
  biografia: { type: String, required: true }, 
  imagem: { type: String, required: true }, // URL
});

module.exports = mongoose.model('Candidate', candidateSchema);
