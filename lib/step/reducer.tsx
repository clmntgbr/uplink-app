import { StepAction, StepState } from "./types";

export const StepReducer = (state: StepState, action: StepAction): StepState => {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
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
