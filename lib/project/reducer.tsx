import { ProjectAction, ProjectState } from "./types";

export const ProjectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        project: action.project,
        isLoading: false,
        error: null,
      };
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
