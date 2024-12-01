import React, { useEffect, useState } from "react";
import "./App.css";

const TargetDisplay = ({ subjectId, pdfId, target, onTargetFound, onLogPerformance }) => {
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, [target]);

  const handleTargetFound = () => {
    const endTime = Date.now();
    const taskTime = ((endTime - startTime) / 1000).toFixed(2);

    console.log("Target Found:", {
      subjectId,
      pdfId,
      target,
      taskTime,
    });

    onLogPerformance({
      subjectId,
      pdfId,
      target,
      taskTime,
      scrollDistance: 0,
      numberOfTaps: 1,
    });

    onTargetFound();
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h1 style={styles.title}>Find This Target</h1>
          <button style={styles.button} onClick={handleTargetFound}>
            Target Found
          </button>
        </div>
      </div>
      <div style={styles.imageContainer}>
        <img
          src={process.env.PUBLIC_URL + `/targets/${pdfId}/${target}.png`}
          alt={`Target ${target}`}
          style={styles.image}
        />
      </div>
    </div>
  );
};

export default TargetDisplay;

const styles = {
  container: {
    display: "flex",
    height: "99vh",
    flexDirection: "row",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    maxWidth: "300px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    color: "black",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
  },
};
