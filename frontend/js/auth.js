// =============================================
// AUTH.JS - Authentication Module
// =============================================

const Auth = {
    isRegisterMode: false,

    init() {
        this.setupModal();
        this.setupForm();
        this.setupToggle();
    },

    setupModal() {
        const modal = document.getElementById('authModal');
        const closeBtn = document.getElementById('closeAuthBtn');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    },

    setupForm() {
        document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },

    setupToggle() {
        document.getElementById('authToggleBtn').addEventListener('click', () => {
            this.toggleMode();
        });
    },

    openModal() {
        document.getElementById('authModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        document.getElementById('authModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.resetForm();
    },

    toggleMode() {
        this.isRegisterMode = !this.isRegisterMode;
        const title = document.getElementById('authTitle');
        const toggleText = document.getElementById('authToggleText');
        const toggleBtn = document.getElementById('authToggleBtn');
        const nameField = document.getElementById('nameField');
        const submitBtn = document.querySelector('#authForm button[type="submit"]');

        title.textContent = this.isRegisterMode ? 'Daftar' : 'Login';
        toggleText.textContent = this.isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun?';
        toggleBtn.textContent = this.isRegisterMode ? 'Login' : 'Daftar';
        nameField.classList.toggle('hidden', !this.isRegisterMode);
        submitBtn.textContent = this.isRegisterMode ? 'Daftar' : 'Login';
    },

    resetForm() {
        document.getElementById('authForm').reset();
        document.getElementById('nameField').classList.add('hidden');
        this.isRegisterMode = false;
        document.getElementById('authTitle').textContent = 'Login';
        document.getElementById('authToggleText').textContent = 'Belum punya akun?';
        document.getElementById('authToggleBtn').textContent = 'Daftar';
        document.querySelector('#authForm button[type="submit"]').textContent = 'Login';
    },

    async handleSubmit() {
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const name = document.getElementById('authName').value;

        if (!email || !password) {
            alert('Email dan password wajib diisi!');
            return;
        }
        if (this.isRegisterMode && !name) {
            alert('Nama wajib diisi!');
            return;
        }

        try {
            let res, data;

            if (this.isRegisterMode) {
                res = await fetch(`${BASE_URL}/api/auth/register/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nama: name, email, password })
                });
            } else {
                res = await fetch(`${BASE_URL}/api/auth/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
            }

            data = await res.json();

            if (!res.ok) {
                const msg = data.error || Object.values(data).flat().join(', ') || 'Terjadi kesalahan';
                alert(msg);
                return;
            }

            // Simpan token & user dari response asli
            saveTokens(data.access, data.refresh);
            App.setUser({ id: data.user.id_user, name: data.user.nama, email: data.user.email, role: data.user.role });

            this.closeModal();
            alert(this.isRegisterMode ? 'Registrasi berhasil!' : 'Login berhasil!');
            App.loadPage('dashboard');

        } catch (error) {
            alert('Tidak bisa terhubung ke server. Pastikan backend sudah jalan.');
            console.error(error);
        }
    },

    async logout() {
        if (!confirm('Apakah Anda yakin ingin logout?')) return;

        try {
            await fetch(`${BASE_URL}/api/auth/logout/`, {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify({ refresh: getRefreshToken() })
            });
        } catch (e) {}

        App.clearUser();
        alert('Anda telah logout.');
        Auth.openModal();
    }
};

// Initialize Auth
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Expose to global
window.Auth = Auth;