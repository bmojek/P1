import { StyleSheet, Button, FlatList } from "react-native";

import { Text, View } from "@/components/Themed";
import { useApi } from "@/contexts/apiContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  const { getUserList, users } = useApi();
  const handleGetUserList = () => {
    getUserList();
  };
  return (
    <SafeAreaView>
      <Button title="Get User List" onPress={handleGetUserList} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.id} {item.username} {item.password}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
