const bancoDeDados = [
    { semana: "Sem 1", gerencia: "Gerência de Produção", area: "Produção - Linha 1", material: "10310156", desc: "Material 4", qtd: "653 CX", valor: 19590.00, data: "02/03/2026" },
    { semana: "Sem 2", gerencia: "Gerência de Produção", area: "Produção - Linha 1", material: "10310156", desc: "Material 4", qtd: "9.728 CX", valor: 291840.00, data: "09/03/2026" },
    { semana: "Sem 3", gerencia: "Gerência de Produção", area: "Produção - Linha 1", material: "10310156", desc: "Material 4", qtd: "8.279 CX", valor: 248370.00, data: "16/03/2026" },
    { semana: "Sem 4", gerencia: "Gerência de Produção", area: "Produção - Linha 1", material: "10310156", desc: "Material 4", qtd: "9.750 CX", valor: 292500.00, data: "23/03/2026" },
    { semana: "Sem 5", gerencia: "Gerência de Produção", area: "Produção - Linha 1", material: "10310156", desc: "Material 4", qtd: "9.369 CX", valor: 281070.00, data: "30/03/2026" },
    { semana: "Sem 1", gerencia: "Gerência de Produção", area: "Produção - Linha 2", material: "10310155", desc: "Material 3", qtd: "62 PC", valor: 3720.00, data: "02/03/2026" },
    { semana: "Sem 2", gerencia: "Gerência de Produção", area: "Produção - Linha 2", material: "10310155", desc: "Material 3", qtd: "1.916 PC", valor: 114960.00, data: "09/03/2026" },
    { semana: "Sem 3", gerencia: "Gerência de Produção", area: "Produção - Linha 2", material: "10310155", desc: "Material 3", qtd: "2.614 PC", valor: 156840.00, data: "16/03/2026" },
    { semana: "Sem 4", gerencia: "Gerência de Produção", area: "Produção - Linha 2", material: "10310155", desc: "Material 3", qtd: "1.106 PC", valor: 66360.00, data: "23/03/2026" },
    { semana: "Sem 5", gerencia: "Gerência de Produção", area: "Produção - Linha 2", material: "10310155", desc: "Material 3", qtd: "1.215 PC", valor: 72900.00, data: "30/03/2026" },
    ...Array.from({length: 15}, (_, i) => ({
        semana: `Sem ${i % 5 + 1}`,
        gerencia: i % 2 === 0 ? "Gerência de Manutenção" : "Gerência de Logística",
        area: i % 2 === 0 ? "Manutenção Preventiva" : "Expedição",
        material: `202050${i}`,
        desc: `Item Extra ${i + 5}`,
        qtd: `${(i + 1) * 10} UN`,
        valor: (i + 1) * 150.00,
        data: "10/02/2026"
    }))
];

let dadosFiltrados = [...bancoDeDados];
let paginaAtual = 1;
const itensPorPagina = 10;

const tableBody = document.getElementById('tableBody');
const paginationControls = document.getElementById('paginationControls');

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

    // Mapa para converter o texto do Select em número da data
    const mesesMap = { "Jan": "01", "Fev": "02", "Mar": "03" };

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

document.addEventListener('DOMContentLoaded', () => {
    ['searchInput', 'selGerencia', 'selArea', 'selPeriodo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', aplicarFiltros);
    });
    renderTable();
});