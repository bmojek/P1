import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useApi } from "@/contexts/apiContext";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";

const Reviewadd = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { selectedPlace, selectPlace } = useApi();
  const { addComment } = useApi();
  const handleRating = (newRating: number) => {
    setRating(newRating);
  };

  const user = getAuth().currentUser;
  const placeJ = selectedPlace;

  const handleComment = () => {
    if (!comment || rating === 0 || user == null) {
      Alert.alert("Please enter a comment and select a rating.");
      return;
    } else {
      addComment(
        placeJ.id.toString(),
        rating,
        user.displayName ?? "Anonymus",
        comment,
        selectedImages
      );
      setComment("");
      setSelectedImages([]);
      setRating(0);
      router.back();
    }
  };

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  if (!placeJ.name) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load restaurant data.</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/test.png")}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient
        colors={["#FAF0E6", "transparent"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.overlay}>
          <Text style={styles.ratings}>Ratings & Reviews</Text>
          <Text style={styles.name}>{placeJ.name}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Text
                  style={star <= rating ? styles.starSelected : styles.star}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.commentContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.selectedImagesContainer}
              showsHorizontalScrollIndicator={false}
            >
              {selectedImages.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.selectedImage}
                />
              ))}
            </ScrollView>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Enter your comment here"
              placeholderTextColor={"gray"}
              value={comment}
              onChangeText={setComment}
            />
            <View style={styles.commentButtonsContainer}>
              <TouchableOpacity style={styles.button} onPress={handleComment}>
                <Text style={styles.buttonText}>Add Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleAddPhoto}>
                <Text style={styles.buttonText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
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
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    width: "100%",
  },
  ratings: {
    fontSize: 65,
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
    marginTop: 10,
    color: "#4C3BCF",
    fontFamily: "AmaticSC-Regular",
  },
  name: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
    marginTop: 50,
    color: "#4C3BCF",
    fontFamily: "AmaticSC-Regular",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    top: 50,
  },
  star: {
    fontSize: 30,
    color: "gray",
  },
  starSelected: {
    fontSize: 30,
    color: "gold",
  },
  commentContainer: {
    width: "90%",
    height: 300,
    marginVertical: 20,
    backgroundColor: "#FAF0E6",
    borderRadius: 10,
    padding: 10,
    bottom: -90,
  },
  commentButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  commentLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  commentInput: {
    width: "100%",
    height: 100,
    color: "black",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "transparent",
    fontFamily: "SpaceMono-Regular",
  },
  selectedImagesContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  reviewPhotosContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  reviewPhoto: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#4C3BCF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontFamily: "SpaceMono-Regular",
    fontWeight: "bold",
  },
});

export default Reviewadd;
