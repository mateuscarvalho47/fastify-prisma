import type { PrismaClient } from '../../generated/prisma/client.js';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true },
    });
  }

  create(data: { email: string; passwordHash: string }) {
    return this.prisma.user.create({
      data,
      select: { id: true, email: true, createdAt: true },
    });
  }
}