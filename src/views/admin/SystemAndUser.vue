<template>
  <div class="flex h-screen">
    <Navbar />
    <main class="flex-1 overflow-hidden relative bg-slate-50">
      <div class="p-6 h-full overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6 text-slate-800">Quản trị hệ thống</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                <i class="fas fa-users w-5 h-5"></i> Quản lý Users
              </h3>
              <button @click="openAddUser"
                class="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                <i class="fas fa-user-plus w-4 h-4"></i> Thêm User</button>
            </div>
            <table class="w-full text-sm text-left">
              <thead class="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                <tr>
                  <th class="px-4 py-3">User</th>
                  <th class="px-4 py-3">Role</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50">
                  <td class="px-4 py-3">
                    <p class="font-bold text-slate-800">{{ u.username }}</p>
                    <p class="text-xs text-slate-500">{{ u.full_name }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <span class="bg-slate-100 px-2 py-1 rounded text-xs font-medium">
                      {{ u.role }}</span>
                  </td>
                  <td class="px-4 py-3 text-slate-600">{{ u.email }}</td>
                  <td class="px-4 py-3">
                    <span v-if="u.is_active" class="text-emerald-600 font-bold text-xs">Active</span>
                    <span v-else class="text-slate-400 font-bold text-xs">Locked</span>
                  </td>
                  <td class="px-4 py-3 text-right flex justify-end gap-2">
                    <button @click="openEditUser(u)" class="text-blue-600">
                      <i class="fas fa-pen w-4 h-4"></i></button>
                    <button v-if="u.role !== 'admin'" @click="deleteUser(u.id)" class="text-rose-600">
                      <i class="fas fa-trash w-4 h-4"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
              <i class="fas fa-chart-line w-5 h-5"></i> Nhật ký
            </h3>
            <div class="flex-1 overflow-y-auto space-y-3 pr-2">
              <div v-for="log in logs" :key="log.id" class="text-sm border-l-2 border-slate-200 pl-3 py-1">
                <span class="text-slate-400 text-xs block font-mono">{{ log.time }}</span>
                <p class="text-slate-700"><span class="font-bold text-xs bg-slate-100 px-1 rounded">
                    {{ log.type }}</span>
                  {{ log.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showUserModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-2xl w-96 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">{{ editingUser ? 'Sửa User' : 'Thêm User' }}</h3>
            <button @click="showUserModal = false" class="text-slate-400 hover:text-slate-600">
              <i class="fas fa-xmark w-6 h-6"></i></button>
          </div>
          <form @submit.prevent="submitUserForm" class="space-y-4">
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Username</label><input
                v-model="userForm.username" :disabled="!!editingUser" required class="w-full border p-2 rounded"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Email</label><input typeof="email"
                v-model="userForm.email" type="email" required class="w-full border p-2 rounded"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Password</label><input
                v-model="userForm.password" required class="w-full border p-2 rounded"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Họ tên</label><input
                v-model="userForm.full_name" required class="w-full border p-2 rounded"></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-1">Vai trò</label>
              <select v-model="userForm.role" class="w-full border p-2 rounded">
                <option value="employee">Nhập liệu</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="flex items-center gap-2"><input type="checkbox" id="active" v-model="userForm.is_active"><label
                htmlFor="active" class="text-sm">Đang hoạt động</label></div>
            <div class="pt-4 flex justify-end gap-2">
              <button type="button" @click="showUserModal = false"
                class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Hủy</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                Lưu lại</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../../components/admin/Navbar.vue";
import type { User } from "../../types/UserTypes";
import { createUser, deleteUser, listUsers, updateUser } from "../../api/userApi";


interface Log {
  id: number;
  type: string;
  message: string;
  time: string;
}

export default defineComponent({
  name: "SystemAndUser",
  components: { Navbar },
  data() {
    return {
      users: [] as User[],   // ban đầu rỗng
      logs: [] as Log[],
      showUserModal: false,
      editingUser: null as User | null,
      userForm: {
        id: 0,
        username: "",
        password: "",
        full_name: "",
        email: "",
        role: "employee",
        is_active: true,
      } as User,
      errorMessage: "" as string,
    };
  },
  async mounted() {
    try {
      const res = await listUsers();
      this.users = res; // gán dữ liệu từ API
    } catch (e: any) {
      this.errorMessage = e.response?.data?.detail || "Không thể tải danh sách user";
    }
  },
  methods: {
    openAddUser() {
      this.editingUser = null;
      this.userForm = { id: 0, username: "", password: "", full_name: "", email: "", role: "employee", is_active: true };
      this.showUserModal = true;
    },
    openEditUser(user: User) {
      this.editingUser = user;
      this.userForm = { ...user };
      this.showUserModal = true;
    },
    async deleteUser(id: string | number) {
      try {
        await deleteUser(id);
        this.users = this.users.filter(u => u.id !== id);
        this.logs.unshift({
          id: Date.now(),
          type: "DELETE",
          message: `Xóa user #${id}`,
          time: new Date().toISOString(),
        });
      } catch (e: any) {
        console.error("Delete user error:", e.response?.data || e.message);
        this.logs.unshift({
          id: Date.now(),
          type: "ERROR",
          message: `Lỗi khi xóa user #${id}`,
          time: new Date().toISOString(),
        });
      }
    },
    async submitUserForm() {
      try {
        if (this.editingUser) {
          await updateUser(
            String(this.editingUser.id), this.userForm
          );
          // cập nhật lại danh sách hiển thị
          const idx = this.users.findIndex(u => u.id === this.editingUser?.id);
          if (idx !== -1) this.users[idx] = { ...this.userForm };
          this.logs.unshift({ id: Date.now(), type: "UPDATE", message: `Cập nhật user #${this.userForm.username}`, time: new Date().toISOString() });
        } else {
          await createUser(this.userForm);
          this.users.push({ ...this.userForm });
          this.logs.unshift({ id: Date.now(), type: "CREATE", message: `Thêm user #${this.userForm.username}`, time: new Date().toISOString() });
        }
        this.showUserModal = false;
      } catch (e: any) {
        console.error("User API error:", e.response?.data || e.message);
        this.logs.unshift({
          id: Date.now(),
          type: "ERROR",
          message: "Lỗi khi xử lý user",
          time: new Date().toISOString(),
        });
      }
    },
  },
});
</script>
