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
                            <span class="font-medium text-gray-900">{{ formatNumber(document.view_count) }}</span> lượt xem
                        </div>
                        <button v-if="document.attachments" @click="doDownloadFile(document)"
                            class="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Tải về ({{ formatFileSize(document.attachments.file_size) }})
                        </button>
                        <button @click="handlePrint"
                            class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                            <i class="fa-solid fa-print w-4 h-4 mr-2 text-gray-500"></i>
                            In File
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

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
                                <button @click="shareFacebook"
                                    class="flex-1 bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-1"><i class="fa-brands fa-facebook"></i>Facebook</button>
                                <button @click="shareZalo"
                                    class="flex-1 bg-sky-500 text-white text-xs py-2 rounded hover:bg-sky-600 transition flex items-center justify-center gap-1"><i class="fa-solid fa-comment-dots"></i>Zalo</button>
                                <button @click="copyPageLink"
                                    class="flex-1 bg-gray-100 text-gray-600 text-xs py-2 rounded hover:bg-gray-200 transition flex items-center justify-center gap-1"><i class="fa-solid fa-link"></i>Copy Link</button>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER CONTENT (PDF & Tabs) -->
                <main class="lg:col-span-6 order-1 lg:order-2">
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

                        <!-- File Preview Viewer Section -->
                        <div class="flex-grow bg-gray-200 relative min-h-[600px] sm:min-h-[800px] flex justify-center items-center p-1">
                            <!-- Loading State -->
                            <div v-if="loadingPdf" class="absolute inset-0 flex items-center justify-center z-10">
                                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>

                            <iframe v-if="document?.attachments?.preview_url && documentFileType === 'pdf'" 
                                :src="document.attachments.preview_url + '#toolbar=0&navpanes=0&view=FitH'"
                                class="w-full h-full absolute inset-0 rounded shadow-lg border border-gray-300" 
                                frameborder="0" 
                                @load="loadingPdf = false">
                            </iframe>

                            <img v-else-if="document?.attachments?.preview_url && documentFileType === 'image'" 
                                :src="document.attachments.preview_url" 
                                alt="Image Preview" 
                                class="max-w-full max-h-full object-contain shadow-2xl rounded relative z-0" 
                                @load="loadingPdf = false" 
                                @error="loadingPdf = false" />

                            <!-- Fallback khi không có Preview hoặc không hỗ trợ -->
                            <div v-else
                                class="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500 p-8 text-center z-0">
                                <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                                    </path>
                                </svg>
                                <p class="text-lg font-medium">Không thể hiển thị bản xem trước</p>
                                <p class="text-sm mb-4">Vui lòng tải về để xem nội dung chi tiết.</p>
                                <button v-if="document?.attachments" @click="doDownloadFile(document)"
                                    class="text-blue-600 hover:underline font-medium">
                                    Tải file đính kèm
                                </button>
                            </div>
                        </div>

                        <!-- Bottom Tabs Information -->
                        <div class="border-t border-gray-200">
                            <!-- Tab Headers -->
                            <div class="flex border-b border-gray-200 bg-gray-50">
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
                                    <div class="space-y-6">
                                        <!-- Danh sách góp ý (Chỉ hiện khi đăng nhập) -->
                                        <div v-if="isLoggedIn" class="space-y-4">
                                            <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider border-b pb-2">Danh sách góp ý trước đó</h4>
                                            <div v-if="feedbacks.length > 0" class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                <div v-for="fb in feedbacks" :key="fb.id" class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white transition-colors animate-fade-in">
                                                    <div class="flex justify-between items-start mb-2">
                                                        <span class="font-bold text-blue-700 text-sm">
                                                            {{ fb.full_name || fb.username }}
                                                        </span>
                                                        <span class="text-xs text-gray-500 italic">{{ formatDate(fb.created_at) }}</span>
                                                    </div>
                                                    <p class="text-sm text-gray-700 line-clamp-3 leading-relaxed">{{ fb.content }}</p>
                                                </div>
                                            </div>
                                            <div v-else class="text-center py-8 text-gray-500 italic text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                Chưa có góp ý nào cho văn bản này.
                                            </div>
                                        </div>
                                        
                                        <!-- Thông báo cho khách -->
                                        <div v-else class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm flex items-center gap-3">
                                            <i class="fa-solid fa-circle-info text-lg"></i>
                                            <span>Bạn cần <RouterLink to="/login" class="font-bold underline hover:text-blue-800">đăng nhập</RouterLink> để xem các góp ý trước đó.</span>
                                        </div>

                                        <!-- Form gửi góp ý (Cho tất cả) -->
                                        <div class="pt-4 border-t border-gray-100">
                                            <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Gửi góp ý của bạn</h4>
                                            <div class="space-y-4 max-w-2xl">
                                                <div class="flex items-center gap-2 mb-2 text-sm text-gray-500" v-if="!isLoggedIn">
                                                    <i class="fa-solid fa-user-secret"></i> Bạn đang gửi với tư cách <strong>Guest (Khách)</strong>
                                                </div>
                                                <div class="flex items-center gap-2 mb-2 text-sm text-gray-500" v-else>
                                                    <i class="fa-solid fa-user-check text-green-600"></i> Bạn đang gửi với tư cách <strong>{{ currentUser }}</strong>
                                                </div>
                                                <textarea v-model="feedbackContent" rows="4"
                                                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="Nhập ý kiến của bạn về văn bản này..."></textarea>
                                                <button @click="handleSendFeedback" :disabled="!feedbackContent.trim() || sendingFeedback"
                                                    class="text-white bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-all flex items-center justify-center min-w-[120px] shadow-sm active:scale-95">
                                                    <i v-if="sendingFeedback" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                                                    {{ sendingFeedback ? 'Đang gửi...' : 'Gửi góp ý' }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- RIGHT SIDEBAR (Related Docs) -->
                <aside class="lg:col-span-3 order-3 sticky top-36 h-fit max-h-[calc(100vh-160px)] overflow-y-auto">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 class="text-sm font-bold text-gray-800 uppercase">Văn bản liên quan</h3>
                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{{ relatedDocs.length }}</span>
                        </div>
                        <div class="p-4 text-sm bg-gray-50/50">
                            <div v-if="relatedDocs.length > 0" class="space-y-4">
                                <div v-for="(link, idx) in relatedDocs" :key="idx" class="bg-white border border-blue-100/60 rounded p-3 shadow-sm hover:border-blue-300 transition-colors">
                                    <div class="mb-2">
                                        <span class="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wide">{{ formatLinkType(link.link_type) }}</span>
                                    </div>
                                    <a :href="'/document-detail/' + link.target_doc_id" class="font-bold text-sm text-blue-700 hover:text-blue-800 hover:underline block mb-1">
                                        {{ link.target_doc_number }}
                                    </a>
                                    <p class="text-xs text-gray-600 line-clamp-2 mb-3" :title="link.target_title">{{ link.target_title }}</p>
                                    
                                    <!-- AI Comparison mini box -->
                                    <div v-if="link.ai_comparison" class="bg-gradient-to-b from-indigo-50 to-white p-3 rounded border border-indigo-100 relative">
                                        <div class="flex items-center gap-1.5 text-indigo-700 text-[10px] font-bold mb-1.5 uppercase">
                                            <i class="fas fa-robot"></i> Điểm thay đổi chính
                                        </div>
                                        <div class="text-xs text-gray-700 format-ai leading-relaxed" v-html="formatAiText(link.ai_comparison)"></div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center py-6">
                                <i class="fas fa-link text-gray-300 text-2xl mb-2"></i>
                                <p class="text-gray-500 text-xs italic">Không có liên kết nào</p>
                            </div>
                        </div>
                    </div>
                </aside>
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
import { getDocumentDetail, getDocumentLinks } from "../api/documentApi";
import { fetchAttachmentsByDoc } from "../api/attachmentApi";
import { base64ToBlob, downloadFile, formatDate, formatFileSize, getDocumentEffectiveStatus, formatNumber } from "../utils/fileUtils";
import ToastNotification from "../components/ToastNotification.vue";
import { getStatusClass } from "../utils/textUtils";
import LoadingComponent from "../components/LoadingComponent.vue";
import { fetchFeedbacks, submitFeedback } from "../api/feedbackApi";
import type { Feedback } from "../types/FeedbackTypes";
import { getToken } from "../utils/authUtils";

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
            activeTab: 'history' as 'history' | 'feedback',
            loadingPdf: true,
            document: {} as Doc,
            relatedDocs: [] as any[],
            feedbacks: [] as Feedback[],
            feedbackContent: '',
            sendingFeedback: false
        };
    },
    watch: {
        activeTab(newTab) {
            if (newTab === 'feedback' && this.isLoggedIn) {
                this.loadFeedbacks();
            }
        }
    },
    computed: {
        effectiveStatus() {
            return getDocumentEffectiveStatus({
                effective_start_date: this.document.effective_start_date,
                effective_end_date: this.document.effective_end_date,
            });
        },
        documentFileType(): string {
            const att = this.document?.attachments as any;
            if (!att) return '';
            
            const filename = (att.filename || '').toLowerCase();
            if (filename.endsWith('.pdf')) {
                return 'pdf';
            } else if (filename.match(/\.(jpeg|jpg|png|gif|webp|bmp)$/)) {
                return 'image';
            }
            return 'other';
        },
        isLoggedIn(): boolean {
            return !!getToken();
        },
        currentUser(): string {
            const userInfo = localStorage.getItem("user_info");
            if (userInfo) {
                try {
                    const parsed = JSON.parse(userInfo);
                    return parsed.full_name || parsed.username || 'Thành viên';
                } catch (e) {
                    return 'Thành viên';
                }
            }
            return 'Guest';
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
                // Tải thông tin văn bản lên trước để hiển thị ẩn dưới lớp màn hình Loading
                const docRes = await getDocumentDetail(id);
                this.document = {
                    ...docRes.data,
                    attachments: null,
                };

                // Sau đó tải tiếp các thành phần còn lại
                const [attachRes, linksRes] = await Promise.all([
                    fetchAttachmentsByDoc(id),
                    getDocumentLinks(id).catch(() => ({ data: [] }))
                ]);
                const lastAttachment = attachRes.data.length > 0 ? attachRes.data[attachRes.data.length - 1] : null;
                this.document = {
                    ...this.document,
                    attachments: lastAttachment,
                };

                const flatLinks = Array.isArray(linksRes.data) ? linksRes.data : [];
                this.relatedDocs = flatLinks.map((l: any) => {
                    const isOutgoing = (l.source_document === id);
                    if (isOutgoing) {
                        return {
                            target_doc_id: l.target_document,
                            target_doc_number: l.target_document_number,
                            target_title: l.target_document_title,
                            link_type: l.link_type,
                            ai_comparison: l.ai_comparison,
                            created_at: l.created_at,
                            direction: 'outgoing'
                        };
                    } else {
                        return {
                            target_doc_id: l.source_document,
                            target_doc_number: l.source_document_number,
                            target_title: l.source_document_title,
                            link_type: l.link_type + " (Nhận)",
                            ai_comparison: l.ai_comparison,
                            created_at: l.created_at,
                            direction: 'incoming'
                        };
                    }
                });

                // Tự động tải góp ý nếu người dùng đã đăng nhập
                if (this.isLoggedIn) {
                    this.loadFeedbacks();
                }
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
        formatAiText(text: string) {
            if (!text) return '';
            let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
            html = html.replace(/\n\s*-\s/g, '<br/>• ');
            html = html.replace(/\n/g, '<br/>');
            return html;
        },
        formatLinkType(type: string) {
            const raw = type.replace(" (Nhận)", "");
            const mapping: Record<string, string> = {
                'can_cu': 'Văn bản căn cứ',
                'thay_the': 'Văn bản thay thế',
                'bi_thay_the': 'Văn bản bị thay thế',
                'sua_doi': 'Sửa đổi, bổ sung',
                'bi_sua_doi': 'Bị sửa đổi, bổ sung',
                'het_hieu_luc': 'Hết hiệu lực',
                'het_hieu_luc_1_phan': 'Hết hiệu lực 1 phần',
                'dinh_chinh': 'Đính chính',
            };
            const label = mapping[raw] || raw;
            return type.includes("(Nhận)") ? label + " (Tới)" : label;
        },
        shareFacebook() {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        },
        shareZalo() {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://zalo.me/share?url=${url}`, '_blank', 'width=600,height=400');
        },
        copyPageLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                (this.$refs.myToast as any).success("Thành công", "Đã sao chép đường dẫn văn bản!");
            }).catch(() => {
                (this.$refs.myToast as any).error("Lỗi", "Không thể sao chép đường dẫn!");
            });
        },
        formatNumber,
        formatFileSize,
        formatDate,
        getStatusClass,
        async loadFeedbacks() {
            try {
                const res = await fetchFeedbacks(this.document.id);
                this.feedbacks = res.data;
            } catch (err) {
                console.error("Lỗi tải góp ý:", err);
            }
        },
        async handleSendFeedback() {
            if (!this.feedbackContent.trim()) return;
            this.sendingFeedback = true;
            try {
                await submitFeedback(this.document.id, this.feedbackContent);
                (this.$refs.myToast as any).success("Thành công", "Góp ý của bạn đã được gửi thành công!");
                this.feedbackContent = '';
                if (this.isLoggedIn) {
                    this.loadFeedbacks();
                }
            } catch (err: any) {
                (this.$refs.myToast as any).error("Lỗi", "Không thể gửi góp ý vào lúc này. Vui lòng thử lại sau.");
            } finally {
                this.sendingFeedback = false;
            }
        },
        handlePrint() {
            // Thông báo nhắc nhở kết nối máy in
            (this.$refs.myToast as any).success(
                "Đang chuẩn bị...", 
                "Vui lòng đảm bảo máy in đã được kết nối và sẵn sàng."
            );
            
            // Đợi một chút để người dùng đọc thông báo rồi mở hộp thoại in
            setTimeout(() => {
                window.print();
            }, 1000);
        },
    },
});
</script>