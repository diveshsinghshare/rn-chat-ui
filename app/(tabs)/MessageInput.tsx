import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import type { Message } from "./Message";

type Props = {
  onSend: (text: string) => void;
  replyTo?: Message | null;
  onCancelReply: () => void;
};

type State = {
  text: string;
};

export default class MessageInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  handleSend = () => {
    const { text } = this.state;
    const { onSend } = this.props;
    if (text.trim()) {
      onSend(text);
      this.setState({ text: "" });
    }
  };

  render() {
    const { replyTo, onCancelReply } = this.props;
    const { text } = this.state;

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
          onChangeText={(t) => this.setState({ text: t })}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={this.handleSend} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", padding: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
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
