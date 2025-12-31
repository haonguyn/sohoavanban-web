<template>
    <transition name="fade">
        <div v-if="isLoading"
            class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <!-- Chỗ chứa animation -->
            <div class="flex flex-col items-center justify-center">
                <!-- Nội dung dots -->
                <div class="flex space-x-3">
                    <div class="w-4 h-4 bg-white rounded-full animate-custom-pulse"></div>
                    <div class="w-4 h-4 bg-white rounded-full animate-custom-pulse" style="animation-delay: 0.2s"></div>
                    <div class="w-4 h-4 bg-white rounded-full animate-custom-pulse" style="animation-delay: 0.4s"></div>
                </div>
            </div>
            <div class="mt-6 text-white font-light tracking-[0.2em] uppercase text-sm animate-pulse">
                Đang tải dữ liệu...
            </div>
        </div>
    </transition>
</template>
<style>
@keyframes custom-pulse {

    0%,
    100% {
        transform: scale(0);
        opacity: 0.5;
    }

    50% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-custom-pulse {
    animation: custom-pulse 1.2s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LoadingComponent',
    data() {
        return {
            isLoading: false as boolean
        }
    },
    methods: {
        show() {
            this.isLoading = true
        },
        hide() {
            this.isLoading = false
        },
        onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && this.isLoading) {
                this.isLoading = false
            }
        }
    },
    mounted() {
        window.addEventListener('keydown', this.onKeyDown)
    },
    unmounted() {
        window.removeEventListener('keydown', this.onKeyDown)
    }
})
</script>
