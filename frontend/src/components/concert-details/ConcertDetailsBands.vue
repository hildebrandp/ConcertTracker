<template>
  <div class="band-stack">
    <template v-if="details">
      <div class="section">
        <div class="section-title">{{ mainActTitle }}</div>
        <ul class="list">
          <li v-for="b in mainActs" :key="b.id" class="band-item">
            <button type="button" class="band-link" @click="$emit('show-band', b.id)">
              {{ b.name }}
            </button>
            <div class="band-actions">
              <span class="band-rating">{{ b.rating ?? "-" }}</span>
              <button
                type="button"
                class="band-rating setlist-button"
                :class="{ 'setlist-ready': hasSetlist(b) }"
                :disabled="!b.eventBandId"
                @click="$emit('open-setlist', b)"
              >
                Setlist
              </button>
            </div>
          </li>
          <li v-if="mainActs.length === 0" class="muted">No main acts recorded.</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">{{ supportersTitle }}</div>
        <ul class="list">
          <li v-for="b in supporters" :key="b.id" class="band-item">
            <button type="button" class="band-link" @click="$emit('show-band', b.id)">
              {{ b.name }}
            </button>
            <div class="band-actions">
              <span class="band-rating">{{ b.rating ?? "-" }}</span>
              <button
                type="button"
                class="band-rating setlist-button"
                :class="{ 'setlist-ready': hasSetlist(b) }"
                :disabled="!b.eventBandId"
                @click="$emit('open-setlist', b)"
              >
                Setlist
              </button>
            </div>
          </li>
          <li v-if="supporters.length === 0" class="muted">No supporters recorded.</li>
        </ul>
      </div>
    </template>
    <div v-else class="section">
      <div class="section-title">Bands</div>
      <div class="muted">Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConcertDetailsDto } from "../../api/types";

type EventBandEntry = ConcertDetailsDto["bands"][number];

defineProps<{
  details: ConcertDetailsDto | null;
  mainActs: EventBandEntry[];
  supporters: EventBandEntry[];
  mainActTitle: string;
  supportersTitle: string;
  hasSetlist: (band: EventBandEntry) => boolean;
}>();

defineEmits<{
  (e: "show-band", bandId: number): void;
  (e: "open-setlist", band: EventBandEntry): void;
}>();
</script>

<style scoped src="./concertDetails.css"></style>
