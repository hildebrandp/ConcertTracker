<template>
  <div class="page">
    <header class="header">
      <div>
        <h1>Concert-Tracker</h1>
        <div class="sub">Overview and recent activity</div>
      </div>
      <div class="header-actions">
        <label class="theme-toggle">
          <input v-model="darkMode" type="checkbox" />
          <span>Dark mode</span>
        </label>
        <button class="danger" type="button" @click="confirmClearAll">
          Delete all data
        </button>
        <button class="primary" type="button" @click="openCreate">
          Add event
        </button>
      </div>
    </header>

    <StatsRow
      :stats="stats"
      @show-all-concerts="openAllConcerts"
      @show-all-bands="openAllBands"
      @show-all-acts="openAllActs"
      @show-all-venues="openAllVenues"
    />

    <ConcertsTable
      v-if="!allConcertsOpen && !allBandsOpen && !allActsOpen && !allVenuesOpen"
      :concerts="concerts"
      title="Last 10 Concerts"
      :sortable="false"
      @select="openDetails"
    />

    <div v-else-if="allConcertsOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllConcerts">
          Back to dashboard
        </button>
        <div v-if="allConcertsLoading" class="hint">Loading all concerts...</div>
      </div>

      <div class="filter-row">
        <label class="filter-label" for="concerts-search">Search</label>
        <input
          id="concerts-search"
          v-model.trim="concertsSearch"
          type="text"
          placeholder="Filter by concert name..."
        />
      </div>

      <div class="pager">
        <div class="pager-group">
          <label class="pager-label" for="page-size">Per page</label>
          <select id="page-size" v-model="pageSize">
            <option v-for="option in pageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="pager-group">
          <button
            class="secondary"
            type="button"
            :disabled="isAllPages || currentPage === 1"
            @click="prevPage"
          >
            Prev
          </button>
          <div class="pager-meta">Page {{ currentPage }} of {{ totalPages }}</div>
          <button
            class="secondary"
            type="button"
            :disabled="isAllPages || currentPage === totalPages"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>

      <ConcertsTable
        :concerts="paginatedConcerts"
        :sort-key="concertsSortKey"
        :sort-dir="concertsSortDir"
        @sort-change="setConcertsSort"
        @select="openDetails"
      />

      <div v-if="allConcertsError" class="error">
        {{ allConcertsError }}
      </div>
    </div>

    <div v-else-if="allBandsOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllBands">
          Back to dashboard
        </button>
        <div v-if="allBandsLoading" class="hint">Loading bands...</div>
      </div>

      <div class="filter-row">
        <label class="filter-label" for="bands-search">Search</label>
        <input
          id="bands-search"
          v-model.trim="bandsSearch"
          type="text"
          placeholder="Filter by band name..."
        />
      </div>

      <div class="pager">
        <div class="pager-group">
          <label class="pager-label" for="band-page-size">Per page</label>
          <select id="band-page-size" v-model="bandPageSize">
            <option v-for="option in bandPageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="pager-group">
          <button
            class="secondary"
            type="button"
            :disabled="isAllBandPages || bandPage === 1"
            @click="prevBandPage"
          >
            Prev
          </button>
          <div class="pager-meta">Page {{ bandPage }} of {{ totalBandPages }}</div>
          <button
            class="secondary"
            type="button"
            :disabled="isAllBandPages || bandPage === totalBandPages"
            @click="nextBandPage"
          >
            Next
          </button>
        </div>
      </div>

      <BandsTable
        :bands="paginatedBands"
        :sort-key="bandsSortKey"
        :sort-dir="bandsSortDir"
        @sort-change="setBandsSort"
        @select="openBandDetails"
      />

      <div v-if="allBandsError" class="error">
        {{ allBandsError }}
      </div>
    </div>

    <div v-else-if="allActsOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllActs">
          Back to dashboard
        </button>
        <div v-if="allActsLoading" class="hint">Loading bands...</div>
      </div>

      <div class="filter-row">
        <label class="filter-label" for="acts-search">Search</label>
        <input
          id="acts-search"
          v-model.trim="actsSearch"
          type="text"
          placeholder="Filter by band name..."
        />
      </div>

      <div class="pager">
        <div class="pager-group">
          <label class="pager-label" for="acts-page-size">Per page</label>
          <select id="acts-page-size" v-model="actsPageSize">
            <option v-for="option in actsPageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="pager-group">
          <button
            class="secondary"
            type="button"
            :disabled="isAllActsPages || actsPage === 1"
            @click="prevActsPage"
          >
            Prev
          </button>
          <div class="pager-meta">Page {{ actsPage }} of {{ totalActsPages }}</div>
          <button
            class="secondary"
            type="button"
            :disabled="isAllActsPages || actsPage === totalActsPages"
            @click="nextActsPage"
          >
            Next
          </button>
        </div>
      </div>

      <EventBandsTable
        :entries="paginatedActs"
        :sort-key="actsSortKey"
        :sort-dir="actsSortDir"
        @sort-change="setActsSort"
        @select="openDetails"
      />

      <div v-if="allActsError" class="error">
        {{ allActsError }}
      </div>
    </div>

    <div v-else-if="allVenuesOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllVenues">
          Back to dashboard
        </button>
        <div v-if="allVenuesLoading" class="hint">Loading venues...</div>
      </div>

      <div class="filter-row">
        <label class="filter-label" for="venues-search">Search</label>
        <input
          id="venues-search"
          v-model.trim="venuesSearch"
          type="text"
          placeholder="Filter by venue name..."
        />
      </div>

      <div class="pager">
        <div class="pager-group">
          <label class="pager-label" for="venues-page-size">Per page</label>
          <select id="venues-page-size" v-model="venuesPageSize">
            <option v-for="option in venuesPageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="pager-group">
          <button
            class="secondary"
            type="button"
            :disabled="isAllVenuesPages || venuesPage === 1"
            @click="prevVenuesPage"
          >
            Prev
          </button>
          <div class="pager-meta">Page {{ venuesPage }} of {{ totalVenuesPages }}</div>
          <button
            class="secondary"
            type="button"
            :disabled="isAllVenuesPages || venuesPage === totalVenuesPages"
            @click="nextVenuesPage"
          >
            Next
          </button>
        </div>
      </div>

      <VenuesTable
        :venues="paginatedVenues"
        :sort-key="venuesSortKey"
        :sort-dir="venuesSortDir"
        @sort-change="setVenuesSort"
        @select="openVenueDetails"
      />

      <div v-if="allVenuesError" class="error">
        {{ allVenuesError }}
      </div>
    </div>

    <ConcertDetailsModal
      :open="detailsOpen"
      :details="selectedDetails"
      :error="detailsError"
      @close="closeDetails"
      @show-venue="openVenueDetailsFromEvent"
      @update-event="openUpdateEvent"
      @delete-event="confirmDeleteEvent"
    />

    <BandDetailsModal
      :open="bandDetailsOpen"
      :band="bandDetails"
      :error="bandDetailsError"
      :saving="bandDetailsSaving"
      :all-bands="bandLookup"
      :all-acts="allActs"
      @close="closeBandDetails"
      @save="saveBandDetails"
      @show-acts="jumpToBandActs"
      @delete-band="confirmDeleteBand"
    />

    <VenueDetailsModal
      :open="venueDetailsOpen"
      :venue="venueDetails"
      :error="venueDetailsError"
      :saving="venueDetailsSaving"
      @close="closeVenueDetails"
      @save="saveVenueDetails"
      @delete-venue="confirmDeleteVenue"
    />

    <AddEventModal
      :open="createOpen || updateOpen"
      :mode="updateOpen ? 'update' : 'create'"
      :event-id="updateEventId"
      @close="closeEventModal"
      @created="refreshData"
      @updated="handleEventUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import StatsRow from "../components/StatsRow.vue";
import ConcertsTable from "../components/ConcertsTable.vue";
import BandsTable from "../components/BandsTable.vue";
import VenuesTable from "../components/VenuesTable.vue";
import BandDetailsModal from "../components/BandDetailsModal.vue";
import VenueDetailsModal from "../components/VenueDetailsModal.vue";
import EventBandsTable from "../components/EventBandsTable.vue";
import ConcertDetailsModal from "../components/ConcertDetailsModal.vue";
import AddEventModal from "../components/AddEventModal.vue";
import {
  getAllConcerts,
  getBandSummaries,
  getConcertBands,
  getConcertBandById,
  getConcertDetails,
  getConcertVenueById,
  getConcertVenues,
  clearAllData,
  deleteConcertBand,
  deleteConcertEvent,
  deleteConcertVenue,
  getEventBandSummaries,
  getLastConcerts,
  getStats,
  updateConcertBand,
  updateConcertVenue,
} from "../api/concertsApi";
import type {
  BandSummaryDto,
  ConcertBandDto,
  ConcertBandDetailsDto,
  ConcertDetailsDto,
  ConcertListItemDto,
  ConcertVenueDetailsDto,
  ConcertVenueDto,
  CreateConcertBandDto,
  CreateConcertVenueDto,
  EventBandSummaryDto,
  StatsDto,
  VenueSummaryDto,
} from "../api/types";

const stats = ref<StatsDto | null>(null);
const concerts = ref<ConcertListItemDto[]>([]);
const allConcerts = ref<ConcertListItemDto[]>([]);
const allConcertsOpen = ref(false);
const allConcertsLoading = ref(false);
const allConcertsError = ref<string | null>(null);
const pageSizeOptions = ["10", "20", "50", "100", "200", "All"] as const;
const pageSize = ref<(typeof pageSizeOptions)[number]>("20");
const currentPage = ref(1);
const concertsSearch = ref("");
const concertsSortKey = ref<"date" | "name" | "venue" | "bands" | "rating">("date");
const concertsSortDir = ref<"asc" | "desc">("desc");
const allBands = ref<BandSummaryDto[]>([]);
const allBandsOpen = ref(false);
const allBandsLoading = ref(false);
const allBandsError = ref<string | null>(null);
const bandPageSizeOptions = ["10", "20", "50", "100", "200", "All"] as const;
const bandPageSize = ref<(typeof bandPageSizeOptions)[number]>("20");
const bandPage = ref(1);
const bandsSearch = ref("");
const bandsSortKey = ref<"band" | "lastSeen" | "count" | "rating" | "venue">("band");
const bandsSortDir = ref<"asc" | "desc">("asc");
const allActs = ref<EventBandSummaryDto[]>([]);
const allActsOpen = ref(false);
const allActsLoading = ref(false);
const allActsError = ref<string | null>(null);
const actsPageSizeOptions = ["10", "20", "50", "100", "200", "All"] as const;
const actsPageSize = ref<(typeof actsPageSizeOptions)[number]>("20");
const actsPage = ref(1);
const actsSearch = ref("");
const actsSortKey = ref<"date" | "band" | "event" | "venue" | "rating">("date");
const actsSortDir = ref<"asc" | "desc">("desc");
const allVenues = ref<VenueSummaryDto[]>([]);
const allVenuesOpen = ref(false);
const allVenuesLoading = ref(false);
const allVenuesError = ref<string | null>(null);
const venuesSearch = ref("");
const venuesPageSizeOptions = ["10", "20", "50", "100", "200", "All"] as const;
const venuesPageSize = ref<(typeof venuesPageSizeOptions)[number]>("20");
const venuesPage = ref(1);
const venuesSortKey = ref<"venue" | "lastVisited" | "count" | "rating">("venue");
const venuesSortDir = ref<"asc" | "desc">("asc");

const detailsOpen = ref(false);
const selectedDetails = ref<ConcertDetailsDto | null>(null);
const detailsError = ref<string | null>(null);
const bandDetailsOpen = ref(false);
const bandDetails = ref<ConcertBandDetailsDto | null>(null);
const bandDetailsError = ref<string | null>(null);
const bandDetailsSaving = ref(false);
const bandLookup = ref<ConcertBandDto[]>([]);
const bandLookupError = ref<string | null>(null);
const venueDetailsOpen = ref(false);
const venueDetails = ref<ConcertVenueDetailsDto | null>(null);
const venueDetailsError = ref<string | null>(null);
const venueDetailsSaving = ref(false);
const returnToEventDetails = ref(false);

const createOpen = ref(false);
const updateOpen = ref(false);
const updateEventId = ref<number | null>(null);
const reopenEventId = ref<number | null>(null);
const darkMode = ref(false);
async function loadAllConcerts() {
  allConcertsLoading.value = true;
  allConcertsError.value = null;

  try {
    allConcerts.value = await getAllConcerts();
  } catch (e: any) {
    allConcertsError.value = e?.message ?? "Failed to load all concerts.";
  } finally {
    allConcertsLoading.value = false;
  }
}

async function openAllConcerts() {
  allConcertsOpen.value = true;
  allBandsOpen.value = false;
  allActsOpen.value = false;
  allVenuesOpen.value = false;
  if (allConcerts.value.length === 0) {
    await loadAllConcerts();
  }
}

function closeAllConcerts() {
  allConcertsOpen.value = false;
}

async function loadAllBands() {
  allBandsLoading.value = true;
  allBandsError.value = null;

  try {
    allBands.value = await getBandSummaries();
  } catch (e: any) {
    allBandsError.value = e?.message ?? "Failed to load bands.";
  } finally {
    allBandsLoading.value = false;
  }
}

async function openAllBands() {
  allBandsOpen.value = true;
  allConcertsOpen.value = false;
  allActsOpen.value = false;
  allVenuesOpen.value = false;
  if (allBands.value.length === 0) {
    await loadAllBands();
  }
}

function closeAllBands() {
  allBandsOpen.value = false;
}

async function loadAllActs() {
  allActsLoading.value = true;
  allActsError.value = null;

  try {
    allActs.value = await getEventBandSummaries();
  } catch (e: any) {
    allActsError.value = e?.message ?? "Failed to load bands.";
  } finally {
    allActsLoading.value = false;
  }
}

function buildVenueSummaries(
  venues: ConcertVenueDto[],
  concertsData: ConcertListItemDto[]
): VenueSummaryDto[] {
  const statsByVenue = new Map<
    number,
    { count: number; lastDate?: string; lastVenueName?: string }
  >();

  for (const concert of concertsData) {
    if (!concert.venueId) continue;
    const date = concert.date;
    const entry = statsByVenue.get(concert.venueId) ?? { count: 0 };
    entry.count += 1;
    if (!entry.lastDate || date > entry.lastDate) {
      entry.lastDate = date;
      if (concert.venueName) {
        entry.lastVenueName = concert.venueName;
      }
    } else if (!entry.lastVenueName && concert.venueName) {
      entry.lastVenueName = concert.venueName;
    }
    statsByVenue.set(concert.venueId, entry);
  }

  const summaries: VenueSummaryDto[] = [];

  for (const venue of venues) {
    const stats = statsByVenue.get(venue.id);
    if (!stats) continue;
    summaries.push({
      venue_id: venue.id,
      venue_name: venue.name,
      last_visited_date: stats.lastDate ?? null,
      visit_count: stats.count,
      rating: venue.rating ?? null,
    });
    statsByVenue.delete(venue.id);
  }

  for (const [venueId, stats] of statsByVenue) {
    summaries.push({
      venue_id: venueId,
      venue_name: stats.lastVenueName ?? `Venue #${venueId}`,
      last_visited_date: stats.lastDate ?? null,
      visit_count: stats.count,
      rating: null,
    });
  }

  summaries.sort((a, b) => a.venue_name.localeCompare(b.venue_name));
  return summaries;
}

async function loadAllVenues() {
  allVenuesLoading.value = true;
  allVenuesError.value = null;

  try {
    const [venues, concertsData] = await Promise.all([
      getConcertVenues(),
      allConcerts.value.length === 0 ? getAllConcerts() : Promise.resolve(allConcerts.value),
    ]);

    if (allConcerts.value.length === 0) {
      allConcerts.value = concertsData;
    }

    allVenues.value = buildVenueSummaries(venues, concertsData);
  } catch (e: any) {
    allVenuesError.value = e?.message ?? "Failed to load venues.";
  } finally {
    allVenuesLoading.value = false;
  }
}

async function openAllActs() {
  allActsOpen.value = true;
  allConcertsOpen.value = false;
  allBandsOpen.value = false;
  allVenuesOpen.value = false;
  if (allActs.value.length === 0) {
    await loadAllActs();
  }
}

function closeAllActs() {
  allActsOpen.value = false;
}

async function openAllVenues() {
  allVenuesOpen.value = true;
  allConcertsOpen.value = false;
  allBandsOpen.value = false;
  allActsOpen.value = false;
  if (allVenues.value.length === 0) {
    await loadAllVenues();
  }
}

function closeAllVenues() {
  allVenuesOpen.value = false;
}

const isAllPages = computed(() => pageSize.value === "All");
const isAllBandPages = computed(() => bandPageSize.value === "All");
const isAllActsPages = computed(() => actsPageSize.value === "All");
const isAllVenuesPages = computed(() => venuesPageSize.value === "All");

const totalPages = computed(() => {
  if (isAllPages.value) {
    return 1;
  }
  const size = Number(pageSize.value);
  return Math.max(1, Math.ceil(filteredConcerts.value.length / size));
});

const filteredConcerts = computed(() => {
  const q = concertsSearch.value.trim().toLowerCase();
  if (!q) {
    return allConcerts.value;
  }
  return allConcerts.value.filter((concert) =>
    concert.name.toLowerCase().includes(q)
  );
});

const sortedConcerts = computed(() => {
  const dir = concertsSortDir.value === "asc" ? 1 : -1;
  return [...filteredConcerts.value].sort((a, b) => {
    let result = 0;
    switch (concertsSortKey.value) {
      case "date":
        result = compareNullable(a.date, b.date, (x, y) => x.localeCompare(y));
        break;
      case "name":
        result = compareNullable(a.name, b.name, (x, y) => x.localeCompare(y));
        break;
      case "venue":
        result = compareNullable(
          a.venueName,
          b.venueName,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "bands":
        result = compareNullable(a.bandCount, b.bandCount, (x, y) => x - y);
        break;
      case "rating":
        result = compareNullable(a.rating, b.rating, (x, y) => x - y);
        break;
      default:
        result = 0;
    }
    return result * dir;
  });
});

const paginatedConcerts = computed(() => {
  if (isAllPages.value) {
    return sortedConcerts.value;
  }
  const size = Number(pageSize.value);
  const start = (currentPage.value - 1) * size;
  return sortedConcerts.value.slice(start, start + size);
});

const totalBandPages = computed(() => {
  if (isAllBandPages.value) {
    return 1;
  }
  const size = Number(bandPageSize.value);
  return Math.max(1, Math.ceil(filteredBands.value.length / size));
});

const filteredBands = computed(() => {
  const q = bandsSearch.value.trim().toLowerCase();
  const bandsList = q
    ? allBands.value.filter((band) =>
        band.band_name.toLowerCase().includes(q)
      )
    : allBands.value;
  return [...bandsList].sort((a, b) => a.band_name.localeCompare(b.band_name));
});

const sortedBands = computed(() => {
  const dir = bandsSortDir.value === "asc" ? 1 : -1;
  return [...filteredBands.value].sort((a, b) => {
    let result = 0;
    switch (bandsSortKey.value) {
      case "band":
        result = compareNullable(
          a.band_name,
          b.band_name,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "lastSeen":
        result = compareNullable(
          a.last_seen_date,
          b.last_seen_date,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "count":
        result = compareNullable(a.seen_count, b.seen_count, (x, y) => x - y);
        break;
      case "rating":
        result = compareNullable(a.rating, b.rating, (x, y) => x - y);
        break;
      case "venue":
        result = compareNullable(
          a.last_venue_name,
          b.last_venue_name,
          (x, y) => x.localeCompare(y)
        );
        break;
      default:
        result = 0;
    }
    return result * dir;
  });
});

const paginatedBands = computed(() => {
  if (isAllBandPages.value) {
    return sortedBands.value;
  }
  const size = Number(bandPageSize.value);
  const start = (bandPage.value - 1) * size;
  return sortedBands.value.slice(start, start + size);
});

const totalActsPages = computed(() => {
  if (isAllActsPages.value) {
    return 1;
  }
  const size = Number(actsPageSize.value);
  return Math.max(1, Math.ceil(filteredActs.value.length / size));
});

const totalVenuesPages = computed(() => {
  if (isAllVenuesPages.value) {
    return 1;
  }
  const size = Number(venuesPageSize.value);
  return Math.max(1, Math.ceil(filteredVenues.value.length / size));
});

const filteredActs = computed(() => {
  const q = actsSearch.value.trim().toLowerCase();
  if (!q) {
    return allActs.value;
  }
  return allActs.value.filter((entry) =>
    entry.band_name.toLowerCase().includes(q)
  );
});

const sortedActs = computed(() => {
  const dir = actsSortDir.value === "asc" ? 1 : -1;
  return [...filteredActs.value].sort((a, b) => {
    let result = 0;
    switch (actsSortKey.value) {
      case "date":
        result = compareNullable(a.date, b.date, (x, y) => x.localeCompare(y));
        break;
      case "band":
        result = compareNullable(
          a.band_name,
          b.band_name,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "event":
        result = compareNullable(
          a.event_name,
          b.event_name,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "venue":
        result = compareNullable(
          a.venue_name,
          b.venue_name,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "rating":
        result = compareNullable(a.rating, b.rating, (x, y) => x - y);
        break;
      default:
        result = 0;
    }
    return result * dir;
  });
});

const paginatedActs = computed(() => {
  if (isAllActsPages.value) {
    return sortedActs.value;
  }
  const size = Number(actsPageSize.value);
  const start = (actsPage.value - 1) * size;
  return sortedActs.value.slice(start, start + size);
});

const filteredVenues = computed(() => {
  const q = venuesSearch.value.trim().toLowerCase();
  if (!q) {
    return allVenues.value;
  }
  return allVenues.value.filter((venue) =>
    venue.venue_name.toLowerCase().includes(q)
  );
});

const sortedVenues = computed(() => {
  const dir = venuesSortDir.value === "asc" ? 1 : -1;
  return [...filteredVenues.value].sort((a, b) => {
    let result = 0;
    switch (venuesSortKey.value) {
      case "venue":
        result = compareNullable(
          a.venue_name,
          b.venue_name,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "lastVisited":
        result = compareNullable(
          a.last_visited_date,
          b.last_visited_date,
          (x, y) => x.localeCompare(y)
        );
        break;
      case "count":
        result = compareNullable(a.visit_count, b.visit_count, (x, y) => x - y);
        break;
      case "rating":
        result = compareNullable(a.rating, b.rating, (x, y) => x - y);
        break;
      default:
        result = 0;
    }
    return result * dir;
  });
});

const paginatedVenues = computed(() => {
  if (isAllVenuesPages.value) {
    return sortedVenues.value;
  }
  const size = Number(venuesPageSize.value);
  const start = (venuesPage.value - 1) * size;
  return sortedVenues.value.slice(start, start + size);
});

watch([pageSize, allConcerts], () => {
  currentPage.value = 1;
});

watch([concertsSearch], () => {
  currentPage.value = 1;
});

watch([concertsSortKey, concertsSortDir], () => {
  currentPage.value = 1;
});

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal;
  }
});

watch([bandPageSize, allBands, bandsSearch], () => {
  bandPage.value = 1;
});

watch([bandsSortKey, bandsSortDir], () => {
  bandPage.value = 1;
});

watch(totalBandPages, (nextTotal) => {
  if (bandPage.value > nextTotal) {
    bandPage.value = nextTotal;
  }
});

watch([actsPageSize, allActs, actsSearch], () => {
  actsPage.value = 1;
});

watch([actsSortKey, actsSortDir], () => {
  actsPage.value = 1;
});

watch(totalActsPages, (nextTotal) => {
  if (actsPage.value > nextTotal) {
    actsPage.value = nextTotal;
  }
});

watch([venuesPageSize, allVenues, venuesSearch], () => {
  venuesPage.value = 1;
});

watch([venuesSortKey, venuesSortDir], () => {
  venuesPage.value = 1;
});

watch(totalVenuesPages, (nextTotal) => {
  if (venuesPage.value > nextTotal) {
    venuesPage.value = nextTotal;
  }
});

function setConcertsSort(key: "date" | "name" | "venue" | "bands" | "rating") {
  toggleSort(key, concertsSortKey, concertsSortDir, defaultConcertsSortDir);
}

function setBandsSort(key: "band" | "lastSeen" | "count" | "rating" | "venue") {
  toggleSort(key, bandsSortKey, bandsSortDir, defaultBandsSortDir);
}

function setActsSort(key: "date" | "band" | "event" | "venue" | "rating") {
  toggleSort(key, actsSortKey, actsSortDir, defaultActsSortDir);
}

function setVenuesSort(key: "venue" | "lastVisited" | "count" | "rating") {
  toggleSort(key, venuesSortKey, venuesSortDir, defaultVenuesSortDir);
}

function toggleSort<K extends string>(
  key: K,
  activeKey: { value: K },
  activeDir: { value: "asc" | "desc" },
  defaultDir: (key: K) => "asc" | "desc"
) {
  if (activeKey.value === key) {
    activeDir.value = activeDir.value === "asc" ? "desc" : "asc";
    return;
  }
  activeKey.value = key;
  activeDir.value = defaultDir(key);
}

function defaultConcertsSortDir(key: "date" | "name" | "venue" | "bands" | "rating") {
  return key === "name" || key === "venue" ? "asc" : "desc";
}

function defaultBandsSortDir(key: "band" | "lastSeen" | "count" | "rating" | "venue") {
  return key === "band" || key === "venue" ? "asc" : "desc";
}

function defaultActsSortDir(key: "date" | "band" | "event" | "venue" | "rating") {
  return key === "band" || key === "event" || key === "venue" ? "asc" : "desc";
}

function defaultVenuesSortDir(key: "venue" | "lastVisited" | "count" | "rating") {
  return key === "venue" ? "asc" : "desc";
}

function compareNullable<T>(
  aVal: T | null | undefined,
  bVal: T | null | undefined,
  compare: (a: T, b: T) => number
) {
  const aMissing = aVal === null || aVal === undefined || aVal === "";
  const bMissing = bVal === null || bVal === undefined || bVal === "";
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  return compare(aVal as T, bVal as T);
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}

function prevBandPage() {
  if (bandPage.value > 1) {
    bandPage.value -= 1;
  }
}

function nextBandPage() {
  if (bandPage.value < totalBandPages.value) {
    bandPage.value += 1;
  }
}

function prevActsPage() {
  if (actsPage.value > 1) {
    actsPage.value -= 1;
  }
}

function nextActsPage() {
  if (actsPage.value < totalActsPages.value) {
    actsPage.value += 1;
  }
}

function prevVenuesPage() {
  if (venuesPage.value > 1) {
    venuesPage.value -= 1;
  }
}

function nextVenuesPage() {
  if (venuesPage.value < totalVenuesPages.value) {
    venuesPage.value += 1;
  }
}

async function refreshData() {
  stats.value = await getStats();
  concerts.value = await getLastConcerts(10);

  if (allConcertsOpen.value || allConcerts.value.length > 0) {
    await loadAllConcerts();
  }
  if (allBandsOpen.value || allBands.value.length > 0) {
    await loadAllBands();
  }
  if (allActsOpen.value || allActs.value.length > 0) {
    await loadAllActs();
  }
  if (allVenuesOpen.value || allVenues.value.length > 0) {
    await loadAllVenues();
  }
}

onMounted(() => {
  const saved = localStorage.getItem("concert-tracker:dark-mode");
  if (saved !== null) {
    darkMode.value = saved === "true";
  } else {
    darkMode.value = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  }
  document.body.classList.toggle("dark", darkMode.value);
  refreshData();
});

watch(darkMode, (enabled) => {
  localStorage.setItem("concert-tracker:dark-mode", String(enabled));
  document.body.classList.toggle("dark", enabled);
});

async function openDetails(concertId: number) {
  detailsOpen.value = true;
  selectedDetails.value = null;
  detailsError.value = null;

  try {
    const details = await getConcertDetails(concertId);
    if (!details.venueId || !details.venueName) {
      const fromList =
        allConcerts.value.find((concert) => concert.id === concertId) ??
        concerts.value.find((concert) => concert.id === concertId);
      if (fromList?.venueId && !details.venueId) {
        details.venueId = fromList.venueId;
      }
      if (fromList?.venueName && !details.venueName) {
        details.venueName = fromList.venueName;
      }
    }
    selectedDetails.value = details;
  } catch (e: any) {
    detailsError.value = e?.message ?? "Failed to load concert details.";
  }
}

function closeDetails() {
  detailsOpen.value = false;
}

async function confirmDeleteEvent() {
  if (!selectedDetails.value) return;
  const ok = window.confirm(
    `Delete event "${selectedDetails.value.name}"? This cannot be undone.`
  );
  if (!ok) return;

  try {
    await deleteConcertEvent(selectedDetails.value.id);
    detailsOpen.value = false;
    await refreshData();
  } catch (e: any) {
    detailsError.value = e?.message ?? "Failed to delete event.";
  }
}

async function confirmDeleteBand() {
  if (!bandDetails.value) return;
  const ok = window.confirm(
    `Delete band "${bandDetails.value.name}"? This cannot be undone.`
  );
  if (!ok) return;

  try {
    await deleteConcertBand(bandDetails.value.id);
    bandDetailsOpen.value = false;
    await refreshData();
  } catch (e: any) {
    bandDetailsError.value = e?.message ?? "Failed to delete band.";
  }
}

async function confirmDeleteVenue() {
  if (!venueDetails.value) return;
  const ok = window.confirm(
    `Delete venue "${venueDetails.value.name}"? This cannot be undone.`
  );
  if (!ok) return;

  try {
    await deleteConcertVenue(venueDetails.value.id);
    venueDetailsOpen.value = false;
    await refreshData();
  } catch (e: any) {
    venueDetailsError.value = e?.message ?? "Failed to delete venue.";
  }
}

async function confirmClearAll() {
  const ok = window.confirm(
    "Delete ALL data (events, bands, venues, participants)? This cannot be undone."
  );
  if (!ok) return;
  const confirmText = window.prompt(
    "Type DELETE to confirm clearing all data."
  );
  if (confirmText !== "DELETE") {
    return;
  }

  try {
    await clearAllData();
    detailsOpen.value = false;
    bandDetailsOpen.value = false;
    venueDetailsOpen.value = false;
    createOpen.value = false;
    updateOpen.value = false;
    updateEventId.value = null;
    allConcerts.value = [];
    allBands.value = [];
    allActs.value = [];
    allVenues.value = [];
    await refreshData();
  } catch (e: any) {
    detailsError.value = e?.message ?? "Failed to delete all data.";
  }
}

async function openVenueDetailsFromEvent(venueId: number) {
  await openVenueDetails(venueId, true);
  detailsOpen.value = false;
}

async function openBandDetails(bandId: number) {
  bandDetailsOpen.value = true;
  bandDetails.value = null;
  bandDetailsError.value = null;

  if (bandLookup.value.length === 0) {
    try {
      bandLookup.value = await getConcertBands();
    } catch (e: any) {
      bandLookupError.value = e?.message ?? "Failed to load band lookups.";
    }
  }

  if (allActs.value.length === 0) {
    await loadAllActs();
  }

  try {
    bandDetails.value = await getConcertBandById(bandId);
  } catch (e: any) {
    bandDetailsError.value = e?.message ?? "Failed to load band details.";
  }
}

function closeBandDetails() {
  bandDetailsOpen.value = false;
}

async function openVenueDetails(venueId: number, fromEvent = false) {
  venueDetailsOpen.value = true;
  venueDetails.value = null;
  venueDetailsError.value = null;
  returnToEventDetails.value = fromEvent;

  try {
    venueDetails.value = await getConcertVenueById(venueId);
  } catch (e: any) {
    venueDetailsError.value = e?.message ?? "Failed to load venue details.";
  }
}

function closeVenueDetails() {
  venueDetailsOpen.value = false;
  if (returnToEventDetails.value && selectedDetails.value) {
    detailsOpen.value = true;
  }
  returnToEventDetails.value = false;
}

async function jumpToBandActs(bandName: string) {
  actsSearch.value = bandName;
  await openAllActs();
  bandDetailsOpen.value = false;
}

async function saveBandDetails(payload: CreateConcertBandDto) {
  if (!bandDetails.value) {
    return;
  }

  bandDetailsSaving.value = true;
  bandDetailsError.value = null;

  try {
    await updateConcertBand(bandDetails.value.id, payload);
    bandDetails.value = await getConcertBandById(bandDetails.value.id);

    if (allBandsOpen.value || allBands.value.length > 0) {
      await loadAllBands();
    }
    if (allActsOpen.value || allActs.value.length > 0) {
      await loadAllActs();
    }
  } catch (e: any) {
    bandDetailsError.value = e?.message ?? "Failed to update band.";
  } finally {
    bandDetailsSaving.value = false;
  }
}

async function saveVenueDetails(payload: CreateConcertVenueDto) {
  if (!venueDetails.value) {
    return;
  }

  venueDetailsSaving.value = true;
  venueDetailsError.value = null;

  try {
    await updateConcertVenue(venueDetails.value.id, payload);
    venueDetails.value = await getConcertVenueById(venueDetails.value.id);

    if (allVenuesOpen.value || allVenues.value.length > 0) {
      await loadAllVenues();
    }
  } catch (e: any) {
    venueDetailsError.value = e?.message ?? "Failed to update venue.";
  } finally {
    venueDetailsSaving.value = false;
  }
}

function openCreate() {
  createOpen.value = true;
}

function openUpdateEvent() {
  if (!selectedDetails.value) return;
  updateEventId.value = selectedDetails.value.id;
  updateOpen.value = true;
  detailsOpen.value = false;
}

function closeEventModal() {
  createOpen.value = false;
  updateOpen.value = false;
  updateEventId.value = null;
}

async function handleEventUpdated() {
  reopenEventId.value = updateEventId.value;
  await refreshData();
  if (reopenEventId.value) {
    await openDetails(reopenEventId.value);
    reopenEventId.value = null;
  }
}
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.header h1 {
  margin: 0;
  font-size: 22px;
}

.sub {
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 13px;
}

.primary {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.danger {
  border: 1px solid rgba(180, 0, 0, 0.4);
  background: rgba(180, 0, 0, 0.08);
  color: #7a0b0b;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
}

.theme-toggle input {
  accent-color: #111;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.all-concerts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.all-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.filter-row input {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 6px 10px;
  min-width: 240px;
  background: var(--card);
  color: var(--text);
}

.pager-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pager-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.pager-meta {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.pager select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 6px 10px;
  background: var(--card);
  color: var(--text);
}

.pager select option {
  background: var(--card);
  color: var(--text);
}

.secondary {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.error {
  border: 1px solid rgba(180, 0, 0, 0.35);
  background: rgba(180, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 10px;
}</style>
