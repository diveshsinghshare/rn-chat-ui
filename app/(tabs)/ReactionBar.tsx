import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const emojis = ["👍", "❤️", "😂", "😮", "😢"];

type Props = {
  onReact?: (emoji: string) => void;
};

export default function ReactionBar({ onReact }: Props) {
  return (
    <View style={styles.container}>
      {emojis.map((emoji) => (
        <TouchableOpacity key={emoji} onPress={() => onReact?.(emoji)}>
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginVertical: 4 },
  emoji: { fontSize: 20, marginHorizontal: 4 },
});
