# Concerto Backend API Documentation

**Note:** All prices in this API are displayed in Indonesian Rupiah (IDR). The conversion rate used is approximately 1 USD = 15,000 IDR.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
Success responses return data directly without wrapper objects.

Error responses follow this structure:
```json
{
  "message": "Error message",
  "error": "Error type",
  "statusCode": 400
}
```

---

# Authentication Endpoints

## 1. User Registration
**POST** `/auth/register`

Register a new user account.

### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Response
**Status Code:** `201 Created`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "registeredAt": "2025-01-15T10:30:00.000Z"
}
```

### Error Responses
- **400 Bad Request**: Invalid input data
- **409 Conflict**: Email already exists

---

## 2. User Login
**POST** `/auth/login`

Authenticate user and receive JWT tokens.

### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Response
**Status Code:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "registeredAt": "2025-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Invalid credentials

---

## 3. Refresh Token
**POST** `/auth/refresh`

Get new access token using refresh token.

### Headers
```
Authorization: Bearer <refresh_token>
```

### Response
**Status Code:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses
- **401 Unauthorized**: Invalid or expired refresh token

---

# User Management Endpoints

## 4. Get User Profile
**GET** `/user/:id`

**Authorization Required:** JWT Token (Users can only access their own profile, Admins can access any)

Retrieve user profile information.

### Parameters
- `id` (integer): User ID

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "registeredAt": "2025-01-15T10:30:00.000Z"
}
```

### Error Responses
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: User not found

---

# Event Management Endpoints

## 5. Get All Events
**GET** `/event/all`

**Authorization Required:** Admin only

Retrieve all events.

### Response
**Status Code:** `200 OK`
```json
{
  "events": [
    {
      "id": 1,
      "name": "Taylor Swift | The Eras Tour",
      "description": "Taylor Swift's record-breaking The Eras Tour...",
      "date": "2026-06-15T20:00:00.000Z",
      "location": "MetLife Stadium, East Rutherford, NJ",
      "thumbnailUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      "bannerUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
      "createdAt": "2025-01-15T09:00:00.000Z",
      "updatedAt": "2025-01-15T09:00:00.000Z",
      "images": [
        {
          "id": 1,
          "eventId": 1,
          "imageUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
          "altText": "Taylor Swift performing on stage",
          "displayOrder": 0,
          "isPrimary": true,
          "createdAt": "2025-01-15T09:00:00.000Z"
        }
      ]
    }
  ],
  "total": 1
}
```

---

## 6. Get Upcoming Events
**GET** `/event/upcoming`

Retrieve events that haven't occurred yet (public access).

### Response
**Status Code:** `200 OK`
```json
{
  "events": [
    {
      "id": 1,
      "name": "Taylor Swift | The Eras Tour",
      "description": "Taylor Swift's record-breaking The Eras Tour...",
      "date": "2026-06-15T20:00:00.000Z",
      "location": "MetLife Stadium, East Rutherford, NJ",
      "thumbnailUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      "bannerUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
      "createdAt": "2025-01-15T09:00:00.000Z",
      "updatedAt": "2025-01-15T09:00:00.000Z",
      "images": []
    }
  ],
  "total": 1
}
```

---

## 7. Get Single Event
**GET** `/event/:id`

Retrieve detailed information about a specific event (public access).

### Parameters
- `id` (integer): Event ID

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "name": "Taylor Swift | The Eras Tour",
  "description": "Taylor Swift's record-breaking The Eras Tour...",
  "date": "2026-06-15T20:00:00.000Z",
  "location": "MetLife Stadium, East Rutherford, NJ",
  "thumbnailUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
  "bannerUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
  "createdAt": "2025-01-15T09:00:00.000Z",
  "updatedAt": "2025-01-15T09:00:00.000Z",
  "images": [
    {
      "id": 1,
      "eventId": 1,
      "imageUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      "altText": "Taylor Swift performing on stage",
      "displayOrder": 0,
      "isPrimary": true,
      "createdAt": "2025-01-15T09:00:00.000Z"
    }
  ]
}
```

### Error Responses
- **404 Not Found**: Event not found

---

## 8. Get Event Ticket Classes
**GET** `/event/:id/ticket-classes`

Retrieve all ticket classes for a specific event (public access).

### Parameters
- `id` (integer): Event ID

### Response
**Status Code:** `200 OK`
```json
{
  "ticketClasses": [
    {
      "id": 1,
      "eventId": 1,
      "name": "VIP Package",
      "description": "Premium experience with meet & greet...",
      "price": 11250000.00,
      "totalCount": 100,
      "soldCount": 85,
      "availableCount": 15,
      "createdAt": "2025-01-15T09:00:00.000Z"
    },
    {
      "id": 2,
      "eventId": 1,
      "name": "Floor/Pit",
      "description": "Standing room closest to the stage...",
      "price": 5250000.00,
      "totalCount": 2000,
      "soldCount": 1850,
      "availableCount": 150,
      "createdAt": "2025-01-15T09:00:00.000Z"
    }
  ],
  "eventId": 1,
  "total": 2
}
```

### Error Responses
- **404 Not Found**: Event not found

---

## 9. Create Event
**POST** `/event/create`

**Authorization Required:** Admin only

Create a new event.

### Request Body
```json
{
  "name": "New Concert Event",
  "description": "An amazing concert experience...",
  "date": "2026-08-15T20:00:00Z",
  "location": "Madison Square Garden, New York, NY",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "bannerUrl": "https://example.com/banner.jpg",
  "images": [
    {
      "imageUrl": "https://example.com/image1.jpg",
      "altText": "Concert stage",
      "displayOrder": 0,
      "isPrimary": true
    }
  ]
}
```

### Response
**Status Code:** `201 Created`
```json
{
  "id": 2,
  "name": "New Concert Event",
  "description": "An amazing concert experience...",
  "date": "2026-08-15T20:00:00.000Z",
  "location": "Madison Square Garden, New York, NY",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "bannerUrl": "https://example.com/banner.jpg",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "updatedAt": "2025-01-15T12:00:00.000Z",
  "images": [
    {
      "id": 2,
      "eventId": 2,
      "imageUrl": "https://example.com/image1.jpg",
      "altText": "Concert stage",
      "displayOrder": 0,
      "isPrimary": true,
      "createdAt": "2025-01-15T12:00:00.000Z"
    }
  ]
}
```

### Error Responses
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions

---

## 10. Update Event
**PATCH** `/event/:id`

**Authorization Required:** Admin only

Update an existing event.

### Parameters
- `id` (integer): Event ID

### Request Body
```json
{
  "name": "Updated Event Name",
  "description": "Updated description...",
  "date": "2026-08-20T20:00:00Z",
  "location": "Updated Location"
}
```

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Event Name",
  "description": "Updated description...",
  "date": "2026-08-20T20:00:00.000Z",
  "location": "Updated Location",
  "thumbnailUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
  "bannerUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
  "createdAt": "2025-01-15T09:00:00.000Z",
  "updatedAt": "2025-01-15T12:30:00.000Z",
  "images": []
}
```

### Error Responses
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Event not found

---

## 11. Delete Event
**DELETE** `/event/:id`

**Authorization Required:** Admin only

Delete an event.

### Parameters
- `id` (integer): Event ID

### Response
**Status Code:** `204 No Content`

### Error Responses
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Event not found

---

# Ticket Management Endpoints

## 12. Get Tickets by Event
**GET** `/ticket/event/:eventId`

Retrieve all tickets for a specific event.

### Parameters
- `eventId` (integer): Event ID

### Response
**Status Code:** `200 OK`
```json
{
  "tickets": [
    {
      "id": 1,
      "eventId": 1,
      "ticketClassId": 1,
      "bookingId": null,
      "seatNumber": "A1",
      "status": "AVAILABLE",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "description": "Premium experience...",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    }
  ],
  "total": 1,
  "eventId": 1
}
```

### Error Responses
- **404 Not Found**: Event not found

---

## 13. Get Ticket Availability by Event
**GET** `/ticket/event/:eventId/availability`

Get real-time ticket availability for an event.

### Parameters
- `eventId` (integer): Event ID

### Response
**Status Code:** `200 OK`
```json
{
  "eventId": 1,
  "eventName": "Taylor Swift | The Eras Tour",
  "ticketClasses": [
    {
      "ticketClassId": 1,
      "ticketClassName": "VIP Package",
      "price": 11250000.00,
      "totalCount": 100,
      "soldCount": 85,
      "reservedCount": 10,
      "availableCount": 5
    },
    {
      "ticketClassId": 2,
      "ticketClassName": "Floor/Pit",
      "price": 5250000.00,
      "totalCount": 2000,
      "soldCount": 1850,
      "reservedCount": 50,
      "availableCount": 100
    }
  ],
  "totalAvailable": 105
}
```

### Error Responses
- **404 Not Found**: Event not found

---

## 14. Get Tickets by Ticket Class
**GET** `/ticket/ticket-class/:ticketClassId`

Retrieve all tickets for a specific ticket class.

### Parameters
- `ticketClassId` (integer): Ticket Class ID

### Response
**Status Code:** `200 OK`
```json
{
  "tickets": [
    {
      "id": 1,
      "eventId": 1,
      "ticketClassId": 1,
      "bookingId": null,
      "seatNumber": "A1",
      "status": "AVAILABLE",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "description": "Premium experience...",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    }
  ],
  "total": 1,
  "ticketClassId": 1
}
```

---

## 15. Get Single Ticket
**GET** `/ticket/:id`

Retrieve detailed information about a specific ticket.

### Parameters
- `id` (integer): Ticket ID

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "eventId": 1,
  "ticketClassId": 1,
  "bookingId": null,
  "seatNumber": "A1",
  "status": "AVAILABLE",
  "ticketClass": {
    "id": 1,
    "name": "VIP Package",
    "description": "Premium experience with meet & greet...",
    "price": 750.00
  },
  "event": {
    "id": 1,
    "name": "Taylor Swift | The Eras Tour",
            "date": "2026-06-15T20:00:00.000Z",
    "location": "MetLife Stadium, East Rutherford, NJ"
  }
}
```

### Error Responses
- **404 Not Found**: Ticket not found

---

## 16. Reserve Tickets
**POST** `/ticket/reserve`

Reserve tickets for purchase (15-minute reservation window).

### Request Body
```json
{
  "eventId": 1,
  "ticketClassId": 1,
  "quantity": 2,
  "seatNumbers": ["A1", "A2"]
}
```

### Response
**Status Code:** `200 OK`
```json
{
  "reservedTickets": [
    {
      "id": 1,
      "seatNumber": "A1",
      "status": "RESERVED"
    },
    {
      "id": 2,
      "seatNumber": "A2",
      "status": "RESERVED"
    }
  ],
  "eventId": 1,
  "ticketClassId": 1,
  "totalReserved": 2,
  "expiresAt": "2025-01-15T13:15:00.000Z",
  "message": "Successfully reserved 2 ticket(s)"
}
```

### Error Responses
- **400 Bad Request**: Invalid input data or insufficient tickets
- **404 Not Found**: Event or ticket class not found
- **409 Conflict**: Tickets not available

---

## 17. Update Ticket
**PATCH** `/ticket/:id`

**Authorization Required:** Admin only

Update ticket status or seat number.

### Parameters
- `id` (integer): Ticket ID

### Request Body
```json
{
  "status": "SOLD",
  "seatNumber": "B1"
}
```

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "eventId": 1,
  "ticketClassId": 1,
  "bookingId": 1,
  "seatNumber": "B1",
  "status": "SOLD",
  "ticketClass": {
    "id": 1,
    "name": "VIP Package",
    "description": "Premium experience...",
    "price": 750.00
  },
  "event": {
    "id": 1,
    "name": "Taylor Swift | The Eras Tour",
            "date": "2026-06-15T20:00:00.000Z",
    "location": "MetLife Stadium, East Rutherford, NJ"
  }
}
```

### Error Responses
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Ticket not found

---

## 18. Release Expired Reservations
**POST** `/ticket/release-expired`

**Authorization Required:** Admin only

Manually release expired ticket reservations.

### Response
**Status Code:** `204 No Content`

### Error Responses
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions

---

# 🎫 Booking Endpoints

## 19. Create Booking
**POST** `/booking`

**Authorization Required:** JWT Token

Create a new booking for selected tickets.

### Request Body
```json
{
  "userId": 1,
  "tickets": [
    {
      "ticketClassId": 1,
      "quantity": 2
    },
    {
      "ticketClassId": 2,
      "quantity": 1
    }
  ]
}
```

### Parameters
- `userId` (integer, required): ID of the user creating the booking
- `ticketIds` (array of integers, required): Array of ticket IDs to book

### Response
**Status Code:** `201 Created`
```json
{
  "id": 1,
  "userId": 1,
  "status": "PENDING",
  "totalAmount": 2250.00,
  "createdAt": "2025-01-15T14:30:00.000Z",
  "updatedAt": "2025-01-15T14:30:00.000Z",
  "tickets": [
    {
      "id": 1,
      "seatNumber": "A1",
      "status": "SOLD",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    },
    {
      "id": 2,
      "seatNumber": "A2",
      "status": "SOLD",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    },
    {
      "id": 3,
      "seatNumber": "A3",
      "status": "SOLD",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    }
  ]
}
```

### Error Responses
- **400 Bad Request**: Invalid input data or tickets not available
- **401 Unauthorized**: No token provided
- **403 Forbidden**: User can only create bookings for themselves
- **404 Not Found**: User or tickets not found

### Frontend Integration Example
```javascript
// 1. First, get ticket availability for an event
const availability = await fetch('/ticket/event/1/availability');
const ticketClasses = await availability.json();

// 2. User selects tickets and quantities
const bookingData = {
  userId: 1, // Current user's ID
  tickets: [
    {
      ticketClassId: 1, // VIP Package
      quantity: 2
    },
    {
      ticketClassId: 2, // Floor/Pit
      quantity: 1
    }
  ]
};

// 3. Create the booking
const response = await fetch('/booking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userToken
  },
  body: JSON.stringify(bookingData)
});

const booking = await response.json();
```

---

## 20. Get Booking by ID
**GET** `/booking/:id`

**Authorization Required:** JWT Token

Retrieve details of a specific booking. Users can only view their own bookings unless they are admin.

### Parameters
- `id` (integer): Booking ID

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "status": "PENDING",
  "totalAmount": 2250.00,
  "createdAt": "2025-01-15T14:30:00.000Z",
  "updatedAt": "2025-01-15T14:30:00.000Z",
  "tickets": [
    {
      "id": 1,
      "seatNumber": "A1",
      "status": "SOLD",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    }
  ]
}
```

### Error Responses
- **401 Unauthorized**: No token provided
- **403 Forbidden**: User can only view their own bookings
- **404 Not Found**: Booking not found

---

## 21. Get User Bookings
**GET** `/booking/user/:userId`

**Authorization Required:** JWT Token

Retrieve all bookings for a specific user. Users can only view their own bookings unless they are admin.

### Parameters
- `userId` (integer): User ID

### Response
**Status Code:** `200 OK`
```json
{
  "bookings": [
    {
      "id": 1,
      "userId": 1,
      "status": "CONFIRMED",
      "totalAmount": 2250.00,
      "createdAt": "2025-01-15T14:30:00.000Z",
      "updatedAt": "2025-01-15T14:35:00.000Z",
      "tickets": [
        {
          "id": 1,
          "seatNumber": "A1",
          "status": "SOLD",
          "ticketClass": {
            "id": 1,
            "name": "VIP Package",
            "price": 750.00
          },
          "event": {
            "id": 1,
            "name": "Taylor Swift | The Eras Tour",
            "date": "2026-06-15T20:00:00.000Z",
            "location": "MetLife Stadium, East Rutherford, NJ"
          }
        }
      ]
    }
  ],
  "total": 1,
  "userId": 1
}
```

### Error Responses
- **401 Unauthorized**: No token provided
- **403 Forbidden**: User can only view their own bookings
- **404 Not Found**: User not found

---

## 22. Cancel Booking
**POST** `/booking/:id/cancel`

**Authorization Required:** JWT Token

Cancel a booking and release the associated tickets back to available status. Users can only cancel their own bookings unless they are admin.

### Parameters
- `id` (integer): Booking ID

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "status": "CANCELLED",
  "totalAmount": 2250.00,
  "createdAt": "2025-01-15T14:30:00.000Z",
  "updatedAt": "2025-01-15T14:40:00.000Z",
  "tickets": [
    {
      "id": 1,
      "seatNumber": "A1",
      "status": "AVAILABLE",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    }
  ]
}
```

### Error Responses
- **400 Bad Request**: Booking already cancelled
- **401 Unauthorized**: No token provided
- **403 Forbidden**: User can only cancel their own bookings
- **404 Not Found**: Booking not found

---

## 23. Confirm Booking
**POST** `/booking/:id/confirm`

**Authorization Required:** JWT Token

Confirm a pending booking. Users can only confirm their own bookings unless they are admin.

### Parameters
- `id` (integer): Booking ID

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "status": "CONFIRMED",
  "totalAmount": 2250.00,
  "createdAt": "2025-01-15T14:30:00.000Z",
  "updatedAt": "2025-01-15T14:35:00.000Z",
  "tickets": [
    {
      "id": 1,
      "seatNumber": "A1",
      "status": "SOLD",
      "ticketClass": {
        "id": 1,
        "name": "VIP Package",
        "price": 750.00
      },
      "event": {
        "id": 1,
        "name": "Taylor Swift | The Eras Tour",
        "date": "2026-06-15T20:00:00.000Z",
        "location": "MetLife Stadium, East Rutherford, NJ"
      }
    }
  ]
}
```

### Error Responses
- **400 Bad Request**: Booking cannot be confirmed (not pending)
- **401 Unauthorized**: No token provided
- **403 Forbidden**: User can only confirm their own bookings
- **404 Not Found**: Booking not found

---

## 24. Update Booking (Admin Only)
**PATCH** `/booking/:id`

**Authorization Required:** Admin only

Update booking status. Admin-only endpoint for system management.

### Parameters
- `id` (integer): Booking ID

### Request Body
```json
{
  "status": "CONFIRMED"
}
```

### Parameters
- `status` (string, optional): New booking status ("PENDING", "CONFIRMED", "CANCELLED")

### Response
**Status Code:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "status": "CONFIRMED",
  "totalAmount": 2250.00,
  "createdAt": "2025-01-15T14:30:00.000Z",
  "updatedAt": "2025-01-15T14:35:00.000Z",
  "tickets": [...]
}
```

### Error Responses
- **400 Bad Request**: Invalid status value
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Booking not found

---

## 25. Cleanup Expired Bookings (Admin Only)
**POST** `/booking/cleanup-expired`

**Authorization Required:** Admin only

Manually trigger cleanup of expired bookings (bookings pending for more than 15 minutes).

### Response
**Status Code:** `204 No Content`

### Error Responses
- **401 Unauthorized**: No token provided
- **403 Forbidden**: Insufficient permissions

---

# Common Error Codes

## HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Request successful, no content to return
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server error

## Error Response Format
```json
{
  "message": "Detailed error message",
  "error": "Error Type",
  "statusCode": 400
}
```

## Common Error Messages
- `"Invalid credentials"` - Wrong email/password
- `"Event not found"` - Event with specified ID doesn't exist
- `"Ticket not found"` - Ticket with specified ID doesn't exist
- `"Insufficient tickets"` - Not enough tickets available
- `"Event date must be in the future"` - Cannot create/update past events
- `"Unauthorized"` - No valid token provided
- `"Forbidden"` - User doesn't have required permissions

---

# Data Models

## User
```json
{
  "id": "integer",
  "name": "string",
  "email": "string",
  "role": "USER | ADMIN | MODERATOR",
  "registeredAt": "datetime"
}
```

## Event
```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "date": "datetime",
  "location": "string",
  "thumbnailUrl": "string | null",
  "bannerUrl": "string | null",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "images": "EventImage[]"
}
```

## TicketClass
```json
{
  "id": "integer",
  "eventId": "integer",
  "name": "string",
  "description": "string | null",
  "price": "number",
  "totalCount": "integer",
  "soldCount": "integer",
  "availableCount": "integer",
  "createdAt": "datetime"
}
```

## Ticket
```json
{
  "id": "integer",
  "eventId": "integer",
  "ticketClassId": "integer",
  "bookingId": "integer | null",
  "seatNumber": "string | null",
  "status": "AVAILABLE | SOLD | RESERVED"
}
```

## Booking
```json
{
  "id": "integer",
  "userId": "integer",
  "status": "PENDING | CONFIRMED | CANCELLED",
  "totalAmount": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "tickets": "BookingTicket[]"
}
```

## BookingTicket
```json
{
  "id": "integer",
  "seatNumber": "string | null",
  "status": "string",
  "ticketClass": {
    "id": "integer",
    "name": "string",
    "price": "number"
  },
  "event": {
    "id": "integer",
    "name": "string",
    "date": "datetime",
    "location": "string"
  }
}
```

---

# Rate Limiting
- No rate limiting implemented in current version
- Consider implementing rate limiting for production use

# Versioning
- Current API version: v1
- No versioning strategy implemented yet

# Environment Variables Required
```env
DATABASE_URL="postgresql://..."
jwtSecretKey="your-secret-key"
refreshSecretKey="your-refresh-secret-key"
```

---

*Last updated: January 2025*
*API Version: 1.0.0*
