import React, { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Correct import
import "./App.css";
import communicationService from "./components/CommunicationService";

function App() {
  const [peerId, setPeerId] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);

  useEffect(() => {
    communicationService.initializePeer().then(setPeerId);

    communicationService.onConnection((conn) => {
      console.log("Connected to peer:", conn.peer);
    });

    communicationService.onData((data) => {
      console.log("Received data:", data);
      // Handle incoming data (e.g., subject ID from the mobile app)
    });

    return () => {
      communicationService.destroy();
    };
  }, []);

  const handleStartCall = async () => {
    const stream = await communicationService.getMediaStream();
    currentUserVideoRef.current.srcObject = stream;
    currentUserVideoRef.current.play();
  };

  return (
    <div className="App">
      <h1>Scan the QR Code to Connect</h1>
      {peerId && <QRCodeCanvas value={peerId} size={256} />} {/* Updated component */}
      <button onClick={handleStartCall}>Start Video Call</button>
      <div>
        <video ref={currentUserVideoRef} autoPlay playsInline />
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
    </div>
  );
}

export default App;
