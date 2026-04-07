/**
 * SCITI 2026 — Visitor Tracking Google Apps Script
 *
 * Handles both tracking (GET with action=track) and stats (GET with action=count).
 * Using GET for tracking because POST redirects break with no-cors fetch.
 *
 * SETUP:
 * 1. Create Google Sheet "SCITI 2026 Visitor Tracking"
 * 2. Rename Sheet1 to "Visitors"
 * 3. Add headers in row 1: timestamp | ip | country | region | city | userAgent | referrer | page | version
 * 4. Extensions → Apps Script → paste this file
 * 5. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone)
 * 6. Copy URL → set as VITE_SCITI_TRACKING_URL
 */

function doGet(e) {
  var action = (e.parameter.action || "").toLowerCase();

  if (action === "track") {
    return trackVisitor(e);
  }

  if (action === "count") {
    return getVisitorStats();
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "SCITI 2026 Visitor Tracking" }))
    .setMimeType(ContentService.MimeType.JSON);
}

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

function trackVisitor(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Visitors");
    sheet.appendRow([
      new Date().toISOString(),
      e.parameter.ip || "Unknown",
      e.parameter.country || "Unknown",
      e.parameter.region || "Unknown",
      e.parameter.city || "Unknown",
      (e.parameter.ua || "Unknown").substring(0, 200),
      (e.parameter.ref || "Direct").substring(0, 200),
      e.parameter.page || "/",
      e.parameter.v || "v1",
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", tracked: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getVisitorStats() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Visitors");
  var data = sheet.getDataRange().getValues();
  var count = Math.max(0, data.length - 1);

  var countryCounts = {};
  for (var i = 1; i < data.length; i++) {
    var country = data[i][2] || "Unknown";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  }

  var countries = Object.keys(countryCounts)
    .map(function(k) { return { country: k, count: countryCounts[k], pct: Math.round((countryCounts[k] / count) * 100) }; })
    .sort(function(a, b) { return b.count - a.count; })
    .slice(0, 10);

  return ContentService
    .createTextOutput(JSON.stringify({ count: count, countries: countries }))
    .setMimeType(ContentService.MimeType.JSON);
}
