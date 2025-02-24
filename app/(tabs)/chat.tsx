import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '@/hooks/useChat';
import { format } from 'date-fns';

export default function Chat() {
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const { messages, doctors, loading, error, sendMessage } = useChat();

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sent_by === user?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>
          {format(new Date(item.created_at), 'HH:mm')}
        </Text>
      </View>
    );
  };

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {loading ? (
        <Text style={styles.message}>Loading messages...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}>
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  ownMessage: {
    backgroundColor: '#0ea5e9',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0ea5e9',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 16,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
  },
});