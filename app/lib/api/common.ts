export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

export class APIValidationError extends APIError {
  constructor(public status: number, message: string) {
    super(status, message);
    this.name = "APIValidationError";
  }
}

export const BASE_URL = "http://127.0.0.1:8000";
