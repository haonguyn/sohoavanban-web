<template>
    <div class="flex h-screen">
        <Navbar />

        <main class="flex-1 overflow-hidden relative bg-slate-50">
            <div class="p-6 h-full flex flex-col">

                <!-- Header -->
                <div v-show="!selectedDoc && !isDetailLoading" class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 gap-4">
                  <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Danh sách văn bản</h1>
                    <p class="text-sm text-slate-500 mt-1">Quản lý, duyệt và kiểm soát kho tài liệu lưu trữ của hệ thống.</p>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <div class="relative flex-1 min-w-[240px]">
                          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                          <input v-model="searchQuery" type="text" placeholder="Số hiệu, tiêu đề, người ký..."
                              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all text-sm">
                      </div>
                      <div class="relative">
                          <button @click="isStatusDropdownOpen = !isStatusDropdownOpen" class="w-full text-left pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-w-[150px] cursor-pointer flex items-center justify-between">
                              <span>{{ statusLabel }}</span>
                              <i class="fas fa-chevron-down text-slate-400 text-[10px]"></i>
                          </button>
                          
                          <div v-if="pendingCount > 0" class="absolute -top-1.5 -right-1.5 flex h-4 w-4 pointer-events-none">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] text-white font-bold items-center justify-center">{{ pendingCount }}</span>
                          </div>

                          <!-- Overlay for click outside -->
                          <div v-if="isStatusDropdownOpen" @click="isStatusDropdownOpen = false" class="fixed inset-0 z-40"></div>

                          <!-- Custom Dropdown Menu -->
                          <div v-if="isStatusDropdownOpen" class="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                              <div @click="selectStatus('')" class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors" :class="{'bg-blue-50 font-bold text-blue-600': listFilter.status === ''}">Tất cả trạng thái</div>
                              <div @click="selectStatus('pending')" class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between" :class="{'bg-blue-50 font-bold text-blue-600': listFilter.status === 'pending'}">
                                  <span>Chưa duyệt</span>
                                  <div v-if="pendingCount > 0" class="flex h-4 min-w-[16px] px-1 pointer-events-none items-center justify-center relative">
                                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                      <span class="relative inline-flex rounded-full h-4 min-w-[16px] px-1 bg-rose-500 text-[9px] text-white font-bold items-center justify-center">{{ pendingCount }}</span>
                                  </div>
                              </div>
                              <div @click="selectStatus('approved')" class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors" :class="{'bg-blue-50 font-bold text-blue-600': listFilter.status === 'approved'}">Đã duyệt</div>
                              <div @click="selectStatus('rejected')" class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors" :class="{'bg-blue-50 font-bold text-blue-600': listFilter.status === 'rejected'}">Từ chối</div>
                          </div>
                      </div>
                      <div class="relative">
                          <select v-model="listFilter.doc_type"
                              class="pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white min-w-[160px] cursor-pointer">
                              <option value="">Tất cả loại văn bản</option>
                              <option v-for="type in uniqueDocTypes" :key="type" :value="type">
                                  {{ type }}
                              </option>
                          </select>
                          <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]"></i>
                      </div>
                  </div>
                </div>

                <!-- LIST TABLE -->
                <div v-show="!selectedDoc && !isDetailLoading" class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                    <div class="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <table class="w-full">
                            <thead class="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Số hiệu</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tên văn bản</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Ngày ban hành</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Người ký</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Loại văn bản</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Ghi chú</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Chế độ xem</th>
                                    <th class="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="doc in paginatedDocs" :key="doc.id" class="hover:bg-blue-50 transition-colors">
                                    <td class="px-4 py-3 font-bold text-blue-600 whitespace-nowrap" :title="doc.doc_number">{{ doc.doc_number }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-600 max-w-[280px]" :title="doc.summary"><div class="line-clamp-2" style="white-space: normal;">{{ doc.title }}</div></td>
                                    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{{ formatDate(doc.issued_date) }}</td>
                                    <td class="px-4 py-3">
                                        <span :class="`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(doc.status)}`">
                                            {{ convertStatus(doc.status) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{{ doc.signer }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-500">{{ normalizeDocType(doc.doc_type || '') || 'Khác' }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-500 max-w-[120px] truncate" :title="doc.note">{{ doc.note }}</td>
                                    <td class="px-4 py-3 text-sm text-slate-500">
                                        <span :class="doc.visibility === 'public' ? 'text-green-700 bg-green-100' : 'text-rose-700 bg-rose-100'"
                                            class="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                            <i :class="doc.visibility === 'public' ? 'fas fa-globe' : 'fas fa-lock'"></i>
                                            {{ doc.visibility }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right flex justify-end gap-1">
                                        <button @click="viewDetail(doc)"
                                            class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                                            title="Xem chi tiết">
                                            <i class="fa-solid fa-eye"></i>
                                        </button>
                                        <button @click="handleDeleteDocument(doc.id)"
                                            class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-full transition"
                                            title="Xóa">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>

                    <!-- PAGINATION -->
                    <div class="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-slate-500 relative">
                        <div class="flex items-center gap-2 sm:absolute sm:left-4">
                            <span>Hiển thị {{ paginatedDocs.length }} / {{ filteredDocs.length }} kết quả</span>
                        </div>
                        
                        <div class="flex items-center gap-1 z-10">
                            <!-- Nút Trước -->
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600">
                                <i class="fas fa-chevron-left text-[10px]"></i>
                            </button>

                            <!-- Các số trang -->
                            <div class="flex items-center gap-1">
                                <template v-for="(p, idx) in visiblePages" :key="idx">
                                    <button v-if="typeof p === 'number'"
                                        @click="goToPage(p)"
                                        :class="[
                                            'w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold transition-all',
                                            currentPage === p 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600'
                                        ]">
                                        {{ p }}
                                    </button>
                                    <span v-else class="w-6 text-center text-slate-400">...</span>
                                </template>
                            </div>

                            <!-- Nút Sau -->
                            <button @click="nextPage" :disabled="currentPage * itemsPerPage >= filteredDocs.length"
                                class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600">
                                <i class="fas fa-chevron-right text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- DETAIL TAB -->
                <div v-if="selectedDoc || isDetailLoading" class="p-4 overflow-auto h-full flex flex-col bg-slate-50">
                    <!-- Loading spinner -->
                    <div v-if="isDetailLoading" class="flex flex-col items-center justify-center flex-1 py-20">
                        <svg class="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p class="text-slate-500 font-medium">Đang tải thông tin văn bản...</p>
                        <button @click="goBack" class="mt-4 text-sm text-slate-400 hover:text-slate-600">Hủy</button>
                    </div>
                    <template v-else-if="selectedDoc">
                    <div class="flex justify-between items-center mb-4">
                        <button @click="goBack"
                            class="flex items-center text-slate-500 hover:text-blue-600 font-medium">
                            <span
                                class="bg-white p-1 rounded-full border shadow-sm mr-2 flex items-center justify-center w-6 h-6">←</span>
                            Quay lại
                        </button>

                        <div class="flex gap-3">
                            <template @click="toggleCard" class="bg-white px-4 rounded-2xl flex items-center gap-4">
                                <span
                                    class="font-bold text-sm text-right transition-colors duration-300 cursor-pointer select-none"
                                    :class="isPublic ? 'text-green-600' : 'text-slate-500'">
                                    {{ isPublic ? 'Công khai' : 'Riêng tư' }}
                                </span>
                                <div class="relative inline-flex items-center cursor-pointer select-none">
                                    <div class="w-14 h-7 rounded-full transition-colors duration-300"
                                        :class="isPublic ? 'bg-green-500' : 'bg-slate-300'">
                                    </div>
                                    <div class="absolute top-0.5 left-0.5 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center"
                                        :class="isPublic ? 'translate-x-7' : 'translate-x-0'">
                                        <i class="fas fa-globe-asia text-[10px] text-green-600 transition-all"
                                            v-show="isPublic"></i>
                                        <i class="fas fa-lock text-[10px] text-slate-500 transition-all"
                                            v-show="!isPublic"></i>
                                    </div>
                                </div>
                            </template>
                            <template v-if="isEditing">
                                <button @click="cancelEditing"
                                    class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded">Hủy</button>
                                <button @click="saveDocChanges"
                                    class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm">
                                    <i class="fas fa-save"></i> Lưu thay đổi
                                </button>
                            </template>

                            <template v-else>
                                <button @click="startEditing"
                                    class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-50">
                                    <i class="fas fa-pen"></i> Chỉnh sửa
                                </button>
                                <template v-if="selectedDoc.status === 'pending'">
                                    <button @click="updateStatus('rejected')"
                                        class="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 shadow-sm">Từ
                                        chối</button>
                                    <button @click="updateStatus('approved')"
                                        class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow-sm">Duyệt
                                        văn bản</button>
                                </template>
                                <button @click="doDownloadFile"
                                    class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-sm">
                                    <i class="fa-solid fa-download"></i> Download
                                </button>
                            </template>
                        </div>
                    </div>


                    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[4fr_3fr] gap-4 overflow-y-auto">
                        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
                            <div class="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 class="text-xl font-bold text-slate-800">Thông tin chi tiết</h2>
                                    <p class="text-xs text-slate-400">ID: {{ selectedDoc.id }}</p>
                                </div>
                                <span
                                    class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100">Số
                                    trang: {{ selectedDoc.page_count }}</span>
                            </div>

                            <div v-if="isEditing" class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Số hiệu</label>
                                    <input v-model="editForm.doc_number" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Ngày BH</label>
                                    <AppDatePicker v-model="editForm.issued_date" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Loại văn bản</label>
                                    <input v-model="editForm.doc_type" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Cơ quan ban hành</label>
                                    <input v-model="editForm.issued_by" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Người ký</label>
                                    <input v-model="editForm.signer" class="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500">Tên văn bản</label>
                                    <input v-model="editForm.title" class="w-full border p-2 rounded" />
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-bold text-slate-500">Trích yếu</label>
                                    <textarea v-model="editForm.summary"
                                        class="w-full border p-2 rounded h-24"></textarea>
                                </div>
                                <div class="col-span-2">
                                    <label class="text-xs font-bold text-slate-500">Nội dung</label>
                                    <textarea v-model="editForm.full_text"
                                        class="w-full border p-2 rounded h-64 font-mono text-sm"></textarea>
                                </div>
                                <!-- Liên kết văn bản -->
                                <div class="col-span-2 border-t border-slate-200 mt-6 pt-6">
                                    <div class="flex justify-between items-center mb-4">
                                        <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Quản lý liên kết văn bản</h4>
                                        <button @click="addLinkRow" type="button"
                                            class="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition border border-indigo-100 flex items-center gap-1.5">
                                            <i class="fas fa-plus"></i> Thêm liên kết mới
                                        </button>
                                    </div>

                                    <!-- Danh sách liên kết hiện tại (trong chế độ sửa) -->
                                    <div v-if="existingLinks.length > 0" class="mb-6 space-y-2">
                                        <p class="text-[11px] font-bold text-slate-400 uppercase mb-2">Liên kết hiện có:</p>
                                        <div v-for="link in existingLinks" :key="link.id" 
                                            class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl group">
                                            <div class="flex items-center gap-3">
                                                <div class="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase">
                                                    {{ link.link_type }}
                                                </div>
                                                <span class="text-sm font-semibold text-slate-700">
                                                    {{ link.target_document_number || link.source_document_number }}
                                                </span>
                                            </div>
                                            <button @click="handleDeleteLink(link.id)" type="button"
                                                class="text-slate-300 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-lg">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Danh sách hàng liên kết mới đang chờ lưu -->
                                    <div class="space-y-3">
                                        <div v-for="(link, index) in pendingLinks" :key="index" 
                                            class="grid grid-cols-[1fr_1fr_auto] gap-3 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 animate-fade-in">
                                            <div>
                                                <label class="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Số ký hiệu văn bản</label>
                                                <input v-model="link.target_doc_number" list="docNumbersList" placeholder="Nhập để tìm kiếm..." autocomplete="off" class="w-full border-slate-200 p-2 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                                            </div>
                                            <div>
                                                <label class="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Loại liên kết</label>
                                                <select v-model="link.link_type" class="w-full border-slate-200 rounded-lg border p-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                                                    <option value="auto">✨ AI Tự nhận diện</option>
                                                    <option value="can_cu">Văn bản căn cứ</option>
                                                    <option value="thay_the">Văn bản thay thế</option>
                                                    <option value="bi_thay_the">Văn bản bị thay thế</option>
                                                    <option value="sua_doi">Sửa đổi, bổ sung</option>
                                                    <option value="bi_sua_doi">Bị sửa đổi, bổ sung</option>
                                                    <option value="het_hieu_luc">Hết hiệu lực</option>
                                                    <option value="het_hieu_luc_1_phan">Hết hiệu lực 1 phần</option>
                                                    <option value="dinh_chinh">Đính chính</option>
                                                </select>
                                            </div>
                                            <div class="flex items-end">
                                                <button @click="removeLinkRow(index)" type="button"
                                                    class="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div v-if="pendingLinks.length === 0 && existingLinks.length === 0" 
                                            class="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                            <div class="text-slate-300 mb-2"><i class="fas fa-link text-3xl"></i></div>
                                            <p class="text-sm text-slate-400 italic">Chưa có liên kết nào cho văn bản này</p>
                                        </div>
                                    </div>

                                    <datalist id="docNumbersList">
                                        <option v-for="d in docs" :key="d.id" :value="d.doc_number">{{ d.title }}</option>
                                    </datalist>
                                </div>
                            </div>

                            <div v-else class="space-y-6">
                                <div class="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-100">
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Số
                                            hiệu</span>
                                        <p class="font-bold text-slate-800 text-lg">{{ selectedDoc.doc_number }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Ngày
                                            BH</span>
                                        <p class="font-semibold text-slate-800">{{ formatDate(selectedDoc.issued_date) }}</p>
                                    </div>
                                        <p class="font-semibold text-blue-600">{{ normalizeDocType(selectedDoc.doc_type || '') || 'Khác' }}</p>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Cơ quan
                                            ban hành</span>
                                        <p class="font-semibold text-slate-800">{{ selectedDoc.issued_by }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Người
                                            ký</span>
                                        <p class="font-semibold text-slate-800">{{ selectedDoc.signer }}</p>
                                    </div>
                                    <div><span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Tên văn
                                            bản</span>
                                        <p class="font-semibold text-slate-800">{{ selectedDoc.title }}</p>
                                    </div>
                                    <div class="col-span-2 pt-2 border-t border-slate-200"><span
                                            class="text-slate-400 text-xs uppercase font-bold tracking-wider">Trích
                                            yếu</span>
                                        <p class="font-medium text-slate-700 mt-1">{{ selectedDoc.summary }}</p>
                                    </div>
                                </div>
                                
                                <!-- Hiển thị liên kết văn bản trong View mode -->
                                <div v-if="existingLinks.length > 0" class="border-t border-slate-200 pt-6">
                                    <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <i class="fas fa-link text-blue-500 w-4 h-4"></i> Các liên kết hiện tại
                                    </h4>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div v-for="link in existingLinks" :key="link.id" 
                                            class="flex flex-col p-3 bg-white border border-blue-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div class="flex items-center justify-between mb-1.5">
                                                <span class="text-[10px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-50 rounded border border-blue-100">
                                                    {{ link.link_type }}
                                                </span>
                                            </div>
                                            <p class="text-[13px] font-bold text-slate-700 mb-1">
                                                {{ link.target_document_number || link.source_document_number }}
                                            </p>
                                            <p class="text-[11px] text-slate-500 line-clamp-1 italic">
                                                {{ link.target_document_title || link.source_document_title }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-2"><i
                                            data-lucide="file-text" class="w-4 h-4"></i> Nội dung OCR</h4>

                                    <div
                                        class="bg-slate-50 p-4 rounded-lg border border-slate-200 h-64 overflow-y-auto">
                                        <p class="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                                            {{ selectedDoc.full_text }}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-800 mb-3 flex items-center gap-2"><i
                                            data-lucide="history" class="w-4 h-4"></i> Lịch sử xử lý</h4>
                                    <div class="border-l-2 border-slate-200 pl-4 space-y-4">
                                        <div v-for="(h, i) in selectedDoc.history" :key="i" class="relative">
                                            <div
                                                class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white">
                                            </div>
                                            <p class="text-sm font-bold text-slate-700">{{ h.action }}</p>
                                            <p class="text-xs text-slate-500">{{ h.date }} • {{ h.user }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-slate-800 rounded-xl shadow-lg flex flex-col p-1">
                            <div class="flex-1 bg-slate-700 rounded-lg m-1 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden">
                                <i data-lucide="file-text" class="w-48 h-48 opacity-10 absolute"></i>
                                <p class="mb-4 font-medium z-10">
                                    Previewing:
                                    <span v-if="selectedDoc?.attachments">
                                        {{ selectedDoc.attachments.filename }}
                                    </span>
                                    <span v-else>
                                        Không có file
                                    </span>
                                </p>
                                <div class="w-full h-full border-2 border-dashed border-slate-500 rounded bg-slate-800/50 backdrop-blur-sm z-10 overflow-hidden p-4">
                                    <iframe v-if="selectedDoc?.attachments?.preview_url"
                                        :src="selectedDoc.attachments.preview_url + '#toolbar=0&navpanes=0&view=FitH'" class="w-full h-full rounded"
                                        frameborder="0"></iframe>
                                    <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                                        Không có file để preview
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </template><!-- end v-else-if selectedDoc -->
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
import type { Doc } from "../../types/DocumentTypes";
import { deleteDocument, fetchDocuments, updateDocument, createDocumentLink, getDocumentDetail, getDocumentLinks, deleteDocumentLink, getDocumentMetadata } from "../../api/documentApi";
import { useConfirmStore } from "../../store/confirmStore";
import LoadingComponent from "../../components/LoadingComponent.vue";
import ToastNotification from "../../components/ToastNotification.vue";
import AppDatePicker from "../../components/AppDatePicker.vue";
import { fetchAttachmentsByDoc } from "../../api/attachmentApi";
import { base64ToBlob, downloadFile, formatDate } from "../../utils/fileUtils";
import { normalizeDocType, removeVietnameseTones } from "../../utils/textUtils";

export default defineComponent({
    name: "DocumentList",
    components: { Navbar, LoadingComponent, ToastNotification, AppDatePicker },
    data() {
        return {
            listFilter: {
                doc_type: "",
                status: "",
            },
            searchQuery: "",
            currentPage: 1,
            itemsPerPage: 8,
            selectedDoc: null as Doc | null,
            isEditing: false,
            isPublic: false,
            editForm: {} as Partial<Doc>,
            docs: [] as Doc[],
            uniqueDocTypes: [] as string[],
            pendingLinks: [] as { target_doc_number: string; link_type: string }[],
            existingLinks: [] as any[],
            isDetailLoading: false,
            // AI Suggestion State
            newLink: { target_doc_number: "", link_type: "auto" },
            aiSuggestions: [] as any[],
            isSuggesting: false,
            isStatusDropdownOpen: false,
        };
    },
    async mounted() {
        (this.$refs.loadingRef as any)?.show();
        await Promise.all([
            this.getDocuments(),
            this.fetchMetadata()
        ]);
        (this.$refs.loadingRef as any)?.hide();
    },
    computed: {
        statusLabel(): string {
            switch (this.listFilter.status) {
                case 'pending': return 'Chưa duyệt';
                case 'approved': return 'Đã duyệt';
                case 'rejected': return 'Từ chối';
                default: return 'Tất cả trạng thái';
            }
        },
        pendingCount(): number {
            return this.docs.filter(doc => doc.status === 'pending').length;
        },
        filteredDocs(): Doc[] {
            const queryTerms = removeVietnameseTones(this.searchQuery)
                .split(' ')
                .filter(term => term.trim() !== '');

            const filtered = this.docs.filter(doc => {
                const targetText = removeVietnameseTones(
                    [doc.title, doc.doc_number, doc.signer].filter(Boolean).join(' ')
                );

                const matchesSearch = queryTerms.length === 0 || queryTerms.every(term => targetText.includes(term));

                const docTypeNorm = doc.doc_type ? normalizeDocType(doc.doc_type) : "";
                const matchesType = !this.listFilter.doc_type || docTypeNorm === this.listFilter.doc_type;
                const matchesStatus = !this.listFilter.status || doc.status === this.listFilter.status;

                return matchesSearch && matchesType && matchesStatus;
            });

            const statusOrder: Record<string, number> = {
                'pending': 1,
                'approved': 2,
                'rejected': 3
            };

            return filtered.sort((a, b) => {
                const orderA = statusOrder[a.status || ''] || 4;
                const orderB = statusOrder[b.status || ''] || 4;
                if (orderA !== orderB) {
                    return orderA - orderB;
                }
                const dateA = new Date(a.issued_date || 0).getTime();
                const dateB = new Date(b.issued_date || 0).getTime();
                return dateB - dateA;
            });
        },

        paginatedDocs(): Doc[] {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredDocs.slice(start, start + this.itemsPerPage);
        },
        totalPages(): number {
            return Math.ceil(this.filteredDocs.length / this.itemsPerPage);
        },
        visiblePages(): (number | string)[] {
            const pages: (number | string)[] = [];
            const threshold = 1; // Số trang hiển thị xung quanh trang hiện tại

            if (this.totalPages <= 7) {
                for (let i = 1; i <= this.totalPages; i++) pages.push(i);
                return pages;
            }

            // Luôn hiển thị trang 1
            pages.push(1);

            if (this.currentPage > threshold + 2) {
                pages.push('...');
            }

            // Hiển thị các trang xung quanh trang hiện tại
            const start = Math.max(2, this.currentPage - threshold);
            const end = Math.min(this.totalPages - 1, this.currentPage + threshold);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (this.currentPage < this.totalPages - threshold - 1) {
                pages.push('...');
            }

            // Luôn hiển thị trang cuối
            if (this.totalPages > 1) {
                pages.push(this.totalPages);
            }

            return pages;
        }
    },
    watch: {
        listFilter: {
            deep: true,
            handler() {
                this.currentPage = 1;
            }
        },
        searchQuery() {
            this.currentPage = 1;
        },
        selectedDoc: {
            immediate: true,
            handler(doc) {
                if (doc?.visibility) {
                    this.isPublic = doc.visibility === "public";
                }
            },
        },
    },
    methods: {
        selectStatus(status: string) {
            this.listFilter.status = status;
            this.isStatusDropdownOpen = false;
        },
        async fetchMetadata() {
            try {
                const res = await getDocumentMetadata();
                const { doc_types } = res.data;
                this.uniqueDocTypes = this.processMetadataList(doc_types);
            } catch (err) {
                // Fallback nếu không có endpoint metadata
                const types = this.docs.map(d => d.doc_type).filter((t): t is string => !!t);
                this.uniqueDocTypes = this.processMetadataList(types);
            }
        },
        processMetadataList(list: string[]): string[] {
            return Array.from(new Set(list.map(t => normalizeDocType(t))))
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b, 'vi'));
        },
        formatDate,
        normalizeDocType,
        getStatusColor(status: string) {
            switch (status) {
                case "approved": return "bg-emerald-100 text-emerald-700";
                case "pending": return "bg-amber-100 text-amber-700";
                case "rejected": return "bg-rose-100 text-rose-700";
                default: return "bg-slate-100 text-slate-600";
            }
        },
        convertStatus(status: string) {
            switch (status) {
                case "approved": return "Đã duyệt";
                case "pending": return "Chờ duyệt";
                case "rejected": return "Từ chối";
                default: return "";
            }
        },
        async toggleCard() {
            if (!this.selectedDoc) return;

            const newVisibility = this.isPublic ? "private" : "public";
            try {
                await updateDocument(
                    Number(this.selectedDoc.id),
                    { visibility: newVisibility }
                );
                this.isPublic = newVisibility === "public";
                (this.$refs.myToast as any).success(
                    "Cập nhật",
                    `Đã chuyển văn bản ID: ${this.selectedDoc.id} sang ${newVisibility}`
                );
            } catch (e: any) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${e.response?.data || e.detail}`
                );
                console.error("Lỗi cập nhật văn bản:", e);
            }
        },
        prevPage() { if (this.currentPage > 1) this.currentPage--; },
        goToPage(p: number) {
            this.currentPage = p;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        async viewDetail(doc: Doc) {
            this.isDetailLoading = true;
            this.selectedDoc = null;
            this.isEditing = false;
            try {
                const [detailRes, attachRes] = await Promise.all([
                    getDocumentDetail(Number(doc.id)),
                    fetchAttachmentsByDoc(doc.id)
                ]);
                const lastAttachment = attachRes.data.length > 0 ? attachRes.data[attachRes.data.length - 1] : null;
                this.selectedDoc = {
                    ...detailRes.data,
                    attachments: lastAttachment,
                };
                this.pendingLinks = [];
                await this.fetchExistingLinks(Number(doc.id));
            } catch (e: any) {
                console.error("Lỗi lấy thông tin văn bản", e);
                this.pendingLinks = [];
            } finally {
                this.isDetailLoading = false;
            }
        },
        async fetchExistingLinks(docId: number) {
            try {
                const res = await getDocumentLinks(docId);
                this.existingLinks = res.data;
            } catch (e) {
                console.error("Lỗi lấy danh sách liên kết hiện tại:", e);
            }
        },
        addLinkRow() {
            this.pendingLinks.push({ target_doc_number: "", link_type: "auto" });
        },
        removeLinkRow(index: number) {
            this.pendingLinks.splice(index, 1);
        },
        async handleDeleteLink(linkId: number) {
            const confirmStore = useConfirmStore();
            const isConfirmed = await confirmStore.open("Bạn có chắc chắn muốn xóa liên kết này?");
            if (!isConfirmed) return;
            try {
                await deleteDocumentLink(linkId);
                this.existingLinks = this.existingLinks.filter(l => l.id !== linkId);
                (this.$refs.myToast as any).success("Thành công", "Đã xóa liên kết.");
            } catch (e) {
                (this.$refs.myToast as any).error("Lỗi", "Không thể xóa liên kết.");
            }
        },
        startEditing() { 
            if (!this.selectedDoc) return; 
            this.isEditing = true; 
            this.editForm = { ...this.selectedDoc }; 
            this.pendingLinks = []; 
        },
        cancelEditing() { 
            this.isEditing = false; 
            this.editForm = {}; 
            this.pendingLinks = []; 
        },
        goBack() {
            this.cancelEditing();
            this.selectedDoc = null;
            this.getDocuments();
        },
        async saveDocChanges() {
            if (!this.selectedDoc) return;
            (this.$refs.loadingRef as any).show();
            try {
                const res = await updateDocument(
                    Number(this.selectedDoc.id),
                    this.editForm
                );
                const updatedDoc: Doc = {
                    ...this.selectedDoc,
                    ...this.editForm,
                };

                const index = this.docs.findIndex(d => d.id === this.selectedDoc!.id);
                if (index !== -1) {
                    this.docs.splice(index, 1, updatedDoc);
                }
                this.selectedDoc = updatedDoc;
                
                // Save all pending links
                if (this.pendingLinks.length > 0) {
                    const promises = this.pendingLinks
                        .filter(l => l.target_doc_number.trim())
                        .map(l => createDocumentLink({
                            source_doc_id: Number(this.selectedDoc!.id),
                            target_doc_number: l.target_doc_number,
                            link_type: l.link_type
                        }));
                    
                    if (promises.length > 0) {
                        try {
                            await Promise.all(promises);
                            await this.fetchExistingLinks(Number(this.selectedDoc.id));
                        } catch (e: any) {
                             (this.$refs.myToast as any).error("Lỗi liên kết", "Một hoặc nhiều liên kết không thể khởi tạo.");
                        }
                    }
                }

                (this.$refs.myToast as any).success(
                    "Cập nhật",
                    `${res.data?.message} ${this.selectedDoc.doc_number}`
                );
            } catch (e: any) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${e.response?.data || e.detail}`
                );
                console.error("Lỗi cập nhật văn bản:", e);
            } finally {
                this.isEditing = false;
                this.pendingLinks = [];
                (this.$refs.loadingRef as any).hide();
            }
        },
        async handleDeleteDocument(docId: number) {
            const confirmStore = useConfirmStore();
            const isConfirmed = await confirmStore.open("Bạn có chắc chắn muốn xoá document này?");
            if (!isConfirmed) return;
            try {
                await deleteDocument(docId);
                const index = this.docs.findIndex(d => d.id === docId);
                if (index !== -1) {
                    this.docs.splice(index, 1);
                }
                (this.$refs.myToast as any).success(
                    "Xoá",
                    `Xoá thành công văn bản ID: ${docId}`
                );
            } catch (error) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${error}`
                );
            }
        },
        async updateStatus(newStatus: string) {
            if (!this.selectedDoc) return;
            (this.$refs.loadingRef as any).show();
            try {
                this.selectedDoc.status = newStatus;
                await updateDocument(
                    Number(this.selectedDoc.id),
                    { status: newStatus }
                );
                (this.$refs.myToast as any).success(
                    "Cập nhật",
                    `Đã ${newStatus} văn bản ID: ${this.selectedDoc.id}`
                );
            } catch (e: any) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `${e.response?.data || e.detail}`
                );
                console.error("Lỗi cập nhật văn bản:", e);
            } finally {
                (this.$refs.loadingRef as any).hide();
            }
        },
        async getDocuments() {
            try {
                const res = await fetchDocuments();
                this.docs = res.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách văn bản:", error);
            }
        },
        async doDownloadFile() {
            const att = this.selectedDoc?.attachments;
            if (!att || !att.file_base64) {
                (this.$refs.myToast as any).error(
                    "Lỗi",
                    `Xảy ra lỗi khi yêu cầu tải file xuống`
                );
                return;
            }
            const blob = base64ToBlob(att.file_base64);
            downloadFile(blob, att.filename);
        },

        // NEW LINKING METHODS
        quickAddLink() {
            if (!this.newLink.target_doc_number.trim()) return;
            this.pendingLinks.push({ ...this.newLink });
            this.newLink.target_doc_number = "";
            this.newLink.link_type = "auto";
        },
        async getAiSuggestions() {
            if (!this.selectedDoc) return;
            this.isSuggesting = true;
            this.aiSuggestions = [];
            try {
                const response = await (this as any).$axios.get(`/api/documents/${this.selectedDoc.id}/suggestions/`);
                this.aiSuggestions = response.data;
                if (this.aiSuggestions.length === 0) {
                    (this.$refs.myToast as any).info("Thông báo", "AI không tìm thấy văn bản nào liên quan rõ rệt.");
                } else {
                    (this.$refs.myToast as any).success("Hoàn tất", `AI đã tìm thấy ${this.aiSuggestions.length} văn bản liên quan.`);
                }
            } catch (e) {
                console.error("Lỗi lấy gợi ý AI:", e);
                (this.$refs.myToast as any).error("Lỗi", "Không thể phân tích văn bản lúc này.");
            } finally {
                this.isSuggesting = false;
            }
        },
        addSuggestedLink(docNumber: string) {
            this.pendingLinks.push({ target_doc_number: docNumber, link_type: "auto" });
            // Remove from suggestions list to avoid duplicate add
            this.aiSuggestions = this.aiSuggestions.filter(s => s.doc_number !== docNumber);
            (this.$refs.myToast as any).success("Đã thêm", `Đã thêm văn bản ${docNumber} vào danh sách chờ liên kết.`);
        }
    }
});
</script>
