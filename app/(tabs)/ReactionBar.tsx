import React from "react";
import { View, Text, StyleSheet } from "react-native";

const emojis = ["👍", "❤️", "😂", "😮", "😢"];

export default function ReactionBar() {
  return (
    <View style={styles.container}>
      {emojis.map((emoji) => (
        <Text key={emoji} style={styles.emoji}>
          {emoji}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginVertical: 4 },
  emoji: { fontSize: 20, marginHorizontal: 4 },
});
