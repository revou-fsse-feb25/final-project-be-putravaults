import { PrismaClient } from '@prisma/client';
import { BaseSeeder } from './base.seeder';

export class TicketClassSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async seed(): Promise<void> {
    this.log('Seeding ticket classes for events...');

    // Get all events
    const events = await this.prisma.event.findMany();

    let ticketClassCount = 0;

    for (const event of events) {
      // Determine ticket class structure based on venue type
      const isStadium = event.location.includes('Stadium') || event.location.includes('Arena');
      const isOutdoor = event.location.includes('Park') || event.location.includes('Amphitheatre');
      
      let ticketClasses;

      if (isStadium) {
        // Stadium events - much smaller capacity for testing
        ticketClasses = [
          {
            name: 'VIP Package',
            description: 'Premium experience with meet & greet, exclusive merchandise, premium seating, and complimentary drinks',
            price: 11250000.00, // 750 USD * 15000 IDR
            totalCount: 5,
            soldCount: 3,
          },
          {
            name: 'Floor/Pit',
            description: 'Standing room closest to the stage for the ultimate concert experience',
            price: 5250000.00, // 350 USD * 15000 IDR
            totalCount: 8,
            soldCount: 6,
          },
          {
            name: 'Lower Bowl',
            description: 'Premium seated sections with excellent stage views',
            price: 3750000.00, // 250 USD * 15000 IDR
            totalCount: 10,
            soldCount: 7,
          },
          {
            name: 'Upper Bowl',
            description: 'Elevated seating with full stage view at great value',
            price: 1875000.00, // 125 USD * 15000 IDR
            totalCount: 12,
            soldCount: 8,
          },
          {
            name: 'Nosebleed',
            description: 'Budget-friendly seats with distant but complete stage view',
            price: 975000.00, // 65 USD * 15000 IDR
            totalCount: 15,
            soldCount: 10,
          }
        ];
      } else if (isOutdoor) {
        // Outdoor venues - smaller capacity
        ticketClasses = [
          {
            name: 'VIP Lawn',
            description: 'Premium lawn area with VIP amenities and preferred entry',
            price: 6000000.00, // 400 USD * 15000 IDR
            totalCount: 4,
            soldCount: 2,
          },
          {
            name: 'Reserved Seating',
            description: 'Fixed seating with optimal stage views',
            price: 2700000.00, // 180 USD * 15000 IDR
            totalCount: 8,
            soldCount: 5,
          },
          {
            name: 'General Lawn',
            description: 'Bring your blanket for a relaxed concert experience',
            price: 1125000.00, // 75 USD * 15000 IDR
            totalCount: 12,
            soldCount: 8,
          }
        ];
      } else {
        // Arena/Theater venues - intimate settings
        ticketClasses = [
          {
            name: 'VIP Experience',
            description: 'Meet & greet, premium seating, exclusive merchandise and photo opportunity',
            price: 7500000.00, // 500 USD * 15000 IDR
            totalCount: 3,
            soldCount: 2,
          },
          {
            name: 'Orchestra',
            description: 'Front section seating with unobstructed stage views',
            price: 4125000.00, // 275 USD * 15000 IDR
            totalCount: 6,
            soldCount: 4,
          },
          {
            name: 'Mezzanine',
            description: 'Elevated seating with excellent acoustics and sightlines',
            price: 2625000.00, // 175 USD * 15000 IDR
            totalCount: 8,
            soldCount: 5,
          },
          {
            name: 'Balcony',
            description: 'Upper level seating at accessible pricing',
            price: 1275000.00, // 85 USD * 15000 IDR
            totalCount: 10,
            soldCount: 6,
          }
        ];
      }

      // Create ticket classes for this event
      for (const ticketClassData of ticketClasses) {
        await this.prisma.ticketClass.create({
          data: {
            eventId: event.id,
            ...ticketClassData,
          },
        });
        ticketClassCount++;
      }

      this.log(`Created ${ticketClasses.length} ticket classes for: ${event.name}`);
    }

    this.logSuccess(`Created ${ticketClassCount} ticket classes across ${events.length} events`);
  }
}
