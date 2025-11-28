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
                            <button type="button" @click="resetFilters" class="text-sm text-blue-600 hover:underline">
                                Đặt lại
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
                                    <button type="submit"
                                        class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                        Tìm kiếm
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
                                <span class="font-bold text-blue-600">{{ searchResults.length }}</span>
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

                        <!-- Danh sách kết quả -->
                        <div class="space-y-4">
                            <div v-for="doc in searchResults" :key="doc.id"
                                class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 relative group">
                                <div class="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                    <!-- Thông tin chính -->
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2 flex-wrap">
                                            <span :class="getStatusClass(doc.status)"
                                                class="text-xs font-bold px-2.5 py-1 rounded-full border">
                                                {{ doc.status }}
                                            </span>
                                            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {{ doc.type }}
                                            </span>
                                        </div>

                                        <h3 class="text-lg font-bold text-blue-700 hover:underline cursor-pointer mb-1">
                                            <a href="#">{{ doc.title }}</a>
                                        </h3>

                                        <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                                            {{ doc.description }}
                                        </p>

                                        <!-- Meta data (Ngày tháng) -->
                                        <div class="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
                                            <div class="flex items-center">
                                                <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none"
                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Ban hành: <span class="text-gray-700 font-medium ml-1">{{ doc.issueDate
                                                    }}</span>
                                            </div>
                                            <div class="flex items-center">
                                                <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none"
                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Hiệu lực: <span class="text-gray-700 font-medium ml-1">{{
                                                    doc.effectiveDate }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Nút hành động -->
                                    <div class="flex md:flex-col gap-2 mt-2 md:mt-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 md:w-32 flex-shrink-0 pt-3 md:pt-0">
                                        <button class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded text-sm font-medium transition-colors text-center">
                                            Xem
                                        </button>
                                        <button class="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded text-sm font-medium transition-colors text-center">
                                            Tải về
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Phân trang (Mock) -->
                        <div class="flex justify-center mt-8">
                            <nav class="flex space-x-2" aria-label="Pagination">
                                <a href="#" class="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">Trước</a>
                                <a href="#" class="px-3 py-2 rounded-md border border-blue-500 bg-blue-50 text-blue-600 font-medium">1</a>
                                <a href="#" class="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</a>
                                <a href="#" class="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</a>
                                <span class="px-3 py-2 text-gray-500">...</span>
                                <a href="#" class="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">Sau</a>
                            </nav>
                        </div>
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

interface SearchResult {
    id: number;
    title: string;
    description: string;
    type: string;
    issueDate: string;
    effectiveDate: string;
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
            filters: {
                keyword: "",
                docType: "",
                issuer: "",
                // Ngày ban hành
                releaseDateFrom: "",
                releaseDateTo: "",
                // Ngày bắt đầu có hiệu lực
                effectiveDateFrom: "",
                effectiveDateTo: "",
                // Ngày hết hiệu lực
                expirationDateFrom: "",
                expirationDateTo: "",
            },
            sortBy: "relevance" as string,
            searchResults: [
                {
                    id: 1,
                    title: "Luật Đất đai 2024 (Số 31/2024/QH15)",
                    type: "Luật",
                    description: "Quy định về chế độ sở hữu đất đai, quyền hạn và trách nhiệm của Nhà nước đại diện chủ sở hữu toàn dân về đất đai...",
                    issueDate: "18/01/2024",
                    effectiveDate: "01/01/2025",
                    status: "Sắp có hiệu lực",
                },
                {
                    id: 2,
                    title: "Nghị định 288/2025/NĐ-CP về Quản lý phương tiện bay",
                    type: "Nghị định",
                    description: "Quy định chi tiết về việc đăng ký, cấp phép và quản lý hoạt động của tàu bay không người lái và phương tiện bay siêu nhẹ.",
                    issueDate: "05/11/2025",
                    effectiveDate: "05/11/2025",
                    status: "Còn hiệu lực",
                },
                {
                    id: 3,
                    title: "Thông tư 39/2016/TT-NHNN Hoạt động cho vay",
                    type: "Thông tư",
                    description: "Quy định về hoạt động cho vay của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài đối với khách hàng.",
                    issueDate: "30/12/2016",
                    effectiveDate: "15/03/2017",
                    status: "Còn hiệu lực",
                },
                {
                    id: 4,
                    title: "Luật Dân sự 2005 (Số 33/2005/QH11)",
                    type: "Luật",
                    description: "Bộ luật này quy định địa vị pháp lý, chuẩn mực pháp lý cho cách ứng xử của cá nhân, pháp nhân, chủ thể khác.",
                    issueDate: "14/06/2005",
                    effectiveDate: "01/01/2006",
                    status: "Hết hiệu lực",
                },
                {
                    id: 5,
                    title: "Nghị định 46/2016/NĐ-CP Xử phạt vi phạm giao thông",
                    type: "Nghị định",
                    description: "Quy định xử phạt vi phạm hành chính trong lĩnh vực giao thông đường bộ và đường sắt.",
                    issueDate: "26/05/2016",
                    effectiveDate: "01/08/2016",
                    status: "Hết hiệu lực một phần",
                },
                {
                    id: 6,
                    title: "Quyết định 18/2024/QĐ-TTg",
                    type: "Quyết định",
                    description: "Quy định về điều kiện, hồ sơ, trình tự đề nghị chấp thuận mức cấp tín dụng tối đa vượt giới hạn của tổ chức tín dụng.",
                    issueDate: "05/03/2024",
                    effectiveDate: "01/05/2024",
                    status: "Còn hiệu lực",
                },
                {
                    id: 7,
                    title: "Chỉ thị 16/CT-TTg năm 2020",
                    type: "Chỉ thị",
                    description: "Về thực hiện các biện pháp cấp bách phòng, chống dịch COVID-19. Thực hiện cách ly toàn xã hội.",
                    issueDate: "31/03/2020",
                    effectiveDate: "01/04/2020",
                    status: "Hết hiệu lực",
                }
            ] as SearchResult[],
        };
    },

    methods: {
        applyFilters(): void {
            console.log("Applying filters:", this.filters);
            // Giả lập loading hoặc gọi API
        },
        resetFilters(): void {
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
    },
});
</script>