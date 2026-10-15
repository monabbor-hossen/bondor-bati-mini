# Bondor Bati - Mobile App API Documentation

This API powers both the web frontend and is fully ready to be consumed by the future Flutter mobile application. It shares the exact same MySQL database.

## Base URL
`http://yourdomain.com/api/v1` *(or `http://localhost/bondor-bati-site/bondor-bati-mini/api/v1` for local development)*

## Authentication (For Mobile Apps)
The web frontend uses session-based CSRF tokens. However, for mobile applications (like Flutter), you can bypass the CSRF requirement by providing a static API key in the request headers.

Set `MOBILE_API_KEY=your_secret_key` in your `.env` file on the server.

Send this header with every `POST` request from the Flutter app:
```http
Authorization: Bearer your_secret_key
```

---

## Endpoints

### 1. Get Weekly Menu
Retrieves the entire 6-day weekly menu.
- **Method:** `GET`
- **Path:** `/menu`
- **Response:**
```json
{
  "data": [
    {
      "day_index": 0,
      "day_name": "Saturday",
      "items": [
        {
          "id": 1,
          "name": "সোনালী মুরগি ভুনা",
          "description": "...",
          "tier": "standard",
          "price": 135,
          "emoji": "🍗",
          "image_url": null,
          "is_available": true
        }
      ]
    }
  ]
}
```

### 2. Create Order
Submits a new food order.
- **Method:** `POST`
- **Path:** `/orders`
- **Headers:** `Authorization: Bearer <MOBILE_API_KEY>`
- **Body:**
```json
{
  "customer_name": "John Doe",
  "phone": "01700000000",
  "address": "House 1, Road 2, Chattogram",
  "delivery_date": "2026-10-10",
  "notes": "No spicy",
  "idempotency_key": "unique_uuid_to_prevent_duplicate_orders",
  "items": [
    {
      "item_id": 1,
      "quantity": 2,
      "plan_days": 1
    }
  ]
}
```
- **Success Response (201 Created):**
```json
{
  "message": "Order placed successfully.",
  "data": {
    "order_number": "BB-123456-ABCDEF",
    "total": 270,
    ...
  }
}
```

### 3. Track Order
Tracks the status of an existing order using the order number and phone number.
- **Method:** `GET`
- **Path:** `/orders/track?order_number=BB-123456-ABCDEF&phone=01700000000`
- **Response:**
```json
{
  "data": {
    "order_number": "BB-123456-ABCDEF",
    "status": "pending",
    "total": 270,
    "delivery_date": "2026-10-10",
    "items": [ ... ]
  }
}
```

### 4. Create Catering Booking
Submits an inquiry for event catering.
- **Method:** `POST`
- **Path:** `/catering`
- **Headers:** `Authorization: Bearer <MOBILE_API_KEY>`
- **Body:**
```json
{
  "menu_name": "Premium Wedding Package",
  "guest_count": 150,
  "client_name": "Jane Doe",
  "phone": "01800000000",
  "event_date": "2026-12-01 19:00:00",
  "venue": "Agrabad Convention Hall",
  "notes": "Need extra dessert"
}
```

### 5. Health Check
Check if the API and database are online.
- **Method:** `GET`
- **Path:** `/health`
- **Response:**
```json
{
  "status": "ok",
  "database": "connected"
}
```
