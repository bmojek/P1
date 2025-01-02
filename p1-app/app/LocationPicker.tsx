import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker, Region, LatLng } from "react-native-maps";
import * as Location from "expo-location";
import { Place } from "@/types/global.types";
import { router } from "expo-router";
import { useApi } from "@/contexts/apiContext";

interface LocationPickerProps {
  place: Place[];
  lastRegion: Region | null;
  visible: boolean;
  onSelectLocation: (city: string) => void;
  onClose: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onSelectLocation,
  onClose,
  lastRegion,
  place,
}) => {
  const [region, setRegion] = useState<Region>({
    latitude: 50.049683,
    longitude: 19.944544,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { selectPlace, fetchPlaces } = useApi();
  const getCity = async (latitude: number, longitude: number) => {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (address.length > 0) {
        const { city } = address[0];
        if (city) {
          onSelectLocation(city);
        }
      }
    } catch (error) {
      console.log("Error reverse geocoding:", error);
    }
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    getCity(latitude, longitude);
  };

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const geocodeResults = await Location.geocodeAsync(query);
        if (geocodeResults.length > 0) {
          const { latitude, longitude } = geocodeResults[0];
          setRegion({
            ...region,
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setSelectedLocation({ latitude, longitude });
          getCity(latitude, longitude);
        } else {
          const latitude = 50.049683;
          const longitude = 19.944544;
          setRegion({
            ...region,
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setSelectedLocation({ latitude, longitude });
          getCity(latitude, longitude);
        }
      } catch (error) {
        console.log("Error geocoding:", error);
      }
    }
  };

  useEffect(() => {
    if (lastRegion != null) {
      setRegion(lastRegion);
    }
  }, [lastRegion]);

  return (
    <Modal
      visible={visible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => {
        setSearchQuery("");
        onClose();
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select a Location</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>

        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}

          {place.map((mark, index) => (
            <Marker
              onCalloutPress={() => {
                selectPlace(mark);
                router.push({
                  pathname: "/Details",
                });
                onClose();
              }}
              pinColor="purple"
              title={mark.name}
              description={mark.location}
              key={index}
              coordinate={{
                latitude: mark.locationCords.latitude,
                longitude: mark.locationCords.longitude,
              }}
            />
          ))}
        </MapView>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            setSearchQuery("");
            onClose();
            fetchPlaces();
          }}
        >
          <Text style={styles.confirmText}>Confirm Location</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#352F44",
  },
  modalTitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "70%",
  },
  confirmButton: {
    backgroundColor: "#FAF0E6",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 18,
    color: "#0C0C0C",
  },
  searchContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    color: "white",
  },
  searchingText: {
    marginTop: 5,
    color: "gray",
  },
});

export default LocationPicker;
