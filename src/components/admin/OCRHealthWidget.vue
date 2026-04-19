<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 class="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <i class="fas fa-microchip text-emerald-500 w-5 h-5"></i> Chất lượng Nhận diện (OCR)
        </h3>
        <div class="flex flex-col items-center justify-center flex-1 space-y-6">
            <div class="relative w-48 h-48">
                <svg class="w-full h-full drop-shadow-sm" viewBox="0 0 36 36">
                    <path
                        class="text-slate-100"
                        stroke-dasharray="100, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        stroke="currentColor" stroke-width="2.5" fill="none"
                    />
                    <path
                        :class="healthColor"
                        :stroke-dasharray="`${stats.success_rate}, 100`"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"
                    />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-black" :class="healthColorText">{{ stats.success_rate }}%</span>
                    <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Đạt chuẩn</span>
                </div>
            </div>
            
            <div class="flex gap-4 text-center mt-6 w-full">
                <div class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex-1 shadow-sm">
                    <span class="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Tổng file xử lý</span>
                    <strong class="text-xl text-slate-700 font-extrabold">{{ stats.total }}</strong>
                </div>
                <div class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex-1 shadow-sm">
                    <span class="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Độ chính xác</span>
                    <strong class="text-xl text-slate-700 font-extrabold">{{ stats.avg_accuracy }}%</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { getOcrHealthData } from "../../api/dashboardApi";

export default defineComponent({
    name: "OCRHealthWidget",
    setup() {
        const stats = ref({
            success_rate: 0,
            total: 0,
            avg_accuracy: 0
        });

        const fetchData = async () => {
            try {
                stats.value = await getOcrHealthData();
            } catch (err) {
                console.error("Lỗi getOcrHealthData:", err);
            }
        };

        const healthColor = computed(() => {
            if (stats.value.success_rate >= 90) return 'text-emerald-500';
            if (stats.value.success_rate >= 70) return 'text-blue-500';
            return 'text-rose-500';
        });

        const healthColorText = computed(() => {
            if (stats.value.success_rate >= 90) return 'text-emerald-600';
            if (stats.value.success_rate >= 70) return 'text-blue-600';
            return 'text-rose-600';
        });

        onMounted(() => fetchData());

        return { stats, healthColor, healthColorText };
    }
});
</script>
