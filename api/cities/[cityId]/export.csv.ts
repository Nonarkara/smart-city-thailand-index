import {
  createRequestId,
  getCityOrNull,
  getFactsCsv,
  getQueryParam,
  sendCsv,
  setCsvHeaders,
  setJsonHeaders,
  type ApiRequest,
  type ApiResponse,
} from "../../_cityApi";

export default function handler(request: ApiRequest, response: ApiResponse) {
  const requestId = createRequestId();

  if (request.method && request.method !== "GET") {
    setJsonHeaders(response, requestId);
    return response.status(405).json({ error: "Method not allowed", requestId });
  }

  const cityId = getQueryParam(request.query, "cityId");
  if (!getCityOrNull(cityId)) {
    setJsonHeaders(response, requestId);
    return response.status(404).json({ error: "City not found", requestId });
  }

  setCsvHeaders(response, `${cityId || "city"}-facts.csv`, requestId);
  return sendCsv(response, 200, getFactsCsv(cityId));
}
