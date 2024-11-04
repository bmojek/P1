import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Text, View } from "@/components/Themed";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useApi } from "@/contexts/apiContext";

SplashScreen.preventAutoHideAsync();
interface RegisterResponse {
  status: number;
  user?: User;
  message?: string;
}

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

export default function TabTwoScreen() {
  const [isChecked, setChecked] = useState(false);
  const { register } = useApi();
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
      register(username, password, email)
        .then((response) => {
          if (response.status === 409) {
            alert("Username is already taken");
          } else if (response.status === 200) {
            setUsername("");
            setEmail("");
            setPassword("");
            setChecked(false);
            alert("Successful Register");
          } else {
            alert("Unable to Register");
          }
        })
        .catch((err) => {
          alert("Unable to Register");
        });
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
      <Image
        source={require("../../assets/images/Logo4.png")}
        style={styles.logo}
      />
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
      <View style={styles.signotherline}></View>
      <Text style={styles.otherlogin}>
        <Text> Or Sign up with </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 85,
    height: 75,
    marginBottom: 0,
    marginTop: -60,
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
  otherlogin: {
    margin: 8,
    color: "#FAF0E6",
    fontSize: 10,
    lineHeight: 10,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
  },
  signline: {},
  signotherline: {},
});
