import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Sender = () => {
  const [sessionId, setSessionId] = useState("");
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentState, setCurrentState] = useState("home");

  useEffect(() => {
    let isMounted = true;

    fetch("https://mobile-backend-74th.onrender.com/generate-session")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setSessionId(data.sessionId);
          setStatus(`Generated Session ID: ${data.sessionId}`);
          autoConnect(data.sessionId);
        }
      })
      .catch((err) => {
        console.error("Error generating session ID:", err);
        setStatus("Failed to generate session ID.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const autoConnect = (sessionId) => {
    if (ws) return;

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
      const { sender, message, type } = JSON.parse(event.data);

      if (type === "changeState") {
        setCurrentState(message);
      } else {
        setMessages((prev) => [...prev, `${sender}: ${message}`]);
      }
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
      <p>{status}</p>
      {sessionId && (
        <div style={{ margin: "20px" }}>
          <p>Scan this QR Code to connect:</p>
          <QRCodeCanvas value={sessionId} size={200} />
        </div>
      )}
      <div>
        <h3>Dynamic Content:</h3>
        <p>{currentState === "home" ? "Welcome to the home page." : `State: ${currentState}`}</p>
      </div>
      {ws && (
        <>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
      <div className="messages">
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default Sender;
