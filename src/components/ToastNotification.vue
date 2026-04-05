<script lang="ts">
import { defineComponent } from 'vue'

interface ToastItem {
  id: number
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export default defineComponent({
  name: 'ToastNotification',
  data() {
    return {
      toasts: [] as ToastItem[],
      nextId: 0
    }
  },
  methods: {
    show(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration = 3000) {
      const id = this.nextId++
      const toast: ToastItem = { id, title, message, type }
      this.toasts.push(toast)
      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }
    },
    success(title: string, message: string, duration = 3000) {
      this.show('success', title, message, duration)
    },
    error(title: string, message: string, duration = 0) { // Lỗi mặc định duration = 0 (tức là không tự đóng)
      this.show('error', title, message, duration)
    },
    warning(title: string, message: string, duration = 5000) {
      this.show('warning', title, message, duration)
    },
    info(title: string, message: string, duration = 3000) {
      this.show('info', title, message, duration)
    },
    remove(id: number) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      <TransitionGroup enter-active-class="transform transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transform transition-all duration-300 ease-in" leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0">
        <div v-for="toast in toasts" :key="toast.id"
          class="pointer-events-auto bg-white shadow-md rounded p-4 flex items-start gap-3 min-w-[300px] max-w-sm"
          :class="{
            'border-l-4 border-green-500': toast.type === 'success',
            'border-l-4 border-red-500': toast.type === 'error',
            'border-l-4 border-yellow-500': toast.type === 'warning',
            'border-l-4 border-blue-500': toast.type === 'info'
          }">

          <i v-if="toast.type === 'success'" class="fa-solid fa-circle-check text-green-500 text-xl mt-0.5"></i>
          <i v-else-if="toast.type === 'error'" class="fa-solid fa-circle-xmark text-red-500 text-xl mt-0.5"></i>
          <i v-else-if="toast.type === 'warning'" class="fa-solid fa-triangle-exclamation text-yellow-500 text-xl mt-0.5"></i>
          <i v-else-if="toast.type === 'info'" class="fa-solid fa-circle-info text-blue-500 text-xl mt-0.5"></i>

          <div class="flex-1">
            <h4 class="font-bold text-gray-900 text-sm">{{ toast.title }}</h4>
            <p class="text-gray-500 text-sm mt-1 mb-0">{{ toast.message }}</p>
          </div>
          
          <button @click="remove(toast.id)" class="text-gray-400 hover:text-gray-800 transition-colors ml-1 mt-0.5">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

      </TransitionGroup>
    </div>
  </Teleport>
</template>