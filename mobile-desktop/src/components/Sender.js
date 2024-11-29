import React, { useState } from "react";
import Peer from "peerjs";


const Sender = () => {
  const [peer, setPeer] = useState(new Peer(null, { debug: 2 }));
  const [conn, setConn] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [status, setStatus] = useState("Disconnected");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const connect = () => {
    const connection = peer.connect(receiverId);
    connection.on("open", () => {
      setConn(connection);
      setStatus(`Connected to ${receiverId}`);
    });

    connection.on("data", (data) => {
      setMessages((prev) => [...prev, `Peer: ${data}`]);
    });
  };

  const sendMessage = () => {
    if (conn && conn.open) {
      conn.send(inputMessage);
      setMessages((prev) => [...prev, `Self: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  return (
    <div className="sender">
      <h2>Sender</h2>
      <input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <button onClick={connect}>Connect</button>
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

export default Sender;
