# SISTEMA47 — Frontend (Interface Administrativa)

O **SISTEMA47** é uma plataforma inteligente voltada para o controle preditivo de custos de insumos de fábrica e gestão de materiais. Esta interface administrativa foi projetada para oferecer aos gestores uma visualização clara de dados históricos, projeções futuras e um assistente virtual baseado em Inteligência Artificial para suporte à tomada de decisões.

---

## 🛠️ Tecnologias Utilizadas

* **Core:** HTML5, CSS3, JavaScript (ES6+).
* **Visualização de Dados & Predições:** [Chart.js](https://www.chartjs.org/) (Gráficos interativos e plotagem de tendências).
* **Interface & Estilização:** FontAwesome (Ícones) e design responsivo customizado.
* **Integração com IA:** Módulos dedicados para comunicação com agentes de IA (via endpoints do Backend).

---

## 📂 Estrutura de Arquivos Principais

* `dashboard.html` / `dashboard.js`: Tela principal com métricas gerais, gráficos de consumo e integração com inteligência preditiva.
* `listagem.html`: Interface para controle e auditoria dos materiais e insumos de fábrica.
* `chat.css` / `chat.js`: Módulos da interface do **Assistente Virtual** (Agente de IA).
* `relatorio.js`: Script responsável por processar dados de projeções futuras gerados pelos modelos de IA e exibi-los ao usuário.

---

## 🚀 Guia de Implantação e Execução Local

### Pré-requisitos
1. Ter o **VS Code** instalado.
2. Instalar a extensão **Live Server** no VS Code (criada por Ritwick Dey).
3. **Importante:** Certifique-se de que o repositório do backend (**SISTEMA47-Backend**) esteja configurado e rodando simultaneamente na porta `5000` para que as funcionalidades de IA e persistência funcionem.

### Passo a Passo
1. Clone este repositório para sua máquina local.
2. Abra a pasta do projeto no VS Code.
3. Certifique-se de configurar as variáveis de ambiente locais se houver (veja a seção abaixo).
4. Clique com o botão direito sobre o arquivo `dashboard.html` (ou `listagem.html`) e selecione a opção **"Open with Live Server"**.
5. O sistema será aberto automaticamente no seu navegador padrão através do endereço local: `http://127.0.0.1:5502` (ou porta similar atribuída pelo Live Server).

---

## ⚙️ Configurações e Integração com IA (Variáveis de Ambiente)

Para que a interface consiga se comunicar com os agentes de IA e os modelos de linguagem (LLMs), ela consome a API REST exposta pelo backend. 

* **URL Base da API:** `http://localhost:5000`
* **Configuração de Chaves (API Keys):** Por questões de segurança, todas as chaves de API (ex: *OpenAI API Key*, *LangChain tokens*) e prompts de sistema estão centralizados e protegidos no **Backend**. Este frontend não expõe credenciais no lado do cliente.

> 📝 **Nota sobre o Histórico de Prompts:** O mapeamento completo dos prompts de sistema, personas dos agentes e histórico de engenharia de prompts utilizados nas conversas e relatórios preditivos deste sistema pode ser consultado diretamente na documentação oficial localizada no repositório do backend ou no repositório central de prompts do projeto.
