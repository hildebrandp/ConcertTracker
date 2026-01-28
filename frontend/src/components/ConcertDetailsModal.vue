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
        <ConcertDetailsBands
          :details="details"
          :main-acts="mainActs"
          :supporters="supporters"
          :main-act-title="mainActTitle"
          :supporters-title="supportersTitle"
          :has-setlist="hasSetlist"
          @show-band="$emit('show-band', $event)"
          @open-setlist="openSetlist"
        />

        <ConcertParticipantsPanel
          :details="details"
          :available-participants="availableParticipants"
          :participant-name="participantName"
          :participant-adding="participantAdding"
          :participant-error="participantError"
          :participant-removing="participantRemoving"
          @update:participantName="participantName = $event"
          @add-participant="addParticipant"
          @remove-participant="removeParticipant"
        />

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
  <SetlistModal
    :open="setlistOpen"
    :band="setlistBand"
    :setlist-display="setlistDisplay"
    :setlist-date="setlistDate"
    :setlist-edit-open="setlistEditOpen"
    :setlist-draft="setlistDraft"
    :setlist-saving="setlistSaving"
    :setlist-error="setlistError"
    @close="closeSetlist"
    @start-edit="startEditSetlist"
    @cancel-edit="cancelEditSetlist"
    @save="saveSetlist"
    @update:setlistDraft="setlistDraft = $event"
  />
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";
import type { ConcertDetailsDto } from "../api/types";
import type { ConcertParticipantDto } from "../api/types";
import ConcertDetailsBands from "./concert-details/ConcertDetailsBands.vue";
import ConcertParticipantsPanel from "./concert-details/ConcertParticipantsPanel.vue";
import SetlistModal from "./concert-details/SetlistModal.vue";
import {
  createConcertParticipant,
  createEventParticipant,
  deleteEventParticipant,
  getConcertParticipants,
  updateEventBand,
} from "../api/concertsApi";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "show-venue", venueId: number): void;
  (e: "show-band", bandId: number): void;
  (e: "refresh-details"): void;
  (e: "update-event"): void;
  (e: "delete-event"): void;
  (e: "participant-added", payload: {
    eventId: number;
    participantId: number;
    participantName: string;
    isNew: boolean;
  }): void;
  (e: "participant-removed", payload: { eventId: number; participantId: number }): void;
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
const participants = ref<ConcertParticipantDto[]>([]);
const participantAdding = ref(false);
const participantName = ref("");
const participantError = ref<string | null>(null);
const participantRemoving = ref<Record<number, boolean>>({});

const setlistDisplay = computed(() =>
  normalizeSetlistLines(setlistBand.value?.setlist ?? "").map((line) =>
    line.replace(/^\s*\d+[\.\)]\s*/, "")
  )
);
const setlistDate = computed(() => {
  if (!details.value?.date) return "";
  return details.value.date.slice(0, 10);
});

const availableParticipants = computed(() => {
  const existing = new Set(
    (details.value?.participatedWith ?? []).map((entry) => entry.id)
  );
  return participants.value
    .filter((participant) => !existing.has(participant.id))
    .sort((a, b) => a.name.localeCompare(b.name));
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

watch(
  open,
  async (isOpen) => {
    if (!isOpen) return;
    participantError.value = null;
    try {
      participants.value = await getConcertParticipants();
    } catch (e: any) {
      participantError.value = e?.message ?? "Failed to load participants.";
    }
  },
  { immediate: true }
);

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
    const payload: {
      event_id: number;
      band_id: number;
      setlist?: string | null;
      rating?: number;
      mainAct?: boolean;
      runningOrder?: number | null;
    } = {
      event_id: details.value.id,
      band_id: setlistBand.value.id,
      setlist: normalized,
      mainAct: Boolean(setlistBand.value.mainAct),
      runningOrder: setlistBand.value.runningOrder ?? null,
    };
    if (setlistBand.value.rating !== null && setlistBand.value.rating !== undefined) {
      payload.rating = setlistBand.value.rating;
    }
    await updateEventBand(setlistBand.value.eventBandId, payload);
    setlistBand.value.setlist = normalized;
    setlistEditOpen.value = false;
    emit("refresh-details");
  } catch (e: any) {
    setlistError.value = e?.message ?? "Failed to save setlist.";
  } finally {
    setlistSaving.value = false;
  }
}

async function addParticipant() {
  if (!details.value) return;
  const name = participantName.value.trim();
  if (!name) {
    participantError.value = "Enter a participant name.";
    return;
  }

  const alreadyAdded = details.value.participatedWith.some(
    (entry) => entry.displayName.toLowerCase() === name.toLowerCase()
  );
  if (alreadyAdded) {
    participantError.value = "Participant already added.";
    return;
  }

  participantAdding.value = true;
  participantError.value = null;

  try {
    const existing = participants.value.find(
      (participant) => participant.name.toLowerCase() === name.toLowerCase()
    );
    const participantId =
      existing?.id ??
      (await createConcertParticipant({
        name,
        notes: "",
      }));
    const isNew = !existing;
    if (isNew) {
      participants.value.push({ id: participantId, name, notes: "" });
    }
    await createEventParticipant({
      participant_id: participantId,
      event_id: details.value.id,
    });
    participantName.value = "";
    emit("participant-added", {
      eventId: details.value.id,
      participantId,
      participantName: name,
      isNew,
    });
    emit("refresh-details");
  } catch (e: any) {
    participantError.value = e?.message ?? "Failed to add participant.";
  } finally {
    participantAdding.value = false;
  }
}

async function removeParticipant(participant: { id: number; displayName: string }) {
  if (!details.value) return;
  const ok = window.confirm(
    `Remove "${participant.displayName}" from this event?`
  );
  if (!ok) return;
  participantRemoving.value = {
    ...participantRemoving.value,
    [participant.id]: true,
  };
  participantError.value = null;
  try {
    await deleteEventParticipant({
      participant_id: participant.id,
      event_id: details.value.id,
    });
    emit("participant-removed", {
      eventId: details.value.id,
      participantId: participant.id,
    });
    emit("refresh-details");
  } catch (e: any) {
    participantError.value = e?.message ?? "Failed to remove participant.";
  } finally {
    participantRemoving.value = {
      ...participantRemoving.value,
      [participant.id]: false,
    };
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

.primary {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.secondary {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
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

  .danger {
    width: 100%;
  }
}
</style>



