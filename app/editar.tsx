// app/editar.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function EditarPerfil() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  const selecionarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const salvar = () => {
    // Aqui podes adicionar lógica para salvar no backend
    console.log("Nome:", nome, "Sobrenome:", sobrenome, "Foto:", foto);
    router.push("/perfil");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selecionarFoto}>
        <Image
          source={foto ? { uri: foto } : require("../assets/images/icon.png")}
          style={styles.foto}
        />
        <Text style={styles.trocarFoto}>Alterar Foto</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Primeiro Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Último Nome"
        value={sobrenome}
        onChangeText={setSobrenome}
      />

      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.botaoTexto}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, alignItems: "center", backgroundColor: "#fff" },
  foto: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  trocarFoto: { color: "#6C63FF", marginBottom: 20 },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#4B2AFA",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
