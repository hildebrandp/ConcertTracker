<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">{{ isUpdate ? "Update concert event" : "Add concert event" }}</div>
        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <form class="modal-body" @submit.prevent="save">
        <EventSection
          v-model:eventName="eventName"
          v-model:eventDatetime="eventDatetime"
          v-model:eventRating="eventRating"
          v-model:eventNotes="eventNotes"
          v-model:eventHoverRating="eventHoverRating"
        />

        <VenueSection
          v-model:useNewVenue="useNewVenue"
          v-model:venueQuery="venueQuery"
          v-model:venueHoverRating="venueHoverRating"
          :venue-matches="venueMatches"
          :selected-venue-name="selectedVenueName"
          :venue-form="venueForm"
          :venue-type-options="venueTypeOptions"
          @select-venue="selectVenue"
          @clear-selected-venue="clearSelectedVenue"
        />

        <div class="section">
          <div class="section-title">Bands</div>

          <div v-for="(band, index) in bandEntries" :key="band.localId" class="band-entry">
            <div class="band-header">
              <div class="field">
                <label>Band <span class="required">*</span></label>
                <div v-if="band.mode === 'existing'" class="inline-input">
                  <input
                    v-model.trim="band.query"
                    type="text"
                    placeholder="Search band..."
                    @input="clearSelectedBand(band)"
                  />
                  <button
                    v-if="band.query"
                    type="button"
                    class="clear-button"
                    @click="band.query = ''; clearSelectedBand(band)"
                    aria-label="Clear band search"
                  >
                    &times;
                  </button>
                </div>
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
import EventSection from "./event-modal/EventSection.vue";
import VenueSection from "./event-modal/VenueSection.vue";
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

<style scoped src="./event-modal/eventModal.css"></style>


