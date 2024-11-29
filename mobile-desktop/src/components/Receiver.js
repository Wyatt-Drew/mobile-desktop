import React, { useEffect, useState } from "react";
import Peer from "peerjs";

const Receiver = () => {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [status, setStatus] = useState("Awaiting connection...");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const newPeer = new Peer(null, { debug: 2 });

    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    newPeer.on("connection", (connection) => {
      setConn(connection);
      setStatus("Connected");
      connection.on("data", (data) => {
        setMessages((prev) => [...prev, `Peer: ${data}`]);
      });
    });

    setPeer(newPeer);

    return () => newPeer.destroy();
  }, []);

  const sendMessage = () => {
    if (conn && conn.open) {
      conn.send(inputMessage);
      setMessages((prev) => [...prev, `Self: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  return (
    <div className="receiver">
      <h2>Receiver</h2>
      <p>ID: {peerId}</p>
      <p>Status: {status}</p>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Enter a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default Receiver;
