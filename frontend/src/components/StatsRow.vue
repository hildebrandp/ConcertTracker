<template>
  <div class="stats-row">
    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'concerts' }"
      @click="$emit('show-all-concerts')"
    >
      <div class="stat-label">Concerts attended</div>
      <div class="stat-split">
        <div class="stat-split-col">
          <span class="stat-split-label">Total</span>
          <span class="stat-split-value">{{ concertsTotal ?? stats?.concertsAttended ?? "-" }}</span>
        </div>
        <div class="stat-split-divider" aria-hidden="true"></div>
        <div class="stat-split-col">
          <span class="stat-split-label">This year</span>
          <span class="stat-split-value">{{ concertsThisYear ?? "-" }}</span>
        </div>
      </div>
    </button>

    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'acts' }"
      @click="$emit('show-all-acts')"
    >
      <div class="stat-label">All live acts</div>
      <div class="stat-split">
        <div class="stat-split-col">
          <span class="stat-split-label">Total</span>
          <span class="stat-split-value">{{ actsTotal ?? stats?.actsSeen ?? "-" }}</span>
        </div>
        <div class="stat-split-divider" aria-hidden="true"></div>
        <div class="stat-split-col">
          <span class="stat-split-label">This year</span>
          <span class="stat-split-value">{{ actsThisYear ?? "-" }}</span>
        </div>
      </div>
    </button>

    <div class="stat-card">
      <div class="stat-label">Ticket prices</div>
      <div class="stat-split">
        <div class="stat-split-col">
          <span class="stat-split-label">Total</span>
          <span class="stat-split-value">{{ formatCurrency(ticketTotal) }}</span>
        </div>
        <div class="stat-split-divider" aria-hidden="true"></div>
        <div class="stat-split-col">
          <span class="stat-split-label">This year</span>
          <span class="stat-split-value">{{ formatCurrency(ticketThisYear) }}</span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'venues' }"
      @click="$emit('show-all-venues')"
    >
      <div class="stat-label">Total Venues visited</div>
      <div class="stat-value">{{ venuesTotal ?? stats?.venuesSeen ?? "-" }}</div>
    </button>

    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'bands' }"
      @click="$emit('show-all-bands')"
    >
      <div class="stat-label">Bands seen</div>
      <div class="stat-value">{{ bandsTotal ?? stats?.bandsSeen ?? "-" }}</div>
    </button>

    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'participants' }"
      @click="$emit('show-all-participants')"
    >
      <div class="stat-label">Concert friends</div>
      <div class="stat-value">{{ stats?.participantsCount ?? "-" }}</div>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { StatsDto } from "../api/types";

defineProps<{
  stats: StatsDto | null;
  concertsTotal?: number | null;
  bandsTotal?: number | null;
  actsTotal?: number | null;
  venuesTotal?: number | null;
  concertsThisYear?: number | null;
  actsThisYear?: number | null;
  ticketTotal?: number | null;
  ticketThisYear?: number | null;
  activeView?: "concerts" | "bands" | "acts" | "venues" | "participants" | null;
}>();

defineEmits<{
  (e: "show-all-concerts"): void;
  (e: "show-all-bands"): void;
  (e: "show-all-acts"): void;
  (e: "show-all-venues"): void;
  (e: "show-all-participants"): void;
}>();

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";
  return `€${value.toFixed(2)}`;
}
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card.clickable {
  cursor: pointer;
  text-align: left;
  width: 100%;
  font: inherit;
  color: inherit;
  appearance: none;
}

.stat-card.clickable:hover {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}
.stat-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 14px 16px;
  background: #fff;
}

.stat-card.is-active {
  border-width: 2px;
  border-color: var(--accent);
  box-shadow: 0 6px 14px rgba(11, 77, 162, 0.14);
}

.stat-label {
  font-size: 12px;
  color: var(--muted, rgba(0, 0, 0, 0.65));
  margin-bottom: 6px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.stat-split {
  display: flex;
  align-items: stretch;
  gap: 12px;
}

.stat-split-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.stat-split-divider {
  width: 1px;
  background: var(--border, rgba(0, 0, 0, 0.12));
}

.stat-split-label {
  font-size: 12px;
  color: var(--muted, rgba(0, 0, 0, 0.6));
}

.stat-split-value {
  font-size: 20px;
  font-weight: 700;
}

:global(body.dark) .stat-card {
  background: #111;
  border-color: rgba(255, 255, 255, 0.14);
  color: #f5f5f5;
}

:global(body.dark) .stat-card.clickable:hover {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

@media (max-width: 980px) {
  .stats-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>



