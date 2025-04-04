import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function About() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Conteúdo da página */}
      <Text style={styles.title}>Sobre nós</Text>
      <Text style={styles.description}>
        Somos uma equipa de dois estudantes universitários da Universidade de Trás-os-Montes e Alto Douro (UTAD) que
        desenvolveram esta aplicação com o objetivo de garantir a transparência e a segurança nas eleições online. A
        nossa missão é proporcionar uma plataforma confiável e acessível, assegurando que o processo eleitoral seja
        justo e seguro para todos os participantes.
      </Text>

      {/* Contactos */}
      <Text style={styles.subTitle}>Contactos</Text>
      <Text style={styles.contact}>
        <Text style={styles.bold}>Email:</Text> Votiumhelp@gmail.com{"\n"}
        <Text style={styles.bold}>Telefone:</Text> +351 123 456 789{"\n\n"}
        Quinta de Prados, 5000-801 Vila Real
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
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
    marginBottom: 10,
    marginTop:40,
  },
  description: { fontSize: 16, color: "#000" },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  contact: {
    fontSize: 16,
    color: "#000",
  },
  bold: {
    fontWeight: "bold",
  },
});
