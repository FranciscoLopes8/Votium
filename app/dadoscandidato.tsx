import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const IP = "192.168.1.170";

export default function DadosCandidato() {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [partido, setPartido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [naturalidade, setNaturalidade] = useState("");
  const [biografia, setBiografia] = useState("");
  const [plano, setPlano] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

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
    if (!nome || !partido || !nascimento || !naturalidade || !biografia || !plano || !foto) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("partido", partido);
    formData.append("nascimento", nascimento);
    formData.append("naturalidade", naturalidade);
    formData.append("biografia", biografia);
    formData.append("plano", plano);

    if (foto) {
      const fotoUri = foto;
      const uriParts = fotoUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("imagem", {
        uri: fotoUri,
        name: `foto.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const response = await fetch(`http://${IP}5000/candidates`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Candidato guardado com sucesso!");
        router.push("/Campanha");
        navigation.goBack();
      } else {
        alert("Erro ao guardar o candidato.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao tentar enviar os dados.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Botão Voltar */}
        <TouchableOpacity onPress={() => router.push("/Campanha")} style={styles.backButton}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Dados do Candidato</Text>

        {/* Nome */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome do candidato"
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Partido */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Partido"
            value={partido}
            onChangeText={setPartido}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Nascimento */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="País de nascimento"
            value={nascimento}
            onChangeText={setNascimento}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Naturalidade */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Naturalidade"
            value={naturalidade}
            onChangeText={setNaturalidade}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Botão de Foto */}
        <TouchableOpacity style={styles.fotoButton} onPress={escolherFoto}>
          <Ionicons name="camera" size={30} color="#333" />
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
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Plano de Campanha */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Plano de campanha..."
            value={plano}
            onChangeText={setPlano}
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Botão Guardar */}
        <TouchableOpacity style={styles.button} onPress={guardarCandidato}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    paddingBottom: 80,
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
    marginTop: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  fotoButton: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "column",
  },
  fotoText: {
    color: "#333",
    fontWeight: "500",
    marginTop: 5,
  },
  fotoPreview: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
