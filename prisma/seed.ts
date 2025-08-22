import { PrismaClient } from '@prisma/client';
import { UserSeeder } from './seeders/user.seeder';
import { EventSeeder } from './seeders/event.seeder';
import { TicketClassSeeder } from './seeders/ticket-class.seeder';
import { TicketSeeder } from './seeders/ticket.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Run seeders in order
    console.log('📁 Seeding Users...');
    const userSeeder = new UserSeeder(prisma);
    await userSeeder.seed();
    console.log('');

    console.log('🎵 Seeding Events...');
    const eventSeeder = new EventSeeder(prisma);
    await eventSeeder.seed();
    console.log('');

    console.log('🎫 Seeding Ticket Classes...');
    const ticketClassSeeder = new TicketClassSeeder(prisma);
    await ticketClassSeeder.seed();
    console.log('');

    console.log('🎟️ Seeding Tickets...');
    const ticketSeeder = new TicketSeeder(prisma);
    await ticketSeeder.seed();
    console.log('');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- 5 Users created (1 Admin, 1 Moderator, 3 Regular users)');
    console.log('- 21 Popular concerts from famous artists');
    console.log('- Multiple ticket classes per event with Indonesian Rupiah pricing');
    console.log('- High-quality event images and descriptions');
    console.log('- Individual tickets for each ticket class with realistic seat numbers');
    console.log('- Bookings created for sold tickets with various statuses');
    console.log('- Total tickets: ~800-900 (manageable size with 21 events)');
    
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@concerto.com / admin123');
    console.log('Regular User: john@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
