/**
 * ChatInput.tsx
 *
 * A dynamic chat input bar for typing and sending messages.
 * Features:
 *  - Expanding text input (auto-grows up to 4 lines)
 *  - Smooth animations on height changes (via LayoutAnimation)
 *  - Keyboard-aware UI (adjusts on iOS/Android)
 *  - Send button with WhatsApp-style green background
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
} from "react-native";

/**
 * Enable LayoutAnimation for Android
 * (it’s already enabled on iOS by default).
 */
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** --------------------
 *  ChatInput Component
 *  --------------------
 */
export default function ChatInput() {
  const [text, setText] = useState("");            // message text
  const [inputHeight, setInputHeight] = useState(40); // dynamic input height (1 line default)

  /**
   * Handles sending a message.
   * - Logs message (replace with actual send logic)
   * - Clears input field
   * - Resets height back to single line
   */
  const handleSend = () => {
    if (text.trim()) {
      console.log("Message sent:", text);
      setText("");
      setInputHeight(40);
    }
  };

  /**
   * Expands/shrinks text input as user types.
   * - Uses LayoutAnimation for smooth animation
   * - Caps height at ~4 lines (100px)
   */
  const onContentSizeChange = (event: any) => {
    LayoutAnimation.easeInEaseOut();
    const newHeight = Math.min(event.nativeEvent.contentSize.height, 100);
    setInputHeight(newHeight);
  };

  // ---------------- UI ----------------
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Expandable Text Input */}
        <TextInput
          style={[styles.input, { height: inputHeight }]}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          multiline
          textAlignVertical="top"     // aligns text correctly for multiline
          blurOnSubmit={false}
          returnKeyType="default"     // Enter inserts newline
          enablesReturnKeyAutomatically
          onContentSizeChange={onContentSizeChange}
        />

        {/* Send Button */}
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/** --------------------
 *  Styles
 *  --------------------
 */
const styles = StyleSheet.create({
  // Root container (row layout: input + send button)
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  // Expandable text input box
  input: {
    flex: 1,
    minHeight: 40,   // single line
    maxHeight: 100,  // 4 lines
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 20,
  },

  // Circular green send button
  sendBtn: {
    backgroundColor: "#25D366", // WhatsApp green
    borderRadius: 20,
    padding: 12,
    marginLeft: 8,
  },

  // Send button text (➤)
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
