<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th style="width: 160px" :aria-sort="sortable ? ariaSort('date') : undefined">
            <button
              v-if="sortable"
              class="sort-button"
              type="button"
              @click="requestSort('date')"
            >
              Date
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("date") }}
              </span>
            </button>
            <span v-else>Date</span>
          </th>
          <th :aria-sort="sortable ? ariaSort('name') : undefined">
            <button
              v-if="sortable"
              class="sort-button"
              type="button"
              @click="requestSort('name')"
            >
              Concert
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("name") }}
              </span>
            </button>
            <span v-else>Concert</span>
          </th>
          <th style="width: 200px" :aria-sort="sortable ? ariaSort('venue') : undefined">
            <button
              v-if="sortable"
              class="sort-button"
              type="button"
              @click="requestSort('venue')"
            >
              Venue
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("venue") }}
              </span>
            </button>
            <span v-else>Venue</span>
          </th>
          <th style="width: 90px" :aria-sort="sortable ? ariaSort('bands') : undefined">
            <button
              v-if="sortable"
              class="sort-button"
              type="button"
              @click="requestSort('bands')"
            >
              Bands
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("bands") }}
              </span>
            </button>
            <span v-else>Bands</span>
          </th>
          <th style="width: 120px" :aria-sort="sortable ? ariaSort('rating') : undefined">
            <button
              v-if="sortable"
              class="sort-button"
              type="button"
              @click="requestSort('rating')"
            >
              Rating
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("rating") }}
              </span>
            </button>
            <span v-else>Rating</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in concerts"
          :key="c.id"
          class="row"
          @click="$emit('select', c.id)"
          role="button"
          tabindex="0"
        >
          <td>{{ formatDate(c.date) }}</td>
          <td class="name">{{ c.name }}</td>
          <td>{{ c.venueName ?? "-" }}</td>
          <td>{{ c.bandCount ?? "�" }}</td>
          <td>
            <span class="rating">{{ c.rating }}</span>
          </td>
        </tr>

        <tr v-if="concerts.length === 0">
          <td colspan="5" class="empty">No concerts found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { ConcertListItemDto } from "../api/types";

const props = withDefaults(
  defineProps<{
    concerts: ConcertListItemDto[];
    title?: string;
    hint?: string;
    sortable?: boolean;
    sortKey?: "date" | "name" | "venue" | "bands" | "rating";
    sortDir?: "asc" | "desc";
  }>(),
  {
    title: "All attended Concerts",
    hint: "Click a row to see details",
    sortable: true,
    sortKey: "date",
    sortDir: "desc",
  }
);
const { concerts, title, hint, sortable, sortKey, sortDir } = toRefs(props);

const emit = defineEmits<{
  (e: "select", concertId: number): void;
  (e: "sort-change", key: "date" | "name" | "venue" | "bands" | "rating"): void;
}>();

function requestSort(key: "date" | "name" | "venue" | "bands" | "rating") {
  if (!sortable.value) return;
  emit("sort-change", key);
}

function sortIndicator(key: "date" | "name" | "venue" | "bands" | "rating") {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "^" : "v";
}

function ariaSort(key: "date" | "name" | "venue" | "bands" | "rating") {
  if (sortKey.value !== key) return "none";
  return sortDir.value === "asc" ? "ascending" : "descending";
}

function formatDate(iso: string) {
  // Simple, stable formatting without timezone surprises for YYYY-MM-DD
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

.row {
  cursor: pointer;
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



