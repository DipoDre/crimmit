import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  GoneException,
  HttpException,
  HttpStatus,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res: Response = ctx.getResponse<Response>();
    const req: Request = ctx.getRequest<Request>();

    /**
     * HttpException handler
     */
    if (exception instanceof HttpException) {
      const status: HttpStatus = exception.getStatus();
      const response = exception.getResponse();
      if (
        status === HttpStatus.UNPROCESSABLE_ENTITY ||
        status === HttpStatus.NOT_ACCEPTABLE ||
        status === HttpStatus.NOT_FOUND ||
        status === HttpStatus.BAD_REQUEST
      ) {
        return res.status(status).json({
          statusCode: status,
          error: {
            info: exception.getResponse,
            message: response ? response['message'] : exception.message,
          },
        });
      }
    }

    /**
     * Not Found Exception
     */
    if (exception instanceof NotFoundException) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        error: {
          path: req.url ?? '',
          message: 'Not Found',
        },
      });
    }

    if (exception instanceof UnauthorizedException) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: {
          message: exception.message ? exception.message : 'Unauthenticated',
        },
      });
    }

    if (exception instanceof GoneException) {
      return res.status(HttpStatus.GONE).json({
        statusCode: HttpStatus.GONE,
        error: {
          message: exception.message || 'Not Found',
        },
      });
    }

    if (exception instanceof ConflictException) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        error: {
          message: exception.message || 'Bad Request',
        },
      });
    }

    if (exception instanceof RequestTimeoutException) {
      return res.status(HttpStatus.REQUEST_TIMEOUT).json({
        statusCode: HttpStatus.REQUEST_TIMEOUT,
        error: {
          message: 'Request Timeout',
        },
      });
    }

    if (exception instanceof ForbiddenException) {
      return res.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        error: {
          message: exception.message ? exception.message : 'Forbidden',
        },
      });
    }

    if (exception instanceof BadRequestException) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: {
          message: exception.message ? exception.message : 'Bad Request',
        },
      });
    }

    if (exception.details) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          path: req.url ?? '',
          message: exception.details || 'unprocessable entity',
        },
      });
    }

    if (exception.bsonError) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          path: req.url ?? '',
          message: exception.message || 'unprocessable entity',
        },
      });
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: { path: req.url ?? '', message: 'internal server error' },
    });
  }
}
