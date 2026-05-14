<template>
  <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 my-3 shadow-sm w-full overflow-hidden">
    <!-- Nút Play/Pause -->
    <button 
      @click="togglePlay" 
      class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0"
      :title="isPlaying ? 'Tạm dừng' : 'Phát'"
    >
      <i :class="isPlaying ? 'fa-solid fa-pause text-sm' : 'fa-solid fa-play text-sm ml-0.5'"></i>
    </button>

    <!-- Nút Stop (luôn giữ chỗ để không giật layout) -->
    <button 
      @click="stop" 
      :disabled="!(isPlaying || isPaused)"
      :class="['w-6 h-6 flex items-center justify-center rounded-full transition-colors shrink-0', (isPlaying || isPaused) ? 'bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white' : 'bg-transparent text-transparent cursor-default']"
      title="Dừng"
    >
      <i class="fa-solid fa-stop text-[10px]" v-if="isPlaying || isPaused"></i>
    </button>

    <!-- Thanh tiến trình (Luôn hiển thị) -->
    <div class="flex-grow min-w-[100px] sm:min-w-[150px] flex items-center gap-2 ml-1">
      <div class="w-full bg-gray-200 rounded-full h-1.5">
        <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-300" :style="{ width: totalChunks > 0 ? `${(currentChunkIndex / totalChunks) * 100}%` : '0%' }"></div>
      </div>
      <span class="text-[9px] text-gray-500 font-bold shrink-0">
        {{ totalChunks > 0 ? Math.round((currentChunkIndex / totalChunks) * 100) : 0 }}%
      </span>
    </div>

    <!-- Dropdown Chọn Giọng -->
    <div v-if="voicesList.length > 0" class="shrink-0 flex items-center border-l border-gray-300 pl-3 ml-2">
      <select 
        v-model="selectedVoiceIndex" 
        @change="handleVoiceChange"
        class="text-[11px] bg-transparent outline-none text-gray-600 font-medium cursor-pointer w-24 sm:w-[150px] truncate"
        title="Chọn giọng đọc"
      >
        <option v-for="(v, idx) in voicesList" :key="idx" :value="idx">
          {{ v.name.replace('Microsoft ', '').replace(' Online (Natural) - Vietnamese (Vietnam)', '').replace('Google ', '') }}
        </option>
      </select>
    </div>

    <!-- Chọn Tốc Độ -->
    <div class="shrink-0 flex items-center border-l border-gray-300 pl-2 ml-1">
      <i class="fa-solid fa-gauge-high text-gray-400 text-[10px] mr-1" title="Tốc độ"></i>
      <select 
        v-model="playbackRate" 
        @change="handleRateChange"
        class="text-[11px] bg-transparent outline-none text-gray-600 font-medium cursor-pointer"
        title="Tốc độ đọc"
      >
        <option :value="0.75">0.75x</option>
        <option :value="0.9">0.9x</option>
        <option :value="1">1.0x</option>
        <option :value="1.25">1.25x</option>
        <option :value="1.5">1.5x</option>
      </select>
    </div>

    <!-- Visualizer Mini (Giữ khoảng trống khi tắt) -->
    <div class="flex items-end gap-[2px] h-3 shrink-0 ml-1" :class="isPlaying ? 'opacity-100' : 'opacity-0 w-[14px]'">
      <div class="w-[2px] bg-blue-500 rounded-t animate-[wave_1s_ease-in-out_infinite] h-full" v-if="isPlaying"></div>
      <div class="w-[2px] bg-blue-500 rounded-t animate-[wave_1.2s_ease-in-out_infinite_0.1s] h-2" v-if="isPlaying"></div>
      <div class="w-[2px] bg-blue-500 rounded-t animate-[wave_0.8s_ease-in-out_infinite_0.2s] h-2.5" v-if="isPlaying"></div>
      <div class="w-[2px] bg-blue-500 rounded-t animate-[wave_1.1s_ease-in-out_infinite_0.4s] h-full" v-if="isPlaying"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
});

const isPlaying = ref(false);
const isPaused = ref(false);
const currentChunkIndex = ref(0);
const totalChunks = ref(0);

const voicesList = ref<SpeechSynthesisVoice[]>([]);
const selectedVoiceIndex = ref<number>(0);
const playbackRate = ref<number>(1.0);

const synth = window.speechSynthesis;
let chunks: string[] = [];

const loadVoices = () => {
  const allVoices = synth.getVoices();
  if (allVoices.length === 0) return;

  // Chỉ lọc ra các giọng đọc Tiếng Việt để hiển thị (tránh hiện quá nhiều giọng thừa)
  voicesList.value = allVoices.filter(v => 
    v.lang === 'vi-VN' || 
    v.lang === 'vi_VN' || 
    v.lang.toLowerCase().includes('vi') ||
    v.name.toLowerCase().includes('vietnamese') ||
    v.name.toLowerCase().includes('việt')
  );

  if (voicesList.value.length > 0) {
    // Ưu tiên tìm giọng NamMinh theo yêu cầu của bạn
    let targetIndex = voicesList.value.findIndex(v => v.name.toLowerCase().includes('namminh'));
    
    // Nếu trình duyệt không có NamMinh (vd: đang dùng Chrome thay vì Edge), lấy giọng Tiếng Việt bất kỳ đầu tiên làm fallback
    if (targetIndex === -1) {
      targetIndex = 0;
    }
    
    selectedVoiceIndex.value = targetIndex;
  }
};

const handleVoiceChange = () => {
  // Nếu đang phát mà đổi giọng thì phát lại câu hiện tại bằng giọng mới
  if (isPlaying.value) {
    synth.cancel();
    // Khôi phục lại trạng thái do cancel() sẽ trigger isPlaying = false (nếu không chặn)
    // Nhưng vì mình gọi chủ động ở đây, ta dùng setTimeout để chờ cancel xong
    setTimeout(() => {
      isPlaying.value = true;
      playNextChunk();
    }, 50);
  }
};

const handleRateChange = () => {
  if (isPlaying.value) {
    synth.cancel();
    setTimeout(() => {
      isPlaying.value = true;
      playNextChunk();
    }, 50);
  }
};

onMounted(() => {
  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
});

// Hàm chia nhỏ văn bản theo câu để đọc ngắt nghỉ chuẩn xác
const prepareText = (text: string) => {
  if (!text) return [];
  // 1. Xử lý và làm sạch rác OCR, ký tự đặc biệt
  let cleanText = text
    // Xóa các ký tự đặc biệt, ký hiệu không đọc được
    .replace(/[~^{}<>|*+_\[\]\\]/g, ' ')
    // Thay thế nhiều dấu câu liên tiếp thành một dấu (OCR hay bị lỗi ...)
    .replace(/\.{2,}/g, '.')
    .replace(/,{2,}/g, ',')
    .replace(/;+/g, ';')
    .replace(/:+/g, ':')
    // Sửa các dấu phẩy, chấm phẩy lộn xộn đi liền nhau
    .replace(/;,| ,/g, ',')
    .replace(/,;/g, ';')
    // Xử lý lỗi đứt dòng giữa câu của file PDF (nếu cuối dòng không có dấu câu thì nối dòng)
    .replace(/([^.?!;:,])\n+/g, '$1 ')
    // Xử lý dính chữ (VD: "văn bản.Theo đó" -> "văn bản. Theo đó")
    .replace(/([a-zà-ỹ0-9])([.?!;,:])([A-ZÀ-Ỹ])/g, '$1$2 $3')
    // Xóa các khoảng trắng thừa do OCR sinh ra
    .replace(/\s+/g, ' ')
    .trim();
  
  // 2. Tách câu theo CHẤM, CHẤM HỎI, CHẤM THAN, CHẤM PHẨY, XUỐNG DÒNG
  const regex = /[^.?!;\n]+[.?!;\n]*/g;
  const matches = cleanText.match(regex);
  
  if (!matches) return [cleanText];

  const result: string[] = [];
  let currentSentence = "";
  
  for (const matchStr of matches) {
    const match = matchStr.trim();
    if (!match) continue;
    
    currentSentence += (currentSentence ? " " : "") + match;
    
    // Ngắt chunk khi gặp dấu kết thúc câu hoặc nếu câu quá dài (trên 300 ký tự)
    if (match.match(/[.?!;\n]/) || currentSentence.length > 300) {
      result.push(currentSentence.trim());
      currentSentence = "";
    }
  }
  // Thêm phần còn dư nếu có
  if (currentSentence.trim()) {
    result.push(currentSentence.trim());
  }
  
  return result;
};

const playNextChunk = () => {
  if (currentChunkIndex.value >= chunks.length) {
    // Đã đọc xong
    stop();
    return;
  }

  const chunk = chunks[currentChunkIndex.value];
  const utterance = new SpeechSynthesisUtterance(chunk);
  
  if (voicesList.value.length === 0) {
    loadVoices();
  }
  
  if (voicesList.value.length > 0) {
    const selected = voicesList.value[selectedVoiceIndex.value];
    if (selected) {
      utterance.voice = selected;
    }
  }
  utterance.lang = 'vi-VN';
  utterance.rate = playbackRate.value; // Tốc độ người dùng chọn
  utterance.pitch = 1;

  utterance.onend = () => {
    // Nếu đang play mới tự động sang câu tiếp theo (không bị pause/stop)
    if (isPlaying.value) {
      currentChunkIndex.value++;
      playNextChunk();
    }
  };

  utterance.onerror = (e) => {
    // Bỏ qua log lỗi nếu là do người dùng chủ động Tạm dừng hoặc Dừng (gọi synth.cancel())
    if (e.error === 'interrupted' || e.error === 'canceled') {
      return;
    }
    
    console.error('Lỗi khi đọc:', e);
    // Bỏ qua câu lỗi và đọc tiếp nếu có thể
    if (isPlaying.value) {
      currentChunkIndex.value++;
      playNextChunk();
    } else {
      stop();
    }
  };

  synth.speak(utterance);
};

const togglePlay = () => {
  if (!synth) {
    alert("Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.");
    return;
  }

  if (isPlaying.value) {
    // Đang chạy -> Tạm dừng
    synth.cancel(); // Tạm dừng bằng cách cancel đoạn hiện tại, khi resume sẽ đọc lại đoạn bị dở
    isPlaying.value = false;
    isPaused.value = true;
  } else {
    // Đang dừng -> Tiếp tục hoặc Bắt đầu mới
    if (isPaused.value) {
      // Tiếp tục đọc từ chunk hiện tại
      isPlaying.value = true;
      isPaused.value = false;
      playNextChunk();
    } else {
      // Bắt đầu đọc từ đầu
      chunks = prepareText(props.text);
      if (chunks.length === 0) return;
      
      totalChunks.value = chunks.length;
      currentChunkIndex.value = 0;
      isPlaying.value = true;
      isPaused.value = false;
      playNextChunk();
    }
  }
};

const stop = () => {
  if (synth) {
    synth.cancel();
  }
  isPlaying.value = false;
  isPaused.value = false;
  currentChunkIndex.value = 0;
  totalChunks.value = 0;
};

// Dừng đọc nếu nội dung thay đổi
watch(() => props.text, () => {
  stop();
});

// Dừng đọc khi component unmount
onBeforeUnmount(() => {
  stop();
});
</script>

<style scoped>
@keyframes wave {
  0% { height: 20%; opacity: 0.7; }
  50% { height: 100%; opacity: 1; }
  100% { height: 20%; opacity: 0.7; }
}
</style>
