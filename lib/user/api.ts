import { User } from "./types";

export const handleGetUser = async (): Promise<User> => {
  const response = await fetch("/api/user", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};
