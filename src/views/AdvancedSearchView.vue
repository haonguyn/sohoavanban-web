
<template>
    <Header />
    <div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="container mx-auto">
            <!-- Tiêu đề trang -->
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">
                    Tra cứu văn bản
                </h1>
                <p class="text-lg text-gray-600 mt-1">
                    Hệ thống văn bản pháp luật đầy đủ và cập nhật
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- CỘT BỘ LỌC (Sidebar - Chiếm 1 phần) -->
                <aside class="lg:col-span-1">
                    <div class="bg-white p-5 rounded-lg shadow-md sticky top-24">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-semibold text-gray-800">
                                Bộ lọc tìm kiếm
                            </h2>
                           <button
                            type="button"
                            @click="resetFilters"
                            class="text-xs px-3 py-1.5 rounded-full border border-blue-200
                                    text-blue-600 hover:bg-blue-50 hover:border-blue-300
                                    transition flex items-center gap-1"
                            >
                            🔄 Đặt lại
                            </button>

                        </div>

                        <form @submit.prevent="applyFilters">
                            <div class="space-y-4">
                                <!-- Lọc theo từ khóa -->
                                <div>
                                    <label for="keyword" class="block text-sm font-medium text-gray-700">Từ khóa</label>
                                    <input type="text" id="keyword" v-model="filters.keyword"
                                        placeholder="Nhập số hiệu, tiêu đề..."
                                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>

                                <!-- Lọc theo loại văn bản -->
                                <div>
                                    <label for="docType" class="block text-sm font-medium text-gray-700">Loại văn
                                        bản</label>
                                    <select id="docType" v-model="filters.docType"
                                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Tất cả</option>
                                        <option value="nghi-dinh">Nghị định</option>
                                        <option value="thong-tu">Thông tư</option>
                                        <option value="luat">Luật</option>
                                        <option value="quyet-dinh">Quyết định</option>
                                        <option value="chi-thi">Chỉ thị</option>
                                    </select>
                                </div>

                                <!-- Lọc theo cơ quan ban hành -->
                                <div>
                                    <label for="issuer" class="block text-sm font-medium text-gray-700">Cơ quan ban
                                        hành</label>
                                    <select id="issuer" v-model="filters.issuer"
                                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Tất cả</option>
                                        <option value="quoc-hoi">Quốc hội</option>
                                        <option value="chinh-phu">Chính phủ</option>
                                        <option value="bo-tai-chinh">Bộ Tài chính</option>
                                        <option value="nhnn">Ngân hàng Nhà nước</option>
                                        <option value="bo-cong-an">Bộ Công an</option>
                                        <option value="bo-y-te">Bộ Y tế</option>
                                    </select>
                                </div>

                                <!-- Lọc theo ngày ban hành -->
                                <div class="border-t border-gray-100 pt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày ban hành</label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <span class="text-xs text-gray-500">Từ ngày</span>
                                            <input type="date" v-model="filters.releaseDateFrom"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <span class="text-xs text-gray-500">Đến ngày</span>
                                            <input type="date" v-model="filters.releaseDateTo"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Lọc theo ngày hiệu lực -->
                                <div class="border-t border-gray-100 pt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu có hiệu
                                        lực</label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <span class="text-xs text-gray-500">Từ ngày</span>
                                            <input type="date" v-model="filters.effectiveDateFrom"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <span class="text-xs text-gray-500">Đến ngày</span>
                                            <input type="date" v-model="filters.effectiveDateTo"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Lọc theo ngày hết hiệu lực -->
                                <div class="border-t border-gray-100 pt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày hết hiệu
                                        lực</label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <span class="text-xs text-gray-500">Từ ngày</span>
                                            <input type="date" v-model="filters.expirationDateFrom"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <span class="text-xs text-gray-500">Đến ngày</span>
                                            <input type="date" v-model="filters.expirationDateTo"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Nút tìm kiếm -->
                                <div class="pt-4">
                                    <button
                                        type="submit"
                                        class="w-full flex items-center justify-center gap-2
                                                py-3 px-4 rounded-xl
                                                text-sm font-semibold text-white
                                                bg-gradient-to-r from-blue-600 to-blue-500
                                                hover:from-blue-700 hover:to-blue-600
                                                shadow-md hover:shadow-lg
                                                transition-all duration-200"
                                        >
                                        🔍 Tìm kiếm
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </aside>

                <!-- CỘT KẾT QUẢ (Chiếm 3 phần) -->
                <main class="lg:col-span-3">
                    <div class="bg-white p-5 rounded-lg shadow-md min-h-[500px]">
                        <!-- Header của kết quả (Sắp xếp,...) -->
                        <div
                            class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-4">
                            <h3 class="text-lg font-medium text-gray-700">
                                Tìm thấy
                                <span class="font-bold text-blue-600">{{ totalItems }}</span>
                                văn bản
                            </h3>
                            <div class="flex items-center">
                                <label for="sort" class="text-sm text-gray-600 mr-2 whitespace-nowrap">Sắp xếp:</label>
                                <select id="sort" v-model="sortBy"
                                    class="border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-1.5">
                                    <option value="relevance">Liên quan nhất</option>
                                    <option value="newest">Mới nhất</option>
                                    <option value="effective_asc">Hiệu lực (Cũ -> Mới)</option>
                                    <option value="effective_desc">Hiệu lực (Mới -> Cũ)</option>
                                </select>
                            </div>
                        </div>

                        <!-- DANH SÁCH / SKELETON / EMPTY STATE -->
                        <div class="space-y-4">

                            <!-- 1️⃣ Skeleton loading -->
                            <template v-if="loading">
                                <div
                                    v-for="i in pageSize"
                                    :key="i"
                                    class="animate-pulse bg-white border border-gray-200 rounded-lg p-4"
                                >
                                    <div class="flex gap-4">
                                        <div class="flex-1 space-y-3">
                                            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                                            <div class="h-4 bg-gray-200 rounded w-full"></div>
                                            <div class="flex gap-4">
                                                <div class="h-3 bg-gray-200 rounded w-32"></div>
                                                <div class="h-3 bg-gray-200 rounded w-32"></div>
                                            </div>
                                        </div>

                                        <div class="w-28 space-y-2">
                                            <div class="h-8 bg-gray-200 rounded"></div>
                                            <div class="h-8 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <!-- 2️⃣ Có kết quả -->
                            <template v-else-if="searchResults.length > 0">
                                <div
                                    v-for="doc in searchResults"
                                    :key="doc.id"
                                    class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <!-- 👉 giữ nguyên UI item của bạn -->
                                    <div class="flex flex-col md:flex-row justify-between gap-4">
                                        <div class="flex-1">
                                            <div class="flex gap-2 mb-2">
                                                <span
                                                    :class="getStatusClass(doc.status)"
                                                    class="text-xs font-bold px-2.5 py-1 rounded-full border"
                                                >
                                                    {{ doc.status }}
                                                </span>
                                                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                    {{ doc.doc_type }}
                                                </span>
                                            </div>

                                            <h3 class="text-lg font-bold text-blue-700 mb-1">
                                                {{ doc.title }}
                                            </h3>

                                            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {{ doc.summary }}
                                            </p>

                                            <div class="flex gap-6 text-sm text-gray-500">
                                                <span>📅 Ban hành: {{ doc.issued_date }}</span>
                                                <span>✅ Hiệu lực: {{ doc.effective_start_date }}</span>
                                            </div>
                                        </div>

                                        <div class="flex md:flex-col gap-2 mt-2 md:mt-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 md:w-40 flex-shrink-0 pt-3 md:pt-0">
                                            
                                            <button class="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out border border-blue-100 shadow-sm">
                                                <i class="fa-regular fa-eye"></i>
                                                <span>Xem</span>
                                            </button>

                                            <button class="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out border border-emerald-100 shadow-sm">
                                                <i class="fa-solid fa-cloud-arrow-down"></i>
                                                <span>Tải xuống</span>
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </template>

                            <!-- 3️⃣ Không tìm thấy -->
                            <template v-else>
                                <div class="text-center py-16">
                                    <div class="text-6xl mb-4">📄</div>
                                    <h3 class="text-lg font-semibold text-gray-700 mb-2">
                                        Không tìm thấy văn bản
                                    </h3>
                                    <p class="text-sm text-gray-500 mb-4">
                                        Không có văn bản nào phù hợp với điều kiện tìm kiếm của bạn.
                                    </p>
                                    <button
                                        @click="resetFilters"
                                        class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                    >
                                        🔄 Xóa bộ lọc
                                    </button>
                                </div>
                            </template>

                        </div>

                        <!-- Phân trang (Mock) -->
                        <nav class="flex justify-center items-center gap-1 mt-3 text-sm">

                            <!-- Prev -->
                            <button
                                @click="changePage(currentPage - 1)"
                                :disabled="currentPage === 1"
                                class="px-3 py-2 rounded-lg border border-gray-300
                                        bg-white hover:bg-gray-100
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition"
                            >
                                «
                            </button>

                            <!-- Pages -->
                            <template v-for="(page, index) in visiblePages" :key="`${page}-${index}`">
                                <span
                                    v-if="page === '...'"
                                    class="px-2 py-1 text-gray-400"
                                >
                                    ...
                                </span>

                                <button
                                    v-else
                                    @click="changePage(page as number)"
                                    :class="[
                                        'px-3 py-2 rounded-lg min-w-[36px] transition font-medium',
                                        page === currentPage
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'bg-white border border-gray-300 hover:bg-gray-100'
                                        ]"

                                >
                                    {{ page }}
                                </button>
                            </template>

                            <!-- Next -->
                            <button
                                @click="changePage(currentPage + 1)"
                                :disabled="currentPage === totalPages"
                                class="px-3 py-2 rounded-lg border border-gray-300
                                        bg-white hover:bg-gray-100
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition"
                            >
                                »
                            </button>
                        </nav>
                    </div>
                </main>
            </div>
        </div>
    </div>
    <Footer />
</template>



<script lang="ts">
import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";
import axios from "axios";
interface SearchResult {
  id: number;
  title: string;
  summary: string;
  doc_type: string;
  issued_date: string;
  effective_start_date: string;
  status: string;
}

export default defineComponent({
    name: "SearchFilter",
    components: {
        Header,
        Footer,
    },
        data() {
        return {
            keyword: "",
            documents: [],
            loading: false,
            hasSearched: false,

            currentPage: 1,
            pageSize: 5,
            totalItems: 0,
            totalPages: 1,

            filters: {
            keyword: "",
            docType: "",
            issuer: "",
            releaseDateFrom: "",
            releaseDateTo: "",
            effectiveDateFrom: "",
            effectiveDateTo: "",
            expirationDateFrom: "",
            expirationDateTo: "",
            },

            sortBy: "relevance",
            searchResults: [] as SearchResult[],
            searchTimeout: null as ReturnType<typeof setTimeout> | null,
        };
    },


    methods: {
        resetFilters() {
            this.filters = {
                keyword: "",
                docType: "",
                issuer: "",
                releaseDateFrom: "",
                releaseDateTo: "",
                effectiveDateFrom: "",
                effectiveDateTo: "",
                expirationDateFrom: "",
                expirationDateTo: "",
            };

            this.hasSearched = false;
            this.currentPage = 1;

            this.fetchAllDocuments();
        },



        getStatusClass(status: string): string {
            switch (status) {
                case "Còn hiệu lực":
                    return "bg-green-100 text-green-700 border-green-200";
                case "Sắp có hiệu lực":
                    return "bg-blue-100 text-blue-700 border-blue-200";
                case "Hết hiệu lực một phần":
                    return "bg-yellow-100 text-yellow-800 border-yellow-200";
                case "Hết hiệu lực":
                    return "bg-gray-100 text-gray-500 border-gray-200 line-through-gray"; // Thêm style xám cho văn bản cũ
                default:
                    return "bg-gray-100 text-gray-600";
            }
        },
            async applyFilters() {
                this.hasSearched = true;
                this.currentPage = 1;

                try {
                    this.loading = true;
                    this.loading = false;
                    const params = {
                        keyword: this.filters.keyword || undefined,
                        doc_type: this.filters.docType || undefined,
                        issued_by: this.filters.issuer || undefined,
                        issued_from: this.filters.releaseDateFrom || undefined,
                        issued_to: this.filters.releaseDateTo || undefined,
                        effective_from: this.filters.effectiveDateFrom || undefined,
                        effective_to: this.filters.effectiveDateTo || undefined,
                        page: this.currentPage,
                        page_size: this.pageSize,
                    };
                    const response = await axios.get(
                    "http://127.0.0.1:8000/api/documents/filter/",
                    {
                        params,
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    }
                    );

                    this.searchResults = response.data.results || [];
                    this.totalItems = response.data.pagination.total_items || 0;
                    this.totalPages = response.data.pagination.total_pages || 1;

                    this.applySort();


                } catch (error) {
                    console.error("Lỗi khi filter văn bản", error);
                } finally {
                    this.loading = false;
                }
            },
            async fetchAllDocuments() {
                    try {
                        this.loading = true;
                        this.loading = false;
                        const response = await axios.get(
                        "http://127.0.0.1:8000/api/documents/",
                        {
                            headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                            },
                        }
                        );

                        const allDocs = response.data || [];

                        this.totalItems = allDocs.length;
                        this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));

                        const start = (this.currentPage - 1) * this.pageSize;
                        const end = start + this.pageSize;

                        this.searchResults = allDocs.slice(start, end);
                        this.applySort();

                    } catch (error) {
                        console.error("Lỗi load toàn bộ văn bản", error);
                    } finally {
                        this.loading = false;
                    }
                },

                changePage(page: number) {
                    if (!Number.isInteger(page)) return;
                    if (page < 1 || page > this.totalPages) return;

                    this.currentPage = page;

                    if (this.hasSearched) {
                        this.applyFilters();
                    } else {
                        this.fetchAllDocuments();
                    }
                },
                applySort() {
                    if (!this.searchResults || this.searchResults.length === 0) return;

                    const sorted = [...this.searchResults];

                    switch (this.sortBy) {
                        case "newest":
                            sorted.sort((a, b) =>
                                new Date(b.issued_date).getTime() -
                                new Date(a.issued_date).getTime()
                            );
                            break;

                        case "effective_asc":
                            sorted.sort((a, b) =>
                                new Date(a.effective_start_date).getTime() -
                                new Date(b.effective_start_date).getTime()
                            );
                            break;

                        case "effective_desc":
                            sorted.sort((a, b) =>
                                new Date(b.effective_start_date).getTime() -
                                new Date(a.effective_start_date).getTime()
                            );
                            break;

                        case "relevance":
                        default:
                            // Không làm gì – giữ nguyên thứ tự backend
                            return;
                    }

                    this.searchResults = sorted;
                },

        },
        mounted() {
            this.fetchAllDocuments();
            const keyword = this.$route.query.keyword as string;
            if (keyword && keyword.trim()) {
                this.filters.keyword = keyword;
                this.hasSearched = true;
                this.currentPage = 1;
                this.applyFilters();
            }
        },
            watch: {
                    // 🔹 Watch sắp xếp
                    sortBy() {
                        if (this.hasSearched) {
                            this.applyFilters();
                        } else {
                            this.fetchAllDocuments();
                        }
                    },

                    // 🔹 Watch từ khóa (search realtime)
                    "filters.keyword"(newVal: string) {
                        // Nếu rỗng → load lại toàn bộ
                        if (!newVal || newVal.trim() === "") {
                            this.hasSearched = false;
                            this.currentPage = 1;
                            this.fetchAllDocuments();
                            return;
                        }

                        // Debounce
                        if (this.searchTimeout) {
                            clearTimeout(this.searchTimeout);
                        }

                        this.searchTimeout = setTimeout(() => {
                            this.hasSearched = true;
                            this.currentPage = 1;
                            this.applyFilters();
                        }, 400);

                        
                    },
                    "$route.query.keyword"(newVal: string) {
                        if (newVal && newVal.trim()) {
                            this.filters.keyword = newVal;
                            this.hasSearched = true;
                            this.currentPage = 1;
                            this.applyFilters();
                        }
                    },
                },

        

        computed: {
           visiblePages(): (number | string)[] {
            const pages: (number | string)[] = [];

            const total = Number(this.totalPages);
            const current = Number(this.currentPage);

            // 🚫 Chặn NaN tuyệt đối
            if (!Number.isInteger(total) || total < 1) {
                return [1];
            }

            if (!Number.isInteger(current) || current < 1) {
                return [1];
            }

            if (total <= 7) {
                for (let i = 1; i <= total; i++) pages.push(i);
                return pages;
            }

            pages.push(1);

            if (current > 4) {
                pages.push("...");
            }

            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);

            for (let i = start; i <= end; i++) {
                if (Number.isInteger(i)) pages.push(i);
            }

            if (current < total - 3) {
                pages.push("...");
            }

            pages.push(total);

            return pages;
            }

        },

});
</script>