import { Paginate } from "@/lib/paginate";
import { JsonObject } from "../json";

export interface Endpoint {
  "@id": string;
  id: string;
  name: string;
  baseUri: string;
  path: string;
  method: string;
  header: JsonObject;
  body: JsonObject;
  query: JsonObject;
  timeoutSeconds: number;
}

export interface PostEndpointPayload {
  name: string;
  baseUri: string;
  path: string;
  method: string;
  header: JsonObject;
  body: JsonObject;
  query: JsonObject;
  timeout: number;
}

export interface EndpointState {
  endpoints: Paginate<Endpoint>;
  isLoading: boolean;
  error: string | null;
}

export const HttpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export type EndpointAction =
  | { type: "SET_ENDPOINTS"; payload: Paginate<Endpoint> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
