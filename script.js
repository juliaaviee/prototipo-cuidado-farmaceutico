const PRESETS = {
      hepatitec: {
        id: `hepatitec`,
        name: `Carlos Eduardo M.`,
        age: 54,
        condition: `hepatitec`,
        meds: `Sofosbuvir 400mg + Velpatasvir 100mg (1 comp/dia, 12 semanas)`,
        subjective: `Relata dificuldade para ler a bula e confusão com horários. Refere náuseas leves após o almoço na primeira semana e esquecimento de 2 doses no fim de semana quando consumiu bebida alcoólica. Informa insônia e oscilações de humor (transtorno bipolar sem seguimento regular atual).`,
        objective: `HCV-RNA detectável (1.420.000 UI/mL), Genótipo 1b, Elastografia F2. AST 68 U/L, ALT 84 U/L, Creatinina 0,95 mg/dL (eGFR 86 mL/min). Prontuário indica retirada tardia na farmácia ambulatorial no ciclo anterior.`,
        flags: {
          ram: true,
          irregular: true,
          renal: false,
          caps: true,
          mental: true,
          social: false
        },
        litSchool: `baixo`,
        litHealth: `baixo`,
        litDigital: `moderado`,
        pharmacistName: `Dr. Fernando (Farmácia Escola)`,
        pharmacistCrf: `CRF-DF 04128`
      },
      hepatiteb: {
        id: `hepatiteb`,
        name: `Maria das Graças S.`,
        age: 62,
        condition: `hepatiteb`,
        meds: `Fumarato de Tenofovir Desoproxila (TDF) 300mg (1 comp/dia, uso contínuo)`,
        subjective: `Diz tomar o comprimido todos os dias ao acordar com ajuda da filha. Relata que não sabe ler bem mensagens longas no celular e prefere ouvir áudios curtos no WhatsApp. Sem queixas gástricas ou tontura.`,
        objective: `HBsAg reagente há 8 anos (acompanhamento crônico vitalício). HBV-DNA < 20 UI/mL (indetectável). Exame recente mostra elevação discreta de creatinina sérica para 1,38 mg/dL (eGFR caiu de 68 para 49 mL/min).`,
        flags: {
          ram: false,
          irregular: false,
          renal: true,
          caps: false,
          mental: false,
          social: false
        },
        litSchool: `baixo`,
        litHealth: `moderado`,
        litDigital: `baixo`,
        pharmacistName: `Dr. Fernando (Farmácia Escola)`,
        pharmacistCrf: `CRF-DF 04128`
      },
      hiv: {
        id: `hiv`,
        name: `Rafael T.`,
        age: 31,
        condition: `hiv`,
        meds: `Tenofovir 300mg + Lamivudina 300mg + Dolutegravir 50mg (TARV 1 comp/dia)`,
        subjective: `Trabalha em turno noturno e relata pular doses nos dias em que dorme fora de casa por receio de colegas verem o frasco do medicamento. Queixa-se de cefaleia e insônia nos últimos 10 dias após mudança de turno.`,
        objective: `HIV-1 Carga Viral 320 cópias/mL (previamente indetectável há 6 meses; blips/rebote inicial). LT-CD4+ 510 céls/mm³. Histórico de tuberculose pulmonar tratada com cura há 2 anos.`,
        flags: {
          ram: true,
          irregular: true,
          renal: false,
          caps: false,
          mental: false,
          social: true
        },
        litSchool: `adequado`,
        litHealth: `moderado`,
        litDigital: `adequado`,
        pharmacistName: `Dr. Fernando (Farmácia Escola)`,
        pharmacistCrf: `CRF-DF 04128`
      },
      novo: {
        id: `novo`,
        name: `Paciente em Acolhimento`,
        age: 40,
        condition: `tuberculose`,
        meds: `Esquema Básico RHZE (Rifampicina + Isoniazida + Pirazinamida + Etambutol)`,
        subjective: `Descreva aqui o relato do paciente (sintomas, adesão, contexto social, dúvidas)...`,
        objective: `Insira aqui os dados de exames laboratoriais e histórico do prontuário...`,
        flags: {
          ram: false,
          irregular: false,
          renal: false,
          caps: false,
          mental: false,
          social: false
        },
        litSchool: `moderado`,
        litHealth: `moderado`,
        litDigital: `moderado`,
        pharmacistName: `Dr. Fernando (Farmácia Escola)`,
        pharmacistCrf: `CRF-DF 04128`
      }
    };

    const CONDITION_LABELS = {
      hepatitec: { name: `Hepatite C Crônica (HCV)`, pcdt: `PCDT Hepatite C e Coinfecções (MS)` },
      hepatiteb: { name: `Hepatite B Crônica (HBV)`, pcdt: `PCDT Hepatite B e Coinfecções (MS)` },
      hiv: { name: `Infecção pelo HIV (TARV)`, pcdt: `PCDT Manejo da Infecção pelo HIV em Adultos (MS)` },
      tuberculose: { name: `Tuberculose (TB)`, pcdt: `Manual de Recomendações para Controle da Tuberculose (MS)` },
      hanseniase: { name: `Hanseníase (PQT)`, pcdt: `PCDT Hanseníase (MS)` }
    };

    let appState = {
      activeModule: 1,
      activePreset: `hepatitec`,
      clinical: JSON.parse(JSON.stringify(PRESETS.hepatitec)),
      prms: [],
      validatedPrmIds: [],
      riskScore: 0,
      riskTier: `alto`,
      teleFrequency: 7,
      teleModality: `multimodal`,
      telePlanApproved: false,
      activeDocType: `prontuario`,
      docEdits: {},
      signedDocs: {},
      chat: [],
      cycleDay: 1,
      audioModeActive: true,
      playingAudioId: null,
      escalationActive: false,
      escalationReason: ``
    };

    function clonePreset(key) {
      return JSON.parse(JSON.stringify(PRESETS[key] || PRESETS.hepatitec));
    }

    function computePrmsFromClinical(c) {
      const prms = [];
      const condInfo = CONDITION_LABELS[c.condition] || CONDITION_LABELS.hepatitec;
      const subj = (c.subjective || ``).toLowerCase();
      const obj = (c.objective || ``).toLowerCase();

      if (c.flags.irregular || subj.includes(`esquec`) || subj.includes(`pular`)) {
        prms.push({
          id: `prm-adesao`,
          title: `Risco de Falha Terapêutica por Irregularidade de Doses`,
          category: `Adesão / Efetividade`,
          severity: c.condition === `hepatitec` || c.condition === `hiv` ? `alta` : `moderada`,
          evidence: `Cruzamento Subjetivo × Objetivo: relato de doses omitidas associado a risco de resistência viral ou progressão hepática (${c.condition === 'hepatitec' ? 'prevenção de cirrose e transplante' : 'manutenção da supressão'}).`,
          source: `${condInfo.pcdt} • Adesão e Retenção ao Cuidado`,
          suggestion: `Reorganizar tomada vinculada à rotina diária, pactuar meta de adesão ≥ 95% e incluir lembrete calibrado no telemonitoramento.`
        });
      }

      if (c.flags.ram || subj.includes(`náusea`) || subj.includes(`enjoo`) || subj.includes(`cefaleia`) || subj.includes(`tontura`) || subj.includes(`insônia`)) {
        prms.push({
          id: `prm-ram`,
          title: `Suspeita de Reação Adversa a Medicamento (RAM)`,
          category: `Segurança`,
          severity: `moderada`,
          evidence: `Relato de sintomas compatíveis com eventos adversos iniciais do esquema (${c.meds}). Sem sinais de alarme grave descritos, mas impacta adesão se não manejado.`,
          source: `${condInfo.pcdt} • Farmacovigilância e Manejo de Eventos Adversos`,
          suggestion: `Orientar medidas não farmacológicas (ingestão com alimento leve se aplicável, higiene do sono), monitorar evolução em 7 dias e notificar médico se persistência.`
        });
      }

      if (c.flags.renal || obj.includes(`creatinina`) || obj.includes(`egfr`) || obj.includes(`49 ml`)) {
        prms.push({
          id: `prm-renal`,
          title: `Alteração de Função Renal — Necessidade de Avaliação de Dose`,
          category: `Segurança / Ajuste Posológico`,
          severity: `alta`,
          evidence: `Dado objetivo de laboratório indica redução de taxa de filtração glomerular (eGFR < 50 mL/min ou creatinina elevada). Schemas com Tenofovir (TDF) exigem revisão de intervalo ou troca.`,
          source: `${condInfo.pcdt} • Ajuste em Insuficiência Renal`,
          suggestion: `Emitir Carta ao Médico Assistente solicitando avaliação de função renal e eventual ajuste de intervalo ou substituição por alternativa segura (ex: Entecavir/TAF conforme critério).`
        });
      }

      if (c.flags.caps || subj.includes(`álcool`) || subj.includes(`alcool`) || subj.includes(`bebida`) || subj.includes(`droga`)) {
        prms.push({
          id: `prm-caps`,
          title: `Uso de Álcool / Substâncias Impactando Adesão e Hepatotoxicidade`,
          category: `Segurança / Rede Psicossocial`,
          severity: `alta`,
          evidence: `Uso de álcool potencializa risco de hepatotoxicidade em hepatites virais e provoca omissão de doses nos fins de semana.`,
          source: `Diretriz RAPS / Ministério da Saúde & ${condInfo.pcdt}`,
          suggestion: `Realizar aconselhamento breve sem estigma e gerar Carta de Encaminhamento ao CAPS ad para cuidado compartilhado.`
        });
      }

      if (c.flags.mental || subj.includes(`bipolar`) || subj.includes(`ansiedade`) || subj.includes(`depress`)) {
        prms.push({
          id: `prm-mental`,
          title: `Sofrimento Psíquico / Comorbidade Psiquiátrica Sem Seguimento`,
          category: `Vulnerabilidade Clínica`,
          severity: `alta`,
          evidence: `Alterações de humor e sono comprometem a autogestão da farmacoterapia crônica e exigem suporte interprofissional.`,
          source: `Protocolo de Cuidado Farmacêutico na Atenção Especializada (MS)`,
          suggestion: `Gerar Encaminhamento ao Serviço Social / Psicologia / Psiquiatria para articulação de rede e suporte familiar.`
        });
      }

      if (c.flags.social || subj.includes(`estigma`) || subj.includes(`trabalho`) || subj.includes(`verem`)) {
        prms.push({
          id: `prm-social`,
          title: `Barreira Social e Receio de Estigma no Ambiente de Trabalho`,
          category: `Adesão / Sigilo`,
          severity: `moderada`,
          evidence: `Paciente evita tomar doses em público por medo de exposição do diagnóstico. Risco elevado de falhas em turnos noturnos.`,
          source: `Diretrizes OMS de Aconselhamento Centrado na Pessoa & LGPD`,
          suggestion: `Pactuar porta-comprimidos discreto, ajustar horário para momento privado e reforçar sigilo absoluto nas mensagens de telemonitoramento.`
        });
      }

      if (c.litSchool === `baixo` || c.litHealth === `baixo` || c.litDigital === `baixo`) {
        prms.push({
          id: `prm-letramento`,
          title: `Baixo Letramento em Saúde / Digital — Barreira de Compreensão`,
          category: `Letramento & Acessibilidade`,
          severity: c.litHealth === `baixo` ? `moderada` : `leve`,
          evidence: `Perfil indica necessidade de simplificação textual na receita/orientação e priorização de mensagens de voz (áudio) com linguagem cotidiana.`,
          source: `Literatura de Letramento em Saúde & Telemonitoramento Inclusivo (OMS)`,
          suggestion: `Gerar Orientação ao Paciente em linguagem simples (frases curtas) e configurar bot do WhatsApp em modo Multimodal / Áudio.`
        });
      }

      if (prms.length === 0) {
        prms.push({
          id: `prm-manutencao`,
          title: `Acompanhamento Farmacoterapêutico de Rotina (Sem PRM Crítico)`,
          category: `Monitoramento Preventivo`,
          severity: `leve`,
          evidence: `Dados registrados sem sinais imediatos de reação adversa grave ou interrupção terapêutica.`,
          source: `${condInfo.pcdt}`,
          suggestion: `Manter educação em saúde e telemonitoramento de baixa frequência (30 dias) para prevenir fadiga de alertas.`
        });
      }

      return prms;
    }

    function computeRiskModel(c, prms) {
      let prmPts = 0;
      prms.forEach(p => {
        if (p.id === `prm-manutencao`) return;
        if (p.severity === `alta`) prmPts += 16;
        else if (p.severity === `moderada`) prmPts += 10;
        else prmPts += 5;
      });
      prmPts = Math.min(40, prmPts);

      let litPts = 0;
      if (c.litHealth === `baixo`) litPts += 14;
      else if (c.litHealth === `moderado`) litPts += 7;
      if (c.litSchool === `baixo`) litPts += 6;
      else if (c.litSchool === `moderado`) litPts += 3;
      if (c.litDigital === `baixo`) litPts += 5;
      else if (c.litDigital === `moderado`) litPts += 2;
      litPts = Math.min(25, litPts);

      let psychoPts = 0;
      if (c.flags.caps) psychoPts += 10;
      if (c.flags.mental) psychoPts += 10;
      if (c.flags.social) psychoPts += 8;
      psychoPts = Math.min(25, psychoPts);

      let regimenPts = 4;
      if (c.condition === `tuberculose` || c.condition === `hiv`) regimenPts = 8;
      if (c.condition === `hepatitec`) regimenPts = 10;

      const total = Math.min(98, Math.max(8, prmPts + litPts + psychoPts + regimenPts));
      let tier = `baixo`;
      let recFreq = 30;
      if (total >= 65) {
        tier = `alto`;
        recFreq = 7;
      } else if (total >= 35) {
        tier = `moderado`;
        recFreq = 15;
      }

      const recModality = (c.litDigital === `baixo` || c.litSchool === `baixo`) ? `multimodal` : `texto`;

      return {
        total,
        tier,
        recFreq,
        recModality,
        breakdown: [
          { label: `Severidade dos PRMs clínicos`, pts: prmPts, max: 40, color: `var(--error)` },
          { label: `Barreiras de letramento (saúde/digital)`, pts: litPts, max: 25, color: `var(--data-3)` },
          { label: `Gatilhos psicossociais (CAPS/Mental/Estigma)`, pts: psychoPts, max: 25, color: `var(--data-4)` },
          { label: `Complexidade e janela do esquema SUS`, pts: regimenPts, max: 10, color: `var(--data-1)` }
        ]
      };
    }

    function generateDocText(type, state) {
      const c = state.clinical;
      const cond = CONDITION_LABELS[c.condition] ? CONDITION_LABELS[c.condition].name : c.condition;
      const dateStr = `13/11/2026`;
      const tierText = state.riskTier === `alto` ? `ALTO RISCO` : state.riskTier === `moderado` ? `RISCO MODERADO` : `BAIXO RISCO`;
      const validatedList = state.prms.filter(p => state.validatedPrmIds.includes(p.id));
      const activePrms = validatedList.length > 0 ? validatedList : state.prms;
      const prmSummary = activePrms.map((p, i) => `${i + 1}. ${p.title} [Severidade: ${p.severity.toUpperCase()}] — ${p.suggestion}`).join(`\n`);

      if (type === `prontuario`) {
        return `EVOLUÇÃO FARMACÊUTICA CLÍNICA (MODELO SOAP) — SUS / FARMÁCIA ESCOLA\nData: ${dateStr} | Paciente: ${c.name} (${c.age} anos)\nCondição Monitorada: ${cond}\nEsquema Atual: ${c.meds}\n\n[S — SUBJETIVO]\n${c.subjective}\n\n[O — OBJETIVO]\n${c.objective}\nAvaliação de Letramento: Escolar (${c.litSchool}), Saúde (${c.litHealth}), Digital (${c.litDigital}).\n\n[A — AVALIAÇÃO FARMACOTERAPÊUTICA (ASSISTIDA POR RAG)]\nEstratificação de Risco de Não Adesão: ${tierText} (${state.riskScore}/100 pontos).\nProblemas Identificados e Validados:\n${prmSummary}\n\n[P — PLANO DE CUIDADO E TELEMONITORAMENTO]\n- Plano de telemonitoramento via canal discreto (WhatsApp) calibrado para ciclo de ${state.teleFrequency} dias (${state.teleModality}), evitando fadiga de mensagens e respeitando sigilo diagnóstico (LGPD).\n- Validação profissional em conformidade com a RDC 657/2022 (Anvisa).\n\nResponsável: ${c.pharmacistName} — ${c.pharmacistCrf}`;
      }

      if (type === `orientacao`) {
        const simple = (c.litHealth === `baixo` || c.litSchool === `baixo`);
        if (simple) {
          return `GUIA SIMPLES DE CUIDADO COM SEU REMÉDIO\nPara: ${c.name} | Data: ${dateStr}\n\n1. COMO TOMAR TODO DIA:\nTome o seu remédio (${c.meds}) sempre no mesmo horário, junto com um copo de água.\nNão pare de tomar por conta própria, mesmo se estiver se sentindo bem.\n\n2. O QUE FAZER SE ESQUECER:\nSe lembrar no mesmo dia, tome assim que lembrar. Se já estiver perto da dose do dia seguinte, pule a esquecida e tome só a normal. Nunca tome dois juntos.\n\n3. SINAIS PARA AVISAR A FARMÁCIA:\nSe sentir enjoo forte, tontura, dor na barriga ou qualquer mal-estar diferente, responda nossa mensagem no WhatsApp. O farmacêutico vai falar direto com você.\n\n4. NOSSAS MENSAGENS NO WHATSAPP:\nVamos mandar uma mensagem ou áudio curto a cada ${state.teleFrequency} dias para saber como você está. Ninguém verá o nome do seu tratamento na mensagem.\n\nCom carinho, ${c.pharmacistName} (${c.pharmacistCrf})`;
        }
        return `PLANO DE ORIENTAÇÃO FARMACOTERAPÊUTICA AO PACIENTE\nPaciente: ${c.name} | Data: ${dateStr}\nTerapia: ${c.meds}\n\n1. Posologia e Adesão:\nMantenha a tomada regular diária para garantir eficácia clínica e evitar resistência terapêutica. Utilize alarmes ou associação a hábitos fixos.\n\n2. Manejo de Esquecimento e Eventos Adversos:\nEm caso de reação adversa persistente, não suspenda o esquema sem orientação. Acione o canal de telemonitoramento para avaliação farmacêutica imediata.\n\n3. Telemonitoramento Calibrado:\nAcompanhamento programado a cada ${state.teleFrequency} dias via WhatsApp institucional protegido por sigilo (LGPD).\n\n${c.pharmacistName} — ${c.pharmacistCrf}`;
      }

      if (type === `medico`) {
        return `CARTA DE INTERVENÇÃO FARMACÊUTICA AO MÉDICO ASSISTENTE\nData: ${dateStr} | Unidade: Farmácia Escola — Rede SUS\nPaciente: ${c.name}, ${c.age} anos | Condição: ${cond}\nTerapia em uso: ${c.meds}\n\nPrezado(a) Dr(a).,\n\nDurante consulta farmacêutica clínica estruturada, identificamos os seguintes pontos que requerem avaliação médica compartilhada:\n\nDados Objetivos Relevantes:\n${c.objective}\n\nAchados Clínicos e Sugestões Farmacoterapêuticas:\n${prmSummary}\n\nSolicitamos gentilmente avaliação clínica para eventual ajuste posológico, solicitação de exames complementares ou manejo sintomático, visando segurança e conclusão do tratamento com cura/controle.\n\nColocamo-nos à disposição para discussão conjunta do caso.\nAtenciosamente,\n${c.pharmacistName} — ${c.pharmacistCrf}`;
      }

      if (type === `caps`) {
        const triggerText = c.flags.caps
          ? `Identificou-se relato de uso de álcool/outras substâncias associado a falhas de adesão nos fins de semana e risco aumentado de toxicidade orgânica.`
          : `Encaminhamento preventivo para avaliação de suporte em saúde mental e álcool/drogas caso haja demanda identificada durante o seguimento.`;
        return `FICHA DE ENCAMINHAMENTO INTERSETORIAL — CAPS / RAPS\nData: ${dateStr} | Origem: Cuidado Farmacêutico Clínico (SUS)\nPaciente: ${c.name}, ${c.age} anos\n\nAo Centro de Atenção Psicossocial (CAPS),\n\nEncaminhamos o(a) usuário(a) acima para acolhimento e cuidado compartilhado. O(a) paciente encontra-se em tratamento farmacoterapêutico para ${cond} (${c.meds}).\n\nMotivo do Encaminhamento:\n${triggerText}\n\nObjetivo da Articulação:\nFortalecer estratégias de redução de danos e suporte psicossocial contínuo para viabilizar a manutenção segura da terapia farmacológica e a prevenção de complicações clínicas.\n\nFarmacêutico(a) Responsável: ${c.pharmacistName} — ${c.pharmacistCrf}`;
      }

      return `ENCAMINHAMENTO AO SERVIÇO SOCIAL / PSICOLOGIA / PSIQUIATRIA\nData: ${dateStr} | Origem: Consultório Farmacêutico (SUS)\nPaciente: ${c.name}, ${c.age} anos\n\nÀ Equipe Multiprofissional (Serviço Social / Saúde Mental),\n\nSolicitamos acolhimento prioritário para o(a) usuário(a) em seguimento farmacoterapêutico para ${cond}.\n\nContexto Identificado na Consulta:\n${c.flags.mental ? `- Relato de sofrimento psíquico / comorbidade psiquiátrica sem acompanhamento regular no momento.\n` : ``}${c.flags.social ? `- Barreiras sociais e receio de estigma impactando a tomada regular da medicação.\n` : ``}- Estratificação de risco de não adesão: ${tierText} (${state.riskScore}/100 pts).\n- Letramento em saúde avaliado como ${c.litHealth}.\n\nApoio solicitado: escuta qualificada, vinculação à rede de proteção social/saúde mental e articulação familiar, quando autorizada pelo paciente.\n\nAtenciosamente,\n${c.pharmacistName} — ${c.pharmacistCrf}`;
    }

    function buildInitialChat(state) {
      const firstName = (state.clinical.name || `Paciente`).split(` `)[0];
      const useAudio = state.teleModality !== `texto`;
      return [
        {
          id: `sys-1`,
          sender: `system`,
          text: `Canal iniciado após validação do plano pelo farmacêutico (${state.clinical.pharmacistName || 'Farmácia Escola'}). Ciclo calibrado: ${state.teleFrequency} dias. Sigilo diagnóstico LGPD ativo.`,
          time: `Dia 1 • 09:00`
        },
        {
          id: `bot-1`,
          sender: `bot`,
          isAudio: useAudio,
          audioDuration: `0:24`,
          text: `Olá, ${firstName}! Aqui é da equipe de cuidado da Farmácia Escola. Passando para saber como você tem se sentido nesta semana com a sua rotina de saúde. Está conseguindo seguir tudo tranquilamente ou surgiu alguma dúvida?`,
          time: `Dia 1 • 09:01`
        }
      ];
    }

    function readInputsIntoState() {
      const c = appState.clinical;
      const getVal = id => { const el = document.getElementById(id); return el ? el.value : ``; };
      const getChk = id => { const el = document.getElementById(id); return el ? el.checked : false; };

      c.name = getVal(`pt-name`) || `Paciente`;
      c.age = parseInt(getVal(`pt-age`), 10) || 40;
      c.condition = getVal(`pt-condition`) || `hepatitec`;
      c.meds = getVal(`pt-meds`) || ``;
      c.subjective = getVal(`pt-subjective`) || ``;
      c.objective = getVal(`pt-objective`) || ``;
      c.flags = {
        ram: getChk(`flag-ram`),
        irregular: getChk(`flag-irregular`),
        renal: getChk(`flag-renal`),
        caps: getChk(`flag-caps`),
        mental: getChk(`flag-mental`),
        social: getChk(`flag-social`)
      };
      c.litSchool = getVal(`lit-school`) || `moderado`;
      c.litHealth = getVal(`lit-health`) || `moderado`;
      c.litDigital = getVal(`lit-digital`) || `moderado`;
    }

    function writeStateToInputs() {
      const c = appState.clinical;
      const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
      const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };

      setVal(`pt-name`, c.name);
      setVal(`pt-age`, c.age);
      setVal(`pt-condition`, c.condition);
      setVal(`pt-meds`, c.meds);
      setVal(`pt-subjective`, c.subjective);
      setVal(`pt-objective`, c.objective);
      setChk(`flag-ram`, c.flags.ram);
      setChk(`flag-irregular`, c.flags.irregular);
      setChk(`flag-renal`, c.flags.renal);
      setChk(`flag-caps`, c.flags.caps);
      setChk(`flag-mental`, c.flags.mental);
      setChk(`flag-social`, c.flags.social);
      setVal(`lit-school`, c.litSchool);
      setVal(`lit-health`, c.litHealth);
      setVal(`lit-digital`, c.litDigital);
      setVal(`pharmacist-name`, c.pharmacistName);
      setVal(`pharmacist-crf`, c.pharmacistCrf);
    }

    function runRagAnalysis(showFeedback) {
      appState.prms = computePrmsFromClinical(appState.clinical);
      const validSet = new Set(appState.validatedPrmIds);
      appState.validatedPrmIds = appState.prms.map(p => p.id).filter(id => validSet.has(id));

      const risk = computeRiskModel(appState.clinical, appState.prms);
      appState.riskScore = risk.total;
      appState.riskTier = risk.tier;
      if (!appState.telePlanApproved) {
        appState.teleFrequency = risk.recFreq;
        appState.teleModality = risk.recModality;
      }

      renderAll();

      if (showFeedback) {
        const fb = document.getElementById(`rag-run-feedback`);
        if (fb) {
          fb.textContent = `Análise RAG concluída: ${appState.prms.length} ponto(s) cruzado(s) com o banco científico.`;
          setTimeout(() => { if (fb) fb.textContent = ``; }, 3500);
        }
      }
      persistAppState();
    }

    function handleClinicalChange() {
      readInputsIntoState();
      appState.telePlanApproved = false;
      appState.docEdits = {};
      appState.signedDocs = {};
      runRagAnalysis(false);
    }

    function togglePrmValidation(prmId) {
      const idx = appState.validatedPrmIds.indexOf(prmId);
      if (idx >= 0) {
        appState.validatedPrmIds.splice(idx, 1);
      } else {
        appState.validatedPrmIds.push(prmId);
      }
      appState.docEdits = {};
      renderAll();
      persistAppState();
    }

    function validateAllPrms() {
      appState.validatedPrmIds = appState.prms.map(p => p.id);
      appState.docEdits = {};
      renderAll();
      persistAppState();
    }

    function switchModule(num) {
      appState.activeModule = num;
      [1, 2, 3].forEach(n => {
        const sec = document.getElementById(`module-${n}`);
        const tab = document.getElementById(`tab-btn-${n}`);
        if (sec) sec.classList.toggle(`active`, n === num);
        if (tab) tab.classList.toggle(`active`, n === num);
      });
      renderAll();
      persistAppState();
    }

    function loadPreset(key) {
      appState.activePreset = key;
      appState.clinical = clonePreset(key);
      appState.prms = computePrmsFromClinical(appState.clinical);
      appState.validatedPrmIds = appState.prms.slice(0, 2).map(p => p.id);
      const risk = computeRiskModel(appState.clinical, appState.prms);
      appState.riskScore = risk.total;
      appState.riskTier = risk.tier;
      appState.teleFrequency = risk.recFreq;
      appState.teleModality = risk.recModality;
      appState.telePlanApproved = true;
      appState.docEdits = {};
      appState.signedDocs = {};
      appState.cycleDay = 1;
      appState.escalationActive = false;
      appState.escalationReason = ``;
      appState.audioModeActive = (risk.recModality !== `texto`);
      appState.chat = buildInitialChat(appState);

      writeStateToInputs();
      renderAll();
      persistAppState();
    }

    function resetPrototype(btn) {
      if (btn && btn.dataset.armed !== `true`) {
        btn.dataset.armed = `true`;
        btn.textContent = `Confirmar restauração`;
        setTimeout(() => {
          if (btn && btn.dataset.armed === `true`) {
            btn.dataset.armed = `false`;
            btn.textContent = `Restaurar Caso Padrão`;
          }
        }, 3200);
        return;
      }
      if (btn) {
        btn.dataset.armed = `false`;
        btn.textContent = `Restaurar Caso Padrão`;
      }
      appState.activeModule = 1;
      loadPreset(`hepatitec`);
    }

    function updateTelePlanFromControl() {
      const freqEl = document.getElementById(`tele-frequency`);
      const modEl = document.getElementById(`tele-modality`);
      if (freqEl) appState.teleFrequency = parseInt(freqEl.value, 10) || 7;
      if (modEl) appState.teleModality = modEl.value || `multimodal`;
      appState.telePlanApproved = false;
      appState.audioModeActive = (appState.teleModality !== `texto`);
      renderAll();
      persistAppState();
    }

    function approveTelePlan() {
      appState.telePlanApproved = true;
      appState.chat = buildInitialChat(appState);
      appState.cycleDay = 1;
      appState.escalationActive = false;
      const fb = document.getElementById(`tele-plan-feedback`);
      if (fb) {
        fb.textContent = `Plano validado! Bot configurado para ciclo de ${appState.teleFrequency} dias (${appState.teleModality}).`;
        setTimeout(() => { if (fb) fb.textContent = ``; }, 3500);
      }
      renderAll();
      persistAppState();
    }

    function selectDocumentType(docType) {
      appState.activeDocType = docType;
      renderDocuments();
      persistAppState();
    }

    function handlePharmacistEdit() {
      const nEl = document.getElementById(`pharmacist-name`);
      const cEl = document.getElementById(`pharmacist-crf`);
      if (nEl) appState.clinical.pharmacistName = nEl.value;
      if (cEl) appState.clinical.pharmacistCrf = cEl.value;
      persistAppState();
    }

    function handleDocManualEdit() {
      const area = document.getElementById(`doc-content-area`);
      if (!area) return;
      appState.docEdits[appState.activeDocType] = area.value;
      appState.signedDocs[appState.activeDocType] = false;
      renderDocumentValidationChip();
      persistAppState();
    }

    function regenerateCurrentDocument() {
      delete appState.docEdits[appState.activeDocType];
      appState.signedDocs[appState.activeDocType] = false;
      renderDocuments();
      const fb = document.getElementById(`doc-feedback`);
      if (fb) {
        fb.textContent = `Documento atualizado com os dados clínicos e validações mais recentes.`;
        setTimeout(() => { if (fb) fb.textContent = ``; }, 3000);
      }
      persistAppState();
    }

    function signCurrentDocument() {
      const area = document.getElementById(`doc-content-area`);
      if (area) appState.docEdits[appState.activeDocType] = area.value;
      appState.signedDocs[appState.activeDocType] = true;
      renderDocumentValidationChip();
      const fb = document.getElementById(`doc-feedback`);
      if (fb) {
        fb.textContent = `Documento validado e assinado por ${appState.clinical.pharmacistName} (${appState.clinical.pharmacistCrf}).`;
        setTimeout(() => { if (fb) fb.textContent = ``; }, 3500);
      }
      persistAppState();
    }

    function copyCurrentDocument() {
      const area = document.getElementById(`doc-content-area`);
      if (!area) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(area.value).catch(() => {});
      }
      const fb = document.getElementById(`doc-feedback`);
      if (fb) {
        fb.textContent = `Texto copiado para a área de transferência.`;
        setTimeout(() => { if (fb) fb.textContent = ``; }, 2500);
      }
    }

    function exportCurrentDocument() {
      const area = document.getElementById(`doc-content-area`);
      if (!area) return;
      const fname = `${appState.activeDocType}_${(appState.clinical.name || 'paciente').toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;
      if (window.notebookAppApi && typeof window.notebookAppApi.triggerFileDownload === `function`) {
        window.notebookAppApi.triggerFileDownload({
          content: area.value,
          contentType: `text/plain`,
          encoding: `UTF-8`,
          filename: fname
        });
      }
      const fb = document.getElementById(`doc-feedback`);
      if (fb) {
        fb.textContent = `Exportação iniciada (${fname}).`;
        setTimeout(() => { if (fb) fb.textContent = ``; }, 2500);
      }
    }

    /* WhatsApp Simulation */
    function simulateNextCycle() {
      appState.cycleDay += appState.teleFrequency;
      const firstName = (appState.clinical.name || `Paciente`).split(` `)[0];
      const useAudio = appState.audioModeActive;
      const messagesByCycle = [
        `Olá, ${firstName}! Tudo bem? Faz ${appState.teleFrequency} dias desde o nosso último contato. Como tem sido o uso diário da sua medicação nesta semana?`,
        `Oi, ${firstName}! Passando no nosso acompanhamento programado (Dia ${appState.cycleDay}). Você sentiu algum desconforto ou precisou faltar algum dia de tomada?`,
        `Olá, ${firstName}! Estamos acompanhando seu progresso. Lembre-se de que concluir todo o ciclo é essencial para sua saúde. Precisa agendar retirada ou tirar alguma dúvida?`
      ];
      const idx = Math.floor((appState.cycleDay / appState.teleFrequency)) % messagesByCycle.length;
      appState.chat.push({
        id: `sys-${Date.now()}`,
        sender: `system`,
        text: `Disparo automático calibrado — Dia ${appState.cycleDay} (Intervalo de ${appState.teleFrequency} dias).`,
        time: `Dia ${appState.cycleDay} • 09:00`
      });
      appState.chat.push({
        id: `bot-${Date.now() + 1}`,
        sender: `bot`,
        isAudio: useAudio,
        audioDuration: `0:19`,
        text: messagesByCycle[idx],
        time: `Dia ${appState.cycleDay} • 09:01`
      });
      renderChat();
      persistAppState();
    }

    function toggleAudioView() {
      appState.audioModeActive = !appState.audioModeActive;
      appState.teleModality = appState.audioModeActive ? `multimodal` : `texto`;
      renderChat();
      renderSummaryKpis();
      persistAppState();
    }

    function togglePlayAudio(msgId) {
      appState.playingAudioId = (appState.playingAudioId === msgId) ? null : msgId;
      renderChat();
    }

    function triggerQuickPatientReply(type) {
      const map = {
        ok: `Estou tomando certinho todos os dias, sem problemas.`,
        esqueci: `Esqueci de tomar a dose de ontem à noite, o que eu faço?`,
        ram: `Estou com muita náusea e tontura forte depois do remédio.`,
        abandono: `Não quero mais tomar isso, estou pensando em parar.`
      };
      processPatientMessage(map[type] || map.ok);
    }

    function handleWaKeydown(e) {
      if (e.key === `Enter`) {
        e.preventDefault();
        sendPatientMessage();
      }
    }

    function sendPatientMessage() {
      const input = document.getElementById(`wa-patient-input`);
      if (!input) return;
      const txt = input.value.trim();
      if (!txt) return;
      input.value = ``;
      processPatientMessage(txt);
    }

    function processPatientMessage(text) {
      const nowTime = `Dia ${appState.cycleDay} • 14:12`;
      appState.chat.push({
        id: `pt-${Date.now()}`,
        sender: `patient`,
        text: text,
        time: nowTime
      });

      const lower = text.toLowerCase();
      const sensitiveKeywords = [`náusea`, `nausea`, `enjoo`, `tontura`, `dor`, `vômito`, `vomito`, `alergia`, `febre`, `mal`, `parar`, `desistir`, `não quero`, `nao quero`, `reação`, `reacao`, `sangramento`, `mancha`];
      const isSensitive = sensitiveKeywords.some(kw => lower.includes(kw));

      if (isSensitive) {
        const isAbandon = lower.includes(`parar`) || lower.includes(`desistir`) || lower.includes(`não quero`) || lower.includes(`nao quero`);
        appState.escalationActive = true;
        appState.escalationReason = isAbandon
          ? `Risco iminente de abandono de tratamento detectado no relato do paciente.`
          : `Relato de possível Reação Adversa a Medicamento (RAM) / sintoma clínico sensível.`;

        appState.chat.push({
          id: `bot-lock-${Date.now() + 1}`,
          sender: `bot`,
          isAudio: appState.audioModeActive,
          audioDuration: `0:16`,
          text: `Recebi uma informação muito importante sua e não quero te passar nada sem certeza. Já chamei nosso farmacêutico clínico agora mesmo para conversar diretamente com você por aqui.`,
          time: `Dia ${appState.cycleDay} • 14:12`
        });
        appState.chat.push({
          id: `sys-lock-${Date.now() + 2}`,
          sender: `system`,
          text: `TRAVA DE SEGURANÇA ACIONADA (RDC 657/2022) — Bot pausado. Aguardando intervenção humana.`,
          time: `Dia ${appState.cycleDay} • 14:12`
        });

        const replyBox = document.getElementById(`pharmacist-chat-reply`);
        if (replyBox) {
          replyBox.value = isAbandon
            ? `Olá! Aqui é o ${appState.clinical.pharmacistName}. Vi que está difícil continuar agora. Não suspenda ainda — vamos conversar hoje para ajustar o que estiver te incomodando e buscar a melhor solução juntos.`
            : `Olá! Aqui é o ${appState.clinical.pharmacistName}. Vi seu relato sobre esse desconforto após a dose. Vamos avaliar a intensidade juntos agora e, se necessário, já alinho com seu médico para proteger seu tratamento.`;
        }
      } else if (lower.includes(`esquec`) || lower.includes(`atras`)) {
        appState.chat.push({
          id: `bot-ok-${Date.now() + 1}`,
          sender: `bot`,
          isAudio: appState.audioModeActive,
          audioDuration: `0:22`,
          text: `Orientação validada: se lembrou no mesmo dia, tome a dose assim que lembrar. Se já estiver perto do horário da dose de hoje, pule a de ontem e tome apenas a de hoje (nunca tome duas juntas). Se esquecer mais de 2 dias seguidos, me avise para chamar o farmacêutico.`,
          time: `Dia ${appState.cycleDay} • 14:13`
        });
      } else {
        appState.chat.push({
          id: `bot-ok-${Date.now() + 1}`,
          sender: `bot`,
          isAudio: appState.audioModeActive,
          audioDuration: `0:14`,
          text: `Que ótima notícia! Registrei sua adesão positiva no sistema. Seu próximo contato programado acontecerá em ${appState.teleFrequency} dias. Seguimos juntos no seu cuidado.`,
          time: `Dia ${appState.cycleDay} • 14:13`
        });
      }

      renderChat();
      renderSupervisionBox();
      persistAppState();
    }

    function sendPharmacistIntervention() {
      const box = document.getElementById(`pharmacist-chat-reply`);
      if (!box) return;
      const msg = box.value.trim();
      if (!msg) return;

      appState.chat.push({
        id: `pharm-${Date.now()}`,
        sender: `pharmacist`,
        senderLabel: appState.clinical.pharmacistName || `Farmacêutico Clínico`,
        text: msg,
        time: `Dia ${appState.cycleDay} • 14:15`
      });
      appState.escalationActive = false;
      appState.escalationReason = ``;
      box.value = ``;

      renderChat();
      renderSupervisionBox();
      persistAppState();
    }

    /* Renderers */
    function renderAll() {
      renderPresetButtons();
      renderSummaryKpis();
      renderRagList();
      renderRiskSection();
      renderDocuments();
      renderChat();
      renderSupervisionBox();
      renderCadenceTimeline();
      if (window.lucide && typeof window.lucide.createIcons === `function`) {
        window.lucide.createIcons();
      }
    }

    function renderPresetButtons() {
      [`hepatitec`, `hepatiteb`, `hiv`, `novo`].forEach(key => {
        const btn = document.getElementById(`preset-btn-${key}`);
        if (btn) btn.classList.toggle(`active`, appState.activePreset === key);
      });
    }

    function renderSummaryKpis() {
      const prmCountEl = document.getElementById(`kpi-prm-count`);
      const prmCapEl = document.getElementById(`kpi-prm-caption`);
      const prmCard = document.getElementById(`kpi-card-prm`);
      const highCount = appState.prms.filter(p => p.severity === `alta`).length;

      if (prmCountEl) prmCountEl.textContent = `${appState.prms.length} ponto(s)`;
      if (prmCapEl) {
        prmCapEl.textContent = highCount > 0 ? `${highCount} de severidade alta` : `Sem severidade alta`;
        prmCapEl.className = `kpi-caption ${highCount > 0 ? 'alert' : 'ok'}`;
      }
      if (prmCard) prmCard.dataset.status = highCount > 0 ? `alert` : `ok`;

      const riskScoreEl = document.getElementById(`kpi-risk-score`);
      const riskTierEl = document.getElementById(`kpi-risk-tier`);
      const riskCard = document.getElementById(`kpi-card-risk`);
      const tierLabel = appState.riskTier === `alto` ? `Alto Risco` : appState.riskTier === `moderado` ? `Risco Moderado` : `Baixo Risco`;
      const tierStatus = appState.riskTier === `alto` ? `alert` : appState.riskTier === `moderado` ? `watch` : `ok`;

      if (riskScoreEl) riskScoreEl.textContent = `${appState.riskScore} / 100`;
      if (riskTierEl) {
        riskTierEl.textContent = tierLabel;
        riskTierEl.className = `kpi-caption ${tierStatus}`;
      }
      if (riskCard) riskCard.dataset.status = tierStatus;

      const freqDaysEl = document.getElementById(`kpi-freq-days`);
      const freqModeEl = document.getElementById(`kpi-freq-mode`);
      if (freqDaysEl) freqDaysEl.textContent = `A cada ${appState.teleFrequency} dias`;
      if (freqModeEl) {
        freqModeEl.textContent = appState.teleModality === `multimodal`
          ? `Multimodal (Texto + Voz)`
          : appState.teleModality === `audio` ? `Áudio Prioritário` : `Texto Simplificado`;
      }

      const humanValEl = document.getElementById(`kpi-human-status`);
      const humanCapEl = document.getElementById(`kpi-human-caption`);
      const humanCard = document.getElementById(`kpi-card-human`);
      const totalPrms = appState.prms.length;
      const valPrms = appState.validatedPrmIds.length;
      if (humanValEl) humanValEl.textContent = `${valPrms} / ${totalPrms} validados`;
      if (humanCapEl) {
        humanCapEl.textContent = valPrms === totalPrms && totalPrms > 0
          ? `Condutas validadas pelo farmacêutico`
          : `Validação humana pendente`;
        humanCapEl.className = `kpi-caption ${valPrms === totalPrms ? 'ok' : 'watch'}`;
      }
      if (humanCard) humanCard.dataset.status = valPrms === totalPrms ? `ok` : `watch`;

      const tabBadge2 = document.getElementById(`tab-badge-2`);
      if (tabBadge2) {
        tabBadge2.textContent = tierLabel;
        tabBadge2.dataset.status = tierStatus;
      }
      const tabBadge3 = document.getElementById(`tab-badge-3`);
      if (tabBadge3) {
        tabBadge3.textContent = appState.escalationActive ? `Alerta Ativo` : `${appState.teleFrequency} dias`;
        tabBadge3.dataset.status = appState.escalationActive ? `alert` : `ok`;
      }
    }

    function renderRagList() {
      const container = document.getElementById(`rag-results-container`);
      if (!container) return;

      const condInfo = CONDITION_LABELS[appState.clinical.condition] || CONDITION_LABELS.hepatitec;
      const kbChip = document.getElementById(`rag-kb-chip`);
      if (kbChip) kbChip.textContent = condInfo.pcdt.split(`(`)[0].trim();

      container.innerHTML = appState.prms.map(p => {
        const isValid = appState.validatedPrmIds.includes(p.id);
        const sevStatus = p.severity === `alta` ? `alert` : p.severity === `moderada` ? `watch` : `info`;
        const sevLabel = p.severity === `alta` ? `Severidade Alta` : p.severity === `moderada` ? `Severidade Moderada` : `Severidade Leve`;

        return `
          <article class="prm-card ${isValid ? 'validated' : ''}" data-severity="${p.severity}">
            <div class="prm-top">
              <div style="display: grid; gap: var(--space-xs);">
                <div class="prm-meta">
                  <span class="chip" data-status="${sevStatus}">${sevLabel}</span>
                  <span class="chip" data-status="neutral">${p.category}</span>
                  ${isValid ? '<span class="chip" data-status="ok">Validado pelo Farmacêutico</span>' : ''}
                </div>
                <h3>${p.title}</h3>
              </div>
              <button type="button" class="btn btn-sm ${isValid ? 'btn-ok' : 'btn-primary'}" onclick="togglePrmValidation('${p.id}')">
                ${isValid ? 'Validado (Desfazer)' : 'Validar Conduta'}
              </button>
            </div>
            <p style="margin: 0; font-size: 0.9rem;"><strong>Cruzamento Clínico:</strong> ${p.evidence}</p>
            <p style="margin: 0; font-size: 0.9rem;"><strong>Conduta Sugerida:</strong> ${p.suggestion}</p>
            <div class="rag-source-box">
              <strong>Fonte RAG (Embedding):</strong> ${p.source}
            </div>
          </article>
        `;
      }).join(``);

      const gateText = document.getElementById(`validation-gate-text`);
      if (gateText) {
        gateText.textContent = `${appState.validatedPrmIds.length} de ${appState.prms.length} sugestão(ões) validada(s) pelo profissional.`;
      }
    }

    function renderRiskSection() {
      const risk = computeRiskModel(appState.clinical, appState.prms);
      const scoreBox = document.getElementById(`risk-score-box`);
      const scoreDisp = document.getElementById(`risk-score-display`);
      const tierLbl = document.getElementById(`risk-tier-label`);
      const tierChip = document.getElementById(`risk-tier-chip`);
      const rationaleEl = document.getElementById(`risk-clinical-rationale`);

      const tierNames = {
        baixo: `Baixo Risco de Não Adesão`,
        moderado: `Risco Moderado de Não Adesão`,
        alto: `Alto Risco de Não Adesão`
      };
      const statusMap = { baixo: `ok`, moderado: `watch`, alto: `alert` };

      if (scoreBox) scoreBox.dataset.tier = risk.tier;
      if (scoreDisp) scoreDisp.textContent = `${risk.total} / 100`;
      if (tierLbl) tierLbl.textContent = tierNames[risk.tier];
      if (tierChip) {
        tierChip.textContent = risk.tier === `alto` ? `Alto Risco` : risk.tier === `moderado` ? `Risco Moderado` : `Baixo Risco`;
        tierChip.dataset.status = statusMap[risk.tier];
      }
      if (rationaleEl) {
        rationaleEl.textContent = `Periodicidade recomendada pela estratificação: a cada ${risk.recFreq} dias (letramento em saúde: ${appState.clinical.litHealth}).`;
      }

      const freqSel = document.getElementById(`tele-frequency`);
      const modSel = document.getElementById(`tele-modality`);
      if (freqSel) freqSel.value = String(appState.teleFrequency);
      if (modSel) modSel.value = appState.teleModality;

      /* Target Reference-Range SVG */
      const gaugeEl = document.getElementById(`risk-gauge-svg`);
      if (gaugeEl) {
        const markerX = 20 + (risk.total / 100) * 560;
        const markerColor = risk.tier === `alto` ? `var(--error)` : risk.tier === `moderado` ? `var(--data-3)` : `var(--tertiary)`;
        gaugeEl.innerHTML = `
          <svg viewBox="0 0 600 84" width="100%" height="84" role="img" aria-label="Medidor de risco com faixa de segurança verde de 0 a 34 pontos; valor atual ${risk.total} pontos">
            <rect x="20" y="22" width="196" height="24" rx="4" fill="var(--tertiary)" fill-opacity="0.16"></rect>
            <rect x="216" y="22" width="168" height="24" fill="var(--data-3)" fill-opacity="0.18"></rect>
            <rect x="384" y="22" width="196" height="24" rx="4" fill="var(--error)" fill-opacity="0.16"></rect>
            <line x1="216" y1="16" x2="216" y2="52" stroke="var(--outline)" stroke-dasharray="3 3" stroke-width="1.5"></line>
            <line x1="384" y1="16" x2="384" y2="52" stroke="var(--outline)" stroke-dasharray="3 3" stroke-width="1.5"></line>
            <text x="118" y="14" text-anchor="middle" font-family="var(--font-label)" font-size="11" font-weight="600" fill="var(--secondary)">Faixa Segura (0–34)</text>
            <text x="300" y="14" text-anchor="middle" font-family="var(--font-label)" font-size="11" font-weight="600" fill="var(--on-surface-variant)">Moderado (35–64)</text>
            <text x="482" y="14" text-anchor="middle" font-family="var(--font-label)" font-size="11" font-weight="600" fill="var(--error)">Alto Risco (65–100)</text>
            <line x1="20" y1="34" x2="${markerX}" y2="34" stroke="${markerColor}" stroke-width="4" stroke-linecap="round"></line>
            <circle cx="${markerX}" cy="34" r="9" fill="${markerColor}" stroke="var(--background)" stroke-width="2.5"></circle>
            <text x="${markerX}" y="70" text-anchor="middle" font-family="var(--font-headline)" font-size="13" font-weight="800" fill="var(--on-surface)">${risk.total} pts</text>
          </svg>
        `;
      }

      const barsEl = document.getElementById(`risk-factors-bars`);
      if (barsEl) {
        barsEl.innerHTML = risk.breakdown.map(b => {
          const pct = Math.round((b.pts / b.max) * 100);
          return `
            <div class="factor-row">
              <div class="factor-label-row">
                <span>${b.label}</span>
                <span class="tabular">${b.pts} / ${b.max} pts</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${pct}%; background: ${b.color};"></div>
              </div>
            </div>
          `;
        }).join(``);
      }
    }

    function renderDocuments() {
      const types = [`prontuario`, `orientacao`, `medico`, `caps`, `social`];
      types.forEach(t => {
        const btn = document.getElementById(`doc-btn-${t}`);
        if (btn) btn.classList.toggle(`active`, appState.activeDocType === t);
      });

      const capsBtn = document.getElementById(`doc-btn-caps`);
      if (capsBtn) {
        capsBtn.textContent = appState.clinical.flags.caps
          ? `Encaminhamento CAPS (Gatilho Ativo)`
          : `Encaminhamento CAPS`;
      }
      const socialBtn = document.getElementById(`doc-btn-social`);
      if (socialBtn) {
        socialBtn.textContent = (appState.clinical.flags.mental || appState.clinical.flags.social)
          ? `Serviço Social / Psico (Gatilho Ativo)`
          : `Serviço Social / Psicologia`;
      }

      const area = document.getElementById(`doc-content-area`);
      if (area) {
        const content = appState.docEdits[appState.activeDocType] !== undefined
          ? appState.docEdits[appState.activeDocType]
          : generateDocText(appState.activeDocType, appState);
        area.value = content;
      }
      renderDocumentValidationChip();
    }

    function renderDocumentValidationChip() {
      const chip = document.getElementById(`doc-validation-chip`);
      if (!chip) return;
      const isSigned = !!appState.signedDocs[appState.activeDocType];
      chip.textContent = isSigned ? `Validado e Assinado` : `Aguardando Assinatura`;
      chip.dataset.status = isSigned ? `ok` : `watch`;
    }

    function renderChat() {
      const log = document.getElementById(`wa-chat-log`);
      const cadBanner = document.getElementById(`wa-cadence-banner`);
      const modBanner = document.getElementById(`wa-modality-banner`);
      const stepLbl = document.getElementById(`cycle-step-label`);
      const statusLine = document.getElementById(`wa-status-line`);

      if (cadBanner) cadBanner.textContent = `Frequência: A cada ${appState.teleFrequency} dias`;
      if (modBanner) modBanner.textContent = appState.audioModeActive ? `Modo: Áudio + Texto` : `Modo: Texto Simples`;
      if (stepLbl) stepLbl.textContent = `+${appState.teleFrequency} dias`;
      if (statusLine) {
        statusLine.textContent = appState.escalationActive
          ? `Bot Pausado • Farmacêutico Chamado`
          : `Bot Supervisionado • Online`;
      }

      if (!log) return;
      log.innerHTML = appState.chat.map(m => {
        if (m.sender === `system`) {
          return `<div class="wa-bubble system">${m.text}</div>`;
        }
        const cls = m.sender === `patient` ? `patient` : m.sender === `pharmacist` ? `pharmacist` : `bot`;
        const senderTag = m.sender === `pharmacist`
          ? `<span class="wa-sender">Intervenção Direta • ${m.senderLabel || 'Farmacêutico'}</span>`
          : m.sender === `bot`
            ? `<span class="wa-sender">Assistente Validado</span>`
            : ``;

        let bodyHtml = `<span>${m.text}</span>`;
        if (m.isAudio && m.sender === `bot`) {
          const isPlaying = appState.playingAudioId === m.id;
          bodyHtml = `
            <div class="wa-audio-box">
              <div class="wa-audio-row">
                <button type="button" class="btn btn-sm ${isPlaying ? 'btn-primary' : 'btn-secondary'}" onclick="togglePlayAudio('${m.id}')">
                  ${isPlaying ? 'Pausar Áudio' : 'Ouvir Áudio'} (${m.audioDuration || '0:18'})
                </button>
                <svg class="wa-wave" viewBox="0 0 120 22" aria-hidden="true">
                  <rect x="2" y="7" width="4" height="8" rx="2" fill="${isPlaying ? 'var(--primary)' : 'var(--outline)'}"></rect>
                  <rect x="10" y="3" width="4" height="16" rx="2" fill="${isPlaying ? 'var(--primary)' : 'var(--outline)'}"></rect>
                  <rect x="18" y="6" width="4" height="10" rx="2" fill="${isPlaying ? 'var(--primary)' : 'var(--outline)'}"></rect>
                  <rect x="26" y="2" width="4" height="18" rx="2" fill="${isPlaying ? 'var(--primary)' : 'var(--outline)'}"></rect>
                  <rect x="34" y="8" width="4" height="6" rx="2" fill="var(--outline)"></rect>
                  <rect x="42" y="4" width="4" height="14" rx="2" fill="var(--outline)"></rect>
                  <rect x="50" y="6" width="4" height="10" rx="2" fill="var(--outline)"></rect>
                  <rect x="58" y="3" width="4" height="16" rx="2" fill="var(--outline)"></rect>
                  <rect x="66" y="7" width="4" height="8" rx="2" fill="var(--outline)"></rect>
                  <rect x="74" y="5" width="4" height="12" rx="2" fill="var(--outline)"></rect>
                  <rect x="82" y="8" width="4" height="6" rx="2" fill="var(--outline)"></rect>
                  <rect x="90" y="4" width="4" height="14" rx="2" fill="var(--outline)"></rect>
                </svg>
              </div>
              <div style="font-size: 0.84rem; color: var(--on-surface);">
                <strong>Transcrição acessível:</strong> ${m.text}
              </div>
            </div>
          `;
        }

        return `
          <div class="wa-bubble ${cls}">
            ${senderTag}
            ${bodyHtml}
            <span class="wa-time">${m.time}</span>
          </div>
        `;
      }).join(``);

      log.scrollTop = log.scrollHeight;
    }

    function renderSupervisionBox() {
      const chip = document.getElementById(`bot-safety-chip`);
      const box = document.getElementById(`escalation-box`);
      const replyPanel = document.getElementById(`pharmacist-reply-panel`);

      if (appState.escalationActive) {
        if (chip) {
          chip.textContent = `Intervenção Humana Obrigatória`;
          chip.dataset.status = `alert`;
        }
        if (box) {
          box.dataset.status = `alert`;
          box.innerHTML = `
            <strong>TRAVA DE SEGURANÇA ATIVADA — BOT PAUSADO</strong>
            <span>${appState.escalationReason} Por diretriz ética e normativa (RDC 657/2022), o assistente automatizado não responde condutas clínicas sensíveis. Assuma a conversa abaixo.</span>
          `;
        }
        if (replyPanel) replyPanel.style.display = `grid`;
      } else {
        if (chip) {
          chip.textContent = `Monitoramento Normal`;
          chip.dataset.status = `ok`;
        }
        if (box) {
          box.dataset.status = `ok`;
          box.innerHTML = `
            <strong>Sistema em Cadência Programada</strong>
            <span>O chatbot envia apenas mensagens previamente validadas pelo farmacêutico e omite o diagnóstico do paciente (sigilo LGPD). Relatos de reação adversa ou abandono acionam alerta imediato.</span>
          `;
        }
        if (replyPanel) replyPanel.style.display = `none`;
      }
    }

    function renderCadenceTimeline() {
      const el = document.getElementById(`cadence-svg-container`);
      const sumChip = document.getElementById(`cadence-summary-chip`);
      const freq = appState.teleFrequency || 7;
      const monthlyCount = freq === 7 ? 4 : freq === 15 ? 2 : 1;

      if (sumChip) sumChip.textContent = `${monthlyCount} contato(s) / mês`;
      if (!el) return;

      const points = [];
      for (let d = 1; d <= 30; d += freq) {
        points.push(d);
      }

      const dailyDots = [];
      for (let d = 1; d <= 30; d++) {
        const x = 40 + ((d - 1) / 29) * 520;
        dailyDots.push(`<circle cx="${x.toFixed(1)}" cy="42" r="3.5" fill="var(--data-context)"></circle>`);
      }

      const calibratedDots = points.map(d => {
        const x = 40 + ((d - 1) / 29) * 520;
        return `
          <circle cx="${x.toFixed(1)}" cy="96" r="7" fill="var(--primary)" stroke="var(--background)" stroke-width="2"></circle>
          <text x="${x.toFixed(1)}" y="122" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--on-surface)">D${d}</text>
        `;
      }).join(``);

      el.innerHTML = `
        <svg viewBox="0 0 600 140" width="100%" height="140" role="img" aria-label="Comparativo entre envio diário com 30 mensagens e cadência calibrada com ${monthlyCount} envios no mês">
          <rect x="30" y="76" width="540" height="38" rx="6" fill="var(--tertiary)" fill-opacity="0.12"></rect>
          <text x="40" y="24" font-family="var(--font-label)" font-size="11" font-weight="600" fill="var(--on-surface-variant)">Modelo Diário (30 alertas/mês — Alto risco de fadiga e bloqueio)</text>
          ${dailyDots.join(``)}
          <text x="40" y="70" font-family="var(--font-label)" font-size="11" font-weight="600" fill="var(--secondary)">Cadência Calibrada Atual (${monthlyCount} envio(s) / mês — Zona ideal de engajamento)</text>
          <line x1="40" y1="96" x2="560" y2="96" stroke="var(--outline-variant)" stroke-width="2"></line>
          ${calibratedDots}
        </svg>
      `;
    }

    async function persistAppState() {
      if (window.notebookAppApi && typeof window.notebookAppApi.setAppState === `function`) {
        try {
          await window.notebookAppApi.setAppState(appState);
        } catch (err) {
          /* Silent fallback outside host */
        }
      }
    }

    async function initApp() {
      let restored = null;
      if (window.notebookAppApi && typeof window.notebookAppApi.getAppState === `function`) {
        try {
          restored = await window.notebookAppApi.getAppState();
        } catch (err) {
          restored = null;
        }
      }

      if (restored && restored.clinical) {
        appState = Object.assign({}, appState, restored);
        writeStateToInputs();
        switchModule(appState.activeModule || 1);
      } else {
        loadPreset(`hepatitec`);
      }

      if (window.notebookAppApi && typeof window.notebookAppApi.notifyAppReady === `function`) {
        window.notebookAppApi.notifyAppReady();
      }
    }

    document.addEventListener(`DOMContentLoaded`, initApp);