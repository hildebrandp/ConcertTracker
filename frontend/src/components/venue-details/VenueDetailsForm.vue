<template>
  <form class="grid" @submit.prevent="$emit('submit')">
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
        @mouseleave="hoverModel = null"
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
</template>

<script setup lang="ts">
import { computed } from "vue";

type VenueForm = {
  name: string;
  type: string;
  indoor_outdoor: string;
  capacity: string;
  rating: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  notes: string;
};

const props = defineProps<{
  form: VenueForm;
  venueTypeOptions: string[];
  hoverRating: number | null;
}>();

const emit = defineEmits<{
  (e: "update:hoverRating", value: number | null): void;
  (e: "submit"): void;
}>();

const hoverModel = computed({
  get: () => props.hoverRating,
  set: (value) => emit("update:hoverRating", value),
});

const ratingValue = computed(() => {
  const base = hoverModel.value ?? Number(props.form.rating);
  if (!Number.isFinite(base)) {
    return 0;
  }
  return Math.max(0, Math.min(10, base));
});

function setRating(value: number) {
  if (value <= 0) {
    props.form.rating = "";
    return;
  }
  props.form.rating = String(value);
}

function setHover(value: number) {
  hoverModel.value = value;
}

function starFill(starIndex: number) {
  const value = ratingValue.value;
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}
</script>

<style scoped src="./venueDetails.css"></style>
