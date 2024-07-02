import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Notification = ({ message, timestamp, params }) => {
  return (
    <View style={styles.notification}>
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    maxWidth: 400,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  message: {
    marginVertical: 8,
    color: '#333',
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
  },
});

export default Notification;
