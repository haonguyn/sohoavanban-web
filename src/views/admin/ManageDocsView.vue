<template>
    <div class="flex h-screen">
        <Navbar />

        <main class="flex-1 overflow-hidden relative bg-slate-50">
            <div class="p-6 h-full flex flex-col">

                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 gap-4">
                  <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Danh sách văn bản</h1>
                    <p class="text-sm text-slate-500 mt-1">Quản lý, duyệt và kiểm soát kho tài liệu lưu trữ của hệ thống.</p>
                  </div>
                  <div class="relative w-full sm:w-auto mt-2 sm:mt-0">
                      <i data-lucide="search" class="absolute left-3 top-2.5 text-slate-400 w-4 h-4"></i>
                      <input v-model="listFilter" type="text" placeholder="Tìm kiếm số hiệu, trích yếu..."
                          class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 shadow-sm">
                  </div>
                </div>

                <!-- LIST TABLE -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                    <div class="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <table class="w-full">
                            <thead class="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Số hiệu</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tên văn bản</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Ngày ban hành</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Người ký</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Loại văn bản</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Ghi chú</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Chế độ xem</th>
                                    <th class="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="doc in paginatedDocs" :key="doc.id" class="hover:bg-blue-50 transition-colors">
                                    <td class="px-4 py-3 font-bold text-blue-600 whitespace-nowrap" :title="doc.doc_number">{{ doc.doc_number }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-600 max-w-[280px]" :title="doc.summary"><div class="line-clamp-2" style="white-space: normal;">{{ doc.title }}</div></td>
                                    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{{ formatDate(doc.issued_date) }}</td>
                                    <td class="px-4 py-3">
                                        <span :class="`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(doc.status)}`">
                                            {{ convertStatus(doc.status) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{{ doc.signer }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-500">{{ doc.doc_type }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-500 max-w-[120px] truncate" :title="doc.note">{{ doc.note }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-500">
                                        <span :class="doc.visibility === 'public' ? 'text-green-700 bg-green-100' : 'text-rose-700 bg-rose-100'"
                                            class="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                            <i :class="doc.visibility === 'public' ? 'fas fa-globe' : 'fas fa-lock'"></i>
                                            {{ doc.visibility }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right flex justify-end gap-1">
                                        <button @click="viewDetail(doc)"
                                            class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                                            title="Xem chi tiết">
                                            <i class="fa-solid fa-eye"></i>
                                        </button>
                                        <button @click="handleDeleteDocument(doc.id)"
                                            class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-full transition"
                                            title="Xóa">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>

                    <!-- PAGINATION -->
                    <div
                        class="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
                        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
                        <div class="flex gap-2">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-3 py-1 border rounded bg-white hover:bg-slate-100 disabled:opacity-50">Trước</button>
                            <button @click="nextPage" :disabled="currentPage * itemsPerPage >= filteredDocs.length"
                                class="px-3 py-1 border rounded bg-white hover:bg-slate-100 disabled:opacity-50">Sau</button>
                        </div>
                    </div>
                </div>

                <!-- DETAIL TAB -->
                <div v-if="selectedDoc || isDetailLoading" class="p-4 overflow-auto h-full flex flex-col bg-slate-50">
                    <!-- Loading spinner -->
                    <div v-if="isDetailLoading" class="flex flex-col items-center justify-center flex-1 py-20">
                        <svg class="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p class="text-slate-500 font-medium">Đang tải thông tin văn bản...</p>
                        <button @click="goBack" class="mt-4 text-sm text-slate-400 hover:text-slate-600">Hủy</button>
                    </div>
                    <template v-else-if="selectedDoc">
                    <div class="flex justify-between items-center mb-4">
                        <button @click="goBack"
                            class="flex items-center text-slate-500 hover:text-blue-600 font-medium">
                            <span
                                class="bg-white p-1 rounded-full border shadow-sm mr-2 flex items-center justify-center w-6 h-6">←</span>
                            Quay lại
                        </button>

                        <div class="flex gap-3">
                            <template @click="toggleCard" class="bg-white px-4 rounded-2xl flex items-center gap-4">
                                <span
                                    class="font-bold text-sm text-right transition-colors duration-300 cursor-pointer select-none"
                                    :class="isPublic ? 'text-green-600' : 'text-slate-500'">
                                    {{ isPublic ? 'Công khai' : 'Riêng tư' }}
                                </span>
                                <div class="relative inline-flex items-center cursor-pointer select-none">
                                    <div class="w-14 h-7 rounded-full transition-colors duration-300"
                                        :class="isPublic ? 'bg-green-500' : 'bg-slate-300'">
                                    </div>
                                    <div class="absolute top-0.5 left-0.5 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center"
                                        :class="isPublic ? 'translate-x-7' : 'translate-x-0'">
                                        <i class="fas fa-globe-asia text-[10px] text-green-600 transition-all"
                                            v-show="isPublic"></i>
                                        <i class="fas fa-lock text-[10px] text-slate-500 transition-all"
                                            v-show="!isPublic"></i>
                                    </div>
                                </div>
                            </template>
                            <template v-if="isEditing">
                                <button @click="cancelEditing"
                                    class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded">Hủy</button>
                                <button @click="saveDocChanges"
                                    class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm">
                                    <i class="fas fa-save"></i> Lưu thay đổi
                                </button>
                            </template>

                            <template v-else>
                                <button @click="startEditing"
                                    class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-50">
                                    <i class="fas fa-pen"></i> Chỉnh sửa
                                </button>
                                <template v-if="selectedDoc.status === 'pending'">
                                    <button @click="updateStatus('rejected')"
                                        class="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 shadow-sm">Từ
                                        chối</button>
                                    <button @click="updateStatus('approved')"
                                        class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow-sm">Duyệt
                                        văn bản</button>
                                </template>
                                <button @click="doDownloadFile"
                                    class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-sm">
                                    <i class="fa-solid fa-download"></i> Download
                                </button>
                            </template>
                        </div>
                    </div>


                    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[4fr_3fr] gap-4 overflow-y-auto">
                        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
                            <div class="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 class="text-xl font-bold text-slate-800">Thông tin chi tiết</h2>
                                    <p class="text-xs text-slate-400">ID: {{ selectedDoc.id }}</p>
                                </div>
                                <span
                                    class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100">Số
                                    trang: {{ selectedDoc.page_count }}</span>
                            </div>

                            <div v-if="isEditing" class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Số hiệu</label>
                                    <input v-model="editForm.doc_number" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Ngày BH</label>
                                    <AppDatePicker v-model="editForm.issued_date" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Loại văn bản</label>
                                    <input v-model="editForm.doc_type" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Cơ quan ban hành</label>
                                    <input v-model="editForm.issued_by" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Người ký</label>
                                    <input v-model="editForm.signer" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Tên văn bản</label>
                                    <input v-model="editForm.title" class="w-full border p-2 rounded" />
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-bold text-slate-500">Trích yếu</label>
                                    <textarea v-model="editForm.summary"
                                        class="w-full border p-2 rounded h-24"></textarea>
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-bold text-slate-500">Nội dung</label>
                                    <textarea v-model="editForm.full_text"
                                        <p class="text-[11px] font-bold text-slate-400 uppercase mb-2">Liên kết hiện có:</p>
                                        <div v-for="link in existingLinks" :key="link.id" 
                                            class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl group">
                                            <div class="flex items-center gap-3">
                                                <div class="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase">
                                                    {{ link.link_type }}
                                                </div>
                                                <span class="text-sm font-semibold text-slate-700">
                                                    {{ link.target_document_number || link.source_document_number }}
                                                </span>
                                            </div>
                                            <button @click="handleDeleteLink(link.id)" type="button"
                                                class="text-slate-300 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-lg">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Danh sách hàng liên kết mới đang chờ lưu -->
                                    <div class="space-y-3">
                                        <div v-for="(link, index) in pendingLinks" :key="index" 
                                            class="grid grid-cols-[1fr_1fr_auto] gap-3 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 animate-fade-in">
                                            <div>
                                                <label class="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Số ký hiệu văn bản</label>
                                                <input v-model="link.target_doc_number" list="docNumbersList" placeholder="Nhập để tìm kiếm..." autocomplete="off" class="w-full border-slate-200 p-2 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                                            </div>
                                            <div>
                                                <label class="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Loại liên kết</label>
                                                <select v-model="link.link_type" class="w-full border-slate-200 rounded-lg border p-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                                                    <option value="auto">✨ AI Tự nhận diện</option>
                                                    <option value="can_cu">Văn bản căn cứ</option>
                                                    <option value="thay_the">Văn bản thay thế</option>
                                                    <option value="bi_thay_the">Văn bản bị thay thế</option>
                                                    <option value="sua_doi">Sửa đổi, bổ sung</option>
                                                    <option value="bi_sua_doi">Bị sửa đổi, bổ sung</option>
                                                    <option value="het_hieu_luc">Hết hiệu lực</option>
                                                    <option value="het_hieu_luc_1_phan">Hết hiệu lực 1 phần</option>
                                                    <option value="dinh_chinh">Đính chính</option>
                                                </select>
                                            </div>
                                            <div class="flex items-end">
                                                <button @click="removeLinkRow(index)" type="button"
                                                    class="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div v-if="pendingLinks.length === 0 && existingLinks.length === 0" 
                                            class="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                            <div class="text-slate-300 mb-2"><i class="fas fa-link text-3xl"></i></div>
                                            <p class="text-sm text-slate-400 italic">Chưa có liên kết nào cho văn bản này</p>
                                        </div>
                                    </div>

                                    <datalist id="docNumbersList">
                                        <option v-for="d in docs" :key="d.id" :value="d.doc_number">{{ d.title }}</option>
                                    </datalist>
                                </div>
                            </div>

                            <div v-else class="space-y-6">
                                <div class="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-100">
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Số
                                            hiệu</span>
                                        <p class="font-bold text-slate-800 text-lg">{{ selectedDoc.doc_number }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Ngày
                                            BH</span>
                                        <p class="font-semibold text-slate-800">{{ formatDate(selectedDoc.issued_date) }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Loại
                                            VB</span>
                                        <p class="font-semibold text-blue-600">{{ selectedDoc.doc_type || 'Khác' }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Cơ quan
                                            ban hành</span>
                                        <p class="font-semibold text-slate-800">{{ selectedDoc.issued_by }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Người
                                            ký</span>
                                        <p class="font-semibold text-slate-800">{{ selectedDoc.signer }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Tên văn
                                            bản</span>
                                        <p class="font-semibold text-slate-800">{{ selectedDoc.title }}</p>
                                    </div>
                                    <div class="col-span-2 pt-2 border-t border-slate-200"><span
                                            class="text-slate-400 text-xs uppercase font-bold tracking-wider">Trích
                                            yếu</span>
                                        <p class="font-medium text-slate-700 mt-1">{{ selectedDoc.summary }}</p>
                                    </div>
                                </div>
                                
                                <!-- Hiển thị liên kết văn bản trong View mode -->
                                <div v-if="existingLinks.length > 0" class="border-t border-slate-200 pt-6">
                                    <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <i class="fas fa-link text-blue-500 w-4 h-4"></i> Các liên kết hiện tại
                                    </h4>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div v-for="link in existingLinks" :key="link.id" 
                                            class="flex flex-col p-3 bg-white border border-blue-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div class="flex items-center justify-between mb-1.5">
                                                <span class="text-[10px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-50 rounded border border-blue-100">
                                                    {{ link.link_type }}
                                                </span>
                                            </div>
                                            <p class="text-[13px] font-bold text-slate-700 mb-1">
                                                {{ link.target_document_number || link.source_document_number }}
                                            </p>
                                            <p class="text-[11px] text-slate-500 line-clamp-1 italic">
                                                {{ link.target_document_title || link.source_document_title }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-2"><i
                                            data-lucide="file-text" class="w-4 h-4"></i> Nội dung OCR</h4>

                                    <div
                                        class="bg-slate-50 p-4 rounded-lg border border-slate-200 h-64 overflow-y-auto">
                                        <p class="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                                            {{ selectedDoc.full_text }}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2"><i
                                            data-lucide="history" class="w-4 h-4"></i> Lịch sử xử lý</h4>
                                    <div class="border-l-2 border-slate-200 pl-4 space-y-4">
                                        <div v-for="(h, i) in selectedDoc.history" :key="i" class="relative">
                                            <div
                                                class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white">
                                            </div>
                                            <p class="text-sm font-bold text-slate-700">{{ h.action }}</p>
                                            <p class="text-xs text-slate-500">{{ h.date }} • {{ h.user }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-slate-800 rounded-xl shadow-lg flex flex-col p-1">
                            <div class="flex-1 bg-slate-700 rounded-lg m-1 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden">
                                <i data-lucide="file-text" class="w-48 h-48 opacity-10 absolute"></i>
                                <p class="mb-4 font-medium z-10">
                                    Previewing:
                                    <span v-if="selectedDoc?.attachments">
                                        {{ selectedDoc.attachments.filename }}
                                    </span>
                                    <span v-else>
                                        Không có file
                                    </span>
                                </p>
                                <div class="w-full h-full border-2 border-dashed border-slate-500 rounded bg-slate-800/50 backdrop-blur-sm z-10 overflow-hidden p-4">
                                    <iframe v-if="selectedDoc?.attachments?.preview_url"
                                        :src="selectedDoc.attachments.preview_url + '#toolbar=0&navpanes=0&view=FitH'" class="w-full h-full rounded"
                                        frameborder="0"></iframe>
                                    <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                                        Không có file để preview
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </template><!-- end v-else-if selectedDoc -->
                </div>

            </div>
        </main>
    </div>
    <LoadingComponent ref="loadingRef" />
    <ToastNotification ref="myToast" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../../components/admin/Navbar.vue";
import type { Doc } from "../../types/DocumentTypes";
import { deleteDocument, fetchDocuments, updateDocument, createDocumentLink, getDocumentDetail, getDocumentLinks, deleteDocumentLink } from "../../api/documentApi";
import LoadingComponent from "../../components/LoadingComponent.vue";
import ToastNotification from "../../components/ToastNotification.vue";
import AppDatePicker from "../../components/AppDatePicker.vue";
import { fetchAttachmentsByDoc } from "../../api/attachmentApi";
import { base64ToBlob, downloadFile, formatDate } from "../../utils/fileUtils";

export default defineComponent({
    name: "DocumentList",
    components: { Navbar, LoadingComponent, ToastNotification, AppDatePicker },
    data() {
        return {
            listFilter: "",
            currentPage: 1,
            itemsPerPage: 8,
            selectedDoc: null as Doc | null,
            isEditing: false,
            isPublic: false,
            editForm: {} as Partial<Doc>,
            docs: [] as Doc[],
            pendingLinks: [] as { target_doc_number: string; link_type: string }[],
            existingLinks: [] as any[],
            isDetailLoading: false,
            // AI Suggestion State
            newLink: { target_doc_number: "", link_type: "auto" },
            aiSuggestions: [] as any[],
            isSuggesting: false,
        };
    },
    mounted() {
        this.getDocuments();
    },
    computed: {
        filteredDocs(): Doc[] {
            const key = this.listFilter.trim().toLowerCase();
            if (!key) return this.docs;
            return this.docs.filter(d =>
                (d.doc_number ?? "").toLowerCase().includes(key) ||
                (d.title ?? "").toLowerCase().includes(key) ||
                (d.signer ?? "").toLowerCase().includes(key)
            );
        },

        paginatedDocs(): Doc[] {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredDocs.slice(start, start + this.itemsPerPage);
        },
        totalPages(): number {
            return Math.ceil(this.filteredDocs.length / this.itemsPerPage);
        },
    },
    watch: {
        listFilter() {
            this.currentPage = 1; // reset page khi filter thay đổi
        },
        selectedDoc: {
            immediate: true,
            handler(doc) {
                if (doc?.visibility) {
                    this.isPublic = doc.visibility === "public";
                }
            },
        },
    },
    methods: {
        formatDate,
        getStatusColor(status: string) {
            switch (status) {
                case "approved": return "bg-emerald-100 text-emerald-700";
                case "pending": return "bg-amber-100 text-amber-700";
                case "rejected": return "bg-rose-100 text-rose-700";
                default: return "bg-slate-100 text-slate-600";
            }
        },
        convertStatus(status: string) {
            switch (status) {
                case "approved": return "Đã duyệt";
                case "pending": return "Chờ duyệt";
                case "rejected": return "Từ chối";
                default: return "";
            }
        },
        async toggleCard() {
            if (!this.selectedDoc) return;

            const newVisibility = this.isPublic ? "private" : "public";
            try {
                await updateDocument(
                    Number(this.selectedDoc.id),
                    { visibility: newVisibility }
                );
                this.isPublic = newVisibility === "public";
                (this.$refs.myToast as any).success(
                    "Cập nhật",
                    `Đã chuyển văn bản ID: ${this.selectedDoc.id} sang ${newVisibility}`
                );
            } catch (e: any) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${e.response?.data || e.detail}`
                );
                console.error("Lỗi cập nhật văn bản:", e);
            }
        },
        prevPage() { if (this.currentPage > 1) this.currentPage--; },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        async viewDetail(doc: Doc) {
            this.isDetailLoading = true;
            this.selectedDoc = null;
            try {
                const [detailRes, attachRes] = await Promise.all([
                    getDocumentDetail(Number(doc.id)),
                    fetchAttachmentsByDoc(doc.id)
                ]);
                const lastAttachment = attachRes.data.length > 0 ? attachRes.data[attachRes.data.length - 1] : null;
                this.selectedDoc = {
                    ...detailRes.data,
                    attachments: lastAttachment,
                };
                this.pendingLinks = [];
                await this.fetchExistingLinks(Number(doc.id));
            } catch (e: any) {
                console.error("Lỗi lấy thông tin văn bản", e);
                this.pendingLinks = [];
            } finally {
                this.isDetailLoading = false;
            }
        },
        async fetchExistingLinks(docId: number) {
            try {
                const res = await getDocumentLinks(docId);
                this.existingLinks = res.data;
            } catch (e) {
                console.error("Lỗi lấy danh sách liên kết hiện tại:", e);
            }
        },
        addLinkRow() {
            this.pendingLinks.push({ target_doc_number: "", link_type: "auto" });
        },
        removeLinkRow(index: number) {
            this.pendingLinks.splice(index, 1);
        },
        async handleDeleteLink(linkId: number) {
            if (!confirm("Bạn có chắc chắn muốn xóa liên kết này?")) return;
            try {
                await deleteDocumentLink(linkId);
                this.existingLinks = this.existingLinks.filter(l => l.id !== linkId);
                (this.$refs.myToast as any).success("Thành công", "Đã xóa liên kết.");
            } catch (e) {
                (this.$refs.myToast as any).error("Lỗi", "Không thể xóa liên kết.");
            }
        },
        startEditing() { 
            if (!this.selectedDoc) return; 
            this.isEditing = true; 
            this.editForm = { ...this.selectedDoc }; 
            this.pendingLinks = []; 
        },
        cancelEditing() { 
            this.isEditing = false; 
            this.editForm = {}; 
            this.pendingLinks = []; 
        },
        goBack() {
            this.selectedDoc = null;
            this.getDocuments();
        },
        async saveDocChanges() {
            if (!this.selectedDoc) return;
            (this.$refs.loadingRef as any).show();
            try {
                const res = await updateDocument(
                    Number(this.selectedDoc.id),
                    this.editForm
                );
                const updatedDoc: Doc = {
                    ...this.selectedDoc,
                    ...this.editForm,
                };

                const index = this.docs.findIndex(d => d.id === this.selectedDoc!.id);
                if (index !== -1) {
                    this.docs.splice(index, 1, updatedDoc);
                }
                this.selectedDoc = updatedDoc;
                
                // Save all pending links
                if (this.pendingLinks.length > 0) {
                    const promises = this.pendingLinks
                        .filter(l => l.target_doc_number.trim())
                        .map(l => createDocumentLink({
                            source_doc_id: Number(this.selectedDoc!.id),
                            target_doc_number: l.target_doc_number,
                            link_type: l.link_type
                        }));
                    
                    if (promises.length > 0) {
                        try {
                            await Promise.all(promises);
                            await this.fetchExistingLinks(Number(this.selectedDoc.id));
                        } catch (e: any) {
                             (this.$refs.myToast as any).error("Lỗi liên kết", "Một hoặc nhiều liên kết không thể khởi tạo.");
                        }
                    }
                }

                (this.$refs.myToast as any).success(
                    "Cập nhật",
                    `${res.data?.message} ${this.selectedDoc.doc_number}`
                );
            } catch (e: any) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${e.response?.data || e.detail}`
                );
                console.error("Lỗi cập nhật văn bản:", e);
            } finally {
                this.isEditing = false;
                this.pendingLinks = [];
                (this.$refs.loadingRef as any).hide();
            }
        },
        async handleDeleteDocument(docId: number) {
            if (!confirm("Bạn có chắc chắn muốn xoá document này?")) return;
            try {
                await deleteDocument(docId);
                const index = this.docs.findIndex(d => d.id === docId);
                if (index !== -1) {
                    this.docs.splice(index, 1);
                }
                (this.$refs.myToast as any).success(
                    "Xoá",
                    `Xoá thành công văn bản ID: ${docId}`
                );
            } catch (error) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${error}`
                );
            }
        },
        async updateStatus(newStatus: string) {
            if (!this.selectedDoc) return;
            (this.$refs.loadingRef as any).show();
            try {
                this.selectedDoc.status = newStatus;
                await updateDocument(
                    Number(this.selectedDoc.id),
                    { status: newStatus }
                );
                (this.$refs.myToast as any).success(
                    "Cập nhật",
                    `Đã ${newStatus} văn bản ID: ${this.selectedDoc.id}`
                );
            } catch (e: any) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${e.response?.data || e.detail}`
                );
                console.error("Lỗi cập nhật văn bản:", e);
            } finally {
                (this.$refs.loadingRef as any).hide();
            }
        },
        async getDocuments() {
            try {
                const res = await fetchDocuments();
                this.docs = res.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách văn bản:", error);
            }
        },
        async doDownloadFile() {
            const att = this.selectedDoc?.attachments;
            if (!att || !att.file_base64) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `Xảy ra lỗi khi yêu cầu tải file xuống`
                );
                return;
            }
            const blob = base64ToBlob(att.file_base64);
            downloadFile(blob, att.filename);
        },

        // NEW LINKING METHODS
        quickAddLink() {
            if (!this.newLink.target_doc_number.trim()) return;
            this.pendingLinks.push({ ...this.newLink });
            this.newLink.target_doc_number = "";
            this.newLink.link_type = "auto";
        },
        async getAiSuggestions() {
            if (!this.selectedDoc) return;
            this.isSuggesting = true;
            this.aiSuggestions = [];
            try {
                const response = await (this as any).$axios.get(`/api/documents/${this.selectedDoc.id}/suggestions/`);
                this.aiSuggestions = response.data;
                if (this.aiSuggestions.length === 0) {
                    (this.$refs.myToast as any).info("Thông báo", "AI không tìm thấy văn bản nào liên quan rõ rệt.");
                } else {
                    (this.$refs.myToast as any).success("Hoàn tất", `AI đã tìm thấy ${this.aiSuggestions.length} văn bản liên quan.`);
                }
            } catch (e) {
                console.error("Lỗi lấy gợi ý AI:", e);
                (this.$refs.myToast as any).error("Lỗi", "Không thể phân tích văn bản lúc này.");
            } finally {
                this.isSuggesting = false;
            }
        },
        addSuggestedLink(docNumber: string) {
            this.pendingLinks.push({ target_doc_number: docNumber, link_type: "auto" });
            // Remove from suggestions list to avoid duplicate add
            this.aiSuggestions = this.aiSuggestions.filter(s => s.doc_number !== docNumber);
            (this.$refs.myToast as any).success("Đã thêm", `Đã thêm văn bản ${docNumber} vào danh sách chờ liên kết.`);
        }
    }
});
</script>
