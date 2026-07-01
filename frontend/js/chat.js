const Chat = {
    init() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendChatBtn');

        if (input && sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    },

    askAboutResult() {
        const input = document.getElementById('chatInput');
        input.value = 'Apa penanganan untuk penyakit ini?';
        this.sendMessage();
    },

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if (!msg) return;

        if (!Diagnosis.currentDiagnosisId) {
            alert('Selesaikan diagnosis terlebih dahulu sebelum chat dengan AI.');
            return;
        }

        this.addUserMessage(msg);
        input.value = '';
        this.addBotMessage('⏳ Sedang memproses...', true);

        try {
            const res = await fetch(`${BASE_URL}/api/chatbot/${Diagnosis.currentDiagnosisId}/kirim/`, {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify({ pertanyaan: msg })
            });

            const data = await res.json();
            this.removeLoading();

            if (!res.ok) {
                this.addBotMessage(data.error || 'Maaf, terjadi kesalahan.');
                return;
            }

            this.addBotMessage(data.jawaban);

        } catch (error) {
            this.removeLoading();
            this.addBotMessage('Maaf, tidak bisa terhubung ke server.');
            console.error(error);
        }
    },

    addUserMessage(text) {
        const container = document.getElementById('chatMessages');
        const placeholder = container.querySelector('.h-full');
        if (placeholder) placeholder.remove();
        container.classList.remove('flex', 'items-center', 'justify-center');

        const div = document.createElement('div');
        div.className = 'chat-bubble bg-green-100 p-2 rounded-lg text-sm text-gray-800 text-right';
        div.innerHTML = `<i class="fas fa-user text-green-600 mr-1"></i> ${text}`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    addBotMessage(text, isLoading = false) {
        const container = document.getElementById('chatMessages');
        const placeholder = container.querySelector('.h-full');
        if (placeholder) placeholder.remove();
        container.classList.remove('flex', 'items-center', 'justify-center');

        const div = document.createElement('div');
        div.className = 'chat-bubble bg-purple-100 p-2 rounded-lg text-sm text-gray-800';
        if (isLoading) div.classList.add('chat-loading');
        div.innerHTML = `<i class="fas fa-robot text-purple-600 mr-1"></i> ${text.replace(/\n/g, '<br>')}`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },
    removeLoading() {
        const loading = document.querySelector('.chat-loading');
        if (loading) loading.remove();
    }
};

window.Chat = Chat;