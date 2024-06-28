import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Text, View } from "@/components/Themed";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/Ionicons";

SplashScreen.preventAutoHideAsync();

export default function TabTwoScreen() {
  const [isChecked, setChecked] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

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
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  const validateUsername = () => {
    if (!username) {
      setUsernameError("Username is required");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleCreateAccount = () => {
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const isEmailValid = validateEmail();

    if (isUsernameValid && isPasswordValid && isEmailValid && isChecked) {
      setUsername("");
      setPassword("");
      setEmail("");
      setChecked(false);
      alert("Succesfull register");
    } else {
      if (!isChecked) {
        alert("You must agree to the terms and conditions");
      }
    }
  };

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#352F44" barStyle="light-content" />
      <TouchableOpacity style={styles.backButton} onPress={() => {}}>
        <Icon
          name="arrow-back"
          size={24}
          color="#FAF0E6"
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <View style={styles.circle} />
      <Text style={styles.title}>Create a new</Text>
      <Text style={styles.subtittle}>Account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#0C0C0C"
          value={username}
          onChangeText={setUsername}
          onBlur={validateUsername}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#0C0C0C"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          onBlur={validatePassword}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#0C0C0C"
          value={email}
          onChangeText={setEmail}
          onBlur={validateEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          onValueChange={setChecked}
          value={isChecked}
        />
        <Text style={styles.label}>
          <Text style={styles.labelBold}>I agree </Text>
          with all the terms and conditions
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FAF0E6",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#352F44",
  },
  title: {
    fontSize: 68,
    fontFamily: "AmaticSC-Regular",
    color: "#FAF0E6",
    marginBottom: -10,
    lineHeight: 85.75,
    textAlign: "center",
  },
  subtittle: {
    fontSize: 68,
    fontFamily: "AmaticSC-Regular",
    color: "#FAF0E6",
    marginBottom: 20,
    lineHeight: 85.75,
    textAlign: "center",
    marginTop: -10,
  },
  inputContainer: {
    width: 328,
    backgroundColor: "transparent",
    height: 56,
    marginBottom: 20,
    position: "relative",
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
  errorText: {
    color: "red",
    fontSize: 12,
    position: "absolute",
    bottom: -15,
    left: 10,
  },
  label: {
    margin: 8,
    color: "#FAF0E6",
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
  },
  labelBold: {
    color: "#4C3BCF",
    fontFamily: "Poppins-Bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#352F44",
  },
  checkbox: {
    alignSelf: "center",
  },
  button: {
    width: 234.29,
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 31.24,
    height: 21.61,
    opacity: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    color: "#FAF0E6",
  },
});
