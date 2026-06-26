import { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    statusCode: number = 200,
    message: string = 'Success',
    data?: T
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    statusCode: number = 500,
    message: string = 'Internal Server Error',
    errors?: any
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}