import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Success() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.message}>Dados alterados com sucesso</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/perfil")}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center", elevation: 5 },
  message: { fontSize: 18, fontWeight: "bold", color: "#4B2AFA", marginBottom: 20 },
  backButton: { backgroundColor: "#4B2AFA", padding: 10, borderRadius: 5, width: 100, alignItems: "center" },
  backText: { color: "#fff", fontWeight: "bold" },
});