/**
 * SCITI 2026 — Visitor Tracking Google Apps Script
 *
 * Deploy this as a Google Apps Script Web App attached to a Google Sheet.
 *
 * SETUP:
 * 1. Create a new Google Sheet: "SCITI 2026 Visitor Tracking"
 * 2. Rename Sheet1 to "Visitors"
 * 3. Add headers in row 1: timestamp | ip | country | region | city | userAgent | referrer | page | version
 * 4. Open Extensions → Apps Script
 * 5. Paste this entire file
 * 6. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the deployment URL → set as VITE_SCITI_TRACKING_URL in .env
 *
 * The script handles two actions:
 * - POST: Log a new visitor (fire-and-forget from the frontend)
 * - GET ?action=count: Return visitor count + country breakdown
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Visitors");
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toISOString(),
      data.ip || "Unknown",
      data.country || "Unknown",
      data.region || "Unknown",
      data.city || "Unknown",
      (data.userAgent || "Unknown").substring(0, 200),
      (data.referrer || "Direct").substring(0, 200),
      data.page || "/",
      data.version || "v1",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var action = (e.parameter.action || "").toLowerCase();

  if (action === "count") {
    return getVisitorStats();
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "SCITI 2026 Visitor Tracking" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getVisitorStats() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Visitors");
  var data = sheet.getDataRange().getValues();
  var count = Math.max(0, data.length - 1); // Subtract header row

  // Country breakdown
  var countryCounts = {};
  for (var i = 1; i < data.length; i++) {
    var country = data[i][2] || "Unknown";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  }

  // Sort by count, take top 10
  var countries = Object.keys(countryCounts)
    .map(function(k) { return { country: k, count: countryCounts[k], pct: Math.round((countryCounts[k] / count) * 100) }; })
    .sort(function(a, b) { return b.count - a.count; })
    .slice(0, 10);

  return ContentService
    .createTextOutput(JSON.stringify({ count: count, countries: countries }))
    .setMimeType(ContentService.MimeType.JSON);
}
