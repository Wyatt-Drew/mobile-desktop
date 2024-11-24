import React, { useState } from "react";
import Pairing from "./components/Pairing";
import SubjectEntry from "./components/SubjectEntry";
import StartScreen from "./components/StartScreen";
import Countdown from "./components/Countdown";
import TargetDisplay from "./components/TargetDisplay";
import NasaTLX from "./components/NasaTLX";
import CompletionScreen from "./components/CompletionScreen";

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
  const [state, setState] = useState("pairing"); // Tracks the current phase
  const [subjectID, setSubjectID] = useState(""); // Tracks the subject's ID
  const [targets, setTargets] = useState([]); // Holds the target list for the subject
  const [currentPDFIndex, setCurrentPDFIndex] = useState(0); // Tracks the current PDF in the list
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Tracks the current target
  const [studyComplete, setStudyComplete] = useState(false); // Tracks whether the study is complete

  const nextState = () => {
    if (state === "pairing") {
      setState("subject-entry");
    } else if (state === "subject-entry") {
      setState("start-screen");
    } else if (state === "start-screen") {
      setState("countdown");
    } else if (state === "countdown") {
      setState("target-display");
    } else if (state === "target-display") {
      const currentTargets = targets[currentPDFIndex]?.targets || [];
      if (currentTargetIndex < currentTargets.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1); // Move to the next target
      } else if (currentPDFIndex < targets.length - 1) {
        setCurrentPDFIndex(currentPDFIndex + 1); // Move to the next PDF
        setCurrentTargetIndex(0);
        setState("nasa-tlx");
      } else {
        setStudyComplete(true); // All PDFs and targets completed
        setState("complete");
      }
    } else if (state === "nasa-tlx") {
      setState("countdown"); // Return to countdown for the next PDF
    }
  };

  return (
    <div>
      {/* Pairing Screen */}
      {state === "pairing" && <Pairing onNext={nextState} />}

      {/* Subject Entry */}
      {state === "subject-entry" && (
        <SubjectEntry
          onSubmit={(id) => {
            setSubjectID(id);
            setTargets(targetTable[id] || []);
            nextState();
          }}
        />
      )}

      {/* Start Screen */}
      {state === "start-screen" && <StartScreen onBegin={nextState} />}

      {/* Countdown Timer */}
      {state === "countdown" && (
        <Countdown
          onComplete={nextState} // Transition to the next state after countdown
        />
      )}

      {/* Target Display */}
      {state === "target-display" && (
        <TargetDisplay
          target={targets[currentPDFIndex]?.targets[currentTargetIndex]} // Current target
          onTargetFound={nextState} // Callback when the target is found
        />
      )}

      {/* NASA-TLX Form */}
      {state === "nasa-tlx" && <NasaTLX onBeginNext={nextState} />}

      {/* Completion Screen */}
      {studyComplete && <CompletionScreen />}
    </div>
  );
};

export default App;
