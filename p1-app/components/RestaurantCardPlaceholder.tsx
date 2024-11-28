import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View, Animated, Easing } from "react-native";

const screenWidth = Dimensions.get("window").width;

const RestaurantCardPlaceholder = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.imagePlaceholder} />
      <View style={styles.infoContainer}>
        <View style={styles.textPlaceholder} />
        <View style={[styles.textPlaceholder, { width: "60%" }]} />
        <View
          style={[styles.textPlaceholder, { width: "80%", marginTop: 5 }]}
        />
      </View>
    </Animated.View>
  );
};

export default RestaurantCardPlaceholder;

const styles = StyleSheet.create({
  card: {
    width: screenWidth - 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginVertical: 10,
    elevation: 2,
  },
  infoContainer: {
    padding: 15,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#D3D3D3",
  },
  textPlaceholder: {
    height: 20,
    backgroundColor: "#C0C0C0",
    marginBottom: 10,
    borderRadius: 4,
    width: "80%",
  },
});
