import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';

import { IP } from "../config";

export default function CriarConta() {
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [ultimoNome, setUltimoNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const role = "User";
  const [user, setUser] = useState({
    primeiroNome: "",
    ultimoNome: "",
    role: "",
    codigoPessoal: "",
  });

  const handleCriarConta = async () => {
    const telefoneValido = /^\d{9}$/.test(telefone);
    const senhaValida =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(senha);

    if (!telefoneValido) {
      alert("O número de telefone deve conter exatamente 9 dígitos.");
      return;
    }

    if (!senhaValida) {
      alert(
        "A palavra-passe deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch(`http://${IP}:5000/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primeiroNome,
          ultimoNome,
          telefone,
          senha,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("token", data.token);
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
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={styles.backButton}
      >
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Criar Conta</Text>

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

      {/* Palavra-passe */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Palavra-passe"
          placeholderTextColor="#aaa"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Repetir palavra-passe */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Repetir palavra-passe"
          placeholderTextColor="#aaa"
          secureTextEntry={!mostrarConfirmarSenha}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
        >
          <Ionicons name={mostrarConfirmarSenha ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={handleCriarConta}
      >
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
    color: "#4B2AFA",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 45, // espaço para o ícone
    marginBottom: 15,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 14,
    zIndex: 1,
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
