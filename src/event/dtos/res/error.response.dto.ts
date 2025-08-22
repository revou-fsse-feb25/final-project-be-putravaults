export class ErrorResponseDto {
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  field?: string; // Optional field for validation errors
}

export class ValidationErrorResponseDto {
  message: string[];
  error: string;
  statusCode: number;
  timestamp: string;
}
