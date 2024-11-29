import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const SCREENS = {
  QR_CODE: 1, // Display QR Code
  SUBJECT_ID: 2, // Enter Subject ID
  WELCOME: 3, // Welcome Screen
};

const Sender = () => {
  console.log("Sender component rendered."); // Debugging log
  const [sessionId, setSessionId] = useState("");
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Generating QR code...");
  const [currentScreen, setCurrentScreen] = useState(SCREENS.QR_CODE);
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    console.log("useEffect triggered to fetch session ID."); // Debugging log
    let isMounted = true;

    fetch("https://mobile-backend-74th.onrender.com/generate-session")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setSessionId(data.sessionId);
          setStatus(`Connected to session: ${data.sessionId}`);
          console.log("Generated session ID:", data.sessionId);
          autoConnect(data.sessionId);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error generating session ID:", err);
          setStatus("Failed to generate session ID.");
        }
      });

    return () => {
      console.log("Cleanup: useEffect unmounted."); // Debugging log
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  const autoConnect = (sessionId) => {
    const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");

    socket.onopen = () => {
      setWs(socket);
      console.log("WebSocket connection opened.");

      const registerMessage = {
        type: "register",
        sessionId,
      };
      console.log("Sending message:", registerMessage);
      socket.send(JSON.stringify(registerMessage));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);

      if (message.type === "mobileConnected") {
        console.log("Mobile app connected. Transitioning to Subject ID input.");
        setCurrentScreen(SCREENS.SUBJECT_ID);
      } else {
        console.log("Unhandled message type:", message.type);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
      setStatus("Connection closed.");
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
  };

  const sendSubjectId = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const subjectMessage = {
        type: "subjectId",
        sessionId,
        message: subjectId,
      };
      console.log("Sending message:", subjectMessage);
      ws.send(JSON.stringify(subjectMessage));
      setCurrentScreen(SCREENS.WELCOME);
    } else {
      console.error("WebSocket is not connected. Unable to send Subject ID.");
    }
  };

  return (
    <div style={styles.container}>
      {currentScreen === SCREENS.QR_CODE && (
        <div style={styles.screen1}>
          <div style={styles.qrWrapper}>
            {sessionId ? (
              <>
                <QRCodeCanvas value={sessionId} size={200} />
                <p style={styles.status}>{status}</p>
                <p>Scan this QR Code to connect:</p>
              </>
            ) : (
              <p style={styles.status}>Generating QR Code...</p>
            )}
          </div>
        </div>
      )}
      {currentScreen === SCREENS.SUBJECT_ID && (
        <div style={styles.screen2}>
          <p style={styles.header}>Mobile app connected!</p>
          <input
            type="text"
            placeholder="Enter Subject ID"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            style={styles.input}
          />
          <button onClick={sendSubjectId} style={styles.button}>
            Send Subject ID
          </button>
        </div>
      )}
      {currentScreen === SCREENS.WELCOME && (
        <div style={styles.screen3}>
          <p style={styles.header}>Welcome to the study</p>
        </div>
      )}
    </div>
  );
};

export default Sender;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    padding: "20px",
  },
  qrWrapper: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  status: {
    marginTop: "10px",
    color: "#333",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "80%",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  screen1: {
    textAlign: "center",
  },
  screen2: {
    textAlign: "center",
  },
  screen3: {
    textAlign: "center",
  },
};
