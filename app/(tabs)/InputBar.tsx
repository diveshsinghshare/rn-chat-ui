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

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ChatInput() {
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(40); // initial height (1 line)

  const handleSend = () => {
    if (text.trim()) {
      console.log("Message sent:", text);
      setText("");
      setInputHeight(40); // reset to single line
    }
  };

  const onContentSizeChange = (event: any) => {
    LayoutAnimation.easeInEaseOut(); // smooth grow/shrink
    const newHeight = Math.min(event.nativeEvent.contentSize.height, 100); // max ~4 lines
    setInputHeight(newHeight);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <TextInput
          style={[styles.input, { height: inputHeight }]}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          multiline
          textAlignVertical="top"
          blurOnSubmit={false}
          returnKeyType="default" // keeps Enter as newline
          enablesReturnKeyAutomatically
          onContentSizeChange={onContentSizeChange}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 40,   // 1 line
    maxHeight: 100,  // 4 lines
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  sendBtn: {
    backgroundColor: "#25D366",
    borderRadius: 20,
    padding: 12,
    marginLeft: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
