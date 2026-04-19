<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 class="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <i class="fas fa-search text-purple-500 w-5 h-5"></i> Top Tìm kiếm
        </h3>
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <ul class="space-y-3">
                <li v-for="(item, idx) in searchData" :key="idx" 
                    class="flex justify-between items-center bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                    <span class="font-medium text-slate-700 flex items-center gap-2">
                        <span class="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" 
                              :class="idx < 3 ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-500'">
                            {{ idx + 1 }}
                        </span>
                        {{ item.keyword }}
                    </span>
                    <span class="text-xs bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500 font-semibold shadow-sm">
                        {{ item.count }} lượt
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { getSearchInsightsData } from "../../api/dashboardApi";

export default defineComponent({
    name: "SearchInsightWidget",
    setup() {
        const searchData = ref<any[]>([]);

        const fetchData = async () => {
            try {
                searchData.value = await getSearchInsightsData();
            } catch (err) {
                console.error("Lỗi getSearchInsightsData:", err);
            }
        };

        onMounted(() => fetchData());

        return { searchData };
    }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9; 
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1; 
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; 
}
</style>
