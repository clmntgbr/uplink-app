"use client";

import { useCallback, useEffect, useReducer } from "react";
import { initPaginate } from "../paginate";
import { handleGetProjects, handlePostActivateProject, handlePostProject } from "./api";
import { ProjectContext } from "./context";
import { ProjectReducer } from "./reducer";
import { PostActivateProjectPayload, PostProjectPayload, Project, ProjectState } from "./types";

const initialState: ProjectState = {
  projects: initPaginate<Project>(),
  project: null,
  isLoading: false,
  error: null,
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ProjectReducer, initialState);

  const getProjects = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const projects = await handleGetProjects();
      dispatch({ type: "SET_PROJECTS", payload: projects, project: projects.members.find((project) => project.isActive) ?? null });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch projects" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const postProject = useCallback(
    async (payload: PostProjectPayload) => {
      await handlePostProject(payload);
      await getProjects();
    },
    [getProjects],
  );

  const postActivateProject = useCallback(
    async (payload: PostActivateProjectPayload) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await handlePostActivateProject(payload);
        await getProjects();
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to activate project" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [getProjects],
  );

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        getProjects,
        postProject,
        postActivateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
