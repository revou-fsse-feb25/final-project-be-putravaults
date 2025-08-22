GET    /event/all              - Get all events
GET    /event/upcoming         - Get upcoming events  
GET    /event/:id              - Get single event
GET    /event/:id/ticket-classes - Get event ticket classes
POST   /event/create           - Create event (ADMIN)
PATCH  /event/:id              - Update event (ADMIN)  
DELETE /event/:id              - Delete event (ADMIN)

src/ticket/
├── dtos/
│   ├── req/
│   │   ├── reserve-tickets.dto.ts
│   │   └── update-ticket.dto.ts
│   └── res/
│       ├── ticket.response.dto.ts
│       ├── tickets-list.response.dto.ts
│       ├── ticket-availability.response.dto.ts
│       └── reserve-tickets.response.dto.ts
├── exceptions/
│   ├── ticket-not-found.exception.ts
│   ├── ticket-not-available.exception.ts
│   ├── insufficient-tickets.exception.ts
│   ├── ticket-operation-failed.exception.ts
│   └── invalid-ticket-data.exception.ts
├── interfaces/
│   ├── ticket-repository.interface.ts
│   └── ticket-service.interface.ts
├── ticket.controller.ts
├── ticket.service.ts
├── ticket.repository.ts
├── ticket.module.ts
├── ticket.controller.spec.ts
└── ticket.service.spec.ts