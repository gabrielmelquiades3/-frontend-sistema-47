document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DE UPLOAD ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const validCount = document.getElementById('valid-count');
    const warningCount = document.getElementById('warning-count');
    const invalidCount = document.getElementById('invalid-count');

    // --- ELEMENTOS DE NOTIFICAÇÃO ---
    const panel = document.getElementById('notificationPanel');
    const btnOpen = document.getElementById('openPanel');
    const btnClose = document.getElementById('closePanel');
    const badge = document.getElementById('badgeCount');

    // 1. LÓGICA DE CLIQUE E ARRASTAR ARQUIVO
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#4f46e5';
        dropZone.style.background = '#f5f7ff';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ccc';
        dropZone.style.background = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 2. SIMULAÇÃO DE PROCESSAMENTO (Status da Importação)
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            dropZone.querySelector('p').innerText = `Arquivo: ${file.name}`;
            dropZone.querySelector('span').innerText = "Processando dados...";

            // Simulando uma leitura de arquivo após 1.5 segundos
            setTimeout(() => {
                validCount.innerText = Math.floor(Math.random() * 500) + 100;
                warningCount.innerText = Math.floor(Math.random() * 20);
                invalidCount.innerText = Math.floor(Math.random() * 10);
                
                dropZone.querySelector('span').innerText = "Upload concluído!";
            }, 1500);
        }
    }

    // 3. LÓGICA DO PAINEL DE ALERTAS (Notificações)
    const togglePanel = () => panel.classList.toggle('active');

    btnOpen.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
    });

    btnClose.addEventListener('click', () => panel.classList.remove('active'));

    // Fechar painel ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !btnOpen.contains(e.target)) {
            panel.classList.remove('active');
        }
    });

    // 4. AÇÕES DENTRO DAS NOTIFICAÇÕES
    const markReadBtns = document.querySelectorAll('.action-btn.read');
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const alertItem = this.closest('.alert-item');
            alertItem.style.opacity = '0.4';
            alertItem.style.pointerEvents = 'none';
            
            let currentCount = parseInt(badge.innerText);
            if (currentCount > 0) {
                badge.innerText = currentCount - 1;
                document.querySelector('.unread-counter strong').innerText = currentCount - 1;
            }
        });
    });

    // Botão Marcar todos como lidos
    const btnMarkAll = document.querySelector('.btn-mark-all');
    btnMarkAll.addEventListener('click', () => {
        document.querySelectorAll('.alert-item').forEach(item => {
            item.style.opacity = '0.4';
        });
        badge.innerText = '0';
        document.querySelector('.unread-counter strong').innerText = '0';
    });
});



// --- LÓGICA DO PAINEL DE NOTIFICAÇÕES INTERATIVO (Bolinha de notificação) ---

const openBtn = document.getElementById('openPanel');
const closeBtn = document.getElementById('closePanel');
const panel = document.getElementById('notificationPanel');
const badgeCount = document.getElementById('badgeCount');

let currentUnread = 6; // Valor inicial do contador

// Função para atualizar o contador visualmente
function updateCounter(newCount) {
    currentUnread = newCount;
    if (badgeCount) {
        if (currentUnread > 0) {
            badgeCount.innerText = currentUnread;
            badgeCount.style.display = 'flex'; // Garante que apareça
        } else {
            badgeCount.style.display = 'none'; // Esconde se zerar
        }
    }
}

// 1. Ações de Abrir/Fechar o Painel

// Abrir painel
if (openBtn) {
    openBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede o clique de propagar para o window
        panel.style.display = 'block';
    });
}

// Fechar painel no "X"
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
    });
}

// Fechar se clicar fora do painel
window.addEventListener('click', (event) => {
    if (panel.style.display === 'block' && 
        !panel.contains(event.target) && 
        !openBtn.contains(event.target)) {
        panel.style.display = 'none';
    }
});

// 2. Ações Interativas dentro do Alerta

// Manipula cliques nos botões "Marcar como lido" e "Dispensar"
const panelContent = document.querySelector('.panel-content');
if (panelContent) {
    panelContent.addEventListener('click', (e) => {
        const target = e.target;
        
        // Ação: Marcar como lido
        if (target.closest('.action-btn.read')) {
            const alertItem = target.closest('.alert-item');
            if (alertItem) {
                // Diminui o contador e atualiza a badge
                updateCounter(Math.max(0, currentUnread - 1));
                
                // Remove o item (ou poderia aplicar uma classe .read-item)
                alertItem.remove(); 
                
                // Feedback visual temporário (se não remover)
                // alertItem.style.opacity = '0.5';
            }
        }
        
        // Ação: Dispensar (simplesmente remove)
        if (target.closest('.action-btn.dismiss')) {
            const alertItem = target.closest('.alert-item');
            if (alertItem) {
                alertItem.remove();
                // Opcional: Se dispensar também conta como lido, chame updateCounter
                // updateCounter(Math.max(0, currentUnread - 1));
            }
        }
    });
}

// Botão Marcar Todos como Lidos
const markAllBtn = document.querySelector('.btn-mark-all');
if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
        updateCounter(0); // Zera o contador
        const allAlerts = document.querySelectorAll('.alert-item');
        allAlerts.forEach(alert => alert.remove()); // Remove todos os itens
    });
}


