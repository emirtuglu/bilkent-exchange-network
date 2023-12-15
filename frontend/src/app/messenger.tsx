import React, { useState } from "react";
import axios from "axios";
import ChatItem from "./chatItem"; // Import the ChatItem component
import "../message.css"; // Link to your CSS file

interface Message {
  content: string;
  sender: string;
  timestamp: string;
}

interface MessengerProps {
  onMessageLinkClick?: () => void;
}

const MessengerPage: React.FC<MessengerProps> = (props: MessengerProps) => {
  const [user, setUser] = useState("John Doe");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const newMessageObj = {
        content: newMessage,
        sender: user,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages([...messages, newMessageObj]);
      setNewMessage("");

      // Assuming you have an API endpoint to send messages
      try {
        await axios.post(`/messages/${selectedChat}`, newMessageObj);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSelectChat = async (chatTitle: string) => {
    setSelectedChat(chatTitle);

    try {
      // Fetch chat messages for the selected chat
      const response = await axios.get(`/messages/${chatTitle}`);
      const chatMessages = response.data.messages; // Adjust based on your API response structure

      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleClose = () => {
    if (props.onMessageLinkClick) {
      props.onMessageLinkClick();
    }
  };

  return (
    <div className="messengerContainer">
      <div className="messengerCloseButton" onClick={handleClose}>
        {"❯"}
      </div>
      <div className="welcomeText">
        <h1>Messages</h1>
      </div>

      <div className="chatsContainer">
        <div className="chatList">
          <h2 className="chatListHeader">My Chats</h2>
          {/* Use the ChatItem component for each chat in the list */}
          <ChatItem
            chatTitle="Chat 1"
            onSelectChat={handleSelectChat}
            isActive={selectedChat === "Chat 1"}
          />
          <ChatItem
            chatTitle="Chat 2"
            onSelectChat={handleSelectChat}
            isActive={selectedChat === "Chat 2"}
          />
          <ChatItem
            chatTitle="Chat 3"
            onSelectChat={handleSelectChat}
            isActive={selectedChat === "Chat 3"}
          />
        </div>

        <div className="chatBox">
          <div className="selectedChat">
            <h2 className="selectedChatHeader">
              {selectedChat
                ? `Selected Chat: ${selectedChat}`
                : "No Chat Selected"}
            </h2>
            <div className="chatMessagesContainer">
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <strong>{message.sender}</strong> ({message.timestamp}):{" "}
                  {message.content}
                </div>
              ))}
            </div>

            <div className="inputContainer">
              <input
                type="text"
                placeholder="Type your message..."
                className="messageInput"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="sendButton" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessengerPage;
