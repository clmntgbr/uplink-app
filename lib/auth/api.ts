import { LoginPayload, RegisterPayload } from "@/lib/auth/types";
import { User } from "@/lib/user/types";

export const handleLogin = async (payload: LoginPayload): Promise<{ user: User; token: string }> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.key || "Login failed");
  }

  return response.json();
};

export const handleRegister = async (payload: RegisterPayload): Promise<{ user: User; token: string }> => {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.key || "Registration failed");
  }

  return response.json();
};

export const handleLogout = async (): Promise<void> => {
  await fetch("/api/logout", {
    method: "POST",
  });
};
