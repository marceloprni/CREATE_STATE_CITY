import { AppException } from './app-exception';

export class UnauthorizedException extends AppException {
  constructor() {
    super('Acesso não autorizado', 401);
  }
}
