<template>
    <div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8" @click="handleOutsideClick">
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
                <!-- CỘT TẢI LÊN & FORM -->
                <div class="lg:col-span-5 space-y-6">
                    <!-- Khu vực Tải lên -->
                    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-bold text-gray-800 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                1. Tải lên tệp nguồn
                            </h2>
                            <p v-if="isOcrDone" class="text-sm text-gray-500 font-medium">Độ chính xác: {{ accuracy }}%</p>
                        </div>
                        <div @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
                            :class="{ 'border-blue-600 bg-blue-50': isDragging, 'border-gray-300 bg-gray-50 hover:bg-gray-100': !isDragging }"
                            class="file-upload-area flex justify-center items-center w-full h-40 px-6 border-2 border-dashed rounded-xl transition-all relative">
                            <div v-if="!selectedFile" class="text-center">
                                <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <div class="mt-2 text-sm text-gray-600">
                                    <label for="file-upload" class="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                                        <span>Chọn tệp tin</span>
                                        <input id="file-upload" name="file-upload" type="file" class="sr-only" accept=".png,.jpg,.jpeg,.pdf" @change="onFileSelect" />
                                    </label>
                                    hoặc kéo thả vào đây
                                </div>
                                <p class="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                            </div>
                            <div v-else class="w-full h-full flex flex-col justify-center items-center z-10">
                                <div class="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full mb-2">
                                    <span class="text-xs font-semibold text-blue-800 uppercase">{{ fileType }}</span>
                                </div>
                                <p class="text-sm font-medium text-gray-900 truncate max-w-[90%]">{{ selectedFile.name }}</p>
                                <button @click="clearFile" class="mt-2 text-xs text-red-500 hover:text-red-700 underline">Xóa và chọn lại</button>
                            </div>
                        </div>
                        <button @click="startOCR" :disabled="!selectedFile || isLoading" class="w-full mt-4 py-2.5 px-4 rounded-lg shadow-sm text-base font-semibold text-white transition-all bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                            <span v-if="!isLoading" class="flex items-center">
                                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Phân tích & Trích xuất
                            </span>
                            <span v-else class="flex items-center">
                                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang xử lý AI...
                            </span>
                        </button>
                    </div>

                    <!-- Form Thông tin thuộc tính -->
                    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative">
                        <div v-if="isLoading" class="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                            <div class="text-center">
                                <span class="text-sm font-semibold text-blue-600 animate-pulse">Đang trích xuất tự động...</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-bold text-gray-800 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                2. Thông tin thuộc tính
                            </h2>
                            <span v-if="isOcrDone" class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">✨ Đã tự động điền</span>
                        </div>
                        <form @submit.prevent="saveDocument" @click.stop class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tên văn bản<span class="text-red-500">*</span></label>
                                <textarea v-model="form.title" @focus="activeField = 'title'" rows="1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Trích yếu<span class="text-red-500">*</span></label>
                                <textarea v-model="form.summary" @focus="activeField = 'summary'" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="VD: Quyết định về việc..."></textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Số / Ký hiệu</label>
                                    <input type="text" v-model="form.doc_number" @focus="activeField = 'doc_number'" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="123/QĐ-..." />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Loại văn bản</label>
                                    <input type="text" v-model="form.doc_type" @focus="activeField = 'doc_type'" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Quyết Định,...." />
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Cơ quan ban hành</label>
                                    <input type="text" v-model="form.issued_by" @focus="activeField = 'issued_by'" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Người ký</label>
                                    <input type="text" v-model="form.signer" @focus="activeField = 'signer'" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Số trang</label>
                                    <input type="number" v-model="form.page_count" @focus="activeField = 'page_count'" min="1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Lĩnh vực</label>
                                    <input type="text" v-model="form.field" @focus="activeField = 'field'" placeholder="VD: Y tế, Giáo dục" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div @focusin="activeField = 'issued_date'">
                                    <label class="block text-xs font-bold text-gray-600 mb-1">Ngày ban hành</label>
                                    <AppDatePicker v-model="form.issued_date" />
                                </div>
                                <div @focusin="activeField = 'effective_start_date'">
                                    <label class="block text-xs font-bold text-blue-600 mb-1">Ngày hiệu lực</label>
                                    <AppDatePicker v-model="form.effective_start_date" />
                                </div>
                                <div @focusin="activeField = 'effective_end_date'">
                                    <label class="block text-xs font-bold text-red-600 mb-1">Ngày hết hiệu lực</label>
                                    <AppDatePicker v-model="form.effective_end_date" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
                                <input type="text" v-model="form.note" @focus="activeField = 'note'" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <button type="submit" class="w-full inline-flex justify-center py-2.5 px-4 border border-transparent font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-md mt-4">
                                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Lưu vào kho lưu trữ
                            </button>
                        </form>
                    </div>
                </div>

                <!-- CỘT KẾT QUẢ / XEM TRƯỚC -->
                <div class="lg:col-span-7 bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col h-[800px] lg:h-auto lg:min-h-[800px]">
                    <div class="p-3 bg-gray-100 flex items-center justify-between border border-gray-200 rounded-t-lg">
                        <div class="flex items-center space-x-4">
                             <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">3. Kết quả trích xuất</span>
                             <div class="flex bg-gray-200 p-1 rounded-lg">
                                 <button @click="showLayout = true" 
                                         :class="showLayout ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500'"
                                         class="px-3 py-1.5 text-xs rounded-md transition-all flex items-center">
                                     <svg class="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 12h16m-7 7h7" />
                                     </svg>
                                     Văn bản gốc
                                 </button>
                                 <button @click="showLayout = false"
                                         :class="!showLayout ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500'"
                                         class="px-3 py-1.5 text-xs rounded-md transition-all flex items-center">
                                     <svg class="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                     </svg>
                                     Giao diện sửa
                                 </button>
                             </div>
                        </div>
                    </div>

                    <div class="flex-1 min-h-0 relative bg-gray-50 border-x border-b border-gray-200 rounded-b-lg overflow-hidden">
                        <!-- VIEW 3: Loading -->
                        <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-30">
                            <div class="ocr-loader mb-6"></div>
                            <p class="text-gray-900 font-bold text-xl animate-pulse">Đang trích xuất văn bản...</p>
                        </div>
                        
                        <!-- VIEW 1: Giao diện sửa (OCR Layout) -->
                        <div v-show="!isLoading && isOcrDone && !showLayout && positions.length > 0" class="ocr-document-container w-full h-full bg-gray-200 overflow-auto p-1 sm:p-2 absolute inset-0">
                             <div v-for="(page, pIdx) in metadata.pages" :key="pIdx" 
                                  class="ocr-page shadow-2xl mb-4 mx-auto bg-white border border-gray-300 relative overflow-hidden shrink-0"
                                  :style="{ 
                                      width: '100%', 
                                      aspectRatio: `${getPageWidth(pIdx + 1)} / ${page.height}`, 
                                      maxWidth: (850 * zoomLevel * (getPageWidth(pIdx + 1) / page.width)) + 'px' 
                                  }">
                                  
                                  <div v-for="(item, iIdx) in positions.filter(p => p.page === pIdx + 1)" :key="iIdx"
                                        class="absolute overflow-visible"
                                        :style="{
                                            left: (item.x / getPageWidth(pIdx + 1) * 100) + '%',
                                            top: (item.y / page.height * 100) + '%',
                                            minWidth: (item.w / getPageWidth(pIdx + 1) * 100) + '%',
                                            maxWidth: '100%',
                                            height: 'auto',
                                            zIndex: (editingBlockId === item.x + '-' + item.y || selectedBlockId === item.x + '-' + item.y) ? 60 : 10
                                        }">
                                        <div :contenteditable="editingBlockId === item.x + '-' + item.y"
                                             tabindex="0"
                                             class="ocr-text-block font-medium leading-tight outline-none transition-all rounded-sm px-1 flex items-center w-full h-full"
                                             :class="[
                                                 editingBlockId === item.x + '-' + item.y ? 'bg-white ring-2 ring-blue-500 shadow-lg cursor-text' : 'bg-white/60 hover:bg-white cursor-pointer border border-transparent hover:border-blue-200',
                                                 selectedBlockId === item.x + '-' + item.y ? 'ring-1 ring-red-400 bg-white shadow-md' : '',
                                                 activeField ? 'ring-2 ring-blue-400 animate-pulse bg-blue-50/50 z-40' : '',
                                                 { 'ocr-highlight-field': isFieldMatch(item.text) }
                                             ]"
                                             :style="{ fontSize: '1.7cqw', padding: '0.4cqw 0.3cqw' }"
                                             @click.stop="onBlockClick(item)"
                                             @dblclick.stop="onBlockDblClick(item, $event)"
                                             @blur="onBlockEdit($event, item); onBlockBlur(item)"
                                             @keydown="handleKeydown($event, item)">
                                             <span class="w-full break-words">{{ item.text }}</span>
                                        </div>
                                        
                                        <!-- Nút xóa (x) nằm ngoài viền và ngoài div editable -->
                                        <button v-if="selectedBlockId === item.x + '-' + item.y && editingBlockId !== item.x + '-' + item.y"
                                                @click.stop="removeBlock(item)"
                                                class="absolute -top-3 -right-3 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[11px] font-bold shadow-md hover:bg-red-600 transition-all z-[75] border-2 border-white">
                                            ✕
                                        </button>
                                  </div>
                             </div>
                        </div>

                        <!-- VIEW 4: Văn bản gốc (Native Preview) -->
                        <div v-show="!isLoading && filePreviewUrl && (!isOcrDone || showLayout)" class="w-full h-full bg-gray-200 flex justify-center items-center overflow-auto p-4 absolute inset-0">
                            <iframe v-if="fileType === 'pdf'" :src="filePreviewUrl ? (filePreviewUrl + '#view=FitH') : undefined" title="PDF Preview" class="w-full h-full rounded shadow-lg border border-gray-300"></iframe>
                            <img v-else-if="fileType === 'image'" :src="filePreviewUrl || undefined" alt="Image Preview" class="max-w-full max-h-full object-contain shadow-2xl rounded" />
                        </div>

                        <!-- VIEW 5: Empty -->
                        <div v-if="!isLoading && !filePreviewUrl" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <p class="text-xl font-medium text-gray-400">Chưa có dữ liệu trích xuất</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ToastNotification ref="myToast" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { processOCR } from "../api/ocrApi";
import { createDocument } from "../api/documentApi";
import { uploadAttachment } from "../api/attachmentApi";
import { normalizeDocType } from "../utils/textUtils";
import ToastNotification from "./ToastNotification.vue";
import AppDatePicker from "./AppDatePicker.vue";

export default defineComponent({
    name: "OCRComponent",
    components: { ToastNotification, AppDatePicker },
    data() {
        return {
            isDragging: false,
            selectedFile: null as File | null,
            isLoading: false,
            isOcrDone: false,
            extractedText: "",
            filePreviewUrl: null as string | null,
            accuracy: '',
            positions: [] as any[],
            metadata: { pages: [] as any[] },
            showLayout: true,
            zoomLevel: 1.5,
            activeField: null as string | null,
            selectedBlockId: null as string | null,
            editingBlockId: null as string | null,
            form: {
                doc_number: "", title: "", doc_type: "", issued_date: "", issued_by: "", signer: "",
                summary: "", full_text: "", effective_start_date: "", effective_end_date: "",
                page_count: null as number | null, field: "", note: ""
            } as any
        };
    },
    computed: {
        fileType(): 'image' | 'pdf' | 'other' | null {
            if (!this.selectedFile) return null;
            return this.selectedFile.type.startsWith('image/') ? 'image' : (this.selectedFile.type === 'application/pdf' ? 'pdf' : 'other');
        }
    },
    watch: {
        selectedFile(newFile: File | null) {
            if (this.filePreviewUrl) URL.revokeObjectURL(this.filePreviewUrl);
            this.filePreviewUrl = newFile ? URL.createObjectURL(newFile) : null;
            if (newFile) { this.isOcrDone = false; this.extractedText = ""; this.resetForm(); }
        },
    },
    methods: {
        onDragOver() { this.isDragging = true; },
        onDragLeave() { this.isDragging = false; },
        onDrop(event: DragEvent) {this.showLayout = true; this.isDragging = false; const file = event.dataTransfer?.files[0]; if (file) this.handleFile(file); },
        onFileSelect(event: Event) {this.showLayout = true; const target = event.target as HTMLInputElement; const file = target.files?.[0]; if (file) this.handleFile(file); },
        handleFile(file: File) { if (this.validateFile(file)) this.selectedFile = file; },
        validateFile(file: File) {
            const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
            if (!allowedTypes.includes(file.type)) { (this.$refs.myToast as any).warning("Lỗi", "Định dạng file không hỗ trợ."); return false; }
            if (file.size > 10 * 1024 * 1024) { (this.$refs.myToast as any).warning("Lỗi", "File quá lớn (>10MB)."); return false; }
            return true;
        },
        clearFile() { this.selectedFile = null; this.extractedText = ""; this.positions = []; this.metadata = { pages: [] }; this.isOcrDone = false; this.resetForm(); },
        resetForm() { this.form = { doc_number: "", title: "", doc_type: "", issued_date: "", issued_by: "", signer: "", summary: "", full_text: "", effective_start_date: "", effective_end_date: "", page_count: null, field: "", note: "" }; },
        async startOCR() {
            if (!this.selectedFile) return;
            this.isLoading = true; this.isOcrDone = false;
            try {
                const res = await processOCR(this.selectedFile);
                const { text, data, accuracy, positions, metadata } = res.data;
                this.extractedText = text; this.positions = positions || []; this.metadata = metadata || { pages: [] };
                this.form = { ...this.form, doc_number: data.doc_number || "", title: data.title || "", doc_type: normalizeDocType(data.doc_type) || "", issued_by: data.issued_by || "", signer: data.signer || "", summary: data.summary || "", full_text: text, issued_date: data.issued_date || "", note: "Từ tệp " + this.selectedFile.name, effective_start_date: data.effective_start_date || data.issued_date || "", effective_end_date: data.effective_end_date || "", page_count: Number(data.page_count) || 0, field: data.field || "" };
                this.accuracy = accuracy; this.isOcrDone = true; this.showLayout = false;
            } catch (err) { (this.$refs.myToast as any).error("Lỗi", "OCR thất bại."); } finally { this.isLoading = false; }
        },
        async saveDocument() {
            if (!this.selectedFile) return;
            try {
                const formData = new FormData();
                Object.entries(this.form).forEach(([k, v]) => { if (v !== null) formData.append(k, String(v)); });
                const res = await createDocument(formData);
                const docId = res.data?.data?.id;
                if (docId) await uploadAttachment(docId, this.selectedFile);
                (this.$refs.myToast as any).success("Thành công", "Đã lưu văn bản!"); this.clearFile();
            } catch (err) { (this.$refs.myToast as any).error("Lỗi", "Lưu thất bại!"); }
        },
        copyText(text: string) { if (text) navigator.clipboard.writeText(text).then(() => (this.$refs.myToast as any).success("Đã copy", "")); },
        handleOutsideClick() {
            if (this.activeField) {
                this.activeField = null;
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            }
            this.selectedBlockId = null;
        },
        onBlockClick(item: any) {
            if (this.activeField) {
                const field = this.activeField as keyof typeof this.form;
                const currentVal = (this.form as any)[field] || '';
                (this.form as any)[field] = currentVal ? `${currentVal} ${item.text}` : item.text;
                return;
            }
            this.selectedBlockId = item.x + '-' + item.y;
            this.editingBlockId = null; 
        },
        onBlockDblClick(item: any, event: MouseEvent) {
            this.editingBlockId = item.x + '-' + item.y;
            this.selectedBlockId = null;
            
            // Lấy tọa độ click trước khi UI rác (nextTick) có thể làm thay đổi layout
            const clickX = event.clientX;
            const clickY = event.clientY;

            this.$nextTick(() => {
                const target = event.target as HTMLElement;
                if (!target) return;
                
                // Đảm bảo target đã có focus và editable
                target.focus();
                
                // Đặt trỏ chuột (caret) đúng vào vị trí người dùng vừa click mang tính chính xác cao
                const doc = document as any;
                let range;
                if (doc.caretRangeFromPoint) {
                    range = doc.caretRangeFromPoint(clickX, clickY);
                } else if (doc.caretPositionFromPoint) {
                    const pos = doc.caretPositionFromPoint(clickX, clickY);
                    if (pos) {
                        range = document.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                        range.collapse(true);
                    }
                }

                if (range) {
                    const selection = window.getSelection();
                    if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            });
        },
        onBlockBlur(item: any) {
            // Delay clear to allow click on 'x' button
            setTimeout(() => {
                if (this.editingBlockId === item.x + '-' + item.y) {
                    this.editingBlockId = null;
                }
            }, 200);
        },
        handleKeydown(event: KeyboardEvent, item?: any) {
            if (event.key === 'Enter') {
                event.preventDefault();
                (event.target as HTMLElement)?.blur();
            } else if (event.key === 'Delete' || event.key === 'Backspace') {
                // Chỉ xóa nếu KHÔNG đang trong chế độ soạn thảo văn bản
                if (item && this.editingBlockId !== item.x + '-' + item.y) {
                    event.preventDefault();
                    this.removeBlock(item);
                }
            }
        },
        removeBlock(item: any) {
            this.positions = this.positions.filter(p => p !== item);
            this.selectedBlockId = null;
            this.syncAllText();
            (this.$refs.myToast as any).success("Đã xóa khối văn bản", "");
        },
        onBlockEdit(event: any, pos: any) { 
            const span = (event.currentTarget as HTMLElement).querySelector('span');
            const newText = span ? span.innerText : event.currentTarget.innerText; 
            if (pos.text !== newText) { 
                pos.text = newText; 
                this.syncAllText(); 
            } 
        },
        syncAllText() { this.extractedText = this.positions.map(p => p.text).join(' '); this.form.full_text = this.extractedText; },
        isFieldMatch(text: string): boolean {
            if (!text || text.length < 3) return false;
            const needle = text.toLowerCase().trim();
            const fields = [this.form.title, this.form.doc_number, this.form.issued_by, this.form.signer, this.form.doc_type, this.form.summary];
            return fields.some(f => f && f.toLowerCase().includes(needle));
        },
        getPageWidth(pageNumber: number): number {
            const pageBlocks = this.positions.filter(p => p.page === pageNumber);
            const baseWidth = this.metadata.pages[pageNumber - 1]?.width || 1000;
            if (pageBlocks.length === 0) return baseWidth;
            
            // Tìm điểm xa nhất bên phải của các khối chữ
            const maxRight = Math.max(...pageBlocks.map(p => p.x + p.w));
            
            // Biên an toàn (Margin)
            const margin = 80; 
            const contentWidthWithMargin = maxRight + margin;
            
            // Chỉ thu hẹp nếu lề phải thực sự quá lớn (>10% baseWidth)
            if (baseWidth - maxRight > baseWidth * 0.1) {
                return Math.min(baseWidth, contentWidthWithMargin);
            }
            return baseWidth;
        }
    }
});
</script>

<style scoped>
.ocr-document-container { box-shadow: inset 0 2px 10px rgba(0,0,0,0.05); }
.ocr-page { box-shadow: 0 10px 30px rgba(0,0,0,0.15); container-type: inline-size; }
.ocr-text-block { background-color: rgba(255, 255, 255, 0.95); border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.06); transition: border-color 0.2s ease, background-color 0.2s ease; cursor: text; }
.ocr-text-block:hover { background-color: white; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
.ocr-highlight-field { background-color: #fef9c3; border-color: #facc15; border-width: 2px; }
.ocr-loader { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>