import {
  createRequestId,
  listCities,
  setJsonHeaders,
  type ApiRequest,
  type ApiResponse,
} from "./_cityApi";

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

  return response.status(200).json(listCities(request, requestId));
}
