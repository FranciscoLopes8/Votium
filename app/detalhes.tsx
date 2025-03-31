import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CandidateDetails() {
  const { id } = useLocalSearchParams(); // Pegando o ID do candidato
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  // Simulação de dados do candidato (poderia ser buscado da API)
  const candidato = {
    nome: "Mauro Pires",
    partido: "Frelimo",
    nascimento: "12/02/1976",
    naturalidade: "Maputo",
    nivelAcademico: "Mestrado em Relações Internacionais",
    biografia:
      "Trabalhou como organizador comunitário em Chicago, advogado de direitos civis e professor de direito constitucional na Universidade de Chicago.",
    imagem: require("../assets/images/logo.png"),
  };

  return (
    <View style={styles.container}>
      <Image source={candidato.imagem} style={styles.image} />
      <Text style={styles.name}>{candidato.nome}</Text>
      <Text style={styles.party}>{candidato.partido}</Text>

      {/* Botão de Votação */}
      <TouchableOpacity style={styles.voteButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.voteText}>Vote now</Text>
      </TouchableOpacity>

      {/* Tabs de Informação */}
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Profile</Text>
        <Text style={styles.inactiveTab}>Campaign</Text>
      </View>

      {/* Informações do Candidato */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Birthday</Text>
        <Text style={styles.text}>{candidato.nascimento}</Text>

        <Text style={styles.label}>Naturalness</Text>
        <Text style={styles.text}>{candidato.naturalidade}</Text>

        <Text style={styles.label}>Academic Level</Text>
        <Text style={styles.text}>{candidato.nivelAcademico}</Text>

        <Text style={styles.label}>Biography</Text>
        <Text style={styles.text}>{candidato.biografia}</Text>
      </View>

      {/* Modal de Confirmação */}
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmation</Text>
            <Text style={styles.modalText}>Are you sure? Your vote cannot be changed.</Text>
            <Text style={styles.modalSubtext}>After casting your vote, you will receive a confirmation message.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  image: { width: "100%", height: 200, borderRadius: 10 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  party: { fontSize: 16, color: "#777", marginBottom: 20 },
  voteButton: { backgroundColor: "#6C63FF", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  voteText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  tabs: { flexDirection: "row", marginBottom: 10 },
  activeTab: { fontWeight: "bold", color: "#6C63FF", marginRight: 20, borderBottomWidth: 2, borderBottomColor: "#6C63FF" },
  inactiveTab: { color: "#777" },
  infoContainer: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  text: { fontSize: 14, color: "#777" },

  // Estilos do Modal
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 14, textAlign: "center", fontWeight: "bold" },
  modalSubtext: { fontSize: 12, textAlign: "center", color: "#777", marginVertical: 10 },
  modalButtons: { flexDirection: "row", marginTop: 15 },
  cancelButton: { padding: 10, borderRadius: 5, marginRight: 10, borderWidth: 1, borderColor: "#6C63FF" },
  cancelText: { color: "#6C63FF", fontWeight: "bold" },
  confirmButton: { backgroundColor: "#6C63FF", padding: 10, borderRadius: 5 },
  confirmText: { color: "#fff", fontWeight: "bold" },
});