import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { router } from "expo-router";

const Settings: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [editingField, setEditingField] = useState<
    "username" | "email" | "password" | null
  >(null);
  const [username, setUsername] = useState<string>(user?.displayName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [newValue, setNewValue] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const handleEdit = (field: "username" | "email" | "password") => {
    setEditingField(field);
    if (field === "username") setNewValue(username);
    if (field === "email") setNewValue(email);
  };

  const handleCancel = () => {
    setEditingField(null);
    setNewValue("");
    setNewPassword("");
    setCurrentPassword("");
  };

  const handleConfirm = async () => {
    if (!currentPassword) {
      Alert.alert(
        "Error",
        "Please enter your current password to confirm changes."
      );
      return;
    }

    try {
      if (user?.email) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      }

      if (editingField === "username" && newValue !== user?.displayName) {
        await updateProfile(user!, { displayName: newValue });
        setUsername(newValue);
        Alert.alert("Success", "Username updated successfully!");
      }

      if (editingField === "email" && newValue !== user?.email) {
        await updateEmail(user!, newValue);
        setEmail(newValue);
        Alert.alert("Success", "Email updated successfully!");
      }

      if (editingField === "password" && newPassword) {
        await updatePassword(user!, newPassword);
        Alert.alert("Success", "Password updated successfully!");
      }

      handleCancel();
    } catch (error: any) {
      Alert.alert(
        "Wrong password",
        "Please enter your current password to confirm changes"
      );
    }
  };

  const handleDelAcc = () => {
    if (!user) return;
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteUser(user);
              Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted."
              );
              router.navigate("/");
            } catch (error: any) {
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again later."
              );
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.accountContainer}>
        <Text style={styles.title}>Account Settings</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Username:</Text>
          {editingField === "username" ? (
            <View>
              <TextInput
                style={styles.input}
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Enter new username"
                placeholderTextColor="#AAAAAA"
              />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
              />
            </View>
          ) : (
            <Text style={styles.fieldValue}>{username}</Text>
          )}
          {editingField === "username" ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit("username")}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email:</Text>
          {editingField === "email" ? (
            <View>
              <TextInput
                style={styles.input}
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Enter new email"
                placeholderTextColor="#AAAAAA"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
              />
            </View>
          ) : (
            <Text style={styles.fieldValue}>{email}</Text>
          )}
          {editingField === "email" ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit("email")}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Password:</Text>
          {editingField === "password" ? (
            <>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry
              />
            </>
          ) : (
            <Text style={styles.fieldValue}>********</Text>
          )}
          {editingField === "password" ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit("password")}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDelAcc()}
          style={styles.deleteBtn}
        >
          <Text style={styles.delText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#352F44",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  accountContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#FFFFFF",
    fontFamily: "AmaticSC-Bold",
    marginBottom: 30,
  },
  fieldContainer: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  fieldLabel: {
    fontSize: 18,
    color: "#FAF0E6",
    fontFamily: "AmaticSC-Bold",
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "SpaceMono-Regular",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#FAF0E6",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    color: "#0C0C0C",
    marginBottom: 10,
  },
  editButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F4C430",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#FA8072",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#0C0C0C",
    fontFamily: "SpaceMono-Regular",
  },
  deleteBtn: {
    width: "60%",
    marginTop: 30,
    backgroundColor: "#ff0000",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  delText: {
    color: "white",
    fontFamily: "SpaceMono-Regular",
    fontSize: 14,
  },
});
