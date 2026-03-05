"use client";

import { useCallback, useReducer } from "react";
import { Paginate } from "../paginate";
import { handleDeleteStep, handleDuplicateStep, handleGetSteps, handlePostStep, handlePostStepsPosition, handlePutStep } from "./api";
import { StepContext } from "./context";
import { StepReducer } from "./reducer";
import { DeleteStepPayload, DuplicateStepPayload, PostStepPayload, PostStepsPositionPayload, PutStepPayload, Step, StepState } from "./types";

const initialState: StepState = {
  isLoading: false,
  error: null,
};

export function StepProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(StepReducer, initialState);

  const getSteps = useCallback(async (workflowId: string): Promise<Paginate<Step>> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const steps = await handleGetSteps(workflowId);
      return steps;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch steps" });
      throw new Error("Failed to fetch steps");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const postStep = useCallback(async (payload: PostStepPayload) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await handlePostStep(payload);
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to create step" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const putStep = useCallback(async (payload: PutStepPayload) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await handlePutStep(payload);
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to update step" });
      throw new Error("Failed to update step");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const postStepsPosition = useCallback(async (payload: PostStepsPositionPayload) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await handlePostStepsPosition(payload);
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to update step position" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const deleteStep = useCallback(async (payload: DeleteStepPayload) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await handleDeleteStep(payload);
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete step" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const duplicateStep = useCallback(async (payload: DuplicateStepPayload) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await handleDuplicateStep(payload);
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to duplicate step" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  return (
    <StepContext.Provider
      value={{
        ...state,
        getSteps,
        postStep,
        putStep,
        postStepsPosition,
        deleteStep,
        duplicateStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}
