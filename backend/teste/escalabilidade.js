/*

const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();
// correr com: node ./teste/escalabilidade.js

const VOTO_ABI = [
    "function votar(uint256, string memory) public",
    "function consultarVoto(string memory) public view returns (uint256)",
    "function obterVotosPorCandidato(uint) public view returns (uint)",
    "function obterTotalVotos() public view returns (uint)",
    "function jaVotou(address) public view returns (bool)",
];

const VOTO_ADDRESS = "0xf254A77D2719e758DFB419c240C743230A1f0275";
const GANACHE_URL = "http://127.0.0.1:8545";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const transferirETH = async (adminWallet, paraEndereco) => {
    try {
        const tx = await adminWallet.sendTransaction({
            to: paraEndereco,
            value: ethers.utils.parseEther("0.01"),
        });
        await tx.wait();
        console.log(`Transferido 0.01 ETH para ${paraEndereco}`);
    } catch (err) {
        console.error(`Falha ao transferir ETH para ${paraEndereco}: ${err.message}`);
    }
};

const gerarCarteiras = async (quantidade, adminPrivateKey) => {
    const carteiras = [];
    const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);
    const adminWallet = new ethers.Wallet(adminPrivateKey, provider);

    for (let i = 0; i < quantidade; i++) {
        const wallet = ethers.Wallet.createRandom();
        await transferirETH(adminWallet, wallet.address);
        carteiras.push(wallet);
    }

    return carteiras;
};

const simularVoto = async (wallet, candidatoId, codigoPessoal) => {
    const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);
    const connectedWallet = wallet.connect(provider);
    const contrato = new ethers.Contract(VOTO_ADDRESS, VOTO_ABI, connectedWallet);

    try {
        const tx = await contrato.votar(candidatoId, codigoPessoal, { gasLimit: 1000000 });
        await tx.wait();
        console.log(`Voto registado: ${wallet.address} => Candidato ${candidatoId}`);
        return { sucesso: true };
    } catch (error) {
        console.error(`Erro ao votar com ${wallet.address}: ${error.message}`);
        return { sucesso: false, erro: error.message };
    }
};

const testeDeEscalabilidade = async (quantidade) => {
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    if (!adminPrivateKey) {
        console.error("ADMIN_PRIVATE_KEY não definida no .env");
        return;
    }

    const carteiras = await gerarCarteiras(quantidade, adminPrivateKey);
    let sucesso = 0;
    let falhas = 0;

    const inicio = Date.now();

    for (let i = 0; i < carteiras.length; i++) {
        const wallet = carteiras[i];
        const candidatoId = i % 3;

        const codigoGrupo = Math.floor((i + 2000) / 1000);
        const codigo = `codigo${codigoGrupo}-${i}`;

        const resultado = await simularVoto(wallet, candidatoId, codigo);
        if (resultado.sucesso) sucesso++;
        else falhas++;

        await delay(50);
    }

    const fim = Date.now();
    const tempoTotal = ((fim - inicio) / 1000).toFixed(2);

    console.log("\nResultados do Teste");
    console.log("-----------------------");
    console.log(`Eleitores simulados: ${quantidade}`);
    console.log(`Sucessos: ${sucesso}`);
    console.log(`Falhas: ${falhas}`);
    console.log(`Tempo total: ${tempoTotal}s`);
    console.log(`Tempo médio por voto: ${(tempoTotal / quantidade).toFixed(3)}s`);
};

(async () => {
    await testeDeEscalabilidade(10000); // numero de votos
})();

*/


const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();
// correr na pasta do backend node ./teste/escalabilidade.js

const VOTO_ABI = [
    "function votar(uint256, string memory) public",
    "function consultarVoto(string memory) public view returns (uint256)",
    "function obterVotosPorCandidato(uint) public view returns (uint)",
    "function obterTotalVotos() public view returns (uint)",
    "function jaVotou(address) public view returns (bool)",
];

const VOTO_ADDRESS = "0xdC251221339959b378Ad5c8Ac6f8bBE1CA7a7708";
const GANACHE_URL = "http://127.0.0.1:8545";


const transferirETH = async (adminWallet, paraEndereco) => {
    try {
        const tx = await adminWallet.sendTransaction({
            to: paraEndereco,
            value: ethers.utils.parseEther("0.01"),
        });
        await tx.wait();
        console.log(`Transferido 0.01 ETH para ${paraEndereco}`);
    } catch (err) {
        console.error(`Falha ao transferir ETH para ${paraEndereco}: ${err.message}`);
    }
};


const gerarCarteiras = async (quantidade, adminPrivateKey) => {
    const carteiras = [];
    const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);
    const adminWallet = new ethers.Wallet(adminPrivateKey, provider);

    for (let i = 0; i < quantidade; i++) {
        const wallet = ethers.Wallet.createRandom();
        await transferirETH(adminWallet, wallet.address);
        carteiras.push(wallet);
    }

    return carteiras;
};


const simularVoto = async (wallet, candidatoId, codigoPessoal) => {
    const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);
    const connectedWallet = wallet.connect(provider);
    const contrato = new ethers.Contract(VOTO_ADDRESS, VOTO_ABI, connectedWallet);

    try {
        const tx = await contrato.votar(candidatoId, codigoPessoal, { gasLimit: 1000000 });
        await tx.wait();
        console.log(`Voto registado: ${wallet.address} => Candidato ${candidatoId}`);
        return { sucesso: true };
    } catch (error) {
        console.error(`Erro ao votar com ${wallet.address}: ${error.message}`);
        return { sucesso: false, erro: error.message };
    }
};


const testeDeEscalabilidade = async (quantidade) => {
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    if (!adminPrivateKey) {
        console.error("ADMIN_PRIVATE_KEY não definida no .env");
        return;
    }

    const carteiras = await gerarCarteiras(quantidade, adminPrivateKey);
    let sucesso = 0;
    let falhas = 0;

    const inicio = Date.now();

    await Promise.all(
        carteiras.map(async (wallet, index) => {
            const candidatoId = index % 3;
            const codigo = `codigo-${index}`;
            const resultado = await simularVoto(wallet, candidatoId, codigo);
            if (resultado.sucesso) sucesso++;
            else falhas++;
        })
    );

    const fim = Date.now();
    const tempoTotal = ((fim - inicio) / 1000).toFixed(2);

    console.log("\nResultados do Teste");
    console.log("-----------------------");
    console.log(`Eleitores simulados: ${quantidade}`);
    console.log(`Sucessos: ${sucesso}`);
    console.log(`Falhas: ${falhas}`);
    console.log(`Tempo total: ${tempoTotal}s`);
    console.log(`Tempo médio por voto: ${(tempoTotal / quantidade).toFixed(3)}s`);
};


(async () => {
    await testeDeEscalabilidade(10000); // numero de eleitores
})();


