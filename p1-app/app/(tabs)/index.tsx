import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
  View,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import RestaurantCard from "@/components/RestaurantCard";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useApi } from "@/contexts/apiContext";
import { Link } from "expo-router";

SplashScreen.preventAutoHideAsync();

type Category = {
  id: string;
  name: string;
};

export default function Home() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [visibleItems, setVisibleItems] = useState(5);
  const [selectedType, setSelectedType] = useState("");
  const { place, fetchPlaces } = useApi();
  const [search, setSearch] = useState("");

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const fetchFonts = () => {
    return Font.loadAsync({
      "AmaticSC-Regular": require("../../assets/fonts/AmaticSC-Regular.ttf"),
      "AmaticSC-Bold": require("../../assets/fonts/AmaticSC-Bold.ttf"),
      "SpaceMono-Regular": require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });
  };

  useEffect(() => {
    fetchFonts()
      .then(() => setFontLoaded(true))
      .catch((err) => console.log(err));
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLocation("Cracow");
    })();

    fetchPlaces();
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return null;
  }

  const handleLocationPress = () => {
    setShowMap(true);
  };

  const handleSelectType = (type: string) => {
    type === selectedType ? setSelectedType("") : setSelectedType(type);
  };

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 5);
  };

  const categories: Category[] = [
    { id: "0", name: "Italian" },
    { id: "1", name: "Polish" },
    { id: "2", name: "Indian" },
    { id: "3", name: "American" },
    { id: "4", name: "European" },
    { id: "5", name: "Chinese" },
    { id: "6", name: "Mexican" },
  ];
  const filteredItems = place
    .filter((item) => (selectedType ? item.type === selectedType : true))
    .filter((item) =>
      search
        ? item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.type.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .slice(0, visibleItems);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.topContainer}>
        <TouchableOpacity>
          <Entypo name="menu" size={30} color="#000000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={handleLocationPress}
            style={styles.locationButton}
          >
            <Ionicons name="location-outline" size={20} color="#000000" />
            <Text style={styles.locationText}>{location}</Text>
            <TextInput
              style={styles.searchText}
              placeholder={"Kuchnia Polska"}
              value={search}
              onChangeText={setSearch}
              maxLength={20}
              placeholderTextColor={"#444"}
            />
          </TouchableOpacity>
        </View>
        <Link href={"/profile"}>
          <Ionicons
            name="person-circle-outline"
            size={50}
            color="#0C0C0C"
            style={styles.icon}
          />
        </Link>
      </View>
      <View style={styles.locationContainer}></View>
      <Text style={styles.heading}>Popular Food</Text>
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
      <FlatList
        data={filteredItems
          .filter((item) => !selectedType || item.type === selectedType)
          .slice(0, visibleItems)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <RestaurantCard place={item} />}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.scrollView}
      />
      {showMap && (
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={mapRegion}>
            <Marker coordinate={mapRegion} />
          </MapView>
          <TouchableOpacity
            style={styles.closeMapButton}
            onPress={() => setShowMap(false)}
          >
            <Text style={styles.closeMapButtonText}>Close Map</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#352F44",
    paddingTop: 50,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  logo: {
    width: 85,
    height: 75,
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
  },
  heading: {
    fontSize: 22,
    color: "white",
    fontFamily: "SpaceMono-Regular",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginBottom: 10,
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
    paddingLeft: 10,
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
    backgroundColor: "#F4C430",
  },
  searchText: {
    marginLeft: 10,
    marginTop: 2,
    fontFamily: "SpaceMono-Regular",
    fontSize: 12.5,
  },
});
