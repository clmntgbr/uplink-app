"use client";

import { useCallback, useEffect, useReducer } from "react";
import { initPaginate } from "../paginate";
import { useProject } from "../project/context";
import { handleGetWorkflow, handleGetWorkflows, handlePostWorkflow } from "./api";
import { WorkflowContext } from "./context";
import { WorkflowReducer } from "./reducer";
import { PostWorkflowPayload, Workflow, WorkflowState } from "./types";

const initialState: WorkflowState = {
  workflows: initPaginate<Workflow>(),
  isLoading: false,
  error: null,
};

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(WorkflowReducer, initialState);
  const { project } = useProject();

  const getWorkflows = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const workflows = await handleGetWorkflows();
      dispatch({ type: "SET_WORKFLOWS", payload: workflows });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch workflows" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const getWorkflow = useCallback(async (workflowId: string): Promise<Workflow> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const workflow = await handleGetWorkflow(workflowId);
      return workflow;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch workflow" });
      throw new Error("Failed to fetch workflow");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const postWorkflow = useCallback(
    async (payload: PostWorkflowPayload) => {
      await handlePostWorkflow(payload);
      await getWorkflows();
    },
    [getWorkflows],
  );

  useEffect(() => {
    if (project?.id) {
      getWorkflows();
    }
  }, [getWorkflows, project?.id]);

  return (
    <WorkflowContext.Provider
      value={{
        ...state,
        getWorkflows,
        getWorkflow,
        postWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}
