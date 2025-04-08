import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Voto() {
  const [votacaoTerminada, setVotacaoTerminada] = useState(true); // muda pra true p/ testes
  const [candidatoEscolhido, setCandidatoEscolhido] = useState("Mauro Pires");

  // Mock dos resultados
  const resultados = [
    { partido: "Frelimo", votos: 10743348, percentagem: 78, cor: "#00C853" },
    { partido: "Renamo", votos: 1743348, percentagem: 18, cor: "#2962FF" },
    { partido: "MDM", votos: 743348, percentagem: 7, cor: "#6A1B9A" },
    { partido: "ND", votos: 113348, percentagem: 8, cor: "#FFD600" },
    { partido: "CMS", votos: 17348, percentagem: 5, cor: "#FFAB00" },
    { partido: "CMD", votos: 7348, percentagem: 1, cor: "#D50000" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Candidato escolhido */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>O teu voto foi no:</Text>
        <Text style={styles.headerCandidato}>{candidatoEscolhido}</Text>
      </View>

      {/* Resultados */}
      {votacaoTerminada ? (
        resultados.map((item, index) => (
          <View key={index} style={styles.resultContainer}>
            <Text style={styles.partidoText}>{item.partido} - {item.percentagem}%</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={{
                  ...styles.progressBarFill,
                  width: `${item.percentagem}%`,
                  backgroundColor: item.cor,
                }}
              />
            </View>
            <Text style={styles.votosText}>Votes: {item.votos.toLocaleString()}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.waitingText}>
          Os resultados estarão disponíveis após o encerramento da votação.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    backgroundColor: "#3C1FA1",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  headerCandidato: { color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 5 },
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
