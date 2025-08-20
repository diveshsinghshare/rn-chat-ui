import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import type { Message } from "./Message";

type Props = {
  onSend: (text: string) => void;
  replyTo?: Message | null;
  onCancelReply: () => void;
};

export default function MessageInput({ onSend, replyTo, onCancelReply }: Props) {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      {replyTo && (
        <View style={styles.replyPreview}>
          <Text style={styles.replyLabel}>Replying to: {replyTo.text}</Text>
          <TouchableOpacity onPress={onCancelReply}>
            <Text style={styles.cancelReply}>❌</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
      />
      <Button
        title="Send"
        onPress={() => {
          onSend(text);
          setText("");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", padding: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8, marginRight: 8 },
  replyPreview: {
    position: "absolute",
    top: -40,
    left: 10,
    right: 10,
    backgroundColor: "#f0f0f0",
    padding: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  replyLabel: { fontSize: 12, color: "#333" },
  cancelReply: { fontSize: 14, marginLeft: 10 },
});
