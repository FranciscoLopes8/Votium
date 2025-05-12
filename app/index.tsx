import React from "react";
import { View, Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
    const router = useRouter();

    const handlePress = async () => {
        try {
            const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");

            if (hasSeen) {
                router.replace("/login");
            } else {
                router.replace("/onboarding");
            }
        } catch (error) {
            console.error("Erro ao verificar o onboarding:", error);
            router.replace("/login");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                <Image source={require("../assets/images/LOGO.png")} style={styles.logo} />
            </View>
        </TouchableWithoutFeedback>
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
