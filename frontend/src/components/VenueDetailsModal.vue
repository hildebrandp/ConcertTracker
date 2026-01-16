<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">
          <div class="name">{{ venue?.name ?? "Venue details" }}</div>
        </div>
        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <div class="modal-body">
        <div v-if="!venue" class="muted">Loading...</div>
        <div v-else>
          <div v-if="!isEditing" class="details">
            <div class="detail">
              <div class="detail-label">Name</div>
              <div class="detail-value">{{ venue.name || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Rating</div>
              <div class="detail-value rating-display">
                <span>{{ venue.rating ?? "-" }}</span>
                <div class="star-readonly" v-if="venue.rating !== null && venue.rating !== undefined">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star-icon"
                    :style="{ '--fill': `${starFillValue(star, venue.rating)}%` }"
                  >
                    &#9733;
                  </span>
                </div>
              </div>
            </div>
            <div class="detail">
              <div class="detail-label">Type</div>
              <div class="detail-value">{{ venue.type || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Indoor / Outdoor</div>
              <div class="detail-value">{{ venue.indoor_outdoor || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Capacity</div>
              <div class="detail-value">{{ venue.capacity ?? "-" }}</div>
            </div>
            
            <div class="detail full">
              <div class="detail-label">Website</div>
              <div class="detail-value">
                <a
                  v-if="venue.website"
                  :href="normalizeUrl(venue.website)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ venue.website }}
                </a>
                <span v-else>-</span>
              </div>
            </div>
            <div class="detail full">
              <div class="detail-label">Address</div>
              <div class="detail-value">{{ venue.address || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">City</div>
              <div class="detail-value">{{ venue.city || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Postal code</div>
              <div class="detail-value">{{ venue.postal_code ?? "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">State</div>
              <div class="detail-value">{{ venue.state || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Country</div>
              <div class="detail-value">{{ venue.country || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Latitude</div>
              <div class="detail-value">{{ venue.latitude || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Longitude</div>
              <div class="detail-value">{{ venue.longitude || "-" }}</div>
            </div>
            <div class="detail full">
              <div class="detail-label">Notes</div>
              <div class="detail-value">{{ venue.notes || "-" }}</div>
            </div>
          </div>

          <form v-else class="grid" @submit.prevent="submit">
            <div class="field">
              <label for="venue-name">Name</label>
              <input id="venue-name" v-model.trim="form.name" type="text" required />
            </div>
            <div class="field">
              <label for="venue-rating">Rating</label>
              <div
                class="star-rating"
                role="radiogroup"
                aria-label="Venue rating"
                @mouseleave="hoverRating = null"
              >
                <span v-for="star in 5" :key="star" class="star">
                  <span class="star-icon" :style="{ '--fill': `${starFill(star)}%` }">
                    &#9733;
                  </span>
                  <button
                    type="button"
                    class="half left"
                    :aria-label="`Set rating to ${star * 2 - 1}`"
                    @click="setRating(star * 2 - 1)"
                    @mouseenter="setHover(star * 2 - 1)"
                  ></button>
                  <button
                    type="button"
                    class="half right"
                    :aria-label="`Set rating to ${star * 2}`"
                    @click="setRating(star * 2)"
                    @mouseenter="setHover(star * 2)"
                  ></button>
                </span>
                <button type="button" class="star-clear" @click="setRating(0)">
                  Clear
                </button>
              </div>
              <div class="rating-hint">0-10 (half stars)</div>
            </div>
            <div class="field">
              <label for="venue-type">Type</label>
              <select id="venue-type" v-model="form.type">
                <option value="">-</option>
                <option v-for="type in venueTypeOptions" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
            <div class="field">
              <label for="venue-indoor">Indoor / Outdoor</label>
              <select id="venue-indoor" v-model="form.indoor_outdoor">
                <option value="">-</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div class="field">
              <label for="venue-capacity">Capacity</label>
              <input id="venue-capacity" v-model.trim="form.capacity" type="number" min="0" />
            </div>
            <div class="field full">
              <label for="venue-website">Website</label>
              <input id="venue-website" v-model.trim="form.website" type="text" />
            </div>
            <div class="field full">
              <label for="venue-address">Address</label>
              <input id="venue-address" v-model.trim="form.address" type="text" />
            </div>
            <div class="field">
              <label for="venue-city">City</label>
              <input id="venue-city" v-model.trim="form.city" type="text" />
            </div>
            <div class="field">
              <label for="venue-postal">Postal code</label>
              <input
                id="venue-postal"
                v-model.trim="form.postal_code"
                type="number"
                min="0"
                class="no-spinner"
              />
            </div>
            <div class="field">
              <label for="venue-state">State</label>
              <input id="venue-state" v-model.trim="form.state" type="text" />
            </div>
            <div class="field">
              <label for="venue-country">Country</label>
              <input id="venue-country" v-model.trim="form.country" type="text" />
            </div>
            <div class="field">
              <label for="venue-lat">Latitude</label>
              <input id="venue-lat" v-model.trim="form.latitude" type="text" />
            </div>
            <div class="field">
              <label for="venue-lng">Longitude</label>
              <input id="venue-lng" v-model.trim="form.longitude" type="text" />
            </div>
            <div class="field full">
              <label for="venue-notes">Notes</label>
              <textarea id="venue-notes" v-model.trim="form.notes" rows="3" class="notes-field" />
            </div>
          </form>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div class="modal-footer">
          <button
            v-if="!isEditing"
            type="button"
            class="danger"
            :disabled="!venue"
            @click="$emit('delete-venue')"
          >
            Delete venue
          </button>
          <button
            v-if="!isEditing"
            type="button"
            class="primary"
            :disabled="!venue"
            @click="isEditing = true"
          >
            Update venue
          </button>
          <template v-else>
            <button type="button" class="ghost" @click="isEditing = false">
              Cancel
            </button>
            <button type="button" class="primary" :disabled="saving || !form.name.trim()" @click="submit">
              {{ saving ? "Saving..." : "Save changes" }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { ConcertVenueDetailsDto, CreateConcertVenueDto } from "../api/types";

const props = defineProps<{
  open: boolean;
  venue: ConcertVenueDetailsDto | null;
  error: string | null;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", payload: CreateConcertVenueDto): void;
  (e: "delete-venue"): void;
}>();

const form = reactive({
  name: "",
  type: "",
  indoor_outdoor: "",
  capacity: "",
  rating: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  latitude: "",
  longitude: "",
  notes: "",
});

const isEditing = ref(false);
const hoverRating = ref<number | null>(null);

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

const ratingValue = computed(() => {
  const base = hoverRating.value ?? Number(form.rating);
  if (!Number.isFinite(base)) {
    return 0;
  }
  return Math.max(0, Math.min(10, base));
});

watch(
  () => [props.open, props.venue],
  () => {
    if (!props.open || !props.venue) {
      return;
    }

    isEditing.value = false;
    form.name = props.venue.name ?? "";
    form.type = props.venue.type ?? "";
    form.indoor_outdoor = props.venue.indoor_outdoor ?? "";
    form.capacity = props.venue.capacity !== null && props.venue.capacity !== undefined
      ? String(props.venue.capacity)
      : "";
    form.rating = props.venue.rating !== null && props.venue.rating !== undefined
      ? String(props.venue.rating)
      : "";
    form.website = props.venue.website ?? "";
    form.address = props.venue.address ?? "";
    form.city = props.venue.city ?? "";
    form.state = props.venue.state ?? "";
    form.country = props.venue.country ?? "";
    form.postal_code = props.venue.postal_code !== null && props.venue.postal_code !== undefined
      ? String(props.venue.postal_code)
      : "";
    form.latitude = props.venue.latitude ?? "";
    form.longitude = props.venue.longitude ?? "";
    form.notes = props.venue.notes ?? "";
  },
  { immediate: true }
);

function toText(value: unknown) {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : String(value);
}

function valueOrUndefined(value: unknown) {
  const trimmed = toText(value).trim();
  return trimmed === "" ? undefined : trimmed;
}

function numberOrUndefined(value: unknown) {
  const trimmed = toText(value).trim();
  if (trimmed === "") return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

function submit() {
  if (!isEditing.value) {
    return;
  }
  emit("save", {
    name: form.name.trim(),
    type: valueOrUndefined(form.type),
    indoor_outdoor: valueOrUndefined(form.indoor_outdoor) as
      | "indoor"
      | "outdoor"
      | "mixed"
      | undefined,
    capacity: numberOrUndefined(form.capacity),
    rating: numberOrUndefined(form.rating),
    website: valueOrUndefined(form.website),
    address: valueOrUndefined(form.address),
    city: valueOrUndefined(form.city),
    state: valueOrUndefined(form.state),
    country: valueOrUndefined(form.country),
    postal_code: numberOrUndefined(form.postal_code),
    latitude: valueOrUndefined(form.latitude),
    longitude: valueOrUndefined(form.longitude),
    notes: valueOrUndefined(form.notes),
  });
}

function setRating(value: number) {
  if (value <= 0) {
    form.rating = "";
    return;
  }
  form.rating = String(value);
}

function setHover(value: number) {
  hoverRating.value = value;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function starFill(starIndex: number) {
  const value = ratingValue.value;
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}

function starFillValue(starIndex: number, rating: number) {
  const value = Math.max(0, Math.min(10, rating));
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
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
  width: min(820px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.title .name {
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
}

.details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail.full {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.detail-value {
  font-size: 14px;
}

.detail-value a {
  color: #0b4da2;
  text-decoration: underline;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.star-readonly {
  display: flex;
  gap: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.full {
  grid-column: 1 / -1;
}

.field input,
.field textarea,
.field select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 14px;
}

.notes-field {
  resize: vertical;
  min-height: 48px;
}

.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinner {
  -moz-appearance: textfield;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.star {
  position: relative;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  position: relative;
  font-size: 20px;
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

.ghost {
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

.muted {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}

.error {
  border: 1px solid rgba(180, 0, 0, 0.35);
  background: rgba(180, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 10px;
}

@media (max-width: 720px) {
  .details {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .primary,
  .ghost,
  .danger {
    width: 100%;
  }
}
</style>
