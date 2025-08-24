import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Share,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import type { Message } from "./Message";

type Props = {
  message: Message;
  onReact: (id: string, emoji: string) => void;
  onReply: (msg: Message) => void;
  onDelete?: (id: string) => void;
};

function formatTime(date: string | number | Date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({ message, onReact, onReply, onDelete }: Props) {
  const [showActions, setShowActions] = useState(false);
  const [pressedEmoji, setPressedEmoji] = useState<string | null>(null);

  const isMe = message.sender === "me";
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

  return (
    <>
      {/* Chat Bubble */}
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => {
          if (!isMe) setShowActions(true);
        }}
        style={[styles.wrapper, isMe ? styles.wrapperMe : styles.wrapperOther]}
      >
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
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

          {!!message.text && (
            <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
              {message.text}
            </Text>
          )}

          {!!message.image && (
            <Image source={{ uri: message.image }} style={styles.image} />
          )}

          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>

          {message.reactions?.length ? (
            <View style={[styles.reactions, isMe ? styles.reactionsMe : styles.reactionsOther]}>
              {message.reactions.map((r, i) => (
                <Text key={i} style={styles.reaction}>
                  {r}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Long Press Menu Modal */}
      <Modal visible={showActions} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowActions(false)}>
          <View style={styles.overlay}>
            <View style={styles.actionContainer}>
              {/* Emoji Bar */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: 8 }}
              >
                {emojis.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={{ padding: 4 }}
                    onPressIn={() => setPressedEmoji(e)}
                    onPressOut={() => {
                      onReact(message.id, e);
                      setPressedEmoji(null);
                      setShowActions(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerEmoji,
                        pressedEmoji === e && styles.pickerEmojiActive,
                      ]}
                    >
                      {e}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Message Preview */}
              <View style={styles.bubblePreview}>
                <Text style={styles.textOther}>{message.text}</Text>
                <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.menu}>
                <TouchableOpacity
                  onPress={() => {
                    setShowActions(false);
                    onReply(message);
                  }}
                >
                  <Text style={styles.menuItem}>↩️ Reply</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setStringAsync(message.text);
                    setShowActions(false);
                  }}
                >
                  <Text style={styles.menuItem}>📋 Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await Share.share({ message: message.text });
                    setShowActions(false);
                  }}
                >
                  <Text style={styles.menuItem}>📤 Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (onDelete) onDelete(message.id);
                    setShowActions(false);
                  }}
                >
                  <Text style={[styles.menuItem, { color: "red" }]}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

/** --------------------
 *  Styles
 *  --------------------
 */
const styles = StyleSheet.create({
  // Layout
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
    backgroundColor: "#008B9C",
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

  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 6,
  },

  timestamp: {
    fontSize: 10,
    color: "#fff",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  timestampOther: {
    fontSize: 10,
    color: "#fff",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  reactions: {
    flexDirection: "row",
    marginTop: 6,
  },
  reactionsMe: { alignSelf: "flex-end" },
  reactionsOther: { alignSelf: "flex-start" },
  reaction: {
    fontSize: 16,
    marginRight: 4,
  },

  replyBox: {
    borderLeftWidth: 3,
    borderLeftColor: "#aaa",
    paddingLeft: 6,
    marginBottom: 4,
  },
  replySender: { fontSize: 12, fontWeight: "600", color: "#333" },
  replyText: { fontSize: 12, color: "#555" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  actionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "85%",
    overflow: "hidden",
    elevation: 5,
    marginTop: 150,
  },

  bubblePreview: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    marginVertical: 0,
  },

  menu: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  menuItem: {
    fontSize: 16,
    marginVertical: 6,
  },

  pickerEmoji: {
    fontSize: 22,
    marginHorizontal: 4,
  },
  pickerEmojiActive: {
    fontSize: 28,
    transform: [{ scale: 1.2 }],
  },
});
