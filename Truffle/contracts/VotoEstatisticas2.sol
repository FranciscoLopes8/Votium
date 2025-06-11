// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract VotoEstatisticas2 {
    struct Votacao {
        uint candidatoId;
        string codigoPessoal;
        address votante;
    }

    mapping(bytes32 => Votacao) public votos;
    mapping(address => bool) public jaVotou;
    mapping(uint => uint) public votosPorCandidato;
    uint public totalVotos;
    
    // Novos campos para rastrear códigos por candidato
    string[] public todosCodigos;
    mapping(uint => string[]) public codigosPorCandidato;

    event VotoRegistado(
        address indexed votante,
        uint candidatoId,
        string codigoPessoal
    );

    constructor() {}

    function votar(uint _candidatoId, string memory _codigoPessoal) public {
        require(!jaVotou[msg.sender], "Ja votaste!");

        bytes32 hashCodigo = keccak256(abi.encodePacked(_codigoPessoal));
        require(
            votos[hashCodigo].votante == address(0),
            "Este codigo ja foi usado!"
        );

        votos[hashCodigo] = Votacao({
            candidatoId: _candidatoId,
            codigoPessoal: _codigoPessoal,
            votante: msg.sender
        });

        jaVotou[msg.sender] = true;
        votosPorCandidato[_candidatoId]++;
        totalVotos++;
        
        // Adicionar código aos arrays
        todosCodigos.push(_codigoPessoal);
        codigosPorCandidato[_candidatoId].push(_codigoPessoal);

        emit VotoRegistado(msg.sender, _candidatoId, _codigoPessoal);
    }

    function consultarVoto(
        string memory _codigoPessoal
    ) public view returns (uint candidatoId) {
        bytes32 hashCodigo = keccak256(abi.encodePacked(_codigoPessoal));
        require(
            votos[hashCodigo].votante != address(0),
            "Codigo nao encontrado!"
        );
        return votos[hashCodigo].candidatoId;
    }

    function obterVotosPorCandidato(
        uint _candidatoId
    ) public view returns (uint) {
        return votosPorCandidato[_candidatoId];
    }

    function obterTotalVotos() public view returns (uint) {
        return totalVotos;
    }
    
    // Novas funções para obter códigos por candidato
    function obterNumeroCodigosPorCandidato(uint _candidatoId) public view returns (uint) {
        return codigosPorCandidato[_candidatoId].length;
    }
    
    function obterCodigoPorCandidatoEIndice(uint _candidatoId, uint _indice) public view returns (string memory) {
        require(_indice < codigosPorCandidato[_candidatoId].length, "Indice fora dos limites");
        return codigosPorCandidato[_candidatoId][_indice];
    }
    
    // Função para obter todos os códigos de um candidato (limitado a 100 para evitar problemas de gas)
    function obterCodigosPorCandidato(uint _candidatoId, uint _inicio, uint _fim) public view returns (string[] memory) {
        require(_inicio < codigosPorCandidato[_candidatoId].length, "Inicio fora dos limites");
        
        // Limitar o fim ao tamanho do array
        if (_fim > codigosPorCandidato[_candidatoId].length) {
            _fim = codigosPorCandidato[_candidatoId].length;
        }
        
        // Limitar o número de códigos retornados para evitar problemas de gas
        require(_fim - _inicio <= 100, "Muitos codigos solicitados. Limite: 100");
        
        string[] memory resultado = new string[](_fim - _inicio);
        
        for (uint i = _inicio; i < _fim; i++) {
            resultado[i - _inicio] = codigosPorCandidato[_candidatoId][i];
        }
        
        return resultado;
    }
}