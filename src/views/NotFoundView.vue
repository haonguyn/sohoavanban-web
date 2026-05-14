<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
    
    <!-- Background Decoration -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>

    <div class="max-w-2xl w-full relative z-10">
      <div class="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8 md:p-16 text-center">
        
        <!-- Icon Section with Animation -->
        <div class="relative w-32 h-32 mx-auto mb-10">
          <div class="absolute inset-0 bg-blue-600/10 rounded-full animate-ping opacity-20"></div>
          <div class="relative bg-gradient-to-tr from-blue-600 to-indigo-600 w-full h-full rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
            <i class="fas fa-search-doc text-white text-4xl opacity-20 absolute top-4 right-4"></i>
            <i class="fas fa-file-circle-question text-white text-5xl animate-float"></i>
          </div>
        </div>

        <!-- Text Content -->
        <div class="space-y-4 mb-12">
          <h1 class="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 tracking-tighter">404</h1>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-800">Không tìm thấy tài liệu yêu cầu</h2>
          <div class="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p class="text-slate-500 max-w-md mx-auto leading-relaxed">
            Có vẻ như văn bản hoặc trang bạn đang tìm kiếm không còn tồn tại trong hệ thống lưu trữ của chúng tôi.
          </p>
        </div>

        <!-- Quick Links / Actions -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <router-link 
            to="/" 
            class="group px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
          >
            <i class="fas fa-house group-hover:scale-110 transition-transform"></i>
            Về Trang Chủ
          </router-link>
          
          <router-link 
            to="/tra-cuu" 
            class="group px-6 py-4 bg-white text-blue-600 border border-blue-100 font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <i class="fas fa-magnifying-glass group-hover:rotate-12 transition-transform"></i>
            Tra Cứu Văn Bản
          </router-link>
        </div>

        <!-- Helpful Suggestion -->
        <p class="mt-12 text-sm text-slate-400">
          Cần hỗ trợ? <a href="#" class="text-blue-600 font-semibold hover:underline">Liên hệ quản trị viên</a>
        </p>
      </div>

      <!-- Simple Footer inside the centered content for better balance -->
      <p class="mt-8 text-center text-xs font-medium text-slate-400 uppercase tracking-[0.2em]">
        &copy; 2026 DocuMind Portal System
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFoundView'
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
