<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">{{ isUpdate ? "Update concert event" : "Add concert event" }}</div>
        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <form class="modal-body" @submit.prevent="save">
        <div class="section">
          <div class="section-title">Event</div>
          <div class="field">
            <label for="event-name">Name <span class="required">*</span></label>
            <input id="event-name" v-model.trim="eventName" type="text" required />
          </div>
          <div class="grid event-row">
            <div class="field">
              <label for="event-datetime">Date & time <span class="required">*</span></label>
              <input
                id="event-datetime"
                v-model="eventDatetime"
                type="datetime-local"
                required
              />
            </div>
            <div class="field">
              <label for="event-rating">Rating</label>
              <div
                class="star-rating"
                role="radiogroup"
                aria-label="Event rating"
                @mouseleave="eventHoverRating = null"
              >
                <span v-for="star in 5" :key="star" class="star">
                  <span class="star-icon" :style="{ '--fill': `${eventStarFill(star)}%` }">
                    &#9733;
                  </span>
                  <button
                    type="button"
                    class="half left"
                    :aria-label="`Set rating to ${star * 2 - 1}`"
                    @click="setEventRating(star * 2 - 1)"
                    @mouseenter="setEventHover(star * 2 - 1)"
                  ></button>
                  <button
                    type="button"
                    class="half right"
                    :aria-label="`Set rating to ${star * 2}`"
                    @click="setEventRating(star * 2)"
                    @mouseenter="setEventHover(star * 2)"
                  ></button>
                </span>
                <button type="button" class="star-clear" @click="setEventRating(0)">
                  Clear
                </button>
              </div>
              <div class="rating-hint">0-10 (half stars)</div>
            </div>
          </div>
          <div class="field">
            <label for="event-notes">Notes</label>
            <textarea
              id="event-notes"
              v-model.trim="eventNotes"
              rows="2"
              class="event-notes"
            />
          </div>
        </div>

        <div class="section">
          <div class="section-title">Venue</div>
          <div class="field">
            <label for="venue-search">
              Search venue <span v-if="!useNewVenue" class="required">*</span>
            </label>
            <input
              id="venue-search"
              v-model.trim="venueQuery"
              type="text"
              placeholder="Start typing a venue name..."
              :disabled="useNewVenue"
              @input="clearSelectedVenue"
            />
            <div v-if="!useNewVenue && venueMatches.length" class="suggestions">
              <button
                v-for="venue in venueMatches"
                :key="venue.id"
                type="button"
                class="suggestion"
                @click="selectVenue(venue)"
              >
                {{ venue.name }}
              </button>
            </div>
            <div v-if="selectedVenueName && !useNewVenue" class="selected">
              Selected: {{ selectedVenueName }}
            </div>
          </div>

          <label class="checkbox">
            <input v-model="useNewVenue" type="checkbox" />
            Create new venue
          </label>

          <div v-if="useNewVenue" class="venue-grid">
            <div class="grid venue-row">
              <div class="field">
                <label for="venue-name">Name <span class="required">*</span></label>
                <input id="venue-name" v-model.trim="venueForm.name" type="text" required />
              </div>
              <div class="field">
                <label for="venue-rating">Rating</label>
                <div
                  class="star-rating"
                  role="radiogroup"
                  aria-label="Venue rating"
                  @mouseleave="venueHoverRating = null"
                >
                  <span v-for="star in 5" :key="star" class="star">
                    <span class="star-icon" :style="{ '--fill': `${venueStarFill(star)}%` }">
                    &#9733;
                  </span>
                    <button
                      type="button"
                      class="half left"
                      :aria-label="`Set rating to ${star * 2 - 1}`"
                      @click="setVenueRating(star * 2 - 1)"
                      @mouseenter="setVenueHover(star * 2 - 1)"
                    ></button>
                    <button
                      type="button"
                      class="half right"
                      :aria-label="`Set rating to ${star * 2}`"
                      @click="setVenueRating(star * 2)"
                      @mouseenter="setVenueHover(star * 2)"
                    ></button>
                  </span>
                  <button type="button" class="star-clear" @click="setVenueRating(0)">
                    Clear
                  </button>
                </div>
                <div class="rating-hint">0-10 (half stars)</div>
              </div>
            </div>

            <div class="grid venue-row">
              <div class="field">
                <label for="venue-type">Type</label>
                <select id="venue-type" v-model="venueForm.type">
                  <option value="">Select...</option>
                  <option v-for="type in venueTypeOptions" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
              <div class="field">
                <label for="venue-indoor">Indoor/Outdoor</label>
                <select id="venue-indoor" v-model="venueForm.indoor_outdoor">
                  <option value="">Select...</option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div class="field">
                <label for="venue-capacity">Capacity</label>
                <input id="venue-capacity" v-model.trim="venueForm.capacity" type="text" />
              </div>
            </div>

            <div class="grid venue-row">
              <div class="field full-row">
                <label for="venue-website">Website</label>
                <input id="venue-website" v-model.trim="venueForm.website" type="text" />
              </div>
            </div>

            <div class="venue-section">
              <div class="venue-section-title">Venue Address</div>
              <div class="grid venue-address">
                <div class="field">
                  <label for="venue-address">Address</label>
                  <input id="venue-address" v-model.trim="venueForm.address" type="text" />
                </div>
                <div class="field">
                  <label for="venue-postal">Postal code</label>
                  <input id="venue-postal" v-model.trim="venueForm.postal_code" type="text" />
                </div>
                <div class="field">
                  <label for="venue-city">City</label>
                  <input id="venue-city" v-model.trim="venueForm.city" type="text" />
                </div>
                <div class="field">
                  <label for="venue-country">Country</label>
                  <input id="venue-country" v-model.trim="venueForm.country" type="text" />
                </div>
                <div class="field">
                  <label for="venue-state">State</label>
                  <input id="venue-state" v-model.trim="venueForm.state" type="text" />
                </div>
              </div>
              <div class="grid venue-row">
                <div class="field">
                  <label for="venue-latitude">Latitude</label>
                  <input id="venue-latitude" v-model.trim="venueForm.latitude" type="text" />
                </div>
                <div class="field">
                  <label for="venue-longitude">Longitude</label>
                  <input id="venue-longitude" v-model.trim="venueForm.longitude" type="text" />
                </div>
              </div>
            </div>

            <div class="grid venue-row">
              <div class="field full-row">
                <label for="venue-notes">Notes</label>
                <textarea
                  id="venue-notes"
                  v-model.trim="venueForm.notes"
                  rows="2"
                  class="venue-notes"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Bands</div>

          <div v-for="(band, index) in bandEntries" :key="band.localId" class="band-entry">
            <div class="band-header">
              <div class="field">
                <label>Band <span class="required">*</span></label>
                <input
                  v-if="band.mode === 'existing'"
                  v-model.trim="band.query"
                  type="text"
                  placeholder="Search band..."
                  @input="clearSelectedBand(band)"
                />
                <input
                  v-else
                  v-model.trim="band.newBand.name"
                  type="text"
                  placeholder="Band name"
                  class="band-name-input"
                  required
                />
              </div>
              <label class="band-flag">
                <input v-model="band.mainAct" type="checkbox" />
                Main act
              </label>
              <div class="band-actions">
                <button
                  type="button"
                  class="ghost"
                  :disabled="index === 0"
                  @click="moveBandUp(index)"
                >
                  Move up
                </button>
                <button
                  type="button"
                  class="ghost"
                  :disabled="index === bandEntries.length - 1"
                  @click="moveBandDown(index)"
                >
                  Move down
                </button>
                <button type="button" class="secondary" @click="toggleBandMode(band)">
                  {{ band.mode === "existing" ? "New band" : "Use existing" }}
                </button>
                <button
                  v-if="bandEntries.length > 1"
                  type="button"
                  class="ghost"
                  @click="removeBand(index)"
                >
                  Remove
                </button>
              </div>
            </div>

            <div v-if="band.mode === 'existing' && bandMatches(band).length" class="suggestions">
              <button
                v-for="match in bandMatches(band)"
                :key="match.id"
                type="button"
                class="suggestion"
                @click="selectBand(band, match)"
              >
                {{ match.name }}
              </button>
            </div>
            <div v-if="band.mode === 'existing' && band.selectedBandName" class="selected">
              Selected: {{ band.selectedBandName }}
            </div>

            <div class="field band-rating">
              <label>Performance rating</label>
              <div
                class="star-rating"
                role="radiogroup"
                aria-label="Event band rating"
                @mouseleave="clearBandHover(band)"
              >
                <span v-for="star in 5" :key="star" class="star">
                  <span class="star-icon" :style="{ '--fill': `${bandStarFill(band, star)}%` }">
                    &#9733;
                  </span>
                  <button
                    type="button"
                    class="half left"
                    :aria-label="`Set rating to ${star * 2 - 1}`"
                    @click="setBandRating(band, star * 2 - 1)"
                    @mouseenter="setBandHover(band, star * 2 - 1)"
                  ></button>
                  <button
                    type="button"
                    class="half right"
                    :aria-label="`Set rating to ${star * 2}`"
                    @click="setBandRating(band, star * 2)"
                    @mouseenter="setBandHover(band, star * 2)"
                  ></button>
                </span>
                <button type="button" class="star-clear" @click="setBandRating(band, 0)">
                  Clear
                </button>
              </div>
              <div class="rating-hint">0-10 (half stars)</div>
            </div>

            <div v-if="band.mode === 'new'" class="grid">
              <div class="field">
                <label>Genre</label>
                <input
                  v-model.trim="band.newBand.genre"
                  type="text"
                  class="band-input"
                  list="band-genre-options"
                />
              </div>
              <div class="field">
                <label>Origin country</label>
                <input
                  v-model.trim="band.newBand.origin_country"
                  type="text"
                  class="band-input"
                  list="band-origin-options"
                />
              </div>
              <div class="grid band-row full-row">
                <div class="field">
                  <label>Plex Link</label>
                  <input v-model.trim="band.newBand.link" type="text" class="band-input" />
                </div>
                <div class="field">
                  <label>Website</label>
                  <input v-model.trim="band.newBand.website" type="text" class="band-input" />
                </div>
              </div>
              <div class="field full-row">
                <label>Notes</label>
                <textarea
                  v-model.trim="band.newBand.notes"
                  rows="2"
                  class="band-textarea band-notes"
                />
              </div>
            </div>
          </div>

          <button type="button" class="secondary" @click="addBand">
            Add another band
          </button>
        </div>

        <div v-if="loadError" class="error">
          {{ loadError }}
        </div>
        <div v-if="loadEventError" class="error">
          {{ loadEventError }}
        </div>
        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div class="modal-footer">
          <button type="button" class="ghost" @click="$emit('close')">Cancel</button>
          <button type="submit" class="primary" :disabled="saving">
            {{ saving ? "Saving..." : isUpdate ? "Update event" : "Create event" }}
          </button>
        </div>

        <datalist id="band-genre-options">
          <option v-for="genre in bandGenreOptions" :key="genre" :value="genre" />
        </datalist>
        <datalist id="band-origin-options">
          <option v-for="origin in bandOriginOptions" :key="origin" :value="origin" />
        </datalist>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type {
  ConcertBandDto,
  ConcertVenueDto,
  CreateConcertEventBundleDto,
  CreateConcertVenueDto,
} from "../api/types";
import {
  createConcertEventWithBands,
  getConcertEventById,
  getConcertBands,
  getConcertVenues,
  getEventBandsByEventIdDetails,
  updateConcertEventWithBands,
} from "../api/concertsApi";

const props = defineProps<{
  open: boolean;
  mode?: "create" | "update";
  eventId?: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created"): void;
  (e: "updated"): void;
}>();

const venues = ref<ConcertVenueDto[]>([]);
const bands = ref<ConcertBandDto[]>([]);
const loaded = ref(false);
const loading = ref(false);
const loadError = ref<string | null>(null);
const loadEventError = ref<string | null>(null);
const isUpdate = computed(() => props.mode === "update");

const eventName = ref("");
const eventDatetime = ref(defaultEventDatetime());
const eventRating = ref("");
const eventNotes = ref("");
const eventHoverRating = ref<number | null>(null);
const venueHoverRating = ref<number | null>(null);
const bandHoverRatings = ref<Record<number, number | null>>({});

const venueQuery = ref("");
const selectedVenueId = ref<number | null>(null);
const selectedVenueName = ref("");
const useNewVenue = ref(false);

const venueForm = ref({
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  type: "",
  indoor_outdoor: "",
  capacity: "",
  website: "",
  notes: "",
  latitude: "",
  longitude: "",
  rating: "",
});

const venueTypeOptions = [
  "Arena",
  "Theater",
  "Club",
  "Concert Hall",
  "Auditorium",
  "Studio",
  "Stadium",
  "Amphitheater",
  "Park",
  "Plaza",
  "Beach",
  "Festival Grounds",
  "Fairgrounds",
  "Camping Site",
  "Church or Cathedral",
  "Cultural Center",
  "Rooftop",
  "Barn",
  "Cruise Ship",
  "Museum or Gallery",
  "Warehouse",
  "Castle or Fortress",
  "Desert",
  "Underground Cave",
  "Airfield",
];

type BandEntry = {
  localId: number;
  mode: "existing" | "new";
  query: string;
  selectedBandId: number | null;
  selectedBandName: string;
  mainAct: boolean;
  eventRating: string;
  newBand: {
    name: string;
    genre: string;
    origin_country: string;
    notes: string;
    link: string;
    website: string;
  };
};

let bandCounter = 0;

const bandEntries = ref<BandEntry[]>([createBandEntry()]);

const saving = ref(false);
const error = ref<string | null>(null);

const venueMatches = computed(() => {
  const q = venueQuery.value.trim().toLowerCase();
  if (!q) return [];
  return venues.value
    .filter((venue) => venue.name.toLowerCase().includes(q))
    .slice(0, 6);
});

const bandGenreOptions = computed(() => {
  const unique = new Map<string, string>();
  for (const band of bands.value) {
    const raw = toText((band as any).genre).trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, raw);
    }
  }
  return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
});

const bandOriginOptions = computed(() => {
  const unique = new Map<string, string>();
  for (const band of bands.value) {
    const raw = toText((band as any).origin_country).trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, raw);
    }
  }
  return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
});

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) {
      return;
    }

    resetForm();
    await ensureLookups();
    if (isUpdate.value && props.eventId) {
      await loadEventForEdit(props.eventId);
    }
  }
);

async function ensureLookups() {
  if (loaded.value || loading.value) {
    return;
  }

  loading.value = true;
  loadError.value = null;

  try {
    const [venueList, bandList] = await Promise.all([
      getConcertVenues(),
      getConcertBands(),
    ]);
    venues.value = venueList;
    bands.value = bandList;
    loaded.value = true;
  } catch (e: any) {
    loadError.value = e?.message ?? "Failed to load venues and bands.";
  } finally {
    loading.value = false;
  }
}

async function loadEventForEdit(eventId: number) {
  loadEventError.value = null;

  try {
    const [event, eventBands] = await Promise.all([
      getConcertEventById(eventId),
      getEventBandsByEventIdDetails(eventId),
    ]);

    eventName.value = event.name ?? "";
    const rawDatetime = (event as any).datetime ?? (event as any).date ?? "";
    eventDatetime.value = fromSqlDatetime(rawDatetime);
    eventRating.value = event.rating !== null && event.rating !== undefined
      ? String(event.rating)
      : "";
    eventNotes.value = event.notes ?? "";

    selectedVenueId.value = event.venue_id ?? null;
    const existingVenue = venues.value.find((venue) => venue.id === event.venue_id);
    selectedVenueName.value = existingVenue?.name ?? "";
    venueQuery.value = existingVenue?.name ?? "";

    useNewVenue.value = false;

    const sortedBands = [...eventBands].sort((a, b) => {
      const orderA = a.runningOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.runningOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA === orderB) {
        return a.band_name.localeCompare(b.band_name);
      }
      return orderA - orderB;
    });

    if (sortedBands.length > 0) {
      bandEntries.value = sortedBands.map((band) => {
        const entry = createBandEntry();
        entry.mode = "existing";
        entry.query = band.band_name ?? "";
        entry.selectedBandId = band.band_id ?? null;
        entry.selectedBandName = band.band_name ?? "";
        entry.mainAct = Boolean(band.mainAct);
        entry.eventRating = band.rating !== null && band.rating !== undefined
          ? String(band.rating)
          : "";
        return entry;
      });
    }
  } catch (e: any) {
    loadEventError.value = e?.message ?? "Failed to load event details.";
  }
}

function defaultEventDatetime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T19:00`;
}

function resetForm() {
  eventName.value = "";
  eventDatetime.value = defaultEventDatetime();
  eventRating.value = "";
  eventNotes.value = "";
  venueQuery.value = "";
  selectedVenueId.value = null;
  selectedVenueName.value = "";
  useNewVenue.value = false;
  venueForm.value = {
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    type: "",
    indoor_outdoor: "",
    capacity: "",
    website: "",
    notes: "",
    latitude: "",
    longitude: "",
    rating: "",
  };
  bandEntries.value = [createBandEntry()];
  error.value = null;
  loadEventError.value = null;
}

function createBandEntry(): BandEntry {
  bandCounter += 1;
  return {
    localId: bandCounter,
    mode: "existing",
    query: "",
    selectedBandId: null,
    selectedBandName: "",
    mainAct: false,
    eventRating: "",
    newBand: {
      name: "",
      genre: "",
      origin_country: "",
      notes: "",
      link: "",
      website: "",
    },
  };
}

function addBand() {
  bandEntries.value.push(createBandEntry());
}

function removeBand(index: number) {
  bandEntries.value.splice(index, 1);
}

function moveBandUp(index: number) {
  if (index <= 0) return;
  const entries = bandEntries.value;
  [entries[index - 1], entries[index]] = [entries[index], entries[index - 1]];
}

function moveBandDown(index: number) {
  const entries = bandEntries.value;
  if (index < 0 || index >= entries.length - 1) return;
  [entries[index], entries[index + 1]] = [entries[index + 1], entries[index]];
}

function toggleBandMode(entry: BandEntry) {
  const nextMode = entry.mode === "existing" ? "new" : "existing";
  const preservedName = entry.mode === "existing" ? entry.query.trim() : "";
  entry.mode = nextMode;
  entry.selectedBandId = null;
  entry.selectedBandName = "";
  entry.query = "";
  entry.newBand = {
    name: preservedName,
    genre: "",
    origin_country: "",
    notes: "",
    link: "",
    website: "",
  };
}

function bandMatches(entry: BandEntry) {
  const q = entry.query.trim().toLowerCase();
  if (!q) return [];
  return bands.value
    .filter((band) => band.name.toLowerCase().includes(q))
    .slice(0, 6);
}

function selectBand(entry: BandEntry, band: ConcertBandDto) {
  entry.selectedBandId = band.id;
  entry.selectedBandName = band.name;
  entry.query = band.name;
}

function clearSelectedBand(entry: BandEntry) {
  entry.selectedBandId = null;
  entry.selectedBandName = "";
}

function selectVenue(venue: ConcertVenueDto) {
  selectedVenueId.value = venue.id;
  selectedVenueName.value = venue.name;
  venueQuery.value = venue.name;
}

function clearSelectedVenue() {
  selectedVenueId.value = null;
  selectedVenueName.value = "";
}

function toSqlDatetime(value: string) {
  if (!value) return value;
  const [date, time] = value.split("T");
  if (!time) return value;
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date} ${normalizedTime}`;
}

function fromSqlDatetime(value: string) {
  const raw = toText(value).trim();
  if (!raw) return "";
  if (raw.includes("T")) {
    return raw.slice(0, 16);
  }
  const [date, time] = raw.split(" ");
  if (!time) return raw;
  return `${date}T${time.slice(0, 5)}`;
}

function toText(value: unknown) {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : String(value);
}

function normalizeName(value: unknown) {
  return toText(value).trim().toLowerCase();
}

function valueOrEmptyString(value: unknown) {
  const trimmed = toText(value).trim();
  return trimmed === "" ? "" : trimmed;
}

function valueOrUndefined(value: unknown) {
  const trimmed = toText(value).trim();
  return trimmed === "" ? undefined : trimmed;
}

function numberOrZero(value: unknown) {
  const trimmed = toText(value).trim();
  if (trimmed === "") return 0;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : 0;
}

function numberOrUndefined(value: unknown) {
  const trimmed = toText(value).trim();
  if (trimmed === "") return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

const eventRatingValue = computed(() => {
  const base = eventHoverRating.value ?? Number(eventRating.value);
  if (!Number.isFinite(base)) {
    return 0;
  }
  return Math.max(0, Math.min(10, base));
});

const venueRatingValue = computed(() => {
  const base = venueHoverRating.value ?? Number(venueForm.value.rating);
  if (!Number.isFinite(base)) {
    return 0;
  }
  return Math.max(0, Math.min(10, base));
});

function setEventRating(value: number) {
  if (value <= 0) {
    eventRating.value = "";
    return;
  }
  eventRating.value = String(value);
}

function setEventHover(value: number) {
  eventHoverRating.value = value;
}

function eventStarFill(starIndex: number) {
  const value = eventRatingValue.value;
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}

function setVenueRating(value: number) {
  if (value <= 0) {
    venueForm.value.rating = "";
    return;
  }
  venueForm.value.rating = String(value);
}

function setVenueHover(value: number) {
  venueHoverRating.value = value;
}

function venueStarFill(starIndex: number) {
  const value = venueRatingValue.value;
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}

function setBandRating(entry: BandEntry, value: number) {
  if (value <= 0) {
    entry.eventRating = "";
    return;
  }
  entry.eventRating = String(value);
}

function setBandHover(entry: BandEntry, value: number) {
  bandHoverRatings.value[entry.localId] = value;
}

function clearBandHover(entry: BandEntry) {
  bandHoverRatings.value[entry.localId] = null;
}

function bandStarFill(entry: BandEntry, starIndex: number) {
  const hoverValue = bandHoverRatings.value[entry.localId];
  const base = hoverValue ?? Number(entry.eventRating);
  if (!Number.isFinite(base)) {
    return 0;
  }
  const value = Math.max(0, Math.min(10, base));
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}

function validateForm() {
  if (!eventName.value.trim()) {
    return "Event name is required.";
  }
  if (!eventDatetime.value) {
    return "Event date and time is required.";
  }
  if (useNewVenue.value) {
    if (!venueForm.value.name.trim()) {
      return "Venue name is required.";
    }
  } else if (!selectedVenueId.value) {
    return "Please select an existing venue or create a new one.";
  }

  const validBands = bandEntries.value.filter((entry) => {
    if (entry.mode === "existing") {
      return !!entry.selectedBandId;
    }
    return !!entry.newBand.name.trim();
  });

  if (validBands.length === 0) {
    return "At least one band is required.";
  }

  return null;
}

async function save() {
  const validationError = validateForm();
  if (validationError) {
    error.value = validationError;
    return;
  }

  error.value = null;
  saving.value = true;

  try {
    if (useNewVenue.value && venueForm.value.name.trim()) {
      const match = venues.value.find(
        (venue) => normalizeName(venue.name) === normalizeName(venueForm.value.name)
      );
      if (match) {
        useNewVenue.value = false;
        selectedVenueId.value = match.id;
        selectedVenueName.value = match.name;
        venueQuery.value = match.name;
      }
    }

    const venuePayload: CreateConcertVenueDto | null = useNewVenue.value
      ? {
          name: venueForm.value.name.trim(),
          address: valueOrUndefined(venueForm.value.address),
          city: valueOrUndefined(venueForm.value.city),
          state: valueOrUndefined(venueForm.value.state),
          country: valueOrUndefined(venueForm.value.country),
          postal_code: numberOrZero(venueForm.value.postal_code),
          type: valueOrUndefined(venueForm.value.type),
          indoor_outdoor: valueOrUndefined(venueForm.value.indoor_outdoor) as
            | "indoor"
            | "outdoor"
            | "mixed"
            | undefined,
          capacity: numberOrZero(venueForm.value.capacity),
          website: valueOrUndefined(venueForm.value.website),
          notes: valueOrUndefined(venueForm.value.notes),
          latitude: valueOrUndefined(venueForm.value.latitude),
          longitude: valueOrUndefined(venueForm.value.longitude),
          rating: numberOrZero(venueForm.value.rating),
        }
      : null;

    const bandsPayload: Array<{
      bandId?: number;
      band?: {
        name: string;
        genre?: string;
        origin_country?: string;
        notes?: string;
        link?: string;
        website?: string;
      };
      mainAct: boolean;
      runningOrder: number;
      rating?: number;
    }> = [];

    let runningOrder = 1;
    for (const entry of bandEntries.value) {
      if (entry.mode === "existing") {
        if (entry.selectedBandId) {
          bandsPayload.push({
            bandId: entry.selectedBandId,
            mainAct: entry.mainAct,
            runningOrder,
            rating: numberOrUndefined(entry.eventRating),
          });
          runningOrder += 1;
        }
      } else if (entry.newBand.name.trim()) {
        const existingBand = bands.value.find(
          (band) => normalizeName(band.name) === normalizeName(entry.newBand.name)
        );
        if (existingBand) {
          entry.mode = "existing";
          entry.selectedBandId = existingBand.id;
          entry.selectedBandName = existingBand.name;
          entry.query = existingBand.name;
          bandsPayload.push({
            bandId: existingBand.id,
            mainAct: entry.mainAct,
            runningOrder,
            rating: numberOrUndefined(entry.eventRating),
          });
          runningOrder += 1;
          continue;
        }
        const bandPayload = {
          name: entry.newBand.name.trim(),
          genre: valueOrUndefined(entry.newBand.genre),
          origin_country: valueOrUndefined(entry.newBand.origin_country),
          notes: valueOrUndefined(entry.newBand.notes),
          link: valueOrUndefined(entry.newBand.link),
          website: valueOrUndefined(entry.newBand.website),
        };
        bandsPayload.push({
          band: Object.fromEntries(
            Object.entries(bandPayload).filter(([, value]) => value !== undefined)
          ) as typeof bandPayload,
          mainAct: entry.mainAct,
          runningOrder,
          rating: numberOrUndefined(entry.eventRating),
        });
        runningOrder += 1;
      }
    }

    let payload: CreateConcertEventBundleDto;
    const eventPayload = {
      name: eventName.value.trim(),
      datetime: toSqlDatetime(eventDatetime.value),
      rating: numberOrZero(eventRating.value),
      notes: valueOrEmptyString(eventNotes.value),
    };

    if (useNewVenue.value && venuePayload) {
      payload = {
        event: eventPayload,
        bands: bandsPayload,
        venue: venuePayload,
      };
    } else {
      payload = {
        event: eventPayload,
        bands: bandsPayload,
        venueId: selectedVenueId.value ?? undefined,
      };
    }

    if (isUpdate.value) {
      if (!props.eventId) {
        throw new Error("Missing event id.");
      }

      await updateConcertEventWithBands(props.eventId, payload);
      emit("updated");
    } else {
      await createConcertEventWithBands(payload);
      emit("created");
    }

    loaded.value = false;
    emit("close");
  } catch (e: any) {
    error.value = e?.message ?? "Failed to save event.";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
}

.modal {
  width: min(900px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 16px;
  font-weight: 700;
}

.close {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
}

.section {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-weight: 700;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field input,
.field textarea,
.field select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 14px;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.star {
  position: relative;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  position: relative;
  font-size: 30px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.2);
}

.star-icon::after {
  content: "\2605";
  position: absolute;
  inset: 0;
  width: var(--fill, 0%);
  overflow: hidden;
  color: #f5a623;
}

.half {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
}

.half.left {
  left: 0;
}

.half.right {
  right: 0;
}

.star-clear {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 999px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.rating-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
}

.event-notes {
  resize: vertical;
  min-height: 48px;
}

.venue-notes,
.band-notes {
  resize: vertical;
  min-height: 48px;
}

.required {
  color: #c62828;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.event-row {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.full-row {
  grid-column: 1 / -1;
}

.venue-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.venue-row {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.venue-section {
  border: 1px dashed rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.venue-section-title {
  font-weight: 600;
  font-size: 13px;
}

.venue-address {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.suggestion {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
}

.selected {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.band-entry {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.band-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  justify-content: space-between;
}

.band-header .field {
  flex: 1;
  min-width: 320px;
}

.band-name-input {
  width: 100%;
}

.band-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.band-flag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.band-input {
  padding: 16px 10px;
}

.band-textarea {
  padding: 16px 10px;
  min-height: 72px;
}

.band-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.primary {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.secondary,
.ghost {
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
}

@media (max-width: 720px) {
  .modal {
    width: 100%;
  }

  .modal-footer {
    flex-direction: column;
  }

  .primary,
  .secondary,
  .ghost {
    width: 100%;
  }
}
</style>
