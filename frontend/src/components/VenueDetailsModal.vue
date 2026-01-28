<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">
          <div class="name">{{ venue?.name ?? "Venue details" }}</div>
        </div>
        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <div class="modal-body">
        <div v-if="!venue" class="muted">Loading...</div>
        <div v-else>
          <VenueDetailsDisplay v-if="!isEditing" :venue="venue" />
          <VenueDetailsForm
            v-else
            :form="form"
            :venue-type-options="venueTypeOptions"
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
            :disabled="!venue"
            @click="$emit('delete-venue')"
          >
            Delete venue
          </button>
          <button
            v-if="!isEditing"
            type="button"
            class="primary"
            :disabled="!venue"
            @click="isEditing = true"
          >
            Update venue
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { ConcertVenueDetailsDto, CreateConcertVenueDto } from "../api/types";
import VenueDetailsDisplay from "./venue-details/VenueDetailsDisplay.vue";
import VenueDetailsForm from "./venue-details/VenueDetailsForm.vue";

const props = defineProps<{
  open: boolean;
  venue: ConcertVenueDetailsDto | null;
  error: string | null;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", payload: CreateConcertVenueDto): void;
  (e: "delete-venue"): void;
}>();

const form = reactive({
  name: "",
  type: "",
  indoor_outdoor: "",
  capacity: "",
  rating: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  latitude: "",
  longitude: "",
  notes: "",
});

const isEditing = ref(false);
const hoverRating = ref<number | null>(null);

const venueTypeOptions = [
  "Arena",
  "Theater",
  "Club",
  "Concert Hall",
  "Auditorium",
  "Studio",
  "Stadium",
  "Amphitheater",
  "Park",
  "Plaza",
  "Beach",
  "Festival Grounds",
  "Fairgrounds",
  "Camping Site",
  "Church or Cathedral",
  "Cultural Center",
  "Rooftop",
  "Barn",
  "Cruise Ship",
  "Museum or Gallery",
  "Warehouse",
  "Castle or Fortress",
  "Desert",
  "Underground Cave",
  "Airfield",
];

watch(
  () => [props.open, props.venue],
  () => {
    if (!props.open || !props.venue) {
      return;
    }

    isEditing.value = false;
    form.name = props.venue.name ?? "";
    form.type = props.venue.type ?? "";
    form.indoor_outdoor = props.venue.indoor_outdoor ?? "";
    form.capacity = props.venue.capacity !== null && props.venue.capacity !== undefined
      ? String(props.venue.capacity)
      : "";
    form.rating = props.venue.rating !== null && props.venue.rating !== undefined
      ? String(props.venue.rating)
      : "";
    form.website = props.venue.website ?? "";
    form.address = props.venue.address ?? "";
    form.city = props.venue.city ?? "";
    form.state = props.venue.state ?? "";
    form.country = props.venue.country ?? "";
    form.postal_code = props.venue.postal_code !== null && props.venue.postal_code !== undefined
      ? String(props.venue.postal_code)
      : "";
    form.latitude = props.venue.latitude ?? "";
    form.longitude = props.venue.longitude ?? "";
    form.notes = props.venue.notes ?? "";
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
    type: valueOrUndefined(form.type),
    indoor_outdoor: valueOrUndefined(form.indoor_outdoor) as
      | "indoor"
      | "outdoor"
      | "mixed"
      | undefined,
    capacity: numberOrUndefined(form.capacity),
    rating: numberOrUndefined(form.rating),
    website: valueOrUndefined(form.website),
    address: valueOrUndefined(form.address),
    city: valueOrUndefined(form.city),
    state: valueOrUndefined(form.state),
    country: valueOrUndefined(form.country),
    postal_code: numberOrUndefined(form.postal_code),
    latitude: valueOrUndefined(form.latitude),
    longitude: valueOrUndefined(form.longitude),
    notes: valueOrUndefined(form.notes),
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
  width: min(820px, 100%);
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
  font-size: 16px;
  font-weight: 700;
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
