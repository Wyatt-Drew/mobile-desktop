import React from "react";
import "./App.css";

const TargetDisplay = ({ subjectId, pdfId, target, onTargetFound, onLogPerformance }) => {
  return (
    <div style={styles.container}>
      <div style={styles.arrowContainer}>
        {/* Title positioned above the arrow */}
        <h1 style={styles.title}>Find This Target</h1>
        
        <div style={styles.arrowWrapper}>
          <img
            src={`${process.env.PUBLIC_URL}/arrow.svg`}
            alt="Arrow"
            style={styles.arrow}
          />
        </div>
      </div>
      <div style={styles.imageContainer}>
        {/* Target image */}
        <img
          src={`${process.env.PUBLIC_URL}/targets/${pdfId}/${target}.png`}
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
    height: "98vh",
    flexDirection: "row",
  },
  arrowContainer: {
    display: "flex",
    flexDirection: "column", // Arrange title and arrow vertically
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
  },
  title: {
    marginBottom: "20px", // Add space between the title and the arrow
    fontSize: "2rem",
    fontWeight: "bold",
    color: "white", // Text color
    textAlign: "center",
  },
  arrowWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "200px", // Arrow width
    height: "100px", // Arrow height
  },
  arrow: {
    width: "100%", // Scale SVG to fit
    height: "auto", // Maintain aspect ratio
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
