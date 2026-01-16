<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">
          <div class="name">{{ details?.name ?? "Loading..." }}</div>
          <div class="meta" v-if="details">
            <span class="meta-item">{{ details.date.slice(0, 10) }}</span>
            <span class="meta-sep">-</span>
            <span class="meta-item">Rating {{ details.rating }}</span>
            <span class="star-readonly" v-if="details.rating !== null && details.rating !== undefined">
              <span
                v-for="star in 5"
                :key="star"
                class="star-icon"
                :style="{ '--fill': `${starFillValue(star, details.rating)}%` }"
              >
                &#9733;
              </span>
            </span>
            <span v-if="details.venueName" class="meta-sep">-</span>
            <button
              v-if="details.venueName && details.venueId"
              type="button"
              class="meta-link"
              @click="$emit('show-venue', details.venueId)"
            >
              {{ details.venueName }}
            </button>
            <span v-else-if="details.venueName" class="meta-item">{{ details.venueName }}</span>
          </div>
          <div v-else class="meta muted">Loading...</div>
        </div>

        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <div class="modal-body">
        <template v-if="details">
          <div class="section">
            <div class="section-title">{{ mainActTitle }}</div>
            <ul class="list">
              <li v-for="b in mainActs" :key="b.id" class="band-item">
                <span>{{ b.name }}</span>
                <span class="band-rating">{{ b.rating ?? "-" }}</span>
              </li>
              <li v-if="mainActs.length === 0" class="muted">No main acts recorded.</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">{{ supportersTitle }}</div>
            <ul class="list">
              <li v-for="b in supporters" :key="b.id" class="band-item">
                <span>{{ b.name }}</span>
                <span class="band-rating">{{ b.rating ?? "-" }}</span>
              </li>
              <li v-if="supporters.length === 0" class="muted">No supporters recorded.</li>
            </ul>
          </div>
        </template>
        <div v-else class="section">
          <div class="section-title">Bands</div>
          <div class="muted">Loading...</div>
        </div>

        <div class="section">
          <div class="section-title">Participated with</div>
          <ul v-if="details" class="list">
            <li v-for="p in details.participatedWith" :key="p.id">{{ p.displayName }}</li>
            <li v-if="details.participatedWith.length === 0" class="muted">No participants recorded.</li>
          </ul>
          <div v-else class="muted">Loading...</div>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div class="modal-footer">
          <button type="button" class="danger" @click="$emit('delete-event')">
            Delete event
          </button>
          <button type="button" class="secondary" @click="$emit('update-event')">
            Update event
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { ConcertDetailsDto } from "../api/types";

defineEmits<{
  (e: "close"): void;
  (e: "show-venue", venueId: number): void;
  (e: "update-event"): void;
  (e: "delete-event"): void;
}>();

const props = defineProps<{
  open: boolean;
  details: ConcertDetailsDto | null;
  error: string | null;
}>();

const { open, details, error } = toRefs(props);

const sortedBands = computed(() => {
  if (!details.value) return [];
  return [...details.value.bands].sort((a, b) => {
    const orderA = a.runningOrder ?? -Infinity;
    const orderB = b.runningOrder ?? -Infinity;
    if (orderA === orderB) {
      return a.name.localeCompare(b.name);
    }
    return orderB - orderA;
  });
});

const mainActs = computed(() => sortedBands.value.filter((b) => b.mainAct));
const supporters = computed(() => sortedBands.value.filter((b) => !b.mainAct));
const mainActTitle = computed(() => (mainActs.value.length === 1 ? "Main Act" : "Main Acts"));
const supportersTitle = computed(() =>
  supporters.value.length === 1 ? "Supporter" : "Supporters"
);

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
  width: min(860px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.title .name {
  font-size: 25px;
  font-weight: 700;
}

.meta {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.meta-sep {
  color: rgba(0, 0, 0, 0.3);
}

.meta-link {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: #0b4da2;
  text-decoration: underline;
  cursor: pointer;
}

.star-readonly {
  display: inline-flex;
  gap: 4px;
}

.star-icon {
  position: relative;
  font-size: 16px;
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

.close {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.section {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 12px;
}

.section-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.list {
  margin: 0;
  padding-left: 16px;
}

.band-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
  padding-left: 14px;
}

.band-item::before {
  content: "•";
  position: absolute;
  left: 0;
  color: currentColor;
  opacity: 0.7;
}

.band-rating {
  min-width: 36px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  text-align: center;
  font-size: 12px;
}

.muted {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}

.error {
  grid-column: 1 / -1;
  border: 1px solid rgba(180, 0, 0, 0.35);
  background: rgba(180, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 10px;
}

.modal-footer {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
</style>
