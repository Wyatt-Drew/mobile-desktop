import React, { useState, useEffect } from "react";

const Sender = () => {
  const [sessionId, setSessionId] = useState(""); // Session ID
  const [ws, setWs] = useState(null); // WebSocket connection
  const [status, setStatus] = useState("Initializing..."); // Status message
  const [inputMessage, setInputMessage] = useState(""); // Input for messages
  const [messages, setMessages] = useState([]); // Message log
  const [currentState, setCurrentState] = useState("home"); // State for dynamic pages

  // Generate session ID and auto-connect on mount
  useEffect(() => {
    let isMounted = true; // Track component mount status
    fetch("https://mobile-backend-74th.onrender.com/generate-session")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setSessionId(data.sessionId);
          setStatus(`Generated Session ID: ${data.sessionId}`);
          autoConnect(data.sessionId); // Auto-connect after generating session ID
        }
      })
      .catch((err) => {
        console.error("Error generating session ID:", err);
        setStatus("Failed to generate session ID.");
      });

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, []);

  const autoConnect = (sessionId) => {
    if (ws) return; // Prevent multiple connections

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

      // Handle different message types
      if (type === "changeState") {
        setCurrentState(message); // Update the state dynamically
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

  // Render content dynamically based on `currentState`
  const renderContent = () => {
    switch (currentState) {
      case "home":
        return <p>Welcome to the home page. Use the input below to send a message.</p>;
      case "page1":
        return <p>You are now on Page 1!</p>;
      case "page2":
        return <p>You are now on Page 2!</p>;
      default:
        return <p>Unknown state: {currentState}</p>;
    }
  };

  return (
    <div className="sender">
      <h2>Sender</h2>
      <p>{status}</p>
      <div>{renderContent()}</div>
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
