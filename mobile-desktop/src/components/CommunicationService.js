import Peer from "peerjs";

class CommunicationService {
  constructor() {
    this.peer = null; // PeerJS instance
    this.connection = null; // Connection with the mobile app
    this.onConnectionCallback = null; // Callback for new connections
    this.onDataCallback = null; // Callback for incoming data
  }

  async initializePeer() {
    return new Promise((resolve, reject) => {
      try {
        // Initialize the PeerJS instance using the default server
        this.peer = new Peer();

        this.peer.on("open", (id) => {
          console.log("Desktop PeerJS ID:", id);
          resolve(id); // Return the generated PeerJS ID
        });

        this.peer.on("error", (err) => {
          console.error("PeerJS Error:", err);
          reject(err);
        });

        this.peer.on("connection", (conn) => {
          console.log("Connection received from peer:", conn.peer);
          this.connection = conn;

          if (this.onConnectionCallback) {
            this.onConnectionCallback(conn);
          }

          conn.on("data", (data) => {
            console.log("Data received from peer:", data);
            if (this.onDataCallback) {
              this.onDataCallback(data);
            }
          });

          conn.on("close", () => {
            console.log("Connection closed.");
            this.connection = null;
          });

          conn.on("error", (err) => {
            console.error("Connection error:", err);
          });
        });
      } catch (error) {
        console.error("Error initializing PeerJS:", error.message);
        reject(error);
      }
    });
  }

  connectToPeer(peerId) {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error("Peer instance is not initialized."));
        return;
      }

      const conn = this.peer.connect(peerId); // Connect to the peer ID

      conn.on("open", () => {
        console.log("Connection established with peer:", peerId);
        this.connection = conn;
        resolve(conn);
      });

      conn.on("data", (data) => {
        console.log("Data received from peer:", data);
        if (this.onDataCallback) {
          this.onDataCallback(data);
        }
      });

      conn.on("close", () => {
        console.log("Connection closed.");
        this.connection = null;
      });

      conn.on("error", (err) => {
        console.error("Connection error:", err);
        reject(err);
      });
    });
  }

  onConnection(callback) {
    this.onConnectionCallback = callback; // Set a callback for new connections
  }

  onData(callback) {
    this.onDataCallback = callback; // Set a callback for incoming data
  }

  sendMessage(message) {
    if (this.connection && this.connection.open) {
      this.connection.send(message);
      console.log("Sent message:", message);
    } else {
      console.error("Cannot send message. No active connection.");
    }
  }

  destroy() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

const communicationService = new CommunicationService();
export default communicationService;
