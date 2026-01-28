<template>
  <div class="all-concerts">
    <div class="all-header">
      <button class="secondary" type="button" @click="$emit('close')">
        Back to dashboard
      </button>
      <div v-if="loading" class="hint">Loading venues...</div>
    </div>

    <div class="filter-row">
      <label class="filter-label" for="venues-search">Search</label>
      <div class="filter-input">
        <input
          id="venues-search"
          v-model.trim="searchModel"
          type="text"
          placeholder="Filter by venue name..."
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

    <div class="pager">
      <div class="pager-group">
        <label class="pager-label" for="venues-page-size">Per page</label>
        <select id="venues-page-size" v-model="pageSizeModel">
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

    <VenuesTable
      :venues="venues"
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
import VenuesTable from "../VenuesTable.vue";
import type { VenueSummaryDto } from "../../api/types";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  pageSizeOptions: readonly string[];
  pageSize: string;
  currentPage: number;
  totalPages: number;
  isAllPages: boolean;
  venues: VenueSummaryDto[];
  sortKey: "venue" | "lastVisited" | "count" | "rating";
  sortDir: "asc" | "desc";
  search: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update:pageSize", value: string): void;
  (e: "update:search", value: string): void;
  (e: "prev-page"): void;
  (e: "next-page"): void;
  (e: "sort-change", value: "venue" | "lastVisited" | "count" | "rating"): void;
  (e: "select", value: number): void;
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
