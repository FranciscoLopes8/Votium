import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const candidatos = [
  { id: "1", nome: "Mauro Pires", partido: "Frelimo", imagem: require("../assets/images/icon.png") },
  { id: "2", nome: "Mauro Pires", partido: "Renamo", imagem: require("../assets/images/favicon.png") },
  { id: "3", nome: "Mauro Pires", partido: "MDM", imagem: require("../assets/images/react-logo.png") },
];

export default function Home() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/images/LOGO_COR_SEM_FUNDO.png")} style={styles.profilePic} />
        <View>
          <Text style={styles.userName}>Igor Freitas</Text>
          <Text style={styles.userRole}>Voter</Text>
        </View>
      </View>

      {/* Contagem Regressiva */}
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownTitle}>⏳ Remaining time for the election</Text>
        <View style={styles.countdown}>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>124</Text><Text style={styles.countdownLabel}>Days</Text></View>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>4</Text><Text style={styles.countdownLabel}>Hours</Text></View>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>30</Text><Text style={styles.countdownLabel}>Minutes</Text></View>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>29</Text><Text style={styles.countdownLabel}>Seconds</Text></View>
        </View>
      </View>

      {/* Pesquisa */}
      <Text style={styles.sectionTitle}>Presidential candidates</Text>
      <TextInput style={styles.searchBar} placeholder="Search candidates ..." placeholderTextColor="#aaa" />

      {/* Lista de Candidatos */}
      <FlatList
        data={candidatos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.candidateCard}>
            <Image source={item.imagem} style={styles.candidateImage} />
            <View style={styles.candidateInfo}>
              <Text style={styles.candidateName}>{item.nome}</Text>
              <Text style={styles.candidateParty}>{item.partido}</Text>
              <TouchableOpacity style={styles.profileButton} onPress={() => router.push(`/create`)}>
                <Text style={styles.profileButtonText}>View profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Barra de Navegação */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => { setSelectedTab("home"); router.push("/home"); }} style={styles.navItem}>
          <Image source={require("../assets/images/home.png")} style={[styles.navIcon, selectedTab === "home" && styles.activeIcon]} />
          <Text style={[styles.navText, selectedTab === "home" && styles.activeText]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setSelectedTab("vote"); router.push("/vote"); }} style={styles.navItem}>
          <Image source={require("../assets/images/vervoto.png")} style={[styles.navIcon, selectedTab === "vote" && styles.activeIcon]} />
          <Text style={[styles.navText, selectedTab === "vote" && styles.activeText]}>Ver Voto</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setSelectedTab("profile"); router.push("/profile"); }} style={styles.navItem}>
          <Image source={require("../assets/images/perfil.png")} style={[styles.navIcon, selectedTab === "profile" && styles.activeIcon]} />
          <Text style={[styles.navText, selectedTab === "profile" && styles.activeText]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  profilePic: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userRole: { color: "#777" },
  countdownContainer: { backgroundColor: "#6C63FF", borderRadius: 10, padding: 15, marginBottom: 20 },
  countdownTitle: { color: "#fff", fontSize: 14, textAlign: "center", marginBottom: 10 },
  countdown: { flexDirection: "row", justifyContent: "space-around" },
  countdownBox: { alignItems: "center" },
  countdownText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  countdownLabel: { color: "#fff", fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  searchBar: { backgroundColor: "#F5F5F5", borderRadius: 10, paddingHorizontal: 15, height: 40, marginBottom: 15 },
  candidateCard: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10, elevation: 2 },
  candidateImage: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  candidateInfo: { flex: 1, justifyContent: "center" },
  candidateName: { fontSize: 16, fontWeight: "bold" },
  candidateParty: { color: "#777", marginBottom: 5 },
  profileButton: { borderWidth: 1, borderColor: "#6C63FF", padding: 5, borderRadius: 5, alignItems: "center", width: 100 },
  profileButtonText: { color: "#6C63FF", fontSize: 12, fontWeight: "bold" },

  // 🟣 Estilos da Navbar
  navBar: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 15, backgroundColor: "#fff", borderRadius: 20, elevation: 3 },
  navItem: { alignItems: "center" },
  navIcon: { width: 30, height: 30, tintColor: "#777" },
  navText: { fontSize: 14, color: "#777" },

  // Ativo (roxo)
  activeIcon: { tintColor: "#6C63FF" },
  activeText: { color: "#6C63FF", fontWeight: "bold" },
});