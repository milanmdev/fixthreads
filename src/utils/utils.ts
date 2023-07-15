/* Error Builder */
class HttpError {
  statusCode: number;
  errMessage: string;

  constructor(statusCode: number, errMessage: string) {
    this.statusCode = statusCode;
    this.errMessage = errMessage;
  }
}

export { HttpError };
