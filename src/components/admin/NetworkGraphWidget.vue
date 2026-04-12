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
        
        <div class="h-[550px] w-full border border-slate-100 rounded-lg bg-slate-50 relative flex overflow-hidden">
            <!-- Bảng danh sách lề trái (Connected Papers style) -->
            <div class="w-[300px] h-full bg-white border-r border-slate-200 flex flex-col z-10 shrink-0">
                <div class="p-4 border-b border-slate-100">
                    <div class="relative">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm văn bản..." class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition">
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto scrollbar-thin py-2">
                    <div v-for="group in groupedNodes" :key="group.name" class="mb-1">
                        <!-- Folder Header -->
                        <div @click="toggleGroup(group.name)" 
                             @dblclick="startEditGroup(group.name, $event)"
                             class="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 cursor-pointer transition select-none group">
                            <i class="fas text-[10px] w-3 text-slate-400 group-hover:text-slate-700 transition text-center" 
                               :class="expandedGroups[group.name] === false ? 'fa-chevron-right' : 'fa-chevron-down'"></i>
                            <i class="fas fa-folder text-indigo-400 text-sm"></i>
                            
                            <input v-if="editingGroup === group.name"
                                   id="edit_group_input"
                                   v-model="editGroupText"
                                   @blur="saveEditGroup(group.name)"
                                   @keyup.enter="saveEditGroup(group.name)"
                                   @click.stop
                                   class="text-[13px] font-semibold text-slate-800 bg-white border border-indigo-400 rounded px-1.5 outline-none py-0.5 w-[160px] shadow-[0_0_0_2px_rgba(99,102,241,0.2)]" />
                            <span v-else class="text-[13px] font-semibold text-slate-700 truncate" :title="customGroupNames[group.name] || group.name">{{ customGroupNames[group.name] || group.name }}</span>

                            <span class="text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded ml-auto shrink-0">{{ group.nodes.length }}</span>
                        </div>

                        <!-- Nested Items -->
                        <div v-show="expandedGroups[group.name] !== false" class="pl-5">
                            <div class="border-l border-slate-200 ml-3 pl-3 py-1 space-y-1">
                                <template v-for="node in group.nodes" :key="node.id">
                                    <div @mouseenter="highlightNode(node.id)" 
                                         @mouseleave="downplayNode"
                                         @click="handleListNodeClick(node.id)"
                                         class="flex items-start gap-2 p-2 rounded-lg cursor-pointer transition group/item"
                                         :class="selectedDoc && selectedDoc.id == node.id ? 'bg-indigo-50 ring-1 ring-indigo-200 shadow-[0_0_8px_rgba(99,102,241,0.2)]' : 'hover:bg-indigo-50/50'">
                                        <i class="fas fa-file-alt mt-0.5 transition text-sm"
                                           :class="selectedDoc && selectedDoc.id == node.id ? 'text-indigo-500' : 'text-slate-300 group-hover/item:text-indigo-400'"></i>
                                        <div class="flex-1">
                                            <h4 class="text-[12.5px] font-medium transition line-clamp-2 leading-snug"
                                                :class="selectedDoc && selectedDoc.id == node.id ? 'text-indigo-800' : 'text-slate-700 group-hover/item:text-indigo-800'">{{ node.name }}</h4>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredNodes.length === 0" class="p-6 text-center text-slate-500 text-sm">
                        Không tìm thấy văn bản nào
                    </div>
                </div>
            </div>

            <!-- Block Đồ thị Echarts -->
            <div class="flex-1 relative">
                <v-chart ref="graphChart" class="w-full h-full" :option="networkOptions" :autoresize="true" @click="handleNodeClick" />
            </div>

            <!-- Bảng chi tiết lề phải (Connected Papers style) -->
            <!-- Bảng chi tiết lề phải (Connected Papers style) -->
            <transition name="slide-fade">
                <div v-if="showSidePanel" class="w-[360px] bg-white shadow-[-8px_0_20px_rgba(0,0,0,0.06)] h-full flex flex-col absolute right-0 top-0 z-10 border-l border-slate-100">
                    <div v-if="isLoadingDoc" class="flex-1 w-full flex justify-center items-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                    </div>

                    <div v-else-if="selectedDoc" class="flex-1 overflow-y-auto p-7 text-sm flex flex-col">
                        <!-- Header actions (close) -->
                        <div class="flex justify-end mb-2">
                            <button @click="closePanel" class="text-slate-400 hover:text-slate-800 transition">
                                <i class="fas fa-times text-lg"></i>
                            </button>
                        </div>

                        <!-- Title -->
                        <h2 class="text-[20px] font-bold text-slate-900 leading-[1.3] mb-3">
                            {{ selectedDoc.title }}
                        </h2>

                        <!-- Authors & Doc Number -->
                        <div class="flex flex-wrap items-center gap-2 mb-2">
                            <span class="text-slate-600 text-[13.5px] font-medium">{{ selectedDoc.signer || 'Khuyết tên người ký' }}</span>
                            <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-semibold" v-if="selectedDoc.doc_number">
                                {{ selectedDoc.doc_number }}
                            </span>
                        </div>

                        <!-- Year & Publisher -->
                        <div class="text-slate-500 text-[13px] mb-6 font-medium">
                            {{ selectedDoc.issued_date ? selectedDoc.issued_date.substring(0, 4) : '2026' }}, {{ selectedDoc.issued_by || 'Khuyết cơ quan' }}
                            <span class="mx-1">•</span> <span class="capitalize">{{ selectedDoc.doc_type || 'Văn bản' }}</span>
                        </div>

                        <!-- Actions Row -->
                        <div class="flex items-center mb-6 pb-4 border-b border-slate-100">
                            <div class="flex items-center gap-3 text-slate-500">
                                <span class="text-[12.5px] font-medium">Mở xem chi tiết:</span>
                                <router-link :to="`/document-detail/${selectedDoc.id}`" class="hover:text-slate-900 transition flex items-center gap-1 group outline-none" title="Mở toàn văn tài liệu">
                                    <i class="fas fa-external-link-alt text-base group-hover:scale-110 transition-transform"></i>
                                </router-link>
                            </div>
                        </div>

                        <!-- Summary -->
                        <div class="text-[14px] text-slate-700 leading-relaxed">
                            <span class="font-bold text-slate-900 mr-2">Trích yếu:</span>{{ selectedDoc.summary || 'Văn bản này hiện chưa có nội dung trích yếu hoặc tóm tắt.' }}
                        </div>
                    </div>
                </div>
            </transition>
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
import { getDocumentDetail } from "../../api/documentApi";
import type { Doc } from "../../types/DocumentTypes";

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
            showSidePanel: false,
            isLoadingDoc: false,
            selectedDoc: null as Doc | null,
            rawNodes: [] as any[],
            searchQuery: '',
            expandedGroups: {} as Record<string, boolean>,
            editingGroup: null as string | null,
            editGroupText: '',
            customGroupNames: {} as Record<string, string>,
        };
    },
    computed: {
        filteredNodes(): any[] {
            if (!this.searchQuery) return this.rawNodes;
            const query = this.searchQuery.toLowerCase();
            return this.rawNodes.filter(n => 
                (n.name && n.name.toLowerCase().includes(query)) ||
                (n.category && n.category.toString().toLowerCase().includes(query))
            );
        },
        groupedNodes(): { name: string, nodes: any[] }[] {
            const groups: Record<string, any[]> = {};
            this.filteredNodes.forEach(node => {
                const cat = node.clusterId || 'Chưa phân nhóm';
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push(node);
            });
            // Định dạng sắp xếp: Các cụm lên trên, nhóm văn bản độc lập xuống dưới
            return Object.keys(groups).sort((a, b) => {
                if (a === 'Các văn bản độc lập') return 1;
                if (b === 'Các văn bản độc lập') return -1;
                return a.localeCompare(b);
            }).map(key => ({
                name: key,
                nodes: groups[key]
            }));
        }
    },
    mounted() {
        const savedNames = localStorage.getItem('networkGroupNames');
        if (savedNames) {
            try {
                this.customGroupNames = JSON.parse(savedNames);
            } catch (e) {
                console.error("Lỗi khi đọc tên Thư mục đã lưu", e);
            }
        }
        this.fetchNetworkGraph();
    },
    methods: {
        toggleGroup(name: string) {
            this.expandedGroups[name] = this.expandedGroups[name] === false ? true : false;
        },
        startEditGroup(name: string, event: Event) {
            if (name === 'Các văn bản độc lập') return;
            this.editingGroup = name;
            this.editGroupText = this.customGroupNames[name] || name;
            this.$nextTick(() => {
                const input = document.getElementById('edit_group_input');
                if (input) input.focus();
            });
        },
        saveEditGroup(name: string) {
            if (this.editingGroup === name) {
                if (this.editGroupText.trim()) {
                    this.customGroupNames[name] = this.editGroupText.trim();
                    localStorage.setItem('networkGroupNames', JSON.stringify(this.customGroupNames));
                }
                this.editingGroup = null;
            }
        },
        highlightNode(id: string) {
            const index = this.rawNodes.findIndex(n => n.id === id);
            if (index !== -1 && this.$refs.graphChart) {
                const chart = this.$refs.graphChart as any;
                chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: index
                });
                chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: index
                });
            }
        },
        downplayNode() {
            if (this.$refs.graphChart) {
                const chart = this.$refs.graphChart as any;
                chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                });
                chart.dispatchAction({
                    type: 'hideTip'
                });
            }
        },
        handleListNodeClick(id: string) {
            this.handleNodeClick({ dataType: 'node', data: { id: id } });
        },
        async handleNodeClick(params: any) {
            if (params.dataType === 'node') {
                const docId = params.data.id;
                
                const index = this.rawNodes.findIndex(n => n.id === docId);
                if (index !== -1 && this.$refs.graphChart) {
                    const chart = this.$refs.graphChart as any;
                    chart.dispatchAction({
                        type: 'select',
                        seriesIndex: 0,
                        dataIndex: index
                    });
                }

                this.showSidePanel = true;
                this.isLoadingDoc = true;
                try {
                    const response = await getDocumentDetail(parseInt(docId));
                    // getDocumentDetail trả về response (axios), dữ liệu thực nằm ở .data
                    this.selectedDoc = response.data;
                } catch (error) {
                    console.error("Lỗi lấy chi tiết văn bản", error);
                } finally {
                    this.isLoadingDoc = false;
                }
            }
        },
        closePanel() {
            this.showSidePanel = false;
            this.selectedDoc = null;
            if (this.$refs.graphChart) {
                const chart = this.$refs.graphChart as any;
                chart.dispatchAction({
                    type: 'unselect',
                    seriesIndex: 0
                });
            }
        },
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
                this.rawNodes = data.nodes;
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

                let clusterCount = 0;
                const mapClusterName = new Map();
                components.forEach((comp, idx) => {
                    if (comp.length > 1) {
                        clusterCount++;
                        mapClusterName.set(idx, `Cụm liên kết số ${clusterCount}`);
                    } else {
                        mapClusterName.set(idx, `Các văn bản độc lập`);
                    }
                });

                const yearCounts: Record<string, number> = {};

                data.nodes.forEach((node: any) => {
                    const year = node.value;
                    const xIndex = uniqueYears.indexOf(year);
                    node.x = xIndex * 380; 

                    const cIndex = components.findIndex(c => c.includes(node.id));
                    node.clusterId = mapClusterName.get(cIndex);
                    
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
                            selectedMode: 'single',
                            select: {
                                itemStyle: {
                                    borderColor: '#ffffff',
                                    borderWidth: 5,
                                    shadowBlur: 40,
                                    shadowColor: 'rgba(59, 130, 246, 1)'
                                },
                                label: {
                                    fontWeight: 'bold',
                                    color: '#1d4ed8'
                                }
                            },
                            emphasis: {
                                focus: 'adjacency',
                                itemStyle: {
                                    borderColor: '#ffffff',
                                    borderWidth: 4,
                                    shadowBlur: 35,
                                    shadowColor: 'rgba(59, 130, 246, 0.85)'
                                },
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

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
