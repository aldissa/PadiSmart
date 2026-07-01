const Diagnosis = {
    symptoms: [],
    selectedSymptoms: {},  // { kode_gejala: cf_user }
    currentDiagnosisId: null,

    async render(container) {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-2 text-gray-800">🧠 Diagnosis Hama & Penyakit</h2>
            <p class="text-gray-500 mb-6">Pilih gejala yang dirasakan pada tanaman padi Anda, lalu submit untuk melihat hasil diagnosa.</p>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                <!-- Kolom Kiri: Pilih Gejala -->
                <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col" style="min-height: 600px;">
                    <h3 class="font-semibold text-lg mb-1 flex items-center gap-2">
                        <i class="fas fa-check-circle text-green-600"></i> Pilih Gejala
                    </h3>
                    <p class="text-xs text-gray-400 mb-4">
                        <span id="selectedCount">0</span> gejala dipilih
                    </p>

                    <div class="flex-1 overflow-y-auto pr-1" style="max-height: 460px;">
                        <div id="symptomList" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <p class="text-sm text-gray-400 text-center py-4 col-span-2">Memuat gejala...</p>
                        </div>
                    </div>

                    <button id="submitDiagnosisBtn" class="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                        <i class="fas fa-stethoscope"></i> Submit Diagnosis
                    </button>
                </div>

                <!-- Kolom Kanan: Hasil + Chat -->
                <div class="flex flex-col gap-6" style="min-height: 600px;">

                    <div id="resultCard" class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hidden result-card">
                        <h3 class="font-semibold text-lg flex items-center gap-2"><i class="fas fa-file-medical text-green-600"></i> Hasil Diagnosis</h3>
                        <div id="resultContent" class="mt-2 text-sm"></div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col flex-1">
                        <h3 class="font-semibold text-lg flex items-center gap-2 mb-3">
                            <i class="fas fa-robot text-purple-600"></i> Konsultasi AI
                        </h3>
                        <div id="chatMessages" class="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2 text-sm mb-3" style="min-height: 320px; max-height: 420px;">
                            <div class="h-full flex items-center justify-center text-center text-gray-400 text-xs px-4">
                                Selesaikan diagnosis terlebih dahulu untuk mulai konsultasi
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" id="chatInput" placeholder="Tanyakan tentang hasil..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                            <button id="sendChatBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex-shrink-0">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.selectedSymptoms = {};
        this.currentDiagnosisId = null;
        await this.loadSymptoms();
        this.setupEvents();
        Chat.init();
    },

    async loadSymptoms() {
        try {
            const res = await fetch(`${BASE_URL}/api/pengetahuan/gejala/`);
            this.symptoms = await res.json();
            this.renderSymptoms();
        } catch (e) {
            document.getElementById('symptomList').innerHTML = `<p class="text-sm text-red-400 text-center py-4 col-span-2">Gagal memuat gejala. Pastikan server berjalan.</p>`;
            console.error(e);
        }
    },

    renderSymptoms() {
        const list = document.getElementById('symptomList');
        list.innerHTML = this.symptoms.map(s => `
            <div class="symptom-card border border-gray-100 rounded-lg p-2.5 hover:border-green-300 hover:bg-green-50/30 transition" data-kode="${s.kode_gejala}">
                <label class="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" value="${s.kode_gejala}" class="symptom-checkbox symptom-check mt-0.5 flex-shrink-0" />
                    <span class="text-sm leading-snug">${s.nama_gejala}</span>
                </label>
                <div class="cf-slider-wrap hidden mt-2 pl-6" data-kode="${s.kode_gejala}">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs text-gray-400">Tingkat keyakinan</span>
                        <span class="cf-display text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">0.6</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.2" value="0.6" class="w-full accent-green-600 cf-slider h-1.5" />
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.symptom-check').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const kode = e.target.value;
                const card = e.target.closest('.symptom-card');
                const wrap = card.querySelector('.cf-slider-wrap');

                if (e.target.checked) {
                    wrap.classList.remove('hidden');
                    card.classList.add('border-green-400', 'bg-green-50/50');
                    const sliderVal = wrap.querySelector('.cf-slider').value;
                    this.selectedSymptoms[kode] = parseFloat(sliderVal);
                } else {
                    wrap.classList.add('hidden');
                    card.classList.remove('border-green-400', 'bg-green-50/50');
                    delete this.selectedSymptoms[kode];
                }
                this.updateSelectedCount();
            });
        });

        document.querySelectorAll('.cf-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const wrap = e.target.closest('.cf-slider-wrap');
                const kode = wrap.dataset.kode;
                const val = parseFloat(e.target.value);
                wrap.querySelector('.cf-display').textContent = val.toFixed(1);
                this.selectedSymptoms[kode] = val;
            });
        });
    },

    updateSelectedCount() {
        const countEl = document.getElementById('selectedCount');
        if (countEl) countEl.textContent = Object.keys(this.selectedSymptoms).length;
    },

    setupEvents() {
        document.getElementById('submitDiagnosisBtn').addEventListener('click', () => {
            this.submitDiagnosis();
        });
    },

    async submitDiagnosis() {
        if (!App.isLoggedIn) {
            alert('Silakan login terlebih dahulu untuk melakukan diagnosis.');
            Auth.openModal();
            return;
        }

        const kodeList = Object.keys(this.selectedSymptoms);
        if (kodeList.length === 0) {
            alert('Pilih minimal satu gejala!');
            return;
        }

        const submitBtn = document.getElementById('submitDiagnosisBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

        try {
            const gejalaPayload = kodeList.map(kode => ({
                kode_gejala: kode,
                cf_user: this.selectedSymptoms[kode]
            }));

            const res = await fetch(`${BASE_URL}/api/diagnosis/submit/`, {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify({ gejala: gejalaPayload })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Gagal melakukan diagnosis');
                return;
            }

            this.currentDiagnosisId = data.id_diagnosis;
            this.showResult(data);

            document.getElementById('chatMessages').innerHTML = `
                <div class="h-full flex items-center justify-center text-center text-gray-400 text-xs px-4">
                    Diagnosis selesai! Silakan tanya lebih lanjut ke AI
                </div>
            `;

        } catch (error) {
            alert('Tidak bisa terhubung ke server.');
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-stethoscope"></i> Submit Diagnosis';
        }
    },

    showResult(diagnosisData) {
        const card = document.getElementById('resultCard');
        const content = document.getElementById('resultContent');

        if (!diagnosisData.hasil || diagnosisData.hasil.length === 0) {
            card.classList.remove('hidden');
            content.innerHTML = `<p class="text-gray-500">Tidak ditemukan penyakit yang cocok dengan gejala yang dipilih.</p>`;
            return;
        }

        const top = diagnosisData.hasil[0];
        const cfPercent = Math.round(top.cf_final * 100);

        card.classList.remove('hidden');
        content.innerHTML = `
            <p class="font-bold text-lg text-green-700">${top.penyakit.nama_penyakit}</p>
            <p class="text-gray-600">Tingkat Keyakinan (CF): <span class="font-semibold">${cfPercent}%</span></p>
            <p class="text-sm text-gray-500 mt-2">${top.penyakit.deskripsi || ''}</p>

            ${diagnosisData.hasil.length > 1 ? `
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <p class="text-xs text-gray-400 mb-1">Kemungkinan lain:</p>
                    ${diagnosisData.hasil.slice(1, 3).map(h => `
                        <p class="text-xs text-gray-500">• ${h.penyakit.nama_penyakit} (${Math.round(h.cf_final * 100)}%)</p>
                    `).join('')}
                </div>
            ` : ''}

            <button onclick="Chat.askAboutResult()" 
                    class="mt-3 text-sm text-purple-600 hover:underline flex items-center gap-1">
                <i class="fas fa-robot"></i> Tanyakan ke AI
            </button>
        `;
    }
};

window.Diagnosis = Diagnosis;