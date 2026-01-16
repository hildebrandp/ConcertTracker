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
          <div v-if="!isEditing" class="details">
            <div class="detail">
              <div class="detail-label">Rating</div>
              <div class="detail-value rating-display">
                <span>{{ band.rating ?? "-" }}</span>
                <div class="star-readonly" v-if="band.rating !== null && band.rating !== undefined">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star-icon"
                    :style="{ '--fill': `${starFillValue(star, band.rating)}%` }"
                  >
                    ★
                  </span>
                </div>
              </div>
            </div>
            <div class="detail">
              <div class="detail-label">Genre</div>
              <div class="detail-value">{{ band.genre || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Origin country</div>
              <div class="detail-value">{{ band.origin_country || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Plex Link</div>
              <div class="detail-value">
                <a
                  v-if="band.link"
                  :href="normalizeUrl(band.link)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ band.link }}
                </a>
                <span v-else>-</span>
              </div>
            </div>
            <div class="detail full">
              <div class="detail-label">Website</div>
              <div class="detail-value">
                <a
                  v-if="band.website"
                  :href="normalizeUrl(band.website)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ band.website }}
                </a>
                <span v-else>-</span>
              </div>
            </div>
            <div class="detail full">
              <div class="detail-label">Notes</div>
              <div class="detail-value">{{ band.notes || "-" }}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Seen live</div>
              <div class="detail-value">
                <button
                  type="button"
                  class="link-button"
                  :disabled="!seenCount"
                  @click="showBandActs"
                >
                  {{ seenCount }} time{{ seenCount === 1 ? "" : "s" }}
                </button>
              </div>
            </div>
          </div>

          <form v-else class="grid" @submit.prevent="submit">
            <div class="field">
              <label for="band-name">Name</label>
              <input
                id="band-name"
                v-model.trim="form.name"
                type="text"
                required
              />
            </div>
          <div class="field">
            <label for="band-genre">Genre</label>
            <input id="band-genre" v-model.trim="form.genre" type="text" list="band-genre-options" />
          </div>
          <div class="field">
            <label for="band-origin">Origin country</label>
            <input
              id="band-origin"
              v-model.trim="form.origin_country"
              type="text"
              list="band-origin-options"
            />
          </div>
            <div class="field">
              <label for="band-rating">Rating</label>
              <div
                class="star-rating"
                role="radiogroup"
                aria-label="Band rating"
                @mouseleave="hoverRating = null"
              >
                <span v-for="star in 5" :key="star" class="star">
                  <span
                    class="star-icon"
                    :style="{ '--fill': `${starFill(star)}%` }"
                  >
                    ★
                  </span>
                  <button
                    type="button"
                    class="half left"
                    :aria-label="`Set rating to ${star * 2 - 1}`"
                    @click="setRating(star * 2 - 1)"
                    @mouseenter="setHover(star * 2 - 1)"
                  ></button>
                  <button
                    type="button"
                    class="half right"
                    :aria-label="`Set rating to ${star * 2}`"
                    @click="setRating(star * 2)"
                    @mouseenter="setHover(star * 2)"
                  ></button>
                </span>
                <button type="button" class="star-clear" @click="setRating(0)">
                  Clear
                </button>
              </div>
              <div class="rating-hint">0-10 (half stars)</div>
            </div>
            <div class="field full">
              <label for="band-link">Plex Link</label>
              <input id="band-link" v-model.trim="form.link" type="text" />
            </div>
            <div class="field full">
              <label for="band-website">Website</label>
              <input id="band-website" v-model.trim="form.website" type="text" />
            </div>
            <div class="field full">
              <label for="band-notes">Notes</label>
              <textarea id="band-notes" v-model.trim="form.notes" rows="3" />
            </div>
          </form>
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

const ratingValue = computed(() => {
  const base = hoverRating.value ?? Number(form.rating);
  if (!Number.isFinite(base)) {
    return 0;
  }
  return Math.max(0, Math.min(10, base));
});

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

function setRating(value: number) {
  if (value <= 0) {
    form.rating = "";
    return;
  }
  form.rating = String(value);
}

function setHover(value: number) {
  hoverRating.value = value;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function starFill(starIndex: number) {
  const value = ratingValue.value;
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
}

function starFillValue(starIndex: number, rating: number) {
  const value = Math.max(0, Math.min(10, rating));
  const starValue = Math.max(0, Math.min(2, value - (starIndex - 1) * 2));
  return (starValue / 2) * 100;
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

.details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail.full {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.detail-value {
  font-size: 14px;
}

.detail-value a {
  color: #0b4da2;
  text-decoration: underline;
}

.link-button {
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  color: #0b4da2;
  text-decoration: underline;
  cursor: pointer;
}

.link-button:disabled {
  color: rgba(0, 0, 0, 0.4);
  text-decoration: none;
  cursor: default;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.star-readonly {
  display: flex;
  gap: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.full {
  grid-column: 1 / -1;
}

.field input,
.field textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 14px;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.star {
  position: relative;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  position: relative;
  font-size: 20px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.2);
}

.star-icon::after {
  content: "★";
  position: absolute;
  inset: 0;
  width: var(--fill, 0%);
  overflow: hidden;
  color: #f5a623;
}

.half {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
}

.half.left {
  left: 0;
}

.half.right {
  right: 0;
}

.star-clear {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 999px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.rating-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
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
  .details {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: 1fr;
  }

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
