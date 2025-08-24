/**
 * ChatScreen.tsx
 *
 * Extended: Includes "first-time quick options" screen before normal chat.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { ChatHeader } from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useNavigation } from "expo-router/build/useNavigation";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";
// ✅ using your already-declared Message type
import type { Message } from "./Message";
import { MessageBubble } from "./MessageBubble";

/** --------------------
 *  Dummy Initial Messages
 *  --------------------
 */


const handleCopy = async (text: string) => {
  await Clipboard.setStringAsync(text);
  Alert.alert("Copied", "Message copied to clipboard");
};
const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hey John, how are you?",
    sender: "me",
    timestamp: "2025-08-18T09:30:00",
  },
  {
    id: "2",
    text: "I’m good! How about you?",
    sender: "john",
    timestamp: "2025-08-18T09:32:00",
  },
];

const quickOptions = [
  "Quick solutions for a problem",
  "A solid venting session!",
  "Help brainstorming a strategy",
  "More information about PDA",
  "To share a win!",
];

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/** --------------------
 *  Main Chat Screen
 *  --------------------
 */
export default function ChatScreen() {
  const navigation = useNavigation();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickOptions, setShowQuickOptions] = useState(true); // 👈 first-time options
  const flatListRef = useRef<FlatList>(null);

  const addReaction = (id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, reactions: [...(m.reactions || []), emoji] } : m
      )
    );
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setShowQuickOptions(false); // hide quick options after first send

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: new Date().toISOString(),
      replyTo: replyTo
        ? { id: replyTo.id, text: replyTo.text, sender: replyTo.sender }
        : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate "john" typing and replying
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: Date.now().toString(),
        text: "This is Gale’s reply 😊",
        sender: "john",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 2500);

    setReplyTo(null);
  };

  const handleQuickOption = (option: string) => {
    handleSend(option);
  };

  const renderWithDividers = () => {
    const items: (Message | { type: "divider" | "typing"; date?: string; id: string })[] = [];
    let lastDate = "";

    messages.forEach((msg) => {
      const date = formatDate(new Date(msg.timestamp));
      if (date !== lastDate) {
        items.push({ type: "divider", date, id: "d-" + msg.id });
        lastDate = date;
      }
      items.push(msg);
    });

    if (isTyping) items.push({ type: "typing", id: "typing" });

    return items;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <ChatHeader title="Gale" isTyping= {isTyping} onBack={() => navigation.goBack()} />
     
        <FlatList
          ref={flatListRef}
          data={[
            ...renderWithDividers(),
            ...(showQuickOptions
              ? [
                  {
                    type: "quickOptions",
                    id: "quick-options-block",
                  },
                ]
              : []),
          ]}
          keyExtractor={(item) =>
            "id" in item ? item.id : Math.random().toString()
          }
          renderItem={({ item }) => {
            if ("type" in item) {
              if (item.type === "divider") {
                return (
                  <View style={styles.dividerWrapper}>
                    <Text style={styles.divider}>{item.date}</Text>
                  </View>
                );
              }
              if (item.type === "typing") {
                if (!isTyping) setIsTyping(true);
                return <TypingIndicator />;
              }
              if (item.type === "quickOptions") {
                return (
                  <View style={styles.quickContainer}>
                    <Text style={styles.dateText}>Wed, 20 Nov</Text>
                    <Text style={styles.promptText}>
                      What would be most helpful for you today?
                    </Text>
                    {quickOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.optionButton}
                        onPress={() => handleQuickOption(option)}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              }
            }
  
            // Normal chat bubble
            return (
              <MessageBubble
                message={item}
                 onReact={addReaction}
                 onReply={() => setReplyTo(item)}
              />
            );
          }}
          contentContainerStyle={{ padding: 10, paddingBottom: 60,backgroundColor: "#D7D5CE"
          }}
        />
  
        <MessageInput
          onSend={handleSend}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </View>
    </KeyboardAvoidingView>
  );
  
}

/** --------------------
 *  Typing Indicator
 *  --------------------
 */
export function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: -4, duration: 300, delay, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={styles.typingBubble}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor: "#D7D5CE"
  },

  dividerWrapper: { alignItems: "center", marginVertical: 8 },
  divider: {
    backgroundColor: "#e0e0e0",
    color: "#444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },

  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: "25%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    marginHorizontal: 2,
  },

  // 👇 styles for quick options
  quickContainer: { padding: 16, alignItems: "center" },
  dateText: { fontSize: 14, marginBottom: 8, color: "#555", fontWeight: "600" },
  promptText: { fontSize: 16, marginBottom: 16, textAlign: "center" },
  optionButton: {
    backgroundColor: "#E8E2D9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 6,
    width: "100%",
  },
  optionText: { fontSize: 15, textAlign: "center" },
});
