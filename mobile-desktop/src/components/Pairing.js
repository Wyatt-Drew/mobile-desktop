import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Pairing = () => {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    // Create a dynamic pairing value
    const pairingData = {
      sessionId: "abc123", // Replace with your session logic
      timestamp: new Date().toISOString(),
    };

    const encodedData = JSON.stringify(pairingData); // Convert to JSON string
    setOffer(encodedData); // Set the QR code content
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Scan to Pair</h1>
      {offer ? (
        <div style={styles.qrWrapper}>
          <QRCodeCanvas
            value={offer}
            size={250}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
            includeMargin={true}
          />
          <p style={styles.debugText}>Scan the QR code to pair with the app.</p>
        </div>
      ) : (
        <p style={styles.debugText}>Generating QR code...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  qrWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  debugText: {
    fontSize: "14px",
    marginTop: "10px",
    color: "#555",
  },
};

export default Pairing;
