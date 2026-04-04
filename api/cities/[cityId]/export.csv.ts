import {
  createRequestId,
  getCityOrNull,
  getFactsCsv,
  getQueryParam,
  sendCsv,
  setCsvHeaders,
  type ApiRequest,
  type ApiResponse,
} from "../../_cityApi";

export default function handler(request: ApiRequest, response: ApiResponse) {
  const requestId = createRequestId();
  const cityId = getQueryParam(request.query, "cityId");

  setCsvHeaders(response, `${cityId || "city"}-facts.csv`, requestId);

  if (request.method && request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed", requestId });
  }

  if (!getCityOrNull(cityId)) {
    return response.status(404).json({ error: "City not found", requestId });
  }

  return sendCsv(response, 200, getFactsCsv(cityId));
}
