import { PrismaClient, TicketStatus, BookingStatus } from '@prisma/client';
import { BaseSeeder } from './base.seeder';

interface TicketData {
  eventId: number;
  ticketClassId: number;
  bookingId: number | null;
  seatNumber: string;
  status: TicketStatus;
}

export class TicketSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async seed(): Promise<void> {
    this.log('Seeding tickets for all ticket classes...');

    // Get all ticket classes with their events
    const ticketClasses = await this.prisma.ticketClass.findMany({
      include: {
        event: true,
      },
    });

    let totalTicketsCreated = 0;
    let totalBookingsCreated = 0;

    for (const ticketClass of ticketClasses) {
      this.log(`Creating tickets for ${ticketClass.name} - ${ticketClass.event.name}`);

      const tickets: TicketData[] = [];
      const totalTickets = ticketClass.totalCount;
      const soldTickets = ticketClass.soldCount;

      // Generate seat numbers based on venue type
      const seatNumbers = this.generateSeatNumbers(ticketClass.name, totalTickets);

      // Track sold tickets for this ticket class
      let soldTicketsCreated = 0;
      let currentBookingId: number | null = null;
      let ticketsInCurrentBooking = 0;

      // Create tickets with different statuses
      for (let i = 0; i < totalTickets; i++) {
        const seatNumber = seatNumbers[i];
        let status: TicketStatus = 'AVAILABLE';
        let bookingId: number | null = null;

        // Determine ticket status based on sold count
        if (i < soldTickets) {
          status = 'SOLD';
          
          // Create new booking if needed (every 1-4 tickets)
          if (currentBookingId === null || ticketsInCurrentBooking >= 4) {
            const booking = await this.createRandomBooking();
            currentBookingId = booking.id;
            ticketsInCurrentBooking = 0;
            totalBookingsCreated++;
          }
          
          bookingId = currentBookingId;
          ticketsInCurrentBooking++;
          soldTicketsCreated++;
        } else if (i < soldTickets + Math.floor(totalTickets * 0.1)) {
          // 10% of remaining tickets are reserved
          status = 'RESERVED';
        }

        tickets.push({
          eventId: ticketClass.eventId,
          ticketClassId: ticketClass.id,
          bookingId,
          seatNumber,
          status,
        });
      }

      // Create tickets in batches for better performance
      const createdTickets = await this.prisma.ticket.createMany({
        data: tickets,
      });

      totalTicketsCreated += createdTickets.count;
      this.log(`Created ${createdTickets.count} tickets for ${ticketClass.name}`);
    }

    // Update ticket class sold counts to match actual sold tickets
    await this.updateTicketClassSoldCounts();

    this.logSuccess(`Created ${totalTicketsCreated} tickets across all ticket classes`);
    this.logSuccess(`Created ${totalBookingsCreated} bookings for sold tickets`);
  }

  private generateSeatNumbers(ticketClassName: string, count: number): string[] {
    const seatNumbers: string[] = [];

    if (ticketClassName.includes('VIP') || ticketClassName.includes('Floor') || ticketClassName.includes('Pit')) {
      // VIP and Floor tickets - use section-based numbering
      const sections = ['A', 'B', 'C', 'D', 'E', 'F'];
      let sectionIndex = 0;
      let seatNumber = 1;

      for (let i = 0; i < count; i++) {
        seatNumbers.push(`${sections[sectionIndex]}${seatNumber}`);
        seatNumber++;
        if (seatNumber > 50) {
          seatNumber = 1;
          sectionIndex = (sectionIndex + 1) % sections.length;
        }
      }
    } else if (ticketClassName.includes('Lawn')) {
      // Lawn tickets - use area-based numbering
      const areas = ['LAWN-A', 'LAWN-B', 'LAWN-C', 'LAWN-D'];
      let areaIndex = 0;
      let spotNumber = 1;

      for (let i = 0; i < count; i++) {
        seatNumbers.push(`${areas[areaIndex]}-${spotNumber.toString().padStart(3, '0')}`);
        spotNumber++;
        if (spotNumber > 200) {
          spotNumber = 1;
          areaIndex = (areaIndex + 1) % areas.length;
        }
      }
    } else {
      // Seated tickets - use row and seat numbering
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
      let rowIndex = 0;
      let seatNumber = 1;

      for (let i = 0; i < count; i++) {
        seatNumbers.push(`${rows[rowIndex]}${seatNumber.toString().padStart(2, '0')}`);
        seatNumber++;
        if (seatNumber > 50) {
          seatNumber = 1;
          rowIndex = (rowIndex + 1) % rows.length;
        }
      }
    }

    return seatNumbers;
  }

  private async createRandomBooking(): Promise<any> {
    // Get a random user (prefer regular users over admin)
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
    });

    if (users.length === 0) {
      // Fallback to any user if no regular users exist
      const allUsers = await this.prisma.user.findMany();
      if (allUsers.length === 0) {
        throw new Error('No users found for creating bookings');
      }
      return this.prisma.booking.create({
        data: {
          userId: allUsers[0].id,
          status: Math.random() > 0.2 ? 'CONFIRMED' : 'PENDING', // 80% confirmed, 20% pending
        },
      });
    }

    const randomUser = users[Math.floor(Math.random() * users.length)];

    return this.prisma.booking.create({
      data: {
        userId: randomUser.id,
        status: Math.random() > 0.2 ? 'CONFIRMED' : 'PENDING', // 80% confirmed, 20% pending
      },
    });
  }

  private async updateTicketClassSoldCounts(): Promise<void> {
    this.log('Updating ticket class sold counts...');

    // Get all ticket classes
    const ticketClasses = await this.prisma.ticketClass.findMany();

    for (const ticketClass of ticketClasses) {
      // Count actual sold tickets
      const soldCount = await this.prisma.ticket.count({
        where: {
          ticketClassId: ticketClass.id,
          status: 'SOLD',
        },
      });

      // Update the ticket class
      await this.prisma.ticketClass.update({
        where: { id: ticketClass.id },
        data: { soldCount },
      });
    }

    this.logSuccess('Updated all ticket class sold counts');
  }
}
