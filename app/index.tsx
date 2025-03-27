import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";


export default function Index() {
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!telefone || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.169:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push("/home");
      } else {
        alert(data.message || "Credenciais Erradas");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login, tente novamente mais tarde.");
    }
  };


  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/images/LOGO_COR_SEM_FUNDO.png")} style={styles.logo} />

      {/* Título com o "i" personalizado */}
      <Text style={styles.title}>
        Bem-Vindo ao Votium
      </Text>

      {/* Campo Código Pessoal */}
      <TextInput style={styles.input}
        placeholder="Número de Telefone"
        placeholderTextColor="#aaa"
        value={telefone}
        onChangeText={setTelefone} />

      {/* Campo Palavra-Passe */}
      <TextInput style={styles.input}
        placeholder="Palavra-passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword} />

      {/* Link Esqueceu a senha */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* Botão Entrar */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão Criar Conta */}
      <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push("/create")}>
        <Text style={styles.createAccountText}>Criar uma Conta</Text>
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  highlight: {
    color: "#4B2AFA",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  forgotPassword: {
    color: "#4B2AFA",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createAccountButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  createAccountText: {
    color: "#4B2AFA",
    fontWeight: "bold",
  },
});
