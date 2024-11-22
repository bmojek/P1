import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useApi } from "@/contexts/apiContext";
import { router } from "expo-router";
const Preference = () => {
  const items = [
    { name: "Sushi", image: require("../assets/images/sushi.jpg") },
    { name: "Pizza", image: require("../assets/images/pizza.jpg") },
    { name: "Burger", image: require("../assets/images/burger.jpg") },
    { name: "Italian", image: require("../assets/images/italian.jpg") },
    { name: "Polish", image: require("../assets/images/polish.jpg") },
    { name: "Steak", image: require("../assets/images/steak.jpg") },
    { name: "Chinese", image: require("../assets/images/chinese.jpg") },
    { name: "Indian", image: require("../assets/images/indian.jpg") },
    { name: "Sandwich", image: require("../assets/images/sandwich.jpg") },
    { name: "Mexican", image: require("../assets/images/mexican.jpg") },
    { name: "Sea Food", image: require("../assets/images/seafood.jpg") },
    { name: "Greek", image: require("../assets/images/greek.jpg") },
    { name: "Spanish", image: require("../assets/images/spanish.jpg") },
    { name: "Kebab", image: require("../assets/images/kebab.jpg") },
    { name: "Georgian", image: require("../assets/images/georgian.jpg") },
    { name: "Pancakes", image: require("../assets/images/pancakes.jpg") },
    { name: "Coffee", image: require("../assets/images/coffee.jpg") },
    { name: "Vegan", image: require("../assets/images/vegan.jpg") },
  ];

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { addPreferences, fetchPreferences } = useApi();
  const user = getAuth();

  useEffect(() => {
    const loadPreferences = async () => {
      const fetchedPreferences = await fetchPreferences(
        user.currentUser?.uid || "anonymous"
      );

      if (fetchedPreferences) {
        const indices = items
          .map((item, index) =>
            fetchedPreferences.includes(item.name) ? index : null
          )
          .filter((index) => index !== null);
        setSelectedItems(indices as number[]);
      }
    };

    loadPreferences();
  }, []);

  const handlePress = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((item) => item !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleComplitedPress = () => {
    const preferences = items
      .filter((item, index) => selectedItems.includes(index))
      .map((item) => item.name);
    addPreferences(user.currentUser?.uid || "anonymous", preferences);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Text
            style={{
              color: "#FAF0E6",
              fontSize: 50,
              fontWeight: "bold",
              fontFamily: "AmaticSC-Bold",
            }}
          >
            Choose your preferences
          </Text>
        </View>
        <View style={styles.itemsWrapper}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={() => handlePress(index)}
            >
              {selectedItems.includes(index) ? (
                <ImageBackground
                  source={item.image}
                  style={styles.itemBackground}
                  imageStyle={styles.imageStyle}
                >
                  <Text style={[styles.itemText, { color: "white" }]}>
                    {item.name}
                  </Text>
                </ImageBackground>
              ) : (
                <View style={styles.itemContent}>
                  <Text style={[styles.itemText, { color: "black" }]}>
                    {item.name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.complitedContainer}>
          <TouchableOpacity
            style={[styles.complitedButton]}
            onPress={handleComplitedPress}
          >
            <Text style={styles.complitedButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Preference;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#352F44",
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  itemsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  itemContainer: {
    width: "40%",
    height: 50,
    backgroundColor: "#FAF0E6",
    margin: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  itemBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  imageStyle: {
    borderRadius: 8,
  },
  itemContent: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  itemText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SpaceMono-Regular",
  },
  complitedContainer: {
    marginTop: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  complitedButton: {
    backgroundColor: "#FAF0E6",
    padding: 10,
    borderRadius: 8,
    bottom: 10,
  },
  complitedButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "SpaceMono-Regular",
  },
  complitedButtonClicked: {
    backgroundColor: "#4C3BCF",
  },
});

//background jedzenia ma byc jako jedzenie zdjecia jak zaznaczysz
//godzina otwarcia
