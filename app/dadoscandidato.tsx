import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

import { IP } from "../config";

export default function DadosCandidato() {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [partido, setPartido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [naturalidade, setNaturalidade] = useState("");
  const [biografia, setBiografia] = useState("");
  const [plano, setPlano] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [cor, setCor] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  const coresPaleta: { nome: string; hex: string }[] = [
    { nome: "Verde", hex: "#4CAF50" },
    { nome: "Vermelho", hex: "#F44336" },
    { nome: "Azul", hex: "#2196F3" },
    { nome: "Amarelo", hex: "#FFEB3B" },
    { nome: "Roxo", hex: "#9C27B0" },
    { nome: "Laranja", hex: "#FF9800" },
    { nome: "Preto", hex: "#000000" },
    { nome: "Cinza", hex: "#9E9E9E" },
  ];

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const guardarCandidato = async () => {
    if (!nome || !partido || !nascimento || !naturalidade || !biografia || !plano || !foto || !cor) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("partido", partido);
    formData.append("nascimento", nascimento);
    formData.append("naturalidade", naturalidade);
    formData.append("biografia", biografia);
    formData.append("planoEleitoral", plano);
    formData.append("cor", cor);

    if (foto) {
      const fotoUri = foto;
      const uriParts = fotoUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("imagem", {
        uri: fotoUri,
        name: `foto.${fileType}`,
        type: `image/${fileType}`,
      } as unknown as Blob);
    }


    try {
      const response = await fetch(`http://${IP}:5000/candidates`, {
        method: "POST",
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        return
      } else {
        alert("Erro ao guardar o candidato");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao tentar enviar os dados.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: "#fff" }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        {/* Botão Voltar */}
        <TouchableOpacity onPress={() => router.push("/Campanha")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Título com cor do partido */}
        <Text style={styles.title}>Dados do Candidato</Text>

        {/* Campos */}
        {[
          { label: "Nome do candidato", value: nome, setter: setNome },
          { label: "Partido", value: partido, setter: setPartido },
          { label: "País de nascimento", value: nascimento, setter: setNascimento },
          { label: "Naturalidade", value: naturalidade, setter: setNaturalidade },
        ].map(({ label, value, setter }) => (
          <View key={label} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={label}
              value={value}
              onChangeText={setter}
              placeholderTextColor="#999"
              underlineColorAndroid="transparent"
            />
          </View>
        ))}

        {/* Foto */}
        <TouchableOpacity style={styles.fotoButton} onPress={escolherFoto}>
          <Ionicons name="camera" size={28} color="#555" />
          <Text style={styles.fotoText}>Escolher fotografia</Text>
        </TouchableOpacity>
        {foto && <Image source={{ uri: foto }} style={styles.fotoPreview} />}

        {/* Biografia */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Biografia do candidato..."
            value={biografia}
            onChangeText={setBiografia}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Plano */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Plano de campanha..."
            value={plano}
            onChangeText={setPlano}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Paleta de cores - remover input texto de cor */}
        <Text style={styles.label}>Escolha a cor do Partido</Text>
        <View style={styles.paletaContainer}>
          {coresPaleta.map(({ nome, hex }) => (
            <TouchableOpacity
              key={nome}
              style={[
                styles.colorCircle,
                { backgroundColor: hex },
                cor === hex && styles.colorCircleSelected,
              ]}
              onPress={() => setCor(hex)}
              activeOpacity={0.7}
            />
          ))}
        </View>

        {/* Botão Guardar com cor do partido */}
        <TouchableOpacity style={styles.buttonModal} onPress={() => {
          guardarCandidato();
          setModalVisible(true);
        }}
        >
          <Text style={styles.buttonTextModal}>Guardar Alterações</Text>
        </TouchableOpacity>

        <Modal animationType="none" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Candidato adicionado com sucesso</Text>
              <Ionicons name="checkmark-circle" size={50} color="#4B2AFA" style={{ marginBottom: 10 }} />
              <TouchableOpacity style={styles.buttonModal} onPress={() => {
                setModalVisible(false);
                router.push("/Campanha");
              }}
              >
                <Text style={styles.buttonTextModal}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 30,
    textAlign: "center",
    color:"#4B2AFA"
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  fotoButton: {
    backgroundColor: "#e1e1e1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  fotoText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 16,
  },
  fotoPreview: {
    width: "90%",
    height: 220,
    borderRadius: 15,
    marginBottom: 25,
    marginHorizontal: "5%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginHorizontal: 20,
    color: "#444",
  },
  paletaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 20,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleSelected: {
    borderColor: "#4B2AFA",
    borderWidth: 3,
  },
  previewCorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#4B2AFA",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  buttonModal: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonTextModal: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#4B2AFA" },
  modalButtons: { flexDirection: "row", marginTop: 15 },
});
