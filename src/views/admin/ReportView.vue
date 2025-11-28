<template>
    <div v-if="activeTab === 'reports'" class="p-6 h-full overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Báo cáo & Thống kê</h2>
            <div class="flex gap-2">
                <button
                    class="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"><i
                        data-lucide="calendar" class="w-4 h-4"></i> Tháng này</button>
                <button
                    class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><i
                        data-lucide="download" class="w-4 h-4"></i> Xuất Excel</button>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800"><i data-lucide="users"
                        class="w-5 h-5 text-indigo-500"></i> Hiệu suất nhân viên</h3>
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 text-slate-500 font-bold">
                        <tr>
                            <th class="px-4 py-3 rounded-tl">Nhân viên</th>
                            <th class="px-4 py-3">Số lượng VB</th>
                            <th class="px-4 py-3 rounded-tr">Tỷ lệ lỗi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr>
                            <td class="px-4 py-3 font-medium">Trần Văn Nhập</td>
                            <td class="px-4 py-3">145</td>
                            <td class="px-4 py-3 text-emerald-600 font-bold">1.2%</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3 font-medium">Lê Thị Duyệt</td>
                            <td class="px-4 py-3">89</td>
                            <td class="px-4 py-3 text-emerald-600 font-bold">0%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800"><i data-lucide="pie-chart"
                        class="w-5 h-5 text-amber-500"></i> Phân loại văn bản</h3>
                <div class="space-y-4">
                    <div v-for="(item, i) in [{ label: 'Quyết định', val: 45, c: 'bg-blue-500' }, { label: 'Báo cáo', val: 30, c: 'bg-emerald-500' }]"
                        :key="i">
                        <div class="flex justify-between text-sm mb-1"><span>{{ item.label }}</span><span
                                class="font-bold">{{ item.val }}%</span></div>
                        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div :class="`h-full ${item.c}`" :style="{ width: item.val + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>