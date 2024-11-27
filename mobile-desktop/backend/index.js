const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");
const WebSocket = require("ws");
const credentials = require("./mobile-dev-experiment-ff2e23e2fde6.json");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory store for session states
const sessions = {}; // Store session data
const sessionConnections = {}; // Store WebSocket connections per session

// Google Sheets setup
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1i3Z9ACsSaOypzC7TZv_JLTvcwJfKAKh0jTpSdjcubLU";

// Health Check Endpoint (Optional)
app.get("/", (req, res) => {
  res.send("Backend and WebSocket Server is running.");
});

// Endpoint to generate a new session
app.get("/generate-session", (req, res) => {
  try {
    const sessionId = uuidv4();
    sessions[sessionId] = { paired: false, instructions: [] };
    console.log(`Session created: ${sessionId}`);
    res.json({ sessionId });
  } catch (error) {
    console.error("Error generating session:", error);
    res.status(500).json({ error: "Failed to generate session" });
  }
});

// Endpoint to check if a session is paired
app.get("/check-pairing", (req, res) => {
  try {
    const { session } = req.query;
    if (!session || !sessions[session]) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ paired: sessions[session].paired });
  } catch (error) {
    console.error("Error checking pairing:", error);
    res.status(500).json({ error: "Failed to check pairing status" });
  }
});

// Endpoint to mark a session as paired
app.post("/pair", (req, res) => {
  try {
    const { session } = req.body;
    if (!session || !sessions[session]) {
      return res.status(404).json({ error: "Session not found" });
    }

    sessions[session].paired = true;
    console.log(`Session paired: ${session}`);
    res.json({ message: "Session paired successfully" });
  } catch (error) {
    console.error("Error pairing session:", error);
    res.status(500).json({ error: "Failed to pair session" });
  }
});

// Endpoint to append data to Google Sheets
app.post("/append-row", async (req, res) => {
  try {
    const { sheetName, values } = req.body;

    if (!sheetName || !values) {
      return res.status(400).json({ error: "Missing sheetName or values" });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      resource: {
        values: [values],
      },
    });

    console.log("Row added to Google Sheets:", values);
    res.status(200).json({ message: "Row added successfully" });
  } catch (error) {
    console.error("Error appending to Google Sheets:", error);
    res.status(500).json({ error: "Failed to append row" });
  }
});

// Start Express Server and WebSocket Server on the same port
const server = app.listen(5000, () => {
  console.log(`Server running on http://localhost:5000`);
});

// WebSocket Server Setup
const wss = new WebSocket.Server({ server });

// Handle WebSocket Connections
wss.on("connection", (ws, req) => {
  const sessionId = req.url.split("?session=")[1]; // Extract session ID from query
  if (!sessionId || !sessions[sessionId]) {
    ws.close(); // Close connection if session ID is invalid
    return;
  }

  sessionConnections[sessionId] = ws; // Store connection

  console.log(`WebSocket connected for session ${sessionId}`);

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log(`Message from session ${sessionId}:`, data);

    if (data.type === "register") {
      sessions[data.sessionId] = ws;
      console.log(`Session registered: ${data.sessionId}`);
    } else if (data.type === "join") {
      const hostSocket = sessionConnections[data.sessionId];
      if (hostSocket) {
        console.log(`Mobile joined session: ${data.sessionId}`);
        hostSocket.send(JSON.stringify({ type: "joined", sessionId: data.sessionId }));
        ws.send(JSON.stringify({ type: "joined", sessionId: data.sessionId }));
        hostSocket.partnerSocket = ws;
        ws.partnerSocket = hostSocket;
      } else {
        ws.send(JSON.stringify({ type: "error", message: "Session not found" }));
      }
    } else if (data.type === "offer" || data.type === "answer") {
      if (ws.partnerSocket) {
        ws.partnerSocket.send(JSON.stringify(data));
      }
    }
  });

  ws.on("close", () => {
    console.log(`WebSocket closed for session ${sessionId}`);
    delete sessionConnections[sessionId];
  });
});

// Function to send instructions to a session
const sendInstructions = (sessionId, instructions) => {
  const ws = sessionConnections[sessionId];
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ instructions }));
  }
};

// Endpoint to send instructions to a session
app.post("/send-instructions", (req, res) => {
  const { session, instructions } = req.body;
  if (!session || !sessions[session]) {
    return res.status(404).json({ error: "Session not found" });
  }

  sendInstructions(session, instructions);
  res.json({ message: "Instructions sent" });
}); 