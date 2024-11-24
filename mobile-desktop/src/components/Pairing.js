import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

const Pairing = ({ onNext }) => {
  const sessionId = "12345";
  const pairingURL = `https://example.com?session=${sessionId}`;

  return (
    <div className="App">
      <h1>Scan to Pair</h1>
      <QRCodeCanvas value={pairingURL} className="qr-code" size={200} /> 
      <button className="action-button" onClick={onNext}>
        Simulate Pairing Complete
      </button>
    </div>
  );
};

export default Pairing;
