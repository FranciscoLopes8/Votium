import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface Slide {
  key: string;
  title: string;
  description: string;
  image: any;
}

const slides: Slide[] = [
  {
    key: "1",
    title: "Bem-Vindo ao Votium",
    description: "A aplicação eleitoral online fundamentada na blockchain. Cria a tua conta e vota com total segurança e transparência.",
    image: require("../assets/images/onboarding1.png"),
  },
  {
    key: "2",
    title: "Mantém-te atualizado",
    description: "Acompanha a campanha eleitoral de cada candidato.",
    image: require("../assets/images/onboarding2.png"),
  },
  {
    key: "3",
    title: "Faz a tua escolha",
    description: "Vota no teu candidato favorito e vê os resultados em tempo real.",
    image: require("../assets/images/onboarding3.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flashListRef = useRef<FlashList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flashListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/login");
    }
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlashList
        ref={flashListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={width}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Text style={styles.nextText}>{currentIndex === slides.length - 1 ? "Começar" : "Seguinte"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skipBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: "#6C63FF",
    fontSize: 16,
  },
  slide: {
    width: width,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    marginHorizontal: 40,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
