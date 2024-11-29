import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Pairing = ({ onPairingComplete }) => {
  const [sessionId, setSessionId] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [pairingStatus, setPairingStatus] = useState("waiting");

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Step 1: Fetch session ID
        const response = await fetch("https://mobile-backend-74th.onrender.com/generate-session");
        const { sessionId } = await response.json();
        console.log("Fetched session ID:", sessionId);
        setSessionId(sessionId);

        // Step 2: Set up WebSocket connection
        const wsUrl = `wss://mobile-backend-74th.onrender.com/?session=${sessionId}`;
        const ws = new WebSocket(wsUrl);
        setWebSocket(ws);

        // Step 3: WebSocket event handlers
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
              startWebRTC(ws); // Start WebRTC once paired
            } else if (data.type === "answer") {
              console.log("Received WebRTC answer:", data.answer);
              if (peerConnection) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
              }
            } else if (data.type === "candidate") {
              console.log("Received ICE candidate:", data.candidate);
              if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
              }
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
        };
      } catch (error) {
        console.error("Failed to initialize session:", error);
      }
    };

    initializeSession();

    // Cleanup WebSocket and peer connection on component unmount
    return () => {
      if (webSocket) webSocket.close();
      if (peerConnection) peerConnection.close();
    };
  }, []);

  const startWebRTC = (ws) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        ws.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    // Create a data channel for communication
    const dc = pc.createDataChannel("dataChannel");
    setDataChannel(dc);

    // Data channel event handlers
    dc.onopen = () => {
      console.log("Data channel is open");
    };

    dc.onmessage = (event) => {
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

    // Notify the parent that pairing and WebRTC setup are complete
    onPairingComplete(ws, dc);
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
