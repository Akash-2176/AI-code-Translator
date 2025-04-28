// src/components/ChatMessage.js
import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'system-message'}`}>
      <div className="message-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
