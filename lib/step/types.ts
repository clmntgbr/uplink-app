import { Endpoint } from "@/lib/endpoint/types";

export interface Step {
  id: string;
  name: string;
  position: number;
  endpoint: Endpoint;
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  header: Record<string, unknown>;
  response: Record<string, unknown>;
  setVariables?: Record<string, string>;
}

export interface PostStepPayload {
  endpointId: string;
  workflowId: string;
  name: string;
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  header: Record<string, unknown>;
  response: Record<string, unknown>;
  setVariables?: Record<string, string>;
}

export interface PutStepsReorderPayload {
  workflowId: string;
  steps: { stepId: string; position: number }[];
}

export interface PutStepPayload {
  workflowId: string;
  stepId: string;
  endpointId: string;
  name: string;
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  header: Record<string, unknown>;
  response: Record<string, unknown>;
  setVariables?: Record<string, string>;
  variables?: Array<Record<string, string>>;
}

export interface DeleteStepPayload {
  workflowId: string;
  stepId: string;
}

export interface DuplicateStepPayload {
  workflowId: string;
  stepId: string;
}

export interface StepState {
  isLoading: boolean;
  error: string | null;
}

export type StepAction = { type: "SET_ERROR"; payload: string } | { type: "SET_LOADING"; payload: boolean };
