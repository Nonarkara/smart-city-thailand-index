import {
  createRequestId,
  getCityOrNull,
  getQueryParam,
  setJsonHeaders,
  type ApiRequest,
  type ApiResponse,
} from "../_cityApi";

export default function handler(request: ApiRequest, response: ApiResponse) {
  const requestId = createRequestId();
  setJsonHeaders(response, requestId);

  if (request.method && request.method !== "GET") {
    return response.status(405).json({
      success: false,
      error: "Method not allowed",
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  const cityId = getQueryParam(request.query, "cityId");
  const city = getCityOrNull(cityId);

  if (!city) {
    return response.status(404).json({
      success: false,
      error: "City not found",
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  return response.status(200).json({
    success: true,
    data: city,
    requestId,
    timestamp: new Date().toISOString(),
  });
}
