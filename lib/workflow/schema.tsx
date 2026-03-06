import z from "zod";

export const postWorkflowSchema = z.object({
  name: z.string().min(1, "A workflow name is required"),
  description: z.string().optional().nullable(),
});
