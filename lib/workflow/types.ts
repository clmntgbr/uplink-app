import { Paginate } from "@/lib/paginate";

export interface Workflow {
  "@id": string;
  id: string;
  name: string;
  description?: string;
  variables?: Record<string, string>;
}

export interface PostWorkflowPayload {
  name: string;
  description?: string;
}

export interface WorkflowState {
  workflows: Paginate<Workflow>;
  isLoading: boolean;
  error: string | null;
}

export type WorkflowAction =
  | { type: "SET_WORKFLOWS"; payload: Paginate<Workflow> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
