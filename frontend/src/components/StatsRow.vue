<template>
  <div class="stats-row">
    <button type="button" class="stat-card clickable" @click="$emit('show-all-concerts')">
      <div class="stat-label">Concerts attended</div>
      <div class="stat-value">{{ stats?.concertsAttended ?? "-" }}</div>
    </button>

    <button type="button" class="stat-card clickable" @click="$emit('show-all-bands')">
      <div class="stat-label">Unique Bands seen</div>
      <div class="stat-value">{{ stats?.bandsSeen ?? "-" }}</div>
    </button>

    <button type="button" class="stat-card clickable" @click="$emit('show-all-acts')">
      <div class="stat-label">All live acts</div>
      <div class="stat-value">{{ stats?.actsSeen ?? "-" }}</div>
    </button>

    <button type="button" class="stat-card clickable" @click="$emit('show-all-venues')">
      <div class="stat-label">Total Venues visited</div>
      <div class="stat-value">{{ stats?.venuesSeen ?? "-" }}</div>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { StatsDto } from "../api/types";

defineProps<{
  stats: StatsDto | null;
}>();

defineEmits<{
  (e: "show-all-concerts"): void;
  (e: "show-all-bands"): void;
  (e: "show-all-acts"): void;
  (e: "show-all-venues"): void;
}>();
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(240px, 1fr));
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
</style>

