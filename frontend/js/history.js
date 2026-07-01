// =============================================
// HISTORY.JS - Riwayat Diagnosis Module
// =============================================

const History = {
    histories: [],
    expandedId: null,

    async render(container) {
        container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <i class="fas fa-history text-green-600"></i> Riwayat Diagnosis
                </h2>
                <p class="text-gray-500 mt-1">Semua sesi diagnosis yang pernah Anda lakukan.</p>
            </div>

            <div id="historyContainer" class="space-y-4">
                <div class="text-center text-gray-400 py-10">
                    <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                    <p>Memuat riwayat...</p>
                </div>
            </div>
        `;

        await this.loadHistories();
    },

    async loadHistories() {
        const container = document.getElementById('historyContainer');

        if (!App.isLoggedIn) {
            container.innerHTML = `
                <div class="bg-white rounded-xl border border-gray-100 p-10 text-center">
                    <i class="fas fa-lock text-gray-300 text-4xl mb-3"></i>
                    <p class="text-gray-500">Silakan login untuk melihat riwayat diagnosis Anda.</p>
                    <button onclick="Auth.openModal()" class="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
                        Login Sekarang
                    </button>
                </div>
            `;
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/diagnosis/riwayat/`, { headers: authHeader() });
            const data = await res.json();

            if (!res.ok) {
                container.innerHTML = `<p class="text-center text-red-400 py-10">Gagal memuat riwayat.</p>`;
                return;
            }

            this.histories = data;
            this.renderList();

        } catch (e) {
            container.innerHTML = `<p class="text-center text-red-400 py-10">Tidak bisa terhubung ke server.</p>`;
            console.error(e);
        }
    },

    renderList() {
        const container = document.getElementById('historyContainer');

        if (!this.histories.length) {
            container.innerHTML = `
                <div class="bg-white rounded-xl border border-gray-100 p-10 text-center">
                    <i class="fas fa-seedling text-gray-300 text-4xl mb-3"></i>
                    <p class="text-gray-500">Belum ada riwayat diagnosis.</p>
                    <button onclick="App.loadPage('diagnosis')" class="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
                        <i class="fas fa-stethoscope mr-1"></i> Mulai Diagnosis
                    </button>
                </div>
            `;
            return;
        }

        // Urutkan dari yang terbaru
        const sorted = [...this.histories].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

        container.innerHTML = sorted.map(d => {
            const top = d.hasil && d.hasil.length ? d.hasil[0] : null;
            const isExpanded = this.expandedId === d.id_diagnosis;
            const tanggal = new Date(d.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            if (!top) {
                return `
                    <div class="bg-white rounded-xl border border-gray-100 p-5">
                        <p class="text-gray-400 text-sm">Diagnosis #${d.id_diagnosis} — tidak ada hasil yang cocok</p>
                        <p class="text-xs text-gray-400 mt-1">${tanggal}</p>
                    </div>
                `;
            }

            const cfPercent = Math.round(top.cf_final * 100);
            const cfColor = cfPercent >= 70 ? 'text-green-600 bg-green-100'
                          : cfPercent >= 40 ? 'text-amber-600 bg-amber-100'
                          : 'text-red-600 bg-red-100';

            return `
                <div class="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover">
                    <button onclick="History.toggleExpand(${d.id_diagnosis})" class="w-full text-left p-5 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <div class="bg-green-100 p-3 rounded-lg flex-shrink-0">
                                <i class="fas fa-leaf text-green-600 text-lg"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="font-bold text-gray-800 truncate">${top.penyakit.nama_penyakit}</p>
                                <p class="text-xs text-gray-400 mt-0.5"><i class="far fa-calendar mr-1"></i>${tanggal}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 flex-shrink-0">
                            <span class="text-xs font-bold px-3 py-1 rounded-full ${cfColor}">${cfPercent}%</span>
                            <i class="fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400"></i>
                        </div>
                    </button>

                    ${isExpanded ? `
                        <div class="px-5 pb-5 border-t border-gray-50 pt-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Gejala yang dipilih</p>
                                    <div class="flex flex-wrap gap-1.5">
                                        ${(d.detail || []).map(g => `
                                            <span class="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                                                ${g.nama_gejala} <span class="text-gray-400">(${g.cf_user})</span>
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Hasil Diagnosis</p>
                                    <div class="space-y-1.5">
                                        ${d.hasil.slice(0, 3).map(h => `
                                            <div class="flex justify-between items-center text-sm">
                                                <span class="text-gray-600">${h.penyakit.nama_penyakit}</span>
                                                <span class="font-semibold text-gray-700">${Math.round(h.cf_final * 100)}%</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            ${top.penyakit.penanganan ? `
                                <div class="mt-4 pt-4 border-t border-gray-50">
                                    <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Penanganan</p>
                                    <p class="text-sm text-gray-600">${top.penyakit.penanganan}</p>
                                </div>
                            ` : ''}

                            <button onclick="History.openChat(${d.id_diagnosis})" 
                                    class="mt-4 text-sm text-purple-600 hover:underline flex items-center gap-1">
                                <i class="fas fa-comment-dots"></i> Lanjutkan konsultasi sesi ini
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    toggleExpand(id) {
        this.expandedId = this.expandedId === id ? null : id;
        this.renderList();
    },

    openChat(diagnosisId) {
        Diagnosis.currentDiagnosisId = diagnosisId;
        App.loadPage('diagnosis');
        // Beri jeda agar halaman diagnosis selesai render dulu
        setTimeout(() => {
            const chatBox = document.getElementById('chatMessages');
            if (chatBox) {
                chatBox.innerHTML = `<div class="text-center text-gray-400 text-xs">Melanjutkan sesi diagnosis #${diagnosisId}. Silakan tanya ke AI.</div>`;
            }
        }, 100);
    }
};

window.History = History;