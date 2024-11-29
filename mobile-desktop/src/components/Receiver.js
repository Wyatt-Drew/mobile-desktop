import React, { useState, useEffect } from "react";

const Receiver = () => {
  const [sessionId, setSessionId] = useState("");
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Awaiting connection...");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");
    socket.onopen = () => {
      setWs(socket);
      setStatus("Connected to session.");
      // Register as a receiver
      socket.send(
        JSON.stringify({
          type: "register",
          sessionId, // Assume the user provides a session ID
        })
      );
    };
    socket.onmessage = (event) => {
      const { sender, message } = JSON.parse(event.data);
      setMessages((prev) => [...prev, `${sender}: ${message}`]);
    };
    socket.onclose = () => setStatus("Disconnected");
    socket.onerror = (err) => console.error("WebSocket error:", err);

    return () => socket.close(); // Clean up on unmount
  }, [sessionId]);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "message",
          sessionId,
          sender: "Receiver",
          message: inputMessage,
        })
      );
      setMessages((prev) => [...prev, `Self: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  return (
    <div className="receiver">
      <h2>Receiver</h2>
      <input
        type="text"
        placeholder="Enter Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
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

export default Receiver;
