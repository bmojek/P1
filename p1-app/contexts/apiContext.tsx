import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  increment,
  getDoc,
  setDoc,
  arrayRemove,
  query,
  orderBy,
  limit,
  where,
  startAfter,
  DocumentSnapshot,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { router } from "expo-router";
import { Place, ApiContextType } from "@/types/global.types";
import { app, auth } from "@/firebaseConfig";
import { Region } from "react-native-maps";
import * as Location from "expo-location";
import { Alert } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
const dbFirebase = getFirestore(app);
const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [place, setPlace] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place>(place[0]);
  const [location, setLocation] = useState<string>("");
  const [region, setRegion] = useState<Region | null>(null);
  const lastVisibleRef = useRef<DocumentSnapshot | null>(null);
  const fetchFonts = () => {
    return Font.loadAsync({
      "AmaticSC-Regular": require("../assets/fonts/AmaticSC-Regular.ttf"),
      "AmaticSC-Bold": require("../assets/fonts/AmaticSC-Bold.ttf"),
      "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
  };

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);
  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
    getCurrentLocation();
  }, []);
  useEffect(() => {
    fetchPlaces();
  }, [location]);

  const register = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(userCredential.user, { displayName: username });
      router.navigate("/");
      router.navigate("/Preference");
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      router.navigate("/");
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const fetchPlaces = async () => {
    try {
      const placesCollection = collection(dbFirebase, "allPlaces");
      let placesQuery = query(
        placesCollection,
        where("city", "==", location),
        orderBy("name"),
        limit(10)
      );

      if (lastVisibleRef.current) {
        placesQuery = query(placesQuery, startAfter(lastVisibleRef.current));
      }

      const placesSnapshot = await getDocs(placesQuery);
      const placesData = placesSnapshot.docs.map((doc) => doc.data() as Place);

      if (placesData.length > 0) {
        setPlace((prevPlaces) => [...prevPlaces, ...placesData]);

        lastVisibleRef.current =
          placesSnapshot.docs[placesSnapshot.docs.length - 1];
      }
    } catch (error) {
      console.error("Error fetching places from Firestore:", error);
      alert("Make sure Firebase is connected and places collection exists.");
    }
  };

  const addComment = async (
    id: string,
    rating: number,
    name: string,
    review_text: string,
    review_photos: string[]
  ) => {
    try {
      const reviewData = {
        review_id: new Date().getTime().toString(),
        rating,
        name,
        review_text,
        published_at_date: new Date().toISOString().slice(0, 19),
        review_photos: review_photos,
      };

      const placeRef = doc(dbFirebase, "allPlaces", id);

      await updateDoc(placeRef, {
        reviews: arrayUnion(reviewData),
        reviewCount: increment(1),
      });
      const updatedPlaceSnapshot = await getDoc(placeRef);
      if (updatedPlaceSnapshot.exists()) {
        const updatedPlace = updatedPlaceSnapshot.data() as Place;

        selectPlace(updatedPlace);
      } else {
        console.log("Place not found after update.");
      }
    } catch (error) {
      console.error("Error adding review: ", error);
      alert("Failed to add review, please try again.");
    }
  };

  const selectPlace = (place: Place) => {
    setSelectedPlace(place);
  };

  const likePlace = async (placeId: string, userId: string) => {
    try {
      const userLikeRef = doc(dbFirebase, "likePlaces", userId);
      const userLikeSnapshot = await getDoc(userLikeRef);
      if (userLikeSnapshot.exists()) {
        await updateDoc(userLikeRef, {
          likedPlaces: arrayUnion(placeId),
        });
      } else {
        await setDoc(userLikeRef, {
          likedPlaces: [placeId],
          userId: userId,
          likedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error liking place: ", error);
    }
  };
  const unLikePlace = async (placeId: string, userId: string) => {
    try {
      const userLikeRef = doc(dbFirebase, "likePlaces", userId);
      const userLikeSnapshot = await getDoc(userLikeRef);

      if (userLikeSnapshot.exists()) {
        await updateDoc(userLikeRef, {
          likedPlaces: arrayRemove(placeId),
        });
      }
    } catch (error) {
      console.error("Error unliking place: ", error);
    }
  };

  const isLikedPlace = async (
    placeId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const userLikeRef = doc(dbFirebase, "likePlaces", userId);
      const userLikeSnapshot = await getDoc(userLikeRef);

      if (userLikeSnapshot.exists()) {
        const likedPlaces =
          (userLikeSnapshot.data().likedPlaces as string[]) || [];
        return likedPlaces.includes(placeId);
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking if place is liked: ", error);
      return false;
    }
  };

  const addPreferences = async (
    userId: string,
    preferences: string[],
    dataProcessing: boolean
  ) => {
    try {
      const userPreferencesRef = doc(dbFirebase, "userPreferences", userId);
      if (dataProcessing) {
        await setDoc(userPreferencesRef, { preferences });
      } else {
        await deleteDoc(userPreferencesRef);
      }
    } catch (error) {
      console.error("Error setting preferences:", error);
      alert("Failed to set preferences, please try again.");
    }
  };
  const fetchPreferences = async (userId: string): Promise<string[]> => {
    try {
      const userPreferencesRef = doc(dbFirebase, "userPreferences", userId);
      const userPreferencesSnapshot = await getDoc(userPreferencesRef);

      if (userPreferencesSnapshot.exists()) {
        const data = userPreferencesSnapshot.data();
        return data.preferences || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return [];
    }
  };
  const fetchLikedPlaces = async (userId: string): Promise<Place[]> => {
    try {
      const userLikeRef = doc(dbFirebase, "likePlaces", userId);
      const userLikeSnapshot = await getDoc(userLikeRef);

      if (userLikeSnapshot.exists()) {
        const likedPlacesIds = userLikeSnapshot.data().likedPlaces as string[];
        const likedPlaces: Place[] = [];

        for (const placeId of likedPlacesIds) {
          const placeRef = doc(dbFirebase, "allPlaces", placeId);
          const placeSnapshot = await getDoc(placeRef);

          if (placeSnapshot.exists()) {
            likedPlaces.push(placeSnapshot.data() as Place);
          }
        }
        return likedPlaces;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching liked places: ", error);
      return [];
    }
  };
  const fetchCommentedPlaces = async (userName: string): Promise<Place[]> => {
    try {
      const placesCollection = collection(dbFirebase, "allPlaces");
      const placesSnapshot = await getDocs(placesCollection);

      const commentedPlaces: Place[] = [];
      placesSnapshot.forEach((doc) => {
        const place = doc.data() as Place;
        const hasUserCommented = place.reviews?.some(
          (review) => review.name === userName
        );
        if (hasUserCommented) {
          commentedPlaces.push({ ...place });
        }
      });

      return commentedPlaces;
    } catch (error) {
      console.error("Error fetching commented places:", error);
      return [];
    }
  };

  const recommendedPlaces = async (userId: string): Promise<Place[]> => {
    try {
      const recommendationsRef = doc(
        dbFirebase,
        "recommendationSystem",
        userId
      );
      const recommendationsSnapshot = await getDoc(recommendationsRef);

      if (recommendationsSnapshot.exists()) {
        const recommendedPlaceIds = recommendationsSnapshot.data()
          .recommendedPlaces as string[];

        const placePromises = recommendedPlaceIds.map((placeId) => {
          const placeRef = doc(dbFirebase, "allPlaces", placeId);
          return getDoc(placeRef).then((placeSnapshot) => {
            if (placeSnapshot.exists()) {
              return placeSnapshot.data() as Place;
            }
          });
        });

        const recommendedPlaces = (await Promise.all(placePromises)).filter(
          (place) => place !== null
        ) as Place[];

        return recommendedPlaces;
      } else {
        return place.slice(4, 10);
      }
    } catch (error) {
      console.error("Error fetching recommended places:", error);
      return [];
    }
  };
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const { city } = address[0];
        setLocation(`${city}`);
      }
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const setSearchLocation = (location: string) => {
    lastVisibleRef.current = null;
    setPlace([]);
    setLocation(location);
  };
  const clearPlaces = () => {
    setPlace([]);
    lastVisibleRef.current = null;
  };
  const clearUserData = async (userId: string) => {
    try {
      const userPreferencesRef = doc(dbFirebase, "userPreferences", userId);
      await deleteDoc(userPreferencesRef);
      const userLikeRef = doc(dbFirebase, "likePlaces", userId);
      await deleteDoc(userLikeRef);
      const userRecommendationRef = doc(
        dbFirebase,
        "recommendationSystem",
        userId
      );
      await deleteDoc(userRecommendationRef);
    } catch (error) {
      console.error("Error deleting user data:", error);
      alert("Failed delete user data, please try again.");
    }
  };
  return (
    <ApiContext.Provider
      value={{
        place,
        selectedPlace,
        location,
        region,
        setSearchLocation,
        clearPlaces,
        register,
        login,
        fetchPlaces,
        addComment,
        selectPlace,
        likePlace,
        isLikedPlace,
        unLikePlace,
        addPreferences,
        fetchPreferences,
        fetchLikedPlaces,
        fetchCommentedPlaces,
        recommendedPlaces,
        getCurrentLocation,
        clearUserData,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
