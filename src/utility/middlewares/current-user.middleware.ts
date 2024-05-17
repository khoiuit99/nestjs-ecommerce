import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log(req);
    next();
  }
}
