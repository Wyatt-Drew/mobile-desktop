import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Countdown from "../pages/Countdown";
import TargetDisplay from "../pages/TargetDisplay";
import NasaTLX from "../pages/NasaTLX";
import OverallPreferences from "../pages/OverallPreferences";
import CompletionScreen from "../pages/CompletionScreen";
import { appendRow } from "./googleSheetsService";


const targetTable = {
    subject1: [
      { pdf: "pdf1", targets: ["target1", "target2", "target3", "target4", "target5"] },
      { pdf: "pdf2", targets: ["target6", "target7", "target8", "target9", "target10"] },
    ],
    subject2: [
      { pdf: "pdf3", targets: ["target11", "target12", "target13", "target14", "target15"] },
    ],
  };


const SCREENS = {
  QR_CODE: 1, // Display QR Code
  SUBJECT_ID: 2, // Enter Subject ID
  WELCOME: 3, // Welcome Screen
  COUNTDOWN: 4,
  TARGET: 5,
  NASATLX: 6,
  OVERALLPREFERENCES: 7,
  COMPLETION: 8,
};



const Sender = () => {
  console.log("Sender component rendered."); // Debugging log
  const [sessionId, setSessionId] = useState("");
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Generating QR code...");
  const [currentScreen, setCurrentScreen] = useState(SCREENS.QR_CODE);
  const [subjectId, setSubjectId] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
//   
  const [currentTargets, setCurrentTargets] = useState([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [currentPdfId, setCurrentPdfId] = useState(null);

  const imageList = [
    require('../targets/target1.png'),
    require('../targets/target2.png'),
  ];


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
      } else if (message.type === "Begin") {
        setCurrentScreen(SCREENS.COUNTDOWN);
        console.log("Received Begin");
    } else if (message.type === "TargetFound") {
        console.log("Received TargetFound");
        nextState();
    } else if (message.type === "Begin") {
        setCurrentScreen(SCREENS.COUNTDOWN);
        console.log("Received Begin");

      }
      
      else {
        console.log("Unhandled message type:", message.type);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
      setStatus("Connection closed.");
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
  };

  const sendMessage = (type, message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type,
          sessionId,
          sender: "Sender",
          message,
        })
      );
      setMessages((prev) => [...prev, `Self: ${type} - ${message}`]);
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const sendSubjectId = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("Sending subjectId");
        const subjectKey = `subject${subjectId}`;
        if (targetTable[subjectKey]) {
            const pdf = targetTable[subjectKey][0]; // Assuming the first PDF for simplicity
            setCurrentTargets(pdf.targets);
            setCurrentTargetIndex(0);
            setCurrentPdfId(pdf.pdf);
        }
        setCurrentScreen(SCREENS.WELCOME);
        sendMessage("subjectId", subjectId);
    } else {
        console.error("WebSocket is not connected. Unable to send Subject ID.");
    }
  };
  const handleCountdownComplete = () => {
    console.log("Countdown complete, transitioning to TARGET screen.");
    setCurrentScreen(SCREENS.TARGET);
  };

  const handleLogPerformance = async ({ subjectId, pdfId, target, taskTime, scrollDistance, numberOfTaps }) => {
    console.log("Logging performance data...");
    try {
      await appendRow("Performance", [subjectId, pdfId, target, taskTime, scrollDistance, numberOfTaps]);
      console.log("Performance data logged successfully!");
    } catch (error) {
      console.error("Failed to log performance data:", error);
    }
  };

  const handleOverallPreferencesSubmit = async (subjectId, landmarkStyle, { accuracy, speed, preference }) => {
    console.log("Submitting overall preferences for:", landmarkStyle);
    try {
      await appendRow("Overall", [subjectId, landmarkStyle, accuracy, speed, preference]);
      console.log(`Preferences for ${landmarkStyle} submitted successfully!`);
    } catch (error) {
      console.error(`Failed to submit preferences for ${landmarkStyle}:`, error);
    }
  
    // Transition to the next state after submission
    setCurrentScreen(SCREENS.COMPLETION);
  };

  const handleNasaTLXSubmit = async (subjectId, pdf, responses) => {
    console.log(`Submitting NASA-TLX for ${subjectId}, PDF: ${pdf}`);
    try {
      // Write the responses to Google Sheets
      await appendRow("Nasa-TLX", [
        subjectId,
        pdf,
        responses.mentalDemand,
        responses.physicalDemand,
        responses.temporalDemand,
        responses.performance,
        responses.effort,
        responses.frustration,
      ]);
      console.log("NASA-TLX data submitted:", responses);
    } catch (error) {
      console.error("Failed to submit NASA-TLX data:", error);
    }

    // Move to the next state
    nextState();
  };


  const nextState = () => {
    if (currentTargetIndex < currentTargets.length - 1) {
        setCurrentTargetIndex((prevIndex) => prevIndex + 1);
    } else {
        console.log("All targets in the current PDF processed. Moving to NASATLX.");
        setCurrentScreen(SCREENS.NASATLX);
    }
};

  return (
        <div style={styles.container}>
          {currentScreen === SCREENS.QR_CODE && (
            <div style={styles.screen1}>
              <div className="messages">
                {messages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </div>
              <div style={styles.qrWrapper}>
                {sessionId ? (
                  <>
                    <p style={styles.headerBlack}>Scan this QR Code to connect:</p>
                    <QRCodeCanvas value={sessionId} size={400} />
                    <p style={styles.status}>{status}</p>
                  </>
                ) : (
                  <div>
                    <p style={styles.status}>Generating QR Code...</p>
                    <p style={styles.status}>The backend is probably starting up right now.</p>
                    <p style={styles.status}>That can take 50 seconds or more.</p>
                  </div>
                )}
              </div>
            </div>
          )}
      
          {currentScreen === SCREENS.SUBJECT_ID && (
            <div style={styles.screen2}>
              <p style={styles.headerBlack}>Mobile app connected!</p>
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
      
          {currentScreen === SCREENS.COUNTDOWN && (
            <div style={styles.screen3}>
              <Countdown onComplete={handleCountdownComplete} />
            </div>
          )}
      
          {currentScreen === SCREENS.TARGET && (
            <div style={styles.screen3}>
            <TargetDisplay
                subjectId={subjectId}
                pdfId={currentPdfId}
                target={currentTargets[currentTargetIndex]}
                onTargetFound={nextState} // Advances target or screen
                onLogPerformance={handleLogPerformance} // Logs performance data
            />
            </div>
          )}
      
          {currentScreen === SCREENS.NASATLX && (
            <div style={styles.screen3}>
              <NasaTLX />
            </div>
          )}
      
          {currentScreen === SCREENS.OVERALLPREFERENCES && (
            <div style={styles.screen3}>
              <OverallPreferences />
            </div>
          )}
      
          {currentScreen === SCREENS.COMPLETION && (
            <div style={styles.screen3}>
              <CompletionScreen />
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
  headerBlack: {
    fontSize: "30px",
    marginBottom: "20px",
    color: 'black',
    fontWeight:'bold',
  },
  header: {
    fontSize: "30px",
    marginBottom: "20px",
    fontWeight:'bold',
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
