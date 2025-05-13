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
}
