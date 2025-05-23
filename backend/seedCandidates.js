const Candidate = require('./models/Candidate');

const seedCandidates = async () => {
  const candidates = [
    {
      nome: "Luís Montenegro",
      partido: "PSD",
      nascimento: "16/08/1973",
      naturalidade: "Montenegro",
      biografia: "Deputado do PSD, focado em políticas económicas e sociais.",
      imagem: "uploads/LM.jpg",
      cor: "#1976D2",
      planoEleitoral: "Luís Montenegro propõe promover o investimento e a criação de emprego, reforçar as forças de segurança, melhorar os serviços públicos de saúde e valorizar os professores através da modernização do ensino."
    },
    {
      nome: "Pedro Nuno Santos",
      partido: "PS",
      nascimento: "13/02/1977",
      naturalidade: "São João da Madeira",
      biografia: "Político do Partido Socialista, focado em infraestruturas e inovação.",
      imagem: "uploads/PNS.jpg",
      cor: "#E53935",
      planoEleitoral: "Pedro Nuno Santos aposta no investimento em transportes e acessibilidade, digitalização e tecnologia, políticas para a transição energética, e no fortalecimento do Serviço Nacional de Saúde."
    },
    {
      nome: "André Ventura",
      partido: "CHEGA",
      nascimento: "15/01/1983",
      naturalidade: "Lisboa",
      biografia: "Líder do CHEGA, foco em segurança e políticas conservadoras.",
      imagem:"uploads/VENTURA.jpg",
      cor: "#F44336",
      planoEleitoral: "André Ventura defende o reforço da justiça e combate à criminalidade, políticas rigorosas de imigração, redução de impostos e incentivo ao empreendedorismo, além da valorização dos valores tradicionais."
    },
    {
      nome: "Mariana Mortágua",
      partido: "Bloco de Esquerda",
      nascimento: "10/10/1986",
      naturalidade: "Lisboa",
      biografia: "Economista e deputada do Bloco, defensora dos direitos sociais.",
      imagem: "uploads/MM.jpg",
      cor: "#9C27B0",
      planoEleitoral: "Mariana Mortágua propõe justiça fiscal, combate à desigualdade, investimento no Serviço Nacional de Saúde, educação pública gratuita e transição para energias renováveis."
    },
    {
      nome: "Rui Rocha",
      partido: "CDS – Partido Popular",
      nascimento: "05/03/1970",
      naturalidade: "Porto",
      biografia: "Político do CDS, focado em políticas sociais e económicas liberais.",
      imagem: "uploads/RR.jpg",
      cor: "#2196F3",
      planoEleitoral: "Rui Rocha apoia o empreendedorismo, redução da carga fiscal, melhoria da gestão hospitalar, segurança cidadã e valorização da formação profissional."
    },
    {
      nome: "Rui Tavares",
      partido: "Livre",
      nascimento: "21/05/1972",
      naturalidade: "Lisboa",
      biografia: "Historiador e deputado do Livre, defensor dos direitos humanos e ambientais.",
      imagem: "uploads/RT.jpg",
      cor: "#4CAF50",
      planoEleitoral: "Rui Tavares defende políticas ambientais ambiciosas, direitos humanos e das minorias, economia sustentável e uma educação crítica e inclusiva."
    },
    {
      nome: "Inês Sousa Real",
      partido: "PAN",
      nascimento: "12/07/1971",
      naturalidade: "Lisboa",
      biografia: "Advogada e ativista dos direitos dos animais, deputada pelo Pessoas-Animais-Natureza.",
      imagem: "uploads/INS.jpg",
      cor: "#4CAF50",
      planoEleitoral: "Inês Sousa Real defende a proteção ambiental e dos direitos dos animais, acesso universal à saúde, promoção da igualdade de género e uma educação inclusiva e sustentável."
    }
  ];

  try {
    const existingCandidates = await Candidate.find();
    if (existingCandidates.length > 0) {
      return; // Evita duplicar a inserção
    }
    await Candidate.insertMany(candidates);
    console.log("Candidatos portugueses inseridos com sucesso.");
  } catch (err) {
    console.error("Erro ao inserir candidatos:", err);
  }
};

module.exports = seedCandidates;
