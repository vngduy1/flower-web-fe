export interface ApiError {
  name: "ApiError";
  message: string;
  messages: string[];
  statusCode: number | null;
  code: string | null;
  isNetworkError: boolean;
  isTimeout: boolean;
}
