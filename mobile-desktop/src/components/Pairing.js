import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Pairing = ({ onPairingComplete }) => {
  const [sessionId, setSessionId] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [pairingStatus, setPairingStatus] = useState("waiting");

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        // Fetch session ID from backend
        const response = await fetch("https://mobile-backend-74th.onrender.com/generate-session");
        const { sessionId } = await response.json();
        console.log("Fetched session ID:", sessionId); // Log session ID for debugging
        setSessionId(sessionId);

        // Initialize WebSocket after session ID is set
        const wsUrl = `wss://mobile-backend-74th.onrender.com/?session=${sessionId}`;
        console.log("Initializing WebSocket with URL:", wsUrl);
        const ws = new WebSocket(wsUrl);
        setWebSocket(ws);

        // WebSocket event handlers
        ws.onopen = () => {
          console.log("WebSocket connected for session:", sessionId);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Message received from WebSocket:", data);

            if (data.type === "paired") {
              console.log("Pairing complete!");
              setPairingStatus("paired");
              onPairingComplete(); // Notify parent to transition to the next phase
            } else if (data.type === "joined") {
              console.log("Mobile joined session. Starting WebRTC...");
              startWebRTC(ws);
            } else if (data.type === "answer") {
              console.log("Received WebRTC answer:", data.answer);
              peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("Failed to fetch session ID or initialize WebSocket:", error);
      }
    };

    fetchSessionId();
  }, []);

  const startWebRTC = (ws) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        ws.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    const dataChannel = pc.createDataChannel("dataChannel");
    dataChannel.onopen = () => {
      console.log("WebRTC data channel is open");
    };
    dataChannel.onmessage = (event) => {
      console.log("Message received via data channel:", event.data);
    };

    pc.createOffer()
      .then((offer) => {
        console.log("Created WebRTC offer:", offer);
        pc.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: "offer", offer }));
      })
      .catch((error) => {
        console.error("Failed to create WebRTC offer:", error);
      });

    setPeerConnection(pc);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Scan to Pair</h1>
      {sessionId ? (
        <div style={styles.qrWrapper}>
          <QRCodeCanvas
            value={`https://wyatt-drew.github.io/mobile-desktop/pair?session=${sessionId}`}
            size={200}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
            includeMargin={true}
          />
          <p>
            {pairingStatus === "waiting" ? "Waiting for pairing..." : "Paired successfully!"}
          </p>
        </div>
      ) : (
        <p>Generating QR code...</p>
      )}
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" },
  title: { fontSize: "24px", marginBottom: "20px" },
  qrWrapper: { display: "flex", flexDirection: "column", alignItems: "center" },
};

export default Pairing;