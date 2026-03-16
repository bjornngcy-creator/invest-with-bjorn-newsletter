// Google Apps Script — paste this into script.google.com
// Receives form submissions and writes to a Google Sheet

const SHEET_NAME = "Subscribers"; // tab name in your sheet

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || "",
      data.email || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add header row
    sheet.appendRow(["Timestamp", "Name", "Email"]);
    sheet.getRange("A1:C1").setFontWeight("bold");
  }

  return sheet;
}

// Optional: test locally inside the script editor
function testPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        timestamp: new Date().toISOString(),
      }),
    },
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
