import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import TargetDisplay from "../pages/TargetDisplay";
import NasaTLX from "../pages/NasaTLX";
import OverallPreferences from "../pages/OverallPreferences";
import CompletionScreen from "../pages/CompletionScreen";
import { appendRow } from "./googleSheetsService";
import './Sender.css';
import targetTable from "./targetTable";
//redux
import { useSelector, useDispatch } from "react-redux";
import {startCountdown, decrementTime, stopCountdown,} from "../store/countdownSlice";
import { setScreen } from "../store/screenSlice";

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

//   PDF & Targets
const currentTargetIndexRef = useRef({ block: 0, target: 0 });
const currentTargetsRef = useRef([]);
// UseState - best used for variables that do not cross components
const [subjectId, setSubjectId] = useState("");
const [currentPdfId, setCurrentPdfId] = useState(null);
const [messages, setMessages] = useState([]);
const [status, setStatus] = useState("Generating QR code...");
const [currentLandmarks, setCurrentLandmarks] = useState("");

//UseRef - best used for not part of UI rendering
const startTime = useRef(null);
const isFetchingSession = useRef(false);
const sessionIdRef = useRef(null);
const wsRef = useRef(null);

//Redux - best used for global state management.
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.countdown.timeLeft); //Countdown
  const isActive = useSelector((state) => state.countdown.isActive); //Countdown
  const currentScreen = useSelector((state) => state.screen.currentScreen); //screen

  
  useEffect(() => {
    if (currentScreen === SCREENS.COUNTDOWN) {
      dispatch(startCountdown(120)); 
    }
  }, [currentScreen]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);
  
      return () => clearInterval(timer);
    }
  
    if (timeLeft === 0) {
      handleCountdownComplete();
      dispatch(stopCountdown());
    }
  }, [dispatch, isActive, timeLeft]);


  
  useEffect(() => {
    // Prevent duplicate session generation
    if (isFetchingSession.current || sessionIdRef.current) return;

    isFetchingSession.current = true; // Mark as fetching

    fetch("https://mobile-backend-74th.onrender.com/generate-session")
      .then((response) => response.json())
      .then((data) => {
        sessionIdRef.current = data.sessionId;
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
    const maxRetries = 5; // Define maximum retry attempts
    let retryCount = 0;
  
    const connect = () => {
      const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");
      wsRef.current = socket;
  
      socket.onopen = () => {
        console.log("WebSocket connection opened.");
        retryCount = 0; // Reset retries on successful connection
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
          dispatch(setScreen(SCREENS.SUBJECT_ID));
        } else if (message.type === "Begin") {
          dispatch(setScreen(SCREENS.COUNTDOWN));
          console.log("Received Begin");
        } else if (message.type === "TARGETFOUND") {
          const [subject, pdfLabel, targetLabel, landmarkType, tapCount, distance] = message.message.split(",");
          const { block, target } = currentTargetIndexRef.current;
          const targetId = currentTargetsRef.current[block]?.[target];
          handleTargetFound(
            parseInt(subject, 10),
            pdfLabel,
            targetId,
            landmarkType,
            parseInt(distance, 10),
            parseInt(tapCount, 10),
            block + 1
          );
          console.log("Received TargetFound");
        }
      };
  
      socket.onclose = () => {
        console.log("WebSocket connection closed.");
        setStatus("Connection closed. Reconnecting...");
        wsRef.current = null; // Reset WebSocket reference
  
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Reconnecting... Attempt ${retryCount} of ${maxRetries}`);
          setTimeout(() => connect(), 1000); // Retry after 1 second
        } else {
          console.error("Max retries reached. Could not reconnect.");
          setStatus("Failed to reconnect after multiple attempts.");
        }
      };
  
      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };
  
    connect(); // Initial connection
  };

  const sendMessage = (type, message) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type,
          sessionId: sessionIdRef.current,
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
            currentTargetIndexRef.current = { block: 0, target: 0 };// Reset index
            setCurrentPdfId(pdf.pdf); 
            setCurrentLandmarks(pdf.landmarks);
            sendMessage("PDF", pdf.pdf);
            sendMessage("LANDMARK", pdf.landmarks);
          }
        dispatch(setScreen(SCREENS.WELCOME));
        sendMessage("subjectId", subjectId);
    } else {
        console.error("WebSocket is not connected. Unable to send Subject ID.");
    }
  };
  const handleCountdownComplete = () => {
    console.log("Countdown complete, transitioning to TARGET screen.");
    dispatch(setScreen(SCREENS.TARGET));
  
    // Load targets for the current PDF
    const subjectKey = `subject${subjectId}`;
    const pdfs = targetTable[subjectKey];
    const currentPdf = pdfs.find((entry) => entry.pdf === currentPdfId);
  
    if (currentPdf) {
      handleNewPdfLoad(currentPdf); 
      const { block, target } = currentTargetIndexRef.current;
      const firstTarget = currentTargetsRef.current[block]?.[target];
      if (firstTarget) {
          sendMessage("TARGET", firstTarget);
          console.log("Started new target sequence with:", firstTarget);
      } else {
          console.error("First target not found for block:", block, "target:", target);
      }
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
    dispatch(setScreen(SCREENS.COMPLETION));
  };

  const handleNasaTLXSubmit = async (subjectId, pdf, responses, currentLandmarks) => {
    console.log(`Submitting NASA-TLX for ${subjectId}, PDF: ${pdf}`);
    try {
      // Write the responses to Google Sheets
      await appendRow("Nasa-TLX", [
        subjectId,
        pdf,
        currentLandmarks,
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
        sendMessage("TARGET", "none");
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
        dispatch(setScreen(SCREENS.COUNTDOWN)); // Start countdown for the next PDF
    } else {
        // No more PDFs, transition to OVERALLPREFERENCES
        console.log("All PDFs processed. Moving to Overall Preferences.");
        dispatch(setScreen(SCREENS.OVERALLPREFERENCES));
    }
  };


  const nextState = () => {
    const { block, target } = currentTargetIndexRef.current;
    const blocks = currentTargetsRef.current;
  
    if (block < blocks.length) {
      const currentBlock = blocks[block];
      if (target < currentBlock.length - 1) {
        // Move to next target within the same block
        currentTargetIndexRef.current.target += 1;
      } else if (block < blocks.length - 1) {
        // Move to the next block
        currentTargetIndexRef.current.block += 1;
        currentTargetIndexRef.current.target = 0;
      } else {
        // End of all blocks, transition to NASATLX
        console.log("No more targets in the current PDF. Transitioning to NASATLX.");
        dispatch(setScreen(SCREENS.NASATLX));
        sendMessage("TARGET", "NULL");
        sendMessage("PDFCOMPLETE", "NULL");
        return;
      }
      startTime.current = Date.now();
      const { block: nextBlock, target: nextTarget } = currentTargetIndexRef.current;
      const nextTargetValue = blocks[nextBlock]?.[nextTarget];
      sendMessage("TARGET", nextTargetValue);
      console.log(`Sent next target: ${nextTarget}`);
    }
  };
  const handleNewPdfLoad = (pdf) => {
    currentTargetsRef.current = pdf.targets || [];
    currentTargetIndexRef.current = { block: 0, target: 0 };
    startTime.current = Date.now();
    console.log("New PDF loaded. Target blocks:", currentTargetsRef.current);
  };
useEffect(() => {
    if (currentScreen === SCREENS.NASATLX) {
      console.log("NASATLX screen loaded, sending BLACKSCREEN message.");
      sendMessage("BLACKSCREEN", "NasaTLX loaded");
    }
  }, [currentScreen]);

  const handleTargetFound = async (subject, pdfLabel, targetLabel, landmarkType, scrollDistance, numberOfTaps, block) => {
    console.log("Received data:", { scrollDistance, numberOfTaps });
    
    // Validate inputs
    if (
        typeof subject !== "number" ||
        typeof pdfLabel !== "string" ||
        typeof targetLabel !== "string" ||
        typeof landmarkType !== "string" ||
        typeof scrollDistance !== "number" ||
        typeof numberOfTaps !== "number" ||
        typeof block !== "number"
    ) {
        console.error("Invalid data received:", { subject, pdfLabel, targetLabel, landmarkType, scrollDistance, numberOfTaps });
        return; // Stop execution if data isn't valid
    }
  
    const endTime = Date.now();
    const diff = endTime - startTime.current;
    const taskTime = diff;
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
        block,          // Block number
    ];
  
    try {
      await appendRow("Performance", rowData);
      console.log("Performance data submitted successfully:", rowData);
    } catch (error) {
      console.error("Failed to submit performance data:", error);
    }
  
    nextState();
  };
  const handleFeedbackSubmit = async (feedback) => {
    try {
      await appendRow("Feedback", [subjectId, feedback]); // Append feedback to a Google Sheets or database
      console.log("Feedback submitted successfully:", feedback);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
        <div className="container">
          {currentScreen === SCREENS.QR_CODE && (
            <div className="screen1">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </div>
              <div className="qrWrapper">
                {sessionIdRef.current ? (
                  <>
                    <p className="headerBlack">Scan this QR Code to connect:</p>
                    <QRCodeCanvas value={sessionIdRef.current} size={400} />
                    <p className="status">{status}</p>
                  </>
                ) : (
                  <div>
                    <p className="status">Generating QR Code...</p>
                    <p className="status">The backend is probably starting up right now.</p>
                    <p className="status">That can take 50 seconds or more.</p>
                  </div>
                )}
              </div>
            </div>
          )}
      
          {currentScreen === SCREENS.SUBJECT_ID && (
            <div className="screen2">
              <p className="headerBlack">Mobile app connected!</p>
              <input
                type="text"
                placeholder="Enter Subject ID"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="input"
              />
              <button onClick={sendSubjectId} className="button">
                Send Subject ID
              </button>
            </div>
          )}
      
          {currentScreen === SCREENS.WELCOME && (
            <div className="screen3">
              <p className="header">Welcome to the study</p>
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
            <div className="screen3">
            <TargetDisplay
                subjectId={subjectId}
                pdfId={currentPdfId}
                currentLandmarks={currentLandmarks}
                target={currentTargetsRef.current[currentTargetIndexRef.current.block][currentTargetIndexRef.current.target]}
            />
            </div>
          )}
      
      {currentScreen === SCREENS.NASATLX && (
  <div
  >
    <NasaTLX
      subjectId={subjectId}
      pdf={currentPdfId}
      currentLandmarks={currentLandmarks}
      onSubmit={handleNasaTLXSubmit}
    />
  </div>
)} 
          {currentScreen === SCREENS.OVERALLPREFERENCES && (
            <div className="screen3">
              <OverallPreferences 
              subjectId={subjectId}
              onSubmit={handleOverallPreferencesSubmit}
              />
            </div>
          )}
      
                {currentScreen === SCREENS.COMPLETION && (
            <div className="screen3">
              <CompletionScreen onSubmitFeedback={handleFeedbackSubmit} />
            </div>
          )}
        </div>
      );
};

export default Sender;