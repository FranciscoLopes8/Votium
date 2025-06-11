import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';

import { IP } from "../config";

export default function Profile() {
  const router = useRouter();
  const [showCode, setShowCode] = useState(false);
  const [user, setUser] = useState({ primeiroNome: "", ultimoNome: "", role: "", codigoPessoal: "", imagem: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          router.push("./authLogin");
          return;
        }

        const response = await fetch(`http://${IP}:5000/auth/perfil`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) setUser(data);
        else alert("Erro ao carregar perfil");
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchUser();
  }, []);

  const copiarCodigo = async () => {
    if (user.codigoPessoal) {
      await Clipboard.setStringAsync(user.codigoPessoal);
      Alert.alert("Copiado", "Código pessoal copiado para a área de transferência.");
    }
  };

  const imageUri = user.imagem?.startsWith("/")
    ? { uri: `http://${IP}:5000${user.imagem}` }
    : require("../assets/images/default-avatar-icon.jpg");

  return (
    <View style={styles.container}>
      {/* Perfil */}
      <Image
        source={
          user.imagem?.startsWith("/")
            ? { uri: `http://${IP}:5000${user.imagem}` }
            : require("../assets/images/default-avatar-icon.jpg")
        }
        style={styles.profilePic}
      />
      <Text style={styles.name}>{user.primeiroNome} {user.ultimoNome}</Text>
      <Text style={styles.role}>{user.role}</Text>

      <TouchableOpacity style={styles.editButton} onPress={() => router.push("/editar")}>
        <Text style={styles.editText}>Editar</Text>
      </TouchableOpacity>

      {/* Código Pessoal */}
      <View style={styles.codeWrapper}>
        <TouchableOpacity style={styles.codeContainer} onPress={copiarCodigo}>
          <Text style={styles.codeText}>{showCode ? user.codigoPessoal : "Código Pessoal"}</Text>
          <TouchableOpacity onPress={() => setShowCode(!showCode)}>
            <Ionicons name={showCode ? "eye-off" : "eye"} size={24} color="gray" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Opções */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/about")}>
          <Ionicons name="call" size={24} color="gray" />
          <Text style={styles.optionText}>Suporte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={async () => {
          await SecureStore.deleteItemAsync("token");
          router.push("./login");
        }}>
          <Ionicons name="log-out" size={24} color="red" />
          <Text style={styles.logoutText}>Sair</Text>
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
  editButton: { backgroundColor: "#4B2AFA", padding: 10, borderRadius: 5, marginTop: 10 },
  editText: { color: "#fff", fontWeight: "bold" },
  codeWrapper: {
    backgroundColor: "#fff", padding: 20, borderRadius: 10,
    shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, elevation: 3, marginTop: 30
  },
  codeContainer: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", width: "70%"
  },
  codeText: { fontSize: 20, fontWeight: "bold", color: "black", marginRight: 10 },
  optionsContainer: { marginTop: 30, width: "80%" },
  option: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 15, borderBottomWidth: 1, borderColor: "#ddd"
  },
  optionText: { fontSize: 16, marginLeft: 10 },
  logoutText: { color: "red", fontSize: 16, fontWeight: "bold", marginLeft: 10 },
});
