import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const navigation = useNavigation();

  // Estados para os botões e idioma selecionado
  const [notificacoes, setNotificacoes] = useState("Sim");
  const [tema, setTema] = useState("Claro");
  const [idioma, setIdioma] = useState("Português");

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Definições</Text>

      {/* Notificações */}
      <View style={styles.optionContainer}>
        <Text style={styles.optionLabel}>Notificações</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, notificacoes === "Não" && styles.activeButton]}
            onPress={() => setNotificacoes("Não")}
          >
            <Text style={[styles.toggleText, notificacoes === "Não" && styles.activeText]}>Não</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, notificacoes === "Sim" && styles.activeButton]}
            onPress={() => setNotificacoes("Sim")}
          >
            <Text style={[styles.toggleText, notificacoes === "Sim" && styles.activeText]}>Sim</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Idioma */}
      <View style={styles.optionContainer}>
        <Text style={styles.optionLabel}>Idioma</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idioma}
            onValueChange={(itemValue) => setIdioma(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Português" value="Português" />
            <Picker.Item label="Inglês" value="Inglês" />
            <Picker.Item label="Espanhol" value="Espanhol" />
            <Picker.Item label="Francês" value="Francês" />
            <Picker.Item label="Mandarim" value="Mandarim" />
          </Picker>
        </View>
      </View>

      {/* Tema */}
      <View style={styles.optionContainer}>
        <Text style={styles.optionLabel}>Tema</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, tema === "Escuro" && styles.activeButton]}
            onPress={() => setTema("Escuro")}
          >
            <Text style={[styles.toggleText, tema === "Escuro" && styles.activeText]}>Escuro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, tema === "Claro" && styles.activeButton]}
            onPress={() => setTema("Claro")}
          >
            <Text style={[styles.toggleText, tema === "Claro" && styles.activeText]}>Claro</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    marginTop: 40,
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4B2AFA",
  },
  toggleText: {
    fontSize: 16,
    color: "#000",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
