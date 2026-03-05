import { Paginate } from "../paginate";

export interface Project {
  id: string;
  isActive: boolean;
  name: string;
}

export interface ProjectState {
  projects: Paginate<Project>;
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface PostProjectPayload {
  name: string;
}

export interface PostActivateProjectPayload {
  projectId: string;
}

export type ProjectAction =
  | { type: "SET_PROJECTS"; payload: Paginate<Project>; project: Project | null }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
