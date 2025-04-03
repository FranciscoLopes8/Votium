// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Votacao {
    // Estrutura para armazenar um voto
    struct Voto {
        uint candidatoId;
        string codigoPessoal;
        address votante;
    }

    // Mapeamento que associa um código ao voto
    mapping(string => Voto) public votos;

    // Mapeamento para verificar se o endereço já votou
    mapping(address => bool) public jaVotou;

    // Evento para emitir quando um voto é registrado
    event VotoRegistrado(
        address indexed votante,
        uint candidatoId,
        string codigoPessoal
    );

    // Função para votar
    function votar(uint _candidatoId, string memory _codigoPessoal) public {
        // Verificar se o votante já votou
        require(!jaVotou[msg.sender], "Ja votou!");

        // Verificar se o código pessoal é único (não duplicado)
        require(
            bytes(votos[_codigoPessoal].codigoPessoal).length == 0,
            "Este codigo ja foi usado!"
        );

        // Registrar o voto
        votos[_codigoPessoal] = Voto({
            candidatoId: _candidatoId,
            codigoPessoal: _codigoPessoal,
            votante: msg.sender
        });

        // Marcar que o votante já votou
        jaVotou[msg.sender] = true;

        // Emitir o evento de voto
        emit VotoRegistrado(msg.sender, _candidatoId, _codigoPessoal);
    }

    // Função para consultar o voto de um código
    function consultarVoto(
        string memory _codigoPessoal
    ) public view returns (uint candidatoId, address votante) {
        require(
            bytes(votos[_codigoPessoal].codigoPessoal).length != 0,
            "Codigo nao encontrado!"
        );
        Voto memory voto = votos[_codigoPessoal];
        return (voto.candidatoId, voto.votante);
    }
}
