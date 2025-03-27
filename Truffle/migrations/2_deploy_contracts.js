const teste = artifacts.require("teste");
const votoTeste = artifacts.require("votoTeste");

module.exports = function (deployer) {
  deployer.deploy(teste);
  deployer.deploy(votoTeste);
};
