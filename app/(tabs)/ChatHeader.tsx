import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  profileUri?: string;
  isTyping?: boolean;
  onBack?: () => void;
};

export function ChatHeader({ title, profileUri, isTyping, onBack }: Props) {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Avatar with green dot */}
      <View style={styles.avatarWrapper}>
        {profileUri ? (
          <Image source={{ uri: profileUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={28} color="#555" />
          </View>
        )}
        <View style={styles.onlineDot} />
      </View>

      {/* Name + Status */}
      <View style={styles.info}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.status}>
          {isTyping ? "Typing..." : "Online"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#0E516D", // ✅ dark teal background
  },
  backButton: {
    marginRight: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "#0d3b66", // match header bg
  },
  info: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  status: {
    fontSize: 12,
    color: "#d3d3d3",
  },
});
