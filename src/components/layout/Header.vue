<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo/Tên trang web -->
                <div class="flex-shrink-0 flex items-center">
                    <svg
                        class="h-8 w-8 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                    </svg>
                    <span class="ml-2 text-xl font-bold text-gray-800"
                        >OCR</span
                    >
                </div>

                <!-- Menu điều hướng -->
                <div class="hidden md:flex md:items-center md:space-x-6">
                    <RouterLink to="/">
                        <a
                            href="#"
                            class="text-blue-600 font-semibold px-3 py-2 rounded-md text-sm"
                            >Trang chủ</a
                        >
                    </RouterLink>
                    <RouterLink to="/tra-cuu">
                        <a
                            href="#"
                            class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >Tra cứu</a
                        >
                    </RouterLink>
                    <RouterLink to="/quan-ly">
                        <a
                            href="#"
                            class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >Quản lý</a
                        >
                    </RouterLink>

                    <RouterLink to="/ocr-vanban">
                        <a
                            href="#"
                            class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >OCR Văn bản</a
                        >
                    </RouterLink>
                </div>

                <!-- Nút Đăng nhập -->
                <div class="flex items-center">
                    <RouterLink to="/login">
                        <a
                            href="#"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Đăng nhập
                        </a>
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>
</template>
