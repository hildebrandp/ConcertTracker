<template>
  <div class="participants-panel">
    <div class="section">
      <div class="section-title">Participated with</div>
      <ul v-if="details" class="list participants">
        <li v-for="p in details.participatedWith" :key="p.id" class="participant-item">
          <span>{{ p.displayName }}</span>
          <button
            type="button"
            class="participant-remove"
            :disabled="participantRemoving[p.id]"
            @click="$emit('remove-participant', p)"
          >
            {{ participantRemoving[p.id] ? "Removing..." : "Remove" }}
          </button>
        </li>
        <li v-if="details.participatedWith.length === 0" class="muted">
          No participants recorded.
        </li>
      </ul>
      <div v-else class="muted">Loading...</div>

      <form v-if="details" class="participant-form" @submit.prevent="$emit('add-participant')">
        <label class="participant-label" for="participant-name">Add participant</label>
        <div class="participant-input">
          <input
            id="participant-name"
            v-model.trim="participantNameModel"
            list="participant-options"
            type="text"
            placeholder="Start typing a name..."
            :disabled="participantAdding"
          />
          <button type="submit" class="secondary" :disabled="participantAdding">
            {{ participantAdding ? "Adding..." : "Add" }}
          </button>
        </div>
        <datalist id="participant-options">
          <option v-for="option in availableParticipants" :key="option.id" :value="option.name">
            {{ option.name }}
          </option>
        </datalist>
        <div v-if="participantError" class="error-inline">{{ participantError }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ConcertDetailsDto, ConcertParticipantDto } from "../../api/types";

const props = defineProps<{
  details: ConcertDetailsDto | null;
  participantName: string;
  participantAdding: boolean;
  participantError: string | null;
  participantRemoving: Record<number, boolean>;
  availableParticipants: ConcertParticipantDto[];
}>();

const emit = defineEmits<{
  (e: "update:participantName", value: string): void;
  (e: "add-participant"): void;
  (e: "remove-participant", participant: { id: number; displayName: string }): void;
}>();

const participantNameModel = computed({
  get: () => props.participantName,
  set: (value) => emit("update:participantName", value),
});
</script>

<style scoped src="./concertDetails.css"></style>
