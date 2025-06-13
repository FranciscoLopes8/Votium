const voto = artifacts.require("Voto");
module.exports = function (deployer) {
  deployer.deploy(voto);
};
