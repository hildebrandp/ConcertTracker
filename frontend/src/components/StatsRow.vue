<template>
  <div class="stats-row">
    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'concerts' }"
      @click="$emit('show-all-concerts')"
    >
      <div class="stat-label">Concerts attended</div>
      <div class="stat-value">{{ stats?.concertsAttended ?? "-" }}</div>
    </button>

    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'bands' }"
      @click="$emit('show-all-bands')"
    >
      <div class="stat-label">Unique Bands seen</div>
      <div class="stat-value">{{ stats?.bandsSeen ?? "-" }}</div>
    </button>

    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'acts' }"
      @click="$emit('show-all-acts')"
    >
      <div class="stat-label">All live acts</div>
      <div class="stat-value">{{ stats?.actsSeen ?? "-" }}</div>
    </button>

    <button
      type="button"
      class="stat-card clickable"
      :class="{ 'is-active': activeView === 'venues' }"
      @click="$emit('show-all-venues')"
    >
      <div class="stat-label">Total Venues visited</div>
      <div class="stat-value">{{ stats?.venuesSeen ?? "-" }}</div>
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
  activeView?: "concerts" | "bands" | "acts" | "venues" | "participants" | null;
}>();

defineEmits<{
  (e: "show-all-concerts"): void;
  (e: "show-all-bands"): void;
  (e: "show-all-acts"): void;
  (e: "show-all-venues"): void;
  (e: "show-all-participants"): void;
}>();
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
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 6px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.2px;
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



