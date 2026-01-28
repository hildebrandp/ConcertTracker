<template>
  <div class="details">
    <div class="detail">
      <div class="detail-label">Rating</div>
      <div class="detail-value rating-display">
        <span>{{ band.rating ?? "-" }}</span>
        <div class="star-readonly" v-if="band.rating !== null && band.rating !== undefined">
          <span
            v-for="star in 5"
            :key="star"
            class="star-icon"
            :style="{ '--fill': `${starFillValue(star, band.rating)}%` }"
          >
            â˜…
          </span>
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="detail-label">Genre</div>
      <div class="detail-value">{{ band.genre || "-" }}</div>
    </div>
    <div class="detail">
      <div class="detail-label">Origin country</div>
      <div class="detail-value">{{ band.origin_country || "-" }}</div>
    </div>
    <div class="detail">
      <div class="detail-label">Plex Link</div>
      <div class="detail-value">
        <a
          v-if="band.link"
          :href="normalizeUrl(band.link)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ band.link }}
        </a>
        <span v-else>-</span>
      </div>
    </div>
    <div class="detail full">
      <div class="detail-label">Website</div>
      <div class="detail-value">
        <a
          v-if="band.website"
          :href="normalizeUrl(band.website)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ band.website }}
        </a>
        <span v-else>-</span>
      </div>
    </div>
    <div class="detail full">
      <div class="detail-label">Notes</div>
      <div class="detail-value">{{ band.notes || "-" }}</div>
    </div>
    <div class="detail">
      <div class="detail-label">Seen live</div>
      <div class="detail-value">
        <button type="button" class="link-button" :disabled="!seenCount" @click="$emit('show-acts')">
          {{ seenCount }} time{{ seenCount === 1 ? "" : "s" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConcertBandDetailsDto } from "../../api/types";

defineProps<{
  band: ConcertBandDetailsDto;
  seenCount: number;
}>();

defineEmits<{
  (e: "show-acts"): void;
}>();

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function starFillValue(starIndex: number, rating: number) {
  const value = Math.max(0, Math.min(10, rating));
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}
</script>

<style scoped src="./bandDetails.css"></style>
