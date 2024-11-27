import React, { useEffect } from "react";

const StartScreen = ({ onBegin, webSocket }) => {
  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Message received on StartScreen:", message);

          if (message.type === "begin") {
            console.log("Received 'begin' signal from mobile app.");
            onBegin(); // Transition to countdown
          }
        } catch (error) {
          console.error("Error processing WebSocket message on StartScreen:", error);
        }
      };
    }
  }, [webSocket, onBegin]);

  return (
    <div className="App">
      <h1>Welcome to the Study</h1>
      <button className="action-button" onClick={onBegin}>
        Begin (Manual)
      </button>
    </div>
  );
};

export default StartScreen;
