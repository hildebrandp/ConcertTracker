<template>
  <div class="all-concerts">
    <div class="all-header">
      <button class="secondary" type="button" @click="$emit('close')">
        Back to dashboard
      </button>
      <div v-if="loading" class="hint">Loading all concerts...</div>
    </div>

    <div class="filter-row">
      <label class="filter-label" for="concerts-search">Search</label>
      <div class="filter-input">
        <input
          id="concerts-search"
          v-model.trim="searchModel"
          type="text"
          placeholder="Filter by concert name..."
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
    <div v-if="participantName" class="filter-row">
      <span class="filter-label">With</span>
      <div class="filter-input">
        <div class="pill">
          {{ participantName }}
          <button
            type="button"
            class="pill-clear"
            @click="$emit('clear-participant-filter')"
            aria-label="Clear participant filter"
          >
            &times;
          </button>
        </div>
      </div>
    </div>

    <div class="pager">
      <div class="pager-group">
        <label class="pager-label" for="page-size">Per page</label>
        <select id="page-size" v-model="pageSizeModel">
          <option v-for="option in pageSizeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="pager-group">
        <button
          class="secondary"
          type="button"
          :disabled="isAllPages || currentPage === 1"
          @click="$emit('prev-page')"
        >
          Prev
        </button>
        <div class="pager-meta">Page {{ currentPage }} of {{ totalPages }}</div>
        <button
          class="secondary"
          type="button"
          :disabled="isAllPages || currentPage === totalPages"
          @click="$emit('next-page')"
        >
          Next
        </button>
      </div>
    </div>

    <ConcertsTable
      :concerts="concerts"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      @sort-change="$emit('sort-change', $event)"
      @select="$emit('select', $event)"
    />

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ConcertsTable from "../ConcertsTable.vue";
import type { ConcertListItemDto } from "../../api/types";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  pageSizeOptions: readonly string[];
  pageSize: string;
  currentPage: number;
  totalPages: number;
  isAllPages: boolean;
  concerts: ConcertListItemDto[];
  sortKey: "date" | "name" | "venue" | "bands" | "rating";
  sortDir: "asc" | "desc";
  search: string;
  participantName: string | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update:pageSize", value: string): void;
  (e: "update:search", value: string): void;
  (e: "prev-page"): void;
  (e: "next-page"): void;
  (e: "sort-change", value: "date" | "name" | "venue" | "bands" | "rating"): void;
  (e: "select", value: number): void;
  (e: "clear-participant-filter"): void;
}>();

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (value) => emit("update:pageSize", value),
});

const searchModel = computed({
  get: () => props.search,
  set: (value) => emit("update:search", value),
});
</script>

<style scoped src="./dashboardList.css"></style>
