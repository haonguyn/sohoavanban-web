<template>
    <Header />

    <div class="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="container mx-auto">
            <!-- Header của trang -->
            <div
                class="flex flex-col sm:flex-row justify-between sm:items-center mb-6"
            >
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        Quản lý Văn bản
                    </h1>
                    <p class="text-lg text-gray-600 mt-1">
                        Lưu trữ và tổ chức các văn bản cá nhân của bạn.
                    </p>
                </div>
                <button
                    @click="uploadNew"
                    class="mt-4 sm:mt-0 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 mr-2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Tải lên văn bản mới
                </button>
            </div>

            <!-- Phần nội dung chính (bảng quản lý) -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <!-- Thanh tìm kiếm và bộ lọc nhanh -->
                <div class="flex justify-between mb-4">
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Tìm kiếm văn bản của bạn..."
                        class="w-full md:w-1/3 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <!-- Bảng dữ liệu văn bản -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Tên văn bản
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Ngày tải lên
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Trạng thái
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="doc in myDocuments" :key="doc.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        {{ doc.title }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ doc.type }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">
                                        {{ doc.uploadDate }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="
                                            doc.isPrivate
                                                ? 'bg-gray-100 text-gray-800'
                                                : 'bg-green-100 text-green-800'
                                        "
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                    >
                                        {{
                                            doc.isPrivate
                                                ? "Cá nhân"
                                                : "Đã chia sẻ"
                                        }}
                                    </span>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                >
                                    <a
                                        href="#"
                                        class="text-blue-600 hover:text-blue-900 mr-3"
                                        >Xem</a
                                    >
                                    <a
                                        href="#"
                                        class="text-red-600 hover:text-red-900"
                                        >Xóa</a
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
    name: "MyDocuments",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            searchQuery: "" as string,
            myDocuments: [
                {
                    id: 1,
                    title: "Hợp đồng lao động Mẫu 2025",
                    type: "PDF",
                    uploadDate: "10/11/2025",
                    isPrivate: true,
                },
                {
                    id: 2,
                    title: "Báo cáo tài chính Quý 3",
                    type: "DOCX",
                    uploadDate: "01/10/2025",
                    isPrivate: true,
                },
                {
                    id: 3,
                    title: "Luật Đất đai (đã note)",
                    type: "PDF",
                    uploadDate: "15/09/2025",
                    isPrivate: false,
                },
            ] as {
                id: number;
                title: string;
                type: string;
                uploadDate: string;
                isPrivate: boolean;
            }[],
        };
    },

    methods: {
        uploadNew() {
            console.log("Mở hộp thoại tải lên...");
            // TODO: Thêm logic mở modal hoặc chuyển trang upload
        },
    },
});
</script>
