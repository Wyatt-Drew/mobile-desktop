import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Receiver from "./components/Receiver";
import Sender from "./components/Sender";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Peer-to-Peer Cue System</h1>
        <nav>
          <Link to="/receiver">Receiver</Link> | <Link to="/sender">Sender</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/receiver" element={<Receiver />} />
        <Route path="/sender" element={<Sender />} />
      </Routes>
    </Router>
  );
}

export default App;
