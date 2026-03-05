import jwt from "jsonwebtoken";

export interface JWTPayload {
  email?: string;
  roles?: string[];
  id?: string;
  firstname?: string;
  lastname?: string;
  sub?: string;
  [key: string]: unknown;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
