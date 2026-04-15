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
                    <!-- Nút "Tất cả" -->
                    <div @click="selectCluster(null)" 
                         class="flex items-center gap-2 px-4 py-2.5 cursor-pointer transition select-none border-l-[3px] mb-1"
                         :class="selectedCluster === null ? 'bg-indigo-50 border-indigo-500' : 'border-transparent hover:bg-slate-50'">
                        <i class="fas fa-layer-group text-sm" :class="selectedCluster === null ? 'text-indigo-500' : 'text-slate-400'"></i>
                        <span class="text-[13px] font-semibold" :class="selectedCluster === null ? 'text-indigo-700' : 'text-slate-600'">Tất cả</span>
                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto shrink-0"
                              :class="selectedCluster === null ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'">{{ rawNodes.length }}</span>
                    </div>

                    <div v-for="group in groupedNodes" :key="group.name" class="mb-1">
                        <!-- Folder Header -->
                        <div @click="selectCluster(group.name)" 
                             @dblclick="startEditGroup(group.name, $event)"
                             class="flex items-center gap-2 px-4 py-2 cursor-pointer transition select-none group border-l-[3px]"
                             :class="selectedCluster === group.name ? 'bg-indigo-50 border-indigo-500' : 'border-transparent hover:bg-slate-100'">
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
            chartNodes: [] as any[],
            allProcessedNodes: [] as any[],
            allProcessedEdges: [] as any[],
            allCategories: [] as any[],
            selectedCluster: null as string | null,
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
        selectCluster(clusterName: string | null) {
            if (clusterName === null) {
                if (this.selectedCluster === null) return;
                this.selectedCluster = null;
                this.updateChartFilter();
                this.closePanel();
                return;
            }
            if (this.selectedCluster === clusterName) {
                // Same folder clicked - just toggle expand/collapse
                this.toggleGroup(clusterName);
                return;
            }
            // New folder selected
            this.selectedCluster = clusterName;
            this.expandedGroups[clusterName] = true;
            this.updateChartFilter();
            this.closePanel();
        },
        updateChartFilter() {
            let nodes = this.allProcessedNodes;
            let edges = this.allProcessedEdges;

            if (this.selectedCluster) {
                nodes = nodes.filter((n: any) => n.clusterId === this.selectedCluster);
                const nodeIds = new Set(nodes.map((n: any) => n.id));
                edges = edges.filter((e: any) => nodeIds.has(e.source) && nodeIds.has(e.target));
            }

            const visibleYears = new Set(nodes.map((n: any) => n.category));
            const categories = this.allCategories.filter((c: any) => visibleYears.has(c.name));

            this.chartNodes = nodes;
            this.currentZoom = 1;

            if (this.networkOptions.series && this.networkOptions.series.length > 0) {
                this.networkOptions.series[0].data = nodes;
                this.networkOptions.series[0].links = edges;
                this.networkOptions.series[0].categories = categories;
                this.networkOptions.series[0].force.repulsion = Math.max(2000, 1000 + nodes.length * 15);
                this.networkOptions.legend[0].data = categories.map((c: any) => c.name);
                this.networkOptions = { ...this.networkOptions };
            }
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
            const index = this.chartNodes.findIndex(n => n.id === id);
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
                
                const index = this.chartNodes.findIndex(n => n.id === docId);
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

                // --- Cluster detection (giữ nguyên) ---
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

                // --- Node styling (Connected Papers style) ---
                data.nodes.forEach((node: any) => {
                    const cIndex = components.findIndex(c => c.includes(node.id));
                    node.clusterId = mapClusterName.get(cIndex);
                    
                    const degree = (adj[node.id] || []).length;
                    const nameLen = (node.name || "").length;
                    
                    // Elastic Sizing: Combine connectivity (Power Scale) and Text Length
                    const sizeFromDegree = 45 + Math.pow(degree, 1.4) * 16;
                    const sizeFromText = 40 + (nameLen * 3.8); 
                    
                    node.symbolSize = Math.max(sizeFromDegree, sizeFromText);
                    node.draggable = false; // Disabled to keep layout stable as requested
                    node.z = 10; // Ensure nodes are on top

                    node.itemStyle = {
                        opacity: 1, // Fully opaque to hide lines underneath
                        // Stronger glow for central "hubs"
                        shadowBlur: Math.min(70, 15 + degree * 12),
                        shadowColor: degree > 2 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(0,0,0,0.15)',
                        borderColor: 'rgba(255,255,255,0.9)',
                        borderWidth: 3
                    };
                    node.label = {
                        show: true,
                        position: 'inside',
                        fontSize: node.symbolSize > 80 ? 11 : 9, // Adaptive font size
                        fontWeight: '700',
                        fontFamily: "'Outfit', sans-serif",
                        color: '#ffffff', // High contrast on colored nodes
                        textShadowBlur: 5,
                        textShadowColor: 'rgba(0,0,0,0.3)',
                        overflow: 'break',
                        width: node.symbolSize * 0.8, // Dynamic width based on node size
                    };
                });
                
                // --- Bảng màu cho từng loại liên kết ---
                const LINK_COLORS: Record<string, string> = {
                    'can_cu': '#64748b',
                    'thay_the': '#ef4444',
                    'bi_thay_the': '#f97316',
                    'thay_the_1_phan': '#fb923c',
                    'thay_the_toan_phan': '#dc2626',
                    'sua_doi': '#8b5cf6',
                    'bi_sua_doi': '#a78bfa',
                    'het_hieu_luc': '#6b7280',
                    'het_hieu_luc_1_phan': '#9ca3af',
                    'bai_bo_1_phan': '#f59e0b',
                    'bai_bo_toan_phan': '#d97706',
                    'dinh_chinh': '#06b6d4',
                    'huy_bo': '#be123c',
                };

                // --- Edge styling: hiển thị loại liên kết ---
                const nodeSizeMap = new Map(data.nodes.map((n: any) => [n.id, n.symbolSize]));
                
                data.edges.forEach((edge: any) => {
                    const linkColor = LINK_COLORS[edge.linkType] || '#94a3b8';
                    const sourceSize = nodeSizeMap.get(edge.source) || 40;
                    const targetSize = nodeSizeMap.get(edge.target) || 40;

                    edge.z = 2; // Lines sit below nodes
                    // Shell-to-shell connectivity using edgeSymbol constraints
                    edge.symbol = ['none', 'none'];
                    edge.symbolSize = [sourceSize, targetSize];
                    
                    edge.lineStyle = {
                        width: 2.2,
                        color: linkColor,
                        curveness: 0, // Straight lines as requested
                        opacity: 0.7,
                    };
                    edge.label = {
                        show: false, // Hidden as requested for a cleaner look
                    };
                    edge.emphasis = {
                        label: { 
                            show: true, 
                            fontSize: 12, 
                            fontWeight: '700', 
                            fontFamily: "'Inter', sans-serif",
                            color: '#0f172a', 
                            backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                            padding: [5, 10], 
                            borderColor: linkColor, 
                            borderWidth: 1.5, 
                            borderRadius: 6,
                            shadowBlur: 15,
                            shadowColor: 'rgba(0,0,0,0.1)'
                        },
                        lineStyle: { width: 4, color: linkColor, opacity: 1 }
                    };
                });
                
                // Store all processed data for cluster filtering
                this.allProcessedNodes = [...data.nodes];
                this.allProcessedEdges = [...data.edges];
                this.allCategories = [...data.categories];
                this.chartNodes = [...data.nodes];

                this.currentZoom = 1;
                this.networkOptions = {
                    backgroundColor: 'transparent',
                    tooltip: {
                        trigger: 'item',
                        confine: true,
                        formatter: function (params: any) {
                           if (params.dataType === 'node') return `<b>${params.name}</b><br/>Năm: ${params.data.value || ''}`;
                           if (params.dataType === 'edge') return `<b style="color:${params.data.lineStyle?.color || '#333'}">${params.data.value || 'Liên kết'}</b>`;
                           return params.name;
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.97)',
                        borderColor: '#e2e8f0',
                        padding: [8, 12],
                        textStyle: { 
                            color: '#0f172a', 
                            fontSize: 14, 
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: '500'
                        }
                    },
                    legend: [{
                        data: data.categories.map((a: any) => a.name),
                        bottom: 0,
                        icon: 'circle',
                        textStyle: { 
                            fontSize: 12, 
                            color: '#64748b',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: '500'
                        }
                    }],
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            data: data.nodes,
                            links: data.edges,
                            categories: data.categories,
                            roam: true,
                            zoom: this.currentZoom,
                            draggable: false, 
                            edgeSymbol: ['none', 'none'],
                            edgeSymbolSize: [0, 0],
                            selectedMode: 'single',
                            force: {
                                // High repulsion to ensure labels are visible in the gap
                                repulsion: Math.max(2000, 1000 + data.nodes.length * 15), 
                                gravity: 0.06,
                                edgeLength: [260, 550], // Wide spacing
                                friction: 0.4,
                                layoutAnimation: true,
                            },
                            select: {
                                itemStyle: {
                                    opacity: 1,
                                    borderColor: '#e11d48',
                                    borderWidth: 3,
                                    shadowBlur: 30,
                                    shadowColor: 'rgba(225, 29, 72, 0.5)'
                                },
                                label: { fontWeight: 'bold', color: '#0f172a', fontSize: 13 }
                            },
                            emphasis: {
                                focus: 'adjacency',
                                itemStyle: {
                                    opacity: 1,
                                    borderColor: '#ffffff',
                                    borderWidth: 3,
                                    shadowBlur: 25,
                                    shadowColor: 'rgba(59, 130, 246, 0.6)'
                                },
                                lineStyle: { width: 3, opacity: 1 }
                            },
                            animationDuration: 1500,
                            animationEasingUpdate: 'quinticInOut',
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
