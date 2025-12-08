import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  pagination?: ApiResponse<T>['pagination']
): void => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  res.status(statusCode).json(response);
};

