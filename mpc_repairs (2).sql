-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2026 at 08:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mpc_repairs`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin@mpcrepairs.com.au', '$2b$10$PjnFU03UDGNsehroW2o7J.wV1wNQrpBbyzOXKmVnfR1Rgvh92KhR6', 1, '2026-06-12 13:23:54.520', '2026-06-13 07:43:57.480'),
(2, 'Super Admin', 'admin@gmail.com', '$2b$10$61q0vgspG5aZTwGOrhy1YuIBuKd72F.HrpttMtIyUaqPjcU5bvQ1W', 1, '2026-06-13 07:46:06.018', '2026-06-13 07:48:24.657');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_number` varchar(20) NOT NULL,
  `customer_name` varchar(191) NOT NULL,
  `customer_phone` varchar(50) NOT NULL,
  `customer_email` varchar(191) NOT NULL,
  `device_brand` varchar(100) NOT NULL,
  `device_type` varchar(100) NOT NULL,
  `device_model` varchar(191) NOT NULL,
  `repair_name` varchar(191) NOT NULL,
  `part_quality` varchar(191) DEFAULT NULL,
  `final_price` decimal(10,2) NOT NULL,
  `repair_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`repair_snapshot`)),
  `date_str` date NOT NULL,
  `time_slot` varchar(20) NOT NULL,
  `status` enum('Pending','Confirmed','In Progress','Completed','Cancelled','Rejected') NOT NULL DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `created_source` enum('website','admin') NOT NULL DEFAULT 'website',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_number`, `customer_name`, `customer_phone`, `customer_email`, `device_brand`, `device_type`, `device_model`, `repair_name`, `part_quality`, `final_price`, `repair_snapshot`, `date_str`, `time_slot`, `status`, `notes`, `created_source`, `created_at`, `updated_at`) VALUES
(1, 'BKG-0001', 'Test Customer', '0412345678', 'test@customer.com', 'Apple', 'Phone', 'iPhone 16 Pro Max', 'Screen Repair', 'Soft OLED', 319.00, '{\"brand\":\"Apple\",\"deviceType\":\"Phone\",\"model\":\"iPhone 16 Pro Max\",\"repair\":\"Screen Repair\",\"price\":319}', '2026-06-25', '09:00 AM', 'Rejected', 'Please handle with care.', 'website', '2026-06-12 13:28:51.680', '2026-06-13 08:43:04.588'),
(2, 'BKG-0002', 'Test Customer', '0412345678', 'test@customer.com', 'Apple', 'Phone', 'iPhone 16 Pro Max', 'Screen Repair', 'Soft OLED', 319.00, '{\"brand\":\"Apple\",\"deviceType\":\"Phone\",\"model\":\"iPhone 16 Pro Max\",\"repair\":\"Screen Repair\",\"price\":319}', '2026-06-25', '10:30 AM', 'Rejected', 'Please handle with care.', 'website', '2026-06-13 06:39:46.702', '2026-06-13 08:41:57.278'),
(3, 'BKG-0003', 'Test Customer', '0412345678', 'test@customer.com', 'Apple', 'Phone', 'iPhone 16 Pro Max', 'Screen Repair', 'Soft OLED', 319.00, '{\"brand\":\"Apple\",\"deviceType\":\"Phone\",\"model\":\"iPhone 16 Pro Max\",\"repair\":\"Screen Repair\",\"price\":319}', '2026-06-25', '12:00 PM', 'Rejected', 'Please handle with care.', 'website', '2026-06-13 07:26:00.493', '2026-06-13 08:42:36.216'),
(4, 'BKG-0004', 'Test Customer', '0412345678', 'test@customer.com', 'Apple', 'Phone', 'iPhone 16 Pro Max', 'Screen Repair', 'Soft OLED', 319.00, '{\"brand\":\"Apple\",\"deviceType\":\"Phone\",\"model\":\"iPhone 16 Pro Max\",\"repair\":\"Screen Repair\",\"price\":319}', '2026-06-25', '03:00 PM', 'Rejected', 'Please handle with care.', 'website', '2026-06-13 07:30:38.724', '2026-06-13 08:42:32.231'),
(5, 'BKG-0005', 'Test Customer', '0412345678', 'test@customer.com', 'Apple', 'Phone', 'iPhone 16 Pro Max', 'Screen Repair', 'Soft OLED', 319.00, '{\"brand\":\"Apple\",\"deviceType\":\"Phone\",\"model\":\"iPhone 16 Pro Max\",\"repair\":\"Screen Repair\",\"price\":319}', '2026-06-25', '10:35 AM', 'Rejected', 'Please handle with care.', 'website', '2026-06-13 07:46:29.067', '2026-06-13 08:42:00.639'),
(6, 'BKG-0006', 'demoo', '1234567876543', 'rew@gmail.com', 'Microsoft', 'Surface Tablet', 'Surface Pro 8', 'Screen Repair', NULL, 170.00, '{\"brand\":\"Microsoft\",\"deviceType\":\"Surface Tablet\",\"model\":\"Surface Pro 8\",\"repair\":\"Screen Repair\",\"quality\":\"Standard\",\"price\":170,\"warranty\":\"12 mo warranty\"}', '2026-06-19', '10:35 AM', 'Rejected', 'Hellooo', 'website', '2026-06-13 08:52:11.695', '2026-06-13 09:52:26.996'),
(7, 'BKG-0007', 'fgrdh', 'ewggwgeegw', 'fddyufe@gmail.com', 'Microsoft', 'Surface Tablet', 'Surface Pro 9', 'Screen Repair / Replacement', NULL, 920.00, '{\"brand\":\"Microsoft\",\"deviceType\":\"Surface Tablet\",\"model\":\"Surface Pro 9\",\"repair\":\"Screen Repair / Replacement\",\"quality\":\"Standard\",\"price\":920,\"warranty\":\"12 mo warranty\"}', '2026-06-16', '03:20 PM', 'Rejected', NULL, 'website', '2026-06-13 09:37:17.908', '2026-06-13 09:52:23.514'),
(8, 'BKG-0008', 'xdfc', 'esrdtyguhijh', 'rdtfy@gmail.com', 'Apple', 'iPhone', 'iPhone 17 Pro', 'Rear Camera Replacement', NULL, 270.00, '{\"brand\":\"Apple\",\"deviceType\":\"iPhone\",\"model\":\"iPhone 17 Pro\",\"repair\":\"Rear Camera Replacement\",\"quality\":\"Standard\",\"price\":270,\"warranty\":\"12 mo warranty\"}', '2026-06-15', '12:10 PM', 'Rejected', 'yguh', 'website', '2026-06-13 09:38:26.927', '2026-06-13 09:52:20.482'),
(9, 'BKG-0009', 'èfs', '1234567890', 'dwqf@gmail.com', 'Google', 'Pixel', 'Pixel 10', 'Screen Repair', NULL, 349.00, '{\"brand\":\"Google\",\"deviceType\":\"Pixel\",\"model\":\"Pixel 10\",\"repair\":\"Screen Repair\",\"quality\":\"Standard\",\"price\":349,\"warranty\":\"12 mo warranty\"}', '2026-06-15', '09:00 AM', 'Confirmed', 'wqv', 'website', '2026-06-13 09:50:29.789', '2026-06-13 09:52:35.907');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `type` enum('booking','alert','system') NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `description`, `type`, `booking_id`, `is_read`, `created_at`) VALUES
(1, 'New Booking #BKG-0001', 'Test Customer booked iPhone 16 Pro Max (Screen Repair) at Brisbane HQ', 'booking', 1, 0, '2026-06-12 13:28:51.742'),
(2, 'New Booking #BKG-0002', 'Test Customer booked iPhone 16 Pro Max (Screen Repair) at Brisbane HQ', 'booking', 2, 0, '2026-06-13 06:39:46.752'),
(3, 'New Booking #BKG-0003', 'Test Customer booked iPhone 16 Pro Max (Screen Repair) at 12:00 PM', 'booking', 3, 0, '2026-06-13 07:26:00.560'),
(4, 'New Booking #BKG-0004', 'Test Customer booked iPhone 16 Pro Max (Screen Repair) at 03:00 PM', 'booking', 4, 0, '2026-06-13 07:30:38.759'),
(5, 'New Booking #BKG-0005', 'Test Customer booked iPhone 16 Pro Max (Screen Repair) at 10:35 AM', 'booking', 5, 0, '2026-06-13 07:46:29.096'),
(6, 'New Booking #BKG-0006', 'demoo booked Surface Pro 8 (Screen Repair) at 10:35 AM', 'booking', 6, 0, '2026-06-13 08:52:11.887'),
(7, 'New Booking #BKG-0007', 'fgrdh booked Surface Pro 9 (Screen Repair / Replacement) at 03:20 PM', 'booking', 7, 0, '2026-06-13 09:37:18.070'),
(8, 'New Booking #BKG-0008', 'xdfc booked iPhone 17 Pro (Rear Camera Replacement) at 12:10 PM', 'booking', 8, 0, '2026-06-13 09:38:26.974'),
(9, 'New Booking #BKG-0009', 'èfs booked Pixel 10 (Screen Repair) at 09:00 AM', 'booking', 9, 0, '2026-06-13 09:50:29.895');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_exceptions`
--

CREATE TABLE `schedule_exceptions` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `type` enum('Closed','Custom Hours') NOT NULL,
  `custom_open` time DEFAULT NULL,
  `custom_close` time DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `store_name` varchar(191) NOT NULL DEFAULT 'MPC Repairs',
  `store_email` varchar(191) NOT NULL DEFAULT 'support@irepairexperts.com.au',
  `store_phone` varchar(50) NOT NULL DEFAULT '+61 1300 473 724',
  `store_address` varchar(500) NOT NULL DEFAULT '168 Cavendish Road, Coorparoo QLD 4151',
  `currency` varchar(191) NOT NULL DEFAULT 'AUD ($)',
  `updated_at` datetime(3) NOT NULL,
  `booking_slot_duration` int(11) NOT NULL DEFAULT 90,
  `timezone` varchar(191) NOT NULL DEFAULT 'Australia/Brisbane'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `store_name`, `store_email`, `store_phone`, `store_address`, `currency`, `updated_at`, `booking_slot_duration`, `timezone`) VALUES
(1, 'MPC Repairs', 'support@irepairexperts.com.au', '+61 426 186 212', 'westfield kotara , k230 , Level 2/89  Northcott Dr , kotara NSW 2289', 'AUD ($)', '2026-06-13 07:43:38.614', 95, 'Australia/Brisbane');

-- --------------------------------------------------------

--
-- Table structure for table `store_hours`
--

CREATE TABLE `store_hours` (
  `id` int(11) NOT NULL,
  `day_name` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `open_time` time NOT NULL,
  `close_time` time NOT NULL,
  `break_start` time DEFAULT NULL,
  `break_end` time DEFAULT NULL,
  `is_closed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `store_hours`
--

INSERT INTO `store_hours` (`id`, `day_name`, `open_time`, `close_time`, `break_start`, `break_end`, `is_closed`) VALUES
(1, 'Monday', '09:00:00', '18:00:00', '13:00:00', '14:00:00', 0),
(2, 'Tuesday', '09:00:00', '18:00:00', '13:00:00', '14:00:00', 0),
(3, 'Wednesday', '09:00:00', '18:00:00', '13:00:00', '14:00:00', 0),
(4, 'Thursday', '09:00:00', '18:00:00', '13:00:00', '14:00:00', 0),
(5, 'Friday', '09:00:00', '18:00:00', '13:00:00', '14:00:00', 0),
(6, 'Saturday', '09:00:00', '17:00:00', '13:00:00', '14:00:00', 0),
(7, 'Sunday', '09:00:00', '17:00:00', '13:00:00', '14:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('d19d9490-6ec5-404e-a86c-4a9f5304c761', 'd0748f3f1e3ebcb26f7992d07ea6d9192318ff72e9532b1cd0462c8d23e55022', '2026-06-12 13:14:44.066', '20260612131443_init', NULL, NULL, '2026-06-12 13:14:43.363', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_key` (`email`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookings_booking_number_key` (`booking_number`),
  ADD KEY `bookings_customer_name_idx` (`customer_name`),
  ADD KEY `bookings_customer_phone_idx` (`customer_phone`),
  ADD KEY `bookings_customer_email_idx` (`customer_email`),
  ADD KEY `bookings_device_model_idx` (`device_model`),
  ADD KEY `bookings_status_idx` (`status`),
  ADD KEY `bookings_date_str_time_slot_idx` (`date_str`,`time_slot`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_booking_id_fkey` (`booking_id`);

--
-- Indexes for table `schedule_exceptions`
--
ALTER TABLE `schedule_exceptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `schedule_exceptions_date_key` (`date`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_hours`
--
ALTER TABLE `store_hours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `store_hours_day_name_key` (`day_name`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `schedule_exceptions`
--
ALTER TABLE `schedule_exceptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_hours`
--
ALTER TABLE `store_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
