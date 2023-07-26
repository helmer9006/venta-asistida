import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaServiceCustom {
  constructor(private readonly prisma: PrismaClient) {}

  async transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  get queryBuilder() {
    return this.prisma;
  }
}
