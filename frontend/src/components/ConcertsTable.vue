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
          @click="$emit('select', c.id)"
          role="button"
          tabindex="0"
        >
          <td data-label="Date">{{ formatDate(c.date) }}</td>
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












