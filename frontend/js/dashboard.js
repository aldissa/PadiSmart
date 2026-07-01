const Dashboard = {
    render(container) {
        container.innerHTML = `
            <div class="gradient-bg rounded-2xl p-6 md:p-10 text-white mb-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold">Selamat Datang di PadiSmart 🌾</h1>
                        <p class="text-green-100 mt-1 max-w-xl">Sistem Pakar Diagnosis Hama & Penyakit Tanaman Padi dengan Metode Certainty Factor</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="App.loadPage('diagnosis')" class="bg-white text-green-700 px-5 py-2 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2">
                            <i class="fas fa-stethoscope"></i> Mulai Diagnosis
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 card-hover">
                    <div class="flex items-center gap-3">
                        <div class="bg-green-100 p-3 rounded-lg"><i class="fas fa-bug text-green-600 text-xl"></i></div>
                        <div><p class="text-sm text-gray-500">Total Penyakit</p><p class="text-2xl font-bold" id="statPenyakit">—</p></div>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 card-hover">
                    <div class="flex items-center gap-3">
                        <div class="bg-blue-100 p-3 rounded-lg"><i class="fas fa-list-ul text-blue-600 text-xl"></i></div>
                        <div><p class="text-sm text-gray-500">Total Gejala</p><p class="text-2xl font-bold" id="statGejala">—</p></div>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 card-hover">
                    <div class="flex items-center gap-3">
                        <div class="bg-purple-100 p-3 rounded-lg"><i class="fas fa-robot text-purple-600 text-xl"></i></div>
                        <div><p class="text-sm text-gray-500">Chatbot AI</p><p class="text-2xl font-bold">Gemini</p></div>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 card-hover">
                    <div class="flex items-center gap-3">
                        <div class="bg-orange-100 p-3 rounded-lg"><i class="fas fa-clock text-orange-600 text-xl"></i></div>
                        <div><p class="text-sm text-gray-500">Riwayat Saya</p><p class="text-2xl font-bold" id="historyCount">—</p></div>
                    </div>
                </div>
            </div>

            <!-- Penyakit Paling Sering Terdeteksi (dipindah dari dashboard admin terpisah) -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 class="text-lg font-bold mb-4 flex items-center gap-2"><i class="fas fa-chart-bar text-green-600"></i> Penyakit Paling Sering Terdeteksi</h2>
                <div id="statPenyakitLoading" class="text-center text-gray-400 text-sm py-6">Memuat data...</div>
                <div id="statPenyakitList" class="space-y-3 hidden"></div>
            </div>

            <!-- Recent Diagnoses (real data dari riwayat user) -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 class="text-lg font-bold mb-4 flex items-center gap-2"><i class="fas fa-notes-medical text-green-600"></i> Diagnosa Terbaru Saya</h2>
                <div class="space-y-3" id="recentDiagnoses">
                    <div class="text-center text-gray-400 text-sm py-4">Memuat data...</div>
                </div>
            </div>
        `;

        this.loadStats();
        this.loadPenyakitTerbanyak();
        this.loadRecentDiagnoses();
    },

    async loadStats() {
        try {
            const res = await fetch(`${BASE_URL}/api/pengetahuan/statistik/summary/`);
            const data = await res.json();
            document.getElementById('statPenyakit').textContent = data.total_penyakit;
            document.getElementById('statGejala').textContent = data.total_gejala;
        } catch (e) { console.error(e); }

        // Riwayat diagnosis milik user yang login
        if (App.isLoggedIn) {
            try {
                const res = await fetch(`${BASE_URL}/api/diagnosis/riwayat/`, { headers: authHeader() });
                const data = await res.json();
                document.getElementById('historyCount').textContent = data.length;
            } catch (e) { console.error(e); }
        } else {
            document.getElementById('historyCount').textContent = '0';
        }
    },

    async loadPenyakitTerbanyak() {
        try {
            const res = await fetch(`${BASE_URL}/api/pengetahuan/statistik/penyakit/`);
            const data = await res.json();

            document.getElementById('statPenyakitLoading').classList.add('hidden');
            const list = document.getElementById('statPenyakitList');
            list.classList.remove('hidden');

            if (!data.length) {
                list.innerHTML = `<p class="text-sm text-gray-400 text-center py-4">Belum ada data diagnosis.</p>`;
                return;
            }

            const max = Math.max(...data.map(d => d.total));
            const colors = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626'];

            list.innerHTML = data.slice(0, 5).map((item, i) => {
                const pct = Math.round((item.total / max) * 100);
                return `
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-sm text-gray-600 font-medium">${item.nama_penyakit}</span>
                            <span class="text-sm font-bold" style="color:${colors[i % colors.length]}">${item.total}×</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2.5">
                            <div class="h-2.5 rounded-full" style="width:${pct}%; background:${colors[i % colors.length]}"></div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (e) {
            document.getElementById('statPenyakitLoading').textContent = 'Gagal memuat data.';
            console.error(e);
        }
    },

    async loadRecentDiagnoses() {
        const container = document.getElementById('recentDiagnoses');

        if (!App.isLoggedIn) {
            container.innerHTML = `<p class="text-sm text-gray-400 text-center py-4">Login untuk melihat riwayat diagnosis Anda.</p>`;
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/diagnosis/riwayat/`, { headers: authHeader() });
            const data = await res.json();

            if (!data.length) {
                container.innerHTML = `<p class="text-sm text-gray-400 text-center py-4">Belum ada riwayat diagnosis.</p>`;
                return;
            }

            container.innerHTML = data.slice(0, 5).map(d => {
                const top = d.hasil && d.hasil.length ? d.hasil[0] : null;
                if (!top) return '';
                const cfPercent = Math.round(top.cf_final * 100);
                return `
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <span class="font-medium">${top.penyakit.nama_penyakit}</span>
                            <span class="text-sm text-gray-500"> - CF: ${cfPercent}%</span>
                        </div>
                        <span class="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            ${new Date(d.tanggal).toLocaleDateString('id-ID')}
                        </span>
                    </div>
                `;
            }).join('');
        } catch (e) {
            container.innerHTML = `<p class="text-sm text-red-400 text-center py-4">Gagal memuat riwayat.</p>`;
            console.error(e);
        }
    }
};

window.Dashboard = Dashboard;