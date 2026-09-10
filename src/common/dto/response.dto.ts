export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;

  constructor(success: boolean, message: string, data?: T, errors?: string[]) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string, errors?: string[]): ApiResponse {
    return new ApiResponse(false, message, undefined, errors);
  }
}
