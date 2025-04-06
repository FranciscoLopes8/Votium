import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export default function DadosCandidato() {
  const navigation = useNavigation();

  // Estados
  const [nome, setNome] = useState("");
  const [partido, setPartido] = useState("");
  const [nascimento, setNascimento] = useState("");  // Atualizado para 'nascimento'
  const [naturalidade, setNaturalidade] = useState("");
  const [biografia, setBiografia] = useState("");
  const [plano, setPlano] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  // Função para escolher a imagem
  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Usando a opção correta
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // Função para guardar o candidato
  const guardarCandidato = async () => {
    // Verificação se todos os campos foram preenchidos
    if (!nome || !partido || !nascimento || !naturalidade || !biografia || !plano || !foto) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("partido", partido);
    formData.append("nascimento", nascimento);  // Atualizado para 'nascimento'
    formData.append("naturalidade", naturalidade);
    formData.append("biografia", biografia);
    formData.append("plano", plano);

    if (foto) {
      const fotoUri = foto;
      const uriParts = fotoUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("imagem", {  // Alterado para 'imagem' no lugar de 'foto'
        uri: fotoUri,
        name: `foto.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const response = await fetch("http://192.168.1.183:5000/candidates", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/Campanha");
        alert("Candidato guardado com sucesso!");
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Dados do Candidato</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Insira o nome do candidato"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Insira o partido do candidato"
          value={partido}
          onChangeText={setPartido}
        />
        <TextInput
          style={styles.input}
          placeholder="Insira o país de nascimento"
          value={nascimento}  // Alterado para 'nascimento'
          onChangeText={setNascimento}
        />
        <TextInput
          style={styles.input}
          placeholder="Insira a naturalidade"
          value={naturalidade}
          onChangeText={setNaturalidade}
        />

        {/* Upload de Foto */}
        <TouchableOpacity style={styles.fotoButton} onPress={escolherFoto}>
          <Text>
            <Ionicons name="camera" size={30} color="#333" /> {/* Ícone da câmera */}
          </Text>
          <Text style={styles.fotoText}>Escolher fotografia</Text>
        </TouchableOpacity>
        {foto && <Image source={{ uri: foto }} style={styles.fotoPreview} />}

        {/* Campos grandes */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Insira a biografia do candidato..."
          value={biografia}
          onChangeText={setBiografia}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Insira o plano de campanha..."
          value={plano}
          onChangeText={setPlano}
          multiline
          numberOfLines={4}
        />

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
    textAlign: "left",
    marginTop: 30,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
