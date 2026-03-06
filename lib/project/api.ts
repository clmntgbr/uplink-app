import { Paginate } from "../paginate";
import { PostActivateProjectPayload, PostProjectPayload, Project } from "./types";

export const handleGetProjects = async (): Promise<Paginate<Project>> => {
  const response = await fetch("/api/projects", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

export const handlePostProject = async (payload: PostProjectPayload): Promise<Project> => {
  const response = await fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
};

export const handlePostActivateProject = async (payload: PostActivateProjectPayload): Promise<Project> => {
  const response = await fetch(`/api/projects/${payload.projectId}/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to activate project");
  }

  return response.json();
};
