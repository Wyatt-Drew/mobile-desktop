import React, { useEffect } from "react";

const StartScreen = ({ onBegin, webSocket }) => {
  useEffect(() => {
    if (webSocket) {
      // Set up WebSocket message listener
      webSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Message received on StartScreen:", message);

          if (message.type === "begin") {
            console.log("Received 'begin' signal from mobile app.");
            onBegin(); // Trigger the transition to the countdown
          }
        } catch (error) {
          console.error("Error processing WebSocket message on StartScreen:", error);
        }
      };

      // Clean up WebSocket listener on component unmount
      return () => {
        webSocket.onmessage = null;
      };
    }
  }, [webSocket, onBegin]);

  return (
    <div className="App">
      <h1>Welcome to the Study</h1>
    </div>
  );
};

export default StartScreen;
