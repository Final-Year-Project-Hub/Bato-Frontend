// features/chat/service.ts
import { StartChatInput } from "./types";
import validate from "../shared/validator";
import { StartChatSchema } from "./schema";
import { getSignedInUser } from "../auth/service";
import { InvalidDataError } from "../shared/errors";

type ChatApiResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};

export async function startChat(
  input: StartChatInput,
): Promise<ChatApiResponse> {
  const attributes = validate(StartChatSchema, input);

  const user = await getSignedInUser();
  if (!user) {
    throw new InvalidDataError({}, "Not authenticated");
  }
  console.log("user", user);

  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new InvalidDataError({}, "Missing API_URL");
  }

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      userId: user.id,
      initialMessage: attributes.initialMessage,
    }),
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new InvalidDataError({}, json?.message || "Chat failed");
  }

  return json as ChatApiResponse;
}
