import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Pairing = ({ onPairingComplete }) => {
  const [sessionId, setSessionId] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [pairingStatus, setPairingStatus] = useState("waiting");

  useEffect(() => {
    // Fetch session ID from backend
    const fetchSessionId = async () => {
      try {
        const response = await fetch("https://mobile-backend-74th.onrender.com/generate-session");
        const { sessionId } = await response.json();
        setSessionId(sessionId);

        // Initialize WebSocket with session ID
        const ws = new WebSocket(`wss://https://mobile-backend-74th.onrender.com/?session=${sessionId}`);
        setWebSocket(ws);

        ws.onopen = () => console.log("WebSocket connected");

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "joined") {
            startWebRTC();
          } else if (data.type === "answer") {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            setPairingStatus("paired");
            onPairingComplete(peerConnection);
          }
        };

        ws.onclose = () => console.log("WebSocket closed");
        ws.onerror = (err) => console.error("WebSocket error:", err);
      } catch (error) {
        console.error("Failed to fetch session ID:", error);
      }
    };

    fetchSessionId();
  }, []);

  const startWebRTC = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && webSocket) {
        webSocket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    const dataChannel = pc.createDataChannel("dataChannel");
    dataChannel.onopen = () => console.log("Data channel open");
    dataChannel.onmessage = (e) => console.log("Message from mobile:", e.data);

    pc.createOffer()
      .then((offer) => {
        pc.setLocalDescription(offer);
        webSocket.send(JSON.stringify({ type: "offer", offer }));
      })
      .catch((err) => console.error("Failed to create WebRTC offer:", err));

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
          <p>{pairingStatus === "waiting" ? "Waiting for pairing..." : "Paired successfully!"}</p>
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
