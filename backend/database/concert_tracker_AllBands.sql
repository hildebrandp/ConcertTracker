-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 11. Jan 2026 um 22:23
-- Server-Version: 10.11.11-MariaDB
-- PHP-Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `concert_tracker`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ConcertBands`
--

CREATE TABLE `ConcertBands` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL COMMENT 'The name of the band you have seen',
  `genre` text DEFAULT NULL COMMENT 'The music genre of the band (e.g., "Rock," "Pop," "Metal")',
  `origin_country` text DEFAULT NULL COMMENT 'The country the band is from',
  `rating` int(11) DEFAULT NULL COMMENT 'A rating for the band''s performance (e.g., a scale from 1 to 10)',
  `notes` text DEFAULT NULL COMMENT 'A text field for personal notes or memories about the performance',
  `link` text DEFAULT NULL COMMENT 'A link to the Band on Plex',
  `website` text DEFAULT NULL COMMENT 'Link to the bands website'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Daten für Tabelle `ConcertBands`
--

INSERT INTO `ConcertBands` (`id`, `name`, `genre`, `origin_country`, `rating`, `notes`, `link`, `website`) VALUES
(15, 'Megadeath', NULL, NULL, 0, NULL, NULL, NULL),
(16, 'Anthrax', NULL, NULL, 0, NULL, NULL, NULL),
(17, 'Slayer', NULL, NULL, 7, NULL, NULL, NULL),
(18, 'Metallica', NULL, NULL, 10, NULL, NULL, NULL),
(19, 'Insense', NULL, NULL, 0, NULL, NULL, NULL),
(20, 'Rise to Remain', NULL, NULL, 9, NULL, NULL, NULL),
(21, 'Ghost', NULL, NULL, 2, NULL, NULL, NULL),
(22, 'In Flames', NULL, 'Sweden', 10, NULL, NULL, NULL),
(23, 'Stoneman', NULL, NULL, 5, NULL, NULL, NULL),
(24, 'Mono Inc', NULL, NULL, 9, NULL, NULL, NULL),
(25, 'Delain', NULL, NULL, 0, NULL, NULL, NULL),
(26, 'Battle Beast', NULL, NULL, 9, NULL, NULL, NULL),
(27, 'Sabaton', 'Powermetal', 'Sweden', 10, NULL, NULL, NULL),
(28, 'The Beauty of Gemina', NULL, NULL, 0, NULL, NULL, NULL),
(29, 'Maurauder', NULL, 'Germany', NULL, NULL, NULL, NULL),
(30, 'Agatha shot', NULL, 'Germany', NULL, NULL, NULL, NULL),
(31, 'Burn these Lies', NULL, 'Germany', NULL, NULL, NULL, NULL),
(32, 'Hexa', NULL, 'Germany', NULL, NULL, NULL, NULL),
(33, 'Parasite Inc.', NULL, 'Germany', NULL, NULL, NULL, NULL),
(34, 'Summery Mind', NULL, 'Germany', NULL, NULL, NULL, NULL),
(35, 'Nothgard', NULL, 'Germany', NULL, NULL, NULL, NULL),
(36, 'Suidakra', NULL, 'Germany', NULL, NULL, NULL, NULL),
(37, 'Soulbound', NULL, 'Germany', NULL, NULL, NULL, NULL),
(38, 'Excrementory Grindfuckers', NULL, NULL, NULL, NULL, NULL, NULL),
(39, 'Lantlós', NULL, NULL, NULL, NULL, NULL, NULL),
(40, 'Torian', NULL, NULL, NULL, NULL, NULL, NULL),
(41, 'Horseman', NULL, NULL, NULL, NULL, NULL, NULL),
(42, 'Mata Leao', NULL, NULL, NULL, NULL, NULL, NULL),
(43, 'All will Know', NULL, NULL, NULL, NULL, NULL, NULL),
(44, 'Necrotted', NULL, NULL, NULL, NULL, NULL, NULL),
(45, 'Folks Sake', NULL, NULL, NULL, NULL, NULL, NULL),
(46, 'Cobblestones', NULL, NULL, NULL, NULL, NULL, NULL),
(47, 'Dizzy Spell', NULL, NULL, NULL, NULL, NULL, NULL),
(48, 'Larry Mathews Blackstone', NULL, NULL, NULL, NULL, NULL, NULL),
(49, 'Nobody knows', NULL, NULL, NULL, NULL, NULL, NULL),
(50, 'Keltics', NULL, NULL, NULL, NULL, NULL, NULL),
(51, 'Dhalia ́s Lane', NULL, NULL, NULL, NULL, NULL, NULL),
(52, 'Tir Nan Og', NULL, NULL, NULL, NULL, NULL, NULL),
(53, 'Tanzwut', NULL, NULL, NULL, NULL, NULL, NULL),
(54, 'Chevelle', NULL, NULL, NULL, NULL, NULL, NULL),
(55, 'Disturbed', NULL, NULL, NULL, NULL, NULL, NULL),
(56, 'Avenged Sevenfold', NULL, NULL, NULL, NULL, NULL, NULL),
(57, 'Limelight Fire', NULL, NULL, NULL, NULL, NULL, NULL),
(58, 'Hey Miracle', NULL, NULL, NULL, NULL, NULL, NULL),
(59, 'Quit Cowtone', NULL, NULL, NULL, NULL, NULL, NULL),
(60, 'Narrowlane', NULL, NULL, NULL, NULL, NULL, NULL),
(61, 'As I Rise', NULL, NULL, NULL, NULL, NULL, NULL),
(62, 'The Sinderellas', NULL, NULL, NULL, NULL, NULL, NULL),
(63, 'Witt', NULL, NULL, NULL, NULL, NULL, NULL),
(64, 'Versengold', NULL, NULL, NULL, NULL, NULL, NULL),
(65, 'Beyond The Black', NULL, NULL, NULL, NULL, NULL, NULL),
(66, 'Testament', NULL, NULL, NULL, NULL, NULL, NULL),
(67, 'Hammerfall', 'Powermetal', NULL, NULL, NULL, NULL, NULL),
(68, 'Airbourne', NULL, NULL, NULL, NULL, NULL, NULL),
(69, 'Eluveite', NULL, NULL, NULL, NULL, NULL, NULL),
(70, 'Within Temptation', NULL, NULL, NULL, NULL, NULL, NULL),
(71, 'Deamons & Wizards', NULL, NULL, NULL, NULL, NULL, NULL),
(72, 'Die Kassierer', NULL, NULL, NULL, NULL, NULL, NULL),
(73, 'Parkway Drive', NULL, NULL, NULL, NULL, NULL, NULL),
(74, 'Powerwolf', 'Powermetal', NULL, NULL, NULL, NULL, NULL),
(75, 'Saxon', NULL, NULL, NULL, NULL, NULL, NULL),
(76, 'Eisbrecher', NULL, NULL, NULL, NULL, NULL, NULL),
(77, 'Frog Leap', NULL, NULL, NULL, NULL, NULL, NULL),
(78, 'Bokassa', NULL, NULL, NULL, NULL, NULL, NULL),
(79, 'Hypocrisy', NULL, NULL, NULL, NULL, NULL, NULL),
(80, 'Arch Enemy', NULL, NULL, NULL, NULL, NULL, NULL),
(81, 'Amon Amarth', 'Melodic Death Metal', 'Sweden', NULL, NULL, NULL, NULL),
(82, 'Infected Rain', NULL, NULL, NULL, NULL, NULL, NULL),
(83, 'Lacuna Coil', NULL, NULL, NULL, NULL, NULL, NULL),
(84, 'Brothers Of Metal', NULL, NULL, NULL, NULL, NULL, NULL),
(85, 'Gloryhammer', NULL, NULL, NULL, NULL, NULL, NULL),
(86, 'Epica', NULL, NULL, NULL, NULL, NULL, NULL),
(87, 'Knasterbart', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(88, 'Torfrock', NULL, NULL, NULL, NULL, NULL, NULL),
(89, 'Rose Tattoo', NULL, NULL, NULL, NULL, NULL, NULL),
(90, 'Judas Priest', NULL, NULL, NULL, NULL, NULL, NULL),
(91, 'Kadavar', NULL, NULL, NULL, NULL, NULL, NULL),
(92, 'Behemoth', NULL, NULL, NULL, NULL, NULL, NULL),
(93, 'In Extremo', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(94, 'Slipknot', NULL, NULL, NULL, NULL, NULL, NULL),
(95, 'ASP', NULL, NULL, NULL, NULL, NULL, NULL),
(96, 'Feuerschwanz', NULL, NULL, NULL, NULL, NULL, NULL),
(97, 'Bleed From Within', 'Metalcore', NULL, NULL, NULL, NULL, NULL),
(98, 'Deine Cousine', NULL, NULL, NULL, NULL, NULL, NULL),
(99, 'As I Lay Dying', NULL, NULL, NULL, NULL, NULL, NULL),
(100, 'Hämatom', NULL, NULL, NULL, NULL, NULL, NULL),
(101, 'Lordi', NULL, NULL, NULL, NULL, NULL, NULL),
(102, 'The Halo Effect', NULL, NULL, NULL, NULL, NULL, NULL),
(103, 'Machine Head', NULL, NULL, NULL, NULL, NULL, NULL),
(104, 'Butcher Babies', NULL, NULL, NULL, NULL, NULL, NULL),
(105, 'Amaranthe', NULL, NULL, NULL, NULL, NULL, NULL),
(106, 'Animals As Leaders', NULL, NULL, NULL, NULL, NULL, NULL),
(107, 'Humanity\'s Last Breath', NULL, NULL, NULL, NULL, NULL, NULL),
(108, 'Mr. Irish Bastard', NULL, NULL, NULL, NULL, NULL, NULL),
(109, 'Mr. Hurley & Die Pulveraffen', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(110, 'Subway To Sally', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(111, 'Malevolence', NULL, NULL, NULL, NULL, NULL, NULL),
(112, 'Obituary', NULL, NULL, NULL, NULL, NULL, NULL),
(113, 'Trivium', NULL, NULL, NULL, NULL, NULL, NULL),
(114, 'Heaven Shall Burn', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(115, 'Baby Metal', NULL, NULL, NULL, NULL, NULL, NULL),
(116, 'Trash Boat', NULL, NULL, NULL, NULL, NULL, NULL),
(117, 'Four Years Strong', NULL, NULL, NULL, NULL, NULL, NULL),
(118, 'The Offspring', 'Punk Rock', 'USA', NULL, NULL, NULL, NULL),
(119, 'Rammstein', 'Metal', 'Deutschland', NULL, NULL, NULL, NULL),
(120, 'Grailknights', NULL, NULL, NULL, NULL, NULL, NULL),
(121, 'Warkings', NULL, NULL, NULL, NULL, NULL, NULL),
(122, 'Fiddler\'s Green', NULL, NULL, NULL, NULL, NULL, NULL),
(123, 'Phantom Elite', NULL, NULL, NULL, NULL, NULL, NULL),
(124, 'Blackbriar', NULL, NULL, NULL, NULL, NULL, NULL),
(125, 'Ad Infinitum', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(126, 'Kupfergold', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(127, 'Boogie Banausen', NULL, NULL, NULL, NULL, NULL, NULL),
(128, 'Saint Deamon', NULL, NULL, NULL, NULL, NULL, NULL),
(129, 'Induction', NULL, NULL, NULL, NULL, NULL, NULL),
(130, 'Hammerking', NULL, NULL, NULL, NULL, NULL, NULL),
(131, 'Victorius', NULL, NULL, NULL, NULL, NULL, NULL),
(132, 'Dominium', NULL, NULL, NULL, NULL, NULL, NULL),
(133, 'Orden Ogan', NULL, NULL, NULL, NULL, NULL, NULL),
(134, 'Mammoth', NULL, NULL, NULL, NULL, NULL, NULL),
(135, 'Architects', NULL, NULL, NULL, NULL, NULL, NULL),
(136, 'Ice Nine Kills', NULL, NULL, NULL, NULL, NULL, NULL),
(137, 'Five Finger Death Punch', NULL, NULL, NULL, NULL, NULL, NULL),
(138, 'AC/DC', NULL, NULL, NULL, NULL, NULL, NULL),
(139, 'Æonik', NULL, NULL, NULL, NULL, NULL, NULL),
(140, 'The Warning', NULL, NULL, NULL, NULL, NULL, NULL),
(141, 'Flogging Molly', NULL, NULL, NULL, NULL, NULL, NULL),
(142, 'Paddy and the Rats', NULL, NULL, NULL, NULL, NULL, NULL),
(143, 'Oomph', NULL, NULL, NULL, NULL, NULL, NULL),
(144, 'Blind Guardian', NULL, NULL, NULL, NULL, NULL, NULL),
(145, 'Korn', NULL, NULL, NULL, NULL, NULL, NULL),
(146, 'Rise Against', NULL, NULL, NULL, NULL, NULL, NULL),
(147, 'Descendents', NULL, NULL, NULL, NULL, NULL, NULL),
(148, 'Mad Caddies', NULL, NULL, NULL, NULL, NULL, NULL),
(149, 'Comeback Kid', NULL, NULL, NULL, NULL, NULL, NULL),
(150, 'Zebrahead', NULL, NULL, NULL, NULL, NULL, NULL),
(151, 'Less Than Jake', NULL, NULL, NULL, NULL, NULL, NULL),
(152, 'Terror', NULL, NULL, NULL, NULL, NULL, NULL),
(153, 'Strung Out', NULL, NULL, NULL, NULL, NULL, NULL),
(154, 'Feine Sahne Fischfilet', NULL, NULL, NULL, NULL, NULL, NULL),
(155, 'No Fun At All', NULL, NULL, NULL, NULL, NULL, NULL),
(156, 'H2O', NULL, NULL, NULL, NULL, NULL, NULL),
(157, 'A Wilhem Scream', NULL, NULL, NULL, NULL, NULL, NULL),
(158, 'Kanonenfieber', NULL, NULL, NULL, NULL, NULL, NULL),
(159, 'Insomnium', NULL, NULL, NULL, NULL, NULL, NULL),
(160, 'Zeal & Ardor', NULL, NULL, NULL, NULL, NULL, NULL),
(161, 'Heilung', NULL, NULL, NULL, NULL, NULL, NULL),
(162, 'Blind8', NULL, NULL, NULL, NULL, NULL, NULL),
(163, 'Annisokay', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(164, 'Soilwork', NULL, NULL, NULL, NULL, NULL, NULL),
(165, 'Habenichtse', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(166, 'Ye Banished Privateers', NULL, NULL, NULL, NULL, NULL, NULL),
(167, 'Helga', NULL, NULL, NULL, NULL, NULL, NULL),
(168, 'Oranssi Pazuzu', NULL, NULL, NULL, NULL, NULL, NULL),
(169, 'Sólstafir', NULL, NULL, NULL, NULL, NULL, NULL),
(170, 'L.S. Dunes', NULL, NULL, NULL, NULL, NULL, NULL),
(171, 'Sondaschule', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(172, 'Seven Kingdoms', NULL, NULL, NULL, NULL, NULL, NULL),
(173, 'Striker', NULL, NULL, NULL, NULL, NULL, NULL),
(174, 'Unleash the Archers', NULL, NULL, NULL, NULL, NULL, NULL),
(175, 'Demonic', NULL, NULL, NULL, NULL, NULL, NULL),
(176, 'Calva Louise', NULL, NULL, NULL, NULL, NULL, NULL),
(177, 'Bloodywood', NULL, NULL, NULL, NULL, NULL, NULL),
(178, 'The Hu', NULL, NULL, NULL, NULL, NULL, NULL),
(179, 'Hanabie', NULL, NULL, NULL, NULL, NULL, NULL),
(180, 'Saltatio Mortis', NULL, NULL, NULL, NULL, NULL, NULL),
(181, 'Mircale Of Sound', NULL, NULL, NULL, NULL, NULL, NULL),
(182, 'Static-X', NULL, NULL, NULL, NULL, NULL, NULL),
(183, 'Guns N\' Roses', NULL, NULL, NULL, NULL, NULL, NULL),
(184, '1349', NULL, NULL, NULL, NULL, NULL, NULL),
(185, 'Drowning Pool', NULL, NULL, NULL, NULL, NULL, NULL),
(186, 'Moonsorrow', NULL, NULL, NULL, NULL, NULL, NULL),
(187, 'Papa Roach', NULL, NULL, NULL, NULL, NULL, NULL),
(188, 'Dimmu Borgir', NULL, NULL, NULL, NULL, NULL, NULL),
(189, 'The Butcher Sisters', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(190, 'Månegarm', NULL, NULL, NULL, NULL, NULL, NULL),
(191, 'Gojira', NULL, NULL, NULL, NULL, NULL, NULL),
(192, 'Die Apokalyptischen Reiter', NULL, 'Deutschland', NULL, NULL, NULL, NULL),
(193, 'The Amity Affliction', NULL, NULL, NULL, NULL, NULL, NULL),
(194, 'Thy Art Is Murder', NULL, NULL, NULL, NULL, NULL, NULL),
(195, 'Great American Ghost', NULL, NULL, NULL, NULL, NULL, NULL),
(196, 'After The Burial', NULL, NULL, NULL, NULL, NULL, NULL),
(197, 'Angus McSix', NULL, NULL, NULL, NULL, NULL, NULL),
(198, 'Wind Rose', NULL, NULL, NULL, NULL, NULL, NULL),
(199, 'Atlas', NULL, NULL, NULL, NULL, NULL, NULL),
(200, 'Gaerea', NULL, NULL, NULL, NULL, NULL, NULL),
(201, 'Orbit Culture', NULL, NULL, NULL, NULL, NULL, NULL),
(202, 'Simple Plan', NULL, NULL, NULL, NULL, NULL, NULL),
(203, 'Saosin', NULL, NULL, NULL, NULL, NULL, NULL),
(204, 'Currents', NULL, NULL, NULL, NULL, NULL, NULL),
(205, 'The Plot in You', NULL, NULL, NULL, NULL, NULL, NULL),
(206, 'The Narrator', NULL, NULL, NULL, NULL, NULL, NULL),
(207, 'Our Promise', NULL, NULL, NULL, NULL, NULL, NULL),
(208, 'Purple Otten', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ConcertEvents`
--

CREATE TABLE `ConcertEvents` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `datetime` datetime NOT NULL,
  `venue_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Daten für Tabelle `ConcertEvents`
--

INSERT INTO `ConcertEvents` (`id`, `name`, `datetime`, `venue_id`, `rating`, `notes`) VALUES
(14, 'The Big 4', '2011-07-02 17:00:00', 17, 10, ''),
(15, 'In Flames', '2011-11-25 17:00:00', 18, 10, ''),
(16, 'Mono Inc', '2015-11-21 17:00:00', 18, 8, ''),
(17, 'Sabaton', '2015-01-09 18:00:00', 18, 10, ''),
(18, 'Mono Inc', '2013-12-06 19:00:00', 19, 8, ''),
(19, 'Metal Christmas 2016', '2016-12-23 19:00:00', 20, 10, ''),
(20, 'Metal Christmas 2015', '2015-12-20 19:00:00', 20, 10, ''),
(21, 'Irish-Folk Festival 2013', '2013-06-15 19:00:00', 21, 10, ''),
(22, 'Irish-Folk Festival 2014', '2014-06-14 17:00:00', 21, 10, ''),
(23, 'Irish-Folk Festival 2015', '2015-06-13 17:00:00', 21, 10, ''),
(24, 'Irish-Folk Festival 2016', '2016-06-11 17:00:00', 21, 10, ''),
(25, 'Mittelalter Markt', '2016-07-29 17:00:00', 22, 0, ''),
(26, 'Avenged Sevenfold', '2017-02-16 18:00:00', 23, 10, ''),
(27, 'In Flames', '2017-03-24 18:00:00', 24, 6, ''),
(28, 'Soulbound', '2017-04-08 17:00:00', 25, 10, ''),
(29, 'Rock am Hallenbrink', '2017-05-20 19:00:00', 26, 10, ''),
(30, 'Wacken Open Air 2019', '2019-07-31 17:00:00', 27, 10, ''),
(31, 'Metallica', '2019-08-25 17:00:00', 28, 10, ''),
(32, 'Amon Amarth', '2019-11-25 19:00:00', 29, 10, ''),
(33, 'Eluveitie', '2019-11-15 18:00:00', 30, 10, ''),
(34, 'Wacken Open Air 2022', '2022-08-03 19:00:00', 27, 10, ''),
(35, 'Amon Amarth', '2022-10-14 19:00:00', 31, 8, ''),
(36, 'Beyond The Black', '2022-10-30 19:00:00', 29, 8, ''),
(37, 'Bleed From Within', '2022-12-12 19:00:00', 32, 10, ''),
(38, 'Eisheilige Nacht 2022', '2022-12-28 19:00:00', 19, 8, ''),
(39, 'Heaven Shall Burn', '2022-02-17 19:00:00', 29, 10, ''),
(40, 'Sabaton', '2023-05-02 17:00:00', 33, 10, ''),
(41, 'The Offspring', '2023-05-14 19:00:00', 29, 10, ''),
(42, 'Rammstein', '2023-06-11 19:00:00', 34, 8, ''),
(43, 'Tollwood', '2023-07-01 19:00:00', 35, 10, ''),
(44, 'Ad Infinitum', '2023-09-27 19:00:00', 36, 9, ''),
(45, 'Mr. Hurley und die Pulveraffen', '2023-11-11 19:00:00', 37, 10, ''),
(46, 'Rock that Swing', '2024-02-10 19:00:00', 38, 0, ''),
(47, 'Battle Beast', '2024-02-15 19:00:00', 39, 8, ''),
(48, 'Warkings', '2024-04-19 19:00:00', 37, 0, ''),
(49, 'Feuerschwanz', '2024-04-21 19:00:00', 37, 10, ''),
(50, 'Metallica', '2024-04-21 19:00:00', 34, 10, ''),
(51, 'Metallica', '2024-04-26 19:00:00', 34, 10, ''),
(52, 'AC/DC', '2024-06-12 19:00:00', 34, 10, ''),
(53, 'Wacken Open Air 2024', '2024-07-31 17:00:00', 27, 10, ''),
(54, 'Punk Rock Holiday 2024', '2024-08-05 17:00:00', 40, 10, ''),
(55, 'Amon Amarth', '2024-08-20 19:00:00', 41, 10, ''),
(56, 'Heilung', '2024-09-13 19:00:00', 29, 10, ''),
(57, 'Within Temptation', '2024-10-19 19:00:00', 29, 10, ''),
(58, 'Arch Enemy', '2024-10-20 19:00:00', 29, 0, ''),
(59, 'Mr. Hurley & Die Pulveraffen', '2024-11-10 19:00:00', 37, 0, ''),
(60, 'Sólstafir', '2024-12-06 19:00:00', 42, 10, ''),
(61, 'Rise Against', '2025-02-17 19:00:00', 29, 10, ''),
(62, 'Unleash the Archers', '2025-02-21 19:00:00', 37, 0, ''),
(63, 'Bloodywood', '2025-03-12 19:00:00', 37, 0, ''),
(64, 'In Flames & Heaven Shall Burn', '2025-06-11 19:00:00', 43, 10, ''),
(65, 'Tollwood 2025', '2025-07-01 17:00:00', 35, 0, ''),
(66, 'Wacken Open Air 2025', '2025-07-30 19:00:00', 27, 10, ''),
(67, 'Parkway Drive 20 Year Anniversary', '2025-09-20 19:00:00', 31, 10, ''),
(68, 'Bleed From Within', '2025-09-27 19:00:00', 37, 10, ''),
(69, 'Wind Rose', '2025-10-03 19:00:00', 30, 0, ''),
(70, 'Orbit Culture', '2025-10-29 19:00:00', 37, 8, ''),
(71, 'The Offspring', '2025-10-30 18:00:00', 31, 7, ''),
(72, 'The Plot in You', '2025-11-12 19:00:00', 29, 8, ''),
(73, 'Sabaton', '2025-11-20 19:00:00', 31, 10, ''),
(74, 'Annisokay', '2025-12-01 19:00:00', 37, 10, ''),
(75, 'Brantweihnachten 2025', '2025-12-20 19:00:00', 44, 8, '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ConcertParticipants`
--

CREATE TABLE `ConcertParticipants` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL COMMENT 'The full name of the participant',
  `notes` text DEFAULT NULL COMMENT 'A text field for additional information about the participant (optional)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ConcertVenues`
--

CREATE TABLE `ConcertVenues` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL COMMENT 'The name of the venue (e.g., "Madison Square Garden")',
  `address` text DEFAULT NULL COMMENT 'The complete address of the venue',
  `city` text DEFAULT NULL COMMENT 'The city where the venue is located',
  `state` text DEFAULT NULL COMMENT 'The state or region of the venue',
  `country` text DEFAULT NULL COMMENT 'The country where the venue is located',
  `postal_code` int(11) DEFAULT NULL COMMENT 'The postal or ZIP code',
  `type` text DEFAULT NULL COMMENT 'The type of venue (e.g., "arena," "stadium," "theater")',
  `indoor_outdoor` text DEFAULT NULL COMMENT 'Indicates if the venue is indoor, outdoor, or mixed',
  `capacity` int(11) DEFAULT NULL COMMENT 'The seating or standing capacity of the venue',
  `website` text DEFAULT NULL COMMENT 'A URL for the venue''s official website',
  `notes` text DEFAULT NULL COMMENT 'Additional notes about the venue (optional)',
  `latitude` text DEFAULT NULL COMMENT 'Latitude coordinates for mapping purposes',
  `longitude` text DEFAULT NULL COMMENT 'Longitude coordinates for mapping purposes',
  `rating` int(11) DEFAULT NULL COMMENT 'Rating of the venue from 0 to 10'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Daten für Tabelle `ConcertVenues`
--

INSERT INTO `ConcertVenues` (`id`, `name`, `address`, `city`, `state`, `country`, `postal_code`, `type`, `indoor_outdoor`, `capacity`, `website`, `notes`, `latitude`, `longitude`, `rating`) VALUES
(17, 'Veltins Arena', NULL, NULL, NULL, NULL, 0, 'Stadium', 'mixed', 50000, NULL, NULL, NULL, NULL, 0),
(18, 'Turbinenhalle', NULL, NULL, NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 10),
(19, 'Ringlokschuppen', NULL, NULL, NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 7),
(20, 'Forum Bielefeld', NULL, NULL, NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 10),
(21, 'Kloster Möllenbeck', NULL, NULL, NULL, NULL, 0, 'Church or Cathedral', 'outdoor', 2500, NULL, NULL, NULL, NULL, 10),
(22, 'Sparrenburg', NULL, 'Bielefeld', NULL, NULL, 0, 'Castle or Fortress', 'outdoor', 0, NULL, NULL, NULL, NULL, 0),
(23, 'Mitsubishi Halle', NULL, 'Düsseldorf', NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(24, 'Capitol', NULL, 'Offenbach', NULL, NULL, 0, 'Concert Hall', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(25, 'JZ Stricker', NULL, 'Bielefeld', NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(26, 'Hallenbrink', NULL, NULL, NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(27, 'Wacken', NULL, NULL, NULL, NULL, 0, 'Festival Grounds', 'outdoor', 82000, NULL, NULL, NULL, NULL, 10),
(28, 'Maimarktgelände', NULL, NULL, NULL, NULL, 0, 'Stadium', 'outdoor', 0, NULL, NULL, NULL, NULL, 7),
(29, 'Zenith', NULL, 'München', NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 9),
(30, 'Tonhalle', NULL, 'München', NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(31, 'Olympia Halle', NULL, 'München', NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 10),
(32, 'Feierwerk', NULL, 'München', NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(33, 'ZAG-Arena', NULL, 'Hannover', NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(34, 'Olympia Stadion', NULL, 'München', NULL, NULL, 0, 'Stadium', 'outdoor', 70000, NULL, NULL, NULL, NULL, 6),
(35, 'Tollwood', NULL, 'München', NULL, NULL, 0, 'Fairgrounds', 'indoor', 0, NULL, NULL, NULL, NULL, 10),
(36, 'Backstage-Halle', NULL, 'München', NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 6),
(37, 'Backstage-Werk', NULL, 'München', NULL, NULL, 0, 'Club', 'indoor', 1500, 'https://backstage.eu', NULL, NULL, NULL, 10),
(38, 'Deutsches Theater', NULL, 'München', NULL, NULL, 0, 'Concert Hall', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(39, 'Muffat Halle', NULL, 'München', NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 10),
(40, 'Punk Rock Holiday', NULL, NULL, NULL, 'Slovenien', 0, 'Festival Grounds', 'outdoor', 0, NULL, NULL, NULL, NULL, 10),
(41, 'Messe Innsbruck', NULL, 'Innsbruck', NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 0),
(42, 'Technikum', NULL, 'München', NULL, NULL, 0, 'Club', 'indoor', 0, NULL, NULL, NULL, NULL, 10),
(43, 'Kufstein', NULL, 'Kufstein', NULL, NULL, 0, 'Amphitheater', 'mixed', 0, NULL, NULL, NULL, NULL, 10),
(44, 'Grugahalle', NULL, 'Essen', NULL, NULL, 0, 'Arena', 'indoor', 0, NULL, NULL, NULL, NULL, 8);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `EventBands`
--

CREATE TABLE `EventBands` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `band_id` int(11) NOT NULL,
  `setlist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'A text field for storing the setlist of songs performed (optional)',
  `rating` int(11) DEFAULT NULL COMMENT 'A rating for the band''s performance (e.g., a scale from 1 to 10)',
  `mainAct` tinyint(1) NOT NULL DEFAULT 0,
  `runningOrder` int(11) NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Daten für Tabelle `EventBands`
--

INSERT INTO `EventBands` (`id`, `event_id`, `band_id`, `setlist`, `rating`, `mainAct`, `runningOrder`, `notes`) VALUES
(38, 18, 28, NULL, NULL, 0, 1, NULL),
(39, 18, 24, NULL, NULL, 1, 2, NULL),
(42, 16, 23, NULL, 4, 0, 1, NULL),
(43, 16, 24, NULL, 9, 1, 2, NULL),
(44, 17, 25, NULL, 6, 0, 1, NULL),
(45, 17, 26, NULL, 10, 0, 2, NULL),
(46, 17, 27, NULL, 10, 1, 3, NULL),
(47, 19, 29, NULL, NULL, 0, 1, NULL),
(48, 19, 30, NULL, NULL, 0, 2, NULL),
(49, 19, 31, NULL, NULL, 0, 3, NULL),
(50, 19, 32, NULL, NULL, 0, 4, NULL),
(51, 19, 33, NULL, NULL, 0, 5, NULL),
(52, 19, 34, NULL, 9, 0, 6, NULL),
(53, 19, 35, NULL, 8, 0, 7, NULL),
(54, 19, 36, NULL, NULL, 0, 8, NULL),
(55, 19, 37, NULL, 10, 1, 9, NULL),
(56, 20, 38, NULL, NULL, 0, 1, NULL),
(57, 20, 39, NULL, NULL, 0, 2, NULL),
(58, 20, 40, NULL, NULL, 0, 3, NULL),
(59, 20, 41, NULL, NULL, 0, 4, NULL),
(60, 20, 42, NULL, NULL, 0, 5, NULL),
(61, 20, 43, NULL, NULL, 0, 6, NULL),
(62, 20, 44, NULL, NULL, 0, 7, NULL),
(63, 20, 32, NULL, NULL, 0, 8, NULL),
(64, 20, 37, NULL, 10, 1, 9, NULL),
(65, 21, 45, NULL, 10, 1, 1, NULL),
(66, 21, 46, NULL, 10, 1, 2, NULL),
(81, 29, 58, NULL, NULL, 0, 1, NULL),
(82, 29, 59, NULL, NULL, 0, 2, NULL),
(83, 29, 60, NULL, 10, 0, 3, NULL),
(84, 29, 57, NULL, 10, 0, 4, NULL),
(85, 29, 61, NULL, NULL, 0, 5, NULL),
(86, 29, 34, NULL, 10, 0, 6, NULL),
(87, 29, 37, NULL, 10, 1, 7, NULL),
(88, 28, 57, NULL, 10, 0, 1, NULL),
(89, 28, 34, NULL, 10, 0, 2, NULL),
(90, 28, 37, NULL, 10, 1, 3, NULL),
(91, 27, 22, NULL, 10, 1, 1, NULL),
(92, 26, 54, NULL, NULL, 0, 1, NULL),
(93, 26, 55, NULL, 10, 0, 2, NULL),
(94, 26, 56, NULL, 8, 1, 3, NULL),
(95, 25, 53, NULL, NULL, 1, 1, NULL),
(96, 24, 51, NULL, NULL, 1, 1, NULL),
(97, 24, 52, NULL, NULL, 1, 2, NULL),
(98, 23, 49, NULL, NULL, 1, 1, NULL),
(99, 23, 50, NULL, NULL, 1, 2, NULL),
(100, 14, 15, NULL, NULL, 1, 1, NULL),
(101, 14, 16, NULL, NULL, 1, 2, NULL),
(102, 14, 17, NULL, NULL, 1, 3, NULL),
(103, 14, 18, NULL, 10, 1, 4, NULL),
(104, 22, 47, NULL, NULL, 1, 1, NULL),
(105, 22, 48, NULL, NULL, 1, 2, NULL),
(126, 30, 62, NULL, NULL, 0, 1, NULL),
(127, 30, 63, NULL, NULL, 0, 2, NULL),
(128, 30, 64, NULL, 10, 0, 3, NULL),
(129, 30, 65, NULL, 10, 0, 4, NULL),
(130, 30, 66, NULL, NULL, 0, 5, NULL),
(131, 30, 67, NULL, 8, 0, 6, NULL),
(132, 30, 68, NULL, NULL, 0, 7, NULL),
(133, 30, 27, NULL, 10, 0, 8, NULL),
(134, 30, 69, NULL, 10, 0, 9, NULL),
(135, 30, 70, NULL, 10, 0, 10, NULL),
(136, 30, 71, NULL, NULL, 0, 11, NULL),
(137, 30, 17, NULL, 8, 0, 12, NULL),
(138, 30, 72, NULL, 10, 0, 13, NULL),
(139, 30, 26, NULL, 10, 0, 14, NULL),
(140, 30, 73, NULL, 10, 0, 15, NULL),
(141, 30, 74, NULL, 7, 0, 16, NULL),
(142, 30, 75, NULL, NULL, 0, 17, NULL),
(143, 30, 76, NULL, NULL, 0, 18, NULL),
(144, 30, 24, NULL, 10, 0, 19, NULL),
(145, 30, 77, NULL, 8, 0, 20, NULL),
(149, 31, 78, NULL, NULL, 0, 1, NULL),
(150, 31, 21, NULL, 8, 0, 2, NULL),
(151, 31, 18, NULL, 10, 1, 3, NULL),
(152, 32, 79, NULL, NULL, 0, 1, NULL),
(153, 32, 80, NULL, 10, 0, 2, NULL),
(154, 32, 81, NULL, 10, 1, 3, NULL),
(158, 33, 82, NULL, 10, 0, 1, NULL),
(159, 33, 83, NULL, 10, 0, 2, NULL),
(160, 33, 69, NULL, 10, 1, 3, NULL),
(161, 34, 84, NULL, 10, 1, 1, NULL),
(162, 34, 85, NULL, 10, 1, 2, NULL),
(163, 34, 86, NULL, 10, 1, 3, NULL),
(164, 34, 87, NULL, 10, 0, 4, NULL),
(165, 34, 88, NULL, NULL, 0, 5, NULL),
(166, 34, 89, NULL, NULL, 0, 6, NULL),
(167, 34, 90, NULL, 5, 1, 7, NULL),
(168, 34, 91, NULL, NULL, 0, 8, NULL),
(169, 34, 83, NULL, 10, 1, 9, NULL),
(170, 34, 79, NULL, NULL, 0, 10, NULL),
(171, 34, 92, NULL, NULL, 1, 11, NULL),
(172, 34, 93, NULL, 10, 1, 12, NULL),
(173, 34, 94, NULL, 10, 1, 13, NULL),
(174, 34, 95, NULL, 9, 0, 14, NULL),
(175, 34, 96, NULL, 10, 0, 15, NULL),
(176, 34, 97, NULL, 10, 1, 16, NULL),
(177, 34, 98, NULL, 7, 0, 17, NULL),
(178, 34, 99, NULL, 10, 1, 18, NULL),
(179, 34, 100, NULL, NULL, 0, 19, NULL),
(180, 34, 80, NULL, 10, 1, 20, NULL),
(181, 34, 74, NULL, NULL, 1, 21, NULL),
(182, 34, 101, NULL, 4, 0, 22, NULL),
(183, 35, 102, NULL, NULL, 0, 1, NULL),
(184, 35, 103, NULL, NULL, 0, 2, NULL),
(185, 35, 81, NULL, 10, 1, 3, NULL),
(186, 36, 104, NULL, NULL, 0, 1, NULL),
(187, 36, 105, NULL, 8, 0, 2, NULL),
(188, 36, 65, NULL, 8, 1, 3, NULL),
(189, 37, 106, NULL, NULL, 0, 1, NULL),
(190, 37, 107, NULL, NULL, 0, 2, NULL),
(191, 37, 97, NULL, 10, 1, 3, NULL),
(192, 38, 108, NULL, 9, 0, 1, NULL),
(193, 38, 53, NULL, NULL, 0, 2, NULL),
(194, 38, 109, NULL, 10, 0, 3, NULL),
(195, 38, 110, NULL, 8, 1, 4, NULL),
(196, 39, 111, NULL, NULL, 0, 1, NULL),
(197, 39, 112, NULL, NULL, 0, 2, NULL),
(198, 39, 113, NULL, 10, 0, 3, NULL),
(199, 39, 114, NULL, 10, 0, 4, NULL),
(205, 15, 19, NULL, NULL, 0, 1, NULL),
(206, 15, 20, NULL, NULL, 0, 2, NULL),
(207, 15, 21, NULL, NULL, 0, 3, NULL),
(208, 15, 113, NULL, 10, 0, 4, NULL),
(209, 15, 22, NULL, 10, 1, 5, NULL),
(212, 41, 116, NULL, NULL, 0, 1, NULL),
(213, 41, 117, NULL, NULL, 0, 2, NULL),
(214, 41, 118, NULL, 10, 1, 3, NULL),
(215, 40, 115, NULL, 8, 0, 1, NULL),
(216, 40, 27, NULL, 10, 1, 2, NULL),
(217, 42, 119, NULL, 10, 1, 1, NULL),
(218, 43, 120, NULL, NULL, 0, 1, NULL),
(219, 43, 121, NULL, 10, 0, 2, NULL),
(220, 43, 122, NULL, 10, 0, 3, NULL),
(221, 43, 96, NULL, 10, 1, 4, NULL),
(222, 44, 123, NULL, NULL, 0, 1, NULL),
(223, 44, 124, NULL, 8, 0, 2, NULL),
(224, 44, 125, NULL, 10, 1, 3, NULL),
(225, 45, 126, NULL, 10, 0, 1, NULL),
(226, 45, 109, NULL, 10, 1, 2, NULL),
(227, 46, 127, NULL, 10, 1, 1, NULL),
(228, 47, 128, NULL, NULL, 0, 1, NULL),
(229, 47, 129, NULL, NULL, 0, 2, NULL),
(230, 47, 26, NULL, 10, 1, 3, NULL),
(231, 48, 130, NULL, NULL, 0, 1, NULL),
(232, 48, 131, NULL, NULL, 0, 2, NULL),
(233, 48, 121, NULL, 10, 1, 3, NULL),
(234, 49, 132, NULL, 10, 0, 1, NULL),
(235, 49, 133, NULL, 9, 0, 2, NULL),
(236, 49, 96, NULL, 10, 1, 3, NULL),
(237, 50, 134, NULL, NULL, 0, 1, NULL),
(238, 50, 135, NULL, 10, 0, 2, NULL),
(239, 50, 18, NULL, 10, 1, 3, NULL),
(240, 51, 136, NULL, 10, 0, 1, NULL),
(241, 51, 137, NULL, 4, 0, 2, NULL),
(242, 51, 18, NULL, 10, 1, 3, NULL),
(243, 52, 138, NULL, 10, 1, 1, NULL),
(256, 53, 139, NULL, NULL, 0, 1, NULL),
(257, 53, 140, NULL, NULL, 0, 2, NULL),
(258, 53, 141, NULL, 10, 1, 3, NULL),
(259, 53, 93, NULL, 10, 1, 4, NULL),
(260, 53, 126, NULL, 10, 0, 5, NULL),
(261, 53, 124, NULL, 8, 0, 6, NULL),
(262, 53, 144, NULL, NULL, 0, 7, NULL),
(263, 53, 145, NULL, 10, 1, 8, NULL),
(264, 53, 96, NULL, 9, 0, 9, NULL),
(265, 53, 81, NULL, 10, 1, 10, NULL),
(266, 53, 135, NULL, 10, 1, 11, NULL),
(267, 53, 92, NULL, NULL, 1, 12, NULL),
(268, 53, 100, NULL, NULL, 1, 13, NULL),
(269, 53, 142, NULL, 8, 0, 14, NULL),
(270, 53, 143, NULL, NULL, 0, 15, NULL),
(280, 54, 146, NULL, 10, 1, 1, NULL),
(281, 54, 147, NULL, NULL, 0, 2, NULL),
(282, 54, 148, NULL, 10, 0, 3, NULL),
(283, 54, 149, NULL, NULL, 0, 4, NULL),
(284, 54, 150, NULL, NULL, 1, 5, NULL),
(285, 54, 151, NULL, NULL, 0, 6, NULL),
(286, 54, 152, NULL, NULL, 0, 7, NULL),
(287, 54, 153, NULL, NULL, 0, 8, NULL),
(288, 54, 154, NULL, 9, 1, 9, NULL),
(289, 54, 155, NULL, NULL, 0, 10, NULL),
(290, 54, 156, NULL, NULL, 0, 11, NULL),
(291, 54, 157, NULL, NULL, 0, 12, NULL),
(292, 55, 158, NULL, 10, 0, 1, NULL),
(293, 55, 159, NULL, NULL, 0, 2, NULL),
(294, 55, 81, NULL, 10, 1, 3, NULL),
(295, 56, 160, NULL, NULL, 0, 1, NULL),
(296, 56, 161, NULL, 10, 1, 2, NULL),
(297, 57, 162, NULL, NULL, 0, 1, NULL),
(298, 57, 163, NULL, 10, 0, 2, NULL),
(299, 57, 70, NULL, 10, 1, 3, NULL),
(300, 58, 164, NULL, NULL, 0, 1, NULL),
(301, 58, 80, NULL, 6, 0, 2, NULL),
(302, 58, 22, NULL, 10, 1, 3, NULL),
(303, 59, 165, NULL, 10, 0, 1, NULL),
(304, 59, 109, NULL, 10, 1, 2, NULL),
(305, 59, 166, NULL, NULL, 0, 3, NULL),
(306, 60, 167, NULL, NULL, 0, 1, NULL),
(307, 60, 168, NULL, NULL, 0, 2, NULL),
(308, 60, 169, NULL, 10, 1, 3, NULL),
(309, 61, 170, NULL, NULL, 0, 1, NULL),
(310, 61, 171, NULL, 10, 0, 2, NULL),
(311, 61, 146, NULL, 10, 1, 3, NULL),
(312, 62, 172, NULL, NULL, 0, 1, NULL),
(313, 62, 173, NULL, NULL, 0, 2, NULL),
(314, 62, 174, NULL, NULL, 1, 3, NULL),
(315, 63, 175, NULL, NULL, 0, 1, NULL),
(316, 63, 176, NULL, 8, 0, 2, NULL),
(317, 63, 177, NULL, 10, 1, 3, NULL),
(318, 64, 22, NULL, 10, 1, 1, NULL),
(319, 64, 114, NULL, 10, 1, 2, NULL),
(322, 65, 178, NULL, 10, 0, 1, NULL),
(323, 65, 161, NULL, 10, 1, 2, NULL),
(324, 66, 179, NULL, NULL, 0, 1, NULL),
(325, 66, 180, NULL, 10, 1, 2, NULL),
(326, 66, 181, NULL, NULL, 0, 3, NULL),
(327, 66, 182, NULL, NULL, 0, 4, NULL),
(328, 66, 183, NULL, 3, 1, 5, NULL),
(329, 66, 184, NULL, NULL, 0, 6, NULL),
(330, 66, 185, NULL, NULL, 0, 7, NULL),
(331, 66, 186, NULL, NULL, 0, 8, NULL),
(332, 66, 187, NULL, NULL, 1, 9, NULL),
(333, 66, 188, NULL, NULL, 0, 10, NULL),
(334, 66, 189, NULL, 10, 1, 11, NULL),
(335, 66, 163, NULL, 10, 1, 12, NULL),
(336, 66, 37, NULL, 8, 0, 13, NULL),
(337, 66, 190, NULL, 9, 0, 14, NULL),
(338, 66, 191, NULL, NULL, 0, 15, NULL),
(339, 66, 192, NULL, 9, 0, 16, NULL),
(340, 67, 193, NULL, 8, 0, 1, NULL),
(341, 67, 194, NULL, NULL, 0, 2, NULL),
(342, 67, 73, NULL, 10, 1, 3, NULL),
(343, 68, 195, NULL, NULL, 0, 1, NULL),
(344, 68, 196, NULL, NULL, 0, 2, NULL),
(345, 68, 97, NULL, 10, 1, 3, NULL),
(346, 69, 197, NULL, 8, 0, 1, NULL),
(347, 69, 133, NULL, 8, 0, 2, NULL),
(348, 69, 198, NULL, 8, 1, 3, NULL),
(349, 70, 199, NULL, NULL, 0, 1, NULL),
(350, 70, 200, NULL, NULL, 0, 2, NULL),
(351, 70, 201, NULL, 10, 1, 3, NULL),
(354, 71, 202, NULL, 8, 0, 1, NULL),
(355, 71, 118, NULL, 8, 1, 2, NULL),
(356, 72, 203, NULL, NULL, 0, 1, NULL),
(357, 72, 204, NULL, 10, 0, 2, NULL),
(358, 72, 205, NULL, 8, 1, 3, NULL),
(359, 73, 27, NULL, 10, 1, 1, NULL),
(360, 74, 206, NULL, 8, 0, 1, NULL),
(361, 74, 207, NULL, 7, 0, 2, NULL),
(362, 74, 163, NULL, 10, 1, 3, NULL),
(363, 75, 165, NULL, 10, 0, 1, NULL),
(364, 75, 208, NULL, 3, 0, 2, NULL),
(365, 75, 87, NULL, 10, 1, 3, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `EventParticipants`
--

CREATE TABLE `EventParticipants` (
  `id` int(11) NOT NULL,
  `participant_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `ConcertBands`
--
ALTER TABLE `ConcertBands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indizes für die Tabelle `ConcertEvents`
--
ALTER TABLE `ConcertEvents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indizes für die Tabelle `ConcertParticipants`
--
ALTER TABLE `ConcertParticipants`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `ConcertVenues`
--
ALTER TABLE `ConcertVenues`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `id_2` (`id`);

--
-- Indizes für die Tabelle `EventBands`
--
ALTER TABLE `EventBands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indizes für die Tabelle `EventParticipants`
--
ALTER TABLE `EventParticipants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `ConcertBands`
--
ALTER TABLE `ConcertBands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT für Tabelle `ConcertEvents`
--
ALTER TABLE `ConcertEvents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT für Tabelle `ConcertParticipants`
--
ALTER TABLE `ConcertParticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ConcertVenues`
--
ALTER TABLE `ConcertVenues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT für Tabelle `EventBands`
--
ALTER TABLE `EventBands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=366;

--
-- AUTO_INCREMENT für Tabelle `EventParticipants`
--
ALTER TABLE `EventParticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
