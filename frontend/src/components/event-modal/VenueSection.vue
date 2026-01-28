<template>
  <div class="section">
    <div class="section-title">Venue</div>
    <div class="field">
      <label for="venue-search">
        Search venue <span v-if="!useNewVenueModel" class="required">*</span>
      </label>
      <div class="inline-input">
        <input
          id="venue-search"
          v-model.trim="venueQueryModel"
          type="text"
          placeholder="Start typing a venue name..."
          :disabled="useNewVenueModel"
          @input="emit('clear-selected-venue')"
        />
        <button
          v-if="venueQueryModel && !useNewVenueModel"
          type="button"
          class="clear-button"
          @click="venueQueryModel = ''; emit('clear-selected-venue')"
          aria-label="Clear venue search"
        >
          &times;
        </button>
      </div>
      <div v-if="!useNewVenueModel && venueMatches.length" class="suggestions">
        <button
          v-for="venue in venueMatches"
          :key="venue.id"
          type="button"
          class="suggestion"
          @click="emit('select-venue', venue)"
        >
          {{ venue.name }}
        </button>
      </div>
      <div v-if="selectedVenueName && !useNewVenueModel" class="selected">
        Selected: {{ selectedVenueName }}
      </div>
    </div>

    <label class="checkbox">
      <input v-model="useNewVenueModel" type="checkbox" />
      Create new venue
    </label>

    <div v-if="useNewVenueModel" class="venue-grid">
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
            @mouseleave="setVenueHover(null)"
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
          <textarea id="venue-notes" v-model.trim="venueForm.notes" rows="2" class="venue-notes" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ConcertVenueDto } from "../../api/types";

type VenueForm = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  type: string;
  indoor_outdoor: string;
  capacity: string;
  website: string;
  notes: string;
  latitude: string;
  longitude: string;
  rating: string;
};

const props = defineProps<{
  useNewVenue: boolean;
  venueQuery: string;
  venueMatches: ConcertVenueDto[];
  selectedVenueName: string;
  venueForm: VenueForm;
  venueHoverRating: number | null;
  venueTypeOptions: string[];
}>();

const emit = defineEmits<{
  (e: "update:useNewVenue", value: boolean): void;
  (e: "update:venueQuery", value: string): void;
  (e: "update:venueHoverRating", value: number | null): void;
  (e: "select-venue", value: ConcertVenueDto): void;
  (e: "clear-selected-venue"): void;
}>();

const useNewVenueModel = computed({
  get: () => props.useNewVenue,
  set: (value) => emit("update:useNewVenue", value),
});

const venueQueryModel = computed({
  get: () => props.venueQuery,
  set: (value) => emit("update:venueQuery", value),
});

const venueRatingValue = computed(() => {
  const base = props.venueHoverRating ?? Number(props.venueForm.rating);
  if (!Number.isFinite(base)) {
    return 0;
  }
  return Math.max(0, Math.min(10, base));
});

function setVenueRating(value: number) {
  if (value <= 0) {
    props.venueForm.rating = "";
    return;
  }
  props.venueForm.rating = String(value);
}

function setVenueHover(value: number | null) {
  emit("update:venueHoverRating", value);
}

function venueStarFill(starIndex: number) {
  const value = venueRatingValue.value;
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}
</script>

<style scoped src="./eventModal.css"></style>
