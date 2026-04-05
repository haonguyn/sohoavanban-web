<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                <i class="fas fa-sitemap text-indigo-600 w-5 h-5"></i> Dòng thời gian liên kết văn bản
            </h3>
            <div class="flex gap-2">
                <button @click="zoomIn" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded shadow-sm text-sm font-medium transition">
                    <i class="fas fa-search-plus mr-1"></i> Phóng to
                </button>
                <button @click="zoomOut" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded shadow-sm text-sm font-medium transition">
                    <i class="fas fa-search-minus mr-1"></i> Thu nhỏ
                </button>
                <button @click="resetZoom" class="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded shadow-sm text-sm font-medium transition">
                    <i class="fas fa-sync-alt mr-1"></i> Khôi phục
                </button>
            </div>
        </div>
        
        <div class="h-[550px] w-full border border-slate-100 rounded-lg bg-slate-50 relative overflow-hidden">
            <v-chart ref="graphChart" class="w-full h-full" :option="networkOptions" :autoresize="true" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { use } from "echarts/core";
import { GraphChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";
import { getNetworkGraphData } from "../../api/dashboardApi";

use([GraphChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default defineComponent({
    name: "NetworkGraphWidget",
    components: {
        VChart
    },
    provide: {
        [THEME_KEY]: "light"
    },
    data() {
        return {
            networkOptions: {} as Record<string, any>,
            currentZoom: 1 as number,
        };
    },
    mounted() {
        this.fetchNetworkGraph();
    },
    methods: {
        zoomIn() {
            this.currentZoom *= 1.2;
            this.updateChartZoom();
        },
        zoomOut() {
            this.currentZoom /= 1.2;
            this.updateChartZoom();
        },
        resetZoom() {
            this.currentZoom = 1;
            this.updateChartZoom();
        },
        updateChartZoom() {
            if (this.networkOptions.series && this.networkOptions.series.length > 0) {
                this.networkOptions.series[0].zoom = this.currentZoom;
                this.networkOptions = { ...this.networkOptions };
            }
        },
        async fetchNetworkGraph() {
            try {
                const data = await getNetworkGraphData();
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#14b8a6'];
                
                data.categories.forEach((c: any, i: number) => {
                    c.itemStyle = { color: colors[i % colors.length] };
                });

                const uniqueYears = Array.from(new Set(data.nodes.map((n: any) => n.value))).sort() as number[];
                
                const adj: Record<string, string[]> = {};
                data.nodes.forEach((n: any) => adj[n.id] = []);
                data.edges.forEach((e: any) => {
                    if (adj[e.source]) adj[e.source].push(e.target);
                    if (adj[e.target]) adj[e.target].push(e.source);
                });

                const visited = new Set();
                const components: string[][] = [];

                data.nodes.forEach((n: any) => {
                    if (!visited.has(n.id)) {
                        const comp: string[] = [];
                        const q = [n.id];
                        visited.add(n.id);
                        while (q.length > 0) {
                            const curr = q.shift() as string;
                            comp.push(curr);
                            if (adj[curr]) {
                                adj[curr].forEach(neighbor => {
                                    if (!visited.has(neighbor)) {
                                        visited.add(neighbor);
                                        q.push(neighbor);
                                    }
                                });
                            }
                        }
                        components.push(comp);
                    }
                });

                const yearCounts: Record<string, number> = {};

                data.nodes.forEach((node: any) => {
                    const year = node.value;
                    const xIndex = uniqueYears.indexOf(year);
                    node.x = xIndex * 380; 

                    const cIndex = components.findIndex(c => c.includes(node.id));
                    
                    const key = `${cIndex}_${year}`;
                    if (!yearCounts[key]) yearCounts[key] = 0;
                    
                    node.y = cIndex * 150 + (yearCounts[key] * 100); 
                    yearCounts[key]++;
                
                    node.symbolSize = 45;
                    node.itemStyle = {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.15)',
                        borderColor: '#ffffff',
                        borderWidth: 2
                    };
                    node.label = {
                        show: true,
                        position: 'bottom',
                        distance: 10,
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#1e293b',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: [6, 10],
                        borderRadius: 6,
                        shadowBlur: 8,
                        shadowColor: 'rgba(0,0,0,0.15)'
                    };
                });
                
                data.edges.forEach((edge: any) => {
                    edge.lineStyle = {
                        width: 2.5,
                        color: '#94a3b8',
                        curveness: 0
                    };
                    edge.label = {
                        show: true,
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#0f172a',
                        formatter: '{c}',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderColor: '#cbd5e1',
                        borderWidth: 1,
                        padding: [4, 8],
                        borderRadius: 6,
                        shadowBlur: 4,
                        shadowColor: 'rgba(0,0,0,0.1)',
                    };
                });
                
                this.currentZoom = 1;
                this.networkOptions = {
                    backgroundColor: 'transparent',
                    tooltip: {
                        formatter: function (params: any) {
                           if(params.dataType === 'node') return params.data.tooltip || params.name;
                           if(params.dataType === 'edge') return params.data.value;
                           return params.name;
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#e2e8f0',
                        textStyle: { color: '#0f172a' }
                    },
                    legend: [{
                        data: data.categories.map((a: any) => a.name),
                        bottom: 0,
                        icon: 'circle'
                    }],
                    series: [
                        {
                            type: 'graph',
                            layout: 'none', 
                            data: data.nodes,
                            links: data.edges,
                            categories: data.categories,
                            roam: true,
                            zoom: this.currentZoom,
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [5, 12],
                            emphasis: {
                                focus: 'adjacency',
                                lineStyle: { width: 4, color: '#3b82f6' }
                            }
                        }
                    ]
                };
            } catch (error) {
                console.error("Lỗi khi load graph:", error);
            }
        }
    }
});
</script>
