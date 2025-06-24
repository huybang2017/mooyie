import { Role } from 'generated/prisma';

export interface JwtPayload {
  email: string;
  sub: string;
  role: Role;
}
