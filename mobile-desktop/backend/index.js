const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const credentials = require("./mobile-dev-experiment-ff2e23e2fde6.json");

const app = express();
app.use(bodyParser.json());

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1i3Z9ACsSaOypzC7TZv_JLTvcwJfKAKh0jTpSdjcubLU";

app.post("/append-row", async (req, res) => {
  const { sheetName, values } = req.body;

  if (!sheetName || !values) {
    return res.status(400).json({ error: "Missing sheetName or values" });
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      resource: {
        values: [values],
      },
    });
    res.status(200).json({ message: "Row added successfully" });
  } catch (error) {
    console.error("Error appending row:", error);
    res.status(500).json({ error: "Failed to append row" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
