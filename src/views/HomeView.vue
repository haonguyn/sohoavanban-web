<template>
    <div class="bg-gray-100 min-h-screen font-sans">
        <!-- Thanh điều hướng (Navbar) -->
        <Header />
        <!-- Phần Hero & Thanh Tìm kiếm chính -->
            <div class="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-b">
            <!-- background decoration -->
            <div class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
            <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

            <div
                class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up">
                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Hệ thống tra cứu văn bản
                </h1>
                <h3 class="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Tìm kiếm, quản lý và trích xuất nội dung văn bản một cách
                    <p class="text-indigo-600 font-semibold" > Nhanh chóng – Chính xác – Thông minh</p>
                </h3>
                <!-- Search box -->
                <div
                    class="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-white/50">
                    <form @submit.prevent="handleSearch" class="flex">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Nhập từ khóa, số hiệu, nội dung văn bản..."
                            class="flex-grow px-5 py-4 text-base text-gray-700 bg-transparent focus:outline-none" />

                        <button
                            type="submit"
                            :disabled="!searchQuery.trim()"
                            class="px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    <RouterLink
                        to="/tra-cuu"
                        class="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                        → Tìm kiếm nâng cao
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- Phần Tính năng -->
        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-2xl font-bold text-gray-800">
                        Tính năng nổi bật
                    </h2>
                    <p class="text-gray-600">
                        Các công cụ mạnh mẽ giúp bạn làm việc với văn bản
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Tính năng 1: Tra cứu -->
                    <RouterLink
                        to="/tra-cuu"
                        class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">

                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                        <div
                            class="relative flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl mx-auto mb-5 group-hover:scale-110 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-8 h-8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>

                        <h3 class="relative text-xl font-bold text-gray-900 mb-2">
                            Tra cứu thông minh
                        </h3>
                        <p class="relative text-gray-600 text-sm leading-relaxed">
                            Tìm kiếm chính xác và nhanh chóng với bộ lọc đa dạng:
                            từ khóa, ngày ban hành, cơ quan ban hành...
                        </p>
                    </RouterLink>

                    <!-- Tính năng 2: Quản lý -->
                    <RouterLink
                        to="/quan-ly"
                        class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">

                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                        <div
                            class="relative flex items-center justify-center h-16 w-16 bg-green-100 text-green-600 rounded-2xl mx-auto mb-5 group-hover:scale-110 transition">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-8 h-8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3.75 9.776c.814.246 1.668.4 2.55.465a7.5 7.5 0 0 1 7.5 0c.882-.065 1.736-.219 2.55-.465M2.25 10.5v8.25c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-8.25M12 15.75V3.75m0 12V3.75m0 12v-8.25m0 8.25V3.75m-4.5 0v12m0 0V3.75m0 0v12m0-12V3.75m9 12V3.75m0 0v12m0 0V3.75m0 0v12m0-12V3.75" />
                            </svg>
                        </div>

                        <h3 class="relative text-xl font-bold text-gray-900 mb-2">
                            Quản lý & Lưu trữ
                        </h3>
                        <p class="relative text-gray-600 text-sm leading-relaxed">
                            Lưu trữ, phân loại và quản lý các văn bản cá nhân hoặc của tổ chức một cách an toàn và khoa
                            học.
                        </p>
                    </RouterLink>

                    <!-- Tính năng 3: OCR -->
                    <RouterLink
                        to="/ocr-vanban"
                        class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden">

                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                        <div
                            class="relative flex items-center justify-center h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl mx-auto mb-5 group-hover:scale-110 transition">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-8 h-8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3.75 9.776c.814.246 1.668.4 2.55.465a7.5 7.5 0 0 1 7.5 0c.882-.065 1.736-.219 2.55-.465M2.25 10.5v8.25c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-8.25M12 15.75V3.75m0 12V3.75m0 12v-8.25m0 8.25V3.75m-4.5 0v12m0 0V3.75m0 0v12m0-12V3.75m9 12V3.75m0 0v12m0 0V3.75m0 0v12m0-12V3.75" />
                            </svg>
                        </div>

                        <h3 class="relative text-xl font-bold text-gray-900 mb-2">
                            Trích xuất OCR
                        </h3>
                        <p class="relative text-gray-600 text-sm leading-relaxed">
                            Chuyển đổi văn bản từ hình ảnh hoặc file PDF scan
                            thành văn bản có thể tìm kiếm và chỉnh sửa.
                        </p>
                    </RouterLink>
                    
                </div>
            </div>
        </section>

        <section class="py-16 bg-white border-b border-gray-200">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-10">
                    <span class="text-gray-500 font-semibold uppercase tracking-widest text-sm">Tra cứu nhanh</span>
                    <h3 class="text-3xl font-extrabold text-gray-900 mt-1">Chủ đề được quan tâm gần đây</h3>
                </div>
                <div class="flex flex-wrap justify-center gap-3 md:gap-4 max-w-5xl mx-auto">
                    <a
                        v-for="topic in trendingTopics"
                        :key="topic"
                        @click="searchByTopic(topic)"
                        class="px-5 py-2 text-sm md:text-base font-medium rounded-full
                            bg-white text-gray-700 border border-gray-200
                            hover:bg-indigo-600 hover:text-white hover:border-indigo-600
                            transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer">
                        #{{ topic }}
                    </a>
                </div>
            </div>
        </section>

        <!-- Danh sách văn bản (mới/xem nhiều) -->
        <section class="py-16 bg-gray-100">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    Văn bản mới cập nhật
                </h2>

                <div class="space-y-4">
                    <!-- Mockup item văn bản -->
                    <div
                        v-for="doc in featuredDocs"
                        :key="doc.id"
                        class="bg-white p-5 rounded-xl shadow-sm border border-gray-200
                            hover:shadow-lg hover:border-indigo-300 transition-all duration-300">

                        <div class="flex flex-col sm:flex-row justify-between">
                            <div class="border-l-4 pl-4"
                                :class="{
                                    'border-green-400': doc.status === 'Còn hiệu lực',
                                    'border-blue-400': doc.status === 'Sắp có hiệu lực',
                                    'border-yellow-400': doc.status.includes('Hết'),
                                }">
                                <span
                                    :class="getStatusClass(doc.status)"
                                    class="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2">
                                    {{ doc.status }}
                                </span>

                                <h3 class="text-lg font-semibold text-indigo-700 hover:underline">
                                    {{ doc.title }}
                                </h3>
                                <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {{ doc.description }}
                                </p>
                            </div>

                            <div class="mt-4 sm:mt-0 sm:text-right text-sm text-gray-500">
                                <p>Ban hành: {{ doc.issueDate }}</p>
                                <p>Hiệu lực: {{ doc.effectiveDate }}</p>
                                <a class="inline-block mt-2 text-indigo-600 hover:underline">
                                    Xem chi tiết →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-8">
                    <a href="#" class="text-blue-600 font-medium hover:underline">
                        Xem tất cả văn bản
                    </a>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <Footer />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Footer from "../components/layout/Footer.vue";
import axios from "axios";

export default defineComponent({
    name: "HomeView",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            searchQuery: "",
            documents: [] as any[],
            loading: false,
            trendingTopics: [
                "Thuế VAT mới",
                "Luật đất đai 2024",
                "Chính sách tiền lương",
                "Thủ tục hành chính",
                "Đấu thầu qua mạng",
                "Đầu tư công",
                "Quy định về hóa đơn điện tử",
                "Bảo hiểm xã hội",
            ],
            featuredDocs: [] as any[],
        };
    },

    methods: {
        handleSearch() {
             if (!this.searchQuery.trim()) return;

            this.$router.push({
                path: "/tra-cuu",
                query: { keyword: this.searchQuery.trim() },
            });
        },

        searchByTopic(topic: string) {  
            this.$router.push({
                path: "/tra-cuu",
                query: { keyword: topic },
            });
        },

        getStatusClass(status: string) {
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

        async fetchFeaturedDocs() {
            try {
                const res = await axios.get("/api/documents/latest");
                this.featuredDocs = res.data;
            } catch (e) {
                console.error("Lỗi tải văn bản mới:", e);
            }
        },
    },
        mounted() {
        this.fetchFeaturedDocs();
        const keyword = this.$route.query.keyword as string;
            if (keyword) {
                this.searchQuery = keyword;
                this.handleSearch();
            }
    },
        watch: {
            "$route.query.keyword"(newKeyword: string) {
                if (newKeyword) {
                    this.searchQuery = newKeyword;
                    this.handleSearch();
                }
            },
        },


});
</script>


<style scoped>
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out both;
    }
</style>
