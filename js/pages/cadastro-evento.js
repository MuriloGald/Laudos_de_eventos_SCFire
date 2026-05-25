/**
 * Página: Cadastro de Evento (Wizard)
 */

window.Pages = window.Pages || {};

window.Pages.CadastroEvento = function() {
    const container = document.createElement('div');
    container.className = 'page-container fade-in';
    
    // Verifica se já tem um rascunho de wizard
    let state = window.Store.getEstadoWizard() || {};
    let stepAtual = state.step || 1;
    
    // Função para renderizar a etapa atual
    const renderStep = () => {
        container.innerHTML = '';
        
        // Renderiza Header do Stepper
        const stepperHtml = `
            <div class="stepper">
                <div class="step ${stepAtual >= 1 ? 'active' : ''} ${stepAtual > 1 ? 'completed' : ''}">
                    <div class="step-circle">${stepAtual > 1 ? '<i class="fas fa-check"></i>' : '1'}</div>
                    <span class="step-label">Cliente</span>
                </div>
                <div class="step ${stepAtual >= 2 ? 'active' : ''} ${stepAtual > 2 ? 'completed' : ''}">
                    <div class="step-circle">${stepAtual > 2 ? '<i class="fas fa-check"></i>' : '2'}</div>
                    <span class="step-label">Informações Base</span>
                </div>
                <div class="step ${stepAtual >= 3 ? 'active' : ''} ${stepAtual > 3 ? 'completed' : ''}">
                    <div class="step-circle">${stepAtual > 3 ? '<i class="fas fa-check"></i>' : '3'}</div>
                    <span class="step-label">Questionário</span>
                </div>
                <div class="step ${stepAtual >= 4 ? 'active' : ''}">
                    <div class="step-circle">4</div>
                    <span class="step-label">Revisão e Geração</span>
                </div>
            </div>
        `;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'wizard-content fade-in';
        
        container.innerHTML = `
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2>Novo Laudo de Evento</h2>
                    <p>Siga os passos para emitir os documentos.</p>
                </div>
                <button class="btn btn-secondary" id="btn-cancel-wizard">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
            ${stepperHtml}
        `;
        
        container.appendChild(contentDiv);
        
        // Event listeners globais do container
        setTimeout(() => {
            document.getElementById('btn-cancel-wizard').addEventListener('click', () => {
                if(confirm('Tem certeza? Todos os dados não salvos deste evento serão perdidos.')) {
                    window.Store.limparEstadoWizard();
                    window.Router.navigate('#/');
                }
            });
        }, 0);

        if (stepAtual === 1) renderStep1(contentDiv);
        else if (stepAtual === 2) renderStep2(contentDiv);
        else if (stepAtual === 3) renderStep3(contentDiv);
        else if (stepAtual === 4) renderStep4(contentDiv);
    };
    
    // AVANÇAR E VOLTAR
    const avancarPara = (proximoPasso, novosDados = {}) => {
        state = { ...state, ...novosDados, step: proximoPasso };
        window.Store.salvarEstadoWizard(state);
        stepAtual = proximoPasso;
        renderStep();
        window.scrollTo(0, 0);
    };
    
    // ==========================================
    // STEP 1: Seleção de Cliente
    // ==========================================
    const renderStep1 = (content) => {
        const clientes = window.Store.getClientes();
        
        content.innerHTML = `
            <div class="card form-card">
                <h3 class="mb-3">Selecione o Cliente Responsável</h3>
                
                <div class="form-group mb-4">
                    <label>Buscar Cliente Cadastrado</label>
                    <select id="select-cliente" class="form-control">
                        <option value="">-- Selecione --</option>
                        ${clientes.map(c => `
                            <option value="${c.id}" ${state.cliente_id === c.id ? 'selected' : ''}>
                                ${c.razao_social} (${c.cnpj || c.cpf})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="text-center mb-4">
                    <span style="color: var(--text-muted);">ou</span>
                </div>
                
                <div class="text-center mb-4">
                    <button class="btn btn-secondary" onclick="window.Router.navigate('#/cadastrar-cliente')">
                        <i class="fas fa-plus"></i> Cadastrar Novo Cliente
                    </button>
                </div>
                
                <div class="form-actions">
                    <button id="btn-next-1" class="btn btn-primary" disabled>
                        Avançar <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const select = document.getElementById('select-cliente');
            const btnNext = document.getElementById('btn-next-1');
            
            // Ativa botão se já tiver selecionado
            if (select.value) btnNext.disabled = false;
            
            select.addEventListener('change', (e) => {
                btnNext.disabled = !e.target.value;
            });
            
            btnNext.addEventListener('click', () => {
                const clienteId = select.value;
                const cliente = window.Store.getCliente(clienteId);
                avancarPara(2, { cliente_id: clienteId, cliente: cliente });
            });
        }, 0);
    };
    
    // ==========================================
    // STEP 2: Informações Iniciais (Classificação)
    // ==========================================
    const renderStep2 = (content) => {
        content.innerHTML = `
            <div class="card form-card">
                <h3 class="mb-3">Informações do Evento</h3>
                
                <form id="form-step-2">
                    <div class="form-group mb-3">
                        <label>Nome do Evento</label>
                        <input type="text" name="nome_evento" class="form-control" required value="${state.nome_evento || ''}">
                    </div>
                    
                    <div class="form-group mb-3">
                        <label>Descrição do Evento (Breve resumo)</label>
                        <textarea name="descricao_evento" class="form-control" rows="2" placeholder="Descreva brevemente as atividades do evento...">${state.descricao_evento || ''}</textarea>
                    </div>
                    
                    <div class="form-row mb-3">
                        <div class="form-group" style="flex: 2;">
                            <label>Data de Início</label>
                            <input type="date" name="data_inicio" class="form-control" required value="${state.data_inicio || ''}">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Hora</label>
                            <input type="time" name="hora_inicio" class="form-control" required value="${state.hora_inicio || ''}">
                        </div>
                        <div class="form-group" style="flex: 2;">
                            <label>Data de Término</label>
                            <input type="date" name="data_termino" class="form-control" required value="${state.data_termino || ''}">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Hora</label>
                            <input type="time" name="hora_termino" class="form-control" required value="${state.hora_termino || ''}">
                        </div>
                    </div>
                    
                    <hr class="mb-4 mt-4" style="border: 0; border-top: 1px solid var(--border-color);">
                    
                    <h4 class="mb-3 mt-4" style="color: var(--primary);">Endereço do Evento</h4>
                    <div class="form-group mb-3">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--primary); font-weight: 500;">
                            <input type="checkbox" id="chk-same-address" style="width: auto;"> O evento será no mesmo endereço do cliente
                        </label>
                    </div>
                    
                    <div class="form-row mb-3">
                        <div class="form-group" style="flex: 1;">
                            <label>CEP</label>
                            <input type="text" name="cep_evento" id="cep_evento" class="form-control" value="${state.cep_evento || ''}" placeholder="00000-000" required>
                        </div>
                        <div class="form-group" style="flex: 2;">
                            <label>Logradouro (Rua, Av.)</label>
                            <input type="text" name="logradouro_evento" id="logradouro_evento" class="form-control" value="${state.logradouro_evento || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Número</label>
                            <input type="text" name="numero_evento" id="numero_evento" class="form-control" value="${state.numero_evento || ''}" required>
                        </div>
                    </div>
                    
                    <div class="form-row mb-4">
                        <div class="form-group" style="flex: 2;">
                            <label>Bairro</label>
                            <input type="text" name="bairro_evento" id="bairro_evento" class="form-control" value="${state.bairro_evento || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 2;">
                            <label>Cidade</label>
                            <input type="text" name="cidade_evento" id="cidade_evento" class="form-control" value="${state.cidade_evento || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 2;">
                            <label>Complemento / Ponto de Referência</label>
                            <input type="text" name="complemento_evento" id="complemento_evento" class="form-control" value="${state.complemento_evento || ''}">
                        </div>
                    </div>
                    
                    <h4 class="mb-3 mt-4" style="color: var(--primary);">Quadro de Áreas e Público</h4>
                    <div class="form-row mb-3">
                        <div class="form-group" style="flex: 1;">
                            <label>Público Total Previsto</label>
                            <input type="number" name="publico" class="form-control" value="${state.publico || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Área total (m²)</label>
                            <input type="number" name="area_total" class="form-control" value="${state.area_total || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Instalações permanentes (m²)</label>
                            <input type="number" name="area_permanente" class="form-control" value="${state.area_permanente || ''}" required>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Estruturas provisórias (m²)</label>
                            <input type="number" name="area_provisoria" class="form-control" value="${state.area_provisoria || ''}" required>
                        </div>
                    </div>
                    
                    <h4 class="mb-3 mt-4" style="color: var(--primary);">Classificação dos Ambientes</h4>
                    <p class="mb-4" style="color: var(--text-muted); font-size: 0.9rem;">
                        Preencha as informações abaixo para que o sistema sugira o porte do evento de acordo com a IN 24.
                    </p>
                    
                    <!-- Ar livre sem delimitação -->
                    <div class="question-block">
                        <div class="radio-label mb-2">
                            <input type="checkbox" id="chk_ar_livre_sem" name="arLivreSemDelimitacao" ${state.arLivreSemDelimitacao ? 'checked' : ''}>
                            <strong>Ar livre sem delimitação de área</strong> (Praças, vias públicas)
                        </div>
                    </div>
                    
                    <!-- Ar livre com delimitação -->
                    <div class="question-block">
                        <div class="radio-label mb-2">
                            <input type="checkbox" id="chk_ar_livre_com" name="arLivreComDelimitacao" ${state.arLivreComDelimitacao ? 'checked' : ''}>
                            <strong>Ar livre com delimitação de área</strong>
                        </div>
                        <div id="div_pub_ar_livre" class="form-group mt-2 ${state.arLivreComDelimitacao ? '' : 'hidden'}">
                            <label>Público Previsto (Ar livre):</label>
                            <input type="number" name="publicoArLivre" class="form-control" value="${state.publicoArLivre || ''}">
                        </div>
                    </div>
                    
                    <!-- Coberto aberto -->
                    <div class="question-block">
                        <div class="radio-label mb-2">
                            <input type="checkbox" id="chk_coberto_aberto" name="cobertoAberto" ${state.cobertoAberto ? 'checked' : ''}>
                            <strong>Local coberto e aberto nas laterais</strong> (Tendas, lona)
                        </div>
                        <div id="div_pub_coberto_aberto" class="form-group mt-2 ${state.cobertoAberto ? '' : 'hidden'}">
                            <label>Público Previsto (Coberto e aberto):</label>
                            <input type="number" name="publicoCobertoAberto" class="form-control" value="${state.publicoCobertoAberto || ''}">
                        </div>
                    </div>
                    
                    <!-- Coberto fechado -->
                    <div class="question-block">
                        <div class="radio-label mb-2">
                            <input type="checkbox" id="chk_coberto_fechado" name="cobertoFechado" ${state.cobertoFechado ? 'checked' : ''}>
                            <strong>Local coberto e fechado nas laterais</strong> (Pavilhões, ginásios)
                        </div>
                        <div id="div_pub_coberto_fechado" class="form-group mt-2 ${state.cobertoFechado ? '' : 'hidden'}">
                            <label>Público Previsto (Coberto e fechado):</label>
                            <input type="number" name="publicoCobertoFechado" class="form-control" value="${state.publicoCobertoFechado || ''}">
                        </div>
                    </div>
                    
                    <div class="card mt-4 mb-4" style="background-color: var(--surface); border: 2px dashed var(--primary-light);">
                        <h4 style="text-align: center;">Porte Sugerido</h4>
                        <div id="porte-badge-container" style="text-align: center; margin: 1rem 0;">
                            <span class="badge badge-pequeno" style="font-size: 1.2rem; padding: 0.5rem 1rem;">Selecione as opções</span>
                        </div>
                        
                        <div class="form-group" style="margin-top: 1rem;">
                            <label>Você pode alterar manualmente se desejar:</label>
                            <select name="porteFinal" id="porteFinal" class="form-control">
                                <option value="pequeno" ${state.porteFinal === 'pequeno' ? 'selected' : ''}>Pequeno Porte</option>
                                <option value="medio" ${state.porteFinal === 'medio' ? 'selected' : ''}>Médio Porte</option>
                                <option value="grande" ${state.porteFinal === 'grande' ? 'selected' : ''}>Grande Porte</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="btn-back-2" class="btn btn-secondary">Voltar</button>
                        <button type="submit" class="btn btn-primary">Avançar <i class="fas fa-arrow-right"></i></button>
                    </div>
                </form>
            </div>
        `;
        
        setTimeout(() => {
            document.getElementById('btn-back-2').addEventListener('click', () => avancarPara(1));
            
            const form = document.getElementById('form-step-2');
            
            const chkSameAddress = document.getElementById('chk-same-address');
            if (chkSameAddress) {
                chkSameAddress.addEventListener('change', (e) => {
                    const c = state.cliente || {};
                    if (e.target.checked) {
                        document.getElementById('cep_evento').value = c.cep || '';
                        document.getElementById('logradouro_evento').value = c.logradouro || '';
                        document.getElementById('numero_evento').value = c.numero || '';
                        document.getElementById('bairro_evento').value = c.bairro || '';
                        document.getElementById('cidade_evento').value = c.cidade || '';
                        document.getElementById('complemento_evento').value = c.complemento || '';
                    } else {
                        document.getElementById('cep_evento').value = '';
                        document.getElementById('logradouro_evento').value = '';
                        document.getElementById('numero_evento').value = '';
                        document.getElementById('bairro_evento').value = '';
                        document.getElementById('cidade_evento').value = '';
                        document.getElementById('complemento_evento').value = '';
                    }
                });
            }
            
            // Toggle visibility of publico inputs
            const toggleInput = (chkId, divId) => {
                document.getElementById(chkId).addEventListener('change', (e) => {
                    const div = document.getElementById(divId);
                    const input = div.querySelector('input');
                    if(e.target.checked) {
                        div.classList.remove('hidden');
                        input.setAttribute('required', 'true');
                    } else {
                        div.classList.add('hidden');
                        input.removeAttribute('required');
                        input.value = '';
                    }
                    atualizarPorte();
                });
            };
            
            toggleInput('chk_ar_livre_com', 'div_pub_ar_livre');
            toggleInput('chk_coberto_aberto', 'div_pub_coberto_aberto');
            toggleInput('chk_coberto_fechado', 'div_pub_coberto_fechado');
            
            document.getElementById('chk_ar_livre_sem').addEventListener('change', atualizarPorte);
            
            const inputsPublico = form.querySelectorAll('input[type="number"]');
            inputsPublico.forEach(input => input.addEventListener('input', atualizarPorte));
            
            function atualizarPorte() {
                const formData = new FormData(form);
                const dados = {
                    arLivreSemDelimitacao: formData.get('arLivreSemDelimitacao') === 'on',
                    arLivreComDelimitacao: formData.get('arLivreComDelimitacao') === 'on',
                    publicoArLivre: formData.get('publicoArLivre'),
                    cobertoAberto: formData.get('cobertoAberto') === 'on',
                    publicoCobertoAberto: formData.get('publicoCobertoAberto'),
                    cobertoFechado: formData.get('cobertoFechado') === 'on',
                    publicoCobertoFechado: formData.get('publicoCobertoFechado')
                };
                
                const porte = window.ClassificadorEventos.classificarEvento(dados);
                const porteSelect = document.getElementById('porteFinal');
                porteSelect.value = porte;
                
                const containerBadge = document.getElementById('porte-badge-container');
                if (porte === 'pequeno') {
                    containerBadge.innerHTML = '<span class="badge badge-pequeno" style="font-size: 1.2rem; padding: 0.5rem 1rem;"><i class="fas fa-leaf"></i> Pequeno Porte</span>';
                } else if (porte === 'medio') {
                    containerBadge.innerHTML = '<span class="badge badge-medio" style="font-size: 1.2rem; padding: 0.5rem 1rem;"><i class="fas fa-bolt"></i> Médio Porte</span>';
                } else {
                    containerBadge.innerHTML = '<span class="badge badge-grande" style="font-size: 1.2rem; padding: 0.5rem 1rem;"><i class="fas fa-fire"></i> Grande Porte</span>';
                }
            }
            
            // Run on init to set initial state
            atualizarPorte();
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const novosDados = Object.fromEntries(formData.entries());
                
                // Mapeia checkboxes corretamente (on -> true)
                novosDados.arLivreSemDelimitacao = formData.get('arLivreSemDelimitacao') === 'on';
                novosDados.arLivreComDelimitacao = formData.get('arLivreComDelimitacao') === 'on';
                novosDados.cobertoAberto = formData.get('cobertoAberto') === 'on';
                novosDados.cobertoFechado = formData.get('cobertoFechado') === 'on';
                
                avancarPara(3, novosDados);
            });
        }, 0);
    };
    
    // ==========================================
    // STEP 3: Questionários Específicos
    // ==========================================
    const renderStep3 = (content) => {
        // Redireciona para o formulário específico com base no porte
        const porte = state.porteFinal;
        
        content.innerHTML = `
            <div class="card form-card">
                <h3 class="mb-3">Preenchimento: Evento de ${porte === 'pequeno' ? 'Pequeno' : (porte === 'medio' ? 'Médio' : 'Grande')} Porte</h3>
                <div id="forms-container">
                    <!-- Componente dinâmico -->
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const formsContainer = document.getElementById('forms-container');
            
            if (porte === 'pequeno') {
                if(window.FormsPequeno) formsContainer.appendChild(window.FormsPequeno(state, avancarPara));
                else formsContainer.innerHTML = '<p>Módulo de pequeno porte carregando...</p>';
            } else if (porte === 'medio') {
                if(window.FormsMedio) formsContainer.appendChild(window.FormsMedio(state, avancarPara));
                else formsContainer.innerHTML = '<p>Módulo de médio porte carregando...</p>';
            } else {
                if(window.FormsGrande) formsContainer.appendChild(window.FormsGrande(state, avancarPara));
                else formsContainer.innerHTML = '<p>Módulo de grande porte carregando...</p>';
            }
        }, 0);
    };
    
    // ==========================================
    // STEP 4: Geração
    // ==========================================
    const renderStep4 = (content) => {
        const cliente = state.cliente || {};
        const porte = state.porteFinal || 'Desconhecido';
        
        let respostasHtml = '';
        const respostas = state.respostas_pequeno || state.respostas_medio || state.respostas_grande || {};
        
        // Formatar chaves e valores para exibição amigável
        for (const [key, value] of Object.entries(respostas)) {
            if (key !== 'subStep' && value !== '') {
                let displayVal = value;
                if(value === 'sim') displayVal = '<span style="color: var(--success); font-weight: bold;">Sim</span>';
                if(value === 'nao') displayVal = '<span style="color: var(--accent-red); font-weight: bold;">Não</span>';
                if(value === 'na') displayVal = '<span style="color: var(--text-muted);">Não se aplica</span>';
                if(value === 'manual_auto') displayVal = 'Manual ou automatizado';
                if(value === 'automatizado') displayVal = 'Automatizado (>1000 pessoas)';
                if(value === 'rt1') displayVal = 'Dione Borges';
                if(value === 'rt2') displayVal = 'Paulo Roberto Ramos';
                
                const questionLabel = window.PERGUNTAS_MAP && window.PERGUNTAS_MAP[key] ? window.PERGUNTAS_MAP[key] : key.replace(/_/g, ' ');
                
                respostasHtml += `
                    <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; gap: 1rem; align-items: center;">
                        <span style="font-size: 0.9rem; color: var(--text-muted); flex: 1;">${questionLabel}</span>
                        <span style="font-weight: 600; font-size: 0.95rem; text-align: right; min-width: 120px;">${displayVal}</span>
                    </div>
                `;
            }
        }
        
        content.innerHTML = `
            <div class="card form-card">
                <div class="text-center mb-4">
                    <i class="fas fa-check-circle" style="font-size: 3.5rem; color: var(--success); margin-bottom: 1rem;"></i>
                    <h3 class="mb-2">Pronto para Gerar o Laudo!</h3>
                    <p>Revise os dados abaixo antes de gerar o documento PDF.</p>
                </div>
                
                <div style="background: #f9fafb; padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 2rem;">
                    <h4 style="color: var(--primary); margin-bottom: 1rem; border-bottom: 2px solid var(--primary-light); padding-bottom: 0.5rem;">Resumo do Evento</h4>
                    <p><strong>Evento:</strong> ${state.nome_evento}</p>
                    <p><strong>Cliente Responsável:</strong> ${cliente.razao_social || 'N/A'}</p>
                    <p><strong>Período:</strong> ${state.data_inicio} até ${state.data_termino}</p>
                    <p><strong>Porte Classificado:</strong> <span style="text-transform: capitalize;">${porte}</span></p>
                    
                    <h4 style="color: var(--primary); margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid var(--primary-light); padding-bottom: 0.5rem;">Respostas do Questionário</h4>
                    <div style="max-height: 300px; overflow-y: auto; background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                        ${respostasHtml}
                    </div>
                </div>
                
                <div class="form-actions" style="justify-content: center;">
                    <button id="btn-back-4" class="btn btn-secondary">Voltar e Editar</button>
                    <button id="btn-gerar-pdf" class="btn btn-success"><i class="fas fa-file-pdf"></i> Gerar Documento PDF</button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            document.getElementById('btn-back-4').addEventListener('click', () => {
                if (porte === 'pequeno') avancarPara(3, {});
                else if (porte === 'medio') avancarPara(3, {});
                else avancarPara(3, {});
            });
            
            document.getElementById('btn-gerar-pdf').addEventListener('click', () => {
                try {
                    // Gera o PDF
                    const filename = window.PdfGenerator.gerar(state);
                    
                    // Salva o evento no histórico (Store)
                    // Se state.codigo existir, é edição
                    const codigo = state.codigo || ('EVT-' + new Date().getFullYear() + '-' + Math.floor(Math.random()*10000).toString().padStart(4, '0'));
                    
                    const evento = {
                        ...state,
                        codigo: codigo,
                        data_emissao: state.data_emissao || new Date().toISOString(),
                        arquivo: filename
                    };
                    
                    // Salvar no BD
                    window.Store.salvarEvento(evento);
                    
                    // Limpar rascunho
                    window.Store.limparEstadoWizard();
                    window.Router.navigate('#/consultar-evento');
                } catch(e) {
                    console.error("Erro ao gerar PDF:", e);
                    alert("Ocorreu um erro ao gerar o PDF. Verifique o console.\nDetalhes do erro: " + e.message + "\n\nStack: " + e.stack);
                }
            });
        }, 0);
    };
    
    // Inicia renderizando o passo atual
    renderStep();
    
    return container;
};
