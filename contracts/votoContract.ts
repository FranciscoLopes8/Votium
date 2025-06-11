import { ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IP = "192.168.1.80";

// ABI simples do contrato
export const VOTO_ABI = [
    "function votar(uint256, string memory) public",
    "function consultarVoto(string memory) public view returns (uint256)",
    "function jaVotou(address) public view returns (bool)"
];

export const VOTO_ADDRESS = "0x848E0FF5f4B4C3E3Ce1C01d85D375b454C8F5044";

export const GANACHE_URL = "HTTP://192.168.1.80:7545";

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

