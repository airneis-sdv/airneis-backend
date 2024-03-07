import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(Error)
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const responseData = {
      success: false,
      statusCode: 500,
      message: "Internal server error",
    }

    if (exception instanceof HttpException) {
      responseData.statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        responseData.message = exception.getResponse().toString();
      } else if ((exceptionResponse as any).message) {
        responseData.message = (exceptionResponse as any).message;
      } else {
        responseData.message = JSON.stringify(exceptionResponse);
      }
    }

    response.status(responseData.statusCode).json(responseData);
  }
}
