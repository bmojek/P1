import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { useApi } from "@/contexts/apiContext";
import { getAuth } from "firebase/auth";
import { Place } from "@/types/global.types";
import RestaurantCardPlaceholder from "@/components/RestaurantCardPlaceholder";

const Account = () => {
  const user = getAuth().currentUser;
  const { fetchLikedPlaces, fetchCommentedPlaces } = useApi();
  const [likedPlaces, setLikedPlaces] = useState<Place[]>([]);
  const [commentPlaces, setCommentPlaces] = useState<Place[]>([]);
  const [isLoadingLiked, setIsLoadingLiked] = useState(true);
  const [isLoadingCommented, setIsLoadingCommented] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setIsLoadingLiked(true);
        setIsLoadingCommented(true);

        const likedPlacesData = await fetchLikedPlaces(user.uid);
        setLikedPlaces(likedPlacesData);
        setIsLoadingLiked(false);

        const commentedPlacesData = await fetchCommentedPlaces(
          user.displayName || ""
        );
        setCommentPlaces(commentedPlacesData);
        setIsLoadingCommented(false);
      } catch (error) {
        console.error("Error fetching places:", error);
        setIsLoadingLiked(false);
        setIsLoadingCommented(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Liked restaurants</Text>
        <FlatList
          data={isLoadingLiked ? Array(5).fill(null) : likedPlaces}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            isLoadingLiked ? (
              <RestaurantCardPlaceholder />
            ) : (
              <RestaurantCard place={item} />
            )
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.title}>Recent commented</Text>
        <FlatList
          data={isLoadingCommented ? Array(2).fill(null) : commentPlaces}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            isLoadingCommented ? (
              <RestaurantCardPlaceholder />
            ) : (
              <RestaurantCard place={item} />
            )
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#352F44",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "AmaticSC-Bold",
    marginBottom: 30,
  },
  scrollView: {
    padding: 10,
  },
});
