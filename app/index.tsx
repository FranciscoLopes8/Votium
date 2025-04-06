import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");

                // Mostra o logo por 2 segundos
                setTimeout(() => {
                    if (hasSeen) {
                        router.replace("/login");
                    } else {
                        router.replace("/onboarding");
                    }
                }, 2000);
            } catch (error) {
                console.error("Erro ao verificar o onboarding:", error);
                router.replace("/login"); // fallback
            }
        };

        checkFirstLaunch();
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require("../assets/images/LOGO.png")} style={styles.logo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    logo: {
        width: 400,
        height: 400,
        resizeMode: "contain",
    },
});
