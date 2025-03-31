import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/icon.png")} style={styles.profilePic} />
      <Text style={styles.name}>Igor Freitas</Text>
      <Text style={styles.role}>Voter</Text>

      <TouchableOpacity style={styles.editButton} onPress={() => router.push("/editar")}>
        <Text style={styles.editText}>Editar</Text>
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>⚙️ Configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>📞 Suporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout}>
          <Text style={styles.logoutText}>🚪 Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff", paddingTop: 50 },
  profilePic: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  role: { fontSize: 16, color: "#777" },
  editButton: { backgroundColor: "#6C63FF", padding: 10, borderRadius: 5, marginTop: 20 },
  editText: { color: "#fff", fontWeight: "bold" },
  optionsContainer: { marginTop: 30, width: "80%" },
  option: { paddingVertical: 15, borderBottomWidth: 1, borderColor: "#ddd" },
  optionText: { fontSize: 16 },
  logout: { marginTop: 20 },
  logoutText: { color: "red", fontSize: 16, fontWeight: "bold" },
});
