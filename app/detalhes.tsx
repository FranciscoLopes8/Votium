import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVotoContract } from "./contracts/votoContract";

interface Candidato {
  _id: string;
  nome: string;
  partido: string;
  nascimento: string;
  naturalidade: string;
  biografia: string;
  imagem: string | null;
}


export default function CandidateDetails() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ telefone: "", codigoPessoal: "" });
  const [candidatoIdMap, setCandidatoIdMap] = useState<Record<string, number>>({});


  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) {
        alert("ID do candidato não fornecido");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://192.168.1.170:5000/candidates");

        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Resposta inválida da API");
        }

        const data: Candidato[] = await response.json();

        const map: Record<string, number> = {};
        data.forEach((c, index) => {
          map[c._id] = index + 1;
        });
        setCandidatoIdMap(map);

        const candidatoEncontrado = data.find((c) => c._id === id);

        if (candidatoEncontrado) {
          setCandidato(candidatoEncontrado);
        } else {
          alert("Candidato não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar candidato:", error);
        alert("Erro ao buscar candidato. Verifique sua conexão ou tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

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

    fetchCandidate();
    fetchUser();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#6C63FF" style={styles.loading} />;
  }

  if (!candidato) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Candidato não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Imagem do Candidato */}
      <Image
        source={candidato.imagem?.startsWith("/")
          ? { uri: `http://192.168.1.170:5000${candidato.imagem}` }
          : require("../assets/images/icon.png")}
        style={styles.image}
      />
      <Text style={styles.name}>{candidato.nome}</Text>
      <Text style={styles.party}>{candidato.partido}</Text>

      {/* Botão de Votação */}
      <TouchableOpacity style={styles.voteButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.voteText}>Vote now</Text>
      </TouchableOpacity>

      {/* Tabs de Informação */}
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Profile</Text>
        <Text style={styles.inactiveTab}>Campaign</Text>
      </View>

      {/* Informações do candidato */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nascimento:</Text>
        <Text style={styles.text}>{candidato.nascimento}</Text>

        <Text style={styles.label}>Naturalidade:</Text>
        <Text style={styles.text}>{candidato.naturalidade}</Text>

        <Text style={styles.label}>Biografia:</Text>
        <Text style={styles.text}>{candidato.biografia}</Text>
      </View>

      {/* Modal de Confirmação */}
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmation</Text>
            <Text style={styles.modalText}>Are you sure? Your vote cannot be changed.</Text>
            <Text style={styles.modalSubtext}>After casting your vote, you will receive a confirmation message.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={async () => {
                  try {
                    const contrato = getVotoContract();

                    const contractId = candidatoIdMap[id as string];
                    if (!contractId) {
                      alert("ID do candidato inválido para votação.");
                      return;
                    }

                    const tx = await contrato.votar(contractId, user.codigoPessoal, { gasLimit: 1000000 });
                    await tx.wait();

                    alert("Voto registado com sucesso!");
                    setModalVisible(false);
                  } catch (err) {
                    console.log("Erro ao votar:", err);
                    alert("Erro ao registar voto. Tente novamente.");
                  }
                }}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, textAlign: "center", marginTop: 50, color: "red" },
  image: { width: "100%", height: 200, borderRadius: 10 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  party: { fontSize: 16, color: "#777", marginBottom: 20 },
  voteButton: { backgroundColor: "#4B2AFA", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  voteText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  tabs: { flexDirection: "row", marginBottom: 10 },
  activeTab: { fontWeight: "bold", color: "#4B2AFA", marginRight: 20, borderBottomWidth: 2, borderBottomColor: "#6C63FF" },
  inactiveTab: { color: "#777" },
  infoContainer: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  text: { fontSize: 14, color: "#777" },

  // Estilos do Modal
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 14, textAlign: "center", fontWeight: "bold" },
  modalSubtext: { fontSize: 12, textAlign: "center", color: "#777", marginVertical: 10 },
  modalButtons: { flexDirection: "row", marginTop: 15 },
  cancelButton: { padding: 10, borderRadius: 5, marginRight: 10, borderWidth: 1, borderColor: "#4B2AFA" },
  cancelText: { color: "#4B2AFA", fontWeight: "bold" },
  confirmButton: { backgroundColor: "#4B2AFA", padding: 10, borderRadius: 5 },
  confirmText: { color: "#fff", fontWeight: "bold" },
});
