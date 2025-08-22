import { PrismaClient } from '@prisma/client';
import { BaseSeeder } from './base.seeder';

export class EventSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async seed(): Promise<void> {
    this.log('Seeding events with popular concerts...');

    // Helper function to generate random future dates in 2026
    const generateRandomDate2026 = (): Date => {
      const year = 2026;
      const month = Math.floor(Math.random() * 12) + 1; // 1-12
      const day = Math.floor(Math.random() * 28) + 1; // 1-28 (safe for all months)
      const hour = Math.floor(Math.random() * 4) + 19; // 19-22 (7PM-10PM)
      const minute = Math.random() < 0.5 ? 0 : 30; // 0 or 30 minutes
      
      return new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
    };

    const events = [
      {
        name: "Taylor Swift | The Eras Tour",
        description: "Taylor Swift's record-breaking The Eras Tour celebrating her entire musical journey spanning over a decade. Experience all her musical eras in one spectacular show with special guests and surprise songs.",
        date: generateRandomDate2026(),
        location: "MetLife Stadium, East Rutherford, NJ",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            altText: "Taylor Swift performing on stage",
            displayOrder: 0,
            isPrimary: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
            altText: "Concert stage setup",
            displayOrder: 1,
            isPrimary: false,
          }
        ]
      },
      {
        name: "Beyoncé Renaissance World Tour",
        description: "Queen B returns with her Renaissance World Tour, celebrating her critically acclaimed album. Experience the visual album come to life with stunning choreography, costume changes, and special effects.",
        date: generateRandomDate2026(),
        location: "SoFi Stadium, Los Angeles, CA",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
            altText: "Beyoncé on stage with dramatic lighting",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Harry Styles: Love On Tour 2026",
        description: "Harry Styles continues his Love On Tour with new dates for 2026. Experience his hits from all albums including Fine Line, Harry's House, and surprise covers in an intimate yet grand setting.",
        date: generateRandomDate2026(),
        location: "Madison Square Garden, New York, NY",
        thumbnailUrl: "https://images.unsplash.com/photo-1516440135628-23e0c2832aa4?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1516440135628-23e0c2832aa4?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1516440135628-23e0c2832aa4?w=800",
            altText: "Harry Styles performing with colorful stage lights",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "The Weeknd: Dawn FM Experience",
        description: "The Weeknd brings his Dawn FM album to life in this immersive concert experience. Featuring hits from After Hours, Dawn FM, and classic tracks in a futuristic stage production.",
        date: generateRandomDate2026(),
        location: "United Center, Chicago, IL",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            altText: "The Weeknd performing with neon lighting",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Coldplay: Music of the Spheres World Tour",
        description: "Coldplay's eco-friendly tour featuring songs from Music of the Spheres and their greatest hits. Experience kinetic floors, LED wristbands, and the most sustainable stadium show ever created.",
        date: generateRandomDate2026(),
        location: "Wembley Stadium, London, UK",
        thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
            altText: "Coldplay performing with colorful confetti",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Bad Bunny: Un Verano Sin Ti Tour",
        description: "Bad Bunny brings reggaeton to the masses with his Un Verano Sin Ti tour. Experience the biggest hits from his chart-topping album with special Latin music guests.",
        date: generateRandomDate2026(),
        location: "Hard Rock Stadium, Miami Gardens, FL",
        thumbnailUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800",
            altText: "Bad Bunny performing reggaeton",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Billie Eilish: Happier Than Ever Tour",
        description: "Billie Eilish's intimate yet powerful tour featuring songs from Happier Than Ever and her debut album. Experience her unique stage design and environmental activism message.",
        date: generateRandomDate2026(),
        location: "Chase Center, San Francisco, CA",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
            altText: "Billie Eilish on stage with green lighting",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Ed Sheeran: Mathematics Tour",
        description: "Ed Sheeran's Mathematics Tour featuring his latest album and acoustic versions of his biggest hits. An intimate evening of storytelling through music with just Ed and his guitar.",
        date: generateRandomDate2026(),
        location: "Fenway Park, Boston, MA",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            altText: "Ed Sheeran performing with acoustic guitar",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Dua Lipa: Future Nostalgia Live",
        description: "Dua Lipa brings her disco-pop Future Nostalgia album to life with incredible choreography, costume changes, and a full live band. Experience the evolution of pop music.",
        date: generateRandomDate2026(),
        location: "Barclays Center, Brooklyn, NY",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
            altText: "Dua Lipa performing disco-pop",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Imagine Dragons: Mercury World Tour",
        description: "Imagine Dragons' high-energy tour featuring songs from Mercury Acts 1 & 2, plus their biggest hits. Experience their unique blend of rock, electronic, and pop with stunning visual effects.",
        date: generateRandomDate2026(),
        location: "T-Mobile Arena, Las Vegas, NV",
        thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
            altText: "Imagine Dragons performing with fire effects",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "The 1975: Being Funny in a Foreign Language Tour",
        description: "The 1975's introspective tour showcasing their latest album with their signature blend of indie rock, electronic, and pop. Experience their artistic evolution and Matt Healy's captivating stage presence.",
        date: generateRandomDate2026(),
        location: "The O2 Arena, London, UK",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            altText: "The 1975 performing indie rock",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Lana Del Rey: Did You Know Tour",
        description: "Lana Del Rey's ethereal tour featuring songs from her extensive catalog. Experience her dreamy vocals and cinematic stage production in this intimate concert experience.",
        date: generateRandomDate2026(),
        location: "Hollywood Bowl, Los Angeles, CA",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
            altText: "Lana Del Rey performing with dreamy lighting",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Arctic Monkeys: The Car Tour",
        description: "Arctic Monkeys return with their sophisticated sound from The Car album. Experience their evolution from indie rock to their mature, complex musical style with Alex Turner's distinctive vocals.",
        date: generateRandomDate2026(),
        location: "Red Rocks Amphitheatre, Morrison, CO",
        thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
            altText: "Arctic Monkeys performing at Red Rocks",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Olivia Rodrigo: GUTS World Tour",
        description: "Olivia Rodrigo's explosive tour supporting her sophomore album GUTS. Experience the raw emotion and pop-punk energy of tracks like 'Vampire' and 'Get Him Back!' with full band arrangements.",
        date: generateRandomDate2026(),
        location: "American Airlines Arena, Miami, FL",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            altText: "Olivia Rodrigo performing pop-punk",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Twenty One Pilots: The Clancy World Tour",
        description: "Twenty One Pilots' high-energy tour featuring their latest album Clancy. Experience Tyler Joseph and Josh Dun's unique blend of genres with their famous audience interaction and theatrical performances.",
        date: generateRandomDate2026(),
        location: "Rocket Mortgage FieldHouse, Cleveland, OH",
        thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
            altText: "Twenty One Pilots performing with theatrical effects",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "SZA: SOS Tour Extended",
        description: "SZA extends her SOS tour with additional dates. Experience her soulful R&B vocals and vulnerable lyricism in this intimate yet powerful concert featuring hits from her chart-topping album.",
        date: generateRandomDate2026(),
        location: "State Farm Arena, Atlanta, GA",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
            altText: "SZA performing R&B with elegant staging",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Tame Impala: Currents & Lonerism Live",
        description: "Tame Impala's psychedelic journey through their acclaimed albums Currents and Lonerism. Experience Kevin Parker's mind-bending visuals and electronic-rock fusion in this transcendent concert experience.",
        date: generateRandomDate2026(),
        location: "Golden Gate Park, San Francisco, CA",
        thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
            altText: "Tame Impala performing with psychedelic visuals",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Glass Animals: Heat Waves World Tour",
        description: "Glass Animals celebrates their global hit 'Heat Waves' and songs from Dreamland. Experience their indie electronic sound with Dave Bayley's distinctive vocals and the band's creative stage production.",
        date: generateRandomDate2026(),
        location: "Bridgestone Arena, Nashville, TN",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            altText: "Glass Animals performing indie electronic",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Lorde: Solar Power Live Experience",
        description: "Lorde brings her Solar Power era to life with an eco-conscious tour celebrating nature and sustainability. Experience her ethereal vocals and introspective lyrics in this unique outdoor concert setting.",
        date: generateRandomDate2026(),
        location: "Central Park SummerStage, New York, NY",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
            altText: "Lorde performing in natural outdoor setting",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "BLACKPINK: Born Pink World Tour Finale",
        description: "BLACKPINK's spectacular finale of their Born Pink World Tour. Experience Jennie, Jisoo, Lisa, and Rosé's powerful performances of their biggest K-Pop hits with choreography and production value.",
        date: generateRandomDate2026(),
        location: "Crypto.com Arena, Los Angeles, CA",
        thumbnailUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800",
            altText: "BLACKPINK performing K-Pop with elaborate staging",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      },
      {
        name: "Metallica: M72 World Tour",
        description: "Metallica's groundbreaking M72 World Tour featuring no repeat songs across two nights. Experience the metal legends performing deep cuts and classics with special guests and their signature heavy sound.",
        date: generateRandomDate2026(),
        location: "MetLife Stadium, East Rutherford, NJ",
        thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400",
        bannerUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200",
        images: [
          {
            imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
            altText: "Metallica performing heavy metal with pyrotechnics",
            displayOrder: 0,
            isPrimary: true,
          }
        ]
      }
    ];

    let eventCount = 0;
    for (const eventData of events) {
      const { images, ...eventInfo } = eventData;
      
      const event = await this.prisma.event.create({
        data: {
          ...eventInfo,
          images: {
            create: images,
          },
        },
      });
      
      eventCount++;
      this.log(`Created event: ${event.name}`);
    }

    this.logSuccess(`Created ${eventCount} popular concert events`);
  }
}
