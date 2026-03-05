import { Paginate } from "@/lib/paginate";
import { DeleteStepPayload, DuplicateStepPayload, PostStepPayload, PostStepsPositionPayload, PutStepPayload, Step } from "./types";

export const handleGetSteps = async (workflowId: string): Promise<Paginate<Step>> => {
  const response = await fetch(`/api/workflows/${workflowId}/steps?itemsPerPage=100`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch steps");
  }

  return response.json();
};

export const handlePostStep = async (payload: PostStepPayload): Promise<void> => {
  const response = await fetch(`/api/workflows/${payload.workflowId}/steps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create step");
  }
};

export const handlePostStepsPosition = async (payload: PostStepsPositionPayload): Promise<void> => {
  const response = await fetch(`/api/workflows/${payload.workflowId}/steps/position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update steps position");
  }
};

export const handlePutStep = async (payload: PutStepPayload): Promise<void> => {
  const { workflowId, stepId, ...updates } = payload;

  const response = await fetch(`/api/workflows/${workflowId}/steps/${stepId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stepId,
      ...updates,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update step");
  }
};

export const handleDeleteStep = async (payload: DeleteStepPayload): Promise<void> => {
  const { workflowId, stepId } = payload;

  const response = await fetch(`/api/workflows/${workflowId}/steps/${stepId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete step");
  }
};

export const handleDuplicateStep = async (payload: DuplicateStepPayload): Promise<void> => {
  const { workflowId, stepId } = payload;

  const response = await fetch(`/api/workflows/${workflowId}/steps/${stepId}/duplicate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to duplicate step");
  }
};
