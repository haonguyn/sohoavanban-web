<template>
    <div class="flex h-screen">
        <Navbar />

        <main class="flex-1 overflow-hidden relative bg-slate-50">
            <div class="p-6 h-full flex flex-col">

                <!-- HEADER SEARCH -->
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-slate-800">Danh sách văn bản</h2>
                    <div class="relative">
                        <i data-lucide="search" class="absolute left-3 top-2.5 text-slate-400 w-4 h-4"></i>
                        <input v-model="listFilter" type="text" placeholder="Tìm kiếm số hiệu, trích yếu..."
                            class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm">
                    </div>
                </div>

                <!-- LIST TABLE -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                    <div class="overflow-auto flex-1">
                        <table class="w-full">
                            <thead class="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Số hiệu
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Tên VB
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Ngày BH
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Trạng
                                        thái
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Người ký
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Loại văn
                                        bản
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Ghi chú
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Chế độ
                                        xem
                                    </th>
                                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Thao tác
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="doc in paginatedDocs" :key="doc.id"
                                    class="hover:bg-blue-50 transition-colors">
                                    <td class="px-6 py-4 font-bold text-blue-600">{{ doc.doc_number }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600 max-w-md truncate"
                                        :title="doc.abstract">{{ doc.title }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.issued_date }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            :class="`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(doc.status)}`">{{
                                                doc.status }}</span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.signer }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.doc_type }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.summary }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.visibility }}</td>
                                    <td class="px-6 py-4 text-right flex justify-end gap-2">
                                        <button @click="viewDetail(doc)"
                                            class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                                            title="Xem chi tiết">
                                            <i data-lucide="eye" class="w-4 h-4"></i>Xem
                                        </button>
                                        <button @click="handleDeleteDocument(doc.id)"
                                            class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-full transition"
                                            title="Xóa">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>DELETE
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
                <div v-if="selectedDoc" class="p-4 h-full flex flex-col bg-slate-50">
                    <div class="flex justify-between items-center mb-4">
                        <button @click="goBack"
                            class="flex items-center text-slate-500 hover:text-blue-600 font-medium">
                            <span
                                class="bg-white p-1 rounded-full border shadow-sm mr-2 flex items-center justify-center w-6 h-6">←</span>
                            Quay lại
                        </button>

                        <div class="flex gap-3">
                            <template v-if="isEditing">
                                <button @click="cancelEditing"
                                    class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded">Hủy</button>
                                <button @click="saveDocChanges"
                                    class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm">
                                    <i data-lucide="save" class="w-4 h-4"></i> Lưu thay đổi
                                </button>
                            </template>

                            <template v-else>
                                <button @click="startEditing"
                                    class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-50">
                                    <i data-lucide="edit" class="w-4 h-4"></i> Chỉnh sửa
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


                    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
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
                                    <input type="date" v-model="editForm.issued_date"
                                        class="w-full border p-2 rounded" />
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
                                    <textarea v-model="editForm.abstract"
                                        class="w-full border p-2 rounded h-24"></textarea>
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-bold text-slate-500">Nội dung</label>
                                    <textarea v-model="editForm.full_text"
                                        class="w-full border p-2 rounded h-64 font-mono text-sm"></textarea>
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
                                        <p class="font-semibold text-slate-800">{{ selectedDoc.issued_date }}</p>
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
                                        <p class="font-medium text-slate-700 mt-1">{{ selectedDoc.abstract }}</p>
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
                                        :src="selectedDoc.attachments.preview_url" class="w-full h-full rounded"
                                        frameborder="0"></iframe>
                                    <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                                        Không có file để preview
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
import { deleteDocument, fetchDocuments, updateDocument } from "../../api/documentApi";
import LoadingComponent from "../../components/LoadingComponent.vue";
import ToastNotification from "../../components/ToastNotification.vue";
import { fetchAttachmentsByDoc } from "../../api/attachmentApi";
import { base64ToBlob, downloadFile } from "../../utils/fileUtils";

export default defineComponent({
    name: "DocumentList",
    components: { Navbar, LoadingComponent, ToastNotification },
    data() {
        return {
            listFilter: "",
            currentPage: 1,
            itemsPerPage: 8,
            selectedDoc: null as Doc | null,
            isEditing: false,
            editForm: {} as Partial<Doc>,
            docs: [] as Doc[],
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
        }
    },
    methods: {
        getStatusColor(status: string) {
            switch (status) {
                case "approved": return "bg-emerald-100 text-emerald-700";
                case "pending": return "bg-amber-100 text-amber-700";
                case "rejected": return "bg-rose-100 text-rose-700";
                default: return "bg-slate-100 text-slate-600";
            }
        },
        prevPage() { if (this.currentPage > 1) this.currentPage--; },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        async viewDetail(doc: Doc) {
            try {
                this.isEditing = false;
                const res = await fetchAttachmentsByDoc(doc.id);
                const lastAttachment = res.data.length > 0 ? res.data[res.data.length - 1] : null;
                this.selectedDoc = {
                    ...doc,
                    attachments: lastAttachment,
                };
            } catch (e: any) {
                console.error("Lỗi lấy thông tin văn bản", e);
            }
        },
        startEditing() { if (!this.selectedDoc) return; this.isEditing = true; this.editForm = { ...this.selectedDoc }; },
        cancelEditing() { this.isEditing = false; this.editForm = {}; },
        goBack(){
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
                this.docs = res.data.data ?? res.data;
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
        }
    }
});
</script>
