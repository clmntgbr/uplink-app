"use client";

import { createContext, useContext } from "react";
import { postWorkflowPayload, Workflow, WorkflowState } from "./types";

export interface WorkflowContextType extends WorkflowState {
  getWorkflows: () => Promise<void>;
  getWorkflow: (id: string) => Promise<Workflow>;
  postWorkflow: (payload: postWorkflowPayload) => Promise<void>;
}

export const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
};
