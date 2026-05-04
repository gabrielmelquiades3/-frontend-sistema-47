new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
    datasets: [{
      label: 'Valor (R$)',
      data: [41220, 455940, 475920, 590970, 388210],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      pointBackgroundColor: '#3b82f6',
      pointRadius: 5, pointHoverRadius: 7,
      tension: 0.4, fill: true, borderWidth: 2.5
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] }, ticks: { font: { size: 11 }, color: '#9ca3af' }, border: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] }, border: { display: false },
        ticks: { font: { size: 11 }, color: '#9ca3af', callback: v => 'R$ ' + (v >= 1000 ? Math.round(v/1000) + 'k' : v) }
      }
    }
  }
});

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

(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────────── */
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

  /* ── State ────────────────────────────────────────────────── */
  let isOpen = false;

  /* ── Bot responses map ────────────────────────────────────── */
  const botResponses = {
    'qual o consumo total?': '📊 O consumo total do período atual é de <strong>4.872 unidades</strong>, representando um aumento de 8% em relação ao mês anterior.',
    'mostrar alertas':       '⚠️ Existem <strong>3 alertas ativos</strong>:<br>• Estoque crítico: Parafuso M6<br>• Vencimento próximo: Lubrificante X<br>• Pedido pendente: Ref. #2047',
    'top materiais':         '🏆 Top 3 materiais mais consumidos:<br>1. Parafuso M6 – 1.240 un.<br>2. Luva nitrílica M – 980 un.<br>3. Fita isolante 19mm – 760 un.',
    'como cadastrar?':       '📋 Para cadastrar um novo material, acesse <strong>Menu → Cadastrar → Novo Material</strong> e preencha o formulário com código, descrição e unidade de medida.',
    'consumo':               '📈 Navegando para a aba <strong>Consumo</strong>. Você pode filtrar por período, setor ou material.',
    'relatórios':            '📄 A aba <strong>Relatórios</strong> oferece exportação em PDF e Excel. Selecione o intervalo e clique em Gerar.',
    'cadastrar':             '➕ Na aba <strong>Cadastrar</strong> você consegue registrar materiais, fornecedores e centros de custo.',
    'materiais':             '📦 Aqui estão listados os <strong>Top Materiais</strong> por consumo. Você pode ordenar e filtrar por categoria.',
  };

  const defaultResponse = '🤖 Entendido! Vou verificar essa informação para você. Em caso de dúvidas específicas, contate o suporte do SISTEMA47.';

  /* ── Utils ────────────────────────────────────────────────── */

  function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function getBotReply(text) {
    const lower = text.toLowerCase().trim();
    for (const [key, val] of Object.entries(botResponses)) {
      if (lower.includes(key)) return val;
    }
    return defaultResponse;
  }

  /* ── Render helpers ───────────────────────────────────────── */

  function createBotAvatar() {
    const av = document.createElement('div');
    av.className = 'message__avatar';
    av.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="20" height="14" rx="3" fill="#1565C0"/>
        <circle cx="8.5" cy="14" r="1.5" fill="white"/>
        <circle cx="15.5" cy="14" r="1.5" fill="white"/>
        <rect x="7" y="3" width="2" height="4" rx="1" fill="#1565C0"/>
        <rect x="15" y="3" width="2" height="4" rx="1" fill="#1565C0"/>
        <rect x="9" y="17" width="6" height="1.5" rx="0.75" fill="white"/>
      </svg>`;
    return av;
  }

  function appendUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'message message--user';

    const bubble = document.createElement('div');
    bubble.className = 'message__bubble';
    bubble.innerHTML = `${escapeHtml(text)}<span class="message__time">${getTime()}</span>`;

    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    scrollToBottom();
  }

  function appendTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'message typing-indicator';
    wrap.id = 'typingIndicator';

    const av = createBotAvatar();
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';

    wrap.appendChild(av);
    wrap.appendChild(dots);
    messages.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function appendBotMessage(html) {
    const wrap = document.createElement('div');
    wrap.className = 'message message--bot';

    const av = createBotAvatar();
    const bubble = document.createElement('div');
    bubble.className = 'message__bubble';
    bubble.innerHTML = `${html}<span class="message__time">${getTime()}</span>`;

    wrap.appendChild(av);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    scrollToBottom();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ── Send logic ───────────────────────────────────────────── */

  function sendMessage(text) {
    text = text.trim();
    if (!text) return;

    // hide quick replies after first message
    quickReplies.style.display = 'none';

    appendUserMessage(text);
    input.value = '';
    input.focus();

    const delay = 700 + Math.random() * 600;
    const typing = appendTyping();

    setTimeout(() => {
      typing.remove();
      appendBotMessage(getBotReply(text));
    }, delay);
  }

  /* ── Toggle open/close ────────────────────────────────────── */

  function openWidget() {
    isOpen = true;
    widget.classList.add('is-visible');
    widget.setAttribute('aria-hidden', 'false');
    fab.classList.add('is-open');
    fabBadge.classList.add('hidden');
    input.focus();
  }

  function closeWidget() {
    isOpen = false;
    widget.classList.remove('is-visible');
    widget.setAttribute('aria-hidden', 'true');
    fab.classList.remove('is-open');
  }

  function toggleWidget() {
    isOpen ? closeWidget() : openWidget();
  }

  /* ── Nav tabs ─────────────────────────────────────────────── */

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabKey = tab.dataset.tab;
      const labelMap = {
        consumo:   'consumo',
        materiais: 'materiais',
        cadastrar: 'cadastrar',
        relatorios:'relatórios',
      };
      sendMessage(labelMap[tabKey] || tabKey);
    });
  });

  /* ── Quick replies ────────────────────────────────────────── */

  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.dataset.msg);
    });
  });

  /* ── Events ───────────────────────────────────────────────── */

  fab.addEventListener('click', toggleWidget);
  closeBtn.addEventListener('click', closeWidget);

  sendBtn.addEventListener('click', () => sendMessage(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  /* close on outside click */
  document.addEventListener('click', (e) => {
    if (isOpen && !widget.contains(e.target) && !fab.contains(e.target)) {
      closeWidget();
    }
  });

  /* Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeWidget();
  });

  /* ── Init ─────────────────────────────────────────────────── */

  initTime.textContent = getTime();

})();

function fecharPopup() {
  document.getElementById('popupOverlay').style.display = 'none';
}