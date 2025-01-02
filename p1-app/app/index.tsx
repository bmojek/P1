import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";

import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import RestaurantCard from "@/components/RestaurantCard";
import { useApi } from "@/contexts/apiContext";
import { Link } from "expo-router";
import LocationPicker from "./LocationPicker";
import { getAuth } from "firebase/auth";
import { Place, categories } from "@/types/global.types";
import RestaurantCardPlaceholder from "@/components/RestaurantCardPlaceholder";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const {
    place,
    fetchPlaces,
    recommendedPlaces,
    location,
    region,
    setSearchLocation,
    clearPlaces,
  } = useApi();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [recommended, setRecommended] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const user = getAuth();

  const selectedPlaces = isRecommended ? recommended : place;
  const filteredItems = selectedPlaces
    .filter((item) => (selectedType ? item.type === selectedType : true))
    .filter((item) =>
      search
        ? item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.type.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((item) =>
      location
        ? item.location.toLowerCase().includes(location.toLowerCase())
        : true
    );

  const handleSelect = async (isSelected: boolean) => {
    if (isSelected) {
      setIsRecommended(true);
      if (recommended.length == 0) {
        setLoading(true);
        const recom = await recommendedPlaces(user.currentUser?.uid || "");
        setLoading(false);
        setRecommended(recom);
      }
    } else {
      setIsRecommended(false);
    }
  };

  const handleLocationPress = () => {
    setLocationPickerVisible(true);
  };

  const handleLocationSelect = (city: string) => {
    setSearchLocation(city);
  };

  const handleLocationPickerClose = () => {
    setLocationPickerVisible(false);
  };

  const handleSelectType = (type: string) => {
    type === selectedType ? setSelectedType("") : setSelectedType(type);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    clearPlaces();
    await fetchPlaces();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.topContainer}>
        <TouchableOpacity>
          <Image
            style={styles.logo}
            source={require("@/assets/images/Logo4.png")}
          />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <View style={styles.locationButton}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleLocationPress}
            >
              <Ionicons name="location-outline" size={20} color="#000000" />
              <Text style={styles.locationText}>
                {location ? location : "Polska"}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.searchText}
              placeholder={filteredItems.at(2)?.name || "Search"}
              value={search}
              onChangeText={setSearch}
              maxLength={20}
              placeholderTextColor={"#444"}
            />
          </View>
        </View>
        <Link href={"/Profile"}>
          <Ionicons
            name="person-circle-outline"
            size={50}
            color="#4C3BCF"
            style={styles.icon}
          />
        </Link>
      </View>
      <View style={styles.recommendation}>
        <TouchableOpacity onPress={() => handleSelect(false)}>
          <Text style={[styles.heading, !isRecommended && styles.heading2]}>
            Popular Food
          </Text>
        </TouchableOpacity>
        {user.currentUser?.uid != undefined ? (
          <TouchableOpacity onPress={() => handleSelect(true)}>
            <Text style={[styles.heading, isRecommended && styles.heading2]}>
              Recommended
            </Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={
                item.name == selectedType
                  ? styles.selectedCategory
                  : styles.categoryButton
              }
              onPress={() => handleSelectType(item.name)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      </View>
      {loading ? (
        <View>
          <RestaurantCardPlaceholder />
          <RestaurantCardPlaceholder />
          <RestaurantCardPlaceholder />
        </View>
      ) : filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems.filter(
            (item) => !selectedType || item.type === selectedType
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <RestaurantCard place={item} />}
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              tintColor={"#FAF0E6"}
              refreshing={refreshing}
            />
          }
          onEndReached={fetchPlaces}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <Text>Brak restauracji</Text>
      )}
      <LocationPicker
        lastRegion={region}
        visible={isLocationPickerVisible}
        onSelectLocation={handleLocationSelect}
        onClose={handleLocationPickerClose}
        place={place}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#352F44",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
  },
  logo: {
    width: 45,
    height: 45,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#0C0C0C",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    marginLeft: 10,
    color: "#0C0C0C",
    fontSize: 16,
    fontFamily: "SpaceMono-Regular",
    backgroundColor: "#FAF0E6",
  },
  icon: {
    marginLeft: 10,
  },
  categoryContainer: {
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  categoryButton: {
    backgroundColor: "#FAF0E6",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 16,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
    color: "#0C0C0C",
    fontFamily: "SpaceMono-Regular",
  },
  recomtext: {
    fontSize: 20,
    color: "#FAF0E6",
    fontFamily: "SpaceMono-Regular",
  },
  foodContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "SpaceMono-Regular",
    marginLeft: 5,
    maxWidth: 80,
  },
  heading: {
    fontSize: 22,
    color: "white",
    fontFamily: "SpaceMono-Regular",
    paddingHorizontal: 10,
    marginBottom: 10,
    opacity: 0.3,
  },
  heading2: {
    opacity: 1,
  },
  scrollView: {
    alignItems: "center",
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 10,
    height: 40,
    marginLeft: 10,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 2,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeMapButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 40,
  },
  closeMapButtonText: {
    fontSize: 16,
    color: "#000",
  },
  selectedCategory: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#4C3BCF",
  },
  searchText: {
    paddingLeft: 10,
    paddingTop: 2,
    fontFamily: "SpaceMono-Regular",
    fontSize: 12.5,
    width: 160,
  },
  recommendation: {
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
  },
});
