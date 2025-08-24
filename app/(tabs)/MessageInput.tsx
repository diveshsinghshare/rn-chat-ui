import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  LayoutAnimation,
  UIManager,
  Keyboard,
} from "react-native";
import type { Message } from "./Message";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SEND_ICON = require("../../assets/send-arrow.png");

type Props = {
  onSend: (text: string) => void;
  replyTo?: Message | null;
  onCancelReply: () => void;
};

const FONT_SIZE = 15;
const LINE_HEIGHT = 18;
const VERT_PAD = 4; // reduced padding for smaller height
const MAX_LINES = 5;
const MIN_INPUT_HEIGHT = LINE_HEIGHT + VERT_PAD * 2; // smaller min height
const MAX_INPUT_HEIGHT = LINE_HEIGHT * MAX_LINES + VERT_PAD * 2;

export default function MessageInput({ onSend, replyTo, onCancelReply }: Props) {
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const showSend = keyboardVisible && !!text.trim();

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
      setInputHeight(MIN_INPUT_HEIGHT);
    }
  };

  const handleSizeChange = (e: any) => {
    const contentH = e.nativeEvent.contentSize.height;
    const nextH = Math.min(MAX_INPUT_HEIGHT, Math.max(MIN_INPUT_HEIGHT, contentH + VERT_PAD * 2));
    if (nextH !== inputHeight) {
      LayoutAnimation.easeInEaseOut();
      setInputHeight(nextH);
    }
  };

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, [showSend]);

  return (
    <View style={styles.bar}>
      {replyTo && (
        <View style={styles.replyPreview}>
          <Text style={styles.replyLabel} numberOfLines={1}>
            Replying to: {replyTo.text}
          </Text>
          <TouchableOpacity onPress={onCancelReply} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.cancelReply}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.row}>
        <TextInput
          style={[
            styles.input,
            { height: inputHeight },
            !showSend && styles.inputFullWidth, // full width when send button hidden
          ]}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          placeholderTextColor="#888"
          multiline
          maxLength={500}
          onContentSizeChange={handleSizeChange}
        />

        {showSend && (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Image source={SEND_ICON} style={styles.sendIcon} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.footerNote}>
        AI can make mistakes. Please check all important information.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: 10,
    backgroundColor: "#008B9C",
    borderTopWidth: 1,
    borderTopColor: "#E6EBF1",
  },
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7EEF4",
    borderLeftWidth: 3,
    borderLeftColor: "#008B9C",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  replyLabel: { flex: 1, fontSize: 12, color: "#334155" },
  cancelReply: { fontSize: 14, paddingLeft: 8, color: "#64748B" },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: VERT_PAD,
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: "#000",
  },
  inputFullWidth: {
    flex: 1,
    marginRight: 0,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#004F54", // dark teal circular button
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain", // no tint
  },
  
  footerNote: {
    marginTop: 4,
    fontSize: 11,
    color: "#fff",
    textAlign: "center",
  },
});
