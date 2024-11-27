import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState } from "react";
import React from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { router } from "expo-router";

export default function ResetPass() {
  const [email, setEmail] = useState("");
  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox and follow the instructions."
      );
      setEmail("");
      router.back();
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email format. Please try again.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/Logo4.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Forgot Password</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#0C0C0C"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#352F44",
    padding: 20,
    height: "100%",
  },
  logo: {
    width: 85,
    height: 75,
    marginBottom: 0,
  },
  title: {
    fontSize: 68,
    fontFamily: "AmaticSC-Regular",
    color: "#FAF0E6",
  },

  inputContainer: {
    marginTop: "30%",
    width: "90%",
    backgroundColor: "transparent",
    height: 56,
    marginBottom: 20,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: "100%",
    borderColor: "#0C0C0C",
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    color: "#0C0C0C",
    fontSize: 20,
    fontFamily: "SpaceMono-Regular",
    backgroundColor: "#FAF0E6",
  },

  button: {
    width: 234,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#FAF0E6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#0C0C0C",
    fontSize: 20,
    fontFamily: "SpaceMono-Regular",
  },
});
