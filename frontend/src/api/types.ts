export type ConcertId = number;

export interface StatsDto {
  concertsAttended: number;
  bandsSeen: number;
  actsSeen: number;
  venuesSeen: number;
  // Optional: add more later (venuesVisited, citiesVisited, etc.)
}

export interface ConcertListItemDto {
  id: ConcertId;
  date: string; // ISO (YYYY-MM-DD or full ISO string)
  name: string;
  rating: number; // e.g. 1..10
  venueId?: number;
  venueName?: string;
  bandCount?: number;
}

export interface ConcertEventDto {
  id: ConcertId;
  name: string;
  datetime: string; // SQL DATETIME (YYYY-MM-DD HH:MM:SS)
  venue_id: number;
  rating?: number | null;
  notes?: string | null;
  band_count?: number | null;
}

export interface ConcertVenueDto {
  id: number;
  name: string;
  rating?: number | null;
}

export interface ConcertVenueDetailsDto {
  id: number;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: number | null;
  type?: string | null;
  indoor_outdoor?: "indoor" | "outdoor" | "mixed" | null;
  capacity?: number | null;
  website?: string | null;
  notes?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  rating?: number | null;
}

export interface EventBandsDto {
  count: number;
}

export interface EventBandDetailDto {
  event_band_id: number;
  band_id: number;
  band_name: string;
  mainAct?: boolean | null;
  runningOrder?: number | null;
  rating?: number | null;
  notes?: string | null;
}

export interface BandSummaryDto {
  band_id: number;
  band_name: string;
  last_seen_date: string; // ISO date
  seen_count: number;
  rating?: number | null;
  last_venue_name?: string | null;
}

export interface EventBandSummaryDto {
  event_band_id: number;
  event_id: number;
  date: string; // ISO date
  band_name: string;
  event_name?: string | null;
  venue_name?: string | null;
  rating?: number | null;
}

export interface VenueSummaryDto {
  venue_id: number;
  venue_name: string;
  last_visited_date?: string | null;
  visit_count: number;
  rating?: number | null;
}
export interface ConcertBandDto {
  id: number;
  name: string;
}

export interface ConcertBandDetailsDto {
  id: number;
  name: string;
  genre?: string | null;
  origin_country?: string | null;
  rating?: number | null;
  notes?: string | null;
  link?: string | null;
  website?: string | null;
}

export interface CreateConcertEventDto {
  name: string;
  datetime: string;
  venue_id: number;
  rating?: number | null;
  notes?: string | null;
}

export interface CreateConcertVenueDto {
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: number | null;
  type?: string | null;
  indoor_outdoor?: "indoor" | "outdoor" | "mixed" | null;
  capacity?: number | null;
  website?: string | null;
  notes?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  rating?: number | null;
}

export interface CreateConcertBandDto {
  name: string;
  genre?: string | null;
  origin_country?: string | null;
  rating?: number | null;
  notes?: string | null;
  link?: string | null;
  website?: string | null;
}

export interface CreateEventBandDto {
  event_id: number;
  band_id: number;
  main_act?: boolean;
  running_order?: number;
}

export interface CreateEventBandEntryDto {
  bandId?: number;
  band?: CreateConcertBandDto;
  mainAct?: boolean;
  runningOrder?: number;
  rating?: number | null;
  notes?: string | null;
  setlist?: Record<string, unknown>;
}

export interface CreateConcertEventBundleDto {
  event: Omit<CreateConcertEventDto, "venue_id">;
  venueId?: number;
  venue?: CreateConcertVenueDto;
  bands: CreateEventBandEntryDto[];
}

export interface CreateConcertEventBundleResponseDto {
  message: string;
  eventId: number;
  venueId: number;
  bandIds: number[];
  eventBandIds: number[];
}

export interface ConcertDetailsDto {
  id: ConcertId;
  date: string;
  name: string;
  rating: number;
  venueId?: number;
  venueName?: string;

  bands: Array<{
    id: number;
    name: string;
    mainAct?: boolean | null;
    runningOrder?: number | null;
    rating?: number | null;
  }>;

  participatedWith: Array<{
    id: number;
    displayName: string;
  }>;
}
