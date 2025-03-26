import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Verificacao() {
  const router = useRouter();
  const { telefone } = useLocalSearchParams(); // Obtém o número passado na navegação
  const [codigo, setCodigo] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quase lá</Text>
      <Text style={styles.subtitle}>
        Por favor, introduza o código de 6 dígitos enviado para <Text style={styles.phone}>{telefone}</Text> para verificação
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={codigo}
        onChangeText={setCodigo}
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}> 
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  phone: { color: "#6C63FF", fontWeight: "bold" },
  input: { width: "80%", height: 50, borderWidth: 1, borderRadius: 10, textAlign: "center", fontSize: 20, marginBottom: 20 },
  button: { width: "80%", backgroundColor: "#6C63FF", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
