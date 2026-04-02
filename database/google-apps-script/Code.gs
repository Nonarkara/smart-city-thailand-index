const SHEET_NAME = "signals";
const DEFAULT_HEADERS = [
  "id",
  "city_id",
  "source",
  "channel",
  "text_body",
  "sentiment_label",
  "sentiment_score",
  "themes",
  "observed_at",
  "ingested_at",
];

function doGet(e) {
  if (!isAuthorized_(e)) {
    return jsonResponse_({ error: "Unauthorized" }, 401);
  }

  const action = (e.parameter.action || "status").toLowerCase();
  if (action === "list") {
    const limit = Math.min(Number(e.parameter.limit || 12), 50);
    return jsonResponse_({ signals: listSignals_(limit) });
  }

  return jsonResponse_({
    ok: true,
    sheet: SHEET_NAME,
    count: listSignals_(1_000).length,
  });
}

function doPost(e) {
  if (!isAuthorized_(e)) {
    return jsonResponse_({ error: "Unauthorized" }, 401);
  }

  const payload = JSON.parse((e.postData && e.postData.contents) || "{}");
  const record = normalizeSignal_(payload);

  if (!record.text_body) {
    return jsonResponse_({ error: "Signal text is required" }, 400);
  }

  appendSignal_(record);
  return jsonResponse_({ ok: true, signal: record });
}

function normalizeSignal_(payload) {
  const now = new Date().toISOString();
  const sentiment = payload.sentiment_label || payload.sentiment || "neutral";
  const themes = Array.isArray(payload.themes)
    ? payload.themes.join("|")
    : String(payload.themes || "")
        .split(/[|,]/)
        .map(item => item.trim())
        .filter(Boolean)
        .join("|");

  return {
    id: payload.id || Utilities.getUuid(),
    city_id: payload.city_id || payload.cityId || "",
    source: String(payload.source || "unknown"),
    channel: String(payload.channel || "manual"),
    text_body: String(payload.text_body || payload.text || ""),
    sentiment_label: ["positive", "neutral", "negative"].indexOf(sentiment) >= 0 ? sentiment : "neutral",
    sentiment_score: Number(payload.sentiment_score || payload.sentimentScore || 0),
    themes: themes,
    observed_at: payload.observed_at || payload.observedAt || now,
    ingested_at: payload.ingested_at || payload.createdAt || now,
  };
}

function appendSignal_(record) {
  const sheet = getSheet_();
  ensureHeaders_(sheet);
  sheet.appendRow([
    record.id,
    record.city_id,
    record.source,
    record.channel,
    record.text_body,
    record.sentiment_label,
    record.sentiment_score,
    record.themes,
    record.observed_at,
    record.ingested_at,
  ]);
}

function listSignals_(limit) {
  const sheet = getSheet_();
  ensureHeaders_(sheet);
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1);

  return rows
    .map(row => ({
      id: row[0],
      city_id: row[1] || null,
      source: row[2],
      channel: row[3],
      text_body: row[4],
      sentiment_label: row[5],
      sentiment_score: Number(row[6] || 0),
      themes: String(row[7] || "")
        .split("|")
        .map(item => item.trim())
        .filter(Boolean),
      observed_at: row[8],
      ingested_at: row[9],
    }))
    .sort((left, right) => new Date(right.observed_at).getTime() - new Date(left.observed_at).getTime())
    .slice(0, limit);
}

function getSheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SMART_CITY_SIGNAL_SHEET_ID");
  const spreadsheet = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(DEFAULT_HEADERS);
  }
}

function isAuthorized_(e) {
  const expected = PropertiesService.getScriptProperties().getProperty("SMART_CITY_SIGNAL_SECRET");
  if (!expected) return true;
  return e.parameter.secret === expected;
}

function jsonResponse_(payload, status) {
  const finalPayload = status
    ? Object.assign({ status: status }, payload)
    : payload;

  return ContentService
    .createTextOutput(JSON.stringify(finalPayload))
    .setMimeType(ContentService.MimeType.JSON);
}
