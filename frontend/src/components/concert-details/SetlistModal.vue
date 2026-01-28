<template>
  <div v-if="open" class="setlist-backdrop" @click.self="$emit('close')">
    <div class="setlist-modal" role="dialog" aria-modal="true">
      <div class="setlist-header">
        <div>
          <div class="setlist-title">
            Setlist: {{ band?.name ?? "Band" }}
          </div>
          <div class="setlist-sub">
            {{ setlistDate }}
          </div>
        </div>
        <button type="button" class="close" @click="$emit('close')">Close</button>
      </div>
      <div class="setlist-body">
        <div class="setlist-section">
          <div class="setlist-label">Songs</div>
          <ol v-if="setlistDisplay.length" class="setlist-list">
            <li v-for="(song, index) in setlistDisplay" :key="index">
              {{ song }}
            </li>
          </ol>
          <div v-else class="muted">No setlist saved yet.</div>
        </div>
        <div v-if="setlistEditOpen" class="setlist-section">
          <div class="setlist-label">Update setlist</div>
          <textarea
            v-model="setlistDraftModel"
            class="setlist-input"
            rows="8"
            placeholder="Enter one song per line..."
          ></textarea>
          <div class="setlist-hint">Songs are auto-numbered when saved.</div>
          <div v-if="setlistError" class="error">{{ setlistError }}</div>
          <div class="setlist-actions">
            <button type="button" class="secondary" @click="$emit('cancel-edit')">
              Cancel
            </button>
            <button type="button" class="primary" :disabled="setlistSaving" @click="$emit('save')">
              {{ setlistSaving ? "Saving..." : "Save setlist" }}
            </button>
          </div>
        </div>
        <div v-else class="setlist-actions">
          <button type="button" class="secondary" @click="$emit('start-edit')">
            Update setlist
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ConcertDetailsDto } from "../../api/types";

type EventBandEntry = ConcertDetailsDto["bands"][number];

const props = defineProps<{
  open: boolean;
  band: EventBandEntry | null;
  setlistDisplay: string[];
  setlistDate: string;
  setlistEditOpen: boolean;
  setlistDraft: string;
  setlistSaving: boolean;
  setlistError: string | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "start-edit"): void;
  (e: "cancel-edit"): void;
  (e: "save"): void;
  (e: "update:setlistDraft", value: string): void;
}>();

const setlistDraftModel = computed({
  get: () => props.setlistDraft,
  set: (value) => emit("update:setlistDraft", value),
});
</script>

<style scoped src="./setlistModal.css"></style>
