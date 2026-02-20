import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getChatChannels, getChannelMessages, sendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatScreen = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);
  const pollInterval = useRef(null);

  const fetchChannels = async () => {
    try {
      const data = await getChatChannels();
      setChannels(data.channels || []);
      if (data.channels?.length > 0 && !activeChannel) {
        const general = data.channels.find((c) => c.channel_id === 'general');
        setActiveChannel(general || data.channels[0]);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId) => {
    if (!channelId) return;
    try {
      const data = await getChannelMessages(channelId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.channel_id);
      // Poll for new messages every 5 seconds
      pollInterval.current = setInterval(() => {
        fetchMessages(activeChannel.channel_id);
      }, 5000);
    }
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [activeChannel]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChannel || sending) return;

    setSending(true);
    try {
      await sendMessage(activeChannel.channel_id, newMessage);
      setNewMessage('');
      fetchMessages(activeChannel.channel_id);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }) => {
    const isOwnMessage = item.sender_id === user?.user_id;
    const showAvatar = index === 0 || messages[index - 1]?.sender_id !== item.sender_id;

    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
        {!isOwnMessage && showAvatar && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.sender_name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
        )}
        {!isOwnMessage && !showAvatar && <View style={styles.avatarPlaceholder} />}
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          {!isOwnMessage && showAvatar && (
            <Text style={styles.senderName}>{item.sender_name}</Text>
          )}
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, isOwnMessage && styles.ownMessageTime]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A100FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Channel Selector */}
      <View style={styles.channelSelector}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={channels}
          keyExtractor={(item) => item.channel_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.channelTab,
                activeChannel?.channel_id === item.channel_id && styles.activeChannelTab,
              ]}
              onPress={() => setActiveChannel(item)}
            >
              <Ionicons
                name={item.channel_type === 'general' ? 'chatbubbles' : 'person'}
                size={16}
                color={activeChannel?.channel_id === item.channel_id ? '#A100FF' : '#666'}
              />
              <Text
                style={[
                  styles.channelTabText,
                  activeChannel?.channel_id === item.channel_id && styles.activeChannelTabText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.message_id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={`Message #${activeChannel?.name || 'general'}`}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelSelector: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  channelTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeChannelTab: {
    backgroundColor: '#F3E8FF',
  },
  channelTabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeChannelTabText: {
    color: '#A100FF',
  },
  messagesList: {
    padding: 12,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A100FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 44,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    maxWidth: '75%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  ownMessageBubble: {
    backgroundColor: '#A100FF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A100FF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#A100FF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatScreen;
