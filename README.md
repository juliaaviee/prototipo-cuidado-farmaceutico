# 🏥 Sistema de Cuidado Farmacêutico e Telemonitoramento (SUS)
> **Engenharia de Computação na Comunidade — Avaliação 3 (UnB)**  
> Protótipo de Software de Apoio à Decisão Clínica e Acompanhamento Preventivo para Doenças Crônicas Infecciosas.

---

## 👥 Integrantes — GRUPO 2
* **Isaque Holanda Mourão**
* **Júlia Barroso Vieira**
* **Ladji Ayouba Koné**
* **Maria Clara Gomes da Silva**
* **Maria Eduarda Alves de Souza**
* **Vitor Miguel Souto de Deus**

---

## 📌 O Problema na Comunidade

Nos tratamentos de alto custo do SUS para doenças crônicas infecciosas (como **Hepatite C, Hepatite B, HIV e Tuberculose**), a taxa de não adesão atinge até **50%**. 

Em condições frequentemente assintomáticas (como a Hepatite C na Farmácia Escola do HUB-UnB), os pacientes tendem a interromper o uso dos medicamentos por falta de sintomas imediatos ou por baixo letramento em saúde. Essa interrupção causa:
1. **Desperdício de recursos públicos** com tratamentos de alto custo abandonados.
2. **Agravamento clínico severo** (cirrose, necessidade de transplante hepático ou multirresistência).
3. **Sobrecarga dos farmacêuticos clínicos**, que trabalham de forma manual e reativa sem ferramentas para acompanhar o paciente fora do consultório.

---

## 🚀 A Solução Proposta

O projeto consiste em uma plataforma de **inteligência farmacoterapêutica e telemonitoramento** desenvolvida para integrar o ecossistema SUS-DF/RIDE. A ferramenta é dividida em 3 módulos principais:

### 1. 🩺 Consultório & Assistente RAG (IA Clínica)
* Apoia o farmacêutico na consulta presencial.
* Cruza os relatos do paciente (dados subjetivos) com exames laboratoriais (dados objetivos) utilizando **Inteligência Artificial (Retrieval-Augmented Generation)** pré-carregada com diretrizes oficiais da Anvisa/OMS.
* Avalia a pontuação de **letramento em saúde, escolar e digital** do paciente.

### 2. 📊 Estratificação de Risco & Documentação Automática
* Calcula o **grau de risco de não adesão** ao tratamento (Alto, Médio ou Baixo).
* Gera automaticamente a evolução clínica para o prontuário e cartas de encaminhamento para serviços de apoio (médicos, CAPS e assistência social).

### 3. 📱 Telemonitoramento Preventivo (WhatsApp)
* Dispara mensagens automáticas de checagem com frequência calibrada conforme o nível de risco do paciente, evitando fadiga de alertas.
* Possui **gatilhos de segurança**: caso o paciente reporte sintomas graves ou abandono, a conversa é escalonada imediatamente para o farmacêutico humano (conforme a RDC 657/2022 da Anvisa).

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, Tailwind CSS.
* **Lógica & Interatividade:** JavaScript (Vanilla ES6+).
* **Arquitetura de Dados:** Simulação de motor RAG e estado persistente local (*Single Page Application*).

---

## 💻 Como Executar o Protótipo

### Opção 1: Pelo Navegador (GitHub Pages)
Acesse a demonstração ao vivo diretamente pelo link do projeto no GitHub Pages.

### Opção 2: Execução Local
1. Clone ou baixe os arquivos deste repositório.
2. Abra o arquivo  em qualquer navegador web (Google Chrome, Firefox, Edge). Não é necessário instalar dependências ou configurar servidores backend.

---

## 🎯 Alinhamento com os Objetivos de Desenvolvimento Sustentável (ODS)

* **ODS 3 — Saúde e Bem-Estar:** Redução da mortalidade e agravamento de doenças transmissíveis e melhoria da adesão terapêutica.
* **ODS 9 — Indústria, Inovação e Infraestrutura:** Aplicação de Inteligência Artificial e engenharia de software na saúde pública.
* **ODS 10 — Redução das Desigualdades:** Inclusão de pacientes com baixo letramento escolar e digital no acompanhamento em saúde.
