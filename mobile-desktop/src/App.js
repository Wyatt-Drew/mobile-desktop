import React, { useState } from "react";
import Pairing from "./components/Pairing";
import SubjectEntry from "./components/SubjectEntry";
import StartScreen from "./components/StartScreen";
import Countdown from "./components/Countdown";
import TargetDisplay from "./components/TargetDisplay";
import NasaTLX from "./components/NasaTLX";
import CompletionScreen from "./components/CompletionScreen";
import { appendRow } from "./components/googleSheetsService";

// Define the target table with subject keys
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
  const [state, setState] = useState("pairing"); // Current phase of the study
  const [subjectID, setSubjectID] = useState(""); // Subject's ID
  const [targets, setTargets] = useState([]); // List of PDFs and their targets
  const [currentPDFIndex, setCurrentPDFIndex] = useState(0); // Current PDF
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Current target
  const [studyComplete, setStudyComplete] = useState(false); // Study completion status
  const [error, setError] = useState(""); // Error message for invalid subjectID

  // Map user input to a valid subject key
  const getSubjectKey = (input) => {
    if (!isNaN(input)) {
      return `subject${input}`; // Map numeric input like "1" to "subject1"
    }
    return input.trim(); // Otherwise, return trimmed string input
  };

  // Handle the transitions between states
  const nextState = () => {
    console.log(`Transitioning from state: ${state}`);
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
        // Move to the next target in the current PDF
        console.log(`Moving to next target in PDF: ${targets[currentPDFIndex]?.pdf}`);
        setCurrentTargetIndex(currentTargetIndex + 1);
      } else {
        // All targets in this PDF are done, move to NASA-TLX
        console.log(`All targets in PDF ${targets[currentPDFIndex]?.pdf} found.`);
        setCurrentTargetIndex(0); // Reset for the next PDF
        setState("nasa-tlx");
      }
    } else if (state === "nasa-tlx") {
      if (currentPDFIndex < targets.length - 1) {
        // Move to the next PDF
        console.log(`Starting next PDF: ${targets[currentPDFIndex + 1]?.pdf}`);
        setCurrentPDFIndex(currentPDFIndex + 1);
        setState("countdown"); // Start the countdown for the next PDF
      } else {
        // All PDFs are done
        console.log("Study complete.");
        setStudyComplete(true);
        setState("complete");
      }
    }
  };

  // Handle subject entry submission
  const handleSubjectEntry = (id) => {
    const subjectKey = getSubjectKey(id);
    console.log(`Entered Subject ID: ${id} (mapped to ${subjectKey})`);
    if (targetTable[subjectKey]) {
      setSubjectID(subjectKey); // Save the formatted subject ID
      setTargets(targetTable[subjectKey]); // Load targets for the subject
      setError(""); // Clear any previous error
      console.log(`Loaded targets for ${subjectKey}:`, targetTable[subjectKey]);
      nextState();
    } else {
      setError("Invalid Subject ID. Please try again.");
    }
  };

  // Handle NASA-TLX form submission
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

  return (
    <div>
      {/* Pairing Screen */}
      {state === "pairing" && <Pairing onNext={nextState} />}

      {/* Subject Entry */}
      {state === "subject-entry" && (
        <SubjectEntry
          onSubmit={handleSubjectEntry}
          error={error}
        />
      )}

      {/* Start Screen */}
      {state === "start-screen" && <StartScreen onBegin={nextState} />}

      {/* Countdown Timer */}
      {state === "countdown" && <Countdown onComplete={nextState} />}

      {/* Target Display */}
      {state === "target-display" && (
        <TargetDisplay
          target={targets[currentPDFIndex]?.targets[currentTargetIndex]} // Current target
          onTargetFound={nextState} // Callback when the target is found
        />
      )}

      {/* NASA-TLX Form */}
      {state === "nasa-tlx" && (
        <NasaTLX
          subjectId={subjectID}
          pdf={targets[currentPDFIndex]?.pdf}
          onSubmit={handleNasaTLXSubmit}
        />
      )}

      {/* Completion Screen */}
      {studyComplete && <CompletionScreen />}
    </div>
  );
};

export default App;
