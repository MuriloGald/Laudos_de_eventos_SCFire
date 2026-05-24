/**
 * Questionário: Médio Porte (Anexo C)
 * Possui sub-etapas internas com as perguntas EXATAS do modelo.
 */

window.FormsMedio = function(state, avancarCallback) {
    const container = document.createElement('div');
    container.className = 'fade-in';
    
    // Recupera dados salvos
    let formState = state.respostas_medio || {};
    let subStep = formState.subStep || 1;
    
    const renderQuestion = (name, label, options = window.OPCOES_RESPOSTA) => {
        const val = formState[name] || '';
        const radios = options.map(opt => `
            <label class="radio-label">
                <input type="radio" name="${name}" value="${opt.value}" ${val === opt.value ? 'checked' : ''} required>
                ${opt.label}
            </label>
        `).join('');
        
        return `
            <div class="question-block">
                <div class="question-text">${label}</div>
                <div class="radio-group">
                    ${radios}
                </div>
            </div>
        `;
    };
    
    const renderSubStep = () => {
        container.innerHTML = '';
        
        const form = document.createElement('form');
        form.id = 'form-medio-porte';
        
        const totalSteps = 4;
        let progressHtml = '<div style="display: flex; gap: 4px; margin-bottom: 2rem;">';
        for(let i=1; i<=totalSteps; i++) {
            progressHtml += `<div style="flex: 1; height: 6px; border-radius: 3px; background-color: ${subStep >= i ? 'var(--primary)' : 'var(--border-color)'}"></div>`;
        }
        progressHtml += '</div>';
        
        let contentHtml = '';
        
        if (subStep === 1) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">1/4 - Características Gerais</h4>
                ${renderQuestion('CGMP01', 'O evento será realizado ao ar livre, sem delimitação de área, com a montagem de alguma estrutura (ou GLP) que exceda os limites permitidos para isenção ou eventos de pequeno porte?')}
                ${renderQuestion('CGMP02', 'O evento será realizado ao ar livre, com delimitação de área e previsão de público de 1.001 até 2.500 pessoas?')}
                ${renderQuestion('CGMP03', 'O evento será realizado em local ou estrutura coberto e aberto nas laterais, possuindo ou não delimitação de área por barreira física nas laterais, desde que estas não comprometam a ventilação, com previsão de público de 501 a 1.250 pessoas.')}
                ${renderQuestion('CGMP04', 'O evento será realizado em local ou estrutura coberto e fechado nas laterais com previsão de público de 101 a 500 pessoas.')}
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Estruturas provisórias</h4>
                ${renderQuestion('EPMP01', 'Serão utilizadas tendas ou blocos de tendas, ambos com mais de 100 m² ou sem afastamento?')}
                ${renderQuestion('EPMP02', 'Serão utilizadas arquibancadas provisórias?')}
                ${renderQuestion('EPMP03', 'Serão utilizadas estruturas como tablados, camarotes e estruturas congêneres destinadas ao público, com nível superior a 60 cm de altura do seu piso em relação ao solo?')}
            `;
        } 
        else if (subStep === 2) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">2/4 - Estruturas Provisórias (Cont.)</h4>
                ${renderQuestion('EPMP04', 'Serão utilizados grandes brinquedos mecânicos denominados “atrações”, como os de parques temáticos ou de diversão?')}
                ${renderQuestion('EPMP05', 'Serão utilizadas estruturas tais como pontes, passarelas e similares?')}
                ${renderQuestion('EPMP06', 'Serão utilizadas estruturas metálicas?')}
                ${renderQuestion('EPMP07', 'Serão utilizadas instalações elétricas, englobando iluminação, sonorização, gerador de emergência, dentre outros dispositivos energizados?')}
                ${renderQuestion('EPMP08', 'Serão utilizadas estruturas relacionadas a esportes de aventura?')}
            `;
        }
        else if (subStep === 3) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">3/4 - SMSCI</h4>
                
                <div class="question-block" id="block-gas">
                    <div class="question-text">Haverá uso de GLP?</div>
                    <div class="radio-group mb-2">
                        <label class="radio-label"><input type="radio" name="SMSCIMP01" value="sim" ${formState['SMSCIMP01'] === 'sim' ? 'checked' : ''} required> Sim</label>
                        <label class="radio-label"><input type="radio" name="SMSCIMP01" value="nao" ${formState['SMSCIMP01'] === 'nao' ? 'checked' : ''}> Não</label>
                        <label class="radio-label"><input type="radio" name="SMSCIMP01" value="na" ${formState['SMSCIMP01'] === 'na' ? 'checked' : ''}> Não se aplica</label>
                    </div>
                    <div id="div-gas-qtd" class="form-group mt-3 ${formState['SMSCIMP01'] === 'sim' ? '' : 'hidden'}">
                        <label>Se sim, informe a quantidade (kg):</label>
                        <input type="number" name="GAS" class="form-control" value="${formState['GAS'] || ''}">
                    </div>
                </div>
                
                ${renderQuestion('SMSCIMP02', 'A instalação de gás combustível atende aos requisitos da IN 8?')}
                ${renderQuestion('SMSCIMP03', 'Os recipientes de GLP estarão posicionados em locais comprovadamente sem acesso ao público e protegidos das intempéries?')}
                ${renderQuestion('SMSCIMP04', 'A proteção por extintores atende aos requisitos da IN 6?')}
                ${renderQuestion('SMSCIMP05', 'As saídas de emergência atendem aos requisitos da IN 9?')}
                ${renderQuestion('SMSCIMP06', 'O sistema de iluminação de emergência atende aos requisitos da IN 11?')}
                ${renderQuestion('SMSCIMP07', 'O sistema de sinalização para abandono de local atende aos requisitos da IN 13?')}
                ${renderQuestion('SMSCIMP08', 'Havendo a utilização de materiais de acabamento e revestimento, estes atendem aos requisitos da IN 18 - CMAR?')}
            `;
        }
        else if (subStep === 4) {
            contentHtml = `
                <h4 class="mb-3" style="color: var(--primary);">4/4 - SMSCI (Cont.), Equipamentos e Documentação</h4>
                ${renderQuestion('SMSCIMP09', 'Havendo espetáculo pirotécnico, este atende aos requisitos da IN 27?')}
                ${renderQuestion('SMSCIMP10', 'O grupo motogerador possui o devido isolamento e exaustão de gases da combustão?')}
                ${renderQuestion('SMSCIMP11', 'O dimensionamento dos brigadistas atende aos requisitos da IN 28, estando estes devidamente certificados/credenciados, com previsão de permanecerem durante todo o funcionamento do evento?')}
                ${renderQuestion('SMSCIMP12', 'O acesso de viaturas foi previsto e atende os requisitos da IN 35?')}
                ${renderQuestion('SMSCIMP13', 'Caso sejam necessários outros SMSCI, de acordo com as Tabelas 1 e 2 da IN 24, estes estão previstos e serão executados de acordo com as NSCI?')}
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Equipamentos</h4>
                ${renderQuestion('DEA', 'Sendo o público previsto igual ou superior a 1.500 pessoas, foi previsto desfibrilador externo automático (DEA)?')}
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Documentação</h4>
                ${renderQuestion('DOCMP', 'Os documentos previstos no artigo 34 da IN 24, referentes ao dimensionamento e execução dos SMSCI e de eventuais estruturas montadas no evento, foram emitidos e estão de acordo com as NSCI?')}
                
                <div class="form-group mt-4 mb-4">
                    <label>Observações:</label>
                    <textarea name="OBS" class="form-control" rows="3" placeholder="Insira observações relevantes aqui...">${formState['OBS'] || ''}</textarea>
                </div>
                
                <h4 class="mb-3 mt-4" style="color: var(--primary);">Responsável Técnico (RT)</h4>
                <div class="form-group mb-4">
                    <label>Selecione o RT que assinará o Laudo</label>
                    <select name="rt_selecionado" class="form-control" required>
                        <option value="">-- Selecione --</option>
                        <option value="rt1" ${formState.rt_selecionado === 'rt1' ? 'selected' : ''}>Dione Borges</option>
                        <option value="rt2" ${formState.rt_selecionado === 'rt2' ? 'selected' : ''}>Paulo Roberto Ramos</option>
                    </select>
                </div>
            `;
        }
        
        const actionsHtml = `
            <div class="form-actions mt-4">
                <button type="button" id="btn-back-sub" class="btn btn-secondary">Voltar</button>
                <button type="submit" class="btn btn-primary">${subStep === totalSteps ? 'Revisar e Gerar PDF <i class="fas fa-check"></i>' : 'Próxima <i class="fas fa-arrow-right"></i>'}</button>
            </div>
        `;
        
        form.innerHTML = progressHtml + contentHtml + actionsHtml;
        container.appendChild(form);
        
        // Lógica de Gas UI se estiver no passo 3
        if (subStep === 3) {
            const radiosGas = form.querySelectorAll('input[name="SMSCIMP01"]');
            const divGasQtd = document.getElementById('div-gas-qtd');
            const inputGasQtd = divGasQtd.querySelector('input');
            
            radiosGas.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'sim') {
                        divGasQtd.classList.remove('hidden');
                        inputGasQtd.setAttribute('required', 'true');
                    } else {
                        divGasQtd.classList.add('hidden');
                        inputGasQtd.removeAttribute('required');
                        inputGasQtd.value = '';
                    }
                });
            });
        }
        
        document.getElementById('btn-back-sub').addEventListener('click', () => {
            const formData = new FormData(form);
            formState = { ...formState, ...Object.fromEntries(formData.entries()) };
            
            if (subStep > 1) {
                subStep--;
                renderSubStep();
            } else {
                avancarCallback(2, { respostas_medio: formState });
            }
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            formState = { ...formState, ...Object.fromEntries(formData.entries()) };
            
            if (subStep < totalSteps) {
                subStep++;
                renderSubStep();
            } else {
                avancarCallback(4, { respostas_medio: formState });
            }
        });
    };
    
    setTimeout(renderSubStep, 0);
    
    return container;
};
