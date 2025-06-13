import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { getVotoContract } from "../contracts/votoContract";
import { Ionicons } from '@expo/vector-icons';
import { IP } from "../config";

interface Candidato {
  _id: string;
  nome: string;
  partido: string;
  nascimento: string;
  naturalidade: string;
  biografia: string;
  imagem: string | null;
  planoEleitoral: string;
}

export default function CandidateDetails() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleConfirm, setModalVisibleConfirm] = useState(false);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ telefone: "", codigoPessoal: "" });
  const [candidatoIdMap, setCandidatoIdMap] = useState<Record<string, number>>({});
  const [modalVotoSucesso, setModalVotoSucesso] = useState(false);
  const [modalVotoErro, setModalVotoErro] = useState(false);

  const [activeTab, setActiveTab] = useState<'Profile' | 'Campaign'>('Profile');

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) {
        alert("ID do candidato não fornecido");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://${IP}:5000/candidates`);
        const contentType = response.headers.get("content-type");

        if (!response.ok || !contentType?.includes("application/json")) {
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
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await fetch(`http://${IP}:5000/auth/perfil`, {
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

      <Image
        source={candidato.imagem?.startsWith("/")
          ? { uri: `http://${IP}:5000${candidato.imagem}` }
          : require("../assets/images/default-avatar-icon.jpg")}
        style={styles.image}
      />
      <Text style={styles.name}>{candidato.nome}</Text>
      <Text style={styles.party}>{candidato.partido}</Text>

      <TouchableOpacity style={styles.voteButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.voteText}>Vote Agora</Text>
      </TouchableOpacity>

      {/* Tabs Section */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('Profile')}>
          <Text style={activeTab === 'Profile' ? styles.activeTab : styles.inactiveTab}>
            Perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Campaign')} style={{ marginLeft: 20 }}>
          <Text style={activeTab === 'Campaign' ? styles.activeTab : styles.inactiveTab}>
            Campanha
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.infoContainer}>
        {activeTab === 'Profile' ? (
          <>
            <Text style={styles.label}>Nascimento:</Text>
            <Text style={styles.text}>{candidato.nascimento}</Text>

            <Text style={styles.label}>Naturalidade:</Text>
            <Text style={styles.text}>{candidato.naturalidade}</Text>

            <Text style={styles.label}>Biografia:</Text>
            <Text style={styles.text}>{candidato.biografia}</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>Plano Eleitoral:</Text>
            <Text style={styles.text}>
              {candidato.planoEleitoral || "Sem Plano Eleitoral disponível"}
            </Text>
          </>
        )}
      </View>

      {/* Voting Modal */}
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmação</Text>
            <Text style={styles.modalText}>Tem a certeza? O seu voto não pode ser alterado.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={async () => {
                  setModalVisibleConfirm(true);

                  try {
                    const contrato = await getVotoContract();
                    const contractId = candidatoIdMap[id as string];

                    if (!contractId) {
                      alert("ID do candidato inválido para votação.");
                      return;
                    }

                    const tx = await contrato.votar(contractId, user.codigoPessoal, { gasLimit: 1000000 });
                    await tx.wait();

                    setModalVisible(false);
                    setModalVisibleConfirm(false);
                    setModalVotoSucesso(true);
                  } catch (err) {
                    console.log("Erro ao votar:", err);
                    setModalVisible(false);
                    setModalVisibleConfirm(false);
                    setModalVotoErro(true);
                  }

                }}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="none" transparent={true} visible={modalVotoSucesso}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voto registado com sucesso.</Text>
            <Ionicons
              name="checkmark-circle"
              size={50}
              color="#4B2AFA"
              style={{ marginBottom: 10 }}
            />
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => {
                setModalVotoSucesso(false);
              }}
            >
              <Text style={styles.buttonTextModal}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal animationType="none" transparent={true} visible={modalVotoErro}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Erro ao registar voto</Text>
            <Ionicons
              name="close-circle"
              size={50}
              color="#4B2AFA"
              style={{ marginBottom: 10 }}
            />
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => setModalVotoErro(false)}
            >
              <Text style={styles.buttonTextModal}>Fechar</Text>
            </TouchableOpacity>
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
  tabs: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  activeTab: {
    fontWeight: "bold",
    color: "#4B2AFA",
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#6C63FF"
  },
  inactiveTab: {
    color: "#777",
    paddingBottom: 5,
  },
  infoContainer: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  text: { fontSize: 14, color: "#777" },

  // Modal styles
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#4B2AFA" },
  modalText: { fontSize: 14, textAlign: "center", fontWeight: "bold" },
  modalSubtext: { fontSize: 12, textAlign: "center", color: "#777", marginVertical: 10 },
  modalButtons: { flexDirection: "row", marginTop: 15 },
  cancelButton: { padding: 10, borderRadius: 5, marginRight: 10, borderWidth: 1, borderColor: "#4B2AFA" },
  cancelText: { color: "#4B2AFA", fontWeight: "bold" },
  confirmButton: { backgroundColor: "#4B2AFA", padding: 10, borderRadius: 5 },
  confirmText: { color: "#fff", fontWeight: "bold" },
  buttonTextModal: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonModal: {
    backgroundColor: "#4B2AFA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
});