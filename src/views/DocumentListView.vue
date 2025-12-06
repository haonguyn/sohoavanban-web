<template>
    <Header />
    <main class="py-8 flex-grow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Page Header -->
            <div class="md:flex md:items-center md:justify-between mb-8">
                <div class="flex-1 min-w-0">
                    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Quản lý văn bản
                    </h2>
                    <p class="mt-1 text-sm text-gray-500">
                        Lưu trữ, theo dõi và quản lý toàn bộ hồ sơ doanh nghiệp.
                    </p>
                </div>
                <div class="mt-4 flex md:mt-0 md:ml-4">
                    <button @click="openModal('create')" type="button"
                        class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fa-solid fa-plus mr-2"></i> Tải lên mới
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
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
                            d.isPrivate).length }}</dd>
                    </div>
                </div>
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">Công khai</dt>
                        <dd class="mt-1 text-3xl font-semibold text-green-600">{{documents.filter(d =>
                            !d.isPrivate).length }}</dd>
                    </div>
                </div>
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">Chờ duyệt</dt>
                        <dd class="mt-1 text-3xl font-semibold text-yellow-600">{{documents.filter(d => d.status ===
                            'pending').length }}</dd>
                    </div>
                </div>
            </div>

            <!-- Filters & Search -->
            <div
                class="bg-white p-4 rounded-t-lg shadow-sm border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="relative w-full md:w-1/3">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fa-solid fa-search text-gray-400"></i>
                    </div>
                    <input type="text" v-model="searchQuery"
                        class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2"
                        placeholder="Tìm theo tên, tác giả hoặc mã số...">
                </div>

                <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select v-model="filterType"
                        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                        <option value="">Tất cả loại file</option>
                        <option value="PDF">PDF</option>
                        <option value="DOCX">Word (DOCX)</option>
                        <option value="XLSX">Excel (XLSX)</option>
                    </select>
                    <select v-model="filterStatus"
                        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                        <option value="">Tất cả trạng thái</option>
                        <option value="published">Đã ban hành</option>
                        <option value="draft">Bản nháp</option>
                        <option value="pending">Chờ duyệt</option>
                    </select>
                </div>
            </div>

            <!-- Data Table -->
            <div class="bg-white shadow overflow-hidden sm:rounded-b-lg">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên văn bản / Mã</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thông tin File</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tác giả & Danh mục</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tải lên</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái</th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quyền</th>
                                <th scope="col"
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="filteredDocuments.length === 0">
                                <td colspan="7" class="px-6 py-10 text-center text-gray-500">
                                    <div class="flex flex-col items-center">
                                        <i class="fa-regular fa-folder-open text-4xl mb-3 text-gray-300"></i>
                                        <p>Không tìm thấy văn bản nào phù hợp.</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="doc in filteredDocuments" :key="doc.id"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                            <i :class="getFileIcon(doc.type)" class="text-xl"></i>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900 line-clamp-1 max-w-[200px]"
                                                :title="doc.title">{{ doc.title }}</div>
                                            <div class="text-xs text-gray-500">ID: #{{ doc.id }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 font-bold">{{ doc.type }}</div>
                                    <div class="text-xs text-gray-500">{{ doc.size }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ doc.author }}</div>
                                    <div
                                        class="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded-full mt-1">
                                        {{ doc.category }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ formatDate(doc.uploadDate) }}</div>
                                    <div class="text-xs text-gray-500">Lúc 09:30 AM</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="getStatusClass(doc.status)"
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ getStatusLabel(doc.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span v-if="doc.isPrivate" class="text-gray-500 text-sm flex items-center">
                                        <i class="fa-solid fa-lock text-xs mr-1"></i> Cá nhân
                                    </span>
                                    <span v-else class="text-green-600 text-sm flex items-center">
                                        <i class="fa-solid fa-globe text-xs mr-1"></i> Công khai
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="openModal('edit', doc)"
                                        class="text-indigo-600 hover:text-indigo-900 mx-2" title="Chỉnh sửa">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button @click="confirmDelete(doc)" class="text-red-600 hover:text-red-900 mx-2"
                                        title="Xóa">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Pagination -->
                <div class="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Hiển thị <span class="font-medium">1</span> đến <span class="font-medium">{{
                                    filteredDocuments.length }}</span> trong tổng số <span class="font-medium">{{
                                    documents.length }}</span> kết quả
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination">
                                <a href="#"
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">Previous</span>
                                    <i class="fa-solid fa-chevron-left h-5 w-5"></i>
                                </a>
                                <a href="#" aria-current="page"
                                    class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</a>
                                <a href="#"
                                    class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">2</a>
                                <a href="#"
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">Next</span>
                                    <i class="fa-solid fa-chevron-right h-5 w-5"></i>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <div v-if="isModalOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="closeModal"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                            <i class="fa-solid fa-file-pen text-blue-600"></i>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {{ isEditing ? 'Cập nhật văn bản' : 'Thêm văn bản mới' }}
                            </h3>
                            <div class="mt-4 space-y-4">
                                <!-- Form Fields -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Tên văn bản</label>
                                    <input type="text" v-model="form.title"
                                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2">
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Tác giả</label>
                                        <input type="text" v-model="form.author"
                                            class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Danh mục</label>
                                        <select v-model="form.category"
                                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <option>Hợp đồng</option>
                                            <option>Báo cáo</option>
                                            <option>Pháp lý</option>
                                            <option>Nhân sự</option>
                                            <option>Kỹ thuật</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Loại File</label>
                                        <select v-model="form.type"
                                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <option value="PDF">PDF</option>
                                            <option value="DOCX">DOCX</option>
                                            <option value="XLSX">XLSX</option>
                                            <option value="JPG">JPG</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Dung lượng</label>
                                        <input type="text" v-model="form.size" placeholder="VD: 2.5 MB"
                                            class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2">
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Trạng thái</label>
                                        <select v-model="form.status"
                                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                            <option value="draft">Bản nháp</option>
                                            <option value="pending">Chờ duyệt</option>
                                            <option value="published">Đã ban hành</option>
                                        </select>
                                    </div>
                                    <div class="flex items-center pt-6">
                                        <input id="isPrivate" v-model="form.isPrivate" type="checkbox"
                                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                        <label for="isPrivate" class="ml-2 block text-sm text-gray-900">
                                            Riêng tư (Chỉ mình tôi)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="saveDocument" type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        {{ isEditing ? 'Lưu thay đổi' : 'Tạo mới' }}
                    </button>
                    <button @click="closeModal" type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isDeleteModalOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDeleteModal"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Xóa văn bản?
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn xóa văn bản <b>{{ itemToDelete?.title }}</b> không? Hành động
                                    này không thể hoàn tác.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="deleteDocument" type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Xóa ngay
                    </button>
                    <button @click="closeDeleteModal" type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";
// Định nghĩa interface cho Document nếu dùng TypeScript (Optional)
interface Document {
  id: number;
  title: string;
  type: string;
  size: string;
  author: string;
  category: string;
  uploadDate: string;
  status: string;
  isPrivate: boolean;
}

export default defineComponent({
  name: 'QuanLyVanBan',
  components: {
        Header,
        Footer,
    },
  data() {
    return {
      searchQuery: "" as string,
      filterType: "" as string,
      filterStatus: "" as string,
      isModalOpen: false,
      isDeleteModalOpen: false,
      isEditing: false,
      itemToDelete: null as Document | null,
      
      // Dữ liệu mẫu
      documents: [
        {
          id: 101,
          title: "Hợp đồng lao động Mẫu 2025",
          type: "PDF",
          size: "2.4 MB",
          author: "Nguyễn Văn A",
          category: "Hợp đồng",
          uploadDate: "2025-11-10",
          status: "published",
          isPrivate: true,
        },
        {
          id: 102,
          title: "Báo cáo tài chính Quý 3",
          type: "DOCX",
          size: "1.8 MB",
          author: "Lê Thị B",
          category: "Báo cáo",
          uploadDate: "2025-10-01",
          status: "pending",
          isPrivate: true,
        },
        {
          id: 103,
          title: "Luật Đất đai (Bản dự thảo)",
          type: "PDF",
          size: "5.1 MB",
          author: "Trần Văn C",
          category: "Pháp lý",
          uploadDate: "2025-09-15",
          status: "draft",
          isPrivate: false,
        },
        {
          id: 104,
          title: "Danh sách nhân sự IT",
          type: "XLSX",
          size: "500 KB",
          author: "Phạm Thị D",
          category: "Nhân sự",
          uploadDate: "2025-11-20",
          status: "published",
          isPrivate: true,
        },
        {
          id: 105,
          title: "Sơ đồ kiến trúc hệ thống",
          type: "JPG",
          size: "3.2 MB",
          author: "Tech Lead",
          category: "Kỹ thuật",
          uploadDate: "2025-11-25",
          status: "published",
          isPrivate: false,
        }
      ] as Document[],

      // Form object
      form: {
        id: null as number | null,
        title: "",
        type: "PDF",
        size: "",
        author: "",
        category: "Hợp đồng",
        uploadDate: "",
        status: "draft",
        isPrivate: false,
      }
    };
  },
  computed: {
    filteredDocuments(): Document[] {
      return this.documents.filter((doc) => {
        // Search Logic
        const searchLower = this.searchQuery.toLowerCase();
        const matchesSearch = 
            doc.title.toLowerCase().includes(searchLower) || 
            doc.author.toLowerCase().includes(searchLower) ||
            doc.id.toString().includes(searchLower);
        
        // Filter Type Logic
        const matchesType = this.filterType === "" || doc.type === this.filterType;

        // Filter Status Logic
        const matchesStatus = this.filterStatus === "" || doc.status === this.filterStatus;

        return matchesSearch && matchesType && matchesStatus;
      }).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }
  },
  methods: {
    formatDate(dateString: string): string {
      if (!dateString) return "";
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },
    getStatusLabel(status: string): string {
      const map: Record<string, string> = {
        'published': 'Đã ban hành',
        'pending': 'Chờ duyệt',
        'draft': 'Bản nháp'
      };
      return map[status] || status;
    },
    getStatusClass(status: string): string {
      const map: Record<string, string> = {
        'published': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'draft': 'bg-gray-100 text-gray-800'
      };
      return map[status] || 'bg-gray-100 text-gray-800';
    },
    getFileIcon(type: string): string {
      const map: Record<string, string> = {
        'PDF': 'fa-solid fa-file-pdf',
        'DOCX': 'fa-solid fa-file-word',
        'XLSX': 'fa-solid fa-file-excel',
        'JPG': 'fa-solid fa-file-image'
      };
      return map[type] || 'fa-solid fa-file';
    },

    // CRUD Operations
    openModal(mode: 'create' | 'edit', doc: Document | null = null) {
      this.isEditing = mode === 'edit';
      if (mode === 'edit' && doc) {
        // Clone object để tránh binding trực tiếp
        this.form = { ...doc, id: doc.id };
      } else {
        // Reset form
        this.form = {
          id: null,
          title: "",
          type: "PDF",
          size: "",
          author: "Tôi",
          category: "Hợp đồng",
          uploadDate: "new Date().toISOString().split('T')[0]",
          status: "draft",
          isPrivate: true,
        };
      }
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    saveDocument() {
      // Simple Validation
      if (!this.form.title) {
        alert("Vui lòng nhập tên văn bản!");
        return;
      }

      if (this.isEditing && this.form.id !== null) {
        // Update
        const index = this.documents.findIndex(d => d.id === this.form.id);
        if (index !== -1) {
          // Ép kiểu form về Document vì ta biết nó hợp lệ ở đây
          this.documents[index] = { ...this.form } as Document;
        }
      } else {
        // Create
        const newId = this.documents.length > 0 
          ? Math.max(...this.documents.map(d => d.id)) + 1 
          : 1;
          
        const newDoc: Document = {
          ...this.form,
          id: newId,
          size: this.form.size || "Unknown"
        } as Document;
        
        this.documents.unshift(newDoc);
      }
      this.closeModal();
    },
    
    // Delete Logic
    confirmDelete(doc: Document) {
      this.itemToDelete = doc;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.itemToDelete = null;
    },
    deleteDocument() {
      if (this.itemToDelete) {
        this.documents = this.documents.filter(d => d.id !== this.itemToDelete?.id);
        this.closeDeleteModal();
      }
    }
  }
});
</script>
