/* ── GRÁFICO 1: PREDIÇÃO COM INTELIGÊNCIA ARTIFICIAL ── */
async function carregarGraficoPredicao() {
  try {
      const resposta = await fetch('http://127.0.0.1:5000/api/previsao');
      const dados = await resposta.json();

      new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
          labels: dados.labels,
          datasets: [
            {
              label: 'Consumo Real (R$)',
              data: dados.historico,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59,130,246,0.08)',
              pointBackgroundColor: '#3b82f6',
              pointRadius: 5, pointHoverRadius: 7,
              tension: 0.4, fill: true, borderWidth: 2.5
            },
            {
              label: 'Predição IA (R$)',
              data: dados.projecao,
              borderColor: '#8b5cf6', // Roxo (Cor da IA)
              borderDash: [6, 6], // <-- O SEGREDO DA LINHA PONTILHADA
              backgroundColor: 'transparent',
              pointBackgroundColor: '#8b5cf6',
              pointRadius: 5, pointHoverRadius: 7,
              tension: 0.4, fill: false, borderWidth: 2.5
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: true, position: 'top', labels: { font: { size: 11 }, usePointStyle: true } } },
          scales: {
            x: { grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] }, ticks: { font: { size: 11 }, color: '#9ca3af' }, border: { display: false } },
            y: { grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] }, border: { display: false },
              ticks: { font: { size: 11 }, color: '#9ca3af', callback: v => 'R$ ' + (v >= 1000 ? Math.round(v/1000) + 'k' : v) }
            }
          }
        }
      });
  } catch (erro) {
      console.error("Erro ao carregar predição:", erro);
  }
}

// Inicia o gráfico imediatamente
carregarGraficoPredicao();


/* ── OUTROS GRÁFICOS (Mantidos Originais) ── */
new Chart(document.getElementById('barHChart'), {
  type: 'bar',
  data: {
    labels: ['Produção', 'Manutenção', 'Qualidade', 'Logística', 'Gerência\nAdministrativa'],
    datasets: [{ label: 'Valor (R$)', data: [1600000, 120000, 80000, 70000, 90000], backgroundColor: '#22c55e', borderRadius: 4 }]
  },
  options: {
    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] }, border: { display: false },
        ticks: { font: { size: 10 }, color: '#9ca3af', callback: v => 'R$ ' + (v >= 1000 ? Math.round(v/1000) + 'k' : v) }
      },
      y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#374151' } }
    }
  }
});

new Chart(document.getElementById('pieChart'), {
  type: 'doughnut',
  data: {
    labels: ['Produção', 'Manutenção', 'Logística', 'Qualidade', 'Ger. Administrativa'],
    datasets: [{ data: [82, 6, 4, 4, 4], backgroundColor: ['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ef4444'], borderWidth: 2, borderColor: '#fff' }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#6b7280', padding: 12, usePointStyle: true } } },
    cutout: '58%'
  }
});

new Chart(document.getElementById('barDualChart'), {
  type: 'bar',
  data: {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
    datasets: [
      { label: 'Quantidade', data: [1312, 13019, 13121, 16914, 11465], backgroundColor: '#a78bfa', borderRadius: 4, yAxisID: 'y' },
      { label: 'Valor (R$)', data: [41220, 455940, 475920, 590970, 388210], backgroundColor: '#3b82f6', borderRadius: 4, yAxisID: 'y2' }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] }, border: { display: false }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
      y: { position: 'left', grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] }, border: { display: false },
        title: { display: true, text: 'Quantidade', font: { size: 10 }, color: '#9ca3af' },
        ticks: { font: { size: 10 }, color: '#9ca3af', callback: v => (v >= 1000 ? Math.round(v/1000) + 'k' : v) }
      },
      y2: { position: 'right', grid: { display: false }, border: { display: false },
        title: { display: true, text: 'Valor (R$)', font: { size: 10 }, color: '#9ca3af' },
        ticks: { font: { size: 10 }, color: '#9ca3af', callback: v => 'R$ ' + (v >= 1000 ? Math.round(v/1000) + 'k' : v) }
      }
    }
  }
});

/* ── LÓGICA DO CHATBOT E INTERFACE ── */
(function () {
  'use strict';

  const fab         = document.getElementById('fabBtn');
  const fabBadge    = document.getElementById('fabBadge');
  const widget      = document.getElementById('chatWidget');
  const closeBtn    = document.getElementById('chatClose');
  const messages    = document.getElementById('chatMessages');
  const input       = document.getElementById('chatInput');
  const sendBtn     = document.getElementById('sendBtn');
  const quickReplies= document.getElementById('quickReplies');
  const initTime    = document.getElementById('initTime');
  const navTabs     = document.querySelectorAll('.nav-tab');

  let isOpen = false;

  function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  function scrollToBottom() {
    requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
  }

  async function getBotReply(text) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensagem: text })
        });
        const data = await response.json();
        return data.resposta;
    } catch (error) {
        return "🤖 Ops! Servidor Python (Backend) offline. Ligue-o para usar a IA.";
    }
  }

  function createBotAvatar() {
    const av = document.createElement('div');
    av.className = 'message__avatar';
    av.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="3" fill="#1565C0"/><circle cx="8.5" cy="14" r="1.5" fill="white"/><circle cx="15.5" cy="14" r="1.5" fill="white"/><rect x="7" y="3" width="2" height="4" rx="1" fill="#1565C0"/><rect x="15" y="3" width="2" height="4" rx="1" fill="#1565C0"/><rect x="9" y="17" width="6" height="1.5" rx="0.75" fill="white"/></svg>`;
    return av;
  }

  function appendUserMessage(text) {
    const wrap = document.createElement('div'); wrap.className = 'message message--user';
    const bubble = document.createElement('div'); bubble.className = 'message__bubble';
    bubble.innerHTML = `${text}<span class="message__time">${getTime()}</span>`;
    wrap.appendChild(bubble); messages.appendChild(wrap); scrollToBottom();
  }

  function appendTyping() {
    const wrap = document.createElement('div'); wrap.className = 'message typing-indicator';
    const av = createBotAvatar();
    const dots = document.createElement('div'); dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(av); wrap.appendChild(dots); messages.appendChild(wrap); scrollToBottom();
    return wrap;
  }

  function appendBotMessage(html) {
    const wrap = document.createElement('div'); wrap.className = 'message message--bot';
    const av = createBotAvatar();
    const bubble = document.createElement('div'); bubble.className = 'message__bubble';
    bubble.innerHTML = `${html}<span class="message__time">${getTime()}</span>`;
    wrap.appendChild(av); wrap.appendChild(bubble); messages.appendChild(wrap); scrollToBottom();
  }

  async function sendMessage(text) {
    text = text.trim();
    if (!text) return;
    if(quickReplies) quickReplies.style.display = 'none';
    appendUserMessage(text);
    input.value = ''; input.focus();
    
    const typing = appendTyping();
    const respostaDaIA = await getBotReply(text);
    typing.remove();
    appendBotMessage(respostaDaIA);
  }

  function toggleWidget() {
    isOpen = !isOpen;
    if(isOpen) {
      widget.classList.add('is-visible'); widget.setAttribute('aria-hidden', 'false');
      fab.classList.add('is-open'); if(fabBadge) fabBadge.classList.add('hidden');
      input.focus();
    } else {
      widget.classList.remove('is-visible'); widget.setAttribute('aria-hidden', 'true');
      fab.classList.remove('is-open');
    }
  }

  if(navTabs) {
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        navTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
        sendMessage(tab.dataset.tab);
      });
    });
  }

  document.querySelectorAll('.quick-btn').forEach(btn => { btn.addEventListener('click', () => sendMessage(btn.dataset.msg)); });
  if(fab) fab.addEventListener('click', toggleWidget);
  if(closeBtn) closeBtn.addEventListener('click', toggleWidget);
  if(sendBtn) sendBtn.addEventListener('click', () => sendMessage(input.value));
  if(input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
    });
  }

  if(initTime) initTime.textContent = getTime();

})();

function fecharPopup() {
  document.getElementById('popupOverlay').style.display = 'none';
}