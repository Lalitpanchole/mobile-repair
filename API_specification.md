# MPC Repairs - RESTful API Specification

This document provides the REST API endpoints, input payloads, headers, query parameters, and JSON response models for the MPC Repairs platform.

---

## 🌐 Global API Configurations

*   **Base URL**: `/api/v1`
*   **Default Headers**:
    *   `Content-Type: application/json`
    *   `Accept: application/json`
*   **Security Header**:
    *   Protected admin endpoints require the inclusion of: `Authorization: Bearer <JWT_Token>`

---

## 🔑 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/login`
Validates admin credentials and issues a JSON Web Token (JWT).

*   **Request Payload**:
    ```json
    {
      "email": "admin@mpcrepairs.com.au",
      "password": "SecurePassword123!"
    }
    ```
*   **Responses**:
    *   **200 OK (Success)**:
        ```json
        {
          "success": true,
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhMm...",
          "user": {
            "id": "7ac2e190-c65d-4f1a-b67e-399d8d67ee99",
            "name": "Alex Admin",
            "email": "admin@mpcrepairs.com.au",
            "role": "SuperAdmin"
          }
        }
        ```
    *   **401 Unauthorized (Invalid credentials)**:
        ```json
        {
          "success": false,
          "error": "Unauthorized",
          "message": "Invalid email or password"
        }
        ```

---

### `POST /auth/logout`
Logs out the user and clears HTTP-Only cookies.

*   **Responses**:
    *   **200 OK**:
        ```json
        {
          "success": true,
          "message": "Logged out successfully"
        }
        ```

---

## 📅 2. Public Client Endpoints (`/api/v1/public`)

### `GET /public/catalog`
Compiles all active brands, categories, and device services. Used by the 5-Step Booking Modal wizard.

*   **Responses**:
    *   **200 OK**: Renders compiled catalog JSON matching the structure of `repairDatabase.json`.

---

### `GET /public/slots`
Calculates available time slots for the chosen date and branch location.

*   **Query Parameters**:
    *   `date`: Date string (`YYYY-MM-DD`) - Required.
    *   `branch_id`: Store branch UUID - Required.
*   **Responses**:
    *   **200 OK (Regular Available Day)**:
        ```json
        {
          "date": "2026-06-12",
          "available": true,
          "slots": [
            "09:00 AM",
            "10:30 AM",
            "12:00 PM",
            "01:30 PM",
            "03:00 PM",
            "04:30 PM"
          ]
        }
        ```
    *   **200 OK (Sunday / Holiday Closure)**:
        ```json
        {
          "date": "2026-06-14",
          "available": false,
          "slots": [],
          "reason": "Store is closed on Sundays"
        }
        ```

---

### `POST /public/bookings`
Saves a new customer appointment booking.

*   **Request Payload**:
    ```json
    {
      "customer_name": "Sarah Jenkins",
      "customer_phone": "+61 412 345 678",
      "customer_email": "sarah@example.com",
      "device_brand": "Apple",
      "device_type": "Phone",
      "device_model": "iPhone 16 Pro Max",
      "repair_name": "Screen Repair",
      "part_quality": "Aftermarket Soft OLED",
      "final_price": 369.00,
      "date_str": "2026-06-12",
      "time_slot": "10:30 AM",
      "branch_id": "8bc341d0-1e5f-4a3b-c2e8-99d8d67ee102",
      "notes": "Free screen protector please"
    }
    ```
*   **Responses**:
    *   **201 Created (Success)**:
        ```json
        {
          "success": true,
          "message": "Appointment booked successfully",
          "booking": {
            "id": "BKG-9811",
            "customer_name": "Sarah Jenkins",
            "device_model": "iPhone 16 Pro Max",
            "date_str": "2026-06-12",
            "time_slot": "10:30 AM",
            "status": "Pending"
          }
        }
        ```
    *   **409 Conflict (Double booking lock active)**:
        ```json
        {
          "success": false,
          "error": "Conflict",
          "message": "The selected time slot has already been booked. Please choose another date or time."
        }
        ```
    *   **400 Bad Request (Invalid parameters / missing fields)**:
        ```json
        {
          "success": false,
          "error": "Bad Request",
          "message": "\"customer_email\" must be a valid email"
        }
        ```

---

## 🔐 3. Admin Appointments & Calendar Management (`/api/v1/admin`)
*All requests require a valid admin JWT token.*

### `GET /admin/bookings`
Returns a paginated list of bookings. Used in the Admin Bookings list view.

*   **Query Parameters**:
    *   `page`: Page index (default: `1`)
    *   `limit`: Page size limit (default: `15`)
    *   `status`: Filter by status (`Pending`, `Confirmed`, `Completed`, `Cancelled`, `Rejected`)
    *   `search`: Fuzzy search by customer name, phone, or model
*   **Responses**:
    *   **200 OK**:
        ```json
        {
          "success": true,
          "pagination": {
            "total_records": 102,
            "page": 1,
            "limit": 15
          },
          "bookings": [
            {
              "id": "BKG-5092",
              "customer_name": "Alice Johnson",
              "device_model": "iPhone 13 Pro Max",
              "repair_name": "Screen Replacement",
              "status": "Confirmed",
              "date_str": "2026-06-03",
              "time_slot": "10:30 AM",
              "final_price": 289.00
            }
          ]
        }
        ```

---

### `GET /admin/bookings/calendar`
Returns month-specific bookings for admin scheduling.

*   **Query Parameters**:
    *   `month`: Calendar month (1-12)
    *   `year`: Calendar year (e.g. `2026`)
    *   `branch_id`: Optional branch filter
*   **Responses**:
    *   **200 OK**: Returns list of bookings within the date ranges.

---

### `PUT /admin/bookings/:id/status`
Updates status of a booking.

*   **Request Payload**:
    ```json
    {
      "status": "Completed"
    }
    ```
*   **Responses**:
    *   **200 OK**:
        ```json
        {
          "success": true,
          "booking_id": "BKG-5092",
          "new_status": "Completed"
        }
        ```

---

### `PUT /admin/bookings/:id/reschedule`
Reschedules an appointment (supports drag-and-drop actions).

*   **Request Payload**:
    ```json
    {
      "date_str": "2026-06-18",
      "time_slot": "02:00 PM"
    }
    ```
*   **Responses**:
    *   **200 OK**:
        ```json
        {
          "success": true,
          "message": "Appointment successfully rescheduled"
        }
        ```
    *   **400 Bad Request (Slot unavailable)**:
        ```json
        {
          "success": false,
          "error": "Bad Request",
          "message": "Selected time slot is already fully booked or the branch is closed."
        }
        ```

---

## 🛠️ 4. Catalog & Custom Content Editors (`/api/v1/admin/catalog`)
*Restricted to 'SuperAdmin' or 'BranchManager' roles.*

### `POST /admin/catalog/services`
Adds a new service item to the pricing directory.

*   **Request Payload**:
    ```json
    {
      "name": "Samsung Galaxy Battery Swap",
      "description": "High-health OEM replacement battery",
      "base_price": 119.00,
      "time_duration": "45 min",
      "category_id": "e9b210c4-a65d-4f1a-b67e-399d8d67ee10",
      "rating_label": "OEM Grade",
      "popular": false,
      "dynamic_options": []
    }
    ```
*   **Responses**:
    *   **201 Created**: Returns the created service details.

---

### `PUT /admin/catalog/services/:id`
Updates details of an existing service.

*   **Request Payload**: Same properties as `POST /admin/catalog/services`.
*   **Responses**:
    *   **200 OK**:
        ```json
        {
          "success": true,
          "message": "Service catalog updated successfully"
        }
        ```
    *   **404 Not Found**:
        ```json
        {
          "success": false,
          "error": "Not Found",
          "message": "Service with the specified ID could not be found."
        }
        ```
