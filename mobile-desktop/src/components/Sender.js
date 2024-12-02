import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Countdown from "../pages/Countdown";
import TargetDisplay from "../pages/TargetDisplay";
import NasaTLX from "../pages/NasaTLX";
import OverallPreferences from "../pages/OverallPreferences";
import CompletionScreen from "../pages/CompletionScreen";
import { appendRow } from "./googleSheetsService";

// const landmarkTypes = [
//     { label: 'No Icons', value: 'None' },
//     { label: 'Numbers', value: 'Numbers' },
//     { label: 'Letters', value: 'Letters' },
//     { label: 'Icons', value: 'Icons' },
//     { label: 'ColorIcons', value: 'ColorIcons' },
//   ];


const targetTable = {
    subject1: [
      {
        pdf: "PDF1",
        targets: [
            "target1", "target2", "target3", "target4", "target5",
            // "target2", "target3", "target4", "target5", "target1",
            // "target3", "target4", "target5", "target1", "target2",
            // "target4", "target5", "target1", "target2", "target3",
            // "target5", "target1", "target2", "target3", "target4"
        ],
        landmarks: "Numbers", // Associated landmark type
      },
      {
        pdf: "PDF2",
        targets: [
            "target6", "target7", "target8", "target9", "target10",
            "target7", "target8", "target9", "target10", "target6",
            "target8", "target9", "target10", "target6", "target7",
            // "target9", "target10", "target6", "target7", "target8",
            // "target10", "target6", "target7", "target8", "target9"
        ],
        landmarks: "No Icons", // Associated landmark type
      },
      {
        pdf: "PDF3",
        targets: [
            "target11", "target12", "target13", "target14", "target15",
            "target12", "target13", "target14", "target15", "target11",
            "target13", "target14", "target15", "target11", "target12",
            // "target14", "target15", "target11", "target12", "target13",
            // "target15", "target11", "target12", "target13", "target14"
        ],
        landmarks: "Letters", // Associated landmark type
      },
      {
        pdf: "PDF4",
        targets: [
            "target20", "target16", "target17", "target18", "target19",
            "target16", "target17", "target18", "target19", "target20",
            "target17", "target18", "target19", "target20", "target16",
            // "target18", "target19", "target20", "target16", "target17",
            // "target19", "target20", "target16", "target17", "target18"
        ],
        landmarks: "Icons", // Associated landmark type
      },
      {
        pdf: "PDF5",
        targets: [
            "target21", "target22", "target23", "target24", "target25",
            "target22", "target23", "target24", "target25", "target21",
            "target23", "target24", "target25", "target21", "target22",
            // "target24", "target25", "target21", "target22", "target23",
            // "target25", "target21", "target22", "target23", "target24"
        ],
        landmarks: "ColorIcons", // Associated landmark type
      },
    ],
    
    subject2: [
        {
            pdf: "PDF1",
            targets: [
                "target1", "target2", "target3", "target4", "target5",
                "target2", "target3", "target4", "target5", "target1",
                "target3", "target4", "target5", "target1", "target2",
                // "target4", "target5", "target1", "target2", "target3",
                // "target5", "target1", "target2", "target3", "target4"
            ],
            landmarks: "No Icons", // Associated landmark type
          },
          {
            pdf: "PDF2",
            targets: [
                "target6", "target7", "target8", "target9", "target10",
                "target7", "target8", "target9", "target10", "target6",
                "target8", "target9", "target10", "target6", "target7",
                // "target9", "target10", "target6", "target7", "target8",
                // "target10", "target6", "target7", "target8", "target9"
            ],
            landmarks: "Letters", // Associated landmark type
          },
          {
            pdf: "PDF3",
            targets: [
                "target11", "target12", "target13", "target14", "target15",
                "target12", "target13", "target14", "target15", "target11",
                "target13", "target14", "target15", "target11", "target12",
                // "target14", "target15", "target11", "target12", "target13",
                // "target15", "target11", "target12", "target13", "target14"
            ],
            landmarks: "Icons", // Associated landmark type
          },
          {
            pdf: "PDF4",
            targets: [
                "target20", "target16", "target17", "target18", "target19",
                "target16", "target17", "target18", "target19", "target20",
                "target17", "target18", "target19", "target20", "target16",
                // "target18", "target19", "target20", "target16", "target17",
                // "target19", "target20", "target16", "target17", "target18"
            ],
            
            landmarks: "ColorIcons", // Associated landmark type
          },
          {
            pdf: "PDF5",
            targets: [
                "target21", "target22", "target23", "target24", "target25",
                "target22", "target23", "target24", "target25", "target21",
                "target23", "target24", "target25", "target21", "target22",
                // "target24", "target25", "target21", "target22", "target23",
                // "target25", "target21", "target22", "target23", "target24"
            ],
            landmarks: "Numbers", // Associated landmark type
          },
        ],
    
        subject3: [
            {
                pdf: "PDF1",
                targets: ["target1", "target2", "target3", "target4", "target5"],
                landmarks: "Numbers", // Associated landmark type
              },
            ],
  };


const SCREENS = {
  QR_CODE: 1, 
  SUBJECT_ID: 2, 
  WELCOME: 3, 
  COUNTDOWN: 4,
  TARGET: 5,
  NASATLX: 6,
  OVERALLPREFERENCES: 7,
  COMPLETION: 8,
};

const Sender = () => {
// Web Sockets
const [sessionId, setSessionId] = useState("");
// const [ws, setWs] = useState(null);
const wsRef = useRef(null);
//States
const [messages, setMessages] = useState([]);
const [status, setStatus] = useState("Generating QR code...");
const [currentScreen, setCurrentScreen] = useState(SCREENS.QR_CODE);
//   PDF & Targets
  const [subjectId, setSubjectId] = useState("");
//   const [currentTargets, setCurrentTargets] = useState([]);
//   const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [currentPdfId, setCurrentPdfId] = useState(null);
  const [currentLandmarks, setCurrentLandmarks] = useState("");
  const startTime = useRef(null);
  const isFetchingSession = useRef(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [countdownActive, setCountdownActive] = useState(false);
  const currentTargetIndexRef = useRef(0);
  const currentTargetsRef = useRef([]);
  
  useEffect(() => {
    if (currentScreen === SCREENS.COUNTDOWN) {
      setTimeLeft(2); 
      setCountdownActive(true); // Start countdown when screen switches
    }
  }, [currentScreen]);

  useEffect(() => {
    if (countdownActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleCountdownComplete(); // Trigger completion logic
            setCountdownActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [timeLeft, countdownActive]);


  
  useEffect(() => {
    // Prevent duplicate session generation
    if (isFetchingSession.current || sessionId) return;

    isFetchingSession.current = true; // Mark as fetching

    fetch("https://mobile-backend-74th.onrender.com/generate-session")
      .then((response) => response.json())
      .then((data) => {
        setSessionId(data.sessionId);
        setStatus(`Connected to session: ${data.sessionId}`);
        console.log("Generated session ID:", data.sessionId);

        if (!wsRef.current) {
          autoConnect(data.sessionId);
        }
      })
      .catch((err) => {
        console.error("Error generating session ID:", err);
        setStatus("Failed to generate session ID.");
      });
  }, []);

  const autoConnect = (sessionId) => {
    const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection opened.");
      const registerMessage = {
        type: "register",
        sessionId,
      };
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
    } else if (message.type === "TARGETFOUND") {
        const [subject, pdfLabel, targetLabel, landmarkType, tapCount, distance] = message.message.split(",");
    
        handleTargetFound(
            parseInt(subject, 10),            // Subject as integer
            pdfLabel,                         // PDF ID as string
            targetLabel,                      // Target ID as string
            landmarkType,                     // Landmark type as string
            parseInt(distance, 10),           // Scroll distance as integer
            parseInt(tapCount, 10)            // Tap count as integer
        );
        console.log("Received TargetFound");
        nextState();
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
    const ws = wsRef.current;
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
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("Sending subjectId");
        const subjectKey = `subject${subjectId}`;
        if (targetTable[subjectKey]) {
            const pdf = targetTable[subjectKey][0];
            currentTargetsRef.current = pdf.targets || []; // Ensure it's an array
            currentTargetIndexRef.current = 0; // Reset index
            setCurrentPdfId(pdf.pdf); // Still using useState
            setCurrentLandmarks(pdf.landmarks); // Still using useState
            sendMessage("PDF", pdf.pdf);
            sendMessage("LANDMARK", pdf.landmarks);
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
  
    // Load targets for the current PDF
    const subjectKey = `subject${subjectId}`;
    const pdfs = targetTable[subjectKey];
    const currentPdf = pdfs.find((entry) => entry.pdf === currentPdfId);
  
    if (currentPdf) {
      handleNewPdfLoad(currentPdf); // Reset targets and index for this PDF
      const firstTarget = currentTargetsRef.current[currentTargetIndexRef.current];
      sendMessage("TARGET", firstTarget); // Send the first target
      console.log("Started new target sequence with:", firstTarget);
    } else {
      console.error("No matching PDF found for currentPdfId:", currentPdfId);
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

    // Check for the next PDF
    const subjectKey = `subject${subjectId}`;
    const pdfs = targetTable[subjectKey];

    const currentPdfIndex = pdfs.findIndex((entry) => entry.pdf === pdf);
    if (currentPdfIndex !== -1 && currentPdfIndex < pdfs.length - 1) {
        // Load the next PDF
        const nextPdf = pdfs[currentPdfIndex + 1];
        sendMessage("PDF", nextPdf.pdf);
        sendMessage("LANDMARK", nextPdf.landmarks);
        sendMessage("START", "");
        if (pdf.targets && pdf.targets.length > 0) {
            currentTargetsRef.current = pdf.targets;
            currentTargetIndexRef.current = 0; // Reset index for the new PDF
            console.log("Targets loaded:", currentTargetsRef.current);
        } else {
            console.error("No targets found for the selected PDF.");
            currentTargetsRef.current = []; // Fall back to an empty list if targets are undefined or empty
        }
        setCurrentPdfId(nextPdf.pdf);
        setCurrentLandmarks(nextPdf.landmarks);

        console.log(`Loaded next PDF: ${nextPdf.pdf}`);
        setCurrentScreen(SCREENS.COUNTDOWN); // Start countdown for the next PDF
    } else {
        // No more PDFs, transition to OVERALLPREFERENCES
        console.log("All PDFs processed. Moving to Overall Preferences.");
        setCurrentScreen(SCREENS.OVERALLPREFERENCES);
    }
  };


  const nextState = () => {
    console.log("Current Target Index:", currentTargetIndexRef.current);
    console.log("Current Targets Length:", currentTargetsRef.current.length);
  
    if (currentTargetIndexRef.current < currentTargetsRef.current.length - 1) {
      currentTargetIndexRef.current += 1; // Increment index
      const nextTarget = currentTargetsRef.current[currentTargetIndexRef.current];
      sendMessage("TARGET", nextTarget);
      console.log(`Sent next target: ${nextTarget} (Index: ${currentTargetIndexRef.current})`);
    } else {
      console.log("No more targets in the current PDF. Transitioning to NASATLX.");
      setCurrentScreen(SCREENS.NASATLX);
      sendMessage("TARGET", "NULL");
      sendMessage("PDFCOMPLETE", "NULL");
    }
  };
  const handleNewPdfLoad = (pdf) => {
    currentTargetsRef.current = pdf.targets || [];
    currentTargetIndexRef.current = 0;
    console.log("New PDF loaded. Targets:", currentTargetsRef.current);
  };
useEffect(() => {
    if (currentScreen === SCREENS.NASATLX) {
      console.log("NASATLX screen loaded, sending BLACKSCREEN message.");
      sendMessage("BLACKSCREEN", "NasaTLX loaded");
    }
  }, [currentScreen]);

useEffect(() => {
    startTime.current = Date.now();
    console.log("Task start time set:", startTime.current);
}, [currentTargetIndexRef.current]);


  const handleTargetFound = async (subject, pdfLabel, targetLabel, landmarkType, scrollDistance, numberOfTaps) => {
    console.log("Received data:", { scrollDistance, numberOfTaps });
    
    // Validate inputs
    if (
        typeof subject !== "number" ||
        typeof pdfLabel !== "string" ||
        typeof targetLabel !== "string" ||
        typeof landmarkType !== "string" ||
        typeof scrollDistance !== "number" ||
        typeof numberOfTaps !== "number"
    ) {
        console.error("Invalid data received:", { subject, pdfLabel, targetLabel, landmarkType, scrollDistance, numberOfTaps });
        return; // Stop execution if data isn't valid
    }
  
    const endTime = Date.now();
    const diff = endTime - startTime.current;
    const taskTime = diff / 1000;
    if (isNaN(taskTime)) {
        console.error("Task time calculation failed.");
        return;
    }

    const rowData = [
        subject,       // Subject ID
        pdfLabel,      // PDF ID
        targetLabel,   // Target ID
        landmarkType,  // Landmark type
        taskTime,      // Task time
        scrollDistance, // Scroll distance
        numberOfTaps,   // Number of taps
    ];
  
    try {
      await appendRow("Performance", rowData);
      console.log("Performance data submitted successfully:", rowData);
    } catch (error) {
      console.error("Failed to submit performance data:", error);
    }
  
    nextState();
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
            <div className="App">
            <h1>Time to familiarize yourself with the PDF</h1>
            <div className="timer">
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </div>
        </div>
          )}
      
          {currentScreen === SCREENS.TARGET && (
            <div style={styles.screen3}>
            <TargetDisplay
                subjectId={subjectId}
                pdfId={currentPdfId}
                target={currentTargetsRef.current[currentTargetIndexRef.current]}
            />
            </div>
          )}
      
      {currentScreen === SCREENS.NASATLX && (
  <div
  >
    <NasaTLX
      subjectId={subjectId}
      pdf={currentPdfId}
      onSubmit={handleNasaTLXSubmit}
    />
  </div>
)} 
          {currentScreen === SCREENS.OVERALLPREFERENCES && (
            <div style={styles.screen3}>
              <OverallPreferences 
              subjectId={subjectId}
              onSubmit={handleOverallPreferencesSubmit}
              />
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
