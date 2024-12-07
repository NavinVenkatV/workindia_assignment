# Ticket Booking System

A Node.js-based Ticket Booking System for user registration, train management, and seat booking. The system uses JWT-based authentication and API key security for admin operations.

---

## Features

1. **User Registration**: Sign up and log in users with roles (User/Admin).  
2. **Train Management**: Admins can add new trains with details like source, destination, and seat availability.  
3. **Seat Booking**: Users can search for trains, check availability, and book seats.  
4. **Authorization**: JWT for user authentication and API key for admin-level operations.

---

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-repo.git

```
### Step 2: Navigate to the Project Directory
cd Ticket_Booking

### Step 3: Install Dependencies
npm install

### Step 4: Set Up Environment Variables
```bash
1.DATABASE_URL=your_database_url
2.JWT_SECRET=your_jwt_secret
3.API_KEY=your_admin_api_key
```

### Step 5: Start the Server
node index.js

### API Endpoints
```bash
1.Sign Up
Endpoint: POST /api/v1/signup
Body:
json
{
  "username": "string",
  "password": "string",
  "role": "User | Admin"
}
Response:
{
  "userId": 1
}
---------------------------------------------------------------
2. Sign In
Endpoint: POST /api/v1/signin
Body:
json
{
  "username": "string",
  "password": "string"
}
Response:
{
  "token": "jwt_token"
}
---------------------------------------------------------------
3. Add a New Train (Admin Only)
Endpoint: POST /api/v1/train
Headers:
json
{
  "Authorization": "Bearer your_api_key"
}
Body:
json
{
  "name": "string",
  "source": "string",
  "destination": "string",
  "totalSeats": "int",
  "availableSeats": "int"
}
Response:
json
{
  "trainId": 1
}
-----------------------------------------------------------------
4. Search Trains
Endpoint: GET /trains
Headers:
json
{
  "Authorization": "Bearer jwt_token"
}
Query Parameters: source=string&destination=string
Response:
json
[
  {
    "id": 1,
    "name": "Train 1",
    "source": "Source",
    "destination": "Destination",
    "availableSeats": 50
  }
]
----------------------------------------------------------------
5. Book a Seat
Endpoint: POST /bookings
Headers:
json
{
  "Authorization": "Bearer jwt_token"
}
Body:

json
Copy code
{
  "trainId": 1,
  "seatNo": 10
}
Response:
json
{
  "bookingId": 1
}
----------------------------------------------------------------
6. Get Specific Booking Details
Endpoint: GET /bookings/:bookingId
Headers:
json
{
  "Authorization": "Bearer jwt_token"
}
Response:
json
{
  "bookingId": 1,
  "seatNumber": 10,
  "train": {
    "id": 1,
    "name": "Train 1",
    "source": "Source",
    "destination": "Destination"
  },
  "username": "User1",
  "userId": 1,
  "bookingDate": "2024-12-07T07:07:26.948Z"
}
----------------------------------------------------------------
```
### Technologies Used
```
Node.js: Backend framework
Express.js: API development
Prisma: ORM for database interaction
PostgreSQL: Database
Zod: Input validation
JWT: Authentication
```
