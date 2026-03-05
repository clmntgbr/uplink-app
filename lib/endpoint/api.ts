import { Paginate } from "@/lib/paginate";
import { Endpoint, PostEndpointPayload } from "./types";

export const handleGetEndpoints = async (): Promise<Paginate<Endpoint>> => {
  const response = await fetch("/api/endpoints", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch endpoints");
  }

  return response.json();
};

export const handlePostEndpoint = async (payload: PostEndpointPayload): Promise<void> => {
  const response = await fetch("/api/endpoints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create endpoint");
  }
};
