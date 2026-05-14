<template>
  <div class="relative" ref="dropdownRef">
    <!-- Nút hiển thị -->
    <button type="button" @click="isOpen = !isOpen"
        class="flex items-center justify-between w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left text-slate-900 font-medium">
      <span class="truncate block w-full pr-2">{{ displayValue }}</span>
      <svg class="h-5 w-5 text-gray-900 flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Menu xổ xuống -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto overflow-x-hidden">
        
        <!-- Tùy chọn mặc định (Tất cả) -->
        <div 
          @click="selectItem('')"
          class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-500 hover:text-white transition-colors text-gray-900"
        >
          {{ placeholder }}
        </div>
        
        <!-- Danh sách các nhóm -->
        <div v-for="(group, gIndex) in groups" :key="gIndex" class="border-t border-gray-100">
          
          <!-- Tiêu đề nhóm (Group Header) -->
          <div @click="toggleGroup(group.group)" 
               class="flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-900 cursor-pointer hover:bg-gray-500 hover:text-white transition-colors sticky top-0 z-10 bg-white border-b border-gray-50 group/header">
            <span>{{ group.group }} <span class="text-gray-400 font-normal ml-1 group-hover/header:text-gray-100">({{ group.items.length }})</span></span>
            <svg class="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover/header:text-white" :class="{ 'rotate-180': expandedGroups[group.group] }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Các phần tử trong nhóm (Group Items) -->
          <div v-show="expandedGroups[group.group]" class="py-1">
            <div 
              v-for="item in group.items" 
              :key="item"
              @click="selectItem(item)"
              class="px-4 py-1.5 text-sm cursor-pointer transition-colors text-gray-900 hover:bg-gray-500 hover:text-white"
            >
              <div class="flex items-center">
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue';
import type { PropType } from 'vue';

export interface DropdownGroup {
  group: string;
  items: string[];
}

export default defineComponent({
  name: 'AppGroupedSelect',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    groups: {
      type: Array as PropType<DropdownGroup[]>,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Tất cả'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const dropdownRef = ref<HTMLElement | null>(null);
    const expandedGroups = ref<Record<string, boolean>>({});

    const displayValue = ref(props.placeholder);

    // Mở nhóm đầu tiên hoặc nhóm có chứa item đang được chọn
    watch(() => props.groups, (newGroups) => {
      newGroups.forEach(g => {
        if (expandedGroups.value[g.group] === undefined) {
          // Mặc định đóng tất cả
          expandedGroups.value[g.group] = false;
        }
        // Nếu có giá trị đang chọn, tự động mở nhóm chứa giá trị đó
        if (props.modelValue && g.items.includes(props.modelValue)) {
          expandedGroups.value[g.group] = true;
        }
      });
    }, { immediate: true, deep: true });

    watch(() => props.modelValue, (newVal) => {
      displayValue.value = newVal || props.placeholder;
      
      // Auto expand group if value matches
      if (newVal) {
        for (const g of props.groups) {
          if (g.items.includes(newVal)) {
            expandedGroups.value[g.group] = true;
          }
        }
      }
    }, { immediate: true });

    const toggleGroup = (groupName: string) => {
      const isCurrentlyExpanded = expandedGroups.value[groupName];
      // Thu gọn tất cả các nhóm khác
      Object.keys(expandedGroups.value).forEach(key => {
        expandedGroups.value[key] = false;
      });
      // Đảo trạng thái của nhóm vừa bấm
      expandedGroups.value[groupName] = !isCurrentlyExpanded;
    };

    const selectItem = (item: string) => {
      emit('update:modelValue', item);
      isOpen.value = false;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });

    return {
      isOpen,
      dropdownRef,
      expandedGroups,
      displayValue,
      toggleGroup,
      selectItem
    };
  }
});
</script>
