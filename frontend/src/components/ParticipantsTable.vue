<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th :aria-sort="ariaSort('name')">
            <button class="sort-button" type="button" @click="requestSort('name')">
              Name
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("name") }}
              </span>
            </button>
          </th>
          <th style="width: 140px">Last attended</th>
          <th>Last event</th>
          <th style="width: 120px" :aria-sort="ariaSort('count')">
            <button class="sort-button" type="button" @click="requestSort('count')">
              Events
              <span class="sort-indicator" aria-hidden="true">
                {{ sortIndicator("count") }}
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="participant in participants"
          :key="participant.id"
          class="row"
          role="button"
          tabindex="0"
          @click="$emit('select', participant)"
        >
          <td data-label="Name" class="name">{{ participant.name }}</td>
          <td data-label="Last attended">{{ formatDate(participant.lastAttendDate) }}</td>
          <td data-label="Last event">{{ participant.lastAttendEventName || "-" }}</td>
          <td data-label="Events">{{ participant.eventCount }}</td>
        </tr>

        <tr v-if="participants.length === 0">
          <td colspan="4" class="empty">No participants found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { ParticipantSummaryDto } from "../api/types";

const props = withDefaults(
  defineProps<{
    participants: ParticipantSummaryDto[];
    title?: string;
    hint?: string;
    sortKey?: "name" | "count";
    sortDir?: "asc" | "desc";
  }>(),
  {
    title: "Concert friends",
    hint: "Unique participants across all events",
    sortKey: "name",
    sortDir: "asc",
  }
);
const { participants, title, hint, sortKey, sortDir } = toRefs(props);

const emit = defineEmits<{
  (e: "select", participant: ParticipantSummaryDto): void;
  (e: "sort-change", key: "name" | "count"): void;
}>();

function requestSort(key: "name" | "count") {
  emit("sort-change", key);
}

function sortIndicator(key: "name" | "count") {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "^" : "v";
}

function ariaSort(key: "name" | "count") {
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

.row {
  cursor: pointer;
}

.name {
  font-weight: 600;
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
