<template>
  <div class="all-concerts">
    <div class="all-header">
      <button class="secondary" type="button" @click="$emit('close')">
        Back to dashboard
      </button>
      <div v-if="loading" class="hint">Loading participants...</div>
    </div>

    <div class="filter-row">
      <label class="filter-label" for="participants-search">Search</label>
      <div class="filter-input">
        <input
          id="participants-search"
          v-model.trim="searchModel"
          type="text"
          placeholder="Filter by participant name..."
        />
        <button
          v-if="searchModel"
          class="clear-button"
          type="button"
          @click="searchModel = ''"
          aria-label="Clear search"
        >
          &times;
        </button>
      </div>
    </div>

    <ParticipantsTable
      :participants="participants"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @select="$emit('select', $event)"
      @sort-change="$emit('sort-change', $event)"
    />

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ParticipantsTable from "../ParticipantsTable.vue";
import type { ParticipantSummaryDto } from "../../api/types";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  participants: ParticipantSummaryDto[];
  sortKey: "name" | "count";
  sortDir: "asc" | "desc";
  search: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update:search", value: string): void;
  (e: "sort-change", value: "name" | "count"): void;
  (e: "select", value: ParticipantSummaryDto): void;
}>();

const searchModel = computed({
  get: () => props.search,
  set: (value) => emit("update:search", value),
});
</script>

<style scoped src="./dashboardList.css"></style>
