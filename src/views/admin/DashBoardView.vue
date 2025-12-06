<template>
    <div class="flex h-screen">
        <Navbar />
        <main class="flex-1 overflow-hidden relative bg-slate-50">
            <div class="p-6 h-full overflow-y-auto">
                <h2 class="text-2xl font-bold mb-6 text-slate-800">Dashboard Tổng Quan</h2>

                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div v-for="(kpi, idx) in dashboardStats" :key="idx"
                        :class="`bg-white p-5 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-${kpi.color}-500`">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-slate-500 text-sm font-medium">{{ kpi.label }}</p>
                                <h3 class="text-3xl font-bold text-slate-800 mt-1">{{ kpi.val }}</h3>
                            </div>
                            <div :class="`p-3 rounded-full bg-${kpi.color}-50 text-${kpi.color}-600`">
                                <i :class="`${kpi.icon}`"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <!-- Bar Chart -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-2">
                        <h3 class="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                            <i class="fas fa-chart-bar text-blue-600 w-5 h-5"></i> Tiến độ nhập liệu
                        </h3>
                        <div class="h-64 w-full flex items-end justify-between gap-2 px-2">
                            <div v-for="(h, i) in chartData" :key="i"
                                class="flex-1 flex flex-col justify-end items-center group h-full relative">
                                <div
                                    class="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                                    {{ h }} Docs</div>
                                <div class="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all duration-300 relative"
                                    :style="{ height: h + '%' }"></div>
                                <span class="text-[10px] text-slate-400 mt-2 font-medium">W{{ i + 1 }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 class="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                            <i class="fas fa-chart-line text-purple-600 w-5 h-5"></i> Hoạt động mới nhất
                        </h3>
                        <div class="space-y-4 max-h-64 overflow-y-auto pr-2">
                            <div v-for="(log, i) in logs.slice(0, 6)" :key="i"
                                class="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0">
                                <div
                                    :class="`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${log.type === 'OCR' ? 'bg-blue-500' : log.type === 'APPROVE' ? 'bg-emerald-500' : 'bg-slate-400'}`">
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-slate-700">{{ log.message }}</p>
                                    <p class="text-xs text-slate-400">{{ log.time }}</p>
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
    name: "DashBoard",
    components: {
        Navbar,
    },
    data() {
        return {
            // KPI Cards
            dashboardStats: [
                { label: "Tài liệu", val: 120, color: "blue", icon: "fas fa-file" },
                { label: "Người dùng", val: 45, color: "amber", icon: "fas fa-user" },
                { label: "Đã duyệt", val: 80, color: "emerald", icon: "fas fa-check" },
                { label: "Đang chờ duyệt", val: 60, color: "rose", icon: "fas fa-triangle-exclamation" },
            ],

            // Chart Data
            chartData: [45, 70, 30, 85, 50, 60, 40, 90, 20, 55, 75, 65],

            // Logs
            logs: [
                { type: "OCR", message: "OCR thành công cho tài liệu #123", time: "2023-06-10 09:00" },
                { type: "APPROVE", message: "Tài liệu #122 đã được duyệt", time: "2023-06-10 09:00" },
                { type: "OTHER", message: "Người dùng mới đăng nhập", time: "2023-06-10 09:00" },
                { type: "OCR", message: "OCR thành công cho tài liệu #123", time: "2023-06-10 09:00" },
                { type: "APPROVE", message: "Tài liệu #122 đã được duyệt", time: "2023-06-10 09:00" },
                { type: "OTHER", message: "Người dùng mới đăng nhập", time: "2023-06-10 09:00" },
                { type: "OCR", message: "OCR thành công cho tài liệu #123", time: "2023-06-10 09:00" },
                { type: "APPROVE", message: "Tài liệu #122 đã được duyệt", time: "2023-06-10 09:00" },
                { type: "OTHER", message: "Người dùng mới đăng nhập", time: "2023-06-10 09:00" },
            ],
        };
    },
    
    methods: {
    },
});
</script>
