import { initPaginate } from "../paginate";
import { Workflow, WorkflowAction, WorkflowState } from "./types";

export const WorkflowReducer = (state: WorkflowState, action: WorkflowAction): WorkflowState => {
  switch (action.type) {
    case "SET_WORKFLOWS":
      return {
        ...state,
        workflows: action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        workflows: initPaginate<Workflow>(),
        isLoading: false,
        error: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};
