document.addEventListener('DOMContentLoaded', () => {    
    
    // 1. CHAMA O BACKEND E MONTA A IA
    async function carregarIA() {
        try {
            const resposta = await fetch('http://127.0.0.1:5000/api/previsao');
            const dados = await resposta.json();

            // Renderiza Gráfico de Barras com as cores reais e projetadas
            const barChartCanvas = document.getElementById('barChart');
            if (barChartCanvas) {
                new Chart(barChartCanvas, {
                    type: 'bar',
                    data: {
                        labels: dados.labels,
                        datasets: [
                            {
                                label: 'Consumo Real (R$)',
                                data: dados.historico,
                                backgroundColor: '#1e50ff',
                                borderRadius: 5
                            },
                            {
                                label: 'Projeção IA (R$)',
                                data: dados.projecao,
                                backgroundColor: 'rgba(139, 92, 246, 0.65)',
                                borderColor: '#8b5cf6',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                borderRadius: 5
                            }
                        ]
                    },
                    options: {
                        maintainAspectRatio: false,
                        plugins: { legend: { display: true, position: 'top' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }

            // Injeta os Comentários Textuais
            const container = document.getElementById('insightsContainer');
            if (container && dados.insights) {
                container.innerHTML = "";
                dados.insights.forEach(insight => {
                    container.innerHTML += `
                        <div class="insight-block ${insight.classe}">
                            <h3>${insight.titulo}</h3>
                            <p>${insight.texto}</p>
                        </div>
                    `;
                });
            }

        } catch (erro) {
            console.error("Erro na IA:", erro);
            const container = document.getElementById('insightsContainer');
            if (container) {
                container.innerHTML = `<p style="color: red; font-size: 0.85rem;">⚠️ Não foi possível carregar os comentários. Verifique se o Backend (Python) está rodando!</p>`;
            }
        }
    }

    carregarIA();

    // 2. GRÁFICO DE PIZZA (Mantido Intacto)
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

    // 3. RANKING DE MATERIAIS (Mantido Intacto)
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

    // 4. TABELA SEMANAL (Mantido Intacto)
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
                <td><span class="badge ${row.classe}">${row.icone}${row.tend}</span></td>
            </tr>
        `).join('');
    }

    // 5. PAINEL DE NOTIFICAÇÕES (Mantido Intacto)
    const openBtn = document.getElementById('openPanel');
    const closeBtn = document.getElementById('closePanel');
    const panel = document.getElementById('notificationPanel');

    if (openBtn && panel) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = 'block';
        });
    }

    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => panel.style.display = 'none');
    }

    window.addEventListener('click', (event) => {
        if (panel && panel.style.display === 'block' && !panel.contains(event.target) && !openBtn.contains(event.target)) {
            panel.style.display = 'none';
        }
    });
});