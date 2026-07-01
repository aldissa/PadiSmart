// =============================================
// ARTICLES.JS - Referensi Jurnal & Sumber Ilmiah
// =============================================

const Articles = {
    // Data referensi - edit/tambah sesuai sumber yang kamu pakai
    references: [
        {
            title: "Big Data and AI Revolution in Precision Agriculture: Survey and Challenges",
            authors: "Showkat Ahmad Bhat & Nen-Fu Huang",
            year: 2021,
            category: "AI & Big Data",
            description: "Survei mengenai revolusi big data dan AI dalam pertanian presisi beserta tantangan implementasinya, dipublikasikan di IEEE Access.",
            link: "https://ieeexplore.ieee.org/document/9505674/",
            type: "Jurnal Internasional (IEEE)"
        },
        {
            title: "Sistem Pakar Diagnosis Hama dan Penyakit pada Tanaman Padi menggunakan Metode Certainty Factor",
            authors: "Fatur Padilla Hutabarat & Yusuf Ramadhan Nasution",
            year: 2024,
            category: "Metode CF",
            description: "Pengembangan sistem pakar berbasis web menggunakan metode Certainty Factor untuk membantu petani di Kecamatan Barus, Tapanuli Tengah, dengan akurasi 95%.",
            link: "https://ejournal.ust.ac.id/index.php/Jurnal_Means/article/view/3766",
            type: "Jurnal Nasional"
        },
        {
            title: "Implementasi Metode Certainty Factor untuk Mengidentifikasi Penyakit Tanaman Kedelai dan Padi",
            authors: "Puji Karuniawan, Intan Nur Farida, & Julian Suhertian",
            year: 2021,
            category: "Metode CF",
            description: "Penerapan metode Certainty Factor untuk identifikasi penyakit pada dua komoditas tanaman pangan utama, kedelai dan padi, dengan akurasi 93%.",
            link: "https://ojs.unpkediri.ac.id/index.php/noe/article/view/15902",
            type: "Jurnal Nasional"
        },
        {
            title: "A Decision Support System for Sustainable Agriculture and Food Loss Reduction under Uncertain Agricultural Policy Frameworks",
            authors: "Martine J. Barons, Lael E. Walsh, Edward E. Salakpi, & Linda Nichols",
            year: 2024,
            category: "Decision Support System",
            description: "Sistem pendukung keputusan berbasis Bayesian Network untuk pertanian berkelanjutan dan pengurangan kehilangan pangan di bawah kerangka kebijakan yang tidak pasti.",
            link: "https://www.mdpi.com/2077-0472/14/3/458",
            type: "Jurnal Internasional (MDPI)"
        },
        {
            title: "Penerapan Sistem Pakar Diagnosa Penyakit Tanaman Padi Menggunakan Metode Certainty Factor (CF) Pada Dinas Pertanian Kabupaten Pohuwato",
            authors: "Bahrin",
            year: 2022,
            category: "Metode CF",
            description: "Studi penerapan sistem pakar berbasis Certainty Factor untuk diagnosis penyakit tanaman padi pada Dinas Pertanian Kabupaten Pohuwato, diuji dengan White Box Testing.",
            link: "https://www.researchgate.net/publication/394965408_Penerapan_Sistem_Pakar_Diagnosa_Penyakit_Tanaman_Padi_Menggunakan_Metode_Certainty_Factor_CF_Pada_Dinas_Pertanian_Kabupaten_Pohuwato",
            type: "Jurnal Nasional"
        },
        {
            title: "Sistem Pakar Diagnosa Penyakit Tanaman Padi",
            authors: "LucyChaniaAgatha, AnitaDesiani & BambangSuprihatin3",
            year: 2023,
            category: "Sistem Pakar",
            description: "Kajian pengembangan sistem pakar untuk diagnosa penyakit pada tanaman padi berbasis basis pengetahuan pakar pertanian.",
            link: "https://journal.uniga.ac.id/index.php/JPP/article/view/2577",
            type: "Jurnal Nasional"
        },
    ],

    activeFilter: 'Semua',

    render(container) {
        const categories = ['Semua', ...new Set(this.references.map(r => r.category))];

        container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <i class="fas fa-book-open text-green-600"></i> Referensi & Jurnal Ilmiah
                </h2>
                <p class="text-gray-500 mt-1">Kumpulan sumber referensi yang digunakan dalam pengembangan basis pengetahuan PadiSmart.</p>
            </div>

            <!-- Filter Kategori -->
            <div class="flex flex-wrap gap-2 mb-6" id="categoryFilters">
                ${categories.map(cat => `
                    <button class="category-btn px-4 py-1.5 rounded-full text-sm font-medium border transition
                        ${cat === 'Semua' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}"
                        data-category="${cat}">
                        ${cat}
                    </button>
                `).join('')}
            </div>

            <!-- Grid Artikel -->
            <div id="articlesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
        `;

        this.setupFilters();
        this.renderArticles();
    },

    setupFilters() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeFilter = btn.dataset.category;

                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('bg-green-600', 'text-white', 'border-green-600');
                    b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
                });
                btn.classList.add('bg-green-600', 'text-white', 'border-green-600');
                btn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');

                this.renderArticles();
            });
        });
    },

    renderArticles() {
        const grid = document.getElementById('articlesGrid');
        const filtered = this.activeFilter === 'Semua'
            ? this.references
            : this.references.filter(r => r.category === this.activeFilter);

        if (!filtered.length) {
            grid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-10">Tidak ada referensi di kategori ini.</p>`;
            return;
        }

        const typeColors = {
            'Jurnal Internasional': 'bg-blue-100 text-blue-700',
            'Jurnal Nasional': 'bg-amber-100 text-amber-700',
        };

        grid.innerHTML = filtered.map(ref => `
            <a href="${ref.link}" target="_blank" rel="noopener noreferrer"
               class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 card-hover flex flex-col group">
                <div class="flex items-start justify-between mb-3">
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[ref.type] || 'bg-gray-100 text-gray-600'}">
                        ${ref.type}
                    </span>
                    <i class="fas fa-external-link-alt text-gray-300 group-hover:text-green-500 transition text-sm"></i>
                </div>

                <h3 class="font-bold text-gray-800 leading-snug mb-2 group-hover:text-green-700 transition">
                    ${ref.title}
                </h3>

                <p class="text-sm text-gray-500 mb-3 flex-1">${ref.description}</p>

                <div class="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                    <span><i class="fas fa-user-edit mr-1"></i>${ref.authors}</span>
                    <span><i class="fas fa-calendar-alt mr-1"></i>${ref.year}</span>
                </div>

                <span class="mt-2 inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                    ${ref.category}
                </span>
            </a>
        `).join('');
    }
};

window.Articles = Articles;