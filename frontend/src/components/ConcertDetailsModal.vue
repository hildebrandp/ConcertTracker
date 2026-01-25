<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">
          <div class="name">{{ details?.name ?? "Loading..." }}</div>
          <div class="meta" v-if="details">
            <span class="meta-item">{{ details.date.slice(0, 10) }}</span>
            <span class="meta-sep">-</span>
            <span class="meta-item">Rating {{ details.rating }}</span>
            <span class="star-readonly" v-if="details.rating !== null && details.rating !== undefined">
              <span
                v-for="star in 5"
                :key="star"
                class="star-icon"
                :style="{ '--fill': `${starFillValue(star, details.rating)}%` }"
              >
                &#9733;
              </span>
            </span>
            <span v-if="details.venueName" class="meta-sep">-</span>
            <button
              v-if="details.venueName && details.venueId"
              type="button"
              class="meta-link"
              @click="$emit('show-venue', details.venueId)"
            >
              {{ details.venueName }}
            </button>
            <span v-else-if="details.venueName" class="meta-item">{{ details.venueName }}</span>
          </div>
          <div v-else class="meta muted">Loading...</div>
        </div>

        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <div class="modal-body">
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
                      @click="openSetlist(b)"
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
                      @click="openSetlist(b)"
                    >
                      Setlist
                    </button>
                  </div>
                </li>
                <li v-if="supporters.length === 0" class="muted">No supporters recorded.</li>
              </ul>
            </div>

            <div class="section">
              <div class="section-title">Participated with</div>
              <ul class="list participants">
                <li v-for="p in details.participatedWith" :key="p.id">
                  {{ p.displayName }}
                </li>
                <li v-if="details.participatedWith.length === 0" class="muted">
                  No participants recorded.
                </li>
              </ul>
            </div>
          </template>
          <div v-else class="section">
            <div class="section-title">Bands</div>
            <div class="muted">Loading...</div>
          </div>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div class="modal-footer">
          <button type="button" class="danger" @click="$emit('delete-event')">
            Delete event
          </button>
          <button type="button" class="secondary" @click="$emit('update-event')">
            Update event
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="setlistOpen" class="setlist-backdrop" @click.self="closeSetlist">
    <div class="setlist-modal" role="dialog" aria-modal="true">
      <div class="setlist-header">
        <div>
          <div class="setlist-title">
            Setlis: {{ setlistBand?.name ?? "Band" }}
          </div>
          <div class="setlist-sub">
            {{ setlistDate }}
          </div>
        </div>
        <button type="button" class="close" @click="closeSetlist">Close</button>
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
            v-model="setlistDraft"
            class="setlist-input"
            rows="8"
            placeholder="Enter one song per line..."
          ></textarea>
          <div class="setlist-hint">Songs are auto-numbered when saved.</div>
          <div v-if="setlistError" class="error">{{ setlistError }}</div>
          <div class="setlist-actions">
            <button type="button" class="secondary" @click="cancelEditSetlist">
              Cancel
            </button>
            <button type="button" class="primary" :disabled="setlistSaving" @click="saveSetlist">
              {{ setlistSaving ? "Saving..." : "Save setlist" }}
            </button>
          </div>
        </div>
        <div v-else class="setlist-actions">
          <button type="button" class="secondary" @click="startEditSetlist">
            Update setlist
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import type { ConcertDetailsDto } from "../api/types";
import { updateEventBand } from "../api/concertsApi";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "show-venue", venueId: number): void;
  (e: "show-band", bandId: number): void;
  (e: "refresh-details"): void;
  (e: "update-event"): void;
  (e: "delete-event"): void;
}>();

const props = defineProps<{
  open: boolean;
  details: ConcertDetailsDto | null;
  error: string | null;
}>();

const { open, details, error } = toRefs(props);

const sortedBands = computed(() => {
  if (!details.value) return [];
  return [...details.value.bands].sort((a, b) => {
    const orderA = a.runningOrder ?? -Infinity;
    const orderB = b.runningOrder ?? -Infinity;
    if (orderA === orderB) {
      return a.name.localeCompare(b.name);
    }
    return orderB - orderA;
  });
});

const mainActs = computed(() => sortedBands.value.filter((b) => b.mainAct));
const supporters = computed(() => sortedBands.value.filter((b) => !b.mainAct));
const mainActTitle = computed(() => (mainActs.value.length === 1 ? "Main Act" : "Main Acts"));
const supportersTitle = computed(() =>
  supporters.value.length === 1 ? "Supporter" : "Supporters"
);

type EventBandEntry = ConcertDetailsDto["bands"][number];

const setlistOpen = ref(false);
const setlistEditOpen = ref(false);
const setlistBand = ref<EventBandEntry | null>(null);
const setlistDraft = ref("");
const setlistError = ref<string | null>(null);
const setlistSaving = ref(false);

const setlistDisplay = computed(() =>
  normalizeSetlistLines(setlistBand.value?.setlist ?? "").map((line) =>
    line.replace(/^\s*\d+[\.\)]\s*/, "")
  )
);
const setlistDate = computed(() => {
  if (!details.value?.date) return "";
  return details.value.date.slice(0, 10);
});

function starFillValue(starIndex: number, rating: number) {
  const value = Math.max(0, Math.min(10, rating));
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}

function openSetlist(band: EventBandEntry) {
  setlistBand.value = band;
  setlistDraft.value = stripSetlistNumbers(band.setlist ?? "");
  setlistError.value = null;
  setlistEditOpen.value = false;
  setlistOpen.value = true;
}

function closeSetlist() {
  setlistOpen.value = false;
  setlistEditOpen.value = false;
  setlistBand.value = null;
  setlistDraft.value = "";
  setlistError.value = null;
}

function normalizeSetlistLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function stripSetlistNumbers(text: string) {
  return normalizeSetlistLines(text)
    .map((line) => line.replace(/^\s*\d+[\.\)]\s*/, ""))
    .join("\n");
}

function buildNumberedSetlist(text: string) {
  const lines = normalizeSetlistLines(text).map((line) =>
    line.replace(/^\s*\d+[\.\)]\s*/, "")
  );
  return lines.map((line, index) => `${index + 1}. ${line}`).join("\n");
}

function hasSetlist(band: EventBandEntry) {
  return normalizeSetlistLines(band.setlist ?? "").length > 0;
}

function startEditSetlist() {
  if (!setlistBand.value) return;
  setlistDraft.value = stripSetlistNumbers(setlistBand.value.setlist ?? "");
  setlistError.value = null;
  setlistEditOpen.value = true;
}

function cancelEditSetlist() {
  setlistEditOpen.value = false;
  setlistError.value = null;
  if (setlistBand.value) {
    setlistDraft.value = stripSetlistNumbers(setlistBand.value.setlist ?? "");
  } else {
    setlistDraft.value = "";
  }
}

async function saveSetlist() {
  if (!details.value || !setlistBand.value) return;
  if (!setlistBand.value.eventBandId) {
    setlistError.value = "Missing event band id for setlist update.";
    return;
  }

  const normalized = buildNumberedSetlist(setlistDraft.value);

  setlistSaving.value = true;
  setlistError.value = null;
  try {
    await updateEventBand(setlistBand.value.eventBandId, {
      event_id: details.value.id,
      band_id: setlistBand.value.id,
      setlist: normalized,
      rating: setlistBand.value.rating ?? null,
      mainAct: Boolean(setlistBand.value.mainAct),
      runningOrder: setlistBand.value.runningOrder ?? null,
    });
    setlistBand.value.setlist = normalized;
    setlistEditOpen.value = false;
    emit("refresh-details");
  } catch (e: any) {
    setlistError.value = e?.message ?? "Failed to save setlist.";
  } finally {
    setlistSaving.value = false;
  }
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
}

.modal {
  width: min(860px, 100%);
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.title .name {
  font-size: 25px;
  font-weight: 700;
  color: var(--text);
}

.meta {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.meta-sep {
  color: rgba(0, 0, 0, 0.3);
}

.meta-link {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: #0b4da2;
  text-decoration: underline;
  cursor: pointer;
}

.star-readonly {
  display: inline-flex;
  gap: 4px;
}

.star-icon {
  position: relative;
  font-size: 16px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.2);
}

.star-icon::after {
  content: "\2605";
  position: absolute;
  inset: 0;
  width: var(--fill, 0%);
  overflow: hidden;
  color: #f5a623;
}

.close {
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.band-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
}

.section-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.participants {
  padding-left: 16px;
  list-style: disc;
}

.band-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
  padding-left: 14px;
}

.band-item::before {
  content: "\2022";
  position: absolute;
  left: 0;
  color: currentColor;
  opacity: 0.7;
}

.band-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.band-link {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: #0b4da2;
  text-decoration: underline;
  cursor: pointer;
  text-align: left;
}

.band-rating {
  min-width: 36px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  text-align: center;
  font-size: 12px;
  color: var(--text);
}

.setlist-button {
  appearance: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;
  color: inherit;
}

.band-actions .setlist-button.setlist-ready {
  border-color: #2e7d32;
}

:global(body.dark) .band-actions .setlist-button.setlist-ready {
  border-color: #6fdc8c;
}

.setlist-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.muted {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}

.error {
  grid-column: 1 / -1;
  border: 1px solid rgba(180, 0, 0, 0.35);
  background: rgba(180, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 10px;
}

.modal-footer {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.secondary {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.primary {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.danger {
  border: 1px solid rgba(180, 0, 0, 0.4);
  background: rgba(180, 0, 0, 0.08);
  color: #7a0b0b;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.setlist-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  z-index: 10;
}

.setlist-modal {
  width: min(720px, 100%);
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
  color: var(--text);
}

.setlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.setlist-title {
  font-size: 25px;
  font-weight: 700;
  color: var(--text);
}

.setlist-sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.setlist-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setlist-section {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
}

.setlist-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.setlist-list {
  margin: 0;
  padding-left: 18px;
}

.setlist-input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
}

.setlist-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
}

.setlist-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 720px) {
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .close {
    align-self: flex-end;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .secondary,
  .danger {
    width: 100%;
  }

  .setlist-modal {
    width: 100%;
  }

  .setlist-actions {
    flex-direction: column;
  }

  .primary {
    width: 100%;
  }
}
</style>



