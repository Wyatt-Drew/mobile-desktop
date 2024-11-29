import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const Pairing = ({ peerId }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Scan to Pair</h1>
      <div style={styles.qrWrapper}>
        {peerId ? (
          <QRCodeCanvas value={peerId} size={200} />
        ) : (
          <p>Generating QR Code...</p>
        )}
      </div>
    </div>
  );
};

export default Pairing;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  qrWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};
