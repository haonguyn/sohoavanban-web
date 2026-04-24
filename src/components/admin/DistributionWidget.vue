<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full relative">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                <i class="fas fa-chart-pie text-blue-500 w-5 h-5"></i> Phân loại văn bản
            </h3>
            <div class="flex bg-slate-100 p-1 rounded-lg">
                <button @click="changeMode('type')" :class="mode === 'type' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'" class="px-2 py-1 text-[10px] font-bold rounded-md transition-all">Loại VB</button>
                <button @click="changeMode('field')" :class="mode === 'field' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'" class="px-2 py-1 text-[10px] font-bold rounded-md transition-all">Lĩnh vực</button>
            </div>
        </div>
        <div class="flex-1 flex items-center justify-center relative w-full" style="min-height: 320px;">
            <v-chart class="chart" :option="chartOption" autoresize />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
import { getDistributionData } from "../../api/dashboardApi";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

export default defineComponent({
    name: "DistributionWidget",
    components: {
        VChart,
    },
    setup() {
        const mode = ref("type");
        const chartOption = ref({
            color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'],
            tooltip: { 
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                type: 'plain',
                orient: 'horizontal',
                bottom: 0,
                left: 'center',
                textStyle: {
                    fontFamily: 'Be Vietnam Pro',
                    fontSize: 11
                },
                itemWidth: 10,
                itemHeight: 10
            },
            series: [
                {
                    name: 'Văn bản',
                    type: 'pie',
                    radius: ['45%', '70%'],
                    center: ['50%', '38%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 3
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold',
                            fontFamily: 'Be Vietnam Pro'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [] as any[]
                }
            ]
        });

        const fetchData = async () => {
            try {
                const data = await getDistributionData(mode.value);
                chartOption.value.series[0].data = data;
            } catch (err) {
                console.error("Lỗi getDistributionData:", err);
            }
        };

        const changeMode = (newMode: string) => {
            mode.value = newMode;
            fetchData();
        };

        onMounted(() => {
            fetchData();
        });

        return { chartOption, mode, changeMode };
    }
});
</script>

<style scoped>
.chart {
    height: 100%;
    width: 100%;
}
</style>

