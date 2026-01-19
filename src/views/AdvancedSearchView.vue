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
                            <button type="button" @click="resetFilters" class="text-xs px-3 py-1.5 rounded-full border border-blue-200
                                    text-blue-600 hover:bg-blue-50 hover:border-blue-300
                                    transition flex items-center gap-1">
                                <i class="fas fa-sync"></i> Đặt lại
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
                                    <select id="docType" v-model="filters.doc_type"
                                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Tất cả</option>
                                        <option value="Nghị định">Nghị định</option>
                                        <option value="Thông tư">Thông tư</option>
                                        <option value="Luật">Luật</option>
                                        <option value="Quyết định">Quyết định</option>
                                        <option value="Chỉ thị">Chỉ thị</option>
                                    </select>
                                </div>

                                <!-- Lọc theo cơ quan ban hành -->
                                <div>
                                    <label for="issuer" class="block text-sm font-medium text-gray-700">Cơ quan ban
                                        hành</label>
                                    <select id="issuer" v-model="filters.issued_by"
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
                                            <input type="date" v-model="filters.issued_from"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <span class="text-xs text-gray-500">Đến ngày</span>
                                            <input type="date" v-model="filters.issued_to"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Lọc theo ngày hiệu lực -->
                                <div class="border-t border-gray-100 pt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu hiệu
                                        lực</label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <span class="text-xs text-gray-500">Từ ngày</span>
                                            <input type="date" v-model="filters.effective_start_from"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <span class="text-xs text-gray-500">Đến ngày</span>
                                            <input type="date" v-model="filters.effective_start_to"
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
                                            <input type="date" v-model="filters.effective_end_from"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <span class="text-xs text-gray-500">Đến ngày</span>
                                            <input type="date" v-model="filters.effective_end_to"
                                                class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-xs focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Nút tìm kiếm -->
                                <div class="pt-4">
                                    <button type="submit" class="w-full flex items-center justify-center gap-2
                                                py-3 px-4 rounded-xl
                                                text-sm font-semibold text-white
                                                bg-gradient-to-r from-blue-600 to-blue-500
                                                hover:from-blue-700 hover:to-blue-600
                                                shadow-md hover:shadow-lg
                                                transition-all duration-200">
                                        <i class="fas fa-search"></i>Tìm kiếm
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
                                    <option value="newest">Mới nhất</option>
                                    <option value="effective_asc">Hiệu lực (Cũ -> Mới)</option>
                                    <option value="effective_desc">Hiệu lực (Mới -> Cũ)</option>
                                </select>
                            </div>
                        </div>

                        <!-- DANH SÁCH / SKELETON / EMPTY STATE -->
                        <div class="space-y-4">
                            <!-- 2️⃣ Có kết quả -->
                            <template v-if="searchResults.length > 0">
                                <div v-for="doc in searchResults" :key="doc.id"
                                    class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <!-- 👉 giữ nguyên UI item của bạn -->
                                    <div class="flex flex-col md:flex-row justify-between gap-4">
                                        <div class="flex-1">
                                            <div class="flex gap-2 mb-2">
                                                <span :class="getStatusClass(effectiveStatus(doc))"
                                                    class="text-xs font-bold px-2.5 py-1 rounded-full border">
                                                    {{ effectiveStatus(doc) }}
                                                </span>
                                                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                    {{ doc.doc_type }}
                                                </span>
                                            </div>

                                            <h3 class="text-lg font-bold text-blue-700 mb-1">
                                                {{ truncate(doc.title ?? '') }}
                                            </h3>

                                            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {{ truncate(doc.summary || doc.note || '', 300) }}
                                            </p>

                                            <div class="flex gap-6 text-sm text-gray-500">
                                                <span><i class="fas fa-calendar"></i> Ban hành: {{ doc.issued_date
                                                    }}</span>
                                                <span><i class="fas fa-calendar"></i> Bắt đầu hiệu lực: {{
                                                    doc.effective_start_date }}</span>
                                            </div>
                                        </div>

                                        <div
                                            class="flex md:flex-col gap-2 mt-2 md:mt-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 md:w-40 flex-shrink-0 pt-3 md:pt-0">

                                            <button @click="goDetail(doc.id)"
                                                class="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out border border-blue-100 shadow-sm">
                                                <i class="fa-regular fa-eye"></i>
                                                <span>Xem</span>
                                            </button>

                                            <button @click="doDownloadFile(doc.id)"
                                                class="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out border border-emerald-100 shadow-sm">
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
                                    <div class="text-6xl mb-4"><i class="fas fa-file-alt"></i></div>
                                    <h3 class="text-lg font-semibold text-gray-700 mb-2">
                                        Không tìm thấy văn bản
                                    </h3>
                                    <p class="text-sm text-gray-500 mb-4">
                                        Không có văn bản nào phù hợp với điều kiện tìm kiếm của bạn.
                                    </p>
                                    <button @click="resetFilters"
                                        class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                                        <i class="fas fa-sync"></i> Xóa bộ lọc
                                    </button>
                                </div>
                            </template>

                        </div>

                        <!-- Phân trang (Mock) -->
                        <nav class="flex justify-center items-center gap-1 mt-3 text-sm">

                            <!-- Prev -->
                            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-2 rounded-lg border border-gray-300
                                        bg-white hover:bg-gray-100
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition">
                                «
                            </button>

                            <!-- Pages -->
                            <template v-for="(page, index) in visiblePages" :key="`${page}-${index}`">
                                <span v-if="page === '...'" class="px-2 py-1 text-gray-400">
                                    ...
                                </span>

                                <button v-else @click="changePage(page as number)" :class="[
                                    'px-3 py-2 rounded-lg min-w-[36px] transition font-medium',
                                    page === currentPage
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'bg-white border border-gray-300 hover:bg-gray-100'
                                ]">
                                    {{ page }}
                                </button>
                            </template>

                            <!-- Next -->
                            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-2 rounded-lg border border-gray-300
                                        bg-white hover:bg-gray-100
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition">
                                »
                            </button>
                        </nav>
                    </div>
                </main>
            </div>
        </div>
    </div>
    <Footer />
    <LoadingComponent ref="loadingRef" />
    <ToastNotification ref="myToast" />
</template>



<script lang="ts">
import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";
import ToastNotification from "../components/ToastNotification.vue";
import LoadingComponent from "../components/LoadingComponent.vue";
import { filterDocuments } from "../api/documentApi";
import { fetchAttachmentsByDoc } from "../api/attachmentApi";
import {
    base64ToBlob,
    downloadFile,
    getDocumentEffectiveStatus,
} from "../utils/fileUtils";
import { getStatusClass, truncate } from "../utils/textUtils";
import type { Doc } from "../types/DocumentTypes";

export default defineComponent({
    name: "SearchFilter",
    components: {
        Header,
        Footer,
        ToastNotification,
        LoadingComponent,
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,

            filters: {
                keyword: "",
                doc_type: "",
                issued_by: "",
                issued_from: "",
                issued_to: "",
                effective_start_from: "",
                effective_start_to: "",
                effective_end_from: "",
                effective_end_to: "",
            },

            searchResults: [] as Doc[],
            sortBy: "newest",
            debounceTimer: null as ReturnType<typeof setTimeout> | null,
        };
    },

    created() {
        const keyword = this.$route.query.keyword as string;
        if (keyword?.trim()) {
            this.filters.keyword = keyword;
            this.loadDocuments(true);
            return;
        }
        this.loadDocuments(true);
    },

    methods: {
        buildParams() {
            return {
                ...this.filters,
                page: this.currentPage,
                page_size: this.pageSize,
            };
        },

        async loadDocuments(resetPage = false) {
            if (resetPage) this.currentPage = 1;
            (this.$refs.loadingRef as any)?.show();
            try {
                const res = await filterDocuments(this.buildParams());

                this.searchResults = res.data.results;
                this.totalItems = res.data.pagination.total_items;
                this.totalPages = res.data.pagination.total_pages;

                this.sortLocalResults();
            } catch (err) {
                console.error("Lỗi load văn bản", err);
            } finally {
                (this.$refs.loadingRef as any)?.hide();
            }
        },

        applyFilters() {
            this.loadDocuments(true);
        },

        resetFilters() {
            Object.assign(this.filters, {
                keyword: "",
                doc_type: "",
                issued_by: "",
                issued_from: "",
                issued_to: "",
                effective_start_from: "",
                effective_start_to: "",
                effective_end_from: "",
                effective_end_to: "",
            });

            this.loadDocuments(true);
        },
        changePage(page: number) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
            this.loadDocuments();
        },
        sortLocalResults() {
            if (!this.searchResults.length) return;

            const sortMap: Record<string, () => void> = {
                newest: () =>
                    this.searchResults.sort(
                        (a, b) =>
                            new Date(b.issued_date).getTime() -
                            new Date(a.issued_date).getTime()
                    ),

                effective_asc: () =>
                    this.searchResults.sort(
                        (a, b) =>
                            new Date(a.effective_start_date).getTime() -
                            new Date(b.effective_start_date).getTime()
                    ),

                effective_desc: () =>
                    this.searchResults.sort(
                        (a, b) =>
                            new Date(b.effective_start_date).getTime() -
                            new Date(a.effective_start_date).getTime()
                    ),
            };

            sortMap[this.sortBy]?.();
        },
        goDetail(id: number) {
            this.$router.push({ name: "document-detail", params: { id } });
        },
        async doDownloadFile(document_id: number) {
            const attachRes = await fetchAttachmentsByDoc(document_id);
            const att = attachRes.data.length > 0 ? attachRes.data[attachRes.data.length - 1] : null;
            if (!att || !att.file_base64) {
                (this.$refs.myToast as any).error("Lỗi", "Không thể tải file");
                return;
            }
            const blob = base64ToBlob(att.file_base64);
            downloadFile(blob, att.filename);
        },
        getStatusClass,
        truncate,
    },

    watch: {
        sortBy() {
            this.sortLocalResults();
        },
        "filters.keyword"() {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.loadDocuments(true);
            }, 500);
        },
        "$route.query.keyword"(val: string) {
            if (!val?.trim()) return;
            this.filters.keyword = val;
            this.loadDocuments(true);
        },
    },

    computed: {
        visiblePages(): (number | string)[] {
            const pages: (number | string)[] = [];
            const { totalPages, currentPage } = this;

            if (totalPages <= 7) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
            }

            pages.push(1);
            if (currentPage > 4) pages.push("...");

            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }

            if (currentPage < totalPages - 3) pages.push("...");
            pages.push(totalPages);

            return pages;
        },

        effectiveStatus() {
            return (doc: Doc) =>
                getDocumentEffectiveStatus({
                    effective_start_date: doc.effective_start_date,
                    effective_end_date: doc.effective_end_date,
                });
        },
    },
});
</script>