<template>
  <div class="section">
    <div class="section-title">Event</div>
    <div class="field">
      <label for="event-name">Name <span class="required">*</span></label>
      <input id="event-name" v-model.trim="eventNameModel" type="text" required />
    </div>
    <div class="grid event-row">
      <div class="field">
        <label for="event-datetime">Date & time <span class="required">*</span></label>
        <input
          id="event-datetime"
          v-model="eventDatetimeModel"
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
          @mouseleave="setEventHover(null)"
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
      <textarea id="event-notes" v-model.trim="eventNotesModel" rows="2" class="event-notes" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  eventName: string;
  eventDatetime: string;
  eventRating: string;
  eventNotes: string;
  eventHoverRating: number | null;
}>();

const emit = defineEmits<{
  (e: "update:eventName", value: string): void;
  (e: "update:eventDatetime", value: string): void;
  (e: "update:eventRating", value: string): void;
  (e: "update:eventNotes", value: string): void;
  (e: "update:eventHoverRating", value: number | null): void;
}>();

const eventNameModel = computed({
  get: () => props.eventName,
  set: (value) => emit("update:eventName", value),
});

const eventDatetimeModel = computed({
  get: () => props.eventDatetime,
  set: (value) => emit("update:eventDatetime", value),
});

const eventRatingModel = computed({
  get: () => props.eventRating,
  set: (value) => emit("update:eventRating", value),
});

const eventNotesModel = computed({
  get: () => props.eventNotes,
  set: (value) => emit("update:eventNotes", value),
});

const eventRatingValue = computed(() => {
  const base = props.eventHoverRating ?? Number(eventRatingModel.value);
  if (!Number.isFinite(base)) {
    return 0;
  }
  return Math.max(0, Math.min(10, base));
});

function setEventRating(value: number) {
  if (value <= 0) {
    eventRatingModel.value = "";
    return;
  }
  eventRatingModel.value = String(value);
}

function setEventHover(value: number | null) {
  emit("update:eventHoverRating", value);
}

function eventStarFill(starIndex: number) {
  const value = eventRatingValue.value;
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}
</script>

<style scoped src="./eventModal.css"></style>
