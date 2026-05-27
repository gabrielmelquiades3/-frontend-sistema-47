let bancoDeDados = []; // Agora começa vazio, aguardando o banco de dados!
let dadosFiltrados = [];
let paginaAtual = 1;
const itensPorPagina = 10;

const tableBody = document.getElementById('tableBody');
const paginationControls = document.getElementById('paginationControls');

// 1. NOVA FUNÇÃO: Vai no Backend buscar os dados reais
async function carregarDadosDoBanco() {
    try {
        // Conecta na rota que os meninos do Backend criaram (localhost:5000)
        const resposta = await fetch('http://127.0.0.1:5000/api/custos');
        const dadosReais = await resposta.json();

        // 2. MAPEAMENTO: Traduz os dados do MySQL para o formato que a tabela entende
        bancoDeDados = dadosReais.map(item => {
            // O MySQL de vocês formata o valor como texto (ex: "R$ 5.000,00"). 
            // Esse bloco limpa o texto para transformar em número puro (5000.00) para o JavaScript conseguir somar
            let valorNumerico = 0;
            if (typeof item.VALOR === 'string') {
                valorNumerico = parseFloat(item.VALOR.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
            } else if (item.valor) {
                valorNumerico = parseFloat(item.valor);
            }

            return {
                semana: "Sem 1", // Como a view atual não retorna semana, usamos um placeholder
                gerencia: item.CATEGORIA || "Geral", // Ligamos Categoria na coluna Gerência
                area: item.USUÁRIO || "Área Operacional", // Quem lançou fica na coluna Área
                material: item.ID ? String(item.ID).padStart(8, '0') : "00000000",
                desc: item.LANÇAMENTO || item.descricao || "Item sem descrição",
                qtd: "1 UN", // A view atual não retorna quantidade, colocamos um padrão
                valor: isNaN(valorNumerico) ? 0 : valorNumerico,
                data: item.DATA || item.data_lancamento || "01/01/2026"
            };
        });

        // Copia os dados que chegaram para a variável de filtro e manda desenhar a tela
        dadosFiltrados = [...bancoDeDados];
        renderTable();

    } catch (erro) {
        console.error("Erro ao conectar com o Backend:", erro);
        // Fallback: Se o banco/Flask estiver desligado, avisa o usuário
        alert("Não foi possível buscar os dados. Verifique se o Backend (Flask) está rodando na porta 5000!");
    }
}

// 3. FUNÇÕES DE RENDERIZAÇÃO E PAGINAÇÃO (Mantidas iguais ao seu design)
function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = "";
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosExibidos = dadosFiltrados.slice(inicio, fim);

    dadosExibidos.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td><span class="sem-tag">${item.semana}</span></td>
                <td>${item.gerencia.replace("Gerência de ", "")}</td>
                <td>${item.area}</td>
                <td><strong>${item.material}</strong><br><small style="color:gray">${item.desc}</small></td>
                <td><strong>${item.qtd}</strong></td>
                <td class="price-blue">R$ ${item.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td>${item.data}</td>
                <td>
                    <button class="btn-edit"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn-delete"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            </tr>
        `;
    });
    updateUI();
}

function updateUI() {
    const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
    const countEl = document.getElementById('countText');
    const pageEl = document.getElementById('pageIndicator');
    const pagTextEl = document.getElementById('paginationText');

    if (countEl) countEl.innerText = `${dadosFiltrados.length} registro(s) encontrado(s)`;
    if (pageEl) pageEl.innerText = `Página ${paginaAtual} de ${totalPaginas || 1}`;
    
    const de = dadosFiltrados.length > 0 ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
    const ate = Math.min(paginaAtual * itensPorPagina, dadosFiltrados.length);
    if (pagTextEl) pagTextEl.innerText = `Mostrando ${de} a ${ate} de ${dadosFiltrados.length} registros`;

    let html = `<button class="page-nav" onclick="irParaPagina(${paginaAtual - 1})" ${paginaAtual === 1 ? 'disabled' : ''}>Anterior</button>`;
    for (let i = 1; i <= totalPaginas; i++) {
        html += `<button class="page-num ${i === paginaAtual ? 'active' : ''}" onclick="irParaPagina(${i})">${i}</button>`;
    }
    html += `<button class="page-nav" onclick="irParaPagina(${paginaAtual + 1})" ${paginaAtual === totalPaginas || totalPaginas === 0 ? 'disabled' : ''}>Próxima</button>`;
    if (paginationControls) paginationControls.innerHTML = html;
}

window.irParaPagina = (n) => {
    paginaAtual = n;
    renderTable();
};

// 4. FUNÇÕES DE FILTRO (Mantidas iguais)
window.limparFiltros = () => {
    document.getElementById('searchInput').value = "";
    document.getElementById('selGerencia').value = "Todas";
    document.getElementById('selArea').value = "Todas";
    document.getElementById('selPeriodo').value = "Todos";
    aplicarFiltros();
};

function aplicarFiltros() {
    const busca = document.getElementById('searchInput').value.toLowerCase();
    const gerencia = document.getElementById('selGerencia').value;
    const area = document.getElementById('selArea').value;
    const periodo = document.getElementById('selPeriodo').value;

    const mesesMap = { "Jan": "01", "Fev": "02", "Mar": "03", "Abr": "04" };

    dadosFiltrados = bancoDeDados.filter(item => {
        const matchBusca = item.material.includes(busca) || item.desc.toLowerCase().includes(busca);
        const matchGer = gerencia === "Todas" || item.gerencia === gerencia;
        const matchArea = area === "Todas" || item.area === area;
        
        let matchPer = true;
        if (periodo !== "Todos") {
            const [mesNome, ano] = periodo.split('/');
            const dataProcurada = `${mesesMap[mesNome]}/${ano}`;
            matchPer = item.data.includes(dataProcurada);
        }
        
        return matchBusca && matchGer && matchArea && matchPer;
    });

    paginaAtual = 1;
    renderTable();
}

// 5. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    ['searchInput', 'selGerencia', 'selArea', 'selPeriodo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', aplicarFiltros);
    });
    
    // IMPORTANTE: Em vez de desenhar a tabela direto, ele vai no Banco primeiro!
    carregarDadosDoBanco();
});