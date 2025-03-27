import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VoteResults() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vote Results</Text>
      <Text style={styles.text}>Results will be displayed after the election.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold" },
  text: { fontSize: 14, color: "#777", marginTop: 10 },
});
