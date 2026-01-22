import z from "zod";
import { InvalidDataError } from "./errors";

export default function validate<K>(schema: z.ZodType<K>, data: unknown): K {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  const errors = result.error.issues.reduce((acc, issue) => {
    if (issue.path.length > 0) {
      const field = issue.path[0].toString();

      if (!acc[field]) {
        acc[field] = issue.message;
      }
    }
    return acc;
  }, {} as Record<string, string>);

  throw new InvalidDataError(errors);
}
