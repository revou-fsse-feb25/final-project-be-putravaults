import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { BaseSeeder } from './base.seeder';

export class UserSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async seed(): Promise<void> {
    this.log('Seeding users...');

    // Create admin user
    const adminUser = await this.prisma.user.upsert({
      where: { email: 'admin@concerto.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@concerto.com',
        password: await hash('admin123', 10),
        role: Role.ADMIN,
      },
    });

    // Create regular users
    const regularUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await hash('password123', 10),
        role: Role.USER,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await hash('password123', 10),
        role: Role.USER,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await hash('password123', 10),
        role: Role.USER,
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: await hash('password123', 10),
        role: Role.MODERATOR,
      },
    ];

    for (const userData of regularUsers) {
      await this.prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      });
    }

    this.logSuccess(`Created ${regularUsers.length + 1} users (1 admin, 1 moderator, ${regularUsers.length - 1} regular users)`);
  }
}
