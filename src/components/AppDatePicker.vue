<template>
  <div class="relative w-full group">
    <div class="relative">
      <input
        type="text"
        :value="displayValue"
        readonly
        @click="openPicker"
        :placeholder="placeholder || 'dd-mm-yyyy'"
        :class="[
          'w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer',
          inputClass
        ]"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors pointer-events-none">
        <i class="fas fa-calendar-alt"></i>
      </div>
    </div>
    <!-- Hidden Native Picker -->
    <input
      type="date"
      ref="dateInput"
      :value="modelValue"
      @input="handleInput"
      class="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none -z-10"
      style="visibility: hidden; position: absolute;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { formatDate } from '../utils/fileUtils';

export default defineComponent({
  name: 'AppDatePicker',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'dd-mm-yyyy'
    },
    inputClass: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dateInput = ref<HTMLInputElement | null>(null);

    const displayValue = computed(() => {
      if (!props.modelValue) return '';
      // Ensure we only format if it looks like a date (YYYY-MM-DD)
      if (props.modelValue.includes('-')) {
          return formatDate(props.modelValue);
      }
      return props.modelValue;
    });

    const handleInput = (event: Event) => {
      const val = (event.target as HTMLInputElement).value;
      emit('update:modelValue', val);
    };

    const openPicker = () => {
      if (dateInput.value) {
        // Use modern showPicker if available
        if (typeof (dateInput.value as any).showPicker === 'function') {
           try {
              (dateInput.value as any).showPicker();
           } catch (e) {
              dateInput.value.click();
           }
        } else {
          dateInput.value.click();
        }
      }
    };

    return {
      dateInput,
      displayValue,
      handleInput,
      openPicker
    };
  }
});
</script>

<style scoped>
/* Optional: specific styles if needed */
</style>
