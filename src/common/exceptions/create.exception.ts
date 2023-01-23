import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateException extends HttpException {
  constructor(error: any, entity: string) {
    let message = '';
    let statusCode = HttpStatus.BAD_REQUEST;

    if (error.code === 11000) {
      message = `${entity} existe en la base de datos.`;
    } else {
      message = `No se puede crear ${entity}.`;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    super(
      {
        statusCode,
        message,
        error: 'Error',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
