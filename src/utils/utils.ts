/* Error Builder */
class HttpError {
  statusCode: number;
  errMessage: string;

  constructor(statusCode: number, errMessage: string) {
    this.statusCode = statusCode;
    this.errMessage = errMessage;
  }
}

let GlobalVars = {
  name: "FixThreads - Consistent Embedding of Metadata for Threads",
};

export { HttpError, GlobalVars };
