const voto = artifacts.require("Voto");
const votoEstatisitca2 = artifacts.require("VotoEstatisticas2");
module.exports = function (deployer) {
  deployer.deploy(voto);
  deployer.deploy(votoEstatisitca2);
};
