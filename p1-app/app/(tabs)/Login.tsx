import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function TabThreeScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleLogin = async () => {
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (isUsernameValid && isPasswordValid) {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: username,
            password: password,
          }),
        });

        if (response.status === 200) {
          const data = await response.json();
          alert("Login successful Welcome " + data.user.username);
          setUsername("");
          setPassword("");
        } else {
          alert(`Invalid credentials`);
        }
      } catch (error) {
        alert("Error logging");
      }
    }
  };

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#352F44" barStyle="light-content" />
      <View style={styles.logo} />
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>To</Text>
      <Text style={styles.subtitle2}>GastroSpace</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.forgotPasswordContainer}>
        <Text style={styles.label}>Forgot Password?</Text>
        <TouchableOpacity>
          <Text style={styles.labelBold}>Recover</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newAccountContainer}>
        <Text style={styles.newAccountText}>New to GastroSpace?</Text>
        <TouchableOpacity>
          <Text style={styles.newAccountLink}>Create new account here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#352F44",
    padding: 20,
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: "#FAF0E6",
    marginBottom: 20,
  },
  title: {
    fontSize: 68,
    fontFamily: "AmaticSC-Regular",
    color: "#FAF0E6",
    marginBottom: -10,
    lineHeight: 85.75,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 68,
    fontFamily: "AmaticSC-Regular",
    color: "#FAF0E6",
    lineHeight: 85.75,
    textAlign: "center",
  },
  subtitle2: {
    fontSize: 68,
    fontFamily: "AmaticSC-Regular",
    color: "#FAF0E6",
    marginBottom: 20,
    lineHeight: 85.75,
    textAlign: "center",
    marginTop: -10,
  },
  inputContainer: {
    width: "100%",
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
  errorText: {
    color: "red",
    fontSize: 12,
    position: "absolute",
    bottom: -15,
    left: 10,
  },
  forgotPasswordContainer: {
    margin: 8,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  label: {
    margin: 8,
    color: "#FAF0E6",
    fontSize: 15,
    lineHeight: 15,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
  },
  labelBold: {
    color: "#4C3BCF",
    fontFamily: "Poppins-Bold",
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
  newAccountContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 10,
  },
  newAccountText: {
    color: "#FAF0E6",
    fontFamily: "Poppins-Regular",
  },
  newAccountLink: {
    color: "#4C3BCF",
    fontFamily: "Poppins-Bold",
  },
});
