const Candidate = require('./models/Candidate');

const seedCandidates = async () => {
    const candidates = [
        {
            nome: "Mauro Pires",
            partido: "Frelimo",
            nascimento: "12/02/1976",
            naturalidade: "Maputo",
            biografia: "Trabalhou como organizador comunitário em Chicago, advogado de direitos civis e professor de direito constitucional na Universidade de Chicago.",
            imagem: "https://via.placeholder.com/150",
            cor: "#4CAF50"
        },
        {
            nome: "Carlos Zandamela",
            partido: "Renamo",
            nascimento: "05/07/1980",
            naturalidade: "Beira",
            biografia: "Ex-deputado do parlamento e ativista pelos direitos humanos. Tem ampla experiência em diplomacia internacional.",
            imagem: "https://via.placeholder.com/150",
            cor: "#F44336"
        },
        {
            nome: "Maria da Silva",
            partido: "MDM",
            nascimento: "22/11/1985",
            naturalidade: "Nampula",
            biografia: "Economista e empresária, fundadora de várias ONGs voltadas para o empoderamento feminino e desenvolvimento sustentável.",
            imagem: "https://via.placeholder.com/150",
            cor: "#2196F3"
        }
    ];


    try {
        const existingCandidates = await Candidate.find();
        if (existingCandidates.length > 0) {
            return;
        }
        await Candidate.insertMany(candidates);
    } catch (err) {
        console.error("Erro ao inserir candidatos:", err);
    }
};

module.exports = seedCandidates;
