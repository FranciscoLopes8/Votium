import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Swipeable} from 'react-native-gesture-handler';
import { Switch } from "react-native";

import { IP } from "../config";

interface Candidato {
  _id: string;
  nome: string;
  partido: string;
  imagem?: string;
}

export default function Campanha() {
  const [dataVotacao, setDataVotacao] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [modalVisibleConfirm, setModalVisibleConfirm] = useState(false);
  const [candidatoParaExcluir, setCandidatoParaExcluir] = useState<Candidato | null>(null);
  const [modalVisibleElim, setModalVisibleElim] = useState(false);
  const [anonima, setAnonima] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const response = await fetch(`http://${IP}:5000/candidates`);
        const data: Candidato[] = await response.json();
        setCandidatos(data);
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
      }
    };
    const fetchAnonima = async () => {
      const value = await AsyncStorage.getItem("campanhaAnonima");
      if (value !== null) setAnonima(value === "true");
    };
    fetchAnonima();     
    fetchCandidatos();
  }, []);

  const abrirConfirmacaoExclusao = (candidato: Candidato) => {
    setCandidatoParaExcluir(candidato);
    setModalVisibleConfirm(true);
  };

    const toggleAnonima = async () => {
    setAnonima((prev) => {
      AsyncStorage.setItem("campanhaAnonima", (!prev).toString());
      return !prev;
    });
  };

  const excluirCandidato = async () => {
    if (!candidatoParaExcluir) return;
    try {
      const response = await fetch(`http://${IP}:5000/candidates/${candidatoParaExcluir._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCandidatos(candidatos.filter(c => c._id !== candidatoParaExcluir._id));
        setModalVisibleConfirm(false);
        setModalVisibleElim(true);
      } else {
        alert("Erro ao excluir o candidato.");
      }
    } catch (error) {
      console.error("Erro na exclusão do candidato:", error);
      alert("Ocorreu um erro ao tentar excluir o candidato.");
    }
  };

  const guardarData = async () => {
    try {
      await AsyncStorage.setItem("dataVotacao", dataVotacao.toISOString());
      alert("Data da votação guardada com sucesso!");
    } catch (error) {
      console.error("Erro ao guardar data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/home")}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Campanha</Text>

      <View style={styles.dateBox}>
        <Text style={styles.dateLabel}>Data da Votação</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateValue}>{dataVotacao.toLocaleDateString("pt-PT")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButtonSmall} onPress={guardarData}>
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dataVotacao}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDataVotacao(selectedDate);
          }}
        />
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>
          {anonima ? "Campanha Anónima" : "Campanha Pública"}
        </Text>
        <Switch
          value={!anonima}
          onValueChange={toggleAnonima}
          thumbColor={anonima ? "#888" : "#4B2AFA"}
          trackColor={{ false: "#ccc", true: "#7d6ce0" }}
        />
      </View>

      <View style={styles.candidatosBox}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Candidatos</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/dadoscandidato")}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlashList
          data={candidatos}
          keyExtractor={(item) => item._id}
          estimatedItemSize={80}
          contentContainerStyle={{ paddingBottom: 25 }}
          renderItem={({ item }) => (
            <Swipeable
              renderLeftActions={() => (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={async () => {
                    await AsyncStorage.setItem("candidatoSelecionado", JSON.stringify(item));
                    router.push("/editarCandidato");
                  }}
                >
                  <Text style={styles.deleteText}>Editar</Text>
                </TouchableOpacity>
              )}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => abrirConfirmacaoExclusao(item)}
                >
                  <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity style={styles.candidatoCard}>
                <Image
                  source={
                    item.imagem && item.imagem.startsWith("/")
                      ? { uri: `http://${IP}:5000${item.imagem}` }
                      : require("../assets/images/default-avatar-icon.jpg")
                  }
                  style={styles.candidateImage}
                  resizeMode="cover"
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.candidatoNome}>{item.nome}</Text>
                  <Text style={styles.candidatoPartido}>{item.partido}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />

        {/* Modal de confirmação de exclusão */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisibleConfirm}
          onRequestClose={() => setModalVisibleConfirm(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <Text style={styles.modalText}>
                Tem certeza de que deseja eliminar{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {candidatoParaExcluir?.nome}
                </Text>?
              </Text>
              <Text style={styles.modalSubtext}>Esta ação não pode ser desfeita.</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisibleConfirm(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={excluirCandidato}
                >
                  <Text style={styles.confirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de sucesso exclusão */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisibleElim}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitleSuc}>Candidato eliminado com sucesso</Text>
              <Ionicons
                name="checkmark-circle"
                size={50}
                color="#4B2AFA"
                style={{ marginBottom: 10 }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setModalVisibleElim(false);
                  router.push("/Campanha");
                }}
              >
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#4B2AFA",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 30, marginTop: 70 },
  dateBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateLabel: { fontWeight: "bold", marginBottom: 5 },
  dateValue: { color: "#4B2AFA" },
  candidatosBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flex: 1,
  },
    switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
  },
  switchLabel: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#111",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: { fontWeight: "bold", marginBottom: 10 },
  candidatoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  candidatoNome: { fontWeight: "bold" },
  candidatoPartido: { color: "#555" },
  addButton: {
    alignSelf: "flex-end",
    backgroundColor: "#4B2AFA",
    borderRadius: 20,
    marginTop: -5,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  deleteButton: {
    backgroundColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 40,
    marginVertical: 10,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: "#4B2AFA",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 40,
    marginVertical: 10,
    borderRadius: 10,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButtonSmall: {
    backgroundColor: "#4B2AFA",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
  candidateImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  button: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitleSuc: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#4B2AFA", textAlign: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#4B2AFA", textAlign: "center" },
  modalText: { fontSize: 14, textAlign: "center", fontWeight: "bold" },
  modalSubtext: { fontSize: 12, textAlign: "center", color: "#777", marginVertical: 10 },
  modalButtons: { flexDirection: "row", marginTop: 15 },
  cancelButton: { padding: 10, borderRadius: 5, marginRight: 10, borderWidth: 1, borderColor: "#4B2AFA" },
  cancelText: { color: "#4B2AFA", fontWeight: "bold" },
  confirmButton: { backgroundColor: "#4B2AFA", padding: 10, borderRadius: 5 },
  confirmText: { color: "#fff", fontWeight: "bold" },
});
