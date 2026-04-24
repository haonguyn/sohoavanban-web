<template>
    <div class="bg-gray-100 min-h-screen font-sans">
        <!-- Thanh điều hướng (Navbar) -->
        <Header />
        <!-- Phần Hero & Thanh Tìm kiếm chính -->
        <div class="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-b">
            <!-- background decoration -->
            <div class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
            <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

            <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up">
                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Hệ thống tra cứu văn bản
                </h1>
                <h3 class="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Tìm kiếm, quản lý và trích xuất nội dung văn bản một cách
                    <p class="text-indigo-600 font-semibold">
                        Nhanh chóng – Chính xác – Thông minh
                    </p>
                </h3>
                <!-- Search box -->
                <div
                    class="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-white/50">
                    <form @submit.prevent="handleSearch" class="flex">
                        <input v-model="searchQuery" type="text"
                            placeholder="Nhập từ khóa, số hiệu, nội dung văn bản..."
                            class="flex-grow px-5 py-4 text-base text-gray-700 bg-transparent focus:outline-none" />

                        <button type="submit" :disabled="!searchQuery.trim()"
                            class="px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    <RouterLink to="/tra-cuu"
                        class="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                        → Tìm kiếm nâng cao
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- Phần Tính năng -->
        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16 relative">
                    <div class="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm border border-blue-100/50 animate-pulse-slow">
                        Hệ sinh thái thông minh
                    </div>
                    <h2 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Tính năng <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">nổi bật</span>
                    </h2>
                    <p class="text-gray-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
                        Các công cụ mạnh mẽ được tối ưu hóa để giúp bạn giải quyết công việc với văn bản nhanh chóng và chính xác nhất.
                    </p>
                    <div class="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full shadow-lg shadow-blue-200"></div>
                </div>

                <div class="flex flex-wrap justify-center gap-8">
                    <!-- Tính năng 1: Tra cứu -->
                    <RouterLink to="/tra-cuu"
                        class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden w-full md:w-[calc(33.333%-2rem)] min-w-[300px]">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition">
                        </div>

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
                            Tìm kiếm chính xác và nhanh chóng với bộ lọc đa dạng: từ khóa,
                            ngày ban hành, cơ quan ban hành...
                        </p>
                    </RouterLink>

                    <!-- Tính năng 2: Quản lý -->
                    <RouterLink v-if="hasRole(['admin', 'employee'])" to="/quan-ly"
                        class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden w-full md:w-[calc(33.333%-2rem)] min-w-[300px]">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition">
                        </div>

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
                            Lưu trữ, phân loại và quản lý các văn bản cá nhân hoặc của tổ chức
                            một cách an toàn và khoa học.
                        </p>
                    </RouterLink>

                    <!-- Tính năng 3: OCR -->
                    <RouterLink v-if="hasRole(['admin', 'employee'])" to="/ocr-vanban"
                        class="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden w-full md:w-[calc(33.333%-2rem)] min-w-[300px]">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition">
                        </div>

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
                            Chuyển đổi văn bản từ hình ảnh hoặc file PDF scan thành văn bản có
                            thể tìm kiếm và chỉnh sửa.
                        </p>
                    </RouterLink>
                </div>
            </div>
        </section>

    <section class="py-16 bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-14 relative">
                <div class="inline-block px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm border border-purple-100/50 animate-pulse-slow">
                    Khám phá & Gợi ý
                </div>
                <h3 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    Tiêu điểm & <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Xu hướng</span>
                </h3>
                <p class="text-gray-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
                    Theo dõi những chủ đề được quan tâm nhiều nhất và các từ khóa đang dẫn đầu xu hướng tìm kiếm.
                </p>
                <div class="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full shadow-lg shadow-purple-200"></div>
            </div>

            <!-- Nền Aura Glow (Decorative Glows) -->
            <div class="relative max-w-6xl mx-auto">
                <div class="absolute -top-20 -left-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px] -z-10"></div>
                <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200/40 rounded-full blur-[100px] -z-10"></div>

                <div class="grid lg:grid-cols-2 gap-10">
                <!-- Cột 1: Chủ đề Admin đề xuất -->
                <div class="glass-card p-8 rounded-[2rem] border border-white/40 shadow-2xl relative overflow-hidden group">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200/50 rounded-full blur-2xl group-hover:bg-indigo-300/50 transition-all duration-700"></div>
                    
                    <div class="flex items-center gap-3 mb-8">
                        <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-gray-900">Chủ đề đề xuất</h4>
                            <p class="text-xs text-gray-400 mt-0.5">Dựa trên xu hướng quan tâm</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-4 items-center justify-center min-h-[160px]">
                        <a v-for="(topic, index) in trendingTopics" :key="topic.name" @click="searchByTopic(topic.name)"
                            :style="{ 
                                fontSize: (14 + Math.min(1, topic.searches / 1500) * 10) + 'px',
                                opacity: 0.85 + Math.min(1, topic.searches / 1500) * 0.15,
                                '--tag-color': topic.color,
                                '--tag-bg': topic.light_bg,
                                'animation-delay': (index * 0.2) + 's'
                            }"
                            class="premium-tag px-6 py-3 rounded-2xl border cursor-pointer hover:scale-110 active:scale-95">
                            <span class="opacity-60 mr-1">#</span>{{ topic.name }}
                        </a>
                        <div v-if="trendingTopics.length === 0" class="flex flex-col items-center gap-2 py-10">
                             <div class="w-12 h-1 bg-gray-200 rounded-full animate-pulse"></div>
                             <p class="text-gray-400 text-sm italic">Chưa có chủ đề đề xuất</p>
                        </div>
                    </div>
                </div>

                <!-- Cột 2: Xu hướng tìm kiếm -->
                <div class="glass-card p-8 rounded-[2rem] border border-white/40 shadow-2xl relative overflow-hidden group">
                     <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl group-hover:bg-orange-200/50 transition-all duration-700"></div>

                    <div class="flex items-center gap-3 mb-8">
                        <div class="p-3 bg-gradient-to-br from-orange-400 to-pink-500 text-white rounded-2xl shadow-lg shadow-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m-.921 5.972 3.277-3.277-3.277-3.277" />
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-gray-900">Xu hướng tìm kiếm</h4>
                            <p class="text-xs text-gray-400 mt-0.5">Top tiêu điểm trong tuần</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-3">
                        <a v-for="(item, index) in topSearches" :key="item.id" @click="searchByTopic(item.keyword)"
                            class="flex items-center group/item p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-500 cursor-pointer shadow-sm">
                            <div class="relative mr-4">
                                <div class="w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300"
                                     :class="index < 3 ? 'bg-orange-500 text-white shadow-md shadow-orange-200 scale-110' : 'bg-gray-100 text-gray-500'">
                                    {{ index + 1 }}
                                </div>
                                <div v-if="index < 3" class="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                            </div>
                            
                            <div class="flex-grow">
                                <span class="text-sm font-semibold text-gray-800 group-hover/item:text-orange-700 transition-colors">{{ item.keyword }}</span>
                            </div>

                            <div class="text-[11px] font-bold text-gray-400 bg-gray-100/50 px-2 py-1 rounded-lg group-hover/item:bg-orange-100 group-hover/item:text-orange-500 transition-all">
                                {{ item.count.toLocaleString() }}
                            </div>
                        </a>
                        <div v-if="topSearches.length === 0" class="flex flex-col items-center gap-4 py-10">
                            <div class="flex gap-1">
                                <div class="w-2 h-2 bg-orange-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div class="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                            </div>
                            <p class="text-gray-400 text-sm italic">Đang cập nhật xu hướng...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

        <!-- Danh sách văn bản (mới/xem nhiều) -->
        <section class="py-16 bg-gray-100">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid lg:grid-cols-2 gap-12">
                    <!-- Cột 1: Văn bản mới cập nhật -->
                    <div>
                        <div class="mb-10 relative">
                            <div class="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm border border-emerald-100/50">
                                Cập nhật mới nhất
                            </div>
                            <h2 class="text-3xl font-black text-gray-900 tracking-tight">
                                Văn bản <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">mới cập nhật</span>
                            </h2>
                            <div class="w-12 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 mt-4 rounded-full shadow-lg shadow-emerald-100"></div>
                        </div>

                        <div class="space-y-5">
                            <div v-for="doc in featuredDocs" :key="'latest-' + doc.id"
                                class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 group cursor-pointer flex flex-col relative overflow-hidden"
                                @click="goDetail(doc.id)">
                                <!-- Thẻ trạng thái & Phân loại -->
                                <div class="flex justify-between items-start mb-3 h-[28px] relative z-10">
                                    <div class="flex flex-wrap gap-2 items-center">
                                        <span :class="getStatusClass(effectiveStatus(doc))"
                                              class="text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                              {{ effectiveStatus(doc) }}
                                        </span>
                                        <span v-if="doc.doc_type" class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                            {{ doc.doc_type }}
                                        </span>
                                    </div>
                                    <span v-if="doc.doc_number" class="text-xs font-bold text-gray-400 font-mono tracking-wider items-center flex gap-1 bg-gray-50/50 px-2 py-1 rounded-md backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                                        {{ doc.doc_number }}
                                    </span>
                                </div>
                                
                                <h3 class="relative z-10 text-lg font-bold text-gray-800 group-hover:text-emerald-700 line-clamp-2 leading-snug mb-2 pr-2 min-h-[52px]">
                                    {{ doc.title }}
                                </h3>
                                
                                <div class="min-h-[44px] mb-4">
                                    <p v-if="doc.summary" class="relative z-10 text-sm text-gray-500 line-clamp-2 leading-relaxed group-hover:text-gray-600 transition-colors">
                                        {{ doc.summary }}
                                    </p>
                                </div>
                                
                                <div class="relative z-10 mt-auto pt-4 border-t border-gray-50 flex justify-between items-end text-xs font-medium text-gray-400">
                                    <div class="flex flex-col gap-2 w-full pr-4">
                                        <span class="flex items-center gap-1.5 text-gray-500 truncate" v-if="doc.issued_by">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                                            <span class="truncate">{{ doc.issued_by }}</span>
                                        </span>
                                        <div class="flex items-center gap-3">
                                            <span v-if="doc.issued_date" class="flex items-center gap-1.5 text-emerald-600/80 bg-emerald-50/50 px-2.5 py-0.5 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                                                Ngày BH: {{ formatDate(doc.issued_date) }}
                                            </span>
                                            <span v-else class="text-transparent px-2.5 py-0.5">-</span>
                                        </div>
                                    </div>
                                    <span class="text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 shadow-sm border border-emerald-100">
                                        Chi tiết <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                                    </span>
                                </div>
                            </div>
                            <div v-if="featuredDocs.length === 0" class="py-10 text-center text-gray-400 italic flex justify-center items-center gap-2">
                                <div class="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                Đang tải văn bản mới...
                            </div>
                        </div>
                    </div>

                    <!-- Cột 2: Văn bản truy cập nhiều nhất -->
                    <div>
                        <div class="mb-10 relative">
                            <div class="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm border border-blue-100/50">
                                Xu hướng tra cứu
                            </div>
                            <h2 class="text-3xl font-black text-gray-900 tracking-tight">
                                Văn bản <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">truy cập nhiều</span>
                            </h2>
                            <div class="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mt-4 rounded-full shadow-lg shadow-blue-100"></div>
                        </div>

                        <div class="space-y-5">
                            <div v-for="(doc, index) in popularDocs" :key="'popular-' + doc.id"
                                class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group cursor-pointer flex flex-col relative overflow-hidden"
                                @click="goDetail(doc.id)">
                                <!-- Background Rank Indicator -->
                                <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full opacity-60 group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                                <div class="absolute top-2 right-4 text-5xl font-black text-blue-900/5 group-hover:text-blue-600/10 transition-colors duration-300 select-none">
                                    #{{ index + 1 }}
                                </div>

                                <!-- Thẻ trạng thái & Số hiệu -->
                                <div class="flex justify-between items-start mb-3 h-[28px] relative z-10">
                                    <div class="flex flex-wrap gap-2 items-center">
                                        <span :class="getStatusClass(effectiveStatus(doc))"
                                            class="text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                            {{ effectiveStatus(doc) }}
                                        </span>
                                        <span v-if="doc.doc_type" class="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                            {{ doc.doc_type }}
                                        </span>
                                    </div>
                                    <span v-if="doc.doc_number" class="text-xs font-bold text-gray-400 font-mono tracking-wider items-center flex gap-1 mr-12 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                                        {{ doc.doc_number }}
                                    </span>
                                </div>
                                
                                <h3 class="relative z-10 text-lg font-bold text-gray-800 group-hover:text-blue-700 line-clamp-2 leading-snug mb-2 pr-4 min-h-[52px]">
                                    {{ doc.title }}
                                </h3>
                                
                                <div class="min-h-[44px] mb-4">
                                    <p v-if="doc.summary" class="relative z-10 text-sm text-gray-500 line-clamp-2 leading-relaxed group-hover:text-gray-600 transition-colors">
                                        {{ doc.summary }}
                                    </p>
                                </div>
                                
                                <div class="relative z-10 mt-auto pt-4 border-t border-gray-50 flex justify-between items-end text-xs font-medium text-gray-400">
                                    <div class="flex flex-col gap-2 w-full pr-4">
                                        <span class="flex items-center gap-1.5 text-gray-500 truncate" v-if="doc.issued_by">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                                            <span class="truncate">{{ doc.issued_by }}</span>
                                        </span>
                                        <div class="flex items-center gap-3">
                                            <span v-if="doc.issued_date" class="flex items-center gap-1.5 text-blue-600/80 bg-blue-50/50 px-2.5 py-0.5 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                                                Ngày BH: {{ formatDate(doc.issued_date) }}
                                            </span>
                                            <span class="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded text-[11px] font-bold">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                                {{ doc.view_count?.toLocaleString() || 0 }} xem
                                            </span>
                                        </div>
                                    </div>
                                    <span class="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 shadow-sm border border-blue-100">
                                        Chi tiết <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                                    </span>
                                </div>
                            </div>
                            <div v-if="popularDocs.length === 0" class="py-10 text-center text-gray-400 italic flex justify-center items-center gap-2">
                                <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                Đang tải văn bản phổ biến...
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-16">
                    <RouterLink to="/tra-cuu"
                        class="inline-flex items-center px-8 py-3 bg-white text-indigo-600 font-bold rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all">
                        Xem tất cả văn bản
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </RouterLink>
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
import type { Doc } from "../types/DocumentTypes";
import { fetchFeaturedDocs, fetchPopularDocs } from "../api/documentApi";
import { fetchTopics, type TrendingTopic, fetchTopSearches, type SearchKeyword } from "../api/topicApi";
import { getStatusClass, truncate } from "../utils/textUtils";
import { getDocumentEffectiveStatus, formatDate } from "../utils/fileUtils";
import { hasRole } from "../utils/authUtils";

export default defineComponent({
    name: "HomeView",
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            searchQuery: "",
            trendingTopics: [] as TrendingTopic[],
            topSearches: [] as SearchKeyword[],
            featuredDocs: [] as Doc[],
            popularDocs: [] as Doc[],
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
        goDetail(id: number) {
            this.$router.push({
                name: "document-detail",
                params: { id }
            });
        },

        async fetchFeaturedDocs() {
            try {
                const res = await fetchFeaturedDocs();
                this.featuredDocs = res.data;
            } catch (e) {
                console.error("Lỗi tải văn bản mới:", e);
            }
        },
        async fetchPopularDocs() {
            try {
                const res = await fetchPopularDocs();
                this.popularDocs = res.data;
            } catch (e) {
                console.error("Lỗi tải văn bản xem nhiều:", e);
            }
        },
        async fetchTopicsData() {
            // Fetch topics independently
            try {
                const topicsRes = await fetchTopics();
                this.trendingTopics = topicsRes.data.filter(t => t.is_active);
            } catch (e) {
                console.error("Lỗi lấy danh sách topic:", e);
            }

            // Fetch top searches independently
            try {
                const topSearchesRes = await fetchTopSearches();
                this.topSearches = topSearchesRes.data;
            } catch (e) {
                console.error("Lỗi lấy xu hướng tìm kiếm:", e);
            }
        },
        formatDate,
        getStatusClass,
        truncate,
        hasRole,
    },
    mounted() {
        this.fetchFeaturedDocs();
        this.fetchPopularDocs();
        this.fetchTopicsData();
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
    computed: {
        effectiveStatus() {
            return (document: any) =>
                getDocumentEffectiveStatus({
                    effective_start_date: document.effective_start_date,
                    effective_end_date: document.effective_end_date,
                });
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

/* Aesthetic Upgrade Styles */
.glass-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.55);
    border-color: rgba(255, 255, 255, 0.8);
}

.premium-tag {
    color: var(--tag-color);
    background: white;
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.06);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: float 6s ease-in-out infinite;
    font-weight: 600;
}

.premium-tag:hover {
    background: var(--tag-color);
    color: white !important;
    border-color: var(--tag-color);
    box-shadow: 0 10px 25px -5px var(--tag-color);
    transform: translateY(-5px) scale(1.1) rotate(1deg);
    z-index: 10;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

.animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
}
</style>
