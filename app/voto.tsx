import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { getVotoContract, obterVotosPorCandidato, obterTotalVotos } from "./contracts/votoContractV2";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IP } from "../config";

export default function Voto() {
  const [codigoPessoal, setCodigoPessoal] = useState("");
  const [candidatoNome, setCandidatoNome] = useState<string | null>(null);
  const [candidato, setCandidato] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [candidatoCorrespondente, setCandidatoCorrespondente] = useState<any>(null);
  const [votacaoTerminada, setvotacaoTerminada] = useState(false);
  const [showVote, setShowVote] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [resultados, setResultados] = useState<{ votos: number; id: number; partido: string; cor: string; percentagem: number }[]>([]);
  const [user, setUser] = useState({ role: "" });

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`http://${IP}:5000/auth/perfil`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          alert("Erro ao carregar perfil");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    const carregarResultados = async () => {
      try {
        const res = await fetch(`http://${IP}:5000/candidates`);
        const candidatos = await res.json();

        const totalVotos = await obterTotalVotos();

        const map: Record<string, number> = {};
        candidatos.forEach((candidato: any, index: number) => {
          map[candidato._id] = index + 1;
        });

        fetchUser();

        const resultadosVotacao = await Promise.all(
          candidatos.map(async (candidato: any) => {
            const candidatoId = map[candidato._id];
            let votos = 0;

            try {
              votos = await obterVotosPorCandidato(candidatoId);
            } catch (err) {
              console.error(`Erro ao obter votos para candidato ${candidatoId}:`, err);
            }

            return {
              id: candidatoId,
              partido: candidato.partido,
              cor: candidato.cor,
              votos,
              percentagem: totalVotos ? (votos / totalVotos) * 100 : 0,
            };
          })
        );

        setResultados(resultadosVotacao);
      } catch (err) {
        console.error("Erro ao carregar resultados:", err);
      }
    };

    const verificarEleicao = async () => {
      const resultado = await AsyncStorage.getItem("votacaoTerminada");
      const terminou = resultado === "true";
      setvotacaoTerminada(terminou);

      if (terminou) {
        carregarResultados();
      }
    };

    verificarEleicao();
  }, []);

  const buscarCandidato = async (id: number) => {
    try {
      const res = await fetch(`http://${IP}:5000/candidates`);
      const data = await res.json();

      const map: Record<number, any> = {};
      data.forEach((c: any, index: number) => {
        map[index + 1] = c;
      });
      const cand = map[id];

      if (cand) {
        setCandidato(cand);
        setCandidatoNome(cand.nome);
      } else {
        setCandidatoNome("Desconhecido");
      }
    } catch (e) {
      console.log("Erro ao buscar candidato:", e);
      setCandidatoNome("Erro");
    }
  };

  const consultarVoto = async () => {
    if (!codigoPessoal) {
      alert("Insira o seu código pessoal.");
      return;
    }

    try {
      setCarregando(true);
      const contrato = await getVotoContract();
      const candidatoId: number = await contrato.consultarVoto(codigoPessoal);

      await buscarCandidato(Number(candidatoId));
      setFirstTime(false);

    } catch (err: any) {
      console.log("Erro ao consultar voto:", err);

      const mensagemErro = err?.error?.data;

      if (mensagemErro?.includes("Code not found") || err.message?.includes("Code not found")) {
        alert("Ainda não votaste!");
      } else {
        alert("Código inválido ou erro ao consultar.");
      }

    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {firstTime ? (
        <View style={styles.verificacaoContainer}>
          <Text style={styles.verificacaoTitle}>Consulta de Voto</Text>
          <Text style={styles.verificacaoSubtitle}>
            Introduz o teu código pessoal para verificar em quem votaste
          </Text>

          <TextInput
            style={styles.verificacaoInput}
            placeholder="Ex: aB123xyz"
            autoCapitalize="none"
            value={codigoPessoal}
            onChangeText={setCodigoPessoal}
          />

          <TouchableOpacity style={styles.verificacaoButton} onPress={consultarVoto}>
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verificacaoButtonText}>Ver o meu voto</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {user.role === "User" && (
            <>
              {!votacaoTerminada ? (
                <>
                  <View style={styles.header}>
                    <Text style={styles.headerTitle}>O teu voto foi em:</Text>
                  </View>
                  <View style={styles.candidateCard}>
                    <Image
                      source={
                        candidato.imagem?.startsWith("/")
                          ? { uri: `http://${IP}:5000${candidato.imagem}` }
                          : require("../assets/images/icon.png")
                      }
                      style={styles.candidateImage}
                    />
                    <Text style={styles.candidateName}>{candidato.nome}</Text>
                  </View>
                  <Text style={styles.candidatoBiografia}>
                    {candidato.biografia}
                  </Text>
                </>
              ) : <>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Painel de Resultados</Text>
                </View>
                <View>
                  {resultados.length > 0 ? (
                    resultados.map((item, index) => (
                      <View key={index} style={styles.resultContainer}>
                        <Text style={styles.partidoText}>
                          {item.partido} - {item.percentagem.toFixed(2)}%
                        </Text>
                        <View style={styles.progressBarBackground}>
                          <View
                            style={{
                              ...styles.progressBarFill,
                              width: `${item.percentagem}%`,
                              backgroundColor: item.cor,
                            }}
                          />
                        </View>
                        <Text style={styles.votosText}>
                          Votos: {item.votos.toLocaleString()}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.waitingText}>Nenhum resultado encontrado.</Text>
                  )}
                </View>
              </>}
            </>
          )}

          {/* Renderização dos resultados para administradores */}
          {user.role === "Admin" && (
            <>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Painel de Resultados</Text>
              </View>
              <View>
                {resultados.length > 0 ? (
                  resultados.map((item, index) => (
                    <View key={index} style={styles.resultContainer}>
                      <Text style={styles.partidoText}>
                        {item.partido} - {item.percentagem.toFixed(2)}%
                      </Text>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={{
                            ...styles.progressBarFill,
                            width: `${item.percentagem}%`,
                            backgroundColor: item.cor,
                          }}
                        />
                      </View>
                      <Text style={styles.votosText}>
                        Votos: {item.votos.toLocaleString()}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.waitingText}>Nenhum resultado encontrado.</Text>
                )}
              </View>
            </>
          )}
        </>

      )}
    </ScrollView>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16
  },
  verificacaoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 250,
  },
  verificacaoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  verificacaoSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  verificacaoInput: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  verificacaoButton: {
    width: "80%",
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  verificacaoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    backgroundColor: "#3C1FA1",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  voteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  eyeIcon: {
    marginLeft: 10,
    marginTop: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
  },
  headerCandidato: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  waitingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  resultContainer: {
    backgroundColor: "#EDE7F6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  partidoText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  votosText: {
    fontSize: 14,
    color: "#555"
  },
  candidateImage: { width: 200, height: 200, borderRadius: 30, alignSelf: "center" },
  candidateCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    width: "90%",
    minHeight: 80,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: "center"
  },
  candidateName: { fontSize: 24, fontWeight: "bold", alignSelf: "center", padding: 20 },
  candidatoBiografia: { fontSize: 18, padding: 20 },
});
