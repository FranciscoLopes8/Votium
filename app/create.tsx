import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function CriarConta() {
  const navigation = useNavigation();
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [ultimoNome, setUltimoNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const role = "User";

  const handleCriarConta = async () => {
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.169:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primeiroNome, ultimoNome, telefone, senha, role }),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push("/verification");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Criar Conta</Text>

      {/* Campos de Entrada */}
      <TextInput
        style={styles.input}
        placeholder="Primeiro Nome"
        placeholderTextColor="#aaa"
        value={primeiroNome}
        onChangeText={setPrimeiroNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Último Nome"
        placeholderTextColor="#aaa"
        value={ultimoNome}
        onChangeText={setUltimoNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de Telefone"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="Palavra-passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir palavra-passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {/* Botão Criar Conta */}
      <TouchableOpacity style={styles.createAccountButton} onPress={handleCriarConta}>
        <Text style={styles.createAccountText}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
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
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  createAccountButton: {
    width: "100%",
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  createAccountText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
