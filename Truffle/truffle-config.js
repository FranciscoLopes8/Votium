module.exports = {
  networks: {
    development: {
      host: "192.168.1.170",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  compilers: { // Adiciona esta secção
    solc: {
      version: "0.8.13", // Usa uma versão mais recente do Solidity
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};