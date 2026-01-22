import { z } from "zod";

export const StartChatSchema = z.object({
  initialMessage: z.string().min(1, "Message is required").max(4000),
});

