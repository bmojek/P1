import {
  getFirestore,
  collection,
  getDocs,
  QuerySnapshot,
  doc,
  DocumentSnapshot,
  DocumentData,
  getDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { Place } from "./src/models/Place";
const { app } = require("./firebaseConfig");

const db = getFirestore(app);

const getAllUserIds = async (): Promise<string[]> => {
  try {
    const userPreferencesRef = collection(db, "userPreferences");
    const snapshot: QuerySnapshot = await getDocs(userPreferencesRef);
    const userIds: string[] = [];
    snapshot.forEach((doc) => {
      userIds.push(doc.id);
    });
    return userIds;
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    return [];
  }
};
const getUserPreferences = async (userId: string): Promise<string[] | null> => {
  try {
    const userPreferencesRef = doc(db, "userPreferences", userId);
    const snapshot: DocumentSnapshot<DocumentData> = await getDoc(
      userPreferencesRef
    );

    if (snapshot.exists()) {
      const data = snapshot.data();
      return data?.preferences || [];
    } else {
      console.log(`No preferences found for user: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
};
const getUserLikedPlaces = async (
  userId: string
): Promise<DocumentData[] | null> => {
  try {
    const likePlacesRef = collection(db, "likePlaces");
    const q = query(likePlacesRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const likedPlaces: DocumentData[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data?.likedPlaces && Array.isArray(data.likedPlaces)) {
        for (const placeId of data.likedPlaces) {
          const placeDetails = await getPlaceDetails(placeId);
          if (placeDetails) {
            likedPlaces.push(placeDetails);
          }
        }
      }
    }

    return likedPlaces.length > 0 ? likedPlaces : null;
  } catch (error) {
    console.error("Error fetching liked places:", error);
    return null;
  }
};
const getPlaceDetails = async (
  placeId: string
): Promise<DocumentData | null> => {
  try {
    const placeRef = doc(db, "allPlaces", placeId);
    const snapshot: DocumentSnapshot<DocumentData> = await getDoc(placeRef);

    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      console.log(`Place not found for ID: ${placeId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};
const getPlaces = async () => {
  try {
    const placesCollection = collection(db, "allPlaces");
    const placesSnapshot = await getDocs(placesCollection);
    const placesData = placesSnapshot.docs.map((doc) => doc.data() as Place);

    if (placesData.length > 0) {
      return placesData;
    } else {
      console.warn("No places data found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching places from Firestore:", error);
  }
};

const uploadRecommendedPlaces = async (
  userId: string,
  recommendedPlaceIds: string[]
): Promise<void> => {
  try {
    const recommendationRef = collection(db, "recommendationSystem");
    const userDocRef = doc(recommendationRef, userId);

    await setDoc(userDocRef, {
      recommendedPlaces: recommendedPlaceIds,
    });

    console.log(
      `Created recommendation document for user ${userId} with recommended places.`
    );
  } catch (error) {
    console.error("Error creating recommendation document:", error);
  }
};
const recomendationSystem = async () => {
  const users = await getAllUserIds();

  for (const userId of users) {
    const preferences = await getUserPreferences(userId);
    const likedPlaces = (await getUserLikedPlaces(userId)) as Place[];
    const likedCities = [
      ...new Set(likedPlaces?.map((place) => place.location.split(" ").pop())),
    ];
    if (likedCities.length < 1)
      likedCities.push("Kraków", "Tarnów", "Warszawa", "Gdańsk", "Wrocław");
    const places = await getPlaces();

    const filteredPlaces = places
      ?.filter((place) =>
        likedCities.some((city) => place.location?.includes(city ?? ""))
      )
      .filter(
        (place) =>
          preferences?.includes(place.type) ||
          place.tags?.some((tag) => preferences?.includes(tag))
      );

    const filteredPlaceIds = filteredPlaces?.map((place) => place.id);

    const recommendedPlacesIds = filteredPlaceIds?.filter(
      (placeId) => !likedPlaces.some((likedPlace) => likedPlace.id === placeId)
    );

    if (recommendedPlacesIds)
      uploadRecommendedPlaces(userId, recommendedPlacesIds);
  }
};

recomendationSystem();
