import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default function DadosCandidato() {
  const navigation = useNavigation();

  // Estados
  const [nome, setNome] = useState("");
  const [partido, setPartido] = useState("");
  const [pais, setPais] = useState("");
  const [naturalidade, setNaturalidade] = useState("");
  const [biografia, setBiografia] = useState("");
  const [plano, setPlano] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  // Função para escolher a imagem
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Dados do Candidato</Text>

      {/* Inputs */}
      <TextInput style={styles.input} placeholder="Nome do Candidato" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Partido do Candidato" value={partido} onChangeText={setPartido} />
      <TextInput style={styles.input} placeholder="País de Nascimento" value={pais} onChangeText={setPais} />
      <TextInput style={styles.input} placeholder="Naturalidade" value={naturalidade} onChangeText={setNaturalidade} />

      {/* Upload de Foto */}
      <TouchableOpacity style={styles.fotoButton} onPress={escolherFoto}>
        <Text style={styles.fotoText}>📷 Fotografia</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.fotoPreview} />}

      {/* Campos grandes */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Biografia..."
        value={biografia}
        onChangeText={setBiografia}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Plano de campanha"
        value={plano}
        onChangeText={setPlano}
        multiline
        numberOfLines={4}
      />

      {/* Botão Guardar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    padding: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
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
  },
  fotoPreview: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#6C63FF",
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
