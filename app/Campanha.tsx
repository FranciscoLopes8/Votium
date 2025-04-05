import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

export default function Campanha() {
  const [dataVotacao, setDataVotacao] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const candidatos = [
    { id: "1", nome: "Mauro Pires", partido: "Frelimo" },
    { id: "2", nome: "Mauro Pires", partido: "Renamo" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Campanha</Text>

      {/* Data da votação */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBox}>
        <Text style={styles.dateLabel}>Data da Votação</Text>
        <Text style={styles.dateValue}>
          {dataVotacao.toLocaleDateString("pt-PT")}
        </Text>
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

      {/* Lista de Candidatos */}
      <View style={styles.candidatosBox}>
        <Text style={styles.label}>Candidatos</Text>
        <FlatList
          data={candidatos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.candidatoCard}>
              <Text style={styles.candidatoNome}>{item.nome}</Text>
              <Text style={styles.candidatoPartido}>{item.partido}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/dadoscandidato")}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backButton: { position: "absolute", top: 40, left: 20 },
  backText: { fontSize: 22, color: "#4B2AFA", fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 30 },
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
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  saveButton: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
