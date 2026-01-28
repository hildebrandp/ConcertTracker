<template>
  <div class="all-concerts">
    <div class="all-header">
      <button class="secondary" type="button" @click="$emit('close')">
        Back to dashboard
      </button>
      <div v-if="loading" class="hint">Loading bands...</div>
    </div>

    <div class="filter-row">
      <label class="filter-label" for="bands-search">Search</label>
      <div class="filter-input">
        <input
          id="bands-search"
          v-model.trim="searchModel"
          type="text"
          placeholder="Filter by band name..."
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
        <label class="pager-label" for="band-page-size">Per page</label>
        <select id="band-page-size" v-model="pageSizeModel">
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

    <BandsTable
      :bands="bands"
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
import BandsTable from "../BandsTable.vue";
import type { BandSummaryDto } from "../../api/types";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  pageSizeOptions: readonly string[];
  pageSize: string;
  currentPage: number;
  totalPages: number;
  isAllPages: boolean;
  bands: BandSummaryDto[];
  sortKey: "band" | "lastSeen" | "count" | "rating" | "venue";
  sortDir: "asc" | "desc";
  search: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update:pageSize", value: string): void;
  (e: "update:search", value: string): void;
  (e: "prev-page"): void;
  (e: "next-page"): void;
  (e: "sort-change", value: "band" | "lastSeen" | "count" | "rating" | "venue"): void;
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
