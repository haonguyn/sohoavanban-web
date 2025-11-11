<template>
    <Header />
    <div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="container mx-auto">
            <!-- Tiêu đề trang -->
            <header class="mb-6 text-center">
                <h1 class="text-3xl font-bold text-gray-900">
                    Trích xuất Văn bản (OCR)
                </h1>
                <p class="text-lg text-gray-600 mt-1 max-w-2xl mx-auto">
                    Tải lên hình ảnh hoặc file PDF để chuyển đổi thành văn bản
                    có thể chỉnh sửa.
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- CỘT TẢI LÊN -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">
                        Tải lên tệp của bạn
                    </h2>

                    <!-- Vùng kéo thả -->
                    <div
                        @dragover.prevent="onDragOver"
                        @dragleave.prevent="onDragLeave"
                        @drop.prevent="onDrop"
                        :class="{ 'border-blue-500 bg-blue-50': isDragging }"
                        class="flex justify-center items-center w-full h-64 px-6 py-10 border-2 border-gray-300 border-dashed rounded-md transition-colors"
                    >
                        <div class="text-center">
                            <svg
                                class="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h4"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <p class="mt-2 text-sm text-gray-600">
                                Kéo thả file vào đây
                            </p>
                            <p class="text-xs text-gray-500">hoặc</p>
                            <label
                                for="file-upload"
                                class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                                <span>chọn một tệp</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    class="sr-only"
                                    @change="onFileSelect"
                                />
                            </label>
                            <p class="text-xs text-gray-500 mt-1">
                                PNG, JPG, PDF (tối đa 10MB)
                            </p>
                        </div>
                    </div>

                    <!-- Hiển thị file đã chọn -->
                    <div v-if="selectedFile" class="mt-4">
                        <p class="text-sm font-medium text-gray-700">
                            Tệp đã chọn:
                        </p>
                        <div
                            class="flex justify-between items-center bg-gray-50 p-3 rounded-md mt-1"
                        >
                            <span class="text-sm text-gray-900 truncate">{{
                                selectedFile.name
                            }}</span>
                            <button
                                @click="clearFile"
                                class="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>

                    <!-- Nút bắt đầu OCR -->
                    <button
                        @click="startOCR"
                        :disabled="!selectedFile || isLoading"
                        class="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <span v-if="!isLoading">Bắt đầu trích xuất</span>
                        <span v-else class="flex items-center justify-center">
                            <svg
                                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Đang xử lý...
                        </span>
                    </button>
                </div>

                <!-- CỘT KẾT QUẢ -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-gray-800">
                            Kết quả trích xuất
                        </h2>
                        <button
                            @click="copyText"
                            :disabled="!extractedText"
                            class="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                        >
                            Sao chép
                        </button>
                    </div>

                    <textarea
                        v-model="extractedText"
                        placeholder="Văn bản được trích xuất sẽ xuất hiện ở đây..."
                        readonly
                        class="w-full h-96 p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";

export default defineComponent({
    name: "OcrUpload",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            isDragging: false,
            selectedFile: null as File | null,
            isLoading: false,
            extractedText: "",
        };
    },

    methods: {
        onDragOver() {
            this.isDragging = true;
        },

        onDragLeave() {
            this.isDragging = false;
        },

        onDrop(event: DragEvent) {
            this.isDragging = false;
            const file = event.dataTransfer?.files[0];
            if (file) {
                this.selectedFile = file;
            }
        },

        onFileSelect(event: Event) {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                this.selectedFile = file;
            }
        },

        clearFile() {
            this.selectedFile = null;
        },

        startOCR() {
            if (!this.selectedFile) return;

            this.isLoading = true;
            this.extractedText = "";

            // Giả lập quá trình gọi API OCR
            setTimeout(() => {
                this.extractedText = `Đây là nội dung văn bản được trích xuất từ tệp "${this.selectedFile?.name}".\n\nBản demo này giả lập quá trình OCR thành công.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. ...`;
                this.isLoading = false;
            }, 2500);
        },

        copyText() {
            if (!this.extractedText) return;

            const textArea = document.createElement("textarea");
            textArea.value = this.extractedText;
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand("copy");
                alert("Đã sao chép văn bản!");
            } catch (err) {
                console.error("Không thể sao chép:", err);
                alert("Không thể sao chép văn bản.");
            }

            document.body.removeChild(textArea);
        },
    },
});
</script>
