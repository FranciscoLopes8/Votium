import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getVotoContract } from "./contracts/votoContract";
import { Ionicons } from "@expo/vector-icons";

export default function Voto() {
  const [codigoPessoal, setCodigoPessoal] = useState("");
  const [candidatoNome, setCandidatoNome] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [votacaoTerminada] = useState(true);
  const [showVote, setShowVote] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  const resultados = [
    { partido: "Frelimo", votos: 10743348, percentagem: 78, cor: "#00C853" },
    { partido: "Renamo", votos: 1743348, percentagem: 18, cor: "#2962FF" },
    { partido: "MDM", votos: 743348, percentagem: 7, cor: "#6A1B9A" },
    { partido: "ND", votos: 113348, percentagem: 8, cor: "#FFD600" },
    { partido: "CMS", votos: 17348, percentagem: 5, cor: "#FFAB00" },
    { partido: "CMD", votos: 7348, percentagem: 1, cor: "#D50000" },
  ];

  const buscarCandidato = async (id: number) => {
    try {
      const res = await fetch("http://192.168.1.170:5000/candidates");
      const data = await res.json();

      const map: Record<number, string> = {};
      data.forEach((c: any, index: number) => {
        map[index + 1] = c.nome;
      });

      if (map[id]) setCandidatoNome(map[id]);
      else setCandidatoNome("Desconhecido");
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
      const contrato = getVotoContract();
      const candidatoId: number = await contrato.consultarVoto(codigoPessoal);
      await buscarCandidato(Number(candidatoId));
      setFirstTime(false); // Marca como já verificado
    } catch (err) {
      console.log("Erro ao consultar voto:", err);
      alert("Código inválido ou erro ao consultar.");
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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>O teu voto foi em:</Text>
            <View style={styles.voteRow}>
              <Text style={styles.headerCandidato}>
                {showVote ? candidatoNome : "Confidencial"}
              </Text>
              <TouchableOpacity onPress={() => setShowVote(!showVote)} style={styles.eyeIcon}>
                <Ionicons name={showVote ? "eye-off" : "eye"} size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {votacaoTerminada ? (
            resultados.map((item, index) => (
              <View key={index} style={styles.resultContainer}>
                <Text style={styles.partidoText}>
                  {item.partido} - {item.percentagem}%
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
                <Text style={styles.votosText}>Votos: {item.votos.toLocaleString()}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.waitingText}>
              Os resultados estarão disponíveis após o encerramento da votação.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
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
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  headerCandidato: { color: "#fff", fontSize: 20, fontWeight: "bold" },
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
  partidoText: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
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
  votosText: { fontSize: 14, color: "#555" },
});
