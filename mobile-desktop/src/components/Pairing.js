import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const Pairing = ({ onNext }) => {
  const sessionId = "12345";
  const pairingURL = `https://example.com?session=${sessionId}`;

  return (
    <div>
      <h1>Scan to Pair</h1>
      <QRCodeCanvas value={pairingURL} />
      <button onClick={onNext}>Simulate Pairing Complete</button>
    </div>
  );
};

export default Pairing;
