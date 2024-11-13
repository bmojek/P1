import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Profile() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFonts = async () => {
      await Font.loadAsync({
        "AmaticSC-Regular": require("../assets/fonts/AmaticSC-Regular.ttf"),
        "AmaticSC-Bold": require("../assets/fonts/AmaticSC-Bold.ttf"),
      });
      setFontLoaded(true);
    };
    fetchFonts();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.back();
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  const handleLogin = () => {
    router.navigate("/Login");
  };

  const handleRegister = () => {
    router.navigate("/Register");
  };

  if (!fontLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        {user ? (
          <>
            <View style={styles.profileInfoContainer}>
              <Ionicons
                name="person-circle-outline"
                size={100}
                color="#000000"
                style={styles.profileIcon}
              />
              <Text style={styles.profileName}>
                {user?.displayName || "Guest User"}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || "No email found"}
              </Text>
            </View>
            <TouchableOpacity style={styles.styleButton}>
              <Text style={styles.logoutText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleButton}>
              <Text style={styles.logoutText}>Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleButton}>
              <Text style={styles.logoutText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>Welcome to our app!</Text>
            <TouchableOpacity onPress={handleLogin} style={styles.styleButton}>
              <Text style={styles.logoutText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#352F44",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileIcon: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "AmaticSC-Regular",
  },
  profileEmail: {
    fontSize: 16,
    color: "#FAF0E6",
    fontFamily: "SpaceMono-Regular",
  },
  logoutButton: {
    width: "60%",
    marginTop: 30,
    backgroundColor: "#F4C430",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  styleButton: {
    width: "60%",
    marginTop: 30,
    backgroundColor: "#FAF0E6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 18,
    color: "#0C0C0C",
    fontFamily: "SpaceMono-Regular",
  },
  welcomeText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "AmaticSC-Bold",
    marginBottom: 20,
  },
});
