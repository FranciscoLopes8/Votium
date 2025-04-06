import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from 'react-native-gesture-handler';

interface Candidato {
  _id: string;
  nome: string;
  partido: string;
}

export default function Campanha() {
  const [dataVotacao, setDataVotacao] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const response = await fetch("http://192.168.1.183:5000/candidates");
        const data: Candidato[] = await response.json();
        setCandidatos(data);
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
      }
    };

    fetchCandidatos();
  }, []);

  const excluirCandidato = (id: string) => {
    Alert.alert("Confirmar Exclusão", "Tem certeza de que deseja excluir este candidato?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            const response = await fetch(`http://192.168.1.183:5000/candidates/${id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              setCandidatos(candidatos.filter(candidato => candidato._id !== id));
              alert("Candidato excluído com sucesso!");
            } else {
              alert("Erro ao excluir o candidato.");
            }
          } catch (error) {
            console.error("Erro na exclusão do candidato:", error);
            alert("Ocorreu um erro ao tentar excluir o candidato.");
          }
        },
      },
    ]);
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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Campanha</Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBox}>
        <Text style={styles.dateLabel}>Data da Votação</Text>
        <Text style={styles.dateValue}>{dataVotacao.toLocaleDateString("pt-PT")}</Text>
      </TouchableOpacity>

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

      <View style={styles.candidatosBox}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Candidatos</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/dadoscandidato")}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={candidatos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity style={styles.deleteButton} onPress={() => excluirCandidato(item._id)}>
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity style={styles.candidatoCard}>
                <Text style={styles.candidatoNome}>{item.nome}</Text>
                <Text style={styles.candidatoPartido}>{item.partido}</Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={guardarData}>
        <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
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
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: { fontWeight: "bold", marginBottom: 10 },
  candidatoCard: {
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
  saveButton: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
    width: 80, // Ajuste no tamanho do botão de exclusão
    height: 40,
    marginVertical: 10,
    borderRadius: 10,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
});
