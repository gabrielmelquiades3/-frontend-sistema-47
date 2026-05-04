document.addEventListener('DOMContentLoaded', () => {    
    // 1. Configuração do Gráfico de Barras
    const barChartCanvas = document.getElementById('barChart');
    if (barChartCanvas) {
        new Chart(barChartCanvas, {
            type: 'bar',
            data: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
                datasets: [{
                    label: 'Consumo (R$)',
                    data: [41220, 455940, 475920, 590970, 388210],
                    backgroundColor: '#1e50ff',
                    borderRadius: 5
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // 2. Configuração do Gráfico de Pizza
    const pieChartCanvas = document.getElementById('pieChart');
    if (pieChartCanvas) {
        new Chart(pieChartCanvas, {
            type: 'pie',
            data: {
                labels: ['Produção', 'Gerência Admin', 'Manutenção', 'Logística'],
                datasets: [{
                    data: [79.3, 11, 6.1, 2.5],
                    backgroundColor: ['#1e50ff', '#8e44ad', '#2ecc71', '#f39c12'],
                    borderWidth: 0
                }]
            },
            options: { maintainAspectRatio: false }
        });
    }

    // 3. Popular Ranking de Materiais
  const rankingList = document.getElementById('rankingList');
if (rankingList) {
    const materiais = [
        { id: '10310156', mat: 'Material 4', valor: 'R$ 1.133.370', rank: 1, classe: 'badge-1' },
        { id: '10310155', mat: 'Material 3', valor: 'R$ 414.780', rank: 2, classe: 'badge-2' },
        { id: '14253152', mat: 'Material 9', valor: 'R$ 167.280', rank: 3, classe: 'badge-3' }
    ];

    rankingList.innerHTML = materiais.map(item => `
        <div class="ranking-item">
            <div class="ranking-info">
                <div class="ranking-badge ${item.classe}">${item.rank}</div>
                <div class="ranking-text"><strong>${item.id}</strong>${item.mat}</div>
            </div>
            <div class="ranking-value">${item.valor}</div>
        </div>
    `).join('');
}
    // 4. Popular Tabela Semanal (Ajustado para o visual Bonito)
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        const dadosTabela = [
            { sem: 'Semana 1', qtd: '1.312', valor: 'R$ 41.220', var: '-', tend: 'Base', classe: 'badge-base', icone: '' },
            { sem: 'Semana 2', qtd: '13.019', valor: 'R$ 455.940', var: '+1006%', tend: 'Alta', classe: 'badge-alta', icone: '↑ ' },
            { sem: 'Semana 3', qtd: '13.121', valor: 'R$ 475.920', var: '+4.4%', tend: 'Alta', classe: 'badge-alta', icone: '↑ ' },
            { sem: 'Semana 5', qtd: '11.465', valor: 'R$ 388.210', var: '-34.3%', tend: 'Baixa', classe: 'badge-baixa', icone: '↓ ' }
        ];

        tableBody.innerHTML = dadosTabela.map(row => `
            <tr>
                <td>${row.sem}</td>
                <td>${row.qtd}</td>
                <td style="color:#1e50ff; font-weight:600">${row.valor}</td>
                <td class="${row.var.includes('+') ? 'text-green' : (row.var === '-' ? '' : 'text-red')}">${row.var}</td>
                <td>
                    <span class="badge ${row.classe}">
                        ${row.icone}${row.tend}
                    </span>
                </td>
            </tr>
        `).join('');
    }
});



// --- LÓGICA DO PAINEL DE NOTIFICAÇÕES INTERATIVO ---

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


