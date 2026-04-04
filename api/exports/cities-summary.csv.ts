import {
  createRequestId,
  getSummaryCsv,
  sendCsv,
  setCsvHeaders,
  type ApiRequest,
  type ApiResponse,
} from "../_cityApi";

export default function handler(request: ApiRequest, response: ApiResponse) {
  const requestId = createRequestId();
  setCsvHeaders(response, "cities-summary.csv", requestId);

  if (request.method && request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed", requestId });
  }

  return sendCsv(response, 200, getSummaryCsv());
}
