<template>
  <form class="grid" @submit.prevent="$emit('submit')">
    <div class="field">
      <label for="band-name">Name</label>
      <input id="band-name" v-model.trim="form.name" type="text" required />
    </div>
    <div class="field">
      <label for="band-genre">Genre</label>
      <input id="band-genre" v-model.trim="form.genre" type="text" list="band-genre-options" />
    </div>
    <div class="field">
      <label for="band-origin">Origin country</label>
      <input
        id="band-origin"
        v-model.trim="form.origin_country"
        type="text"
        list="band-origin-options"
      />
    </div>
    <div class="field">
      <label for="band-rating">Rating</label>
      <div
        class="star-rating"
        role="radiogroup"
        aria-label="Band rating"
        @mouseleave="hoverModel = null"
      >
        <span v-for="star in 5" :key="star" class="star">
          <span class="star-icon" :style="{ '--fill': `${starFill(star)}%` }">
            â˜…
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
    <div class="field full">
      <label for="band-link">Plex Link</label>
      <input id="band-link" v-model.trim="form.link" type="text" />
    </div>
    <div class="field full">
      <label for="band-website">Website</label>
      <input id="band-website" v-model.trim="form.website" type="text" />
    </div>
    <div class="field full">
      <label for="band-notes">Notes</label>
      <textarea id="band-notes" v-model.trim="form.notes" rows="3" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BandForm = {
  name: string;
  genre: string;
  origin_country: string;
  rating: string;
  notes: string;
  link: string;
  website: string;
};

const props = defineProps<{
  form: BandForm;
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

<style scoped src="./bandDetails.css"></style>
