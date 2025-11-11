<template>
    <Header />
    <div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="container mx-auto">
            <!-- Tiêu đề trang -->
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">
                    Tra cứu Văn bản
                </h1>
                <p class="text-lg text-gray-600 mt-1">
                    Sử dụng bộ lọc chi tiết để tìm kiếm chính xác.
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- CỘT BỘ LỌC (Sidebar) -->
                <aside class="lg:col-span-1">
                    <div
                        class="bg-white p-5 rounded-lg shadow-md sticky top-24"
                    >
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">
                            Bộ lọc tìm kiếm
                        </h2>

                        <form @submit.prevent="applyFilters">
                            <!-- Lọc theo từ khóa -->
                            <div>
                                <label
                                    for="keyword"
                                    class="block text-sm font-medium text-gray-700"
                                    >Từ khóa</label
                                >
                                <input
                                    type="text"
                                    id="keyword"
                                    v-model="filters.keyword"
                                    placeholder="Nhập số hiệu, tiêu đề..."
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <!-- Lọc theo loại văn bản -->
                            <div class="mt-4">
                                <label
                                    for="docType"
                                    class="block text-sm font-medium text-gray-700"
                                    >Loại văn bản</label
                                >
                                <select
                                    id="docType"
                                    v-model="filters.docType"
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="nghi-dinh">Nghị định</option>
                                    <option value="thong-tu">Thông tư</option>
                                    <option value="luat">Luật</option>
                                    <option value="quyet-dinh">
                                        Quyết định
                                    </option>
                                </select>
                            </div>

                            <!-- Lọc theo cơ quan ban hành -->
                            <div class="mt-4">
                                <label
                                    for="issuer"
                                    class="block text-sm font-medium text-gray-700"
                                    >Cơ quan ban hành</label
                                >
                                <select
                                    id="issuer"
                                    v-model="filters.issuer"
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="chinh-phu">Chính phủ</option>
                                    <option value="bo-tai-chinh">
                                        Bộ Tài chính
                                    </option>
                                    <option value="nhnn">
                                        Ngân hàng Nhà nước
                                    </option>
                                    <option value="bo-cong-an">
                                        Bộ Công an
                                    </option>
                                </select>
                            </div>

                            <!-- Lọc theo ngày ban hành -->
                            <div class="mt-4">
                                <label
                                    class="block text-sm font-medium text-gray-700"
                                    >Ngày ban hành</label
                                >
                                <div class="flex items-center space-x-2 mt-1">
                                    <input
                                        type="date"
                                        v-model="filters.dateFrom"
                                        class="block w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <span>đến</span>
                                    <input
                                        type="date"
                                        v-model="filters.dateTo"
                                        class="block w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <!-- Nút tìm kiếm -->
                            <div class="mt-6">
                                <button
                                    type="submit"
                                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </form>
                    </div>
                </aside>

                <!-- CỘT KẾT QUẢ -->
                <main class="lg:col-span-3">
                    <div class="bg-white p-5 rounded-lg shadow-md">
                        <!-- Header của kết quả (Sắp xếp,...) -->
                        <div
                            class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4"
                        >
                            <h3 class="text-lg font-medium text-gray-700">
                                Tìm thấy
                                <span class="font-bold text-blue-600">{{
                                    searchResults.length
                                }}</span>
                                kết quả
                            </h3>
                            <div>
                                <label
                                    for="sort"
                                    class="text-sm text-gray-600 mr-2"
                                    >Sắp xếp theo:</label
                                >
                                <select
                                    id="sort"
                                    v-model="sortBy"
                                    class="border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="relevance">
                                        Liên quan nhất
                                    </option>
                                    <option value="newest">
                                        Ngày ban hành (mới nhất)
                                    </option>
                                    <option value="effective">
                                        Ngày hiệu lực (sớm nhất)
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Danh sách kết quả -->
                        <div class="space-y-4">
                            <div
                                v-for="doc in searchResults"
                                :key="doc.id"
                                class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                            >
                                <div
                                    class="flex flex-col sm:flex-row justify-between sm:items-center"
                                >
                                    <div>
                                        <span
                                            :class="getStatusClass(doc.status)"
                                            class="text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 inline-block"
                                        >
                                            {{ doc.status }}
                                        </span>
                                        <h3
                                            class="text-lg font-semibold text-blue-700 hover:underline"
                                        >
                                            <a href="#">{{ doc.title }}</a>
                                        </h3>
                                        <p class="text-sm text-gray-600 mt-1">
                                            {{ doc.description }}
                                        </p>
                                    </div>
                                    <div
                                        class="mt-3 sm:mt-0 sm:ml-6 text-left sm:text-right flex-shrink-0"
                                    >
                                        <p class="text-sm text-gray-500">
                                            Ngày ban hành: {{ doc.issueDate }}
                                        </p>
                                        <p class="text-sm text-gray-500">
                                            Ngày hiệu lực:
                                            {{ doc.effectiveDate }}
                                        </p>
                                        <a
                                            href="#"
                                            class="text-sm text-blue-600 hover:underline mt-2 inline-block"
                                            >Xem chi tiết &rarr;</a
                                        >
                                    </div>
                                </div>
                            </div>
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
                dateFrom: "",
                dateTo: "",
            },
            sortBy: "relevance" as string,
            searchResults: [
                {
                    id: 1,
                    title: "Nghị định 288/2025/NĐ-CP",
                    description:
                        "Quy định về quản lý tàu bay không người lái và phương tiện bay...",
                    issueDate: "05/11/2025",
                    effectiveDate: "05/11/2025",
                    status: "Còn hiệu lực",
                },
                {
                    id: 2,
                    title: "Thông tư 39/2016/TT-NHNN",
                    description:
                        "Quy định về hoạt động cho vay của tổ chức tín dụng, chi nhánh ngân hàng...",
                    issueDate: "30/12/2016",
                    effectiveDate: "15/03/2017",
                    status: "Còn hiệu lực",
                },
            ] as {
                id: number;
                title: string;
                description: string;
                issueDate: string;
                effectiveDate: string;
                status: string;
            }[],
        };
    },

    methods: {
        applyFilters(): void {
            console.log("Đang áp dụng bộ lọc:", this.filters);
            // TODO: Gọi API tìm kiếm
        },

        getStatusClass(status: string): string {
            switch (status) {
                case "Còn hiệu lực":
                    return "bg-green-100 text-green-800";
                case "Sắp có hiệu lực":
                    return "bg-blue-100 text-blue-800";
                case "Hết hiệu lực một phần":
                    return "bg-yellow-100 text-yellow-800";
                default:
                    return "bg-gray-100 text-gray-800";
            }
        },
    },
});
</script>
