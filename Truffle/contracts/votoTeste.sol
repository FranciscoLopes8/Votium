// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract votoTeste {
    struct Voto {
        address eleitor;
        uint256 candidato;
        bytes32 codigoVerificacao;
    }

    mapping(bytes32 => Voto) public votos;
    mapping(address => bool) public jaVotou;

    event VotoRegistrado(
        address eleitor,
        uint256 candidato,
        bytes32 codigoVerificacao
    );

    function votar(uint256 _candidato) public {
        require(!jaVotou[msg.sender], "Ja votaste!");

        bytes32 codigoVerificacao = keccak256(
            abi.encodePacked(msg.sender, block.timestamp)
        );

        votos[codigoVerificacao] = Voto(
            msg.sender,
            _candidato,
            codigoVerificacao
        );
        jaVotou[msg.sender] = true;

        emit VotoRegistrado(msg.sender, _candidato, codigoVerificacao);
    }

    function verificarVoto(
        bytes32 _codigoVerificacao
    ) public view returns (uint256) {
        require(
            votos[_codigoVerificacao].eleitor != address(0),
            "Codigo invalido!"
        );
        return votos[_codigoVerificacao].candidato;
    }
}
