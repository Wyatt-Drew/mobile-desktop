export const createWebSocket = (sessionId, setStatus, onMessage) => {
    const socket = new WebSocket("wss://mobile-backend-74th.onrender.com");
  
    socket.onopen = () => {
      console.log("WebSocket connection opened.");
      const registerMessage = {
        type: "register",
        sessionId,
      };
      socket.send(JSON.stringify(registerMessage));
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);
      onMessage(message);
    };
  
    socket.onclose = () => {
      console.log("WebSocket connection closed.");
      setStatus("Connection closed.");
    };
  
    socket.onerror = (err) => console.error("WebSocket error:", err);
  
    return socket;
  };
  
  export const sendMessage = (ws, sessionId, type, message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type,
          sessionId,
          sender: "Sender",
          message,
        })
      );
      console.log(`Sent message: ${type} - ${message}`);
    } else {
      console.error("WebSocket is not connected.");
    }
  };
  