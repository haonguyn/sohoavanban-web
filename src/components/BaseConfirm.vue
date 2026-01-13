<template>
    <div v-if="confirm.visible" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-[2px] transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div
                    class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:w-full sm:max-w-sm ring-1 ring-black/5">

                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="flex flex-col items-center">
                            <div
                                class="mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 mb-4 ring-8 ring-blue-50/50">
                                <svg class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                            </div>
                            <div class="text-center">
                                <h3 class="text-xl font-bold leading-6 text-gray-900" id="modal-title">
                                    Thông báo
                                </h3>
                                <div class="mt-2">
                                    <p class="text-[15px] leading-relaxed text-gray-500">
                                        {{ confirm.message }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50/80 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100">
                        <button @click="confirm.confirm" type="button"
                            class="inline-flex w-full justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:shadow-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-full">
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useConfirmStore } from '../store/confirmStore';
const confirm = useConfirmStore();
</script>