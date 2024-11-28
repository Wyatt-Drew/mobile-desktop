import React, { useState, useEffect } from "react";
import Pairing from "./components/Pairing";
import SubjectEntry from "./components/SubjectEntry";
import StartScreen from "./components/StartScreen";
import Countdown from "./components/Countdown";
import TargetDisplay from "./components/TargetDisplay";
import NasaTLX from "./components/NasaTLX";
import OverallPreferences from "./components/OverallPreferences";
import CompletionScreen from "./components/CompletionScreen";
import { appendRow } from "./components/googleSheetsService";
import createMessageHandler from "./utils/createMessageHandler"; // New utility

const targetTable = {
  subject1: [
    { pdf: "pdf1", targets: ["target1", "target2", "target3", "target4", "target5"] },
    { pdf: "pdf2", targets: ["target6", "target7", "target8", "target9", "target10"] },
  ],
  subject2: [
    { pdf: "pdf3", targets: ["target11", "target12", "target13", "target14", "target15"] },
  ],
};

const App = () => {
  const [state, setState] = useState("pairing");
  const [webSocket, setWebSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [subjectID, setSubjectID] = useState("");
  const [targets, setTargets] = useState([]);
  const [currentPDFIndex, setCurrentPDFIndex] = useState(0);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [studyComplete, setStudyComplete] = useState(false);
  const [error, setError] = useState("");

  const getSubjectKey = (input) => (!isNaN(input) ? `subject${input}` : input.trim());

  const nextState = () => {
    if (state === "pairing") setState("subject-entry");
    else if (state === "subject-entry") setState("start-screen");
    else if (state === "start-screen") setState("countdown");
    else if (state === "countdown") setState("target-display");
    else if (state === "target-display") {
      const currentTargets = targets[currentPDFIndex]?.targets || [];
      if (currentTargetIndex < currentTargets.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1);
      } else {
        setCurrentTargetIndex(0);
        setState("nasa-tlx");
      }
    } else if (state === "nasa-tlx") {
      if (currentPDFIndex < targets.length - 1) {
        setCurrentPDFIndex(currentPDFIndex + 1);
        setState("countdown");
      } else {
        setState("overall-preferences");
      }
    } else if (state === "overall-preferences") {
      setStudyComplete(true);
      setState("complete");
    }
  };

  const handleSubjectEntry = (id) => {
    const subjectKey = getSubjectKey(id);
    if (targetTable[subjectKey]) {
      setSubjectID(subjectKey);
      setTargets(targetTable[subjectKey]);
      setError("");
      nextState();
    } else {
      setError("Invalid Subject ID. Please try again.");
    }
  };

  const handleNasaTLXSubmit = async (subjectId, pdf, responses) => {
    try {
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
      nextState();
    } catch (error) {
      console.error("Failed to submit NASA-TLX data:", error);
    }
  };

  const handleOverallPreferencesSubmit = async (subjectId, landmarkStyle, { accuracy, speed, preference }) => {
    try {
      await appendRow("Overall", [subjectId, landmarkStyle, accuracy, speed, preference]);
      setStudyComplete(true);
      setState("complete");
    } catch (error) {
      console.error("Failed to submit preferences:", error);
    }
  };

  useEffect(() => {
    if (webSocket) {
      const messageHandler = createMessageHandler({
        webSocket,
        peerConnection,
        setPeerConnection,
        setState,
        nextState,
        setError,
        setSubjectID,
        setStudyComplete,
        targets,
        currentPDFIndex,
        setCurrentPDFIndex,
        currentTargetIndex,
        setCurrentTargetIndex,
      });
  
      webSocket.onmessage = messageHandler;
  
      return () => {
        webSocket.onmessage = null; // Clean up on unmount
      };
    }
  }, [webSocket, peerConnection]);

  const handlePairingComplete = (ws) => {
    setWebSocket(ws);
    nextState();
  };

  return (
    <div>
      {state === "pairing" && <Pairing onPairingComplete={handlePairingComplete} />}
      {state === "subject-entry" && (
        <SubjectEntry onSubmit={handleSubjectEntry} error={error} />
      )}
      {state === "start-screen" && <StartScreen onBegin={nextState} webSocket={webSocket} />}
      {state === "countdown" && <Countdown onComplete={nextState} />}
      {state === "target-display" && (
        <TargetDisplay
          subjectId={subjectID}
          pdfId={targets[currentPDFIndex]?.pdf}
          target={targets[currentPDFIndex]?.targets[currentTargetIndex]}
          onTargetFound={nextState}
        />
      )}
      {state === "nasa-tlx" && (
        <NasaTLX
          subjectId={subjectID}
          pdf={targets[currentPDFIndex]?.pdf}
          onSubmit={handleNasaTLXSubmit}
        />
      )}
      {state === "overall-preferences" && (
        <OverallPreferences subjectId={subjectID} onSubmit={handleOverallPreferencesSubmit} />
      )}
      {studyComplete && <CompletionScreen />}
    </div>
  );
};

export default App;
