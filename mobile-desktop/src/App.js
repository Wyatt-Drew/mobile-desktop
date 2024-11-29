import React from "react";
import Sender from "./components/Sender";

function App() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Peer-to-Peer Cue System</h1>
      {/* Render the Sender component directly as it's the only functionality now */}
      <Sender />
    </div>
  );
}

export default App;
