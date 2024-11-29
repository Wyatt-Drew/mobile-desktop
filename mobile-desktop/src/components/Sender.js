import React, { useState, useEffect } from "react";

const Sender = () => {
  const [sessionId, setSessionId] = useState("");
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Disconnected");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Generate a session ID on mount
    fetch("https://mobile-backend-74th.onrender.com/generate-session")
      .then((response) => response.json())
      .then((data) => {
        setSessionId(data.sessionId);
      })
      .catch((err) => console.error("Error generating session:", err));
  }, []);

  const connect = () => {
    const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");
    socket.onopen = () => {
      setWs(socket);
      setStatus("Connected to session.");
      // Register as a sender
      socket.send(
        JSON.stringify({
          type: "register",
          sessionId,
        })
      );
    };
    socket.onmessage = (event) => {
      const { sender, message } = JSON.parse(event.data);
      setMessages((prev) => [...prev, `${sender}: ${message}`]);
    };
    socket.onclose = () => setStatus("Disconnected");
    socket.onerror = (err) => console.error("WebSocket error:", err);
  };

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "message",
          sessionId,
          sender: "Sender",
          message: inputMessage,
        })
      );
      setMessages((prev) => [...prev, `Self: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  return (
    <div className="sender">
      <h2>Sender</h2>
      <p>Session ID: {sessionId}</p>
      <button onClick={connect}>Connect</button>
      <p>Status: {status}</p>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Enter a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default Sender;
