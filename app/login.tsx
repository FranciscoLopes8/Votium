import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const IP = "192.168.1.170";

export default function Index() {
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!telefone || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`http://${IP}:5000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
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
      {/* Container do Logo para fixar posição */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/images/LOGO_COR_SEM_FUNDO.png")} style={styles.logo} />
      </View>

      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Bem-Vindo ao Votium</Text>

        {/* Campo Número de Telefone */}
        <TextInput
          style={styles.input}
          placeholder="Número de Telefone"
          placeholderTextColor="#aaa"
          value={telefone}
          onChangeText={setTelefone}
        />

        {/* Campo Palavra-Passe */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Palavra-passe"
            placeholderTextColor="#aaa"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

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
  logoContainer: {
    position: "absolute",
    top: "8%",
    alignItems: "center",
  },
  logo: {
    width: 4000,
    height: 400,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 120,
  },
  title: {
    fontSize: 20,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    width: "100%",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
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
