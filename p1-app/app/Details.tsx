import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Place } from "@/types/global.types";
const Details = () => {
  const { place } = useLocalSearchParams();

  let placeJ;
  if (typeof place === "string") {
    placeJ = JSON.parse(place) as Place;
  } else {
    return;
  }
  const getStarts = (rating: number) => {
    let stars = "";

    for (let i = 0; i < 5; i++) {
      i < rating ? (stars += "★") : (stars += "☆");
    }
    return stars;
  };
  return (
    <ImageBackground
      source={{ uri: placeJ.image }}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient
        colors={["#FAF0E6", "transparent"]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/Logo4.png")}
              style={styles.logo}
            />
          </View>
          <TouchableOpacity style={styles.profileContainer}>
            <Image
              source={require("../assets/images/avatar.png")}
              style={styles.profile}
            />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.restaurantName}>{placeJ.name}</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{placeJ.desc}</Text>
            </View>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.photoContainer}
              showsHorizontalScrollIndicator={false}
            >
              {placeJ.images?.map((image, index) => (
                <Image
                  style={styles.photo}
                  key={index}
                  source={{ uri: image.link }}
                />
              ))}
            </ScrollView>
            <View style={styles.latestContainer}>
              <Text style={styles.latestTitle}>Latest Reviews</Text>
              <ScrollView
                contentContainerStyle={styles.reviewContainer}
                showsVerticalScrollIndicator={false}
              >
                {placeJ.reviews?.map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <Text style={styles.reviewStars}>
                        {getStarts(review.rating)}
                      </Text>
                    </View>
                    <Text style={styles.review}>{review.review_text}</Text>
                    <View style={styles.reviewPhotosContainer}>
                      {review.review_photos.map((photo, index) => (
                        <Image
                          key={index}
                          source={{ uri: photo }}
                          style={styles.reviewPhoto}
                        />
                      ))}
                    </View>

                    <Text>{review.published_at_date}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Add Review</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#352F44",
  },
  gradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    padding: 16,
  },
  restaurantName: {
    fontSize: 60,
    fontWeight: "bold",
    fontFamily: "AmaticSC-Regular",
    color: "white",
    marginTop: 140,
    textAlign: "center",
  },
  descriptionContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  descriptionText: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    fontFamily: "Amaticsc-bold",
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    left: 50,
    zIndex: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
  profileContainer: {
    position: "absolute",
    top: 70,
    right: 50,
    zIndex: 1,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  photoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    top: 10,
  },
  photo: {
    width: 200,
    height: 200,
    margin: 8,
    borderRadius: 10,
  },
  latestContainer: {
    width: "100%",
    height: 530,
    paddingTop: 30,
    marginTop: 20,
    backgroundColor: "#FAF0E6",
    borderRadius: 10,
    alignItems: "center",
    bottom: 10,
  },
  latestTitle: {
    fontSize: 20,
    color: "black",
    marginBottom: 10,
    fontFamily: "SpaceMono-Regular",
  },
  reviewContainer: {
    width: 300,
    padding: 10,
  },
  reviewItem: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewProfile: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    fontFamily: "Poppins-Bold",
  },
  reviewStars: {
    fontSize: 16,
    color: "#FFD700",
  },
  review: {
    fontSize: 15,
    color: "black",
    fontFamily: "poppins-regular",
  },
  reviewPhotosContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  reviewPhoto: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    width: 234.29,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#FAF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#0C0C0C",
    fontSize: 20,
    fontFamily: "SpaceMono-Regular",
  },
});

export default Details;
