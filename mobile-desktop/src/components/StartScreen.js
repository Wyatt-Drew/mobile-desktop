import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library

const StartScreen = ({ onBegin }) => {
  const [peerId, setPeerId] = useState(null);

  useEffect(() => {
    // Generate a local ID for the PeerJS instance
    const generatedId = uuidv4();

    // Initialize PeerJS with the generated ID
    const peerInstance = new Peer({
      host: "mobile-backend-74th.onrender.com", // Your backend PeerJS server
      port: 443, // HTTPS port
      path: "/peerjs", // Correct PeerJS signaling path
      secure: true, // Use HTTPS
    });
    

    peerInstance.on("open", (id) => {
      console.log("PeerJS ID generated locally:", id);
      setPeerId(id); // Save the generated ID to display
    });

    peerInstance.on("connection", (conn) => {
      console.log("Connection established with peer:", conn.peer);
      conn.on("data", (data) => {
        console.log("Data received from peer:", data);
      });
    });

    peerInstance.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    // Clean up on unmount
    return () => {
      peerInstance.destroy();
    };
  }, []);

  return (
    <div className="App">
      <h1>Welcome to the Study</h1>
      {peerId ? (
        <p>Your PeerJS ID: <strong>{peerId}</strong></p>
      ) : (
        <p>Generating PeerJS ID...</p>
      )}
      <button onClick={onBegin}>Start</button>
    </div>
  );
};

export default StartScreen;
