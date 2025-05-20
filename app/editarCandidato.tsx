import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = "192.168.1.170"; // Substitua pelo seu IP local

export default function EditarCandidato() {
    const [candidato, setCandidato] = useState<any>({
        _id: "",
        nome: "",
        partido: "",
        imagem: "",
        nascimento: "",
        biografia: "",
        naturalidade: "",
        cor: ""
    });

    const router = useRouter();

    useEffect(() => {
        const carregarCandidato = async () => {
            const dados = await AsyncStorage.getItem("candidatoSelecionado");
            if (dados) {
                const parsed = JSON.parse(dados);
                setCandidato(parsed);
            }
        };

        carregarCandidato();
    }, []);

    const selecionarImagem = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setCandidato({ ...candidato, imagem: result.assets[0].uri });
        }
    };

    const salvarAlteracoes = async () => {
        const formData = new FormData();
        formData.append("nome", candidato.nome);
        formData.append("partido", candidato.partido);
        formData.append("nascimento", candidato.nascimento);
        formData.append("naturalidade", candidato.naturalidade);
        formData.append("biografia", candidato.biografia);
        formData.append("cor", candidato.cor);

        if (candidato.imagem && !candidato.imagem.startsWith("http")) {
            const uriParts = candidato.imagem.split(".");
            const fileType = uriParts[uriParts.length - 1];

            formData.append("imagem", {
                uri: candidato.imagem,
                name: `foto.${fileType}`,
                type: `image/${fileType}`,
            } as any);
        }

        try {
            const response = await fetch(`http://${IP}:5000/candidatoperfil/${candidato._id}`, {
                method: "PUT",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.ok) {
                alert("Candidato atualizado com sucesso!");
                router.push("/Campanha");
            } else {
                const erro = await response.text();
                console.error("Erro ao atualizar:", erro);
                alert("Erro ao atualizar candidato.");
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
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity onPress={() => router.push("/Campanha")} style={styles.backButton}>
                    <Text style={styles.backText}>{"<"}</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Editar Candidato</Text>

                <TouchableOpacity style={styles.imagemButton} onPress={selecionarImagem}>
                    <Image
                        source={
                            candidato.imagem?.startsWith("/")
                                ? { uri: `http://${IP}:5000${candidato.imagem}` }
                                : require("../assets/images/icon.png")
                        }
                        style={styles.imagem}
                    />
                    <Text style={styles.imagemText}>Alterar Imagem</Text>
                </TouchableOpacity>

                {[
                    { label: "Nome", field: "nome" },
                    { label: "Partido", field: "partido" },
                    { label: "Nascimento", field: "nascimento" },
                    { label: "Naturalidade", field: "naturalidade" },
                    { label: "Biografia", field: "biografia" },
                    { label: "Cor Representativa", field: "cor" },
                ].map(({ label, field }, index) => (
                    <View style={styles.inputContainer} key={index}>
                        <TextInput
                            style={styles.input}
                            placeholder={label}
                            value={candidato[field]}
                            onChangeText={(text) => setCandidato({ ...candidato, [field]: text })}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
                    <Text style={styles.buttonText}>Guardar Alterações</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 60,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
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
