<template>
    <!-- Container chính -->
    <div class="fixed z-50 right-6 transition-[bottom] duration-300" :class="{ 'transition-none': isDragging }" :style="{ bottom: bottomOffset + 'px' }">

        <!-- BUTTON THU GỌN -->
        <div v-if="!isOpen"
            class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-move shadow-xl hover:bg-blue-700 transition-colors active:scale-95"
            @mousedown="startDrag"
            @click="handleClick">
            <!-- Icon Chat -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </div>

        <!-- CỬA SỔ CHAT MỞ RỘNG -->
        <div v-else class="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            :style="{ width: CHAT_WIDTH + 'px', height: CHAT_HEIGHT + 'px' }">

            <!-- Header -->
            <div class="p-4 bg-blue-600 text-white flex items-center justify-between select-none cursor-move" @mousedown="startDrag">
                <div class="flex items-center gap-2">
                    <span class="text-xl">🤖</span>
                    <div>
                        <h3 class="font-bold text-sm">Trợ lý ảo</h3>
                        <p class="text-xs text-blue-200 flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full bg-green-400 block"></span> Trực tuyến
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <!-- Nút thu nhỏ (-) -->
                    <button @click="toggleChat" class="hover:bg-blue-700 p-1 rounded transition-colors" title="Thu nhỏ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <!-- Nút đóng và tạo đoạn chat mới (x) -->
                    <button @click="closeAndClearChat" class="hover:bg-red-500 hover:text-white p-1 rounded transition-colors" title="Đóng cuộc trò chuyện">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 overflow-y-auto p-4 bg-gray-50 message-container space-y-3">
                <div v-for="msg in messages" :key="msg.id" class="flex"
                    :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">

                    <div class="max-w-[85%] p-4 rounded-2xl text-sm shadow-sm leading-relaxed"
                        :class="msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'">
                        
                        <!-- Typing Indicator Animation -->
                        <div v-if="msg.id === -1" class="flex justify-center items-center gap-1.5 h-5 px-2">
                            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                        </div>
                        
                        <!-- Regular Message & File -->
                        <template v-else>
                            <!-- File Attachment UI (Compact) -->
                            <div v-if="msg.isFile" class="flex items-center gap-1.5 text-xs mb-2 opacity-90 border-b border-white/20 pb-1.5">
                                <svg class="flex-shrink-0" :class="msg.role === 'user' ? 'text-white' : 'text-blue-600'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                </svg>
                                <span class="truncate italic font-medium max-w-[180px]" :title="msg.fileName">{{ msg.fileName }}</span>
                            </div>
                            <!-- Format text -->
                            <div v-html="formatMessage(msg.text, msg.role)"></div>
                        </template>                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-3 bg-white border-t border-gray-100">

                <!-- Hiển thị file đã chọn (Compact) -->
                <div v-if="selectedFile"
                    class="mb-2 px-2 py-1 bg-blue-50 rounded flex items-center justify-between text-[11px] border border-blue-100">
                    <div class="flex items-center gap-1.5 truncate">
                        <svg class="text-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="12"
                            height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                        <span class="truncate max-w-[200px] text-blue-800 font-medium">{{ selectedFile.name }}</span>
                    </div>
                    <button @click="removeFile" class="text-blue-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <!-- Input Controls -->
                <div class="flex items-end gap-2">
                    <!-- Nút Attach -->
                    <button @click="triggerFileSelect"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors pb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48">
                            </path>
                        </svg>
                    </button>

                    <!-- Hidden Input File -->
                    <input type="file" ref="fileInput" class="hidden" @change="handleFileChange">

                    <!-- Textarea tự động dãn hoặc Input thường -->
                    <div
                        class="flex-1 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-200 transition-all border border-transparent focus-within:bg-white focus-within:border-blue-300">
                        <input ref="chatInput" v-model="messageText" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..."
                            class="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400" />
                    </div>

                    <!-- Nút Send -->
                    <button @click="sendMessage" :disabled="!messageText && !selectedFile"
                        class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95 pb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { sendChatMessage } from '../api/chatApi'

export default defineComponent({
    name: 'FloatingChat',

    data() {
        return {
            BUTTON_SIZE: 56,
            CHAT_WIDTH: 360,
            CHAT_HEIGHT: 520,

            isOpen: false,
            bottomOffset: 24, // Tương đương bottom-6
            isDragging: false,
            dragStartY: 0,
            dragStartBottom: 0,
            hasDragged: false,

            fileInput: null as HTMLInputElement | null,
            selectedFile: null as File | null,
            messageText: '',
            isLoading: false,
            messages: [
                {
                    id: 1,
                    role: 'ai',
                    text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
                },
            ] as Array<{ id: number | string, role: string, text: string, isFile?: boolean, fileName?: string }>,
        }
    },

    mounted() {
        // Khôi phục vị trí nếu có lưu
        const savedBottom = localStorage.getItem('chat_bottom_pos');
        if (savedBottom) {
            this.bottomOffset = parseInt(savedBottom);
        }
    },

    methods: {
        handleClick() {
            // Chỉ toggle nếu không phải đang kết thúc một cú kéo
            if (!this.hasDragged) {
                this.toggleChat();
            }
        },

        toggleChat() {
            this.isOpen = !this.isOpen
            if (this.isOpen) {
                nextTick(() => {
                    (this.$refs.chatInput as HTMLInputElement)?.focus()
                })
            }
        },

        closeAndClearChat() {
            // Thu nhỏ
            if (this.isOpen) {
                this.toggleChat()
            }
            
            // Đợi thu nhỏ xong rồi xoá tin nhắn
            setTimeout(() => {
                this.messages = [
                    {
                        id: 1,
                        role: 'ai',
                        text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
                    },
                ]
                this.messageText = ''
                this.selectedFile = null
            }, 300)
        },

        // Drag methods
        startDrag(e: MouseEvent) {
            this.isDragging = true;
            this.hasDragged = false;
            this.dragStartY = e.clientY;
            this.dragStartBottom = this.bottomOffset;

            window.addEventListener('mousemove', this.onDrag);
            window.addEventListener('mouseup', this.stopDrag);
            
            // Ngăn chặn bôi đen text khi kéo
            e.preventDefault();
        },

        onDrag(e: MouseEvent) {
            if (!this.isDragging) return;
            
            const deltaY = this.dragStartY - e.clientY;
            if (Math.abs(deltaY) > 5) {
                this.hasDragged = true;
            }

            let newBottom = this.dragStartBottom + deltaY;
            
            // Giới hạn vùng kéo
            const minBottom = 24;
            const maxBottom = window.innerHeight - (this.isOpen ? this.CHAT_HEIGHT : this.BUTTON_SIZE) - 24;
            
            if (newBottom < minBottom) newBottom = minBottom;
            if (newBottom > maxBottom) newBottom = maxBottom;
            
            this.bottomOffset = newBottom;
        },

        stopDrag() {
            this.isDragging = false;
            window.removeEventListener('mousemove', this.onDrag);
            window.removeEventListener('mouseup', this.stopDrag);
            
            // Lưu vị trí
            localStorage.setItem('chat_bottom_pos', this.bottomOffset.toString());
        },

        triggerFileSelect() {
            (this.$refs.fileInput as HTMLInputElement)?.click()
        },

        handleFileChange(event: Event) {
            const target = event.target as HTMLInputElement
            if (target.files && target.files.length > 0) {
                this.selectedFile = target.files[0]!
            } else {
                this.selectedFile = null
            }

            target.value = ''
            nextTick(() => {
                (this.$refs.chatInput as HTMLInputElement)?.focus()
            })
        },

        removeFile() {
            this.selectedFile = null
        },

        async sendMessage() {
            if (!this.messageText.trim() && !this.selectedFile) return

            const file = this.selectedFile
            const userText = this.messageText.trim()

            // Prepare history to send (excluding the welcome message and current message)
            const rawHistory = this.messages.filter(m => m.id !== 1 && m.id !== -1)
            const historyToDBSend: Array<{role: string, text: string}> = []
            
            for (const msg of rawHistory) {
                const lastMsg = historyToDBSend[historyToDBSend.length - 1]
                if (lastMsg && lastMsg.role === msg.role) {
                    lastMsg.text += `\n${msg.text}`
                } else {
                    historyToDBSend.push({ role: msg.role, text: msg.text })
                }
            }

            // Push Message (Combined File + Text)
            this.messages.push({
                id: Date.now(),
                role: 'user',
                text: userText || (file ? `Đã gửi tệp: ${file.name}` : ''),
                isFile: !!file,
                fileName: file?.name
            })

            this.messageText = ''
            this.selectedFile = null
            this.isLoading = true
            this.scrollToBottom()

            // Push Typing Indicator
            this.messages.push({
                id: -1,
                role: 'ai',
                text: '',
            })
            this.scrollToBottom()

            try {
                const formData = new FormData()
                formData.append('message', userText)
                if (file) {
                    formData.append('file', file)
                }
                formData.append('history', JSON.stringify(historyToDBSend))

                const res = await sendChatMessage(formData)

                // Remove typing indicator
                this.messages = this.messages.filter(m => m.id !== -1)
                
                // Add AI Message
                this.messages.push({
                    id: Date.now(),
                    role: 'ai',
                    text: res.data.text,
                })

            } catch (error: any) {
                console.error("Chat API Error:", error)
                this.messages = this.messages.filter(m => m.id !== -1)
                this.messages.push({
                    id: Date.now(),
                    role: 'ai',
                    text: `Lỗi: Không thể kết nối với chatbot. ${error?.response?.data?.error || ''}`,
                })
            } finally {
                this.isLoading = false
                this.scrollToBottom()
            }
        },
        
        scrollToBottom() {
            const container = document.querySelector('.message-container') as HTMLElement
            if (container) {
                nextTick(() => {
                    container.scrollTop = container.scrollHeight
                })
            }
        },

        formatMessage(text: string, role: string) {
            if (!text) return ''
            
            // 1. Escape HTML
            let safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            
            // Color constants based on role
            const isAI = role === 'ai';
            const boldClass = isAI ? 'font-bold text-gray-900' : 'font-bold text-white underline decoration-blue-300';
            const italicClass = isAI ? 'italic text-gray-600' : 'italic text-blue-100';
            const linkClass = isAI ? 'text-blue-600 underline font-bold hover:text-blue-800' : 'text-white underline font-bold opacity-90 hover:opacity-100';
            
            // 2. Bold: **text**
            safeText = safeText.replace(/\*\*(.*?)\*\*/g, `<b class="${boldClass}">$1</b>`);
            
            // 3. Italic: *text* or _text_
            safeText = safeText.replace(/\*(.*?)\*/g, `<i class="${italicClass}">$1</i>`);
            safeText = safeText.replace(/_(.*?)_/g, `<i class="${italicClass}">$1</i>`);
            
            // 4. Newlines: \n to <br>
            safeText = safeText.replace(/\n/g, '<br>');
            
            // 5. Lists (simple)
            const lines = safeText.split('<br>');
            const formattedLines = lines.map(line => {
                const trimmed = line.trim();
                // Bullet points
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return `<div class="pl-4 mt-1 flex items-start"><span class="mr-2 opacity-60">•</span><span>${trimmed.substring(2)}</span></div>`;
                }
                // Numbered points
                const numMatch = trimmed.match(/^(\d+)\. (.*)/);
                if (numMatch) {
                    return `<div class="pl-4 mt-1 flex items-start"><span class="mr-2 font-medium opacity-60">${numMatch[1]}.</span><span>${numMatch[2]}</span></div>`;
                }
                return line;
            });
            
            safeText = formattedLines.join('<div class="h-1"></div>');

            // 6. Links [text](url)
            safeText = safeText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" class="${linkClass}">$1</a>`);
            
            return safeText;
        }
    },
})
</script>