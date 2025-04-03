const voto = artifacts.require("Votacao");

module.exports = function (deployer) {
  deployer.deploy(voto);
};
