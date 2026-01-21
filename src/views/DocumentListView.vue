<template>
    <Header />
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        <main class="flex-grow py-8">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Toolbar: Stats & Filter -->
                <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900">Danh sách văn bản lưu trữ</h2>
                        <p class="text-lg text-gray-600 mt-1">Quản lý các văn bản đã được OCR và lưu trữ vào hệ thống.
                        </p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fa-solid fa-search text-gray-400"></i>
                            </span>
                            <input type="text" v-model="searchQuery"
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64 sm:text-sm"
                                placeholder="Tìm số hiệu, tiêu đề...">
                        </div>
                        <select v-model="filterStatus"
                            class="border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Tất cả trạng thái</option>
                            <option value="approved">Đã duyệt (Approved)</option>
                            <option value="pending">Chờ duyệt (Pending)</option>
                            <option value="rejected">Từ chối (Rejected)</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <dt class="text-sm font-medium text-gray-500 truncate">Tổng số văn bản</dt>
                            <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ documents.length }}</dd>
                        </div>
                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <dt class="text-sm font-medium text-gray-500 truncate">Riêng tư</dt>
                            <dd class="mt-1 text-3xl font-semibold text-gray-900">{{documents.filter(d =>
                                d.visibility === 'private').length}}</dd>
                        </div>

                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <dt class="text-sm font-medium text-gray-500 truncate">Công khai</dt>
                            <dd class="mt-1 text-3xl font-semibold text-green-600">{{documents.filter(d =>
                                d.visibility === 'public').length}}</dd>
                        </div>

                    </div>

                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <dt class="text-sm font-medium text-gray-500 truncate">Chờ duyệt</dt>
                            <dd class="mt-1 text-3xl font-semibold text-yellow-600">{{documents.filter(d => d.status ===
                                'pending').length}}</dd>
                        </div>

                    </div>

                </div>
                <!-- Main Data Table -->
                <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Số hiệu
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tiêu đề & Tóm tắt
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                        Loại văn bản
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Ngày ban hành
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Trạng thái
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="doc in paginatedDocuments" :key="doc.id"
                                    class="hover:bg-blue-50 transition-colors duration-150">
                                    <!-- Số hiệu (doc_number) -->
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-bold text-gray-900">{{ doc.doc_number || '---' }}</div>
                                        <div class="text-xs text-gray-500">ID: {{ doc.id }}</div>
                                    </td>

                                    <!-- Tiêu đề (title) & Tóm tắt (summary) -->
                                    <td class="px-6 py-4">
                                        <div class="text-sm text-gray-900 font-medium mb-1 line-clamp-1"
                                            :title="doc.title">
                                            {{ doc.title }}
                                        </div>
                                        <div class="text-xs text-gray-500 line-clamp-2" :title="doc.summary">
                                            {{ doc.summary || 'Chưa có tóm tắt.' }}
                                        </div>
                                        <div v-if="doc.visibility === 'private'"
                                            class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                            <i class="fa-solid fa-lock mr-1 text-[10px]"></i> Riêng tư
                                        </div>
                                        <div v-else
                                            class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            <i class="fa-solid fa-globe mr-1 text-[10px]"></i> Công khai
                                        </div>
                                    </td>

                                    <!-- Loại văn bản (doc_type) -->
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {{ doc.doc_type || 'Khác' }}
                                        </span>
                                    </td>

                                    <!-- Ngày ban hành (issued_date) -->
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ formatDate(doc.issued_date) }}
                                    </td>

                                    <!-- Trạng thái (status) -->
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <span :class="getStatusClass(doc.status)"
                                            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border">
                                            {{ getStatusLabel(doc.status) }}
                                        </span>
                                    </td>

                                    <!-- Hành động -->
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex items-center justify-center space-x-3">
                                            <button @click="openDetailModal(doc)"
                                                class="text-gray-500 hover:text-blue-600 transition-colors p-1"
                                                title="Chi tiết">
                                                <i class="fa-regular fa-eye text-lg"></i>
                                            </button>
                                            <button @click="openPublicView(doc)"
                                                class="text-gray-500 hover:text-green-600 transition-colors p-1"
                                                title="Xem trang dân">
                                                <i class="fa-solid fa-arrow-up-right-from-square text-lg"></i>
                                            </button>
                                            <button @click="confirmDelete(doc)"
                                                class="text-gray-500 hover:text-red-600 transition-colors p-1"
                                                title="Xóa">
                                                <i class="fa-regular fa-trash-can text-lg"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="filteredDocuments.length === 0">
                                    <td colspan="6" class="px-6 py-10 text-center text-gray-500 italic">
                                        Không tìm thấy dữ liệu phù hợp.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50">
                        <div class="text-sm text-gray-600">
                            Hiển thị
                            <b>{{ (currentPage - 1) * pageSize + 1 }}</b>
                            –
                            <b>{{ Math.min(currentPage * pageSize, filteredDocuments.length) }}</b>
                            trong tổng số
                            <b>{{ filteredDocuments.length }}</b> văn bản
                        </div>

                        <div class="flex items-center space-x-2 mt-3 sm:mt-0">
                            <button @click="currentPage--" :disabled="currentPage === 1"
                                class="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100">
                                ‹ Trước
                            </button>

                            <span class="text-sm text-gray-700">
                                Trang {{ currentPage }} / {{ totalPages }}
                            </span>

                            <button @click="currentPage++" :disabled="currentPage === totalPages"
                                class="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100">
                                Sau ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- MODAL CHI TIẾT VĂN BẢN (VIEW & EDIT) -->
        <div v-if="selectedDoc" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
            aria-modal="true">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity backdrop-blur-sm"
                    @click="closeDetailModal"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl w-full">

                    <!-- Modal Header -->
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                        <div>
                            <h3 class="text-xl leading-6 font-bold text-gray-900 flex items-center gap-2">
                                <i class="fa-solid fa-file-contract text-blue-600"></i>
                                Chi tiết văn bản
                            </h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Tạo bởi: {{
                                    selectedDoc?.history
                                        ?.find(h => h.action === 'created')
                                        ?.user ?? ''
                                }} | Ngày tạo: {{
                                    formatDate(
                                        selectedDoc?.history
                                            ?.find(h => h.action === 'created')
                                            ?.date ?? ''
                                    )
                                }}
                            </p>
                        </div>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                            <i class="fa-solid fa-xmark text-2xl"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="px-6 py-6 max-h-[75vh] overflow-y-auto">

                        <div v-if="isEditing" class="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div class="flex">
                                <i class="fa-solid fa-triangle-exclamation text-yellow-500 mt-1"></i>
                                <div class="ml-3 text-sm text-yellow-700">
                                    Bạn đang ở chế độ chỉnh sửa.
                                </div>
                            </div>
                        </div>

                        <!-- Grid Layout -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <!-- CỘT TRÁI (2/3): Thông tin chính -->
                            <div class="lg:col-span-2 space-y-6">
                                <!-- Section 1: Thông tin cơ bản -->
                                <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                                    <h4
                                        class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">
                                        Thông tin chung</h4>

                                    <div class="space-y-4">
                                        <!-- Tiêu đề -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Tiêu đề văn
                                                bản</label>
                                            <textarea v-if="isEditing" v-model="tempDoc.title" rows="2"
                                                class="w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                                            <p v-else class="text-gray-900 font-semibold text-base">{{ selectedDoc.title
                                            }}</p>
                                        </div>

                                        <!-- Số hiệu & Loại -->
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-500 mb-1">Số văn
                                                    bản</label>
                                                <input v-if="isEditing" type="text" v-model="tempDoc.doc_number"
                                                    class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                                <p v-else
                                                    class="text-gray-900 font-mono bg-gray-50 inline-block px-2 py-1 rounded">
                                                    {{ selectedDoc.doc_number || 'N/A' }}</p>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-500 mb-1">Loại văn
                                                    bản</label>
                                                <input v-if="isEditing" type="text" v-model="tempDoc.doc_type"
                                                    class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                                <p v-else class="text-gray-900">{{ selectedDoc.doc_type }}</p>
                                            </div>
                                        </div>

                                        <!-- Tóm tắt -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Tóm tắt nội
                                                dung</label>
                                            <textarea v-if="isEditing" v-model="tempDoc.summary" rows="3"
                                                class="w-full border-gray-300 rounded-md border p-2 text-sm"></textarea>
                                            <p v-else
                                                class="text-gray-800 text-sm leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100">
                                                {{ selectedDoc.summary || 'Chưa có nội dung tóm tắt.' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Section 2: Thông tin ban hành & Hiệu lực -->
                                <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                                    <h4
                                        class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">
                                        Ban hành & Hiệu lực</h4>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Cơ quan ban
                                                hành</label>
                                            <input v-if="isEditing" type="text" v-model="tempDoc.issued_by"
                                                class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                            <p v-else class="text-gray-900">{{ selectedDoc.issued_by }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Người ký</label>
                                            <input v-if="isEditing" type="text" v-model="tempDoc.signer"
                                                class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                            <p v-else class="text-gray-900">{{ selectedDoc.signer }}</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Ngày ban
                                                hành</label>
                                            <input v-if="isEditing" type="date" v-model="tempDoc.issued_date"
                                                class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                            <p v-else class="text-gray-900">{{ formatDate(selectedDoc.issued_date) }}
                                            </p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-500 mb-1">Số trang</label>
                                            <input v-if="isEditing" type="number" v-model="tempDoc.page_count"
                                                class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                            <p v-else class="text-gray-900">{{ selectedDoc.page_count || 0 }}</p>
                                        </div>

                                        <!-- Hiệu lực -->
                                        <div class="sm:col-span-2 border-t border-gray-100 pt-3 mt-1">
                                            <div class="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-500 mb-1">Ngày bắt
                                                        đầu hiệu lực</label>
                                                    <input v-if="isEditing" type="date"
                                                        v-model="tempDoc.effective_start_date"
                                                        class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                                    <p v-else class="text-gray-900">{{
                                                        formatDate(selectedDoc.effective_start_date) }}</p>
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-500 mb-1">Ngày hết
                                                        hiệu lực</label>
                                                    <input v-if="isEditing" type="date"
                                                        v-model="tempDoc.effective_end_date"
                                                        class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                                    <p v-else
                                                        :class="selectedDoc.effective_end_date ? 'text-gray-900' : 'text-gray-400 italic'">
                                                        {{ selectedDoc.effective_end_date ?
                                                            formatDate(selectedDoc.effective_end_date) : 'Không thời hạn' }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Ghi chú -->
                                <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                                    <label class="block text-sm font-medium text-gray-500 mb-1">Ghi chú (Note)</label>
                                    <textarea v-if="isEditing" v-model="tempDoc.note" rows="2"
                                        class="w-full border-gray-300 rounded-md border p-2 text-sm"></textarea>
                                    <p v-else class="text-gray-700 text-sm">{{ selectedDoc.note || 'Không có ghi chú.'
                                    }}</p>
                                </div>
                            </div>

                            <!-- CỘT PHẢI (1/3): Meta & Trạng thái -->
                            <div class="space-y-6">
                                <!-- Card Trạng thái -->
                                <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Quản lý
                                    </h4>

                                    <div class="space-y-4">
                                        <!-- Visibility -->
                                        <div>
                                            <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Quyền
                                                truy cập</label>
                                            <select v-if="isEditing" v-model="tempDoc.visibility"
                                                class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                                <option value="public">Công khai (Public)</option>
                                                <option value="private">Riêng tư (Private)</option>
                                            </select>
                                            <div v-else class="flex items-center mt-1">
                                                <span v-if="selectedDoc.visibility === 'public'"
                                                    class="flex items-center text-green-700 font-medium">
                                                    <i class="fa-solid fa-globe mr-2"></i> Công khai
                                                </span>
                                                <span v-else class="flex items-center text-gray-700 font-medium">
                                                    <i class="fa-solid fa-lock mr-2"></i> Riêng tư
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Status -->
                                        <div>
                                            <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Trạng
                                                thái duyệt</label>
                                            <select v-if="isEditing" v-model="tempDoc.status"
                                                class="w-full border-gray-300 rounded-md border p-2 text-sm">
                                                <option value="pending">Chờ duyệt (Pending)</option>
                                                <option value="approved">Đã duyệt (Approved)</option>
                                                <option value="rejected">Từ chối (Rejected)</option>
                                            </select>
                                            <span v-else :class="getStatusClass(selectedDoc.status)"
                                                class="px-3 py-1 inline-flex text-sm font-semibold rounded-full border mt-1">
                                                {{ getStatusLabel(selectedDoc.status) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card File đính kèm -->
                                <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                    <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Tệp đính
                                        kèm</h4>
                                    <div class="flex items-start p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <i class="fa-solid fa-file-pdf text-red-500 text-2xl mr-3 mt-1"></i>
                                        <div v-if="selectedDoc?.attachments" class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 truncate">{{
                                                selectedDoc.attachments.filename }}</p>
                                            <p class="text-xs text-gray-500 mt-0.5">{{
                                                formatFileSize(selectedDoc.attachments?.file_size) }}</p>
                                        </div>
                                    </div>
                                    <button @click="doDownloadFile"
                                        class="w-full mt-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded text-sm flex items-center justify-center">
                                        <i class="fa-solid fa-download mr-2"></i> Tải xuống
                                    </button>
                                </div>

                                <div class="text-xs text-gray-400 text-center">
                                    Cập nhật lần cuối:
                                    {{
                                        formatDate(
                                            selectedDoc?.history
                                                ?.find(h => h.action === 'updated')
                                                ?.date ?? ''
                                        )
                                    }}
                                    <br>
                                    Bởi:
                                    {{
                                        selectedDoc?.history
                                            ?.find(h => h.action === 'updated')
                                            ?.user ?? ''
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div
                        class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
                        <div class="text-sm text-gray-500">
                            <!-- Placeholder left -->
                        </div>
                        <div class="flex space-x-3">
                            <button v-if="!isEditing" @click="closeDetailModal"
                                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Đóng
                            </button>

                            <button v-if="!isEditing" @click="toggleEditMode"
                                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <i class="fa-solid fa-pen-to-square mr-2"></i> Chỉnh sửa
                            </button>

                            <button v-if="isEditing" @click="toggleEditMode"
                                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                Hủy bỏ
                            </button>

                            <button v-if="isEditing" @click="saveChanges"
                                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <i class="fa-solid fa-floppy-disk mr-2"></i> Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL XÁC NHẬN XÓA (Giữ nguyên logic cũ) -->
        <div v-if="docToDelete" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="cancelDelete"></div>
                <div
                    class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Xóa văn bản?</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn xóa văn bản <b>{{ docToDelete.doc_number }}</b>?
                                    Hành động này không thể hoàn tác.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button @click="processDelete" type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                            Xóa ngay
                        </button>
                        <button @click="cancelDelete" type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
    <LoadingComponent ref="loadingRef" />
    <ToastNotification ref="myToast" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Doc } from '../types/DocumentTypes';
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
import { deleteDocument, fetchDocuments, updateDocument } from '../api/documentApi';
import { base64ToBlob, downloadFile, formatDate, formatFileSize } from '../utils/fileUtils';
import ToastNotification from '../components/ToastNotification.vue';
import { fetchAttachmentsByDoc } from '../api/attachmentApi';
import LoadingComponent from '../components/LoadingComponent.vue';

export default defineComponent({
    name: 'DocumentManager',
    components: {
        Header,
        Footer,
        ToastNotification,
        LoadingComponent,
    },
    data() {
        return {
            searchQuery: '',
            filterStatus: '',

            selectedDoc: null as Doc | null,
            tempDoc: {} as Doc,
            isEditing: false,
            docToDelete: null as Doc | null,
            documents: [] as Doc[],

            currentPage: 1,
            pageSize: 10,
        };
    },

    mounted() {
        this.getDocuments();
    },

    watch: {
        searchQuery() {
            this.currentPage = 1;
        },
        filterStatus() {
            this.currentPage = 1;
        }
    },

    computed: {
        filteredDocuments(): Doc[] {
            return this.documents.filter((doc) => {
                const search = this.searchQuery.toLowerCase();

                const matchesSearch =
                    (doc.doc_number &&
                        doc.doc_number.toLowerCase().includes(search)) ||
                    (doc.title &&
                        doc.title.toLowerCase().includes(search));

                const matchesStatus =
                    this.filterStatus === '' || doc.status === this.filterStatus;

                return matchesSearch && matchesStatus;
            });
        },

        totalPages(): number {
            return Math.ceil(this.filteredDocuments.length / this.pageSize);
        },

        paginatedDocuments(): Doc[] {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredDocuments.slice(start, end);
        }
    },
    methods: {
        async getDocuments() {
            try {
                const res = await fetchDocuments();
                this.documents = res.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách văn bản:", error);
            }
        },

        formatDate,
        formatFileSize,

        getStatusLabel(status: string) {
            const map: Record<string, string> = {
                approved: 'Đã duyệt',
                pending: 'Chờ duyệt',
                rejected: 'Từ chối'
            };
            return map[status] || status;
        },

        getStatusClass(status: string) {
            const map: Record<string, string> = {
                approved: 'bg-green-100 text-green-800 border-green-200',
                pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                rejected: 'bg-red-100 text-red-800 border-red-200'
            };
            return map[status] || 'bg-gray-100 text-gray-800';
        },

        async openDetailModal(doc: Doc) {
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

        toggleEditMode() {
            if (!this.isEditing) {
                if (this.selectedDoc) {
                    this.tempDoc = JSON.parse(JSON.stringify(this.selectedDoc));
                }
                this.isEditing = true;
            } else {
                this.isEditing = false;
                this.tempDoc = {} as Doc;
            }
        },

        async saveChanges() {
            if (!this.selectedDoc || !this.tempDoc) return;
            (this.$refs.loadingRef as any).show();
            try {
                const res = await updateDocument(
                    Number(this.selectedDoc.id),
                    this.tempDoc
                );
                const updatedDoc: Doc = {
                    ...this.selectedDoc,
                    ...this.tempDoc,
                };

                const index = this.documents.findIndex(d => d.id === this.selectedDoc!.id);
                if (index !== -1) {
                    this.documents.splice(index, 1, updatedDoc);
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

        closeDetailModal() {
            if (this.isEditing) {
                if (!confirm('Dữ liệu chưa lưu sẽ bị mất. Đóng?')) return;
            }
            this.selectedDoc = null;
            this.isEditing = false;
        },

        openPublicView(doc: Doc) {
            const { origin } = window.location;
            const url = `${origin}/document-detail/${doc.id}`;
            window.open(url, '_blank');
        },

        confirmDelete(doc: Doc) {
            this.docToDelete = doc;
        },

        cancelDelete() {
            this.docToDelete = null;
        },

        async processDelete() {
            if (this.docToDelete) {
                try {
                    await deleteDocument(this.docToDelete.id);
                    this.documents = this.documents.filter(
                        (d) => d.id !== this.docToDelete!.id
                    );
                    (this.$refs.myToast as any).success(
                        "Xoá",
                        `Xoá thành công văn bản ID: ${this.docToDelete.id}`
                    );
                    this.docToDelete = null;
                } catch (error) {
                    (this.$refs.myToast as any).error(
                        "Lỗi",
                        `${error}`
                    );
                }
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
