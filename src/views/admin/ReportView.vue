<template>
    <div class="flex h-screen">
        <Navbar />
        <main class="flex-1 overflow-hidden relative bg-slate-50">
            <div class="p-6 h-full overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-slate-800">Báo cáo & Thống kê</h2>
                    <div class="flex gap-2">
                        <button
                            class="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                            <i class="fas fa-calendar w-4 h-4"></i> Tháng này
                        </button>
                        <button
                            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                            <i class="fas fa-download w-4 h-4"></i> Xuất Excel
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Hiệu suất nhân viên -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 class="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                            <i class="fas fa-users w-5 h-5 text-indigo-500"></i> Hiệu suất nhân viên
                        </h3>
                        <table class="w-full text-sm text-left">
                            <thead class="bg-slate-50 text-slate-500 font-bold">
                                <tr>
                                    <th class="px-4 py-3 rounded-tl">Nhân viên</th>
                                    <th class="px-4 py-3">Số lượng VB</th>
                                    <th class="px-4 py-3 rounded-tr">Tỷ lệ lỗi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="(u, i) in staffStats" :key="i">
                                    <td class="px-4 py-3 font-medium">{{ u.name }}</td>
                                    <td class="px-4 py-3">{{ u.count }}</td>
                                    <td class="px-4 py-3"
                                        :class="u.errorRate > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'">
                                        {{ u.errorRate }}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Phân loại văn bản -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 class="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                            <i class="fas fa-chart-pie w-5 h-5 text-amber-500"></i> Phân loại văn bản
                        </h3>
                        <div class="space-y-4">
                            <div v-for="(item, i) in docTypes" :key="i">
                                <div class="flex justify-between text-sm mb-1">
                                    <span>{{ item.label }}</span>
                                    <span class="font-bold">{{ item.val }}%</span>
                                </div>
                                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div :class="`h-full ${item.color}`" :style="{ width: item.val + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../../components/admin/Navbar.vue";

export default defineComponent({
    name: 'Reports',
    components: { Navbar },
    data() {
        return {
            staffStats: [
                { name: 'Trần Văn Nhập', count: 145, errorRate: 1.2 },
                { name: 'Lê Thị Duyệt', count: 89, errorRate: 0 }
            ],
            docTypes: [
                { label: 'Quyết định', val: 45, color: 'bg-blue-500' },
                { label: 'Báo cáo', val: 30, color: 'bg-emerald-500' }
            ]
        }
    }
});

</script>