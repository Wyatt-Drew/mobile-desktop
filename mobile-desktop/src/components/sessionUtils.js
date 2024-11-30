export const initializeSession = async (setWs, setCurrentScreen, SCREENS, setStatus) => {
    try {
      const response = await fetch("https://mobile-backend-74th.onrender.com/generate-session");
      const data = await response.json();
      const sessionId = data.sessionId;
  
      setStatus(`Connected to session: ${sessionId}`);
      console.log("Generated session ID:", sessionId);
  
      const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");
  
      socket.onopen = () => {
        setWs(socket);
        console.log("WebSocket connection opened.");
  
        const registerMessage = {
          type: "register",
          sessionId,
        };
        console.log("Sending message:", registerMessage);
        socket.send(JSON.stringify(registerMessage));
      };
  
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Message received:", message);
  
        if (message.type === "mobileConnected") {
          console.log("Mobile app connected. Transitioning to Subject ID input.");
          setCurrentScreen(SCREENS.SUBJECT_ID);
        } else {
          console.log("Unhandled message type:", message.type);
        }
      };
  
      socket.onclose = () => {
        console.log("WebSocket connection closed.");
        setStatus("Connection closed.");
      };
  
      socket.onerror = (err) => console.error("WebSocket error:", err);
  
      return sessionId;
    } catch (err) {
      console.error("Error generating session ID:", err);
      setStatus("Failed to generate session ID.");
      throw err;
    }
  };
  