import { http } from "./http";
import type {
  ConcertDetailsDto,
  ConcertEventDto,
  ConcertListItemDto,
  ConcertBandDto,
  ConcertBandDetailsDto,
  ConcertVenueDto,
  ConcertVenueDetailsDto,
  BandSummaryDto,
  EventBandSummaryDto,
  CreateConcertBandDto,
  CreateConcertEventDto,
  CreateConcertVenueDto,
  CreateConcertEventBundleDto,
  CreateConcertEventBundleResponseDto,
  CreateEventBandDto,
  EventBandDetailDto,
  StatsDto,
  EventBandsDto,
} from "./types";

/**
 * Backend status:
 * Your OpenAPI currently only has /concertVenues endpoints. :contentReference[oaicite:2]{index=2}
 * This frontend expects endpoints for stats + concerts.
 * Until those exist, we run in mock mode.
 */
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true").toLowerCase() === "true";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const mockStats: StatsDto = {
  concertsAttended: 42,
  bandsSeen: 128,
  actsSeen: 32,
  venuesSeen: 4
};
const mockBandSummaries: BandSummaryDto[] = [
  {
    band_id: 1,
    band_name: "Heaven Shall Burn",
    last_seen_date: "2025-12-19",
    seen_count: 3,
    rating: 9,
    last_venue_name: "Some Arena",
  },
  {
    band_id: 2,
    band_name: "Powerwolf",
    last_seen_date: "2025-10-12",
    seen_count: 2,
    rating: 7,
    last_venue_name: "Steel Hall",
  },
];

const mockEventBandSummaries: EventBandSummaryDto[] = [
  {
    event_band_id: 1,
    event_id: 1001,
    date: "2025-12-19",
    band_name: "Heaven Shall Burn",
    event_name: "Heaven Shall Burn + Support",
    venue_name: "Some Arena",
    rating: 9,
  },
  {
    event_band_id: 2,
    event_id: 1002,
    date: "2025-10-12",
    band_name: "Powerwolf",
    event_name: "Powerwolf",
    venue_name: "Steel Hall",
    rating: 7,
  },
];

const mockVenues: ConcertVenueDto[] = [
  { id: 1, name: "Some Arena", rating: 8 },
  { id: 2, name: "Steel Hall", rating: 7 },
];

const mockVenueDetailsById: Record<number, ConcertVenueDetailsDto> = {
  1: {
    id: 1,
    name: "Some Arena",
    address: "123 Main St",
    city: "Cologne",
    state: "",
    country: "Germany",
    postal_code: 50667,
    type: "Arena",
    indoor_outdoor: "indoor",
    capacity: 18000,
    website: "https://example.com",
    notes: "Great sound.",
    latitude: "50.9375",
    longitude: "6.9603",
    rating: 8,
  },
  2: {
    id: 2,
    name: "Steel Hall",
    address: "45 Steel Rd",
    city: "Essen",
    state: "",
    country: "Germany",
    postal_code: 45127,
    type: "Club",
    indoor_outdoor: "indoor",
    capacity: 2500,
    website: "",
    notes: "",
    latitude: "",
    longitude: "",
    rating: 7,
  },
};

const mockBandDetailsById: Record<number, ConcertBandDetailsDto> = {
  1: {
    id: 1,
    name: "Heaven Shall Burn",
    genre: "Metalcore",
    origin_country: "Germany",
    rating: 9,
    notes: "High energy live sets.",
    link: "",
    website: "https://www.heavenshallburn.com",
  },
  2: {
    id: 2,
    name: "Powerwolf",
    genre: "Power Metal",
    origin_country: "Germany",
    rating: 7,
    notes: "",
    link: "",
    website: "https://www.powerwolf.net",
  },
};
const mockConcerts: ConcertListItemDto[] = [
  {
    id: 1001,
    date: "2025-12-19",
    name: "Heaven Shall Burn + Support",
    rating: 9,
    venueName: "Some Arena",
    bandCount: 3,
  },
  { id: 1002, date: "2025-11-02", name: "The National", rating: 8, bandCount: 1 },
  { id: 1003, date: "2025-10-12", name: "Powerwolf", rating: 7, bandCount: 2 },
  { id: 1004, date: "2025-09-01", name: "Architects", rating: 9, bandCount: 2 },
  { id: 1005, date: "2025-08-17", name: "Bring Me The Horizon", rating: 8, bandCount: 3 },
  { id: 1006, date: "2025-07-04", name: "Rammstein", rating: 10, bandCount: 2 },
  { id: 1007, date: "2025-06-22", name: "Ghost", rating: 8, bandCount: 2 },
  { id: 1008, date: "2025-05-11", name: "Kreator", rating: 7, bandCount: 3 },
  { id: 1009, date: "2025-04-03", name: "Muse", rating: 8, bandCount: 1 },
  { id: 1010, date: "2025-03-14", name: "Metallica", rating: 10, bandCount: 1 },
];
const mockDetails: Record<number, ConcertDetailsDto> = {
  1001: {
    id: 1001,
    date: "2025-12-19",
    name: "Heaven Shall Burn + Support",
    rating: 9,
    venueId: 1,
    venueName: "Some Arena",
    bands: [
      { id: 1, name: "Heaven Shall Burn", mainAct: true, runningOrder: 3, rating: 9 },
      { id: 2, name: "Support Band A", mainAct: false, runningOrder: 2, rating: 7 },
      { id: 3, name: "Support Band B", mainAct: false, runningOrder: 1, rating: 6 },
    ],
    participatedWith: [
      { id: 10, displayName: "Pascal" },
      { id: 11, displayName: "Alex" },
    ],
  },
};

const mockEventBandsByEventId: Record<number, EventBandDetailDto[]> = {
  1001: [
    {
      event_band_id: 1,
      band_id: 1,
      band_name: "Heaven Shall Burn",
      mainAct: true,
      runningOrder: 3,
    },
    {
      event_band_id: 2,
      band_id: 2,
      band_name: "Support Band A",
      mainAct: false,
      runningOrder: 2,
    },
    {
      event_band_id: 3,
      band_id: 3,
      band_name: "Support Band B",
      mainAct: false,
      runningOrder: 1,
    },
  ],
};

export async function getStats(): Promise<StatsDto> {
  if (USE_MOCK) {
    await sleep(150);
    return mockStats;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /statsOverview
   * Response: StatsDto
   */
  const res = await http.get<StatsDto>("/statsOverview");
  console.log(res.status);
  return res.data;
}

export async function getLastConcerts(limit = 10): Promise<ConcertListItemDto[]> {
  if (USE_MOCK) {
    await sleep(200);
    return mockConcerts.slice(0, limit);
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /concertOverview?limit=10
   * Response: ConcertEventDto[]
   */
  const res = await http.get<ConcertEventDto[]>("/concertOverview", {
    params: { limit },
  });

  return mapConcertOverviewData(res.data);
}

export async function getAllConcerts(): Promise<ConcertListItemDto[]> {
  if (USE_MOCK) {
    await sleep(200);
    return mockConcerts;
  }

  const res = await http.get<ConcertEventDto[]>("/concertEvents");
  const sorted = [...res.data].sort((a, b) => b.datetime.localeCompare(a.datetime));
  return mapConcertOverviewData(sorted);
}

async function mapConcertOverviewData(
  events: ConcertEventDto[]
): Promise<ConcertListItemDto[]> {
  const venueIds = Array.from(
    new Set(events.map((event) => event.venue_id).filter(Boolean))
  );

  const eventIds = Array.from(
    new Set(events.map((event) => event.id).filter(Boolean))
  );

  const venueNameById = new Map<number, string>();
  const bandCountById = new Map<number, number>();

  await Promise.all([
    ...venueIds.map(async (venueId) => {
      try {
        const venueRes = await http.get<ConcertVenueDto>(`/concertVenues/${venueId}`);
        venueNameById.set(venueId, venueRes.data.name);
      } catch {
        // Ignore missing venue names; UI will show a fallback.
      }
    }),
    ...eventIds.map(async (eventId) => {
      try {
        const bandCountRes = await http.get<EventBandsDto>(`/eventBandsByEventId/${eventId}`);
        bandCountById.set(eventId, bandCountRes.data.count);
      } catch {
        // Ignore missing band counts; UI will show a fallback.
      }
    }),
  ]);

  return events.map((event) => ({
    id: event.id,
    date: event.datetime,
    name: event.name,
    rating: event.rating ?? 0,
    venueId: event.venue_id,
    venueName: venueNameById.get(event.venue_id),
    bandCount: bandCountById.get(event.id),
  }));
}

export async function getBandSummaries(): Promise<BandSummaryDto[]> {
  if (USE_MOCK) {
    await sleep(150);
    return mockBandSummaries;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /bandSummaries
   * Response: BandSummaryDto[]
   */
  const res = await http.get<BandSummaryDto[]>("/bandSummaries");
  return res.data;
}

export async function getEventBandSummaries(): Promise<EventBandSummaryDto[]> {
  if (USE_MOCK) {
    await sleep(150);
    return mockEventBandSummaries;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /eventBandSummaries
   * Response: EventBandSummaryDto[]
   */
  const res = await http.get<EventBandSummaryDto[]>("/eventBandSummaries");
  return res.data;
}

export async function getConcertDetails(concertId: number): Promise<ConcertDetailsDto> {
  if (USE_MOCK) {
    await sleep(150);

    const details = mockDetails[concertId];
    if (!details) {
      // fallback mock
      return {
        id: concertId,
        date: "2025-01-01",
        name: `Concert #${concertId}`,
        rating: 0,
        venueId: undefined,
        bands: [],
        participatedWith: [],
      };
    }
    return details;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /concertEvents/{id}/details
   * Response: ConcertDetailsDto
   */
  const res = await http.get<ConcertDetailsDto>(
    `/concertEvents/${concertId}/details`
  );
  const data = res.data as ConcertDetailsDto & { venue_id?: number };
  return {
    ...data,
    venueId: data.venueId ?? data.venue_id,
  };
}

export async function getConcertEventById(concertId: number): Promise<ConcertEventDto> {
  if (USE_MOCK) {
    await sleep(120);
    const fallback = mockConcerts.find((concert) => concert.id === concertId);
    return {
      id: concertId,
      name: fallback?.name ?? `Concert #${concertId}`,
      datetime: `${fallback?.date ?? "2025-01-01"} 19:00:00`,
      venue_id: fallback?.venueId ?? 1,
      rating: fallback?.rating ?? 0,
      notes: "",
    };
  }

  const res = await http.get<ConcertEventDto>(`/concertEvents/${concertId}`);
  return res.data;
}

export async function getConcertVenues(): Promise<ConcertVenueDto[]> {
  if (USE_MOCK) {
    await sleep(100);
    return mockVenues;
  }

  const res = await http.get<ConcertVenueDto[]>("/concertVenues");
  return res.data;
}

export async function getConcertBands(): Promise<ConcertBandDto[]> {
  if (USE_MOCK) {
    await sleep(100);
    return Object.values(mockBandDetailsById).map(({ id, name }) => ({ id, name }));
  }

  const res = await http.get<ConcertBandDto[]>("/concertBands");
  return res.data;
}

export async function getEventBandsByEventIdDetails(
  eventId: number
): Promise<EventBandDetailDto[]> {
  if (USE_MOCK) {
    await sleep(100);
    return mockEventBandsByEventId[eventId] ?? [];
  }

  const res = await http.get<EventBandDetailDto[]>(
    `/eventBandsByEventId/${eventId}/details`
  );
  return res.data;
}

export async function getConcertBandById(
  bandId: number
): Promise<ConcertBandDetailsDto> {
  if (USE_MOCK) {
    await sleep(120);
    return (
      mockBandDetailsById[bandId] ?? {
        id: bandId,
        name: `Band #${bandId}`,
        genre: "",
        origin_country: "",
        rating: null,
        notes: "",
        link: "",
        website: "",
      }
    );
  }

  const res = await http.get<ConcertBandDetailsDto>(`/concertBands/${bandId}`);
  return res.data;
}

export async function getConcertVenueById(
  venueId: number
): Promise<ConcertVenueDetailsDto> {
  if (USE_MOCK) {
    await sleep(120);
    return (
      mockVenueDetailsById[venueId] ?? {
        id: venueId,
        name: `Venue #${venueId}`,
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: null,
        type: "",
        indoor_outdoor: null,
        capacity: null,
        website: "",
        notes: "",
        latitude: "",
        longitude: "",
        rating: null,
      }
    );
  }

  const res = await http.get<ConcertVenueDetailsDto>(`/concertVenues/${venueId}`);
  return res.data;
}

export async function updateConcertBand(
  bandId: number,
  payload: CreateConcertBandDto
): Promise<void> {
  if (USE_MOCK) {
    await sleep(120);
    mockBandDetailsById[bandId] = { id: bandId, ...payload };
    return;
  }

  await http.put(`/concertBands/${bandId}`, payload);
}

export async function updateConcertVenue(
  venueId: number,
  payload: CreateConcertVenueDto
): Promise<void> {
  if (USE_MOCK) {
    await sleep(120);
    mockVenueDetailsById[venueId] = { id: venueId, ...payload };
    return;
  }

  await http.put(`/concertVenues/${venueId}`, payload);
}

export async function createConcertVenue(payload: CreateConcertVenueDto): Promise<number> {
  if (USE_MOCK) {
    await sleep(100);
    return Date.now();
  }

  const res = await http.post<{ venueId?: string | number }>("/concertVenues", payload);
  const venueId = Number(res.data?.venueId);

  if (!Number.isFinite(venueId)) {
    throw new Error("Failed to create venue.");
  }

  return venueId;
}

export async function createConcertBand(payload: CreateConcertBandDto): Promise<number> {
  if (USE_MOCK) {
    await sleep(100);
    return Date.now();
  }

  const res = await http.post<{ bandId?: string | number }>("/concertBands", payload);
  const bandId = Number(res.data?.bandId);

  if (!Number.isFinite(bandId)) {
    throw new Error("Failed to create band.");
  }

  return bandId;
}

export async function createConcertEvent(payload: CreateConcertEventDto): Promise<number> {
  if (USE_MOCK) {
    await sleep(120);
    return Date.now();
  }

  const res = await http.post<{ eventId?: string | number }>("/concertEvents", payload);
  const eventId = Number(res.data?.eventId);

  if (!Number.isFinite(eventId)) {
    throw new Error("Failed to create event.");
  }

  return eventId;
}

export async function createConcertEventWithBands(
  payload: CreateConcertEventBundleDto
): Promise<CreateConcertEventBundleResponseDto> {
  if (USE_MOCK) {
    await sleep(120);
    return {
      message: "Concert-Event bundle created successfully",
      eventId: Date.now(),
      venueId: payload.venueId ?? Date.now() + 1,
      bandIds: payload.bands.map((_, index) => Date.now() + 2 + index),
      eventBandIds: payload.bands.map((_, index) => Date.now() + 100 + index),
    };
  }

  const res = await http.post<CreateConcertEventBundleResponseDto>(
    "/concertEvents/withBands",
    payload
  );
  return res.data;
}

export async function updateConcertEventWithBands(
  eventId: number,
  payload: CreateConcertEventBundleDto
): Promise<CreateConcertEventBundleResponseDto> {
  if (USE_MOCK) {
    await sleep(120);
    return {
      message: "Concert-Event bundle updated successfully",
      eventId,
      venueId: payload.venueId ?? Date.now() + 1,
      bandIds: payload.bands.map((_, index) => Date.now() + 2 + index),
      eventBandIds: payload.bands.map((_, index) => Date.now() + 100 + index),
    };
  }

  const res = await http.put<CreateConcertEventBundleResponseDto>(
    `/concertEvents/${eventId}/withBands`,
    payload
  );
  return res.data;
}

export async function deleteConcertEvent(eventId: number): Promise<void> {
  if (USE_MOCK) {
    await sleep(80);
    return;
  }

  await http.delete(`/concertEvents/${eventId}`);
}

export async function deleteConcertBand(bandId: number): Promise<void> {
  if (USE_MOCK) {
    await sleep(80);
    return;
  }

  await http.delete(`/concertBands/${bandId}`);
}

export async function deleteConcertVenue(venueId: number): Promise<void> {
  if (USE_MOCK) {
    await sleep(80);
    return;
  }

  await http.delete(`/concertVenues/${venueId}`);
}

export async function clearAllData(): Promise<void> {
  if (USE_MOCK) {
    await sleep(80);
    return;
  }

  await http.delete("/admin/clearAll");
}

export async function createEventBand(payload: CreateEventBandDto): Promise<void> {
  if (USE_MOCK) {
    await sleep(50);
    return;
  }

  await http.post("/eventBands", {
    ...payload,
    eventId: payload.event_id,
    bandId: payload.band_id,
    mainAct: payload.main_act,
    runningOrder: payload.running_order,
  });
}
