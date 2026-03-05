import * as z from "zod";
import { HttpMethods } from "./types";

export const postEndpointSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters"),
  baseUri: z.string().min(1, "Base URI is required").url("Must be a valid URL"),
  path: z.string().min(1, "Path is required").startsWith("/", "Path must start with /"),
  method: z
    .string()
    .min(1, "Method is required")
    .refine((v) => (HttpMethods as readonly string[]).includes(v), "Invalid method"),
  timeoutSeconds: z
    .number()
    .int("Timeout must be an integer")
    .min(1, "Timeout must be at least 1 second")
    .max(300, "Timeout must be at most 300 seconds"),
  body: z.record(z.string(), z.unknown()),
  query: z.record(z.string(), z.string()),
  header: z.record(z.string(), z.string()),
});
