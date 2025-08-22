import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dtos/req/create.event.dto';
import { UpdateEventDto } from './dtos/req/update.event.dto';
import { CreateTicketClassDto } from './dtos/req/create-ticket-class.dto';
import { PrismaService } from 'prisma/prisma.service';
import { IEventRepository } from './interfaces/event-repository.interface';

@Injectable()
export class EventRepository implements IEventRepository {
    constructor(private readonly prisma: PrismaService) {}
    async createEvent(createEventDto: CreateEventDto) {
        const event = await this.prisma.event.create({
            data: {
                name: createEventDto.name,
                description: createEventDto.description,
                date: new Date(createEventDto.date),
                location: createEventDto.location,
                thumbnailUrl: createEventDto.thumbnailUrl,
                bannerUrl: createEventDto.bannerUrl,
                images: {
                    create: createEventDto.images?.map((image) => ({
                        imageUrl: image.imageUrl,
                        altText: image.altText,
                        displayOrder: image.displayOrder,
                        isPrimary: image.isPrimary,
                    })),
                },
            }
        });
        return event;
    }

    async getEvents() {
        const events = await this.prisma.event.findMany(
            {
                include: {
                    images: true,
                },
            }
        );
        return events;
    }

    async updateEvent(id: number, updateEventDto: UpdateEventDto) {
        const event = await this.prisma.event.update({
            where: { id },
            data: {
                ...(updateEventDto.name && { name: updateEventDto.name }),
                ...(updateEventDto.description && { description: updateEventDto.description }),
                ...(updateEventDto.date && { date: new Date(updateEventDto.date) }),
                ...(updateEventDto.location && { location: updateEventDto.location }),
                ...(updateEventDto.thumbnailUrl && { thumbnailUrl: updateEventDto.thumbnailUrl }),
                ...(updateEventDto.bannerUrl && { bannerUrl: updateEventDto.bannerUrl }),
                ...(updateEventDto.images && {
                    images: {
                        deleteMany: {}, // Delete existing images
                        create: updateEventDto.images.map((image) => ({
                            imageUrl: image.imageUrl!,
                            altText: image.altText,
                            displayOrder: image.displayOrder,
                            isPrimary: image.isPrimary,
                        })),
                    },
                }),
            },
            include: {
                images: true,
            },
        });
        return event;
    }

    async findEventById(id: number) {
        return await this.prisma.event.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });
    }

    async getUpcomingEvents() {
        const now = new Date();
        const events = await this.prisma.event.findMany({
            where: {
                date: {
                    gt: now,
                },
            },
            include: {
                images: true,
            },
            orderBy: {
                date: 'asc',
            },
        });
        return events;
    }

    async deleteEvent(id: number): Promise<void> {
        await this.prisma.event.delete({
            where: { id },
        });
    }

    async getEventTicketClasses(eventId: number) {
        const ticketClasses = await this.prisma.ticketClass.findMany({
            where: { eventId },
            orderBy: {
                price: 'asc',
            },
        });
        return ticketClasses;
    }

    async createTicketClass(createTicketClassDto: CreateTicketClassDto) {
        const ticketClass = await this.prisma.ticketClass.create({
            data: {
                eventId: createTicketClassDto.eventId,
                name: createTicketClassDto.name,
                description: createTicketClassDto.description,
                price: createTicketClassDto.price,
                totalCount: 0, // Will be updated when tickets are created
                soldCount: 0,
            },
        });
        return ticketClass;
    }
}