<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">
          <div class="name">{{ band?.name ?? "Band details" }}</div>
        </div>
        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <div class="modal-body">
        <div v-if="!band" class="muted">Loading...</div>
        <div v-else>
          <BandDetailsDisplay
            v-if="!isEditing"
            :band="band"
            :seen-count="seenCount"
            @show-acts="showBandActs"
          />
          <BandDetailsForm
            v-else
            :form="form"
            :hover-rating="hoverRating"
            @update:hoverRating="hoverRating = $event"
            @submit="submit"
          />
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div class="modal-footer">
          <button
            v-if="!isEditing"
            type="button"
            class="danger"
            :disabled="!band"
            @click="$emit('delete-band')"
          >
            Delete band
          </button>
          <button
            v-if="!isEditing"
            type="button"
            class="primary"
            :disabled="!band"
            @click="isEditing = true"
          >
            Update band
          </button>
          <template v-else>
            <button type="button" class="ghost" @click="isEditing = false">
              Cancel
            </button>
            <button type="button" class="primary" :disabled="saving || !form.name.trim()" @click="submit">
              {{ saving ? "Saving..." : "Save changes" }}
            </button>
          </template>
        </div>

        <datalist id="band-genre-options">
          <option v-for="genre in bandGenreOptions" :key="genre" :value="genre" />
        </datalist>
        <datalist id="band-origin-options">
          <option v-for="origin in bandOriginOptions" :key="origin" :value="origin" />
        </datalist>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type {
  ConcertBandDetailsDto,
  ConcertBandDto,
  CreateConcertBandDto,
  EventBandSummaryDto,
} from "../api/types";
import BandDetailsDisplay from "./band-details/BandDetailsDisplay.vue";
import BandDetailsForm from "./band-details/BandDetailsForm.vue";

const props = defineProps<{
  open: boolean;
  band: ConcertBandDetailsDto | null;
  error: string | null;
  saving: boolean;
  allBands: ConcertBandDetailsDto[] | ConcertBandDto[];
  allActs: EventBandSummaryDto[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", payload: CreateConcertBandDto): void;
  (e: "show-acts", bandName: string): void;
  (e: "delete-band"): void;
}>();

const form = reactive({
  name: "",
  genre: "",
  origin_country: "",
  rating: "",
  notes: "",
  link: "",
  website: "",
});

const isEditing = ref(false);

const bandGenreOptions = computed(() => {
  const unique = new Map<string, string>();
  for (const band of props.allBands) {
    const raw = toText((band as any).genre).trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, raw);
    }
  }
  return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
});

const bandOriginOptions = computed(() => {
  const unique = new Map<string, string>();
  for (const band of props.allBands) {
    const raw = toText((band as any).origin_country).trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, raw);
    }
  }
  return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
});

const seenCount = computed(() => {
  if (!props.band) return 0;
  const target = props.band.name.trim().toLowerCase();
  if (!target) return 0;
  return props.allActs.filter(
    (entry) => entry.band_name.trim().toLowerCase() === target
  ).length;
});

function showBandActs() {
  if (!props.band) return;
  emit("show-acts", props.band.name);
}
const hoverRating = ref<number | null>(null);

watch(
  () => [props.open, props.band],
  () => {
    if (!props.open || !props.band) {
      return;
    }

    isEditing.value = false;
    form.name = props.band.name ?? "";
    form.genre = props.band.genre ?? "";
    form.origin_country = props.band.origin_country ?? "";
    form.rating = props.band.rating !== null && props.band.rating !== undefined
      ? String(props.band.rating)
      : "";
    form.notes = props.band.notes ?? "";
    form.link = props.band.link ?? "";
    form.website = props.band.website ?? "";
  },
  { immediate: true }
);

function toText(value: unknown) {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : String(value);
}

function valueOrUndefined(value: unknown) {
  const trimmed = toText(value).trim();
  return trimmed === "" ? undefined : trimmed;
}

function numberOrUndefined(value: unknown) {
  const trimmed = toText(value).trim();
  if (trimmed === "") return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

function submit() {
  if (!isEditing.value) {
    return;
  }
  emit("save", {
    name: form.name.trim(),
    genre: valueOrUndefined(form.genre),
    origin_country: valueOrUndefined(form.origin_country),
    rating: numberOrUndefined(form.rating),
    notes: valueOrUndefined(form.notes),
    link: valueOrUndefined(form.link),
    website: valueOrUndefined(form.website),
  });
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
  width: min(760px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.title .name {
  font-size: 25px;
  font-weight: 700;
}

.meta {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.close {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
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

.ghost {
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

.muted {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}

.error {
  border: 1px solid rgba(180, 0, 0, 0.35);
  background: rgba(180, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 10px;
}

@media (max-width: 720px) {
  .modal-footer {
    flex-direction: column;
  }

  .primary,
  .ghost,
  .danger {
    width: 100%;
  }
}
</style>


