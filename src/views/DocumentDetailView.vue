<template>
    <Header />
    <div class="bg-gray-100 min-h-screen pb-12">
        <!-- Breadcrumb & Toolbar -->
        <div class="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-30">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <!-- Breadcrumb -->
                    <nav class="flex text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                        <a href="/" class="hover:text-blue-600">Trang chủ</a>
                        <span class="mx-2">/</span>
                        <a href="/tra-cuu" class="hover:text-blue-600">Tra cứu</a>
                        <span class="mx-2">/</span>
                        <span class="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">
                            {{ document.number }}
                        </span>
                    </nav>

                    <!-- Actions -->
                    <div class="flex items-center space-x-3">
                        <button
                            class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            In
                        </button>
                        <button
                            class="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Tải về
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <!-- LEFT SIDEBAR (Metadata & TOC) -->
                <aside class="lg:col-span-3 order-2 lg:order-1">
                    <div class="space-y-6 sticky top-36">
                        <!-- Box: Thuộc tính văn bản -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 class="text-sm font-bold text-gray-800 uppercase">Thuộc tính văn bản</h3>
                            </div>
                            <div class="p-4 text-sm">
                                <div class="space-y-3">
                                    <div>
                                        <span class="block text-gray-500 text-xs">Số hiệu:</span>
                                        <span class="font-medium text-gray-900">{{ document.number }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs">Loại văn bản:</span>
                                        <span class="font-medium text-gray-900">{{ document.type }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs">Cơ quan ban hành:</span>
                                        <span class="font-medium text-gray-900">{{ document.issuer }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs">Người ký:</span>
                                        <span class="font-medium text-gray-900">{{ document.signer }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs">Ngày ban hành:</span>
                                        <span class="font-medium text-gray-900">{{ document.issueDate }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs">Ngày hiệu lực:</span>
                                        <span class="font-medium text-gray-900">{{ document.effectiveDate }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs">Trạng thái:</span>
                                        <span :class="getStatusClass(document.status)" class="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full border">
                                            {{ document.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Box: Mục lục -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
                            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 class="text-sm font-bold text-gray-800 uppercase">Mục lục</h3>
                            </div>
                            <nav class="max-h-[calc(100vh-500px)] overflow-y-auto p-2 scrollbar-thin">
                                <ul class="space-y-1">
                                    <li v-for="(item, index) in tableOfContents" :key="index">
                                        <a :href="item.href" 
                                           class="block px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors truncate"
                                           :title="item.label">
                                            {{ item.label }}
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </aside>

                <!-- CENTER CONTENT (Full Text) -->
                <main class="lg:col-span-9 order-1 lg:order-2">
                    <div class="bg-white rounded-lg shadow-md min-h-screen p-8 sm:p-12">
                        <!-- Document Header inside Paper -->
                        <div class="text-center mb-10 border-b border-gray-200 pb-8">
                            <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                                {{ document.issuer.toUpperCase() }}
                            </h4>
                            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                                {{ document.title }}
                            </h1>
                            <p class="text-gray-600 italic">
                                Ban hành ngày {{ document.issueDate }}, có hiệu lực từ ngày {{ document.effectiveDate }}
                            </p>
                        </div>

                        <!-- Content Body -->
                        <div class="prose prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600">
                            <!-- Giả lập nội dung văn bản HTML -->
                            <div v-html="document.content"></div>
                        </div>
                        
                        <!-- Signature Section (Mock) -->
                        <div class="mt-16 flex justify-end">
                            <div class="text-center">
                                <p class="font-bold text-gray-900 uppercase">TM. Chính Phủ</p>
                                <p class="font-bold text-gray-900 uppercase mb-16">Thủ Tướng</p>
                                <p class="font-bold text-gray-900">Phạm Minh Chính</p>
                                <p class="text-sm text-gray-500">(Đã ký)</p>
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
    name: "DocumentDetail",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            document: {
                id: 2,
                number: "288/2025/NĐ-CP",
                title: "Nghị định quy định về quản lý tàu bay không người lái và phương tiện bay siêu nhẹ",
                type: "Nghị định",
                issuer: "Chính phủ",
                signer: "Phạm Minh Chính",
                issueDate: "05/11/2025",
                effectiveDate: "05/11/2025",
                status: "Còn hiệu lực",
                content: `
                    <h3 id="chuong-1">Chương I: QUY ĐỊNH CHUNG</h3>
                    
                    <p><strong>Điều 1. Phạm vi điều chỉnh</strong></p>
                    <p>Nghị định này quy định về quản lý tàu bay không người lái và phương tiện bay siêu nhẹ; trách nhiệm của các cơ quan, tổ chức, cá nhân trong việc quản lý, sử dụng tàu bay không người lái và phương tiện bay siêu nhẹ.</p>

                    <p><strong>Điều 2. Đối tượng áp dụng</strong></p>
                    <p>1. Tổ chức, cá nhân Việt Nam và tổ chức, cá nhân nước ngoài tham gia hoạt động liên quan đến tàu bay không người lái và phương tiện bay siêu nhẹ tại Việt Nam.</p>
                    <p>2. Các cơ quan quản lý nhà nước có thẩm quyền.</p>

                    <h3 id="chuong-2">Chương II: QUẢN LÝ KHAI THÁC VÀ SỬ DỤNG</h3>

                    <p><strong>Điều 3. Đăng ký phương tiện</strong></p>
                    <p>1. Tàu bay không người lái và phương tiện bay siêu nhẹ phải được đăng ký tại cơ quan có thẩm quyền trước khi đưa vào khai thác.</p>
                    <p>2. Bộ Công an chịu trách nhiệm xây dựng cơ sở dữ liệu quản lý đăng ký phương tiện bay.</p>

                    <p><strong>Điều 4. Vùng cấm bay và vùng hạn chế bay</strong></p>
                    <p>1. Vùng cấm bay bao gồm các khu vực quân sự, khu vực trụ sở cơ quan Đảng, Nhà nước, khu vực biên giới...</p>
                    <p>2. Vùng hạn chế bay là vùng trời có điều kiện hoạt động bay cụ thể về thời gian, độ cao.</p>

                    <h3 id="chuong-3">Chương III: TRÁCH NHIỆM QUẢN LÝ</h3>
                    
                    <p><strong>Điều 5. Trách nhiệm của Bộ Quốc phòng</strong></p>
                    <p>Chủ trì, phối hợp với các bộ, ngành liên quan quản lý vùng trời, cấp phép bay cho tàu bay không người lái.</p>

                    <p><strong>Điều 6. Trách nhiệm của chủ sở hữu</strong></p>
                    <p>Chủ sở hữu phương tiện phải tuân thủ nghiêm ngặt các quy định về an toàn bay, không xâm phạm đời tư cá nhân và an ninh quốc gia.</p>

                    <h3 id="chuong-4">Chương IV: ĐIỀU KHOẢN THI HÀNH</h3>
                    
                    <p><strong>Điều 7. Hiệu lực thi hành</strong></p>
                    <p>Nghị định này có hiệu lực thi hành kể từ ngày ký. Các quy định trước đây trái với Nghị định này đều bị bãi bỏ.</p>
                `
            },
            tableOfContents: [
                { label: "Chương I: QUY ĐỊNH CHUNG", href: "#chuong-1" },
                { label: "Điều 1. Phạm vi điều chỉnh", href: "#" },
                { label: "Điều 2. Đối tượng áp dụng", href: "#" },
                { label: "Chương II: QUẢN LÝ KHAI THÁC", href: "#chuong-2" },
                { label: "Điều 3. Đăng ký phương tiện", href: "#" },
                { label: "Điều 4. Vùng cấm bay", href: "#" },
                { label: "Chương III: TRÁCH NHIỆM", href: "#chuong-3" },
                { label: "Điều 5. Trách nhiệm BQP", href: "#" },
                { label: "Điều 6. Trách nhiệm chủ sở hữu", href: "#" },
                { label: "Chương IV: ĐIỀU KHOẢN THI HÀNH", href: "#chuong-4" },
            ]
        };
    },
    methods: {
        getStatusClass(status: string): string {
            switch (status) {
                case "Còn hiệu lực":
                    return "bg-green-100 text-green-700 border-green-200";
                case "Sắp có hiệu lực":
                    return "bg-blue-100 text-blue-700 border-blue-200";
                case "Hết hiệu lực một phần":
                    return "bg-yellow-100 text-yellow-800 border-yellow-200";
                case "Hết hiệu lực":
                    return "bg-gray-100 text-gray-500 border-gray-200";
                default:
                    return "bg-gray-100 text-gray-600";
            }
        },
    },
});
</script>

<style scoped>
/* Custom scrollbar for TOC */
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>