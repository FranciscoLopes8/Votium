import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditarPerfil() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [user, setUser] = useState({ primeiroNome: "", ultimoNome: "", telefone: "", senha: "", imagem: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.push("./authLogin");
          return;
        }

        const response = await fetch("http://192.168.1.183:5000/auth/perfil", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data);
          setUser(data);
          setNome(data.primeiroNome);
          setSobrenome(data.ultimoNome);
          setImagem(data.imagem ? `http://192.168.1.183:5000${data.imagem}` : null);
        } else {
          alert("Erro ao carregar perfil");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    fetchUser();
  }, []);

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const alterarDados = async () => {
    if (senha !== confirmarSenha) {
      setErroSenha("As palavras-passe não coincidem.");
      return;
    }

    setErroSenha("");

    const formData = new FormData();
    formData.append("primeiroNome", nome);
    formData.append("ultimoNome", sobrenome);
    if (senha !== "") {
      formData.append("senha", senha);
    }

    if (imagem) {
      const fotoUri = imagem;
      const uriParts = fotoUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("imagem", {
        uri: fotoUri,
        name: `foto.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const response = await fetch(`http://192.168.1.183:5000/perfil/${user.telefone}`, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const contentType = response.headers.get("content-type");

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          await AsyncStorage.setItem("user", JSON.stringify(data.user));
          alert("Perfil atualizado com sucesso!");
          router.push("/perfil");
        } else {
          const texto = await response.text();
          console.warn("Resposta não-JSON recebida:", texto);
          alert("Perfil atualizado, mas houve um problema com a resposta do servidor.");
        }
      } else {
        const erro = await response.text();
        console.log("Erro ao atualizar: " + erro);
        alert("Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity onPress={() => router.push("/perfil")} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Editar Perfil</Text>

      <TouchableOpacity style={styles.imagemButton} onPress={selecionarImagem}>
        <Image
          source={imagem ? { uri: imagem } : require("../assets/images/icon.png")}
          style={styles.imagem}
        />
        <Text style={styles.imagemText}>Alterar Imagem</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Primeiro Nome"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Último Nome"
          value={sobrenome}
          onChangeText={setSobrenome}
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Nova Palavra-passe"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!senhaVisivel}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
          <Ionicons name={senhaVisivel ? "eye-off" : "eye"} size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Repetir Palavra-passe"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!senhaVisivel}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
          <Ionicons name={senhaVisivel ? "eye-off" : "eye"} size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {erroSenha !== "" && <Text style={styles.erroTexto}>{erroSenha}</Text>}

      <TouchableOpacity style={styles.button} onPress={alterarDados}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
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
    zIndex: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: -150,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  erroTexto: {
    color: "#FF4D4D",
    marginBottom: 10,
    fontWeight: "500",
  },
  imagemButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  imagemText: {
    color: "#4B2AFA",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
