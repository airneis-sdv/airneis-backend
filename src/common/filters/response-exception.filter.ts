import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from "express";
import { EntityPropertyNotFoundError } from "typeorm";

@Catch(Error)
export class ResponseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ResponseExceptionFilter.name);

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
    } else if (exception instanceof EntityPropertyNotFoundError) {
      responseData.statusCode = 400;
      responseData.message = "Bad request";
    } else {
      this.logger.error(`Exception occured while processing request in route: ${ctx.getRequest().url}`);
      this.logger.error(exception.stack ?? exception.message);
    }

    response.status(responseData.statusCode).json(responseData);
  }
}
