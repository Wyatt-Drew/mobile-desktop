import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import "./App.css";

const Pairing = ({ onNext }) => {
  const [sessionId, setSessionId] = useState(null);
  const [pairingStatus, setPairingStatus] = useState("waiting"); // "waiting" | "paired" | "error"

  useEffect(() => {
    // Generate a dynamic session ID or fetch it from the backend
    const generateSessionId = async () => {
      try {
        const response = await axios.get("http://localhost:5000/generate-session");
        setSessionId(response.data.sessionId);
      } catch (error) {
        console.error("Failed to generate session ID:", error);
        setPairingStatus("error");
      }
    };

    generateSessionId();
  }, []);

  useEffect(() => {
    // Poll the backend to check if the session has been paired
    const interval = setInterval(async () => {
      if (sessionId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/check-pairing?session=${sessionId}`
          );
          if (response.data.paired) {
            setPairingStatus("paired");
            clearInterval(interval); // Stop polling
            onNext(); // Proceed to the next step
          }
        } catch (error) {
          console.error("Error checking pairing:", error);
          setPairingStatus("error");
        }
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [sessionId, onNext]);

  if (!sessionId) {
    return <p>Loading QR code...</p>;
  }

  const pairingURL = `https://example.com/pair?session=${sessionId}`;

  return (
    <div className="App">
      <h1>Scan to Pair</h1>
      <QRCodeCanvas value={pairingURL} className="qr-code" size={200} />
      {pairingStatus === "waiting" && <p>Waiting for device to pair...</p>}
      {pairingStatus === "paired" && <p>Device paired successfully!</p>}
      {pairingStatus === "error" && (
        <p>Error pairing device. Please try again.</p>
      )}
    </div>
  );
};

export default Pairing;
