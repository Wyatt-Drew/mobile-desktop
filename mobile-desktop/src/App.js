import React, { useState, useEffect, useRef } from "react";
import Pairing from "./components/Pairing";
import SubjectEntry from "./components/SubjectEntry";
import StartScreen from "./components/StartScreen";
import Countdown from "./components/Countdown";
import TargetDisplay from "./components/TargetDisplay";
import NasaTLX from "./components/NasaTLX";
import OverallPreferences from "./components/OverallPreferences";
import CompletionScreen from "./components/CompletionScreen";
import { appendRow } from "./components/googleSheetsService";
import SimplePeer from "simple-peer";

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
  const [peer, setPeer] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [subjectID, setSubjectID] = useState("");
  const [targets, setTargets] = useState([]);
  const [currentPDFIndex, setCurrentPDFIndex] = useState(0);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [studyComplete, setStudyComplete] = useState(false);
  const [error, setError] = useState("");

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
    const subjectKey = `subject${id}`;
    if (targetTable[subjectKey]) {
      setSubjectID(subjectKey);
      setTargets(targetTable[subjectKey]);
      setError("");
      nextState();
    } else {
      setError("Invalid Subject ID. Please try again.");
    }
  };

  const setupSimplePeer = (initiator, ws) => {
    const newPeer = new SimplePeer({
      initiator,
      trickle: false,
    });

    newPeer.on("signal", (data) => {
      ws.send(JSON.stringify({ type: "signal", data }));
    });

    newPeer.on("connect", () => {
      console.log("Peer connected!");
      setPeer(newPeer);
    });

    newPeer.on("data", (data) => {
      console.log("Received data:", data.toString());
    });

    newPeer.on("error", (err) => console.error("Peer error:", err));

    setPeer(newPeer);
  };

  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "signal" && peer) {
          peer.signal(message.data);
        }
      };

      return () => {
        webSocket.close();
      };
    }
  }, [webSocket, peer]);

  const handlePairingComplete = (ws, isInitiator) => {
    setWebSocket(ws);
    setupSimplePeer(isInitiator, ws);
    nextState();
  };

  return (
    <div>
      {state === "pairing" && <Pairing onPairingComplete={handlePairingComplete} />}
      {state === "subject-entry" && (
        <SubjectEntry onSubmit={handleSubjectEntry} error={error} />
      )}
      {state === "start-screen" && <StartScreen onBegin={nextState} />}
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
          onSubmit={appendRow}
        />
      )}
      {state === "overall-preferences" && (
        <OverallPreferences subjectId={subjectID} onSubmit={appendRow} />
      )}
      {studyComplete && <CompletionScreen />}
    </div>
  );
};

export default App;
