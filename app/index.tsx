import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
    const router = useRouter();

    const handlePress = () => {
        router.push("/login");
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <Image source={require("../assets/images/LOGO.png")} style={styles.logo} />
        </TouchableOpacity>
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