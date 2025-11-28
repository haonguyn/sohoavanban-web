<template>
    <footer class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid md:grid-cols-4 gap-10">
                <!-- Cột 1: Giới thiệu -->
                <div>
                    <h4 class="text-2xl font-extrabold mb-4 text-indigo-400">OCR</h4>
                    <p class="text-sm text-gray-400 font-light">
                        Nền tảng tra cứu và quản lý văn bản pháp luật hàng đầu, hỗ trợ công việc pháp lý của bạn.
                    </p>
                </div>
                <!-- Cột 2: Đường dẫn nhanh -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-gray-200">Liên kết</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="#" class="text-gray-400 hover:text-indigo-400 transition">Văn bản mới</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-indigo-400 transition">Tìm kiếm nâng cao</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-indigo-400 transition">Tài liệu hướng dẫn</a></li>
                    </ul>
                </div>
                <!-- Cột 3: Hỗ trợ -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-gray-200">Hỗ trợ</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="#" class="text-gray-400 hover:text-indigo-400 transition">FAQ</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-indigo-400 transition">Chính sách bảo mật</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-indigo-400 transition">Điều khoản sử dụng</a></li>
                    </ul>
                </div>
                <!-- Cột 4: Liên hệ -->
                <div>
                    <h4 class="text-lg font-semibold mb-4 text-gray-200">Liên hệ</h4>
                    <p class="text-sm text-gray-400">
                        Email: <a href="mailto:support@docsearch.vn" class="hover:text-indigo-400">support@docsearch.vn</a><br>
                        Điện thoại: (84) 123 456 789
                    </p>
                    <!-- Social icons placeholder -->
                    <div class="flex space-x-4 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 hover:text-indigo-400 transition cursor-pointer"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 hover:text-indigo-400 transition cursor-pointer"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2 1.1-1 1.6-2.6 1-4-.7-1.7-2-2.3-3.3-3.4 3.7-4.8 12.1-4.2 15.4-1.2"/></svg>
                    </div>
                </div>
            </div>
            <div class="mt-10 pt-8 border-t border-gray-700 text-center">
                <p class="text-sm text-gray-500 font-light">&copy; {{ new Date().getFullYear() }} Hệ thống văn bản số. Đã
                đăng ký Bản quyền.</p>
            </div>
        </div>
    </footer>
</template>