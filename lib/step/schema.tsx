import z from "zod";

export const createStepSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  body: z.record(z.string(), z.unknown()).default({}),
  query: z.record(z.string(), z.unknown()).default({}),
  header: z.record(z.string(), z.unknown()).default({}),
  setVariables: z.record(z.string(), z.string()).optional().default({}),
});

export const updateStepSchema = createStepSchema.extend({});
