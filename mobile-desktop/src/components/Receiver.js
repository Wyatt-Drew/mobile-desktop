import React, { useState, useEffect } from "react";

const Receiver = () => {
  const [sessionId, setSessionId] = useState("");
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Enter Session Code to Connect");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const connect = () => {
    if (!sessionId) {
      setStatus("Please enter a valid session code.");
      return;
    }
    const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");
    socket.onopen = () => {
      setWs(socket);
      setStatus(`Connected to session: ${sessionId}`);
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
        placeholder="Enter Session Code"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
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

export default Receiver;
