import APP_ERRORS from './types';

class AppError {
  public readonly message: string;

  public readonly type: APP_ERRORS;

  constructor(message: string, type: APP_ERRORS) {
    this.message = message;
    this.type = type;
  }
}

export default AppError;
