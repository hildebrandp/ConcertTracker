<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th :aria-sort="ariaSort('band')">
            <button class="sort-button" type="button" @click="requestSort('band')">
              Band
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("band") }}
              </span>
            </button>
          </th>
          <th style="width: 160px" :aria-sort="ariaSort('lastSeen')">
            <button class="sort-button" type="button" @click="requestSort('lastSeen')">
              Last seen
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("lastSeen") }}
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
          <th style="width: 200px" :aria-sort="ariaSort('venue')">
            <button class="sort-button" type="button" @click="requestSort('venue')">
              Last venue
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("venue") }}
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="band in bands"
          :key="band.band_id"
          class="row"
          role="button"
          tabindex="0"
          @click="$emit('select', band.band_id)"
        >
          <td class="name">{{ band.band_name }}</td>
          <td>{{ formatDate(band.last_seen_date) }}</td>
          <td>{{ band.seen_count }}</td>
          <td>
            <span class="rating">{{ band.rating ?? "-" }}</span>
          </td>
          <td>{{ band.last_venue_name ?? "-" }}</td>
        </tr>

        <tr v-if="bands.length === 0">
          <td colspan="5" class="empty">No bands found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { BandSummaryDto } from "../api/types";

const props = withDefaults(
  defineProps<{
    bands: BandSummaryDto[];
    title?: string;
    hint?: string;
    sortKey?: "band" | "lastSeen" | "count" | "rating" | "venue";
    sortDir?: "asc" | "desc";
  }>(),
  {
    title: "Seen Bands",
    hint: "Click a row to see details",
    sortKey: "band",
    sortDir: "asc",
  }
);
const { bands, title, hint, sortKey, sortDir } = toRefs(props);

const emit = defineEmits<{
  (e: "select", bandId: number): void;
  (e: "sort-change", key: "band" | "lastSeen" | "count" | "rating" | "venue"): void;
}>();

function requestSort(key: "band" | "lastSeen" | "count" | "rating" | "venue") {
  emit("sort-change", key);
}

function sortIndicator(key: "band" | "lastSeen" | "count" | "rating" | "venue") {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "^" : "v";
}

function ariaSort(key: "band" | "lastSeen" | "count" | "rating" | "venue") {
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
