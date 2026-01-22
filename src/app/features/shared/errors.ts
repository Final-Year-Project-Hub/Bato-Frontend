export class NotAuthorizedError extends Error {
  constructor(message: string = "You are not authorized to perform this action.") {
    super(message);
    this.name = "NotAuthorizedError";
  }
}

export class NotAuthenticatedError extends Error {
  constructor(message: string = "You must be signed in to perform this action.") {
    super(message);
    this.name = "NotAuthenticatedError";
  }
}

export class InvalidDataError extends Error {
  hasErrors: boolean;
  errors: Record<string, string>;

  constructor(errors: Record<string, string> = {}, message = "") {
    super(message);

    this.name = "InvalidDataError";

    this.errors = errors;
    this.hasErrors = Object.keys(errors).length > 0;
  }
}
