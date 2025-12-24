<template>
    <footer class="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
        <div class="container mx-auto px-6 lg:px-8 py-14">

            <!-- Top -->
            <div class="grid gap-10 md:grid-cols-4">
                <!-- Brand -->
                <div>
                    <div class="flex items-center gap-2 mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
                        </svg>
                        <span class="text-xl font-extrabold tracking-wide">
                            OCR APP
                        </span>
                    </div>
                    <p class="text-sm text-gray-400 leading-relaxed">
                        Nền tảng tra cứu & quản lý văn bản pháp luật hiện đại,
                        hỗ trợ tìm kiếm, lưu trữ và trích xuất nội dung nhanh chóng.
                    </p>
                </div>
                <!-- Links -->
                <div>
                    <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                        Liên kết
                    </h4>
                    <ul class="space-y-3 text-sm">
                        <li>
                            <RouterLink to="/tra-cuu" class="footer-link">Tra cứu văn bản</RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/" class="footer-link">Văn bản mới</RouterLink>
                        </li>
                        <li>
                            <a href="#" class="footer-link">Hướng dẫn sử dụng</a>
                        </li>
                    </ul>
                </div>

                <!-- Support -->
                <div>
                    <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                        Hỗ trợ
                    </h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="#" class="footer-link">FAQ</a></li>
                        <li><a href="#" class="footer-link">Chính sách bảo mật</a></li>
                        <li><a href="#" class="footer-link">Điều khoản dịch vụ</a></li>
                    </ul>
                </div>

                <!-- Contact -->
                <div>
                    <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                        Liên hệ
                    </h4>
                    <p class="text-sm text-gray-400 leading-6">
                        Email:
                        <a href="mailto:support@docsearch.vn" class="hover:text-indigo-400 transition">
                            support@docsearch.vn
                        </a><br />
                        Hotline: <span class="text-gray-300">(84) 123 456 789</span>
                    </p>

                    <!-- Social -->
                    <div class="flex gap-3 mt-5">
                        <a class="social-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>

                        <a class="social-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6
                                    2.2.1 4.4-.6 6-2" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div class="mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-xs text-gray-500">
                    © {{ new Date().getFullYear() }} Hệ thống văn bản số. All rights reserved.
                </p>

                <div class="text-xs text-gray-500">
                    Made with ❤️ using Vue & Tailwind
                </div>
            </div>
        </div>
    </footer>
</template>
