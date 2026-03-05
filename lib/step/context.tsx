"use client";

import { createContext, useContext } from "react";
import { Paginate } from "../paginate";
import { DeleteStepPayload, DuplicateStepPayload, PostStepPayload, PostStepsPositionPayload, PutStepPayload, Step, StepState } from "./types";

export interface StepContextType extends StepState {
  getSteps: (workflowId: string) => Promise<Paginate<Step>>;
  postStep: (payload: PostStepPayload) => Promise<void>;
  putStep: (payload: PutStepPayload) => Promise<void>;
  deleteStep: (payload: DeleteStepPayload) => Promise<void>;
  duplicateStep: (payload: DuplicateStepPayload) => Promise<void>;
  postStepsPosition: (payload: PostStepsPositionPayload) => Promise<void>;
}

export const StepContext = createContext<StepContextType | undefined>(undefined);

export const useStep = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStep must be used within StepProvider");
  }
  return context;
};
