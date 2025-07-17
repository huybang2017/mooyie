import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class UserProfileCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    // Nếu JWT đã decode, user sẽ có trong request
    const user = request.user;
    if (user && user.id) {
      return `user-profile-${user.id}`;
    }
    // Nếu chưa decode, fallback cache theo token (ít khuyến khích)
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '').trim();
    if (token) {
      return `user-profile-token-${token}`;
    }
    return undefined;
  }
} 