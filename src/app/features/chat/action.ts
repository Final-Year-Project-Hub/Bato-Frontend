"use server";

import { makeAction } from "../shared/utils";
import { startChat } from "./service";

export const startChatAction = makeAction(startChat, async (res) => ({
  status: "success" as const,
  message: res?.message || "Chat started.",
  data: res,
}));
