// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Voto {
    struct Votacao {
        uint candidatoId;
        string codigoPessoal; 
        address votante;
    }

    mapping(bytes32 => Votacao) public votos;

    mapping(address => bool) public jaVotou;

    event VotoRegistado(
        address indexed votante,
        uint candidatoId,
        string codigoPessoal
    );

    function votar(uint _candidatoId, string memory _codigoPessoal) public {
        require(!jaVotou[msg.sender], "Already voted!");

        bytes32 hashCodigo = keccak256(abi.encodePacked(_codigoPessoal));
        require(
            votos[hashCodigo].votante == address(0),
            "This code has already been used!"
        );

        votos[hashCodigo] = Votacao({
            candidatoId: _candidatoId,
            codigoPessoal: _codigoPessoal,
            votante: msg.sender
        });

        jaVotou[msg.sender] = true;

        emit VotoRegistado(msg.sender, _candidatoId, _codigoPessoal);
    }

    function consultarVoto(
        string memory _codigoPessoal
    ) public view returns (uint candidatoId) {
        bytes32 hashCodigo = keccak256(abi.encodePacked(_codigoPessoal));

        require(
            votos[hashCodigo].votante != address(0),
            "Code not found!"
        );

        Votacao memory voto = votos[hashCodigo];
        return voto.candidatoId;
    }
}
