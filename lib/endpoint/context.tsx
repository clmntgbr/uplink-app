"use client";

import { createContext, useContext } from "react";
import { EndpointState, PostEndpointPayload } from "./types";

export interface EndpointContextType extends EndpointState {
  getEndpoints: () => Promise<void>;
  postEndpoint: (payload: PostEndpointPayload) => Promise<void>;
}

export const EndpointContext = createContext<EndpointContextType | undefined>(undefined);

export const useEndpoint = () => {
  const context = useContext(EndpointContext);
  if (!context) {
    throw new Error("useEndpoint must be used within EndpointProvider");
  }
  return context;
};
