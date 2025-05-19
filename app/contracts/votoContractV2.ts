import { ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IP = "192.168.1.183";

// ABI do contrato
export const VOTO_ABI = [
    "function votar(uint256, string memory) public",
    "function consultarVoto(string memory) public view returns (uint256)",
    "function obterVotosPorCandidato(uint) public view returns (uint)",
    "function obterTotalVotos() public view returns (uint)",
    "function jaVotou(address) public view returns (bool)",
];

export const VOTO_ADDRESS = "0xA459c2EF89982C7C60a7D3b34975577c50Ae366e";

export const GANACHE_URL = "HTTP://192.168.1.183:7545";

const fetchUserPrivateKey = async () => {
    try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
            throw new Error("Token não encontrado.");
        }

        const response = await fetch(`http://${IP}:5000/auth/perfil`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Erro ao buscar perfil: ${data.message || "Erro desconhecido"}`);
        }

        const { walletPrivateKey } = data;

        if (!walletPrivateKey) {
            throw new Error("Chave privada não encontrada.");
        }

        return walletPrivateKey;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getVotoContract = async () => {
    try {
        const privateKey = await fetchUserPrivateKey();

        const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);
        const wallet = new ethers.Wallet(privateKey, provider);

        const contrato = new ethers.Contract(VOTO_ADDRESS, VOTO_ABI, wallet);

        return contrato;

    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const votar = async (candidatoId: number, codigoPessoal: string) => {
    try {
        const contrato = await getVotoContract();

        const tx = await contrato.votar(candidatoId, codigoPessoal, { gasLimit: 1000000 });

        await tx.wait();

        alert("Voto registado com sucesso!");
    } catch (error) {
        console.error("Erro ao votar:", error);
        alert("Erro ao registar voto. Tente novamente.");
    }
};

export const consultarVoto = async (codigoPessoal: string) => {
    try {
        const contrato = await getVotoContract();

        // Chamada à função para consultar o voto
        const candidatoId = await contrato.consultarVoto(codigoPessoal);

        return candidatoId;
    } catch (error) {
        console.error("Erro ao consultar voto:", error);
        throw error;
    }
};

export const obterVotosPorCandidato = async (candidatoId: number) => {
    try {
        const contrato = await getVotoContract();

        const votos = await contrato.obterVotosPorCandidato(candidatoId);

        return votos;
    } catch (error) {
        console.error("Erro ao obter votos por candidato:", error);
        throw error;
    }
};

export const obterTotalVotos = async () => {
    try {
        const contrato = await getVotoContract();

        const totalVotos = await contrato.obterTotalVotos();

        return totalVotos;
    } catch (error) {
        console.error("Erro ao obter total de votos:", error);
        throw error;
    }
};
