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
          <View>
            <View style={styles.profileInfoContainer}>
              <Ionicons
                name="person-circle-outline"
                size={100}
                color="#4C3BCF"
                style={styles.profileIcon}
              />
              <Text style={styles.profileName}>
                {user?.displayName || "Guest User"}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || "No email found"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/Account")}
              style={styles.styleButton}
            >
              <Text style={styles.logoutText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.styleButton}
              onPress={() => router.push("/Preference")}
            >
              <Text style={styles.logoutText}>Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/Settings")}
              style={styles.styleButton}
            >
              <Text style={styles.logoutText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.welcomeText}>Welcome to our app!</Text>
            <Text style={styles.descText}>
              Login or Register to comment, share and many more!
            </Text>
            <TouchableOpacity onPress={handleLogin} style={styles.styleButton}>
              <Text style={styles.logoutText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Register</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 35,
    paddingBottom: 10,
    color: "#FAF0E6",
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
    backgroundColor: "#4C3BCF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "center",
  },
  styleButton: {
    width: "60%",
    marginTop: 30,
    backgroundColor: "#FAF0E6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "center",
  },
  logoutText: {
    fontSize: 18,
    color: "#0C0C0C",
    fontFamily: "SpaceMono-Regular",
  },
  welcomeText: {
    fontSize: 50,
    color: "#FAF0E6",
    fontFamily: "AmaticSC-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  descText: {
    fontSize: 25,
    width: "70%",
    textAlign: "center",
    color: "#FAF0E6",
    fontFamily: "AmaticSC-Bold",
    marginBottom: 20,
  },
});
