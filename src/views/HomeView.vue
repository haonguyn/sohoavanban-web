<template>
    <div class="bg-gray-100 min-h-screen font-sans">
        <!-- Thanh điều hướng (Navbar) -->
        <Header />
        <!-- Phần Hero & Thanh Tìm kiếm chính -->
        <div class="bg-white shadow-sm">
            <div
                class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
            >
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Hệ thống Tra cứu Văn bản
                </h1>
                <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Tìm kiếm, quản lý và trích xuất nội dung văn bản một cách
                    hiệu quả.
                </p>

                <!-- Thanh tìm kiếm -->
                <div class="max-w-2xl mx-auto">
                    <form @submit.prevent="handleSearch" class="flex">
                        <input
                            type="text"
                            v-model="searchQuery"
                            placeholder="Nhập từ khóa, số hiệu, nội dung văn bản..."
                            class="flex-grow w-full px-5 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            <svg
                                class="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>
                    <a
                        href="/advance-search"
                        class="inline-block mt-4 text-sm text-blue-600 hover:underline"
                    >
                        Tìm kiếm nâng cao
                    </a>
                </div>
            </div>
        </div>

        <!-- Phần Tính năng -->
        <section classsection="py-16 bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-2xl font-bold text-gray-800">
                        Tính năng nổi bật
                    </h2>
                    <p class="text-gray-600">
                        Các công cụ mạnh mẽ giúp bạn làm việc với văn bản.
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Tính năng 1: Tra cứu -->
                    <div
                        class="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300"
                    >
                        <div
                            class="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-8 h-8"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">
                            Tra cứu Thông minh
                        </h3>
                        <p class="text-gray-600">
                            Tìm kiếm chính xác và nhanh chóng với bộ lọc đa
                            dạng: từ khóa, ngày ban hành, cơ quan ban hành...
                        </p>
                    </div>

                    <!-- Tính năng 2: Quản lý -->
                    <div
                        class="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300"
                    >
                        <div
                            class="flex items-center justify-center h-16 w-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-8 h-8"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3.75 9.776c.814.246 1.668.4 2.55.465a7.5 7.5 0 0 1 7.5 0c.882-.065 1.736-.219 2.55-.465M2.25 10.5v8.25c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-8.25M12 15.75V3.75m0 12V3.75m0 12v-8.25m0 8.25V3.75m-4.5 0v12m0 0V3.75m0 0v12m0-12V3.75m9 12V3.75m0 0v12m0 0V3.75m0 0v12m0-12V3.75"
                                />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">
                            Quản lý & Lưu trữ
                        </h3>
                        <p class="text-gray-600">
                            Lưu trữ, phân loại và quản lý các văn bản cá nhân
                            hoặc của tổ chức một cách an toàn và khoa học.
                        </p>
                    </div>

                    <!-- Tính năng 3: OCR -->
                    <div
                        class="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300"
                    >
                        <div
                            class="flex items-center justify-center h-16 w-16 bg-purple-100 text-purple-600 rounded-full mx-auto mb-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-8 h-8"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                                />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">
                            Trích xuất OCR
                        </h3>
                        <p class="text-gray-600">
                            Chuyển đổi văn bản từ hình ảnh hoặc file PDF scan
                            thành văn bản có thể tìm kiếm và chỉnh sửa.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Danh sách văn bản (mới/xem nhiều) -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    Văn bản mới cập nhật
                </h2>

                <div class="space-y-4">
                    <!-- Mockup item văn bản -->
                    <div
                        v-for="doc in featuredDocs"
                        :key="doc.id"
                        class="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
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
                                    Ngày hiệu lực: {{ doc.effectiveDate }}
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
                <div class="text-center mt-8">
                    <a
                        href="#"
                        class="text-blue-600 font-medium hover:underline"
                    >
                        Xem tất cả văn bản
                    </a>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <Footer />
    </div>
</template>

<script>
import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";

export default defineComponent({
    name: "TraCuuView",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            searchQuery: "",
            featuredDocs: [
                {
                    id: 1,
                    title: "Thông tư 41/2023/TT-NHNN",
                    description:
                        "Sửa đổi, bổ sung một số điều của Thông tư số 40/2024/TT-NHNN...",
                    issueDate: "05/11/2025",
                    effectiveDate: "05/12/2025",
                    status: "Sắp có hiệu lực",
                },
                {
                    id: 2,
                    title: "Nghị định 288/2025/NĐ-CP",
                    description:
                        "Quy định về quản lý tàu bay không người lái và phương tiện bay...",
                    issueDate: "05/11/2025",
                    effectiveDate: "05/11/2025",
                    status: "Còn hiệu lực",
                },
                {
                    id: 3,
                    title: "Thông tư 39/2016/TT-NHNN",
                    description:
                        "Quy định về hoạt động cho vay của tổ chức tín dụng...",
                    issueDate: "30/12/2016",
                    effectiveDate: "15/03/2017",
                    status: "Còn hiệu lực",
                },
                {
                    id: 4,
                    title: "Luật 50/2014/QH13",
                    description:
                        "Luật sửa đổi, bổ sung một số điều của Luật Giao thông đường thủy nội địa",
                    issueDate: "17/06/2014",
                    effectiveDate: "01/01/2015",
                    status: "Hết hiệu lực một phần",
                },
            ],
        };
    },
    methods: {
        handleSearch() {
            if (this.searchQuery.trim()) {
                console.log("Đang tìm kiếm với từ khóa:", this.searchQuery);
                // Thêm logic API hoặc router push ở đây
            } else {
                alert("Vui lòng nhập từ khóa tìm kiếm.");
            }
        },
        getStatusClass(status) {
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

<style scoped></style>
