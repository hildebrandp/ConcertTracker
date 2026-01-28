<template>
  <div class="page">
    <header class="header">
      <div>
        <button type="button" class="title-link" @click="closeAllViews">
          <img class="title-icon" src="/concert-tracker-icon.svg" alt="" />
          <h1>Concert-Tracker</h1>
        </button>
        <div class="sub">Overview and recent activity</div>
      </div>
      <div class="header-actions">
        <button class="secondary" type="button" @click="toggleSettings">
          Settings
        </button>
        <button class="primary" type="button" @click="openCreate">
          Add event
        </button>
      </div>
    </header>

    <div v-if="settingsOpen" class="settings-backdrop" @click.self="closeSettings">
      <div class="settings-panel" role="dialog" aria-modal="true">
        <div class="settings-header">
          <div class="settings-title">Settings</div>
          <button class="close" type="button" @click="closeSettings">Close</button>
        </div>
        <div class="settings-body">
          <label class="theme-toggle">
            <input v-model="darkMode" type="checkbox" />
            <span>Dark mode</span>
          </label>
          <button class="danger" type="button" @click="confirmClearAll">
            Delete all data
          </button>
        </div>
      </div>
    </div>

    <StatsRow
      :stats="stats"
      :concerts-total="pastConcertsTotal"
      :bands-total="pastBandsTotal"
      :acts-total="pastActsTotal"
      :venues-total="pastVenuesTotal"
      :planned-events="plannedEventsTotal"
      :concerts-this-year="concertsThisYear"
      :acts-this-year="actsThisYear"
      :ticket-total="ticketTotals.total"
      :ticket-this-year="ticketTotals.thisYear"
      :active-view="activeStatsView"
      @show-all-concerts="openAllConcerts"
      @show-all-bands="openAllBands"
      @show-all-acts="openAllActs"
      @show-all-venues="openAllVenues"
      @show-all-participants="openAllParticipants"
    />

    <div
      v-if="!allConcertsOpen && !allBandsOpen && !allActsOpen && !allVenuesOpen && !allParticipantsOpen"
      class="dashboard-tables"
    >
      <ConcertsTable
        :concerts="pastConcerts.slice(0, 10)"
        title="Last 10 Past Concerts"
        :sortable="false"
        @select="openDetails"
      />

      <ConcertsTable
        :concerts="upcomingConcerts.slice(0, 10)"
        title="Upcoming Concerts"
        :sortable="false"
        @select="openDetails"
      />
    </div>

    <AllConcertsView
      v-else-if="allConcertsOpen"
      :loading="allConcertsLoading"
      :error="allConcertsError"
      :page-size-options="pageSizeOptions"
      :page-size="pageSize"
      :current-page="currentPage"
      :total-pages="totalPages"
      :is-all-pages="isAllPages"
      :concerts="paginatedConcerts"
      :sort-key="concertsSortKey"
      :sort-dir="concertsSortDir"
      :search="concertsSearch"
      :participant-name="concertsParticipantName"
      @close="closeAllConcerts"
      @update:pageSize="pageSize = $event as (typeof pageSizeOptions)[number]"
      @update:search="concertsSearch = $event"
      @prev-page="prevPage"
      @next-page="nextPage"
      @sort-change="setConcertsSort"
      @select="openDetails"
      @clear-participant-filter="clearConcertsParticipantFilter"
    />

    <AllBandsView
      v-else-if="allBandsOpen"
      :loading="allBandsLoading"
      :error="allBandsError"
      :page-size-options="bandPageSizeOptions"
      :page-size="bandPageSize"
      :current-page="bandPage"
      :total-pages="totalBandPages"
      :is-all-pages="isAllBandPages"
      :bands="paginatedBands"
      :sort-key="bandsSortKey"
      :sort-dir="bandsSortDir"
      :search="bandsSearch"
      @close="closeAllBands"
      @update:pageSize="bandPageSize = $event as (typeof bandPageSizeOptions)[number]"
      @update:search="bandsSearch = $event"
      @prev-page="prevBandPage"
      @next-page="nextBandPage"
      @sort-change="setBandsSort"
      @select="openBandDetails"
    />

    <AllActsView
      v-else-if="allActsOpen"
      :loading="allActsLoading"
      :error="allActsError"
      :page-size-options="actsPageSizeOptions"
      :page-size="actsPageSize"
      :current-page="actsPage"
      :total-pages="totalActsPages"
      :is-all-pages="isAllActsPages"
      :entries="paginatedActs"
      :sort-key="actsSortKey"
      :sort-dir="actsSortDir"
      :search="actsSearch"
      @close="closeAllActs"
      @update:pageSize="actsPageSize = $event as (typeof actsPageSizeOptions)[number]"
      @update:search="actsSearch = $event"
      @prev-page="prevActsPage"
      @next-page="nextActsPage"
      @sort-change="setActsSort"
      @select="openDetails"
    />

    <AllVenuesView
      v-else-if="allVenuesOpen"
      :loading="allVenuesLoading"
      :error="allVenuesError"
      :page-size-options="venuesPageSizeOptions"
      :page-size="venuesPageSize"
      :current-page="venuesPage"
      :total-pages="totalVenuesPages"
      :is-all-pages="isAllVenuesPages"
      :venues="paginatedVenues"
      :sort-key="venuesSortKey"
      :sort-dir="venuesSortDir"
      :search="venuesSearch"
      @close="closeAllVenues"
      @update:pageSize="venuesPageSize = $event as (typeof venuesPageSizeOptions)[number]"
      @update:search="venuesSearch = $event"
      @prev-page="prevVenuesPage"
      @next-page="nextVenuesPage"
      @sort-change="setVenuesSort"
      @select="openVenueDetails"
    />

    <AllParticipantsView
      v-else-if="allParticipantsOpen"
      :loading="allParticipantsLoading"
      :error="allParticipantsError"
      :participants="sortedParticipants"
      :sort-key="participantsSortKey"
      :sort-dir="participantsSortDir"
      :search="participantsSearch"
      @close="closeAllParticipants"
      @update:search="participantsSearch = $event"
      @select="openParticipantConcerts"
      @sort-change="setParticipantsSort"
    />

    <ConcertDetailsModal
      :open="detailsOpen"
      :details="selectedDetails"
      :error="detailsError"
      @close="closeDetails"
      @show-venue="openVenueDetailsFromEvent"
      @show-band="openBandDetails"
      @refresh-details="refreshSelectedDetails"
      @participant-added="handleParticipantAdded"
      @participant-removed="handleParticipantRemoved"
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

    <footer class="version-footer">
      Frontend v{{ frontendVersion }} · Backend v{{ backendVersion }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import StatsRow from "../components/StatsRow.vue";
import ConcertsTable from "../components/ConcertsTable.vue";
import ConcertDetailsModal from "../components/ConcertDetailsModal.vue";
import BandDetailsModal from "../components/BandDetailsModal.vue";
import VenueDetailsModal from "../components/VenueDetailsModal.vue";
import AddEventModal from "../components/AddEventModal.vue";
import AllConcertsView from "../components/dashboard/AllConcertsView.vue";
import AllBandsView from "../components/dashboard/AllBandsView.vue";
import AllActsView from "../components/dashboard/AllActsView.vue";
import AllVenuesView from "../components/dashboard/AllVenuesView.vue";
import AllParticipantsView from "../components/dashboard/AllParticipantsView.vue";
import {
  getAllConcerts,
  getBandSummaries,
  getConcertBands,
  getConcertBandById,
  getConcertDetails,
  getConcertVenueById,
  getConcertVenues,
  getConcertParticipants,
  getEventParticipants,
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
  EventParticipantDto,
  EventBandSummaryDto,
  ParticipantSummaryDto,
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
const concertsParticipantId = ref<number | null>(null);
const concertsParticipantName = ref<string | null>(null);
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
const eventParticipants = ref<EventParticipantDto[]>([]);
const allParticipants = ref<ParticipantSummaryDto[]>([]);
const allParticipantsOpen = ref(false);
const allParticipantsLoading = ref(false);
const allParticipantsError = ref<string | null>(null);
const participantsSearch = ref("");
const participantsSortKey = ref<"name" | "count">("name");
const participantsSortDir = ref<"asc" | "desc">("asc");

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
const settingsOpen = ref(false);
const frontendVersion = import.meta.env.VITE_FRONTEND_VERSION ?? "dev";
const backendVersion = import.meta.env.VITE_BACKEND_VERSION ?? "dev";
const anyModalOpen = computed(
  () =>
    detailsOpen.value ||
    bandDetailsOpen.value ||
    venueDetailsOpen.value ||
    createOpen.value ||
    updateOpen.value
);
const activeStatsView = computed<
  "concerts" | "bands" | "acts" | "venues" | "participants" | null
>(() => {
  if (allConcertsOpen.value) return "concerts";
  if (allBandsOpen.value) return "bands";
  if (allActsOpen.value) return "acts";
  if (allVenuesOpen.value) return "venues";
  if (allParticipantsOpen.value) return "participants";
  return null;
});

const todayKey = computed(() => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
});

const isPastOrToday = (dateValue?: string | null) => {
  if (!dateValue) return false;
  const key = dateValue.slice(0, 10);
  return key <= todayKey.value;
};

const pastConcerts = computed(() => {
  const source = allConcerts.value.length > 0 ? allConcerts.value : concerts.value;
  return source.filter((concert) => isPastOrToday(concert.date));
});

const upcomingConcerts = computed(() => {
  const source = allConcerts.value.length > 0 ? allConcerts.value : concerts.value;
  return source
    .filter((concert) => !isPastOrToday(concert.date))
    .sort((a, b) => a.date.localeCompare(b.date));
});


const pastConcertsTotal = computed(() => {
  if (!stats.value) return null;
  return pastConcerts.value.length;
});

const plannedEventsTotal = computed(() => {
  if (!stats.value) return null;
  const source = allConcerts.value.length > 0 ? allConcerts.value : concerts.value;
  return source.filter((concert) => !isPastOrToday(concert.date)).length;
});

const concertsThisYear = computed(() => {
  if (!stats.value) return null;
  const year = `${new Date().getFullYear()}-`;
  return pastConcerts.value.filter((concert) => concert.date?.startsWith(year)).length;
});

const pastActsTotal = computed(() => {
  if (!stats.value) return null;
  if (allActs.value.length === 0) return 0;
  return allActs.value.filter((act) => isPastOrToday(act.date)).length;
});

const actsThisYear = computed(() => {
  if (!stats.value) return null;
  if (allActs.value.length === 0) return 0;
  const year = `${new Date().getFullYear()}-`;
  return allActs.value.filter(
    (act) => isPastOrToday(act.date) && act.date?.startsWith(year)
  ).length;
});

const pastBandsTotal = computed(() => {
  if (!stats.value) return null;
  if (allBands.value.length === 0) return 0;
  return allBands.value.filter((band) => isPastOrToday(band.last_seen_date)).length;
});

const pastVenuesTotal = computed(() => {
  if (!stats.value) return null;
  if (allVenues.value.length === 0) return 0;
  return allVenues.value.filter((venue) =>
    isPastOrToday(venue.last_visited_date ?? "")
  ).length;
});

const ticketTotals = computed(() => {
  if (!stats.value) {
    return { total: null as number | null, thisYear: null as number | null };
  }
  if (pastConcerts.value.length === 0) {
    return { total: 0, thisYear: 0 };
  }
  const yearPrefix = `${new Date().getFullYear()}-`;
  let total = 0;
  let thisYear = 0;
  for (const concert of pastConcerts.value) {
    const price = Number(concert.ticketPrice ?? 0);
    if (Number.isFinite(price)) {
      total += price;
      if (concert.date?.startsWith(yearPrefix)) {
        thisYear += price;
      }
    }
  }
  return { total, thisYear };
});
async function loadAllConcerts() {
  allConcertsLoading.value = true;
  allConcertsError.value = null;

  try {
    allConcerts.value = await getAllConcerts();
    await syncParticipantCounts();
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
  allParticipantsOpen.value = false;
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
  allParticipantsOpen.value = false;
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
  allParticipantsOpen.value = false;
  if (allActs.value.length === 0) {
    await loadAllActs();
  }
}

function closeAllActs() {
  allActsOpen.value = false;
}

function closeAllViews() {
  allConcertsOpen.value = false;
  allBandsOpen.value = false;
  allActsOpen.value = false;
  allVenuesOpen.value = false;
  allParticipantsOpen.value = false;
}


function toggleSettings() {
  settingsOpen.value = !settingsOpen.value;
}

function closeSettings() {
  settingsOpen.value = false;
}

async function openAllVenues() {
  allVenuesOpen.value = true;
  allConcertsOpen.value = false;
  allBandsOpen.value = false;
  allActsOpen.value = false;
  allParticipantsOpen.value = false;
  if (allVenues.value.length === 0) {
    await loadAllVenues();
  }
}

async function loadAllParticipants() {
  allParticipantsLoading.value = true;
  allParticipantsError.value = null;

  try {
    const [participants, eventParticipants] = await Promise.all([
      getConcertParticipants(),
      getEventParticipants(),
    ]);
    const allConcertsData = await getAllConcerts();
    const concertById = new Map(
      allConcertsData.map((concert) => [
        concert.id,
        { date: concert.date, name: concert.name },
      ])
    );
    const counts = new Map<number, number>();
    const lastAttendByParticipant = new Map<
      number,
      { date: string; eventName?: string }
    >();
    for (const entry of eventParticipants) {
      counts.set(entry.participant_id, (counts.get(entry.participant_id) ?? 0) + 1);
      const concert = concertById.get(entry.event_id);
      if (concert?.date) {
        const existing = lastAttendByParticipant.get(entry.participant_id);
        if (!existing || concert.date > existing.date) {
          lastAttendByParticipant.set(entry.participant_id, {
            date: concert.date,
            eventName: concert.name,
          });
        }
      }
    }
    allParticipants.value = participants
      .map((participant) => ({
        id: participant.id,
        name: participant.name,
        eventCount: counts.get(participant.id) ?? 0,
        lastAttendDate: lastAttendByParticipant.get(participant.id)?.date ?? null,
        lastAttendEventName:
          lastAttendByParticipant.get(participant.id)?.eventName ?? null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (e: any) {
    allParticipantsError.value = e?.message ?? "Failed to load participants.";
  } finally {
    allParticipantsLoading.value = false;
  }
}

async function openAllParticipants() {
  allParticipantsOpen.value = true;
  allConcertsOpen.value = false;
  allBandsOpen.value = false;
  allActsOpen.value = false;
  allVenuesOpen.value = false;
  if (allParticipants.value.length === 0) {
    await loadAllParticipants();
  }
}

function closeAllParticipants() {
  allParticipantsOpen.value = false;
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
  const participantId = concertsParticipantId.value;
  const eventIdsForParticipant = participantId
    ? new Set(
        eventParticipants.value
          .filter((entry) => entry.participant_id === participantId)
          .map((entry) => entry.event_id)
      )
    : null;
  return allConcerts.value.filter((concert) => {
    if (eventIdsForParticipant && !eventIdsForParticipant.has(concert.id)) {
      return false;
    }
    if (!q) return true;
    return concert.name.toLowerCase().includes(q);
  });
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

const filteredParticipants = computed(() => {
  const q = participantsSearch.value.trim().toLowerCase();
  if (!q) {
    return allParticipants.value;
  }
  return allParticipants.value.filter((participant) =>
    participant.name.toLowerCase().includes(q)
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

const sortedParticipants = computed(() => {
  const dir = participantsSortDir.value === "asc" ? 1 : -1;
  return [...filteredParticipants.value].sort((a, b) => {
    let result = 0;
    switch (participantsSortKey.value) {
      case "name":
        result = a.name.localeCompare(b.name);
        break;
      case "count":
        result = a.eventCount - b.eventCount;
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

function setParticipantsSort(key: "name" | "count") {
  if (participantsSortKey.value === key) {
    participantsSortDir.value = participantsSortDir.value === "asc" ? "desc" : "asc";
    return;
  }
  participantsSortKey.value = key;
  participantsSortDir.value = key === "name" ? "asc" : "desc";
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
  const [statsResponse, concertsResponse, participants] = await Promise.all([
    getStats(),
    getLastConcerts(10),
    getConcertParticipants(),
  ]);
  stats.value = {
    ...statsResponse,
    participantsCount: participants.length,
  };
  concerts.value = concertsResponse;

  if (allConcerts.value.length === 0) {
    await loadAllConcerts();
  }
  if (allBands.value.length === 0) {
    await loadAllBands();
  }
  if (allActs.value.length === 0) {
    await loadAllActs();
  }
  if (allVenues.value.length === 0) {
    await loadAllVenues();
  }
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
  if (allParticipantsOpen.value || allParticipants.value.length > 0) {
    await loadAllParticipants();
  }
  await syncParticipantCounts();
}

async function syncParticipantCounts() {
  try {
    const eventParticipantsResponse = await getEventParticipants();
    eventParticipants.value = eventParticipantsResponse;
    const counts = new Map<number, number>();
    for (const entry of eventParticipantsResponse) {
      counts.set(entry.event_id, (counts.get(entry.event_id) ?? 0) + 1);
    }
    const applyCounts = (items: ConcertListItemDto[]) => {
      for (const concert of items) {
        concert.participantCount = counts.get(concert.id) ?? 0;
      }
    };
    applyCounts(concerts.value);
    applyCounts(allConcerts.value);
  } catch {
    // ignore participant count sync errors; core UI still works
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

watch(
  anyModalOpen,
  (open) => {
    document.body.classList.toggle("modal-open", open);
    if (open) {
      settingsOpen.value = false;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  document.body.classList.remove("modal-open");
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

async function refreshSelectedDetails() {
  if (!selectedDetails.value) return;
  detailsError.value = null;
  try {
    const details = await getConcertDetails(selectedDetails.value.id);
    if (!details.venueId || !details.venueName) {
      const fromList =
        allConcerts.value.find((concert) => concert.id === details.id) ??
        concerts.value.find((concert) => concert.id === details.id);
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

function handleParticipantAdded(payload: {
  eventId: number;
  participantId: number;
  participantName: string;
  isNew: boolean;
}) {
  const bump = (items: ConcertListItemDto[]) => {
    const entry = items.find((concert) => concert.id === payload.eventId);
    if (entry) {
      entry.participantCount = (entry.participantCount ?? 0) + 1;
    }
  };
  bump(concerts.value);
  bump(allConcerts.value);
  if (payload.isNew && stats.value) {
    stats.value.participantsCount = (stats.value.participantsCount ?? 0) + 1;
  }
  if (allParticipantsOpen.value) {
    const existing = allParticipants.value.find(
      (participant) => participant.id === payload.participantId
    );
    if (existing) {
      existing.eventCount += 1;
      const latestDate = selectedDetails.value?.date ?? null;
      if (latestDate && (!existing.lastAttendDate || latestDate > existing.lastAttendDate)) {
        existing.lastAttendDate = latestDate;
        existing.lastAttendEventName = selectedDetails.value?.name ?? null;
      }
    } else if (payload.isNew) {
      allParticipants.value.push({
        id: payload.participantId,
        name: payload.participantName,
        eventCount: 1,
        lastAttendDate: selectedDetails.value?.date ?? null,
        lastAttendEventName: selectedDetails.value?.name ?? null,
      });
    }
  }
}

async function handleParticipantRemoved(payload: { eventId: number; participantId: number }) {
  const drop = (items: ConcertListItemDto[]) => {
    const entry = items.find((concert) => concert.id === payload.eventId);
    if (entry) {
      entry.participantCount = Math.max(0, (entry.participantCount ?? 0) - 1);
    }
  };
  drop(concerts.value);
  drop(allConcerts.value);
  await syncParticipantCounts();
  if (allParticipantsOpen.value) {
    await loadAllParticipants();
  }
}

async function openParticipantConcerts(participant: ParticipantSummaryDto) {
  if (eventParticipants.value.length === 0) {
    await syncParticipantCounts();
  }
  concertsParticipantId.value = participant.id;
  concertsParticipantName.value = participant.name;
  concertsSearch.value = "";
  openAllConcerts();
}

function clearConcertsParticipantFilter() {
  concertsParticipantId.value = null;
  concertsParticipantName.value = null;
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
    allParticipants.value = [];
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

.title-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
}

.title-icon {
  width: 20px;
  height: 20px;
}

.title-link h1 {
  margin: 0;
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

.secondary {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
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

.dashboard-tables {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* removed dashboard upcoming filter */

.settings-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 20;
}

.settings-panel {
  width: min(320px, 100%);
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: fit-content;
  color: var(--text);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.settings-title {
  font-size: 14px;
  font-weight: 700;
}

.settings-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.close {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
}

.version-footer {
  margin-top: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .page {
    padding: 14px;
  }

  .header {
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions > * {
    width: 100%;
    justify-content: space-between;
  }

  .settings-panel {
    width: 100%;
  }

  .version-footer {
    justify-content: flex-start;
  }
}
</style>
