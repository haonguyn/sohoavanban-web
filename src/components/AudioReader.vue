<template>
  <div v-if="text" class="audio-reader bg-gray-50 border border-gray-200 rounded-full shadow-sm px-4 py-2 my-6 animate-fade-in max-w-2xl mx-auto flex items-center gap-4">
    <!-- Play/Pause Button -->
    <button 
      @click="togglePlay"
      class="flex-shrink-0 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-sm active:scale-95"
    >
      <i v-if="!isPlaying || isPaused" class="fa-solid fa-play text-xs ml-0.5"></i>
      <i v-else class="fa-solid fa-pause text-xs"></i>
    </button>

    <!-- Progress Bar Area -->
    <div 
      class="flex-grow relative h-1.5 bg-gray-200 rounded-full cursor-pointer group" 
      @click="handleSeek" 
      @mousemove="handleHover"
      @mouseleave="hoverIndex = -1"
      ref="progressBar"
    >
      <div 
        class="h-full bg-blue-600 rounded-full transition-all duration-300 relative"
        :style="{ width: progress + '%' }"
      >
        <div v-if="isPlaying && !isPaused" class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
      </div>

      <!-- Hover Tooltip -->
      <div 
        v-if="hoverIndex !== -1"
        class="absolute -top-12 bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-2xl pointer-events-none whitespace-normal min-w-[140px] max-w-[280px] z-[100] transform -translate-x-1/2 flex flex-col gap-1 border border-gray-700"
        :style="{ left: hoverPos + 'px' }"
      >
        <div class="flex justify-between items-center border-b border-gray-700 pb-1 mb-1">
          <span class="font-bold text-blue-400 uppercase text-[7px]">Đoạn {{ hoverIndex + 1 }}</span>
          <span class="text-[7px] text-gray-500">{{ Math.round((hoverIndex/sentences.length)*100) }}%</span>
        </div>
        <span class="line-clamp-2 leading-tight text-gray-200">{{ sentences[hoverIndex] }}</span>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
      </div>

      <!-- Progress index -->
      <div class="absolute -bottom-4 right-0 text-[8px] text-gray-400 font-bold tabular-nums">
        {{ currentSentenceIndex + 1 }}/{{ sentences.length }}
      </div>
    </div>

    <!-- Controls Group -->
    <div class="flex items-center gap-1">
      <!-- Voice Selector -->
      <div class="relative">
        <button 
          @click="showVoiceMenu = !showVoiceMenu"
          v-click-outside="() => showVoiceMenu = false"
          class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-white rounded-full transition-all" 
          :title="'Giọng hiện tại: ' + (selectedVoice?.name || 'Mặc định')"
        >
          <i class="fa-solid fa-comment-dots text-xs"></i>
        </button>
        <!-- Custom Voice Dropdown -->
        <div v-if="showVoiceMenu" class="absolute right-0 bottom-full mb-3 bg-white border border-gray-200 rounded-xl shadow-2xl z-[101] p-2 min-w-[200px] max-h-60 overflow-y-auto animate-slide-up custom-scrollbar">
          <div class="px-2 py-1.5 border-b border-gray-100 mb-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chọn giọng đọc tiếng Việt</span>
          </div>
          <button 
            v-for="voice in viVoices" 
            :key="voice.name"
            @click="selectVoice(voice)"
            class="w-full text-left px-3 py-2 text-[10px] hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between gap-3 group"
            :class="{'bg-blue-50 text-blue-600 font-bold': selectedVoice?.name === voice.name}"
          >
            <div class="flex flex-col truncate">
              <span class="truncate">{{ voice.name }}</span>
              <span class="text-[8px] text-gray-400 group-hover:text-blue-400">{{ voice.lang }}</span>
            </div>
            <i v-if="selectedVoice?.name === voice.name" class="fa-solid fa-check text-[8px]"></i>
          </button>
          <div v-if="viVoices.length === 0" class="p-3 text-[10px] text-gray-400 italic text-center">
            Không tìm thấy giọng Việt khác trên thiết bị này.
          </div>
        </div>
      </div>

      <!-- Speed Selector -->
      <div class="relative group">
        <button class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-white rounded-full transition-all">
          <span class="text-[9px] font-bold">{{ playbackRate }}x</span>
        </button>
        <div class="absolute right-0 bottom-full mb-3 hidden group-hover:block bg-white border border-gray-200 rounded-xl shadow-2xl z-[101] p-1 min-w-[60px] animate-slide-up">
          <button v-for="rate in [0.75, 1, 1.25, 1.5, 2]" :key="rate" @click="changeRate(rate)" class="w-full text-center px-2 py-2 text-[10px] hover:bg-blue-50 rounded-lg transition-colors" :class="{'font-bold text-blue-600': playbackRate === rate}">{{ rate }}x</button>
        </div>
      </div>

      <!-- Stop Button -->
      <button @click="stop" class="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-white rounded-full transition-all" title="Dừng hẳn">
        <i class="fa-solid fa-power-off text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AudioReader',
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.clickOutsideEvent = (event: Event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      },
    },
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPlaying: false,
      isPaused: false,
      playbackRate: 1,
      currentSentenceIndex: 0,
      sentences: [] as string[],
      synth: window.speechSynthesis,
      utterance: null as SpeechSynthesisUtterance | null,
      voices: [] as SpeechSynthesisVoice[],
      selectedVoice: null as SpeechSynthesisVoice | null,
      timer: null as any,
      hoverIndex: -1,
      hoverPos: 0,
      showVoiceMenu: false
    };
  },
  computed: {
    progress(): number {
      if (this.sentences.length === 0) return 0;
      return ((this.currentSentenceIndex) / this.sentences.length) * 100;
    },
    viVoices(): SpeechSynthesisVoice[] {
      // Flexible filter for Vietnamese voices
      return this.voices.filter(v => 
        v.lang.toLowerCase().includes('vi') || 
        v.name.toLowerCase().includes('vietnam')
      );
    }
  },
  watch: {
    text: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.splitText(newVal);
      }
    }
  },
  mounted() {
    this.initVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.initVoices;
    }
  },
  beforeUnmount() {
    this.stop();
  },
  methods: {
    initVoices() {
      this.voices = this.synth.getVoices();
      if (!this.selectedVoice || this.viVoices.length === 0) {
        const viVoice = this.viVoices.find(v => v.lang.toLowerCase().includes('vi-vn')) || this.viVoices[0];
        this.selectedVoice = viVoice || this.voices[0] || null;
      }
    },
    selectVoice(voice: SpeechSynthesisVoice) {
      this.selectedVoice = voice;
      this.showVoiceMenu = false;
      if (this.isPlaying) this.speakCurrent();
    },
    splitText(val: string) {
      const cleanText = val.replace(/<[^>]*>?/gm, ' ');
      this.sentences = cleanText.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 0);
      this.currentSentenceIndex = 0;
    },
    togglePlay() {
      if (this.isPlaying && !this.isPaused) this.pause();
      else this.play();
    },
    play() {
      if (this.isPaused) {
        this.synth.resume();
        this.isPaused = false;
        this.isPlaying = true;
        return;
      }
      this.isPlaying = true;
      this.speakCurrent();
    },
    speakCurrent() {
      this.synth.cancel();
      clearTimeout(this.timer);
      if (this.currentSentenceIndex >= this.sentences.length) {
        this.stop();
        return;
      }
      const text = this.sentences[this.currentSentenceIndex];
      this.utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) this.utterance.voice = this.selectedVoice;
      this.utterance.rate = this.playbackRate;
      this.utterance.lang = this.selectedVoice?.lang || 'vi-VN';
      this.utterance.onend = () => {
        if (this.isPlaying && !this.isPaused) {
          this.timer = setTimeout(() => {
            this.currentSentenceIndex++;
            if (this.currentSentenceIndex < this.sentences.length) this.speakCurrent();
            else this.stop();
          }, 600);
        }
      };
      this.utterance.onerror = () => this.stop();
      this.synth.speak(this.utterance);
    },
    pause() {
      this.synth.pause();
      this.isPaused = true;
    },
    stop() {
      this.synth.cancel();
      clearTimeout(this.timer);
      this.isPlaying = false;
      this.isPaused = false;
      this.currentSentenceIndex = 0;
    },
    handleSeek(event: MouseEvent) {
      if (this.sentences.length === 0) return;
      const bar = this.$refs.progressBar as HTMLElement;
      const rect = bar.getBoundingClientRect();
      const clickedProgress = (event.clientX - rect.left) / rect.width;
      this.currentSentenceIndex = Math.min(Math.floor(clickedProgress * this.sentences.length), this.sentences.length - 1);
      if (this.isPlaying) this.speakCurrent();
    },
    handleHover(event: MouseEvent) {
      if (this.sentences.length === 0) return;
      const bar = this.$refs.progressBar as HTMLElement;
      const rect = bar.getBoundingClientRect();
      const pos = event.clientX - rect.left;
      this.hoverPos = pos;
      const progress = pos / rect.width;
      this.hoverIndex = Math.min(Math.floor(progress * this.sentences.length), this.sentences.length - 1);
    },
    changeRate(rate: number) {
      this.playbackRate = rate;
      if (this.isPlaying && !this.isPaused) this.speakCurrent();
    }
  }
});
</script>

<style scoped>
.audio-reader { backdrop-filter: blur(4px); }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
