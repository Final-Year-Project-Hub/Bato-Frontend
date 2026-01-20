import { isRedirectError } from "next/dist/client/components/redirect-error";
import { InvalidDataError } from "./errors";

type ErrorResponse = {
  status: "error";
  code?: string;
  message?: string;
  errors?: Record<string, string>;
};

type MaybePromise<T> = T | Promise<T>;

// Extract fn return (sync or async)
type FnResult<F> = F extends (...args: any[]) => MaybePromise<infer R>
  ? R
  : never;

// Extract transform return (sync or async)
type TransformResult<T> = T extends (arg: any) => MaybePromise<infer R>
  ? R
  : never;

export function makeAction<
  Fn extends (...args: any[]) => MaybePromise<any>,
  Transform extends (result: FnResult<Fn>) => MaybePromise<any> = (
    result: FnResult<Fn>
  ) => MaybePromise<{ status: "success"; data: FnResult<Fn> }>
>(fn: Fn, transform?: Transform) {
  return async function (
    ...args: Parameters<Fn>
  ): Promise<TransformResult<Transform> | ErrorResponse> {
    try {
      const data = (await fn(...args)) as FnResult<Fn>;

      const finalTransform =
        transform ??
        (((r: FnResult<Fn>) =>
          ({
            status: "success",
            data: r,
          } as const)) as Transform);

      return await finalTransform(data);
    } catch (error) {
      if (error instanceof InvalidDataError) {
        return {
          status: "error",
          code: "invalid_data",
          message: error.message,
          errors: error.errors,
        };
      }

      if (isRedirectError(error)) throw error;

      console.log(error);

      return {
        status: "error",
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  };
}
