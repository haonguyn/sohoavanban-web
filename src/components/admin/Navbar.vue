<template>
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0">
        <div class="p-6 flex items-center gap-3">
            <div class="bg-blue-700 text-white p-2 rounded-lg font-bold text-xl shadow-lg shadow-blue-200">DMS</div>
            <h1 class="font-extrabold text-slate-800 tracking-tight text-lg">SmartDoc </h1>
        </div>

        <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
            <p class="px-6 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Chức năng chính</p>
            <nav-item id="dashboard" icon="layout-dashboard" label="Dashboard"></nav-item>
            <nav-item id="create" icon="plus-circle" label="Tạo mới (OCR)"></nav-item>
            <nav-item id="list" icon="file-text" label="Kho Văn Bản"></nav-item>

            <p class="px-6 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Quản trị</p>
            <nav-item id="reports" icon="bar-chart-3" label="Báo cáo"></nav-item>
            <nav-item id="admin" icon="settings" label="Hệ thống & User"></nav-item>
        </nav>

        <div class="p-4 border-t border-slate-100 bg-slate-50">
            <div class="flex items-center gap-3 mb-4">
                <div
                    class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                    <!-- {{ currentUser.username.charAt(0).toUpperCase() }} -->A
                </div>
                <div class="overflow-hidden">
                    <p class="text-sm font-bold truncate text-slate-800">Quanr tri vien</p>
                    <p class="text-xs text-slate-500 font-medium bg-slate-200 px-2 rounded-full inline-block mt-0.5">Admin</p>
                </div>
            </div>
            <button
                class="flex items-center justify-center w-full gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 py-2 hover:bg-rose-50 rounded-lg transition">
                <i data-lucide="log-out" class="w-4 h-4"></i> Đăng xuất
            </button>
        </div>
    </aside>
</template>
