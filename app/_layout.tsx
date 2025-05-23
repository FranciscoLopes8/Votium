import { Stack, useRouter, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState(() => {

    if (pathname.startsWith("/perfil") || pathname.startsWith("/editar") || pathname.startsWith("/about")) return "profile";
    if (pathname.startsWith("/voto")) return "vote";
    if (pathname.startsWith("/home")) return "home";
    return "home";
  });


  useEffect(() => {
    if (pathname.startsWith("/perfil") || pathname.startsWith("/editar") || pathname.startsWith("/about")) setSelectedTab("profile");
    else if (pathname.startsWith("/voto")) setSelectedTab("vote");
    else if (pathname.startsWith("/home")) setSelectedTab("home");
    else setSelectedTab("home"); // fallback
  }, [pathname]);

  if (pathname === "/login" || pathname === "/create" || pathname === "/" || pathname == "/onboarding") {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <Stack screenOptions={{ headerShown: false, gestureEnabled: false, animation: "none" }} />
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false, animation: "none" }} />

        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => { setSelectedTab("home"); router.push("/home"); }}
            style={styles.navItem}
          >
            <Ionicons name="home" size={30} color={selectedTab === "home" ? "#4B2AFA" : "#777"} />
            <Text style={[styles.navText, selectedTab === "home" && styles.activeText]}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setSelectedTab("vote"); router.push("/voto"); }}
            style={styles.navItem}
          >
            <Ionicons name="stats-chart" size={30} color={selectedTab === "vote" ? "#4B2AFA" : "#777"} />
            <Text style={[styles.navText, selectedTab === "vote" && styles.activeText]}>Ver Voto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setSelectedTab("profile"); router.push("/perfil"); }}
            style={styles.navItem}
          >
            <Ionicons name="person" size={30} color={selectedTab === "profile" ? "#4B2AFA" : "#777"} />
            <Text style={[styles.navText, selectedTab === "profile" && styles.activeText]}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    bottom: 30,
    width: "100%",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 14, color: "#777" },
  activeText: { color: "#4B2AFA", fontWeight: "bold" },
});
