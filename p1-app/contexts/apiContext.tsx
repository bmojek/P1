import React, { createContext, useContext, useState, ReactNode } from "react";
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
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Place, ApiContextType, User } from "@/types/global.types";
import { app, auth } from "@/firebaseConfig";

const dbFirebase = getFirestore(app);
const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [place, setPlace] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place>(place[0]);

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
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const fetchPlaces = async () => {
    try {
      const placesCollection = collection(dbFirebase, "places");
      const placesSnapshot = await getDocs(placesCollection);
      const placesData = placesSnapshot.docs.map((doc) => doc.data() as Place);

      if (placesData.length > 0) {
        setPlace(placesData);
      } else {
        console.warn("No places data found in Firestore.");
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

      const placeRef = doc(dbFirebase, "places", id);

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
      fetchPlaces();
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

  const addPreferences = async (userId: string, preferences: string[]) => {
    try {
      const userPreferencesRef = doc(dbFirebase, "userPreferences", userId);
      await setDoc(userPreferencesRef, { preferences });
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
          const placeRef = doc(dbFirebase, "places", placeId);
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
      const placesCollection = collection(dbFirebase, "places");
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

  return (
    <ApiContext.Provider
      value={{
        place,
        selectedPlace,
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
