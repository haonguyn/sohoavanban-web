<template>
  <div class="flex h-screen">
    <Navbar />
    <main class="flex-1 overflow-hidden relative bg-slate-50">
      <div class="p-6 h-full overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-slate-800">Báo cáo & Thống kê</h2>
          <div class="flex gap-2">
            <!-- Chọn tháng -->
            <select v-model="selectedMonth" @change="fetchDataByMonthYear" class="border rounded px-3 py-2 text-sm">
              <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>

            <!-- Chọn năm -->
            <select v-model="selectedYear" @change="fetchDataByMonthYear" class="border rounded px-3 py-2 text-sm">
              <option v-for="y in years" :key="y" :value="y">Năm {{ y }}</option>
            </select>

            <!-- Xuất Excel -->
            <button @click="exportExcel"
              class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              <i class="fas fa-download"></i> Xuất Excel
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
  <LoadingComponent ref="loadingRef" />
  <ToastNotification ref="myToast" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../../components/admin/Navbar.vue";
import { exportReportExcel, getReportByMonthYear } from "../../api/reportApi";
import ToastNotification from "../../components/ToastNotification.vue";
import LoadingComponent from "../../components/LoadingComponent.vue";
import { downloadFile } from "../../utils/fileUtils";

export default defineComponent({
  name: 'Reports',
  components: { Navbar, ToastNotification, LoadingComponent },
  data() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    return {
      selectedMonth: currentDate.getMonth() + 1,
      selectedYear: currentYear,
      months: [
        { value: 1, label: "Tháng 1" },
        { value: 2, label: "Tháng 2" },
        { value: 3, label: "Tháng 3" },
        { value: 4, label: "Tháng 4" },
        { value: 5, label: "Tháng 5" },
        { value: 6, label: "Tháng 6" },
        { value: 7, label: "Tháng 7" },
        { value: 8, label: "Tháng 8" },
        { value: 9, label: "Tháng 9" },
        { value: 10, label: "Tháng 10" },
        { value: 11, label: "Tháng 11" },
        { value: 12, label: "Tháng 12" },
      ],
      years: Array.from({ length: 11 }, (_, i) => currentYear - i), // năm hiện tại lùi về 10 năm
      staffStats: [] as { name: string; count: number; errorRate: number }[],
      docTypes: [] as { label: string; val: number; color: string }[],
    };
  },
  mounted() {
    this.fetchDataByMonthYear();
  },
  methods: {
    async fetchDataByMonthYear() {
      (this.$refs.loadingRef as any).show();
      try {
        const data = await getReportByMonthYear(
          this.selectedMonth,
          this.selectedYear
        );

        this.staffStats = data.staffStats;
        this.docTypes = data.docTypes;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu theo tháng & năm:", error);
      } finally {
        (this.$refs.loadingRef as any).hide();
      }
    },
    async exportExcel() {
      (this.$refs.loadingRef as any).show();

      try {
        const blob = await exportReportExcel(
          this.selectedMonth,
          this.selectedYear
        );
        
        if (!blob || blob.size <= 5900) {
          (this.$refs.myToast as any).warning(
            "Lỗi xuất excel",
            "Không có dữ liệu để xuất Excel"
          );
          return;
        }

        downloadFile(
          blob,
          `Bao_cao_${this.selectedMonth}_${this.selectedYear}.xlsx`
        );

        (this.$refs.myToast as any).success(
          "Download",
          "Xuất excel thành công"
        );
      } catch (err) {
        alert("Xuất Excel thất bại!");
        console.error(err);
      } finally {
        (this.$refs.loadingRef as any).hide();
      }
    }
  }
});
</script>
