import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome to RN Chat UI</Text>
      <Text style={styles.subtitle}>This is your Home screen</Text>

      {/* Navigate to Chat screen */}
      <Link href="/chat" asChild>
  <TouchableOpacity>
    <Text>Go to Chat</Text>
  </TouchableOpacity>
</Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
  },
});
