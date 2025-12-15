<template>
    <div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="container mx-auto">
            <!-- Tiêu đề trang -->
            <header class="mb-6 text-center">
                <h1 class="text-3xl font-bold text-gray-900">
                    Trích xuất & Số hóa văn bản (OCR)
                </h1>
                <p class="text-lg text-gray-600 mt-1 max-w-2xl mx-auto">
                    Tải lên tài liệu để hệ thống tự động trích xuất nội dung và thông tin thuộc tính
                </p>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- CỘT TẢI LÊN & FORM (Chiếm 5 phần trên màn hình lớn) -->
                <div class="lg:col-span-5 space-y-6">
                    <!-- Khu vực Tải lên -->
                    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            1. Tải lên tệp nguồn
                        </h2>

                        <!-- Vùng kéo thả -->
                        <div @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
                            :class="{ 'border-blue-600 bg-blue-50': isDragging, 'border-gray-300 bg-gray-50 hover:bg-gray-100': !isDragging }"
                            class="file-upload-area flex justify-center items-center w-full h-40 px-6 border-2 border-dashed rounded-xl transition-all relative">

                            <div v-if="!selectedFile" class="text-center">
                                <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <div class="mt-2 text-sm text-gray-600">
                                    <label for="file-upload"
                                        class="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                                        <span>Chọn tệp tin</span>
                                        <input id="file-upload" name="file-upload" type="file" class="sr-only"
                                            accept=".png,.jpg,.jpeg,.pdf" @change="onFileSelect" />
                                    </label>
                                    hoặc kéo thả vào đây
                                </div>
                                <p class="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                            </div>

                            <div v-else class="w-full h-full flex flex-col justify-center items-center z-10">
                                <div class="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full mb-2">
                                    <span class="text-xs font-semibold text-blue-800 uppercase">{{ fileType }}</span>
                                </div>
                                <p class="text-sm font-medium text-gray-900 truncate max-w-[90%]">{{ selectedFile.name
                                    }}</p>
                                <button @click="clearFile"
                                    class="mt-2 text-xs text-red-500 hover:text-red-700 underline">
                                    Xóa và chọn lại
                                </button>
                            </div>
                        </div>

                        <!-- Nút bắt đầu OCR -->
                        <button @click="startOCR" :disabled="!selectedFile || isLoading" class="w-full mt-4 py-2.5 px-4 rounded-lg shadow-sm text-base font-semibold text-white transition-all
                               bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                               flex items-center justify-center">
                            <span v-if="!isLoading" class="flex items-center">
                                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Phân tích & Trích xuất
                            </span>
                            <span v-else class="flex items-center">
                                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang xử lý AI...
                            </span>
                        </button>
                    </div>

                    <!-- Form Thông tin văn bản (Kết quả OCR điền vào đây) -->
                    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative">
                        <!-- Loading overlay cho form -->
                        <div v-if="isLoading"
                            class="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                            <div class="text-center">
                                <span class="text-sm font-semibold text-blue-600 animate-pulse">Đang điền thông tin tự
                                    động...</span>
                            </div>
                        </div>

                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-bold text-gray-800 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                2. Thông tin thuộc tính
                            </h2>
                            <span v-if="isOcrDone"
                                class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                                ✨ Đã tự động điền
                            </span>
                        </div>

                        <form @submit.prevent="saveDocument" class="space-y-4">
                            <!-- Hàng 1: Tên văn bản (Full width) -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Trích yếu<span
                                        class="text-red-500">*</span></label>
                                <textarea v-model="form.title" rows="2"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="VD: Quyết định về việc..."></textarea>
                            </div>
                            
                            <!-- Hàng 2: Số ký hiệu & Loại văn bản -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Số / Ký hiệu</label>
                                    <input type="text" v-model="form.doc_number"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="123/QĐ-..." />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Loại văn bản</label>
                                        <input type="text" v-model="form.doc_type"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Quyết Định,...." />
                                </div>
                            </div>

                            <!-- Hàng 3: Cơ quan & Người ký -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Cơ quan ban hành</label>
                                    <input type="text" v-model="form.summary"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Người ký</label>
                                    <input type="text" v-model="form.signer"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>

                            <!-- Hàng 4: Số trang & Lĩnh vực (Mới) -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Số trang</label>
                                    <input type="number" v-model="form.pageCount" min="1"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Lĩnh vực</label>
                                    <input type="text" v-model="form.field" placeholder="VD: Y tế, Giáo dục"
                                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>

                            <!-- Hàng 5: Các loại ngày (Quan trọng) -->
                            <div
                                class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Ngày ban hành</label>
                        <input 
                            type="date" 
                            v-model="form.issued_date"
                            class="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm" 
                        />
                    </div>
                                <div>
                                    <label class="block text-xs font-bold text-blue-600 mb-1">Ngày hiệu lực</label>
                                    <input type="date" v-model="form.effective_start_date"
                                        class="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-red-600 mb-1">Ngày hết hiệu lực</label>
                                    <input type="date" v-model="form.effective_end_date"
                                        class="block w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                </div>
                            </div>

                            <!-- Hàng cuối: Link & Submit -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
                                <input type="text" v-model="form.summary"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>

                            <button type="submit"
                                class="w-full inline-flex justify-center py-2.5 px-4 border border-transparent font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-md mt-4">
                                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Lưu vào kho lưu trữ
                            </button>
                        </form>
                    </div>
                </div>

                <!-- CỘT KẾT QUẢ / XEM TRƯỚC (Chiếm 7 phần) -->
                <div
                    class="lg:col-span-7 bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col h-[800px] lg:h-auto lg:min-h-[800px]">
                    <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h2 class="text-xl font-bold text-gray-800">
                            3. {{ extractedText ? 'Nội dung văn bản (OCR Text)' : 'Xem trước tài liệu' }}
                        </h2>
                        <div class="flex space-x-2">
                            <button @click="copyText(extractedText)" :disabled="!extractedText"
                                class="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center transition-colors px-3 py-1 bg-blue-50 rounded-md">
                                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V7" />
                                </svg> Copy
                            </button>
                            <button v-if="extractedText" @click="extractedText = ''"
                                class="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center transition-colors px-3 py-1 bg-gray-50 rounded-md">
                                Xem file gốc
                            </button>
                        </div>
                    </div>

                    <!-- Khu vực hiển thị nội dung -->
                    <div class="flex-1 min-h-0 relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <!-- Trường hợp 1: Đang hiển thị Text OCR -->
                        <textarea v-if="extractedText" v-model="extractedText"
                            placeholder="Văn bản được trích xuất sẽ xuất hiện ở đây..."
                            class="w-full h-full p-6 bg-white font-mono text-sm text-gray-800 focus:outline-none resize-none leading-relaxed"></textarea>

                        <!-- Trường hợp 2: Đang Loading -->
                        <div v-else-if="isLoading"
                            class="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20">
                            <svg class="w-12 h-12 text-blue-600 animate-spin mb-4" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <p class="text-gray-900 font-semibold text-lg">Đang đọc tài liệu...</p>
                            <p class="text-sm text-gray-500 mt-2">Đang nhận diện ký tự và cấu trúc văn bản</p>
                        </div>

                        <!-- Trường hợp 3: Hiển thị Preview File Gốc -->
                        <div v-else-if="filePreviewUrl"
                            class="w-full h-full bg-gray-200 flex justify-center items-center overflow-auto">
                            <iframe v-if="fileType === 'pdf'" :src="filePreviewUrl" title="PDF Preview"
                                class="w-full h-full"></iframe>
                            <img v-else-if="fileType === 'image'" :src="filePreviewUrl" alt="Image Preview"
                                class="max-w-full max-h-full object-contain shadow-lg" />
                        </div>

                        <!-- Trường hợp 4: Chưa có gì -->
                        <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <svg class="w-20 h-20 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="1">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p class="text-lg">Khu vực xem trước văn bản</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">

import { defineComponent } from "vue";
import { processOCR } from "../api/ocrApi";
import { createDocument } from "../api/documentApi";

export default defineComponent({
    name: "OCRComponent",
    data() {
        return {
            isDragging: false,
            selectedFile: null as File | null,
            isLoading: false,
            isOcrDone: false, // Để hiển thị trạng thái đã fill xong
            extractedText: "",
            filePreviewUrl: null as string | null,

            // FORM DATA MODEL (Để OCR tự fill vào đây)
            form: {
                doc_number: "",
                title: "",
                doc_type: "",
                issued_date: "",
                issued_by: "",
                signer: "",
                summary: "",
                full_text: "",
                status: "draft",
                effective_start_date: "",
                effective_end_date: "",
                // chỉ dùng nội bộ UI
                pageCount: null as number | null,
                field: "",
            }

        };
    },
    computed: {
        fileType(): 'image' | 'pdf' | 'other' | null {
            if (this.selectedFile) {
                return this.selectedFile.type.startsWith('image/') ? 'image' :
                    this.selectedFile.type === 'application/pdf' ? 'pdf' : 'other';
            }
            return null;
        }
    },
    watch: {
        selectedFile(newFile: File | null) {
            if (this.filePreviewUrl) {
                URL.revokeObjectURL(this.filePreviewUrl);
                this.filePreviewUrl = null;
            }
            if (newFile) {
                this.filePreviewUrl = URL.createObjectURL(newFile);
                this.isOcrDone = false; // Reset trạng thái khi chọn file mới
                this.extractedText = "";
                this.resetForm();
            }
        },
    },
    methods: {
        onDragOver() { this.isDragging = true; },
        onDragLeave() { this.isDragging = false; },
        onDrop(event: DragEvent) {
            this.isDragging = false;
            const file = event.dataTransfer?.files[0];
            this.handleFile(file || null);
        },
        onFileSelect(event: Event) {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            this.handleFile(file || null);
        },
        handleFile(file: File | null) {
            if (file && this.validateFile(file)) {
                this.selectedFile = file;
            }
        },
        validateFile(file: File) {
            const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (!allowedTypes.includes(file.type)) {
                alert(`❌ File không hợp lệ. Chỉ chấp nhận PNG, JPG hoặc PDF.`);
                return false;
            }
            if (file.size > maxSize) {
                alert(`⚠️ File vượt quá 10MB.`);
                return false;
            }
            return true;
        },
        clearFile() {
            this.selectedFile = null;
            this.extractedText = "";
            this.isOcrDone = false;
            this.resetForm();
        },
        resetForm() {
            this.form = {
                doc_number: "",
                title: "",
                doc_type: "",
                issued_date: "",
                issued_by: "",
                signer: "",
                summary: "",
                full_text: "",
                status: "draft",
                effective_start_date: "",
                effective_end_date: "",
                // chỉ dùng nội bộ UI
                pageCount: null as number | null,
                field: "",
                };

        },

        async startOCR() {
            if (!this.selectedFile) return;

            this.isLoading = true;
            this.extractedText = "";
            this.isOcrDone = false;

            try {
                const res = await processOCR(this.selectedFile);

                // dữ liệu trả về theo JSON bạn mô tả
                const { text, data } = res.data;    

                // 1. Văn bản trích xuất
                this.extractedText = text;
                console.log(this.convertToISODate(data.ngayBanHanh))
                // 2. Điền form từ data
                this.form = {
                    doc_number: data.soVanBan,
                    title: data.trichYeu,
                    doc_type: data.loaiVanBan,
                    issued_by: data.coQuanBanHanh,
                    signer: data.nguoiKy,
                    summary: "Văn bản được trích xuất từ tệp " + (this.selectedFile?.name || ""),
                    full_text: text,
                    issued_date: this.convertToISODate(data.ngayBanHanh),
                    effective_start_date: data.ngayHieuLuc || "",
                    effective_end_date: data.ngayHetHieuLuc || "",
                    status: "draft",
                    pageCount: Number(data.pageCount) || null,   // thêm vào
                    //field: this.checkTag(data.linhVuc), 
                    field: data.linhVuc || null                 // thêm vào
                    };


                this.isOcrDone = true;
            } catch (err: any) {
                console.error("OCR error:", err.response?.data || err.message);
                this.extractedText = "❌ Lỗi khi trích xuất văn bản";
            } finally {
                this.isLoading = false;
            }
        },

        async saveDocument() {
            try {
                console.log("Saving document:", this.form);

                // Tạo FormData từ this.form
                const formData = new FormData();
                Object.entries(this.form).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
                });

                // Gọi API
                const res = await createDocument(formData);

                alert("✅ Đã lưu văn bản vào hệ thống thành công!");
                console.log("Server response:", res);
            } catch (err: any) {
                console.error("Lỗi khi lưu văn bản:", err.response?.data || err.message);
                alert("❌ Lưu văn bản thất bại!");
            }
        },
        copyText(text: string) {
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                alert("Đã sao chép!");
            }).catch(err => {
                console.error("Lỗi copy:", err);
            });
        },
        convertToISODate(vietnameseDateString: string): string {
            try {
                // Lấy 3 nhóm số theo thứ tự: ngày - tháng - năm
                const parts = vietnameseDateString.match(/(\d+)[^\d]+(\d+)[^\d]+(\d+)/);

                if (parts && parts[1] && parts[2] && parts[3]) {
                    const day = parts[1].padStart(2, '0');
                    const month = parts[2].padStart(2, '0');
                    const year = parts[3];
                    return `${year}-${month}-${day}`;
                }

                return "";
            } catch (error) {
                console.error("convertToISODate error:", error);
                return "";
            }
        }
            ,

         checkTag(tag: string): string {

            if (tag == " ")
                {
                    tag ="khác"
                }

            return tag;
        }
    },
});
</script>