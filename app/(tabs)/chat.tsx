/**
 * ChatScreen.tsx
 *
 * A complete chat interface built with React Native.
 * Features:
 *  - Message list with date dividers
 *  - Replying to messages
 *  - Typing indicator animation
 *  - Emoji reactions on messages
 *  - Auto-scrolling to latest message
 *  - Simulated incoming messages
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
} from "react-native";
import { MessageBubble } from "./MessageBubble"; // Custom bubble for each chat message
import { ChatHeader } from "./ChatHeader";       // Custom header with back button + title
import MessageInput from "./MessageInput";       // Input field to type and send messages
import { useNavigation } from "expo-router/build/useNavigation";

/** --------------------
 *  Types & Data Models
 *  --------------------
 */
type Message = {
  id: string;
  text?: string;
  sender: "me" | "john"; // `me` = local user, `john` = other user
  timestamp: string;
  reactions?: string[];  // emoji reactions
  image?: string;        // optional image message
  replyTo?: {            // optional reply-to metadata
    id: string;
    text?: string;
    sender: "me" | "john";
  };
};

/**
 * Initial dummy data with date-separated messages.
 * Each message includes sender, timestamp, and text.
 */
const initialMessages: Message[] = [
  { id: "1", text: "Hey John, how are you?", sender: "me",   timestamp: "2025-08-18T09:30:00" },
  { id: "2", text: "I’m good! How about you?", sender: "john", timestamp: "2025-08-18T09:32:00" },
  { id: "3", text: "All good here 👍", sender: "me",         timestamp: "2025-08-18T09:33:00" },
  { id: "4", text: "Did you check the report?", sender: "john", timestamp: "2025-08-19T11:20:00" },
  { id: "5", text: "Yes, looks great!", sender: "me",        timestamp: "2025-08-19T11:25:00" },
];

/**
 * Helper: Converts Date → Readable String (e.g., "Mon, Aug 18")
 */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/** --------------------
 *  Main Chat Screen
 *  --------------------
 */
export default function ChatScreen() {
  const navigation = useNavigation();

  // ---------------- State ----------------
  const [messages, setMessages] = useState<Message[]>(initialMessages); // list of messages
  const [replyTo, setReplyTo] = useState<Message | null>(null);         // message being replied to
  const [isTyping, setIsTyping] = useState(false);                      // typing indicator state
  const flatListRef = useRef<FlatList>(null);                           // ref for scrolling

  /**
   * Adds an emoji reaction to a message.
   * @param id - message ID
   * @param emoji - emoji string
   */
  const addReaction = (id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, reactions: [...(m.reactions || []), emoji] } : m
      )
    );
  };

  /**
   * Handles sending a new message.
   * - Creates a new message
   * - Scrolls to bottom
   * - Simulates other user typing and sending reply
   */
  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: new Date().toISOString(),
      replyTo: replyTo
        ? { id: replyTo.id, text: replyTo.text, sender: replyTo.sender }
        : undefined,
    };

    // Append new message
    setMessages((prev) => [...prev, newMessage]);

    // Scroll to latest message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate the other user typing + replying
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

      // Scroll after reply
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2500);

    setReplyTo(null);
  };

  /**
   * Prepares messages with:
   * - Date dividers
   * - Typing indicator placeholder
   */
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

  // ---------------- UI ----------------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        {/* Chat Header with back button + user name */}
        <ChatHeader title="John Doe" onBack={() => navigation.goBack()} />

        {/* Messages list with date dividers and typing indicator */}
        <FlatList
          ref={flatListRef}
          data={renderWithDividers()}
          keyExtractor={(item) =>
            "id" in item ? item.id : Math.random().toString()
          }
          renderItem={({ item }) =>
            "type" in item ? (
              item.type === "divider" ? (
                <View style={styles.dividerWrapper}>
                  <Text style={styles.divider}>{item.date}</Text>
                </View>
              ) : item.type === "typing" ? (
                <TypingIndicator />
              ) : null
            ) : (
              <MessageBubble
                message={item}
                onReact={addReaction}
                onReply={() => setReplyTo(item)}
              />
            )
          }
          contentContainerStyle={{ padding: 10, paddingBottom: 60 }}
        />

        {/* Message input box with reply support */}
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
 * A "..." animated bubble showing when the other user is typing.
 */
export function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  /**
   * Animates a single dot up & down.
   */
  const animateDot = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: -4, duration: 300, delay, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  };

  // Start animations for all dots in staggered sequence
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

/** --------------------
 *  Styles
 *  --------------------
 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Date divider styles
  dividerWrapper: { alignItems: "center", marginVertical: 8 },
  divider: {
    backgroundColor: "#e0e0e0",
    color: "#444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },

  // Typing indicator bubble
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#fff", // white bubble like WhatsApp
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
});
