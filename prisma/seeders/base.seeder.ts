import { PrismaClient } from '@prisma/client';

export abstract class BaseSeeder {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  abstract seed(): Promise<void>;

  protected async clearTable(tableName: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(`DELETE FROM "${tableName}";`);
    console.log(`✅ Cleared ${tableName} table`);
  }

  protected log(message: string): void {
    console.log(`🌱 ${message}`);
  }

  protected logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  protected logError(message: string): void {
    console.log(`❌ ${message}`);
  }
}
