import { ethers } from "ethers";

// ABI do contrato (simplificado)
export const VOTO_ABI = [
    "function votar(uint256, string memory) public",
    "function consultarVoto(string memory) public view returns (uint256)"
];

// Endereço do contrato 
export const VOTO_ADDRESS = "0x71aD89B7499d3393D857370234003D7BB899AB56";

// Private key 
const PRIVATE_KEY = "0x881335586e96f265cd69dabd61681dfe994dbf9d7c073dfedfc75dad80ba8ba4";

// URL
const GANACHE_URL = "HTTP://192.168.1.170:7545";

export const getVotoContract = () => {
    const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    return new ethers.Contract(VOTO_ADDRESS, VOTO_ABI, wallet);
};