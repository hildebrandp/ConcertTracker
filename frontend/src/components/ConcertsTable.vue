<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.label"
            :style="col.width ? { width: col.width } : undefined"
            :aria-sort="col.key && sortable ? ariaSort(col.key) : undefined"
          >
            <button
              v-if="col.key && sortable"
              class="sort-button"
              type="button"
              @click="requestSort(col.key)"
            >
              {{ col.label }}
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator(col.key) }}
              </span>
            </button>
            <span v-else>{{ col.label }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in concerts"
          :key="c.id"
          class="row"
          :class="{ upcoming: isUpcoming(c.date) }"
          @click="$emit('select', c.id)"
          role="button"
          tabindex="0"
        >
          <td data-label="Date">
            <div class="date-cell">
              <span>{{ formatDate(c.date) }}</span>
              <span v-if="isUpcoming(c.date)" class="pill upcoming-pill">Upcoming</span>
              <span v-if="isUpcoming(c.date)" class="pill countdown-pill">
                {{ countdownLabel(c.date) }}
              </span>
            </div>
          </td>
          <td data-label="Concert" class="name">{{ c.name }}</td>
          <td data-label="Venue">{{ c.venueName ?? "-" }}</td>
          <td data-label="Bands">{{ c.bandCount ?? "-" }}</td>
          <td data-label="Participants">{{ c.participantCount ?? "-" }}</td>
          <td data-label="Rating">
            <span class="rating">{{ c.rating }}</span>
          </td>
        </tr>

        <tr v-if="concerts.length === 0">
          <td colspan="6" class="empty">No concerts found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { ConcertListItemDto } from "../api/types";

type SortKey = "date" | "name" | "venue" | "bands" | "rating";

const props = withDefaults(
  defineProps<{
    concerts: ConcertListItemDto[];
    title?: string;
    hint?: string;
    sortable?: boolean;
    sortKey?: SortKey;
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

const columns: Array<{
  label: string;
  key?: SortKey;
  width?: string;
}> = [
  { label: "Date", key: "date", width: "160px" },
  { label: "Concert", key: "name" },
  { label: "Venue", key: "venue", width: "200px" },
  { label: "Bands", key: "bands", width: "90px" },
  { label: "Participants", width: "140px" },
  { label: "Rating", key: "rating", width: "120px" },
];

const emit = defineEmits<{
  (e: "select", concertId: number): void;
  (e: "sort-change", key: SortKey): void;
}>();

function requestSort(key: SortKey) {
  if (!sortable.value) return;
  emit("sort-change", key);
}

function sortIndicator(key: SortKey) {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "^" : "v";
}

function ariaSort(key: SortKey) {
  if (sortKey.value !== key) return "none";
  return sortDir.value === "asc" ? "ascending" : "descending";
}

function formatDate(iso: string) {
  // Simple, stable formatting without timezone surprises for YYYY-MM-DD
  return iso.length >= 10 ? iso.slice(0, 10) : iso;
}

function isUpcoming(iso: string) {
  const key = formatDate(iso);
  if (!key) return false;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayKey = `${yyyy}-${mm}-${dd}`;
  return key > todayKey;
}

function countdownLabel(iso: string) {
  const key = formatDate(iso);
  if (!key) return "";
  const [yearStr, monthStr, dayStr] = key.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return "";
  }
  const eventDate = new Date(year, month - 1, day);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffMs = eventDate.getTime() - startOfToday.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "";
  return diffDays === 1 ? "in 1 day" : `in ${diffDays} days`;
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

.row.upcoming {
  background: rgba(46, 125, 50, 0.08);
}

.row.upcoming:hover {
  background: rgba(46, 125, 50, 0.14);
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

.date-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
  white-space: nowrap;
}

.upcoming-pill {
  color: #1b5e20;
  border-color: rgba(27, 94, 32, 0.35);
  background: rgba(46, 125, 50, 0.12);
}

.countdown-pill {
  color: #0b4da2;
  border-color: rgba(11, 77, 162, 0.25);
  background: rgba(11, 77, 162, 0.08);
}

:global(body.dark) .row.upcoming {
  background: rgba(111, 220, 140, 0.12);
}

:global(body.dark) .row.upcoming:hover {
  background: rgba(111, 220, 140, 0.2);
}

:global(body.dark) .pill {
  background: #0f0f0f;
  border-color: rgba(255, 255, 255, 0.2);
}

:global(body.dark) .upcoming-pill {
  color: #b9f6ca;
  border-color: rgba(111, 220, 140, 0.5);
  background: rgba(111, 220, 140, 0.18);
}

:global(body.dark) .countdown-pill {
  color: #b3d4ff;
  border-color: rgba(120, 169, 255, 0.5);
  background: rgba(120, 169, 255, 0.18);
}

.empty {
  padding: 20px 16px;
  color: rgba(0, 0, 0, 0.55);
}

@media (max-width: 720px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .table {
    display: block;
  }

  .table thead {
    display: none;
  }

  .table tbody {
    display: block;
  }

  .table tr {
    display: block;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .table tr:last-child {
    border-bottom: 0;
  }

  .table td {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 0;
    border: 0;
  }

  .table td::before {
    content: attr(data-label);
    font-size: 12px;
    color: var(--muted);
  }

  .table td.empty {
    display: block;
    text-align: center;
  }
}
</style>












