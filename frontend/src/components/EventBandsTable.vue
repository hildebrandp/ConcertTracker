<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th style="width: 160px" :aria-sort="ariaSort('date')">
            <button class="sort-button" type="button" @click="requestSort('date')">
              Date
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("date") }}
              </span>
            </button>
          </th>
          <th :aria-sort="ariaSort('band')">
            <button class="sort-button" type="button" @click="requestSort('band')">
              Band
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("band") }}
              </span>
            </button>
          </th>
          <th :aria-sort="ariaSort('event')">
            <button class="sort-button" type="button" @click="requestSort('event')">
              Event
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("event") }}
              </span>
            </button>
          </th>
          <th style="width: 200px" :aria-sort="ariaSort('venue')">
            <button class="sort-button" type="button" @click="requestSort('venue')">
              Venue
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("venue") }}
              </span>
            </button>
          </th>
          <th style="width: 120px" :aria-sort="ariaSort('rating')">
            <button class="sort-button" type="button" @click="requestSort('rating')">
              Rating
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("rating") }}
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in entries"
          :key="entry.event_band_id"
          class="row"
          role="button"
          tabindex="0"
          @click="$emit('select', entry.event_id)"
        >
          <td>{{ formatDate(entry.date) }}</td>
          <td class="name">{{ entry.band_name }}</td>
          <td>{{ entry.event_name ?? "-" }}</td>
          <td>{{ entry.venue_name ?? "-" }}</td>
          <td>
            <span class="rating">{{ entry.rating ?? "-" }}</span>
          </td>
        </tr>

        <tr v-if="entries.length === 0">
          <td colspan="5" class="empty">No bands found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { EventBandSummaryDto } from "../api/types";

const props = withDefaults(
  defineProps<{
    entries: EventBandSummaryDto[];
    title?: string;
    hint?: string;
    sortKey?: "date" | "band" | "event" | "venue" | "rating";
    sortDir?: "asc" | "desc";
  }>(),
  {
    title: "All live acts",
    hint: "Click a row to see details",
    sortKey: "date",
    sortDir: "desc",
  }
);
const { entries, title, hint, sortKey, sortDir } = toRefs(props);

const emit = defineEmits<{
  (e: "sort-change", key: "date" | "band" | "event" | "venue" | "rating"): void;
  (e: "select", eventId: number): void;
}>();

function requestSort(key: "date" | "band" | "event" | "venue" | "rating") {
  emit("sort-change", key);
}

function sortIndicator(key: "date" | "band" | "event" | "venue" | "rating") {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "^" : "v";
}

function ariaSort(key: "date" | "band" | "event" | "venue" | "rating") {
  if (sortKey.value !== key) return "none";
  return sortDir.value === "asc" ? "ascending" : "descending";
}

function formatDate(iso: string) {
  return iso.length >= 10 ? iso.slice(0, 10) : iso;
}
</script>

<style scoped>
.table-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.table-header h2 {
  margin: 0;
  font-size: 16px;
}

.hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  text-align: left;
  font-size: 14px;
}

.sort-button {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sort-indicator {
  font-size: 12px;
  opacity: 0.6;
  min-width: 8px;
  text-align: left;
}

.row:hover {
  background: rgba(0, 0, 0, 0.03);
}

.name {
  font-weight: 600;
}

.rating {
  display: inline-block;
  min-width: 36px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  text-align: center;
}

.empty {
  padding: 20px 16px;
  color: rgba(0, 0, 0, 0.55);
}
</style>
