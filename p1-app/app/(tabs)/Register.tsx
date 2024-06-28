import {
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Text, View } from "@/components/Themed";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useApi } from "@/contexts/apiContext";

SplashScreen.preventAutoHideAsync();

export default function TabTwoScreen() {
  const [isChecked, setChecked] = useState(false);
  const { register } = useApi();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

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

  if (!fontLoaded) {
    return null;
  }

  const handleRegister = () => {
    if (isChecked) {
      register(username, password)
        .then(() => {
          setUsername("");
          setEmail("");
          setPassword("");
          setChecked(false);
          alert("Succesful Register");
        })
        .catch((err) => {
          alert("Unable to Register");
        });
    } else {
      alert("Agree to terms and conditions");
    }
  };

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
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#0C0C0C"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#0C0C0C"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#0C0C0C"
        value={email}
        onChangeText={setEmail}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
  input: {
    width: 328,
    height: 56,
    borderColor: "#0C0C0C",
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    color: "#0C0C0C",
    fontSize: 20,
    fontFamily: "SpaceMono-Regular",
    backgroundColor: "#FAF0E6",
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
