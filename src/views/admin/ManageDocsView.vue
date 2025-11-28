<template>
    <div v-if="activeTab === 'list'" class="p-6 h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Danh sách văn bản</h2>
            <div class="relative">
                <i data-lucide="search" class="absolute left-3 top-2.5 text-slate-400 w-4 h-4"></i>
                <input v-model="listFilter" type="text" placeholder="Tìm kiếm số hiệu, trích yếu..."
                    class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm">
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
            <div class="overflow-auto flex-1">
                <table class="w-full">
                    <thead class="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Số hiệu</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Trích yếu</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Ngày BH</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="doc in paginatedDocs" :key="doc.id" class="hover:bg-blue-50 transition-colors">
                            <td class="px-6 py-4 font-bold text-blue-600">{{ doc.number }}</td>
                            <td class="px-6 py-4 text-sm text-slate-600 max-w-md truncate" :title="doc.abstract">{{
                                doc.abstract }}</td>
                            <td class="px-6 py-4 text-sm text-slate-500">{{ doc.date }}</td>
                            <td class="px-6 py-4">
                                <span
                                    :class="`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(doc.status)}`">{{
                                        doc.status }}</span>
                            </td>
                            <td class="px-6 py-4 text-right flex justify-end gap-2">
                                <button @click="viewDetail(doc)"
                                    class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                                    title="Xem chi tiết"><i data-lucide="eye" class="w-4 h-4"></i></button>
                                <button v-if="currentUser.role === 'Admin'" @click="deleteDoc(doc.id)"
                                    class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-full transition"
                                    title="Xóa"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination Simple -->
            <div
                class="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
                <span>Trang {{ currentPage }}</span>
                <div class="flex gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded bg-white hover:bg-slate-100 disabled:opacity-50">Trước</button>
                    <button @click="currentPage++" :disabled="currentPage * itemsPerPage >= filteredDocs.length"
                        class="px-3 py-1 border rounded bg-white hover:bg-slate-100 disabled:opacity-50">Sau</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 4. DETAIL TAB -->
    <div v-if="activeTab === 'detail' && selectedDoc" class="p-6 h-full flex flex-col bg-slate-50">
        <div class="flex justify-between items-center mb-4">
            <button @click="activeTab = 'list'"
                class="flex items-center text-slate-500 hover:text-blue-600 font-medium">
                <span
                    class="bg-white p-1 rounded-full border shadow-sm mr-2 flex items-center justify-center w-6 h-6">←</span>
                Quay lại
            </button>
            <div class="flex gap-3">
                <template v-if="isEditing">
                    <button @click="isEditing = false"
                        class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded">Hủy</button>
                    <button @click="saveDocChanges"
                        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm"><i
                            data-lucide="save" class="w-4 h-4"></i> Lưu thay đổi</button>
                </template>
                <template v-else>
                    <button v-if="currentUser.role === 'Admin' || currentUser.role === 'Inputter'" @click="startEditing"
                        class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-50"><i
                            data-lucide="edit" class="w-4 h-4"></i> Chỉnh sửa</button>
                    <template
                        v-if="(currentUser.role === 'Admin' || currentUser.role === 'Approver') && selectedDoc.status === 'pending'">
                        <button @click="updateStatus('rejected')"
                            class="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 shadow-sm">Từ
                            chối</button>
                        <button @click="updateStatus('approved')"
                            class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow-sm">Duyệt văn
                            bản</button>
                    </template>
                </template>
            </div>
        </div>

        <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
            <!-- Info Panel -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
                <div class="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Thông tin chi tiết</h2>
                        <p class="text-xs text-slate-400">ID: {{ selectedDoc.id }}</p>
                    </div>
                    <span
                        class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100">OCR
                        Score: {{ selectedDoc.ocrScore }}%</span>
                </div>

                <div v-if="isEditing" class="grid grid-cols-2 gap-4">
                    <div><label class="text-xs font-bold text-slate-500">Số hiệu</label><input v-model="editForm.number"
                            class="w-full border p-2 rounded"></div>
                    <div><label class="text-xs font-bold text-slate-500">Ngày BH</label><input type="date"
                            v-model="editForm.date" class="w-full border p-2 rounded"></div>
                    <div class="col-span-2"><label class="text-xs font-bold text-slate-500">Trích yếu</label><textarea
                            v-model="editForm.abstract" class="w-full border p-2 rounded h-24"></textarea></div>
                    <div class="col-span-2"><label class="text-xs font-bold text-slate-500">Nội dung</label><textarea
                            v-model="editForm.content"
                            class="w-full border p-2 rounded h-64 font-mono text-sm"></textarea>
                    </div>
                </div>
                <div v-else class="space-y-6">
                    <div class="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-100">
                        <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Số hiệu</span>
                            <p class="font-bold text-slate-800 text-lg">{{ selectedDoc.number }}</p>
                        </div>
                        <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Ngày BH</span>
                            <p class="font-semibold text-slate-800">{{ selectedDoc.date }}</p>
                        </div>
                        <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Loại VB</span>
                            <p class="font-semibold text-blue-600">{{ selectedDoc.type || 'Khác' }}</p>
                        </div>
                        <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Người ký</span>
                            <p class="font-semibold text-slate-800">{{ selectedDoc.signer }}</p>
                        </div>
                        <div class="col-span-2 pt-2 border-t border-slate-200"><span
                                class="text-slate-400 text-xs uppercase font-bold tracking-wider">Trích yếu</span>
                            <p class="font-medium text-slate-700 mt-1">{{ selectedDoc.abstract }}</p>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-2"><i data-lucide="file-text"
                                class="w-4 h-4"></i> Nội dung OCR</h4>
                        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 h-64 overflow-y-auto">
                            <p class="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{{
                                selectedDoc.content }}</p>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2"><i data-lucide="history"
                                class="w-4 h-4"></i> Lịch sử xử lý</h4>
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
            <!-- Viewer Mockup -->
            <div class="bg-slate-800 rounded-xl shadow-lg flex flex-col p-1">
                <div
                    class="flex-1 bg-slate-700 rounded-lg m-1 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden">
                    <i data-lucide="file-text" class="w-48 h-48 opacity-10 absolute"></i>
                    <p class="mb-4 font-medium z-10">Previewing: {{ selectedDoc.files[0] }}</p>
                    <div
                        class="w-3/4 h-3/4 border-2 border-dashed border-slate-500 rounded flex items-center justify-center bg-slate-800/50 backdrop-blur-sm z-10">
                        [PDF Viewer Component Mockup]</div>
                </div>
            </div>
        </div>
    </div>
</template>