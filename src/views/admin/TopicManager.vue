<template>
  <div class="flex h-screen">
    <Navbar />
    <main class="flex-1 overflow-hidden relative bg-slate-50">
      <div class="p-6 font-sans h-full overflow-y-auto text-slate-800">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Quản lý Chủ Đề (Word Cloud)</h1>
        <p class="text-sm text-slate-500 mt-1">Thiết lập các thẻ từ khóa nổi bật và điều chỉnh lượt xem ngoài giao diện Trang Chủ.</p>
      </div>
      <button @click="openModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Tạo chủ đề
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center p-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="p-4 font-semibold text-sm text-slate-600 w-16 text-center">ID</th>
            <th class="p-4 font-semibold text-sm text-slate-600">Tên Chủ Đề (Tag)</th>
            <th class="p-4 font-semibold text-sm text-slate-600 text-center">Lượt Quan Tâm</th>
            <th class="p-4 font-semibold text-sm text-slate-600 text-center w-32">Trạng thái</th>
            <th class="p-4 font-semibold text-sm text-slate-600 text-center w-36">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in topics" :key="t.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="p-4 text-center font-medium text-slate-400">{{ t.id }}</td>
            <td class="p-4">
               <span 
                 class="px-4 py-1.5 rounded-full text-sm shadow-sm transition-all border"
                 :style="{ backgroundColor: t.light_bg, color: t.color, borderColor: t.color, fontWeight: t.searches > 1000 ? 'bold' : '500' }">
                 #{{ t.name }}
               </span>
            </td>
            <td class="p-4 text-center">
                <span class="inline-flex items-center gap-1 font-semibold text-slate-700">
                    {{ t.searches }} <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </span>
            </td>
            <td class="p-4 text-center">
                <button @click="toggleActive(t)" :class="t.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'" class="px-3 py-1 rounded-full text-xs font-bold transition hover:opacity-80">
                    {{ t.is_active ? 'Bật' : 'Tắt' }}
                </button>
            </td>
            <td class="p-4 text-center space-x-3">
              <button @click="openModal(t)" class="text-indigo-600 hover:text-indigo-800 transition" title="Sửa">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="confirmDelete(t.id!)" class="text-rose-500 hover:text-rose-700 transition" title="Xóa">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="topics.length === 0">
            <td colspan="5" class="py-12 text-center text-slate-500">Chưa có chủ đề nào. Hãy tạo mới!</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" @click.stop>
            <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 class="text-lg font-bold text-slate-800">{{ form.id ? 'Cập nhật Chủ đề' : 'Thêm Chủ đề mới' }}</h3>
                <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <form @submit.prevent="saveTopic" class="p-6 space-y-5 block">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">Tên chủ đề/Từ khóa</label>
                    <input v-model="form.name" required type="text" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ví dụ: Luật Đất Đai 2024" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">Lượt tìm kiếm (Mock)</label>
                        <input v-model.number="form.searches" required type="number" min="1" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="1000" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">Trạng thái</label>
                        <select v-model="form.is_active" class="w-full px-4 py-2 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option :value="true">Hiển thị (Bật)</option>
                            <option :value="false">Ẩn (Tắt)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Bảng Màu Chủ Đạo</label>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="pal in palettes" :key="pal.color" type="button" 
                                @click="selectPalette(pal)"
                                :class="{'ring-2 ring-offset-2 ring-slate-400 scale-110': form.color === pal.color}"
                                :style="{ backgroundColor: pal.color }"
                                class="w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform">
                        </button>
                    </div>
                    <!-- Tag preview -->
                    <div class="mt-4 p-4 border border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50">
                        <span class="px-5 py-2 font-bold rounded-full border shadow-sm transition-all"
                              :style="{ backgroundColor: form.light_bg, color: form.color, borderColor: form.color }">
                              Preview: #{{ form.name || 'chude' }}
                        </span>
                    </div>
                </div>

                <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button type="button" @click="closeModal" class="px-4 py-2 text-slate-600 bg-slate-100 font-medium rounded-xl hover:bg-slate-200 transition">Hủy</button>
                    <button type="submit" :disabled="saving" class="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition flex items-center gap-2">
                        <span v-if="saving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        {{ form.id ? 'Lưu cập nhật' : 'Tạo mới' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from "../../components/admin/Navbar.vue";
import { fetchTopics, createTopic, updateTopic, deleteTopic, TrendingTopic } from '../../api/topicApi';
import { useConfirmStore } from '../../store/confirmStore';

export default defineComponent({
  name: "TopicManager",
  components: {
    Navbar
  },
  data() {
    return {
      topics: [] as TrendingTopic[],
      loading: false,
      saving: false,
      showModal: false,
      form: {
        id: undefined as number | undefined,
        name: '',
        searches: 100,
        color: '#4f46e5',
        light_bg: '#eef2ff',
        is_active: true
      },
      palettes: [
        { color: "#ec4899", lightBg: "#fdf2f8" }, // pink
        { color: "#f43f5e", lightBg: "#fff1f2" }, // rose
        { color: "#ea580c", lightBg: "#fff7ed" }, // orange
        { color: "#f59e0b", lightBg: "#fffbeb" }, // amber
        { color: "#10b981", lightBg: "#ecfdf5" }, // emerald
        { color: "#14b8a6", lightBg: "#f0fdfa" }, // teal
        { color: "#06b6d4", lightBg: "#ecfeff" }, // cyan
        { color: "#3b82f6", lightBg: "#eff6ff" }, // blue
        { color: "#4f46e5", lightBg: "#eef2ff" }, // indigo
        { color: "#8b5cf6", lightBg: "#f5f3ff" }, // purple
        { color: "#64748b", lightBg: "#f8fafc" }, // slate
      ]
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
        this.loading = true;
        try {
            const res = await fetchTopics();
            this.topics = res.data;
        } catch (e) {
            alert("Lỗi tải danh sách chủ đề");
        } finally {
            this.loading = false;
        }
    },
    openModal(topic?: TrendingTopic) {
        if (topic) {
            this.form = { ...topic };
        } else {
            const randomPal = this.palettes[Math.floor(Math.random() * this.palettes.length)];
            this.form = { id: undefined, name: '', searches: 500, color: randomPal.color, light_bg: randomPal.lightBg, is_active: true };
        }
        this.showModal = true;
    },
    closeModal() {
        this.showModal = false;
    },
    selectPalette(pal: any) {
        this.form.color = pal.color;
        this.form.light_bg = pal.lightBg;
    },
    async saveTopic() {
        if (!this.form.name) return;
        this.saving = true;
        try {
            if (this.form.id) {
                await updateTopic(this.form.id, this.form as Partial<TrendingTopic>);
                alert("Cập nhật thành công!");
            } else {
                await createTopic(this.form as Partial<TrendingTopic>);
                alert("Đã tạo chủ đề mới!");
            }
            this.closeModal();
            this.loadData();
        } catch (e: any) {
            const msg = e.response?.data?.name ? "Tên chủ đề có thể đã tồn tại!" : "Có lỗi xảy ra";
            alert(msg);
        } finally {
            this.saving = false;
        }
    },
    async toggleActive(t: TrendingTopic) {
        try {
            await updateTopic(t.id!, { is_active: !t.is_active });
            t.is_active = !t.is_active;
        } catch (e) {
            alert("Lỗi chuyển đổi trạng thái");
        }
    },
    async confirmDelete(id: number) {
        const confirm = useConfirmStore();
        if (await confirm.open("Bạn có chắc chắn muốn xóa chủ đề này?")) {
            try {
                await deleteTopic(id);
                alert("Đã xóa chủ đề thành công!");
                this.loadData();
            } catch (e) {
                alert("Lỗi xóa");
            }
        }
    }
  }
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.15s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
