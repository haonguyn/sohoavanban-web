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
                            <div v-for="(h, i) in animatedChartData" :key="i"
                                class="flex-1 flex flex-col justify-end items-center h-full relative">
                                <span class="text-xs text-slate-700 font-semibold mb-1 block">
                                    {{ h }} Docs
                                </span>
                                <div class="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all duration-300"
                                    :style="{ height: (h / maxValue * 100) + '%' }"></div>
                                <span class="text-[10px] text-slate-400 mt-2 font-medium">
                                    {{ labels[i] }}
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-slate-400 mt-2">
                            <span>0 Docs</span>
                            <span>{{ maxValue }} Docs</span>
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
            dashboardStats: [] as {
                label: string;
                val: number;
                color: string;
                icon: string;
            }[],

            // Logs
            logs: [] as {
                type: string;
                message: string;
                time: string;
            }[],

            // Chart Data
            rawChartData: [] as number[],
            animatedChartData: [] as number[],
            labels: [] as string[],
            maxValue: 0,
        };
    },
    mounted() {
        this.fetchDashboardStats();
        this.updateChartData();
        this.fetchLogs();
    },
    methods: {
        async updateChartData() {
            try {
                // Sau này gọi API thật
                // const res = await fetch(`/api/chart-data?range=${this.selectedRange}`);
                // const data = await res.json();
                // this.rawChartData = data.values;
                // this.labels = data.labels;

                // Hiện tại giả lập dữ liệu
                this.rawChartData = [45, 70, 30, 85, 50, 60, 40, 90, 20, 55, 75, 65];
                this.labels = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

                this.maxValue = Math.max(...this.rawChartData);

                // Reset dữ liệu hiển thị và gọi animateChart
                this.animatedChartData = this.rawChartData.map(() => 0);
                this.animateChart();
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
                // fallback dữ liệu giả nếu API lỗi
                this.rawChartData = [10, 20, 30, 40];
                this.labels = ["A", "B", "C", "D"];
                this.maxValue = Math.max(...this.rawChartData);
                this.animatedChartData = this.rawChartData.map(() => 0);
                this.animateChart();
            }
        },

        animateChart() {
            this.rawChartData.forEach((target, index) => {
                let current = 0;
                const step = Math.ceil(target / 20);
                const interval = setInterval(() => {
                    if (current >= target) {
                        this.animatedChartData[index] = target;
                        clearInterval(interval);
                    } else {
                        current += step;
                        this.animatedChartData[index] = Math.min(current, target);
                    }
                }, 30);
            });
        },
        async fetchDashboardStats() {
            try {
                // Sau này gọi API thật
                // const res = await fetch("/api/dashboard/stats");
                // const data = await res.json();
                // this.dashboardStats = data;

                // Hiện tại giả lập dữ liệu
                this.dashboardStats = [
                    { label: "Tài liệu", val: Math.floor(Math.random() * 200) + 50, color: "blue", icon: "fas fa-file" },
                    { label: "Người dùng", val: Math.floor(Math.random() * 100) + 10, color: "amber", icon: "fas fa-user" },
                    { label: "Đã duyệt", val: Math.floor(Math.random() * 150) + 20, color: "emerald", icon: "fas fa-check" },
                    { label: "Đang chờ duyệt", val: Math.floor(Math.random() * 80) + 5, color: "rose", icon: "fas fa-triangle-exclamation" },
                ];
            } catch (error) {
                console.error("Lỗi khi lấy dashboard stats:", error);
            }
        },
        async fetchLogs() {
            try {
                // Sau này gọi API thật
                // const res = await fetch("/api/dashboard/logs");
                // const data = await res.json();
                // this.logs = data;

                // Hiện tại giả lập dữ liệu
                const now = new Date();
                const formatTime = (date: Date) =>
                    date.toISOString().slice(0, 16).replace("T", " ");

                this.logs = [
                    { type: "OCR", message: "OCR thành công cho tài liệu #123", time: formatTime(now) },
                    { type: "APPROVE", message: "Tài liệu #122 đã được duyệt", time: formatTime(new Date(now.getTime() - 60000)) },
                    { type: "OTHER", message: "Người dùng mới đăng nhập", time: formatTime(new Date(now.getTime() - 120000)) },
                    { type: "OCR", message: "OCR thành công cho tài liệu #124", time: formatTime(new Date(now.getTime() - 180000)) },
                    { type: "APPROVE", message: "Tài liệu #125 đã được duyệt", time: formatTime(new Date(now.getTime() - 240000)) },
                    { type: "OTHER", message: "Người dùng vừa đăng xuất", time: formatTime(new Date(now.getTime() - 300000)) },
                ];
            } catch (error) {
                console.error("Lỗi khi lấy logs:", error);
            }
        }
    },
});
</script>
