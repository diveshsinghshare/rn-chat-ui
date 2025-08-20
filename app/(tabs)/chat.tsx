import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Animated, KeyboardAvoidingView, Platform } from "react-native";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useNavigation } from "expo-router/build/useNavigation";

type Message = {
  id: string;
  text?: string;
  sender: "me" | "john";
  timestamp: string;
  reactions?: string[];
  image?: string;
  replyTo?: { id: string; text?: string; sender: "me" | "john" };
};

// Dummy data with dates
const initialMessages: Message[] = [
  { id: "1", text: "Hey John, how are you?", sender: "me", timestamp: "2025-08-18T09:30:00" },
  { id: "2", text: "I’m good! How about you?", sender: "john", timestamp: "2025-08-18T09:32:00" },
  { id: "3", text: "All good here 👍", sender: "me", timestamp: "2025-08-18T09:33:00" },
  { id: "4", text: "Did you check the report?", sender: "john", timestamp: "2025-08-19T11:20:00" },
  { id: "5", text: "Yes, looks great!", sender: "me", timestamp: "2025-08-19T11:25:00" },
];

// Helper to format date dividers
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export default function ChatScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const addReaction = (id: string, emoji: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, reactions: [...(m.reactions || []), emoji] } : m));
  };

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

    setMessages((prev) => [...prev, newMessage]);

    // scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate Gale typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const reply: Message = {
        id: Date.now().toString(),
        text: "This is Gale’s reply 😊",
        sender: "john", // gale
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, reply]);

      // scroll to bottom after reply
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2500);

    setReplyTo(null);
  };

  // insert dividers + typing
  const renderWithDividers = () => {
    const items: (Message | { type: "divider" | "typing"; date?: string; id: string })[] =
      [];
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
        <ChatHeader
          title="John Doe"
          onBack={() => navigation.goBack()}
        />

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

        <MessageInput
          onSend={handleSend}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}


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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  dividerWrapper: { alignItems: "center", marginVertical: 8 },
  typingWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#fff",      // white bubble like WhatsApp
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
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#555", marginHorizontal: 2 },
  divider: {
    backgroundColor: "#e0e0e0",
    color: "#444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  textInputScroll: {
    flex: 1,
    maxHeight: 100, // 👈 ~4 lines of text
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    textAlignVertical: "top", // ensures proper alignment
  },
});
