<template>
  <div v-if="venue" class="details">
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
</template>

<script setup lang="ts">
import type { ConcertVenueDetailsDto } from "../../api/types";

defineProps<{
  venue: ConcertVenueDetailsDto;
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

<style scoped src="./venueDetails.css"></style>
