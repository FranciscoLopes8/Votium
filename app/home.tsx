import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from "@shopify/flash-list";

interface Candidato {
  _id: string;
  nome: string;
  partido: string;
  imagem: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ primeiroNome: "", ultimoNome: "", role: "", codigoPessoal: "" });
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.push("./authLogin");
          return;
        }

        const response = await fetch("http://192.168.1.170:5000/auth/perfil", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          alert("Erro ao carregar perfil");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    const fetchCandidatos = async () => {
      try {
        const response = await fetch("http://192.168.1.170:5000/candidates");
        const data: Candidato[] = await response.json();

        if (response.ok) {
          setCandidatos(data);
        } else {
          alert("Erro ao carregar candidatos");
        }
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchCandidatos();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6C63FF" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho do perfil */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Image source={require("../assets/images/icon.png")} style={styles.profilePic} />
        </TouchableOpacity>
        <Text style={styles.name}>{user.primeiroNome}</Text>
      </View>

      {/* Contagem Regressiva */}
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownTitle}>⏳ Tempo restante para a eleição</Text>
        <View style={styles.countdown}>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>124</Text><Text style={styles.countdownLabel}>Dias</Text></View>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>4</Text><Text style={styles.countdownLabel}>Horas</Text></View>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>30</Text><Text style={styles.countdownLabel}>Minutos</Text></View>
          <View style={styles.countdownBox}><Text style={styles.countdownText}>29</Text><Text style={styles.countdownLabel}>Segundos</Text></View>
        </View>
      </View>

      {/* Título de Candidatos */}
      <Text style={styles.sectionTitle}>Candidatos Presidenciais</Text>
      <FlashList
        data={candidatos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.candidateCard}>
            <Image source={item.imagem ? { uri: item.imagem } : require("../assets/images/icon.png")}
              style={styles.candidateImage} />
            <View style={styles.candidateInfo}>
              <Text style={styles.candidateName}>{item.nome}</Text>
              <Text style={styles.candidateParty}>{item.partido}</Text>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push(`/detalhes?id=${item._id}`)}
              >
                <Text style={styles.profileButtonText}>Ver perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        estimatedItemSize={80}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  profileHeader: { flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 20, marginBottom: 20 },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  name: { fontSize: 22, fontWeight: "bold", marginLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 20, textAlign: "center" },
  countdownContainer: { backgroundColor: "#4B2AFA", borderRadius: 10, padding: 15, marginBottom: 20, marginHorizontal: 20 },
  countdownTitle: { color: "#fff", fontSize: 14, textAlign: "center", marginBottom: 10 },
  countdown: { flexDirection: "row", justifyContent: "space-around" },
  countdownBox: { alignItems: "center" },
  countdownText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  countdownLabel: { color: "#fff", fontSize: 12 },
  candidateCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    width: "90%",
    minHeight: 80,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: "center"
  },
  candidateImage: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  candidateInfo: { flex: 1, justifyContent: "center" },
  candidateName: { fontSize: 16, fontWeight: "bold" },
  candidateParty: { color: "#777", marginBottom: 5 },
  profileButton: { backgroundColor: "#4B2AFA", padding: 10, borderRadius: 5, marginTop: 10, width: 100 },
  profileButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold", alignSelf: "center" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" }
});
