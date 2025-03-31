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
        <Image source={require("../assets/images/logo.png")} style={styles.profilePic} />
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
              <TouchableOpacity style={styles.profileButton} onPress={() => router.push(`/detalhes`)}>
                <Text style={styles.profileButtonText}>View profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  profilePic: { width: 60, height: 60, borderRadius: 25, marginRight: 10},
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

});
