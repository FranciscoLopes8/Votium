import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IP } from "../config";

const paletaCores = [
  { nome: "Verde", hex: "#4CAF50" },
  { nome: "Vermelho", hex: "#F44336" },
  { nome: "Azul", hex: "#2196F3" },
  { nome: "Amarelo", hex: "#FFEB3B" },
  { nome: "Roxo", hex: "#9C27B0" },
  { nome: "Laranja", hex: "#FF9800" },
  { nome: "Cinza", hex: "#9E9E9E" },
];

export default function EditarCandidato() {
  const [candidato, setCandidato] = useState<any>({
    _id: "",
    nome: "",
    partido: "",
    imagem: "",
    nascimento: "",
    biografia: "",
    naturalidade: "",
    planoEleitoral: "",
    cor: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [imagem, setImagem] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const carregarCandidato = async () => {
      const dados = await AsyncStorage.getItem("candidatoSelecionado");
      if (dados) {
        const candidatoData = JSON.parse(dados);
        setCandidato(candidatoData);
        setImagem(candidatoData.imagem ? `http://${IP}:5000${candidatoData.imagem}` : null);
      }
    };

    carregarCandidato();
  }, []);

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const salvarAlteracoes = async () => {
    const formData = new FormData();
    formData.append("nome", candidato.nome);
    formData.append("partido", candidato.partido);
    formData.append("nascimento", candidato.nascimento);
    formData.append("naturalidade", candidato.naturalidade);
    formData.append("biografia", candidato.biografia);
    formData.append("planoEleitoral", candidato.planoEleitoral);
    formData.append("cor", candidato.cor);

    if (imagem && imagem.startsWith("file://")) {
      const uriParts = imagem.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("imagem", {
        uri: imagem,
        name: `foto.${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const response = await fetch(`http://${IP}:5000/candidatoperfil/${candidato._id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        return
      } else {
        const erro = await response.text();
        console.error("Erro ao atualizar:", erro);
        alert("Erro ao atualizar candidato.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.push("/Campanha")} style={styles.backButton}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Editar Candidato</Text>

        <TouchableOpacity style={styles.imagemButton} onPress={selecionarImagem}>
          <Image
            source={imagem?.startsWith("/") ? { uri: imagem } : require("../assets/images/default-avatar-icon.jpg")}
            style={styles.imagem}
            resizeMode="cover"
          />
          <Text style={styles.imagemText}>Alterar Imagem</Text>
        </TouchableOpacity>

        {[
          { label: "Nome", field: "nome" },
          { label: "Partido", field: "partido" },
          { label: "Nascimento", field: "nascimento" },
          { label: "Naturalidade", field: "naturalidade" },
          { label: "Biografia", field: "biografia" },
          { label: "Plano Eleitoral", field: "planoEleitoral" },
        ].map(({ label, field }, index) => (
          <View style={styles.inputContainer} key={index}>
            <TextInput
              style={[styles.input, field === "biografia" || field === "planoEleitoral" ? styles.multiline : null]}
              placeholder={label}
              value={candidato[field]}
              onChangeText={(text) => setCandidato({ ...candidato, [field]: text })}
              multiline={field === "biografia" || field === "planoEleitoral"}
              placeholderTextColor="#aaa"
            />
          </View>
        ))}

        <Text style={styles.label}>Cor Representativa:</Text>
        <View style={styles.paletaContainer}>
          {paletaCores.map(({ nome, hex }) => (
            <TouchableOpacity
              key={hex}
              style={[
                styles.colorCircle,
                { backgroundColor: hex },
                candidato.cor === hex && styles.colorSelected,
              ]}
              onPress={() => setCandidato({ ...candidato, cor: hex })}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => {
          salvarAlteracoes();
          setModalVisible(true);
        }}
        >
          <Text style={styles.buttonText}>Guardar Alterações</Text>
        </TouchableOpacity>

        <Modal animationType="none" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Dados alterados com sucesso</Text>
              <Ionicons name="checkmark-circle" size={50} color="#4B2AFA" style={{ marginBottom: 10 }} />
              <TouchableOpacity style={styles.button} onPress={() => {
                setModalVisible(false);
                router.push("/Campanha");
              }}
              >
                <Text style={styles.buttonText}>Voltar</Text>
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
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
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
    marginBottom: 30,
    textAlign: "center",
    color: "#4B2AFA"
  },
  imagemButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  imagemText: {
    color: "#4B2AFA",
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontWeight: "600",
    marginBottom: 10,
  },
  paletaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 6,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  colorSelected: {
    borderColor: "#000",
    borderWidth: 3,
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#4B2AFA" },
  modalButtons: { flexDirection: "row", marginTop: 15 },
});
