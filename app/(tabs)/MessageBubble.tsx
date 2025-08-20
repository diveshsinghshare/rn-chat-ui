/**
 * MessageBubble.tsx
 *
 * A single chat bubble component that supports:
 *  - Text, images, and timestamps
 *  - Inline reply previews
 *  - Long-press action menu (Reply / React)
 *  - Emoji reaction picker
 *
 * Props:
 *  - message: Message object to render
 *  - onReact: callback(id, emoji) → handles emoji reactions
 *  - onReply: callback(message) → sets reply context
 */

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
  onReply: (msg: Message) => void;
};

/** ✅ format timestamp without external libs */
function formatTime(date: string | number | Date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** --------------------
 *  MessageBubble Component
 *  --------------------
 */
export function MessageBubble({ message, onReact, onReply }: Props) {
  const [showActions, setShowActions] = useState(false); // long-press menu
  const [showPicker, setShowPicker] = useState(false);   // emoji picker modal

  const isMe = message.sender === "me";
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

  return (
    <>
      {/* --- Chat bubble wrapper --- */}
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => setShowActions(true)} // open actions menu
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

          {/* Text message */}
          {!!message.text && (
            <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
              {message.text}
            </Text>
          )}

          {/* Image message */}
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

      {/* --- Long-press Action Menu --- */}
      <Modal visible={showActions} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.menu}>
            {/* Reply option */}
            <TouchableOpacity
              onPress={() => {
                setShowActions(false);
                onReply(message);
              }}
            >
              <Text style={styles.menuItem}>↩️ Reply</Text>
            </TouchableOpacity>

            {/* React option */}
            <TouchableOpacity
              onPress={() => {
                setShowActions(false);
                setShowPicker(true);
              }}
            >
              <Text style={styles.menuItem}>😊 React</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- Emoji Picker Modal --- */}
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

/** --------------------
 *  Styles
 *  --------------------
 */
const styles = StyleSheet.create({
  // Position wrapper (left/right aligned)
  wrapper: {
    width: "100%",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  wrapperMe: { alignItems: "flex-end" },
  wrapperOther: { alignItems: "flex-start" },

  // Bubble styling
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: "#DCF8C6", // WhatsApp green tint
    borderTopRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },

  // Message text
  text: { fontSize: 16, lineHeight: 22 },
  textMe: { color: "#000" },
  textOther: { color: "#000" },

  // Image content
  image: { width: 200, height: 200, borderRadius: 12, marginTop: 6 },

  // Timestamp
  timestamp: {
    fontSize: 10,
    color: "#888",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  // Reactions bubble
  reactions: { flexDirection: "row", marginTop: 6 },
  reactionsMe: { alignSelf: "flex-end" },
  reactionsOther: { alignSelf: "flex-start" },
  reaction: { fontSize: 16, marginRight: 4 },

  // Overlays
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Long-press menu
  menu: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  menuItem: { fontSize: 18, marginVertical: 8 },

  // Emoji picker
  picker: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  pickerEmoji: { fontSize: 28, marginHorizontal: 6 },

  // Reply preview
  replyBox: {
    borderLeftWidth: 3,
    borderLeftColor: "#aaa",
    paddingLeft: 6,
    marginBottom: 4,
  },
  replySender: { fontSize: 12, fontWeight: "600", color: "#333" },
  replyText: { fontSize: 12, color: "#555" },
});
