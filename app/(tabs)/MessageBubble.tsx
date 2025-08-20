import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import type { Message } from "./Message";

type Props = {
  message: Message;
  onReact: (id: string, emoji: string) => void;
  onReply: (msg: Message) => void; // 👈 for replying
};

// ✅ format timestamp without date-fns
function formatTime(date: string | number | Date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message, onReact, onReply }: Props) {
  const [showActions, setShowActions] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const isMe = message.sender === "me";
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => setShowActions(true)} // 👈 open actions menu
        style={[styles.wrapper, isMe ? styles.wrapperMe : styles.wrapperOther]}
      >
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          
          {/* Reply preview */}
          {message.replyTo && (
            <View style={styles.replyBox}>
              <Text style={styles.replySender}>
                {message.replyTo.sender === "me" ? "You" : "John Doe"}
              </Text>
              <Text style={styles.replyText} numberOfLines={1}>
                {message.replyTo.text}
              </Text>
            </View>
          )}

          {/* Text */}
          {!!message.text && (
            <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
              {message.text}
            </Text>
          )}

          {/* Image */}
          {!!message.image && (
            <Image source={{ uri: message.image }} style={styles.image} />
          )}

          {/* Timestamp */}
          <Text style={styles.timestamp}>
            {formatTime(message.timestamp)}
          </Text>

          {/* Reactions */}
          {message.reactions?.length ? (
            <View
              style={[
                styles.reactions,
                isMe ? styles.reactionsMe : styles.reactionsOther,
              ]}
            >
              {message.reactions.map((r, i) => (
                <Text key={i} style={styles.reaction}>
                  {r}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* --- Action menu --- */}
      <Modal visible={showActions} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => {
                setShowActions(false);
                onReply(message); // 👈 pass whole msg
              }}
            >
              <Text style={styles.menuItem}>↩️ Reply</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowActions(false);
                setShowPicker(true); // 👈 open emoji picker
              }}
            >
              <Text style={styles.menuItem}>😊 React</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- Emoji Picker --- */}
      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.picker}>
            {emojis.map((e) => (
              <TouchableOpacity
                key={e}
                onPress={() => {
                  onReact(message.id, e);
                  setShowPicker(false);
                }}
              >
                <Text style={styles.pickerEmoji}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  wrapperMe: { alignItems: "flex-end" },
  wrapperOther: { alignItems: "flex-start" },

  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: "#DCF8C6",
    borderTopRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },

  text: { fontSize: 16, lineHeight: 22 },
  textMe: { color: "#000" },
  textOther: { color: "#000" },

  image: { width: 200, height: 200, borderRadius: 12, marginTop: 6 },

  timestamp: {
    fontSize: 10,
    color: "#888",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  reactions: {
    flexDirection: "row",
    marginTop: 6,
  },
  reactionsMe: { alignSelf: "flex-end" },
  reactionsOther: { alignSelf: "flex-start" },
  reaction: { fontSize: 16, marginRight: 4 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  menuItem: { fontSize: 18, marginVertical: 8 },

  picker: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  pickerEmoji: { fontSize: 28, marginHorizontal: 6 },

  replyBox: {
    borderLeftWidth: 3,
    borderLeftColor: "#aaa",
    paddingLeft: 6,
    marginBottom: 4,
  },
  replySender: { fontSize: 12, fontWeight: "600", color: "#333" },
  replyText: { fontSize: 12, color: "#555" },
});
