<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th :aria-sort="ariaSort('venue')">
            <button class="sort-button" type="button" @click="requestSort('venue')">
              Venue
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("venue") }}
              </span>
            </button>
          </th>
          <th style="width: 160px" :aria-sort="ariaSort('lastVisited')">
            <button class="sort-button" type="button" @click="requestSort('lastVisited')">
              Last visited
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("lastVisited") }}
              </span>
            </button>
          </th>
          <th style="width: 90px" :aria-sort="ariaSort('count')">
            <button class="sort-button" type="button" @click="requestSort('count')">
              Count
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("count") }}
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
          v-for="venue in venues"
          :key="venue.venue_id"
          class="row"
          role="button"
          tabindex="0"
          @click="$emit('select', venue.venue_id)"
        >
          <td class="name">{{ venue.venue_name }}</td>
          <td>{{ formatDate(venue.last_visited_date) }}</td>
          <td>{{ venue.visit_count }}</td>
          <td>
            <span class="rating">{{ venue.rating ?? "-" }}</span>
          </td>
        </tr>

        <tr v-if="venues.length === 0">
          <td colspan="4" class="empty">No venues found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { VenueSummaryDto } from "../api/types";

const props = withDefaults(
  defineProps<{
    venues: VenueSummaryDto[];
    title?: string;
    hint?: string;
    sortKey?: "venue" | "lastVisited" | "count" | "rating";
    sortDir?: "asc" | "desc";
  }>(),
  {
    title: "Visited Venues",
    hint: "Click a row to see details",
    sortKey: "venue",
    sortDir: "asc",
  }
);
const { venues, title, hint, sortKey, sortDir } = toRefs(props);

const emit = defineEmits<{
  (e: "select", venueId: number): void;
  (e: "sort-change", key: "venue" | "lastVisited" | "count" | "rating"): void;
}>();

function requestSort(key: "venue" | "lastVisited" | "count" | "rating") {
  emit("sort-change", key);
}

function sortIndicator(key: "venue" | "lastVisited" | "count" | "rating") {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "^" : "v";
}

function ariaSort(key: "venue" | "lastVisited" | "count" | "rating") {
  if (sortKey.value !== key) return "none";
  return sortDir.value === "asc" ? "ascending" : "descending";
}

function formatDate(iso?: string | null) {
  if (!iso) return "-";
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
