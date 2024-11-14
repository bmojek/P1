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
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Place, ApiContextType } from "@/types/global.types";
import { app, auth } from "@/firebaseConfig";
import { router } from "expo-router";

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
      router.back();
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      router.back();
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
    rating: string,
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
