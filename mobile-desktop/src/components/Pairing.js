import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Pairing = ({ onPairingComplete }) => {
  const [sessionId, setSessionId] = useState(null);
  const [pairingStatus, setPairingStatus] = useState("waiting");

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch("https://mobile-backend-74th.onrender.com/generate-session");
        const { sessionId } = await response.json();
        setSessionId(sessionId);

        const ws = new WebSocket(`wss://mobile-backend-74th.onrender.com/?session=${sessionId}`);

        ws.onopen = () => console.log("WebSocket connected");
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "paired") {
            setPairingStatus("paired");
            onPairingComplete(ws, true); // Assume desktop is the initiator
          }
        };

        ws.onclose = () => console.log("WebSocket closed");
      } catch (err) {
        console.error("Error initializing session:", err);
      }
    };

    initializeSession();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Scan to Pair</h1>
      <div style={styles.qrWrapper}>
        {sessionId ? (
          <QRCodeCanvas
            value={`https://wyatt-drew.github.io/mobile-desktop/pair?session=${sessionId}`}
            size={200}
          />
        ) : (
          <p>Loading...</p>
        )}
        <p style={styles.statusText}>
          {pairingStatus === "waiting" ? "Waiting for pairing..." : "Paired successfully!"}
        </p>
      </div>
    </div>
  );
};

export default Pairing;
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333", // Optional: Darker text color
  },
  qrWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  statusText: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#555", // Optional: Subtle status color
  },
};