"use client";

import { useCallback, useEffect, useReducer } from "react";
import { initPaginate } from "../paginate";
import { useProject } from "../project/context";
import { handleGetEndpoints, handlePostEndpoint } from "./api";
import { EndpointContext } from "./context";
import { EndpointReducer } from "./reducer";
import { Endpoint, EndpointState, PostEndpointPayload } from "./types";

const initialState: EndpointState = {
  endpoints: initPaginate<Endpoint>(),
  isLoading: false,
  error: null,
};

export function EndpointProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(EndpointReducer, initialState);
  const { project } = useProject();

  const getEndpoints = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const endpoints = await handleGetEndpoints();
      dispatch({ type: "SET_ENDPOINTS", payload: endpoints });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch endpoints" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const postEndpoint = useCallback(
    async (payload: PostEndpointPayload) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await handlePostEndpoint(payload);
        await getEndpoints();
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to create endpoint" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [getEndpoints],
  );

  useEffect(() => {
    if (project?.id) {
      getEndpoints();
    }
  }, [getEndpoints, project?.id]);

  return (
    <EndpointContext.Provider
      value={{
        ...state,
        getEndpoints,
        postEndpoint,
      }}
    >
      {children}
    </EndpointContext.Provider>
  );
}
