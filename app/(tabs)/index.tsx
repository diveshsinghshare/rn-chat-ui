/**
 * HomeScreen.tsx
 *
 * The landing screen of the app.
 * Features:
 *  - Displays a welcome message
 *  - Simple navigation entry point to the Chat screen
 *  - Clean and centered layout
 */

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

/** --------------------
 *  HomeScreen Component
 *  --------------------
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>👋 Welcome to RN Chat UI</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>This is your Home screen</Text>

      {/* Navigation link to Chat screen */}
      <Link href="/chat" asChild>
        <TouchableOpacity>
          <Text style={styles.linkText}>Go to Chat</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

/** --------------------
 *  Styles
 *  --------------------
 */
const styles = StyleSheet.create({
  // Root container: centers all content
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // light gray background
  },

  // Main title
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Subtitle text below title
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
  },

  // "Go to Chat" link text
  linkText: {
    fontSize: 16,
    color: "#007AFF", // iOS-style blue link
    fontWeight: "600",
  },
});
