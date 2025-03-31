import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import './globals.css';

export default function RootLayout() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Renderiza as páginas */}
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false, animation: "none" }} />

      {/* 🔽 Navbar Global 🔽 */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          onPress={() => { setSelectedTab("home"); router.push("/home"); }} 
          style={styles.navItem}
        >
          <Image 
            source={require("../assets/images/icon.png")} 
            style={[styles.navIcon, selectedTab === "home" && styles.activeIcon]} 
          />
          <Text style={[styles.navText, selectedTab === "home" && styles.activeText]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => { setSelectedTab("vote"); router.push("/voto"); }} 
          style={styles.navItem}
        >
          <Image 
            source={require("../assets/images/icon.png")} 
            style={[styles.navIcon, selectedTab === "vote" && styles.activeIcon]} 
          />
          <Text style={[styles.navText, selectedTab === "vote" && styles.activeText]}>Ver Voto</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => { setSelectedTab("profile"); router.push("/perfil"); }} 
          style={styles.navItem}
        >
          <Image 
            source={require("../assets/images/icon.png")} 
            style={[styles.navIcon, selectedTab === "profile" && styles.activeIcon]} 
          />
          <Text style={[styles.navText, selectedTab === "profile" && styles.activeText]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 3,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: { alignItems: "center" },
  navIcon: { width: 30, height: 30, tintColor: "#777" },
  navText: { fontSize: 14, color: "#777" },
  activeIcon: { tintColor: "#6C63FF" },
  activeText: { color: "#6C63FF", fontWeight: "bold" },
});
