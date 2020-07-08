export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPES.VALIDATION_ERROR;
    this.message = message;
  }
}
export class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPES.PERMISSION_ERROR;
    this.message = message;
  }
}
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPES.NOT_FOUND_ERROR;
    this.message = message;
  }
}
export class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPES.DATABASE_ERROR;
    this.message = message;
  }
}

export const ERROR_TYPES = {
  VALIDATION_ERROR: "Validation Error",
  PERMISSION_ERROR: "Permission Error",
  NOT_FOUND_ERROR: "Not Found Error",
  DATABASE_ERROR: "Database Error"
};
