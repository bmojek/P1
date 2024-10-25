import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

type RestaurantCardProps = {
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  type: string;
  location: string;
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  image,
  rating,
  reviewCount,
  type,
  location,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rating}>
          <Ionicons name="star" size={16} color="#FFD700" /> {rating} (
          {reviewCount} reviews) · {type}
        </Text>
        <Text style={styles.location}>
          <Ionicons name="location-outline" size={16} color="#a0a0a0" />{" "}
          {location}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: screenWidth - 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "#555",
  },
});

export default RestaurantCard;
