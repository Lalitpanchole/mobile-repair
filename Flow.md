# MPC Repairs - Operational Workflows & System Flows

This document details the operational flows, state transitions, and business logics within the MPC Repairs booking and management system.

---

## 📅 1. Customer Booking & Checkout Flow
Shows the progression from a client visiting the site to scheduling a confirmed repair slot.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Customer Frontend
    participant API as Express.js Backend
    participant DB as PostgreSQL Database
    participant Cache as Redis Cache
    participant Msg as Notification Engine

    Client->>API: GET /api/v1/public/catalog (Fetch Brands, Types & Models)
    API->>DB: Query Active Services & Categories
    DB-->>API: Active Catalog Data
    API-->>Client: Returns JSON Catalog
    Client->>Client: Step 1-3: Select Brand, Device Type, and Model
    Client->>Client: Step 4-5: Select Repair Type & Part Quality Tier
    Client->>API: GET /api/v1/public/slots?date=YYYY-MM-DD&branch_id=XYZ
    API->>DB: Check Store Hours & Exception Dates
    API->>DB: Check Bookings Count per Slot
    API-->>Client: Returns Available Time Slots Array
    Client->>Client: Step 6: Select Slot & Input Client Info
    Client->>API: POST /api/v1/public/bookings (Confirm Appointment Request)
    API->>Cache: Check Lock (locks:branch:id:date:slot)
    alt Lock Exists (Slot taken / checkout in progress)
        Cache-->>API: Lock Active
        API-->>Client: 409 Conflict (Slot taken - pick another)
    else Slot is Free
        API->>Cache: Set Lock with 10-minute expiry (locks:branch:id:date:slot = "locked")
        API->>DB: Start Transaction (Write Booking & Update Status to 'Pending')
        DB-->>API: Transaction Success
        API->>Cache: Remove Temporary Lock
        API->>Msg: Trigger Confirmation Notifications (Email & SMS)
        Msg-->>Client: Delivery Confirmed
        API-->>Client: 201 Created (Booking complete, redirect to Success popup)
    end
```

---

## 🔒 2. Double-Booking Prevention Logic Flow
Ensures that multiple checkouts do not result in overbooking the same time slot at the same store branch.

```mermaid
flowchart TD
    A[Customer Checkout Requested] --> B{Retrieve date, time_slot, and branch_id}
    B --> C[Check Redis keys: locks:branch_id:date:slot]
    C -->|Key Exists / Locked| D[Return 409 Conflict: Slot is currently busy]
    C -->|No Key / Available| E[Acquire Redis Lock: Set key with 10-minute expiry]
    E --> F[Execute DB transaction to insert booking]
    F -->|Success| G[Confirm DB Booking]
    G --> H[Delete temporary Redis Lock]
    G --> I[Return 201 Booking Success]
    F -->|Fail / Rollback| J[Rollback DB changes]
    J --> K[Delete temporary Redis Lock]
    K --> L[Return 500 Server Error / Retry]
```

---

## 🕰️ 3. Store Hours & Holiday Exceptions Validator Flow
Computes available time slots for the customer scheduling calendar.

```mermaid
flowchart TD
    A[Request Available Slots for Date & Branch] --> B[Fetch Branch Schedules & Exceptions]
    B --> C{Is Date listed in Exception Holidays?}
    C -->|Yes, is_closed = true| D[Return slots: [] - Branch Closed on this day]
    C -->|Yes, has custom_hours| E[Set schedule limits to holiday trade hours]
    C -->|No| F[Fetch regular hours matching day of week]
    F --> G{Is Schedule status 'Closed'?}
    G -->|Yes (e.g. Sunday)| H[Return slots: [] - Closed on Sundays]
    G -->|No (Open)| I[Split operating range into 90-minute slot intervals]
    E --> I
    I --> J[Fetch count of active bookings for date & slot]
    J --> K{Bookings Count >= Max Limit per slot?}
    K -->|Yes| L[Remove slot from available list]
    K -->|No| M[Retain slot in available list]
    L & M --> N[Return final list of available slots to Frontend]
```

---

## 🎛️ 4. Admin Calendar Rescheduling (Drag & Drop Flow)
How calendar edits update scheduling states in real time.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin Workspace
    participant API as Express.js Backend
    participant DB as PostgreSQL Database
    participant Msg as Notification Engine

    Admin->>Admin: Drags Booking BKG-5092 from June 3rd to June 10th
    Admin->>API: PUT /api/v1/admin/bookings/BKG-5092/reschedule
    Note over API: Payload contains target dateStr (2026-06-10) and time_slot
    API->>DB: Verify target slot availability limits
    alt Limit Exceeded / Store Closed
        DB-->>API: Target Slot Unavailable
        API-->>Admin: 400 Bad Request (Cannot reschedule to unavailable date)
    else Slot Available
        API->>DB: Update date_str, time_slot, and status to 'Confirmed'
        DB-->>API: Database Update Confirmed
        API->>Msg: Trigger Alert (Send reschedule Email & SMS to client)
        Msg-->>Admin: Alert dispatched
        API-->>Admin: 200 OK (Schedule Updated successfully, calendar refreshes)
    end
```

---

## 📧 5. Status Transitions & Notification Workflows
Standard lifecycle transitions of a booking and triggered notifications.

```mermaid
stateDiagram-v2
    [*] --> Pending : Customer places booking online
    
    state Pending {
        [*] --> SendManagerAlert : Emails store manager of new queue
        SendManagerAlert --> SendCustomerReceipt : Emails & SMS client receipt verification
    }
    
    Pending --> Confirmed : Admin reviews and schedules
    Confirmed --> SendMapDetails : SMS Twilio + SendGrid dispatch (Includes branch details & map pin)
    
    Confirmed --> InProgress : Technician checks-in device
    InProgress --> TechnicianNotification : Emails technician assigned details (Alex, Sarah, James)
    
    InProgress --> Completed : Repair completed & quality checked
    state Completed {
        [*] --> GenerateInvoice : Generates PDF invoice & uploads to Cloud S3
        GenerateInvoice --> SendInvoiceEmail : Emails PDF invoice copy to customer
        SendInvoiceEmail --> SendReviewRequest : Sends review request link (Mock Google Review)
    }
    
    Pending --> Rejected : Admin rejects schedule (Incompatible part/slot)
    Rejected --> SendCancellationNotification : Sends rejection explanation email
    
    Confirmed --> Cancelled : Customer requests cancellation
    Cancelled --> SendCancellationNotification : Sends confirmation of cancellation
    
    Completed --> [*]
    Rejected --> [*]
    Cancelled --> [*]
