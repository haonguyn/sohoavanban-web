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
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Trích yếu
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Ngày BH
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Trạng
                                        thái</th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Người ký
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Phòng ban
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Loại văn
                                        bản</th>
                                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Ghi chú
                                    </th>
                                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Thao tác
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="doc in paginatedDocs" :key="doc.id"
                                    class="hover:bg-blue-50 transition-colors">
                                    <td class="px-6 py-4 font-bold text-blue-600">{{ doc.number }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600 max-w-md truncate"
                                        :title="doc.abstract">{{ doc.abstract }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.date }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            :class="`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(doc.status)}`">{{
                                            doc.status }}</span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.creator }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.department }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.type }}</td>
                                    <td class="px-6 py-4 text-sm text-slate-500">{{ doc.note }}</td>
                                    <td class="px-6 py-4 text-right flex justify-end gap-2">
                                        <button @click="viewDetail(doc)"
                                            class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                                            title="Xem chi tiết">
                                            <i data-lucide="eye" class="w-4 h-4"></i>Xem
                                        </button>
                                        <button v-if="currentUser?.role === 'Admin'" @click="$emit('deleteDoc', doc.id)"
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
                        <span>Trang {{ currentPage }}</span>
                        <div class="flex gap-2">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-3 py-1 border rounded bg-white hover:bg-slate-100 disabled:opacity-50">Trước</button>
                            <button @click="nextPage" :disabled="currentPage * itemsPerPage >= filteredDocs.length"
                                class="px-3 py-1 border rounded bg-white hover:bg-slate-100 disabled:opacity-50">Sau</button>
                        </div>
                    </div>
                </div>

                <!-- DETAIL TAB -->
                <div v-if="selectedDoc" class="p-6 h-full flex flex-col bg-slate-50 mt-6">
                    <div class="flex justify-between items-center mb-4">
                        <button @click="selectedDoc = null"
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
                                <button v-if="currentUser?.role === 'Admin' || currentUser?.role === 'Inputter'"
                                    @click="startEditing"
                                    class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-50">
                                    <i data-lucide="edit" class="w-4 h-4"></i> Chỉnh sửa
                                </button>
                                <template
                                    v-if="(currentUser?.role === 'Admin' || currentUser?.role === 'Approver') && selectedDoc.status === 'pending'">
                                    <button @click="updateStatus('rejected')"
                                        class="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 shadow-sm">Từ
                                        chối</button>
                                    <button @click="updateStatus('approved')"
                                        class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow-sm">Duyệt
                                        văn bản</button>
                                </template>
                            </template>
                        </div>
                    </div>


                    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
                        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">

                        </div>

                        <div class="bg-slate-800 rounded-xl shadow-lg flex flex-col p-1">
                            <div
                                class="flex-1 bg-slate-700 rounded-lg m-1 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden">
                                <i data-lucide="file-text" class="w-48 h-48 opacity-10 absolute"></i>
                                <p class="mb-4 font-medium z-10">Previewing: {{ selectedDoc.files?.[0] || 'Không có file' }}</p>
                                <div
                                    class="w-3/4 h-3/4 border-2 border-dashed border-slate-500 rounded flex items-center justify-center bg-slate-800/50 backdrop-blur-sm z-10">
                                    [PDF Viewer Component Mockup]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../../components/admin/Navbar.vue";

interface Doc {
    id: number | string;
    number: string;
    abstract: string;
    creator: string,
    department: string,
    note: string,
    date: string;
    status: string;
    type?: string;
    signer?: string;
    content?: string;
    ocrScore?: number;
    history?: Array<{ action: string; date: string; user: string }>;
    files?: string[];
}

export default defineComponent({
    name: "DocumentList",
    components: { Navbar },
    props: {
        docs: { type: Array as () => Doc[], required: true },
        currentUser: { type: Object as () => { role: string }, required: true }
    },
    data() {
        return {
            listFilter: "",
            currentPage: 1,
            itemsPerPage: 8,
            selectedDoc: null as Doc | null,
            isEditing: false,
            editForm: {} as Partial<Doc>,
            docs: [
                { id: 1, number: 'VB001', abstract: 'Báo cáo kết quả quý 1', date: '2025-11-01', status: 'Chờ duyệt', creator: 'Nguyễn Văn A', department: 'Kế toán', type: 'Báo cáo', note: 'Khẩn cấp' },
                { id: 2, number: 'VB002', abstract: 'Hợp đồng cung ứng thiết bị', date: '2025-11-02', status: 'Đã duyệt', creator: 'Trần Thị B', department: 'Mua sắm', type: 'Hợp đồng', note: 'Đính kèm file' },
                { id: 3, number: 'VB003', abstract: 'Thông báo họp nội bộ', date: '2025-11-03', status: 'Chưa duyệt', creator: 'Lê Văn C', department: 'Hành chính', type: 'Thông báo', note: '' },
                { id: 4, number: 'VB004', abstract: 'Biên bản nghiệm thu', date: '2025-11-04', status: 'Đã duyệt', creator: 'Phạm Thị D', department: 'Kỹ thuật', type: 'Biên bản', note: 'Cần ký' },
                { id: 5, number: 'VB005', abstract: 'Kế hoạch đào tạo', date: '2025-11-05', status: 'Chờ duyệt', creator: 'Nguyễn Văn E', department: 'Nhân sự', type: 'Kế hoạch', note: '' },
                 { id: 10, number: 'VB001', abstract: 'Báo cáo kết quả quý 1', date: '2025-11-01', status: 'Chờ duyệt', creator: 'Nguyễn Văn A', department: 'Kế toán', type: 'Báo cáo', note: 'Khẩn cấp' },
                { id: 20, number: 'VB002', abstract: 'Hợp đồng cung ứng thiết bị', date: '2025-11-02', status: 'Đã duyệt', creator: 'Trần Thị B', department: 'Mua sắm', type: 'Hợp đồng', note: 'Đính kèm file' },
                { id: 30, number: 'VB003', abstract: 'Thông báo họp nội bộ', date: '2025-11-03', status: 'Chưa duyệt', creator: 'Lê Văn C', department: 'Hành chính', type: 'Thông báo', note: '' },
                { id: 40, number: 'VB004', abstract: 'Biên bản nghiệm thu', date: '2025-11-04', status: 'Đã duyệt', creator: 'Phạm Thị D', department: 'Kỹ thuật', type: 'Biên bản', note: 'Cần ký' },
                { id: 50, number: 'VB005', abstract: 'Kế hoạch đào tạo', date: '2025-11-05', status: 'Chờ duyệt', creator: 'Nguyễn Văn E', department: 'Nhân sự', type: 'Kế hoạch', note: '' },
            
                // Thêm bao nhiêu cũng được để test pagination
            ],
            currentUser: { role: 'Admin' },
        };
    },
    computed: {
        filteredDocs(): Doc[] {
            if (!this.docs || !Array.isArray(this.docs)) return [];
            const key = this.listFilter.toLowerCase();
            return this.docs.filter(d =>
                d.number.toLowerCase().includes(key) ||
                d.abstract.toLowerCase().includes(key)
            );
        },

        paginatedDocs(): Doc[] {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredDocs.slice(start, start + this.itemsPerPage);
        }
    }
    ,
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
        nextPage() { if (this.currentPage * this.itemsPerPage < this.filteredDocs.length) this.currentPage++; },
        viewDetail(doc: Doc) { this.selectedDoc = doc; this.isEditing = false; },
        startEditing() { if (!this.selectedDoc) return; this.isEditing = true; this.editForm = { ...this.selectedDoc }; },
        cancelEditing() { this.isEditing = false; this.editForm = {}; },
        saveDocChanges() { if (!this.selectedDoc) return; Object.assign(this.selectedDoc, this.editForm); this.isEditing = false; },
        updateStatus(newStatus: string) { if (!this.selectedDoc) return; this.selectedDoc.status = newStatus; }
    }
});
</script>
