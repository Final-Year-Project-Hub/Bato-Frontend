import z from "zod";
import { StartChatSchema } from "./schema";

export type StartChatInput = z.infer<typeof StartChatSchema>;
