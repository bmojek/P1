import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Place } from "@/types/global.types";
import { useApi } from "@/contexts/apiContext";
const screenWidth = Dimensions.get("window").width;

type RestaurantCardProps = {
  place: Place;
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({ place }) => {
  const { selectPlace } = useApi();
  const calculateRating = () => {
    const revRatCount = place.reviews ? place.reviews.length : 0;
    const avgRev = place.reviews
      ? place.reviews?.reduce((sum, rev) => rev.rating + sum, 0) /
        place.reviews?.length
      : 0;

    const ourRating =
      (parseFloat(place.rating.replace(",", ".")) * place.reviewCount -
        revRatCount +
        avgRev * 10) /
      (place.reviewCount + 10);
    return ourRating.toFixed(1);
  };
  return (
    <Link
      onPress={() => {
        selectPlace(place);
      }}
      href={{
        pathname: "/Details",
      }}
    >
      <View style={styles.card}>
        <Image source={{ uri: place.image }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />{" "}
            {calculateRating()} ({place.reviewCount} reviews) · {place.type}
          </Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#a0a0a0" />{" "}
            {place.location}
          </Text>
        </View>
      </View>
    </Link>
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
