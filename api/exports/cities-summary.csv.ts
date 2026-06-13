import {
  createRequestId,
  getSummaryCsv,
  sendCsv,
  setCsvHeaders,
  setJsonHeaders,
  type ApiRequest,
  type ApiResponse,
} from "../_cityApi";

export default function handler(request: ApiRequest, response: ApiResponse) {
  const requestId = createRequestId();

  if (request.method && request.method !== "GET") {
    setJsonHeaders(response, requestId);
    return response.status(405).json({ error: "Method not allowed", requestId });
  }

  setCsvHeaders(response, "cities-summary.csv", requestId);
  return sendCsv(response, 200, getSummaryCsv());
}
