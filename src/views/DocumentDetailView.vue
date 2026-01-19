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
                            {{ document.doc_number }}
                        </span>
                    </nav>

                    <!-- Actions -->
                    <div class="flex items-center space-x-3">
                        <div class="text-xs text-gray-500 mr-2 hidden sm:block">
                            <span class="font-medium text-gray-900">1.205</span> lượt xem
                        </div>
                        <button v-if="document.attachments" @click="doDownloadFile(document)"
                            class="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Tải về ({{ formatFileSize(document.attachments.file_size) }})
                        </button>
                        <button
                            class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            In phiếu
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <!-- LEFT SIDEBAR (Metadata) -->
                <aside class="lg:col-span-3 order-2 lg:order-1">
                    <div class="space-y-6 sticky top-36">
                        <!-- Box: Thuộc tính văn bản -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 class="text-sm font-bold text-gray-800 uppercase">Thông tin chung</h3>
                            </div>
                            <div class="p-4 text-sm">
                                <div class="space-y-4">
                                    <div>
                                        <span class="block text-gray-500 text-xs uppercase font-semibold">Số ký
                                            hiệu</span>
                                        <span class="font-medium text-gray-900 text-base">{{ document.doc_number
                                            }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs uppercase font-semibold">Loại văn
                                            bản</span>
                                        <span class="font-medium text-gray-900">{{ document.doc_type }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs uppercase font-semibold">Cơ quan ban
                                            hành</span>
                                        <span class="font-medium text-gray-900">{{ document.issued_by }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs uppercase font-semibold">Người
                                            ký</span>
                                        <span class="font-medium text-gray-900">{{ document.signer }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-gray-500 text-xs uppercase font-semibold">Ngày ban
                                            hành</span>
                                        <span class="font-medium text-gray-900">{{ formatDate(document.issued_date)
                                            }}</span>
                                    </div>
                                    <div v-if="document.effective_start_date">
                                        <span class="block text-gray-500 text-xs uppercase font-semibold">Ngày bắt đầu
                                            hiệu lực</span>
                                        <span class="font-medium text-gray-900">{{
                                            formatDate(document.effective_start_date)
                                            }}</span>
                                    </div>
                                    <div v-if="document.effective_end_date">
                                        <span class="block text-gray-500 text-xs uppercase font-semibold">Ngày hết
                                            hiệu lực</span>
                                        <span class="font-medium text-gray-900">{{
                                            formatDate(document.effective_end_date)
                                            }}</span>
                                    </div>

                                    <div>
                                        <span class="block text-gray-500 text-xs uppercase font-semibold mb-1">Trạng
                                            thái</span>
                                        <span :class="getStatusClass(effectiveStatus)"
                                            class="inline-block px-2 py-1 text-xs font-bold rounded border">
                                            {{ effectiveStatus }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Box: Chia sẻ (Gợi ý thêm) -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-4">
                            <p class="text-xs text-gray-500 uppercase font-semibold mb-3">Chia sẻ văn bản</p>
                            <div class="flex space-x-2">
                                <button
                                    class="flex-1 bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700 transition">Facebook</button>
                                <button
                                    class="flex-1 bg-sky-500 text-white text-xs py-2 rounded hover:bg-sky-600 transition">Zalo</button>
                                <button
                                    class="flex-1 bg-gray-100 text-gray-600 text-xs py-2 rounded hover:bg-gray-200 transition">Copy
                                    Link</button>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER CONTENT (PDF & Tabs) -->
                <main class="lg:col-span-9 order-1 lg:order-2">
                    <div class="bg-white rounded-lg shadow-md min-h-screen overflow-hidden flex flex-col">
                        <!-- Header -->
                        <div class="p-6 sm:p-8 border-b border-gray-200 bg-gray-50">
                            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
                                {{ document.title }}
                            </h1>
                            <p class="text-sm text-gray-600">
                                {{ document.summary || document.note}}
                            </p>
                        </div>

                        <!-- PDF Viewer Section -->
                        <div class="flex-grow bg-gray-200 relative min-h-[600px] sm:min-h-[800px]">
                            <!-- Loading State -->
                            <div v-if="loadingPdf" class="absolute inset-0 flex items-center justify-center">
                                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>

                            <iframe v-if="document?.attachments?.preview_url" :src="document.attachments.preview_url"
                                class="w-full h-full absolute inset-0" frameborder="0" @load="loadingPdf = false">
                            </iframe>

                            <!-- Fallback khi không có PDF -->
                            <div v-else
                                class="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                                <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                                    </path>
                                </svg>
                                <p class="text-lg font-medium">Không thể hiển thị bản xem trước</p>
                                <p class="text-sm mb-4">Vui lòng tải về để xem nội dung chi tiết.</p>
                                <button @click="doDownloadFile(document)"
                                    class="text-blue-600 hover:underline font-medium">
                                    Tải file đính kèm
                                </button>
                            </div>
                        </div>

                        <!-- Bottom Tabs Information -->
                        <div class="border-t border-gray-200">
                            <!-- Tab Headers -->
                            <div class="flex border-b border-gray-200 bg-gray-50">
                                <button @click="activeTab = 'related'"
                                    :class="['px-6 py-3 text-sm font-medium focus:outline-none transition-colors border-b-2', activeTab === 'related' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100']">
                                    Văn bản liên quan ({{ relatedDocs.length }})
                                </button>
                                <button @click="activeTab = 'history'"
                                    :class="['px-6 py-3 text-sm font-medium focus:outline-none transition-colors border-b-2', activeTab === 'history' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100']">
                                    Lịch sử xử lý
                                </button>
                                <button @click="activeTab = 'feedback'"
                                    :class="['px-6 py-3 text-sm font-medium focus:outline-none transition-colors border-b-2', activeTab === 'feedback' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100']">
                                    Góp ý / Hỏi đáp
                                </button>
                            </div>

                            <!-- Tab Contents -->
                            <div class="p-6 bg-white min-h-[200px]">
                                <!-- Tab: Văn bản liên quan -->
                                <div v-if="activeTab === 'related'">
                                    <div v-if="relatedDocs.length > 0" class="overflow-x-auto">
                                        <table class="min-w-full text-sm text-left text-gray-500">
                                            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th class="px-4 py-3">Số hiệu</th>
                                                    <th class="px-4 py-3">Trích yếu</th>
                                                    <th class="px-4 py-3">Ngày BH</th>
                                                    <th class="px-4 py-3">Mối quan hệ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(doc, idx) in relatedDocs" :key="idx"
                                                    class="bg-white border-b hover:bg-gray-50">
                                                    <td class="px-4 py-3 font-medium text-blue-600 whitespace-nowrap">
                                                        <a href="#">{{ doc.number }}</a>
                                                    </td>
                                                    <td class="px-4 py-3">{{ doc.title }}</td>
                                                    <td class="px-4 py-3 whitespace-nowrap">{{ doc.date }}</td>
                                                    <td class="px-4 py-3">
                                                        <span
                                                            class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{{
                                                                doc.relation }}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p v-else class="text-gray-500 italic">Không có văn bản liên quan nào.</p>
                                </div>

                                <!-- Tab: Lịch sử -->
                                <div v-if="activeTab === 'history'">
                                    <ol class="relative border-l border-gray-200 ml-3">
                                        <li v-for="(log, idx) in document.history" :key="idx" class="mb-6 ml-4">
                                            <div
                                                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white">
                                            </div>
                                            <time class="mb-1 text-sm font-normal leading-none text-gray-400">{{
                                                formatDate(log.date)
                                            }}</time>
                                            <h3 class="text-sm font-semibold text-gray-900">{{ log.action }}</h3>
                                            <p class="mb-2 text-sm font-normal text-gray-500">Thực hiện bởi: {{ log.user
                                                }}</p>
                                        </li>
                                    </ol>
                                </div>

                                <!-- Tab: Góp ý -->
                                <div v-if="activeTab === 'feedback'">
                                    <form @submit.prevent="" class="space-y-4 max-w-2xl">
                                        <div>
                                            <label class="block mb-2 text-sm font-medium text-gray-900">Nội dung góp
                                                ý</label>
                                            <textarea rows="4"
                                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Nhập ý kiến của bạn về văn bản này..."></textarea>
                                        </div>
                                        <button type="button"
                                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Gửi
                                            góp ý</button>
                                    </form>
                                </div>
                            </div>
                        </div>
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
import type { Doc } from "../types/DocumentTypes";
import { getDocumentDetail } from "../api/documentApi";
import { fetchAttachmentsByDoc } from "../api/attachmentApi";
import { base64ToBlob, downloadFile, formatDate, formatFileSize, getDocumentEffectiveStatus } from "../utils/fileUtils";
import ToastNotification from "../components/ToastNotification.vue";
import { getStatusClass } from "../utils/textUtils";
import LoadingComponent from "../components/LoadingComponent.vue";

export default defineComponent({
    name: "DocumentDetail",
    components: {
        Header,
        Footer,
        ToastNotification,
        LoadingComponent,
    },
    data() {
        return {
            activeTab: 'related' as 'related' | 'history' | 'feedback',
            loadingPdf: true,
            document: {} as Doc,

            relatedDocs: [
                { number: "79/2011/NĐ-CP", title: "Nghị định sửa đổi một số điều...", date: "05/09/2011", relation: "Căn cứ" },
                { number: "36/2008/QĐ-BQP", title: "Quy định về cấp phép bay...", date: "20/12/2008", relation: "Liên quan" },
                { number: "Luật Hàng không 2006", title: "Luật Hàng không dân dụng Việt Nam", date: "29/06/2006", relation: "Căn cứ pháp lý" },
            ]
        };
    },
    computed: {
        effectiveStatus() {
            return getDocumentEffectiveStatus({
                effective_start_date: this.document.effective_start_date,
                effective_end_date: this.document.effective_end_date,
            });
        },
    },
    mounted() {
        const id = Number(this.$route.params.id);
        this.loadDocument(id);
    },
    methods: {
        async loadDocument(id: number) {
            (this.$refs.loadingRef as any).show();
            try {
                const [docRes, attachRes] = await Promise.all([
                    getDocumentDetail(id),
                    fetchAttachmentsByDoc(id),
                ]);
                const lastAttachment = attachRes.data.length > 0 ? attachRes.data[attachRes.data.length - 1] : null;
                this.document = {
                    ...docRes.data,
                    attachments: lastAttachment,
                };
            } finally {
                (this.$refs.loadingRef as any).hide();
            }
        },
        async doDownloadFile(document: any) {
            const att = document?.attachments;
            if (!att || !att.file_base64) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `Xảy ra lỗi khi yêu cầu tải file xuống`
                );
                return;
            }
            const blob = base64ToBlob(att.file_base64);
            downloadFile(blob, att.filename);
        },
        formatFileSize,
        formatDate,
        getStatusClass
    },
});
</script>