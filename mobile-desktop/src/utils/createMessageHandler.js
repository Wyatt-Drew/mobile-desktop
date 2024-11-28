const createMessageHandler = ({
  webSocket,
  peerConnection,
  setPeerConnection,
  setState,
  nextState,
  setError,
  setSubjectID,
  setStudyComplete,
  targets,
  currentPDFIndex,
  setCurrentPDFIndex,
  currentTargetIndex,
  setCurrentTargetIndex,
}) => {
  const handleBegin = () => {
    console.log("Handling 'begin' message...");
    nextState();
  };

  const handleOffer = async (offer) => {
    console.log("Handling 'offer' message...");
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          webSocket.send(JSON.stringify({ type: "candidate", candidate: e.candidate }));
        }
      };

      pc.ondatachannel = (e) => {
        const dataChannel = e.channel;
        dataChannel.onopen = () => console.log("Data channel is open");
        dataChannel.onmessage = (e) => console.log("Message from data channel:", e.data);
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      webSocket.send(JSON.stringify({ type: "answer", answer }));
      setPeerConnection(pc);
    } catch (err) {
      console.error("Error setting up WebRTC connection:", err);
      setError("Failed to set up WebRTC connection. Please retry.");
    }
  };

  const handleError = (error) => {
    console.error("Handling 'error' message:", error);
    setError(error);
  };

  return (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);

      switch (message.type) {
        case "begin":
          handleBegin();
          break;

        case "offer":
          handleOffer(message.offer);
          break;

        case "error":
          handleError(message.error);
          break;

        default:
          console.warn("Unhandled message type:", message.type);
      }
    } catch (err) {
      console.error("Error processing WebSocket message:", err);
      setError("Unexpected error occurred while processing the message.");
    }
  };
};

export default createMessageHandler;
