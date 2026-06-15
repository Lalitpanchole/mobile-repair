# MPC Repairs Backend Architecture v2.0 (Final Approved)

## Project Overview

MPC Repairs is a repair booking platform with:

* Public Website
* Single Admin Dashboard
* Repair Catalog System
* Booking Management
* CMS Management
* Branch Management
* Working Hours & Scheduling
* Enquiry Management
* Notifications

There are NO:

* Customer Dashboard
* Technician Dashboard
* Staff Dashboard
* Branch Manager Dashboard
* Multi-role RBAC System

The entire system is managed by a single Admin account.

---

# Technology Stack

## Backend

* Node.js
* Express.js
* Prisma ORM
* MySQL

## Security

* JWT Authentication
* bcryptjs
* Helmet
* CORS
* Express Rate Limit

## Storage

* Cloudinary (Images & Videos)

## Cache & Locking

* Redis

## Deployment

* Railway

---

# Catalog Architecture

Repair catalog is NOT stored in database.

Source Files:

* iPhone TXT
* Samsung TXT
* Google TXT
* Dell TXT
* HP TXT
* Lenovo TXT
* Asus TXT
* Acer TXT
* Huawei TXT
* Microsoft TXT
* Apple Watch TXT
* iPad TXT
* Oppo TXT
* OnePlus TXT

Flow:

TXT Files
↓
generateCatalog.cjs
↓
catalog.json
↓
Server Memory
↓
GET /api/v1/public/catalog

The catalog contains:

* Brands
* Device Types
* Models
* Repair Types
* Part Qualities
* Prices
* Warranty Information
* Duration

Catalog data is read-only.

No database tables exist for catalog data.

---

# Database Tables

Total Tables: 12

## 1. admins

Single admin login.

Fields:

* id
* name
* email
* password
* active
* created_at
* updated_at

---

## 2. bookings

Core booking table.

Fields:

* id (INT AUTO_INCREMENT)
* booking_number (BKG-0001)
* customer_name
* customer_phone
* customer_email

Device Snapshot:

* device_brand
* device_type
* device_model
* repair_name
* part_quality

Pricing:

* final_price

Booking Snapshot:

* repair_snapshot (JSON)

Scheduling:

* booking_date
* booking_time

Status:

* Pending
* Confirmed
* In Progress
* Completed
* Cancelled

Other:

* notes
* booking_source (website/admin)
* branch_id
* created_at
* updated_at

Indexes:

* booking_number
* customer_name
* customer_phone
* customer_email
* device_model
* booking_date

---

## 3. enquiries

Website contact enquiries.

Fields:

* id
* name
* email
* phone
* message
* is_read
* created_at

---

## 4. branches

Store locations.

Fields:

* id
* name
* address
* phone
* email
* active
* created_at
* updated_at

---

## 5. store_hours

Weekly operating hours.

Fields:

* id
* branch_id
* day_name

Times:

* open_time
* close_time
* break_start
* break_end

Flags:

* is_closed

---

## 6. schedule_exceptions

Holiday closures and custom schedules.

Fields:

* id
* branch_id
* title
* date
* type

Custom Hours:

* custom_open
* custom_close

Flags:

* active

---

## 7. sliders

Homepage hero banners.

Fields:

* id
* title
* subtitle
* image_url
* button_text
* button_link
* sort_order
* active

---

## 8. home_video

Homepage video configuration.

Fields:

* id
* title
* video_url
* accent_color
* autoplay
* loop
* muted

---

## 9. pages

CMS Pages.

Fields:

* id
* title
* slug
* content

SEO:

* meta_title
* meta_description

Status:

* active

---

## 10. testimonials

Customer reviews.

Fields:

* id
* customer_name
* rating
* review
* source
* visible
* created_at

---

## 11. settings

Store settings.

Fields:

* id
* store_name
* store_email
* store_phone
* store_address
* currency
* timezone

Notification Settings:

* email_notifications
* booking_notifications

Security Settings:

* allow_login

---

## 12. notifications

Admin notifications.

Fields:

* id
* title
* description
* type
* booking_id
* is_read
* created_at

---

# Public APIs

## Catalog

GET /api/v1/public/catalog

Returns full repair catalog.

---

## Branches

GET /api/v1/public/branches

Returns available locations.

---

## Slots

GET /api/v1/public/slots

Parameters:

* date
* branch_id

Returns available booking slots.

---

## Create Booking

POST /api/v1/public/bookings

Creates repair booking.

---

## Create Enquiry

POST /api/v1/public/enquiries

Creates website enquiry.

---

## Public Settings

GET /api/v1/public/settings

Returns:

* store_name
* phone
* email
* address
* currency

Only safe public information.

---

# Authentication APIs

POST /api/v1/auth/login

POST /api/v1/auth/logout

GET /api/v1/auth/profile

PUT /api/v1/auth/change-password

---

# Admin APIs

## Dashboard

GET /api/v1/admin/dashboard/stats

Returns:

* newBookings
* totalBookings
* newEnquiries

GET /api/v1/admin/dashboard/calendar

Returns calendar booking data.

---

## Search

GET /api/v1/admin/search?q=

Searches:

* bookings
* customer names
* customer phones
* device models

---

## Bookings

GET /api/v1/admin/bookings

GET /api/v1/admin/bookings/:id

POST /api/v1/admin/bookings

PUT /api/v1/admin/bookings/:id

DELETE /api/v1/admin/bookings/:id

PUT /api/v1/admin/bookings/:id/status

PUT /api/v1/admin/bookings/:id/reschedule

---

## Enquiries

GET /api/v1/admin/enquiries

PUT /api/v1/admin/enquiries/:id/read

---

## Sliders

CRUD APIs

---

## Home Video

CRUD APIs

---

## Pages

CRUD APIs

---

## Testimonials

CRUD APIs

---

## Branches

CRUD APIs

---

## Store Hours

CRUD APIs

---

## Schedule Exceptions

CRUD APIs

---

## Settings

GET /api/v1/admin/settings

PUT /api/v1/admin/settings

---

## Notifications

GET /api/v1/admin/notifications

PUT /api/v1/admin/notifications/:id/read

DELETE /api/v1/admin/notifications/:id

---

# Business Rules

## Double Booking Prevention

Redis Lock:

branch_id
+
date
+
time_slot

Only one booking can occupy a slot.

---

## Booking Number

Generated automatically.

Example:

BKG-0001
BKG-0002
BKG-0003

---

## Repair Snapshot

Every booking stores complete repair JSON.

Price changes in catalog do not affect historical bookings.

---

## Catalog Loading

Catalog loaded once during server startup.

No repeated disk reads.

No repeated API requests.

---

# Frontend Integration Rules

BookingContext handles only:

* modal state
* selected device
* selected repair
* selected date
* selected slot

Admin data must NEVER be stored in BookingContext.

Admin pages fetch data directly from APIs.

---

# Deployment

Environment Variables

DATABASE_URL=

JWT_SECRET=

REDIS_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

FRONTEND_URL=

PORT=

---

# Development Order

Phase 1

* Prisma Schema
* Database Setup

Phase 2

* Catalog Generator
* catalog.json

Phase 3

* Authentication

Phase 4

* Public APIs

Phase 5

* Admin APIs

Phase 6

* Frontend Integration

Phase 7

* Railway Deployment

This document is the final approved backend architecture for MPC Repairs.
