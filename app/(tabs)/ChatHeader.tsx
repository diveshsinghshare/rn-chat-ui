/**
 * ChatHeader.tsx
 *
 * A reusable header component for the chat screen.
 * Features:
 *  - Back navigation button
 *  - User avatar (with placeholder if no image is provided)
 *  - Display of chat partner’s name
 *  - Live status indicator (e.g., "online" or "Typing...")
 */

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/** --------------------
 *  Props Definition
 *  --------------------
 */
type Props = {
  /** The title to show, typically the chat partner’s name */
  title: string;

  /** Optional profile image (URI). If missing, a placeholder icon is shown */
  profileUri?: string;

  /** Shows typing indicator if true; otherwise shows "online" */
  isTyping?: boolean;

  /** Callback for when back button is pressed */
  onBack?: () => void;
};

/** --------------------
 *  ChatHeader Component
 *  --------------------
 */
export function ChatHeader({ title, profileUri, isTyping, onBack }: Props) {
  return (
    <View style={styles.header}>
      {/* Back Button (navigates to previous screen) */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* User Avatar */}
      {profileUri ? (
        <Image source={{ uri: profileUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={28} color="#555" />
        </View>
      )}

      {/* User Name + Status (typing / online) */}
      <View style={{ marginLeft: 8 }}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.status}>{isTyping ? "Typing..." : "online"}</Text>
      </View>
    </View>
  );
}

/** --------------------
 *  Styles
 *  --------------------
 */
const styles = StyleSheet.create({
  // Root header container
  header: {
    flexDirection: "row",          // align items horizontally
    alignItems: "center",          // vertical alignment
    padding: 12,
    borderBottomWidth: 1,          // subtle bottom divider
    borderBottomColor: "#eee",
    backgroundColor: "#fff",       // clean white background
  },

  // Back arrow button
  backButton: {
    marginRight: 12,
  },

  // Profile avatar (if image provided)
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,              // circular avatar
  },

  // Placeholder avatar (if no image provided)
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  // Chat partner’s name
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Status text (online / typing)
  status: {
    fontSize: 12,
    color: "gray",
  },
});
